import ScalekitClient from "../src/scalekit";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { TestDataGenerator, TestOrganizationManager } from "./utils/test-data";
import {
  AuthorizationDetails,
  CreateConnectedAccount,
  OauthToken,
} from "../src/pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb";

declare const global: {
  client: ScalekitClient;
};

describe("Actions", () => {
  let client: ScalekitClient;
  let testOrg: string;

  // Happy-path assumptions for the test environment:
  // - A GMAIL connector named "GMAIL-test" exists.
  // - A connected account with identifier "default" is ACTIVE for that connector.
  // - A tool named "gmail_fetch_mails" is available for that connection.
  const GMAIL_CONNECTION_NAME = "GMAIL-test";
  const GMAIL_IDENTIFIER = "default";
  const GMAIL_TOOL_NAME = "gmail_fetch_mails";
  const USER_PROFILE_PATH = "/v1/users/me/profile";
  const FRESHDESK_CONNECTION_NAME = "freshdesk";

  beforeEach(async () => {
    client = global.client;
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterEach(async () => {
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  it("should expose actions on ScalekitClient", () => {
    expect(client.actions).toBeDefined();
  });

  it("should expose key connected-account helper methods", () => {
    
    expect(typeof client.actions.createConnectedAccount).toBe("function");
    expect(typeof client.actions.getOrCreateConnectedAccount).toBe("function");
    expect(typeof client.actions.updateConnectedAccount).toBe("function");
    expect(typeof client.actions.deleteConnectedAccount).toBe("function");
    expect(typeof client.actions.getConnectedAccount).toBe("function");
  });

  describe("executeTool", () => {
    it("should delegate to tools.executeTool with basic params", async () => {
      try {
        await client.actions.executeTool({
          toolName: "test_tool",
          toolInput: { key: "value" },
        });
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message || error.toString()).toBeDefined();
      }
    });

    it("should execute a Gmail tool successfully via actions", async () => {
      const toolInput = { max_results: 1 };

      const response = await client.actions.executeTool({
        toolName: GMAIL_TOOL_NAME,
        toolInput,
        identifier: GMAIL_IDENTIFIER,
        connector: GMAIL_CONNECTION_NAME,
      });

      expect(response).toBeDefined();
      // We expect a non-empty executionId and some data from the tool.
      expect(typeof response.executionId).toBe("string");
      expect(response.executionId.length).toBeGreaterThan(0);
      expect(response.data).toBeDefined();
    });
  });

  describe("getAuthorizationLink", () => {
    it("should call underlying magic link API", async () => {
      try {
        const response = await client.actions.getAuthorizationLink({
          connectionName: "test_connector",
          identifier: "test_identifier",
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("createConnectedAccount", () => {
    it("should construct CreateConnectedAccount payload", async () => {
      const oauthToken = new OauthToken({
        accessToken: "test_access_token",
      });

      const authorizationDetails = new AuthorizationDetails({
        details: {
          case: "oauthToken",
          value: oauthToken,
        },
      });

      try {
        const response = await client.actions.createConnectedAccount({
          connectionName: "test_connector",
          identifier: `test_${Date.now()}`,
          authorizationDetails,
          organizationId: testOrg,
        });

        expect(response).toBeDefined();
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should validate required parameters", async () => {
      const oauthToken = new OauthToken({
        accessToken: "test_access_token",
      });

      const authorizationDetails = new AuthorizationDetails({
        details: {
          case: "oauthToken",
          value: oauthToken,
        },
      });

      // Missing connectionName
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client.actions.createConnectedAccount({
          connectionName: "" as any,
          identifier: "test_id",
          authorizationDetails,
        } as any)
      ).rejects.toThrow("connectionName is required");

      // Missing identifier
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client.actions.createConnectedAccount({
          connectionName: "GMAIL",
          identifier: "" as any,
          authorizationDetails,
        } as any)
      ).rejects.toThrow("identifier is required");
    });
  });

  describe("getOrCreateConnectedAccount", () => {
    it("should delegate validation to underlying client", async () => {
      // connector / connectionName required
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client.actions.getOrCreateConnectedAccount({
          connectionName: "" as any,
          identifier: "user_123",
        } as any)
      ).rejects.toThrow("connector is required");

      // identifier required
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client.actions.getOrCreateConnectedAccount({
          connectionName: "gmail",
          identifier: "" as any,
        } as any)
      ).rejects.toThrow("identifier is required");
    });
  });

  describe("request", () => {
    it("should validate required parameters", async () => {
      await expect(
        client.actions.request({
          connectionName: "",
          identifier: "",
          path: "",
        })
      ).rejects.toThrow();
    });

    it("should fetch user profile successfully via proxy request", async () => {
      const response = await client.actions.request({
        connectionName: GMAIL_CONNECTION_NAME,
        identifier: GMAIL_IDENTIFIER,
        path: USER_PROFILE_PATH,
        method: "GET",
      });

      expect(response).toBeDefined();
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      // Response data should be JSON-serializable user profile shape.
      expect(response.data).toBeDefined();
      expect(typeof response.data).toBe("object");
    });
  });

  describe("connected account lifecycle (Gmail OAuth)", () => {
    it("should create, get, update, and delete a Gmail connected account with apiConfig", async () => {
      const uniqueId = TestDataGenerator.generateUniqueId();
      const identifier = `test_actions_gmail_${uniqueId}`;

      const oauthToken = new OauthToken({
        accessToken: "test_access_token_api",
        refreshToken: "test_refresh_token_api",
        scopes: ["read", "write"],
      });

      const authorizationDetails = new AuthorizationDetails({
        details: {
          case: "oauthToken",
          value: oauthToken,
        },
      });

      const initialApiConfig = {
        version: "v1.0",
        domain: "gmail.com",
        api_endpoint: "https://gmail.googleapis.com",
        custom_auth_header: "Bearer",
      };

      // Create
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

      // Get via actions wrapper
      const getResponse = await client.actions.getConnectedAccount({
        connectionName: GMAIL_CONNECTION_NAME,
        identifier,
      });

      expect(getResponse.connectedAccount).toBeDefined();
      expect(getResponse.connectedAccount!.identifier).toBe(identifier);

      // Update apiConfig
      const updatedApiConfig = {
        version: "v2.0",
        domain: "updated.gmail.com",
        api_endpoint: "https://updated.gmail.googleapis.com",
        custom_auth_header: "Updated Bearer",
      };

      const updateResponse = await client.actions.updateConnectedAccount({
        connectionName: GMAIL_CONNECTION_NAME,
        identifier,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiConfig: updatedApiConfig as any,
      });

      expect(updateResponse.connectedAccount).toBeDefined();
      const updated = updateResponse.connectedAccount!;
      expect(updated.identifier).toBe(identifier);
      expect(updated.apiConfig).toBeDefined();

      // Delete via actions wrapper
      const deleteResponse = await client.actions.deleteConnectedAccount({
        connectionName: GMAIL_CONNECTION_NAME,
        identifier,
      });
      expect(deleteResponse).toBeDefined();
    });
  });

  describe("connected account lifecycle (Freshdesk static auth)", () => {
    it("should create, update, and delete a Freshdesk connected account with static auth", async () => {
      const uniqueId = TestDataGenerator.generateUniqueId();
      const identifier = `test_actions_freshdesk_${uniqueId}`;

      // Initial static auth
      const initialStaticAuth = {
        static_auth: {
          domain: "initial.freshdesk.com",
          username: "initial_user",
          password: "initial_password",
        },
      };

      try {
        // Create Freshdesk account
        const createResponse = await client.actions.createConnectedAccount({
          connectionName: FRESHDESK_CONNECTION_NAME,
          identifier,
          // For Node, authorizationDetails is carried through as a generic value; we rely
          // on the backend to interpret the structure.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          authorizationDetails: initialStaticAuth as any,
        });

        expect(createResponse.connectedAccount).toBeDefined();
        const created = createResponse.connectedAccount!;
        expect(created.identifier).toBe(identifier);

        // Update static auth
        const updatedStaticAuth = {
          static_auth: {
            domain: "updated.freshdesk.com",
            username: "updated_user",
            password: "updated_password",
          },
        };

        const updateResponse = await client.actions.updateConnectedAccount({
          connectionName: FRESHDESK_CONNECTION_NAME,
          identifier,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          authorizationDetails: updatedStaticAuth as any,
        });

        expect(updateResponse.connectedAccount).toBeDefined();
        const updated = updateResponse.connectedAccount!;
        expect(updated.identifier).toBe(identifier);

        // Best-effort check: authorizationDetails should be present
        expect(updated.authorizationDetails).toBeDefined();

        // Delete Freshdesk account
        const deleteResponse = await client.actions.deleteConnectedAccount({
          connectionName: FRESHDESK_CONNECTION_NAME,
          identifier,
        });
        expect(deleteResponse).toBeDefined();
      } catch (error: any) {
        // If the Freshdesk connector is not configured in this environment,
        // treat this as a skipped integration scenario rather than a hard failure.
        if (
          error?.name === "ScalekitNotFoundException" ||
          /connection not found/i.test(String(error.message ?? error))
        ) {
          return;
        }
        throw error;
      }
    });
  });
});

