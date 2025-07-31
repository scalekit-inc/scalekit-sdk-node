import { ConnectError, Code } from '@connectrpc/connect';
import { AxiosResponse } from 'axios';
import { ScalekitServerException } from './base-exception';
import {
  ScalekitBadRequestException,
  ScalekitUnauthorizedException,
  ScalekitForbiddenException,
  ScalekitNotFoundException,
  ScalekitConflictException,
  ScalekitTooManyRequestsException,
  ScalekitCancelledException,
  ScalekitInternalServerException,
  ScalekitNotImplementedException,
  ScalekitServiceUnavailableException,
  ScalekitGatewayTimeoutException,
  ScalekitUnknownException,
} from './specific-exceptions';

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

/**
 * Factory function to create specific Scalekit exceptions from gRPC or HTTP errors
 */
export function scalekitException(error: ConnectError | AxiosResponse): ScalekitServerException {
  const grpcStatus = error instanceof ConnectError 
    ? error.code 
    : HTTP_TO_GRPC[error.status] || Code.Unknown;

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