import { RequestAdapter, ResponseAdapter } from './protocol';
export declare const DEFAULT_COOKIE_NAME = "sk_session";
export interface SessionResult {
    authenticated: boolean;
    user?: Record<string, unknown>;
    newCookieValue?: string;
    shouldClearCookie?: boolean;
    reason?: 'no_session' | 'invalid_session' | 'refresh_failed';
}
/**
 * Minimal shape of the ScalekitClient methods this manager depends on --
 * avoids a hard import dependency on the concrete client class, so this
 * module can be unit-tested against a plain mock.
 */
export interface ScalekitClientLike {
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateToken<T = Record<string, unknown>>(token: string): Promise<T>;
}
/**
 * Framework-agnostic session state machine: decrypts the session cookie,
 * checks expiry, transparently refreshes via the Scalekit client when
 * needed, and reports what the framework adapter should do next (proceed /
 * set a new cookie / clear the cookie and redirect to login).
 *
 * Concurrent requests for the *same* session within one process are
 * coalesced so only one actual refresh call is made -- see check(). Node is
 * single-threaded per process, so this is promise-sharing (singleflight),
 * not a lock: concurrent callers awaiting the same in-flight refresh receive
 * the same resolved promise instead of each independently calling
 * refreshAccessToken().
 */
export declare class SessionRefreshManager {
    readonly cookieName: string;
    private readonly client;
    private readonly secret;
    private readonly refreshCache;
    private readonly inFlight;
    constructor(client: ScalekitClientLike, cookieEncryptionSecret: string, cookieName?: string);
    /** Decide what to do with the incoming request's session cookie. */
    check(request: RequestAdapter): Promise<SessionResult>;
    private sweepExpired;
    private refresh;
    private doRefresh;
    /** Encrypt a fresh session payload (e.g. right after authenticateWithCode). */
    createSessionCookie(payload: Record<string, unknown>): string;
    /**
     * Decrypt a raw cookie value (e.g. for extracting idToken during logout,
     * before the cookie is cleared). Throws InvalidSessionError if the cookie
     * can't be decrypted -- callers that just want "is there a usable idToken"
     * should catch that and fall back gracefully, same as check() does.
     */
    decryptCookieValue(value: string): Record<string, unknown>;
    /** Apply a SessionResult's cookie side effects to an outgoing response. */
    apply(result: SessionResult, response: ResponseAdapter): void;
}
