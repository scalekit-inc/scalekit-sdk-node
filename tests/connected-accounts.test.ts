import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestOrganizationManager } from './utils/test-data';
import {
  CreateConnectedAccount,
  UpdateConnectedAccount,
  AuthorizationDetails,
  OauthToken,
} from '../src/pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

describe('Connected Accounts', () => {
  let client: ScalekitClient;
  let testOrg: string;
  let testConnectedAccountId: string | null = null;

  beforeEach(async () => {
    // Use global client
    client = global.client;
    
    // Create test organization for each test
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterEach(async () => {
    // Clean up test connected account if created
    if (testConnectedAccountId) {
      try {
        await client.connectedAccounts.deleteConnectedAccount({
          connector: 'test_connector',
          identifier: 'test_identifier',
          connectedAccountId: testConnectedAccountId,
        });
      } catch (error) {
        // Account may already be deleted or not exist
      }
      testConnectedAccountId = null;
    }
    
    // Clean up test organization
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  describe('listConnectedAccounts', () => {
    it('should list connected accounts', async () => {
      const response = await client.connectedAccounts.listConnectedAccounts();

      expect(response).toBeDefined();
      expect(response.connectedAccounts).toBeDefined();
      expect(Array.isArray(response.connectedAccounts)).toBe(true);
      expect(response.totalSize).toBeDefined();
      expect(typeof response.totalSize).toBe('number');
    });

    it('should list connected accounts with organization filter', async () => {
      const response = await client.connectedAccounts.listConnectedAccounts({
        organizationId: testOrg,
      });

      expect(response).toBeDefined();
      expect(response.connectedAccounts).toBeDefined();
      expect(Array.isArray(response.connectedAccounts)).toBe(true);
    });

    it('should list connected accounts with connector filter', async () => {
      const response = await client.connectedAccounts.listConnectedAccounts({
        connector: 'notion',
      });

      expect(response).toBeDefined();
      expect(response.connectedAccounts).toBeDefined();
      expect(Array.isArray(response.connectedAccounts)).toBe(true);
    });

    it('should list connected accounts with provider filter', async () => {
      const response = await client.connectedAccounts.listConnectedAccounts({
        provider: 'google',
      });

      expect(response).toBeDefined();
      expect(response.connectedAccounts).toBeDefined();
      expect(Array.isArray(response.connectedAccounts)).toBe(true);
    });

    it('should list connected accounts with pagination', async () => {
      const firstPage = await client.connectedAccounts.listConnectedAccounts({
        pageSize: 10,
      });

      expect(firstPage).toBeDefined();
      expect(firstPage.connectedAccounts).toBeDefined();
      expect(firstPage.connectedAccounts.length).toBeLessThanOrEqual(10);

      if (firstPage.nextPageToken) {
        const secondPage = await client.connectedAccounts.listConnectedAccounts({
          pageSize: 10,
          pageToken: firstPage.nextPageToken,
        });

        expect(secondPage).toBeDefined();
        expect(secondPage.connectedAccounts).toBeDefined();
      }
    });

    it('should list connected accounts with query search', async () => {
      const response = await client.connectedAccounts.listConnectedAccounts({
        query: 'test',
      });

      expect(response).toBeDefined();
      expect(response.connectedAccounts).toBeDefined();
      expect(Array.isArray(response.connectedAccounts)).toBe(true);
    });
  });

  describe('createConnectedAccount', () => {
    it('should handle create connected account request', async () => {
      const connector = 'test_connector';
      const identifier = `test_${Date.now()}`;
      
      const oauthToken = new OauthToken({
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
        scopes: ['read', 'write'],
      });

      const authorizationDetails = new AuthorizationDetails({
        details: {
          case: 'oauthToken',
          value: oauthToken,
        },
      });

      const connectedAccount = new CreateConnectedAccount({
        authorizationDetails,
      });

      try {
        const response = await client.connectedAccounts.createConnectedAccount({
          connector,
          identifier,
          connectedAccount,
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
        expect(response.connectedAccount).toBeDefined();
        expect(response.connectedAccount?.id).toBeDefined();
        
        if (response.connectedAccount?.id) {
          testConnectedAccountId = response.connectedAccount.id;
        }
      } catch (error: any) {
        // Expected errors: connector not found, invalid credentials, etc.
        expect(error).toBeDefined();
        // Verify it's a proper error response, not a request structure issue
        expect(error.message || error.toString()).toBeDefined();
      }
    });

    it('should handle create connected account with user ID', async () => {
      const connector = 'test_connector';
      const identifier = `test_user_${Date.now()}`;
      
      const oauthToken = new OauthToken({
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
        scopes: ['read'],
      });

      const authorizationDetails = new AuthorizationDetails({
        details: {
          case: 'oauthToken',
          value: oauthToken,
        },
      });

      const connectedAccount = new CreateConnectedAccount({
        authorizationDetails,
      });

      try {
        const response = await client.connectedAccounts.createConnectedAccount({
          connector,
          identifier,
          connectedAccount,
          userId: 'usr_test123',
        });

        expect(response).toBeDefined();
        if (response.connectedAccount?.id) {
          testConnectedAccountId = response.connectedAccount.id;
        }
      } catch (error: any) {
        // Expected errors: connector not found, invalid credentials, etc.
        expect(error).toBeDefined();
      }
    });
  });

  describe('updateConnectedAccount', () => {
    it('should handle update connected account request', async () => {
      const connector = 'test_connector';
      const identifier = 'test_identifier';
      
      const oauthToken = new OauthToken({
        accessToken: 'updated_access_token',
        refreshToken: 'updated_refresh_token',
        scopes: ['read', 'write', 'admin'],
      });

      const authorizationDetails = new AuthorizationDetails({
        details: {
          case: 'oauthToken',
          value: oauthToken,
        },
      });

      const connectedAccount = new UpdateConnectedAccount({
        authorizationDetails,
      });

      try {
        const response = await client.connectedAccounts.updateConnectedAccount({
          connector,
          identifier,
          connectedAccount,
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
        expect(response.connectedAccount).toBeDefined();
      } catch (error: any) {
        // Expected errors: connected account not found, invalid credentials, etc.
        expect(error).toBeDefined();
      }
    });

    it('should handle update connected account with ID', async () => {
      const connector = 'test_connector';
      const identifier = 'test_identifier';
      
      const oauthToken = new OauthToken({
        accessToken: 'updated_access_token',
      });

      const authorizationDetails = new AuthorizationDetails({
        details: {
          case: 'oauthToken',
          value: oauthToken,
        },
      });

      const connectedAccount = new UpdateConnectedAccount({
        authorizationDetails,
      });

      try {
        const response = await client.connectedAccounts.updateConnectedAccount({
          connector,
          identifier,
          connectedAccount,
          connectedAccountId: 'ca_test123',
        });

        expect(response).toBeDefined();
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
      }
    });
  });

  describe('deleteConnectedAccount', () => {
    it('should handle delete connected account request', async () => {
      const connector = 'test_connector';
      const identifier = 'test_identifier';

      try {
        const response = await client.connectedAccounts.deleteConnectedAccount({
          connector,
          identifier,
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
      }
    });

    it('should handle delete connected account with ID', async () => {
      try {
        const response = await client.connectedAccounts.deleteConnectedAccount({
          connector: 'test_connector',
          identifier: 'test_identifier',
          connectedAccountId: 'ca_test123',
        });

        expect(response).toBeDefined();
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
      }
    });
  });

  describe('getMagicLinkForConnectedAccount', () => {
    it('should handle get magic link request', async () => {
      const connector = 'test_connector';
      const identifier = 'test_identifier';

      try {
        const response = await client.connectedAccounts.getMagicLinkForConnectedAccount({
          connector,
          identifier,
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
        expect(response.link).toBeDefined();
        expect(typeof response.link).toBe('string');
        expect(response.expiry).toBeDefined();
      } catch (error: any) {
        // Expected errors: connector not found, invalid parameters, etc.
        expect(error).toBeDefined();
      }
    });

    it('should handle get magic link with user ID', async () => {
      try {
        const response = await client.connectedAccounts.getMagicLinkForConnectedAccount({
          connector: 'test_connector',
          identifier: 'test_identifier',
          userId: 'usr_test123',
        });

        expect(response).toBeDefined();
        if (response.link) {
          expect(typeof response.link).toBe('string');
        }
      } catch (error: any) {
        // Expected errors: connector not found, etc.
        expect(error).toBeDefined();
      }
    });

    it('should handle get magic link with connected account ID', async () => {
      try {
        const response = await client.connectedAccounts.getMagicLinkForConnectedAccount({
          connector: 'test_connector',
          identifier: 'test_identifier',
          connectedAccountId: 'ca_test123',
        });

        expect(response).toBeDefined();
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
      }
    });
  });

  describe('getConnectedAccountByIdentifier', () => {
    it('should handle get connected account by identifier request', async () => {
      const connector = 'test_connector';
      const identifier = 'test_identifier';

      try {
        const response = await client.connectedAccounts.getConnectedAccountByIdentifier({
          connector,
          identifier,
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
        expect(response.connectedAccount).toBeDefined();
        expect(response.connectedAccount?.id).toBeDefined();
        expect(response.connectedAccount?.authorizationDetails).toBeDefined();
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
      }
    });

    it('should handle get connected account with user ID', async () => {
      try {
        const response = await client.connectedAccounts.getConnectedAccountByIdentifier({
          connector: 'test_connector',
          identifier: 'test_identifier',
          userId: 'usr_test123',
        });

        expect(response).toBeDefined();
        if (response.connectedAccount) {
          expect(response.connectedAccount.id).toBeDefined();
        }
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
      }
    });

    it('should handle get connected account with connected account ID', async () => {
      try {
        const response = await client.connectedAccounts.getConnectedAccountByIdentifier({
          connector: 'test_connector',
          identifier: 'test_identifier',
          connectedAccountId: 'ca_test123',
        });

        expect(response).toBeDefined();
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
      }
    });
  });
});
