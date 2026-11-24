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
const proxy_path_1 = require("./proxy-path");
const errors_1 = require("./errors");
const agentkit_connections_1 = require("./agentkit-connections");
const triggers_1 = require("./triggers");
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
const tools_pb_1 = require("./pkg/grpc/scalekit/v1/tools/tools_pb");
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
        /**
         * Trigger events delivered to your endpoint: verify and parse them with
         * `triggers.verifyEvent`. Needs no network access.
         */
        this.triggers = new triggers_1.TriggersClient();
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
     * Deletes one tool of a connector created from an OpenAPI spec, by its name or its ID.
     *
     * Use it to stop agents from calling one operation of a connector without changing the
     * connector's spec. The tool is gone when the call returns. It needs a workspace client with
     * the `agent_connectors:write` permission.
     *
     * `toolIdentifier` is the tool's name or its ID. The name is the one the tool is listed under,
     * `a-<connector name>_<operation>`, for example `a-acme_get_user`; capitals are folded to lower
     * case (ASCII letters only). The ID is `tol_` followed by a number, for example `tol_1234`: the
     * `id` of each tool that `actions.listTools({ provider })` returns for the connector (not in
     * summary mode). A value that starts with `tol_`, in any case, is always read as an ID.
     *
     * Only a tool of a connector created from an OpenAPI spec, in your own environment, can be
     * deleted. A tool of an MCP connector, a built-in tool, another environment's tool, a tool whose
     * connector no longer exists and a name or ID that matches nothing all fail the same way, with
     * `ScalekitNotFoundException`; the message does not say which.
     *
     * A sync that regenerates the tools (the spec, the base URL or the auth patterns changed since
     * the last completed run, or the spec references external files) creates the tool again while its
     * operation is still in the spec: to keep it deleted, remove its endpoint from the spec. A sync
     * of an unchanged connector changes no tools, so `actions.providers.invokeToolCollection` alone
     * does not bring a deleted tool back. While a sync of the connector is queued or running, the
     * call deletes nothing and fails with `ScalekitConflictException`: wait for the run with
     * `actions.providers.getToolCollectionRun`, then call again.
     *
     * This call is retried when the service is unavailable. Each attempt has its own tool-call
     * deadline (`toolTimeoutMs`). If the first attempt had already deleted the tool and only its
     * response was lost, the retry answers `ScalekitNotFoundException` although the tool was
     * deleted. A connection reset is not retried: it raises
     * `ScalekitServiceUnavailableException` at once, as does running out of retries, and the tool
     * may or may not be deleted. To check, list the connector's tools (follow `nextPageToken`): a
     * listing shows the current state, not what the first attempt did, so look for the tool's ID if
     * you know it: a sync can create the name again. A retry by name looks the name up again: if a
     * sync finished in between and created a tool with that name again, the retry deletes that one.
     * A tool a sync creates again has a new ID, so a retry by ID cannot delete it.
     *
     * @param params.toolIdentifier Name or ID of the tool. Surrounding whitespace is ignored. At
     *   most 2048 characters.
     * @returns Resolves once the tool is deleted.
     * @throws {ScalekitValidationError} If `toolIdentifier` is not a string, or is empty or blank.
     *   No request is sent.
     * @throws {ScalekitBadRequestException} If `toolIdentifier` is longer than 2048 characters or
     *   has a control character other than surrounding whitespace (the SDK trims that).
     * @throws {ScalekitBadRequestException} With the error code `FEATURE_NOT_ENABLED` if
     *   OpenAPI-sourced connectors are not enabled for your environment. Nothing is deleted.
     * @throws {ScalekitForbiddenException} If the client lacks the `agent_connectors:write`
     *   permission.
     * @throws {ScalekitNotFoundException} If no deletable tool has this name or ID
     *   (`custom tool not found`).
     * @throws {ScalekitConflictException} If a sync of the connector is queued or running (error
     *   code `RESOURCE_ALREADY_EXISTS`; the message names the connector, the run and its status):
     *   nothing is deleted, so call again once it has finished. Also, with the error code
     *   `TOOL_NAME_AMBIGUOUS`, when deleting by name and tools of more than one connector of your
     *   environment have this name (leftovers of an earlier connector): nothing is deleted, and the
     *   message names two of the connectors and the ID of each tool. Delete the tool by its ID.
     * @throws {ScalekitNotImplementedException} With HTTP status 501, on a backend older than
     *   release v0.1.165.0, which does not have this call.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    deleteCustomTool(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const toolIdentifier = typeof (params === null || params === void 0 ? void 0 : params.toolIdentifier) === 'string'
                ? params.toolIdentifier.trim()
                : '';
            if (!toolIdentifier) {
                throw new errors_1.ScalekitValidationError('toolIdentifier is required');
            }
            // Replayed after `Unavailable` like most calls. Deleting the same tool again changes nothing
            // (the replay answers NotFound if the first attempt had already deleted it), so unlike
            // `providers.invokeToolCollection` it does not need to be kept from `connectExec`'s retry.
            // A replay by name looks the name up again, though: see the doc comment above.
            yield this.coreClient.connectExec(this.tools.client.deleteCustomTool, (0, protobuf_1.create)(tools_pb_1.DeleteCustomToolRequestSchema, { toolIdentifier }), { timeoutMs: this.coreClient.toolTimeoutMs });
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
     * @param params.provider A connector's identifier. For a connector created from an
     *   OpenAPI spec, this lists its tools without a connected account.
     * @param params.query Searches tool names (3 to 100 characters, every word must appear in the
     *   name, ignoring case). It covers built-in tools only, never a custom connector's tools.
     * @param params.pageSize Defaults to 300 when omitted or 0. The maximum is 1000: a larger
     *   value (up to 4294967295, the most the API field holds) is reduced to 1000, not rejected.
     *   With `query`, a page holds at most 100 tools.
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
     * @param params.query Text to search for (up to 100 characters), ignoring case. With
     *                     `query`, only `connectionName` and the paging options narrow the
     *                     search; `identifier`, `provider`, `connectionNames` and
     *                     `isOrgWideCredential` are not applied, so use those without it.
     * @param params.isOrgWideCredential For connections that share one credential across the
     *                     organization: `true` returns only the account that holds that
     *                     shared credential, `false` returns only the per-user accounts.
     *                     Leave it out to get both.
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
                isOrgWideCredential: params === null || params === void 0 ? void 0 : params.isOrgWideCredential,
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
    get agentKitConnections() {
        var _a;
        (_a = this.agentKitConnectionsImpl) !== null && _a !== void 0 ? _a : (this.agentKitConnectionsImpl = new agentkit_connections_1.AgentKitConnections(this.connection));
        return this.agentKitConnectionsImpl;
    }
    /**
     * Creates an AgentKit connection.
     *
     * The connection type comes from the connector, so there is no `type`. The server fills in the
     * connector's URLs, PKCE setting and default scopes. Add credentials and options afterwards with
     * {@link ActionsClient.updateConnection}.
     *
     * @param params.provider Connector identifier, for example `'GMAIL'` (case-insensitive), or a custom connector's identifier.
     * @param params.connectionName Letters, digits and hyphens, unique per environment. Generated when omitted.
     * @param params.authMode `'USER'` (default) or `'ORG_WIDE'`. Cannot be changed later.
     * @param params.providerDomain Only for regional connectors such as MIXPANELMCP. Create only; never returned.
     * @returns The created connection. Secrets are masked.
     * @throws {ScalekitValidationError} If an argument is invalid; nothing is sent.
     * @throws {ScalekitAgentKitConnectionError} If the server refuses or fails the request. On
     *   `OUTCOME_UNKNOWN`, check {@link ActionsClient.listAppConnections} before creating again.
     *
     * @remarks A temporary `UNAVAILABLE` response is retried by the SDK like any other call, so a create
     * whose first attempt succeeded can come back as `CONNECTION_NAME_CONFLICT` when you pass a
     * `connectionName`. Read the connection to confirm.
     */
    createConnection(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.agentKitConnections.create(params);
        });
    }
    /**
     * Gets one AgentKit connection by name (case-insensitive) or by ID (`conn_...`).
     *
     * @param connection The name or ID as a string, or `{ connectionName }` / `{ connectionId }`.
     * @throws {ScalekitAgentKitConnectionError} `CONNECTION_NOT_FOUND` if no AgentKit connection matches.
     */
    getConnection(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.agentKitConnections.get(connection);
        });
    }
    /**
     * Lists AgentKit connections, newest first, as summaries (`id`, `connectionName`, `provider`,
     * `type`, `authMode`, `createTime`). Use {@link ActionsClient.getConnection} for the settings.
     *
     * This uses the AgentKit-only connection API and returns summaries only (no settings, no enabled
     * flag). It is not the same as {@link ActionsClient.listConnections} or
     * {@link ConnectionClient.listAppConnections} (`scalekit.connection.listAppConnections`), which use
     * the older API and are unchanged: this one matches `provider` case-insensitively, supports `query`,
     * and allows page sizes up to 100.
     *
     * @throws {ScalekitValidationError} If `query` is shorter than 3 characters.
     */
    listAppConnections(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.agentKitConnections.list(params);
        });
    }
    /**
     * Changes the settings of an AgentKit connection.
     *
     * Identify it with `connectionName` or `connectionId`; a name costs one extra read to find the ID.
     * Pass at most one of `oauth` or `googleDwd`. `providerConfigurations` goes with `oauth` or on its own,
     * never with `googleDwd`; you can also rename on its own. It is a true partial merge: a field you leave out keeps its stored value,
     * a masked secret sent back is ignored, and a list or map you pass empty (`scopes: []`,
     * `extraAuthorizeParams: {}`) is cleared. Sending your own `clientId` or `clientSecret` turns
     * `useScalekitCreds` off unless you set it. `providerDomain` cannot be changed.
     *
     * @throws {ScalekitValidationError} If the arguments are invalid; nothing is sent.
     * @throws {ScalekitAgentKitConnectionError} If the server refuses or fails the update.
     */
    updateConnection(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.agentKitConnections.update(params);
        });
    }
    /**
     * Deletes a connection.
     *
     * @throws {ScalekitAgentKitConnectionError} `CONNECTION_IN_USE` while connected accounts or MCP
     *   configurations still use it.
     */
    deleteConnection(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.agentKitConnections.delete((0, agentkit_connections_1.toRef)(connection));
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
     * @throws {Error} If `path` resolves outside the proxy prefix (`<environment URL>/proxy/`),
     *                 for example through `..` segments, encoded dots or control characters.
     *                 Checked before any network call; every other path is sent unchanged.
     *
     * @remarks Redirects returned by the proxied API are followed as before. A redirect
     * hop that leaves the proxy prefix (another origin, or a same-origin path outside
     * `<environment URL>/proxy/`) is sent without the client's `Authorization`,
     * `connection_name` and `identifier` headers. So is a hop sent through an HTTP
     * forward proxy whose redirect location carries a fragment.
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
            (0, proxy_path_1.assertProxyPathContained)(this.coreClient.envUrl, url);
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
                    // Redirects are still followed; credentials are not sent on a hop
                    // that leaves the proxy prefix.
                    beforeRedirect: (0, proxy_path_1.proxyRedirectGuard)(this.coreClient.envUrl),
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