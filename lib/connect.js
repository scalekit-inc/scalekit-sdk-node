"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("@connectrpc/connect");
const connect_node_1 = require("@connectrpc/connect-node");
const core_1 = require("./core");
class GrpcConnect {
    constructor(coreClient) {
        this.coreClient = coreClient;
        this.transport = (0, connect_node_1.createGrpcTransport)({
            baseUrl: this.coreClient.envUrl,
            httpVersion: "2",
            interceptors: [
                (next) => {
                    return (req) => {
                        req.header.set(core_1.headers['user-agent'], this.coreClient.userAgent);
                        req.header.set(core_1.headers['x-sdk-version'], this.coreClient.sdkVersion);
                        req.header.set(core_1.headers['x-api-version'], this.coreClient.apiVersion);
                        if (this.coreClient.accessToken) {
                            req.header.set(core_1.headers.authorization, `Bearer ${this.coreClient.accessToken}`);
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