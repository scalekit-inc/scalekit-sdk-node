import GrpcConnect from './connect';
import CoreClient from './core';
import { GetConnectionByDomainResponse, GetConnectionResponse, ListConnectionsResponse } from './pkg/grpc/scalekit/v1/connections/connections_pb';
export default class ConnectionClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    /**
     * Get a connection by id and organization id
     * @param id The connection id
     * @param organizationId The organization id
     * @returns {Promise<GetConnectionResponse>} The connection
     */
    getConnection(id: string, organizationId: string): Promise<GetConnectionResponse>;
    /**
     * Get a connection by domain
     * @param domain The domain
     * @returns {Promise<GetConnectionByDomainResponse>} The connection
     */
    getConnectionByDomain(domain: string): Promise<GetConnectionByDomainResponse>;
    /**
     * List connections by organization id
     * @param organizationId The organization id
     * @returns {Promise<ListConnectionsResponse>} The list of connections
     */
    listConnections(organizationId: string): Promise<ListConnectionsResponse>;
}
