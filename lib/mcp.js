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
     * @param options.pageSize Maximum number of configurations to return per page
     *   (max 30; a larger value fails with `[invalid_argument] Validation error`).
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
     * Mints a session token for one user, for either a Virtual MCP server or a
     * connection's own MCP server.
     *
     * Pass exactly one target:
     *
     * - `mcpConfigId`: the token works on that configuration's
     *   `config.mcpServerUrl` (see {@link McpClient.getConfig}).
     * - `connectionName`: the token works on the connection's own MCP server at
     *   `<environment URL>/mcp/v3/connections/<connection name>`, which exposes
     *   all of that connection's tools without an MCP configuration. The name is
     *   matched without regard to case, but the URL path is case-sensitive:
     *   build it from the connection's name exactly as stored.
     *
     * A token works only on the server it was minted for. The server URL is
     * static; the token is what carries user identity. Mint a fresh one before
     * every agent run and never reuse one across runs. Set the expiry longer
     * than the run is expected to take.
     *
     * For a connection, the user should have an active connected account on it.
     * When they do not, the server either rejects the call, or creates a pending
     * connected account and returns a token whose tool calls report the account
     * as not connected, depending on the environment.
     *
     * @param params.mcpConfigId ID of the configuration. Set this or
     * `connectionName`, not both.
     * @param params.connectionName Name of an AgentKit connection: the same
     * value used as `connectionName` elsewhere in the SDK. Set this or
     * `mcpConfigId`, not both.
     * @param params.identifier Your application's unique identifier for the user,
     * 1 to 255 characters.
     * @param params.expirySeconds Token lifetime in whole seconds. For a
     * connection, from 60 (1 minute) to 86400 (24 hours), defaulting to 3600
     * (1 hour) when omitted.
     * @param params.accessLevel Tools the token can use. `'READ_ONLY'` limits it
     * to tools annotated read-only: other tools are left out of the tool list
     * and refused when called. `'FULL'`, or omitting it, exposes every tool the
     * configuration or connection exposes.
     * @returns The session `token` and its `expiresAt` time.
     * @throws {Error} If not exactly one of `mcpConfigId` and `connectionName` is
     * set, the one set is empty, or `expirySeconds` is not a positive integer.
     * No request is sent.
     * @throws {ScalekitNotFoundException} If `connectionName` matches no active
     * connection.
     * @throws {ScalekitBadRequestException} If the request is otherwise rejected:
     * for example the connection is not an AgentKit connection, the identifier
     * or expiry is out of range, or (in environments that do not create pending
     * accounts) the user has no active connected account on the connection.
     * @throws {ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * ```typescript
     * // Virtual MCP server built from a configuration
     * const { config } = await scalekitClient.actions.mcp.getConfig(configId);
     * const session = await scalekitClient.actions.mcp.createSessionToken({
     *   mcpConfigId: configId,
     *   identifier: 'user_123',
     *   expirySeconds: 900,
     * });
     * // Hand config?.mcpServerUrl and session.token to your MCP client
     * ```
     *
     * @example
     * ```typescript
     * // A connection's own MCP server
     * const session = await scalekitClient.actions.mcp.createSessionToken({
     *   connectionName: 'gmail',
     *   identifier: 'user_123',
     *   expirySeconds: 900,
     *   accessLevel: 'READ_ONLY',
     * });
     * // The URL path is case-sensitive: use the connection's stored name.
     * const serverUrl = `${process.env.SCALEKIT_ENVIRONMENT_URL}/mcp/v3/connections/gmail`;
     * // Hand serverUrl and session.token to your MCP client
     * ```
     */
    createSessionToken(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.createMcpSessionToken, (0, protobuf_1.create)(mcp_pb_1.CreateMcpSessionTokenRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign({}, sessionTokenTarget(params)), { identifier: params.identifier }), expiryField(params.expirySeconds)), (params.accessLevel !== undefined && {
                accessLevel: params.accessLevel,
            }))));
        });
    }
}
exports.default = McpClient;
/**
 * Validates that exactly one session-token target is set and returns the
 * matching request field: `mcpConfigId` for a configuration, `keyId` for a
 * connection. The server requires exactly one of the two, so the other is
 * never set.
 */
function sessionTokenTarget(params) {
    // Checked at runtime too: plain JavaScript callers bypass the union type.
    const hasConfig = params.mcpConfigId != null;
    const hasConnection = params.connectionName != null;
    if (hasConfig === hasConnection) {
        throw new Error('Set exactly one of mcpConfigId or connectionName, ' +
            (hasConfig ? 'not both' : 'got neither'));
    }
    const name = hasConfig ? 'mcpConfigId' : 'connectionName';
    const value = hasConfig ? params.mcpConfigId : params.connectionName;
    if (typeof value !== 'string' || value === '') {
        throw new Error(`${name} must be a non-empty string`);
    }
    return hasConfig ? { mcpConfigId: value } : { keyId: value };
}
/**
 * Validates `expirySeconds` and returns the request's `expiry` field, or no
 * field when it is omitted so the server applies its default.
 */
function expiryField(expirySeconds) {
    if (expirySeconds === undefined) {
        return {};
    }
    if (!(Number.isInteger(expirySeconds) && expirySeconds > 0)) {
        // BigInt() below would otherwise throw an unhelpful RangeError.
        throw new Error(`expirySeconds must be a positive integer, got ${expirySeconds}`);
    }
    return {
        expiry: (0, protobuf_1.create)(wkt_1.DurationSchema, { seconds: BigInt(expirySeconds) }),
    };
}
//# sourceMappingURL=mcp.js.map