import { type JsonObject, type MessageInitShape } from '@bufbuild/protobuf';
import { AxiosResponse } from 'axios';
import CoreClient from './core';
import ToolsClient from './tools';
import ConnectedAccountsClient from './connected-accounts';
import ConnectionClient from './connection';
import { type ConnectionRef, type CreateConnectionParams, type ListConnectionsParams, type UpdateConnectionParams } from './agentkit-connections';
import type { AppConnection as AgentKitConnection, ListAppConnectionSummariesResponse } from './pkg/grpc/scalekit/v1/connections/connections_pb';
import type McpClient from './mcp';
import type ProvidersClient from './providers';
import { TriggersClient } from './triggers';
import type { Timestamp } from '@bufbuild/protobuf/wkt';
import { type ResumableUploadOptions, type ResumableUploadParams } from './resumable-upload';
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
import { CreateConnectedAccountResponse, CreateConnectedAccountSchema, DeleteConnectedAccountResponse, GetConnectedAccountByIdentifierResponse, GetMagicLinkForConnectedAccountResponse, ListConnectedAccountsResponse, UpdateConnectedAccount, UpdateConnectedAccountResponse, VerifyConnectedAccountUserResponse } from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';
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
     * Trigger events delivered to your endpoint: verify and parse them with
     * `triggers.verifyEvent`. Needs no network access.
     */
    readonly triggers: TriggersClient;
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
        isOrgWideCredential?: boolean;
    }): Promise<ListConnectedAccountsResponse>;
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
    private agentKitConnectionsImpl?;
    private get agentKitConnections();
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
     *   `OUTCOME_UNKNOWN`, check {@link ActionsClient.listConnectionSummaries} before creating again.
     *
     * @remarks A temporary `UNAVAILABLE` response is retried by the SDK like any other call, so a create
     * whose first attempt succeeded can come back as `CONNECTION_NAME_CONFLICT` when you pass a
     * `connectionName`. Read the connection to confirm.
     */
    createConnection(params: CreateConnectionParams): Promise<AgentKitConnection>;
    /**
     * Gets one AgentKit connection by name (case-insensitive) or by ID (`conn_...`).
     *
     * @param connection The name or ID as a string, or `{ connectionName }` / `{ connectionId }`.
     * @throws {ScalekitAgentKitConnectionError} `CONNECTION_NOT_FOUND` if no AgentKit connection matches.
     */
    getConnection(connection: string | ConnectionRef): Promise<AgentKitConnection>;
    /**
     * Lists AgentKit connections, newest first, as summaries (`id`, `connectionName`, `provider`,
     * `type`, `authMode`, `createTime`). Use {@link ActionsClient.getConnection} for the settings.
     *
     * Unlike {@link ActionsClient.listConnections}, which is unchanged, this supports `query`
     * and page sizes up to 100.
     *
     * @throws {ScalekitValidationError} If `query` is shorter than 3 characters.
     */
    listConnectionSummaries(params?: ListConnectionsParams): Promise<ListAppConnectionSummariesResponse>;
    /**
     * Changes the settings of an AgentKit connection.
     *
     * Identify it with `connectionName` or `connectionId`; a name costs one extra read to find the ID.
     * Pass exactly one of `oauth`, `googleDwd` or `staticConfig`, optionally with
     * `providerConfigurations`. It is a true partial merge: a field you leave out keeps its stored value,
     * a masked secret sent back is ignored, and a list or map you pass empty (`scopes: []`,
     * `extraAuthorizeParams: {}`) is cleared. Sending your own `clientId` or `clientSecret` turns
     * `useScalekitCreds` off unless you set it. `providerDomain` cannot be changed.
     *
     * @throws {ScalekitValidationError} If the arguments are invalid; nothing is sent.
     * @throws {ScalekitAgentKitConnectionError} If the server refuses or fails the update.
     */
    updateConnection(params: UpdateConnectionParams): Promise<AgentKitConnection>;
    /**
     * Enables a connection and returns its new enabled state. The server checks the configuration
     * (client ID, secret and, for OAuth, the user info URI) and refuses some connection types.
     *
     * @throws {ScalekitAgentKitConnectionError} `INVALID_CONFIGURATION` if the connection cannot be enabled.
     */
    enableConnection(connection: string | ConnectionRef): Promise<boolean>;
    /** Disables a connection and returns its new enabled state (`false`). */
    disableConnection(connection: string | ConnectionRef): Promise<boolean>;
    /**
     * Deletes a connection.
     *
     * @throws {ScalekitAgentKitConnectionError} `CONNECTION_IN_USE` while connected accounts or MCP
     *   configurations still use it.
     */
    deleteConnection(connection: string | ConnectionRef): Promise<void>;
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
    uploadResumable(params: ResumableUploadParams, options?: ResumableUploadOptions): Promise<Record<string, unknown>>;
}
