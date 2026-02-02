import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager } from './utils/test-data';

describe('Tokens', () => {
  let client: ScalekitClient;
  let testOrg: string;
  let testTokenId: string | null;

  beforeEach(async () => {
    // Use global client
    client = global.client;

    // Create test organization for each test
    testOrg = await TestOrganizationManager.createTestOrganization(client);
    testTokenId = null;
  });

  afterEach(async () => {
    // Clean up test token if it exists
    if (testTokenId) {
      try {
        await client.token.invalidateToken(testTokenId);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
    // Clean up test organization
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  describe('createToken', () => {
    it('should create a token for an organization', async () => {
      const response = await client.token.createToken(testOrg, {
        description: 'Test API Token'
      });

      expect(response).toBeDefined();
      expect(response.token).toBeDefined();
      expect(response.tokenId).toBeDefined();
      expect(response.tokenId.startsWith('apit_')).toBe(true);

      testTokenId = response.tokenId;
    });

    it('should create a token with custom claims', async () => {
      const customClaims = {
        env: 'test',
        scope: 'read'
      };

      const response = await client.token.createToken(testOrg, {
        customClaims,
        description: 'Token with custom claims'
      });

      expect(response).toBeDefined();
      expect(response.token).toBeDefined();
      expect(response.tokenInfo).toBeDefined();

      testTokenId = response.tokenId;
    });
  });

  describe('validateToken', () => {
    it('should validate a token by opaque string', async () => {
      // First create a token
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token to validate'
      });
      testTokenId = createResponse.tokenId;
      const opaqueToken = createResponse.token;

      // Validate the token
      const response = await client.token.validateToken(opaqueToken);

      expect(response).toBeDefined();
      expect(response.tokenInfo).toBeDefined();
      expect(response.tokenInfo?.organizationId).toBe(testOrg);
    });

    it('should validate a token by token_id', async () => {
      // First create a token
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token to validate by ID'
      });
      testTokenId = createResponse.tokenId;

      // Validate using token_id
      const response = await client.token.validateToken(testTokenId);

      expect(response).toBeDefined();
      expect(response.tokenInfo).toBeDefined();
    });
  });

  describe('listTokens', () => {
    it('should list tokens for an organization', async () => {
      // Create a token first
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token for list test'
      });
      testTokenId = createResponse.tokenId;

      // List tokens
      const response = await client.token.listTokens(testOrg, {
        pageSize: 10
      });

      expect(response).toBeDefined();
      expect(response.tokens).toBeDefined();
      expect(Array.isArray(response.tokens)).toBe(true);
      expect(response.tokens.length).toBeGreaterThan(0);
      expect(response.totalCount).toBeGreaterThan(0);
    });

    it('should handle pagination', async () => {
      // Create multiple tokens
      for (let i = 0; i < 3; i++) {
        await client.token.createToken(testOrg, {
          description: `Token ${i} for pagination test`
        });
      }

      // List with small page size
      const firstPage = await client.token.listTokens(testOrg, {
        pageSize: 2
      });

      expect(firstPage).toBeDefined();
      expect(firstPage.tokens.length).toBeLessThanOrEqual(2);
    });
  });

  describe('invalidateToken', () => {
    it('should invalidate a token', async () => {
      // Create a token
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token to invalidate'
      });
      const tokenId = createResponse.tokenId;

      // Invalidate the token
      await client.token.invalidateToken(tokenId);

      // Token should not be in the list anymore
      const listResponse = await client.token.listTokens(testOrg);
      const tokenIds = listResponse.tokens.map(t => t.tokenId);
      expect(tokenIds).not.toContain(tokenId);

      // Set to null since already invalidated
      testTokenId = null;
    });

    it('should be idempotent (succeed even if already invalidated)', async () => {
      // Create a token
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token for idempotent test'
      });
      const tokenId = createResponse.tokenId;

      // Invalidate twice - should not throw
      await client.token.invalidateToken(tokenId);
      await client.token.invalidateToken(tokenId);

      // Set to null since already invalidated
      testTokenId = null;
    });
  });
});
