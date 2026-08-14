import { AuthenticationOptions, AuthenticationResponse, AuthorizationUrlOptions, LogoutUrlOptions, RefreshTokenResponse, TokenValidationOptions } from './types/scalekit';
import { IdpInitiatedLoginClaims } from './types/auth';
/**
 * Raised on any non-2xx response from Scalekit's REST endpoints. Simple,
 * REST-native shape (statusCode/message/errorCode) rather than the gRPC-
 * oriented src/errors/ hierarchy, which models Connect-RPC status codes that
 * don't map cleanly onto OAuth token-endpoint error responses
 * (invalid_grant, invalid_client, ...).
 */
export declare class ScalekitEdgeError extends Error {
    readonly statusCode: number;
    readonly errorCode?: string | undefined;
    constructor(statusCode: number, message: string, errorCode?: string | undefined);
}
/**
 * Fetch + jose based auth client covering only the methods
 * ScalekitAuth/ScalekitAuthNext need -- an opt-in alternative to
 * ScalekitClient for Next.js Edge Runtime, where ScalekitClient's gRPC
 * transport and os/process-based User-Agent construction do not work. Not a
 * replacement: no organization/connection/directory/etc. methods, and
 * ScalekitClient remains the default for everything else.
 */
export declare class ScalekitEdgeClient {
    private readonly clientId;
    private readonly clientSecret;
    private readonly baseUrl;
    private jwks?;
    constructor(envUrl: string, clientId: string, clientSecret: string);
    private getJwks;
    private buildUrl;
    getAuthorizationUrl(redirectUri: string, options?: AuthorizationUrlOptions): string;
    getLogoutUrl(options?: LogoutUrlOptions): string;
    private postToken;
    authenticateWithCode(code: string, redirectUri: string, options?: AuthenticationOptions): Promise<AuthenticationResponse>;
    refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse>;
    validateToken<T>(token: string, options?: TokenValidationOptions): Promise<T>;
    getIdpInitiatedLoginClaims(idpInitiatedLoginToken: string, options?: TokenValidationOptions): Promise<IdpInitiatedLoginClaims>;
}
