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
const axios_1 = require("axios");
const core_1 = require("./core");
const errors_1 = require("./errors");
const resumable_upload_1 = require("./resumable-upload");
const connections_pb_1 = require("./pkg/grpc/scalekit/v1/connections/connections_pb");
/**
 * Map a raw {@link ListConnection} proto message to the normalized
 * {@link AppConnection} shape exposed by the actions namespace.
 */
function mapAppConnection(connection) {
    var _a, _b;
    return {
        id: connection.id,
        type: (_a = connections_pb_1.ConnectionType[connection.type]) !== null && _a !== void 0 ? _a : String(connection.type),
        status: (_b = connections_pb_1.ConnectionStatus[connection.status]) !== null && _b !== void 0 ? _b : String(connection.status),
        enabled: connection.enabled,
        provider: connection.providerKey,
        connectionName: connection.keyId,
        createdAt: connection.createdAt,
    };
}
const connected_accounts_pb_1 = require("./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb");
/**
 * Map a raw {@link Tool} proto message to the normalized {@link ActionTool}
 * shape exposed by the actions namespace.
 */
function mapTool(tool) {
    return {
        id: tool.id,
        provider: tool.provider,
        definition: tool.definition,
        metadata: tool.metadata,
        tags: tool.tags,
        isDefault: tool.isDefault,
        updatedAt: tool.updatedAt,
    };
}
/**
 * This class is intended to be accessed via `ScalekitClient.actions`.
 * It composes the existing ToolsClient and ConnectedAccountsClient
 * without changing their behavior.
 */
