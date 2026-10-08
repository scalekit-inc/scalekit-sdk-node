"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvesInsideProxy = resolvesInsideProxy;
exports.validateUploadParams = validateUploadParams;
exports.backoffDelayMs = backoffDelayMs;
exports.retryAfterDelayMs = retryAfterDelayMs;
exports.uploadResumable = uploadResumable;
const fs_1 = require("fs");
const axios_1 = require("axios");
const base_exception_1 = require("./errors/base-exception");
const specific_exceptions_1 = require("./errors/specific-exceptions");
const upload_exceptions_1 = require("./errors/upload-exceptions");
/** Google requires every chunk except the last to be a multiple of this. */
const CHUNK_GRANULARITY = 256 * 1024;
const DEFAULT_CHUNK_SIZE = 4 * 1024 * 1024;
const DEFAULT_CONTENT_TYPE = 'application/octet-stream';
const DEFAULT_MAX_RETRIES = 3;
/** Full-jitter backoff: random() * min(cap, base * 2^n), n starting at 0. */
const BACKOFF_BASE_MS = 500;
const BACKOFF_CAP_MS = 8000;
/** Longest `Retry-After` wait honoured. */
const RETRY_AFTER_CAP_MS = 30000;
const RETRYABLE_STATUSES = new Set([
    408, 429, 500, 502, 503, 504,
]);
const SESSION_GONE_STATUSES = new Set([404, 410]);
const UPLOAD_METHODS = new Set(['POST', 'PUT', 'PATCH']);
function isPlainObject(value) {
    if (value === null || typeof value !== 'object')
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
function isNonNegativeSafeInteger(value) {
    return Number.isSafeInteger(value) && value >= 0;
}
function requireNonEmptyString(name, value) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new base_exception_1.ScalekitValidationError(`${name} is required`);
    }
    return value;
}
/** A value sent as an HTTP header: non-empty and without CR or LF. */
function requireHeaderValue(name, value) {
    const text = requireNonEmptyString(name, value);
    if (/[\r\n]/.test(text)) {
        throw new base_exception_1.ScalekitValidationError(`${name} must not contain CR or LF characters`);
    }
    return text;
}
/**
 * Rejects path forms that would change where the request goes: a query
 * string or fragment (the SDK builds the query itself) and dot segments,
 * which URL resolution would collapse, possibly out of `/proxy`. Encoded
 * dots and backslashes are treated the way the URL parser treats them.
 */
function validatePath(path) {
    // The URL parser deletes tab, CR and LF, so ".\t." would become "..".
    // Reject every control character and space outright.
    if (/[\x00-\x20\x7f]/.test(path)) {
        throw new base_exception_1.ScalekitValidationError('path must not contain spaces or control characters');
    }
    if (path.includes('?') || path.includes('#')) {
        throw new base_exception_1.ScalekitValidationError('path must not contain "?" or "#"; pass query parameters in queryParams');
    }
    const normalized = path.startsWith('/') ? path : `/${path}`;
    for (const segment of normalized.split(/[\\/]/)) {
        const decoded = segment.replace(/%2e/gi, '.');
        if (decoded === '.' || decoded === '..') {
            throw new base_exception_1.ScalekitValidationError('path must not contain "." or ".." segments');
        }
    }
    return normalized;
}
/**
 * Whether `{envUrl}/proxy{path}`, as the URL parser resolves it, stays under
 * the environment's `/proxy/` (same origin, same path prefix).
 *
 * @internal
 */
function resolvesInsideProxy(envUrl, path) {
    const base = envUrl.replace(/\/$/, '');
    try {
        const root = new URL(`${base}/proxy/`);
        const target = new URL(`${base}/proxy${path}`);
        return (target.origin === root.origin && target.pathname.startsWith(root.pathname));
    }
    catch (_a) {
        return false;
    }
}
function isAsyncIterable(value) {
    return (value !== null &&
        typeof value === 'object' &&
        typeof value[Symbol.asyncIterator] === 'function');
}
/**
 * Checks every argument before any network call.
 *
 * @internal
 */
