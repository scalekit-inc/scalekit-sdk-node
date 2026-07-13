import { create } from '@bufbuild/protobuf';
import { AxiosError, AxiosResponse } from 'axios';
import CoreClient, { assertValidTimeout } from './core';
import {
  ScalekitException,
  ScalekitGatewayTimeoutException,
  ScalekitServerException,
} from './errors';
import ToolsClient from './tools';
import ConnectedAccountsClient from './connected-accounts';
import ConnectionClient from './connection';
import {
  ConnectionStatus,
  ConnectionType,
  ListConnection,
} from './pkg/grpc/scalekit/v1/connections/connections_pb';

/**
 * A protobuf Timestamp as returned by the API, passed through unchanged.
 * `seconds` is an int64 and therefore a `bigint` in JS.
 */
export interface AppConnectionTimestamp {
  seconds: bigint;
  nanos: number;
}

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

/**
 * Map a raw {@link ListConnection} proto message to the normalized
 * {@link AppConnection} shape exposed by the actions namespace.
 */
function mapAppConnection(connection: ListConnection): AppConnection {
  return {
    id: connection.id,
    type: ConnectionType[connection.type] ?? String(connection.type),
    status: ConnectionStatus[connection.status] ?? String(connection.status),
    enabled: connection.enabled,
    provider: connection.providerKey,
    connectionName: connection.keyId,
    createdAt: connection.createdAt
      ? {
          seconds: connection.createdAt.seconds,
          nanos: connection.createdAt.nanos,
        }
      : undefined,
  };
}
import {
  CreateConnectedAccount,
  CreateConnectedAccountResponse,
  CreateConnectedAccountSchema,
  DeleteConnectedAccountResponse,
  GetConnectedAccountByIdentifierResponse,
  GetMagicLinkForConnectedAccountResponse,
  ListConnectedAccountsResponse,
  UpdateConnectedAccount,
  UpdateConnectedAccountResponse,
  UpdateConnectedAccountSchema,
  VerifyConnectedAccountUserResponse,
} from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';
import { ExecuteToolResponse } from './pkg/grpc/scalekit/v1/tools/tools_pb';

/**
 * This class is intended to be accessed via `ScalekitClient.actions`.
 * It composes the existing ToolsClient and ConnectedAccountsClient
 * without changing their behavior.
 */
export default class ActionsClient {
  constructor(
    private readonly tools: ToolsClient,
    private readonly connectedAccounts: ConnectedAccountsClient,
    private readonly coreClient: CoreClient,
    private readonly connection: ConnectionClient
  ) {}

