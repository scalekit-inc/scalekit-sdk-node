import { ConnectError } from '@connectrpc/connect';
import { AxiosResponse } from 'axios';
import { ScalekitServerException } from './base-exception';

// Specific exception classes 
export class ScalekitBadRequestException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitBadRequestException';
  }
}

export class ScalekitUnauthorizedException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitUnauthorizedException';
  }
}

export class ScalekitForbiddenException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitForbiddenException';
  }
}

export class ScalekitNotFoundException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitNotFoundException';
  }
}

export class ScalekitConflictException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitConflictException';
  }
}

export class ScalekitTooManyRequestsException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitTooManyRequestsException';
  }
}

export class ScalekitInternalServerException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitInternalServerException';
  }
}

export class ScalekitNotImplementedException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitNotImplementedException';
  }
}

export class ScalekitServiceUnavailableException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitServiceUnavailableException';
  }
}

export class ScalekitGatewayTimeoutException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitGatewayTimeoutException';
  }
}

export class ScalekitCancelledException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitCancelledException';
  }
}

export class ScalekitUnknownException extends ScalekitServerException {
  constructor(error: AxiosResponse | ConnectError) {
    super(error);
    this.name = 'ScalekitUnknownException';
  }
} 