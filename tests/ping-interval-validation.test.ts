/**
 * Validation for the pingIntervalMs/pingTimeoutMs constructor options:
 *   - pingIntervalMs=0 is a deliberate escape hatch (mirrors the Python SDK's
 *     keepalive_time_ms=0) that disables keepalive entirely.
 *   - Any other value must clear MIN_PING_INTERVAL_MS with real margin over
 *     the backend's 30s keepalive MinTime -- 1..59999 is rejected.
 *   - pingTimeoutMs must stay below pingIntervalMs, or the interval timer can
 *     preempt a still-pending ping's own watchdog before it ever fires.
 */
import { describe, it, expect } from '@jest/globals';
import CoreClient, {
  DEFAULT_PING_INTERVAL_MS,
  DEFAULT_PING_TIMEOUT_MS,
  MIN_PING_INTERVAL_MS,
} from '../src/core';

function buildCoreClient(
  pingIntervalMs?: number,
  pingTimeoutMs?: number
): CoreClient {
  return new CoreClient(
    'https://example.com',
    'client-id',
    'client-secret',
    undefined,
    undefined,
    pingIntervalMs,
    pingTimeoutMs
  );
}

describe('pingIntervalMs validation', () => {
  it('defaults to DEFAULT_PING_INTERVAL_MS/DEFAULT_PING_TIMEOUT_MS', () => {
    const client = buildCoreClient();
    expect(client.pingIntervalMs).toBe(DEFAULT_PING_INTERVAL_MS);
    expect(client.pingTimeoutMs).toBe(DEFAULT_PING_TIMEOUT_MS);
    expect(DEFAULT_PING_INTERVAL_MS).toBe(60_000);
  });

  it('pingIntervalMs=0 is accepted -- the deliberate disable escape hatch', () => {
    expect(() => buildCoreClient(0)).not.toThrow();
    const client = buildCoreClient(0);
    expect(client.pingIntervalMs).toBe(0);
  });

  it('rejects pingIntervalMs below MIN_PING_INTERVAL_MS (1..59999)', () => {
    expect(() => buildCoreClient(1)).toThrow(/pingIntervalMs/);
    expect(() => buildCoreClient(1_000)).toThrow(/pingIntervalMs/);
    expect(() => buildCoreClient(MIN_PING_INTERVAL_MS - 1)).toThrow(
      /pingIntervalMs/
    );
  });

  it('accepts pingIntervalMs at and above MIN_PING_INTERVAL_MS', () => {
    expect(() => buildCoreClient(MIN_PING_INTERVAL_MS)).not.toThrow();
    expect(() => buildCoreClient(120_000)).not.toThrow();
  });

  it('rejects negative pingIntervalMs (not the disabled case)', () => {
    expect(() => buildCoreClient(-1)).toThrow(/pingIntervalMs/);
  });

  it('rejects non-finite pingIntervalMs', () => {
    expect(() => buildCoreClient(Infinity)).toThrow(/pingIntervalMs/);
    expect(() => buildCoreClient(NaN)).toThrow(/pingIntervalMs/);
  });
});

describe('pingTimeoutMs vs pingIntervalMs relationship', () => {
  it('rejects pingTimeoutMs >= pingIntervalMs', () => {
    expect(() => buildCoreClient(60_000, 60_000)).toThrow(/pingTimeoutMs/);
    expect(() => buildCoreClient(60_000, 90_000)).toThrow(/pingTimeoutMs/);
  });

  it('accepts pingTimeoutMs below pingIntervalMs', () => {
    expect(() => buildCoreClient(60_000, 5_000)).not.toThrow();
    expect(() => buildCoreClient(60_000, 59_999)).not.toThrow();
  });

  it('skips the relationship check when pingIntervalMs is disabled (0)', () => {
    // pingTimeoutMs is unused once keepalive is disabled -- any positive
    // value must still pass through assertValidTimeout, but the >= check
    // against pingIntervalMs=0 must not itself reject it.
    expect(() => buildCoreClient(0, 999_999)).not.toThrow();
  });
});
