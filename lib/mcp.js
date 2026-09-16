"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const protobuf_1 = require("@bufbuild/protobuf");
const wkt_1 = require("@bufbuild/protobuf/wkt");
const mcp_pb_1 = require("./pkg/grpc/scalekit/v1/mcp/mcp_pb");
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
class McpClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(mcp_pb_1.McpService);
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
    createConfig(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.createMcpConfig, (0, protobuf_1.create)(mcp_pb_1.CreateMcpConfigRequestSchema, {
                config: (0, protobuf_1.create)(mcp_pb_1.McpConfigSchema, Object.assign(Object.assign({ name: params.name }, (params.description !== undefined && {
                    description: params.description,
                })), (params.connectionToolMappings && {
                    connectionToolMappings: params.connectionToolMappings,
                }))),
            }));
        });
    }
    /**
     * Fetches a single MCP configuration by ID.
     *
     * @param configId ID of the configuration to fetch (`cfg_...`).
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    getConfig(configId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getMcpConfig, (0, protobuf_1.create)(mcp_pb_1.GetMcpConfigRequestSchema, { configId }));
        });
    }
    /**
     * Lists MCP configurations for the current environment.
     *
     * @param options.search Free-text search across configuration metadata.
     * @param options.pageSize Maximum number of configurations to return per page.
     * @param options.pageToken Token from a previous `listConfigs` response.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listConfigs(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listMcpConfigs, (0, protobuf_1.create)(mcp_pb_1.ListMcpConfigsRequestSchema, Object.assign(Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.search) && { search: options.search })), ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined && { pageSize: options.pageSize })), ((options === null || options === void 0 ? void 0 : options.pageToken) && { pageToken: options.pageToken }))));
        });
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
    updateConfig(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.updateMcpConfig, (0, protobuf_1.create)(mcp_pb_1.UpdateMcpConfigRequestSchema, Object.assign(Object.assign({ configId: params.configId }, (params.description !== undefined && {
                description: params.description,
            })), (params.connectionToolMappings && {
                connectionToolMappings: params.connectionToolMappings,
            }))));
        });
    }
    /**
     * Deletes an MCP configuration.
     *
     * @param configId ID of the configuration to delete.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    deleteConfig(configId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteMcpConfig, (0, protobuf_1.create)(mcp_pb_1.DeleteMcpConfigRequestSchema, { configId }));
        });
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
    listConnectedAccounts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listMcpConnectedAccounts, (0, protobuf_1.create)(mcp_pb_1.ListMcpConnectedAccountsRequestSchema, Object.assign({ configId: params.configId, identifier: params.identifier }, (params.includeAuthLink !== undefined && {
                includeAuthLink: params.includeAuthLink,
            }))));
        });
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
     * @param params.expirySeconds Token lifetime in seconds.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createSessionToken(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.createMcpSessionToken, (0, protobuf_1.create)(mcp_pb_1.CreateMcpSessionTokenRequestSchema, Object.assign({ mcpConfigId: params.mcpConfigId, identifier: params.identifier }, (params.expirySeconds !== undefined && {
                expiry: (0, protobuf_1.create)(wkt_1.DurationSchema, {
                    seconds: BigInt(params.expirySeconds),
                }),
            }))));
        });
    }
}
exports.default = McpClient;
//# sourceMappingURL=mcp.js.map