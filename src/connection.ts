import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { ConnectionService } from './pkg/grpc/scalekit/v1/connections/connections_connect';
import { GetConnectionResponse, ListConnectionsResponse } from './pkg/grpc/scalekit/v1/connections/connections_pb';

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
   * @param id The connection id
   * @param organizationId The organization id
   * @returns {Promise<GetConnectionResponse>} The connection
   */
  async getConnection(id: string, organizationId: string): Promise<GetConnectionResponse> {
    return this.coreClient.connectExec(
      this.client.getConnection,
      {
        id,
        identities: {
          case: 'organizationId',
          value: organizationId
        }
      },
    )
  }

  /**
   * Get a connection by id and external organization id
   * @param id The connection id
   * @param externalId The external organization id
   * @returns {Promise<GetConnectionResponse>} The connection
   */
  async getConnectionByExternalOrganizationId(id: string, externalId: string): Promise<GetConnectionResponse> {
    return this.coreClient.connectExec(
      this.client.getConnection,
      {
        id,
        identities: {
          case: 'externalId',
          value: externalId
        }
      },
    )
  }

  /**
   * Get a connection by domain
   * @param domain The domain
   * @returns {Promise<GetConnectionResponse>} The connection
   */
  async getConnectionByDomain(domain: string) {
    return this.coreClient.connectExec(
      this.client.getConnectionByDomain,
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
        identities: {
          case: 'organizationId',
          value: organizationId
        }
      },
    )
  }

  /**
   * List connections by external organization id
   * @param externalId The external organization id
   * @returns {Promise<ListConnectionsResponse>} The list of connections
   */
  async listConnectionsByExternalOrganizationId(externalId: string): Promise<ListConnectionsResponse> {
    return this.coreClient.connectExec(
      this.client.listConnections,
      {
        identities: {
          case: 'externalId',
          value: externalId
        }
      },
    )
  }
}

