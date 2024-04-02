import { JWK } from 'jose';
export default class CoreClient {
    readonly envUrl: string;
    readonly clientId: string;
    readonly clientSecret: string;
    keys: JWK[];
    accessToken: string | null;
    constructor(envUrl: string, clientId: string, clientSecret: string);
    private authenticateClient;
    authenticate(data: string): Promise<import("axios").AxiosResponse<{
        access_token: string;
        id_token: string;
    }, any>>;
    getJwks(): Promise<void>;
    connectExec<TRequest, TResponse>(fn: (request: TRequest) => Promise<TResponse>, data: TRequest, retryLeft?: number): Promise<TResponse>;
}
