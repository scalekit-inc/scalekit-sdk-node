import crypto from 'crypto';
import * as jose from 'jose';
import QueryString from 'qs';
import GrpcConnect from './connect';
import ConnectionClient from './connection';
import { IdTokenClaimToUserMap } from './constants/user';
import CoreClient from './core';
import DirectoryClient from './directory';
import DomainClient from './domain';
import OrganizationClient from './organization';
import PasswordlessClient from './passwordless';
import UserClient from './user';
import SessionClient from './session';
import { IdpInitiatedLoginClaims, IdTokenClaim, User } from './types/auth';
import { AuthenticationOptions, AuthenticationResponse, AuthorizationUrlOptions, GrantType, LogoutUrlOptions, RefreshTokenResponse ,TokenValidationOptions } from './types/scalekit';
import { WebhookVerificationError, ScalekitValidateTokenFailureException } from './errors/base-exception';

const authorizeEndpoint = "oauth/authorize";
const logoutEndpoint = "oidc/logout";
const WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60; // 5 minutes
const WEBHOOK_SIGNATURE_VERSION = "v1";

/**
 * To initiate scalekit
 * @param {string} envUrl The environment url
 * @param {string} clientId The client id
 * @param {string} clientSecret The client secret
 * @returns {ScalekitClient} Returns the scalekit instance 
 * @example
 * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
*/
export default class ScalekitClient {
  private readonly coreClient: CoreClient;
  private readonly grpcConnect: GrpcConnect;
  readonly organization: OrganizationClient;
  readonly connection: ConnectionClient;
  readonly domain: DomainClient;
  readonly directory: DirectoryClient;
  readonly passwordless: PasswordlessClient;
  readonly user: UserClient;
  readonly session: SessionClient;
  constructor(
    envUrl: string,
    clientId: string,
    clientSecret: string
  ) {
    this.coreClient = new CoreClient(
      envUrl,
      clientId,
      clientSecret
    );
    this.grpcConnect = new GrpcConnect(
      this.coreClient
    );

    this.organization = new OrganizationClient(
      this.grpcConnect,
      this.coreClient
    );
    this.connection = new ConnectionClient(
      this.grpcConnect,
      this.coreClient
    );
    this.domain = new DomainClient(
      this.grpcConnect,
      this.coreClient
    );
    this.directory = new DirectoryClient(
      this.grpcConnect,
      this.coreClient
    );
    this.passwordless = new PasswordlessClient(
      this.grpcConnect,
      this.coreClient
    );
    this.user = new UserClient(
      this.grpcConnect,
      this.coreClient
    );
      this.session = new SessionClient(
      this.grpcConnect,
      this.coreClient
    );
}

  /**
   * Returns the authorization url to initiate the authentication request.
   * @param {string} redirectUri Redirect uri
   * @param {AuthorizationUrlOptions} options Authorization url options
   * @param {string[]} options.scopes Scopes to request from the user 
   * @param {string} options.state State parameter
   * @param {string} options.nonce Nonce parameter 
   * @param {string} options.loginHint Login hint parameter
   * @param {string} options.domainHint Domain hint parameter
   * @param {string} options.connectionId Connection id parameter
   * @param {string} options.organizationId Organization id parameter
   * @param {string} options.provider Provider i.e. google, github, etc.
   * @param {string} options.codeChallenge Code challenge parameter in case of PKCE
   * @param {string} options.codeChallengeMethod Code challenge method parameter in case of PKCE
   * @param {string} options.prompt Prompt parameter to control the authorization server's authentication behavior
   * 
   * @example
   * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
   * const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, { 
   *   scopes: ['openid', 'profile'],
   *   prompt: 'create'
   * });
   * @returns {string} authorization url
   */
  getAuthorizationUrl(
    redirectUri: string,
    options?: AuthorizationUrlOptions
  ): string {
    const defaultOptions: AuthorizationUrlOptions = {
      scopes: ['openid', 'profile', 'email']
    }
    options = {
      ...defaultOptions,
      ...options
    }
    const qs = QueryString.stringify({
      response_type: 'code',
      client_id: this.coreClient.clientId,
      redirect_uri: redirectUri,
      scope: options.scopes?.join(" "),
      ...(options.state && { state: options.state }),
      ...(options.nonce && { nonce: options.nonce }),
      ...(options.loginHint && { login_hint: options.loginHint }),
      ...(options.domainHint && { domain_hint: options.domainHint }),
      ...(options.domainHint && { domain: options.domainHint }),
      ...(options.connectionId && { connection_id: options.connectionId }),
      ...(options.organizationId && { organization_id: options.organizationId }),
      ...(options.codeChallenge && { code_challenge: options.codeChallenge }),
      ...(options.codeChallengeMethod && { code_challenge_method: options.codeChallengeMethod }),
      ...(options.provider && { provider: options.provider }),
      ...(options.prompt && { prompt: options.prompt })
    })

    return `${this.coreClient.envUrl}/${authorizeEndpoint}?${qs}`
  }

