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
/**
 * Per-call options for {@link CoreClient.connectExec}: the gRPC call options
 * forwarded to the call, plus the SDK's own retry switch.
 *
 * @internal
 */
export interface ConnectExecOptions extends CallOptions {
    /**
     * `false` turns off the retry on `Unavailable`, for calls that must not be
     * sent twice. Defaults to `true`.
     */
    retryOnUnavailable?: boolean;
}
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
    private pendingAuthentication;
    axios: Axios;
    sdkVersion: string;
    apiVersion: string;
    userAgent: string;
    constructor(envUrl: string, clientId: string, clientSecret: string, toolTimeoutMs?: number, timeoutMs?: number, pingIntervalMs?: number, pingTimeoutMs?: number);
    /**
     * Fetch a client-credentials token if this client doesn't have one yet.
     *
     * gRPC calls get a token lazily: `connectExec` authenticates when a call
     * returns 401 and retries it. HTTP calls that must not be retried on 401,
     * such as the actions proxy (a 401 there can come from the third-party API,
     * and retrying would replay the request), call this first instead.
     * Concurrent callers share one token request.
     */
    ensureAccessToken(): Promise<void>;
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
     * Get the JWKS from the server and store it in the client instance
     * @returns {Promise<void>} Returns nothing
     */
    getJwks(): Promise<void>;
    /**
     * Waits `ms` milliseconds. With a `signal`, the wait ends early when the
     * signal aborts, rejecting with {@link ScalekitAbortError}.
     */
    private sleep;
    /**
     * Execute a function with error handling and retry logic.
     *
     * @param fn Function to execute
     * @param data Data to pass to the function
     * @param options Optional per-call options. The gRPC call options (e.g.
     *                `timeoutMs`, `signal`) are forwarded to `fn`; omit
     *                `timeoutMs` to use the transport's default deadline.
     *                `retryOnUnavailable: false` turns off the retry on
     *                `Unavailable` for calls that must not be sent twice (the
     *                single token refresh on `Unauthenticated` is kept). When
     *                `signal` aborts, before the call, during it or while
     *                waiting to retry, the call rejects with
     *                {@link ScalekitAbortError}.
     * @returns {Promise<TResponse>} Returns the response
     */
    connectExec<TRequest, TResponse>(fn: (request: TRequest, options?: CallOptions) => Promise<TResponse>, data: TRequest, options?: ConnectExecOptions): Promise<TResponse>;
    private _connectExec;
}
