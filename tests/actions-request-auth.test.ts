/**
 * HTTP calls through `CoreClient.axios` (here `actions.request()`) get their
 * access token from `CoreClient`, as gRPC calls do: fetched before the first
 * authenticated request, never when the client is created or to validate a
 * token, and replaced with one resend when Scalekit rejects it.
 *
 * Credential-free: a local HTTP server plays the token endpoint, the JWKS
 * endpoint and the proxy, so the assertions are on what the server actually
 * receives.
 */
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import http from 'http';
import * as jose from 'jose';
import { AddressInfo } from 'net';
import { Readable } from 'stream';
import ScalekitClient from '../src/scalekit';
import CoreClient from '../src/core';
import {
  ScalekitException,
  ScalekitServerException,
} from '../src/errors/base-exception';
import { ScalekitUnauthorizedException } from '../src/errors/specific-exceptions';

// A token the server accepts. Every token the server issues is accepted too,
// and each one is different from the last, like the real token endpoint.
const GOOD = 'fresh-0';
const issued = (n: number) => `fresh-${n}`;

let server: http.Server;
let origin: string;
let tokenCalls: number;
let proxyAuth: Array<string | undefined>;
let tokenEndpointStatus: number;
let proxyAlwaysUnauthorized: boolean;
let providerUnauthorized: boolean;
// Tokens the proxy rejects as Scalekit does a revoked one.
let revokedTokens: Set<string>;
// When set, the proxy answers every request with this 401.
let proxy401: { headers: Record<string, string>; body: unknown } | undefined;
// Token endpoint behaviour: `expires_in` (omitted when undefined), a fixed
// token instead of a new one each time, an answer with no token, a delay.
let tokenExpiresIn: number | undefined;
let tokenFixed: string | undefined;
let tokenEmpty: boolean;
let tokenDelayMs: number;
let jwksAuth: Array<string | undefined>;
let signingKey: jose.CryptoKey;
let publicJwk: jose.JWK;

beforeAll(async () => {
  const pair = await jose.generateKeyPair('RS256');
  signingKey = pair.privateKey;
  publicJwk = { ...(await jose.exportJWK(pair.publicKey)), kid: 'k1' };
  server = http.createServer((req, res) => {
    if (req.url?.endsWith('/keys')) {
      jwksAuth.push(req.headers.authorization);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ keys: [publicJwk] }));
      return;
    }
    if (req.url?.includes('/oauth/token')) {
      tokenCalls += 1;
      const n = tokenCalls;
      setTimeout(() => {
        res.writeHead(tokenEndpointStatus, {
          'content-type': 'application/json',
        });
        res.end(
          tokenEndpointStatus !== 200
            ? JSON.stringify({ error: 'invalid_client' })
            : tokenEmpty
              ? JSON.stringify({ token_type: 'Bearer' })
              : JSON.stringify({
                  access_token: tokenFixed ?? issued(n),
                  token_type: 'Bearer',
                  ...(tokenExpiresIn !== undefined && {
                    expires_in: tokenExpiresIn,
                  }),
                })
        );
      }, tokenDelayMs);
      return;
    }
    proxyAuth.push(req.headers.authorization);
    if (proxy401) {
      res.writeHead(401, proxy401.headers);
      res.end(JSON.stringify(proxy401.body));
      return;
    }
    if (providerUnauthorized) {
      // A 401 forwarded from the provider, not one the Scalekit proxy sent.
      res.writeHead(401, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'invalid_token', message: 'no' }));
      return;
    }
    const auth = req.headers.authorization ?? '';
    const ok =
      !proxyAlwaysUnauthorized &&
      auth.startsWith('Bearer fresh-') &&
      !revokedTokens.has(auth.replace(/^Bearer /, ''));
    res.writeHead(ok ? 200 : 401, { 'content-type': 'application/json' });
    res.end(
      ok
        ? JSON.stringify({ notes: [] })
        : // The shape of a 401 the Scalekit proxy itself sends.
          JSON.stringify({
            detail: 'missing authorization header',
            code: 'UNAUTHORIZED',
          })
    );
  });
  await new Promise<void>((resolve) =>
    server.listen(0, '127.0.0.1', () => resolve())
  );
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

