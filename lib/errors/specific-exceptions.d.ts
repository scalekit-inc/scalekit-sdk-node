import { ConnectError } from '@connectrpc/connect';
import { AxiosResponse } from 'axios';
import { ScalekitServerException } from './base-exception';
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
