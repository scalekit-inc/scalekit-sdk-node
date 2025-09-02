import GrpcConnect from './connect';
import CoreClient from './core';
import { CreateDomainResponse, GetDomainResponse, ListDomainResponse, DomainType } from './pkg/grpc/scalekit/v1/domains/domains_pb';
import { Empty } from '@bufbuild/protobuf';
export default class DomainClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    /**
     * Create a domain for an organization with the given name. Optionally, you can provide an external id.
     * @param {string} organizationId  The organization id
     * @param {string} name The domain name
     * @param {object} options The options to create a domain
     * @param {DomainType | string} options.domainType The type of domain (ALLOWED_EMAIL_DOMAIN or ORGANIZATION_DOMAIN)
     * @returns {Promise<CreateDomainResponse>} The created domain
    */
    createDomain(organizationId: string, name: string, options?: {
        domainType?: DomainType | string;
    }): Promise<CreateDomainResponse>;
    /**
     * Get a specific domain by ID for an organization
     * @param organizationId The organization id
     * @param domainId The domain id
     * @returns {Promise<GetDomainResponse>} The domain details
     */
    getDomain(organizationId: string, domainId: string): Promise<GetDomainResponse>;
    /**
     * List domains for an organization
     * @param organizationId The organization id
     * @returns {Promise<ListDomainResponse>} The list of domains for the organization
     */
    listDomains(organizationId: string): Promise<ListDomainResponse>;
    deleteDomain(organizationId: string, domainId: string): Promise<Empty>;
}
