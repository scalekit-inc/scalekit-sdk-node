"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = isPlainObject;
exports.headerRecord = headerRecord;
exports.bodyText = bodyText;
exports.errorBody = errorBody;
exports.isScalekitUnauthorized = isScalekitUnauthorized;
exports.setCause = setCause;
exports.toScalekitException = toScalekitException;
exports.toScalekitTokenError = toScalekitTokenError;
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
 * A 401 the Scalekit proxy sent itself (JSON
 * `{ "detail": ..., "code": "UNAUTHORIZED" }`, exactly), not one relayed from
 * the provider with the provider's own body. The proxy answers both a
 * rejected Scalekit access token and a connected account's own credential
 * failure this way, so a new token may or may not fix it.
 */
function isScalekitUnauthorized(response) {
    if (response.status !== 401)
        return false;
    if (!isJsonContentType(headerRecord(response.headers)))
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
// The AxiosError fields callers of earlier releases could read on a failed
// token request. `request` is not among them: the client's response
// interceptor removes it, since it carries the credentials.
const AXIOS_ERROR_FIELDS = [
    'isAxiosError',
    'code',
    'status',
    'response',
    'config',
];
/**
 * A failed access-token request as a `ScalekitException` (see
 * `toScalekitException`) that still carries the `AxiosError` fields callers
 * could read before, as non-enumerable properties, so `axios.isAxiosError()`,
 * `error.response.status` and `error.code` keep working. Used for gRPC calls,
 * which threw the raw `AxiosError` in earlier releases.
 */
function toScalekitTokenError(error) {
    const mapped = toScalekitException(error);
    if (error instanceof axios_1.AxiosError && mapped !== error) {
        for (const field of AXIOS_ERROR_FIELDS) {
            if (error[field] === undefined)
                continue;
            Object.defineProperty(mapped, field, {
                value: error[field],
                writable: true,
                configurable: true,
                enumerable: false,
            });
        }
    }
    return mapped;
}
//# sourceMappingURL=http-errors.js.map