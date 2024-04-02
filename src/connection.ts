import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { ConnectionService } from './pkg/connections_connect';

export default class ConnectionClient {
  private client: PromiseClient<typeof ConnectionService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(ConnectionService);
  }

  async getConnection(options: { id: string, organizationId: string }) {
    const { id, organizationId } = options;

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

  async getConnectionByExternalOrganizationId(options: { id: string, externalId: string }) {
    const { id, externalId } = options;
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

  async getConnectionByDomain(domain: string) {
    return this.coreClient.connectExec(
      this.client.getConnectionByDomain,
      {
        domain
      },
    )
  }

  async listConnections(organizationId: string) {
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
}

