import * as jose from 'jose';
import ConnectionClient from './connection';
import OrganizationClient from './organization';
import { AuthorizationUrlOptions, CodeAuthenticationOptions } from './types/scalekit';
import { User } from './types/user';
export default class Scalekit {
    private readonly envUrl;
    private readonly clientId;
    private readonly clientSecret;
    private readonly coreClient;
    private readonly grpcConnect;
    readonly organization: OrganizationClient;
    readonly connection: ConnectionClient;
    constructor(envUrl: string, clientId: string, clientSecret: string);
    getAuthorizationUrl(redirectUri: string, options?: AuthorizationUrlOptions): string;
    authenticateWithCode(options: CodeAuthenticationOptions): Promise<{
        user: Partial<User>;
        idToken: string;
        accessToken: string;
    }>;
    validateAccessToken(token: string): Promise<jose.JWTPayload>;
}
