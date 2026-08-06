import type { NextFunction, Request, Response, Router } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
let express: typeof import('express');
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  express = require('express');
} catch {
  throw new Error(
    "Express integration requires the 'express' package: npm install express"
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
} from '../middleware/sessionManager';
import { randomBytes, timingSafeEqual } from 'crypto';

// Short-lived cookie carrying the OAuth `state` value between /login and
// /callback -- see scalekit-sdk-python's scalekit.frameworks.flask for the
// full CSRF reasoning (identical here, not framework-specific).
const STATE_COOKIE_NAME = 'sk_oauth_state';
const STATE_COOKIE_MAX_AGE = 600; // 10 minutes

function timingSafeStateEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      scalekitUser?: Record<string, unknown>;
    }
  }
}

function parseCookieHeader(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) {
      try {
        cookies[key] = decodeURIComponent(value);
      } catch {
        cookies[key] = value;
      }
    }
  }
  return cookies;
}

class ExpressRequestAdapter implements RequestAdapter {
  private cookies: Record<string, string>;

  constructor(private req: Request) {
    // Use req.cookies if cookie-parser middleware is present; otherwise parse
    // the raw Cookie header ourselves, so this adapter has no dependency on
    // cookie-parser being installed.
    this.cookies =
      (req as unknown as { cookies?: Record<string, string> }).cookies ??
      parseCookieHeader(req.headers['cookie']);
  }

  getCookie(name: string): string | undefined {
    return this.cookies[name];
  }

  getRequestUrl(): string {
    return `${this.req.protocol}://${this.req.get('host')}${this.req.originalUrl}`;
  }
}

class ExpressResponseAdapter implements ResponseAdapter {
  constructor(private res: Response) {}

  setCookie(name: string, value: string, options: SetCookieOptions = {}): void {
    this.res.cookie(name, value, {
      maxAge: options.maxAge !== undefined ? options.maxAge * 1000 : undefined,
      secure: options.secure ?? true,
      httpOnly: options.httpOnly ?? true,
      sameSite: options.sameSite ?? 'lax',
      domain: options.domain,
      path: options.path ?? '/',
    });
  }

  deleteCookie(name: string, options: DeleteCookieOptions = {}): void {
    this.res.clearCookie(name, {
      path: options.path ?? '/',
      domain: options.domain,
    });
  }
}

export interface ScalekitAuthOptions {
  client?: ScalekitClient;
  clientId?: string;
  clientSecret?: string;
  envUrl?: string;
  redirectUri: string;
  cookieEncryptionSecret: string;
  cookieName?: string;
  loginPath?: string;
  callbackPath?: string;
  logoutPath?: string;
  postLoginRedirect?: string;
  postLogoutRedirectUri?: string;
  /**
   * Defaults to true (end the Scalekit-side session too, via idTokenHint)
   * rather than local-only -- local-only silently leaves the user's
   * Scalekit session alive, so a subsequent /login silently re-authenticates
   * them with no visible login step at all, which is a confusing default
   * for most apps. Set to false to opt into local-only logout.
   */
  fullLogout?: boolean;
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
export class ScalekitAuth {
  readonly client: ScalekitClient;
  readonly manager: SessionRefreshManager;
  readonly router: Router;

  private readonly redirectUri: string;
  private readonly loginPath: string;
  private readonly callbackPath: string;
  private readonly logoutPath: string;
  private readonly postLoginRedirect: string;
  private readonly postLogoutRedirectUri: string;
  private readonly fullLogout: boolean;

  constructor(options: ScalekitAuthOptions) {
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

    this.router = express.Router();
    this.router.get(this.loginPath, this.loginHandler);
    this.router.get(this.callbackPath, this.callbackHandler);
    this.router.get(this.logoutPath, this.logoutHandler);
  }

  get currentUser(): undefined {
    // Present for API symmetry with the Flask/Django adapters. In Express,
    // read `req.scalekitUser` directly inside your handler instead -- there
    // is no per-request "current request" to hang this off of at the class
    // level the way Flask's `g` or Django's `request` object allow.
    return undefined;
  }

  private loginHandler = (_req: Request, res: Response): void => {
    // offline_access is required to get a refreshToken back at all -- see
    // scalekit-sdk-python's scalekit.frameworks.flask for the full
    // explanation (same backend behavior, not framework-specific): a normal
    // FSA client does not get offline_access added automatically -- that
    // auto-add only applies to MCP/agent clients.
    // state binds this authorization request to the browser that started
    // it, so callbackHandler can reject a forged callback carrying an
    // attacker's own authorization code (CSRF).
    const state = randomBytes(32).toString('base64url');
    const options: AuthorizationUrlOptions = {
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      state,
    };
    const url = this.client.getAuthorizationUrl(this.redirectUri, options);
    new ExpressResponseAdapter(res).setCookie(STATE_COOKIE_NAME, state, {
      maxAge: STATE_COOKIE_MAX_AGE,
    });
    res.redirect(url);
  };

  private callbackHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const redirectToLogin = () => {
      new ExpressResponseAdapter(res).deleteCookie(STATE_COOKIE_NAME);
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

    const storedState = new ExpressRequestAdapter(req).getCookie(
      STATE_COOKIE_NAME
    );
    const returnedState = req.query.state;
    if (
      !storedState ||
      typeof returnedState !== 'string' ||
      !returnedState ||
      !timingSafeStateEqual(storedState, returnedState)
    ) {
      // Missing or mismatched state -- this callback did not originate from
      // a /login this browser actually made. Refuse the exchange.
      redirectToLogin();
      return;
    }

    let result;
    let claims: Record<string, unknown>;
    try {
      result = await this.client.authenticateWithCode(code, this.redirectUri);
      // Access-token claims (not id_token claims) are the source of truth for
      // `user` -- customers can configure custom access-token claims in the
      // Scalekit dashboard, and this is also what stays fresh on every refresh
      // (see SessionRefreshManager.doRefresh). idToken is kept separately,
      // only for use as idTokenHint on logout.
      claims = await this.client.validateToken<Record<string, unknown>>(
        result.accessToken
      );
    } catch {
      redirectToLogin();
      return;
    }

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
    const adapter = new ExpressResponseAdapter(res);
    adapter.setCookie(this.manager.cookieName, cookieValue);
    adapter.deleteCookie(STATE_COOKIE_NAME);
    res.redirect(this.postLoginRedirect);
  };

  private logoutHandler = (req: Request, res: Response): void => {
    const cookieValue = new ExpressRequestAdapter(req).getCookie(
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
      const options: LogoutUrlOptions = {
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
  };

  requiresAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const result = await this.manager.check(new ExpressRequestAdapter(req));

    if (!result.authenticated) {
      if (result.shouldClearCookie) {
        new ExpressResponseAdapter(res).deleteCookie(this.manager.cookieName);
      }
      // A real redirect, never a JSON 401 -- a background fetch/XHR would
      // silently swallow a 401, which is exactly the failure mode this
      // design exists to avoid.
      res.redirect(this.loginPath);
      return;
    }

    req.scalekitUser = result.user;
    if (result.newCookieValue) {
      new ExpressResponseAdapter(res).setCookie(
        this.manager.cookieName,
        result.newCookieValue
      );
    }
    next();
  };
}
