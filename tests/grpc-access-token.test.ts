/**
 * gRPC calls (`CoreClient.connectExec`) get their access token the same way
 * HTTP calls do: fetched before the first call and renewed shortly before it
 * expires, so a call never goes out without one. When Scalekit still rejects
 * the token, one new token is fetched (shared by concurrent calls) and the
 * call is sent once more; a second rejection is returned.
 *
 * Credential-free and on the wire: a local HTTP/2 server serves
 * `OrganizationService.ListOrganization` and records the Authorization header
 * of every request, and a local HTTP/1 server plays the token endpoint.
 */
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import http from 'http';
import http2 from 'http2';
import { AddressInfo } from 'net';
import { create } from '@bufbuild/protobuf';
import { Code, ConnectError, type ConnectRouter } from '@connectrpc/connect';
import { connectNodeAdapter } from '@connectrpc/connect-node';
import axios, { AxiosError } from 'axios';
import util from 'util';
import ScalekitClient from '../src/scalekit';
import {
  ScalekitException,
  ScalekitServerException,
} from '../src/errors/base-exception';
import CoreClient from '../src/core';
import {
  ScalekitToolUnauthorizedException,
  ScalekitUnauthorizedException,
} from '../src/errors/specific-exceptions';
import {
  ListOrganizationsResponseSchema,
  OrganizationService,
} from '../src/pkg/grpc/scalekit/v1/organizations/organizations_pb';
import {
  ErrorInfoSchema,
  ToolErrorInfoSchema,
} from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';

type Outcome = 'ok' | 'unauthenticated' | 'tool-error' | 'unavailable';

let tokenServer: http.Server;
let grpcServer: http2.Http2Server;
const sessions = new Set<http2.ServerHttp2Session>();
let tokenOrigin: string;
let grpcOrigin: string;

// Token endpoint: every token is `fresh-<n>` unless `tokenFixed` is set.
let tokenCalls: number;
let tokenStatus: number;
let tokenExpiresIn: number | undefined;
let tokenFixed: string | undefined;
// gRPC server: the Authorization header of each request, tokens it rejects as
// Scalekit would a revoked one, and scripted outcomes that take precedence.
let grpcAuth: Array<string | null>;
let rejectedTokens: Set<string>;
let script: Outcome[];
// Runs once, inside the next gRPC request, before it is answered.
let duringNextRequest: (() => Promise<void>) | undefined;
// HTTP/1 `/proxy` route: the Authorization header of each request.
let proxyAuth: Array<string | undefined>;

function toolError(): ConnectError {
  return new ConnectError('provider token expired', Code.Unauthenticated, {}, [
    {
      desc: ErrorInfoSchema,
      value: {
        errorCode: 'TOOL_ERROR',
        toolErrorInfo: create(ToolErrorInfoSchema, {
          toolErrorCode: 'UNAUTHORIZED',
          toolErrorMessage: 'provider token expired',
          executionId: 'exec-1',
        }),
      },
    },
  ]);
}

function routes(router: ConnectRouter) {
  router.service(OrganizationService, {
    async listOrganization(_req, ctx) {
      const auth = ctx.requestHeader.get('authorization');
      grpcAuth.push(auth);
      const hook = duringNextRequest;
      duringNextRequest = undefined;
      await hook?.();
      const token = auth?.replace(/^Bearer /, '') ?? '';
      const outcome =
        script.shift() ??
        (token && !rejectedTokens.has(token) ? 'ok' : 'unauthenticated');
      switch (outcome) {
        case 'unauthenticated':
          throw new ConnectError('token rejected', Code.Unauthenticated);
        case 'tool-error':
          throw toolError();
        case 'unavailable':
          throw new ConnectError('try again', Code.Unavailable);
        default:
          return create(ListOrganizationsResponseSchema, { totalSize: 0 });
      }
    },
  });
}