beforeEach(() => {
  tokenCalls = 0;
  proxyAuth = [];
  tokenEndpointStatus = 200;
  proxyAlwaysUnauthorized = false;
  providerUnauthorized = false;
  revokedTokens = new Set();
  proxy401 = undefined;
  tokenExpiresIn = undefined;
  tokenFixed = undefined;
  tokenEmpty = false;
  tokenDelayMs = 0;
  jwksAuth = [];
});

const makeClient = (heldToken?: string): ScalekitClient => {
  const client = new ScalekitClient(origin, 'client_id', 'client_secret');
  if (heldToken) {
    (client as unknown as { coreClient: CoreClient }).coreClient.accessToken =
      heldToken;
  }
  return client;
};

const call = (client: ScalekitClient) =>
  client.actions.request({
    connectionName: 'notes-oauth',
    identifier: 'user_123',
    path: '/notes',
  });

describe('actions.request authentication', () => {
  it('does not fetch a token when the client is created', async () => {
    makeClient();
    await new Promise((resolve) => setImmediate(resolve));

    expect(tokenCalls).toBe(0);
  });

  it('does not fetch a token to validate one', async () => {
    const client = makeClient();
    const token = await new jose.SignJWT({ sub: 'user_1' })
      .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
      .setExpirationTime('5m')
      .sign(signingKey);

    await expect(client.validateAccessToken(token)).resolves.toBe(true);
    // The JWKS fetch is public: sent without a token, and no token fetched.
    expect(jwksAuth).toEqual([undefined]);
    expect(tokenCalls).toBe(0);
  });

  it('fetches a token before the first call on a fresh client', async () => {
    const response = await call(makeClient());

    expect(response.status).toBe(200);
    expect(tokenCalls).toBe(1);
    // The first request already carries the token: no wasted 401 round trip.
    expect(proxyAuth).toEqual([`Bearer ${issued(1)}`]);
  });

  it('does not fetch another token while the held one works', async () => {
    const client = makeClient(GOOD);

    await call(client);
    await call(client);

    expect(tokenCalls).toBe(0);
    expect(proxyAuth).toEqual([`Bearer ${GOOD}`, `Bearer ${GOOD}`]);
  });

  it('returns the proxy 401 for a rejected token without resending, and the next call uses a new token', async () => {
    const client = makeClient('expired-token');

    await expect(call(client)).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toEqual(['Bearer expired-token']);

    const response = await call(client);
    expect(response.status).toBe(200);
    expect(proxyAuth).toEqual(['Bearer expired-token', `Bearer ${issued(1)}`]);
  });

  it('never resends a request after a proxy 401', async () => {
    proxyAlwaysUnauthorized = true;

    await expect(call(makeClient(GOOD))).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toHaveLength(1);
  });

  it('does not replay a 401 that came from the provider', async () => {
    providerUnauthorized = true;

    await expect(call(makeClient(GOOD))).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    // One request and no token refresh: the provider rejected it, not Scalekit.
    expect(proxyAuth).toHaveLength(1);
    expect(tokenCalls).toBe(0);
  });

  const postStream = (client: ScalekitClient) =>
    client.actions.request({
      connectionName: 'notes-oauth',
      identifier: 'user_123',
      path: '/notes',
      method: 'POST',
      body: Readable.from(['note']),
    });

  it('sends a stream body with a token on a fresh client', async () => {
    const response = await postStream(makeClient());

    expect(response.status).toBe(200);
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toEqual([`Bearer ${issued(1)}`]);
  });

  it('renews an expired token for a stream body but does not resend it', async () => {
    const client = makeClient('expired-token');

    await expect(postStream(client)).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    // The first send consumed the stream: no resend, but the token is
    // replaced, so the caller's next call goes out with a working one.
    expect(proxyAuth).toEqual(['Bearer expired-token']);
    expect(tokenCalls).toBe(1);

    await call(client);
    expect(proxyAuth).toEqual(['Bearer expired-token', `Bearer ${issued(1)}`]);
  });

  it('does not fetch a token for a proxy 401 with another code', async () => {
    // Only the proxy's own {"detail","code":"UNAUTHORIZED"} 401 renews the token.
    proxy401 = {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: { detail: 'token expired', code: 'TOOL_ERROR' },
    };
    tokenExpiresIn = 3600;
    const client = makeClient();

    for (let i = 0; i < 2; i += 1) {
      await expect(call(client)).rejects.toBeInstanceOf(
        ScalekitUnauthorizedException
      );
    }

    // Only the first call's own token request; no renewal, no resend.
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toEqual([`Bearer ${issued(1)}`, `Bearer ${issued(1)}`]);
  });

  it('shares one token request between concurrent first calls', async () => {
    const client = makeClient();

    const responses = await Promise.all([
      call(client),
      call(client),
      call(client),
    ]);

    expect(responses.map((r) => r.status)).toEqual([200, 200, 200]);
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toEqual(Array(3).fill(`Bearer ${issued(1)}`));
  });

  it('surfaces bad client credentials as a ScalekitException, not a raw axios error', async () => {
    tokenEndpointStatus = 401;

    const error = await call(makeClient()).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ScalekitException);
    expect(proxyAuth).toHaveLength(0);
  });

  it('surfaces a token response without an access_token as a ScalekitException', async () => {
    tokenEmpty = true;

    const error = await call(makeClient()).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ScalekitException);
    expect((error as Error).message).toMatch(/without an access_token/);
    // Nothing sent unauthenticated, and no second token request.
    expect(proxyAuth).toHaveLength(0);
    expect(tokenCalls).toBe(1);
  });

  it('renews once when two concurrent calls hold the same rejected token', async () => {
    const client = makeClient('expired-token');

    const results = await Promise.allSettled([call(client), call(client)]);

    expect(results.map((r) => r.status)).toEqual(['rejected', 'rejected']);
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toEqual(['Bearer expired-token', 'Bearer expired-token']);

    await call(client);
    expect(proxyAuth.slice(2)).toEqual([`Bearer ${issued(1)}`]);
  });
});

