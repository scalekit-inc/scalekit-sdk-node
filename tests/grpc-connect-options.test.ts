/**
 * GrpcConnect wires pingIntervalMs/pingTimeoutMs/pingIdleConnection into
 * createGrpcTransport, and derives idleConnectionTimeoutMs from whatever
 * pingIntervalMs is actually configured (see connect.ts's idleConnectionTimeoutMsFor),
 * capped strictly below the backend's 5-minute MaxConnectionIdle. Given
 * MIN_PING_INTERVAL_MS (core.ts, 60s), the cap binds for every currently-valid
 * non-zero pingIntervalMs -- the result is 240000 across the whole valid
 * range today, not just at the default. Nothing else exercises this option
 * object directly, so a future edit that flips pingIdleConnection back to
 * false, or breaks the cap, would otherwise go uncaught.
 *
 * tests/setup.ts (setupFilesAfterEnv, shared by every test file) eagerly
 * constructs a real ScalekitClient in a top-level beforeAll, which imports the
 * real @connectrpc/connect-node before a plain top-level jest.mock() in this
 * file would get a chance to register. jest.isolateModules forces a fresh,
 * sandboxed require so the mock actually takes effect.
 */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const mockCreateGrpcTransport = jest.fn((_options: unknown) => ({}));

function buildTransport(overrides: Record<string, number> = {}): void {
  jest.isolateModules(() => {
    jest.doMock('@connectrpc/connect-node', () => ({
      createGrpcTransport: (options: unknown) =>
        mockCreateGrpcTransport(options),
    }));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: CoreClient } = require('../src/core');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: GrpcConnect } = require('../src/connect');
    const coreClient = new CoreClient(
      'https://example.com',
      'client-id',
      'client-secret',
      undefined,
      undefined,
      overrides.pingIntervalMs,
      overrides.pingTimeoutMs
    );
    new GrpcConnect(coreClient);
  });
}

describe('GrpcConnect transport options', () => {
  beforeEach(() => {
    mockCreateGrpcTransport.mockClear();
    jest.resetModules();
  });

  it('enables pingIdleConnection and forwards the configured ping settings', () => {
    buildTransport();

    expect(mockCreateGrpcTransport).toHaveBeenCalledTimes(1);
    const options = mockCreateGrpcTransport.mock.calls[0][0] as any;
    expect(options.pingIdleConnection).toBe(true);
    expect(options.pingIntervalMs).toBe(60_000);
    expect(options.pingTimeoutMs).toBe(5_000);
  });

  it('defaults idleConnectionTimeoutMs to the 240000 ceiling, not the 300000 backend bound', () => {
    // 60_000 (MIN_PING_INTERVAL_MS) * 5 = 300_000, which would exceed the
    // backend's own 300_000 MaxConnectionIdle if left uncapped -- the ceiling
    // must bind even at the default, keeping the client's own close strictly
    // ahead of the backend's.
    buildTransport();

    const options = mockCreateGrpcTransport.mock.calls[0][0] as any;
    expect(options.idleConnectionTimeoutMs).toBe(240_000);
    expect(options.idleConnectionTimeoutMs).toBeLessThan(300_000);
  });

  it('stays at the 240000 ceiling for any valid larger pingIntervalMs too', () => {
    // Every currently-valid non-zero pingIntervalMs is >= MIN_PING_INTERVAL_MS
    // (60_000), so pingIntervalMs * 5 always exceeds the 240_000 ceiling --
    // the ceiling is what actually binds across the whole valid range today,
    // not just at the default.
    buildTransport({ pingIntervalMs: 100_000 });

    const options = mockCreateGrpcTransport.mock.calls[0][0] as any;
    expect(options.idleConnectionTimeoutMs).toBe(240_000);
  });

  it('pingIntervalMs=0 disables keepalive entirely -- no ping options passed at all', () => {
    buildTransport({ pingIntervalMs: 0 });

    const options = mockCreateGrpcTransport.mock.calls[0][0] as any;
    expect(options.pingIntervalMs).toBeUndefined();
    expect(options.pingTimeoutMs).toBeUndefined();
    expect(options.pingIdleConnection).toBeUndefined();
    expect(options.idleConnectionTimeoutMs).toBeUndefined();
  });
});
