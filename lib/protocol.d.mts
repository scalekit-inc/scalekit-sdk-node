import { a as LogoutUrlOptions, c as TokenValidationOptions, f as IdpInitiatedLoginClaims, n as AuthenticationResponse, o as RefreshTokenResponse, r as AuthorizationUrlOptions, t as AuthenticationOptions } from "./scalekit.mjs";

//#region src/middleware/protocol.d.ts
/**
 * Framework-agnostic view of an incoming HTTP request.
 *
 * Framework integrations (Express, Next.js, ...) implement this interface so
 * the core session/refresh logic (`SessionRefreshManager`) never imports a
 * specific web framework.
 */
interface RequestAdapter {
  getCookie(name: string): string | undefined;
  getRequestUrl(): string;
}
/**
 * Minimal shape of the auth-flow methods every framework adapter (Express,
 * Next.js) needs from a client -- satisfied structurally by both the full
 * ScalekitClient (gRPC + REST) and ScalekitEdgeClient (REST-only, Edge-safe).
 * Adapters depend on this, never the concrete ScalekitClient class, so a
 * customer can pass either without any adapter code caring which.
 */
interface ScalekitAuthClient {
  getAuthorizationUrl(redirectUri: string, options?: AuthorizationUrlOptions): string;
  authenticateWithCode(code: string, redirectUri: string, options?: AuthenticationOptions): Promise<AuthenticationResponse>;
  refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse>;
  validateToken<T>(token: string, options?: TokenValidationOptions): Promise<T>;
  getLogoutUrl(options?: LogoutUrlOptions): string;
  getIdpInitiatedLoginClaims(idpInitiatedLoginToken: string, options?: TokenValidationOptions): Promise<IdpInitiatedLoginClaims>;
}
interface SetCookieOptions {
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  domain?: string;
  path?: string;
}
interface DeleteCookieOptions {
  path?: string;
  domain?: string;
}
/**
 * Framework-agnostic view of an outgoing HTTP response.
 *
 * Cookie attributes are set here, not left to the developer -- callers of
 * `setCookie` always get `httpOnly`, `secure`, and `sameSite` applied by the
 * adapter implementation, using the defaults documented on each option.
 */
interface ResponseAdapter {
  setCookie(name: string, value: string, options?: SetCookieOptions): void;
  deleteCookie(name: string, options?: DeleteCookieOptions): void;
}
//#endregion
export { ResponseAdapter as n, ScalekitAuthClient as r, RequestAdapter as t };
//# sourceMappingURL=protocol.d.mts.map