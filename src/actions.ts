import { create } from '@bufbuild/protobuf';
import { AxiosResponse } from 'axios';
import CoreClient from './core';
import ToolsClient from './tools';
import ConnectedAccountsClient from './connected-accounts';
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
    private readonly coreClient: CoreClient
  ) {}

  /**
   * Execute a tool on behalf of a connected account.
   *
   * Thin wrapper around ToolsClient.executeTool, reserved for future
   * pre/post modifier support.
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
   */
  async getAuthorizationLink(params: {
    connectionName?: string;
    identifier?: string;
    connectedAccountId?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<GetMagicLinkForConnectedAccountResponse> {
    const {
      connectionName,
      identifier,
      connectedAccountId,
      organizationId,
      userId,
    } = params;

    return this.connectedAccounts.getMagicLinkForConnectedAccount({
      connector: connectionName ?? '',
      identifier: identifier ?? '',
      organizationId,
      userId,
      connectedAccountId,
    });
  }

  /**
   * List connected accounts with optional filters.
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
   * Delete a connected account.
   */
  async deleteConnectedAccount(params: {
    connectionName: string;
    identifier: string;
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

    return this.connectedAccounts.deleteConnectedAccount({
      connector: connectionName,
      identifier,
      organizationId,
      userId,
      connectedAccountId,
    });
  }

  /**
   * Get connected account authorization details.
   */
  async getConnectedAccount(params: {
    connectionName: string;
    identifier: string;
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

    return this.connectedAccounts.getConnectedAccountByIdentifier({
      connector: connectionName,
      identifier,
      organizationId,
      userId,
      connectedAccountId,
    });
  }

  /**
   * Create a new connected account.
   *
   * This helper accepts a high-level payload and builds the
   * underlying CreateConnectedAccount message.
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

    return this.connectedAccounts.getOrCreateConnectedAccount({
      connector: connectionName,
      identifier,
      authorizationDetails,
      organizationId,
      userId,
      apiConfig,
    });
  }

  /**
   * Update an existing connected account.
   */
  async updateConnectedAccount(params: {
    connectionName: string;
    identifier: string;
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

    const connectedAccount = create(UpdateConnectedAccountSchema, {
      ...(authorizationDetails && { authorizationDetails }),
      ...(apiConfig != null && { apiConfig }),
    });

    return this.connectedAccounts.updateConnectedAccount({
      connector: connectionName,
      identifier,
      connectedAccount,
      organizationId,
      userId,
      connectedAccountId,
    });
  }

  /**
   * Make a proxied REST API call on behalf of a connected account.
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

    const url = `${this.coreClient.envUrl.replace(/\/$/, '')}/proxy${path}`;
    const timeout = timeoutMs ?? 30_000;

    const proxyHeaders: Record<string, string> = {
      connection_name: connectionName,
      Connection_name: connectionName,
      identifier,
      ...(headers ?? {}),
    };

    return this.coreClient.connectExec(
      (config) => this.coreClient.axios.request(config),
      {
        url,
        method: method.toUpperCase(),
        params: queryParams,
        data: body ?? formData,
        headers: proxyHeaders,
        timeout,
      }
    );
  }
}
