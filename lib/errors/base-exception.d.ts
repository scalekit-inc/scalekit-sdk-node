import { ConnectError, Code } from '@connectrpc/connect';
import { AxiosResponse } from 'axios';
import { ErrorInfo } from '../pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
export declare class ScalekitException extends Error {
    constructor(error: any);
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
    static promote(error: AxiosResponse | ConnectError): ScalekitServerException;
}
