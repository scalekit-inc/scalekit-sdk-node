
export enum GrantType {
  AuthorizationCode = 'authorization_code',
  RefreshToken = 'refresh_token',
  ClientCredentials = 'client_credentials',
}

export type AuthorizationUrlOptions = {
  connectionId?: string;
  organizationId?: string;
  scopes?: string[];
  state?: string;
  nonce?: string;
  domainHint?: string;
  loginHint?: string;
}

export type CodeAuthenticationOptions = {
  code: string;
  redirectUri: string;
  codeVerifier?: string;
}

export type RefreshTokenAuthenticationOptions = {
  code: string;
  redirectUri: string;
}


export type AuthenticationOptions = {
  refreshToken: string;
}