import { PartialMessage } from "@bufbuild/protobuf";
import { PromiseClient } from "@connectrpc/connect";
import GrpcConnect from "./connect";
import CoreClient from "./core";
import { ConnectedAccountService } from "./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_connect";
import {
  CreateConnectedAccount,
  CreateConnectedAccountRequest,
  CreateConnectedAccountResponse,
  DeleteConnectedAccountRequest,
  DeleteConnectedAccountResponse,
  GetConnectedAccountByIdentifierRequest,
  GetConnectedAccountByIdentifierResponse,
  GetMagicLinkForConnectedAccountRequest,
  GetMagicLinkForConnectedAccountResponse,
  ListConnectedAccountsRequest,
  ListConnectedAccountsResponse,
  UpdateConnectedAccount,
  UpdateConnectedAccountRequest,
  UpdateConnectedAccountResponse,
} from "./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb";

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
  private client: PromiseClient<typeof ConnectedAccountService>;

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
    const request: PartialMessage<ListConnectedAccountsRequest> = {};

    if (options?.organizationId) {
      request.organizationId = options.organizationId;
    }
    if (options?.userId) {
      request.userId = options.userId;
    }
    if (options?.connector) {
      request.connector = options.connector;
    }
    if (options?.identifier) {
      request.identifier = options.identifier;
    }
    if (options?.provider) {
      request.provider = options.provider;
    }
    if (options?.pageSize !== undefined) {
      request.pageSize = options.pageSize;
    }
    if (options?.pageToken) {
      request.pageToken = options.pageToken;
    }
    if (options?.query) {
      request.query = options.query;
    }

    return this.coreClient.connectExec(
      this.client.listConnectedAccounts,
      request
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
    const {
      connector,
      identifier,
      connectedAccount,
      organizationId,
      userId,
    } = params;

    const request: PartialMessage<CreateConnectedAccountRequest> = {
      connector,
      identifier,
      connectedAccount,
    };

    if (organizationId) {
      request.organizationId = organizationId;
    }
    if (userId) {
      request.userId = userId;
    }

    return this.coreClient.connectExec(
      this.client.createConnectedAccount,
      request
    );
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

    const request: PartialMessage<UpdateConnectedAccountRequest> = {
      connector,
      identifier,
      connectedAccount,
    };

    if (organizationId) {
      request.organizationId = organizationId;
    }
    if (userId) {
      request.userId = userId;
    }
    if (connectedAccountId) {
      request.id = connectedAccountId;
    }

    return this.coreClient.connectExec(
      this.client.updateConnectedAccount,
      request
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
    const { connector, identifier, organizationId, userId, connectedAccountId } =
      params;

    const request: PartialMessage<DeleteConnectedAccountRequest> = {
      connector,
      identifier,
    };

    if (organizationId) {
      request.organizationId = organizationId;
    }
    if (userId) {
      request.userId = userId;
    }
    if (connectedAccountId) {
      request.id = connectedAccountId;
    }

    return this.coreClient.connectExec(
      this.client.deleteConnectedAccount,
      request
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
    const { connector, identifier, organizationId, userId, connectedAccountId } =
      params;

    const request: PartialMessage<GetMagicLinkForConnectedAccountRequest> = {
      connector,
      identifier,
    };

    if (organizationId) {
      request.organizationId = organizationId;
    }
    if (userId) {
      request.userId = userId;
    }
    if (connectedAccountId) {
      request.id = connectedAccountId;
    }

    return this.coreClient.connectExec(
      this.client.getMagicLinkForConnectedAccount,
      request
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
    const { connector, identifier, organizationId, userId, connectedAccountId } =
      params;

    const request: PartialMessage<GetConnectedAccountByIdentifierRequest> = {
      connector,
      identifier,
    };

    if (organizationId) {
      request.organizationId = organizationId;
    }
    if (userId) {
      request.userId = userId;
    }
    if (connectedAccountId) {
      request.id = connectedAccountId;
    }

    return this.coreClient.connectExec(
      this.client.getConnectedAccountAuth,
      request
    );
  }
}

