"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TIMEOUT_MS = exports.headers = void 0;
exports.assertValidTimeout = assertValidTimeout;
const connect_1 = require("@connectrpc/connect");
const axios_1 = __importStar(require("axios"));
const os_1 = __importDefault(require("os"));
const qs_1 = __importDefault(require("qs"));
const scalekit_1 = require("./types/scalekit");
const base_exception_1 = require("./errors/base-exception");
const specific_exceptions_1 = require("./errors/specific-exceptions");
const errdetails_pb_1 = require("./pkg/grpc/scalekit/v1/errdetails/errdetails_pb");
exports.headers = {
    'user-agent': 'user-agent',
    'x-sdk-version': 'x-sdk-version',
    'x-api-version': 'x-api-version',
    authorization: 'authorization',
};
const tokenEndpoint = 'oauth/token';
const jwksEndpoint = 'keys';
const DEFAULT_TOOL_TIMEOUT_MS = 60000;
exports.DEFAULT_TIMEOUT_MS = 20000;
// A non-positive timeout is never what the caller wants: connect-es treats a
// per-call timeoutMs <= 0 as "no deadline" (reintroducing indefinite hangs)
// but a transport defaultTimeoutMs of 0 as an immediately-expired deadline,
// and axios treats 0 as "no timeout". Reject invalid values up front instead
// of letting the same input pick a different semantic per path.
function assertValidTimeout(name, value) {
    if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`${name} must be a positive finite number of milliseconds, got ${value}`);
    }
}
// Node's real http adapter sets `error.request` (and `error.response.request`,
// often the same reference) to the underlying `http.ClientRequest`. Its
// enumerable `_header` property holds the fully-serialized request headers —
// e.g. `Authorization: Bearer <token>\r\n...` — which `util.inspect` (and
// therefore `console.error` and Node's default uncaught-exception/
// unhandledRejection handler) prints verbatim. Redact the Authorization line
// in place rather than deleting `_header` or the request object, so the rest
// of the raw request remains available for debugging. Guarded for mocks/
// non-Node adapters where `request` or `_header` may not exist or may not be
// a string.
function redactRawRequestHeader(request) {
    if (!request || typeof request !== 'object') {
        return;
    }
    const req = request;
    if (typeof req._header === 'string') {
        req._header = req._header.replace(/^authorization:.*$/im, 'Authorization: [REDACTED]');
    }
    // Node also mirrors the outgoing headers on an internal symbol-keyed map
    // (`Symbol(kOutHeaders)`) that the ClientRequest builds up before
    // `_header` is serialized, and that map stays populated afterwards. It is
    // enumerable, so `util.inspect` walks into it independently of `_header` —
    // redact any Authorization entry there too. The stored shape is a
    // `[displayName, value]` tuple; fall back to overwriting the value
    // directly in case a future Node version stores a bare string instead.
    for (const symbolKey of Object.getOwnPropertySymbols(req)) {
        if (symbolKey.description !== 'kOutHeaders') {
            continue;
        }
        const outHeaders = req[symbolKey];
        if (!outHeaders || typeof outHeaders !== 'object') {
            continue;
        }
        const headerMap = outHeaders;
        for (const headerKey of Object.keys(headerMap)) {
            if (headerKey.toLowerCase() !== 'authorization') {
                continue;
            }
            const entry = headerMap[headerKey];
            if (Array.isArray(entry)) {
                entry[1] = '[REDACTED]';
            }
            else {
                headerMap[headerKey] = '[REDACTED]';
            }
        }
    }
    // By default (the config CoreClient actually runs with — `maxRedirects` is
    // never set to 0), axios's Node adapter issues the request through
    // `follow-redirects`, which leaves a `_redirectable` back-reference on the
    // real `http.ClientRequest` pointing at its own wrapper. That wrapper keeps
    // the original `_options.headers` object it was constructed with — a
    // separate plain object from both `config.headers` and the ones above —
    // still holding the plaintext Authorization value. Redact it too so the
    // default (non-`maxRedirects: 0`) request path doesn't leak the token via
    // this extra hop.
    const redirectable = req._redirectable;
    if (redirectable && typeof redirectable === 'object') {
        const options = redirectable._options;
        if (options && typeof options === 'object') {
            const optionHeaders = options.headers;
            if (optionHeaders && typeof optionHeaders === 'object') {
                const headerMap = optionHeaders;
                for (const headerKey of Object.keys(headerMap)) {
                    if (headerKey.toLowerCase() === 'authorization') {
                        headerMap[headerKey] = '[REDACTED]';
                    }
                }
            }
        }
    }
}
class CoreClient {
    constructor(envUrl, clientId, clientSecret, toolTimeoutMs = DEFAULT_TOOL_TIMEOUT_MS, timeoutMs = exports.DEFAULT_TIMEOUT_MS) {
        this.envUrl = envUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.toolTimeoutMs = toolTimeoutMs;
        this.timeoutMs = timeoutMs;
        this.keys = [];
        this.accessToken = null;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.sdkVersion = `Scalekit-Node/${require('../package.json').version}`;
        // YYYYMMDD
        this.apiVersion = '20260727';
        this.userAgent = `${this.sdkVersion} Node/${process.version} (${process.platform}; ${os_1.default.arch()})`;
        assertValidTimeout('toolTimeoutMs', toolTimeoutMs);
        assertValidTimeout('timeoutMs', timeoutMs);
        // The instance-level timeout bounds every HTTP call made through this
        // client — including the token endpoint and JWKS fetches, which otherwise
        // hang forever on a silently dropped connection (the same failure mode
        // the gRPC transport deadline guards against). Calls that need a longer
        // budget (the actions proxy) set a per-request timeout, which overrides
        // this default.
        this.axios = axios_1.default.create({ baseURL: envUrl, timeout: this.timeoutMs });
        this.axios.interceptors.request.use((config) => {
            config.headers[exports.headers['user-agent']] = this.userAgent;
            config.headers[exports.headers['x-sdk-version']] = this.sdkVersion;
            config.headers[exports.headers['x-api-version']] = this.apiVersion;
            if (this.accessToken && !config.skipAuth) {
                config.headers[exports.headers.authorization] = `Bearer ${this.accessToken}`;
            }
            return config;
        });
        // On failure, axios attaches the outgoing request config to the error, and
        // that config carries two credentials: the plaintext client_secret in the
        // token endpoint's request body (`config.data`) and the Bearer access
        // token in the Authorization header. `AxiosError.toJSON()` and Node's
        // default handler would dump both if the error is logged wholesale or
        // propagates uncaught. Redact just those two values in place — leaving the
        // response, status, headers, and request object intact for debugging — so
        // nothing downstream (a caller's log, an APM that instruments axios, a
        // user-registered interceptor) can observe the secret or the token.
        //
        // The real Node http adapter also attaches the raw `http.ClientRequest` as
        // `error.request` (and the same reference as `error.response.request`).
        // That object keeps the fully-serialized outgoing headers, including the
        // Bearer token, in its enumerable `_header` string — and `util.inspect`
        // (what `console.error(err)` and Node's default uncaught-exception/
        // unhandledRejection handler use) walks into `request`/`response.request`
        // and prints `_header` verbatim. Scrub the Authorization line out of
        // `_header` on both references too, so the token can't resurface there.
        this.axios.interceptors.response.use((response) => response, (error) => {
            var _a;
            if (error instanceof axios_1.AxiosError && error.config) {
                if (typeof error.config.data === 'string') {
                    // Anchor the match to a form-field boundary (start of string or
                    // `&`) so a similarly-named field (e.g. `other_client_secret=`)
                    // can't false-positive on the bare `client_secret=` substring,
                    // and use the `g` flag so every occurrence is redacted, not just
                    // the first, in case the body ever carries the field twice.
                    error.config.data = error.config.data.replace(/(^|&)client_secret=[^&]*/g, '$1client_secret=[REDACTED]');
                }
                const configHeaders = error.config.headers;
                if (configHeaders) {
                    if (typeof configHeaders.set === 'function' &&
                        typeof configHeaders.has === 'function') {
                        // AxiosHeaders: case-insensitive lookup/set.
                        if (configHeaders.has('Authorization')) {
                            configHeaders.set('Authorization', '[REDACTED]', true);
                        }
                    }
                    else {
                        // Plain object headers: match the key case-insensitively.
                        for (const key of Object.keys(configHeaders)) {
                            if (key.toLowerCase() === 'authorization') {
                                configHeaders[key] = '[REDACTED]';
                            }
                        }
                    }
                }
            }
            if (error instanceof axios_1.AxiosError) {
                redactRawRequestHeader(error.request);
                redactRawRequestHeader((_a = error.response) === null || _a === void 0 ? void 0 : _a.request);
            }
            return Promise.reject(error);
        });
        // removing token creation at the time of constructor and instead letting the retry functionality handle generating a token whenever required.
        //this.authenticateClient();
    }
    authenticateClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.authenticate(qs_1.default.stringify({
                grant_type: scalekit_1.GrantType.ClientCredentials,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }));
            this.accessToken = res.data.access_token;
        });
    }
    /**
     * Authenticate with the code
     * @param {string} data Data to authenticate
     * @returns {Promise<AxiosResponse<TokenResponse>>} Returns access token and id token
     */
    authenticate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.axios.post(tokenEndpoint, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                skipAuth: true,
            });
        });
    }
    /**
     * Get the JWKS from the server and store it in the client instance
     * @returns {Promise<void>} Returns nothing
     */
    getJwks() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keys.length) {
                return Promise.resolve();
            }
            const { data: { keys }, } = yield this.axios.get(jwksEndpoint);
            this.keys = keys;
        });
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Execute a function with error handling and retry logic.
     *
     * @param fn Function to execute
     * @param data Data to pass to the function
     * @param options Optional per-call gRPC options (e.g. `timeoutMs`), forwarded to `fn` as-is.
     *                Omit to use the transport's default deadline.
     * @returns {Promise<TResponse>} Returns the response
     */
    connectExec(fn, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connectExec(fn, data, 3, 0, options);
        });
    }
    _connectExec(fn, data, retryLeft, attempt, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield fn(data, options);
            }
            catch (error) {
                // Handle gRPC Connect errors
                if (error instanceof connect_1.ConnectError) {
                    // If the error originated from an upstream tool provider (errorCode == "TOOL_ERROR"),
                    // surface it immediately — never retry, never refresh the M2M token.
                    // Retrying a provider 429 would triple the rate-limit damage; refreshing the
                    // Scalekit M2M token does nothing for a provider auth failure.
                    const isToolError = error
                        .findDetails(errdetails_pb_1.ErrorInfoSchema)
                        .some((d) => d.errorCode === 'TOOL_ERROR');
                    if (!isToolError && retryLeft > 0) {
                        if (error.code === connect_1.Code.Unauthenticated) {
                            yield this.authenticateClient();
                            return this._connectExec(fn, data, retryLeft - 1, attempt + 1, options);
                        }
                        // Retry transient infrastructure errors (Unavailable) with backoff.
                        // This covers the Connect transport mapping HTTP 429 → Code.Unavailable.
                        // Scalekit ResourceExhausted (429) is NOT retried — surfaces immediately.
                        if (error.code === connect_1.Code.Unavailable) {
                            const baseBackoff = Math.min(1000 * Math.pow(2, attempt), 30000);
                            const backoffMs = baseBackoff * (0.5 + Math.random() * 0.5);
                            yield this.sleep(backoffMs);
                            return this._connectExec(fn, data, retryLeft - 1, attempt + 1, options);
                        }
                    }
                    throw base_exception_1.ScalekitServerException.promote(error, isToolError);
                }
                // Handle HTTP/Axios errors
                if (error instanceof axios_1.AxiosError) {
                    if (error.response) {
                        if (retryLeft > 0) {
                            if (error.response.status === axios_1.HttpStatusCode.Unauthorized) {
                                yield this.authenticateClient();
                                return this._connectExec(fn, data, retryLeft - 1, attempt + 1, options);
                            }
                            // NOTE: HTTP 429 responses are surfaced immediately — no backoff retry.
                        }
                        throw base_exception_1.ScalekitServerException.promote(error.response);
                    }
                    else {
                        // A timed-out request has no response; surface it as the same
                        // exception type a gRPC deadline expiry produces.
                        if (specific_exceptions_1.ScalekitGatewayTimeoutException.isAxiosTimeout(error)) {
                            throw specific_exceptions_1.ScalekitGatewayTimeoutException.fromAxiosTimeout(error);
                        }
                        throw new base_exception_1.ScalekitException(error);
                    }
                }
                // Handle existing ScalekitException instances
                if (error instanceof base_exception_1.ScalekitException) {
                    throw error;
                }
                // Handle generic errors
                throw new base_exception_1.ScalekitException(error);
            }
        });
    }
}
exports.default = CoreClient;
//# sourceMappingURL=core.js.map