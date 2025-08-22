"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalekitUnknownException = exports.ScalekitCancelledException = exports.ScalekitGatewayTimeoutException = exports.ScalekitServiceUnavailableException = exports.ScalekitNotImplementedException = exports.ScalekitInternalServerException = exports.ScalekitTooManyRequestsException = exports.ScalekitConflictException = exports.ScalekitNotFoundException = exports.ScalekitForbiddenException = exports.ScalekitUnauthorizedException = exports.ScalekitBadRequestException = void 0;
const base_exception_1 = require("./base-exception");
// Specific exception classes 
class ScalekitBadRequestException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitBadRequestException';
    }
}
exports.ScalekitBadRequestException = ScalekitBadRequestException;
class ScalekitUnauthorizedException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitUnauthorizedException';
    }
}
exports.ScalekitUnauthorizedException = ScalekitUnauthorizedException;
class ScalekitForbiddenException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitForbiddenException';
    }
}
exports.ScalekitForbiddenException = ScalekitForbiddenException;
class ScalekitNotFoundException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitNotFoundException';
    }
}
exports.ScalekitNotFoundException = ScalekitNotFoundException;
class ScalekitConflictException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitConflictException';
    }
}
exports.ScalekitConflictException = ScalekitConflictException;
class ScalekitTooManyRequestsException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitTooManyRequestsException';
    }
}
exports.ScalekitTooManyRequestsException = ScalekitTooManyRequestsException;
class ScalekitInternalServerException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitInternalServerException';
    }
}
exports.ScalekitInternalServerException = ScalekitInternalServerException;
class ScalekitNotImplementedException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitNotImplementedException';
    }
}
exports.ScalekitNotImplementedException = ScalekitNotImplementedException;
class ScalekitServiceUnavailableException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitServiceUnavailableException';
    }
}
exports.ScalekitServiceUnavailableException = ScalekitServiceUnavailableException;
class ScalekitGatewayTimeoutException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitGatewayTimeoutException';
    }
}
exports.ScalekitGatewayTimeoutException = ScalekitGatewayTimeoutException;
class ScalekitCancelledException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitCancelledException';
    }
}
exports.ScalekitCancelledException = ScalekitCancelledException;
class ScalekitUnknownException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.name = 'ScalekitUnknownException';
    }
}
exports.ScalekitUnknownException = ScalekitUnknownException;
//# sourceMappingURL=specific-exceptions.js.map