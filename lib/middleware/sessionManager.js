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
exports.SessionRefreshManager = exports.DEFAULT_COOKIE_NAME = void 0;
const sessionCrypto_1 = require("./sessionCrypto");
exports.DEFAULT_COOKIE_NAME = 'sk_session';
// Refresh a little before the stored expiry so a request doesn't race the exact
// expiry instant against network latency to the token endpoint.
const EXPIRY_LEEWAY_SECONDS = 10;
// How long a completed refresh outcome stays cached for singleflight coalescing
// before it's swept. Comfortably longer than Scalekit's server-side refresh-token
// rotation grace window (~30s) so same-process concurrent callers racing within
// that window all land on the cached result rather than each hitting the network.
const REFRESH_CACHE_TTL_MS = 60000;
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
class SessionRefreshManager {
    constructor(client, cookieEncryptionSecret, cookieName = exports.DEFAULT_COOKIE_NAME) {
        this.refreshCache = new Map();
        this.inFlight = new Map();
        if (!cookieEncryptionSecret) {
            throw new Error('cookieEncryptionSecret is required. Generate a strong random secret, e.g.:\n' +
                "  node -e \"console.log(require('crypto').randomBytes(32).toString('base64url'))\"\n" +
                'and keep it identical across every server instance -- there is intentionally no ' +
                'default, since a shared default secret would let any deployment decrypt or forge ' +
                "any other deployment's sessions.");
        }
        this.client = client;
        this.secret = cookieEncryptionSecret;
        this.cookieName = cookieName;
    }
    /** Decide what to do with the incoming request's session cookie. */
    check(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookieValue = request.getCookie(this.cookieName);
            if (!cookieValue) {
                return { authenticated: false, reason: 'no_session' };
            }
            let payload;
            try {
                payload = (0, sessionCrypto_1.decryptSession)(cookieValue, this.secret);
            }
            catch (err) {
                if (err instanceof sessionCrypto_1.InvalidSessionError) {
                    return {
                        authenticated: false,
                        shouldClearCookie: true,
                        reason: 'invalid_session',
                    };
                }
                throw err;
            }
            const expiresAt = typeof payload.expiresAt === 'number' ? payload.expiresAt : 0;
            if (expiresAt - EXPIRY_LEEWAY_SECONDS > Date.now() / 1000) {
                return {
                    authenticated: true,
                    user: payload.user,
                };
            }
            const refreshToken = payload.refreshToken;
            if (!refreshToken) {
                return {
                    authenticated: false,
                    shouldClearCookie: true,
                    reason: 'invalid_session',
                };
            }
            return this.refresh(refreshToken, payload);
        });
    }
    sweepExpired() {
        const now = Date.now();
        for (const [key, outcome] of this.refreshCache) {
            if (now - outcome.createdAt > REFRESH_CACHE_TTL_MS) {
                this.refreshCache.delete(key);
            }
        }
    }
    refresh(refreshToken, oldPayload) {
        this.sweepExpired();
        const cached = this.refreshCache.get(refreshToken);
        if (cached) {
            return Promise.resolve(cached.result);
        }
        const existingInFlight = this.inFlight.get(refreshToken);
        if (existingInFlight) {
            return existingInFlight;
        }
        const promise = this.doRefresh(refreshToken, oldPayload).finally(() => {
            this.inFlight.delete(refreshToken);
        });
        this.inFlight.set(refreshToken, promise);
        return promise;
    }
    doRefresh(refreshToken, oldPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                const refreshResult = yield this.client.refreshAccessToken(refreshToken);
                // Re-derive user/claims from the freshly-issued access token rather than
                // carrying the old cached values forward -- access-token claims (not
                // id_token claims) are the source of truth: customers can configure
                // custom access-token claims in the Scalekit dashboard, and unlike the
                // id_token, the access token IS reissued on every refresh, so this keeps
                // `user` genuinely current instead of stale-until-next-login.
                const claims = yield this.client.validateToken(refreshResult.accessToken);
                const newPayload = Object.assign(Object.assign({}, oldPayload), { accessToken: refreshResult.accessToken, refreshToken: refreshResult.refreshToken, user: claims, expiresAt: typeof claims.exp === 'number' ? claims.exp : Date.now() / 1000 + 300 });
                const newCookieValue = (0, sessionCrypto_1.encryptSession)(newPayload, this.secret);
                result = { authenticated: true, user: claims, newCookieValue };
                this.refreshCache.set(refreshToken, { result, createdAt: Date.now() });
                return result;
            }
            catch (_a) {
                // Deliberately caught broadly -- any failure here means "treat as
                // logged out," never an unhandled rejection. Framework adapters should
                // log this via their own error-handling middleware if desired.
                //
                // Deliberately NOT cached: a failure here may be a transient network
                // error (timeout, 503), not proof the refresh token is actually dead.
                // Caching it for the full TTL would pin every concurrent caller of
                // this session to "logged out" for up to 60s with no chance to retry.
                // Concurrent callers already awaiting this same in-flight promise are
                // still coalesced onto this single attempt; only a *later*,
                // non-overlapping call gets to retry.
                return {
                    authenticated: false,
                    shouldClearCookie: true,
                    reason: 'refresh_failed',
                };
            }
        });
    }
    /** Encrypt a fresh session payload (e.g. right after authenticateWithCode). */
    createSessionCookie(payload) {
        return (0, sessionCrypto_1.encryptSession)(payload, this.secret);
    }
    /**
     * Decrypt a raw cookie value (e.g. for extracting idToken during logout,
     * before the cookie is cleared). Throws InvalidSessionError if the cookie
     * can't be decrypted -- callers that just want "is there a usable idToken"
     * should catch that and fall back gracefully, same as check() does.
     */
    decryptCookieValue(value) {
        return (0, sessionCrypto_1.decryptSession)(value, this.secret);
    }
    /** Apply a SessionResult's cookie side effects to an outgoing response. */
    apply(result, response) {
        if (result.newCookieValue) {
            response.setCookie(this.cookieName, result.newCookieValue);
        }
        else if (result.shouldClearCookie) {
            response.deleteCookie(this.cookieName);
        }
    }
}
exports.SessionRefreshManager = SessionRefreshManager;
//# sourceMappingURL=sessionManager.js.map