  /**
   * Authenticate with the code
   * @param {string} code Code
   * @param {string} redirectUri Redirect uri
   * @param {AuthenticationOptions} options Code authentication options
   * @param {string} options.codeVerifier Code verifier in case of PKCE
   * @returns {Promise<AuthenticationResponse>} Returns user, id token and access token
   */
  async authenticateWithCode(
    code: string,
    redirectUri: string,
    options?: AuthenticationOptions,
  ): Promise<AuthenticationResponse> {
    const res = await this.coreClient.authenticate(QueryString.stringify({
      code: code,
      redirect_uri: redirectUri,
      grant_type: GrantType.AuthorizationCode,
      client_id: this.coreClient.clientId,
      client_secret: this.coreClient.clientSecret,
      ...(options?.codeVerifier && { code_verifier: options.codeVerifier })
    }))
    const { id_token, access_token, expires_in , refresh_token } = res.data;
    const claims = jose.decodeJwt<IdTokenClaim>(id_token);
    const user = <User>{};
    for (const [k, v] of Object.entries(claims)) {
      if (IdTokenClaimToUserMap[k]) {
        user[IdTokenClaimToUserMap[k]] = v;
      }
    }

    return {
      user,
      idToken: id_token,
      accessToken: access_token,
      expiresIn: expires_in,
      refreshToken: refresh_token
    }
  }

  /**
  * Get the idp initiated login claims
  * 
  * @param {string} idpInitiatedLoginToken The idp_initiated_login query param from the URL
  * @param {TokenValidationOptions} options Optional validation options for issuer and audience
  * @returns {object} Returns the idp initiated login claims
  */
  async getIdpInitiatedLoginClaims(idpInitiatedLoginToken: string, options?: TokenValidationOptions): Promise<IdpInitiatedLoginClaims> {
    return this.validateToken<IdpInitiatedLoginClaims>(idpInitiatedLoginToken, options);
  }

  /**
   * Validates the access token and returns a boolean result.
   * 
   * @param {string} token The token to be validated.
   * @param {TokenValidationOptions} options Optional validation options for issuer, audience, and scopes
   * @return {Promise<boolean>} Returns true if the token is valid, false otherwise.
   */
  async validateAccessToken(token: string, options?: TokenValidationOptions): Promise<boolean> {
    try {
      await this.validateToken(token, options);
      return true;
    } catch (_) {
      return false;
    }
  }



  /**
   * Returns the logout URL that can be used to log out the user.
   * @param {LogoutUrlOptions} options Logout URL options
   * @param {string} options.idTokenHint The ID Token previously issued to the client
   * @param {string} options.postLogoutRedirectUri URL to redirect after logout
   * @param {string} options.state Opaque value to maintain state between request and callback
   * @returns {string} The logout URL
   * 
   * @example
   * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
   * const logoutUrl = scalekit.getLogoutUrl({
   *   postLogoutRedirectUri: 'https://example.com',
   *   state: 'some-state'
   * });
   */
  getLogoutUrl(options?: LogoutUrlOptions): string {
    const qs = QueryString.stringify({
      ...(options?.idTokenHint && { id_token_hint: options.idTokenHint }),
      ...(options?.postLogoutRedirectUri && { post_logout_redirect_uri: options.postLogoutRedirectUri }),
      ...(options?.state && { state: options.state })
    });

    return `${this.coreClient.envUrl}/${logoutEndpoint}${qs ? `?${qs}` : ''}`;
  }

  /**
   * Verify webhook payload
   * 
   * @param {string} secret The secret
   * @param {Record<string, string>} headers The headers
   * @param {string} payload The payload
   * @return {boolean} Returns true if the payload is valid.
   */
  verifyWebhookPayload(secret: string, headers: Record<string, string>, payload: string): boolean {
    const webhookId = headers['webhook-id'];
    const webhookTimestamp = headers['webhook-timestamp'];
    const webhookSignature = headers['webhook-signature'];
    
    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      throw new WebhookVerificationError("Missing required headers");
    }
    
    const secretParts = secret.split("_");
    if (secretParts.length < 2) {
      throw new WebhookVerificationError("Invalid secret");
    }
    
