/**
 * Regression test for CoreClient's response interceptor.
 *
 * Every request through CoreClient's shared axios instance can attach two
 * credentials to a failing AxiosError: the plaintext client_secret in the
 * token endpoint's request body (`error.config.data`) and the Bearer access
 * token in the Authorization header (`error.config.headers`, and — with the
 * real Node adapter — the raw `error.request` / `error.response.request`
 * whose `_header` holds it too). `AxiosError.toJSON()` and util.inspect
 * (`console.error(err)`, Node's default uncaught-exception handler) would dump
 * them if the error is logged wholesale or propagates uncaught. The interceptor
 * drops those credential-bearing request copies off the error, leaving the
 * response (status/body/headers), message, and code intact.
 */
import { describe, it, expect } from '@jest/globals';
import { AxiosError } from 'axios';
import http from 'http';
import { inspect } from 'util';
import type { AddressInfo } from 'net';
import CoreClient from '../src/core';

function makeClient(): CoreClient {
  return new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
}

describe('CoreClient response interceptor — credential scrubbing', () => {
  it('drops the request body (client_secret) while preserving the response', async () => {
    const client = makeClient();

    // Simulate the token endpoint rejecting (e.g. a rotated client_secret):
    // the request config still carries the urlencoded body, and the response
    // carries the server's status/body, exactly as axios populates them.
    client.axios.defaults.adapter = async (config) => {
      throw new AxiosError(
        'Request failed with status code 401',
        'ERR_BAD_REQUEST',
        config,
        { rawRequestObject: true },
        {
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config,
          data: { error: 'invalid_client' },
          request: { rawRequestObject: true },
        }
      );
    };

    const secretBearingBody =
      'grant_type=client_credentials&client_id=client_id&client_secret=super-secret-value';

    let caught: unknown;
    try {
      await client.authenticate(secretBearingBody);
    } catch (error) {
      caught = error;
    }

    // Still an AxiosError — callers' `instanceof AxiosError` / `error.response`
    // branches keep working unchanged.
    expect(caught).toBeInstanceOf(AxiosError);
    const err = caught as AxiosError;

    // The credential-bearing request body is dropped off the config...
    expect(err.config?.data).toBeUndefined();
    // ...along with the request references...
    expect((err as { request?: unknown }).request).toBeUndefined();
    expect(
      (err.response as { request?: unknown } | undefined)?.request
    ).toBeUndefined();
    // ...but the response (status/body), message and code are preserved.
    expect(err.response?.status).toBe(401);
    expect(err.response?.data).toEqual({ error: 'invalid_client' });
    expect(err.message).toBe('Request failed with status code 401');
    expect(err.code).toBe('ERR_BAD_REQUEST');

    // The secret must not survive anywhere in the error's serialization.
    const serialized = JSON.stringify(err, Object.getOwnPropertyNames(err));
    expect(serialized).not.toContain('super-secret-value');
    expect(inspect(err, { depth: null })).not.toContain('super-secret-value');
  });

  it('drops the request headers (Authorization bearer) while preserving the response', async () => {
    const client = makeClient();
    // An access token is present once the SDK has authenticated; the request
    // interceptor then attaches it as a Bearer header to non-token calls.
    client.accessToken = 'super-secret-access-token';

    client.axios.defaults.adapter = async (config) => {
      throw new AxiosError(
        'Request failed with status code 500',
        'ERR_BAD_RESPONSE',
        config,
        { rawRequestObject: true },
        {
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config,
          data: { error: 'boom' },
          request: { rawRequestObject: true },
        }
      );
    };

    let caught: unknown;
    try {
      await client.axios.get('/some-endpoint');
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(AxiosError);
    const err = caught as AxiosError;

    // The request headers (carrying the bearer) are dropped...
    expect(err.config?.headers).toBeUndefined();
    expect((err as { request?: unknown }).request).toBeUndefined();
    expect(
      (err.response as { request?: unknown } | undefined)?.request
    ).toBeUndefined();
    // ...response/status preserved for debugging and retry logic.
    expect(err.response?.status).toBe(500);
    expect(err.response?.data).toEqual({ error: 'boom' });

    const serialized = JSON.stringify(err, Object.getOwnPropertyNames(err));
    expect(serialized).not.toContain('super-secret-access-token');
    expect(inspect(err, { depth: null })).not.toContain(
      'super-secret-access-token'
    );
  });

  it('does not leak the Authorization bearer via util.inspect on a real failed request (error.request._header)', async () => {
    const TOKEN = 'super-secret-access-token';

    // A real Node http server + adapter, so error.request is a genuine
    // http.ClientRequest whose `_header` holds the serialized Authorization
    // line — the exact object a mocked adapter can't reproduce.
    const server = http.createServer((_req, res) => {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'unauthorized' }));
    });
    await new Promise<void>((resolve) =>
      server.listen(0, '127.0.0.1', () => resolve())
    );
    const { port } = server.address() as AddressInfo;

    const client = new CoreClient(
      `http://127.0.0.1:${port}`,
      'client_id',
      'client_secret'
    );
    client.accessToken = TOKEN; // request interceptor attaches Authorization: Bearer <TOKEN>

    let caught: unknown;
    try {
      await client.getJwks(); // real GET through the Node adapter → real ClientRequest
    } catch (error) {
      caught = error;
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }

    expect(caught).toBeInstanceOf(AxiosError);
    const err = caught as AxiosError;

    // Request config + raw request references dropped...
    expect(err.config?.headers).toBeUndefined();
    expect((err as { request?: unknown }).request).toBeUndefined();
    expect(
      (err.response as { request?: unknown } | undefined)?.request
    ).toBeUndefined();
    // ...response preserved for debugging...
    expect(err.response?.status).toBe(401);
    // ...and a wholesale `console.error(err)` / uncaught dump reveals no token.
    expect(inspect(err, { depth: null })).not.toContain(TOKEN);
  });
});
