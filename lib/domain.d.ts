import GrpcConnect from './connect';
import CoreClient from './core';
import { CreateDomainResponse, ListDomainResponse } from './pkg/grpc/scalekit/v1/domains/domains_pb';
export default class DomainClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    /**
     * Create a domain for an organization with the given name. Optionally, you can provide an external id.
     * @param {string} organizationId  The organization id
     * @param {string} name The domain name
     * @returns {Promise<CreateDomainResponse>} The created domain
    */
    createDomain(organizationId: string, name: string): Promise<CreateDomainResponse>;
    /**
     * List domains for an organization
     * @param organizationId The organization id
     * @returns {Promise<ListDomainResponse>} The list of domains for the organization
     */
    listDomains(organizationId: string): Promise<ListDomainResponse>;
}
