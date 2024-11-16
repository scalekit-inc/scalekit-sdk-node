import ConnectionClient from './connection';
import DirectoryClient from './directory';
import DomainClient from './domain';
import OrganizationClient from './organization';
import { IdpInitiatedLoginClaims } from './types/auth';
import { AuthenticationOptions, AuthenticationResponse, AuthorizationUrlOptions } from './types/scalekit';
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
     *
     * @example
     * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
     * const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, { scopes: ['openid', 'profile'] });
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
    * @returns {object} Returns the idp initiated login claims
    */
    getIdpInitiatedLoginClaims(idpInitiatedLoginToken: string): Promise<IdpInitiatedLoginClaims>;
    /**
     * Validates the access token.
     *
     * @param {string} token The token to be validated.
     * @return {Promise<boolean>} Returns true if the token is valid, false otherwise.
     */
    validateAccessToken(token: string): Promise<boolean>;
    /**
     * Verifies the payload of the webhook
     *
     * @param {string} secret The secret
     * @param {Record<string, string>} headers The headers
     * @param {string} payload The payload
     * @return {boolean} Returns true if the payload is valid.
     */
    verifyWebhookPayload(secret: string, headers: Record<string, string>, payload: string): boolean;
    /**
     * Validate token
     *
     * @param {string} token The token to be validated
     * @return {Promise<T>} Returns the payload of the token
     */
    private validateToken;
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
}
