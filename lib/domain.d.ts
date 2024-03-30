import GrpcConnect from './connect';
import CoreClient from './core';
export default class DomainClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    getDomain(options: {
        id: string;
        organizationId: string;
    }): Promise<import("./pkg/domain_pb").GetDomainResponse>;
    getDomainByExternalOrganizationId(options: {
        id: string;
        externalId: string;
    }): Promise<import("./pkg/domain_pb").GetDomainResponse>;
    listDomains(organizationId: string): Promise<import("./pkg/domain_pb").ListDomainResponse>;
    listDomainsByExternalOrganizationId(externalId: string): Promise<import("./pkg/domain_pb").ListDomainResponse>;
}
