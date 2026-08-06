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
 * `Headers.append('set-cookie', ...)` works identically on both.
 */
class NextResponseAdapter {
    constructor(res) {
        this.res = res;
    }
    setCookie(name, value, options = {}) {
        this.res.headers.append('set-cookie', serializeSetCookie(name, value, options));
    }
    deleteCookie(name, options = {}) {
        this.res.headers.append('set-cookie', serializeDeleteCookie(name, options));
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
            const options = {
                scopes: ['openid', 'profile', 'email', 'offline_access'],
            };
            const url = this.client.getAuthorizationUrl(this.redirectUri, options);
            return NextResponse.redirect(url);
        });
    }
    createCallbackHandler() {
        return (request) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const code = (_a = request.nextUrl.searchParams.get('code')) !== null && _a !== void 0 ? _a : '';
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
            const cookieValue = this.manager.createSessionCookie(payload);
            const response = NextResponse.redirect(new URL(this.postLoginRedirect, request.url));
            new NextResponseAdapter(response).setCookie(this.manager.cookieName, cookieValue);
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
                new NextResponseAdapter(response).setCookie(this.manager.cookieName, result.newCookieValue);
            }
            return response;
        });
    }
}
exports.ScalekitAuthNext = ScalekitAuthNext;
//# sourceMappingURL=nextjs.js.map