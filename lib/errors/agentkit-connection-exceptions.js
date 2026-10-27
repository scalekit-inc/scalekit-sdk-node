"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalekitAgentKitConnectionError = void 0;
exports.toAgentKitConnectionError = toAgentKitConnectionError;
const base_exception_1 = require("./base-exception");
const specific_exceptions_1 = require("./specific-exceptions");
const base_exception_2 = require("./base-exception");
/**
 * Raised by the AgentKit connection methods on `scalekit.actions`
 * (`createConnection`, `getConnection`, `listConnections`, `updateConnection`,
 * `deleteConnection`).
 *
 * `code` says what went wrong, `retryable` whether the same call can succeed
 * later, and `cause` is the original {@link ScalekitServerException} with the
 * server error code, gRPC status and message. Arguments that are invalid
 * before any request is sent raise `ScalekitValidationError` instead.
 *
 * `OUTCOME_UNKNOWN` means the request was sent but the service did not answer
 * in time: the change may or may not have been applied. Read the connection to
 * check before repeating a create.
 */
class ScalekitAgentKitConnectionError extends base_exception_1.ScalekitException {
    /** @internal */
    constructor(message, code, options = {}) {
        var _a;
        super(message);
        this.name = 'ScalekitAgentKitConnectionError';
        this.code = code;
        this.retryable = (_a = options.retryable) !== null && _a !== void 0 ? _a : false;
        this.cause = options.cause;
    }
}
exports.ScalekitAgentKitConnectionError = ScalekitAgentKitConnectionError;
/** Field-level detail the server attaches to a generic "Validation error", as `field: reason`. */
function fieldViolations(error) {
    var _a, _b, _c;
    const parts = [];
    for (const detail of (_a = error.unpackedDetails) !== null && _a !== void 0 ? _a : []) {
        for (const violation of (_c = (_b = detail.validationErrorInfo) === null || _b === void 0 ? void 0 : _b.fieldViolations) !== null && _c !== void 0 ? _c : []) {
            const field = violation.field.replace(/^connection\./, '');
            parts.push(field ? `${field}: ${violation.description}` : violation.description);
        }
    }
    return parts.join('; ');
}
/**
 * Maps a server error from a connection call to a {@link ScalekitAgentKitConnectionError}.
 * Errors that are not server errors are returned unchanged.
 * @internal
 */
function toAgentKitConnectionError(error, action) {
    if (!(error instanceof base_exception_2.ScalekitServerException))
        return error;
    const violations = fieldViolations(error);
    const base = (error.message || '').trim();
    const message = violations
        ? base
            ? `${base}: ${violations}`
            : violations
        : base;
    const lowered = message.toLowerCase();
    const serverCode = (error.errorCode || '').toUpperCase();
    const options = { cause: error };
    if (error instanceof specific_exceptions_1.ScalekitNotFoundException) {
        return new ScalekitAgentKitConnectionError('Connection not found in this environment.', 'CONNECTION_NOT_FOUND', options);
    }
    if (error instanceof specific_exceptions_1.ScalekitUnauthorizedException ||
        error instanceof specific_exceptions_1.ScalekitForbiddenException) {
        return new ScalekitAgentKitConnectionError(`The API credentials are not allowed to ${action} connections. Check the client id, secret and permissions.`, 'NOT_AUTHORIZED', options);
    }
    if (error instanceof specific_exceptions_1.ScalekitServiceUnavailableException ||
        error instanceof specific_exceptions_1.ScalekitGatewayTimeoutException) {
        return new ScalekitAgentKitConnectionError(action === 'write'
            ? 'The request was sent but the service did not answer in time. The change may or may not have been applied. Read the connection to check.'
            : 'The service is unavailable or timed out. Nothing was changed; try again.', action === 'write' ? 'OUTCOME_UNKNOWN' : 'REQUEST_FAILED', Object.assign(Object.assign({}, options), { retryable: true }));
    }
    if (serverCode === 'CONNECTION_ACCOUNT_EXISTS_FOR_CONNECTION' ||
        serverCode === 'CONNECTION_REFERENCED_BY_MCP_CONFIG' ||
        lowered.includes('connected accounts') ||
        lowered.includes('mcp configurations')) {
        return new ScalekitAgentKitConnectionError(message || 'The connection is still in use.', 'CONNECTION_IN_USE', options);
    }
    if (error instanceof specific_exceptions_1.ScalekitConflictException ||
        serverCode === 'DUPLICATE_IDENTIFIER' ||
        serverCode === 'RESTRICTED_CONNECTION_NAME' ||
        lowered.includes('is already used') ||
        lowered.includes('is reserved')) {
        return new ScalekitAgentKitConnectionError(message || 'The connection name is already used or reserved.', 'CONNECTION_NAME_CONFLICT', options);
    }
    if (error instanceof specific_exceptions_1.ScalekitBadRequestException) {
        if (serverCode.includes('INVALID_RESOURCE_IDENTIFIER') ||
            lowered.includes('not a valid connection id')) {
            return new ScalekitAgentKitConnectionError('The connection id is not valid. Connection ids look like conn_...', 'INVALID_CONNECTION_ID', options);
        }
        if (lowered.includes('has several auth types')) {
            return new ScalekitAgentKitConnectionError(message, 'AMBIGUOUS_AUTH_TYPE', options);
        }
        if (lowered.includes('connector "') && lowered.includes('not found')) {
            return new ScalekitAgentKitConnectionError(message, 'PROVIDER_NOT_FOUND', options);
        }
        return new ScalekitAgentKitConnectionError(message || 'The server rejected the request.', 'INVALID_CONFIGURATION', options);
    }
    return new ScalekitAgentKitConnectionError(message || 'The request failed.', 'REQUEST_FAILED', options);
}
//# sourceMappingURL=agentkit-connection-exceptions.js.map