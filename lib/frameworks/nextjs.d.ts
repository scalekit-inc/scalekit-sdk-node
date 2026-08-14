import type { NextRequest } from 'next/server';
import ScalekitClient from '../scalekit';
import { SessionRefreshManager } from '../middleware/sessionManager';
type AnyNextResponse = InstanceType<typeof import('next/server').NextResponse>;
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
export declare class ScalekitAuthNext {
    readonly client: ScalekitClient;
    readonly manager: SessionRefreshManager;
    private readonly redirectUri;
    private readonly loginPath;
    private readonly callbackPath;
    private readonly logoutPath;
    private readonly postLoginRedirect;
    private readonly postLogoutRedirectUri;
    private readonly fullLogout;
    constructor(options: ScalekitAuthNextOptions);
    createLoginHandler(): (request: NextRequest) => Promise<AnyNextResponse>;
    createCallbackHandler(): (request: NextRequest) => Promise<AnyNextResponse>;
    createLogoutHandler(): (request: NextRequest) => Promise<AnyNextResponse>;
    /**
     * Builds a redirect to the login page when authentication fails.
     * Sanitizes the returnTo query param to prevent open redirect attacks,
     * and conditionally clears the session cookie if needed.
     */
    private buildUnauthenticatedRedirect;
    /**
     * Wraps a Route Handler so it only runs when there's a valid (or
     * transparently-refreshed) session. On "no valid session," redirects to
     * `loginPath` -- a real 3xx redirect, never a JSON 401 a background
     * fetch/XHR could silently swallow, same guarantee as the
     * Flask/Express/Django adapters.
     */
    withAuth<Ctx = unknown>(handler: (request: NextRequest, context: AuthenticatedRouteContext & Ctx) => Promise<AnyNextResponse> | AnyNextResponse): (request: NextRequest, context?: Ctx) => Promise<AnyNextResponse>;
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
    createMiddleware(options?: {
        publicRoutes?: string[];
    }): (request: NextRequest) => Promise<AnyNextResponse>;
    /**
     * Read-only session lookup for Server Components / Route Handlers / Server
     * Actions -- anywhere `cookies()` from `next/headers` is available. Never
     * refreshes or writes a new cookie (only createMiddleware()/withAuth() can
     * do that) -- a Server Component calling this right after expiry but
     * before the next middleware-guarded navigation may see a
     * stale-but-not-yet-refreshed session; expiresAt is still honest and the
     * next real navigation refreshes transparently.
     *
     * Deliberately returns only {user, expiresAt} -- never accessToken/
     * refreshToken. If a real need for a getAccessToken() shows up later,
     * that's a deliberate, separately-considered follow-up, not something to
     * expose by default just because it happens to be in scope here.
     */
    getSession(): Promise<{
        user: Record<string, unknown>;
        expiresAt: number;
    } | null>;
    /** Sugar over getSession() for the common case of just needing the claims. */
    currentUser(): Promise<Record<string, unknown> | undefined>;
}
export {};
