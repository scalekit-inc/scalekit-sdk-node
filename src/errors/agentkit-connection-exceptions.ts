import { ScalekitException } from './base-exception';
import {
  ScalekitBadRequestException,
  ScalekitConflictException,
  ScalekitForbiddenException,
  ScalekitGatewayTimeoutException,
  ScalekitNotFoundException,
  ScalekitServiceUnavailableException,
  ScalekitUnauthorizedException,
} from './specific-exceptions';
import { ScalekitServerException } from './base-exception';

/** Stable, machine-readable reason of a {@link ScalekitAgentKitConnectionError}. */
export type AgentKitConnectionErrorCode =
  | 'INVALID_CONNECTION_ID'
  | 'CONNECTION_NOT_FOUND'
  | 'NOT_AUTHORIZED'
  | 'INVALID_CONFIGURATION'
  | 'CONNECTION_NAME_CONFLICT'
  | 'CONNECTION_IN_USE'
  | 'PROVIDER_NOT_FOUND'
  | 'AMBIGUOUS_AUTH_TYPE'
  | 'OUTCOME_UNKNOWN'
  | 'REQUEST_FAILED';

/**
 * Raised by the AgentKit connection methods on `scalekit.actions`
 * (`createConnection`, `getConnection`, `listConnections`, `updateConnection`,
 * `deleteConnection`).
 *
 * `code` says what went wrong, `retryable` whether the same call can succeed
 * later, and `cause` is the original {@link ScalekitServerException} with the
 * server error code, gRPC status and message. Arguments that are invalid
 * before any request is sent raise `ScalekitValidationError` instead.
 *
 * `OUTCOME_UNKNOWN` means the request was sent but the service did not answer
 * in time: the change may or may not have been applied. Read the connection to
 * check before repeating a create.
 */
export class ScalekitAgentKitConnectionError extends ScalekitException {
  readonly code: AgentKitConnectionErrorCode;
  readonly retryable: boolean;
  readonly cause?: unknown;

  /** @internal */
  constructor(
    message: string,
    code: AgentKitConnectionErrorCode,
    options: { retryable?: boolean; cause?: unknown } = {}
  ) {
    super(message);
    this.name = 'ScalekitAgentKitConnectionError';
    this.code = code;
    this.retryable = options.retryable ?? false;
    this.cause = options.cause;
  }
}

/** Field-level detail the server attaches to a generic "Validation error", as `field: reason`. */
function fieldViolations(error: ScalekitServerException): string {
  const parts: string[] = [];
  for (const detail of error.unpackedDetails ?? []) {
    for (const violation of detail.validationErrorInfo?.fieldViolations ?? []) {
      const field = violation.field.replace(/^connection\./, '');
      parts.push(
        field ? `${field}: ${violation.description}` : violation.description
      );
    }
  }
  return parts.join('; ');
}

/**
 * Maps a server error from a connection call to a {@link ScalekitAgentKitConnectionError}.
 * Errors that are not server errors are returned unchanged.
 * @internal
 */
export function toAgentKitConnectionError(
  error: unknown,
  action: 'read' | 'write'
): unknown {
  if (!(error instanceof ScalekitServerException)) return error;
  const violations = fieldViolations(error);
  const base = (error.message || '').trim();
  const message = violations
    ? base
      ? `${base}: ${violations}`
      : violations
    : base;
  const lowered = message.toLowerCase();
  const serverCode = (error.errorCode || '').toUpperCase();
  const options = { cause: error };

  if (error instanceof ScalekitNotFoundException) {
    return new ScalekitAgentKitConnectionError(
      'Connection not found in this environment.',
      'CONNECTION_NOT_FOUND',
      options
    );
  }
  if (
    error instanceof ScalekitUnauthorizedException ||
    error instanceof ScalekitForbiddenException
  ) {
    return new ScalekitAgentKitConnectionError(
      `The API credentials are not allowed to ${action} connections. Check the client id, secret and permissions.`,
      'NOT_AUTHORIZED',
      options
    );
  }
  if (
    error instanceof ScalekitServiceUnavailableException ||
    error instanceof ScalekitGatewayTimeoutException
  ) {
    return new ScalekitAgentKitConnectionError(
      action === 'write'
        ? 'The request was sent but the service did not answer in time. The change may or may not have been applied. Read the connection to check.'
        : 'The service is unavailable or timed out. Nothing was changed; try again.',
      action === 'write' ? 'OUTCOME_UNKNOWN' : 'REQUEST_FAILED',
      { ...options, retryable: true }
    );
  }
  if (
    serverCode === 'CONNECTION_ACCOUNT_EXISTS_FOR_CONNECTION' ||
    serverCode === 'CONNECTION_REFERENCED_BY_MCP_CONFIG' ||
    lowered.includes('connected accounts') ||
    lowered.includes('mcp configurations')
  ) {
    return new ScalekitAgentKitConnectionError(
      message || 'The connection is still in use.',
      'CONNECTION_IN_USE',
      options
    );
  }
  if (
    error instanceof ScalekitConflictException ||
    serverCode === 'DUPLICATE_IDENTIFIER' ||
    serverCode === 'RESTRICTED_CONNECTION_NAME' ||
    lowered.includes('is already used') ||
    lowered.includes('is reserved')
  ) {
    return new ScalekitAgentKitConnectionError(
      message || 'The connection name is already used or reserved.',
      'CONNECTION_NAME_CONFLICT',
      options
    );
  }
  if (error instanceof ScalekitBadRequestException) {
    if (
      serverCode.includes('INVALID_RESOURCE_IDENTIFIER') ||
      lowered.includes('not a valid connection id')
    ) {
      return new ScalekitAgentKitConnectionError(
        'The connection id is not valid. Connection ids look like conn_...',
        'INVALID_CONNECTION_ID',
        options
      );
    }
    if (lowered.includes('has several auth types')) {
      return new ScalekitAgentKitConnectionError(
        message,
        'AMBIGUOUS_AUTH_TYPE',
        options
      );
    }
    if (lowered.includes('connector "') && lowered.includes('not found')) {
      return new ScalekitAgentKitConnectionError(
        message,
        'PROVIDER_NOT_FOUND',
        options
      );
    }
    return new ScalekitAgentKitConnectionError(
      message || 'The server rejected the request.',
      'INVALID_CONFIGURATION',
      options
    );
  }
  return new ScalekitAgentKitConnectionError(
    message || 'The request failed.',
    'REQUEST_FAILED',
    options
  );
}
