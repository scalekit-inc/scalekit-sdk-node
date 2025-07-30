import { ConnectError } from '@connectrpc/connect';
import { AxiosError } from 'axios';
import { ScalekitClientException, ScalekitServerException } from './base-exception';
import { scalekitException } from './exception-factory';

/**
 * Transforms various error types into Scalekit-specific exceptions
 * @param error - The original error to transform
 * @returns A ScalekitException instance
 */
export function transformError(error: any): ScalekitServerException | ScalekitClientException {
  // Handle gRPC Connect errors
  if (error instanceof ConnectError) {
    return scalekitException(error);
  }
  
  // Handle HTTP/Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status || 0;
    const message = error.response?.data?.message || error.message;
    
    // Create a mock ConnectError for HTTP errors to use the same exception hierarchy
    const mockConnectError = new ConnectError(message, status);
    return scalekitException(mockConnectError);
  }
  
  // Handle existing ScalekitException instances
  if (error instanceof ScalekitServerException || error instanceof ScalekitClientException) {
    return error;
  }
  
  // Handle generic errors
  return new ScalekitClientException(error.message || 'Unknown error occurred');
} 