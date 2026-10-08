import { ConnectError, Code } from '@connectrpc/connect';
import { AxiosResponse } from 'axios';
import type { ErrorInfo } from '../pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
export declare class ScalekitException extends Error {
    constructor(error: any);
}
/**
 * A method argument is invalid. Thrown before any network call, so nothing
 * was sent. Fix the argument named in the message; retrying unchanged fails
 * the same way.
 */
export declare class ScalekitValidationError extends ScalekitException {
    /** Always `false`: the same input fails the same way. */
    readonly retryable: boolean;
    /** @internal */
    constructor(message: string);
}
/**
 * The caller's `AbortSignal` cancelled the call, including during a wait
 * between retries. `cause` is the signal's `reason`.
 */
export declare class ScalekitAbortError extends ScalekitException {
    /** Always `false`: the caller asked to stop. */
    readonly retryable: boolean;
    /** The aborting signal's `reason`. */
    readonly cause: unknown;
    /** @internal */
    constructor(message: string, cause?: unknown);
}
export declare class WebhookVerificationError extends ScalekitException {
    constructor(error: any);
}
export declare class ScalekitValidateTokenFailureException extends ScalekitException {
    constructor(error: any);
}
export declare class ScalekitServerException extends ScalekitException {
    private _grpcStatus;
    private _httpStatus;
    private _message;
    private _errDetails;
    private _errorCode;
    private _unpackedDetails;
    constructor(error: AxiosResponse | ConnectError);
    private isAxiosResponse;
    toString(): string;
    private getGrpcStatusName;
    private getHttpStatusName;
    get grpcStatus(): Code;
    get httpStatus(): number;
    get errorCode(): string | null;
    get message(): string;
    get errDetails(): any;
    get unpackedDetails(): ErrorInfo[];
    static promote(error: AxiosResponse | ConnectError, isToolError?: boolean): ScalekitServerException;
}
