import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { DomainService } from './pkg/grpc/scalekit/v1/domains/domains_connect';
import { CreateDomainResponse, GetDomainResponse, ListDomainResponse, DomainType } from './pkg/grpc/scalekit/v1/domains/domains_pb';

export default class DomainClient {
  private client: PromiseClient<typeof DomainService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(DomainService);
  }

  /**
   * Create a domain for an organization with the given name. Optionally, you can provide an external id. 
   * @param {string} organizationId  The organization id
   * @param {string} name The domain name
   * @param {object} options The options to create a domain
   * @param {DomainType} options.domainType The type of domain (ALLOWED_EMAIL_DOMAIN or ORGANIZATION_DOMAIN)
   * @returns {Promise<CreateDomainResponse>} The created domain
  */
  async createDomain(organizationId: string, name: string, options?: { domainType?: DomainType }): Promise<CreateDomainResponse> {
    return this.coreClient.connectExec(
      this.client.createDomain,
      {
        identities: {
          case: 'organizationId',
          value: organizationId
        },
        domain: {
          domain: name,
          ...(options?.domainType && { domainType: options.domainType })
        }
      }
    )
  }

  /**
   * List domains for an organization 
   * @param organizationId The organization id
   * @returns {Promise<ListDomainResponse>} The list of domains for the organization
   */
  async listDomains(organizationId: string): Promise<ListDomainResponse> {
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
}

