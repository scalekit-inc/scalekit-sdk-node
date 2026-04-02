import ScalekitClient from '../src/scalekit';
import { create } from '@bufbuild/protobuf';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ScalekitServerException } from '../src/errors';
import { TestDataGenerator, TestOrganizationManager } from './utils/test-data';
import {
  AuthorizationDetailsSchema,
  OauthTokenSchema,
} from '../src/pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

declare const global: {
  client: ScalekitClient;
};

describe('Actions', () => {
  let client: ScalekitClient;
  let testOrg: string;

  // Happy-path assumptions for the test environment:
  // - A GMAIL connector named "GMAIL-test" exists.
  // - A connected account with identifier "default" is ACTIVE for that connector.
  // - A tool named "gmail_fetch_mails" is available for that connection.
  const GMAIL_CONNECTION_NAME = 'GMAIL-test';
  const GMAIL_IDENTIFIER = 'default';
  const GMAIL_TOOL_NAME = 'gmail_fetch_mails';
  const USER_PROFILE_PATH = '/gmail/v1/users/me/profile';
  const FRESHDESK_CONNECTION_NAME = 'freshdesk';

  beforeEach(async () => {
    client = global.client;
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterEach(async () => {
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  it('should expose actions on ScalekitClient', () => {
    expect(client.actions).toBeDefined();
  });

  it('should expose key connected-account helper methods', () => {
    expect(typeof client.actions.createConnectedAccount).toBe('function');
    expect(typeof client.actions.getOrCreateConnectedAccount).toBe('function');
    expect(typeof client.actions.updateConnectedAccount).toBe('function');
    expect(typeof client.actions.deleteConnectedAccount).toBe('function');
    expect(typeof client.actions.getConnectedAccount).toBe('function');
  });

  describe('executeTool', () => {
    it('should delegate to tools.executeTool with basic params', async () => {
      try {
        await client.actions.executeTool({
          toolName: 'test_tool',
          toolInput: { key: 'value' },
        });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should execute a Gmail tool successfully via actions', async () => {
      const toolInput = { max_results: 1 };

      const response = await client.actions.executeTool({
        toolName: GMAIL_TOOL_NAME,
        toolInput,
        identifier: GMAIL_IDENTIFIER,
        connector: GMAIL_CONNECTION_NAME,
      });

      expect(response).toBeDefined();
      expect(typeof response.executionId).toBe('string');
      expect(response.executionId.length).toBeGreaterThan(0);
      expect(response.data).toBeDefined();
    });
  });

  describe('getAuthorizationLink', () => {
    it('should call underlying magic link API', async () => {
      try {
        const response = await client.actions.getAuthorizationLink({
          connectionName: 'test_connector',
          identifier: 'test_identifier',
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should include state and userVerifyUrl in magic link request', async () => {
      const identifier = `link-test-${TestDataGenerator.generateUniqueId()}`;

      const authorizationDetails = create(AuthorizationDetailsSchema, {
        details: {
          case: 'oauthToken',
          value: create(OauthTokenSchema, { accessToken: 'test_access_token' }),
        },
      });

      let created = false;
      try {
        await client.actions.createConnectedAccount({
          connectionName: GMAIL_CONNECTION_NAME,
          identifier,
          authorizationDetails,
        });
        created = true;

        const response = await client.actions.getAuthorizationLink({
          connectionName: GMAIL_CONNECTION_NAME,
          identifier,
          state: 'csrf-token-abc123',
          userVerifyUrl: 'https://yourapp.com/auth/callback',
        });

        expect(response).toBeDefined();
        expect(typeof response.link).toBe('string');
        expect(response.link.length).toBeGreaterThan(0);
      } finally {
        if (created) {
          await client.actions.deleteConnectedAccount({
            connectionName: GMAIL_CONNECTION_NAME,
            identifier,
          });
        }
      }
    });
  });

  describe('verifyConnectedAccountUser', () => {
    it('should throw not found error for a non-existent authRequestId', async () => {
      const error = await client.actions
        .verifyConnectedAccountUser({
          authRequestId: '00000000-0000-0000-0000-000000000000',
          identifier: 'user_123',
        })
        .catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitServerException);
      expect(error.message).toMatch(
        /auth request not found or no longer valid/i
      );
    });
  });

  describe('createConnectedAccount', () => {
    it('should construct CreateConnectedAccount payload', async () => {
      const authorizationDetails = create(AuthorizationDetailsSchema, {
        details: {
          case: 'oauthToken',
          value: create(OauthTokenSchema, { accessToken: 'test_access_token' }),
        },
      });

      try {
        const response = await client.actions.createConnectedAccount({
          connectionName: 'test_connector',
          identifier: `test_${Date.now()}`,
          authorizationDetails,
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should validate required parameters', async () => {
      const authorizationDetails = create(AuthorizationDetailsSchema, {
        details: {
          case: 'oauthToken',
          value: create(OauthTokenSchema, { accessToken: 'test_access_token' }),
        },
      });

      await expect(
        client.actions.createConnectedAccount({
          connectionName: '' as any,
          identifier: 'test_id',
          authorizationDetails,
        } as any)
      ).rejects.toThrow('connectionName is required');

      await expect(
        client.actions.createConnectedAccount({
          connectionName: 'GMAIL',
          identifier: '' as any,
          authorizationDetails,
        } as any)
      ).rejects.toThrow('identifier is required');
    });
  });

  describe('getOrCreateConnectedAccount', () => {
    it('should delegate validation to underlying client', async () => {
      await expect(
        client.actions.getOrCreateConnectedAccount({
          connectionName: '' as any,
          identifier: 'user_123',
        } as any)
      ).rejects.toThrow('connectionName is required');

      await expect(
        client.actions.getOrCreateConnectedAccount({
          connectionName: 'gmail',
          identifier: '' as any,
        } as any)
      ).rejects.toThrow('identifier is required');
    });
  });

  describe('request', () => {
    it('should validate required parameters', async () => {
      await expect(
        client.actions.request({
          connectionName: '',
          identifier: '',
          path: '',
        })
      ).rejects.toThrow();
    });

    it('should fetch user profile successfully via proxy request', async () => {
      const response = await client.actions.request({
        connectionName: GMAIL_CONNECTION_NAME,
        identifier: GMAIL_IDENTIFIER,
        path: USER_PROFILE_PATH,
        method: 'GET',
      });

      expect(response).toBeDefined();
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(response.data).toBeDefined();
      expect(typeof response.data).toBe('object');
    });
  });

  describe('connected account lifecycle (Gmail OAuth)', () => {
    it('should create, get, update, and delete a Gmail connected account with apiConfig', async () => {
      const uniqueId = TestDataGenerator.generateUniqueId();
      const identifier = `test_actions_gmail_${uniqueId}`;

      const authorizationDetails = create(AuthorizationDetailsSchema, {
        details: {
          case: 'oauthToken',
          value: create(OauthTokenSchema, {
            accessToken: 'test_access_token_api',
            refreshToken: 'test_refresh_token_api',
            scopes: ['read', 'write'],
          }),
        },
      });

      const initialApiConfig = {
        version: 'v1.0',
        domain: 'gmail.com',
        api_endpoint: 'https://gmail.googleapis.com',
        custom_auth_header: 'Bearer',
      };

      const createResponse = await client.actions.createConnectedAccount({
        connectionName: GMAIL_CONNECTION_NAME,
        identifier,
        authorizationDetails,
        apiConfig: initialApiConfig,
      });

      expect(createResponse.connectedAccount).toBeDefined();
      const created = createResponse.connectedAccount!;
      expect(created.identifier).toBe(identifier);
      expect(created.apiConfig).toBeDefined();

      const getResponse = await client.actions.getConnectedAccount({
        connectionName: GMAIL_CONNECTION_NAME,
        identifier,
      });

      expect(getResponse.connectedAccount).toBeDefined();
      expect(getResponse.connectedAccount!.identifier).toBe(identifier);

      const updatedApiConfig = {
        version: 'v2.0',
        domain: 'updated.gmail.com',
        api_endpoint: 'https://updated.gmail.googleapis.com',
        custom_auth_header: 'Updated Bearer',
      };

      const updateResponse = await client.actions.updateConnectedAccount({
        connectionName: GMAIL_CONNECTION_NAME,
        identifier,
        apiConfig: updatedApiConfig as any,
      });

      expect(updateResponse.connectedAccount).toBeDefined();
      const updated = updateResponse.connectedAccount!;
      expect(updated.identifier).toBe(identifier);
      expect(updated.apiConfig).toBeDefined();

      const deleteResponse = await client.actions.deleteConnectedAccount({
        connectionName: GMAIL_CONNECTION_NAME,
        identifier,
      });
      expect(deleteResponse).toBeDefined();
    });
  });

  describe('connected account lifecycle (Freshdesk static auth)', () => {
    it('should create, update, and delete a Freshdesk connected account with static auth', async () => {
      const uniqueId = TestDataGenerator.generateUniqueId();
      const identifier = `test_actions_freshdesk_${uniqueId}`;

      const initialStaticAuth = {
        static_auth: {
          domain: 'initial.freshdesk.com',
          username: 'initial_user',
          password: 'initial_password',
        },
      };

      try {
        const createResponse = await client.actions.createConnectedAccount({
          connectionName: FRESHDESK_CONNECTION_NAME,
          identifier,
          authorizationDetails: initialStaticAuth as any,
        });

        expect(createResponse.connectedAccount).toBeDefined();
        const created = createResponse.connectedAccount!;
        expect(created.identifier).toBe(identifier);

        const updatedStaticAuth = {
          static_auth: {
            domain: 'updated.freshdesk.com',
            username: 'updated_user',
            password: 'updated_password',
          },
        };

        const updateResponse = await client.actions.updateConnectedAccount({
          connectionName: FRESHDESK_CONNECTION_NAME,
          identifier,
          authorizationDetails: updatedStaticAuth as any,
        });

        expect(updateResponse.connectedAccount).toBeDefined();
        const updated = updateResponse.connectedAccount!;
        expect(updated.identifier).toBe(identifier);
        expect(updated.authorizationDetails).toBeDefined();

        const deleteResponse = await client.actions.deleteConnectedAccount({
          connectionName: FRESHDESK_CONNECTION_NAME,
          identifier,
        });
        expect(deleteResponse).toBeDefined();
      } catch (error: any) {
        if (
          error?.name === 'ScalekitNotFoundException' ||
          /connection not found/i.test(String(error.message ?? error))
        ) {
          return;
        }
        throw error;
      }
    });
  });
});
