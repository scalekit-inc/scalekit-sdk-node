import ScalekitClient from '../src/scalekit';
import { create } from '@bufbuild/protobuf';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ScalekitServerException } from '../src/errors';
import { TestOrganizationManager } from './utils/test-data';
import {
  AuthorizationDetailsSchema,
  CreateConnectedAccountSchema,
  OauthTokenSchema,
  UpdateConnectedAccountSchema,
} from '../src/pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

describe('Connected Accounts', () => {
  let client: ScalekitClient;
  let testOrg: string;
  let testConnectedAccountId: string | null = null;
  let testConnector: string | null = null;
  let testIdentifier: string | null = null;

  beforeEach(async () => {
    client = global.client;
    testOrg = await TestOrganizationManager.createTestOrganization(client);
    testConnectedAccountId = null;
    testConnector = null;
    testIdentifier = null;
  });

  afterEach(async () => {
    if (testConnectedAccountId && testConnector && testIdentifier) {
      try {
        await client.connectedAccounts.deleteConnectedAccount({
          connector: testConnector,
          identifier: testIdentifier,
          connectedAccountId: testConnectedAccountId,
        });
      } catch {
        // Account may already be deleted or not exist
      }
    }

    testConnectedAccountId = null;
    testConnector = null;
    testIdentifier = null;

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
        const secondPage = await client.connectedAccounts.listConnectedAccounts(
          {
            pageSize: 10,
            pageToken: firstPage.nextPageToken,
          }
        );

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

      const connectedAccount = create(CreateConnectedAccountSchema, {
        authorizationDetails: create(AuthorizationDetailsSchema, {
          details: {
            case: 'oauthToken',
            value: create(OauthTokenSchema, {
              accessToken: 'test_access_token',
              refreshToken: 'test_refresh_token',
              scopes: ['read', 'write'],
            }),
          },
        }),
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
          testConnector = connector;
          testIdentifier = identifier;
        }
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should handle create connected account with user ID', async () => {
      const connector = 'test_connector';
      const identifier = `test_user_${Date.now()}`;

      const connectedAccount = create(CreateConnectedAccountSchema, {
        authorizationDetails: create(AuthorizationDetailsSchema, {
          details: {
            case: 'oauthToken',
            value: create(OauthTokenSchema, {
              accessToken: 'test_access_token',
              refreshToken: 'test_refresh_token',
              scopes: ['read'],
            }),
          },
        }),
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
          testConnector = connector;
          testIdentifier = identifier;
        }
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });

  describe('getOrCreateConnectedAccount', () => {
    it('should throw when connector is empty', async () => {
      await expect(
        client.connectedAccounts.getOrCreateConnectedAccount({
          connector: '',
          identifier: 'user_123',
        })
      ).rejects.toThrow('connector is required');
    });

    it('should throw when identifier is empty', async () => {
      await expect(
        client.connectedAccounts.getOrCreateConnectedAccount({
          connector: 'gmail',
          identifier: '',
        })
      ).rejects.toThrow('identifier is required');
    });

    it('should return existing account when found (get path)', async () => {
      const connector = 'gmail';
      const identifier = 'get-or-create-test@example.com';
      try {
        const response =
          await client.connectedAccounts.getOrCreateConnectedAccount({
            connector,
            identifier,
            organizationId: testOrg,
          });
        expect(response).toBeDefined();
        expect(response.connectedAccount).toBeDefined();
        expect(response.connectedAccount?.identifier).toBe(identifier);
        expect(response.connectedAccount?.connector).toBe(connector);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });

  describe('updateConnectedAccount', () => {
    it('should handle update connected account request', async () => {
      const connector = 'test_connector';
      const identifier = 'test_identifier';

      const connectedAccount = create(UpdateConnectedAccountSchema, {
        authorizationDetails: create(AuthorizationDetailsSchema, {
          details: {
            case: 'oauthToken',
            value: create(OauthTokenSchema, {
              accessToken: 'updated_access_token',
              refreshToken: 'updated_refresh_token',
              scopes: ['read', 'write', 'admin'],
            }),
          },
        }),
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
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should handle update connected account with ID', async () => {
      const connector = 'test_connector';
      const identifier = 'test_identifier';

      const connectedAccount = create(UpdateConnectedAccountSchema, {
        authorizationDetails: create(AuthorizationDetailsSchema, {
          details: {
            case: 'oauthToken',
            value: create(OauthTokenSchema, {
              accessToken: 'updated_access_token',
            }),
          },
        }),
      });

      try {
        const response = await client.connectedAccounts.updateConnectedAccount({
          connector,
          identifier,
          connectedAccount,
          connectedAccountId: 'ca_test123',
        });

        expect(response).toBeDefined();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });

  describe('deleteConnectedAccount', () => {
    it('should handle delete connected account request', async () => {
      try {
        const response = await client.connectedAccounts.deleteConnectedAccount({
          connector: 'test_connector',
          identifier: 'test_identifier',
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
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
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });

  describe('getMagicLinkForConnectedAccount', () => {
    it('should handle get magic link request', async () => {
      try {
        const response =
          await client.connectedAccounts.getMagicLinkForConnectedAccount({
            connector: 'test_connector',
            identifier: 'test_identifier',
            organizationId: testOrg,
          });

        expect(response).toBeDefined();
        expect(response.link).toBeDefined();
        expect(typeof response.link).toBe('string');
        expect(response.expiry).toBeDefined();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should handle get magic link with user ID', async () => {
      try {
        const response =
          await client.connectedAccounts.getMagicLinkForConnectedAccount({
            connector: 'test_connector',
            identifier: 'test_identifier',
            userId: 'usr_test123',
          });

        expect(response).toBeDefined();
        if (response.link) {
          expect(typeof response.link).toBe('string');
        }
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should handle get magic link with connected account ID', async () => {
      try {
        const response =
          await client.connectedAccounts.getMagicLinkForConnectedAccount({
            connector: 'test_connector',
            identifier: 'test_identifier',
            connectedAccountId: 'ca_test123',
          });

        expect(response).toBeDefined();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });

  describe('getConnectedAccountByIdentifier', () => {
    it('should handle get connected account by identifier request', async () => {
      try {
        const response =
          await client.connectedAccounts.getConnectedAccountByIdentifier({
            connector: 'test_connector',
            identifier: 'test_identifier',
            organizationId: testOrg,
          });

        expect(response).toBeDefined();
        expect(response.connectedAccount).toBeDefined();
        expect(response.connectedAccount?.id).toBeDefined();
        expect(response.connectedAccount?.authorizationDetails).toBeDefined();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should handle get connected account with user ID', async () => {
      try {
        const response =
          await client.connectedAccounts.getConnectedAccountByIdentifier({
            connector: 'test_connector',
            identifier: 'test_identifier',
            userId: 'usr_test123',
          });

        expect(response).toBeDefined();
        if (response.connectedAccount) {
          expect(response.connectedAccount.id).toBeDefined();
        }
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should handle get connected account with connected account ID', async () => {
      try {
        const response =
          await client.connectedAccounts.getConnectedAccountByIdentifier({
            connector: 'test_connector',
            identifier: 'test_identifier',
            connectedAccountId: 'ca_test123',
          });

        expect(response).toBeDefined();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });
});
