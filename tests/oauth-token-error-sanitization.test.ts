/**
 * Regression test: a failed request through CoreClient's shared axios
 * instance (e.g. the client_credentials token exchange in authenticate())
 * must never leak the raw request body/headers or the underlying
 * request/response objects via the propagated error. The token endpoint
 * request body contains the plaintext client_secret, and an uncaught
 * AxiosError carrying `config.data`/`config.headers`/`request` would dump
 * it in full if it ever reaches Node's default exception handler.
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

describe('CoreClient axios response interceptor — error sanitization', () => {
  it('strips config.data, config.headers, and request/response.request from a failing request', async () => {
    const client = makeClient();

    // Simulate the token endpoint rejecting the request (e.g. a rotated
    // client_secret) by swapping in an adapter that rejects with an
    // AxiosError shaped like a real failure: the request config still
    // carries the urlencoded body (grant_type/client_id/client_secret) and
    // headers, and both the request and response carry the raw request
    // object, exactly as axios would populate them.
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

    expect(caught).toBeInstanceOf(AxiosError);
    const err = caught as AxiosError;

    // The sensitive request body/headers must be gone off the config...
    expect(err.config).toBeDefined();
    expect(err.config?.data).toBeUndefined();
    expect(err.config?.headers).toBeUndefined();
    // ...and the raw request/response.request objects must be gone too.
    expect((err as any).request).toBeUndefined();
    expect((err.response as any)?.request).toBeUndefined();

    // Belt-and-suspenders: the secret must not survive anywhere in the
    // error's own serialization.
    const serialized = JSON.stringify(err, Object.getOwnPropertyNames(err));
    expect(serialized).not.toContain('super-secret-value');
  });
});
