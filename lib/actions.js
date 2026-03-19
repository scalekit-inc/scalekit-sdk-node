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
const connected_accounts_pb_1 = require("./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb");
/**
 * This class is intended to be accessed via `ScalekitClient.actions`.
 * It composes the existing ToolsClient and ConnectedAccountsClient
 * without changing their behavior.
 */
class ActionsClient {
    constructor(tools, connectedAccounts, coreClient) {
        this.tools = tools;
        this.connectedAccounts = connectedAccounts;
        this.coreClient = coreClient;
    }
    /**
     * Execute a tool on behalf of a connected account.
     *
     * Thin wrapper around ToolsClient.executeTool, reserved for future
     * pre/post modifier support.
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
     * Get an authorization magic link for a connected account.
     */
    getAuthorizationLink(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionName, identifier, connectedAccountId, organizationId, userId, } = params;
            return this.connectedAccounts.getMagicLinkForConnectedAccount({
                connector: connectionName,
                identifier,
                organizationId,
                userId,
                connectedAccountId,
            });
        });
    }
    /**
     * List connected accounts with optional filters.
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
            });
        });
    }
    /**
     * Delete a connected account.
     * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
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
            const timeout = timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 30000;
            const proxyHeaders = Object.assign(Object.assign({}, (headers !== null && headers !== void 0 ? headers : {})), { connection_name: connectionName, Connection_name: connectionName, identifier });
            return this.coreClient.connectExec((config) => this.coreClient.axios.request(config), {
                url,
                method: method.toUpperCase(),
                params: queryParams,
                data: body !== null && body !== void 0 ? body : formData,
                headers: proxyHeaders,
                timeout,
            });
        });
    }
}
exports.default = ActionsClient;
//# sourceMappingURL=actions.js.map