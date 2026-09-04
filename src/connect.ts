import type { DescService } from '@bufbuild/protobuf';
import { type Client, type Transport, createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import CoreClient, { headers } from './core';

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
//     NOT idle-only, though: connect-node's session manager also runs this same
//     ping loop continuously while a stream is open (http2-session-manager.js's
//     resetPingInterval is gated on streamCount > 0, independent of
//     pingIdleConnection below) — so this value also sets the keepalive cadence
//     during a long-running call. It must clear the backend's 30s keepalive
//     EnforcementPolicy.MinTime with real margin for that reason; see
//     DEFAULT_PING_INTERVAL_MS in core.ts.
//   - idleConnectionTimeoutMs: the client drops its own idle sessions well before
//     the edge would, so it rarely gets near that window in the first place.
// pingIntervalMs/pingTimeoutMs are configurable via ScalekitOptions (see core.ts);
// idleConnectionTimeoutMs is not, since it just needs to sit comfortably below
// most edges' idle window and isn't a value callers should typically need to tune.
const IDLE_CONNECTION_TIMEOUT_MS = 60_000;

export default class GrpcConnect {
  private transport: Transport;
  constructor(
    private readonly coreClient: CoreClient,
    timeoutMs: number = coreClient.timeoutMs
  ) {
    this.transport = createGrpcTransport({
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
            req.header.set(headers['user-agent'], this.coreClient.userAgent);
            req.header.set(
              headers['x-sdk-version'],
              this.coreClient.sdkVersion
            );
            req.header.set(
              headers['x-api-version'],
              this.coreClient.apiVersion
            );
            if (this.coreClient.accessToken) {
              req.header.set(
                headers.authorization,
                `Bearer ${this.coreClient.accessToken}`
              );
            }
            return next(req);
          };
        },
      ],
    });
  }

  createClient<T extends DescService>(service: T): Client<T> {
    return createClient(service, this.transport);
  }
}