function validateUploadParams(params, options) {
    var _a, _b, _c;
    if (params === null || typeof params !== 'object') {
        throw new base_exception_1.ScalekitValidationError('params is required');
    }
    const connectionName = requireHeaderValue('connectionName', params.connectionName);
    const identifier = requireHeaderValue('identifier', params.identifier);
    const path = validatePath(requireNonEmptyString('path', params.path));
    const rawMethod = (_a = params.method) !== null && _a !== void 0 ? _a : 'POST';
    const method = typeof rawMethod === 'string' ? rawMethod.toUpperCase() : '';
    if (!UPLOAD_METHODS.has(method)) {
        throw new base_exception_1.ScalekitValidationError(`method must be POST, PUT or PATCH, got ${String(rawMethod)}`);
    }
    let contentType = DEFAULT_CONTENT_TYPE;
    if (params.contentType !== undefined) {
        contentType = requireHeaderValue('contentType', params.contentType);
    }
    let metadataJson;
    if (params.metadata !== undefined) {
        if (!isPlainObject(params.metadata)) {
            throw new base_exception_1.ScalekitValidationError('metadata must be a plain object');
        }
        try {
            metadataJson = JSON.stringify(params.metadata);
        }
        catch (error) {
            throw new base_exception_1.ScalekitValidationError(`metadata must be JSON-serializable: ${error.message}`);
        }
    }
    const queryParams = {};
    if (params.queryParams !== undefined) {
        if (!isPlainObject(params.queryParams)) {
            throw new base_exception_1.ScalekitValidationError('queryParams must be a plain object');
        }
        for (const [key, value] of Object.entries(params.queryParams)) {
            if (key === 'uploadType') {
                throw new base_exception_1.ScalekitValidationError('queryParams must not set uploadType; the SDK always sends uploadType=resumable');
            }
            if (typeof value !== 'string' &&
                typeof value !== 'boolean' &&
                !(typeof value === 'number' && Number.isFinite(value))) {
                throw new base_exception_1.ScalekitValidationError(`queryParams.${key} must be a string, a finite number or a boolean`);
            }
            queryParams[key] = value;
        }
    }
    const chunkSize = (_b = params.chunkSize) !== null && _b !== void 0 ? _b : DEFAULT_CHUNK_SIZE;
    if (!Number.isSafeInteger(chunkSize) ||
        chunkSize <= 0 ||
        chunkSize % CHUNK_GRANULARITY !== 0) {
        throw new base_exception_1.ScalekitValidationError(`chunkSize must be a positive multiple of ${CHUNK_GRANULARITY} (256 KiB), got ${String(chunkSize)}`);
    }
    const { data } = params;
    const isBytes = data instanceof Uint8Array;
    if (!isBytes && !isAsyncIterable(data)) {
        throw new base_exception_1.ScalekitValidationError('data must be a Uint8Array/Buffer or an async iterable of Uint8Array (for example fs.createReadStream(path))');
    }
    let totalBytes = params.totalBytes;
    if (totalBytes !== undefined && !isNonNegativeSafeInteger(totalBytes)) {
        throw new base_exception_1.ScalekitValidationError(`totalBytes must be a non-negative integer, got ${String(totalBytes)}`);
    }
    if (isBytes) {
        if (totalBytes !== undefined && totalBytes !== data.byteLength) {
            throw new base_exception_1.ScalekitValidationError(`totalBytes (${totalBytes}) does not match data.byteLength (${data.byteLength})`);
        }
        totalBytes = data.byteLength;
    }
    const timeoutMs = options === null || options === void 0 ? void 0 : options.timeoutMs;
    if (timeoutMs !== undefined &&
        (typeof timeoutMs !== 'number' ||
            !Number.isFinite(timeoutMs) ||
            timeoutMs <= 0)) {
        throw new base_exception_1.ScalekitValidationError(`timeoutMs must be a positive finite number of milliseconds, got ${String(timeoutMs)}`);
    }
    const maxRetries = (_c = options === null || options === void 0 ? void 0 : options.maxRetries) !== null && _c !== void 0 ? _c : DEFAULT_MAX_RETRIES;
    if (!isNonNegativeSafeInteger(maxRetries)) {
        throw new base_exception_1.ScalekitValidationError(`maxRetries must be a non-negative integer, got ${String(maxRetries)}`);
    }
    const onProgress = options === null || options === void 0 ? void 0 : options.onProgress;
    if (onProgress !== undefined && typeof onProgress !== 'function') {
        throw new base_exception_1.ScalekitValidationError('onProgress must be a function');
    }
    return {
        connectionName,
        identifier,
        path,
        method,
        contentType,
        metadataJson,
        queryParams,
        chunkSize,
        totalBytes,
        data,
        timeoutMs,
        maxRetries,
        onProgress,
        signal: options === null || options === void 0 ? void 0 : options.signal,
    };
}
/**
 * Size of an unread `fs.createReadStream(path)` that reads the whole file,
 * or `undefined` when it can't be known up front.
 */
