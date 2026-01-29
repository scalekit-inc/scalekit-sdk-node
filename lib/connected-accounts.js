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
const errors_1 = require("./errors");
const connected_accounts_connect_1 = require("./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_connect");
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
        this.client = this.grpcConnect.createClient(connected_accounts_connect_1.ConnectedAccountService);
    }
    /**
     * Lists connected accounts with optional filters and pagination.
     *
     * @param options Optional filtering and pagination parameters
     */
    listConnectedAccounts(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {};
            if (options === null || options === void 0 ? void 0 : options.organizationId) {
                request.organizationId = options.organizationId;
            }
            if (options === null || options === void 0 ? void 0 : options.userId) {
                request.userId = options.userId;
            }
            if (options === null || options === void 0 ? void 0 : options.connector) {
                request.connector = options.connector;
            }
            if (options === null || options === void 0 ? void 0 : options.identifier) {
                request.identifier = options.identifier;
            }
            if (options === null || options === void 0 ? void 0 : options.provider) {
                request.provider = options.provider;
            }
            if ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined) {
                request.pageSize = options.pageSize;
            }
            if (options === null || options === void 0 ? void 0 : options.pageToken) {
                request.pageToken = options.pageToken;
            }
            if (options === null || options === void 0 ? void 0 : options.query) {
                request.query = options.query;
            }
            return this.coreClient.connectExec(this.client.listConnectedAccounts, request);
        });
    }
    /**
     * Creates a new connected account.
     *
     * @param params Connected account creation parameters
     */
    createConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, connectedAccount, organizationId, userId, } = params;
            const request = {
                connector,
                identifier,
                connectedAccount,
            };
            if (organizationId) {
                request.organizationId = organizationId;
            }
            if (userId) {
                request.userId = userId;
            }
            return this.coreClient.connectExec(this.client.createConnectedAccount, request);
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
     */
    getOrCreateConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, authorizationDetails, organizationId, userId, apiConfig, } = params;
            if (!(connector === null || connector === void 0 ? void 0 : connector.trim())) {
                throw new Error("connector is required");
            }
            if (!(identifier === null || identifier === void 0 ? void 0 : identifier.trim())) {
                throw new Error("identifier is required");
            }
            try {
                const getResponse = yield this.getConnectedAccountByIdentifier({
                    connector,
                    identifier,
                    organizationId,
                    userId,
                });
                return new connected_accounts_pb_1.CreateConnectedAccountResponse({
                    connectedAccount: getResponse.connectedAccount,
                });
            }
            catch (err) {
                if (!(err instanceof errors_1.ScalekitNotFoundException)) {
                    throw err;
                }
            }
            const connectedAccountPayload = new connected_accounts_pb_1.CreateConnectedAccount(Object.assign({ authorizationDetails: authorizationDetails
                    ? authorizationDetails
                    : new connected_accounts_pb_1.AuthorizationDetails({
                        details: { case: "oauthToken", value: new connected_accounts_pb_1.OauthToken({}) },
                    }) }, (apiConfig != null && { apiConfig: apiConfig })));
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
     * You can target the account either by `connectedAccountId` or by the combination
     * of `organizationId`/`userId`, `connector`, and `identifier`.
     */
    updateConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, connectedAccount, organizationId, userId, connectedAccountId, } = params;
            const request = {
                connector,
                identifier,
                connectedAccount,
            };
            if (organizationId) {
                request.organizationId = organizationId;
            }
            if (userId) {
                request.userId = userId;
            }
            if (connectedAccountId) {
                request.id = connectedAccountId;
            }
            return this.coreClient.connectExec(this.client.updateConnectedAccount, request);
        });
    }
    /**
     * Deletes a connected account and revokes its credentials.
     *
     * You can target the account either by `connectedAccountId` or by the combination
     * of `organizationId`/`userId`, `connector`, and `identifier`.
     */
    deleteConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, organizationId, userId, connectedAccountId } = params;
            const request = {
                connector,
                identifier,
            };
            if (organizationId) {
                request.organizationId = organizationId;
            }
            if (userId) {
                request.userId = userId;
            }
            if (connectedAccountId) {
                request.id = connectedAccountId;
            }
            return this.coreClient.connectExec(this.client.deleteConnectedAccount, request);
        });
    }
    /**
     * Generates a time-limited magic link for connecting or re-authorizing a third-party account.
     */
    getMagicLinkForConnectedAccount(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, organizationId, userId, connectedAccountId } = params;
            const request = {
                connector,
                identifier,
            };
            if (organizationId) {
                request.organizationId = organizationId;
            }
            if (userId) {
                request.userId = userId;
            }
            if (connectedAccountId) {
                request.id = connectedAccountId;
            }
            return this.coreClient.connectExec(this.client.getMagicLinkForConnectedAccount, request);
        });
    }
    /**
     * Retrieves complete authentication details for a connected account.
     *
     * This method returns sensitive credential information, so ensure you protect access
     * to this in your application.
     */
    getConnectedAccountByIdentifier(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connector, identifier, organizationId, userId, connectedAccountId } = params;
            const request = {
                connector,
                identifier,
            };
            if (organizationId) {
                request.organizationId = organizationId;
            }
            if (userId) {
                request.userId = userId;
            }
            if (connectedAccountId) {
                request.id = connectedAccountId;
            }
            return this.coreClient.connectExec(this.client.getConnectedAccountAuth, request);
        });
    }
}
exports.default = ConnectedAccountsClient;
//# sourceMappingURL=connected-accounts.js.map