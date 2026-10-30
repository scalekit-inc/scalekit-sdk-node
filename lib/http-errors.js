"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPSTREAM_RESPONSE_HEADER = void 0;
exports.isPlainObject = isPlainObject;
exports.headerRecord = headerRecord;
exports.bodyText = bodyText;
exports.errorBody = errorBody;
exports.isScalekitUnauthorized = isScalekitUnauthorized;
exports.setCause = setCause;
exports.toScalekitException = toScalekitException;
const axios_1 = require("axios");
const base_exception_1 = require("./errors/base-exception");
const specific_exceptions_1 = require("./errors/specific-exceptions");
// Shared by `CoreClient` and the HTTP features built on it (the actions proxy,
// resumable uploads): reading an axios response, recognising a 401 the
// Scalekit proxy sent itself, and mapping failures to Scalekit exceptions.
function isPlainObject(value) {
    if (value === null || typeof value !== 'object')
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
function headerRecord(headers) {
    const record = {};
    if (!headers || typeof headers !== 'object')
        return record;
    const plain = headers instanceof axios_1.AxiosHeaders
        ? headers.toJSON()
        : headers;
    for (const [name, value] of Object.entries(plain)) {
        if (value === undefined || value === null)
            continue;
        record[name.toLowerCase()] = Array.isArray(value)
            ? value.map(String).join(', ')
            : String(value);
    }
    return record;
}
function bodyText(data) {
    if (data === undefined || data === null)
        return '';
    if (typeof data === 'string')
        return data;
    if (data instanceof Uint8Array)
        return Buffer.from(data).toString('utf8');
    return JSON.stringify(data);
}
function isJsonContentType(headers) {
    var _a;
    const [mime = ''] = ((_a = headers['content-type']) !== null && _a !== void 0 ? _a : '').split(';');
    const type = mime.trim().toLowerCase();
    return type === 'application/json' || type.endsWith('+json');
}
/** Error body for callers: parsed JSON when it is JSON, otherwise the text. */
function errorBody(response) {
    if (response.data !== null &&
        typeof response.data === 'object' &&
        !(response.data instanceof Uint8Array)) {
        return response.data;
    }
    const text = bodyText(response.data);
    if (text.trim() === '')
        return text;
    try {
        return JSON.parse(text);
    }
    catch (_a) {
        return text;
    }
}
/**
 * The Scalekit proxy marks every response it relays from the provider with
 * this header (any value), and never one it wrote itself.
 */
exports.UPSTREAM_RESPONSE_HEADER = 'x-scalekit-upstream';
/**
 * A 401 the Scalekit proxy itself sent because it rejected the access token
 * (JSON `{ "detail": ..., "code": "UNAUTHORIZED" }`), the one 401 a token
 * refresh can fix. Never one relayed from the provider (it carries
 * `X-Scalekit-Upstream`), and never a connected account's own credential
 * failure, which the proxy sends with code `TOOL_ERROR`. The proxy rejects
 * such a request before forwarding it, so a resend is safe.
 *
 * Proxies deployed before `TOOL_ERROR` was used here sent connected-account
 * failures as `UNAUTHORIZED` too; `CoreClient.withAccessToken` limits the
 * refreshes those cost.
 */
function isScalekitUnauthorized(response) {
    if (response.status !== 401)
        return false;
    const headers = headerRecord(response.headers);
    if (exports.UPSTREAM_RESPONSE_HEADER in headers)
        return false;
    if (!isJsonContentType(headers))
        return false;
    const body = errorBody(response);
    if (!isPlainObject(body))
        return false;
    const keys = Object.keys(body).sort();
    return (keys.length === 2 &&
        keys[0] === 'code' &&
        keys[1] === 'detail' &&
        body.code === 'UNAUTHORIZED');
}
function setCause(error, cause) {
    Object.defineProperty(error, 'cause', {
        value: cause,
        writable: true,
        configurable: true,
        enumerable: false,
    });
    return error;
}
/**
 * Maps a failed HTTP call (or token request) to the exception callers get: an
 * HTTP error response to its `ScalekitServerException`, a timeout to
 * `ScalekitGatewayTimeoutException` (the same type a gRPC deadline gives), and
 * anything else to `ScalekitException`. Scalekit exceptions pass through.
 */
function toScalekitException(error) {
    if (error instanceof base_exception_1.ScalekitException)
        return error;
    if (error instanceof axios_1.AxiosError) {
        if (error.response) {
            return setCause(base_exception_1.ScalekitServerException.promote(error.response), error);
        }
        if (specific_exceptions_1.ScalekitGatewayTimeoutException.isAxiosTimeout(error)) {
            return setCause(specific_exceptions_1.ScalekitGatewayTimeoutException.fromAxiosTimeout(error), error);
        }
    }
    return setCause(new base_exception_1.ScalekitException(error), error);
}
//# sourceMappingURL=http-errors.js.map