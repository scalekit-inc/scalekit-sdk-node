import * as jose from 'jose';
import QueryString from 'qs';
import { IdTokenClaimToUserMap } from './constants/user';
import {
  AuthenticationOptions,
  AuthenticationResponse,
  AuthorizationUrlOptions,
  GrantType,
  LogoutUrlOptions,
  RefreshTokenResponse,
  TokenValidationOptions,
} from './types/scalekit';
import { IdTokenClaim, IdpInitiatedLoginClaims, User } from './types/auth';

/**
 * Raised on any non-2xx response from Scalekit's REST endpoints. Simple,
 * REST-native shape (statusCode/message/errorCode) rather than the gRPC-
 * oriented src/errors/ hierarchy, which models Connect-RPC status codes that
 * don't map cleanly onto OAuth token-endpoint error responses
 * (invalid_grant, invalid_client, ...).
 */
export class ScalekitEdgeError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errorCode?: string
  ) {
    super(message);
    this.name = 'ScalekitEdgeError';
  }
}

const AUTHORIZE_PATH = 'oauth/authorize';
const LOGOUT_PATH = 'oidc/logout';
const TOKEN_PATH = 'oauth/token';
const JWKS_PATH = 'keys';

/**
 * Fetch + jose based auth client covering only the methods
 * ScalekitAuth/ScalekitAuthNext need -- an opt-in alternative to
 * ScalekitClient for Next.js Edge Runtime, where ScalekitClient's gRPC
 * transport and os/process-based User-Agent construction do not work. Not a
 * replacement: no organization/connection/directory/etc. methods, and
 * ScalekitClient remains the default for everything else.
 */
export class ScalekitEdgeClient {
  private readonly baseUrl: string;
  private jwks?: ReturnType<typeof jose.createRemoteJWKSet>;

  constructor(
    envUrl: string,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {
    this.baseUrl = envUrl.replace(/\/+$/, '');
  }

  private getJwks(): ReturnType<typeof jose.createRemoteJWKSet> {
    if (!this.jwks) {
      this.jwks = jose.createRemoteJWKSet(
        new URL(`${this.baseUrl}/${JWKS_PATH}`)
      );
    }
    return this.jwks;
  }

  private buildUrl(
    path: string,
    params: Record<string, string | undefined>
  ): string {
    const url = new URL(`${this.baseUrl}/${path}`);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  }

  getAuthorizationUrl(
    redirectUri: string,
    options?: AuthorizationUrlOptions
  ): string {
    const scopes = options?.scopes ?? ['openid', 'profile', 'email'];
    return this.buildUrl(AUTHORIZE_PATH, {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      connection_id: options?.connectionId,
      organization_id: options?.organizationId,
      state: options?.state,
      nonce: options?.nonce,
      domain_hint: options?.domainHint,
      domain: options?.domainHint,
      login_hint: options?.loginHint,
      code_challenge: options?.codeChallenge,
      code_challenge_method: options?.codeChallengeMethod,
      provider: options?.provider,
      prompt: options?.prompt,
    });
  }

  getLogoutUrl(options?: LogoutUrlOptions): string {
    return this.buildUrl(LOGOUT_PATH, {
      id_token_hint: options?.idTokenHint,
      post_logout_redirect_uri: options?.postLogoutRedirectUri,
      state: options?.state,
    });
  }

  private async postToken(body: Record<string, string>): Promise<{
    id_token?: string;
    access_token: string;
    expires_in?: number;
    refresh_token: string;
  }> {
    const response = await fetch(`${this.baseUrl}/${TOKEN_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: QueryString.stringify(body),
    });

    const data = (await response.json()) as {
      id_token?: string;
      access_token: string;
      expires_in?: number;
      refresh_token: string;
      error?: string;
      error_description?: string;
    };
    if (!response.ok) {
      throw new ScalekitEdgeError(
        response.status,
        data.error_description ?? data.error ?? 'token request failed',
        data.error
      );
    }
    return data;
  }

  async authenticateWithCode(
    code: string,
    redirectUri: string,
    options?: AuthenticationOptions
  ): Promise<AuthenticationResponse> {
    const data = await this.postToken({
      code,
      redirect_uri: redirectUri,
      grant_type: GrantType.AuthorizationCode,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      ...(options?.codeVerifier && { code_verifier: options.codeVerifier }),
    });

    const claims = jose.decodeJwt<IdTokenClaim>(data.id_token!);
    const user = <User>{};
    for (const [k, v] of Object.entries(claims)) {
      if (IdTokenClaimToUserMap[k as keyof IdTokenClaim]) {
        (user as Record<string, unknown>)[
          IdTokenClaimToUserMap[k as keyof IdTokenClaim]
        ] = v;
      }
    }

    return {
      user,
      idToken: data.id_token!,
      accessToken: data.access_token,
      expiresIn: data.expires_in!,
      refreshToken: data.refresh_token,
    };
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    const data = await this.postToken({
      grant_type: GrantType.RefreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    });

    // Validate that all required properties exist
    if (!data.access_token) {
      throw new Error('Missing access_token in authentication response');
    }
    if (!data.refresh_token) {
      throw new Error('Missing refresh_token in authentication response');
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  }

  async validateToken<T>(
    token: string,
    options?: TokenValidationOptions
  ): Promise<T> {
    try {
      const { payload } = await jose.jwtVerify<T>(token, this.getJwks(), {
        ...(options?.issuer && { issuer: options.issuer }),
        ...(options?.audience && { audience: options.audience }),
      });

      if (options?.requiredScopes && options.requiredScopes.length > 0) {
        const claims = jose.decodeJwt(token);
        const scopes = Array.isArray(claims.scopes)
          ? claims.scopes.filter((scope: string) => !!scope?.trim?.())
          : [];
        const missing = options.requiredScopes.filter(
          (s) => !scopes.includes(s)
        );
        if (missing.length > 0) {
          throw new Error(
            `Token missing required scopes: ${missing.join(', ')}`
          );
        }
      }

      return payload;
    } catch (err) {
      // Explicit allowlist of bad-token-shaped errors that should be wrapped as 401.
      // These indicate the token itself is invalid, expired, or lacks required scopes.
      const badTokenShapedErrors = [
        jose.errors.JWTClaimValidationFailed,
        jose.errors.JWTExpired,
        jose.errors.JWSSignatureVerificationFailed,
        jose.errors.JWTInvalid,
        jose.errors.JWSInvalid,
        jose.errors.JWKSNoMatchingKey,
      ];

      // Check if error matches any bad-token-shaped class, or is our own requiredScopes check
      const isBadTokenError =
        badTokenShapedErrors.some((cls) => err instanceof cls) ||
        (err instanceof Error &&
          err.message.includes('Token missing required scopes'));

      if (isBadTokenError) {
        const message = err instanceof Error ? err.message : String(err);
        throw new ScalekitEdgeError(401, `token validation failed: ${message}`);
      }

      // Everything else (JWKSInvalid, JWKSMultipleMatchingKeys, JWKSTimeout, JOSENotSupported,
      // JOSEAlgNotAllowed, JWEInvalid, JWEDecryptionFailed, JWKInvalid, raw network errors, etc.)
      // propagates as-is. These are infrastructure/config problems, not bad-token-shaped failures.
      throw err;
    }
  }

  async getIdpInitiatedLoginClaims(
    idpInitiatedLoginToken: string,
    options?: TokenValidationOptions
  ): Promise<IdpInitiatedLoginClaims> {
    return this.validateToken<IdpInitiatedLoginClaims>(
      idpInitiatedLoginToken,
      options
    );
  }
}
