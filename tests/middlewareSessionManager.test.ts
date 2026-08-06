import { describe, it, expect, jest as jestGlobal } from '@jest/globals';
import { RequestAdapter } from '../src/middleware/protocol';
import {
  decryptSession,
  encryptSession,
} from '../src/middleware/sessionCrypto';
import {
  ScalekitClientLike,
  SessionRefreshManager,
} from '../src/middleware/sessionManager';

class FakeRequest implements RequestAdapter {
  constructor(private cookieValue?: string) {}
  getCookie(): string | undefined {
    return this.cookieValue;
  }
  getRequestUrl(): string {
    return 'https://app.example.com/account';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fakeClient(overrides: Record<string, any> = {}): ScalekitClientLike {
  return {
    refreshAccessToken: jestGlobal.fn(),
    validateToken: jestGlobal.fn(),
    ...overrides,
  } as unknown as ScalekitClientLike;
}

describe('SessionRefreshManager construction', () => {
  it('throws immediately when cookieEncryptionSecret is missing', () => {
    expect(() => new SessionRefreshManager(fakeClient(), '')).toThrow();
  });
});

describe('SessionRefreshManager.check', () => {
  const secret = 'test-secret-for-manager';

  function cookieFor(expiresAt: number, refreshToken = 'rt_original') {
    return encryptSession(
      {
        user: { email: 'user@example.com' },
        accessToken: 'at_old',
        refreshToken,
        expiresAt,
      },
      secret
    );
  }

  it('reports no_session when there is no cookie', async () => {
    const manager = new SessionRefreshManager(fakeClient(), secret);
    const result = await manager.check(new FakeRequest(undefined));

    expect(result.authenticated).toBe(false);
    expect(result.reason).toBe('no_session');
    expect(result.shouldClearCookie).toBeFalsy();
  });

  it('reports invalid_session for a malformed cookie', async () => {
    const manager = new SessionRefreshManager(fakeClient(), secret);
    const result = await manager.check(
      new FakeRequest('garbage-not-a-real-token')
    );

    expect(result.authenticated).toBe(false);
    expect(result.reason).toBe('invalid_session');
    expect(result.shouldClearCookie).toBe(true);
  });

  it('passes through a valid unexpired session without refreshing', async () => {
    const client = fakeClient();
    const manager = new SessionRefreshManager(client, secret);
    const cookie = cookieFor(Date.now() / 1000 + 3600);

    const result = await manager.check(new FakeRequest(cookie));

    expect(result.authenticated).toBe(true);
    expect(result.user).toEqual({ email: 'user@example.com' });
    expect(result.newCookieValue).toBeUndefined();
    expect(client.refreshAccessToken).not.toHaveBeenCalled();
  });

  it('refreshes an expired session and returns a new cookie', async () => {
    const freshExpiry = Date.now() / 1000 + 300;
    const client = fakeClient({
      refreshAccessToken: jestGlobal.fn(async () => ({
        accessToken: 'at_new',
        refreshToken: 'rt_new',
      })),
      validateToken: jestGlobal.fn(async () => ({
        email: 'user@example.com',
        exp: freshExpiry,
      })),
    });
    const manager = new SessionRefreshManager(client, secret);
    const cookie = cookieFor(Date.now() / 1000 - 10); // already expired

    const result = await manager.check(new FakeRequest(cookie));

    expect(result.authenticated).toBe(true);
    expect(result.newCookieValue).toBeDefined();
    expect(client.refreshAccessToken).toHaveBeenCalledWith('rt_original');
    expect(client.validateToken).toHaveBeenCalledWith('at_new');

    const newPayload = decryptSession(result.newCookieValue!, secret);
    expect(newPayload.accessToken).toBe('at_new');
    expect(newPayload.refreshToken).toBe('rt_new');
    // user/claims must come from the freshly-issued access token, not the old cache
    expect(newPayload.user).toEqual({
      email: 'user@example.com',
      exp: freshExpiry,
    });
    expect(newPayload.expiresAt).toBe(freshExpiry);
  });

  it('clears the cookie when refresh fails', async () => {
    const client = fakeClient({
      refreshAccessToken: jestGlobal.fn(async () => {
        throw new Error('invalid_grant');
      }),
    });
    const manager = new SessionRefreshManager(client, secret);
    const cookie = cookieFor(Date.now() / 1000 - 10);

    const result = await manager.check(new FakeRequest(cookie));

    expect(result.authenticated).toBe(false);
    expect(result.shouldClearCookie).toBe(true);
    expect(result.reason).toBe('refresh_failed');
  });

  it('treats an expired session with no refresh token as invalid', async () => {
    const client = fakeClient();
    const manager = new SessionRefreshManager(client, secret);
    const cookie = encryptSession(
      {
        user: {},
        accessToken: 'at_old',
        refreshToken: null,
        expiresAt: Date.now() / 1000 - 10,
      },
      secret
    );

    const result = await manager.check(new FakeRequest(cookie));

    expect(result.authenticated).toBe(false);
    expect(result.shouldClearCookie).toBe(true);
    expect(client.refreshAccessToken).not.toHaveBeenCalled();
  });
});

describe('SessionRefreshManager concurrency', () => {
  // Proves the singleflight (promise-sharing) pattern actually coalesces
  // concurrent refresh attempts for the same expired session into a single
  // real network call -- this is the exact race condition behind the
  // forced-logout investigation this feature was motivated by.
  it('coalesces N concurrent requests for the same session into one refresh call', async () => {
    const secret = 'concurrency-test-secret';
    let callCount = 0;

    const client = fakeClient({
      refreshAccessToken: jestGlobal.fn(async () => {
        callCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 20)); // simulate network latency
        return { accessToken: 'at_new', refreshToken: 'rt_new' };
      }),
      validateToken: jestGlobal.fn(async () => ({
        email: 'test.user@example.com',
        exp: Date.now() / 1000 + 300,
      })),
    });
    const manager = new SessionRefreshManager(client, secret);

    const cookie = encryptSession(
      {
        user: { email: 'test.user@example.com' },
        accessToken: 'at_old',
        refreshToken: 'rt_shared',
        expiresAt: Date.now() / 1000 - 10,
      },
      secret
    );

    const results = await Promise.all(
      Array.from({ length: 20 }, () => manager.check(new FakeRequest(cookie)))
    );

    expect(results).toHaveLength(20);
    expect(callCount).toBe(1);
    for (const result of results) {
      expect(result.authenticated).toBe(true);
      expect(result.newCookieValue).toBeDefined();
    }
  });
});
