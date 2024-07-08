import ConnectionClient from './connection';
import DomainClient from './domain';
import OrganizationClient from './organization';
import { AuthorizationUrlOptions, AuthenticationOptions, AuthenticationResponse } from './types/scalekit';
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
     * Validates the access token.
     *
     * @param {string} token The token to be validated.
     * @return {Promise<boolean>} Returns true if the token is valid, false otherwise.
     */
    validateAccessToken(token: string): Promise<boolean>;
}
