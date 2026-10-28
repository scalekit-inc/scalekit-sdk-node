import { ConnectError, Code } from '@connectrpc/connect';
import { AxiosError, AxiosResponse } from 'axios';
import type { ErrorInfo } from '../pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import { ErrorInfoSchema } from '../pkg/grpc/scalekit/v1/errdetails/errdetails_pb';

// gRPC to HTTP status mapping
const GRPC_TO_HTTP: Record<number, number> = {
  [Code.InvalidArgument]: 400,
  [Code.FailedPrecondition]: 400,
  [Code.OutOfRange]: 400,
  [Code.Unauthenticated]: 401,
  [Code.PermissionDenied]: 403,
  [Code.NotFound]: 404,
  [Code.AlreadyExists]: 409,
  [Code.Aborted]: 409,
  [Code.ResourceExhausted]: 429,
  [Code.Canceled]: 499,
  [Code.DataLoss]: 500,
  [Code.Unknown]: 500,
  [Code.Internal]: 500,
  [Code.Unimplemented]: 501,
  [Code.Unavailable]: 503,
  [Code.DeadlineExceeded]: 504,
};

// HTTP to gRPC status mapping
const HTTP_TO_GRPC: Record<number, number> = {
  200: Code.Unknown, // No direct mapping for 200
  400: Code.InvalidArgument,
  401: Code.Unauthenticated,
  403: Code.PermissionDenied,
  404: Code.NotFound,
  409: Code.AlreadyExists,
  429: Code.ResourceExhausted,
  500: Code.Internal,
  501: Code.Unimplemented,
  503: Code.Unavailable,
  504: Code.DeadlineExceeded,
};

// HTTP status constants
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Node/HTTP2 error codes that indicate a transport-level connection reset
// rather than a server-sent gRPC status. Per connect-node's own
// connectErrorFromNodeReason (node_modules/@connectrpc/connect-node/dist/cjs/node-error.js),
// ECONNRESET, ERR_STREAM_DESTROYED, and ERR_HTTP2_INVALID_STREAM are the three
// codes explicitly mapped to Code.Aborted; anything else (ETIMEDOUT, ENOTFOUND,
// EAI_AGAIN, ECONNREFUSED) maps to Code.Unavailable already and never reaches
// this set. Without this reclassification, any of these three would be
// promoted to ScalekitConflictException and look like an HTTP 409 the caller
// never caused. EPIPE is NOT one of connect-node's explicitly-mapped codes
// (it falls through to the default Code.Internal) but is kept here too, at
// zero cost, in case it ever appears nested under one of the three above in a
// cause chain that IS Aborted at the top.
const TRANSPORT_RESET_CODES = new Set([
  'ECONNRESET',
  'ERR_STREAM_DESTROYED',
  'ERR_HTTP2_INVALID_STREAM',
  'EPIPE',
]);

/**
 * Walk a ConnectError's `cause` chain looking for an underlying Node socket error
 * whose `code` marks a transport-level connection reset. connect-node attaches the
 * raw Node error as `cause` (`ce.cause = reason`). A genuine server-sent Aborted
 * (e.g. an optimistic-concurrency conflict) has no such cause and must keep
 * mapping to ScalekitConflictException.
 */
function hasTransportResetCause(error: unknown): boolean {
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current instanceof Error && !seen.has(current)) {
    seen.add(current);
    const code = (current as { code?: unknown }).code;
    if (typeof code === 'string' && TRANSPORT_RESET_CODES.has(code)) {
      return true;
    }
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}

// Base exception class
export class ScalekitException extends Error {
  constructor(error: any) {
    super(error?.message || error?.toString() || 'Unknown error');
    this.name = 'ScalekitException';
  }
}

/**
 * A method argument is invalid. Thrown before any network call, so nothing
 * was sent. Fix the argument named in the message; retrying unchanged fails
 * the same way.
 */
export class ScalekitValidationError extends ScalekitException {
  /** Always `false`: the same input fails the same way. */
  readonly retryable: boolean;

  /** @internal */
  constructor(message: string) {
    super(message);
    this.name = 'ScalekitValidationError';
    this.retryable = false;
  }
}

