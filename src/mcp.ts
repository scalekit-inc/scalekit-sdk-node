import { create, type MessageInitShape } from '@bufbuild/protobuf';
import { DurationSchema } from '@bufbuild/protobuf/wkt';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import {
  CreateMcpConfigRequestSchema,
  CreateMcpConfigResponse,
  CreateMcpSessionTokenRequestSchema,
  CreateMcpSessionTokenResponse,
  DeleteMcpConfigRequestSchema,
  DeleteMcpConfigResponse,
  GetMcpConfigRequestSchema,
  GetMcpConfigResponse,
  ListMcpConfigsRequestSchema,
  ListMcpConfigsResponse,
  ListMcpConnectedAccountsRequestSchema,
  ListMcpConnectedAccountsResponse,
  McpConfigSchema,
  McpService,
  UpdateMcpConfigRequestSchema,
  UpdateMcpConfigResponse,
} from './pkg/grpc/scalekit/v1/mcp/mcp_pb';

/**
 * Thrown by `createSessionToken` when the caller does not name exactly one
 * target server. Kept as a constant so the wording stays in one place.
 */
const MCP_SESSION_TOKEN_TARGET_ERROR =
  'exactly one of mcpConfigId or keyId is required';

/**
 * Client for Virtual MCP servers.
 *
 * A Virtual MCP server exposes a chosen set of connectors and tools over the
 * Model Context Protocol, so any MCP-capable agent can call them. You create one
 * configuration per agent role — not per user — and mint a short-lived session
 * token per user per run. The server URL is static; the token carries identity.
 *
 * This client covers the generally available surface only: MCP configurations,
 * their connected accounts, and session tokens. The `Mcp` and `McpInstance`
 * families in the same proto package back the older `/mcp/v1/` and `/mcp/v2/`
 * server generations, are marked PREVIEW, and are deliberately not exposed here.
 */
