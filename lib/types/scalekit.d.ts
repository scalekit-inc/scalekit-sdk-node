import { User } from './user';
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
};
export type AuthenticationOptions = {
    codeVerifier?: string;
};
export type AuthenticationResponse = {
    user: Partial<User>;
    idToken: string;
    accessToken: string;
};
