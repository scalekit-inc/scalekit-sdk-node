import { ConnectError } from '@connectrpc/connect';
import { AxiosResponse } from 'axios';
import { ScalekitServerException } from './base-exception';
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
export declare function isToolException(e: unknown): e is IScalekitToolException;
export declare class ScalekitBadRequestException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitUnauthorizedException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitForbiddenException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitNotFoundException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitConflictException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitTooManyRequestsException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitInternalServerException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitNotImplementedException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitServiceUnavailableException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitGatewayTimeoutException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitCancelledException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
export declare class ScalekitUnknownException extends ScalekitServerException {
    constructor(error: AxiosResponse | ConnectError);
}
/**
 * Raised when an upstream provider returns a rate-limit (429) error.
 * Extends ScalekitTooManyRequestsException for backward compatibility.
 */
export declare class ScalekitToolRateLimitException extends ScalekitTooManyRequestsException implements IScalekitToolException {
    readonly isToolError: true;
    readonly toolErrorCode: string;
    readonly toolErrorMessage: string;
    readonly executionId: string;
    constructor(error: AxiosResponse | ConnectError);
}
/**
 * Raised when an upstream provider returns an unauthorized (401) error.
 * Extends ScalekitUnauthorizedException for backward compatibility.
 */
export declare class ScalekitToolUnauthorizedException extends ScalekitUnauthorizedException implements IScalekitToolException {
    readonly isToolError: true;
    readonly toolErrorCode: string;
    readonly toolErrorMessage: string;
    readonly executionId: string;
    constructor(error: AxiosResponse | ConnectError);
}
/**
 * Raised when an upstream provider returns a forbidden (403) error.
 * Extends ScalekitForbiddenException for backward compatibility.
 */
export declare class ScalekitToolForbiddenException extends ScalekitForbiddenException implements IScalekitToolException {
    readonly isToolError: true;
    readonly toolErrorCode: string;
    readonly toolErrorMessage: string;
    readonly executionId: string;
    constructor(error: AxiosResponse | ConnectError);
}
/**
 * Raised when an upstream provider returns any other error during tool execution.
 * Extends ScalekitServerException as a general-purpose base.
 */
export declare class ScalekitToolException extends ScalekitServerException implements IScalekitToolException {
    readonly isToolError: true;
    readonly toolErrorCode: string;
    readonly toolErrorMessage: string;
    readonly executionId: string;
    constructor(error: AxiosResponse | ConnectError);
}
