/**
 * The tool collection run that `actions.invokeToolCollection` and `actions.getToolCollectionRun`
 * return: how the API's response is converted (every field, the typed status, the parsed skipped
 * operations, the timestamps), and what the package root exports for it.
 *
 * Offline tests: the RPC methods are mocked, so no environment is needed.
 */
import { afterEach, describe, it, expect, jest } from '@jest/globals';
import { create } from '@bufbuild/protobuf';
import { timestampDate, timestampFromDate } from '@bufbuild/protobuf/wkt';
import ActionsClient from '../src/actions';
import CoreClient from '../src/core';
import ProvidersClient from '../src/providers';
import {
  ToolCollectionRunStatus,
  parseSkippedTools,
  toToolCollectionRun,
} from '../src/tool-collection-runs';
import * as sdk from '../src/index';
import type {
  CreateCustomProviderParams,
  SkippedTool,
  ToolCollectionRun,
  UpdateCustomProviderParams,
} from '../src/index';
import { ScalekitNotFoundException } from '../src/errors';
import { ToolCollectionRunSchema } from '../src/pkg/grpc/scalekit/v1/providers/providers_pb';

const PROVIDER = 'ACMEAPI:70219645518265104';
const RUN_ID = 'tcr_153432495495315592';

const created = new Date('2026-11-10T10:00:00Z');
const started = new Date('2026-11-10T10:00:05Z');
const finished = new Date('2026-11-10T10:00:42Z');

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
  return { rpc, actions };
}

const skipped = [
  {
    operation_id: 'uploadAvatar',
    method: 'POST',
    path: '/users/{id}/avatar',
    reason: 'request body has no application/json representation',
  },
  { method: 'HEAD', path: '/health', reason: 'unsupported method' },
];

describe('the run that actions.getToolCollectionRun returns', () => {
  it('has every field of a finished run', async () => {
    const { rpc, actions } = setup();
    rpc.getToolCollectionRun.mockResolvedValueOnce(
      run({
        status: 'COMPLETED',
        totalEndpoints: 14,
        toolsCreated: 10,
        toolsUpdated: 2,
        toolsDeleted: 1,
        skippedToolsJson: JSON.stringify(skipped),
        errorMessage: '',
        startedAt: timestampFromDate(started),
        finishedAt: timestampFromDate(finished),
      })
    );

    const finishedRun = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
    });

    expect(finishedRun).toEqual({
      runId: RUN_ID,
      providerIdentifier: PROVIDER,
      status: 'COMPLETED',
      totalEndpoints: 14,
      toolsCreated: 10,
      toolsUpdated: 2,
      toolsDeleted: 1,
      skippedToolsJson: JSON.stringify(skipped),
      errorMessage: '',
      createdAt: timestampFromDate(created),
      startedAt: timestampFromDate(started),
      finishedAt: timestampFromDate(finished),
      skippedTools: [
        {
          operationId: 'uploadAvatar',
          method: 'POST',
          path: '/users/{id}/avatar',
          reason: 'request body has no application/json representation',
        },
        {
          operationId: '',
          method: 'HEAD',
          path: '/health',
          reason: 'unsupported method',
        },
      ],
    });
    // The converted run is the API's run without `$typeName`, plus `skippedTools`.
    expect(Object.keys(finishedRun).sort()).toEqual(
      [
        'runId',
        'providerIdentifier',
        'status',
        'totalEndpoints',
        'toolsCreated',
        'toolsUpdated',
        'toolsDeleted',
        'skippedToolsJson',
        'errorMessage',
        'createdAt',
        'startedAt',
        'finishedAt',
        'skippedTools',
      ].sort()
    );
    expect(finishedRun.status).toBe(ToolCollectionRunStatus.COMPLETED);
    // The raw text stays on the run.
    expect(JSON.parse(finishedRun.skippedToolsJson)).toEqual(skipped);
  });

  it('returns the timestamps as protobuf timestamps', async () => {
    const { rpc, actions } = setup();
    rpc.getToolCollectionRun.mockResolvedValueOnce(
      run({
        status: 'COMPLETED',
        startedAt: timestampFromDate(started),
        finishedAt: timestampFromDate(finished),
      })
    );

    const finishedRun = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
    });

    expect(finishedRun.createdAt?.seconds).toBe(
      BigInt(created.getTime() / 1000)
    );
    expect(timestampDate(finishedRun.createdAt!)).toEqual(created);
    expect(timestampDate(finishedRun.startedAt!)).toEqual(started);
    expect(timestampDate(finishedRun.finishedAt!)).toEqual(finished);
  });

  it('has no start or finish time while the run is queued', async () => {
    const { actions } = setup();

    const queued = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
    });

    expect(queued.status).toBe(ToolCollectionRunStatus.QUEUED);
    expect(queued.startedAt).toBeUndefined();
    expect(queued.finishedAt).toBeUndefined();
    expect(queued.skippedToolsJson).toBe('');
    expect(queued.skippedTools).toEqual([]);
  });

  it('returns the error message of a failed run', async () => {
    const { rpc, actions } = setup();
    rpc.getToolCollectionRun.mockResolvedValueOnce(
      run({
        status: 'FAILED',
        errorMessage:
          'failed to fetch the OpenAPI spec from its configured source',
        finishedAt: timestampFromDate(finished),
      })
    );

    const failed = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
    });

    expect(failed.status).toBe(ToolCollectionRunStatus.FAILED);
    expect(failed.errorMessage).toContain('failed to fetch');
    expect(failed.skippedTools).toEqual([]);
  });

  it('passes a status it does not know through as a string', async () => {
    const { rpc, actions } = setup();
    rpc.getToolCollectionRun.mockResolvedValueOnce(run({ status: 'PAUSED' }));

    const other = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
    });

    expect(other.status).toBe('PAUSED');
  });

  it('follows QUEUED, PROCESSING and COMPLETED', async () => {
    const { rpc, actions } = setup();
    rpc.getToolCollectionRun
      .mockResolvedValueOnce(run({ status: 'QUEUED' }))
      .mockResolvedValueOnce(run({ status: 'PROCESSING' }))
      .mockResolvedValueOnce(run({ status: 'COMPLETED', toolsCreated: 3 }));

    const seen: string[] = [];
    let current = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
    });
    seen.push(current.status);
    // At most the three answers queued above. A client that stopped reporting COMPLETED
    // would otherwise spin on the mock's default answer, and since every await resolves at
    // once, Jest's own limit would never get a turn: the run would hang instead of failing.
    while (
      seen.length < 3 &&
      current.status !== ToolCollectionRunStatus.COMPLETED &&
      current.status !== ToolCollectionRunStatus.FAILED
    ) {
      current = await actions.getToolCollectionRun({
        providerIdentifier: PROVIDER,
      });
      seen.push(current.status);
    }

    expect(seen).toEqual(['QUEUED', 'PROCESSING', 'COMPLETED']);
    expect(current.toolsCreated).toBe(3);
    expect(rpc.getToolCollectionRun).toHaveBeenCalledTimes(3);
  });
});

