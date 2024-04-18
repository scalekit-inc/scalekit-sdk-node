import { Axios, AxiosResponse } from "axios";
import { JWK } from 'jose';
export default class CoreClient {
    readonly envUrl: string;
    readonly clientId: string;
    readonly clientSecret: string;
    keys: JWK[];
    accessToken: string | null;
    uname: string | null;
    axios: Axios;
    sdkVersion: string;
    apiVersion: string;
    constructor(envUrl: string, clientId: string, clientSecret: string);
    private authenticateClient;
    private getUname;
    getUserAgent(): string;
    /**
     * Authenticate with the code
     * @param {string} data Data to authenticate
     * @returns {Promise<AxiosResponse<{ access_token: string, id_token: string }>>} Returns access token and id token
     */
    authenticate(data: string): Promise<AxiosResponse<{
        access_token: string;
        id_token: string;
    }, any>>;
    /**
     * Get the JWKS from the server and store it in the client instance
     * @returns {Promise<void>} Returns nothing
     */
    getJwks(): Promise<void>;
    /**
     *
     * @param fn Function to execute
     * @param data Data to pass to the function
     * @param retryLeft Number of retries left
     * @returns {Promise<TResponse>} Returns the response
     */
    connectExec<TRequest, TResponse>(fn: (request: TRequest) => Promise<TResponse>, data: TRequest, retryLeft?: number): Promise<TResponse>;
}
