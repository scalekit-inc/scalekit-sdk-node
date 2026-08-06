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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalekitAuthNext = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
let NextResponse;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ({ NextResponse } = require('next/server'));
}
catch (_a) {
    throw new Error("Next.js integration requires the 'next' package: npm install next");
}
const scalekit_1 = __importDefault(require("../scalekit"));
const sessionCrypto_1 = require("../middleware/sessionCrypto");
const sessionManager_1 = require("../middleware/sessionManager");
const csrfState_1 = require("../middleware/csrfState");
class NextRequestAdapter {
    constructor(req) {
        this.req = req;
    }
    getCookie(name) {
        var _a;
        return (_a = this.req.cookies.get(name)) === null || _a === void 0 ? void 0 : _a.value;
    }
    getRequestUrl() {
        return this.req.url;
    }
}
function serializeSetCookie(name, value, options = {}) {
    var _a, _b, _c, _d;
    let cookie = `${name}=${encodeURIComponent(value)}`;
    if (options.maxAge !== undefined)
        cookie += `; Max-Age=${Math.floor(options.maxAge)}`;
    cookie += `; Path=${(_a = options.path) !== null && _a !== void 0 ? _a : '/'}`;
    if (options.domain)
        cookie += `; Domain=${options.domain}`;
    if ((_b = options.httpOnly) !== null && _b !== void 0 ? _b : true)
        cookie += '; HttpOnly';
    if ((_c = options.secure) !== null && _c !== void 0 ? _c : true)
        cookie += '; Secure';
    const sameSite = (_d = options.sameSite) !== null && _d !== void 0 ? _d : 'lax';
    cookie += `; SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`;
    return cookie;
}
function serializeDeleteCookie(name, options = {}) {
    var _a;
    let cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=${(_a = options.path) !== null && _a !== void 0 ? _a : '/'}`;
    if (options.domain)
        cookie += `; Domain=${options.domain}`;
    return cookie;
}
/**
 * Writes raw Set-Cookie headers rather than relying on NextResponse's
 * `.cookies` API, since a wrapped Route Handler (see withAuth) can
 * legitimately return a plain Web `Response` (e.g. `Response.json(...)`)
 * instead of a `NextResponse` -- a plain Response has no `.cookies` at all.
 * `Headers.append('set-cookie', ...)` works identically on both -- except
 * when the handler proxies an upstream `fetch()` response (an ordinary App
 * Router pattern): that Response's headers are immutable, so `.append()`
 * throws. `res` is mutable so callers can swap in a rebuilt Response on that
 * path -- see withAuth, which is the only caller that needs to.
 */
class NextResponseAdapter {
    constructor(res) {
        this.res = res;
    }
    appendSetCookie(cookie) {
        try {
            this.res.headers.append('set-cookie', cookie);
        }
        catch (_a) {
            // Headers of a fetch()-derived Response are immutable -- rebuild the
            // response with a mutable copy of its headers before retrying, so the
            // caller's already-held reference (and its own `res`) point at a
            // response that will actually carry the cookie.
            const rebuilt = new Response(this.res.body, {
                status: this.res.status,
                statusText: this.res.statusText,
                headers: new Headers(this.res.headers),
            });
            rebuilt.headers.append('set-cookie', cookie);
            this.res = rebuilt;
        }
    }
    setCookie(name, value, options = {}) {
        this.appendSetCookie(serializeSetCookie(name, value, options));
    }
    deleteCookie(name, options = {}) {
        this.appendSetCookie(serializeDeleteCookie(name, options));
    }
}
/**
 * Next.js (App Router) integration wiring Scalekit Full Stack Auth with the
 * same secure defaults as the Flask/Express/Django adapters: an encrypted
 * session cookie, transparent token refresh on every request, and a
 * `withAuth` wrapper to protect Route Handlers -- so the developer never
 * hand-rolls cookie attributes, refresh timing, or
 * expired/invalid/missing-session branching themselves.
 *
 * Route Handlers are plain functions in the App Router, so each factory here
 * returns one directly, to be re-exported from your own route.ts files:
 *
 *   // app/login/route.ts
 *   export const GET = auth.createLoginHandler();
 *
 *   // app/callback/route.ts
 *   export const GET = auth.createCallbackHandler();
 *
 *   // app/logout/route.ts
 *   export const GET = auth.createLogoutHandler();
 *
 *   // app/account/route.ts
 *   export const GET = auth.withAuth(async (request, { user }) => {
 *     return NextResponse.json({ email: user?.email });
 *   });
 */
class ScalekitAuthNext {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f;
        this.client =
            (_a = options.client) !== null && _a !== void 0 ? _a : new scalekit_1.default(options.envUrl, options.clientId, options.clientSecret);
        this.redirectUri = options.redirectUri;
        this.loginPath = (_b = options.loginPath) !== null && _b !== void 0 ? _b : '/login';
        this.postLoginRedirect = (_c = options.postLoginRedirect) !== null && _c !== void 0 ? _c : '/';
        this.postLogoutRedirectUri =
            (_d = options.postLogoutRedirectUri) !== null && _d !== void 0 ? _d : this.postLoginRedirect;
        this.fullLogout = (_e = options.fullLogout) !== null && _e !== void 0 ? _e : true;
        // Raises immediately if cookieEncryptionSecret is missing -- see
        // SessionRefreshManager and sessionCrypto for why there is
        // intentionally no default.
        this.manager = new sessionManager_1.SessionRefreshManager(this.client, options.cookieEncryptionSecret, (_f = options.cookieName) !== null && _f !== void 0 ? _f : sessionManager_1.DEFAULT_COOKIE_NAME);
    }
    createLoginHandler() {
        return () => __awaiter(this, void 0, void 0, function* () {
            // offline_access is required to get a refreshToken back at all -- see
            // scalekit-sdk-python's scalekit.frameworks.flask for the full
            // explanation (same backend behavior, not framework-specific): a
            // normal FSA client does not get offline_access added automatically --
            // that auto-add only applies to MCP/agent clients.
            // state binds this authorization request to the browser that started
            // it, so createCallbackHandler can reject a forged callback carrying
            // an attacker's own authorization code (CSRF).
            const state = (0, csrfState_1.generateState)();
            const options = {
                scopes: ['openid', 'profile', 'email', 'offline_access'],
                state,
            };
            const url = this.client.getAuthorizationUrl(this.redirectUri, options);
            const response = NextResponse.redirect(url);
            new NextResponseAdapter(response).setCookie(csrfState_1.STATE_COOKIE_NAME, state, {
                maxAge: csrfState_1.STATE_COOKIE_MAX_AGE,
            });
            return response;
        });
    }
    createCallbackHandler() {
        return (request) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const redirectToLogin = () => {
                const resp = NextResponse.redirect(new URL(this.loginPath, request.url));
                new NextResponseAdapter(resp).deleteCookie(csrfState_1.STATE_COOKIE_NAME);
                return resp;
            };
            // The provider redirects here with `error` (no `code`) if the user
            // cancels consent or the request is otherwise rejected -- never
            // reflect error/error_description into the response, it's
            // attacker-influenced.
            const error = request.nextUrl.searchParams.get('error');
            const code = request.nextUrl.searchParams.get('code');
            if (error || !code) {
                return redirectToLogin();
            }
            const storedState = new NextRequestAdapter(request).getCookie(csrfState_1.STATE_COOKIE_NAME);
            const returnedState = (_a = request.nextUrl.searchParams.get('state')) !== null && _a !== void 0 ? _a : undefined;
            if (!(0, csrfState_1.verifyState)(storedState, returnedState)) {
                // Missing or mismatched state -- this callback did not originate
                // from a login this browser actually made. Refuse the exchange.
                return redirectToLogin();
            }
            let cookieValue;
            try {
                const result = yield this.client.authenticateWithCode(code, this.redirectUri);
                // Access-token claims (not id_token claims) are the source of truth
                // for `user` -- customers can configure custom access-token claims in
                // the Scalekit dashboard, and this is also what stays fresh on every
                // refresh (see SessionRefreshManager.doRefresh). idToken is kept
                // separately, only for use as idTokenHint on logout.
                const claims = yield this.client.validateToken(result.accessToken);
                const payload = {
                    user: claims,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    idToken: result.idToken,
                    expiresAt: typeof claims.exp === 'number'
                        ? claims.exp
                        : Date.now() / 1000 + ((_b = result.expiresIn) !== null && _b !== void 0 ? _b : 300),
                };
                // createSessionCookie throws if the encrypted payload exceeds the
                // browser cookie size limit (e.g. several custom access-token
                // claims configured) -- must stay inside this try, not just the
                // network calls above, or this route handler throws with no
                // wrapper around it.
                cookieValue = this.manager.createSessionCookie(payload);
            }
            catch (_c) {
                return redirectToLogin();
            }
            const response = NextResponse.redirect(new URL(this.postLoginRedirect, request.url));
            const adapter = new NextResponseAdapter(response);
            adapter.setCookie(this.manager.cookieName, cookieValue);
            adapter.deleteCookie(csrfState_1.STATE_COOKIE_NAME);
            return response;
        });
    }
    createLogoutHandler() {
        return (request) => __awaiter(this, void 0, void 0, function* () {
            const cookieValue = new NextRequestAdapter(request).getCookie(this.manager.cookieName);
            let idToken;
            if (cookieValue) {
                try {
                    const payload = this.manager.decryptCookieValue(cookieValue);
                    idToken = payload.idToken;
                }
                catch (err) {
                    if (!(err instanceof sessionCrypto_1.InvalidSessionError))
                        throw err;
                    // nothing usable to hint with -- fall through to local-only redirect
                }
            }
            let redirectUrl = this.postLogoutRedirectUri;
            if (this.fullLogout && idToken) {
                // Scalekit requires an absolute, dashboard-registered post-logout
                // redirect URI -- absolutize a relative default against the current
                // request, same as the Flask/Express/Django adapters.
                let absoluteRedirectUri = this.postLogoutRedirectUri;
                if (!/^https?:\/\//.test(absoluteRedirectUri)) {
                    absoluteRedirectUri = new URL(absoluteRedirectUri, request.url).toString();
                }
                const options = {
                    idTokenHint: idToken,
                    postLogoutRedirectUri: absoluteRedirectUri,
                };
                // A real top-level redirect to Scalekit's own domain is required
                // here -- same reason a background fetch/XHR can't do this:
                // Scalekit needs the request to actually carry its own session
                // cookie to end that session.
                redirectUrl = this.client.getLogoutUrl(options);
            }
            const response = NextResponse.redirect(redirectUrl.startsWith('http')
                ? redirectUrl
                : new URL(redirectUrl, request.url));
            new NextResponseAdapter(response).deleteCookie(this.manager.cookieName);
            return response;
        });
    }
    /**
     * Wraps a Route Handler so it only runs when there's a valid (or
     * transparently-refreshed) session. On "no valid session," redirects to
     * `loginPath` -- a real 3xx redirect, never a JSON 401 a background
     * fetch/XHR could silently swallow, same guarantee as the
     * Flask/Express/Django adapters.
     */
    withAuth(handler) {
        return (request, context) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.manager.check(new NextRequestAdapter(request));
            if (!result.authenticated) {
                const response = NextResponse.redirect(new URL(this.loginPath, request.url));
                if (result.shouldClearCookie) {
                    new NextResponseAdapter(response).deleteCookie(this.manager.cookieName);
                }
                return response;
            }
            const response = yield handler(request, Object.assign(Object.assign({}, context), { user: result.user }));
            if (result.newCookieValue) {
                // Capture the adapter, not just `response` -- if the handler's
                // response has immutable headers (e.g. it proxied an upstream
                // fetch() call), the adapter rebuilds it internally and `adapter.res`
                // is the one that actually carries the new cookie.
                const adapter = new NextResponseAdapter(response);
                adapter.setCookie(this.manager.cookieName, result.newCookieValue);
                return adapter.res;
            }
            return response;
        });
    }
}
exports.ScalekitAuthNext = ScalekitAuthNext;
//# sourceMappingURL=nextjs.js.map