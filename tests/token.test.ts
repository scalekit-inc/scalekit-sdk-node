import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager, TestUserManager } from './utils/test-data';

describe('Tokens', () => {
  let client: ScalekitClient;
  let testOrg: string;
  let testTokenId: string | null;

  beforeEach(async () => {
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

    it('should create a user-scoped token', async () => {
      // Create a user with active membership (sendInvitationEmail=false)
      const testUser = await TestUserManager.createTestUser(client, testOrg, {
        sendInvitationEmail: false,
      });

      const response = await client.token.createToken(testOrg, {
        userId: testUser.userId,
        description: 'User scoped token',
      });

      expect(response).toBeDefined();
      expect(response.token).toBeDefined();
      expect(response.tokenId).toBeDefined();
      expect(response.tokenId.startsWith('apit_')).toBe(true);

      testTokenId = response.tokenId;
    });
  });

  describe('validateToken', () => {
    it('should validate a token by opaque string', async () => {
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token to validate'
      });
      testTokenId = createResponse.tokenId;
      const opaqueToken = createResponse.token;

      const response = await client.token.validateToken(opaqueToken);

      expect(response).toBeDefined();
      expect(response.tokenInfo).toBeDefined();
      expect(response.tokenInfo?.organizationId).toBe(testOrg);
    });

    it('should validate a token by token_id', async () => {
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token to validate by ID'
      });
      testTokenId = createResponse.tokenId;

      const response = await client.token.validateToken(testTokenId);

      expect(response).toBeDefined();
      expect(response.tokenInfo).toBeDefined();
    });
  });

  describe('listTokens', () => {
    it('should list tokens for an organization', async () => {
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token for list test'
      });
      testTokenId = createResponse.tokenId;

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
      const tokenIds: string[] = [];
      for (let i = 0; i < 3; i++) {
        const resp = await client.token.createToken(testOrg, {
          description: `Token ${i} for pagination test`
        });
        tokenIds.push(resp.tokenId);
      }
      // Use first token for cleanup tracking
      testTokenId = tokenIds[0];

      // List with page size 1
      const firstPage = await client.token.listTokens(testOrg, {
        pageSize: 1
      });

      expect(firstPage).toBeDefined();
      expect(firstPage.tokens.length).toBe(1);
      expect(firstPage.nextPageToken).toBeDefined();

      // Get next page
      const secondPage = await client.token.listTokens(testOrg, {
        pageSize: 1,
        pageToken: firstPage.nextPageToken,
      });

      expect(secondPage).toBeDefined();
      expect(secondPage.tokens.length).toBe(1);

      // Ensure different tokens on different pages
      expect(firstPage.tokens[0].tokenId).not.toBe(secondPage.tokens[0].tokenId);

      // Clean up extra tokens
      for (const id of tokenIds.slice(1)) {
        try { await client.token.invalidateToken(id); } catch (_) {}
      }
    });
  });

  describe('invalidateToken', () => {
    it('should invalidate a token and validate should throw', async () => {
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token to invalidate'
      });
      const tokenId = createResponse.tokenId;

      // Invalidate the token
      await client.token.invalidateToken(tokenId);

      // Verify token is no longer valid by attempting to validate
      await expect(
        client.token.validateToken(tokenId)
      ).rejects.toThrow();

      // Already invalidated
      testTokenId = null;
    });

    it('should be idempotent (succeed even if already invalidated)', async () => {
      const createResponse = await client.token.createToken(testOrg, {
        description: 'Token for idempotent test'
      });
      const tokenId = createResponse.tokenId;

      // Invalidate twice - should not throw
      await client.token.invalidateToken(tokenId);
      await client.token.invalidateToken(tokenId);

      // Already invalidated
      testTokenId = null;
    });
  });
});
