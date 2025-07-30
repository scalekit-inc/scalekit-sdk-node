import { ConnectError } from '@connectrpc/connect';
import { ScalekitServerException } from './base-exception';

// Specific exception classes
export class ScalekitInvalidArgumentException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitInvalidArgumentException';
  }
}

export class ScalekitFailedPreconditionException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitFailedPreconditionException';
  }
}

export class ScalekitNotFoundException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitNotFoundException';
  }
}

export class ScalekitUnauthenticatedException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitUnauthenticatedException';
  }
}

export class ScalekitPermissionDeniedException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitPermissionDeniedException';
  }
}

export class ScalekitInternalServerException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitInternalServerException';
  }
}

export class ScalekitServiceUnavailableException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitServiceUnavailableException';
  }
}

export class ScalekitConflictException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitConflictException';
  }
}

export class ScalekitResourceExhaustedException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitResourceExhaustedException';
  }
}

export class ScalekitUnknownException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitUnknownException';
  }
}

export class ScalekitUnimplementedException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitUnimplementedException';
  }
}

export class ScalekitDeadlineExceededException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitDeadlineExceededException';
  }
}

export class ScalekitDataLossException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitDataLossException';
  }
}

export class ScalekitOutOfRangeException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitOutOfRangeException';
  }
}

export class ScalekitCancelledException extends ScalekitServerException {
  constructor(exception: ConnectError) {
    super(exception);
    this.name = 'ScalekitCancelledException';
  }
} 