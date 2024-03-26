import GrpcConnect from './connect';
import CoreClient from './core';
export default class ConnectionClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    getConnection(options: {
        id: string;
        organizationId: string;
    }): Promise<import("./pkg/connections_pb").GetConnectionResponse>;
    getConnectionByExternalOrganizationId(options: {
        id: string;
        externalId: string;
    }): Promise<import("./pkg/connections_pb").GetConnectionResponse>;
    getConnectionByDomain(domain: string): Promise<import("./pkg/connections_pb").GetConnectionByDomainResponse>;
    listConnections(organizationId: string): Promise<import("./pkg/connections_pb").ListConnectionsResponse>;
}
