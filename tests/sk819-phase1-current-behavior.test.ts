/**
 * SK-819 Phase 1: Tests that document CURRENT behavior (must pass before implementation).
 * These tests verify the existing (broken) retry behavior so we have a baseline.
 */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import CoreClient from '../src/core';
import {
  ScalekitServerException,
  ScalekitTooManyRequestsException,
} from '../src/errors';
import {
  ErrorInfoSchema,
  ToolErrorInfoSchema,
} from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import { create } from '@bufbuild/protobuf';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeToolConnectError(
  grpcCode: Code,
  {
    toolErrorCode = 'RATE_LIMITED',
    toolErrorMessage = 'Provider rate limit hit',
    executionId = 'exec-123',
  } = {}
): ConnectError {
  return new ConnectError('provider error', grpcCode, undefined, [
    {
      desc: ErrorInfoSchema,
      value: {
        errorCode: 'TOOL_ERROR',
        toolErrorInfo: create(ToolErrorInfoSchema, {
          toolErrorCode,
          toolErrorMessage,
          executionId,
        }),
      },
    },
  ]);
}

function makeScalekitConnectError(
  grpcCode: Code,
  message = 'scalekit error'
): ConnectError {
  return new ConnectError(message, grpcCode);
}

function makeClient(): CoreClient {
  return new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SK-819 Phase 1 — current (pre-fix) behavior', () => {
  let client: CoreClient;

  beforeEach(() => {
    client = makeClient();
  });

  it('Scalekit UNAUTHENTICATED (no TOOL_ERROR) → authenticateClient called + request retried', async () => {
    let callCount = 0;
    const fn = jest.fn(async (_req: void) => {
      callCount++;
      if (callCount === 1) {
        throw makeScalekitConnectError(Code.Unauthenticated, 'token expired');
      }
      return 'success';
    });

    const authSpy = jest
      .spyOn(client as any, 'authenticateClient')
      .mockResolvedValue(undefined);

    const result = await client.connectExec(fn, undefined as any);
    expect(result).toBe('success');
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('Scalekit 429 (ResourceExhausted, no TOOL_ERROR) → surfaces immediately as ScalekitTooManyRequestsException', async () => {
    const fn = jest.fn(async (_req: void) => {
      throw makeScalekitConnectError(Code.ResourceExhausted, 'quota exceeded');
    });

    const sleepSpy = jest
      .spyOn(client as any, 'sleep')
      .mockResolvedValue(undefined);

    await expect(client.connectExec(fn, undefined as any)).rejects.toThrow(
      ScalekitTooManyRequestsException
    );
    // Post-fix: surfaces immediately (no retry, no sleep)
    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleepSpy).not.toHaveBeenCalled();
  });

  it('Provider 429 (ResourceExhausted + TOOL_ERROR) → surfaces immediately without retry', async () => {
    const fn = jest.fn(async (_req: void) => {
      throw makeToolConnectError(Code.ResourceExhausted);
    });

    const sleepSpy = jest
      .spyOn(client as any, 'sleep')
      .mockResolvedValue(undefined);

    await expect(client.connectExec(fn, undefined as any)).rejects.toThrow(
      ScalekitServerException
    );
    // Post-fix: surfaces immediately (no retry)
    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleepSpy).not.toHaveBeenCalled();
  });

  it('Provider 401 (Unauthenticated + TOOL_ERROR) → surfaces immediately without calling authenticateClient', async () => {
    const fn = jest.fn(async (_req: void) => {
      throw makeToolConnectError(Code.Unauthenticated, {
        toolErrorCode: 'UNAUTHORIZED',
        toolErrorMessage: 'Provider token expired',
        executionId: 'exec-456',
      });
    });

    const authSpy = jest
      .spyOn(client as any, 'authenticateClient')
      .mockResolvedValue(undefined);

    await expect(client.connectExec(fn, undefined as any)).rejects.toThrow(
      ScalekitServerException
    );
    // Post-fix: does NOT refresh M2M token for a provider auth error
    expect(authSpy).not.toHaveBeenCalled();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