/**
 * The caller's `AbortSignal` cancelled the call, including during a wait
 * between retries. `cause` is the signal's `reason`.
 */
export class ScalekitAbortError extends ScalekitException {
  /** Always `false`: the caller asked to stop. */
  readonly retryable: boolean;
  /** The aborting signal's `reason`. */
  declare readonly cause: unknown;

  /** @internal */
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'ScalekitAbortError';
    this.retryable = false;
    Object.defineProperty(this, 'cause', {
      value: cause,
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
}

// Webhook verification error
export class WebhookVerificationError extends ScalekitException {
  /**
   * The underlying error that caused this one, when there is one (for example
   * the decoding error behind an invalid request body).
   */
  declare cause?: unknown;

  constructor(error: any, options?: { cause?: unknown }) {
    super(error);
    this.name = 'WebhookVerificationError';
    if (options !== undefined && 'cause' in options) {
      // Same shape as the ES2022 `Error` `cause` option: an own, non-enumerable property.
      Object.defineProperty(this, 'cause', {
        value: options.cause,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  }
}

// Token validation failure exception
export class ScalekitValidateTokenFailureException extends ScalekitException {
  constructor(error: any) {
    super(error);
    this.name = 'ScalekitValidateTokenFailureException';
  }
}

// Base server exception
export class ScalekitServerException extends ScalekitException {
  private _grpcStatus: Code;
  private _httpStatus: number;
  private _message: string | null;
  private _errDetails: any;
  private _errorCode: string | null;
  private _unpackedDetails: ErrorInfo[];

  constructor(error: AxiosResponse | ConnectError) {
    super(error);

    this._unpackedDetails = [];

    if (this.isAxiosResponse(error)) {
      // Handle HTTP Response errors
      if (error.statusText && typeof error.statusText === 'string') {
        this._httpStatus =
          HTTP_STATUS[
            error.statusText.toUpperCase() as keyof typeof HTTP_STATUS
          ] || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      } else {
        this._httpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      }
      this._grpcStatus = HTTP_TO_GRPC[error.status] || Code.Unknown;
      this._errorCode = error.statusText;
      this._errDetails = error.data;
      this._message = null;
    } else {
      // Handle gRPC ConnectError
      this._grpcStatus = error.code;
      this._httpStatus = GRPC_TO_HTTP[error.code] || 500;
      this._message = error.message;
      this._errDetails = error.findDetails(ErrorInfoSchema);
      this._errorCode = null;

      // Unpack error details
      for (const detail of this._errDetails) {
        this._unpackedDetails.push(detail);
        if (!this._errorCode) {
          this._errorCode = detail.errorCode;
        }
      }
    }

    this.name = 'ScalekitServerException';
  }

  private isAxiosResponse(error: any): error is AxiosResponse {
    return (
      error &&
      typeof error.status === 'number' &&
      typeof error.statusText === 'string'
    );
  }

  // String representation
  toString(): string {
    const border = '='.repeat(40);

    if (this._unpackedDetails.length > 0) {
      let detailsStr = JSON.stringify(this._unpackedDetails, null, 2);

      // Format the JSON string for better readability

      if (detailsStr.startsWith('[') && detailsStr.includes('\n')) {
        detailsStr = '[\n' + detailsStr.substring(1);
      }

      return (
        `\n${border}\n` +
        `Error Code: ${this._errorCode}\n` +
        `GRPC: (${this.getGrpcStatusName()}: ${this._grpcStatus})\n` +
        `HTTP: (${this.getHttpStatusName()}: ${this._httpStatus})\n` +
        `Error Details:\n` +
        `${this._message}: ${detailsStr}\n${border}\n`
      );
    } else {
      return (
        `\n${border}\n` +
        `Error Code: ${this._errorCode}\n` +
        `GRPC: (${this.getGrpcStatusName()}: ${this._grpcStatus})\n` +
        `HTTP: (${this.getHttpStatusName()}: ${this._httpStatus})\n` +
        `Error Details: ${this._errDetails}\n${border}\n`
      );
    }
  }

  // Helper method to get gRPC status name
  private getGrpcStatusName(): string {
    switch (this._grpcStatus) {
      case Code.InvalidArgument:
        return 'INVALID_ARGUMENT';
      case Code.FailedPrecondition:
        return 'FAILED_PRECONDITION';
      case Code.OutOfRange:
        return 'OUT_OF_RANGE';
      case Code.Unauthenticated:
        return 'UNAUTHENTICATED';
      case Code.PermissionDenied:
        return 'PERMISSION_DENIED';
      case Code.NotFound:
        return 'NOT_FOUND';
      case Code.AlreadyExists:
        return 'ALREADY_EXISTS';
      case Code.Aborted:
        return 'ABORTED';
      case Code.ResourceExhausted:
        return 'RESOURCE_EXHAUSTED';
      case Code.Canceled:
        return 'CANCELED';
      case Code.DataLoss:
        return 'DATA_LOSS';
      case Code.Unknown:
        return 'UNKNOWN';
      case Code.Internal:
        return 'INTERNAL';
      case Code.Unimplemented:
        return 'UNIMPLEMENTED';
      case Code.Unavailable:
        return 'UNAVAILABLE';
      case Code.DeadlineExceeded:
        return 'DEADLINE_EXCEEDED';
      default:
        return 'UNKNOWN';
    }
  }

  // Helper method to get HTTP status name
  private getHttpStatusName(): string {
    switch (this._httpStatus) {
      case 200:
        return 'OK';
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 429:
        return 'TOO_MANY_REQUESTS';
      case 500:
        return 'INTERNAL_SERVER_ERROR';
      case 501:
        return 'NOT_IMPLEMENTED';
      case 503:
        return 'SERVICE_UNAVAILABLE';
      case 504:
        return 'GATEWAY_TIMEOUT';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }

  // Getters
  get grpcStatus(): Code {
    return this._grpcStatus;
  }

  get httpStatus(): number {
    return this._httpStatus;
  }

  get errorCode(): string | null {
    return this._errorCode;
  }

  get message(): string {
    return this._message || super.message;
  }

  get errDetails(): any {
    return this._errDetails;
  }

  get unpackedDetails(): ErrorInfo[] {
    return this._unpackedDetails;
  }

  static promote(
    error: AxiosResponse | ConnectError,
    isToolError?: boolean
  ): ScalekitServerException {
    const grpcStatus =
      error instanceof ConnectError
        ? error.code
        : HTTP_TO_GRPC[error.status] || Code.Unknown;

    // A transport-level connection reset (ECONNRESET/EPIPE) is surfaced by
    // connect-node as Code.Aborted. That is NOT a real conflict — an idle
    // keep-alive socket was reused after the edge closed it, or the connection
    // dropped mid-flight. Re-key it as Unavailable so the resulting exception is
    // consistent end to end: ScalekitServiceUnavailableException with grpcStatus
    // UNAVAILABLE (14) and httpStatus 503, rather than the misleading
    // ScalekitConflictException / Aborted (10) / 409. error.details is carried
    // over (not dropped) so findDetails()/errorCode/unpackedDetails on the
    // promoted exception still reflect whatever the original error carried,
    // and the underlying socket error is preserved as the cause. A genuine
    // server-sent Aborted (no ECONNRESET/EPIPE cause) still falls through to
    // the switch below and stays a conflict.
    if (
      error instanceof ConnectError &&
      grpcStatus === Code.Aborted &&
      hasTransportResetCause(error)
    ) {
      const transientError = new ConnectError(
        error.rawMessage,
        Code.Unavailable,
        error.metadata,
        undefined,
        error.cause
      );
      // error.details holds already-received (IncomingDetail) entries, which
      // the constructor's outgoingDetails param isn't typed to accept (it's
      // meant for a sender constructing a fresh error) — assign the field
      // directly instead; findDetails() handles both shapes at runtime.
      transientError.details = error.details;
      return new ScalekitServiceUnavailableException(transientError);
    }

    // isToolError may be pre-computed by the caller (_connectExec already calls findDetails).
    // Fall back to parsing here only when called standalone (e.g. Axios path, tests).
    const toolError =
      isToolError ??
      (error instanceof ConnectError &&
        error
          .findDetails(ErrorInfoSchema)
          .some((d) => d.errorCode === 'TOOL_ERROR'));

    if (toolError) {
      switch (grpcStatus) {
        case Code.Unauthenticated:
          return new ScalekitToolUnauthorizedException(error);
        case Code.PermissionDenied:
          return new ScalekitToolForbiddenException(error);
        case Code.ResourceExhausted:
          return new ScalekitToolRateLimitException(error);
        default:
          return new ScalekitToolException(error);
      }
    }

    switch (grpcStatus) {
      case Code.InvalidArgument:
      case Code.FailedPrecondition:
      case Code.OutOfRange:
        return new ScalekitBadRequestException(error);
      case Code.Unauthenticated:
        return new ScalekitUnauthorizedException(error);
      case Code.PermissionDenied:
        return new ScalekitForbiddenException(error);
      case Code.NotFound:
        return new ScalekitNotFoundException(error);
      case Code.AlreadyExists:
      case Code.Aborted:
        return new ScalekitConflictException(error);
      case Code.ResourceExhausted:
        return new ScalekitTooManyRequestsException(error);
      case Code.Canceled:
        return new ScalekitCancelledException(error);
      case Code.DataLoss:
      case Code.Unknown:
      case Code.Internal:
        return new ScalekitInternalServerException(error);
      case Code.Unimplemented:
        return new ScalekitNotImplementedException(error);
      case Code.Unavailable:
        return new ScalekitServiceUnavailableException(error);
      case Code.DeadlineExceeded:
        return new ScalekitGatewayTimeoutException(error);
      default:
        return new ScalekitUnknownException(error);
    }
  }
}

// ---------------------------------------------------------------------------
// Tool exception interface and hierarchy
// ---------------------------------------------------------------------------

/**
 * Interface implemented by all tool exceptions.
 * Enables type-safe narrowing without relying on multiple inheritance.
 */
export interface IScalekitToolException {
  readonly isToolError: true;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;
}

/**
 * Type guard: returns true for any exception that originated from an upstream
 * tool provider (i.e. has errorCode == "TOOL_ERROR" in the gRPC status details).
 *
 * Usage:
 *   catch (e) {
 *     if (isToolException(e)) { // e is IScalekitToolException here
 *       console.log(e.toolErrorCode, e.executionId);
 *     }
 *   }
 */
export function isToolException(e: unknown): e is IScalekitToolException {
  return (
    e instanceof ScalekitServerException && (e as any).isToolError === true
  );
}

// Specific exception classes
export class ScalekitBadRequestException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitBadRequestException';
  }
}

export class ScalekitUnauthorizedException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitUnauthorizedException';
  }
}

export class ScalekitForbiddenException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitForbiddenException';
  }
}

