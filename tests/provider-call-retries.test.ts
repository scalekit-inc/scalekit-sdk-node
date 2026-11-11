/**
 * Which provider calls `CoreClient.connectExec` may replay after `Unavailable`.
 *
 * `connectExec` replays a call that answers `Unavailable`, which is safe for a read.
 * It is not safe for `triggerToolCollection` or for a create from an OpenAPI spec:
 * their first attempt may have worked even though the response was lost. Those two
 * calls surface `ScalekitServiceUnavailableException` at once. The `Unauthenticated`
 * token refresh and every other call are unchanged.
 *
 * Offline tests: the gRPC client is mocked, so no environment is needed.
 */
import {
  afterEach,
  beforeEach,
  describe,
  it,
  expect,
  jest,
} from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import { create } from '@bufbuild/protobuf';
import ProvidersClient from '../src/providers';
import CoreClient from '../src/core';
import {
  ScalekitConflictException,
  ScalekitNotFoundException,
  ScalekitServiceUnavailableException,
} from '../src/errors';
import {
  ProviderSchema,
  ToolCollectionRunSchema,
} from '../src/pkg/grpc/scalekit/v1/providers/providers_pb';

const SPEC_URL = 'https://api.example.com/openapi.json';

const unavailable = () =>
  new ConnectError('upstream connect error', Code.Unavailable);
const unauthenticated = () =>
  new ConnectError('token expired', Code.Unauthenticated);

const queuedRun = () =>
  create(ToolCollectionRunSchema, {
    runId: 'tcr_1',
    providerIdentifier: 'ACMEAPI:1234',
    status: 'QUEUED',
  });

const provider = () =>
  create(ProviderSchema, {
    id: 'prvd_1',
    identifier: 'ACMEAPI:1234',
    displayName: 'Acme API',
    isCustom: true,
  });

const bearer = {
  type: 'BEARER',
  display_name: 'Bearer Token',
  fields: [{ field_name: 'token', label: 'Token', input_type: 'password' }],
};

let sleep: jest.SpiedFunction<any>;
let authenticate: jest.SpiedFunction<any>;

beforeEach(() => {
  // `connectExec` backs off for about a second before it replays: do not wait for it.
  sleep = jest
    .spyOn(CoreClient.prototype as any, 'sleep')
    .mockResolvedValue(undefined as never);
  authenticate = jest
    .spyOn(CoreClient.prototype as any, 'authenticateClient')
    .mockResolvedValue(undefined as never);
});

afterEach(() => {
  jest.restoreAllMocks();
});

function setup(rpc: Record<string, jest.Mock>) {
  const core = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const client = new ProvidersClient({ createClient: () => rpc } as any, core);
  return client;
}

/** An rpc mock that answers with each outcome in turn: an Error is thrown, anything else is returned. */
const outcomes = (...list: unknown[]) => {
  const fn = jest.fn(async (_request: any) => {
    const next = list.length > 1 ? list.shift() : list[0];
    if (next instanceof Error) throw next;
    return next;
  });
  return fn;
};

