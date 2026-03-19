import { create, type MessageInitShape } from '@bufbuild/protobuf';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { ScalekitNotFoundException } from './errors';
import {
  AuthorizationDetails,
  AuthorizationDetailsSchema,
  ConnectedAccountService,
  CreateConnectedAccount,
  CreateConnectedAccountRequestSchema,
  CreateConnectedAccountResponse,
  CreateConnectedAccountResponseSchema,
  CreateConnectedAccountSchema,
  DeleteConnectedAccountRequestSchema,
  DeleteConnectedAccountResponse,
  GetConnectedAccountByIdentifierRequestSchema,
  GetConnectedAccountByIdentifierResponse,
  GetMagicLinkForConnectedAccountRequestSchema,
  GetMagicLinkForConnectedAccountResponse,
  ListConnectedAccountsRequestSchema,
  ListConnectedAccountsResponse,
  OauthTokenSchema,
  UpdateConnectedAccount,
  UpdateConnectedAccountRequestSchema,
  UpdateConnectedAccountResponse,
} from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

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
  private client: Client<typeof ConnectedAccountService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(ConnectedAccountService);
  }

  /**
   * Lists connected accounts with optional filters and pagination.
   *
   * @param options Optional filtering and pagination parameters
   */
  async listConnectedAccounts(options?: {
    organizationId?: string;
    userId?: string;
    connector?: string;
    identifier?: string;
    provider?: string;
    pageSize?: number;
    pageToken?: string;
    query?: string;
  }): Promise<ListConnectedAccountsResponse> {
    return this.coreClient.connectExec(
      this.client.listConnectedAccounts,
      create(ListConnectedAccountsRequestSchema, {
        ...(options?.organizationId && {
          organizationId: options.organizationId,
        }),
        ...(options?.userId && { userId: options.userId }),
        ...(options?.connector && { connector: options.connector }),
        ...(options?.identifier && { identifier: options.identifier }),
        ...(options?.provider && { provider: options.provider }),
        ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
        ...(options?.pageToken && { pageToken: options.pageToken }),
        ...(options?.query && { query: options.query }),
      })
    );
  }

  /**
   * Creates a new connected account.
   *
   * @param params Connected account creation parameters
   */
  async createConnectedAccount(params: {
    connector: string;
    identifier: string;
    connectedAccount: CreateConnectedAccount;
    organizationId?: string;
    userId?: string;
  }): Promise<CreateConnectedAccountResponse> {
    const { connector, identifier, connectedAccount, organizationId, userId } =
      params;

    return this.coreClient.connectExec(
      this.client.createConnectedAccount,
      create(CreateConnectedAccountRequestSchema, {
        connector,
        identifier,
        connectedAccount,
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
      })
    );
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
  async getOrCreateConnectedAccount(params: {
    connector: string;
    identifier: string;
    authorizationDetails?: MessageInitShape<typeof AuthorizationDetailsSchema>;
    organizationId?: string;
    userId?: string;
    apiConfig?: Record<string, unknown>;
  }): Promise<CreateConnectedAccountResponse> {
    const {
      connector,
      identifier,
      authorizationDetails,
      organizationId,
      userId,
      apiConfig,
    } = params;

    if (!connector?.trim()) {
      throw new Error('connector is required');
    }
    if (!identifier?.trim()) {
      throw new Error('identifier is required');
    }

    try {
      const getResponse = await this.getConnectedAccountByIdentifier({
        connector,
        identifier,
        organizationId,
        userId,
      });
      return create(CreateConnectedAccountResponseSchema, {
        connectedAccount: getResponse.connectedAccount,
      });
    } catch (err) {
      if (!(err instanceof ScalekitNotFoundException)) {
        throw err;
      }
    }

    const resolvedAuthDetails: AuthorizationDetails = authorizationDetails
      ? create(AuthorizationDetailsSchema, authorizationDetails)
      : create(AuthorizationDetailsSchema, {
          details: { case: 'oauthToken', value: create(OauthTokenSchema, {}) },
        });

    const connectedAccountPayload = create(CreateConnectedAccountSchema, {
      authorizationDetails: resolvedAuthDetails,
      ...(apiConfig != null && {
        apiConfig: apiConfig as unknown as CreateConnectedAccount['apiConfig'],
      }),
    });

    return this.createConnectedAccount({
      connector,
      identifier,
      connectedAccount: connectedAccountPayload,
      organizationId,
      userId,
    });
  }

  /**
   * Updates an existing connected account.
   *
   * You can target the account either by `connectedAccountId` or by the combination
   * of `organizationId`/`userId`, `connector`, and `identifier`.
   */
  async updateConnectedAccount(params: {
    connector: string;
    identifier: string;
    connectedAccount: UpdateConnectedAccount;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
  }): Promise<UpdateConnectedAccountResponse> {
    const {
      connector,
      identifier,
      connectedAccount,
      organizationId,
      userId,
      connectedAccountId,
    } = params;

    return this.coreClient.connectExec(
      this.client.updateConnectedAccount,
      create(UpdateConnectedAccountRequestSchema, {
        connector,
        identifier,
        connectedAccount,
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
        ...(connectedAccountId && { id: connectedAccountId }),
      })
    );
  }

  /**
   * Deletes a connected account and revokes its credentials.
   *
   * You can target the account either by `connectedAccountId` or by the combination
   * of `organizationId`/`userId`, `connector`, and `identifier`.
   */
  async deleteConnectedAccount(params: {
    connector: string;
    identifier: string;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
  }): Promise<DeleteConnectedAccountResponse> {
    const {
      connector,
      identifier,
      organizationId,
      userId,
      connectedAccountId,
    } = params;

    return this.coreClient.connectExec(
      this.client.deleteConnectedAccount,
      create(DeleteConnectedAccountRequestSchema, {
        connector,
        identifier,
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
        ...(connectedAccountId && { id: connectedAccountId }),
      })
    );
  }

  /**
   * Generates a time-limited magic link for connecting or re-authorizing a third-party account.
   */
  async getMagicLinkForConnectedAccount(params: {
    connector: string;
    identifier: string;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
  }): Promise<GetMagicLinkForConnectedAccountResponse> {
    const {
      connector,
      identifier,
      organizationId,
      userId,
      connectedAccountId,
    } = params;

    return this.coreClient.connectExec(
      this.client.getMagicLinkForConnectedAccount,
      create(GetMagicLinkForConnectedAccountRequestSchema, {
        connector,
        identifier,
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
        ...(connectedAccountId && { id: connectedAccountId }),
      })
    );
  }

  /**
   * Retrieves complete authentication details for a connected account.
   *
   * This method returns sensitive credential information, so ensure you protect access
   * to this in your application.
   */
  async getConnectedAccountByIdentifier(params: {
    connector: string;
    identifier: string;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
  }): Promise<GetConnectedAccountByIdentifierResponse> {
    const {
      connector,
      identifier,
      organizationId,
      userId,
      connectedAccountId,
    } = params;

    return this.coreClient.connectExec(
      this.client.getConnectedAccountAuth,
      create(GetConnectedAccountByIdentifierRequestSchema, {
        connector,
        identifier,
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
        ...(connectedAccountId && { id: connectedAccountId }),
      })
    );
  }
}
