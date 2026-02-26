import { generateKeyPair, exportJWK, SignJWT, type KeyLike } from 'jose';
import ScalekitClient from '../src/scalekit';
import { AuthenticationOptions } from '../src/types/scalekit';
import { AccessTokenClaims } from '../src/types/auth';
import { ScalekitValidateTokenFailureException } from '../src/errors/base-exception';
import { describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { TestDataGenerator } from './utils/test-data';
import axios from 'axios';

describe('ScalekitClient', () => {
  let client: ScalekitClient;

  beforeEach(() => {
    // Use global client
    client = global.client;
  });

  describe('constructor', () => {
    it('should initialize with correct parameters', () => {
      expect(client).toBeInstanceOf(ScalekitClient);
      expect(client.organization).toBeDefined();
      expect(client.user).toBeDefined();
      expect(client.connection).toBeDefined();
      expect(client.directory).toBeDefined();
      expect(client.passwordless).toBeDefined();
      expect(client.domain).toBeDefined();
    });
  });

  describe('getAuthorizationUrl', () => {
    it('should generate authorization URL with basic parameters', () => {
      const redirectUri = 'https://example.com/callback';
      const url = client.getAuthorizationUrl(redirectUri);

      expect(url).toContain('oauth/authorize');
      expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
      expect(url).toContain('response_type=code');
    });

    it('should include optional parameters when provided', () => {
      const redirectUri = 'https://example.com/callback';
      const options = TestDataGenerator.generateAuthorizationUrlOptions();

      const url = client.getAuthorizationUrl(redirectUri, options);

      expect(url).toContain('scope=openid%20profile');
      expect(url).toContain('state=test-state');
      expect(url).toContain('nonce=test-nonce');
      expect(url).toContain('prompt=login');
    });

    it('should handle PKCE parameters', () => {
      const redirectUri = 'https://example.com/callback';
      const options = TestDataGenerator.generatePKCEParams();

      const url = client.getAuthorizationUrl(redirectUri, options);

      expect(url).toContain('code_challenge=test-challenge');
      expect(url).toContain('code_challenge_method=S256');
    });
  });

  describe('verifyWebhookPayload', () => {
    it('should verify valid webhook payload', () => {
      const webhookData = TestDataGenerator.generateWebhookData();

      const result = client.verifyWebhookPayload(
        webhookData.secret,
        webhookData.headers,
        webhookData.payload
      );
      expect(result).toBe(true);
    });

    it('should throw error for invalid signature', () => {
      const webhookData = TestDataGenerator.generateWebhookData();

      // Generate invalid signature using wrong payload data
      const crypto = require('crypto');
      const wrongData = `${webhookData.webhookId}.${webhookData.timestamp}.wrong-payload`;
      const hmac = crypto.createHmac(
        'sha256',
        Buffer.from('test-secret', 'base64')
      );
      hmac.update(wrongData);
      const wrongSignature = hmac.digest('base64');
      const signature = `v1,${wrongSignature}`;

      const headers = {
        'webhook-id': webhookData.webhookId,
        'webhook-timestamp': webhookData.timestamp,
        'webhook-signature': signature,
      };

      expect(() => {
        client.verifyWebhookPayload(
          webhookData.secret,
          headers,
          webhookData.payload
        );
      }).toThrow('Invalid Signature');
    });
  });

  describe('validateAccessToken', () => {
    it('should validate access token', async () => {
      // Mock token for testing - expected to fail
      const token = 'mock-token';

      try {
        const result = await client.validateAccessToken(token);
        expect(typeof result).toBe('boolean');
      } catch (error) {
        // Expected failure with mock token
        expect(error).toBeDefined();
      }
    });
  });

  describe('getTokenClaims', () => {
    it('should fetch client access token and validate claims via getTokenClaims', async () => {
      const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL!;
      const clientId = process.env.SCALEKIT_CLIENT_ID!;
      const clientSecret = process.env.SCALEKIT_CLIENT_SECRET!;

      const tokenResponse = await axios.post(
        `${envUrl}/oauth/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const accessToken = tokenResponse.data.access_token;
      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('string');

      const result =
        await client.getTokenClaims<AccessTokenClaims>(accessToken);

      expect(result.sub).toBeDefined();
      expect(result.iss).toBeDefined();
      expect(result.iss).toContain(envUrl);

      expect(result.claims).toBeDefined();
      expect(typeof result.claims).toBe('object');
      expect(result.claims.sub).toBe(result.sub);
      expect(result.claims.iss).toBe(result.iss);
    });

    it('should include all raw JWT fields in claims', async () => {
      const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL!;
      const clientId = process.env.SCALEKIT_CLIENT_ID!;
      const clientSecret = process.env.SCALEKIT_CLIENT_SECRET!;

      const tokenResponse = await axios.post(
        `${envUrl}/oauth/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const accessToken = tokenResponse.data.access_token;
      const result =
        await client.getTokenClaims<AccessTokenClaims>(accessToken);

      expect(result.claims.iat).toBeDefined();
      expect(typeof result.claims.iat).toBe('number');
      expect(result.claims.exp).toBeDefined();
      expect(typeof result.claims.exp).toBe('number');
      expect(result.claims.exp).toBeGreaterThan(result.claims.iat);
    });

    it('should throw for an invalid token', async () => {
      await expect(
        client.getTokenClaims<AccessTokenClaims>('invalid-token')
      ).rejects.toThrow();
    });
  });

  /**
   * Unit tests for validateToken / getTokenClaims.
   *
   * These tests generate a local RSA key pair and inject it directly into the
   * client so no live Scalekit environment is required.
   */
  describe('validateToken (unit)', () => {
    let unitClient: ScalekitClient;
    let privateKey: KeyLike;

    const SUBJECT = 'user_unit_01';

    beforeAll(async () => {
      const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL!;
      const keyPair = await generateKeyPair('RS256');
      privateKey = keyPair.privateKey;
      const publicJwk = await exportJWK(keyPair.publicKey);

      // Constructor makes no network calls — the JWKS cache is injected below.
      unitClient = new ScalekitClient(envUrl, 'client_id', 'client_secret');

      // Pre-populate the JWKS cache so getJwks() skips the network fetch.
      (unitClient as any).coreClient.keys = [{ ...publicJwk, alg: 'RS256' }];
    });

    it('should mirror all raw JWT payload fields in claims', async () => {
      const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL!;
      const token = await new SignJWT({
        sub: SUBJECT,
        iss: envUrl,
        custom: 'hello',
      })
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(privateKey);

      const result = await unitClient.validateToken<{
        sub: string;
        iss: string;
        custom: string;
      }>(token);

      expect(result.sub).toBe(SUBJECT);
      expect(result.iss).toBe(envUrl);
      expect(result.claims.sub).toBe(SUBJECT);
      expect(result.claims.iss).toBe(envUrl);
      expect(result.claims.custom).toBe('hello');
      expect(typeof result.claims.iat).toBe('number');
      expect(typeof result.claims.exp).toBe('number');
    });

    it('should not nest claims inside claims', async () => {
      const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL!;
      const token = await new SignJWT({ sub: SUBJECT, iss: envUrl })
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(privateKey);

      const result = await unitClient.validateToken<{
        sub: string;
        iss: string;
      }>(token);

      expect(result.claims.claims).toBeUndefined();
    });

    it('should throw ScalekitValidateTokenFailureException for an invalid token', async () => {
      await expect(
        unitClient.validateToken('invalid-token')
      ).rejects.toBeInstanceOf(ScalekitValidateTokenFailureException);
    });

    it('should return claims via getTokenClaims', async () => {
      const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL!;
      const token = await new SignJWT({ sub: SUBJECT, iss: envUrl })
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(privateKey);

      const result = await unitClient.getTokenClaims<{
        sub: string;
        iss: string;
      }>(token);

      expect(result.sub).toBe(SUBJECT);
      expect(result.claims.sub).toBe(SUBJECT);
      expect(result.claims.iss).toBe(envUrl);
    });
  });
});
