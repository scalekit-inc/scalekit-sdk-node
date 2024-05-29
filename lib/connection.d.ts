import GrpcConnect from './connect';
import CoreClient from './core';
import { GetConnectionResponse, ToggleConnectionResponse, ListConnectionsResponse } from './pkg/grpc/scalekit/v1/connections/connections_pb';
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
     * List connections by domain
     * @param domain The domain
     * @returns {Promise<ListConnectionsResponse>} The connection
     */
    listConnectionsByDomain(domain: string): Promise<ListConnectionsResponse>;
    /**
     * List connections by organization id
     * @param organizationId The organization id
     * @returns {Promise<ListConnectionsResponse>} The list of connections
     */
    listConnections(organizationId: string): Promise<ListConnectionsResponse>;
    /**
     * Enable a connection by id and organization id
     * @param id The connection id
     * @param organizationId The organization id
     * @returns {Promise<ToggleConnectionResponse>} The connection enable response
     */
    enableConnection(id: string, organizationId: string): Promise<ToggleConnectionResponse>;
    /**
     * Disable a connection by id and organization id
     * @param id The connection id
     * @param organizationId The organization id
     * @returns {Promise<ToggleConnectionResponse>} The connection enable response
     */
    disableConnection(id: string, organizationId: string): Promise<ToggleConnectionResponse>;
}
