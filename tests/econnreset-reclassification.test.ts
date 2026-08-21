/**
 * A transport-level connection reset (ECONNRESET/EPIPE) is surfaced by
 * connect-node as Code.Aborted. It must NOT be promoted to the misleading
 * ScalekitConflictException (409) — it should become a transient
 * ScalekitServiceUnavailableException. A genuine server-sent Aborted (no socket
 * cause) must keep mapping to ScalekitConflictException.
 */
import { describe, it, expect } from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import {
  ScalekitServerException,
  ScalekitConflictException,
  ScalekitServiceUnavailableException,
} from '../src/errors';

/** A ConnectError(code=Aborted) whose cause is a Node socket error, mirroring
 *  what @connectrpc/connect-node produces (`ce.cause = reason`). */
function abortedWithCause(nodeCode: string, syscall = 'read'): ConnectError {
  const cause = Object.assign(new Error(`${syscall} ${nodeCode}`), {
    code: nodeCode,
    syscall,
  });
  const ce = new ConnectError(`${syscall} ${nodeCode}`, Code.Aborted);
  ce.cause = cause;
  return ce;
}

describe('ECONNRESET reclassification', () => {
  it('Aborted caused by ECONNRESET → ScalekitServiceUnavailableException (not Conflict)', () => {
    const promoted = ScalekitServerException.promote(
      abortedWithCause('ECONNRESET')
    );
    expect(promoted).toBeInstanceOf(ScalekitServiceUnavailableException);
    expect(promoted).not.toBeInstanceOf(ScalekitConflictException);
  });

  it('re-keys the reset to a consistent Unavailable/503 status (not Aborted/409)', () => {
    const promoted = ScalekitServerException.promote(
      abortedWithCause('ECONNRESET')
    ) as ScalekitServiceUnavailableException;
    expect(promoted.grpcStatus).toBe(Code.Unavailable);
    expect(promoted.httpStatus).toBe(503);
    // the underlying socket signature is still visible for diagnostics
    expect(promoted.message).toMatch(/ECONNRESET/);
  });

  it('Aborted caused by EPIPE → ScalekitServiceUnavailableException', () => {
    const promoted = ScalekitServerException.promote(
      abortedWithCause('EPIPE', 'write')
    );
    expect(promoted).toBeInstanceOf(ScalekitServiceUnavailableException);
  });

  it('finds the reset code nested deeper in the cause chain', () => {
    const root = Object.assign(new Error('read ECONNRESET'), {
      code: 'ECONNRESET',
    });
    const wrapper = Object.assign(new Error('stream error'), { cause: root });
    const ce = new ConnectError('stream error', Code.Aborted);
    ce.cause = wrapper;

    const promoted = ScalekitServerException.promote(ce);
    expect(promoted).toBeInstanceOf(ScalekitServiceUnavailableException);
  });

  it('genuine server-sent Aborted (no socket cause) still → ScalekitConflictException', () => {
    const promoted = ScalekitServerException.promote(
      new ConnectError('resource was aborted', Code.Aborted)
    );
    expect(promoted).toBeInstanceOf(ScalekitConflictException);
    expect(promoted).not.toBeInstanceOf(ScalekitServiceUnavailableException);
  });

  it('Aborted with an unrelated cause code still → ScalekitConflictException', () => {
    const promoted = ScalekitServerException.promote(
      abortedWithCause('ERR_SOMETHING_ELSE')
    );
    expect(promoted).toBeInstanceOf(ScalekitConflictException);
  });

  it('AlreadyExists is unaffected → ScalekitConflictException', () => {
    const promoted = ScalekitServerException.promote(
      new ConnectError('already exists', Code.AlreadyExists)
    );
    expect(promoted).toBeInstanceOf(ScalekitConflictException);
  });
});
