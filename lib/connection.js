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
     * @param organizationId The organization id
     * @param id The connection id
     * @returns {Promise<GetConnectionResponse>} The connection
     */
    getConnection(organizationId, id) {
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
     * List connections by domain
     * @param domain The domain
     * @returns {Promise<ListConnectionsResponse>} The connection
     */
    listConnectionsByDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listConnections, {
                identities: {
                    case: 'domain',
                    value: domain
                }
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
     * Enable a connection by id and organization id
     * @param organizationId The organization id
     * @param id The connection id
     * @returns {Promise<ToggleConnectionResponse>} The connection enable response
     */
    enableConnection(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.enableConnection, {
                id,
                identities: {
                    case: 'organizationId',
                    value: organizationId
                }
            });
        });
    }
    /**
     * Disable a connection by id and organization id
     * @param organizationId The organization id
     * @param id The connection id
     * @returns {Promise<ToggleConnectionResponse>} The connection enable response
     */
    disableConnection(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.disableConnection, {
                id,
                identities: {
                    case: 'organizationId',
                    value: organizationId
                }
            });
        });
    }
}
exports.default = ConnectionClient;
//# sourceMappingURL=connection.js.map