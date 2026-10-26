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

const GOOD = 'good-token';

let server: http.Server;
let origin: string;
let tokenCalls: number;
let proxyAuth: Array<string | undefined>;
let tokenEndpointStatus: number;
let proxyAlwaysUnauthorized: boolean;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    if (req.url?.includes('/oauth/token')) {
      tokenCalls += 1;
      res.writeHead(tokenEndpointStatus, {
        'content-type': 'application/json',
      });
      res.end(
        tokenEndpointStatus === 200
          ? JSON.stringify({ access_token: GOOD, token_type: 'Bearer' })
          : JSON.stringify({ error: 'invalid_client' })
      );
      return;
    }
    proxyAuth.push(req.headers.authorization);
    const ok =
      !proxyAlwaysUnauthorized &&
      req.headers.authorization === `Bearer ${GOOD}`;
    res.writeHead(ok ? 200 : 401, { 'content-type': 'application/json' });
    res.end(
      ok
        ? JSON.stringify({ notes: [] })
        : JSON.stringify({ detail: 'missing authorization header' })
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
    expect(proxyAuth).toEqual([`Bearer ${GOOD}`]);
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
    expect(proxyAuth).toEqual(['Bearer expired-token', `Bearer ${GOOD}`]);
  });

  it('retries only once when the proxy keeps answering 401', async () => {
    proxyAlwaysUnauthorized = true;

    await expect(call(makeClient(GOOD))).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    expect(tokenCalls).toBe(1);
    expect(proxyAuth).toHaveLength(2);
  });

  it('surfaces bad client credentials as a ScalekitException, not a raw axios error', async () => {
    tokenEndpointStatus = 401;

    const error = await call(makeClient()).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ScalekitException);
    expect(proxyAuth).toHaveLength(0);
  });
});
