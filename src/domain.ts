import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { DomainService } from './pkg/domain_connect';

export default class DomainClient {
  private client: PromiseClient<typeof DomainService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(DomainService);
  }

  async getDomain(options: { id: string, organizationId: string }) {
    const { id, organizationId } = options;
    return this.coreClient.connectExec(
      this.client.getDomain,
      {
        id,
        identities: {
          case: 'organizationId',
          value: organizationId
        }
      }
    )
  }

  async getDomainByExternalOrganizationId(options: { id: string, externalId: string }) {
    const { id, externalId } = options;
    return this.coreClient.connectExec(
      this.client.getDomain,
      {
        id,
        identities: {
          case: 'externalId',
          value: externalId
        }
      }
    )
  }

  async listDomains(organizationId: string) {
    return this.coreClient.connectExec(
      this.client.listDomains,
      {
        identities: {
          case: 'organizationId',
          value: organizationId
        }
      },
    );
  }

  async listDomainsByExternalOrganizationId(externalId: string) {
    return this.coreClient.connectExec(
      this.client.listDomains,
      {
        identities: {
          case: 'externalId',
          value: externalId
        }
      }
    );
  }
}

