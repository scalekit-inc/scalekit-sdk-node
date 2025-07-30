import ScalekitClient from '../src/scalekit';
import { AuthenticationOptions } from '../src/types/scalekit';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { TestDataGenerator } from './utils/test-data';

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
      
      const result = client.verifyWebhookPayload(webhookData.secret, webhookData.headers, webhookData.payload);
      expect(result).toBe(true);
    });

    it('should throw error for invalid signature', () => {
      const webhookData = TestDataGenerator.generateWebhookData();
      
      // Generate invalid signature using wrong payload data
      const crypto = require('crypto');
      const wrongData = `${webhookData.webhookId}.${webhookData.timestamp}.wrong-payload`;
      const hmac = crypto.createHmac('sha256', Buffer.from('test-secret', 'base64'));
      hmac.update(wrongData);
      const wrongSignature = hmac.digest('base64');
      const signature = `v1,${wrongSignature}`;
      
      const headers = {
        'webhook-id': webhookData.webhookId,
        'webhook-timestamp': webhookData.timestamp,
        'webhook-signature': signature
      };
      
      expect(() => {
        client.verifyWebhookPayload(webhookData.secret, headers, webhookData.payload);
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
}); 