import { User } from './auth';

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
  codeChallenge?: string;
  codeChallengeMethod?: string;
  provider?: string;
}

export type AuthenticationOptions = {
  codeVerifier?: string;
}

export type AuthenticationResponse = {
  user: User;
  idToken: string;
  accessToken: string;
  expiresIn: number;
}