"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("@connectrpc/connect");
const connect_node_1 = require("@connectrpc/connect-node");
class GrpcConnect {
    constructor(coreClient) {
        this.coreClient = coreClient;
        this.transport = (0, connect_node_1.createGrpcTransport)({
            baseUrl: this.coreClient.envUrl,
            httpVersion: "2",
            interceptors: [
                (next) => {
                    return (req) => {
                        if (this.coreClient.accessToken) {
                            req.header.set("Authorization", `Bearer ${this.coreClient.accessToken}`);
                        }
                        return next(req);
                    };
                }
            ],
        });
    }
    createClient(service) {
        return (0, connect_1.createPromiseClient)(service, this.transport);
    }
}
exports.default = GrpcConnect;
//# sourceMappingURL=connect.js.map