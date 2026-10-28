//#region src/types/auth.d.ts
type User = {
  id: string;
  username: string | undefined;
  name: string;
  givenName: string;
  familyName: string | undefined;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | undefined;
  phoneNumberVerified: boolean | undefined;
  profile: string | undefined;
  picture: string | undefined;
  gender: string | undefined;
  birthDate: string | undefined;
  zoneInfo: string | undefined;
  locale: string | undefined;
  updatedAt: string | undefined;
  identities: Identity[];
  metadata: string | undefined;
};
type Identity = {
  connectionId: string;
  organizationId: string;
  connectionType: string;
  providerName: string;
  social: boolean;
  providerRawAttributes: string;
};
type IdTokenClaimIdentity = {
  connection_id: string;
  organization_id: string;
  connection_type: string;
  provider_name: string;
  social: boolean;
  provider_raw_attributes: string;
};
type IdTokenClaim = {
  sub: string;
  name: string;
  preferred_username: string | undefined;
  given_name: string;
  family_name: string | undefined;
  email: string;
  email_verified: boolean;
  phone_number: string | undefined;
  phone_number_verified: boolean | undefined;
  profile: string | undefined;
  picture: string | undefined;
  gender: string | undefined;
  birthdate: string | undefined;
  zoneinfo: string | undefined;
  locale: string | undefined;
  updated_at: string | undefined;
  identities: IdTokenClaimIdentity[];
  metadata: string | undefined;
};
type TokenResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
};
type IdpInitiatedLoginClaims = {
  connection_id: string;
  organization_id: string;
  login_hint: string;
  relay_state?: string;
};
//#endregion
//#region src/types/scalekit.d.ts
declare enum GrantType {
  AuthorizationCode = "authorization_code",
  RefreshToken = "refresh_token",
  ClientCredentials = "client_credentials"
}
type AuthorizationUrlOptions = {
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
type AuthenticationOptions = {
  codeVerifier?: string;
};
type TokenValidationOptions = {
  /** Expected issuer. Pass an array to accept a token whose `iss` equals any entry. */issuer?: string | string[];
  audience?: string[];
  requiredScopes?: string[];
};
type AuthenticationResponse = {
  user: User;
  idToken: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};
type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};
interface LogoutUrlOptions {
  idTokenHint?: string;
  postLogoutRedirectUri?: string;
  state?: string;
}
interface ScalekitOptions {
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
  /**
   * How often, in milliseconds, an HTTP/2 PING is sent to keep a pooled gRPC
   * connection verified — both while it's idle and while a long-running call
   * (e.g. tool execution) is in flight. On a failed ping a fresh connection is
   * opened, so a connection silently dropped by a network intermediary never
   * surfaces as an error on the next real request. Defaults to 60000 (60 s).
   *
   * Must be 0 or at least 60000 — the constructor throws otherwise. Set to
   * `0` to disable keepalive entirely (connect-node's own default of never
   * pinging) if your network path or corporate proxy rejects the pings; do
   * this only as a last resort, since it reintroduces the silent
   * stale-connection failures this option exists to prevent. There is no
   * supported way to ping faster than the default: any value below 60000
   * (other than 0) leaves too little margin over the Scalekit backend's 30s
   * keepalive minimum interval, and gets flagged as abusive.
   */
  pingIntervalMs?: number;
  /**
   * How long, in milliseconds, to wait for a PING response before treating
   * an idle connection as dead and opening a fresh one. Defaults to 5000
   * (5 s).
   */
  pingTimeoutMs?: number;
}
//#endregion
export { LogoutUrlOptions as a, TokenValidationOptions as c, Identity as d, IdpInitiatedLoginClaims as f, GrantType as i, IdTokenClaim as l, User as m, AuthenticationResponse as n, RefreshTokenResponse as o, TokenResponse as p, AuthorizationUrlOptions as r, ScalekitOptions as s, AuthenticationOptions as t, IdTokenClaimIdentity as u };
//# sourceMappingURL=scalekit.d.mts.map