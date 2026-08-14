import type { NextRequest } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
let NextResponse: typeof import('next/server').NextResponse;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ NextResponse } = require('next/server'));
} catch {
  throw new Error(
    "Next.js integration requires the 'next' package: npm install next"
  );
}

import ScalekitClient from '../scalekit';
import { AuthorizationUrlOptions, LogoutUrlOptions } from '../types/scalekit';
import {
  DeleteCookieOptions,
  RequestAdapter,
  ResponseAdapter,
  SetCookieOptions,
} from '../middleware/protocol';
import {
  DEFAULT_COOKIE_NAME,
  ScalekitClientLike,
  SessionRefreshManager,
  SessionResult,
} from '../middleware/sessionManager';
import {
  generateState,
  RETURN_TO_COOKIE_NAME,
  sanitizeReturnTo,
  STATE_COOKIE_MAX_AGE,
  STATE_COOKIE_NAME,
  verifyState,
} from '../middleware/csrfState';

type AnyNextResponse = InstanceType<typeof import('next/server').NextResponse>;

class NextRequestAdapter implements RequestAdapter {
  constructor(private req: NextRequest) {}

  getCookie(name: string): string | undefined {
    return this.req.cookies.get(name)?.value;
  }

  getRequestUrl(): string {
    return this.req.url;
  }
}

function serializeSetCookie(
  name: string,
  value: string,
  options: SetCookieOptions = {}
): string {
  let cookie = `${name}=${encodeURIComponent(value)}`;
  if (options.maxAge !== undefined)
    cookie += `; Max-Age=${Math.floor(options.maxAge)}`;
  cookie += `; Path=${options.path ?? '/'}`;
  if (options.domain) cookie += `; Domain=${options.domain}`;
  if (options.httpOnly ?? true) cookie += '; HttpOnly';
  if (options.secure ?? true) cookie += '; Secure';
  const sameSite = options.sameSite ?? 'lax';
  cookie += `; SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`;
  return cookie;
}

