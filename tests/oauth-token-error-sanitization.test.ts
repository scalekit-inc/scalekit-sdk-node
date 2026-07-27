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
import { describe, it, expect } from '@jest/globals';
import { AxiosError } from 'axios';
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
});