describe('triggerToolCollection is not replayed after Unavailable', () => {
  it('raises ScalekitServiceUnavailableException after one attempt, without a backoff', async () => {
    const trigger = outcomes(unavailable());
    const client = setup({ triggerToolCollection: trigger });

    const error = await client
      .triggerToolCollection('ACMEAPI:1234')
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitServiceUnavailableException);
    expect(error.httpStatus).toBe(503);
    expect(trigger).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('raises the same exception type as a read that runs out of retries', async () => {
    const reads = outcomes(unavailable());
    const reader = setup({ getToolCollectionRun: reads });

    const readError = await reader
      .getToolCollectionRun('ACMEAPI:1234')
      .catch((e) => e);
    const triggerError = await setup({
      triggerToolCollection: outcomes(unavailable()),
    })
      .triggerToolCollection('ACMEAPI:1234')
      .catch((e) => e);

    expect(readError).toBeInstanceOf(ScalekitServiceUnavailableException);
    expect(triggerError).toBeInstanceOf(ScalekitServiceUnavailableException);
    expect(triggerError.grpcStatus).toBe(readError.grpcStatus);
    expect(triggerError.httpStatus).toBe(readError.httpStatus);
  });

  it('still refreshes the token and sends the call again after Unauthenticated', async () => {
    const trigger = outcomes(unauthenticated(), queuedRun());
    const client = setup({ triggerToolCollection: trigger });

    const run = await client.triggerToolCollection('ACMEAPI:1234');

    expect(run.runId).toBe('tcr_1');
    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveBeenCalledTimes(2);
  });

  it('does not replay an Unavailable that follows the token refresh either', async () => {
    const trigger = outcomes(unauthenticated(), unavailable());
    const client = setup({ triggerToolCollection: trigger });

    await expect(
      client.triggerToolCollection('ACMEAPI:1234')
    ).rejects.toBeInstanceOf(ScalekitServiceUnavailableException);

    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveBeenCalledTimes(2);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('passes every other error through unchanged', async () => {
    const conflict = new ConnectError(
      'a run is in progress',
      Code.AlreadyExists
    );
    const missing = new ConnectError('provider not found', Code.NotFound);

    await expect(
      setup({
        triggerToolCollection: outcomes(conflict),
      }).triggerToolCollection('X:1')
    ).rejects.toBeInstanceOf(ScalekitConflictException);
    await expect(
      setup({ triggerToolCollection: outcomes(missing) }).triggerToolCollection(
        'X:1'
      )
    ).rejects.toBeInstanceOf(ScalekitNotFoundException);
  });
});

describe('createCustomProvider is not replayed after Unavailable when it fetches a spec', () => {
  it('raises ScalekitServiceUnavailableException after one attempt with openapiSpecUrl', async () => {
    const createCall = outcomes(unavailable());
    const client = setup({ createCustomProvider: createCall });

    await expect(
      client.createCustomProvider({
        displayName: 'Acme API',
        openapiSpecUrl: SPEC_URL,
        authPatterns: [bearer as any],
      })
    ).rejects.toBeInstanceOf(ScalekitServiceUnavailableException);

    expect(createCall).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('still replays after Unavailable for an MCP connector created from proxyUrl', async () => {
    const createCall = outcomes(unavailable(), { provider: provider() });
    const client = setup({ createCustomProvider: createCall });

    const { provider: created } = await client.createCustomProvider({
      displayName: 'Acme MCP',
      proxyUrl: 'https://mcp.example.com',
      authPatterns: [bearer as any],
    });

    expect(created?.identifier).toBe('ACMEAPI:1234');
    expect(createCall).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('still refreshes the token and sends the call again after Unauthenticated', async () => {
    const createCall = outcomes(unauthenticated(), { provider: provider() });
    const client = setup({ createCustomProvider: createCall });

    await client.createCustomProvider({
      displayName: 'Acme API',
      openapiSpecUrl: SPEC_URL,
      authPatterns: [bearer as any],
    });

    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(createCall).toHaveBeenCalledTimes(2);
  });
});

describe('the other provider calls keep their retry after Unavailable', () => {
  it('replays getToolCollectionRun', async () => {
    const read = outcomes(unavailable(), queuedRun());
    const client = setup({ getToolCollectionRun: read });

    const run = await client.getToolCollectionRun('ACMEAPI:1234');

    expect(run.runId).toBe('tcr_1');
    expect(read).toHaveBeenCalledTimes(2);
  });

  it('replays updateCustomProvider, even with openapiSpecUrl', async () => {
    const update = outcomes(unavailable(), { provider: provider() });
    const client = setup({ updateCustomProvider: update });

    await client.updateCustomProvider({
      identifier: 'ACMEAPI:1234',
      displayName: 'Acme API',
      openapiSpecUrl: SPEC_URL,
      authPatterns: [bearer as any],
    });

    expect(update).toHaveBeenCalledTimes(2);
  });

  it('replays listProviders and deleteCustomProvider', async () => {
    const list = outcomes(unavailable(), { providers: [], totalSize: 0 });
    const remove = outcomes(unavailable(), {});
    const client = setup({ listProviders: list, deleteCustomProvider: remove });

    await client.listProviders({});
    await client.deleteCustomProvider('ACMEAPI:1234');

    expect(list).toHaveBeenCalledTimes(2);
    expect(remove).toHaveBeenCalledTimes(2);
  });
});
