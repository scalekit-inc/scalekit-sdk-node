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
const errors_1 = require("./errors");
const connected_accounts_pb_1 = require("./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb");
/**
 * Client for managing connected accounts for third-party integrations.
 *
 * This mirrors the Python SDK `ConnectedAccountsClient` and exposes a typed,
 * ergonomic API around the `ConnectedAccountService` to:
 * - list connected accounts
 * - create/update/delete connected accounts
 * - generate magic links for authorization
 * - fetch full authentication details for a connected account
 */
class ConnectedAccountsClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(connected_accounts_pb_1.ConnectedAccountService);
    }
    /**
     * Lists connected accounts with optional filters and pagination.
     *
     * @param options Optional filtering and pagination parameters
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listConnectedAccounts(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            return this.coreClient.connectExec(this.client.listConnectedAccounts, (0, protobuf_1.create)(connected_accounts_pb_1.ListConnectedAccountsRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.organizationId) && {
                organizationId: options.organizationId,
            })), ((options === null || options === void 0 ? void 0 : options.userId) && { userId: options.userId })), (((_a = options === null || options === void 0 ? void 0 : options.connector) === null || _a === void 0 ? void 0 : _a.trim()) && {
                connector: options.connector.trim(),
            })), (((_b = options === null || options === void 0 ? void 0 : options.identifier) === null || _b === void 0 ? void 0 : _b.trim()) && {
                identifier: options.identifier.trim(),
            })), (((_c = options === null || options === void 0 ? void 0 : options.provider) === null || _c === void 0 ? void 0 : _c.trim()) && { provider: options.provider.trim() })), ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined && { pageSize: options.pageSize })), ((options === null || options === void 0 ? void 0 : options.pageToken) && { pageToken: options.pageToken })), ((options === null || options === void 0 ? void 0 : options.query) && { query: options.query }))));
        });
    }
    /**
     * Creates a new connected account.
     *
     * @param params Connected account creation parameters
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, connectedAccount, organizationId, userId } = params;
            return this.coreClient.connectExec(this.client.createConnectedAccount, (0, protobuf_1.create)(connected_accounts_pb_1.CreateConnectedAccountRequestSchema, Object.assign(Object.assign({ connector,
                identifier,
                connectedAccount }, (organizationId && { organizationId })), (userId && { userId }))));
        });
    }
    /**
     * Gets an existing connected account by connector and identifier, or creates one if none exists.
     * Mirrors the Python SDK `get_or_create_connected_account`. When creating, the backend may require
     * valid authorization details; if omitted, a minimal payload is sent and the server may return
     * a validation error.
     *
     * @param params Get-or-create parameters
     * @param params.connector Connector identifier (required)
     * @param params.identifier Connected account identifier (required)
     * @param params.authorizationDetails Optional auth details for the create path (OAuth token or static auth)
     * @param params.organizationId Optional organization ID
     * @param params.userId Optional user ID
     * @param params.apiConfig Optional API config for the create path
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If connector or identifier is missing.
     */
    getOrCreateConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector: rawConnector, identifier: rawIdentifier, authorizationDetails, organizationId, userId, apiConfig, } = params;
            const connector = rawConnector === null || rawConnector === void 0 ? void 0 : rawConnector.trim();
            const identifier = rawIdentifier === null || rawIdentifier === void 0 ? void 0 : rawIdentifier.trim();
            if (!connector) {
                throw new Error('connector is required');
            }
            if (!identifier) {
                throw new Error('identifier is required');
            }
            try {
                const getResponse = yield this.getConnectedAccountByIdentifier({
                    connector,
                    identifier,
                    organizationId,
                    userId,
                });
                return (0, protobuf_1.create)(connected_accounts_pb_1.CreateConnectedAccountResponseSchema, {
                    connectedAccount: getResponse.connectedAccount,
                });
            }
            catch (err) {
                if (!(err instanceof errors_1.ScalekitNotFoundException)) {
                    throw err;
                }
            }
            const resolvedAuthDetails = authorizationDetails
                ? (0, protobuf_1.create)(connected_accounts_pb_1.AuthorizationDetailsSchema, authorizationDetails)
                : (0, protobuf_1.create)(connected_accounts_pb_1.AuthorizationDetailsSchema, {
                    details: { case: 'oauthToken', value: (0, protobuf_1.create)(connected_accounts_pb_1.OauthTokenSchema, {}) },
                });
            const connectedAccountPayload = (0, protobuf_1.create)(connected_accounts_pb_1.CreateConnectedAccountSchema, Object.assign({ authorizationDetails: resolvedAuthDetails }, (apiConfig != null && {
                apiConfig: apiConfig,
            })));
            return this.createConnectedAccount({
                connector,
                identifier,
                connectedAccount: connectedAccountPayload,
                organizationId,
                userId,
            });
        });
    }
    /**
     * Updates an existing connected account.
     *
     * You can target the account either by `connectedAccountId` alone, or by the
     * combination of `connector` and `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    updateConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, connectedAccount, organizationId, userId, connectedAccountId, } = params;
            if (!connectedAccountId && !((connector === null || connector === void 0 ? void 0 : connector.trim()) && (identifier === null || identifier === void 0 ? void 0 : identifier.trim()))) {
                throw new Error('either connectedAccountId or connector + identifier is required');
            }
            return this.coreClient.connectExec(this.client.updateConnectedAccount, (0, protobuf_1.create)(connected_accounts_pb_1.UpdateConnectedAccountRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((connector === null || connector === void 0 ? void 0 : connector.trim()) && { connector: connector.trim() })), ((identifier === null || identifier === void 0 ? void 0 : identifier.trim()) && { identifier: identifier.trim() })), { connectedAccount }), (organizationId && { organizationId })), (userId && { userId })), (connectedAccountId && { id: connectedAccountId }))));
        });
    }
    /**
     * Deletes a connected account and revokes its credentials.
     *
     * You can target the account either by `connectedAccountId` alone, or by the
     * combination of `connector` and `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    deleteConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, organizationId, userId, connectedAccountId, } = params;
            if (!connectedAccountId && !((connector === null || connector === void 0 ? void 0 : connector.trim()) && (identifier === null || identifier === void 0 ? void 0 : identifier.trim()))) {
                throw new Error('either connectedAccountId or connector + identifier is required');
            }
            return this.coreClient.connectExec(this.client.deleteConnectedAccount, (0, protobuf_1.create)(connected_accounts_pb_1.DeleteConnectedAccountRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((connector === null || connector === void 0 ? void 0 : connector.trim()) && { connector: connector.trim() })), ((identifier === null || identifier === void 0 ? void 0 : identifier.trim()) && { identifier: identifier.trim() })), (organizationId && { organizationId })), (userId && { userId })), (connectedAccountId && { id: connectedAccountId }))));
        });
    }
    /**
     * Generates a time-limited magic link for connecting or re-authorizing a third-party account.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    getMagicLinkForConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, organizationId, userId, connectedAccountId, } = params;
            return this.coreClient.connectExec(this.client.getMagicLinkForConnectedAccount, (0, protobuf_1.create)(connected_accounts_pb_1.GetMagicLinkForConnectedAccountRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (connector && { connector })), (identifier && { identifier })), (organizationId && { organizationId })), (userId && { userId })), (connectedAccountId && { id: connectedAccountId }))));
        });
    }
    /**
     * Retrieves complete authentication details for a connected account.
     *
     * This method returns sensitive credential information, so ensure you protect access
     * to this in your application.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitNotFoundException} If no matching connected account is found.
     */
    getConnectedAccountByIdentifier(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, organizationId, userId, connectedAccountId, } = params;
            return this.coreClient.connectExec(this.client.getConnectedAccountAuth, (0, protobuf_1.create)(connected_accounts_pb_1.GetConnectedAccountByIdentifierRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (connector && { connector })), (identifier && { identifier })), (organizationId && { organizationId })), (userId && { userId })), (connectedAccountId && { id: connectedAccountId }))));
        });
    }
}
exports.default = ConnectedAccountsClient;
//# sourceMappingURL=connected-accounts.js.map