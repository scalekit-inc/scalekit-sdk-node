import { Code } from '@connectrpc/connect';

// gRPC code names for reverse lookup
export const GRPC_CODE_NAMES: Record<number, string> = {
  [Code.InvalidArgument]: 'INVALID_ARGUMENT',
  [Code.Unauthenticated]: 'UNAUTHENTICATED',
  [Code.PermissionDenied]: 'PERMISSION_DENIED',
  [Code.NotFound]: 'NOT_FOUND',
  [Code.AlreadyExists]: 'ALREADY_EXISTS',
  [Code.ResourceExhausted]: 'RESOURCE_EXHAUSTED',
  [Code.Unavailable]: 'UNAVAILABLE',
  [Code.DeadlineExceeded]: 'DEADLINE_EXCEEDED',
  [Code.Unknown]: 'UNKNOWN',
};

// Mapping from gRPC codes to HTTP status codes
export const GRPC_TO_HTTP_STATUS: Record<number, number> = {
  [Code.InvalidArgument]: 400,
  [Code.Unauthenticated]: 401,
  [Code.PermissionDenied]: 403,
  [Code.NotFound]: 404,
  [Code.AlreadyExists]: 409,
  [Code.ResourceExhausted]: 429,
  [Code.Unavailable]: 503,
  [Code.DeadlineExceeded]: 408,
  [Code.Unknown]: 500,
};

// Helper function to get gRPC code name
export function getGrpcCodeName(code: number): string {
  return GRPC_CODE_NAMES[code] || 'UNKNOWN';
}

// Helper function to get HTTP status from gRPC code
export function getHttpStatusFromGrpcCode(grpcCode: number): number {
  return GRPC_TO_HTTP_STATUS[grpcCode] || 500;
}

// Helper function to get gRPC code from HTTP status
export function getGrpcCodeFromHttpStatus(httpStatus: number): number {
  const entries = Object.entries(GRPC_TO_HTTP_STATUS);
  const entry = entries.find(([_, status]) => status === httpStatus);
  return entry ? parseInt(entry[0]) : Code.Unknown;
} 