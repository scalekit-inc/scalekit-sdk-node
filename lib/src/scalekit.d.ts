import ConnectionClient from './connection';
import DomainClient from './domain';
import OrganizationClient from './organization';
import { AuthorizationUrlOptions, CodeAuthenticationOptions } from './types/scalekit';
import { User } from './types/user';
/**
 * To initiate scalekit
 * @param {string} envUrl The environment url
 * @param {string} clientId The client id
 * @param {string} clientSecret The client secret
 * @returns {Scalekit} Returns the scalekit instance
 * @example
 * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
*/
export default class Scalekit {
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
     *
     * @example
     * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
     * const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, { scopes: ['openid', 'profile'] });
     * @returns {string} authorization url
     */
    getAuthorizationUrl(redirectUri: string, options?: AuthorizationUrlOptions): string;
    /**
     * Authenticate with the code
     * @param {CodeAuthenticationOptions} options Code authentication options
     * @param {string} options.code Code
     * @param {string} options.redirectUri Redirect uri
     * @param {string} options.codeVerifier Code verifier
     * @returns {Promise<{ user: Partial<User>, idToken: string, accessToken: string }>} Returns user, id token and access token
     */
    authenticateWithCode(options: CodeAuthenticationOptions): Promise<{
        user: Partial<User>;
        idToken: string;
        accessToken: string;
    }>;
    /**
     * Validates the access token.
     *
     * @param {string} token The token to be validated.
     * @return {Promise<boolean>} Returns true if the token is valid, false otherwise.
     */
    validateAccessToken(token: string): Promise<boolean>;
}
