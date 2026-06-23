/**
 * SK-819 Phase 2: Tests for the new target behavior.
 * All tests in this file should pass after implementation.
 */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import CoreClient from '../src/core';
import {
  ScalekitServerException,
  ScalekitTooManyRequestsException,
  ScalekitUnauthorizedException,
  ScalekitForbiddenException,
} from '../src/errors';
import {
  ScalekitToolException,
  ScalekitToolRateLimitException,
  ScalekitToolUnauthorizedException,
  ScalekitToolForbiddenException,
  isToolException,
} from '../src/errors/specific-exceptions';
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
// Tests: Exception hierarchy and type system
// ---------------------------------------------------------------------------

describe('SK-819 Phase 2 — exception hierarchy', () => {
  it('ScalekitToolRateLimitException is instanceof ScalekitTooManyRequestsException (backward compat)', () => {
    const err = new ScalekitToolRateLimitException(
      makeToolConnectError(Code.ResourceExhausted)
    );
    expect(err).toBeInstanceOf(ScalekitTooManyRequestsException);
  });

  it('ScalekitToolUnauthorizedException is instanceof ScalekitUnauthorizedException (backward compat)', () => {
    const err = new ScalekitToolUnauthorizedException(
      makeToolConnectError(Code.Unauthenticated)
    );
    expect(err).toBeInstanceOf(ScalekitUnauthorizedException);
  });

  it('ScalekitToolForbiddenException is instanceof ScalekitForbiddenException (backward compat)', () => {
    const err = new ScalekitToolForbiddenException(
      makeToolConnectError(Code.PermissionDenied)
    );
    expect(err).toBeInstanceOf(ScalekitForbiddenException);
  });

  it('isToolException() returns true for ScalekitToolRateLimitException', () => {
    const err = new ScalekitToolRateLimitException(
      makeToolConnectError(Code.ResourceExhausted)
    );
    expect(isToolException(err)).toBe(true);
  });

  it('isToolException() returns true for ScalekitToolUnauthorizedException', () => {
    const err = new ScalekitToolUnauthorizedException(
      makeToolConnectError(Code.Unauthenticated)
    );
    expect(isToolException(err)).toBe(true);
  });

  it('isToolException() returns false for plain ScalekitTooManyRequestsException', () => {
    const err = new ScalekitTooManyRequestsException(
      makeScalekitConnectError(Code.ResourceExhausted)
    );
    expect(isToolException(err)).toBe(false);
  });

  it('Tool exception exposes toolErrorCode, toolErrorMessage, executionId', () => {
    const raw = makeToolConnectError(Code.ResourceExhausted, {
      toolErrorCode: 'RATE_LIMITED',
      toolErrorMessage: 'HubSpot API rate limit exceeded',
      executionId: 'exec-789',
    });
    const err = new ScalekitToolRateLimitException(raw);
    expect(err.toolErrorCode).toBe('RATE_LIMITED');
    expect(err.toolErrorMessage).toBe('HubSpot API rate limit exceeded');
    expect(err.executionId).toBe('exec-789');
  });
});

// ---------------------------------------------------------------------------
// Tests: promote() routing via TOOL_ERROR errorCode
// ---------------------------------------------------------------------------

