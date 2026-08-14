import {
  AuthorizationUrlOptions,
  LogoutUrlOptions,
} from './types/scalekit';

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

  constructor(
    envUrl: string,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {
    this.baseUrl = envUrl.replace(/\/+$/, '');
  }

  private buildUrl(path: string, params: Record<string, string | undefined>): string {
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
}
