/**
 * GrpcConnect wires pingIntervalMs/pingTimeoutMs/pingIdleConnection into
 * createGrpcTransport, and derives idleConnectionTimeoutMs from whatever
 * pingIntervalMs is actually configured (see connect.ts's idleConnectionTimeoutMsFor).
 * Nothing else exercises this option object directly, so a future edit that
 * flips pingIdleConnection back to false, or breaks the derivation formula,
 * would otherwise go uncaught.
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

  it('defaults idleConnectionTimeoutMs to 300000 (5x the default 60s ping interval)', () => {
    buildTransport();

    const options = mockCreateGrpcTransport.mock.calls[0][0] as any;
    expect(options.idleConnectionTimeoutMs).toBe(300_000);
  });

  it('widens idleConnectionTimeoutMs when a caller configures a larger pingIntervalMs', () => {
    // 100_000 * 5 = 500_000, comfortably above the 300_000 floor -- must not
    // silently clamp back down to the floor and starve idle connections of a
    // single successful ping cycle before close.
    buildTransport({ pingIntervalMs: 100_000 });

    const options = mockCreateGrpcTransport.mock.calls[0][0] as any;
    expect(options.pingIntervalMs).toBe(100_000);
    expect(options.idleConnectionTimeoutMs).toBe(500_000);
  });

  it('keeps idleConnectionTimeoutMs at the 300000 floor for a small pingIntervalMs', () => {
    // 5_000 * 5 = 25_000, well under the floor -- the floor must win so an
    // aggressively low pingIntervalMs doesn't also shrink the idle-close bound.
    buildTransport({ pingIntervalMs: 5_000 });

    const options = mockCreateGrpcTransport.mock.calls[0][0] as any;
    expect(options.idleConnectionTimeoutMs).toBe(300_000);
  });
});
