/**
 * actions.request() sends a plain HTTP call through the axios instance rather
 * than through connectExec, which is what fetches a token on the first gRPC
 * call. It must fetch a token itself when the client has none, or a proxy call
 * made as the client's first call goes out unauthenticated and fails with 401.
 */
import { describe, it, expect, jest } from '@jest/globals';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import CoreClient from '../src/core';
import ToolsClient from '../src/tools';
import ActionsClient from '../src/actions';
import ConnectedAccountsClient from '../src/connected-accounts';
import ConnectionClient from '../src/connection';
import { ScalekitServerException } from '../src/errors';
import { ConnectorStatus } from '../src';

type Handler = (config: InternalAxiosRequestConfig) => AxiosResponse;

function respond(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown
): AxiosResponse {
  return { data, status, statusText: '', headers: {}, config };
}

function makeActions(handler: Handler) {
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const seen: InternalAxiosRequestConfig[] = [];
  // Replace only the transport, so the real request interceptors (which add
  // the Authorization header) still run.
  coreClient.axios.defaults.adapter = async (config) => {
    seen.push(config);
    const response = handler(config);
    if (response.status >= 400) {
      const { AxiosError } = await import('axios');
      throw new AxiosError(
        `Request failed with status code ${response.status}`,
        String(response.status),
        config,
        undefined,
        response
      );
    }
    return response;
  };
  const grpcConnect = { createClient: () => ({}) } as any;
  const actions = new ActionsClient(
    new ToolsClient(grpcConnect, coreClient),
    new ConnectedAccountsClient(grpcConnect, coreClient),
    coreClient,
    new ConnectionClient(grpcConnect, coreClient)
  );
  return { actions, coreClient, seen };
}

// AxiosHeaders lookups are case-insensitive through get().
const authHeader = (c: InternalAxiosRequestConfig) =>
  c.headers.get('Authorization');
const isTokenCall = (c: InternalAxiosRequestConfig) =>
  String(c.url).endsWith('oauth/token');
const proxyParams = {
  connectionName: 'gmail',
  identifier: 'user_123',
  path: '/gmail/v1/users/me/profile',
};

describe('ActionsClient.request authentication', () => {
  it('fetches a token first when it is the client’s first call', async () => {
    const { actions, coreClient, seen } = makeActions((config) =>
      isTokenCall(config)
        ? respond(config, 200, { access_token: 'fresh-token' })
        : respond(config, 200, { ok: true })
    );

    const res = await actions.request(proxyParams);

    expect(res.data).toEqual({ ok: true });
    expect(seen.map(isTokenCall)).toEqual([true, false]);
    expect(authHeader(seen[1])).toBe('Bearer fresh-token');
    expect(coreClient.accessToken).toBe('fresh-token');
  });

  it('reuses a cached token without calling the token endpoint', async () => {
    const { actions, coreClient, seen } = makeActions((config) =>
      respond(config, 200, { ok: true })
    );
    coreClient.accessToken = 'cached-token';

    await actions.request(proxyParams);
    await actions.request(proxyParams);

    expect(seen.some(isTokenCall)).toBe(false);
    expect(seen.map(authHeader)).toEqual([
      'Bearer cached-token',
      'Bearer cached-token',
    ]);
  });

  it('shares one token request between concurrent first calls', async () => {
    const { actions, seen } = makeActions((config) =>
      isTokenCall(config)
        ? respond(config, 200, { access_token: 'shared-token' })
        : respond(config, 200, { ok: true })
    );

    await Promise.all([
      actions.request(proxyParams),
      actions.request(proxyParams),
      actions.request(proxyParams),
    ]);

    expect(seen.filter(isTokenCall)).toHaveLength(1);
    expect(
      seen
        .filter((c) => !isTokenCall(c))
        .every((c) => authHeader(c) === 'Bearer shared-token')
    ).toBe(true);
  });

  it('surfaces a failed token request and never sends the proxy call', async () => {
    const { actions, coreClient, seen } = makeActions((config) =>
      isTokenCall(config)
        ? respond(config, 401, { error: 'invalid_client' })
        : respond(config, 200, { ok: true })
    );

    await expect(actions.request(proxyParams)).rejects.toBeInstanceOf(
      ScalekitServerException
    );
    expect(seen.every(isTokenCall)).toBe(true);
    expect(coreClient.accessToken).toBeNull();
  });

  it('retries the token fetch on the next call after a failure', async () => {
    let tokenCalls = 0;
    const { actions } = makeActions((config) => {
      if (!isTokenCall(config)) return respond(config, 200, { ok: true });
      tokenCalls += 1;
      return tokenCalls === 1
        ? respond(config, 503, {})
        : respond(config, 200, { access_token: 'second-try' });
    });

    await expect(actions.request(proxyParams)).rejects.toBeDefined();
    await expect(actions.request(proxyParams)).resolves.toMatchObject({
      data: { ok: true },
    });
    expect(tokenCalls).toBe(2);
  });

  it('does not retry a 401 returned through the proxy', async () => {
    const { actions, seen } = makeActions((config) =>
      isTokenCall(config)
        ? respond(config, 200, { access_token: 'tok' })
        : respond(config, 401, { message: 'upstream rejected the token' })
    );

    await expect(
      actions.request({ ...proxyParams, method: 'POST', body: { a: 1 } })
    ).rejects.toBeInstanceOf(ScalekitServerException);
    expect(seen.filter((c) => !isTokenCall(c))).toHaveLength(1);
  });
});

describe('package root exports', () => {
  it('exports ConnectorStatus with the connected-account status values', () => {
    expect(ConnectorStatus.ACTIVE).toBe(1);
    expect(ConnectorStatus[ConnectorStatus.ACTIVE]).toBe('ACTIVE');
  });
});
