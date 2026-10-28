Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
require("../issuer.cjs");
const require_csrfState = require("../csrfState.cjs");
let next_server_js = require("next/server.js");
let next_headers_js = require("next/headers.js");
//#region src/frameworks/nextjs.ts
var NextRequestAdapter = class {
	constructor(req) {
		this.req = req;
	}
	getCookie(name) {
		return this.req.cookies.get(name)?.value;
	}
	getRequestUrl() {
		return this.req.url;
	}
};
function serializeSetCookie(name, value, options = {}) {
	let cookie = `${name}=${encodeURIComponent(value)}`;
	if (options.maxAge !== void 0) cookie += `; Max-Age=${Math.floor(options.maxAge)}`;
	cookie += `; Path=${options.path ?? "/"}`;
	if (options.domain) cookie += `; Domain=${options.domain}`;
	if (options.httpOnly ?? true) cookie += "; HttpOnly";
	if (options.secure ?? true) cookie += "; Secure";
	const sameSite = options.sameSite ?? "lax";
	cookie += `; SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`;
	return cookie;
}
function serializeDeleteCookie(name, options = {}) {
	let cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=${options.path ?? "/"}`;
	if (options.domain) cookie += `; Domain=${options.domain}`;
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
var NextResponseAdapter = class {
	constructor(res) {
		this.res = res;
	}
	appendSetCookie(cookie) {
		try {
			this.res.headers.append("set-cookie", cookie);
		} catch {
			const rebuilt = new Response(this.res.body, {
				status: this.res.status,
				statusText: this.res.statusText,
				headers: new Headers(this.res.headers)
			});
			rebuilt.headers.append("set-cookie", cookie);
			this.res = rebuilt;
		}
	}
	setCookie(name, value, options = {}) {
		this.appendSetCookie(serializeSetCookie(name, value, options));
	}
	deleteCookie(name, options = {}) {
		this.appendSetCookie(serializeDeleteCookie(name, options));
	}
};
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
var ScalekitAuthNext = class {
	constructor(options) {
		this.client = options.client;
		this.redirectUri = options.redirectUri;
		this.loginPath = options.loginPath ?? "/login";
		this.callbackPath = options.callbackPath ?? "/callback";
		this.logoutPath = options.logoutPath ?? "/logout";
		this.postLoginRedirect = options.postLoginRedirect ?? "/";
		this.postLogoutRedirectUri = options.postLogoutRedirectUri ?? this.postLoginRedirect;
		this.fullLogout = options.fullLogout ?? true;
		this.baseUrl = new URL(this.redirectUri).origin;
		this.manager = new require_csrfState.SessionRefreshManager(this.client, options.cookieEncryptionSecret, options.cookieName ?? "sk_session");
	}
	createLoginHandler() {
		return async (request) => {
			const options = { scopes: [
				"openid",
				"profile",
				"email",
				"offline_access"
			] };
			const idpInitiatedLogin = request.nextUrl.searchParams.get("idp_initiated_login");
			if (idpInitiatedLogin) try {
				const claims = await this.client.getIdpInitiatedLoginClaims(idpInitiatedLogin);
				options.connectionId = claims.connection_id;
				options.organizationId = claims.organization_id;
				options.loginHint = claims.login_hint;
			} catch {}
			const state = require_csrfState.generateState();
			options.state = state;
			const url = this.client.getAuthorizationUrl(this.redirectUri, options);
			const adapter = new NextResponseAdapter(next_server_js.NextResponse.redirect(url));
			adapter.setCookie(require_csrfState.STATE_COOKIE_NAME, state, { maxAge: 600 });
			const returnTo = require_csrfState.sanitizeReturnTo(request.nextUrl.searchParams.get("returnTo"));
			if (returnTo) adapter.setCookie(require_csrfState.RETURN_TO_COOKIE_NAME, returnTo, { maxAge: 600 });
			return adapter.res;
		};
	}
	createCallbackHandler() {
		return async (request) => {
			const redirectToLogin = () => {
				const adapter = new NextResponseAdapter(next_server_js.NextResponse.redirect(new URL(this.loginPath, this.baseUrl)));
				adapter.deleteCookie(require_csrfState.STATE_COOKIE_NAME);
				adapter.deleteCookie(require_csrfState.RETURN_TO_COOKIE_NAME);
				return adapter.res;
			};
			const error = request.nextUrl.searchParams.get("error");
			const code = request.nextUrl.searchParams.get("code");
			if (error || !code) return redirectToLogin();
			const requestAdapter = new NextRequestAdapter(request);
			if (!require_csrfState.verifyState(requestAdapter.getCookie("sk_oauth_state"), request.nextUrl.searchParams.get("state") ?? void 0)) return redirectToLogin();
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
				return redirectToLogin();
			}
			const returnTo = require_csrfState.sanitizeReturnTo(requestAdapter.getCookie(require_csrfState.RETURN_TO_COOKIE_NAME));
			const adapter = new NextResponseAdapter(next_server_js.NextResponse.redirect(new URL(returnTo ?? this.postLoginRedirect, this.baseUrl)));
			adapter.setCookie(this.manager.cookieName, cookieValue);
			adapter.deleteCookie(require_csrfState.STATE_COOKIE_NAME);
			adapter.deleteCookie(require_csrfState.RETURN_TO_COOKIE_NAME);
			return adapter.res;
		};
	}
	createLogoutHandler() {
		return async (request) => {
			const cookieValue = new NextRequestAdapter(request).getCookie(this.manager.cookieName);
			let idToken;
			if (cookieValue) try {
				idToken = (await this.manager.decryptCookieValue(cookieValue)).idToken;
			} catch {}
			let redirectUrl = this.postLogoutRedirectUri;
			if (this.fullLogout && idToken) {
				let absoluteRedirectUri = this.postLogoutRedirectUri;
				if (!/^https?:\/\//.test(absoluteRedirectUri)) absoluteRedirectUri = new URL(absoluteRedirectUri, this.baseUrl).toString();
				const options = {
					idTokenHint: idToken,
					postLogoutRedirectUri: absoluteRedirectUri
				};
				redirectUrl = this.client.getLogoutUrl(options);
			}
			const response = next_server_js.NextResponse.redirect(redirectUrl.startsWith("http") ? redirectUrl : new URL(redirectUrl, this.baseUrl));
			new NextResponseAdapter(response).deleteCookie(this.manager.cookieName);
			return response;
		};
	}
	/**
	* Builds a redirect to the login page when authentication fails.
	* Sanitizes the returnTo query param to prevent open redirect attacks,
	* and conditionally clears the session cookie if needed.
	*/
	buildUnauthenticatedRedirect(request, result, returnToSource) {
		const returnTo = require_csrfState.sanitizeReturnTo(returnToSource);
		const loginUrl = new URL(this.loginPath, this.baseUrl);
		if (returnTo) loginUrl.searchParams.set("returnTo", returnTo);
		const response = next_server_js.NextResponse.redirect(loginUrl);
		if (result.shouldClearCookie) new NextResponseAdapter(response).deleteCookie(this.manager.cookieName);
		return response;
	}
	/**
	* Wraps a Route Handler so it only runs when there's a valid (or
	* transparently-refreshed) session. On "no valid session," redirects to
	* `loginPath` -- a real 3xx redirect, never a JSON 401 a background
	* fetch/XHR could silently swallow, same guarantee as the
	* Flask/Express/Django adapters.
	*/
	withAuth(handler) {
		return async (request, context) => {
			const result = await this.manager.check(new NextRequestAdapter(request));
			if (!result.authenticated) return this.buildUnauthenticatedRedirect(request, result, request.nextUrl.pathname + request.nextUrl.search);
			const response = await handler(request, {
				...context,
				user: result.user
			});
			if (result.newCookieValue) {
				const adapter = new NextResponseAdapter(response);
				adapter.setCookie(this.manager.cookieName, result.newCookieValue);
				return adapter.res;
			}
			return response;
		};
	}
	/**
	* Secure-by-default Next.js middleware: every route is gated unless listed
	* in `publicRoutes` or one of the auth flow's own paths (loginPath,
	* callbackPath, logoutPath -- excluded automatically so the auth flow
	* never redirects to itself). Modeled on WorkOS AuthKit's
	* authkitMiddleware()/unauthenticatedPaths, not an opt-in matcher --
	* deliberately inverts the failure direction so an unlisted route fails
	* *closed* (redirected to login) instead of *open* (silently
	* unprotected).
	*
	* Runs on the Node.js middleware runtime, not Edge Runtime -- verified via
	* a real `next build`: `ScalekitClient` (its User-Agent construction in
	* core.ts, and its gRPC transport) is Node-only, so `export const config`
	* must pin `runtime: 'nodejs'` explicitly, or the build fails. This
	* module's own crypto (sessionCrypto.ts) no longer blocks an Edge move,
	* but ScalekitClient itself would need Edge-safe alternatives first.
	*
	* Next.js requires `export const config = { matcher: [...], runtime:
	* 'nodejs' }` as a separate, statically-analyzable export in your own
	* middleware.ts -- this cannot generate that for you. A recommended
	* default (excluding _next/static, _next/image, favicon.ico) belongs in
	* your own file:
	*
	*   // middleware.ts
	*   export default auth.createMiddleware({ publicRoutes: ['/', '/pricing'] });
	*   export const config = {
	*     runtime: 'nodejs',
	*     matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
	*   };
	*/
	createMiddleware(options = {}) {
		const publicRoutes = new Set(options.publicRoutes ?? []);
		const authFlowPaths = new Set([
			this.loginPath,
			this.callbackPath,
			this.logoutPath
		]);
		return async (request) => {
			const pathname = request.nextUrl.pathname;
			if (authFlowPaths.has(pathname) || publicRoutes.has(pathname)) return next_server_js.NextResponse.next();
			const result = await this.manager.check(new NextRequestAdapter(request));
			if (!result.authenticated) return this.buildUnauthenticatedRedirect(request, result, pathname + request.nextUrl.search);
			const response = next_server_js.NextResponse.next();
			if (result.newCookieValue) new NextResponseAdapter(response).setCookie(this.manager.cookieName, result.newCookieValue);
			return response;
		};
	}
	/**
	* Read-only session lookup for Server Components / Route Handlers / Server
	* Actions -- anywhere `cookies()` from `next/headers` is available. Never
	* refreshes or writes a new cookie (only createMiddleware()/withAuth() can
	* do that) -- a Server Component calling this on a later request after expiry
	* will see the refreshed session. Note: if createMiddleware() refreshed the
	* session during the *current* request, that refreshed cookie is not visible
	* to a Server Component's getSession() call within that same request -- Next.js
	* requires explicitly propagating updated request headers for that, which this
	* method does not do -- so expiresAt may read as already-past in that specific
	* same-request case; the next actual request will see the refreshed cookie normally.
	*
	* Deliberately returns only {user, expiresAt} -- never accessToken/
	* refreshToken. If a real need for a getAccessToken() shows up later,
	* that's a deliberate, separately-considered follow-up, not something to
	* expose by default just because it happens to be in scope here.
	*/
	async getSession() {
		const cookieValue = (await (0, next_headers_js.cookies)()).get(this.manager.cookieName)?.value;
		if (!cookieValue) return null;
		let payload;
		try {
			payload = await this.manager.decryptCookieValue(cookieValue);
		} catch {
			return null;
		}
		const expiresAt = typeof payload.expiresAt === "number" ? payload.expiresAt : 0;
		return {
			user: payload.user ?? {},
			expiresAt
		};
	}
	/** Sugar over getSession() for the common case of just needing the claims. */
	async currentUser() {
		return (await this.getSession())?.user;
	}
};
//#endregion
exports.ScalekitAuthNext = ScalekitAuthNext;

//# sourceMappingURL=nextjs.cjs.map