class ActionsClient {
    /**
     * @param {ToolsClient} tools - Client used to execute tools on behalf of connected accounts.
     * @param {ConnectedAccountsClient} connectedAccounts - Client for connected-account lifecycle operations.
     * @param {CoreClient} coreClient - Shared core client (auth, HTTP, retries) used for proxied requests.
     * @param {ConnectionClient} connection - Client used to list app-level connections.
     */
    constructor(tools, connectedAccounts, coreClient, connection, 
    /** Virtual MCP servers: configurations, connected accounts and session tokens. */
    mcp, 
    /** Bring-your-own connectors: create, update, list and delete custom connectors. */
    providers) {
        this.tools = tools;
        this.connectedAccounts = connectedAccounts;
        this.coreClient = coreClient;
        this.connection = connection;
        this.mcp = mcp;
        this.providers = providers;
        /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
        this.upsertConnectedAccount = this.getOrCreateConnectedAccount.bind(this);
    }
    /**
     * Finds tools that fit a goal, ranked by relevance.
     *
     * Delegates to `tools.searchTools`. Prefer this over listing a connector:
     * binding a whole connector to a model is roughly 85k tokens of schema per
     * request, against about 700 for one search.
     *
     * Pass `identifier` and each result's `connections` carries that user's
     * `readinessState` per connection — check it before executing.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    searchTools(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tools.searchTools(query, options);
        });
    }
    /**
     * Lists tools for one identifier, narrowed by an explicit filter.
     *
     * Delegates to `tools.listScopedTools`. `options.filter` is required by the
     * server even though its fields are individually optional.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listScopedTools(identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tools.listScopedTools(identifier, options);
        });
    }
    /**
     * Lists every tool available to one identifier across their connections.
     *
     * Delegates to `tools.listAvailableTools`. Paginated — follow
     * `nextPageToken` if you need the complete set.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listAvailableTools(identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tools.listAvailableTools(identifier, options);
        });
    }
    /**
     * Execute a tool on behalf of a connected account.
     *
     * Thin wrapper around ToolsClient.executeTool, reserved for future
     * pre/post modifier support.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If toolName is missing or an unexpected error occurs.
     */
    executeTool(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { toolName, toolInput, identifier, connectedAccountId, connector, organizationId, userId, } = params;
            if (!(toolName === null || toolName === void 0 ? void 0 : toolName.trim())) {
                throw new Error('toolName is required');
            }
            return this.tools.executeTool({
                toolName,
                identifier,
                params: toolInput,
                connectedAccountId,
                connector,
                organizationId,
                userId,
            });
        });
    }
    /**
     * List tools available in your workspace, optionally scoped to a connected account.
     *
     * Thin wrapper around ToolsClient.listTools. Use `connectedAccountId` as a
     * direct alternative to the `connectionName` + `identifier` combination.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listTools(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionName, identifier, provider, toolName, query, organizationId, userId, connectedAccountId, summary, pageSize, pageToken, } = params !== null && params !== void 0 ? params : {};
            const response = yield this.tools.listTools({
                filter: {
                    connector: connectionName,
                    identifier,
                    provider,
                    toolName,
                    query,
                    organizationId,
                    userId,
                    connectedAccountId,
                    summary,
                },
                pageSize,
                pageToken,
            });
            return {
                tools: response.tools.map(mapTool),
                toolNames: response.toolNames,
                nextPageToken: response.nextPageToken,
                prevPageToken: response.prevPageToken,
                totalSize: response.totalSize,
            };
        });
    }
    /**
     * Get an authorization magic link for a connected account.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    getAuthorizationLink(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionName, identifier, connectedAccountId, organizationId, userId, state, userVerifyUrl, } = params;
            return this.connectedAccounts.getMagicLinkForConnectedAccount({
                connector: connectionName,
                identifier,
                organizationId,
                userId,
                connectedAccountId,
                state,
                userVerifyUrl,
            });
        });
    }
    /**
     * Verify the connected account user after OAuth callback.
     *
     * Called by the B2B app server with the `authRequestId` from the user verify
     * redirect URL and the current user's identifier. Activates the connected account
     * once the asserted identifier is confirmed.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    verifyConnectedAccountUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connectedAccounts.verifyConnectedAccountUser(params);
        });
    }
    /**
     * List connected accounts with optional filters.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listConnectedAccounts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connectedAccounts.listConnectedAccounts({
                organizationId: params === null || params === void 0 ? void 0 : params.organizationId,
                userId: params === null || params === void 0 ? void 0 : params.userId,
                connector: params === null || params === void 0 ? void 0 : params.connectionName,
                identifier: params === null || params === void 0 ? void 0 : params.identifier,
                provider: params === null || params === void 0 ? void 0 : params.provider,
                pageSize: params === null || params === void 0 ? void 0 : params.pageSize,
                pageToken: params === null || params === void 0 ? void 0 : params.pageToken,
                query: params === null || params === void 0 ? void 0 : params.query,
                connectionNames: params === null || params === void 0 ? void 0 : params.connectionNames,
            });
        });
    }
    /**
     * List app-level connections with optional pagination and provider filtering.
     *
     * Delegates to {@link ConnectionClient.listAppConnections} and returns a
     * normalized {@link ListAppConnectionsResult}: internal proto fields are
     * dropped and enum fields are decoded to strings. These are the connections
     * defined at the application level (e.g. tool/provider integrations), not the
     * SSO connections scoped to a specific organization.
     *
     * @param {object} [params] - Optional pagination and filtering parameters
     * @param {number} [params.pageSize] - Maximum number of connections to return per page (max 30)
     * @param {string} [params.pageToken] - Token identifying the page of results to return
     * @param {string} [params.provider] - Filter by provider key (case-sensitive, e.g. "SALESFORCE", "GMAIL")
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listConnections(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.connection.listAppConnections({
                pageSize: params === null || params === void 0 ? void 0 : params.pageSize,
                pageToken: params === null || params === void 0 ? void 0 : params.pageToken,
                provider: params === null || params === void 0 ? void 0 : params.provider,
            });
            return {
                connections: response.connections.map(mapAppConnection),
                nextPageToken: response.nextPageToken,
                prevPageToken: response.prevPageToken,
                totalSize: response.totalSize,
            };
        });
    }
    /**
     * Delete a connected account.
     * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    deleteConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionName, identifier, connectedAccountId, organizationId, userId, } = params;
            const trimmedConnectionName = connectionName === null || connectionName === void 0 ? void 0 : connectionName.trim();
            const trimmedIdentifier = identifier === null || identifier === void 0 ? void 0 : identifier.trim();
            const trimmedConnectedAccountId = connectedAccountId === null || connectedAccountId === void 0 ? void 0 : connectedAccountId.trim();
            if (!trimmedConnectedAccountId &&
                !(trimmedConnectionName && trimmedIdentifier)) {
                throw new Error('either connectedAccountId or connectionName + identifier is required');
            }
            return this.connectedAccounts.deleteConnectedAccount({
                connector: trimmedConnectionName,
                identifier: trimmedIdentifier,
                organizationId,
                userId,
                connectedAccountId: trimmedConnectedAccountId,
            });
        });
    }
    /**
     * Get connected account authorization details.
     * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    getConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionName, identifier, connectedAccountId, organizationId, userId, } = params;
            const trimmedConnectionName = connectionName === null || connectionName === void 0 ? void 0 : connectionName.trim();
            const trimmedIdentifier = identifier === null || identifier === void 0 ? void 0 : identifier.trim();
            const trimmedConnectedAccountId = connectedAccountId === null || connectedAccountId === void 0 ? void 0 : connectedAccountId.trim();
            if (!trimmedConnectedAccountId &&
                !(trimmedConnectionName && trimmedIdentifier)) {
                throw new Error('either connectedAccountId or connectionName + identifier is required');
            }
            return this.connectedAccounts.getConnectedAccountByIdentifier({
                connector: trimmedConnectionName,
                identifier: trimmedIdentifier,
                organizationId,
                userId,
                connectedAccountId: trimmedConnectedAccountId,
            });
        });
    }
    /**
     * Create a new connected account.
     *
     * This helper accepts a high-level payload and builds the
     * underlying CreateConnectedAccount message.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If connectionName or identifier is missing.
     */
    createConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionName, identifier, authorizationDetails, organizationId, userId, apiConfig, } = params;
            if (!(connectionName === null || connectionName === void 0 ? void 0 : connectionName.trim())) {
                throw new Error('connectionName is required');
            }
            if (!(identifier === null || identifier === void 0 ? void 0 : identifier.trim())) {
                throw new Error('identifier is required');
            }
            const connectedAccount = (0, protobuf_1.create)(connected_accounts_pb_1.CreateConnectedAccountSchema, Object.assign({ authorizationDetails }, (apiConfig != null && {
                apiConfig: apiConfig,
            })));
            return this.connectedAccounts.createConnectedAccount({
                connector: connectionName,
                identifier,
                connectedAccount,
                organizationId,
                userId,
            });
        });
    }
    /**
     * Get an existing connected account or create a new one if it doesn't exist.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If connectionName or identifier is missing.
     */
    getOrCreateConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionName, identifier, authorizationDetails, organizationId, userId, apiConfig, } = params;
            if (!(connectionName === null || connectionName === void 0 ? void 0 : connectionName.trim())) {
                throw new Error('connectionName is required');
            }
            if (!(identifier === null || identifier === void 0 ? void 0 : identifier.trim())) {
                throw new Error('identifier is required');
            }
            return this.connectedAccounts.getOrCreateConnectedAccount({
                connector: connectionName.trim(),
                identifier: identifier.trim(),
                authorizationDetails,
                organizationId,
                userId,
                apiConfig,
            });
        });
    }
    /**
     * Update an existing connected account.
     * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    updateConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionName, identifier, authorizationDetails, organizationId, userId, connectedAccountId, apiConfig, } = params;
            const trimmedConnectionName = connectionName === null || connectionName === void 0 ? void 0 : connectionName.trim();
            const trimmedIdentifier = identifier === null || identifier === void 0 ? void 0 : identifier.trim();
            const trimmedConnectedAccountId = connectedAccountId === null || connectedAccountId === void 0 ? void 0 : connectedAccountId.trim();
            if (!trimmedConnectedAccountId &&
                !(trimmedConnectionName && trimmedIdentifier)) {
                throw new Error('either connectedAccountId or connectionName + identifier is required');
            }
            const connectedAccount = (0, protobuf_1.create)(connected_accounts_pb_1.UpdateConnectedAccountSchema, Object.assign(Object.assign({}, (authorizationDetails && { authorizationDetails })), (apiConfig != null && { apiConfig })));
            return this.connectedAccounts.updateConnectedAccount({
                connector: trimmedConnectionName,
                identifier: trimmedIdentifier,
                connectedAccount,
                organizationId,
                userId,
                connectedAccountId: trimmedConnectedAccountId,
            });
        });
    }
    /**
     * Make a proxied REST API call on behalf of a connected account.
     *
     * @param params.timeoutMs Per-call request timeout in ms. Defaults to `toolTimeoutMs`
     *                         from the `ScalekitClient` constructor options (60000 by
     *                         default), since this proxies to a third-party API and can
     *                         legitimately run longer than a typical control-plane call.
     * @throws {ScalekitGatewayTimeoutException} If the request exceeds the timeout.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing or an unexpected error occurs.
     */
    request(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionName, identifier, path, method = 'GET', queryParams, body, formData, headers, timeoutMs, } = params;
            if (!(connectionName === null || connectionName === void 0 ? void 0 : connectionName.trim())) {
                throw new Error('connectionName is required');
            }
            if (!(identifier === null || identifier === void 0 ? void 0 : identifier.trim())) {
                throw new Error('identifier is required');
            }
            if (!(path === null || path === void 0 ? void 0 : path.trim())) {
                throw new Error('path is required');
            }
            const normalizedPath = path.startsWith('/') ? path : `/${path}`;
            const url = `${this.coreClient.envUrl.replace(/\/$/, '')}/proxy${normalizedPath}`;
            if (timeoutMs !== undefined) {
                (0, core_1.assertValidTimeout)('timeoutMs', timeoutMs);
            }
            const timeout = timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : this.coreClient.toolTimeoutMs;
            const proxyHeaders = Object.assign(Object.assign({}, (headers !== null && headers !== void 0 ? headers : {})), { connection_name: connectionName, identifier });
            try {
                return yield this.coreClient.axios.request({
                    url,
                    method: method.toUpperCase(),
                    params: queryParams,
                    data: body !== null && body !== void 0 ? body : formData,
                    headers: proxyHeaders,
                    timeout,
                });
            }
            catch (error) {
                if (error instanceof errors_1.ScalekitException)
                    throw error;
                if (error instanceof axios_1.AxiosError) {
                    if (error.response)
                        throw errors_1.ScalekitServerException.promote(error.response);
                    // Same exception type as a gRPC deadline expiry, so callers handle
                    // both timeout paths uniformly.
                    if (errors_1.ScalekitGatewayTimeoutException.isAxiosTimeout(error)) {
                        throw errors_1.ScalekitGatewayTimeoutException.fromAxiosTimeout(error);
                    }
                    throw new errors_1.ScalekitException(error);
                }
                throw new errors_1.ScalekitException(error);
            }
        });
    }
    /**
     * Upload a file of any size to a Google API that supports resumable
     * uploads (Drive v3, the Cloud Storage JSON API, YouTube Data API) through
     * a connected account.
     *
     * The content is sent in chunks (4 MiB by default), one request each, so
     * no single request runs long. After a timeout, a connection error or HTTP
     * 408, 429, 500, 502, 503 or 504, the SDK waits, asks the server how many
     * bytes it has and resumes from there instead of restarting. After a 308
     * that commits no new bytes, it waits and resends from the offset that 308
     * reported, without asking first. The session-start request is never
     * retried, because a retry would open a second session.
     *
     * Content can be bytes or a stream. A stream is read one chunk at a time
     * and never buffered whole. Its size is known for an unread
     * `fs.createReadStream(path)` without `start`/`end`; otherwise pass
     * `totalBytes`, or let the SDK send the size with the last chunk. Errors
     * from reading the stream propagate unchanged.
     *
     * @param params - What to upload and where. `connectionName`, `identifier`,
     *   `path` and `data` are required; see {@link ResumableUploadParams}.
     * @param options - Cancellation, timeout, retries and progress; see
     *   {@link ResumableUploadOptions}.
     * @returns The created or updated resource from the final response, such
     *   as the Drive file object (`{}` when that response has no body).
     * @throws {ScalekitValidationError} If an argument is invalid (before any
     *   request is sent), or if a stream is shorter or longer than `totalBytes`.
     * @throws {ScalekitUploadSessionExpiredException} If the upload session
     *   expired or no longer exists (HTTP 404/410 on a chunk). Upload again.
     * @throws {ScalekitUploadHttpException} If the session-start request fails,
     *   a chunk gets any other 4xx or 5xx (such as 403, 501 or 505) or a 2xx
     *   other than 200/201, or a retryable (408, 429, 500, 502, 503, 504)
     *   status persists after
     *   `maxRetries` retries. `status`, `headers` and `body` describe the response.
     * @throws {ScalekitUploadTimeoutException} If a request times out (a chunk:
     *   after `maxRetries` retries).
     * @throws {ScalekitUploadConnectionException} If a request gets no response
     *   (a chunk: after `maxRetries` retries).
     * @throws {ScalekitUploadProtocolException} If a response breaks the
     *   resumable protocol: the upload completes before the last chunk is sent,
     *   a chunk still commits no new bytes after `maxRetries` retries, or the
     *   final body is not a JSON object.
     * @throws {ScalekitAbortError} If `options.signal` is aborted.
     * @throws {ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * ```ts
     * import fs from 'node:fs';
     *
     * const file = await scalekit.actions.uploadResumable(
     *   {
     *     connectionName: 'googledrive',
     *     identifier: 'user_123',
     *     path: '/upload/drive/v3/files',
     *     data: fs.createReadStream('video.mp4'),
     *     contentType: 'video/mp4',
     *     metadata: { name: 'video.mp4' },
     *   },
     *   { onProgress: (p) => console.log(p.bytesCommitted, p.totalBytes) }
     * );
     * console.log(file.id);
     * ```
     */
    uploadResumable(params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, resumable_upload_1.uploadResumable)(this.coreClient, params, options);
        });
    }
}
exports.default = ActionsClient;
//# sourceMappingURL=actions.js.map