    try {
      const timestamp = this.verifyTimestamp(webhookTimestamp);
      const data = `${webhookId}.${Math.floor(timestamp.getTime() / 1000)}.${payload}`;
      const secretBytes = Buffer.from(secretParts[1], 'base64');
      const computedSignature = this.computeSignature(secretBytes, data);
      const receivedSignatures = webhookSignature.split(" ");
      
      for (const versionedSignature of receivedSignatures) {
        const [version, signature] = versionedSignature.split(",");
        if (version !== WEBHOOK_SIGNATURE_VERSION) {
          continue;
        }
        if (crypto.timingSafeEqual(Buffer.from(signature, 'base64'), Buffer.from(computedSignature, 'base64'))) {
          return true;
        }
      }

      throw new WebhookVerificationError("Invalid signature");
    } catch (error) {
      if (error instanceof WebhookVerificationError) {
        throw error;
      }
      throw new WebhookVerificationError("Invalid signature");
    }
  }

  /**
   * Validates a token and returns its payload if valid.
   * Supports issuer, audience, and scope validation.
   * 
   * @param {string} token The token to be validated
   * @param {TokenValidationOptions} options Optional validation options for issuer, audience, and scopes
   * @return {Promise<T>} Returns the token payload if valid
   * @throws {ScalekitValidateTokenFailureException} If token is invalid or missing required scopes
   */
  async validateToken<T>(token: string, options?: TokenValidationOptions): Promise<T> {
    await this.coreClient.getJwks();
    const jwks = jose.createLocalJWKSet({
      keys: this.coreClient.keys
    })
    try {
      const { payload } = await jose.jwtVerify<T>(token, jwks, {
        ...(options?.issuer && { issuer: options.issuer }),
        ...(options?.audience && { audience: options.audience })
      });
      
      if (options?.requiredScopes && options.requiredScopes.length > 0) {
        this.verifyScopes(token, options.requiredScopes);
      }

      return payload;
    } catch (error) {
      throw new ScalekitValidateTokenFailureException(error);
    }
  }

  /**
   * Verify that the token contains the required scopes
   * 
   * @param {string} token The token to verify
   * @param {string[]} requiredScopes The scopes that must be present in the token
   * @return {boolean} Returns true if all required scopes are present
   * @throws {ScalekitValidateTokenFailureException} If required scopes are missing, with details about which scopes are missing
   */
  verifyScopes(token: string, requiredScopes: string[]): boolean {
    const payload = jose.decodeJwt(token);
    const scopes = this.extractScopesFromPayload(payload);
    
    const missingScopes = requiredScopes.filter(scope => !scopes.includes(scope));
    
    if (missingScopes.length > 0) {
      throw new ScalekitValidateTokenFailureException(`Token missing required scopes: ${missingScopes.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Extract scopes from token payload
   * 
   * @param {any} payload The token payload
   * @return {string[]} Array of scopes found in the token
   */
  private extractScopesFromPayload(payload: Record<string, any>): string[] {
    const scopes = payload.scopes;
    return Array.isArray(scopes)
      ? scopes.filter((scope) => !!scope.trim?.())
      : [];
  }

  /**
   * Verify the timestamp
   * 
   * @param {string} timestampStr The timestamp string
   * @return {Date} Returns the timestamp
   */
  private verifyTimestamp(timestampStr: string): Date {
    const now = Math.floor(Date.now() / 1000);
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) {
      throw new WebhookVerificationError("Invalid Signature Headers");
    }
    if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) {
      throw new WebhookVerificationError("Message timestamp too old");
    }
    if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
      throw new WebhookVerificationError("Message timestamp too new");
    }

    return new Date(timestamp * 1000);
  }

  /**
   * Compute the signature
   * 
   * @param {Buffer} secretBytes The secret bytes
   * @param {string} data The data to be signed
   * @return {string} Returns the signature
   */
  private computeSignature(secretBytes: Buffer, data: string): string {
    return crypto.createHmac('sha256', secretBytes).update(data).digest('base64');
  }

  /**
   * Refresh access token using a refresh token
   * @param {string} refreshToken The refresh token to use
   * @returns {Promise<RefreshTokenResponse>} Returns new access token, refresh token and other details
   * @throws {Error} When authentication fails or response data is invalid
   */
  async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    let res;
    try {
      res = await this.coreClient.authenticate(QueryString.stringify({
        grant_type: GrantType.RefreshToken,
        client_id: this.coreClient.clientId,
        client_secret: this.coreClient.clientSecret,
        refresh_token: refreshToken
      }));
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    if (!res || !res.data) {
      throw new Error("Invalid response from authentication server");
    }

    const { access_token, refresh_token } = res.data;

    // Validate that all required properties exist
    if (!access_token) {
      throw new Error("Missing access_token in authentication response");
    }
    if (!refresh_token) {
      throw new Error("Missing refresh_token in authentication response");
    }

    return {
      accessToken: access_token,
      refreshToken: refresh_token
    };
  }
}

