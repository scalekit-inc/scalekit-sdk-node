import { ConnectError, Code } from '@connectrpc/connect';
import { ErrorInfo } from '../pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import { GRPC_TO_HTTP_STATUS } from './grpc-codes';

// Base client exception
export class ScalekitClientException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScalekitClientException';
  }
}

// Base server exception
export class ScalekitServerException extends ConnectError {
  private _grpcStatus: Code;
  private _httpStatus: number;
  private _message: string;
  private _errDetails: any[];
  private _errorCode: string | null;
  private _unpackedDetails: ErrorInfo[];

  constructor(exception: ConnectError) {
    super(exception.message, exception.code);
    
    this._grpcStatus = exception.code;
    this._httpStatus = GRPC_TO_HTTP_STATUS[exception.code] || 500;
    this._message = exception.message;
    this._errDetails = exception.findDetails(ErrorInfo);
    this._errorCode = null;
    this._unpackedDetails = [];

    // Unpack error details
    for (const detail of this._errDetails) {
      this._unpackedDetails.push(detail);
      if (!this._errorCode) {
        this._errorCode = detail.errorCode;
      }
    }

    this.name = 'ScalekitServerException';
  }

  // String representation
  toString(): string {
    const border = '='.repeat(40);
    let detailsStr = JSON.stringify(this._unpackedDetails, null, 2);
    
    return `\n${border}\n` +
           `Error Code: ${this._errorCode}\n` +
           `GRPC: (${this._grpcStatus}: ${this._grpcStatus})\n` +
           `HTTP: (${this._httpStatus})\n` +
           `Error Details:\n` +
           `${this._message}: ${detailsStr}\n${border}\n`;
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
    return this._message;
  }

  get errDetails(): any[] {
    return this._errDetails;
  }

  get unpackedDetails(): ErrorInfo[] {
    return this._unpackedDetails;
  }
} 