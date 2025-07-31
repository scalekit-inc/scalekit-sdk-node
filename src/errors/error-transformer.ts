import { ConnectError } from '@connectrpc/connect';
import { AxiosError, AxiosResponse } from 'axios';
import { ScalekitException, ScalekitServerException, WebhookVerificationError, ScalekitValidateTokenFailureException } from './base-exception';
import { scalekitException } from './exception-factory';

/**
 * Transforms various error types into Scalekit-specific exceptions
 * @param error - The original error to transform
 * @returns A ScalekitException instance
 */
export function transformError(error: any): ScalekitException {
  // Handle gRPC Connect errors
  if (error instanceof ConnectError) {
    return scalekitException(error);
  }
  
  // Handle HTTP/Axios errors
  if (error instanceof AxiosError) {
    if (error.response) {
      return scalekitException(error.response);
    } else {
      // Network error or other Axios error
      return new ScalekitException(error);
    }
  }
  
  // Handle existing ScalekitException instances
  if (error instanceof ScalekitException) {
    return error;
  }
  
  // Handle generic errors
  return new ScalekitException(error);
} 