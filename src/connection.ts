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
    const fn = async () => this.client.getConnection({
      id,
      identities: {
        case: 'organizationId',
        value: organizationId
      }
    })

    return this.coreClient.retryWithAuthentication(fn)
  }

  async getConnectionByExternalOrganizationId(options: { id: string, externalId: string }) {
    const { id, externalId } = options;
    const fn = async () => this.client.getConnection({
      id,
      identities: {
        case: 'externalId',
        value: externalId
      }
    })

    return this.coreClient.retryWithAuthentication(fn)
  }

  async getConnectionByDomain(domain: string) {
    const fn = async () => this.client.getConnectionByDomain({
      domain
    })

    return this.coreClient.retryWithAuthentication(fn)
  }

  async listConnections(organizationId: string) {
    const fn = async () => this.client.listConnections({
      identities: {
        case: 'organizationId',
        value: organizationId
      }
    })

    return this.coreClient.retryWithAuthentication(fn)
  }
}

