import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { ConnectionService } from './pkg/grpc/scalekit/v1/connections/connections_connect';
import { GetConnectionResponse, ToggleConnectionResponse, ListConnectionsResponse } from './pkg/grpc/scalekit/v1/connections/connections_pb';

export default class ConnectionClient {
  private client: PromiseClient<typeof ConnectionService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(ConnectionService);
  }

  /**
   * Get a connection by id and organization id
   * @param organizationId The organization id
   * @param id The connection id
   * @returns {Promise<GetConnectionResponse>} The connection
   */
  async getConnection(organizationId: string, id: string): Promise<GetConnectionResponse> {
    return this.coreClient.connectExec(
      this.client.getConnection,
      {
        id,
        organizationId
      },
    )
  }

  /**
   * List connections by domain
   * @param domain The domain
   * @returns {Promise<ListConnectionsResponse>} The connection
   */
  async listConnectionsByDomain(domain: string): Promise<ListConnectionsResponse> {
    return this.coreClient.connectExec(
      this.client.listConnections,
      {
        domain
      },
    )
  }

  /**
   * List connections by organization id
   * @param organizationId The organization id
   * @returns {Promise<ListConnectionsResponse>} The list of connections
   */
  async listConnections(organizationId: string): Promise<ListConnectionsResponse> {
    return this.coreClient.connectExec(
      this.client.listConnections,
      {
        organizationId
      },
    )
  }

  /**
   * Enable a connection by id and organization id
   * @param organizationId The organization id
   * @param id The connection id
   * @returns {Promise<ToggleConnectionResponse>} The connection enable response
   */
  async enableConnection(organizationId: string, id: string): Promise<ToggleConnectionResponse> {
    return this.coreClient.connectExec(
      this.client.enableConnection,
      {
        id,
        organizationId
      },
    )
  }

  /**
   * Disable a connection by id and organization id
   * @param organizationId The organization id
   * @param id The connection id
   * @returns {Promise<ToggleConnectionResponse>} The connection enable response
   */
  async disableConnection(organizationId: string, id: string): Promise<ToggleConnectionResponse> {
    return this.coreClient.connectExec(
      this.client.disableConnection,
      {
        id,
        organizationId
      },
    )
  }
}