export default class McpClient {
  private client: Client<typeof McpService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(McpService);
  }

  /**
   * Creates a Virtual MCP server configuration.
   *
   * Create this once per agent role. The response carries a static
   * `config.mcpServerUrl` that every user and every session reuses.
   *
   * @param params.name Unique name. 1-100 characters, lowercase letters, digits, hyphens and underscores.
   * @param params.description Human-readable summary of what this server exposes.
   * @param params.connectionToolMappings Which connections, and which tools from each, to expose.
   *                                      Omit `tools` on a mapping to expose every tool for that connection.
   *                                      Maximum 25 mappings.
   * @throws {ScalekitServerException} If a network or server error occurs.
   *
   * @remarks
   * `config.mcpServerUrl` comes back as an **empty string** when the
   * `mcp_config_server_url` feature flag is not enabled for your environment —
   * the call still succeeds. Check it before storing the value, or every later
   * step fails with nothing to point at.
   */
  async createConfig(params: {
    name: string;
    description?: string;
    connectionToolMappings?: MessageInitShape<
      typeof McpConfigSchema
    >['connectionToolMappings'];
  }): Promise<CreateMcpConfigResponse> {
    return this.coreClient.connectExec(
      this.client.createMcpConfig,
      create(CreateMcpConfigRequestSchema, {
        config: create(McpConfigSchema, {
          name: params.name,
          ...(params.description !== undefined && {
            description: params.description,
          }),
          ...(params.connectionToolMappings && {
            connectionToolMappings: params.connectionToolMappings,
          }),
        }),
      })
    );
  }

  /**
   * Fetches a single MCP configuration by ID.
   *
   * @param configId ID of the configuration to fetch (`cfg_...`).
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async getConfig(configId: string): Promise<GetMcpConfigResponse> {
    return this.coreClient.connectExec(
      this.client.getMcpConfig,
      create(GetMcpConfigRequestSchema, { configId })
    );
  }

  /**
   * Lists MCP configurations for the current environment.
   *
   * @param options.search Free-text search across configuration metadata.
   * @param options.pageSize Maximum number of configurations to return per page
   *   (max 30; a larger value fails with `[invalid_argument] Validation error`).
   * @param options.pageToken Token from a previous `listConfigs` response.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async listConfigs(options?: {
    search?: string;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListMcpConfigsResponse> {
    return this.coreClient.connectExec(
      this.client.listMcpConfigs,
      create(ListMcpConfigsRequestSchema, {
        ...(options?.search && { search: options.search }),
        ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
        ...(options?.pageToken && { pageToken: options.pageToken }),
      })
    );
  }

  /**
   * Updates the description and connection-to-tool mappings of a configuration.
   *
   * The name cannot be changed after creation. Avoid updating while agent
   * sessions are running — tools can become unavailable mid-session. For a
   * significant change, create a new configuration and swap the URL instead.
   *
   * @param params.configId ID of the configuration to update.
   * @param params.description New description.
   * @param params.connectionToolMappings Replacement connection-to-tool mappings.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async updateConfig(params: {
    configId: string;
    description?: string;
    connectionToolMappings?: MessageInitShape<
      typeof UpdateMcpConfigRequestSchema
    >['connectionToolMappings'];
  }): Promise<UpdateMcpConfigResponse> {
    return this.coreClient.connectExec(
      this.client.updateMcpConfig,
      create(UpdateMcpConfigRequestSchema, {
        configId: params.configId,
        ...(params.description !== undefined && {
          description: params.description,
        }),
        ...(params.connectionToolMappings && {
          connectionToolMappings: params.connectionToolMappings,
        }),
      })
    );
  }

  /**
   * Deletes an MCP configuration.
   *
   * @param configId ID of the configuration to delete.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async deleteConfig(configId: string): Promise<DeleteMcpConfigResponse> {
    return this.coreClient.connectExec(
      this.client.deleteMcpConfig,
      create(DeleteMcpConfigRequestSchema, { configId })
    );
  }

  /**
   * Lists the connected accounts backing a configuration for one user.
   *
   * Call this before minting a session token: OAuth credentials can expire or be
   * revoked at any time, and an agent that starts without an active connection
   * fails on every tool call. Surface `authenticationLink` for any account whose
   * `connectedAccountStatus` is not `"ACTIVE"`.
   *
   * @param params.configId ID of the configuration.
   * @param params.identifier Your application's unique identifier for the user.
   * @param params.includeAuthLink Include re-authorization URLs for inactive connections.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async listConnectedAccounts(params: {
    configId: string;
    identifier: string;
    includeAuthLink?: boolean;
  }): Promise<ListMcpConnectedAccountsResponse> {
    return this.coreClient.connectExec(
      this.client.listMcpConnectedAccounts,
      create(ListMcpConnectedAccountsRequestSchema, {
        configId: params.configId,
        identifier: params.identifier,
        ...(params.includeAuthLink !== undefined && {
          includeAuthLink: params.includeAuthLink,
        }),
      })
    );
  }

  /**
   * Mints a session token for one user against one MCP server.
   *
   * The server URL is static; this token is what carries user identity. Mint a
   * fresh one before every agent run and never reuse one across runs. Set the
   * expiry longer than the run is expected to take.
   *
   * Pass exactly one target:
   * - `mcpConfigId` mints a token for the virtual MCP server of an MCP
   *   configuration — the one created by {@link createConfig}, which exposes
   *   the connections and tools that configuration selects.
   * - `keyId` is an AgentKit connection name, such as `'github-connect'`, and
   *   mints a token for that single connection's MCP server.
   *
   * A token is only accepted by the server it was minted for: a `mcpConfigId`
   * token does not work against a connection's MCP server, and vice versa.
   *
   * @param params.mcpConfigId ID of the MCP configuration. Mutually exclusive with `keyId`.
   * @param params.keyId AgentKit connection name (e.g. `'github-connect'`). Mutually exclusive with `mcpConfigId`.
   * @param params.identifier Your application's unique identifier for the user.
   * @param params.expirySeconds Token lifetime in whole seconds.
   * @throws {Error} If neither or both of `mcpConfigId` and `keyId` are provided.
   * @throws {Error} If `expirySeconds` is not a positive integer.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async createSessionToken(params: {
    mcpConfigId?: string;
    identifier: string;
    expirySeconds?: number;
    keyId?: string;
  }): Promise<CreateMcpSessionTokenResponse> {
    const mcpConfigId = params.mcpConfigId?.trim();
    const keyId = params.keyId?.trim();

    // The proto enforces exactly one of the two; reject locally so the caller
    // gets a message that names both fields instead of a server validation error.
    if (Boolean(mcpConfigId) === Boolean(keyId)) {
      throw new Error(MCP_SESSION_TOKEN_TARGET_ERROR);
    }

    if (
      params.expirySeconds !== undefined &&
      !(Number.isInteger(params.expirySeconds) && params.expirySeconds > 0)
    ) {
      // BigInt() below would otherwise throw an unhelpful RangeError.
      throw new Error(
        `expirySeconds must be a positive integer, got ${params.expirySeconds}`
      );
    }
    return this.coreClient.connectExec(
      this.client.createMcpSessionToken,
      create(CreateMcpSessionTokenRequestSchema, {
        ...(mcpConfigId && { mcpConfigId }),
        ...(keyId && { keyId }),
        identifier: params.identifier,
        ...(params.expirySeconds !== undefined && {
          expiry: create(DurationSchema, {
            seconds: BigInt(params.expirySeconds),
          }),
        }),
      })
    );
  }
}
