import type { NextFunction, Request, Response, Router } from 'express';
import { ScalekitAuthClient } from '../middleware/protocol';
import { SessionRefreshManager } from '../middleware/sessionManager';
declare global {
    namespace Express {
        interface Request {
            scalekitUser?: Record<string, unknown>;
        }
    }
}
export interface ScalekitAuthOptions {
    client?: ScalekitAuthClient;
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
export declare class ScalekitAuth {
    readonly client: ScalekitAuthClient;
    readonly manager: SessionRefreshManager;
    readonly router: Router;
    private readonly redirectUri;
    private readonly loginPath;
    private readonly callbackPath;
    private readonly logoutPath;
    private readonly postLoginRedirect;
    private readonly postLogoutRedirectUri;
    private readonly fullLogout;
    constructor(options: ScalekitAuthOptions);
    get currentUser(): undefined;
    private loginHandler;
    private callbackHandler;
    private logoutHandler;
    requiresAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
