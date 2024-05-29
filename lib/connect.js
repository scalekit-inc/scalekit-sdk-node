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
                        req.header.set("User-Agent", this.coreClient.userAgent);
                        req.header.set("X-Sdk-Version", this.coreClient.sdkVersion);
                        req.header.set("X-Api-Version", this.coreClient.apiVersion);
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