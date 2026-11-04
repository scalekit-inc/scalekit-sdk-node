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
 * A JSON Web Key from the environment's JWKS endpoint (RFC 7517). Declared
 * here rather than imported from `jose` so the published declarations never
 * import `jose`, an ES module that CommonJS declaration files cannot load.
 */
export interface JWK {
    kty?: string;
    alg?: string;
    key_ops?: string[];
    ext?: boolean;
    use?: string;
    x5c?: string[];
    x5t?: string;
    'x5t#S256'?: string;
    x5u?: string;
    kid?: string;
    crv?: string;
    d?: string;
    dp?: string;
    dq?: string;
    e?: string;
    k?: string;
    n?: string;
    p?: string;
    q?: string;
    qi?: string;
    x?: string;
    y?: string;
    pub?: string;
    priv?: string;
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
    private accessTokenRenewAt;
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
     * Every call that needs a token runs this before sending: gRPC calls in
     * `connectExec`, HTTP calls through `withAccessToken`. Concurrent callers
     * share one token request.
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
    connectExec<TRequest, TResponse>(fn: (request: TRequest, options?: CallOptions) => Promise<TResponse>, data: TRequest, options?: CallOptions): Promise<TResponse>;
    /**
     * After Scalekit rejected `tokenUsed`, fetch a new token (skipped when a
     * concurrent call already replaced it). True when the client now holds a
     * different token, so a resend can succeed.
     */
    private replaceRejectedToken;
    private _connectExec;
}
