import { type MessageInitShape } from '@bufbuild/protobuf';
import GrpcConnect from './connect';
import CoreClient from './core';
import { AuthorizationDetailsSchema, CreateConnectedAccount, CreateConnectedAccountResponse, DeleteConnectedAccountResponse, GetConnectedAccountByIdentifierResponse, GetMagicLinkForConnectedAccountResponse, ListConnectedAccountsResponse, SearchConnectedAccountsResponse, UpdateConnectedAccount, UpdateConnectedAccountResponse, VerifyConnectedAccountUserResponse } from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';
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
export default class ConnectedAccountsClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Lists connected accounts with optional filters and pagination.
     *
     * @param options Optional filtering and pagination parameters
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listConnectedAccounts(options?: {
        organizationId?: string;
        userId?: string;
        connector?: string;
        identifier?: string;
        provider?: string;
        pageSize?: number;
        pageToken?: string;
        query?: string;
        connectionNames?: string[];
    }): Promise<ListConnectedAccountsResponse>;
    /**
     * Searches the environment's connected accounts by a text query.
     *
     * The query matches an account's identifier, provider or connector,
     * case-insensitively. If the query is a connected account ID (`ca_...`),
     * the account with that exact ID is also returned, alongside any text
     * matches. Results are paginated: pass a response's
     * `nextPageToken` as `pageToken` to fetch the next page.
     *
     * @param options - The search text plus optional paging and connection
     *   filter (each field is documented on its property).
     * @returns The matching `connectedAccounts`, the `totalSize` of the result
     *   set, and `nextPageToken` / `prevPageToken` for paging.
     * @throws `Error` if `query` is missing or blank, before any request is sent.
     * @throws {@link ScalekitBadRequestException} If `query` is outside 3 to 200
     *   characters or `pageSize` is greater than 30.
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
    searchConnectedAccounts(options: {
        /**
         * Text to search for. Required; surrounding whitespace is trimmed. The
         * server accepts 3 to 200 characters.
         */
        query: string;
        /** Maximum number of accounts per page. The server allows at most 30. */
        pageSize?: number;
        /** The `nextPageToken` or `prevPageToken` from a previous response. */
        pageToken?: string;
        /** Only return accounts on this connection (`conn_...`). */
        connectionId?: string;
    }): Promise<SearchConnectedAccountsResponse>;
    /**
     * Creates a new connected account.
     *
     * @param params Connected account creation parameters
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createConnectedAccount(params: {
        connector: string;
        identifier: string;
        connectedAccount: CreateConnectedAccount;
        organizationId?: string;
        userId?: string;
    }): Promise<CreateConnectedAccountResponse>;
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
    getOrCreateConnectedAccount(params: {
        connector: string;
        identifier: string;
        authorizationDetails?: MessageInitShape<typeof AuthorizationDetailsSchema>;
        organizationId?: string;
        userId?: string;
        apiConfig?: Record<string, unknown>;
    }): Promise<CreateConnectedAccountResponse>;
    /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
    upsertConnectedAccount: (params: {
        connector: string;
        identifier: string;
        authorizationDetails?: MessageInitShape<typeof AuthorizationDetailsSchema>;
        organizationId?: string;
        userId?: string;
        apiConfig?: Record<string, unknown>;
    }) => Promise<CreateConnectedAccountResponse>;
    /**
     * Updates an existing connected account.
     *
     * You can target the account either by `connectedAccountId` alone, or by the
     * combination of `connector` and `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    updateConnectedAccount(params: {
        connector?: string;
        identifier?: string;
        connectedAccount: UpdateConnectedAccount;
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
    }): Promise<UpdateConnectedAccountResponse>;
    /**
     * Deletes a connected account and revokes its credentials.
     *
     * You can target the account either by `connectedAccountId` alone, or by the
     * combination of `connector` and `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    deleteConnectedAccount(params: {
        connector?: string;
        identifier?: string;
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
    }): Promise<DeleteConnectedAccountResponse>;
    /**
     * Generates a time-limited magic link for connecting or re-authorizing a third-party account.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    getMagicLinkForConnectedAccount(params: {
        connector?: string;
        identifier?: string;
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
        state?: string;
        userVerifyUrl?: string;
    }): Promise<GetMagicLinkForConnectedAccountResponse>;
    /**
     * Verifies the connected account user after OAuth callback.
     *
     * Called by the B2B app server with the `auth_request_id` from the user verify
     * redirect URL and the current user's identifier. Validates that the asserted
     * identifier matches the one stored on the auth request and activates the account.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    verifyConnectedAccountUser(params: {
        authRequestId: string;
        identifier: string;
    }): Promise<VerifyConnectedAccountUserResponse>;
    /**
     * Retrieves complete authentication details for a connected account.
     *
     * This method returns sensitive credential information, so ensure you protect access
     * to this in your application.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitNotFoundException} If no matching connected account is found.
     */
    getConnectedAccountByIdentifier(params: {
        connector?: string;
        identifier?: string;
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
    }): Promise<GetConnectedAccountByIdentifierResponse>;
    /**
     * Fetches a connected account's metadata without its stored credentials.
     *
     * Returns the same `connectedAccount` shape as
     * {@link ConnectedAccountsClient.getConnectedAccountByIdentifier} (status,
     * connector, identifier, `apiConfig`, timestamps), but without the
     * access/refresh tokens or static secrets. Use it when you don't need the
     * tokens.
     *
     * Identify the account in one of these ways:
     * - `connectedAccountId` alone;
     * - `connector` + `identifier`;
     * - `connector` + `organizationId` (optionally + `userId`), for accounts
     *   whose identifier is `orgId` or `orgId/userId`.
     *
     * @param options - Which account to fetch (each field is documented on its
     *   property).
     * @returns The connected account, without authorization credentials.
     * @throws `Error` if none of the combinations above is given, before any
     *   request is sent.
     * @throws {@link ScalekitNotFoundException} If no matching connected account
     *   is found.
     * @throws {@link ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * ```ts
     * import { ConnectorStatus } from '@scalekit-sdk/node';
     *
     * const { connectedAccount } =
     *   await scalekit.connectedAccounts.getConnectedAccountDetailsByIdentifier({
     *     connector: 'gmail',
     *     identifier: 'user_123',
     *   });
     * console.log(connectedAccount?.status === ConnectorStatus.ACTIVE);
     * ```
     */
    getConnectedAccountDetailsByIdentifier(options: {
        /**
         * Connector (connection name), e.g. `"gmail"`. Required unless
         * `connectedAccountId` is given.
         */
        connector?: string;
        /** Your application's identifier for the end user. Use with `connector`. */
        identifier?: string;
        /**
         * Used to form the account identifier (`orgId`, or `orgId/userId` with
         * `userId`) when `identifier` is omitted. Ignored when `identifier` or
         * `connectedAccountId` is given. Not an access check.
         */
        organizationId?: string;
        /**
         * Appended to `organizationId` to form the account identifier
         * (`orgId/userId`) when `identifier` is omitted. Ignored when
         * `identifier` or `connectedAccountId` is given. Not an access check.
         */
        userId?: string;
        /** Connected account ID (`ca_...`). When given, the other fields are not needed. */
        connectedAccountId?: string;
    }): Promise<GetConnectedAccountByIdentifierResponse>;
}