function serializeDeleteCookie(
  name: string,
  options: DeleteCookieOptions = {}
): string {
  let cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=${options.path ?? '/'}`;
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
class NextResponseAdapter implements ResponseAdapter {
  constructor(public res: Response) {}

  private appendSetCookie(cookie: string): void {
    try {
      this.res.headers.append('set-cookie', cookie);
    } catch {
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

  setCookie(name: string, value: string, options: SetCookieOptions = {}): void {
    this.appendSetCookie(serializeSetCookie(name, value, options));
  }

  deleteCookie(name: string, options: DeleteCookieOptions = {}): void {
    this.appendSetCookie(serializeDeleteCookie(name, options));
  }
}

export interface ScalekitAuthNextOptions {
  client?: ScalekitClient;
  clientId?: string;
  clientSecret?: string;
  envUrl?: string;
  redirectUri: string;
  cookieEncryptionSecret: string;
  cookieName?: string;
  loginPath?: string;
  postLoginRedirect?: string;
  postLogoutRedirectUri?: string;
  /**
   * Defaults to true (end the Scalekit-side session too, via idTokenHint)
   * rather than local-only -- local-only silently leaves the user's
   * Scalekit session alive, so a subsequent login silently re-authenticates
   * them with no visible login step at all, which is a confusing default
   * for most apps. Set to false to opt into local-only logout.
   */
  fullLogout?: boolean;
  /**
   * Only used by createMiddleware() to auto-exclude the auth flow's own
   * routes from the secure-by-default gating check -- Next.js doesn't
   * self-register routes the way Express's Router does, so these three
   * paths must be told explicitly (defaults match the conventional
   * app/callback/route.ts, app/logout/route.ts locations).
   */
  callbackPath?: string;
  logoutPath?: string;
}

export interface AuthenticatedRouteContext {
  user: Record<string, unknown> | undefined;
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
export class ScalekitAuthNext {
  readonly client: ScalekitClient;
  readonly manager: SessionRefreshManager;

  private readonly redirectUri: string;
  private readonly loginPath: string;
  private readonly callbackPath: string;
  private readonly logoutPath: string;
  private readonly postLoginRedirect: string;
  private readonly postLogoutRedirectUri: string;
  private readonly fullLogout: boolean;

  constructor(options: ScalekitAuthNextOptions) {
    this.client =
      options.client ??
      new ScalekitClient(
        options.envUrl!,
        options.clientId!,
        options.clientSecret!
      );
    this.redirectUri = options.redirectUri;
    this.loginPath = options.loginPath ?? '/login';
    this.callbackPath = options.callbackPath ?? '/callback';
    this.logoutPath = options.logoutPath ?? '/logout';
    this.postLoginRedirect = options.postLoginRedirect ?? '/';
    this.postLogoutRedirectUri =
      options.postLogoutRedirectUri ?? this.postLoginRedirect;
    this.fullLogout = options.fullLogout ?? true;

    // Raises immediately if cookieEncryptionSecret is missing -- see
    // SessionRefreshManager and sessionCrypto for why there is
    // intentionally no default.
    this.manager = new SessionRefreshManager(
      this.client as unknown as ScalekitClientLike,
      options.cookieEncryptionSecret,
      options.cookieName ?? DEFAULT_COOKIE_NAME
    );
  }

  createLoginHandler() {
    return async (request: NextRequest): Promise<AnyNextResponse> => {
      // offline_access is required to get a refreshToken back at all -- see
      // scalekit-sdk-python's scalekit.frameworks.flask for the full
      // explanation (same backend behavior, not framework-specific): a
      // normal FSA client does not get offline_access added automatically --
      // that auto-add only applies to MCP/agent clients.
      const options: AuthorizationUrlOptions = {
        scopes: ['openid', 'profile', 'email', 'offline_access'],
      };

      // This handler doubles as the dashboard-registered "Initiate Login
      // URL" -- see scalekit-sdk-python's scalekit.frameworks.flask for the
      // full reasoning. relayState is intentionally not forwarded as our
      // OAuth `state` -- we use our own random value for CSRF cookie-binding
      // instead (see below).
      const idpInitiatedLogin = request.nextUrl.searchParams.get(
        'idp_initiated_login'
      );
      if (idpInitiatedLogin) {
        try {
          const claims =
            await this.client.getIdpInitiatedLoginClaims(idpInitiatedLogin);
          options.connectionId = claims.connection_id;
          options.organizationId = claims.organization_id;
          options.loginHint = claims.login_hint;
        } catch {
          // falls back to a normal login below
        }
      }

      // Bind this authorization request to the browser that started it, so
      // createCallbackHandler can reject a forged callback carrying an
      // attacker's own authorization code (CSRF).
      const state = generateState();
      options.state = state;
      const url = this.client.getAuthorizationUrl(this.redirectUri, options);
      const response = NextResponse.redirect(url);
      const adapter = new NextResponseAdapter(response);
      adapter.setCookie(STATE_COOKIE_NAME, state, {
        maxAge: STATE_COOKIE_MAX_AGE,
      });

      const returnTo = sanitizeReturnTo(
        request.nextUrl.searchParams.get('returnTo')
      );
      if (returnTo) {
        adapter.setCookie(RETURN_TO_COOKIE_NAME, returnTo, {
          maxAge: STATE_COOKIE_MAX_AGE,
        });
      }

      return adapter.res as AnyNextResponse;
    };
  }

  createCallbackHandler() {
    return async (request: NextRequest): Promise<AnyNextResponse> => {
      const redirectToLogin = () => {
        const resp = NextResponse.redirect(
          new URL(this.loginPath, request.url)
        );
        const adapter = new NextResponseAdapter(resp);
        adapter.deleteCookie(STATE_COOKIE_NAME);
        adapter.deleteCookie(RETURN_TO_COOKIE_NAME);
        return adapter.res as AnyNextResponse;
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

      const requestAdapter = new NextRequestAdapter(request);
      const storedState = requestAdapter.getCookie(STATE_COOKIE_NAME);
      const returnedState =
        request.nextUrl.searchParams.get('state') ?? undefined;
      if (!verifyState(storedState, returnedState)) {
        // Missing or mismatched state -- this callback did not originate
        // from a login this browser actually made. Refuse the exchange.
        return redirectToLogin();
      }

      let cookieValue: string;
      try {
        const result = await this.client.authenticateWithCode(
          code,
          this.redirectUri
        );
        // Access-token claims (not id_token claims) are the source of truth
        // for `user` -- customers can configure custom access-token claims in
        // the Scalekit dashboard, and this is also what stays fresh on every
        // refresh (see SessionRefreshManager.doRefresh). idToken is kept
        // separately, only for use as idTokenHint on logout.
        const claims = await this.client.validateToken<Record<string, unknown>>(
          result.accessToken
        );
        const payload = {
          user: claims,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          idToken: result.idToken,
          expiresAt:
            typeof claims.exp === 'number'
              ? claims.exp
              : Date.now() / 1000 + (result.expiresIn ?? 300),
        };
        // createSessionCookie throws if the encrypted payload exceeds the
        // browser cookie size limit (e.g. several custom access-token
        // claims configured) -- must stay inside this try, not just the
        // network calls above, or this route handler throws with no
        // wrapper around it.
        cookieValue = await this.manager.createSessionCookie(payload);
      } catch {
        return redirectToLogin();
      }

      const returnTo = sanitizeReturnTo(
        requestAdapter.getCookie(RETURN_TO_COOKIE_NAME)
      );
      const response = NextResponse.redirect(
        new URL(returnTo ?? this.postLoginRedirect, request.url)
      );
      const adapter = new NextResponseAdapter(response);
      adapter.setCookie(this.manager.cookieName, cookieValue);
      adapter.deleteCookie(STATE_COOKIE_NAME);
      adapter.deleteCookie(RETURN_TO_COOKIE_NAME);
      return adapter.res as AnyNextResponse;
    };
  }

  createLogoutHandler() {
    return async (request: NextRequest): Promise<AnyNextResponse> => {
      const cookieValue = new NextRequestAdapter(request).getCookie(
        this.manager.cookieName
      );
      let idToken: string | undefined;
      if (cookieValue) {
        try {
          const payload = await this.manager.decryptCookieValue(cookieValue);
          idToken = payload.idToken as string | undefined;
        } catch {
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
          absoluteRedirectUri = new URL(
            absoluteRedirectUri,
            request.url
          ).toString();
        }
        const options: LogoutUrlOptions = {
          idTokenHint: idToken,
          postLogoutRedirectUri: absoluteRedirectUri,
        };
        // A real top-level redirect to Scalekit's own domain is required
        // here -- same reason a background fetch/XHR can't do this:
        // Scalekit needs the request to actually carry its own session
        // cookie to end that session.
        redirectUrl = this.client.getLogoutUrl(options);
      }

      const response = NextResponse.redirect(
        redirectUrl.startsWith('http')
          ? redirectUrl
          : new URL(redirectUrl, request.url)
      );
      new NextResponseAdapter(response).deleteCookie(this.manager.cookieName);
      return response;
    };
  }

  /**
   * Builds a redirect to the login page when authentication fails.
   * Sanitizes the returnTo query param to prevent open redirect attacks,
   * and conditionally clears the session cookie if needed.
   */
  private buildUnauthenticatedRedirect(
    request: NextRequest,
    result: SessionResult,
    returnToSource: string
  ): AnyNextResponse {
    const returnTo = sanitizeReturnTo(returnToSource);
    const loginUrl = new URL(this.loginPath, request.url);
    if (returnTo) {
      loginUrl.searchParams.set('returnTo', returnTo);
    }
    const response = NextResponse.redirect(loginUrl);
    if (result.shouldClearCookie) {
      new NextResponseAdapter(response).deleteCookie(this.manager.cookieName);
    }
    return response as AnyNextResponse;
  }

  /**
   * Wraps a Route Handler so it only runs when there's a valid (or
   * transparently-refreshed) session. On "no valid session," redirects to
   * `loginPath` -- a real 3xx redirect, never a JSON 401 a background
   * fetch/XHR could silently swallow, same guarantee as the
   * Flask/Express/Django adapters.
   */
  withAuth<Ctx = unknown>(
    handler: (
      request: NextRequest,
      context: AuthenticatedRouteContext & Ctx
    ) => Promise<AnyNextResponse> | AnyNextResponse
  ) {
    return async (
      request: NextRequest,
      context?: Ctx
    ): Promise<AnyNextResponse> => {
      const result: SessionResult = await this.manager.check(
        new NextRequestAdapter(request)
      );

      if (!result.authenticated) {
        return this.buildUnauthenticatedRedirect(
          request,
          result,
          request.nextUrl.pathname + request.nextUrl.search
        );
      }

      const response = await handler(request, {
        ...(context as Ctx),
        user: result.user,
      });

      if (result.newCookieValue) {
        // Capture the adapter, not just `response` -- if the handler's
        // response has immutable headers (e.g. it proxied an upstream
        // fetch() call), the adapter rebuilds it internally and `adapter.res`
        // is the one that actually carries the new cookie.
        const adapter = new NextResponseAdapter(response);
        adapter.setCookie(this.manager.cookieName, result.newCookieValue);
        return adapter.res as AnyNextResponse;
      }
      return response;
    };
  }

  /**
   * Secure-by-default Edge middleware: every route is gated unless listed in
   * `publicRoutes` or one of the auth flow's own paths (loginPath,
   * callbackPath, logoutPath -- excluded automatically so the auth flow
   * never redirects to itself). Modeled on WorkOS AuthKit's
   * authkitMiddleware()/unauthenticatedPaths, not an opt-in matcher --
   * deliberately inverts the failure direction so an unlisted route fails
   * *closed* (redirected to login) instead of *open* (silently
   * unprotected).
   *
   * Next.js requires `export const config = { matcher: [...] }` as a
   * separate, statically-analyzable export in your own middleware.ts --
   * this cannot generate that for you. A recommended default (excluding
   * _next/static, _next/image, favicon.ico) belongs in your own file:
   *
   *   // middleware.ts
   *   export default auth.createMiddleware({ publicRoutes: ['/', '/pricing'] });
   *   export const config = {
   *     matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
   *   };
   */
  createMiddleware(options: { publicRoutes?: string[] } = {}) {
    const publicRoutes = new Set(options.publicRoutes ?? []);
    const authFlowPaths = new Set([
      this.loginPath,
      this.callbackPath,
      this.logoutPath,
    ]);

    return async (request: NextRequest): Promise<AnyNextResponse> => {
      const pathname = request.nextUrl.pathname;
      if (authFlowPaths.has(pathname) || publicRoutes.has(pathname)) {
        return NextResponse.next() as AnyNextResponse;
      }

      const result = await this.manager.check(new NextRequestAdapter(request));

      if (!result.authenticated) {
        return this.buildUnauthenticatedRedirect(
          request,
          result,
          pathname + request.nextUrl.search
        );
      }

      const response = NextResponse.next();
      if (result.newCookieValue) {
        new NextResponseAdapter(response).setCookie(
          this.manager.cookieName,
          result.newCookieValue
        );
      }
      return response as AnyNextResponse;
    };
  }
}
