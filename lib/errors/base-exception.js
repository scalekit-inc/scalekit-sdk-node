"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalekitServerException = exports.ScalekitValidateTokenFailureException = exports.WebhookVerificationError = exports.ScalekitException = void 0;
const connect_1 = require("@connectrpc/connect");
const errdetails_pb_1 = require("../pkg/grpc/scalekit/v1/errdetails/errdetails_pb");
// gRPC to HTTP status mapping
const GRPC_TO_HTTP = {
    [connect_1.Code.InvalidArgument]: 400,
    [connect_1.Code.FailedPrecondition]: 400,
    [connect_1.Code.OutOfRange]: 400,
    [connect_1.Code.Unauthenticated]: 401,
    [connect_1.Code.PermissionDenied]: 403,
    [connect_1.Code.NotFound]: 404,
    [connect_1.Code.AlreadyExists]: 409,
    [connect_1.Code.Aborted]: 409,
    [connect_1.Code.ResourceExhausted]: 429,
    [connect_1.Code.Canceled]: 499,
    [connect_1.Code.DataLoss]: 500,
    [connect_1.Code.Unknown]: 500,
    [connect_1.Code.Internal]: 500,
    [connect_1.Code.Unimplemented]: 501,
    [connect_1.Code.Unavailable]: 503,
    [connect_1.Code.DeadlineExceeded]: 504,
};
// HTTP to gRPC status mapping
const HTTP_TO_GRPC = {
    200: connect_1.Code.Unknown, // No direct mapping for 200
    400: connect_1.Code.InvalidArgument,
    401: connect_1.Code.Unauthenticated,
    403: connect_1.Code.PermissionDenied,
    404: connect_1.Code.NotFound,
    409: connect_1.Code.AlreadyExists,
    429: connect_1.Code.ResourceExhausted,
    500: connect_1.Code.Internal,
    501: connect_1.Code.Unimplemented,
    503: connect_1.Code.Unavailable,
    504: connect_1.Code.DeadlineExceeded,
};
// HTTP status constants
const HTTP_STATUS = {
    'OK': 200,
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'CONFLICT': 409,
    'TOO_MANY_REQUESTS': 429,
    'INTERNAL_SERVER_ERROR': 500,
    'NOT_IMPLEMENTED': 501,
    'SERVICE_UNAVAILABLE': 503,
    'GATEWAY_TIMEOUT': 504,
};
// Base exception class
class ScalekitException extends Error {
    constructor(error) {
        super((error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : error.toString()) || 'Unknown error');
        this.name = 'ScalekitException';
    }
}
exports.ScalekitException = ScalekitException;
// Webhook verification error
class WebhookVerificationError extends ScalekitException {
    constructor(error) {
        super(error);
        this.name = 'WebhookVerificationError';
    }
}
exports.WebhookVerificationError = WebhookVerificationError;
// Token validation failure exception
class ScalekitValidateTokenFailureException extends ScalekitException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitValidateTokenFailureException';
    }
}
exports.ScalekitValidateTokenFailureException = ScalekitValidateTokenFailureException;
// Base server exception
class ScalekitServerException extends ScalekitException {
    constructor(error) {
        super(error);
        this._unpackedDetails = [];
        if (this.isAxiosResponse(error)) {
            // Handle HTTP Response errors
            if (error.statusText && typeof error.statusText === 'string') {
                this._httpStatus = HTTP_STATUS[error.statusText.toUpperCase()] || HTTP_STATUS.INTERNAL_SERVER_ERROR;
            }
            else {
                this._httpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            }
            this._grpcStatus = HTTP_TO_GRPC[error.status] || connect_1.Code.Unknown;
            this._errorCode = error.statusText;
            this._errDetails = error.data;
            this._message = null;
        }
        else {
            // Handle gRPC ConnectError
            this._grpcStatus = error.code;
            this._httpStatus = GRPC_TO_HTTP[error.code] || 500;
            this._message = error.message;
            this._errDetails = error.findDetails(errdetails_pb_1.ErrorInfo);
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
    isAxiosResponse(error) {
        return error && typeof error.status === 'number' && typeof error.statusText === 'string';
    }
    // String representation
    toString() {
        const border = '='.repeat(40);
        if (this._unpackedDetails.length > 0) {
            let detailsStr = JSON.stringify(this._unpackedDetails, null, 2);
            // Format the JSON string for better readability
            if (detailsStr.startsWith("[") && detailsStr.includes("\n")) {
                detailsStr = "[\n" + detailsStr.substring(1);
            }
            return `\n${border}\n` +
                `Error Code: ${this._errorCode}\n` +
                `GRPC: (${this.getGrpcStatusName()}: ${this._grpcStatus})\n` +
                `HTTP: (${this.getHttpStatusName()}: ${this._httpStatus})\n` +
                `Error Details:\n` +
                `${this._message}: ${detailsStr}\n${border}\n`;
        }
        else {
            return `\n${border}\n` +
                `Error Code: ${this._errorCode}\n` +
                `GRPC: (${this.getGrpcStatusName()}: ${this._grpcStatus})\n` +
                `HTTP: (${this.getHttpStatusName()}: ${this._httpStatus})\n` +
                `Error Details: ${this._errDetails}\n${border}\n`;
        }
    }
    // Helper method to get gRPC status name
    getGrpcStatusName() {
        switch (this._grpcStatus) {
            case connect_1.Code.InvalidArgument: return 'INVALID_ARGUMENT';
            case connect_1.Code.FailedPrecondition: return 'FAILED_PRECONDITION';
            case connect_1.Code.OutOfRange: return 'OUT_OF_RANGE';
            case connect_1.Code.Unauthenticated: return 'UNAUTHENTICATED';
            case connect_1.Code.PermissionDenied: return 'PERMISSION_DENIED';
            case connect_1.Code.NotFound: return 'NOT_FOUND';
            case connect_1.Code.AlreadyExists: return 'ALREADY_EXISTS';
            case connect_1.Code.Aborted: return 'ABORTED';
            case connect_1.Code.ResourceExhausted: return 'RESOURCE_EXHAUSTED';
            case connect_1.Code.Canceled: return 'CANCELED';
            case connect_1.Code.DataLoss: return 'DATA_LOSS';
            case connect_1.Code.Unknown: return 'UNKNOWN';
            case connect_1.Code.Internal: return 'INTERNAL';
            case connect_1.Code.Unimplemented: return 'UNIMPLEMENTED';
            case connect_1.Code.Unavailable: return 'UNAVAILABLE';
            case connect_1.Code.DeadlineExceeded: return 'DEADLINE_EXCEEDED';
            default: return 'UNKNOWN';
        }
    }
    // Helper method to get HTTP status name
    getHttpStatusName() {
        switch (this._httpStatus) {
            case 200: return 'OK';
            case 400: return 'BAD_REQUEST';
            case 401: return 'UNAUTHORIZED';
            case 403: return 'FORBIDDEN';
            case 404: return 'NOT_FOUND';
            case 409: return 'CONFLICT';
            case 429: return 'TOO_MANY_REQUESTS';
            case 500: return 'INTERNAL_SERVER_ERROR';
            case 501: return 'NOT_IMPLEMENTED';
            case 503: return 'SERVICE_UNAVAILABLE';
            case 504: return 'GATEWAY_TIMEOUT';
            default: return 'INTERNAL_SERVER_ERROR';
        }
    }
    // Getters
    get grpcStatus() {
        return this._grpcStatus;
    }
    get httpStatus() {
        return this._httpStatus;
    }
    get errorCode() {
        return this._errorCode;
    }
    get message() {
        return this._message || super.message;
    }
    get errDetails() {
        return this._errDetails;
    }
    get unpackedDetails() {
        return this._unpackedDetails;
    }
    static promote(error) {
        // Use dynamic import to avoid circular dependency
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const specific = require('./specific-exceptions');
        const grpcStatus = error instanceof connect_1.ConnectError
            ? error.code
            : HTTP_TO_GRPC[error.status] || connect_1.Code.Unknown;
        switch (grpcStatus) {
            case connect_1.Code.InvalidArgument:
            case connect_1.Code.FailedPrecondition:
            case connect_1.Code.OutOfRange:
                return new specific.ScalekitBadRequestException(error);
            case connect_1.Code.Unauthenticated:
                return new specific.ScalekitUnauthorizedException(error);
            case connect_1.Code.PermissionDenied:
                return new specific.ScalekitForbiddenException(error);
            case connect_1.Code.NotFound:
                return new specific.ScalekitNotFoundException(error);
            case connect_1.Code.AlreadyExists:
            case connect_1.Code.Aborted:
                return new specific.ScalekitConflictException(error);
            case connect_1.Code.ResourceExhausted:
                return new specific.ScalekitTooManyRequestsException(error);
            case connect_1.Code.Canceled:
                return new specific.ScalekitCancelledException(error);
            case connect_1.Code.DataLoss:
            case connect_1.Code.Unknown:
            case connect_1.Code.Internal:
                return new specific.ScalekitInternalServerException(error);
            case connect_1.Code.Unimplemented:
                return new specific.ScalekitNotImplementedException(error);
            case connect_1.Code.Unavailable:
                return new specific.ScalekitServiceUnavailableException(error);
            case connect_1.Code.DeadlineExceeded:
                return new specific.ScalekitGatewayTimeoutException(error);
            default:
                return new specific.ScalekitUnknownException(error);
        }
    }
}
exports.ScalekitServerException = ScalekitServerException;
//# sourceMappingURL=base-exception.js.map