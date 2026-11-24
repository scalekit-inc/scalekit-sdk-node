/**
 * `actions.invokeToolCollection` and `actions.getToolCollectionRun`: the tool collection run
 * methods, called directly on the AgentKit client (`scalekit.actions.<method>`). They delegate to
 * `actions.providers`, which keeps the same methods, so validation, errors and the
 * no-replay-after-Unavailable rule live in one place.
 *
 * Offline tests, so no environment is needed: the real `ActionsClient` reaches mocked RPC methods
 * through the real `ProvidersClient` it holds.
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
import { timestampFromDate } from '@bufbuild/protobuf/wkt';
import ActionsClient from '../src/actions';
import CoreClient from '../src/core';
import ProvidersClient from '../src/providers';
import ScalekitClient from '../src/scalekit';
import * as sdk from '../src/index';
import type { ToolCollectionRun } from '../src/index';
import {
  ScalekitBadRequestException,
  ScalekitConflictException,
  ScalekitNotFoundException,
  ScalekitServiceUnavailableException,
  ScalekitValidationError,
} from '../src/errors';
import { ErrorInfoSchema } from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import {
  GetToolCollectionRunRequestSchema,
  ToolCollectionRunSchema,
  TriggerToolCollectionRequestSchema,
} from '../src/pkg/grpc/scalekit/v1/providers/providers_pb';

const PROVIDER = 'ACMEAPI:1234';

const created = new Date('2026-11-10T10:00:00Z');
const finished = new Date('2026-11-10T10:00:42Z');

let sleep: jest.SpiedFunction<any>;

beforeEach(() => {
  // `connectExec` backs off for about a second before it replays a call: do not wait for it.
  sleep = jest
    .spyOn(CoreClient.prototype as any, 'sleep')
    .mockResolvedValue(undefined as never);
});

afterEach(() => {
  jest.restoreAllMocks();
});

function run(overrides: Record<string, unknown> = {}) {
  return create(ToolCollectionRunSchema, {
    runId: 'tcr_1',
    providerIdentifier: PROVIDER,
    status: 'QUEUED',
    createdAt: timestampFromDate(created),
    ...overrides,
  });
}

function setup() {
  const rpc = {
    triggerToolCollection: jest.fn(async (_r: any, _o?: any) => run()),
    getToolCollectionRun: jest.fn(async (_r: any, _o?: any) => run()),
  };
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const providers = new ProvidersClient(
    { createClient: () => rpc } as any,
    coreClient
  );
  const actions = new ActionsClient(
    {} as any,
    {} as any,
    coreClient,
    {} as any,
    {} as any,
    providers
  );
  return { rpc, actions, providers };
}

const connectError = (code: Code, message: string, errorCode: string) =>
  new ConnectError(message, code, undefined, [
    { desc: ErrorInfoSchema, value: { errorCode } },
  ]);

/** Params that must be refused before anything is sent. */
const badParams: unknown[][] = [
  [undefined],
  [null],
  ['ACMEAPI:1234'],
  [{}],
  [{ providerIdentifier: undefined }],
  [{ providerIdentifier: null }],
  [{ providerIdentifier: '' }],
  [{ providerIdentifier: '   ' }],
  [{ providerIdentifier: '\n\t' }],
  [{ providerIdentifier: 1234 }],
];

