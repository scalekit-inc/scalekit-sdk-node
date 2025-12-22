import { Axios, AxiosResponse } from "axios";
import { JWK } from "jose";
import { TokenResponse } from "./types/auth";
export declare const headers: {
    "user-agent": string;
    "x-sdk-version": string;
    "x-api-version": string;
    authorization: string;
};
export default class CoreClient {
    readonly envUrl: string;
    readonly clientId: string;
    readonly clientSecret: string;
    keys: JWK[];
    accessToken: string | null;
    axios: Axios;
    sdkVersion: string;
    apiVersion: string;
    userAgent: string;
    constructor(envUrl: string, clientId: string, clientSecret: string);
    private authenticateClient;
    /**
     * Authenticate with the code
     * @param {string} data Data to authenticate
     * @returns {Promise<AxiosResponse<TokenResponse>>} Returns access token and id token
     */
    authenticate(data: string): Promise<AxiosResponse<TokenResponse, any>>;
    /**
     * Get the JWKS from the server and store it in the client instance
     * @returns {Promise<void>} Returns nothing
     */
    getJwks(): Promise<void>;
    /**
     * Execute a function with error handling and retry logic
     * @param fn Function to execute
     * @param data Data to pass to the function
     * @param retryLeft Number of retries left
     * @returns {Promise<TResponse>} Returns the response
     */
    connectExec<TRequest, TResponse>(fn: (request: TRequest) => Promise<TResponse>, data: TRequest, retryLeft?: number): Promise<TResponse>;
}
