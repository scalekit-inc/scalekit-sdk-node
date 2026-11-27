/**
 * `actions.invokeToolCollection` and `actions.getToolCollectionRun`: queue and follow the tool
 * collection runs of a connector created from an OpenAPI spec. Like `actions.deleteCustomTool`,
 * they exist only on the AgentKit client (`scalekit.actions.<method>`): each validates its params
 * inline and calls the generated service client through `coreClient.connectExec` itself.
 *
 * Offline tests, so no environment is needed: the real `ActionsClient` reaches mocked RPC methods.
 */
import { afterEach, describe, it, expect, jest } from '@jest/globals';
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
  ScalekitValidationError,
} from '../src/errors';
import { ErrorInfoSchema } from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import {
  GetToolCollectionRunRequestSchema,
  ToolCollectionRunSchema,
  TriggerToolCollectionRequestSchema,
} from '../src/pkg/grpc/scalekit/v1/providers/providers_pb';

const PROVIDER = 'ACMEAPI:70219645518265104';
const RUN_ID = 'tcr_153432495495315592';

const created = new Date('2026-11-10T10:00:00Z');

afterEach(() => {
  jest.restoreAllMocks();
});

function run(overrides: Record<string, unknown> = {}) {
  return create(ToolCollectionRunSchema, {
    runId: RUN_ID,
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
  const connectExec = jest.spyOn(coreClient, 'connectExec');
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
  return { rpc, actions, connectExec };
}

const connectError = (code: Code, message: string, errorCode: string) =>
  new ConnectError(message, code, undefined, [
    { desc: ErrorInfoSchema, value: { errorCode } },
  ]);

/** Params that must be refused before anything is sent. */
const badParams: unknown[][] = [
  [undefined],
  [null],
  [PROVIDER],
  [{}],
  [{ providerIdentifier: undefined }],
  [{ providerIdentifier: null }],
  [{ providerIdentifier: '' }],
  [{ providerIdentifier: '   ' }],
  [{ providerIdentifier: '\n\t' }],
  [{ providerIdentifier: 70219645518265104 }],
  [{ providerIdentifier: [PROVIDER] }],
  [{ providerIdentifier: { identifier: PROVIDER } }],
];

describe('actions.invokeToolCollection', () => {
  it('sends the connector identifier and returns the queued run', async () => {
    const { rpc, actions } = setup();

    const queued = await actions.invokeToolCollection({
      providerIdentifier: PROVIDER,
    });

    expect(rpc.triggerToolCollection).toHaveBeenCalledTimes(1);
    expect(rpc.getToolCollectionRun).not.toHaveBeenCalled();
    expect(rpc.triggerToolCollection.mock.calls[0][0]).toEqual(
      create(TriggerToolCollectionRequestSchema, {
        providerIdentifier: PROVIDER,
      })
    );
    expect(queued.runId).toBe(RUN_ID);
    expect(queued.providerIdentifier).toBe(PROVIDER);
    expect(queued.status).toBe(sdk.ToolCollectionRunStatus.QUEUED);
    expect(queued.skippedTools).toEqual([]);
    expect(queued.startedAt).toBeUndefined();
    expect(queued.finishedAt).toBeUndefined();
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

  it('calls connectExec with the service method and the request, and nothing else', async () => {
    const { rpc, actions, connectExec } = setup();

    await actions.invokeToolCollection({ providerIdentifier: PROVIDER });

    expect(connectExec).toHaveBeenCalledTimes(1);
    const args = connectExec.mock.calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toBe(rpc.triggerToolCollection);
    expect(args[1]).toEqual(
      create(TriggerToolCollectionRequestSchema, {
        providerIdentifier: PROVIDER,
      })
    );
    // The service method gets the request and no per-call options.
    expect(rpc.triggerToolCollection.mock.calls[0][1]).toBeUndefined();
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
    [
      'OpenAPI-sourced connectors that are not enabled',
      connectError(
        Code.InvalidArgument,
        'OpenAPI-sourced connectors are not enabled for this environment',
        'FEATURE_NOT_ENABLED'
      ),
      ScalekitBadRequestException,
      400,
      'FEATURE_NOT_ENABLED',
    ],
  ];

  it.each(failures)(
    'raises the SDK exception for %s',
    async (_name, failure, ErrorClass, httpStatus, errorCode) => {
      const { rpc, actions } = setup();
      rpc.triggerToolCollection.mockRejectedValueOnce(failure);

      const error = await actions
        .invokeToolCollection({ providerIdentifier: PROVIDER })
        .catch((e) => e);

      expect(error).toBeInstanceOf(ErrorClass);
      expect(error.httpStatus).toBe(httpStatus);
      expect(error.errorCode).toBe(errorCode);
      expect(error.message).toContain(failure.rawMessage);
    }
  );

  it.each(badParams)('refuses %p and sends nothing', async (params) => {
    const { rpc, actions, connectExec } = setup();

    const error = await actions
      .invokeToolCollection(params as any)
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitValidationError);
    expect(error.message).toContain('providerIdentifier is required');
    expect(connectExec).not.toHaveBeenCalled();
    expect(rpc.triggerToolCollection).not.toHaveBeenCalled();
  });
});

describe('actions.getToolCollectionRun', () => {
  it('asks for the latest run when no run id is given', async () => {
    const { rpc, actions } = setup();

    const latest = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
    });

    expect(rpc.getToolCollectionRun).toHaveBeenCalledTimes(1);
    expect(rpc.triggerToolCollection).not.toHaveBeenCalled();
    expect(rpc.getToolCollectionRun.mock.calls[0][0]).toEqual(
      create(GetToolCollectionRunRequestSchema, {
        providerIdentifier: PROVIDER,
        runId: 'latest',
      })
    );
    expect(latest.runId).toBe(RUN_ID);
    expect(latest.providerIdentifier).toBe(PROVIDER);
    expect(latest).not.toHaveProperty('$typeName');
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
      runId: ` ${RUN_ID}\n`,
    });

    expect(rpc.getToolCollectionRun.mock.calls[0][0]).toEqual(
      create(GetToolCollectionRunRequestSchema, {
        providerIdentifier: PROVIDER,
        runId: RUN_ID,
      })
    );
  });

  it('calls connectExec with the service method and the request, and nothing else', async () => {
    const { rpc, actions, connectExec } = setup();

    await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
      runId: RUN_ID,
    });

    expect(connectExec).toHaveBeenCalledTimes(1);
    const args = connectExec.mock.calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toBe(rpc.getToolCollectionRun);
    expect(args[1]).toEqual(
      create(GetToolCollectionRunRequestSchema, {
        providerIdentifier: PROVIDER,
        runId: RUN_ID,
      })
    );
    // The service method gets the request and no per-call options.
    expect(rpc.getToolCollectionRun.mock.calls[0][1]).toBeUndefined();
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
      'an unknown connector',
      connectError(Code.NotFound, 'provider not found', 'NOT_FOUND'),
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
    'raises the SDK exception for %s',
    async (_name, failure, ErrorClass, httpStatus, errorCode) => {
      const { rpc, actions } = setup();
      rpc.getToolCollectionRun.mockRejectedValueOnce(failure);

      const error = await actions
        .getToolCollectionRun({ providerIdentifier: PROVIDER, runId: 'nope' })
        .catch((e) => e);

      expect(error).toBeInstanceOf(ErrorClass);
      expect(error.httpStatus).toBe(httpStatus);
      expect(error.errorCode).toBe(errorCode);
      expect(error.message).toContain(failure.rawMessage);
    }
  );

  it.each(badParams)('refuses %p and sends nothing', async (params) => {
    const { rpc, actions, connectExec } = setup();

    const error = await actions
      .getToolCollectionRun(params as any)
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitValidationError);
    expect(error.message).toContain('providerIdentifier is required');
    expect(connectExec).not.toHaveBeenCalled();
    expect(rpc.getToolCollectionRun).not.toHaveBeenCalled();
  });

  it.each([[77], [{}], [[RUN_ID]], [true]])(
    'refuses the run id %p, which is not a string, and sends nothing',
    async (runId) => {
      const { rpc, actions, connectExec } = setup();

      const error = await actions
        .getToolCollectionRun({
          providerIdentifier: PROVIDER,
          runId: runId as any,
        })
        .catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitValidationError);
      expect(error.message).toContain('runId must be a string');
      expect(connectExec).not.toHaveBeenCalled();
      expect(rpc.getToolCollectionRun).not.toHaveBeenCalled();
    }
  );
});

describe('scalekit.actions', () => {
  const scalekit = () =>
    new ScalekitClient(
      'https://test.scalekit.dev',
      'client_id',
      'client_secret'
    );

  it('has the tool collection methods and deleteCustomTool directly on the AgentKit client', () => {
    const { actions } = scalekit();

    expect(typeof actions.invokeToolCollection).toBe('function');
    expect(typeof actions.getToolCollectionRun).toBe('function');
    expect(typeof actions.deleteCustomTool).toBe('function');
    expect(typeof ActionsClient.prototype.invokeToolCollection).toBe(
      'function'
    );
    expect(typeof ActionsClient.prototype.getToolCollectionRun).toBe(
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
    expect(latest.runId).toBe(RUN_ID);

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
