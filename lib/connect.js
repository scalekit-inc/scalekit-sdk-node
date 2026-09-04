"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("@connectrpc/connect");
const connect_node_1 = require("@connectrpc/connect-node");
const core_1 = require("./core");
// A gRPC transport keeps one long-lived HTTP/2 session. connect-node defaults to
// pingIntervalMs: Infinity (so a pooled connection is NEVER verified before it is
// reused, idle or not) and idleConnectionTimeoutMs: 15 min (so the client holds
// idle sessions far longer than an edge/LB typically does). When the edge closes
// an idle connection first, the client writes into a dead socket and the call
// fails with ECONNRESET — which connect-node surfaces as Code.Aborted (see
// errors/base-exception.ts). These settings close that gap by keeping idle
// connections proactively verified instead of discovering they're dead only when
// a real request needs one:
//   - pingIntervalMs: the keepalive cadence, both for a session with an active
//     stream (http2-session-manager.js's resetPingInterval is gated on
//     streamCount > 0 independent of pingIdleConnection below — so this value
//     also bounds the ping rate during a long-running call) and, with
//     pingIdleConnection below, for one sitting idle. It must clear the
//     backend's 30s keepalive EnforcementPolicy.MinTime with real margin; see
//     DEFAULT_PING_INTERVAL_MS in core.ts.
//   - pingIdleConnection: true so idle connections are pinged on this same
//     cadence instead of only verified lazily on next use — the backend
//     confirms PermitWithoutStream: true (scalekit's cmd/grpc.go) and the
//     Python SDK already runs the equivalent (keepalive_permit_without_calls: 1,
//     scalekit-sdk-python#195, merged) against the same backend, so this is a
//     known-safe traffic pattern, not a theoretical one.
//   - idleConnectionTimeoutMs: matches the backend's own MaxConnectionIdle (5
//     min, cmd/grpc.go) rather than sitting below pingIntervalMs — set it any
//     lower and the client would close its own idle connections at essentially
//     the same moment a keepalive ping would fire, defeating the point of
//     pinging idle connections at all.
// pingIntervalMs/pingTimeoutMs are configurable via ScalekitOptions (see core.ts);
// idleConnectionTimeoutMs is not, since it's paired specifically with the
// backend's own idle bound above and isn't a value callers should typically
// need to tune independently.
const IDLE_CONNECTION_TIMEOUT_MS = 300000;
class GrpcConnect {
    constructor(coreClient, timeoutMs = coreClient.timeoutMs) {
        this.coreClient = coreClient;
        this.transport = (0, connect_node_1.createGrpcTransport)({
            baseUrl: this.coreClient.envUrl,
            defaultTimeoutMs: timeoutMs,
            pingIntervalMs: this.coreClient.pingIntervalMs,
            pingTimeoutMs: this.coreClient.pingTimeoutMs,
            // Idle connections are pinged on the same pingIntervalMs cadence as
            // active ones — see the comment above for why this is safe against this
            // backend specifically.
            pingIdleConnection: true,
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