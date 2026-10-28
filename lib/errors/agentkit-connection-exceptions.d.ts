import { ScalekitException } from './base-exception';
/** Stable, machine-readable reason of a {@link ScalekitAgentKitConnectionError}. */
export type AgentKitConnectionErrorCode = 'INVALID_CONNECTION_ID' | 'CONNECTION_NOT_FOUND' | 'NOT_AUTHORIZED' | 'INVALID_CONFIGURATION' | 'CONNECTION_NAME_CONFLICT' | 'CONNECTION_IN_USE' | 'PROVIDER_NOT_FOUND' | 'AMBIGUOUS_AUTH_TYPE' | 'OUTCOME_UNKNOWN' | 'REQUEST_FAILED';
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
export declare class ScalekitAgentKitConnectionError extends ScalekitException {
    readonly code: AgentKitConnectionErrorCode;
    readonly retryable: boolean;
    readonly cause?: unknown;
    /** @internal */
    constructor(message: string, code: AgentKitConnectionErrorCode, options?: {
        retryable?: boolean;
        cause?: unknown;
    });
}
/**
 * Maps a server error from a connection call to a {@link ScalekitAgentKitConnectionError}.
 * Errors that are not server errors are returned unchanged.
 * @internal
 */
export declare function toAgentKitConnectionError(error: unknown, action: 'read' | 'write'): unknown;
