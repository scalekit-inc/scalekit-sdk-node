"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalekitToolException = exports.ScalekitToolForbiddenException = exports.ScalekitToolUnauthorizedException = exports.ScalekitToolRateLimitException = exports.ScalekitUnknownException = exports.ScalekitCancelledException = exports.ScalekitGatewayTimeoutException = exports.ScalekitServiceUnavailableException = exports.ScalekitNotImplementedException = exports.ScalekitInternalServerException = exports.ScalekitTooManyRequestsException = exports.ScalekitConflictException = exports.ScalekitNotFoundException = exports.ScalekitForbiddenException = exports.ScalekitUnauthorizedException = exports.ScalekitBadRequestException = void 0;
exports.isToolException = isToolException;
const base_exception_1 = require("./base-exception");
/**
 * Type guard: returns true for any exception that originated from an upstream
 * tool provider (i.e. has errorCode == "TOOL_ERROR" in the gRPC status details).
 *
 * Usage:
 *   catch (e) {
 *     if (isToolException(e)) { // e is IScalekitToolException here
 *       console.log(e.toolErrorCode, e.executionId);
 *     }
 *   }
 */
function isToolException(e) {
    return (e instanceof base_exception_1.ScalekitServerException && e.isToolError === true);
}
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
// ---------------------------------------------------------------------------
// Tool exception concrete classes
// ---------------------------------------------------------------------------
/**
 * Extract ToolErrorInfo fields from the ConnectError details via the parent's
 * unpackedDetails (already populated by ScalekitServerException constructor).
 */
function extractToolErrorInfo(parent) {
    for (const detail of parent.unpackedDetails) {
        if (detail.toolErrorInfo) {
            return {
                toolErrorCode: detail.toolErrorInfo.toolErrorCode,
                toolErrorMessage: detail.toolErrorInfo.toolErrorMessage,
                executionId: detail.toolErrorInfo.executionId,
            };
        }
    }
    return { toolErrorCode: '', toolErrorMessage: '', executionId: '' };
}
/**
 * Raised when an upstream provider returns a rate-limit (429) error.
 * Extends ScalekitTooManyRequestsException for backward compatibility.
 */
class ScalekitToolRateLimitException extends ScalekitTooManyRequestsException {
    constructor(error) {
        super(error);
        this.isToolError = true;
        this.name = 'ScalekitToolRateLimitException';
        const info = extractToolErrorInfo(this);
        this.toolErrorCode = info.toolErrorCode;
        this.toolErrorMessage = info.toolErrorMessage;
        this.executionId = info.executionId;
    }
}
exports.ScalekitToolRateLimitException = ScalekitToolRateLimitException;
/**
 * Raised when an upstream provider returns an unauthorized (401) error.
 * Extends ScalekitUnauthorizedException for backward compatibility.
 */
class ScalekitToolUnauthorizedException extends ScalekitUnauthorizedException {
    constructor(error) {
        super(error);
        this.isToolError = true;
        this.name = 'ScalekitToolUnauthorizedException';
        const info = extractToolErrorInfo(this);
        this.toolErrorCode = info.toolErrorCode;
        this.toolErrorMessage = info.toolErrorMessage;
        this.executionId = info.executionId;
    }
}
exports.ScalekitToolUnauthorizedException = ScalekitToolUnauthorizedException;
/**
 * Raised when an upstream provider returns a forbidden (403) error.
 * Extends ScalekitForbiddenException for backward compatibility.
 */
class ScalekitToolForbiddenException extends ScalekitForbiddenException {
    constructor(error) {
        super(error);
        this.isToolError = true;
        this.name = 'ScalekitToolForbiddenException';
        const info = extractToolErrorInfo(this);
        this.toolErrorCode = info.toolErrorCode;
        this.toolErrorMessage = info.toolErrorMessage;
        this.executionId = info.executionId;
    }
}
exports.ScalekitToolForbiddenException = ScalekitToolForbiddenException;
/**
 * Raised when an upstream provider returns any other error during tool execution.
 * Extends ScalekitServerException as a general-purpose base.
 */
class ScalekitToolException extends base_exception_1.ScalekitServerException {
    constructor(error) {
        super(error);
        this.isToolError = true;
        this.name = 'ScalekitToolException';
        const info = extractToolErrorInfo(this);
        this.toolErrorCode = info.toolErrorCode;
        this.toolErrorMessage = info.toolErrorMessage;
        this.executionId = info.executionId;
    }
}
exports.ScalekitToolException = ScalekitToolException;
//# sourceMappingURL=specific-exceptions.js.map