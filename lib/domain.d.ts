import GrpcConnect from './connect';
import CoreClient from './core';
import { CreateDomainResponse, GetDomainResponse, ListDomainResponse } from './pkg/grpc/scalekit/v1/domains/domains_pb';
export default class DomainClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    /**
     * Create a domain for an organization with the given name. Optionally, you can provide an external id.
     * @param {string} organizationId  The organization id
     * @param {string} name The domain name
     * @param {string} externalId The external id
     * @returns {Promise<CreateDomainResponse>} The created domain
    */
    createDomain(organizationId: string, name: string): Promise<CreateDomainResponse>;
    /**
     * Get a domain by id
     * @param {object} options The options to get a domain
     * @param {string} options.id The domain id
     * @param {string} options.organizationId The organization id
     * @returns {Promise<GetDomainResponse>} The domain
    */
    getDomain(options: {
        id: string;
        organizationId: string;
    }): Promise<GetDomainResponse>;
    /**
     * List domains for an organization
     * @param organizationId The organization id
     * @returns {Promise<ListDomainResponse>} The list of domains for the organization
     */
    listDomains(organizationId: string): Promise<ListDomainResponse>;
}
