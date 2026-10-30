import { type CallOptions } from '@connectrpc/connect';
import { Axios, AxiosResponse } from 'axios';
declare module 'axios' {
    interface InternalAxiosRequestConfig {
        skipAuth?: boolean;
    }
    interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}
import { JWK } from 'jose';
import { TokenResponse } from './types/auth';
export declare const headers: {
    'user-agent': string;
    'x-sdk-version': string;
    'x-api-version': string;
    authorization: string;
};
export declare const DEFAULT_TIMEOUT_MS = 20000;
export declare const DEFAULT_PING_INTERVAL_MS = 60000;
export declare const DEFAULT_PING_TIMEOUT_MS = 5000;
export declare const MIN_PING_INTERVAL_MS = 60000;
export declare function assertValidTimeout(name: string, value: number): void;
export declare function assertValidPingInterval(value: number): void;
/** A stream body is consumed by the first send, so it can't be resent. */
export declare function isStream(data: unknown): boolean;
export default class CoreClient {
    readonly envUrl: string;
    readonly clientId: string;
    readonly clientSecret: string;
    readonly toolTimeoutMs: number;
    readonly timeoutMs: number;
    readonly pingIntervalMs: number;
    readonly pingTimeoutMs: number;
    keys: JWK[];
    accessToken: string | null;
    private accessTokenRenewAt;
    private tokenNotTheCause;
    private pendingAuthentication;
    axios: Axios;
    sdkVersion: string;
    apiVersion: string;
    userAgent: string;
    constructor(envUrl: string, clientId: string, clientSecret: string, toolTimeoutMs?: number, timeoutMs?: number, pingIntervalMs?: number, pingTimeoutMs?: number);
    /**
     * Fetch a client-credentials token if this client has none, or if the one
     * it holds expires within 10 seconds.
     *
     * gRPC calls get a token lazily: `connectExec` authenticates when a call
     * returns 401 and retries it. HTTP calls that need one call this through
     * `withAccessToken` before sending. Concurrent callers share one token
     * request.
     */
    ensureAccessToken(): Promise<void>;
    /** One token request at a time; concurrent callers share it. */
    private fetchAccessToken;
    private authenticateClient;
    /**
     * Authenticate with the code
     * @param {string} data Data to authenticate
     * @returns {Promise<AxiosResponse<TokenResponse>>} Returns access token and id token
     */
    authenticate(data: string): Promise<AxiosResponse<TokenResponse, any>>;
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
    refreshAccessToken(rejectedToken: string | null): Promise<void>;
    /**
     * Run an authenticated HTTP request through `this.axios`, with a token that
     * isn't about to expire: fetch one first if needed (`ensureAccessToken`).
     *
     * If Scalekit still rejects the token (revoked, a rotated signing key, or
     * clock skew), fetch a new one and send the request once more, as
     * `connectExec` does for gRPC calls. Only a 401 the Scalekit proxy sent
     * itself counts: the proxy rejects it before forwarding, so the resend is
     * safe. A 401 from the provider is returned as is, never replayed.
     *
     * A connected account's own credential failure (code `TOOL_ERROR`) and
     * anything relayed from the provider (`X-Scalekit-Upstream`) are never
     * resent. Proxies deployed before that sent connected-account failures as
     * `UNAUTHORIZED` too; when a freshly fetched token still gets that 401, the
     * token isn't the cause, so further 401s on that token are returned
     * without another token request or resend.
     *
     * Pass `resend: false` when `send` can't run twice (a stream body): the
     * token is still renewed, so the next call works, and the 401 is returned.
     * Pass `signal` to stop waiting for a token request when it aborts.
     *
     * @internal
     */
    withAccessToken<T>(send: () => Promise<T>, { resend, signal }?: {
        resend?: boolean;
        signal?: AbortSignal;
    }): Promise<T>;
    /**
     * Get the JWKS from the server and store it in the client instance
     * @returns {Promise<void>} Returns nothing
     */
    getJwks(): Promise<void>;
    private sleep;
    /**
     * Execute a function with error handling and retry logic.
     *
     * @param fn Function to execute
     * @param data Data to pass to the function
     * @param options Optional per-call gRPC options (e.g. `timeoutMs`), forwarded to `fn` as-is.
     *                Omit to use the transport's default deadline.
     * @returns {Promise<TResponse>} Returns the response
     */
    connectExec<TRequest, TResponse>(fn: (request: TRequest, options?: CallOptions) => Promise<TResponse>, data: TRequest, options?: CallOptions): Promise<TResponse>;
    private _connectExec;
}