export class ScalekitNotFoundException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitNotFoundException';
  }
}

export class ScalekitConflictException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitConflictException';
  }
}

export class ScalekitTooManyRequestsException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitTooManyRequestsException';
  }
}

export class ScalekitInternalServerException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitInternalServerException';
  }
}

export class ScalekitNotImplementedException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitNotImplementedException';
  }
}

export class ScalekitServiceUnavailableException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitServiceUnavailableException';
  }
}

export class ScalekitGatewayTimeoutException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitGatewayTimeoutException';
  }

  static isAxiosTimeout(error: AxiosError): boolean {
    return (
      error.code === AxiosError.ECONNABORTED ||
      error.code === AxiosError.ETIMEDOUT
    );
  }

  /**
   * An axios timeout carries no response, so it can't go through `promote`.
   * Wrap it as a DeadlineExceeded ConnectError so HTTP timeouts surface as
   * the same exception type as gRPC deadline expiry.
   */
  static fromAxiosTimeout(error: AxiosError): ScalekitGatewayTimeoutException {
    return new ScalekitGatewayTimeoutException(
      new ConnectError(error.message, Code.DeadlineExceeded)
    );
  }
}

export class ScalekitCancelledException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitCancelledException';
  }
}

export class ScalekitUnknownException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitUnknownException';
  }
}

