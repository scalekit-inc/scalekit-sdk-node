import ConnectionClient from './connection';
import OrganizationClient from './organization';
import { AuthorizationUrlOptions, CodeAuthenticationOptions } from './types/scalekit';
import { User } from './types/user';
import DomainClient from './domain';
/**
 * To initiate scalekit
 * @param {string} envUrl
 * Scalekit environment url
 * @param {string} clientId
 * client id
 * @param {string} clientSecret
 * client secret
*/
export default class Scalekit {
    private readonly envUrl;
    private readonly clientId;
    private readonly clientSecret;
    private readonly coreClient;
    private readonly grpcConnect;
    readonly organization: OrganizationClient;
    readonly connection: ConnectionClient;
    readonly domain: DomainClient;
    constructor(envUrl: string, clientId: string, clientSecret: string);
    /**
     * Returns the authorization url to initiate the authentication request.
     * @param {string} redirectUri Redirect uri
     * @param {AuthorizationUrlOptions} options Additional options
     * @returns {string} authorization url
     */
    getAuthorizationUrl(redirectUri: string, options?: AuthorizationUrlOptions): string;
    authenticateWithCode(options: CodeAuthenticationOptions): Promise<{
        user: Partial<User>;
        idToken: string;
        accessToken: string;
    }>;
    /**
     * Generates a URL to validate the given token.
     *
     * @param {string} token The token to be validated.
     * @return {boolean} success
     */
    validateAccessToken(token: string): Promise<boolean>;
}
