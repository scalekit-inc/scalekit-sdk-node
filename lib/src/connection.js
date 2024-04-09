"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const connections_connect_1 = require("./pkg/grpc/scalekit/v1/connections/connections_connect");
class ConnectionClient {
    constructor(grpcConncet, coreClient) {
        this.grpcConncet = grpcConncet;
        this.coreClient = coreClient;
        this.client = this.grpcConncet.createClient(connections_connect_1.ConnectionService);
    }
    /**
     * Get a connection by id and organization id
     * @param id The connection id
     * @param organizationId The organization id
     * @returns {Promise<GetConnectionResponse>} The connection
     */
    getConnection(id, organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getConnection, {
                id,
                identities: {
                    case: 'organizationId',
                    value: organizationId
                }
            });
        });
    }
    /**
     * Get a connection by id and external organization id
     * @param id The connection id
     * @param externalId The external organization id
     * @returns {Promise<GetConnectionResponse>} The connection
     */
    getConnectionByExternalOrganizationId(id, externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getConnection, {
                id,
                identities: {
                    case: 'externalId',
                    value: externalId
                }
            });
        });
    }
    /**
     * Get a connection by domain
     * @param domain The domain
     * @returns {Promise<GetConnectionResponse>} The connection
     */
    getConnectionByDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getConnectionByDomain, {
                domain
            });
        });
    }
    /**
     * List connections by organization id
     * @param organizationId The organization id
     * @returns {Promise<ListConnectionsResponse>} The list of connections
     */
    listConnections(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listConnections, {
                identities: {
                    case: 'organizationId',
                    value: organizationId
                }
            });
        });
    }
    /**
     * List connections by external organization id
     * @param externalId The external organization id
     * @returns {Promise<ListConnectionsResponse>} The list of connections
     */
    listConnectionsByExternalOrganizationId(externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listConnections, {
                identities: {
                    case: 'externalId',
                    value: externalId
                }
            });
        });
    }
}
exports.default = ConnectionClient;
//# sourceMappingURL=connection.js.map