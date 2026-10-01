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
  SearchConnectedAccountsRequestSchema,
  SearchConnectedAccountsResponse,
  UpdateConnectedAccount,
  UpdateConnectedAccountRequestSchema,
  UpdateConnectedAccountResponse,
  UpdateConnectedAccountSchema,
  VerifyConnectedAccountUserRequestSchema,
  VerifyConnectedAccountUserResponse,
} from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

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
    connectionNames?: string[];
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
        ...(options?.connectionNames?.length && {
          connectionNames: options.connectionNames,
        }),
      })
    );
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
  async searchConnectedAccounts(options: {
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
  }): Promise<SearchConnectedAccountsResponse> {
    const query = options?.query?.trim();
    if (!query) {
      throw new Error('query is required');
    }
    const connectionId = options.connectionId?.trim();

    return this.coreClient.connectExec(
      this.client.searchConnectedAccounts,
      create(SearchConnectedAccountsRequestSchema, {
        query,
        ...(options.pageSize !== undefined && { pageSize: options.pageSize }),
        ...(options.pageToken !== undefined && {
          pageToken: options.pageToken,
        }),
        ...(connectionId && { connectionId }),
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

      // True upsert: if credentials were supplied, apply them regardless of
      // the account's current status (PENDING_AUTH, EXPIRED, DISCONNECTED, ACTIVE).
      if (authorizationDetails) {
        const updateResponse = await this.updateConnectedAccount({
          connector,
          identifier,
          connectedAccount: create(UpdateConnectedAccountSchema, {
            authorizationDetails: create(
              AuthorizationDetailsSchema,
              authorizationDetails
            ),
            ...(apiConfig != null && {
              apiConfig: apiConfig as UpdateConnectedAccount['apiConfig'],
            }),
          }),
          organizationId,
          userId,
        });
        return create(CreateConnectedAccountResponseSchema, {
          connectedAccount: updateResponse.connectedAccount,
        });
      }

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

  /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
  upsertConnectedAccount = this.getOrCreateConnectedAccount.bind(this);

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
  async getConnectedAccountDetails(options: {
    /** Connector (connection name), e.g. `"gmail"`. Use with `identifier`. */
    connector?: string;
    /** Your application's identifier for the end user. Use with `connector`. */
    identifier?: string;
    /** Organization the account is scoped to. */
    organizationId?: string;
    /** Scalekit user the account is scoped to. */
    userId?: string;
    /** Connected account ID (`ca_...`), as an alternative to `connector` + `identifier`. */
    connectedAccountId?: string;
  }): Promise<GetConnectedAccountByIdentifierResponse> {
    const connector = options?.connector?.trim();
    const identifier = options?.identifier?.trim();
    const connectedAccountId = options?.connectedAccountId?.trim();
    const organizationId = options?.organizationId;
    const userId = options?.userId;

    if (!connectedAccountId && !(connector && identifier)) {
      throw new Error(
        'either connectedAccountId or connector + identifier is required'
      );
    }

    return this.coreClient.connectExec(
      this.client.getConnectedAccountDetails,
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