beforeAll(async () => {
  tokenServer = http.createServer((req, res) => {
    if (req.url?.startsWith('/proxy')) {
      // The Scalekit proxy: its own 401 for a missing or rejected token.
      proxyAuth.push(req.headers.authorization);
      const token = (req.headers.authorization ?? '').replace(/^Bearer /, '');
      const ok = token !== '' && !rejectedTokens.has(token);
      req.resume();
      res.writeHead(ok ? 200 : 401, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify(
          ok ? {} : { detail: 'token rejected', code: 'UNAUTHORIZED' }
        )
      );
      return;
    }
    tokenCalls += 1;
    const n = tokenCalls;
    req.resume();
    res.writeHead(tokenStatus, { 'content-type': 'application/json' });
    res.end(
      tokenStatus !== 200
        ? JSON.stringify({ error: 'invalid_client' })
        : JSON.stringify({
            access_token: tokenFixed ?? `fresh-${n}`,
            token_type: 'Bearer',
            ...(tokenExpiresIn !== undefined && { expires_in: tokenExpiresIn }),
          })
    );
  });
  grpcServer = http2.createServer(connectNodeAdapter({ routes }));
  grpcServer.on('session', (s) => {
    sessions.add(s);
    s.on('close', () => sessions.delete(s));
  });
  await Promise.all([
    new Promise<void>((r) => tokenServer.listen(0, '127.0.0.1', () => r())),
    new Promise<void>((r) => grpcServer.listen(0, '127.0.0.1', () => r())),
  ]);
  tokenOrigin = `http://127.0.0.1:${(tokenServer.address() as AddressInfo).port}`;
  grpcOrigin = `http://127.0.0.1:${(grpcServer.address() as AddressInfo).port}`;
});

afterAll(async () => {
  sessions.forEach((s) => s.destroy());
  await Promise.all([
    new Promise<void>((r) => tokenServer.close(() => r())),
    new Promise<void>((r) => grpcServer.close(() => r())),
  ]);
});

beforeEach(() => {
  tokenCalls = 0;
  tokenStatus = 200;
  tokenExpiresIn = undefined;
  tokenFixed = undefined;
  grpcAuth = [];
  rejectedTokens = new Set();
  script = [];
  duringNextRequest = undefined;
  proxyAuth = [];
});

afterEach(() => {
  jest.restoreAllMocks();
});

function makeClient(
  options: { scalekitTokenErrors?: boolean; secret?: string } = {}
): { client: ScalekitClient; core: CoreClient } {
  const client = new ScalekitClient(
    grpcOrigin,
    'client_id',
    options.secret ?? 'secret',
    { pingIntervalMs: 0, scalekitTokenErrors: options.scalekitTokenErrors }
  );
  const core = (client as unknown as { coreClient: CoreClient }).coreClient;
  // gRPC goes to the HTTP/2 server; the token endpoint is on the HTTP/1 one.
  core.axios.defaults.baseURL = tokenOrigin;
  return { client, core };
}