describe('actions.invokeToolCollection', () => {
  it('sends the connector identifier, with no per-call options, and returns the queued run', async () => {
    const { rpc, actions } = setup();

    const queued = await actions.invokeToolCollection({
      providerIdentifier: PROVIDER,
    });

    expect(rpc.triggerToolCollection).toHaveBeenCalledTimes(1);
    const [request, options] = rpc.triggerToolCollection.mock.calls[0];
    expect(request).toEqual(
      create(TriggerToolCollectionRequestSchema, {
        providerIdentifier: PROVIDER,
      })
    );
    // No special deadline: the call uses the client's default like every other call.
    expect(options).toBeUndefined();
    expect(queued.runId).toBe('tcr_1');
    expect(queued.providerIdentifier).toBe(PROVIDER);
    expect(queued.status).toBe(sdk.ToolCollectionRunStatus.QUEUED);
    expect(queued.skippedTools).toEqual([]);
    expect(queued).not.toHaveProperty('$typeName');
  });

  it('sends the identifier without the whitespace around it', async () => {
    const { rpc, actions } = setup();

    await actions.invokeToolCollection({
      providerIdentifier: `  ${PROVIDER}\n`,
    });

    expect(rpc.triggerToolCollection.mock.calls[0][0]).toEqual(
      create(TriggerToolCollectionRequestSchema, {
        providerIdentifier: PROVIDER,
      })
    );
  });

  it('delegates to actions.providers.invokeToolCollection and returns its result as it is', async () => {
    const { actions, providers } = setup();
    const result = { runId: 'tcr_9', skippedTools: [] } as any;
    const delegate = jest
      .spyOn(providers, 'invokeToolCollection')
      .mockResolvedValueOnce(result);

    await expect(
      actions.invokeToolCollection({ providerIdentifier: PROVIDER })
    ).resolves.toBe(result);

    expect(delegate).toHaveBeenCalledTimes(1);
    expect(delegate).toHaveBeenCalledWith(PROVIDER);
  });

  it('lets an error from actions.providers.invokeToolCollection through unchanged', async () => {
    const { actions, providers } = setup();
    const failure = new Error('boom');
    jest
      .spyOn(providers, 'invokeToolCollection')
      .mockRejectedValueOnce(failure);

    await expect(
      actions.invokeToolCollection({ providerIdentifier: PROVIDER })
    ).rejects.toBe(failure);
  });

  const failures: Array<[string, ConnectError, any, number, string]> = [
    [
      'a run already in progress',
      connectError(
        Code.AlreadyExists,
        'an ingestion run is already in progress for this connector',
        'RESOURCE_ALREADY_EXISTS'
      ),
      ScalekitConflictException,
      409,
      'RESOURCE_ALREADY_EXISTS',
    ],
    [
      'an unknown connector',
      connectError(Code.NotFound, 'provider not found', 'NOT_FOUND'),
      ScalekitNotFoundException,
      404,
      'NOT_FOUND',
    ],
    [
      'a connector that was not created from a spec',
      connectError(
        Code.InvalidArgument,
        'this connector is not sourced from an OpenAPI spec',
        'INVALID_ARGUMENT'
      ),
      ScalekitBadRequestException,
      400,
      'INVALID_ARGUMENT',
    ],
  ];

  it.each(failures)(
    'raises the same exception as actions.providers for %s',
    async (_name, failure, ErrorClass, httpStatus, errorCode) => {
      const { rpc, actions, providers } = setup();
      rpc.triggerToolCollection.mockRejectedValue(failure);

      const viaActions = await actions
        .invokeToolCollection({ providerIdentifier: PROVIDER })
        .catch((e) => e);
      const viaProviders = await providers
        .invokeToolCollection(PROVIDER)
        .catch((e) => e);

      expect(viaActions).toBeInstanceOf(ErrorClass);
      expect(viaActions.httpStatus).toBe(httpStatus);
      expect(viaActions.message).toBe(viaProviders.message);
      expect(viaActions.errorCode).toBe(errorCode);
      expect(viaActions.errorCode).toBe(viaProviders.errorCode);
    }
  );

  it.each(badParams)('refuses %p and sends nothing', async (params) => {
    const { rpc, actions } = setup();

    const error = await actions
      .invokeToolCollection(params as any)
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitValidationError);
    expect(error.message).toContain('providerIdentifier is required');
    expect(rpc.triggerToolCollection).not.toHaveBeenCalled();
  });

  it('is not sent again after Unavailable', async () => {
    const { rpc, actions } = setup();
    rpc.triggerToolCollection.mockRejectedValue(
      new ConnectError('upstream connect error', Code.Unavailable)
    );

    const error = await actions
      .invokeToolCollection({ providerIdentifier: PROVIDER })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitServiceUnavailableException);
    expect(error.httpStatus).toBe(503);
    expect(rpc.triggerToolCollection).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });
});

