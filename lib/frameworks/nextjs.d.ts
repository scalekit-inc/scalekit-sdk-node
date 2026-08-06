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
    private readonly postLoginRedirect;
    private readonly postLogoutRedirectUri;
    private readonly fullLogout;
    constructor(options: ScalekitAuthNextOptions);
    createLoginHandler(): () => Promise<AnyNextResponse>;
    createCallbackHandler(): (request: NextRequest) => Promise<AnyNextResponse>;
    createLogoutHandler(): (request: NextRequest) => Promise<AnyNextResponse>;
    /**
     * Wraps a Route Handler so it only runs when there's a valid (or
     * transparently-refreshed) session. On "no valid session," redirects to
     * `loginPath` -- a real 3xx redirect, never a JSON 401 a background
     * fetch/XHR could silently swallow, same guarantee as the
     * Flask/Express/Django adapters.
     */
    withAuth<Ctx = unknown>(handler: (request: NextRequest, context: AuthenticatedRouteContext & Ctx) => Promise<AnyNextResponse> | AnyNextResponse): (request: NextRequest, context?: Ctx) => Promise<AnyNextResponse>;
}
export {};
