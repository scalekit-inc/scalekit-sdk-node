/**
 * `actions.request()` goes straight through axios, not through the gRPC retry
 * wrapper that fetches and refreshes the access token. It has to get its own
 * token: fetch one when the client has none, and fetch a new one and retry once
 * when the held token has expired.
 *
 * Credential-free: a local HTTP server plays both the token endpoint and the
 * proxy, so the assertions are on what the server actually receives.
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
import { AddressInfo } from 'net';
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

beforeAll(async () => {
  server = http.createServer((req, res) => {
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
