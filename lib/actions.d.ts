import { type JsonObject, type MessageInitShape } from '@bufbuild/protobuf';
import { AxiosResponse } from 'axios';
import CoreClient from './core';
import ToolsClient from './tools';
import ConnectedAccountsClient from './connected-accounts';
import ConnectionClient from './connection';
import type McpClient from './mcp';
import type ProvidersClient from './providers';
import type { Timestamp } from '@bufbuild/protobuf/wkt';
import type { ListAvailableToolsResponse, ListScopedToolsResponse, ScopedToolFilterSchema, SearchToolsResponse } from './pkg/grpc/scalekit/v1/tools/tools_pb';
/**
 * Creation timestamp for an app connection, re-exported as the protobuf
 * well-known `Timestamp` type. Passed through from the API unchanged
 * (`seconds` is an int64 and therefore a `bigint` in JS).
 */
export type AppConnectionTimestamp = Timestamp;
/**
 * Normalized, consumer-friendly view of an app connection returned by
 * {@link ActionsClient.listAppConnections}. Internal proto fields
 * (`provider` enum, `organizationId`, `uiButtonTitle`, `organizationName`,
 * `domains`, `$typeName`) are omitted, and enum fields are decoded to their
 * string names.
 */
export interface AppConnection {
    /** Unique connection identifier (format: "conn_..."). */
    id: string;
    /** Connection type, decoded from the ConnectionType enum (e.g. "OAUTH", "SAML"). */
    type: string;
    /** Connection status, decoded from the ConnectionStatus enum (e.g. "COMPLETED", "DRAFT"). */
    status: string;
    /** Whether the connection is enabled. */
    enabled: boolean;
    /** Provider key for the connection (e.g. "SALESFORCE", "GMAIL"). */
    provider: string;
    /** Human-readable connection name / key identifier (e.g. "salesforce-ubB7gpKc"). */
    connectionName: string;
    /** Creation timestamp, passed through as a protobuf Timestamp. */
    createdAt?: AppConnectionTimestamp;
}
/** Normalized response returned by {@link ActionsClient.listAppConnections}. */
export interface ListAppConnectionsResult {
    connections: AppConnection[];
    nextPageToken: string;
    prevPageToken: string;
    totalSize: number;
}
import { CreateConnectedAccountResponse, CreateConnectedAccountSchema, DeleteConnectedAccountResponse, GetConnectedAccountByIdentifierResponse, GetMagicLinkForConnectedAccountResponse, ListConnectedAccountsResponse, SearchConnectedAccountsResponse, UpdateConnectedAccount, UpdateConnectedAccountResponse, VerifyConnectedAccountUserResponse } from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';
import { ExecuteToolResponse } from './pkg/grpc/scalekit/v1/tools/tools_pb';
/**
 * Normalized, consumer-friendly view of a tool returned by
 * {@link ActionsClient.listTools}. Internal proto fields (`$typeName`) are
 * omitted — every other field passes through unchanged from the generated
 * `Tool` message.
 */
export interface ActionTool {
    id: string;
    provider: string;
    definition?: JsonObject;
    metadata?: JsonObject;
    tags: string[];
    isDefault?: boolean;
    updatedAt?: Timestamp;
}
/** Normalized response returned by {@link ActionsClient.listTools}. */
export interface ListToolsResult {
    tools: ActionTool[];
    toolNames: string[];
    nextPageToken: string;
    prevPageToken: string;
    totalSize: number;
}
/**
 * This class is intended to be accessed via `ScalekitClient.actions`.
 * It composes the existing ToolsClient and ConnectedAccountsClient
 * without changing their behavior.
 */