  /**
   * Execute a tool on behalf of a connected account.
   *
   * Thin wrapper around ToolsClient.executeTool, reserved for future
   * pre/post modifier support.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If toolName is missing or an unexpected error occurs.
   */
  async executeTool(params: {
    toolName: string;
    toolInput: Record<string, unknown>;
    identifier?: string;
    connectedAccountId?: string;
    connector?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<ExecuteToolResponse> {
    const {
      toolName,
      toolInput,
      identifier,
      connectedAccountId,
      connector,
      organizationId,
      userId,
    } = params;

    if (!toolName?.trim()) {
      throw new Error('toolName is required');
    }

    return this.tools.executeTool({
      toolName,
      identifier,
      params: toolInput,
      connectedAccountId,
      connector,
      organizationId,
      userId,
    });
  }

  /**
   * Get an authorization magic link for a connected account.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async getAuthorizationLink(params: {
    connectionName?: string;
    identifier?: string;
    connectedAccountId?: string;
    organizationId?: string;
    userId?: string;
    state?: string;
    userVerifyUrl?: string;
  }): Promise<GetMagicLinkForConnectedAccountResponse> {
    const {
      connectionName,
      identifier,
      connectedAccountId,
      organizationId,
      userId,
      state,
      userVerifyUrl,
    } = params;

    return this.connectedAccounts.getMagicLinkForConnectedAccount({
      connector: connectionName,
      identifier,
      organizationId,
      userId,
      connectedAccountId,
      state,
      userVerifyUrl,
    });
  }

  /**
   * Verify the connected account user after OAuth callback.
   *
   * Called by the B2B app server with the `authRequestId` from the user verify
   * redirect URL and the current user's identifier. Activates the connected account
   * once the asserted identifier is confirmed.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async verifyConnectedAccountUser(params: {
    authRequestId: string;
    identifier: string;
  }): Promise<VerifyConnectedAccountUserResponse> {
    return this.connectedAccounts.verifyConnectedAccountUser(params);
  }

  /**
   * List connected accounts with optional filters.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async listConnectedAccounts(params?: {
    connectionName?: string;
    identifier?: string;
    provider?: string;
    organizationId?: string;
    userId?: string;
    pageSize?: number;
    pageToken?: string;
    query?: string;
  }): Promise<ListConnectedAccountsResponse> {
    return this.connectedAccounts.listConnectedAccounts({
      organizationId: params?.organizationId,
      userId: params?.userId,
      connector: params?.connectionName,
      identifier: params?.identifier,
      provider: params?.provider,
      pageSize: params?.pageSize,
      pageToken: params?.pageToken,
      query: params?.query,
    });
  }

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
  async listConnections(params?: {
    pageSize?: number;
    pageToken?: string;
    provider?: string;
  }): Promise<ListAppConnectionsResult> {
    const response = await this.connection.listAppConnections({
      pageSize: params?.pageSize,
      pageToken: params?.pageToken,
      provider: params?.provider,
    });
    return {
      connections: response.connections.map(mapAppConnection),
      nextPageToken: response.nextPageToken,
      prevPageToken: response.prevPageToken,
      totalSize: response.totalSize,
    };
  }

  /**
   * Delete a connected account.
   * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  async deleteConnectedAccount(params: {
    connectionName?: string;
    identifier?: string;
    connectedAccountId?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<DeleteConnectedAccountResponse> {
    const {
      connectionName,
      identifier,
      connectedAccountId,
      organizationId,
      userId,
    } = params;

    const trimmedConnectionName = connectionName?.trim();
    const trimmedIdentifier = identifier?.trim();
    const trimmedConnectedAccountId = connectedAccountId?.trim();

    if (
      !trimmedConnectedAccountId &&
      !(trimmedConnectionName && trimmedIdentifier)
    ) {
      throw new Error(
        'either connectedAccountId or connectionName + identifier is required'
      );
    }

    return this.connectedAccounts.deleteConnectedAccount({
      connector: trimmedConnectionName,
      identifier: trimmedIdentifier,
      organizationId,
      userId,
      connectedAccountId: trimmedConnectedAccountId,
    });
  }

  /**
   * Get connected account authorization details.
   * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  async getConnectedAccount(params: {
    connectionName?: string;
    identifier?: string;
    connectedAccountId?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<GetConnectedAccountByIdentifierResponse> {
    const {
      connectionName,
      identifier,
      connectedAccountId,
      organizationId,
      userId,
    } = params;

    const trimmedConnectionName = connectionName?.trim();
    const trimmedIdentifier = identifier?.trim();
    const trimmedConnectedAccountId = connectedAccountId?.trim();

    if (
      !trimmedConnectedAccountId &&
      !(trimmedConnectionName && trimmedIdentifier)
    ) {
      throw new Error(
        'either connectedAccountId or connectionName + identifier is required'
      );
    }

    return this.connectedAccounts.getConnectedAccountByIdentifier({
      connector: trimmedConnectionName,
      identifier: trimmedIdentifier,
      organizationId,
      userId,
      connectedAccountId: trimmedConnectedAccountId,
    });
  }

  /**
   * Create a new connected account.
   *
   * This helper accepts a high-level payload and builds the
   * underlying CreateConnectedAccount message.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If connectionName or identifier is missing.
   */
  async createConnectedAccount(params: {
    connectionName: string;
    identifier: string;
    authorizationDetails: CreateConnectedAccount['authorizationDetails'];
    organizationId?: string;
    userId?: string;
    apiConfig?: Record<string, unknown>;
  }): Promise<CreateConnectedAccountResponse> {
    const {
      connectionName,
      identifier,
      authorizationDetails,
      organizationId,
      userId,
      apiConfig,
    } = params;

    if (!connectionName?.trim()) {
      throw new Error('connectionName is required');
    }
    if (!identifier?.trim()) {
      throw new Error('identifier is required');
    }

    const connectedAccount = create(CreateConnectedAccountSchema, {
      authorizationDetails,
      ...(apiConfig != null && {
        apiConfig: apiConfig as unknown as CreateConnectedAccount['apiConfig'],
      }),
    });

    return this.connectedAccounts.createConnectedAccount({
      connector: connectionName,
      identifier,
      connectedAccount,
      organizationId,
      userId,
    });
  }

  /**
   * Get an existing connected account or create a new one if it doesn't exist.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If connectionName or identifier is missing.
   */
  async getOrCreateConnectedAccount(params: {
    connectionName: string;
    identifier: string;
    authorizationDetails?: CreateConnectedAccount['authorizationDetails'];
    organizationId?: string;
    userId?: string;
    apiConfig?: Record<string, unknown>;
  }): Promise<CreateConnectedAccountResponse> {
    const {
      connectionName,
      identifier,
      authorizationDetails,
      organizationId,
      userId,
      apiConfig,
    } = params;

    if (!connectionName?.trim()) {
      throw new Error('connectionName is required');
    }
    if (!identifier?.trim()) {
      throw new Error('identifier is required');
    }

    return this.connectedAccounts.getOrCreateConnectedAccount({
      connector: connectionName.trim(),
      identifier: identifier.trim(),
      authorizationDetails,
      organizationId,
      userId,
      apiConfig,
    });
  }

  /** Alias for {@link getOrCreateConnectedAccount} — preferred name for upsert semantics. */
  upsertConnectedAccount = this.getOrCreateConnectedAccount.bind(this);

  /**
   * Update an existing connected account.
   * Requires either `connectedAccountId` or both `connectionName` + `identifier`.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   * @throws {ScalekitException} If required parameters are missing.
   */
  async updateConnectedAccount(params: {
    connectionName?: string;
    identifier?: string;
    authorizationDetails?: UpdateConnectedAccount['authorizationDetails'];
    organizationId?: string;
    userId?: string;
    connectedAccountId?: string;
    apiConfig?: UpdateConnectedAccount['apiConfig'];
  }): Promise<UpdateConnectedAccountResponse> {
    const {
      connectionName,
      identifier,
      authorizationDetails,
      organizationId,
      userId,
      connectedAccountId,
      apiConfig,
    } = params;

    const trimmedConnectionName = connectionName?.trim();
    const trimmedIdentifier = identifier?.trim();
    const trimmedConnectedAccountId = connectedAccountId?.trim();

    if (
      !trimmedConnectedAccountId &&
      !(trimmedConnectionName && trimmedIdentifier)
    ) {
      throw new Error(
        'either connectedAccountId or connectionName + identifier is required'
      );
    }

    const connectedAccount = create(UpdateConnectedAccountSchema, {
      ...(authorizationDetails && { authorizationDetails }),
      ...(apiConfig != null && { apiConfig }),
    });

    return this.connectedAccounts.updateConnectedAccount({
      connector: trimmedConnectionName,
      identifier: trimmedIdentifier,
      connectedAccount,
      organizationId,
      userId,
      connectedAccountId: trimmedConnectedAccountId,
    });
  }

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
  async request(params: {
    connectionName: string;
    identifier: string;
    path: string;
    method?: string;
    queryParams?: Record<string, unknown>;
    body?: unknown;
    formData?: Record<string, unknown>;
    headers?: Record<string, string>;
    timeoutMs?: number;
  }): Promise<AxiosResponse<any>> {
    const {
      connectionName,
      identifier,
      path,
      method = 'GET',
      queryParams,
      body,
      formData,
      headers,
      timeoutMs,
    } = params;

    if (!connectionName?.trim()) {
      throw new Error('connectionName is required');
    }
    if (!identifier?.trim()) {
      throw new Error('identifier is required');
    }
    if (!path?.trim()) {
      throw new Error('path is required');
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${this.coreClient.envUrl.replace(/\/$/, '')}/proxy${normalizedPath}`;
    if (timeoutMs !== undefined) {
      assertValidTimeout('timeoutMs', timeoutMs);
    }
    const timeout = timeoutMs ?? this.coreClient.toolTimeoutMs;

    const proxyHeaders: Record<string, string> = {
      ...(headers ?? {}),
      connection_name: connectionName,
      identifier,
    };

    try {
      return await this.coreClient.axios.request({
        url,
        method: method.toUpperCase(),
        params: queryParams,
        data: body ?? formData,
        headers: proxyHeaders,
        timeout,
      });
    } catch (error) {
      if (error instanceof ScalekitException) throw error;
      if (error instanceof AxiosError) {
        if (error.response)
          throw ScalekitServerException.promote(error.response);
        // Same exception type as a gRPC deadline expiry, so callers handle
        // both timeout paths uniformly.
        if (ScalekitGatewayTimeoutException.isAxiosTimeout(error)) {
          throw ScalekitGatewayTimeoutException.fromAxiosTimeout(error);
        }
        throw new ScalekitException(error);
      }
      throw new ScalekitException(error);
    }
  }
}
