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
 * Tools an MCP session token can use: `'FULL'` for every tool, `'READ_ONLY'`
 * for tools annotated read-only only.
 */
export type McpSessionTokenAccessLevel = 'FULL' | 'READ_ONLY';

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
   * Mints a session token for one user against one configuration.
   *
   * The server URL is static; this token is what carries user identity. Mint a
   * fresh one before every agent run and never reuse one across runs. Set the
   * expiry longer than the run is expected to take.
   *
   * @param params.mcpConfigId ID of the configuration.
   * @param params.identifier Your application's unique identifier for the user.
   * @param params.expirySeconds Token lifetime in whole seconds.
   * @param params.accessLevel Tools the token can use. `'READ_ONLY'` limits it
   * to tools annotated read-only: other tools are left out of the tool list
   * and refused when called. `'FULL'`, or omitting it, exposes every tool the
   * configuration exposes.
   * @throws {Error} If `expirySeconds` is not a positive integer.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async createSessionToken(params: {
    mcpConfigId: string;
    identifier: string;
    expirySeconds?: number;
    accessLevel?: McpSessionTokenAccessLevel;
  }): Promise<CreateMcpSessionTokenResponse> {
    return this.coreClient.connectExec(
      this.client.createMcpSessionToken,
      create(CreateMcpSessionTokenRequestSchema, {
        mcpConfigId: params.mcpConfigId,
        identifier: params.identifier,
        ...expiryField(params.expirySeconds),
        ...(params.accessLevel !== undefined && {
          accessLevel: params.accessLevel,
        }),
      })
    );
  }

  /**
   * Mints a session token for one user against a connection's MCP server.
   *
   * Every AgentKit connection has its own MCP server at
   * `<environment URL>/mcp/v3/connections/<connectionName>`, which exposes all
   * of that connection's tools without an MCP configuration. Use this method
   * to mint a token for that server; use {@link McpClient.createSessionToken}
   * for a Virtual MCP server built from a configuration. A token works only on
   * the server it was minted for.
   *
   * The user should have an active connected account on the connection. When
   * they do not, the server either rejects the call, or creates a pending
   * connected account and returns a token whose tool calls report the account
   * as not connected, depending on the environment. Mint a fresh token before
   * every agent run and never reuse one across runs. Set the expiry longer
   * than the run is expected to take.
   *
   * @param params.connectionName The connection name: the same value used as
   * `connectionName` elsewhere in the SDK. Pass it exactly as stored,
   * including case. The connection is found regardless of case, but the token
   * is bound to the stored name, so a server URL built with different casing
   * refuses it.
   * @param params.identifier Your application's unique identifier for the user
   * whose connected account the token acts as.
   * @param params.expirySeconds Token lifetime in whole seconds, from 60
   * (1 minute) to 86400 (24 hours). Defaults to 3600 (1 hour) when omitted.
   * @param params.accessLevel Tools the token can use. `'READ_ONLY'` limits it
   * to tools annotated read-only: other tools are left out of the tool list
   * and refused when called. `'FULL'`, or omitting it, exposes every tool the
   * connection provides.
   * @returns The session `token` and its `expiresAt` time.
   * @throws {Error} If `connectionName` is empty, or `expirySeconds` is not a
   * positive integer.
   * @throws {ScalekitBadRequestException} If the connection is not an AgentKit
   * connection, the identifier or expiry is rejected, or (in environments that
   * do not create pending accounts) the user has no active connected account
   * on it.
   * @throws {ScalekitNotFoundException} If no active connection has that name.
   * @throws {ScalekitServerException} If a network or server error occurs.
   *
   * @example
   * ```typescript
   * const session = await scalekitClient.actions.mcp.createConnectionSessionToken({
   *   connectionName: 'gmail',
   *   identifier: 'user_123',
   *   expirySeconds: 900,
   *   accessLevel: 'READ_ONLY',
   * });
   * const serverUrl = `${process.env.SCALEKIT_ENVIRONMENT_URL}/mcp/v3/connections/gmail`;
   * // Hand serverUrl and session.token to your MCP client
   * ```
   */
  async createConnectionSessionToken(params: {
    connectionName: string;
    identifier: string;
    expirySeconds?: number;
    accessLevel?: McpSessionTokenAccessLevel;
  }): Promise<CreateMcpSessionTokenResponse> {
    if (!params.connectionName) {
      // An empty name would otherwise reach the server as "no target set".
      throw new Error('connectionName is required');
    }
    return this.coreClient.connectExec(
      this.client.createMcpSessionToken,
      create(CreateMcpSessionTokenRequestSchema, {
        keyId: params.connectionName,
        identifier: params.identifier,
        ...expiryField(params.expirySeconds),
        ...(params.accessLevel !== undefined && {
          accessLevel: params.accessLevel,
        }),
      })
    );
  }
}

/**
 * Validates `expirySeconds` and returns the request's `expiry` field, or no
 * field when it is omitted so the server applies its default.
 */
function expiryField(expirySeconds: number | undefined): {
  expiry?: MessageInitShape<typeof DurationSchema>;
} {
  if (expirySeconds === undefined) {
    return {};
  }
  if (!(Number.isInteger(expirySeconds) && expirySeconds > 0)) {
    // BigInt() below would otherwise throw an unhelpful RangeError.
    throw new Error(
      `expirySeconds must be a positive integer, got ${expirySeconds}`
    );
  }
  return {
    expiry: create(DurationSchema, { seconds: BigInt(expirySeconds) }),
  };
}