describe('SK-819 Phase 2 — promote() tool error routing', () => {
  it('promote() with TOOL_ERROR + ResourceExhausted → ScalekitToolRateLimitException', () => {
    const err = ScalekitServerException.promote(
      makeToolConnectError(Code.ResourceExhausted)
    );
    expect(err).toBeInstanceOf(ScalekitToolRateLimitException);
  });

  it('promote() with TOOL_ERROR + Unauthenticated → ScalekitToolUnauthorizedException', () => {
    const err = ScalekitServerException.promote(
      makeToolConnectError(Code.Unauthenticated)
    );
    expect(err).toBeInstanceOf(ScalekitToolUnauthorizedException);
  });

  it('promote() with TOOL_ERROR + PermissionDenied → ScalekitToolForbiddenException', () => {
    const err = ScalekitServerException.promote(
      makeToolConnectError(Code.PermissionDenied)
    );
    expect(err).toBeInstanceOf(ScalekitToolForbiddenException);
  });

  it('promote() with TOOL_ERROR + Internal → ScalekitToolException (generic)', () => {
    const err = ScalekitServerException.promote(
      makeToolConnectError(Code.Internal, {
        toolErrorCode: 'TOOL_EXEC_FAILED',
        toolErrorMessage: 'Unexpected tool failure',
        executionId: 'exec-999',
      })
    );
    expect(err).toBeInstanceOf(ScalekitToolException);
  });

  it('promote() without TOOL_ERROR + ResourceExhausted → plain ScalekitTooManyRequestsException', () => {
    const err = ScalekitServerException.promote(
      makeScalekitConnectError(Code.ResourceExhausted)
    );
    expect(err).toBeInstanceOf(ScalekitTooManyRequestsException);
    expect(isToolException(err)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests: Retry logic in _connectExec
// ---------------------------------------------------------------------------

describe('SK-819 Phase 2 — retry logic', () => {
  let client: CoreClient;

  beforeEach(() => {
    client = makeClient();
  });

  it('Provider 429 (ResourceExhausted + TOOL_ERROR) → ScalekitToolRateLimitException immediately, no retry', async () => {
    const fn = jest.fn(async (_req: void) => {
      throw makeToolConnectError(Code.ResourceExhausted);
    });
    const sleepSpy = jest
      .spyOn(client as any, 'sleep')
      .mockResolvedValue(undefined);
    const authSpy = jest
      .spyOn(client as any, 'authenticateClient')
      .mockResolvedValue(undefined);

    await expect(
      client.connectExec(fn, undefined as any)
    ).rejects.toBeInstanceOf(ScalekitToolRateLimitException);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleepSpy).not.toHaveBeenCalled();
    expect(authSpy).not.toHaveBeenCalled();
  });

  it('Provider 401 (Unauthenticated + TOOL_ERROR) → ScalekitToolUnauthorizedException immediately, no authenticateClient', async () => {
    const fn = jest.fn(async (_req: void) => {
      throw makeToolConnectError(Code.Unauthenticated, {
        toolErrorCode: 'UNAUTHORIZED',
        toolErrorMessage: 'Provider token expired',
        executionId: 'exec-401',
      });
    });
    const authSpy = jest
      .spyOn(client as any, 'authenticateClient')
      .mockResolvedValue(undefined);

    await expect(
      client.connectExec(fn, undefined as any)
    ).rejects.toBeInstanceOf(ScalekitToolUnauthorizedException);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(authSpy).not.toHaveBeenCalled();
  });

  it('Provider 403 (PermissionDenied + TOOL_ERROR) → ScalekitToolForbiddenException immediately', async () => {
    const fn = jest.fn(async (_req: void) => {
      throw makeToolConnectError(Code.PermissionDenied, {
        toolErrorCode: 'FORBIDDEN',
        toolErrorMessage: 'Provider access denied',
        executionId: 'exec-403',
      });
    });

    await expect(
      client.connectExec(fn, undefined as any)
    ).rejects.toBeInstanceOf(ScalekitToolForbiddenException);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('Other provider error (Internal + TOOL_ERROR) → ScalekitToolException immediately', async () => {
    const fn = jest.fn(async (_req: void) => {
      throw makeToolConnectError(Code.Internal, {
        toolErrorCode: 'EXEC_FAILED',
        toolErrorMessage: 'Tool execution failed',
        executionId: 'exec-500',
      });
    });

    await expect(
      client.connectExec(fn, undefined as any)
    ).rejects.toBeInstanceOf(ScalekitToolException);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('Scalekit UNAUTHENTICATED (no TOOL_ERROR) → still refreshes + retries (unchanged)', async () => {
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

  it('Scalekit 429 (ResourceExhausted, no TOOL_ERROR) → surfaces immediately, no backoff retry', async () => {
    const fn = jest.fn(async (_req: void) => {
      throw makeScalekitConnectError(Code.ResourceExhausted, 'quota exceeded');
    });
    const sleepSpy = jest
      .spyOn(client as any, 'sleep')
      .mockResolvedValue(undefined);

    await expect(
      client.connectExec(fn, undefined as any)
    ).rejects.toBeInstanceOf(ScalekitTooManyRequestsException);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleepSpy).not.toHaveBeenCalled();
  });
});
