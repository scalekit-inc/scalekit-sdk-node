"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("@connectrpc/connect");
const connect_node_1 = require("@connectrpc/connect-node");
const core_1 = require("./core");
// A gRPC transport keeps one long-lived HTTP/2 session. connect-node defaults to
// pingIntervalMs: Infinity (so a pooled connection is NEVER verified before it is
// reused) and idleConnectionTimeoutMs: 15 min (so the client holds idle sessions
// far longer than an edge/LB typically does). When the edge closes an idle
// connection first, the client writes into a dead socket and the call fails with
// ECONNRESET — which connect-node surfaces as Code.Aborted (see
// errors/base-exception.ts). These settings close that gap:
//   - pingIntervalMs: once a session has been idle past this, connect-node sends a
//     PING to verify it is still alive before reusing it, transparently opening a
//     fresh connection if the PING fails. Must sit below the edge idle timeout.
//   - idleConnectionTimeoutMs: the client drops its own idle sessions well before
//     the edge would, so it rarely gets near that window in the first place.
// pingIntervalMs/pingTimeoutMs are configurable via ScalekitOptions (see core.ts);
// idleConnectionTimeoutMs is not, since it just needs to sit comfortably below
// most edges' idle window and isn't a value callers should typically need to tune.
const IDLE_CONNECTION_TIMEOUT_MS = 60000;
class GrpcConnect {
    constructor(coreClient, timeoutMs = coreClient.timeoutMs) {
        this.coreClient = coreClient;
        this.transport = (0, connect_node_1.createGrpcTransport)({
            baseUrl: this.coreClient.envUrl,
            defaultTimeoutMs: timeoutMs,
            pingIntervalMs: this.coreClient.pingIntervalMs,
            pingTimeoutMs: this.coreClient.pingTimeoutMs,
            // Must stay false: pinging *idle* connections (those with no active streams)
            // can draw GOAWAY/ENHANCE_YOUR_CALM from a server that does not permit
            // keepalive without calls. The verify-before-reuse PING driven by
            // pingIntervalMs is independent of this flag and still applies.
            pingIdleConnection: false,
            idleConnectionTimeoutMs: IDLE_CONNECTION_TIMEOUT_MS,
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
                },
            ],
        });
    }
    createClient(service) {
        return (0, connect_1.createClient)(service, this.transport);
    }
}
exports.default = GrpcConnect;
//# sourceMappingURL=connect.js.map