describe('the run that actions.invokeToolCollection returns', () => {
  it('is converted like the run of getToolCollectionRun', async () => {
    const { rpc, actions } = setup();
    const message = run({
      status: 'QUEUED',
      totalEndpoints: 0,
      skippedToolsJson: JSON.stringify(skipped),
    });
    rpc.triggerToolCollection.mockResolvedValueOnce(message);
    rpc.getToolCollectionRun.mockResolvedValueOnce(message);

    const queued = await actions.invokeToolCollection({
      providerIdentifier: PROVIDER,
    });
    const latest = await actions.getToolCollectionRun({
      providerIdentifier: PROVIDER,
    });

    expect(queued).toEqual(latest);
    expect(queued.status).toBe(ToolCollectionRunStatus.QUEUED);
    expect(queued.skippedTools).toHaveLength(2);
    expect(queued).not.toHaveProperty('$typeName');
  });
});

describe('toToolCollectionRun', () => {
  it('drops the protobuf type name, adds the parsed skipped operations and leaves the message as it was', () => {
    const message = run({
      status: 'COMPLETED',
      skippedToolsJson: JSON.stringify(skipped),
    });

    const converted = toToolCollectionRun(message);

    expect(converted).not.toHaveProperty('$typeName');
    expect(converted.skippedTools.map((tool) => tool.method)).toEqual([
      'POST',
      'HEAD',
    ]);
    expect(message.$typeName).toBe('scalekit.v1.providers.ToolCollectionRun');
    expect(message).not.toHaveProperty('skippedTools');
  });
});

describe('parseSkippedTools', () => {
  it('gives an empty list for an empty string, null and an empty array', () => {
    expect(parseSkippedTools('')).toEqual([]);
    expect(parseSkippedTools('   ')).toEqual([]);
    expect(parseSkippedTools('null')).toEqual([]);
    expect(parseSkippedTools('[]')).toEqual([]);
  });

  it('keeps an entry that only has a reason, with empty strings for the rest', () => {
    expect(
      parseSkippedTools(
        '[{"method":"","path":"","reason":"stale-tool deletion failed"}]'
      )
    ).toEqual([
      {
        operationId: '',
        method: '',
        path: '',
        reason: 'stale-tool deletion failed',
      },
    ]);
  });

  it('gives an empty list for text that is not a JSON array', () => {
    expect(parseSkippedTools('not json')).toEqual([]);
    expect(parseSkippedTools('{"reason":"x"}')).toEqual([]);
    expect(parseSkippedTools('"text"')).toEqual([]);
  });

  it('leaves out entries that are not objects and ignores fields of the wrong type', () => {
    expect(
      parseSkippedTools(
        JSON.stringify([
          1,
          null,
          'x',
          [],
          { operation_id: 7, method: 'GET', path: ['/a'], reason: 'r' },
        ])
      )
    ).toEqual([{ operationId: '', method: 'GET', path: '', reason: 'r' }]);
  });
});

describe('package root exports', () => {
  it('exports the tool collection run symbols the docs import from the package root', () => {
    expect(sdk.ToolCollectionRunStatus).toBe(ToolCollectionRunStatus);
    expect(sdk.ToolCollectionRunStatus).toEqual({
      QUEUED: 'QUEUED',
      PROCESSING: 'PROCESSING',
      COMPLETED: 'COMPLETED',
      FAILED: 'FAILED',
    });
    expect(sdk.ScalekitNotFoundException).toBe(ScalekitNotFoundException);
    // Type-only exports: this file fails to compile if one of them is dropped from the root.
    const types: [
      CreateCustomProviderParams?,
      UpdateCustomProviderParams?,
      SkippedTool?,
      ToolCollectionRun?,
    ] = [];
    expect(types).toHaveLength(0);
  });
});
