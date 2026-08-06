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
import { InvalidSessionError } from '../middleware/sessionCrypto';
import {
  DEFAULT_COOKIE_NAME,
  ScalekitClientLike,
  SessionRefreshManager,
  SessionResult,
} from '../middleware/sessionManager';

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
 * `Headers.append('set-cookie', ...)` works identically on both.
 */
class NextResponseAdapter implements ResponseAdapter {
  constructor(private res: Response) {}

  setCookie(name: string, value: string, options: SetCookieOptions = {}): void {
    this.res.headers.append(
      'set-cookie',
      serializeSetCookie(name, value, options)
    );
  }

  deleteCookie(name: string, options: DeleteCookieOptions = {}): void {
    this.res.headers.append('set-cookie', serializeDeleteCookie(name, options));
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
    return async (): Promise<AnyNextResponse> => {
      // offline_access is required to get a refreshToken back at all -- see
      // scalekit-sdk-python's scalekit.frameworks.flask for the full
      // explanation (same backend behavior, not framework-specific): a
      // normal FSA client does not get offline_access added automatically --
      // that auto-add only applies to MCP/agent clients.
      const options: AuthorizationUrlOptions = {
        scopes: ['openid', 'profile', 'email', 'offline_access'],
      };
      const url = this.client.getAuthorizationUrl(this.redirectUri, options);
      return NextResponse.redirect(url);
    };
  }

  createCallbackHandler() {
    return async (request: NextRequest): Promise<AnyNextResponse> => {
      const code = request.nextUrl.searchParams.get('code') ?? '';
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
      const cookieValue = this.manager.createSessionCookie(payload);
      const response = NextResponse.redirect(
        new URL(this.postLoginRedirect, request.url)
      );
      new NextResponseAdapter(response).setCookie(
        this.manager.cookieName,
        cookieValue
      );
      return response;
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
          const payload = this.manager.decryptCookieValue(cookieValue);
          idToken = payload.idToken as string | undefined;
        } catch (err) {
          if (!(err instanceof InvalidSessionError)) throw err;
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
        const response = NextResponse.redirect(
          new URL(this.loginPath, request.url)
        );
        if (result.shouldClearCookie) {
          new NextResponseAdapter(response).deleteCookie(
            this.manager.cookieName
          );
        }
        return response;
      }

      const response = await handler(request, {
        ...(context as Ctx),
        user: result.user,
      });

      if (result.newCookieValue) {
        new NextResponseAdapter(response).setCookie(
          this.manager.cookieName,
          result.newCookieValue
        );
      }
      return response;
    };
  }
}
