import ConnectionClient from './connection';
import DirectoryClient from './directory';
import DomainClient from './domain';
import OrganizationClient from './organization';
import PasswordlessClient from './passwordless';
import UserClient from './user';
import SessionClient from './session';
import { IdpInitiatedLoginClaims } from './types/auth';
import { AuthenticationOptions, AuthenticationResponse, AuthorizationUrlOptions, LogoutUrlOptions, RefreshTokenResponse, TokenValidationOptions } from './types/scalekit';
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
    private readonly coreClient;
    private readonly grpcConnect;
    readonly organization: OrganizationClient;
    readonly connection: ConnectionClient;
    readonly domain: DomainClient;
    readonly directory: DirectoryClient;
    readonly passwordless: PasswordlessClient;
    readonly user: UserClient;
    readonly session: SessionClient;
    constructor(envUrl: string, clientId: string, clientSecret: string);
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
    getAuthorizationUrl(redirectUri: string, options?: AuthorizationUrlOptions): string;
    /**
     * Authenticate with the code
     * @param {string} code Code
     * @param {string} redirectUri Redirect uri
     * @param {AuthenticationOptions} options Code authentication options
     * @param {string} options.codeVerifier Code verifier in case of PKCE
     * @returns {Promise<AuthenticationResponse>} Returns user, id token and access token
     */
    authenticateWithCode(code: string, redirectUri: string, options?: AuthenticationOptions): Promise<AuthenticationResponse>;
    /**
    * Get the idp initiated login claims
    *
    * @param {string} idpInitiatedLoginToken The idp_initiated_login query param from the URL
    * @param {TokenValidationOptions} options Optional validation options for issuer and audience
    * @returns {object} Returns the idp initiated login claims
    */
    getIdpInitiatedLoginClaims(idpInitiatedLoginToken: string, options?: TokenValidationOptions): Promise<IdpInitiatedLoginClaims>;
    /**
     * Validates the access token and returns a boolean result.
     *
     * @param {string} token The token to be validated.
     * @param {TokenValidationOptions} options Optional validation options for issuer, audience, and scopes
     * @return {Promise<boolean>} Returns true if the token is valid, false otherwise.
     */
    validateAccessToken(token: string, options?: TokenValidationOptions): Promise<boolean>;
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
    getLogoutUrl(options?: LogoutUrlOptions): string;
    /**
     * Verify webhook payload
     *
     * @param {string} secret The secret
     * @param {Record<string, string>} headers The headers
     * @param {string} payload The payload
     * @return {boolean} Returns true if the payload is valid.
     */
    verifyWebhookPayload(secret: string, headers: Record<string, string>, payload: string): boolean;
    /**
     * Validates a token and returns its payload if valid.
     * Supports issuer, audience, and scope validation.
     *
     * @param {string} token The token to be validated
     * @param {TokenValidationOptions} options Optional validation options for issuer, audience, and scopes
     * @return {Promise<T>} Returns the token payload if valid
     * @throws {ScalekitValidateTokenFailureException} If token is invalid or missing required scopes
     */
    validateToken<T>(token: string, options?: TokenValidationOptions): Promise<T>;
    /**
     * Verify that the token contains the required scopes
     *
     * @param {string} token The token to verify
     * @param {string[]} requiredScopes The scopes that must be present in the token
     * @return {boolean} Returns true if all required scopes are present
     * @throws {ScalekitValidateTokenFailureException} If required scopes are missing, with details about which scopes are missing
     */
    verifyScopes(token: string, requiredScopes: string[]): boolean;
    /**
     * Extract scopes from token payload
     *
     * @param {any} payload The token payload
     * @return {string[]} Array of scopes found in the token
     */
    private extractScopesFromPayload;
    /**
     * Verify the timestamp
     *
     * @param {string} timestampStr The timestamp string
     * @return {Date} Returns the timestamp
     */
    private verifyTimestamp;
    /**
     * Compute the signature
     *
     * @param {Buffer} secretBytes The secret bytes
     * @param {string} data The data to be signed
     * @return {string} Returns the signature
     */
    private computeSignature;
    /**
     * Refresh access token using a refresh token
     * @param {string} refreshToken The refresh token to use
     * @returns {Promise<RefreshTokenResponse>} Returns new access token, refresh token and other details
     * @throws {Error} When authentication fails or response data is invalid
     */
    refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse>;
}
