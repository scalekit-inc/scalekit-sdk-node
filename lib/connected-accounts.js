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
 * - list and search connected accounts
 * - create/update/delete connected accounts
 * - generate magic links for authorization
 * - fetch full authentication details for a connected account
 * - fetch a connected account's metadata without its credentials
 */
class ConnectedAccountsClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
        this.upsertConnectedAccount = this.getOrCreateConnectedAccount.bind(this);
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
            var _a, _b, _c, _d;
            return this.coreClient.connectExec(this.client.listConnectedAccounts, (0, protobuf_1.create)(connected_accounts_pb_1.ListConnectedAccountsRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.organizationId) && {
                organizationId: options.organizationId,
            })), ((options === null || options === void 0 ? void 0 : options.userId) && { userId: options.userId })), (((_a = options === null || options === void 0 ? void 0 : options.connector) === null || _a === void 0 ? void 0 : _a.trim()) && {
                connector: options.connector.trim(),
            })), (((_b = options === null || options === void 0 ? void 0 : options.identifier) === null || _b === void 0 ? void 0 : _b.trim()) && {
                identifier: options.identifier.trim(),
            })), (((_c = options === null || options === void 0 ? void 0 : options.provider) === null || _c === void 0 ? void 0 : _c.trim()) && { provider: options.provider.trim() })), ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined && { pageSize: options.pageSize })), ((options === null || options === void 0 ? void 0 : options.pageToken) && { pageToken: options.pageToken })), ((options === null || options === void 0 ? void 0 : options.query) && { query: options.query })), (((_d = options === null || options === void 0 ? void 0 : options.connectionNames) === null || _d === void 0 ? void 0 : _d.length) && {
                connectionNames: options.connectionNames,
            }))));
        });
    }
    /**
     * Searches the environment's connected accounts by a text query.
     *
     * The query matches an account's identifier, provider or connector,
     * case-insensitively. Results are paginated: pass a response's
     * `nextPageToken` as `pageToken` to fetch the next page.
     *
     * @param options - The search text plus optional paging and connection
     *   filter (each field is documented on its property).
     * @returns The matching `connectedAccounts`, the `totalSize` of the result
     *   set, and `nextPageToken` / `prevPageToken` for paging.
     * @throws `Error` if `query` is missing or blank, before any request is sent.
     * @throws {@link ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * ```ts
     * let pageToken: string | undefined;
     * do {
     *   const page = await scalekit.connectedAccounts.searchConnectedAccounts({
     *     query: 'gmail',
     *     pageSize: 30,
     *     pageToken,
     *   });
     *   for (const account of page.connectedAccounts) {
     *     console.log(account.id, account.identifier, account.connector);
     *   }
     *   pageToken = page.nextPageToken || undefined;
     * } while (pageToken);
     * ```
     */
    searchConnectedAccounts(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const query = (_a = options === null || options === void 0 ? void 0 : options.query) === null || _a === void 0 ? void 0 : _a.trim();
            if (!query) {
                throw new Error('query is required');
            }
            const connectionId = (_b = options.connectionId) === null || _b === void 0 ? void 0 : _b.trim();
            return this.coreClient.connectExec(this.client.searchConnectedAccounts, (0, protobuf_1.create)(connected_accounts_pb_1.SearchConnectedAccountsRequestSchema, Object.assign(Object.assign(Object.assign({ query }, (options.pageSize !== undefined && { pageSize: options.pageSize })), (options.pageToken !== undefined && {
                pageToken: options.pageToken,
            })), (connectionId && { connectionId }))));
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
                // True upsert: if credentials were supplied, apply them regardless of
                // the account's current status (PENDING_AUTH, EXPIRED, DISCONNECTED, ACTIVE).
                if (authorizationDetails) {
                    const updateResponse = yield this.updateConnectedAccount({
                        connector,
                        identifier,
                        connectedAccount: (0, protobuf_1.create)(connected_accounts_pb_1.UpdateConnectedAccountSchema, Object.assign({ authorizationDetails: (0, protobuf_1.create)(connected_accounts_pb_1.AuthorizationDetailsSchema, authorizationDetails) }, (apiConfig != null && {
                            apiConfig: apiConfig,
                        }))),
                        organizationId,
                        userId,
                    });
                    return (0, protobuf_1.create)(connected_accounts_pb_1.CreateConnectedAccountResponseSchema, {
                        connectedAccount: updateResponse.connectedAccount,
                    });
                }
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
            const { connector, identifier, organizationId, userId, connectedAccountId, state, userVerifyUrl, } = params;
            return this.coreClient.connectExec(this.client.getMagicLinkForConnectedAccount, (0, protobuf_1.create)(connected_accounts_pb_1.GetMagicLinkForConnectedAccountRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (connector && { connector })), (identifier && { identifier })), (organizationId && { organizationId })), (userId && { userId })), (connectedAccountId && { id: connectedAccountId })), (state && { state })), (userVerifyUrl && { userVerifyUrl }))));
        });
    }
    /**
     * Verifies the connected account user after OAuth callback.
     *
     * Called by the B2B app server with the `auth_request_id` from the user verify
     * redirect URL and the current user's identifier. Validates that the asserted
     * identifier matches the one stored on the auth request and activates the account.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    verifyConnectedAccountUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const authRequestId = (_a = params.authRequestId) === null || _a === void 0 ? void 0 : _a.trim();
            const identifier = (_b = params.identifier) === null || _b === void 0 ? void 0 : _b.trim();
            if (!authRequestId) {
                throw new Error('authRequestId is required');
            }
            if (!identifier) {
                throw new Error('identifier is required');
            }
            return this.coreClient.connectExec(this.client.verifyConnectedAccountUser, (0, protobuf_1.create)(connected_accounts_pb_1.VerifyConnectedAccountUserRequestSchema, {
                authRequestId,
                identifier,
            }));
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
    /**
     * Fetches a connected account's metadata without its stored credentials.
     *
     * Returns the same `connectedAccount` shape as
     * {@link ConnectedAccountsClient.getConnectedAccountByIdentifier} (status,
     * connector, identifier, `apiConfig`, timestamps), but the server leaves out
     * the access/refresh tokens and static secrets. Prefer this method whenever
     * you do not need the credentials themselves.
     *
     * Identify the account with `connectedAccountId`, or with `connector` and
     * `identifier` together.
     *
     * @param options - Which account to fetch (each field is documented on its
     *   property).
     * @returns The connected account, without authorization credentials.
     * @throws `Error` if neither `connectedAccountId` nor both `connector` and
     *   `identifier` are given, before any request is sent.
     * @throws {@link ScalekitNotFoundException} If no matching connected account
     *   is found.
     * @throws {@link ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * ```ts
     * import { ConnectorStatus } from '@scalekit-sdk/node';
     *
     * const { connectedAccount } =
     *   await scalekit.connectedAccounts.getConnectedAccountDetails({
     *     connector: 'gmail',
     *     identifier: 'user_123',
     *   });
     * console.log(connectedAccount?.status === ConnectorStatus.ACTIVE);
     * ```
     */
    getConnectedAccountDetails(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const connector = (_a = options === null || options === void 0 ? void 0 : options.connector) === null || _a === void 0 ? void 0 : _a.trim();
            const identifier = (_b = options === null || options === void 0 ? void 0 : options.identifier) === null || _b === void 0 ? void 0 : _b.trim();
            const connectedAccountId = (_c = options === null || options === void 0 ? void 0 : options.connectedAccountId) === null || _c === void 0 ? void 0 : _c.trim();
            const organizationId = options === null || options === void 0 ? void 0 : options.organizationId;
            const userId = options === null || options === void 0 ? void 0 : options.userId;
            if (!connectedAccountId && !(connector && identifier)) {
                throw new Error('either connectedAccountId or connector + identifier is required');
            }
            return this.coreClient.connectExec(this.client.getConnectedAccountDetails, (0, protobuf_1.create)(connected_accounts_pb_1.GetConnectedAccountByIdentifierRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (connector && { connector })), (identifier && { identifier })), (organizationId && { organizationId })), (userId && { userId })), (connectedAccountId && { id: connectedAccountId }))));
        });
    }
}
exports.default = ConnectedAccountsClient;
//# sourceMappingURL=connected-accounts.js.map