describe('actions.getToolCollectionRun', () => {
  it('asks for the latest run when no run id is given, with no per-call options', async () => {
    const { rpc, actions } = setup();

    await actions.getToolCollectionRun({ providerIdentifier: PROVIDER });

    expect(rpc.getToolCollectionRun).toHaveBeenCalledTimes(1);
    const [request, options] = rpc.getToolCollectionRun.mock.calls[0];
    expect(request).toEqual(
      create(GetToolCollectionRunRequestSchema, {
        providerIdentifier: PROVIDER,
        runId: 'latest',
      })
    );
    expect(options).toBeUndefined();
  });

  it.each([
    [undefined],
    [null],
    [''],
    ['   '],
    ['\n\t'],
    ['latest'],
    [' latest '],
  ])('asks for the latest run for runId %p', async (runId) => {
    const { rpc, actions } = setup();

    await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
      runId: runId as any,
    });

    expect(rpc.getToolCollectionRun.mock.calls[0][0]).toEqual(
      create(GetToolCollectionRunRequestSchema, {
        providerIdentifier: PROVIDER,
        runId: 'latest',
      })
    );
  });

  it('sends an explicit run id and the identifier without the whitespace around them', async () => {
    const { rpc, actions } = setup();

    await actions.getToolCollectionRun({
      providerIdentifier: ` ${PROVIDER}\n`,
      runId: ' tcr_77\n',
    });

    expect(rpc.getToolCollectionRun.mock.calls[0][0]).toEqual(
      create(GetToolCollectionRunRequestSchema, {
        providerIdentifier: PROVIDER,
        runId: 'tcr_77',
      })
    );
  });

  it('delegates to actions.providers.getToolCollectionRun and returns its result as it is', async () => {
    const { actions, providers } = setup();
    const result = { runId: 'tcr_9', skippedTools: [] } as any;
    const delegate = jest
      .spyOn(providers, 'getToolCollectionRun')
      .mockResolvedValue(result);

    await expect(
      actions.getToolCollectionRun({
        providerIdentifier: PROVIDER,
        runId: 'tcr_77',
      })
    ).resolves.toBe(result);
    await actions.getToolCollectionRun({ providerIdentifier: PROVIDER });

    expect(delegate.mock.calls).toEqual([
      [PROVIDER, 'tcr_77'],
      [PROVIDER, undefined],
    ]);
  });

  it('returns the counters, timestamps and parsed skipped operations of a finished run', async () => {
    const { rpc, actions, providers } = setup();
    rpc.getToolCollectionRun.mockResolvedValue(
      run({
        status: 'COMPLETED',
        totalEndpoints: 14,
        toolsCreated: 10,
        toolsUpdated: 2,
        toolsDeleted: 1,
        skippedToolsJson: JSON.stringify([
          {
            operation_id: 'uploadAvatar',
            method: 'POST',
            path: '/users/{id}/avatar',
            reason: 'request body has no application/json representation',
          },
        ]),
        startedAt: timestampFromDate(created),
        finishedAt: timestampFromDate(finished),
      })
    );

    const viaActions = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
    });

    expect(viaActions.status).toBe(sdk.ToolCollectionRunStatus.COMPLETED);
    expect(viaActions.toolsCreated).toBe(10);
    expect(viaActions.finishedAt?.seconds).toBe(
      BigInt(finished.getTime() / 1000)
    );
    expect(viaActions.skippedTools).toEqual([
      {
        operationId: 'uploadAvatar',
        method: 'POST',
        path: '/users/{id}/avatar',
        reason: 'request body has no application/json representation',
      },
    ]);
    expect(viaActions).toEqual(await providers.getToolCollectionRun(PROVIDER));
  });

  it('lets an error from actions.providers.getToolCollectionRun through unchanged', async () => {
    const { actions, providers } = setup();
    const failure = new Error('boom');
    jest
      .spyOn(providers, 'getToolCollectionRun')
      .mockRejectedValueOnce(failure);

    await expect(
      actions.getToolCollectionRun({ providerIdentifier: PROVIDER })
    ).rejects.toBe(failure);
  });

  const failures: Array<[string, ConnectError, any, number, string]> = [
    [
      'a connector without a run',
      connectError(Code.NotFound, 'tool collection run not found', 'NOT_FOUND'),
      ScalekitNotFoundException,
      404,
      'NOT_FOUND',
    ],
    [
      'a malformed run id',
      connectError(Code.InvalidArgument, 'invalid run_id', 'INVALID_ARGUMENT'),
      ScalekitBadRequestException,
      400,
      'INVALID_ARGUMENT',
    ],
  ];

  it.each(failures)(
    'raises the same exception as actions.providers for %s',
    async (_name, failure, ErrorClass, httpStatus, errorCode) => {
      const { rpc, actions, providers } = setup();
      rpc.getToolCollectionRun.mockRejectedValue(failure);

      const viaActions = await actions
        .getToolCollectionRun({ providerIdentifier: PROVIDER, runId: 'nope' })
        .catch((e) => e);
      const viaProviders = await providers
        .getToolCollectionRun(PROVIDER, 'nope')
        .catch((e) => e);

      expect(viaActions).toBeInstanceOf(ErrorClass);
      expect(viaActions.httpStatus).toBe(httpStatus);
      expect(viaActions.message).toBe(viaProviders.message);
      expect(viaActions.errorCode).toBe(errorCode);
      expect(viaActions.errorCode).toBe(viaProviders.errorCode);
    }
  );

  it.each(badParams)('refuses %p and sends nothing', async (params) => {
    const { rpc, actions } = setup();

    const error = await actions
      .getToolCollectionRun(params as any)
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitValidationError);
    expect(error.message).toContain('providerIdentifier is required');
    expect(rpc.getToolCollectionRun).not.toHaveBeenCalled();
  });

  it.each([[77], [{}], [['tcr_1']], [true]])(
    'refuses the run id %p, which is not a string, and sends nothing',
    async (runId) => {
      const { rpc, actions } = setup();

      await expect(
        actions.getToolCollectionRun({
          providerIdentifier: PROVIDER,
          runId: runId as any,
        })
      ).rejects.toBeInstanceOf(ScalekitValidationError);
      expect(rpc.getToolCollectionRun).not.toHaveBeenCalled();
    }
  );

  it('is sent again after Unavailable, as a read is', async () => {
    const { rpc, actions } = setup();
    rpc.getToolCollectionRun.mockRejectedValueOnce(
      new ConnectError('upstream connect error', Code.Unavailable)
    );

    await expect(
      actions.getToolCollectionRun({ providerIdentifier: PROVIDER })
    ).resolves.toMatchObject({ runId: 'tcr_1' });

    expect(rpc.getToolCollectionRun).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });
});

