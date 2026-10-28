Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_issuer = require("../issuer.cjs");
const require_scalekit = require("../scalekit.cjs");
const require_csrfState = require("../csrfState.cjs");
let express = require("express");
express = require_issuer.__toESM(express);
//#region src/frameworks/express.ts
function parseCookieHeader(header) {
	const cookies = {};
	if (!header) return cookies;
	for (const part of header.split(";")) {
		const idx = part.indexOf("=");
		if (idx === -1) continue;
		const key = part.slice(0, idx).trim();
		const value = part.slice(idx + 1).trim();
		if (key) try {
			cookies[key] = decodeURIComponent(value);
		} catch {
			cookies[key] = value;
		}
	}
	return cookies;
}
var ExpressRequestAdapter = class {
	constructor(req) {
		this.req = req;
		this.cookies = req.cookies ?? parseCookieHeader(req.headers["cookie"]);
	}
	getCookie(name) {
		return this.cookies[name];
	}
	getRequestUrl() {
		return `${this.req.protocol}://${this.req.get("host")}${this.req.originalUrl}`;
	}
};
var ExpressResponseAdapter = class {
	constructor(res) {
		this.res = res;
	}
	setCookie(name, value, options = {}) {
		this.res.cookie(name, value, {
			maxAge: options.maxAge !== void 0 ? options.maxAge * 1e3 : void 0,
			secure: options.secure ?? true,
			httpOnly: options.httpOnly ?? true,
			sameSite: options.sameSite ?? "lax",
			domain: options.domain,
			path: options.path ?? "/"
		});
	}
	deleteCookie(name, options = {}) {
		this.res.clearCookie(name, {
			path: options.path ?? "/",
			domain: options.domain
		});
	}
};
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
var ScalekitAuth = class {
	constructor(options) {
		this.loginHandler = async (req, res) => {
			const options = { scopes: [
				"openid",
				"profile",
				"email",
				"offline_access"
			] };
			const idpInitiatedLogin = req.query.idp_initiated_login;
			if (typeof idpInitiatedLogin === "string") try {
				const claims = await this.client.getIdpInitiatedLoginClaims(idpInitiatedLogin);
				options.connectionId = claims.connection_id;
				options.organizationId = claims.organization_id;
				options.loginHint = claims.login_hint;
			} catch {}
			const state = require_csrfState.generateState();
			options.state = state;
			const url = this.client.getAuthorizationUrl(this.redirectUri, options);
			const adapter = new ExpressResponseAdapter(res);
			adapter.setCookie(require_csrfState.STATE_COOKIE_NAME, state, { maxAge: 600 });
			const returnTo = require_csrfState.sanitizeReturnTo(typeof req.query.returnTo === "string" ? req.query.returnTo : void 0);
			if (returnTo) adapter.setCookie(require_csrfState.RETURN_TO_COOKIE_NAME, returnTo, { maxAge: 600 });
			res.redirect(url);
		};
		this.callbackHandler = async (req, res) => {
			const redirectToLogin = () => {
				const adapter = new ExpressResponseAdapter(res);
				adapter.deleteCookie(require_csrfState.STATE_COOKIE_NAME);
				adapter.deleteCookie(require_csrfState.RETURN_TO_COOKIE_NAME);
				res.redirect(this.loginPath);
			};
			const error = req.query.error;
			const code = req.query.code;
			if (error || typeof code !== "string" || !code) {
				redirectToLogin();
				return;
			}
			const requestAdapter = new ExpressRequestAdapter(req);
			const storedState = requestAdapter.getCookie(require_csrfState.STATE_COOKIE_NAME);
			const returnedState = req.query.state;
			if (typeof returnedState !== "string" || !require_csrfState.verifyState(storedState, returnedState)) {
				redirectToLogin();
				return;
			}
			let cookieValue;
			try {
				const result = await this.client.authenticateWithCode(code, this.redirectUri);
				const claims = await this.client.validateToken(result.accessToken);
				const payload = {
					user: claims,
					accessToken: result.accessToken,
					refreshToken: result.refreshToken,
					idToken: result.idToken,
					expiresAt: typeof claims.exp === "number" ? claims.exp : Date.now() / 1e3 + (result.expiresIn ?? 300)
				};
				cookieValue = await this.manager.createSessionCookie(payload);
			} catch {
				redirectToLogin();
				return;
			}
			const adapter = new ExpressResponseAdapter(res);
			adapter.setCookie(this.manager.cookieName, cookieValue);
			adapter.deleteCookie(require_csrfState.STATE_COOKIE_NAME);
			const returnTo = require_csrfState.sanitizeReturnTo(requestAdapter.getCookie(require_csrfState.RETURN_TO_COOKIE_NAME));
			adapter.deleteCookie(require_csrfState.RETURN_TO_COOKIE_NAME);
			res.redirect(returnTo ?? this.postLoginRedirect);
		};
		this.logoutHandler = async (req, res) => {
			const cookieValue = new ExpressRequestAdapter(req).getCookie(this.manager.cookieName);
			let idToken;
			if (cookieValue) try {
				idToken = (await this.manager.decryptCookieValue(cookieValue)).idToken;
			} catch {}
			let redirectUrl = this.postLogoutRedirectUri;
			if (this.fullLogout && idToken) {
				let absoluteRedirectUri = this.postLogoutRedirectUri;
				if (!/^https?:\/\//.test(absoluteRedirectUri)) absoluteRedirectUri = `${req.protocol}://${req.get("host")}${absoluteRedirectUri}`;
				const options = {
					idTokenHint: idToken,
					postLogoutRedirectUri: absoluteRedirectUri
				};
				redirectUrl = this.client.getLogoutUrl(options);
			}
			new ExpressResponseAdapter(res).deleteCookie(this.manager.cookieName);
			res.redirect(redirectUrl);
		};
		this.requiresAuth = async (req, res, next) => {
			const result = await this.manager.check(new ExpressRequestAdapter(req));
			if (!result.authenticated) {
				if (result.shouldClearCookie) new ExpressResponseAdapter(res).deleteCookie(this.manager.cookieName);
				const returnTo = require_csrfState.sanitizeReturnTo(req.originalUrl);
				const loginUrl = returnTo ? `${this.loginPath}?returnTo=${encodeURIComponent(returnTo)}` : this.loginPath;
				res.redirect(loginUrl);
				return;
			}
			req.scalekitUser = result.user;
			if (result.newCookieValue) new ExpressResponseAdapter(res).setCookie(this.manager.cookieName, result.newCookieValue);
			next();
		};
		this.client = options.client ?? new require_scalekit.ScalekitClient(options.envUrl, options.clientId, options.clientSecret);
		this.redirectUri = options.redirectUri;
		this.loginPath = options.loginPath ?? "/login";
		this.callbackPath = options.callbackPath ?? "/callback";
		this.logoutPath = options.logoutPath ?? "/logout";
		this.postLoginRedirect = options.postLoginRedirect ?? "/";
		this.postLogoutRedirectUri = options.postLogoutRedirectUri ?? this.postLoginRedirect;
		this.fullLogout = options.fullLogout ?? true;
		this.manager = new require_csrfState.SessionRefreshManager(this.client, options.cookieEncryptionSecret, options.cookieName ?? "sk_session");
		this.router = express.default.Router();
		this.router.get(this.loginPath, this.loginHandler);
		this.router.get(this.callbackPath, this.callbackHandler);
		this.router.get(this.logoutPath, this.logoutHandler);
	}
	get currentUser() {}
};
//#endregion
exports.ScalekitAuth = ScalekitAuth;

//# sourceMappingURL=express.cjs.map