describe('access token lifetime', () => {
  it('keeps a token while it has more than 10 seconds left', async () => {
    tokenExpiresIn = 3600;
    const client = makeClient();

    await call(client);
    await call(client);

    expect(tokenCalls).toBe(1);
  });

  it('replaces a token about to expire before sending, with no 401', async () => {
    // A 1 s token is renewed after half its lifetime.
    tokenExpiresIn = 1;
    const client = makeClient();

    await call(client);
    await new Promise((resolve) => setTimeout(resolve, 600));
    await call(client);

    expect(tokenCalls).toBe(2);
    expect(proxyAuth).toEqual([`Bearer ${issued(1)}`, `Bearer ${issued(2)}`]);
  });

  it('sends with the held token when renewing it fails and it is still valid', async () => {
    tokenExpiresIn = 60;
    const client = makeClient();
    await call(client);

    // 5 s left: renewal is due, but the token endpoint is down.
    const now = Date.now();
    const clock = jest.spyOn(Date, 'now').mockReturnValue(now + 55_000);
    tokenEndpointStatus = 503;
    try {
      const res = await call(client);
      expect(res.status).toBe(200);
    } finally {
      clock.mockRestore();
    }

    // The initial token, then one failed renewal; the call used token 1.
    expect(tokenCalls).toBe(2);
    expect(proxyAuth).toEqual([`Bearer ${issued(1)}`, `Bearer ${issued(1)}`]);
  });

  it('returns the proxy 401 when renewal fails and the held token has expired', async () => {
    tokenExpiresIn = 60;
    const client = makeClient();
    await call(client);

    // Past expiry: the proxy rejects token 1, and the token endpoint is down.
    const now = Date.now();
    const clock = jest.spyOn(Date, 'now').mockReturnValue(now + 70_000);
    tokenEndpointStatus = 503;
    revokedTokens.add(issued(1));
    let error: unknown;
    try {
      error = await call(client).catch((e: unknown) => e);
    } finally {
      clock.mockRestore();
    }

    expect(error).toBeInstanceOf(ScalekitUnauthorizedException);
    expect((error as ScalekitServerException).httpStatus).toBe(401);
    // Sent once with the held token (rejected before forwarding), never
    // resent; the renewal and the renewal after the 401 both failed.
    expect(proxyAuth).toEqual([`Bearer ${issued(1)}`, `Bearer ${issued(1)}`]);
    expect(tokenCalls).toBe(3);
  });

  it('spends one token request and no resend per call on a 401 that a new token does not fix', async () => {
    // The proxy answers every token with its 401, as it does when the
    // connected account's own credentials fail.
    tokenExpiresIn = 3600;
    proxyAlwaysUnauthorized = true;
    const client = makeClient();

    for (let i = 0; i < 2; i += 1) {
      await expect(call(client)).rejects.toBeInstanceOf(
        ScalekitUnauthorizedException
      );
    }

    expect(tokenCalls).toBe(3);
    expect(proxyAuth).toEqual([`Bearer ${issued(1)}`, `Bearer ${issued(2)}`]);
  });

  it('replaces a token on its next 401 even after earlier 401s that a new token did not fix', async () => {
    // The proxy answers a failing connected account with its 401, so a new
    // token doesn't help. Then that token is revoked: the next call must
    // still replace it, not wait for its renewal an hour later.
    tokenExpiresIn = 3600;
    proxyAlwaysUnauthorized = true;
    const client = makeClient();
    await expect(call(client)).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );

    proxyAlwaysUnauthorized = false;
    revokedTokens.add(issued(2));
    await expect(call(client)).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    const res = await call(client);

    expect(res.status).toBe(200);
    expect(proxyAuth.slice(1)).toEqual([
      `Bearer ${issued(2)}`,
      `Bearer ${issued(3)}`,
    ]);
  });

  it('keeps refreshing on every Scalekit 401 when the token lifetime is unknown', async () => {
    // No expires_in and not a JWT: the token is never renewed ahead of time,
    // so a 401 must stay able to replace it.
    proxyAlwaysUnauthorized = true;
    const client = makeClient();

    await expect(call(client)).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    await expect(call(client)).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );

    expect(tokenCalls).toBe(3);
    expect(proxyAuth).toHaveLength(2);
  });

  it('stops waiting for a token request when the signal aborts', async () => {
    tokenDelayMs = 2000;
    const core = (makeClient() as unknown as { coreClient: CoreClient })
      .coreClient;
    const controller = new AbortController();
    const reason = new Error('stop');
    let sent = false;

    const started = Date.now();
    const pending = core.withAccessToken(
      async () => {
        sent = true;
      },
      { signal: controller.signal }
    );
    setTimeout(() => controller.abort(reason), 50);

    await expect(pending).rejects.toBe(reason);
    expect(Date.now() - started).toBeLessThan(1000);
    expect(sent).toBe(false);
  });

  it('rejects at once, with no token request and no unhandled rejection, when the signal is already aborted', async () => {
    tokenEndpointStatus = 500; // a token request, if one started, would fail
    const core = (makeClient() as unknown as { coreClient: CoreClient })
      .coreClient;
    const controller = new AbortController();
    const reason = new Error('stop');
    controller.abort(reason);
    const unhandled: unknown[] = [];
    const onUnhandled = (error: unknown) => unhandled.push(error);
    process.on('unhandledRejection', onUnhandled);
    let sent = false;

    try {
      await expect(
        core.withAccessToken(
          async () => {
            sent = true;
          },
          { signal: controller.signal }
        )
      ).rejects.toBe(reason);
      // Give any stray rejection time to surface.
      await new Promise((resolve) => setTimeout(resolve, 100));
    } finally {
      process.off('unhandledRejection', onUnhandled);
    }

    expect(tokenCalls).toBe(0);
    expect(sent).toBe(false);
    expect(unhandled).toEqual([]);
  });
});
