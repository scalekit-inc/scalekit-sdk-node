import GrpcConnect from './connect';
import CoreClient from './core';
import { GetConnectionResponse, ListConnectionsResponse } from './pkg/grpc/scalekit/v1/connections/connections_pb';
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
     * Get a connection by id and external organization id
     * @param id The connection id
     * @param externalId The external organization id
     * @returns {Promise<GetConnectionResponse>} The connection
     */
    getConnectionByExternalOrganizationId(id: string, externalId: string): Promise<GetConnectionResponse>;
    /**
     * Get a connection by domain
     * @param domain The domain
     * @returns {Promise<GetConnectionResponse>} The connection
     */
    getConnectionByDomain(domain: string): Promise<import("./pkg/grpc/scalekit/v1/connections/connections_pb").GetConnectionByDomainResponse>;
    /**
     * List connections by organization id
     * @param organizationId The organization id
     * @returns {Promise<ListConnectionsResponse>} The list of connections
     */
    listConnections(organizationId: string): Promise<ListConnectionsResponse>;
    /**
     * List connections by external organization id
     * @param externalId The external organization id
     * @returns {Promise<ListConnectionsResponse>} The list of connections
     */
    listConnectionsByExternalOrganizationId(externalId: string): Promise<ListConnectionsResponse>;
}
