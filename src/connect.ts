import type { DescService } from '@bufbuild/protobuf';
import { type Client, type Transport, createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import CoreClient, { headers } from './core';

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
//     DEFAULT_PING_INTERVAL_MS/MIN_PING_INTERVAL_MS in core.ts. 0 disables
//     keepalive entirely (connect-node's own Infinity default) — a runtime
//     escape hatch for a network path that rejects our pings, mirroring the
//     Python SDK's keepalive_time_ms=0.
//   - pingIdleConnection: true so idle connections are pinged on this same
//     cadence instead of only verified lazily on next use — the backend
//     confirms PermitWithoutStream: true (scalekit's cmd/grpc.go) and the
//     Python SDK already runs the equivalent (keepalive_permit_without_calls: 1,
//     scalekit-sdk-python#195, merged) against the same backend, so this is a
//     known-safe traffic pattern, not a theoretical one.
//   - idleConnectionTimeoutMs: derived from pingIntervalMs (idleConnectionTimeoutMsFor
//     below) rather than a bare constant, and capped strictly BELOW the
//     backend's own MaxConnectionIdle (5 min, cmd/grpc.go) rather than
//     matching or exceeding it:
//       - Landing exactly on the backend's bound is a race — whichever side's
//         timer fires first wins, and the loser is a request written into a
//         socket the other side just closed.
//       - Landing above it is worse: the backend's MaxConnectionIdle counts
//         from zero active RPCs and is NOT reset by keepalive pings, so a
//         caller-supplied pingIntervalMs large enough to push the derived
//         bound past 5 minutes would keep the client believing a connection
//         is fine (still on its own ping cadence) well after the backend has
//         already dropped it — reintroducing the exact stale-connection
//         write this PR exists to fix, just on a longer clock.
//     Staying strictly below means the client always closes first. The
//     multiplier (5 cycles) is intentionally superseded by the ceiling for
//     every currently-valid non-zero pingIntervalMs: MIN_PING_INTERVAL_MS
//     (core.ts, 60s) × 5 = 300s already exceeds the 4-min ceiling, so the
//     ceiling is what actually binds at and above the floor today, keeping
//     the default idle-close window close to the backend's own 5-minute
//     MaxConnectionIdle rather than needlessly shrinking it. The multiplier
//     stays in the formula (rather than being dropped for a bare constant)
//     so idleConnectionTimeoutMs still scales down correctly should the floor
//     on pingIntervalMs itself ever be lowered — read pingIntervalMs *
//     IDLE_PING_CYCLES_BEFORE_CLOSE as "the value that would apply if the
//     ceiling weren't in the way", not as something that currently varies
//     the result.
// pingIntervalMs/pingTimeoutMs are configurable via ScalekitOptions (see core.ts);
// idleConnectionTimeoutMs is not directly, since it's derived from
// pingIntervalMs specifically to preserve the relationship above rather than
// being a value callers should tune independently.
// Strictly below the backend's own 5-minute MaxConnectionIdle so the client
// always closes an idle connection before the backend would.
const IDLE_CONNECTION_TIMEOUT_CEILING_MS = 240_000;
const IDLE_PING_CYCLES_BEFORE_CLOSE = 5;

function idleConnectionTimeoutMsFor(pingIntervalMs: number): number {
  return Math.min(
    IDLE_CONNECTION_TIMEOUT_CEILING_MS,
    pingIntervalMs * IDLE_PING_CYCLES_BEFORE_CLOSE
  );
}

export default class GrpcConnect {
  private transport: Transport;
  constructor(
    private readonly coreClient: CoreClient,
    timeoutMs: number = coreClient.timeoutMs
  ) {
    // pingIntervalMs === 0 is the deliberate "disabled" escape hatch (see
    // core.ts's assertValidPingInterval) -- omit the keepalive options
    // entirely so connect-node falls back to its own defaults (pingIntervalMs:
    // Infinity, pingIdleConnection unset), rather than passing pingIdleConnection:
    // true with a meaningless interval.
    const keepaliveOptions = this.coreClient.pingIntervalMs
      ? {
          pingIntervalMs: this.coreClient.pingIntervalMs,
          pingTimeoutMs: this.coreClient.pingTimeoutMs,
          // Idle connections are pinged on the same pingIntervalMs cadence as
          // active ones — see the comment above for why this is safe against
          // this backend specifically.
          pingIdleConnection: true,
          idleConnectionTimeoutMs: idleConnectionTimeoutMsFor(
            this.coreClient.pingIntervalMs
          ),
        }
      : {};
    this.transport = createGrpcTransport({
      baseUrl: this.coreClient.envUrl,
      defaultTimeoutMs: timeoutMs,
      ...keepaliveOptions,
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
