import { type MessageInitShape } from '@bufbuild/protobuf';
import GrpcConnect from './connect';
import CoreClient from './core';
import { CreateMcpConfigResponse, CreateMcpSessionTokenResponse, DeleteMcpConfigResponse, GetMcpConfigResponse, ListMcpConfigsResponse, ListMcpConnectedAccountsResponse, McpConfigSchema, UpdateMcpConfigRequestSchema, UpdateMcpConfigResponse } from './pkg/grpc/scalekit/v1/mcp/mcp_pb';
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
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
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
    createConfig(params: {
        name: string;
        description?: string;
        connectionToolMappings?: MessageInitShape<typeof McpConfigSchema>['connectionToolMappings'];
    }): Promise<CreateMcpConfigResponse>;
    /**
     * Fetches a single MCP configuration by ID.
     *
     * @param configId ID of the configuration to fetch (`cfg_...`).
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    getConfig(configId: string): Promise<GetMcpConfigResponse>;
    /**
     * Lists MCP configurations for the current environment.
     *
     * @param options.search Free-text search across configuration metadata.
     * @param options.pageSize Maximum number of configurations to return per page.
     * @param options.pageToken Token from a previous `listConfigs` response.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listConfigs(options?: {
        search?: string;
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListMcpConfigsResponse>;
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
    updateConfig(params: {
        configId: string;
        description?: string;
        connectionToolMappings?: MessageInitShape<typeof UpdateMcpConfigRequestSchema>['connectionToolMappings'];
    }): Promise<UpdateMcpConfigResponse>;
    /**
     * Deletes an MCP configuration.
     *
     * @param configId ID of the configuration to delete.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    deleteConfig(configId: string): Promise<DeleteMcpConfigResponse>;
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
    listConnectedAccounts(params: {
        configId: string;
        identifier: string;
        includeAuthLink?: boolean;
    }): Promise<ListMcpConnectedAccountsResponse>;
    /**
     * Mints a session token for one user against one configuration.
     *
     * The server URL is static; this token is what carries user identity. Mint a
     * fresh one before every agent run and never reuse one across runs. Set the
     * expiry longer than the run is expected to take.
     *
     * @param params.mcpConfigId ID of the configuration.
     * @param params.identifier Your application's unique identifier for the user.
     * @param params.expirySeconds Token lifetime in seconds.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createSessionToken(params: {
        mcpConfigId: string;
        identifier: string;
        expirySeconds?: number;
    }): Promise<CreateMcpSessionTokenResponse>;
}
