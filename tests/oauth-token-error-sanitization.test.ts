/**
 * Regression test for CoreClient's redacting response interceptor.
 *
 * Every request through CoreClient's shared axios instance can attach two
 * credentials to a failing AxiosError via `error.config`: the plaintext
 * client_secret in the token endpoint's request body (`config.data`) and the
 * Bearer access token in the Authorization header. `AxiosError.toJSON()` and
 * Node's default handler would dump both if the error is logged wholesale or
 * propagates uncaught. The interceptor masks just those two values, leaving
 * the response/status/headers/request intact for debugging.
 */
import { describe, it, expect, afterEach } from '@jest/globals';
import { AxiosError } from 'axios';
import * as http from 'http';
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

describe('CoreClient redacting response interceptor', () => {
  it('masks the client_secret in the token request body while preserving other body fields and the response', async () => {
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

    // The secret value is masked out of the request body...
    expect(typeof err.config?.data).toBe('string');
    expect(err.config?.data).toContain('client_secret=[REDACTED]');
    expect(err.config?.data).not.toContain('super-secret-value');
    // ...but the non-secret body fields survive for debugging.
    expect(err.config?.data).toContain('grant_type=client_credentials');
    expect(err.config?.data).toContain('client_id=client_id');

    // The response (status/body) is preserved so callers can branch on it and
    // read the server's error detail, and the request object is kept too.
    expect(err.response?.status).toBe(401);
    expect(err.response?.data).toEqual({ error: 'invalid_client' });
    expect((err as any).request).toBeDefined();

    const serialized = JSON.stringify(err, Object.getOwnPropertyNames(err));
    expect(serialized).not.toContain('super-secret-value');
  });

  it('masks every client_secret occurrence in the body and never partial-matches a similarly-named field', async () => {
    const client = makeClient();

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

    // A duplicated `client_secret` field (e.g. a proxy/gateway that
    // deduplicates query params only after this SDK builds the body) and a
    // decoy field whose name merely contains "client_secret" as a substring,
    // to pin both the `g` flag (redact every occurrence) and the field-
    // boundary anchoring (don't false-positive on `other_client_secret`).
    const bodyWithDuplicateAndDecoy =
      'grant_type=client_credentials&client_id=client_id&client_secret=first-secret-value' +
      '&other_client_secret=decoy-value&client_secret=second-secret-value';

    let caught: unknown;
    try {
      await client.authenticate(bodyWithDuplicateAndDecoy);
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(AxiosError);
    const err = caught as AxiosError;
    const data = err.config?.data as string;

    // Both real client_secret occurrences are redacted...
    expect(data).not.toContain('first-secret-value');
    expect(data).not.toContain('second-secret-value');
    const redactedCount = (data.match(/client_secret=\[REDACTED\]/g) ?? [])
      .length;
    expect(redactedCount).toBe(2);
    // ...while the decoy field (merely containing "client_secret" as a
    // substring) survives untouched, proving the match is boundary-anchored
    // rather than a bare substring replace.
    expect(data).toContain('other_client_secret=decoy-value');
    // ...and the non-secret fields survive for debugging.
    expect(data).toContain('grant_type=client_credentials');
    expect(data).toContain('client_id=client_id');

    const serialized = JSON.stringify(err, Object.getOwnPropertyNames(err));
    expect(serialized).not.toContain('first-secret-value');
    expect(serialized).not.toContain('second-secret-value');
  });

  it('masks the Authorization bearer on any failed authenticated request while preserving the response', async () => {
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
      // Any authenticated call through the shared instance (e.g. getJwks or
      // the actions proxy) carries the bearer; a bare GET exercises the same
      // request-interceptor path.
      await client.axios.get('/some-endpoint');
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(AxiosError);
    const err = caught as AxiosError;

    // The Authorization header value is masked...
    const authHeader =
      (err.config?.headers as Record<string, unknown> | undefined)
        ?.Authorization ??
      (err.config?.headers as Record<string, unknown> | undefined)
        ?.authorization;
    expect(authHeader).toBe('[REDACTED]');
    // ...and the token does not survive anywhere in the config.
    expect(JSON.stringify(err.config?.headers)).not.toContain(
      'super-secret-access-token'
    );

    // Response/status/request are preserved for debugging.
    expect(err.response?.status).toBe(500);
    expect(err.response?.data).toEqual({ error: 'boom' });
    expect((err as any).request).toBeDefined();

    const serialized = JSON.stringify(err, Object.getOwnPropertyNames(err));
    expect(serialized).not.toContain('super-secret-access-token');
  });

  describe('real Node http adapter — error.request._header', () => {
    let server: http.Server | undefined;

    afterEach(async () => {
      if (server) {
        await new Promise<void>((resolve) => server?.close(() => resolve()));
        server = undefined;
      }
    });

    it('redacts the Authorization line in error.request._header / error.response.request._header so util.inspect cannot leak the bearer token', async () => {
      // Use CoreClient's *default* adapter (no mock) so axios drives a real
      // `http.ClientRequest` under the hood — that's the object whose
      // enumerable `_header` property serializes the full outgoing headers,
      // including `Authorization: Bearer <token>`, and which util.inspect
      // (console.error / Node's default uncaught-exception handler) walks
      // into via `error.request` / `error.response.request`.
      server = http.createServer((_req, res) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'boom' }));
      });
      await new Promise<void>((resolve) =>
        server?.listen(0, '127.0.0.1', resolve)
      );
      const { port } = server.address() as AddressInfo;

      const client = new CoreClient(
        `http://127.0.0.1:${port}`,
        'client_id',
        'client_secret'
      );
      const accessToken = 'super-secret-access-token';
      client.accessToken = accessToken;

      let caught: unknown;
      try {
        await client.axios.get('/some-endpoint');
      } catch (error) {
        caught = error;
      }

      expect(caught).toBeInstanceOf(AxiosError);
      const err = caught as AxiosError;
      expect(err.response?.status).toBe(500);

      const rawRequest = (err as unknown as { request?: { _header?: unknown } })
        .request;
      const rawResponseRequest = (
        err.response as unknown as { request?: { _header?: unknown } }
      )?.request;

      // Sanity check the test would actually catch a regression: `_header`
      // must exist and be non-empty on both references — this is exactly the
      // real ClientRequest property the reviewer flagged.
      expect(typeof rawRequest?._header).toBe('string');
      expect((rawRequest?._header as string).length).toBeGreaterThan(0);
      expect(typeof rawResponseRequest?._header).toBe('string');

      // The bearer token must not survive in either _header...
      expect(rawRequest?._header).not.toContain(accessToken);
      expect(rawResponseRequest?._header).not.toContain(accessToken);
      // ...but the Authorization line itself should still be present, just
      // redacted, confirming this is a targeted mask and not a deletion.
      expect(rawRequest?._header).toMatch(/authorization: \[REDACTED\]/i);

      // The scenario this PR defends against: util.inspect (what
      // console.error(err) and Node's default uncaught-exception /
      // unhandledRejection handler use) must not print the token anywhere in
      // the error, including via the nested request/response.request.
      const inspected = inspect(err, { depth: null });
      expect(inspected).not.toContain(accessToken);
    });
  });
});
