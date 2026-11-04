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
exports.MIN_PING_INTERVAL_MS = exports.DEFAULT_PING_TIMEOUT_MS = exports.DEFAULT_PING_INTERVAL_MS = exports.DEFAULT_TIMEOUT_MS = exports.headers = void 0;
exports.assertValidTimeout = assertValidTimeout;
exports.assertValidPingInterval = assertValidPingInterval;
const connect_1 = require("@connectrpc/connect");
const axios_1 = __importStar(require("axios"));
const os_1 = __importDefault(require("os"));
const qs_1 = __importDefault(require("qs"));
const scalekit_1 = require("./types/scalekit");
const base_exception_1 = require("./errors/base-exception");
const specific_exceptions_1 = require("./errors/specific-exceptions");
const errdetails_pb_1 = require("./pkg/grpc/scalekit/v1/errdetails/errdetails_pb");
const http_errors_1 = require("./http-errors");
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
// Must clear the backend's EnforcementPolicy.MinTime (30s, scalekit's cmd/grpc.go)
// with real margin, not just match it: connect-node's ping loop keeps running at
// this interval for as long as a stream is open (see http2-session-manager.js's
// resetPingInterval, gated on streamCount > 0 independent of pingIdleConnection),
// so a value equal to MinTime leaves zero room for jitter between our timer and
// the server's strike window — one early ping is a strike, enough strikes and the
// server GOAWAYs the connection mid-call. This bit the Python SDK for the same
// reason (scalekit-sdk-python#195 raised its equivalent default 30s -> 60s); the
// Java SDK's 60s keepAliveTime is the precedent the backend's own MinTime margin
// was sized against.
exports.DEFAULT_PING_INTERVAL_MS = 60000;
exports.DEFAULT_PING_TIMEOUT_MS = 5000;
// The floor tracks DEFAULT_PING_INTERVAL_MS for the same reason spelled out
// above: connect-node has no clamp of its own (unlike grpc-core, which
// silently raises sub-10s keepalive values to 10s), so a caller-supplied
// value below this genuinely pings at that rate, every ping under the
// backend's 30s MinTime a strike. 0 is handled separately (see
// assertValidPingInterval below) as the deliberate "disabled" escape hatch —
// only 1..59999 is rejected.
exports.MIN_PING_INTERVAL_MS = 60000;
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
// pingIntervalMs=0 is a deliberate escape hatch (mirrors the Python SDK's
// keepalive_time_ms=0): connect-node's own default is pingIntervalMs:
// Infinity ("never ping"), and a customer whose network path or corporate
// proxy rejects our pings needs a runtime way back to that default without
// downgrading the whole SDK. Anything else must clear MIN_PING_INTERVAL_MS
// with real margin — see the constant's own comment for why.
function assertValidPingInterval(value) {
    if (value === 0) {
        return;
    }
    assertValidTimeout('pingIntervalMs', value);
    if (value < exports.MIN_PING_INTERVAL_MS) {
        throw new Error(`pingIntervalMs must be 0 (disabled) or >= ${exports.MIN_PING_INTERVAL_MS}; got ${value}. ` +
            `A value below the default leaves too little margin over the Scalekit ` +
            `server's 30s keepalive MinTime — early pings are struck as abusive, ` +
            `and enough strikes GOAWAYs the connection mid-call.`);
    }
}
// A token is replaced this long before it expires (at most half its
// lifetime), so a request never goes out with one about to lapse.
const TOKEN_RENEW_BEFORE_EXPIRY_MS = 10000;
/** Settles with `promise`, or rejects as soon as `signal` aborts. */
function untilAborted(promise, signal) {
    if (!signal)
        return promise;
    if (signal.aborted) {
        // The caller stops waiting for `promise`; keep its rejection from going unhandled.
        promise.catch(() => undefined);
        return Promise.reject(signal.reason);
    }
    return new Promise((resolve, reject) => {
        const onAbort = () => reject(signal.reason);
        signal.addEventListener('abort', onAbort, { once: true });
        promise
            .then(resolve, reject)
            .finally(() => signal.removeEventListener('abort', onAbort));
    });
}
/** A 401 the Scalekit proxy sent itself (see `isScalekitUnauthorized`). */
function isProxyUnauthorized(error) {
    return (error instanceof axios_1.AxiosError &&
        error.response !== undefined &&
        (0, http_errors_1.isScalekitUnauthorized)(error.response));
}
class CoreClient {
    constructor(envUrl, clientId, clientSecret, toolTimeoutMs = DEFAULT_TOOL_TIMEOUT_MS, timeoutMs = exports.DEFAULT_TIMEOUT_MS, pingIntervalMs = exports.DEFAULT_PING_INTERVAL_MS, pingTimeoutMs = exports.DEFAULT_PING_TIMEOUT_MS) {
        this.envUrl = envUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.toolTimeoutMs = toolTimeoutMs;
        this.timeoutMs = timeoutMs;
        this.pingIntervalMs = pingIntervalMs;
        this.pingTimeoutMs = pingTimeoutMs;
        this.keys = [];
        this.accessToken = null;
        // When `accessToken` should be replaced (ms since epoch), from the token
        // response's lifetime; null when the response gave none.
        this.accessTokenRenewAt = null;
        this.pendingAuthentication = null;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.sdkVersion = `Scalekit-Node/${require('../package.json').version}`;
        // YYYYMMDD
        this.apiVersion = '20261104';
        this.userAgent = `${this.sdkVersion} Node/${process.version} (${process.platform}; ${os_1.default.arch()})`;
        assertValidTimeout('toolTimeoutMs', toolTimeoutMs);
        assertValidTimeout('timeoutMs', timeoutMs);
        assertValidPingInterval(pingIntervalMs);
        assertValidTimeout('pingTimeoutMs', pingTimeoutMs);
        // A pingTimeoutMs at or above pingIntervalMs means the interval timer can
        // fire again (scheduling the next ping and its own watchdog) before the
        // previous ping's watchdog would ever have tripped — resetPingInterval's
        // stopPingInterval() cancels that stale watchdog outright, so a hung ping
        // response would silently never be detected as hung. Skip when pinging is
        // disabled (pingIntervalMs === 0); pingTimeoutMs is unused in that state.
        if (pingIntervalMs !== 0 && pingTimeoutMs >= pingIntervalMs) {
            throw new Error(`pingTimeoutMs (${pingTimeoutMs}) must be less than pingIntervalMs (${pingIntervalMs}).`);
        }
        // The instance-level timeout bounds every HTTP call made through this
        // client — including the token endpoint and JWKS fetches, which otherwise
        // hang forever on a silently dropped connection (the same failure mode
        // the gRPC transport deadline guards against). Calls that need a longer
        // budget (the actions proxy) set a per-request timeout, which overrides
        // this default.
        this.axios = axios_1.default.create({ baseURL: envUrl, timeout: this.timeoutMs });
        // Attaches the token this client holds; never fetches one. Calls that
        // need a token get it through `withAccessToken` (HTTP) or `connectExec`
        // (gRPC), so creating a client or validating a token never fetches one.
        // The gRPC transport (`connect.ts`) attaches it the same way.
        this.axios.interceptors.request.use((config) => {
            config.headers[exports.headers['user-agent']] = this.userAgent;
            config.headers[exports.headers['x-sdk-version']] = this.sdkVersion;
            config.headers[exports.headers['x-api-version']] = this.apiVersion;
            if (this.accessToken && !config.skipAuth) {
                config.headers[exports.headers.authorization] = `Bearer ${this.accessToken}`;
            }
            return config;
        });
        // On failure, axios attaches copies of the outgoing request to the error
        // that carry two credentials: the plaintext client_secret in the token
        // endpoint's request body (`error.config.data`) and the Bearer access token
        // in the Authorization header — the latter living on `error.config.headers`
        // and, with the real Node adapter, on the raw `http.ClientRequest` at
        // `error.request` / `error.response.request` (whose serialized `_header`
        // holds it too). `AxiosError.toJSON()` and util.inspect (`console.error(err)`
        // and Node's default uncaught-exception/unhandledRejection handler) would
        // surface these if the error is logged wholesale or propagates uncaught.
        // Drop the credential-bearing request copies off the error entirely. The
        // response (status/body/headers), `message`, and `code` are untouched, so
        // callers and the retry logic — which read only `error.response`,
        // `error.response.status`, and `error.code` — keep working; only the
        // non-secret request echo (body fields, request headers) is lost with them.
        this.axios.interceptors.response.use((response) => response, (error) => {
            if (error instanceof axios_1.AxiosError) {
                if (error.config) {
                    const config = error.config;
                    delete config.data;
                    delete config.headers;
                }
                delete error.request;
                if (error.response) {
                    delete error.response.request;
                }
            }
            return Promise.reject(error);
        });
    }
    /**
     * Fetch a client-credentials token if this client has none, or if the one
     * it holds expires within 10 seconds.
     *
     * Every call that needs a token runs this before sending: gRPC calls in
     * `connectExec`, HTTP calls through `withAccessToken`. Concurrent callers
     * share one token request.
     */
    ensureAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.accessToken &&
                (this.accessTokenRenewAt === null || Date.now() < this.accessTokenRenewAt)) {
                return;
            }
            yield this.fetchAccessToken();
        });
    }
    /** One token request at a time; concurrent callers share it. */
    fetchAccessToken() {
        if (!this.pendingAuthentication) {
            this.pendingAuthentication = this.authenticateClient().finally(() => {
                this.pendingAuthentication = null;
            });
        }
        return this.pendingAuthentication;
    }
    authenticateClient() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const res = yield this.authenticate(qs_1.default.stringify({
                grant_type: scalekit_1.GrantType.ClientCredentials,
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }));
            const { access_token: token, expires_in: expiresIn } = ((_a = res.data) !== null && _a !== void 0 ? _a : {});
            // Storing an empty token would send every call out unauthenticated, and
            // each would request another token.
            if (typeof token !== 'string' || token === '') {
                throw new base_exception_1.ScalekitException('The token endpoint answered without an access_token.');
            }
            // Without `expires_in` the lifetime is unknown: the token is not renewed
            // ahead of time, only after Scalekit rejects it.
            const lifetimeMs = typeof expiresIn === 'number' && expiresIn > 0 ? expiresIn * 1000 : null;
            this.accessToken = token;
            this.accessTokenRenewAt =
                lifetimeMs === null
                    ? null
                    : Date.now() +
                        lifetimeMs -
                        Math.min(TOKEN_RENEW_BEFORE_EXPIRY_MS, lifetimeMs / 2);
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
     * Replace an access token the server rejected.
     *
     * Pass the token the rejected request was sent with. If another caller has
     * already replaced it, this returns without a token request; otherwise
     * concurrent callers share one token request (the same one
     * `ensureAccessToken` uses). Callers resend only when `accessToken` has
     * changed afterwards.
     *
     * @internal
     */
    refreshAccessToken(rejectedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.accessToken !== rejectedToken)
                return;
            yield this.fetchAccessToken();
        });
    }
    /**
     * Run an authenticated HTTP request through `this.axios`, with a token that
     * isn't about to expire: fetch one first if needed (`ensureAccessToken`).
     *
     * On a 401 in the Scalekit proxy's own shape (`isScalekitUnauthorized`),
     * fetch a new token so later calls use it. A 401 from the provider is
     * returned as is and never triggers a token request.
     *
     * With `resend: false` the request is not sent again and the proxy's 401
     * is returned, even if fetching the new token fails. `actions.request`
     * uses this for every request: the proxy answers a rejected Scalekit token
     * and a connected account's own credential failure with the same 401, and
     * resending the latter would repeat it at the provider. With `resend: true`
     * (resumable uploads, as in earlier releases) the request is sent once more
     * with the new token.
     *
     * Pass `signal` to stop waiting for a token request when it aborts.
     *
     * @internal
     */
    withAccessToken(send_1) {
        return __awaiter(this, arguments, void 0, function* (send, { resend = true, signal } = {}) {
            // An aborted call doesn't start a token request it would not wait for.
            const tokenRequest = (start) => (signal === null || signal === void 0 ? void 0 : signal.aborted)
                ? Promise.reject(signal.reason)
                : untilAborted(start().catch((error) => {
                    throw (0, http_errors_1.toScalekitException)(error);
                }), signal);
            try {
                yield tokenRequest(() => this.ensureAccessToken());
            }
            catch (error) {
                // Intentional fallback, as in connectExec: when renewing ahead of expiry
                // fails (the token endpoint is down) but the client still holds a token,
                // send with it. A still-valid token succeeds, as in earlier releases; an
                // expired one gets the proxy's own 401 before anything is forwarded. An
                // aborted call, or a client with no token, gets the error now.
                if ((signal === null || signal === void 0 ? void 0 : signal.aborted) || !this.accessToken)
                    throw error;
            }
            const tokenUsed = this.accessToken;
            try {
                return yield send();
            }
            catch (error) {
                if (!isProxyUnauthorized(error))
                    throw error;
                if (!resend) {
                    // Intentional: the new token is only for later calls, so failing to
                    // fetch it must not replace this call's 401 with the token error.
                    yield tokenRequest(() => this.refreshAccessToken(tokenUsed)).catch(() => undefined);
                    throw error;
                }
                yield tokenRequest(() => this.refreshAccessToken(tokenUsed));
                const freshToken = this.accessToken;
                if (!freshToken || freshToken === tokenUsed)
                    throw error;
                return send();
            }
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
     * The token is fetched before the first call and renewed shortly before it
     * expires (`ensureAccessToken`), the same as for HTTP calls. If Scalekit
     * still rejects it (401 without `TOOL_ERROR`: revoked, a rotated signing
     * key, clock skew), one new token is fetched, shared with concurrent
     * callers, and the call is sent once more. A second rejection is returned:
     * another token would not fix it.
     *
     * @param fn Function to execute
     * @param data Data to pass to the function
     * @param options Optional per-call gRPC options (e.g. `timeoutMs`), forwarded to `fn` as-is.
     *                Omit to use the transport's default deadline.
     * @returns {Promise<TResponse>} Returns the response
     * @throws The token endpoint's own error (an `AxiosError`, not mapped) when
     *         Scalekit rejects the token and fetching a new one fails, as in
     *         earlier releases.
     */
    connectExec(fn, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.aborted)) {
                // Intentional fallback: if this up-front token request fails, send the
                // call anyway, with the token held (possibly still valid) or none. It
                // then fails, or succeeds, exactly as it did before tokens were
                // fetched up front: Scalekit unreachable → Unavailable retries and
                // `ScalekitServiceUnavailableException`; only the token endpoint
                // failing → a 401, whose refresh throws the token endpoint's error.
                yield this.ensureAccessToken().catch(() => undefined);
            }
            return this._connectExec(fn, data, 3, 0, false, options);
        });
    }
    /**
     * After Scalekit rejected `tokenUsed`, fetch a new token (skipped when a
     * concurrent call already replaced it). True when the client now holds a
     * different token, so a resend can succeed.
     */
    replaceRejectedToken(tokenUsed) {
        return __awaiter(this, void 0, void 0, function* () {
            // A failed token request throws its own error (an `AxiosError`), unmapped,
            // as in earlier releases.
            yield this.refreshAccessToken(tokenUsed);
            return this.accessToken !== null && this.accessToken !== tokenUsed;
        });
    }
    _connectExec(fn, data, retryLeft, attempt, tokenRefreshed, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenUsed = this.accessToken;
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
                        if (error.code === connect_1.Code.Unauthenticated &&
                            !tokenRefreshed &&
                            (yield this.replaceRejectedToken(tokenUsed))) {
                            return this._connectExec(fn, data, retryLeft - 1, attempt + 1, true, options);
                        }
                        // Retry transient infrastructure errors (Unavailable) with backoff.
                        // This covers the Connect transport mapping HTTP 429 → Code.Unavailable.
                        // Scalekit ResourceExhausted (429) is NOT retried — surfaces immediately.
                        if (error.code === connect_1.Code.Unavailable) {
                            const baseBackoff = Math.min(1000 * Math.pow(2, attempt), 30000);
                            const backoffMs = baseBackoff * (0.5 + Math.random() * 0.5);
                            yield this.sleep(backoffMs);
                            return this._connectExec(fn, data, retryLeft - 1, attempt + 1, tokenRefreshed, options);
                        }
                    }
                    throw base_exception_1.ScalekitServerException.promote(error, isToolError);
                }
                // Handle HTTP/Axios errors
                if (error instanceof axios_1.AxiosError) {
                    if (error.response) {
                        if (retryLeft > 0) {
                            if (error.response.status === axios_1.HttpStatusCode.Unauthorized &&
                                !tokenRefreshed &&
                                (yield this.replaceRejectedToken(tokenUsed))) {
                                return this._connectExec(fn, data, retryLeft - 1, attempt + 1, true, options);
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