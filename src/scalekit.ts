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
import { IdpInitiatedLoginClaims, IdTokenClaim, User } from './types/auth';
import { AuthenticationOptions, AuthenticationResponse, AuthorizationUrlOptions, GrantType } from './types/scalekit';

const authorizeEndpoint = "oauth/authorize";
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
   * 
   * @example
   * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
   * const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, { scopes: ['openid', 'profile'] });
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
      ...(options.provider && { provider: options.provider })
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
    const { id_token, access_token, expires_in } = res.data;
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
      expiresIn: expires_in
    }
  }

  /**
  * Get the idp initiated login claims
  * 
  * @param {string} idpInitiatedLoginToken The idp_initiated_login query param from the URL
  * @returns {object} Returns the idp initiated login claims
  */
  async getIdpInitiatedLoginClaims(idpInitiatedLoginToken: string): Promise<IdpInitiatedLoginClaims> {
    return this.validateToken<IdpInitiatedLoginClaims>(idpInitiatedLoginToken);
  }

  /**
   * Validates the access token. 
   * 
   * @param {string} token The token to be validated.
   * @return {Promise<boolean>} Returns true if the token is valid, false otherwise.
   */
  async validateAccessToken(token: string): Promise<boolean> {
    try {
      await this.validateToken(token);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Verifies the payload of the webhook
   * 
   * @param {string} secret The secret
   * @param {Record<string, string>} headers The headers
   * @param {string} payload The payload
   * @return {boolean} Returns true if the payload is valid.
   */
  verifyWebhookPayload(secret: string, headers: Record<string, string>, payload: string | Buffer): boolean {
    const webhookId = headers['webhook-id'];
    const webhookTimestamp = headers['webhook-timestamp'];
    const webhookSignature = headers['webhook-signature'];
    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      throw new Error("Missing required headers");
    }
    if (typeof payload === "string") {
      // Do nothing, already a string
    } else if (payload.constructor.name === "Buffer") {
      payload = payload.toString();
    } else {
      throw new Error(
        "Expected payload to be of type string or Buffer."
      );
    }
    const timestamp = this.verifyTimestamp(webhookTimestamp);
    const data = `${webhookId}.${Math.floor(timestamp.getTime() / 1000)}.${payload}`;
    const secretBytes = Buffer.from(secret.split("_")[1], 'base64');
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

    throw new Error("Invalid Signature");
  }

  /**
   * Validate token
   * 
   * @param {string} token The token to be validated
   * @return {Promise<T>} Returns the payload of the token
   */
  private async validateToken<T>(token: string): Promise<T> {
    await this.coreClient.getJwks();
    const jwks = jose.createLocalJWKSet({
      keys: this.coreClient.keys
    })
    try {
      const { payload } = await jose.jwtVerify<T>(token, jwks);
      return payload;
    } catch (_) {
      throw new Error("Invalid token");
    }
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
      throw new Error("Invalid timestamp");
    }
    if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) {
      throw new Error("Message timestamp too old");
    }
    if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
      throw new Error("Message timestamp too new");
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
}


