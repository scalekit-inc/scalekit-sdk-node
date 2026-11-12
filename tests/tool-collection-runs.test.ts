/**
 * Tool collection runs of a connector created from an OpenAPI spec:
 * `providers.triggerToolCollection` and `providers.getToolCollectionRun`.
 *
 * Offline tests: the gRPC client is mocked, so no environment is needed.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import { create } from '@bufbuild/protobuf';
import { timestampFromDate } from '@bufbuild/protobuf/wkt';
import ProvidersClient, {
  ToolCollectionRunStatus,
  parseSkippedTools,
} from '../src/providers';
import * as sdk from '../src/index';
import type {
  CreateCustomProviderParams,
  CredentialPlacement,
  RefreshToolsResponse,
  SkippedTool,
  ToolCollectionRun,
  UpdateCustomProviderParams,
} from '../src/index';
import CoreClient from '../src/core';
import {
  ScalekitConflictException,
  ScalekitNotFoundException,
  ScalekitBadRequestException,
  ScalekitValidationError,
} from '../src/errors';
import { ErrorInfoSchema } from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import { ToolCollectionRunSchema } from '../src/pkg/grpc/scalekit/v1/providers/providers_pb';

const core = () =>
  new CoreClient('https://test.scalekit.dev', 'client_id', 'client_secret');

const created = new Date('2026-11-10T10:00:00Z');
const finished = new Date('2026-11-10T10:00:42Z');

function run(overrides: Record<string, unknown> = {}) {
  return create(ToolCollectionRunSchema, {
    runId: 'tcr_1',
    providerIdentifier: 'ACMEAPI:1234',
    status: 'QUEUED',
    createdAt: timestampFromDate(created),
    ...overrides,
  });
}

function setup() {
  const rpc = {
    triggerToolCollection: jest.fn(async (_r: any) => run()),
    getToolCollectionRun: jest.fn(async (_r: any) => run()),
  };
  const client = new ProvidersClient(
    { createClient: () => rpc } as any,
    core()
  );
  return { rpc, client };
}

const lastRequest = (fn: jest.Mock) =>
  fn.mock.calls[fn.mock.calls.length - 1][0] as any;

const conflict = () =>
  new ConnectError(
    'an ingestion run is already in progress for this connector',
    Code.AlreadyExists,
    undefined,
    [{ desc: ErrorInfoSchema, value: { errorCode: 'RESOURCE_ALREADY_EXISTS' } }]
  );

const notFound = (message: string) =>
  new ConnectError(message, Code.NotFound, undefined, [
    { desc: ErrorInfoSchema, value: { errorCode: 'NOT_FOUND' } },
  ]);

describe('triggerToolCollection', () => {
  it('sends the connector identifier and returns the queued run', async () => {
    const { rpc, client } = setup();

    const queued = await client.triggerToolCollection('ACMEAPI:1234');

    expect(lastRequest(rpc.triggerToolCollection).providerIdentifier).toBe(
      'ACMEAPI:1234'
    );
    expect(queued.runId).toBe('tcr_1');
    expect(queued.providerIdentifier).toBe('ACMEAPI:1234');
    expect(queued.status).toBe(ToolCollectionRunStatus.QUEUED);
    expect(queued.skippedTools).toEqual([]);
    expect(queued.startedAt).toBeUndefined();
    expect(queued.finishedAt).toBeUndefined();
    expect(queued.createdAt?.seconds).toBe(BigInt(created.getTime() / 1000));
  });

  it('returns a plain object without the protobuf type name', async () => {
    const { client } = setup();

    const queued = await client.triggerToolCollection('ACMEAPI:1234');

    expect(queued).not.toHaveProperty('$typeName');
  });

  it('rejects an empty identifier before sending anything', async () => {
    const { rpc, client } = setup();

    await expect(client.triggerToolCollection('')).rejects.toBeInstanceOf(
      ScalekitValidationError
    );
    await expect(client.triggerToolCollection('   ')).rejects.toBeInstanceOf(
      ScalekitValidationError
    );
    expect(rpc.triggerToolCollection).not.toHaveBeenCalled();
  });

  it('surfaces a run already in progress as a conflict with its error code', async () => {
    const { rpc, client } = setup();
    rpc.triggerToolCollection.mockRejectedValueOnce(conflict());

    const error = await client
      .triggerToolCollection('ACMEAPI:1234')
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitConflictException);
    expect(error.errorCode).toBe('RESOURCE_ALREADY_EXISTS');
    expect(error.httpStatus).toBe(409);
  });

  it('surfaces an unknown connector as not found', async () => {
    const { rpc, client } = setup();
    rpc.triggerToolCollection.mockRejectedValueOnce(
      notFound('provider not found')
    );

    const error = await client.triggerToolCollection('NOPE:1').catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitNotFoundException);
    expect(error.httpStatus).toBe(404);
  });

  it('surfaces a connector that is not sourced from a spec as a bad request', async () => {
    const { rpc, client } = setup();
    rpc.triggerToolCollection.mockRejectedValueOnce(
      new ConnectError(
        'this connector is not sourced from an OpenAPI spec',
        Code.InvalidArgument,
        undefined,
        [{ desc: ErrorInfoSchema, value: { errorCode: 'INVALID_ARGUMENT' } }]
      )
    );

    const error = await client
      .triggerToolCollection('ACMEMCP:1234')
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitBadRequestException);
    expect(error.message).toContain('not sourced from an OpenAPI spec');
  });
});

describe('getToolCollectionRun', () => {
  it('asks for the latest run when no run id is given', async () => {
    const { rpc, client } = setup();

    await client.getToolCollectionRun('ACMEAPI:1234');

    const request = lastRequest(rpc.getToolCollectionRun);
    expect(request.providerIdentifier).toBe('ACMEAPI:1234');
    expect(request.runId).toBe('latest');
  });

  it('treats an empty run id as the latest run', async () => {
    const { rpc, client } = setup();

    await client.getToolCollectionRun('ACMEAPI:1234', '');

    expect(lastRequest(rpc.getToolCollectionRun).runId).toBe('latest');
  });

  it('sends an explicit run id as given', async () => {
    const { rpc, client } = setup();

    await client.getToolCollectionRun('ACMEAPI:1234', 'tcr_77');

    expect(lastRequest(rpc.getToolCollectionRun).runId).toBe('tcr_77');
  });

  it('returns the counters, timestamps and parsed skipped operations of a finished run', async () => {
    const { rpc, client } = setup();
    const skipped = [
      {
        operation_id: 'uploadAvatar',
        method: 'POST',
        path: '/users/{id}/avatar',
        reason: 'request body has no application/json representation',
      },
      { method: 'HEAD', path: '/health', reason: 'unsupported method' },
    ];
    rpc.getToolCollectionRun.mockResolvedValueOnce(
      run({
        status: 'COMPLETED',
        totalEndpoints: 14,
        toolsCreated: 10,
        toolsUpdated: 2,
        toolsDeleted: 1,
        skippedToolsJson: JSON.stringify(skipped),
        startedAt: timestampFromDate(created),
        finishedAt: timestampFromDate(finished),
      })
    );

    const finishedRun = await client.getToolCollectionRun('ACMEAPI:1234');

    expect(finishedRun.status).toBe(ToolCollectionRunStatus.COMPLETED);
    expect(finishedRun.totalEndpoints).toBe(14);
    expect(finishedRun.toolsCreated).toBe(10);
    expect(finishedRun.toolsUpdated).toBe(2);
    expect(finishedRun.toolsDeleted).toBe(1);
    expect(finishedRun.errorMessage).toBe('');
    expect(finishedRun.finishedAt?.seconds).toBe(
      BigInt(finished.getTime() / 1000)
    );
    expect(finishedRun.skippedTools).toEqual([
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
    ]);
    // The raw text stays on the run.
    expect(JSON.parse(finishedRun.skippedToolsJson)).toEqual(skipped);
  });

  it('returns the error message of a failed run', async () => {
    const { rpc, client } = setup();
    rpc.getToolCollectionRun.mockResolvedValueOnce(
      run({
        status: 'FAILED',
        errorMessage:
          'failed to fetch the OpenAPI spec from its configured source',
        finishedAt: timestampFromDate(finished),
      })
    );

    const failed = await client.getToolCollectionRun('ACMEAPI:1234');

    expect(failed.status).toBe(ToolCollectionRunStatus.FAILED);
    expect(failed.errorMessage).toContain('failed to fetch');
    expect(failed.skippedTools).toEqual([]);
  });

  it('passes a status it does not know through as a string', async () => {
    const { rpc, client } = setup();
    rpc.getToolCollectionRun.mockResolvedValueOnce(run({ status: 'PAUSED' }));

    const other = await client.getToolCollectionRun('ACMEAPI:1234');

    expect(other.status).toBe('PAUSED');
  });

  it('rejects an empty identifier before sending anything', async () => {
    const { rpc, client } = setup();

    await expect(client.getToolCollectionRun('')).rejects.toBeInstanceOf(
      ScalekitValidationError
    );
    expect(rpc.getToolCollectionRun).not.toHaveBeenCalled();
  });

  it('surfaces a connector without a run as not found', async () => {
    const { rpc, client } = setup();
    rpc.getToolCollectionRun.mockRejectedValueOnce(
      notFound('tool collection run not found')
    );

    const error = await client
      .getToolCollectionRun('ACMEAPI:1234')
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitNotFoundException);
    expect(error.message).toContain('tool collection run not found');
  });

  it('surfaces a malformed run id as a bad request', async () => {
    const { rpc, client } = setup();
    rpc.getToolCollectionRun.mockRejectedValueOnce(
      new ConnectError('invalid run_id', Code.InvalidArgument, undefined, [
        { desc: ErrorInfoSchema, value: { errorCode: 'INVALID_ARGUMENT' } },
      ])
    );

    const error = await client
      .getToolCollectionRun('ACMEAPI:1234', 'nope')
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitBadRequestException);
  });
});

describe('polling a run to its end', () => {
  it('follows QUEUED, PROCESSING and COMPLETED', async () => {
    const { rpc, client } = setup();
    rpc.getToolCollectionRun
      .mockResolvedValueOnce(run({ status: 'QUEUED' }))
      .mockResolvedValueOnce(run({ status: 'PROCESSING' }))
      .mockResolvedValueOnce(run({ status: 'COMPLETED', toolsCreated: 3 }));

    const seen: string[] = [];
    let current = await client.getToolCollectionRun('ACMEAPI:1234');
    seen.push(current.status);
    while (
      current.status !== ToolCollectionRunStatus.COMPLETED &&
      current.status !== ToolCollectionRunStatus.FAILED
    ) {
      current = await client.getToolCollectionRun('ACMEAPI:1234');
      seen.push(current.status);
    }

    expect(seen).toEqual(['QUEUED', 'PROCESSING', 'COMPLETED']);
    expect(current.toolsCreated).toBe(3);
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
    expect(sdk.ScalekitNotFoundException).toBe(ScalekitNotFoundException);
    // Type-only exports: this file fails to compile if one of them is dropped from the root.
    const types: [
      CreateCustomProviderParams?,
      UpdateCustomProviderParams?,
      CredentialPlacement?,
      RefreshToolsResponse?,
      SkippedTool?,
      ToolCollectionRun?,
    ] = [];
    expect(types).toHaveLength(0);
  });
});
