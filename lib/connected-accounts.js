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
const connected_accounts_connect_1 = require("./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_connect");
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