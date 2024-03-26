import * as jose from 'jose';
import QueryString from 'qs';
import ConnectionClient from './connection';
import { IdTokenClaimToUserMap } from './constants/user';
import GrpcConnect from './connect';
import CoreClient from './core';
import OrganizationClient from './organization';
import { AuthorizationUrlOptions, CodeAuthenticationOptions, GrantType } from './types/scalekit';
import { IdTokenClaim, User } from './types/user';

const authorizeEndpoint = "oauth/authorize";

export default class Scalekit {
  private readonly coreClient: CoreClient;
  private readonly grpcConnect: GrpcConnect;
  readonly organization: OrganizationClient;
  readonly connection: ConnectionClient;
  constructor(
    private readonly envUrl: string,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {
    this.coreClient = new CoreClient(
      this.envUrl,
      this.clientId,
      this.clientSecret
    );
    this.grpcConnect = new GrpcConnect(
      this.envUrl,
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
  }

  getAuthorizationUrl(
    redirectUri: string,
    options?: AuthorizationUrlOptions
  ) {
    const defaultOptions: AuthorizationUrlOptions = {
      scopes: ['openid', 'profile']
    }
    options = {
      ...defaultOptions,
      ...options
    }
    const qs = QueryString.stringify({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: options.scopes?.join(" "),
      ...(options.state && { state: options.state }),
      ...(options.nonce && { state: options.nonce }),
      ...(options.loginHint && { login_hint: options.loginHint }),
      ...(options.domainHint && { domain_hint: options.domainHint }),
      ...(options.connectionId && { connection_id: options.connectionId }),
      ...(options.organizationId && { organization_id: options.organizationId }),
    })

    return `${this.envUrl}/${authorizeEndpoint}?${qs}`
  }

  async authenticateWithCode(options: CodeAuthenticationOptions) {
    const res = await this.coreClient.authenticate(QueryString.stringify({
      code: options.code,
      redirect_uri: options.redirectUri,
      grant_type: GrantType.AuthorizationCode,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      ...(options.codeVerifier && { code_verifier: options.codeVerifier })
    }))
    const { id_token, access_token } = res.data;
    const claims = jose.decodeJwt<IdTokenClaim>(id_token);
    const user: Partial<User> = {};
    for (const [k, v] of Object.entries(claims)) {
      user[IdTokenClaimToUserMap[k]] = v;
    }

    return {
      user,
      idToken: id_token,
      accessToken: access_token
    }
  }

  async validateAccessToken(token: string) {
    await this.coreClient.getJwks();
    const JWKS = jose.createLocalJWKSet({
      keys: this.coreClient.keys
    })
    const { payload } = await jose.jwtVerify(token, JWKS);

    return payload;
  }
}


