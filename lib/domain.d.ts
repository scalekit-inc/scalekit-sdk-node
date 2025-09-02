import GrpcConnect from './connect';
import CoreClient from './core';
import { CreateDomainResponse, ListDomainResponse, DomainType } from './pkg/grpc/scalekit/v1/domains/domains_pb';
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
     * @param {DomainType} options.domainType The type of domain (ALLOWED_EMAIL_DOMAIN or ORGANIZATION_DOMAIN)
     * @returns {Promise<CreateDomainResponse>} The created domain
    */
    createDomain(organizationId: string, name: string, options?: {
        domainType?: DomainType;
    }): Promise<CreateDomainResponse>;
    /**
     * List domains for an organization
     * @param organizationId The organization id
     * @returns {Promise<ListDomainResponse>} The list of domains for the organization
     */
    listDomains(organizationId: string): Promise<ListDomainResponse>;
}
