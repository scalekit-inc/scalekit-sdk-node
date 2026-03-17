import { AxiosResponse } from "axios";
import CoreClient from "./core";
import ToolsClient from "./tools";
import ConnectedAccountsClient from "./connected-accounts";
import { CreateConnectedAccount, CreateConnectedAccountResponse, DeleteConnectedAccountResponse, GetConnectedAccountByIdentifierResponse, GetMagicLinkForConnectedAccountResponse, ListConnectedAccountsResponse, UpdateConnectedAccount, UpdateConnectedAccountResponse } from "./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb";
import { ExecuteToolResponse } from "./pkg/grpc/scalekit/v1/tools/tools_pb";
/**
 * This class is intended to be accessed via `ScalekitClient.actions`.
 * It composes the existing ToolsClient and ConnectedAccountsClient
 * without changing their behavior.
 */
export default class ActionsClient {
    private readonly tools;
    private readonly connectedAccounts;
    private readonly coreClient;
    constructor(tools: ToolsClient, connectedAccounts: ConnectedAccountsClient, coreClient: CoreClient);
    /**
     * Execute a tool on behalf of a connected account.
     *
     * Thin wrapper around ToolsClient.executeTool, reserved for future
     * pre/post modifier support.
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
     * Get an authorization magic link for a connected account.
     */
    getAuthorizationLink(params: {
        connectionName?: string;
        identifier?: string;
        connectedAccountId?: string;
        organizationId?: string;
        userId?: string;
    }): Promise<GetMagicLinkForConnectedAccountResponse>;
    /**
     * List connected accounts with optional filters.
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
    }): Promise<ListConnectedAccountsResponse>;
    /**
     * Delete a connected account.
     */
    deleteConnectedAccount(params: {
        connectionName: string;
        identifier: string;
        connectedAccountId?: string;
        organizationId?: string;
        userId?: string;
    }): Promise<DeleteConnectedAccountResponse>;
    /**
     * Get connected account authorization details.
     */
    getConnectedAccount(params: {
        connectionName: string;
        identifier: string;
        connectedAccountId?: string;
        organizationId?: string;
        userId?: string;
    }): Promise<GetConnectedAccountByIdentifierResponse>;
    /**
     * Create a new connected account.
     *
     * This helper accepts a high-level payload and builds the
     * underlying CreateConnectedAccount message.
     */
    createConnectedAccount(params: {
        connectionName: string;
        identifier: string;
        authorizationDetails: CreateConnectedAccount["authorizationDetails"];
        organizationId?: string;
        userId?: string;
        apiConfig?: Record<string, unknown>;
    }): Promise<CreateConnectedAccountResponse>;
    /**
     * Get an existing connected account or create a new one if it doesn't exist.
     */
    getOrCreateConnectedAccount(params: {
        connectionName: string;
        identifier: string;
        authorizationDetails?: CreateConnectedAccount["authorizationDetails"];
        organizationId?: string;
        userId?: string;
        apiConfig?: Record<string, unknown>;
    }): Promise<CreateConnectedAccountResponse>;
    /**
     * Update an existing connected account.
     */
    updateConnectedAccount(params: {
        connectionName: string;
        identifier: string;
        authorizationDetails?: UpdateConnectedAccount["authorizationDetails"];
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
        apiConfig?: UpdateConnectedAccount["apiConfig"];
    }): Promise<UpdateConnectedAccountResponse>;
    /**
     * Make a proxied REST API call on behalf of a connected account.
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