function sizeOfFileStream(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(data instanceof fs_1.ReadStream))
            return undefined;
        const stream = data;
        if (typeof stream.path !== 'string' ||
            stream.start !== undefined ||
            (stream.end !== undefined && stream.end !== Infinity) ||
            stream.bytesRead !== 0) {
            return undefined;
        }
        try {
            const stats = yield fs_1.promises.stat(stream.path);
            return stats.isFile() ? stats.size : undefined;
        }
        catch (_a) {
            // The stream reports the same failure when it is read.
            return undefined;
        }
    });
}
/**
 * Full-jitter exponential backoff for the n-th retry (n starts at 0).
 *
 * @internal
 */
function backoffDelayMs(retry, random = Math.random) {
    return random() * Math.min(BACKOFF_CAP_MS, BACKOFF_BASE_MS * Math.pow(2, retry));
}
/**
 * Delay requested by a `Retry-After` header (delta-seconds or HTTP-date),
 * capped at 30 s. A past date or negative value means 0; an unparseable
 * value returns `undefined` so the caller falls back to backoff.
 *
 * @internal
 */
function retryAfterDelayMs(value, now = Date.now()) {
    if (value === undefined)
        return undefined;
    const trimmed = value.trim();
    let delayMs;
    if (/^-?\d+$/.test(trimmed)) {
        delayMs = Number(trimmed) * 1000;
    }
    else if (/[a-z]/i.test(trimmed) && !Number.isNaN(Date.parse(trimmed))) {
        delayMs = Date.parse(trimmed) - now;
    }
    else {
        return undefined;
    }
    return Math.min(Math.max(delayMs, 0), RETRY_AFTER_CAP_MS);
}
function toBuffer(bytes) {
    // A non-Buffer view must be wrapped: axios would otherwise send the whole
    // underlying ArrayBuffer instead of the view.
    return Buffer.isBuffer(bytes)
        ? bytes
        : Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}
/**
 * Reads the content one chunk at a time. For a stream it reads one byte past
 * each chunk, so it knows whether a chunk is the last before sending it, and
 * a stream longer than `totalBytes` is caught before its last chunk goes out.
 */
