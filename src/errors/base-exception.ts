import { ConnectError, Code } from '@connectrpc/connect';
import { AxiosResponse } from 'axios';
import { ErrorInfo } from '../pkg/grpc/scalekit/v1/errdetails/errdetails_pb';

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
export class ScalekitException extends Error {
  constructor(error: any) {
    super(error?.message || error?.toString() || 'Unknown error');
    this.name = 'ScalekitException';
  }
}

// Webhook verification error
export class WebhookVerificationError extends ScalekitException {
  constructor(error: any) {
    super(error);
    this.name = 'WebhookVerificationError';
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
        this._httpStatus = HTTP_STATUS[error.statusText.toUpperCase() as keyof typeof HTTP_STATUS] || HTTP_STATUS.INTERNAL_SERVER_ERROR;
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
      this._errDetails = error.findDetails(ErrorInfo);
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
    return error && typeof error.status === 'number' && typeof error.statusText === 'string';
  }

  // String representation
  toString(): string {
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
    } else {
      return `\n${border}\n` +
             `Error Code: ${this._errorCode}\n` +
             `GRPC: (${this.getGrpcStatusName()}: ${this._grpcStatus})\n` +
             `HTTP: (${this.getHttpStatusName()}: ${this._httpStatus})\n` +
             `Error Details: ${this._errDetails}\n${border}\n`;
    }
  }

  // Helper method to get gRPC status name
  private getGrpcStatusName(): string {
    switch (this._grpcStatus) {
      case Code.InvalidArgument: return 'INVALID_ARGUMENT';
      case Code.FailedPrecondition: return 'FAILED_PRECONDITION';
      case Code.OutOfRange: return 'OUT_OF_RANGE';
      case Code.Unauthenticated: return 'UNAUTHENTICATED';
      case Code.PermissionDenied: return 'PERMISSION_DENIED';
      case Code.NotFound: return 'NOT_FOUND';
      case Code.AlreadyExists: return 'ALREADY_EXISTS';
      case Code.Aborted: return 'ABORTED';
      case Code.ResourceExhausted: return 'RESOURCE_EXHAUSTED';
      case Code.Canceled: return 'CANCELED';
      case Code.DataLoss: return 'DATA_LOSS';
      case Code.Unknown: return 'UNKNOWN';
      case Code.Internal: return 'INTERNAL';
      case Code.Unimplemented: return 'UNIMPLEMENTED';
      case Code.Unavailable: return 'UNAVAILABLE';
      case Code.DeadlineExceeded: return 'DEADLINE_EXCEEDED';
      default: return 'UNKNOWN';
    }
  }

  // Helper method to get HTTP status name
  private getHttpStatusName(): string {
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

  static promote(error: AxiosResponse | ConnectError): ScalekitServerException {
    // Use dynamic import to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const specific = require('./specific-exceptions');
    const grpcStatus = error instanceof ConnectError
      ? error.code
      : HTTP_TO_GRPC[error.status] || Code.Unknown;

    switch (grpcStatus) {
      case Code.InvalidArgument:
      case Code.FailedPrecondition:
      case Code.OutOfRange:
        return new specific.ScalekitBadRequestException(error);
      case Code.Unauthenticated:
        return new specific.ScalekitUnauthorizedException(error);
      case Code.PermissionDenied:
        return new specific.ScalekitForbiddenException(error);
      case Code.NotFound:
        return new specific.ScalekitNotFoundException(error);
      case Code.AlreadyExists:
      case Code.Aborted:
        return new specific.ScalekitConflictException(error);
      case Code.ResourceExhausted:
        return new specific.ScalekitTooManyRequestsException(error);
      case Code.Canceled:
        return new specific.ScalekitCancelledException(error);
      case Code.DataLoss:
      case Code.Unknown:
      case Code.Internal:
        return new specific.ScalekitInternalServerException(error);
      case Code.Unimplemented:
        return new specific.ScalekitNotImplementedException(error);
      case Code.Unavailable:
        return new specific.ScalekitServiceUnavailableException(error);
      case Code.DeadlineExceeded:
        return new specific.ScalekitGatewayTimeoutException(error);
      default:
        return new specific.ScalekitUnknownException(error);
    }
  }
} 