describe('gRPC access token', () => {
  it('fetches a token before the first call, so it never goes out unauthenticated', async () => {
    const { client } = makeClient();

    await client.organization.listOrganization();

    expect(tokenCalls).toBe(1);
    expect(grpcAuth).toEqual(['Bearer fresh-1']);
  });

  it('reuses the held token on later calls', async () => {
    const { client } = makeClient();

    await client.organization.listOrganization();
    await client.organization.listOrganization();

    expect(tokenCalls).toBe(1);
    expect(grpcAuth).toEqual(['Bearer fresh-1', 'Bearer fresh-1']);
  });

  it('renews a token about to expire before sending, with no 401', async () => {
    tokenExpiresIn = 60;
    const { client } = makeClient();
    await client.organization.listOrganization();

    // 55 s later the token has 5 s left, under the 10 s renewal margin.
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now + 55_000);
    await client.organization.listOrganization();

    expect(tokenCalls).toBe(2);
    expect(grpcAuth).toEqual(['Bearer fresh-1', 'Bearer fresh-2']);
  });

  it('fetches one new token and resends once when Scalekit rejects the held one', async () => {
    const { client } = makeClient();
    await client.organization.listOrganization();
    rejectedTokens.add('fresh-1');

    await client.organization.listOrganization();

    expect(tokenCalls).toBe(2);
    expect(grpcAuth).toEqual([
      'Bearer fresh-1',
      'Bearer fresh-1',
      'Bearer fresh-2',
    ]);
  });

  it('returns a second rejection: one token request and one resend, not three', async () => {
    const { client } = makeClient();
    script = ['unauthenticated', 'unauthenticated', 'unauthenticated'];

    await expect(client.organization.listOrganization()).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );

    expect(tokenCalls).toBe(2);
    expect(grpcAuth).toEqual(['Bearer fresh-1', 'Bearer fresh-2']);
  });

  it('never refreshes or resends a TOOL_ERROR 401', async () => {
    const { client } = makeClient();
    script = ['tool-error'];

    await expect(client.organization.listOrganization()).rejects.toBeInstanceOf(
      ScalekitToolUnauthorizedException
    );

    expect(tokenCalls).toBe(1);
    expect(grpcAuth).toEqual(['Bearer fresh-1']);
  });

  it('shares one token request between concurrent calls rejected on the same token', async () => {
    const { client } = makeClient();
    await client.organization.listOrganization();
    rejectedTokens.add('fresh-1');

    await Promise.all([
      client.organization.listOrganization(),
      client.organization.listOrganization(),
      client.organization.listOrganization(),
    ]);

    expect(tokenCalls).toBe(2);
    expect(grpcAuth.filter((a) => a === 'Bearer fresh-1')).toHaveLength(4);
    expect(grpcAuth.filter((a) => a === 'Bearer fresh-2')).toHaveLength(3);
  });

  it('shares one token request between concurrent first calls', async () => {
    const { client } = makeClient();

    await Promise.all([
      client.organization.listOrganization(),
      client.organization.listOrganization(),
    ]);

    expect(tokenCalls).toBe(1);
    expect(grpcAuth).toEqual(['Bearer fresh-1', 'Bearer fresh-1']);
  });

  it('does not resend when the new token is the rejected one', async () => {
    tokenFixed = 'same';
    rejectedTokens.add('same');
    const { client } = makeClient();

    await expect(client.organization.listOrganization()).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );

    expect(tokenCalls).toBe(2);
    expect(grpcAuth).toEqual(['Bearer same']);
  });

  it('keeps the one-refresh limit across an Unavailable retry', async () => {
    const { client, core } = makeClient();
    const sleep = jest
      .spyOn(core as unknown as { sleep: () => Promise<void> }, 'sleep')
      .mockResolvedValue(undefined);
    script = ['unauthenticated', 'unavailable', 'unauthenticated'];

    await expect(client.organization.listOrganization()).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );

    expect(sleep).toHaveBeenCalledTimes(1);
    expect(tokenCalls).toBe(2);
    expect(grpcAuth).toEqual([
      'Bearer fresh-1',
      'Bearer fresh-2',
      'Bearer fresh-2',
    ]);
  });

  it('still retries Unavailable after a token refresh', async () => {
    const { client, core } = makeClient();
    jest
      .spyOn(core as unknown as { sleep: () => Promise<void> }, 'sleep')
      .mockResolvedValue(undefined);
    script = ['unauthenticated', 'unavailable', 'ok'];

    await client.organization.listOrganization();

    expect(tokenCalls).toBe(2);
    expect(grpcAuth).toHaveLength(3);
  });

  it('when the token endpoint fails, sends the call as earlier releases did and throws the token error', async () => {
    tokenStatus = 401;
    const { client } = makeClient();

    const error = await client.organization
      .listOrganization()
      .catch((e: unknown) => e);

    // As in earlier releases: the call goes out without a token, gets a 401,
    // and the token request that follows throws the axios error callers may
    // match on.
    expect(error).toBeInstanceOf(AxiosError);
    expect((error as AxiosError).response?.status).toBe(401);
    expect(tokenCalls).toBe(2);
    expect(grpcAuth).toEqual([null]);
  });

  it('keeps a still-valid token when renewing it fails', async () => {
    tokenExpiresIn = 60;
    const { client } = makeClient();
    await client.organization.listOrganization();

    // 5 s left: renewal is due, but the token endpoint is down.
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now + 55_000);
    tokenStatus = 503;
    await client.organization.listOrganization();

    expect(tokenCalls).toBe(2);
    expect(grpcAuth).toEqual(['Bearer fresh-1', 'Bearer fresh-1']);
  });

  it('resends with a token another call already fetched, with no extra token request', async () => {
    const { client, core } = makeClient();
    await client.organization.listOrganization();
    rejectedTokens.add('fresh-1');
    // While this call is in flight on fresh-1, another call replaces it.
    duringNextRequest = () => core.refreshAccessToken('fresh-1');

    await client.organization.listOrganization();

    expect(tokenCalls).toBe(2);
    expect(grpcAuth).toEqual([
      'Bearer fresh-1',
      'Bearer fresh-1',
      'Bearer fresh-2',
    ]);
  });

  it('shares one token request between a gRPC call and an HTTP call rejected on the same token', async () => {
    const { client, core } = makeClient();
    await client.organization.listOrganization();
    rejectedTokens.add('fresh-1');

    await Promise.all([
      client.organization.listOrganization(),
      core.withAccessToken(() => core.axios.get('/proxy/notes')),
    ]);

    expect(tokenCalls).toBe(2);
    expect(grpcAuth.slice(1)).toEqual(['Bearer fresh-1', 'Bearer fresh-2']);
    expect(proxyAuth).toEqual(['Bearer fresh-1', 'Bearer fresh-2']);
  });
});

