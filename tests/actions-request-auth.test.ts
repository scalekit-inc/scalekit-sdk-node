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
} from '@jest/globals';
import http from 'http';
import * as jose from 'jose';
import { AddressInfo } from 'net';
import { Readable } from 'stream';
import ScalekitClient from '../src/scalekit';
import CoreClient from '../src/core';
import { ScalekitException } from '../src/errors/base-exception';
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
    const ok =
      !proxyAlwaysUnauthorized &&
      (req.headers.authorization ?? '').startsWith('Bearer fresh-');
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

  it('fetches a new token and retries once when the held token has expired', async () => {
    const response = await call(makeClient('expired-token'));

    expect(response.status).toBe(200);
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toEqual(['Bearer expired-token', `Bearer ${issued(1)}`]);
  });

  it('retries only once when the proxy keeps answering 401', async () => {
    proxyAlwaysUnauthorized = true;

    await expect(call(makeClient(GOOD))).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toHaveLength(2);
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

  it.each([
    [
      "relayed from the provider, even with Scalekit's body shape",
      {
        'content-type': 'application/json',
        'x-scalekit-upstream': 'true',
      },
      { detail: 'expired', code: 'UNAUTHORIZED' },
    ],
    [
      'a connected account credential failure (TOOL_ERROR)',
      { 'content-type': 'application/json; charset=utf-8' },
      { detail: 'token expired', code: 'TOOL_ERROR' },
    ],
  ])('does not refresh or resend a 401 %s', async (_label, headers, body) => {
    proxy401 = { headers, body };
    tokenExpiresIn = 3600;
    const client = makeClient();

    for (let i = 0; i < 2; i += 1) {
      await expect(call(client)).rejects.toBeInstanceOf(
        ScalekitUnauthorizedException
      );
    }

    // Only the first call's own token request; no refresh, no resend.
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

  it('refreshes once when two concurrent calls hold the same expired token', async () => {
    const client = makeClient('expired-token');

    const responses = await Promise.all([call(client), call(client)]);

    expect(responses.map((r) => r.status)).toEqual([200, 200]);
    expect(tokenCalls).toBe(1);
    expect([...proxyAuth].sort()).toEqual([
      'Bearer expired-token',
      'Bearer expired-token',
      `Bearer ${issued(1)}`,
      `Bearer ${issued(1)}`,
    ]);
  });

  it('does not resend when the refreshed token is unchanged', async () => {
    tokenFixed = 'expired-token'; // the token endpoint hands back the same one

    await expect(call(makeClient('expired-token'))).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toEqual(['Bearer expired-token']);
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

  it('spends one token request per token, not per call, on a connected account that keeps failing', async () => {
    // The proxy answers every token with its 401, as it does when the
    // connected account's own credentials fail.
    tokenExpiresIn = 3600;
    proxyAlwaysUnauthorized = true;
    const client = makeClient();

    for (let i = 0; i < 3; i += 1) {
      await expect(call(client)).rejects.toBeInstanceOf(
        ScalekitUnauthorizedException
      );
    }

    // Call 1: token 1 → 401 → token 2 → 401, so the token isn't the cause.
    // Calls 2 and 3: token 2 → 401, returned with no token request.
    expect(tokenCalls).toBe(2);
    expect(proxyAuth).toEqual([
      `Bearer ${issued(1)}`,
      `Bearer ${issued(2)}`,
      `Bearer ${issued(2)}`,
      `Bearer ${issued(2)}`,
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
    expect(proxyAuth).toHaveLength(4);
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
});
