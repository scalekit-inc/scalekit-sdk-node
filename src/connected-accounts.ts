import { create, type MessageInitShape } from '@bufbuild/protobuf';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { ScalekitException, ScalekitNotFoundException } from './errors';
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
  VerifyConnectedAccountUserRequestSchema,
  VerifyConnectedAccountUserResponse,
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
   * @throws {ScalekitServerException} If a network or server error occurs.
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
        ...(options?.connector?.trim() && {
          connector: options.connector.trim(),
        }),
        ...(options?.identifier?.trim() && {
          identifier: options.identifier.trim(),
        }),
        ...(options?.provider?.trim() && { provider: options.provider.trim() }),
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
   * @throws {ScalekitServerException} If a network or server error occurs.
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
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If connector or identifier is missing.
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
      connector: rawConnector,
      identifier: rawIdentifier,
      authorizationDetails,
      organizationId,
      userId,
      apiConfig,
    } = params;

    const connector = rawConnector?.trim();
    const identifier = rawIdentifier?.trim();

    if (!connector) {
      throw new Error('connector is required');
    }
    if (!identifier) {
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
   * You can target the account either by `connectedAccountId` alone, or by the
   * combination of `connector` and `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  async updateConnectedAccount(params: {
    connector?: string;
    identifier?: string;
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

    if (!connectedAccountId && !(connector?.trim() && identifier?.trim())) {
      throw new Error(
        'either connectedAccountId or connector + identifier is required'
      );
    }

    return this.coreClient.connectExec(
      this.client.updateConnectedAccount,
      create(UpdateConnectedAccountRequestSchema, {
        ...(connector?.trim() && { connector: connector.trim() }),
        ...(identifier?.trim() && { identifier: identifier.trim() }),
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
   * You can target the account either by `connectedAccountId` alone, or by the
   * combination of `connector` and `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  async deleteConnectedAccount(params: {
    connector?: string;
    identifier?: string;
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

    if (!connectedAccountId && !(connector?.trim() && identifier?.trim())) {
      throw new Error(
        'either connectedAccountId or connector + identifier is required'
      );
    }

    return this.coreClient.connectExec(
      this.client.deleteConnectedAccount,
      create(DeleteConnectedAccountRequestSchema, {
        ...(connector?.trim() && { connector: connector.trim() }),
        ...(identifier?.trim() && { identifier: identifier.trim() }),
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
        ...(connectedAccountId && { id: connectedAccountId }),
      })
    );
  }

  /**
   * Generates a time-limited magic link for connecting or re-authorizing a third-party account.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async getMagicLinkForConnectedAccount(params: {
    connector?: string;
    identifier?: string;
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
    state?: string;
    userVerifyUrl?: string;
  }): Promise<GetMagicLinkForConnectedAccountResponse> {
    const {
      connector,
      identifier,
      organizationId,
      userId,
      connectedAccountId,
      state,
      userVerifyUrl,
    } = params;

    return this.coreClient.connectExec(
      this.client.getMagicLinkForConnectedAccount,
      create(GetMagicLinkForConnectedAccountRequestSchema, {
        ...(connector && { connector }),
        ...(identifier && { identifier }),
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
        ...(connectedAccountId && { id: connectedAccountId }),
        ...(state && { state }),
        ...(userVerifyUrl && { userVerifyUrl }),
      })
    );
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
  async verifyConnectedAccountUser(params: {
    authRequestId: string;
    identifier: string;
  }): Promise<VerifyConnectedAccountUserResponse> {
    const authRequestId = params.authRequestId?.trim();
    const identifier = params.identifier?.trim();

    if (!authRequestId) {
      throw new Error('authRequestId is required');
    }
    if (!identifier) {
      throw new Error('identifier is required');
    }

    return this.coreClient.connectExec(
      this.client.verifyConnectedAccountUser,
      create(VerifyConnectedAccountUserRequestSchema, {
        authRequestId,
        identifier,
      })
    );
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
  async getConnectedAccountByIdentifier(params: {
    connector?: string;
    identifier?: string;
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
        ...(connector && { connector }),
        ...(identifier && { identifier }),
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
        ...(connectedAccountId && { id: connectedAccountId }),
      })
    );
  }
}