describe('the same operations through actions.providers', () => {
  it('still work and send the same requests', async () => {
    const { rpc, actions } = setup();

    expect(actions.providers).toBeInstanceOf(ProvidersClient);
    await actions.providers.invokeToolCollection(PROVIDER);
    await actions.invokeToolCollection({ providerIdentifier: PROVIDER });
    await actions.providers.getToolCollectionRun(PROVIDER);
    await actions.getToolCollectionRun({ providerIdentifier: PROVIDER });
    await actions.providers.getToolCollectionRun(PROVIDER, 'tcr_77');
    await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
      runId: 'tcr_77',
    });

    const triggered = rpc.triggerToolCollection.mock.calls;
    expect(triggered).toHaveLength(2);
    expect(triggered[0][0]).toEqual(triggered[1][0]);
    const read = rpc.getToolCollectionRun.mock.calls;
    expect(read).toHaveLength(4);
    expect(read[0][0]).toEqual(read[1][0]);
    expect(read[2][0]).toEqual(read[3][0]);
    expect(read[0][0].runId).toBe('latest');
    expect(read[2][0].runId).toBe('tcr_77');
  });
});

describe('scalekit.actions', () => {
  it('has the tool collection methods and deleteCustomTool directly on the AgentKit client', () => {
    const scalekit = new ScalekitClient(
      'https://test.scalekit.dev',
      'client_id',
      'client_secret'
    );

    expect(typeof scalekit.actions.invokeToolCollection).toBe('function');
    expect(typeof scalekit.actions.getToolCollectionRun).toBe('function');
    expect(typeof scalekit.actions.deleteCustomTool).toBe('function');
    // The providers form stays.
    expect(typeof scalekit.actions.providers.invokeToolCollection).toBe(
      'function'
    );
    expect(typeof scalekit.actions.providers.getToolCollectionRun).toBe(
      'function'
    );
  });

  it('is typed: it returns the exported ToolCollectionRun, and the params are checked at compile time', async () => {
    const { actions } = setup();

    const queued: ToolCollectionRun = await actions.invokeToolCollection({
      providerIdentifier: PROVIDER,
    });
    const latest: ToolCollectionRun = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
      runId: 'latest',
    });
    expect(queued.status).toBe(sdk.ToolCollectionRunStatus.QUEUED);
    expect(latest.runId).toBe('tcr_1');

    // These are never called. The file fails to compile if one of the errors expected below goes
    // away: the params object and `providerIdentifier` are required, `runId` is optional.
    const compileChecks = [
      // @ts-expect-error providerIdentifier is required
      () => actions.invokeToolCollection({}),
      // @ts-expect-error the params object is required
      () => actions.getToolCollectionRun(),
      () => actions.getToolCollectionRun({ providerIdentifier: PROVIDER }),
    ];
    expect(compileChecks).toHaveLength(3);
  });
});