// ---------------------------------------------------------------------------
// Tool exception concrete classes
// ---------------------------------------------------------------------------

/**
 * Extract ToolErrorInfo fields from the ConnectError details via the parent's
 * unpackedDetails (already populated by ScalekitServerException constructor).
 */
function extractToolErrorInfo(parent: ScalekitServerException): {
  toolErrorCode: string;
  toolErrorMessage: string;
  executionId: string;
} {
  for (const detail of parent.unpackedDetails) {
    if (detail.toolErrorInfo) {
      return {
        toolErrorCode: detail.toolErrorInfo.toolErrorCode,
        toolErrorMessage: detail.toolErrorInfo.toolErrorMessage,
        executionId: detail.toolErrorInfo.executionId,
      };
    }
  }
  return { toolErrorCode: '', toolErrorMessage: '', executionId: '' };
}

/**
 * Raised when an upstream provider returns a rate-limit (429) error.
 * Extends ScalekitTooManyRequestsException for backward compatibility.
 */
export class ScalekitToolRateLimitException
  extends ScalekitTooManyRequestsException
  implements IScalekitToolException
{
  readonly isToolError = true as const;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;

  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitToolRateLimitException';
    const info = extractToolErrorInfo(this);
    this.toolErrorCode = info.toolErrorCode;
    this.toolErrorMessage = info.toolErrorMessage;
    this.executionId = info.executionId;
  }
}

