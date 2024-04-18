import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { DomainService } from './pkg/grpc/scalekit/v1/domains/domains_connect';
import { CreateDomainResponse, GetDomainResponse, ListDomainResponse } from './pkg/grpc/scalekit/v1/domains/domains_pb';

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
   * @param {string} externalId The external id
   * @returns {Promise<CreateDomainResponse>} The created domain
  */
  async createDomain(organizationId: string, name: string): Promise<CreateDomainResponse> {
    return this.coreClient.connectExec(
      this.client.createDomain,
      {
        identities: {
          case: 'organizationId',
          value: organizationId
        },
        domain: {
          domain: name
        }
      }
    )
  }

  /**
   * Get a domain by id  
   * @param {object} options The options to get a domain
   * @param {string} options.id The domain id
   * @param {string} options.organizationId The organization id
   * @returns {Promise<GetDomainResponse>} The domain
  */
  async getDomain(options: { id: string, organizationId: string }): Promise<GetDomainResponse> {
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

