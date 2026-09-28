import { type JsonObject } from '@bufbuild/protobuf';
import { AxiosResponse } from 'axios';
import CoreClient from './core';
import ToolsClient from './tools';
import ConnectedAccountsClient from './connected-accounts';
import ConnectionClient from './connection';
import type { Timestamp } from '@bufbuild/protobuf/wkt';
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
import { CreateConnectedAccount, CreateConnectedAccountResponse, DeleteConnectedAccountResponse, GetConnectedAccountByIdentifierResponse, GetMagicLinkForConnectedAccountResponse, ListConnectedAccountsResponse, UpdateConnectedAccount, UpdateConnectedAccountResponse, VerifyConnectedAccountUserResponse } from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';
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
    /**
     * @param {ToolsClient} tools - Client used to execute tools on behalf of connected accounts.
     * @param {ConnectedAccountsClient} connectedAccounts - Client for connected-account lifecycle operations.
     * @param {CoreClient} coreClient - Shared core client (auth, HTTP, retries) used for proxied requests.
     * @param {ConnectionClient} connection - Client used to list app-level connections.
     */
    constructor(tools: ToolsClient, connectedAccounts: ConnectedAccountsClient, coreClient: CoreClient, connection: ConnectionClient);
    /**
     * Execute a tool on behalf of a connected account.
     *
     * Identify the account with `connector` + `identifier`, or with
     * `connectedAccountId`. The account must be `ACTIVE`; otherwise the call
     * fails with `INVALID_ARGUMENT`, so send the user an authorization link first.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If toolName is missing or an unexpected error occurs.
     */
    executeTool(params: {
        /** Name of the tool to run, for example `gmail_fetch_mails`. Each connector page lists its tools. */
        toolName: string;
        /** The tool's input parameters. Their shape depends on the tool. */
        toolInput: Record<string, unknown>;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier?: string;
        /** ID of the connected account. Use it instead of `connector` + `identifier`. */
        connectedAccountId?: string;
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). Pass it with `identifier`, or pass `connectedAccountId` instead. */
        connector?: string;
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
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
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). */
        connectionName?: string;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier?: string;
        /** Filter by provider, for example `GMAIL`. */
        provider?: string;
        /** Only return these tools, by name. */
        toolName?: string[];
        /** Full-text search over tool names and descriptions, for example `gmail get attachment`. */
        query?: string;
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
        userId?: string;
        /** ID of the connected account. Use it instead of `connectionName` + `identifier`. */
        connectedAccountId?: string;
        /** Return only tool names, not full tool definitions. */
        summary?: boolean;
        /** Maximum number of results per page. */
        pageSize?: number;
        /** `nextPageToken` from the previous response, to fetch the next page. */
        pageToken?: string;
    }): Promise<ListToolsResult>;
    /**
     * Get an authorization link for a connected account. Send it to the user so
     * they can connect their account, or reconnect it after it expires.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    getAuthorizationLink(params: {
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). */
        connectionName?: string;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier?: string;
        /** ID of the connected account. Use it instead of `connectionName` + `identifier`. */
        connectedAccountId?: string;
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
        userId?: string;
        /** Opaque value added to the user verify redirect URL, so your app can check the request when the user returns. */
        state?: string;
        /** Your app's user verify URL. Scalekit redirects the user here after they authorize, when user verification is on. */
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
        /** `auth_request_id` from the user verify redirect URL. */
        authRequestId: string;
        /** Your app's ID for the signed-in user, the same value you used when you created the authorization link. Use a stable internal ID, not an email address. */
        identifier: string;
    }): Promise<VerifyConnectedAccountUserResponse>;
    /**
     * List connected accounts with optional filters.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listConnectedAccounts(params?: {
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). */
        connectionName?: string;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier?: string;
        /** Filter by provider, for example `GMAIL`. */
        provider?: string;
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
        userId?: string;
        /** Maximum number of results per page. */
        pageSize?: number;
        /** `nextPageToken` from the previous response, to fetch the next page. */
        pageToken?: string;
        /** Case-insensitive text search over connected accounts, for example by identifier. */
        query?: string;
        /** Only return accounts in these connections, by exact name. Up to 20. Don't combine with `connectionName`. */
        connectionNames?: string[];
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
    /**
     * Delete a connected account.
     * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    deleteConnectedAccount(params: {
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). */
        connectionName?: string;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier?: string;
        /** ID of the connected account. Use it instead of `connectionName` + `identifier`. */
        connectedAccountId?: string;
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
        userId?: string;
    }): Promise<DeleteConnectedAccountResponse>;
    /**
     * Get a connected account, including its credentials and status.
     * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If required parameters are missing.
     */
    getConnectedAccount(params: {
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). */
        connectionName?: string;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier?: string;
        /** ID of the connected account. Use it instead of `connectionName` + `identifier`. */
        connectedAccountId?: string;
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
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
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). */
        connectionName: string;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier: string;
        /** The user's credentials for the app: OAuth tokens (`oauthToken`) or static credentials such as an API key (`staticAuth`). */
        authorizationDetails: CreateConnectedAccount['authorizationDetails'];
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
        userId?: string;
        /** Connector-specific settings for this account, as JSON. */
        apiConfig?: Record<string, unknown>;
    }): Promise<CreateConnectedAccountResponse>;
    /**
     * Get an existing connected account or create a new one if it doesn't exist.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {ScalekitException} If connectionName or identifier is missing.
     */
    getOrCreateConnectedAccount(params: {
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). */
        connectionName: string;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier: string;
        /** Credentials to store: used to create the account, or to update it when it already exists. */
        authorizationDetails?: CreateConnectedAccount['authorizationDetails'];
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
        userId?: string;
        /** Connector-specific settings for this account, as JSON. */
        apiConfig?: Record<string, unknown>;
    }): Promise<CreateConnectedAccountResponse>;
    /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
    upsertConnectedAccount: (params: {
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). */
        connectionName: string;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier: string;
        /** Credentials to store: used to create the account, or to update it when it already exists. */
        authorizationDetails?: CreateConnectedAccount["authorizationDetails"];
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
        userId?: string;
        /** Connector-specific settings for this account, as JSON. */
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
        /** Connection name, as shown in AgentKit > Connections (for example `gmail`). */
        connectionName?: string;
        /** Your app's ID for the user, the same value you use when the user connects. Use a stable internal ID, not an email address. */
        identifier?: string;
        /** New credentials, for example tokens after a refresh. Only the fields you pass change. */
        authorizationDetails?: UpdateConnectedAccount['authorizationDetails'];
        /** Scalekit organization ID. Narrows the lookup when the same identifier exists in more than one organization. */
        organizationId?: string;
        /** Scalekit user ID. Narrows the lookup when the same identifier exists for more than one user. */
        userId?: string;
        /** ID of the connected account. Use it instead of `connectionName` + `identifier`. */
        connectedAccountId?: string;
        /** Connector-specific settings. Merged with the existing settings: only the fields you pass change. */
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