class ChunkSource {
    constructor(data, chunkSize, declaredTotal, checkAbort) {
        this.data = data;
        this.chunkSize = chunkSize;
        this.declaredTotal = declaredTotal;
        this.checkAbort = checkAbort;
        this.pieces = [];
        this.buffered = 0;
        this.consumed = 0;
        this.ended = false;
    }
    /** The total size: declared up front, or known once the end was read. */
    get totalBytes() {
        if (this.declaredTotal !== undefined)
            return this.declaredTotal;
        return this.ended && this.buffered === 0 ? this.consumed : undefined;
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            const start = this.consumed;
            if (this.data instanceof Uint8Array) {
                const end = Math.min(start + this.chunkSize, this.data.byteLength);
                this.consumed = end;
                this.ended = end === this.data.byteLength;
                return {
                    start,
                    bytes: toBuffer(this.data.subarray(start, end)),
                    final: this.ended,
                };
            }
            yield this.fill(this.chunkSize + 1);
            const take = Math.min(this.chunkSize, this.buffered);
            const final = this.ended && this.buffered <= this.chunkSize;
            const bytes = this.take(take);
            this.consumed += take;
            const declared = this.declaredTotal;
            if (declared !== undefined) {
                if (this.consumed > declared || (!final && this.consumed === declared)) {
                    throw new base_exception_1.ScalekitValidationError(`data is longer than totalBytes (${declared})`);
                }
                if (final && this.consumed < declared) {
                    throw new base_exception_1.ScalekitValidationError(`data ended after ${this.consumed} bytes, shorter than totalBytes (${declared})`);
                }
            }
            return { start, bytes, final };
        });
    }
    /** Releases the caller's stream if it was not read to the end. */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.iterator && !this.ended && this.iterator.return) {
                try {
                    yield this.iterator.return();
                }
                catch (_a) {
                    // Cleanup must not replace the error that ended the upload.
                }
            }
        });
    }
    fill(target) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.iterator) {
                this.iterator = this.data[Symbol.asyncIterator]();
            }
            while (!this.ended && this.buffered < target) {
                const result = yield this.iterator.next();
                this.checkAbort();
                if (result.done) {
                    this.ended = true;
                    break;
                }
                const piece = result.value;
                if (!(piece instanceof Uint8Array)) {
                    throw new base_exception_1.ScalekitValidationError(`data yielded a ${typeof piece}, not bytes; read streams without an encoding`);
                }
                if (piece.byteLength > 0) {
                    this.pieces.push(piece);
                    this.buffered += piece.byteLength;
                }
            }
        });
    }
    take(count) {
        const parts = [];
        let needed = count;
        while (needed > 0) {
            const head = this.pieces[0];
            if (head === undefined)
                break; // unreachable: count <= buffered
            if (head.byteLength <= needed) {
                parts.push(head);
                this.pieces.shift();
                needed -= head.byteLength;
            }
            else {
                parts.push(head.subarray(0, needed));
                this.pieces[0] = head.subarray(needed);
                needed = 0;
            }
        }
        this.buffered -= count;
        const [only] = parts;
        return parts.length === 1 && only !== undefined
            ? toBuffer(only)
            : Buffer.concat(parts, count);
    }
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
 * A 401 the Scalekit proxy itself sent because the access token was rejected
 * (JSON `{ "detail": ..., "code": "UNAUTHORIZED" }`), as opposed to a 401 from
 * the provider. Only this kind is safe to resend after a token refresh.
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
/** Maps a failed token request the same way `actions.request` maps failures. */
function tokenRequestError(error) {
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
class ResumableUpload {
    constructor(core, plan) {
        this.core = core;
        this.plan = plan;
        this.committed = 0;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { plan } = this;
            this.assertUrlInsideProxy();
            this.checkAbort();
            const declaredTotal = (_a = plan.totalBytes) !== null && _a !== void 0 ? _a : (yield sizeOfFileStream(plan.data));
            const source = new ChunkSource(plan.data, plan.chunkSize, declaredTotal, () => this.checkAbort());
            try {
                // Read the first chunk before starting the session, so content that
                // fits in one chunk has a known size for X-Upload-Content-Length.
                let chunk = yield source.next();
                try {
                    yield this.core.ensureAccessToken();
                }
                catch (error) {
                    throw tokenRequestError(error);
                }
                this.checkAbort();
                this.uploadId = yield this.startSession(source.totalBytes);
                return yield this.transfer(source, chunk);
            }
            finally {
                yield source.close();
            }
        });
    }
    proxyUrl() {
        return `${this.core.envUrl.replace(/\/$/, '')}/proxy${this.plan.path}`;
    }
    /** Second line of defence behind `validatePath`; see `resolvesInsideProxy`. */
    assertUrlInsideProxy() {
        if (!resolvesInsideProxy(this.core.envUrl, this.plan.path)) {
            throw new base_exception_1.ScalekitValidationError('path must resolve to a location under the proxy');
        }
    }
    proxyHeaders() {
        return {
            connection_name: this.plan.connectionName,
            identifier: this.plan.identifier,
        };
    }
    startSession(total) {
        return __awaiter(this, void 0, void 0, function* () {
            const { plan } = this;
            const headers = Object.assign(Object.assign({}, this.proxyHeaders()), { 'X-Upload-Content-Type': plan.contentType, 
                // No body, so no Content-Type (axios would otherwise add a form one).
                'Content-Type': false });
            if (total !== undefined)
                headers['X-Upload-Content-Length'] = String(total);
            let body = Buffer.alloc(0);
            if (plan.metadataJson !== undefined) {
                headers['Content-Type'] = 'application/json; charset=UTF-8';
                body = Buffer.from(plan.metadataJson, 'utf8');
            }
            const outcome = yield this.exchange({
                url: this.proxyUrl(),
                method: plan.method,
                params: Object.assign({ uploadType: 'resumable' }, plan.queryParams),
                headers,
                data: body,
            });
            switch (outcome.kind) {
                case 'response': {
                    const { response } = outcome;
                    if (response.status === 308) {
                        throw this.protocolError('the session-start request returned 308 instead of 2xx', response);
                    }
                    const location = headerRecord(response.headers)['location'];
                    let uploadId = null;
                    if (location) {
                        try {
                            uploadId = new URL(location, 'https://upload.invalid').searchParams.get('upload_id');
                        }
                        catch (_a) {
                            uploadId = null;
                        }
                    }
                    if (!uploadId) {
                        throw this.protocolError('the session-start response has no upload_id in its Location header', response);
                    }
                    return uploadId;
                }
                case 'http-error':
                    if (outcome.response.status >= 300 && outcome.response.status < 400) {
                        throw this.protocolError(`the session-start request returned a ${outcome.response.status} redirect`, outcome.response, outcome.error);
                    }
                    throw this.httpError(outcome, 'session-start request');
                case 'timeout':
                    throw this.timeoutError(outcome.error, 'session-start request');
                case 'network':
                    throw this.connectionError(outcome.error, 'session-start request');
            }
        });
    }
    transfer(source, firstChunk) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let chunk = firstChunk;
            let failures = 0;
            let needStatusQuery = false;
            let finalChunkSent = false;
            // Highest offset the server has confirmed. Only a new high counts as
            // progress, so a server bouncing between offsets still runs out of retries.
            let highWater = this.committed;
            for (;;) {
                this.checkAbort();
                const chunkEnd = chunk.start + chunk.bytes.length;
                if (!needStatusQuery && this.committed === chunkEnd && !chunk.final) {
                    chunk = yield source.next();
                    continue;
                }
                const isStatusQuery = needStatusQuery;
                const what = isStatusQuery ? 'status request' : 'chunk request';
                if (!isStatusQuery && chunk.final)
                    finalChunkSent = true;
                const outcome = isStatusQuery
                    ? yield this.sendStatusQuery(source.totalBytes)
                    : yield this.sendChunk(chunk, source.totalBytes);
                if (outcome.kind === 'response') {
                    const { response } = outcome;
                    if (response.status === 200 || response.status === 201) {
                        if (!finalChunkSent) {
                            // Never return a file the server completed with bytes missing.
                            throw this.protocolError('the server completed the upload before the last chunk was sent', response);
                        }
                        return this.complete(response, (_a = source.totalBytes) !== null && _a !== void 0 ? _a : chunkEnd);
                    }
                    if (response.status !== 308) {
                        throw this.httpError({ response }, what);
                    }
                    const next = this.committedOffset(response);
                    if (next < chunk.start || next > chunkEnd) {
                        throw this.protocolError(`the server reported ${next} bytes committed, outside the current chunk (${chunk.start}-${chunkEnd})`, response);
                    }
                    if (chunk.final && next === chunkEnd) {
                        throw this.protocolError('the server confirmed every byte but did not complete the upload', response);
                    }
                    needStatusQuery = false;
                    this.committed = next;
                    if (next > highWater) {
                        highWater = next;
                        failures = 0;
                        yield this.reportProgress(source.totalBytes);
                        continue;
                    }
                    // A status query reporting no new bytes: resend from that offset.
                    if (isStatusQuery)
                        continue;
                    // A 308 to a chunk that commits no new bytes falls through and is
                    // retried like a failure.
                }
                else if (outcome.kind === 'http-error') {
                    const { status } = outcome.response;
                    if (SESSION_GONE_STATUSES.has(status)) {
                        throw this.httpError(outcome, what, true);
                    }
                    if (status >= 300 && status < 400) {
                        throw this.protocolError(`unexpected ${status} redirect to a ${what}`, outcome.response, outcome.error);
                    }
                    if (!RETRYABLE_STATUSES.has(status)) {
                        throw this.httpError(outcome, what);
                    }
                }
                failures += 1;
                if (failures > this.plan.maxRetries) {
                    if (outcome.kind === 'response') {
                        throw this.protocolError(`the server committed no new bytes after ${failures} attempts`, outcome.response);
                    }
                    if (outcome.kind === 'http-error')
                        throw this.httpError(outcome, what);
                    if (outcome.kind === 'timeout') {
                        throw this.timeoutError(outcome.error, what);
                    }
                    throw this.connectionError(outcome.error, what);
                }
                const retryAfter = outcome.kind === 'http-error' &&
                    (outcome.response.status === 429 || outcome.response.status === 503)
                    ? retryAfterDelayMs(headerRecord(outcome.response.headers)['retry-after'])
                    : undefined;
                yield this.sleep(retryAfter !== null && retryAfter !== void 0 ? retryAfter : backoffDelayMs(failures - 1));
                // After a stall the 308 already said where to resume; otherwise ask.
                needStatusQuery = outcome.kind !== 'response';
            }
        });
    }
    sendChunk(chunk, total) {
        const offset = this.committed;
        const body = chunk.bytes.subarray(offset - chunk.start);
        const totalField = chunk.final
            ? String(chunk.start + chunk.bytes.length)
            : total !== undefined
                ? String(total)
                : '*';
        const range = body.length === 0
            ? `bytes */${totalField}`
            : `bytes ${offset}-${offset + body.length - 1}/${totalField}`;
        return this.exchange({
            url: this.proxyUrl(),
            method: 'PUT',
            params: { uploadType: 'resumable', upload_id: this.uploadId },
            headers: Object.assign(Object.assign({}, this.proxyHeaders()), { 'Content-Type': this.plan.contentType, 'Content-Range': range }),
            data: body,
        });
    }
    sendStatusQuery(total) {
        return this.exchange({
            url: this.proxyUrl(),
            method: 'PUT',
            params: { uploadType: 'resumable', upload_id: this.uploadId },
            headers: Object.assign(Object.assign({}, this.proxyHeaders()), { 'Content-Type': false, 'Content-Range': `bytes */${total !== undefined ? String(total) : '*'}` }),
            data: Buffer.alloc(0),
        });
    }
    /**
     * Sends one request. A Scalekit 401 (rejected access token) is answered by
     * one token refresh and one resend, and only when the token changed; the
     * proxy rejects such a request before forwarding it, so the resend is safe.
     */
    exchange(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenUsed = this.core.accessToken;
            const outcome = yield this.send(config);
            if (outcome.kind === 'http-error' &&
                isScalekitUnauthorized(outcome.response)) {
                try {
                    yield this.core.refreshAccessToken(tokenUsed);
                }
                catch (error) {
                    throw tokenRequestError(error);
                }
                this.checkAbort();
                if (this.core.accessToken && this.core.accessToken !== tokenUsed) {
                    return this.send(config);
                }
            }
            return outcome;
        });
    }
    send(config) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { plan } = this;
            try {
                const response = yield this.core.axios.request(Object.assign(Object.assign(Object.assign(Object.assign({}, config), { timeout: (_a = plan.timeoutMs) !== null && _a !== void 0 ? _a : this.core.toolTimeoutMs }), (plan.signal !== undefined && { signal: plan.signal })), { maxRedirects: 0, maxBodyLength: Infinity, responseType: 'text', validateStatus: (status) => (status >= 200 && status < 300) || status === 308 }));
                return { kind: 'response', response };
            }
            catch (error) {
                if ((0, axios_1.isCancel)(error) || ((_b = plan.signal) === null || _b === void 0 ? void 0 : _b.aborted)) {
                    throw this.abortError();
                }
                if (error instanceof axios_1.AxiosError) {
                    if (error.response) {
                        return { kind: 'http-error', response: error.response, error };
                    }
                    if (specific_exceptions_1.ScalekitGatewayTimeoutException.isAxiosTimeout(error)) {
                        return { kind: 'timeout', error };
                    }
                }
                return { kind: 'network', error };
            }
        });
    }
    /** Bytes committed according to a 308's `Range: bytes=0-N` header. */
    committedOffset(response) {
        const range = headerRecord(response.headers)['range'];
        if (range === undefined || range === '')
            return 0;
        const match = /^bytes=0-(\d+)$/.exec(range.trim());
        const last = match ? Number(match[1]) : NaN;
        if (!Number.isSafeInteger(last)) {
            throw this.protocolError(`malformed Range header "${range}"`, response);
        }
        return last + 1;
    }
    complete(response, total) {
        return __awaiter(this, void 0, void 0, function* () {
            let resource;
            if (response.data !== null &&
                typeof response.data === 'object' &&
                !(response.data instanceof Uint8Array)) {
                resource = response.data;
            }
            else {
                const text = bodyText(response.data);
                if (text.trim() === '') {
                    resource = {};
                }
                else {
                    try {
                        resource = JSON.parse(text);
                    }
                    catch (error) {
                        throw this.protocolError('the final response body is not JSON', response, error);
                    }
                }
            }
            if (!isPlainObject(resource)) {
                throw this.protocolError('the final response body is not a JSON object', response);
            }
            this.committed = total;
            yield this.reportProgress(total);
            return resource;
        });
    }
    reportProgress(total) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.plan.onProgress)
                return;
            yield this.plan.onProgress(Object.freeze({ bytesCommitted: this.committed, totalBytes: total }));
        });
    }
    sleep(ms) {
        const { signal } = this.plan;
        return new Promise((resolve, reject) => {
            if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                reject(this.abortError());
                return;
            }
            const onAbort = () => {
                clearTimeout(timer);
                reject(this.abortError());
            };
            const timer = setTimeout(() => {
                signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', onAbort);
                resolve();
            }, ms);
            signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', onAbort, { once: true });
        });
    }
    checkAbort() {
        var _a;
        if ((_a = this.plan.signal) === null || _a === void 0 ? void 0 : _a.aborted)
            throw this.abortError();
    }
    abortError() {
        var _a;
        return new base_exception_1.ScalekitAbortError('The upload was aborted', (_a = this.plan.signal) === null || _a === void 0 ? void 0 : _a.reason);
    }
    httpError(outcome, what, sessionGone = false) {
        const { response, error } = outcome;
        const init = {
            message: sessionGone
                ? `The upload session expired or no longer exists (HTTP ${response.status} on the ${what}); upload the file again`
                : `The upload failed with HTTP ${response.status} on the ${what}`,
            status: response.status,
            statusText: typeof response.statusText === 'string' ? response.statusText : '',
            headers: headerRecord(response.headers),
            body: errorBody(response),
            uploadId: this.uploadId,
            bytesCommitted: this.committed,
            cause: error,
        };
        return sessionGone
            ? new upload_exceptions_1.ScalekitUploadSessionExpiredException(init)
            : new upload_exceptions_1.ScalekitUploadHttpException(init);
    }
    timeoutError(error, what) {
        return new upload_exceptions_1.ScalekitUploadTimeoutException({
            message: `The ${what} timed out`,
            uploadId: this.uploadId,
            bytesCommitted: this.committed,
            cause: error,
        });
    }
    connectionError(error, what) {
        const code = error === null || error === void 0 ? void 0 : error.code;
        return new upload_exceptions_1.ScalekitUploadConnectionException({
            message: `The ${what} failed with no response${typeof code === 'string' ? ` (${code})` : ''}`,
            uploadId: this.uploadId,
            bytesCommitted: this.committed,
            cause: error,
        });
    }
    protocolError(message, response, cause) {
        return new upload_exceptions_1.ScalekitUploadProtocolException({
            message: `Unexpected upload response: ${message}`,
            uploadId: this.uploadId,
            bytesCommitted: this.committed,
            status: response.status,
            headers: headerRecord(response.headers),
            body: errorBody(response),
            cause,
        });
    }
}
/**
 * Uploads content with Google's resumable protocol through the Scalekit
 * proxy. See `ActionsClient.uploadResumable` for the contract.
 *
 * @internal
 */
function uploadResumable(core, params, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const plan = validateUploadParams(params, options);
        return new ResumableUpload(core, plan).run();
    });
}
//# sourceMappingURL=resumable-upload.js.map