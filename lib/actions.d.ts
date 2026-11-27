import { type JsonObject, type MessageInitShape } from '@bufbuild/protobuf';
import { AxiosResponse } from 'axios';
import CoreClient from './core';
import ToolsClient from './tools';
import ConnectedAccountsClient from './connected-accounts';
import ConnectionClient from './connection';
import { type ConnectionRef, type CreateConnectionParams, type ListAppConnectionsParams, type ListAppConnectionsResponse, type UpdateConnectionParams } from './agentkit-connections';
import type { AppConnection as AgentKitConnection } from './pkg/grpc/scalekit/v1/connections/connections_pb';
import type McpClient from './mcp';
import type ProvidersClient from './providers';
import { type ToolCollectionRun } from './tool-collection-runs';
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
 * {@link ActionsClient.listConnections}. Internal proto fields
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
/** Normalized response returned by {@link ActionsClient.listConnections}. */
export interface ListAppConnectionsResult {
    connections: AppConnection[];
    nextPageToken: string;
    prevPageToken: string;
    totalSize: number;
}
import { CreateConnectedAccountResponse, CreateConnectedAccountSchema, DeleteConnectedAccountResponse, GetConnectedAccountByIdentifierResponse, GetMagicLinkForConnectedAccountResponse, ListConnectedAccountsResponse, UpdateConnectedAccount, UpdateConnectedAccountResponse, UpdateConnectedAccountSchema, VerifyConnectedAccountUserResponse } from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';
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
     * Deletes one tool of a connector created from an OpenAPI spec, by its name or its ID.
     *
     * Use it to stop agents from calling one operation of a connector without changing the
     * connector's spec. The tool is gone when the call returns. It needs a workspace client with
     * the `agent_connectors:write` permission.
     *
     * `toolIdentifier` is the tool's name or its ID. The name is the one the tool is listed under,
     * `a-<connector name>_<operation>`, for example `a-acmeapi_deletepet`; capitals are folded to lower
     * case (ASCII letters only). The ID is `tol_` followed by a number, for example `tol_153432495478538376`: the
     * `id` of each tool that `actions.listTools({ provider })` returns for the connector (not in
     * summary mode). A value that starts with `tol_`, in any case, is always read as an ID.
     *
     * Only a tool of a connector created from an OpenAPI spec, in your own environment, can be
     * deleted. A tool of an MCP connector, a built-in tool, another environment's tool, a tool whose
     * connector no longer exists and a name or ID that matches nothing all fail the same way, with
     * `ScalekitNotFoundException`; the message does not say which.
     *
     * A tool collection run that regenerates the tools (the spec, the base URL or the auth patterns
     * changed since the last completed run, or the spec references external files) creates the tool
     * again while its operation is still in the spec: to keep it deleted, remove its endpoint from
     * the spec. A run of an unchanged connector changes no tools, so `actions.invokeToolCollection`
     * alone does not bring a deleted tool back. While a run of the connector is queued or
     * processing, the call deletes nothing and fails with `ScalekitConflictException`: wait for the
     * run with `actions.getToolCollectionRun`, then call again.
     *
     * @param params.toolIdentifier Name or ID of the tool. Required. Surrounding whitespace is
     *   ignored. At most 2048 characters.
     * @returns Resolves once the tool is deleted.
     * @throws {ScalekitValidationError} If `toolIdentifier` is not a string, or is empty or blank.
     *   No request is sent.
     * @throws {ScalekitBadRequestException} If `toolIdentifier` is longer than 2048 characters or
     *   has a control character other than surrounding whitespace (the SDK trims that).
     * @throws {ScalekitForbiddenException} If the client lacks the `agent_connectors:write`
     *   permission.
     * @throws {ScalekitNotFoundException} If no deletable tool has this name or ID
     *   (`custom tool not found`).
     * @throws {ScalekitConflictException} If a tool collection run of the connector is queued or
     *   processing (error code `RESOURCE_ALREADY_EXISTS`; the message names the connector, the run
     *   and its status): nothing is deleted, so call again once it has finished. Also, with the
     *   error code `TOOL_NAME_AMBIGUOUS`, when deleting by name and tools of more than one
     *   connector of your environment have this name (leftovers of an earlier connector): nothing
     *   is deleted, and the message names two of the connectors and the ID of each tool. Delete the
     *   tool by its ID.
     * @throws {ScalekitNotImplementedException} With HTTP status 501, on a backend older than
     *   release v0.1.165.0, which does not have this call.
     * @throws {ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * ```ts
     * await scalekit.actions.deleteCustomTool({ toolIdentifier: 'a-acmeapi_deletepet' });
     * ```
     */
    deleteCustomTool(params: {
        toolIdentifier: string;
    }): Promise<void>;
    /**
     * Queues a tool collection run for a connector created from an OpenAPI spec, and returns the
     * run with the status `QUEUED`.
     *
     * A tool collection run reads the connector's stored spec again and brings its tools in line
     * with it. Creating the connector, and changing its base URL or spec URL, already queue a run
     * for you. Call this to pick up a spec that changed upstream, or to retry a run that failed.
     * It returns at once: poll {@link ActionsClient.getToolCollectionRun} for the outcome.
     *
     * Scalekit checks the stored spec URL during this call, with the same checks and errors as
     * `actions.providers.createCustomProvider` with `openapiSpecUrl`. When the spec, the
     * connector's base URL and its auth patterns are all unchanged since the last completed run,
     * and the spec does not reference external files, the run changes no tools and reports
     * `toolsCreated`, `toolsUpdated` and `toolsDeleted` as 0. If the first run fills in the base
     * URL, that counts as a change: the next run updates every tool, and only the run after that
     * reports 0.
     *
     * @param params.providerIdentifier The connector's `identifier`: the `NAME:environment-id` string
     *   that `actions.providers.createCustomProvider` and `actions.providers.listProviders` return as
     *   `provider.identifier`, such as `ACMEAPI:70219645518265104`. Required. It is not
     *   `provider.id` (`prvd_...`): the id answers `ScalekitNotFoundException`. Whitespace around it
     *   is removed.
     * @returns The queued {@link ToolCollectionRun}.
     * @throws {ScalekitValidationError} If `params` or `providerIdentifier` is missing, or
     *   `providerIdentifier` is not a string, or is empty or blank. No request is sent.
     * @throws {ScalekitNotFoundException} If no connector in your environment has this identifier.
     * @throws {ScalekitBadRequestException} If the connector was not created from an OpenAPI spec
     *   (`this connector is not sourced from an OpenAPI spec`), if OpenAPI-sourced connectors are
     *   not enabled for your environment (error code `FEATURE_NOT_ENABLED`), or if the stored spec
     *   URL fails the check.
     * @throws {ScalekitConflictException} If a run is already in progress, with the error code
     *   `RESOURCE_ALREADY_EXISTS`. A connector has at most one active run.
     * @throws {ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * ```ts
     * // `provider.identifier` comes from createCustomProvider or listProviders.
     * const run = await scalekit.actions.invokeToolCollection({
     *   providerIdentifier: provider.identifier,
     * });
     * console.log(run.runId, run.status); // 'QUEUED'
     * ```
     */
    invokeToolCollection(params: {
        providerIdentifier: string;
    }): Promise<ToolCollectionRun>;
    /**
     * Gets one tool collection run of a connector created from an OpenAPI spec: its status, its
     * counters and, once it has finished, the operations that were skipped and why.
     *
     * After `actions.providers.createCustomProvider`, after
     * {@link ActionsClient.invokeToolCollection} and after an `actions.providers.updateCustomProvider`
     * that queued a run (a base URL or spec URL change), poll this until `status` is `COMPLETED` or
     * `FAILED`. Any other update queues no run, so this call then returns an older run, or
     * `ScalekitNotFoundException` if there is none. Right after `createCustomProvider` the first
     * run may not exist yet, and this call can answer `ScalekitNotFoundException` for a moment.
     * After your own {@link ActionsClient.invokeToolCollection}, pass the `runId` it returned:
     * without one you get the newest run, which can be one that another caller queued.
     *
     * A run is `QUEUED`, then `PROCESSING`, and ends as `COMPLETED` or `FAILED`; `errorMessage` says
     * why a run failed. A run fails if Scalekit cannot fetch or parse the spec, if the spec yields no
     * tool at all, if processing takes longer than 3 minutes, or if the run makes no progress for 30
     * minutes. An operation of the spec that cannot become a tool is skipped, listed in
     * `skippedTools`, and does not fail the run. The operations skipped are those that:
     * - use a method other than GET, POST, PUT, PATCH or DELETE;
     * - have a request body that is not JSON, form-encoded or a plain string (for example
     *   multipart, binary or XML), or a form-encoded body that is not an object;
     * - need authentication while the connector's auth type is not one that Scalekit can sign
     *   requests for;
     * - have no base URL, or need authentication but have a plain `http://` base URL (other than on
     *   localhost);
     * - use a path parameter the operation does not declare, or an object query parameter with
     *   `style: form`.
     *
     * Each tool is named `a-<connector name>_<operationId>`, in lower case, with the connector name
     * taken from its identifier. Without an `operationId`, the method and path stand in for it, and a
     * name that is already taken gets a numeric suffix. Operations that left the spec are deleted
     * from the connector. See {@link ToolCollectionRun} for the fields.
     *
     * @param params.providerIdentifier The connector's `identifier`: the `NAME:environment-id` string
     *   that `actions.providers.createCustomProvider` and `actions.providers.listProviders` return as
     *   `provider.identifier`, such as `ACMEAPI:70219645518265104`. Required. It is not
     *   `provider.id` (`prvd_...`): the id answers `ScalekitNotFoundException`. Whitespace around it
     *   is removed.
     * @param params.runId A run's `runId`. Omit it, or pass `'latest'` (an empty or blank string
     *   means the same), for the connector's newest run. Whitespace around it is removed.
     * @returns The {@link ToolCollectionRun}.
     * @throws {ScalekitValidationError} If `params` or `providerIdentifier` is missing, or
     *   `providerIdentifier` is not a string, or is empty or blank, or `runId` is given and is not
     *   a string. No request is sent.
     * @throws {ScalekitNotFoundException} If no connector has this identifier, or the connector has
     *   no run yet, or `runId` is not one of its runs (`tool collection run not found`).
     * @throws {ScalekitBadRequestException} If `runId` is malformed (`invalid run_id`).
     * @throws {ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * ```ts
     * const run = await scalekit.actions.getToolCollectionRun({
     *   providerIdentifier: provider.identifier,
     *   runId: 'latest', // or the `runId` that invokeToolCollection returned
     * });
     * console.log(run.status, run.toolsCreated);
     * ```
     */
    getToolCollectionRun(params: {
        providerIdentifier: string;
        runId?: string;
    }): Promise<ToolCollectionRun>;
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
     * @param params.provider A connector's identifier. For a connector created from an
     *   OpenAPI spec, this lists its tools without a connected account.
     * @param params.query Searches tool names (3 to 100 characters, every word must appear in the
     *   name, ignoring case). It covers built-in tools only, never a custom connector's tools.
     * @param params.pageSize Defaults to 300 when omitted or 0. The maximum is 1000: a larger
     *   value (up to 4294967295, the most the API field holds) is reduced to 1000, not rejected.
     *   With `query`, a page holds at most 100 tools.
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
     * @param params.providerDomain The host name that replaces `{{domain}}` in the `proxyUrl` of a
     *   templated MCP connector, for example `'mcp-eu.mixpanel.com'`; for regional connectors such as
     *   MIXPANELMCP. It cannot be changed later and is not returned.
     * @returns The created connection. Secrets are masked.
     * @throws {ScalekitValidationError} If an argument is invalid; nothing is sent.
     * @throws {ScalekitAgentKitConnectionError} If the server refuses or fails the request. On
     *   `OUTCOME_UNKNOWN`, check {@link ActionsClient.listAppConnections} before creating again.
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
     * This uses the AgentKit-only connection API and returns summaries only (no settings, no enabled
     * flag). It is not the same as {@link ActionsClient.listConnections} or
     * {@link ConnectionClient.listAppConnections} (`scalekit.connection.listAppConnections`), which use
     * the older API and are unchanged: this one matches `provider` case-insensitively, supports `query`,
     * and allows page sizes up to 100.
     *
     * @throws {ScalekitValidationError} If `query` is shorter than 3 characters.
     */
    listAppConnections(params?: ListAppConnectionsParams): Promise<ListAppConnectionsResponse>;
    /**
     * Changes the settings of an AgentKit connection.
     *
     * Send only the fields you want to change; everything else keeps its current value, including the
     * stored client secret. Identify the connection with `connectionName` or `connectionId`; a name
     * costs one extra read to find the ID. Pass at most one of `oauth` or `googleDwd`.
     * `providerConfigurations` goes with `oauth` or on its own, never with `googleDwd`; you can also
     * rename on its own. A masked secret sent back is ignored, and a list or map you pass empty
     * (`scopes: []`, `extraAuthorizeParams: {}`) is cleared. Sending your own `clientId` or
     * `clientSecret` switches the connection to your credentials unless you also send
     * `useScalekitCreds`. `providerDomain` cannot be changed.
     *
     * @throws {ScalekitValidationError} If the arguments are invalid; nothing is sent.
     * @throws {ScalekitAgentKitConnectionError} If the server refuses or fails the update.
     */
    updateConnection(params: UpdateConnectionParams): Promise<AgentKitConnection>;
    /**
     * Deletes a connection.
     *
     * @throws {ScalekitAgentKitConnectionError} `CONNECTION_IN_USE` while connected accounts or
     *   Virtual MCP servers still use it.
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
         * through the link.
         *
         * To import an OAuth token you obtained outside Scalekit, pass it as
         * `oauthToken`. `expiresAt` is optional and only used for such an import:
         *
         * ```ts
         * import { timestampFromDate } from '@bufbuild/protobuf/wkt';
         *
         * await scalekit.actions.createConnectedAccount({
         *   connectionName: 'gmail',
         *   identifier: 'user_123',
         *   authorizationDetails: {
         *     details: {
         *       case: 'oauthToken',
         *       value: {
         *         accessToken: 'ya29.a0...',
         *         refreshToken: '1//0g...', // optional
         *         scopes: ['https://www.googleapis.com/auth/gmail.readonly'], // optional
         *         expiresAt: timestampFromDate(new Date('2026-12-01T10:00:00Z')), // optional
         *       },
         *     },
         *   },
         * });
         * ```
         *
         * `expiresAt` is when the supplied access token expires, a protobuf
         * `Timestamp` sent as UTC. The token is imported (and the account becomes
         * ACTIVE) only for a connection that uses your own OAuth app; the
         * account's `tokenExpiresAt` is then set to `expiresAt`.
         *
         * Without `expiresAt`, the account has no token expiry and the token is
         * used until the provider rejects it. If a `refreshToken` was imported,
         * tool calls then refresh and retry automatically, and proxy callers
         * refresh with the refresh connected account tokens API
         * (`POST /api/v1/connected_accounts:refresh_tokens`). Without a
         * `refreshToken`, nothing can be refreshed, and the account must be
         * updated with new tokens or authorized again.
         *
         * To correct the expiry of the current token, update the account with the
         * same `accessToken` and the new `expiresAt`; the account status does not
         * change. Resending the same `accessToken` keeps the stored `refreshToken`
         * and `scopes` unless the request supplies new non-empty values.
         * `expiresAt` is never returned; read the expiry back from the account's
         * `tokenExpiresAt`.
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
        /**
         * Same plain-object shape as {@link createConnectedAccount}, including the
         * optional `oauthToken.expiresAt` (for example
         * `timestampFromDate(new Date(...))` from `@bufbuild/protobuf/wkt`) when
         * importing a token obtained outside Scalekit.
         */
        authorizationDetails?: MessageInitShape<typeof CreateConnectedAccountSchema>['authorizationDetails'];
        organizationId?: string;
        userId?: string;
        apiConfig?: Record<string, unknown>;
    }): Promise<CreateConnectedAccountResponse>;
    /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
    upsertConnectedAccount: (params: {
        connectionName: string;
        identifier: string;
        /**
         * Same plain-object shape as {@link createConnectedAccount}, including the
         * optional `oauthToken.expiresAt` (for example
         * `timestampFromDate(new Date(...))` from `@bufbuild/protobuf/wkt`) when
         * importing a token obtained outside Scalekit.
         */
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
        /**
         * Same plain-object shape as {@link createConnectedAccount}, including the
         * optional `oauthToken.expiresAt` (for example
         * `timestampFromDate(new Date(...))` from `@bufbuild/protobuf/wkt`) when
         * importing a token obtained outside Scalekit. To correct the expiry of
         * the current token, send the same `accessToken` with the new
         * `expiresAt`; the account status does not change. A message built with
         * `create(AuthorizationDetailsSchema, ...)` is also accepted.
         */
        authorizationDetails?: MessageInitShape<typeof UpdateConnectedAccountSchema>['authorizationDetails'];
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
