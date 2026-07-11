import { User } from './auth';
export declare enum GrantType {
    AuthorizationCode = "authorization_code",
    RefreshToken = "refresh_token",
    ClientCredentials = "client_credentials"
}
export type AuthorizationUrlOptions = {
    connectionId?: string;
    organizationId?: string;
    scopes?: string[];
    state?: string;
    nonce?: string;
    domainHint?: string;
    loginHint?: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
    provider?: string;
    prompt?: string;
};
export type AuthenticationOptions = {
    codeVerifier?: string;
};
export type TokenValidationOptions = {
    issuer?: string;
    audience?: string[];
    requiredScopes?: string[];
};
export type AuthenticationResponse = {
    user: User;
    idToken: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
};
export type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
};
export interface LogoutUrlOptions {
    idTokenHint?: string;
    postLogoutRedirectUri?: string;
    state?: string;
}
export interface ScalekitOptions {
    /**
     * Control-plane timeout in milliseconds, applied to gRPC RPCs
     * (organizations, users, connections, etc) and to the SDK's own HTTP calls
     * (token endpoint, JWKS).
     *
     * Must be set below your infrastructure's backend timeout (e.g. GCP LB default
     * is 30 s) so the SDK deadline fires first and surfaces a clean DeadlineExceeded
     * error rather than a raw TCP abort. Defaults to 20000 (20 s).
     *
     * The deadline applies per attempt: automatic retries (Unauthenticated,
     * Unavailable) each get a fresh deadline, so total wall time under retry
     * can exceed this value.
     *
     * Must be a positive finite number; the constructor throws otherwise.
     */
    timeoutMs?: number;
    /**
     * Call timeout in milliseconds for tool-execution calls:
     * `tools.*`, `actions.executeTool`, and `actions.request`.
     * (The connected-account methods under `actions.*` are control-plane
     * operations and use `timeoutMs`.)
     *
     * These calls proxy to third-party provider APIs (e.g. Google Calendar, Slack)
     * and can legitimately run longer than typical control-plane calls, so they use
     * their own, longer deadline instead of `timeoutMs`. Defaults to 60000 (60 s).
     *
     * Must be a positive finite number; the constructor throws otherwise.
     */
    toolTimeoutMs?: number;
}
