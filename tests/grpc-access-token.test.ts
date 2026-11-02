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
import { AxiosError } from 'axios';
import ScalekitClient from '../src/scalekit';
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
    listOrganization(_req, ctx) {
      const auth = ctx.requestHeader.get('authorization');
      grpcAuth.push(auth);
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
});

afterEach(() => {
  jest.restoreAllMocks();
});

function makeClient(): { client: ScalekitClient; core: CoreClient } {
  const client = new ScalekitClient(grpcOrigin, 'client_id', 'secret', {
    pingIntervalMs: 0,
  });
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

  it('sends nothing when the token request fails, and throws the same error as before', async () => {
    tokenStatus = 401;
    const { client } = makeClient();

    const error = await client.organization
      .listOrganization()
      .catch((e: unknown) => e);

    // Unchanged from earlier releases (the token request failed after the
    // first call's 401 then): callers may match on the axios error.
    expect(error).toBeInstanceOf(AxiosError);
    expect((error as AxiosError).response?.status).toBe(401);
    expect(tokenCalls).toBe(1);
    expect(grpcAuth).toEqual([]);
  });
});