export default class ActionsClient {
    private readonly tools;
    private readonly connectedAccounts;
    private readonly coreClient;
    private readonly connection;
    /** Virtual MCP servers: configurations, connected accounts and session tokens. */
    readonly mcp: McpClient;
    /** Bring-your-own connectors: create, update, list and delete custom connectors. */
    readonly providers: ProvidersClient;
    /**
     * @param {ToolsClient} tools - Client used to execute tools on behalf of connected accounts.
     * @param {ConnectedAccountsClient} connectedAccounts - Client for connected-account lifecycle operations.
     * @param {CoreClient} coreClient - Shared core client (auth, HTTP, retries) used for proxied requests.
     * @param {ConnectionClient} connection - Client used to list app-level connections.
     */
    constructor(tools: ToolsClient, connectedAccounts: ConnectedAccountsClient, coreClient: CoreClient, connection: ConnectionClient, 
    /** Virtual MCP servers: configurations, connected accounts and session tokens. */
    mcp: McpClient, 
    /** Bring-your-own connectors: create, update, list and delete custom connectors. */
    providers: ProvidersClient);
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
    searchTools(query: string, options?: {
        identifier?: string;
        topK?: number;
    }): Promise<SearchToolsResponse>;
    /**
     * Lists tools for one identifier, narrowed by an explicit filter.
     *
     * Delegates to `tools.listScopedTools`. `options.filter` is required by the
     * server even though its fields are individually optional.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listScopedTools(identifier: string, options: {
        filter: MessageInitShape<typeof ScopedToolFilterSchema>;
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListScopedToolsResponse>;
    /**
     * Lists every tool available to one identifier across their connections.
     *
     * Delegates to `tools.listAvailableTools`. Paginated — follow
     * `nextPageToken` if you need the complete set.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listAvailableTools(identifier: string, options?: {
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListAvailableToolsResponse>;
    /**
     * Execute a tool on behalf of a connected account.
     *
     * Thin wrapper around ToolsClient.executeTool, reserved for future
     * pre/post modifier support.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If toolName is missing or an unexpected error occurs.
     */
    executeTool(params: {
        toolName: string;
        toolInput: Record<string, unknown>;
        identifier?: string;
        connectedAccountId?: string;
        connector?: string;
        organizationId?: string;
        userId?: string;
    }): Promise<ExecuteToolResponse>;
    /**
     * List tools available in your workspace, optionally scoped to a connected account.
     *
     * Thin wrapper around ToolsClient.listTools. Use `connectedAccountId` as a
     * direct alternative to the `connectionName` + `identifier` combination.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listTools(params?: {
        connectionName?: string;
        identifier?: string;
        provider?: string;
        toolName?: string[];
        query?: string;
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
        summary?: boolean;
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListToolsResult>;
    /**
     * Get an authorization magic link for a connected account.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    getAuthorizationLink(params: {
        connectionName?: string;
        identifier?: string;
        connectedAccountId?: string;
        organizationId?: string;
        userId?: string;
        state?: string;
        userVerifyUrl?: string;
    }): Promise<GetMagicLinkForConnectedAccountResponse>;
    /**
     * Verify the connected account user after OAuth callback.
     *
     * Called by the B2B app server with the `authRequestId` from the user verify
     * redirect URL and the current user's identifier. Activates the connected account
     * once the asserted identifier is confirmed.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    verifyConnectedAccountUser(params: {
        authRequestId: string;
        identifier: string;
    }): Promise<VerifyConnectedAccountUserResponse>;
    /**
     * List connected accounts with optional filters.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listConnectedAccounts(params?: {
        connectionName?: string;
        identifier?: string;
        provider?: string;
        organizationId?: string;
        userId?: string;
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
     * @param params - The search text plus optional paging and connection
     *   filter (each field is documented on its property).
     * @returns The matching `connectedAccounts`, the `totalSize` of the result
     *   set, and `nextPageToken` / `prevPageToken` for paging.
     * @throws `Error` if `query` is missing or blank, before any request is sent.
     * @throws {@link ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * ```ts
     * const page = await scalekit.actions.searchConnectedAccounts({
     *   query: 'john@example.com',
     *   pageSize: 10,
     * });
     * for (const account of page.connectedAccounts) {
     *   console.log(account.id, account.connector, account.status);
     * }
     * if (page.nextPageToken) {
     *   const next = await scalekit.actions.searchConnectedAccounts({
     *     query: 'john@example.com',
     *     pageSize: 10,
     *     pageToken: page.nextPageToken,
     *   });
     *   console.log(next.connectedAccounts.length);
     * }
     * ```
     */
    searchConnectedAccounts(params: {
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
    listConnections(params?: {
        pageSize?: number;
        pageToken?: string;
        provider?: string;
    }): Promise<ListAppConnectionsResult>;
    /**
     * Delete a connected account.
     * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    deleteConnectedAccount(params: {
        connectionName?: string;
        identifier?: string;
        connectedAccountId?: string;
        organizationId?: string;
        userId?: string;
    }): Promise<DeleteConnectedAccountResponse>;
    /**
     * Get connected account authorization details.
     * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    getConnectedAccount(params: {
        connectionName?: string;
        identifier?: string;
        connectedAccountId?: string;
        organizationId?: string;
        userId?: string;
    }): Promise<GetConnectedAccountByIdentifierResponse>;
    /**
     * Fetches a connected account's metadata without its stored credentials.
     *
     * Returns the same `connectedAccount` shape as
     * {@link ActionsClient.getConnectedAccount} (status, connector, identifier,
     * `apiConfig`, timestamps), but without the access/refresh tokens or static
     * secrets. Use it when you don't need the tokens, for example to check
     * whether an account is `ConnectorStatus.ACTIVE`.
     *
     * Identify the account in one of these ways:
     * - `connectedAccountId` alone;
     * - `connectionName` + `identifier`;
     * - `connectionName` + `organizationId` (optionally + `userId`), for
     *   accounts whose identifier is `orgId` or `orgId/userId`.
     *
     * @param params - Which account to fetch (each field is documented on its
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
     * const { connectedAccount } = await scalekit.actions.getConnectedAccountDetails({
     *   connectionName: 'gmail',
     *   identifier: 'user_123',
     * });
     * if (connectedAccount?.status !== ConnectorStatus.ACTIVE) {
     *   // Send the user an authorization link
     * }
     * ```
     */
    getConnectedAccountDetails(params: {
        /**
         * Connection name as shown in the dashboard. Required unless
         * `connectedAccountId` is given.
         */
        connectionName?: string;
        /** Your application's identifier for the end user. Use with `connectionName`. */
        identifier?: string;
        /** Connected account ID (`ca_...`). When given, the other fields are not needed. */
        connectedAccountId?: string;
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
    }): Promise<GetConnectedAccountByIdentifierResponse>;
    /**
     * Create a new connected account.
     *
     * This helper accepts a high-level payload and builds the
     * underlying CreateConnectedAccount message.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If connectionName or identifier is missing.
     */
    createConnectedAccount(params: {
        connectionName: string;
        identifier: string;
        /**
         * How the account authenticates, as a plain object (the shape `create()`
         * takes when the request is built).
         *
         * To connect a user's account, prefer {@link getAuthorizationLink}: it
         * creates the account if needed and the user completes authorization
         * through the link. OAuth credentials cannot be supplied directly.
         */
        authorizationDetails: MessageInitShape<typeof CreateConnectedAccountSchema>['authorizationDetails'];
        organizationId?: string;
        userId?: string;
        apiConfig?: Record<string, unknown>;
    }): Promise<CreateConnectedAccountResponse>;
    /**
     * Get an existing connected account or create a new one if it doesn't exist.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If connectionName or identifier is missing.
     */
    getOrCreateConnectedAccount(params: {
        connectionName: string;
        identifier: string;
        /** Same plain-object shape as {@link createConnectedAccount}. */
        authorizationDetails?: MessageInitShape<typeof CreateConnectedAccountSchema>['authorizationDetails'];
        organizationId?: string;
        userId?: string;
        apiConfig?: Record<string, unknown>;
    }): Promise<CreateConnectedAccountResponse>;
    /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
    upsertConnectedAccount: (params: {
        connectionName: string;
        identifier: string;
        /** Same plain-object shape as {@link createConnectedAccount}. */
        authorizationDetails?: MessageInitShape<typeof CreateConnectedAccountSchema>["authorizationDetails"];
        organizationId?: string;
        userId?: string;
        apiConfig?: Record<string, unknown>;
    }) => Promise<CreateConnectedAccountResponse>;
    /**
     * Update an existing connected account.
     * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    updateConnectedAccount(params: {
        connectionName?: string;
        identifier?: string;
        authorizationDetails?: UpdateConnectedAccount['authorizationDetails'];
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
        apiConfig?: UpdateConnectedAccount['apiConfig'];
    }): Promise<UpdateConnectedAccountResponse>;
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
    request(params: {
        connectionName: string;
        identifier: string;
        path: string;
        method?: string;
        queryParams?: Record<string, unknown>;
        body?: unknown;
        formData?: Record<string, unknown>;
        headers?: Record<string, string>;
        timeoutMs?: number;
    }): Promise<AxiosResponse<any>>;
}
