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
      res.writeHead(tokenEndpointStatus, {
        'content-type': 'application/json',
      });
      res.end(
        tokenEndpointStatus === 200
          ? JSON.stringify({
              access_token: issued(tokenCalls),
              token_type: 'Bearer',
            })
          : JSON.stringify({ error: 'invalid_client' })
      );
      return;
    }
    proxyAuth.push(req.headers.authorization);
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
});