/**
 * Raised when an upstream provider returns an unauthorized (401) error.
 * Extends ScalekitUnauthorizedException for backward compatibility.
 */
export class ScalekitToolUnauthorizedException
  extends ScalekitUnauthorizedException
  implements IScalekitToolException
{
  readonly isToolError = true as const;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;

  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitToolUnauthorizedException';
    const info = extractToolErrorInfo(this);
    this.toolErrorCode = info.toolErrorCode;
    this.toolErrorMessage = info.toolErrorMessage;
    this.executionId = info.executionId;
  }
}

/**
 * Raised when an upstream provider returns a forbidden (403) error.
 * Extends ScalekitForbiddenException for backward compatibility.
 */
export class ScalekitToolForbiddenException
  extends ScalekitForbiddenException
  implements IScalekitToolException
{
  readonly isToolError = true as const;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;

  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitToolForbiddenException';
    const info = extractToolErrorInfo(this);
    this.toolErrorCode = info.toolErrorCode;
    this.toolErrorMessage = info.toolErrorMessage;
    this.executionId = info.executionId;
  }
}

/**
 * Raised when an upstream provider returns any other error during tool execution.
 * Extends ScalekitServerException as a general-purpose base.
 */
export class ScalekitToolException
  extends ScalekitServerException
  implements IScalekitToolException
{
  readonly isToolError = true as const;
  readonly toolErrorCode: string;
  readonly toolErrorMessage: string;
  readonly executionId: string;

  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitToolException';
    const info = extractToolErrorInfo(this);
    this.toolErrorCode = info.toolErrorCode;
    this.toolErrorMessage = info.toolErrorMessage;
    this.executionId = info.executionId;
  }
}

// ---------------------------------------------------------------------------
// Trigger event parsing
// ---------------------------------------------------------------------------

/**
 * Thrown by `verifyTriggerEvent` and `scalekit.actions.triggers.verifyEvent`
 * when a trigger event's signature is valid but its body is not a trigger
 * event this SDK can read: not JSON, not a JSON object, a required field
 * missing or of the wrong type, or an `occurred_at` that is not an RFC 3339
 * timestamp with an offset.
 *
 * It extends {@link WebhookVerificationError}, so a handler that answers
 * `400` on `WebhookVerificationError` covers it too. Catch it separately when
 * you want to tell "not from Scalekit" apart from "from Scalekit, but
 * unreadable". The message names the field; it never contains the body or
 * the secret.
 */
export class ScalekitTriggerEventParseError extends WebhookVerificationError {
  /** @internal */
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ScalekitTriggerEventParseError';
  }
}
