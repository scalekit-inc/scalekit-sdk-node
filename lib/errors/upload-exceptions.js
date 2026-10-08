"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalekitUploadConnectionException = exports.ScalekitUploadTimeoutException = exports.ScalekitUploadProtocolException = exports.ScalekitUploadSessionExpiredException = exports.ScalekitUploadHttpException = void 0;
const connect_1 = require("@connectrpc/connect");
const base_exception_1 = require("./base-exception");
const specific_exceptions_1 = require("./specific-exceptions");
// Errors raised by `actions.uploadResumable`. Every one of them carries
// `uploadId` (undefined when the session was never started) and
// `bytesCommitted` (the bytes the server has confirmed), so a caller can log
// how far the upload got. None of them carries the access token.
/** HTTP statuses after which retrying the same upload may succeed. */
const RETRYABLE_UPLOAD_STATUSES = new Set([
    408, 429, 500, 502, 503, 504,
]);
function defineCause(target, cause) {
    Object.defineProperty(target, 'cause', {
        value: cause,
        writable: true,
        configurable: true,
        enumerable: false,
    });
}
function defineMessage(target, message) {
    Object.defineProperty(target, 'message', {
        value: message,
        writable: true,
        configurable: true,
        enumerable: false,
    });
}
/**
 * An upload request got an HTTP error response.
 *
 * Raised when the session-start request fails (then `uploadId` is
 * `undefined`), when a chunk gets a 4xx other than 404/410 or a 2xx other
 * than 200/201, and when a
 * retryable status (408, 429, 500, 502, 503, 504) is still failing after
 * `maxRetries` retries. `status` is the real HTTP status; `httpStatus`
 * returns the same value.
 */
class ScalekitUploadHttpException extends base_exception_1.ScalekitServerException {
    /** @internal */
    constructor(init) {
        // A minimal response, so the base class keeps no request config.
        super({
            status: init.status,
            statusText: init.statusText,
            headers: init.headers,
            data: init.body,
            config: {},
        });
        this.name = 'ScalekitUploadHttpException';
        defineMessage(this, init.message);
        defineCause(this, init.cause);
        this.uploadId = init.uploadId;
        this.bytesCommitted = init.bytesCommitted;
        this.status = init.status;
        this.headers = init.headers;
        this.body = init.body;
        this.retryable = RETRYABLE_UPLOAD_STATUSES.has(init.status);
    }
    /** The HTTP status of the failed response (same as `status`). */
    get httpStatus() {
        return this.status;
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
}
exports.ScalekitUploadHttpException = ScalekitUploadHttpException;
/**
 * The upload session no longer exists: a chunk or status request got 404 or
 * 410. Google upload sessions expire after about a week. The SDK does not
 * start a new session on its own; call `uploadResumable` again to upload
 * from the beginning.
 */
class ScalekitUploadSessionExpiredException extends ScalekitUploadHttpException {
    /** @internal */
    constructor(init) {
        super(init);
        this.name = 'ScalekitUploadSessionExpiredException';
    }
}
exports.ScalekitUploadSessionExpiredException = ScalekitUploadSessionExpiredException;
/**
 * The server's response broke the resumable-upload protocol: no `upload_id`
 * in the session-start response, a malformed or out-of-range `Range` header,
 * an unexpected redirect, a completed upload before the last chunk was sent
 * (so a truncated file is never returned), a chunk that still commits no new
 * bytes after `maxRetries` retries, or a final response body that is not a
 * JSON object.
 */
class ScalekitUploadProtocolException extends base_exception_1.ScalekitException {
    /** @internal */
    constructor(init) {
        super(init.message);
        this.name = 'ScalekitUploadProtocolException';
        defineCause(this, init.cause);
        this.uploadId = init.uploadId;
        this.bytesCommitted = init.bytesCommitted;
        this.status = init.status;
        this.headers = init.headers;
        this.body = init.body;
        this.retryable = false;
    }
}
exports.ScalekitUploadProtocolException = ScalekitUploadProtocolException;
/**
 * An upload request timed out. On a chunk this is raised only after
 * `maxRetries` retries; the session-start request is never retried.
 * Extends `ScalekitGatewayTimeoutException`, the type other SDK calls raise
 * on a timeout.
 */
class ScalekitUploadTimeoutException extends specific_exceptions_1.ScalekitGatewayTimeoutException {
    /** @internal */
    constructor(init) {
        super(new connect_1.ConnectError(init.message, connect_1.Code.DeadlineExceeded));
        this.name = 'ScalekitUploadTimeoutException';
        defineMessage(this, init.message);
        defineCause(this, init.cause);
        this.uploadId = init.uploadId;
        this.bytesCommitted = init.bytesCommitted;
        this.retryable = true;
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
}
exports.ScalekitUploadTimeoutException = ScalekitUploadTimeoutException;
/**
 * An upload request got no response (connection refused or reset, DNS
 * failure). On a chunk this is raised only after `maxRetries` retries; the
 * session-start request is never retried.
 */
class ScalekitUploadConnectionException extends base_exception_1.ScalekitException {
    /** @internal */
    constructor(init) {
        super(init.message);
        this.name = 'ScalekitUploadConnectionException';
        defineCause(this, init.cause);
        this.uploadId = init.uploadId;
        this.bytesCommitted = init.bytesCommitted;
        this.retryable = true;
    }
}
exports.ScalekitUploadConnectionException = ScalekitUploadConnectionException;
//# sourceMappingURL=upload-exceptions.js.map