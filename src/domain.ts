import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { DomainService } from './pkg/grpc/scalekit/v1/domains/domains_connect';
import { CreateDomainResponse, GetDomainResponse, ListDomainResponse, DomainType } from './pkg/grpc/scalekit/v1/domains/domains_pb';
import { Empty } from '@bufbuild/protobuf';

/**
 * Client for managing domains for organizations.
 *
 * Domains enable automatic organization identification during SSO flows based on user email addresses.
 * You can configure domains as ORGANIZATION_DOMAIN (for SSO routing) or ALLOWED_EMAIL_DOMAIN
 * (for restricting which email domains can sign up/in to an organization).
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const domainClient = scalekitClient.domain;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/domains | Domain API Documentation}
 */
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
   * @param {DomainType | string} options.domainType The type of domain (ALLOWED_EMAIL_DOMAIN or ORGANIZATION_DOMAIN)
   * @returns {Promise<CreateDomainResponse>} The created domain
  */
  async createDomain(organizationId: string, name: string, options?: { domainType?: DomainType | string }): Promise<CreateDomainResponse> {
    let domainTypeValue: DomainType | undefined;
    if (options?.domainType) {
      if (typeof options.domainType === 'string') {
        domainTypeValue = DomainType[options.domainType as keyof typeof DomainType];
        if (domainTypeValue === undefined) {
          throw new Error('Invalid domain type');
        }
      } else {
        domainTypeValue = options.domainType;
      }
    }

    return this.coreClient.connectExec(
      this.client.createDomain,
      {
        identities: {
          case: 'organizationId',
          value: organizationId
        },
        domain: {
          domain: name,
          ...(domainTypeValue && { domainType: domainTypeValue })
        }
      }
    )
  }

  /**
   * Get a specific domain by ID for an organization
   * @param organizationId The organization id
   * @param domainId The domain id
   * @returns {Promise<GetDomainResponse>} The domain details
   */
  async getDomain(organizationId: string, domainId: string): Promise<GetDomainResponse> {
    return this.coreClient.connectExec(
      this.client.getDomain,
      {
        id: domainId,
        identities: {
          case: 'organizationId',
          value: organizationId
        }
      }
    );
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

  /**
   * Deletes a domain from an organization.
   *
   * Removes the domain configuration from the organization. Users with email addresses from
   * this domain will no longer be automatically routed to this organization's SSO connection.
   *
   * @param {string} organizationId - The organization ID
   * @param {string} domainId - The domain ID to delete
   *
   * @returns {Promise<Empty>} Empty response on successful deletion
   *
   * @example
   * // Remove a domain from an organization
   * await scalekitClient.domain.deleteDomain('org_123456', 'domain_abc123');
   * console.log('Domain deleted successfully');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/domains | Delete Domain API}
   * @see {@link createDomain} - Add a new domain
   * @see {@link listDomains} - List all domains for an organization
   */
  async deleteDomain(organizationId: string, domainId: string): Promise<Empty> {
    return this.coreClient.connectExec(
      this.client.deleteDomain,
      {
        id: domainId,
        identities: {
          case: 'organizationId',
          value: organizationId
        }
      }
    );
  }

}

