import { ConnectError, Code } from '@connectrpc/connect';
import { ScalekitServerException } from './base-exception';
import {
  ScalekitInvalidArgumentException,
  ScalekitFailedPreconditionException,
  ScalekitOutOfRangeException,
  ScalekitUnauthenticatedException,
  ScalekitPermissionDeniedException,
  ScalekitNotFoundException,
  ScalekitConflictException,
  ScalekitResourceExhaustedException,
  ScalekitCancelledException,
  ScalekitDataLossException,
  ScalekitUnknownException,
  ScalekitInternalServerException,
  ScalekitUnimplementedException,
  ScalekitServiceUnavailableException,
  ScalekitDeadlineExceededException,
} from './specific-exceptions';

/**
 * Factory function to create specific Scalekit exceptions from gRPC errors
 */
export function scalekitException(grpcError: ConnectError): ScalekitServerException {
  const grpcStatus = grpcError.code;

  switch (grpcStatus) {
    case Code.InvalidArgument:
      return new ScalekitInvalidArgumentException(grpcError);
    case Code.FailedPrecondition:
      return new ScalekitFailedPreconditionException(grpcError);
    case Code.OutOfRange:
      return new ScalekitOutOfRangeException(grpcError);
    case Code.Unauthenticated:
      return new ScalekitUnauthenticatedException(grpcError);
    case Code.PermissionDenied:
      return new ScalekitPermissionDeniedException(grpcError);
    case Code.NotFound:
      return new ScalekitNotFoundException(grpcError);
    case Code.AlreadyExists:
    case Code.Aborted:
      return new ScalekitConflictException(grpcError);
    case Code.ResourceExhausted:
      return new ScalekitResourceExhaustedException(grpcError);
    case Code.Canceled:
      return new ScalekitCancelledException(grpcError);
    case Code.DataLoss:
      return new ScalekitDataLossException(grpcError);
    case Code.Unknown:
      return new ScalekitUnknownException(grpcError);
    case Code.Internal:
      return new ScalekitInternalServerException(grpcError);
    case Code.Unimplemented:
      return new ScalekitUnimplementedException(grpcError);
    case Code.Unavailable:
      return new ScalekitServiceUnavailableException(grpcError);
    case Code.DeadlineExceeded:
      return new ScalekitDeadlineExceededException(grpcError);
    default:
      return new ScalekitUnknownException(grpcError);
  }
} 