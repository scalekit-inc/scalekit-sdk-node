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
exports.ScalekitAuth = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
let express;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    express = require('express');
}
catch (_a) {
    throw new Error("Express integration requires the 'express' package: npm install express");
}
const scalekit_1 = __importDefault(require("../scalekit"));
const sessionManager_1 = require("../middleware/sessionManager");
const csrfState_1 = require("../middleware/csrfState");
function parseCookieHeader(header) {
    const cookies = {};
    if (!header)
        return cookies;
    for (const part of header.split(';')) {
        const idx = part.indexOf('=');
        if (idx === -1)
            continue;
        const key = part.slice(0, idx).trim();
        const value = part.slice(idx + 1).trim();
        if (key) {
            try {
                cookies[key] = decodeURIComponent(value);
            }
            catch (_a) {
                cookies[key] = value;
            }
        }
    }
    return cookies;
}
class ExpressRequestAdapter {
    constructor(req) {
        var _a;
        this.req = req;
        // Use req.cookies if cookie-parser middleware is present; otherwise parse
        // the raw Cookie header ourselves, so this adapter has no dependency on
        // cookie-parser being installed.
        this.cookies =
            (_a = req.cookies) !== null && _a !== void 0 ? _a : parseCookieHeader(req.headers['cookie']);
    }
    getCookie(name) {
        return this.cookies[name];
    }
    getRequestUrl() {
        return `${this.req.protocol}://${this.req.get('host')}${this.req.originalUrl}`;
    }
}
class ExpressResponseAdapter {
    constructor(res) {
        this.res = res;
    }
    setCookie(name, value, options = {}) {
        var _a, _b, _c, _d;
        this.res.cookie(name, value, {
            maxAge: options.maxAge !== undefined ? options.maxAge * 1000 : undefined,
            secure: (_a = options.secure) !== null && _a !== void 0 ? _a : true,
            httpOnly: (_b = options.httpOnly) !== null && _b !== void 0 ? _b : true,
            sameSite: (_c = options.sameSite) !== null && _c !== void 0 ? _c : 'lax',
            domain: options.domain,
            path: (_d = options.path) !== null && _d !== void 0 ? _d : '/',
        });
    }
    deleteCookie(name, options = {}) {
        var _a;
        this.res.clearCookie(name, {
            path: (_a = options.path) !== null && _a !== void 0 ? _a : '/',
            domain: options.domain,
        });
    }
}
/**
 * Express integration wiring Scalekit Full Stack Auth into an Express app
 * with secure defaults out of the box: an encrypted session cookie,
 * transparent token refresh on every request, and a `requiresAuth`
 * middleware to protect routes -- so the developer never hand-rolls cookie
 * attributes, refresh timing, or expired/invalid/missing-session branching
 * themselves.
 *
 * Usage:
 *   const auth = new ScalekitAuth({
 *     clientId, clientSecret, envUrl,
 *     redirectUri: 'https://myapp.com/callback',
 *     cookieEncryptionSecret,
 *   });
 *   app.use(auth.router);
 *
 *   app.get('/account', auth.requiresAuth, (req, res) => {
 *     res.send(`Hello ${req.scalekitUser?.email}`);
 *   });
 */
