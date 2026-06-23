import { ConnectError } from '@connectrpc/connect';
import { AxiosResponse } from 'axios';
import { ScalekitServerException } from './base-exception';

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