describe('gRPC call when Scalekit is unreachable', () => {
  it('fails as a gRPC call, not with the up-front token request error', async () => {
    // A port nothing listens on, for both the gRPC call and the token request.
    const closed = http.createServer();
    await new Promise<void>((r) => closed.listen(0, '127.0.0.1', () => r()));
    const port = (closed.address() as AddressInfo).port;
    await new Promise<void>((r) => closed.close(() => r()));
    const client = new ScalekitClient(
      `http://127.0.0.1:${port}`,
      'client_id',
      'secret',
      { pingIntervalMs: 0 }
    );
    const core = (client as unknown as { coreClient: CoreClient }).coreClient;
    jest
      .spyOn(core as unknown as { sleep: () => Promise<void> }, 'sleep')
      .mockResolvedValue(undefined);

    const error = await client.organization
      .listOrganization()
      .catch((e: unknown) => e);

    // The same exception earlier releases threw (the call went out first
    // then). Under jest the transport reports the refused connection as
    // Internal; from the built SDK it is `ScalekitServiceUnavailableException`
    // after the Unavailable retries, before and after this change.
    expect(error).toBeInstanceOf(ScalekitServerException);
    expect(error).not.toBeInstanceOf(AxiosError);
  });
});

describe('connectExec with an HTTP call (axios 401)', () => {
  function unauthorized(): AxiosError {
    return new AxiosError('401', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 401,
      statusText: 'Unauthorized',
      data: {},
      headers: {},
      config: { headers: {} } as never,
    });
  }

  function makeCore(): CoreClient {
    return new CoreClient(tokenOrigin, 'client_id', 'secret');
  }

  it('fetches one new token and sends once more', async () => {
    const core = makeCore();
    const fn = jest
      .fn<(req: void) => Promise<string>>()
      .mockRejectedValueOnce(unauthorized())
      .mockResolvedValue('ok');

    await expect(core.connectExec(fn, undefined)).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(tokenCalls).toBe(2);
  });

  it('returns a second 401 without another token request', async () => {
    const core = makeCore();
    const fn = jest
      .fn<(req: void) => Promise<string>>()
      .mockRejectedValue(unauthorized());

    await expect(core.connectExec(fn, undefined)).rejects.toBeInstanceOf(
      ScalekitUnauthorizedException
    );
    expect(fn).toHaveBeenCalledTimes(2);
    expect(tokenCalls).toBe(2);
  });
});

