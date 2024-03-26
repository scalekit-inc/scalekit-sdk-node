import { JWK } from 'jose';
export default class CoreClient {
    private readonly envUrl;
    private readonly clientId;
    private readonly clientSecret;
    keys: JWK[];
    accessToken: string | null;
    constructor(envUrl: string, clientId: string, clientSecret: string);
    private authenticateClient;
    authenticate(data: string): Promise<import("axios").AxiosResponse<{
        access_token: string;
        id_token: string;
    }, any>>;
    getJwks(): Promise<void>;
    retryWithAuthentication<T>(fn: () => Promise<T>, retryLeft?: number): Promise<T>;
}
