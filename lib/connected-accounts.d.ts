import { PartialMessage } from "@bufbuild/protobuf";
import GrpcConnect from "./connect";
import CoreClient from "./core";
import { AuthorizationDetails, CreateConnectedAccount, CreateConnectedAccountResponse, DeleteConnectedAccountResponse, GetConnectedAccountByIdentifierResponse, GetMagicLinkForConnectedAccountResponse, ListConnectedAccountsResponse, UpdateConnectedAccount, UpdateConnectedAccountResponse } from "./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb";
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
export default class ConnectedAccountsClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Lists connected accounts with optional filters and pagination.
     *
     * @param options Optional filtering and pagination parameters
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
    }): Promise<ListConnectedAccountsResponse>;
    /**
     * Creates a new connected account.
     *
     * @param params Connected account creation parameters
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
     */
    getOrCreateConnectedAccount(params: {
        connector: string;
        identifier: string;
        authorizationDetails?: PartialMessage<AuthorizationDetails>;
        organizationId?: string;
        userId?: string;
        apiConfig?: Record<string, unknown>;
    }): Promise<CreateConnectedAccountResponse>;
    /**
     * Updates an existing connected account.
     *
     * You can target the account either by `connectedAccountId` or by the combination
     * of `organizationId`/`userId`, `connector`, and `identifier`.
     */
    updateConnectedAccount(params: {
        connector: string;
        identifier: string;
        connectedAccount: UpdateConnectedAccount;
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
    }): Promise<UpdateConnectedAccountResponse>;
    /**
     * Deletes a connected account and revokes its credentials.
     *
     * You can target the account either by `connectedAccountId` or by the combination
     * of `organizationId`/`userId`, `connector`, and `identifier`.
     */
    deleteConnectedAccount(params: {
        connector: string;
        identifier: string;
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
    }): Promise<DeleteConnectedAccountResponse>;
    /**
     * Generates a time-limited magic link for connecting or re-authorizing a third-party account.
     */
    getMagicLinkForConnectedAccount(params: {
        connector: string;
        identifier: string;
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
    }): Promise<GetMagicLinkForConnectedAccountResponse>;
    /**
     * Retrieves complete authentication details for a connected account.
     *
     * This method returns sensitive credential information, so ensure you protect access
     * to this in your application.
     */
    getConnectedAccountByIdentifier(params: {
        connector: string;
        identifier: string;
        organizationId?: string;
        userId?: string;
        connectedAccountId?: string;
    }): Promise<GetConnectedAccountByIdentifierResponse>;
}