class ScalekitAuth {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.loginHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // offline_access is required to get a refreshToken back at all -- see
            // scalekit-sdk-python's scalekit.frameworks.flask for the full
            // explanation (same backend behavior, not framework-specific): a normal
            // FSA client does not get offline_access added automatically -- that
            // auto-add only applies to MCP/agent clients.
            const options = {
                scopes: ['openid', 'profile', 'email', 'offline_access'],
            };
            // This handler doubles as the dashboard-registered "Initiate Login URL":
            // Scalekit lands users here (not /callback) for a bookmarked/direct
            // login-page hit, an IdP portal tile, or an invite/magic link. If
            // there's an active session at that moment, Scalekit attaches an
            // idpInitiatedLogin JWT so the flow can jump straight to the right
            // connection/org instead of a generic login. relayState is
            // intentionally not forwarded as our OAuth `state` -- we use our own
            // random value for CSRF cookie-binding instead (see below).
            const idpInitiatedLogin = req.query.idp_initiated_login;
            if (typeof idpInitiatedLogin === 'string') {
                try {
                    const claims = yield this.client.getIdpInitiatedLoginClaims(idpInitiatedLogin);
                    options.connectionId = claims.connection_id;
                    options.organizationId = claims.organization_id;
                    options.loginHint = claims.login_hint;
                }
                catch (_a) {
                    // falls back to a normal login below
                }
            }
            // Bind this authorization request to the browser that started it, so
            // callbackHandler can reject a forged callback carrying an attacker's
            // own authorization code (CSRF).
            const state = (0, csrfState_1.generateState)();
            options.state = state;
            const url = this.client.getAuthorizationUrl(this.redirectUri, options);
            const adapter = new ExpressResponseAdapter(res);
            adapter.setCookie(csrfState_1.STATE_COOKIE_NAME, state, {
                maxAge: csrfState_1.STATE_COOKIE_MAX_AGE,
            });
            // Preserve the page the caller was trying to reach (set by requiresAuth's
            // redirect below) so callbackHandler can send them back there instead of
            // the fixed postLoginRedirect -- re-validated here since query strings
            // are always attacker-influenceable, even if requiresAuth's own value was
            // somehow bypassed by a direct /login?returnTo= hit.
            const returnTo = (0, csrfState_1.sanitizeReturnTo)(typeof req.query.returnTo === 'string' ? req.query.returnTo : undefined);
            if (returnTo) {
                adapter.setCookie(csrfState_1.RETURN_TO_COOKIE_NAME, returnTo, {
                    maxAge: csrfState_1.STATE_COOKIE_MAX_AGE,
                });
            }
            res.redirect(url);
        });
        this.callbackHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const redirectToLogin = () => {
                const adapter = new ExpressResponseAdapter(res);
                adapter.deleteCookie(csrfState_1.STATE_COOKIE_NAME);
                adapter.deleteCookie(csrfState_1.RETURN_TO_COOKIE_NAME);
                res.redirect(this.loginPath);
            };
            // The provider redirects here with `error` (no `code`) if the user
            // cancels consent or the request is otherwise rejected -- never reflect
            // error/error_description into the response, it's attacker-influenced.
            const error = req.query.error;
            const code = req.query.code;
            if (error || typeof code !== 'string' || !code) {
                redirectToLogin();
                return;
            }
            const requestAdapter = new ExpressRequestAdapter(req);
            const storedState = requestAdapter.getCookie(csrfState_1.STATE_COOKIE_NAME);
            const returnedState = req.query.state;
            if (typeof returnedState !== 'string' ||
                !(0, csrfState_1.verifyState)(storedState, returnedState)) {
                // Missing or mismatched state -- this callback did not originate from
                // a /login this browser actually made. Refuse the exchange.
                redirectToLogin();
                return;
            }
            let cookieValue;
            try {
                const result = yield this.client.authenticateWithCode(code, this.redirectUri);
                // Access-token claims (not id_token claims) are the source of truth for
                // `user` -- customers can configure custom access-token claims in the
                // Scalekit dashboard, and this is also what stays fresh on every refresh
                // (see SessionRefreshManager.doRefresh). idToken is kept separately,
                // only for use as idTokenHint on logout.
                const claims = yield this.client.validateToken(result.accessToken);
                const payload = {
                    user: claims,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    idToken: result.idToken,
                    expiresAt: typeof claims.exp === 'number'
                        ? claims.exp
                        : Date.now() / 1000 + ((_a = result.expiresIn) !== null && _a !== void 0 ? _a : 300),
                };
                // createSessionCookie throws if the encrypted payload exceeds the
                // browser cookie size limit (e.g. a customer with several custom
                // access-token claims configured) -- must stay inside this try, not
                // just the network calls above, or an async handler wired directly
                // into Express's router throws with no wrapper. On Express 4 (allowed
                // by this package's peerDeps) that's an unhandled rejection, not an
                // error response.
                cookieValue = yield this.manager.createSessionCookie(payload);
            }
            catch (_b) {
                redirectToLogin();
                return;
            }
            const adapter = new ExpressResponseAdapter(res);
            adapter.setCookie(this.manager.cookieName, cookieValue);
            adapter.deleteCookie(csrfState_1.STATE_COOKIE_NAME);
            const returnTo = (0, csrfState_1.sanitizeReturnTo)(requestAdapter.getCookie(csrfState_1.RETURN_TO_COOKIE_NAME));
            adapter.deleteCookie(csrfState_1.RETURN_TO_COOKIE_NAME);
            res.redirect(returnTo !== null && returnTo !== void 0 ? returnTo : this.postLoginRedirect);
        });
        this.logoutHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cookieValue = new ExpressRequestAdapter(req).getCookie(this.manager.cookieName);
            let idToken;
            if (cookieValue) {
                try {
                    const payload = yield this.manager.decryptCookieValue(cookieValue);
                    idToken = payload.idToken;
                }
                catch (_a) {
                    // nothing usable to hint with -- fall through to local-only redirect
                }
            }
            let redirectUrl = this.postLogoutRedirectUri;
            if (this.fullLogout && idToken) {
                // Scalekit requires an absolute, dashboard-registered post-logout
                // redirect URI -- absolutize a relative default against the current
                // request's host, same as the Flask/FastAPI/Django adapters.
                //
                // req.protocol only reflects "https" behind a TLS-terminating proxy
                // if the app has `app.set('trust proxy', ...)` configured -- see
                // https://expressjs.com/en/guide/behind-proxies.html. Without it,
                // this can build an http:// URI in production, which Scalekit's
                // dashboard will reject if the registered URI is https://. Either
                // configure trust proxy, or pass an absolute postLogoutRedirectUri
                // to the constructor to bypass this entirely.
                let absoluteRedirectUri = this.postLogoutRedirectUri;
                if (!/^https?:\/\//.test(absoluteRedirectUri)) {
                    absoluteRedirectUri = `${req.protocol}://${req.get('host')}${absoluteRedirectUri}`;
                }
                const options = {
                    idTokenHint: idToken,
                    postLogoutRedirectUri: absoluteRedirectUri,
                };
                // A real top-level redirect to Scalekit's own domain is required here
                // -- same reason a background fetch/XHR can't do this: Scalekit needs
                // the request to actually carry its own session cookie to end that
                // session.
                redirectUrl = this.client.getLogoutUrl(options);
            }
            new ExpressResponseAdapter(res).deleteCookie(this.manager.cookieName);
            res.redirect(redirectUrl);
        });
        this.requiresAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.manager.check(new ExpressRequestAdapter(req));
            if (!result.authenticated) {
                if (result.shouldClearCookie) {
                    new ExpressResponseAdapter(res).deleteCookie(this.manager.cookieName);
                }
                // A real redirect, never a JSON 401 -- a background fetch/XHR would
                // silently swallow a 401, which is exactly the failure mode this
                // design exists to avoid.
                const returnTo = (0, csrfState_1.sanitizeReturnTo)(req.originalUrl);
                const loginUrl = returnTo
                    ? `${this.loginPath}?returnTo=${encodeURIComponent(returnTo)}`
                    : this.loginPath;
                res.redirect(loginUrl);
                return;
            }
            req.scalekitUser = result.user;
            if (result.newCookieValue) {
                new ExpressResponseAdapter(res).setCookie(this.manager.cookieName, result.newCookieValue);
            }
            next();
        });
        this.client =
            (_a = options.client) !== null && _a !== void 0 ? _a : new scalekit_1.default(options.envUrl, options.clientId, options.clientSecret);
        this.redirectUri = options.redirectUri;
        this.loginPath = (_b = options.loginPath) !== null && _b !== void 0 ? _b : '/login';
        this.callbackPath = (_c = options.callbackPath) !== null && _c !== void 0 ? _c : '/callback';
        this.logoutPath = (_d = options.logoutPath) !== null && _d !== void 0 ? _d : '/logout';
        this.postLoginRedirect = (_e = options.postLoginRedirect) !== null && _e !== void 0 ? _e : '/';
        this.postLogoutRedirectUri =
            (_f = options.postLogoutRedirectUri) !== null && _f !== void 0 ? _f : this.postLoginRedirect;
        this.fullLogout = (_g = options.fullLogout) !== null && _g !== void 0 ? _g : true;
        // Raises immediately if cookieEncryptionSecret is missing -- see
        // SessionRefreshManager and sessionCrypto for why there is
        // intentionally no default.
        this.manager = new sessionManager_1.SessionRefreshManager(this.client, options.cookieEncryptionSecret, (_h = options.cookieName) !== null && _h !== void 0 ? _h : sessionManager_1.DEFAULT_COOKIE_NAME);
        this.router = express.Router();
        this.router.get(this.loginPath, this.loginHandler);
        this.router.get(this.callbackPath, this.callbackHandler);
        this.router.get(this.logoutPath, this.logoutHandler);
    }
    get currentUser() {
        // Present for API symmetry with the Flask/Django adapters. In Express,
        // read `req.scalekitUser` directly inside your handler instead -- there
        // is no per-request "current request" to hang this off of at the class
        // level the way Flask's `g` or Django's `request` object allow.
        return undefined;
    }
}
exports.ScalekitAuth = ScalekitAuth;
//# sourceMappingURL=express.js.map