describe('scalekitTokenErrors: a failed token request on a gRPC call', () => {
  // Fields an AxiosError carries that callers of earlier releases could read.
  function expectAxiosFields(error: unknown, status: number | undefined) {
    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).response?.status).toBe(status);
    expect((error as AxiosError).status).toBe(status);
    expect(typeof (error as AxiosError).code).toBe('string');
    expect((error as { cause?: unknown }).cause).toBeInstanceOf(AxiosError);
    // Non-enumerable, so logging the exception does not dump the response.
    expect(Object.keys(error as object)).not.toContain('response');
  }

  it('is off by default: the raw AxiosError, as before', () => {
    const { core } = makeClient();
    expect(core.scalekitTokenErrors).toBe(false);
  });

  it('on: a wrong secret throws ScalekitUnauthorizedException that keeps the axios fields and not the secret', async () => {
    tokenStatus = 401;
    const secret = 'sk-test-wrong-secret-7f3a';
    const { client } = makeClient({ scalekitTokenErrors: true, secret });

    const error = await client.organization
      .listOrganization()
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ScalekitUnauthorizedException);
    expect(error).toBeInstanceOf(ScalekitException);
    expect(error).not.toBeInstanceOf(AxiosError);
    expect((error as ScalekitServerException).httpStatus).toBe(401);
    expectAxiosFields(error, 401);
    expect(util.inspect(error, { showHidden: true, depth: 8 })).not.toContain(
      secret
    );
    // The call itself is unchanged: sent once, then one token request failed.
    expect(grpcAuth).toEqual([null]);
    expect(tokenCalls).toBe(2);
  });

  it('on: a token endpoint 503 during the refresh after a 401 throws a ScalekitServerException whose response has status 503', async () => {
    const { client } = makeClient({ scalekitTokenErrors: true });
    await client.organization.listOrganization();
    rejectedTokens.add('fresh-1');
    tokenStatus = 503;

    const error = await client.organization
      .listOrganization()
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ScalekitServerException);
    // httpStatus is not asserted: ScalekitServerException maps a multi-word
    // status text ("Service Unavailable") to 500, as on main.
    expectAxiosFields(error, 503);
  });

  it('on: an unreachable token endpoint during the refresh throws a ScalekitException with the network error code', async () => {
    const { client, core } = makeClient({ scalekitTokenErrors: true });
    await client.organization.listOrganization();
    rejectedTokens.add('fresh-1');
    const closed = http.createServer();
    await new Promise<void>((r) => closed.listen(0, '127.0.0.1', () => r()));
    const port = (closed.address() as AddressInfo).port;
    await new Promise<void>((r) => closed.close(() => r()));
    core.axios.defaults.baseURL = `http://127.0.0.1:${port}`;

    const error = await client.organization
      .listOrganization()
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ScalekitException);
    expect(error).not.toBeInstanceOf(AxiosError);
    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).code).toBe('ECONNREFUSED');
    expect((error as AxiosError).response).toBeUndefined();
  });

  it('off: the same unreachable token endpoint still throws the raw AxiosError', async () => {
    const { client, core } = makeClient();
    await client.organization.listOrganization();
    rejectedTokens.add('fresh-1');
    const closed = http.createServer();
    await new Promise<void>((r) => closed.listen(0, '127.0.0.1', () => r()));
    const port = (closed.address() as AddressInfo).port;
    await new Promise<void>((r) => closed.close(() => r()));
    core.axios.defaults.baseURL = `http://127.0.0.1:${port}`;

    const error = await client.organization
      .listOrganization()
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AxiosError);
    expect((error as AxiosError).code).toBe('ECONNREFUSED');
  });

  it('does not change the HTTP path: actions-style calls through withAccessToken already throw a ScalekitException', async () => {
    tokenStatus = 401;
    const { core } = makeClient();

    const error = await core
      .withAccessToken(() => core.axios.get('/proxy/notes'))
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ScalekitUnauthorizedException);
    expect(axios.isAxiosError(error)).toBe(false);
  });
});
