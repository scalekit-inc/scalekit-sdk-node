import { Code, ConnectError } from '@connectrpc/connect';
import axios, { Axios, AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { JWK } from 'jose';
import os from "os";
import QueryString from "qs";
import { GrantType } from './types/scalekit';
import { ErrorInfo } from './pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import { TokenResponse } from './types/auth';
import { transformError } from './errors';
import { ScalekitException, ScalekitServerException } from './errors/base-exception';

export const headers = {
  "user-agent": "user-agent",
  "x-sdk-version": "x-sdk-version",
  "x-api-version": "x-api-version",
  "authorization": "authorization"
}

const tokenEndpoint = "oauth/token";
const jwksEndpoint = "keys";
export default class CoreClient {
  public keys: JWK[] = [];
  public accessToken: string | null = null;
  public axios: Axios;
  public sdkVersion = `Scalekit-Node/2.0.1`;
  public apiVersion = "20250710";
  public userAgent = `${this.sdkVersion} Node/${process.version} (${process.platform}; ${os.arch()})`;
  constructor(
    readonly envUrl: string,
    readonly clientId: string,
    readonly clientSecret: string
  ) {
    this.axios = axios.create({ baseURL: envUrl });
    this.axios.interceptors.request.use((config) => {
      config.headers[headers['user-agent']] = this.userAgent;
      config.headers[headers['x-sdk-version']] = this.sdkVersion;
      config.headers[headers['x-api-version']] = this.apiVersion;
      if (this.accessToken) {
        config.headers[headers.authorization] = `Bearer ${this.accessToken}`;
      }

      return config;
    });
    this.authenticateClient();
  }

  private async authenticateClient() {
    const res = await this.authenticate(QueryString.stringify({
      grant_type: GrantType.ClientCredentials,
      client_id: this.clientId,
      client_secret: this.clientSecret
    }))

    this.accessToken = res.data.access_token;
  }
  /**
   * Authenticate with the code
   * @param {string} data Data to authenticate
   * @returns {Promise<AxiosResponse<TokenResponse>>} Returns access token and id token
   */
  async authenticate(data: string): Promise<AxiosResponse<TokenResponse, any>> {
    return this.axios.post<TokenResponse>(
      tokenEndpoint,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
  }

  /**
   * Get the JWKS from the server and store it in the client instance
   * @returns {Promise<void>} Returns nothing   
   */
  async getJwks(): Promise<void> {
    if (this.keys.length) {
      return Promise.resolve();
    }
    const { data: { keys } } = await this.axios.get<{ keys: JWK[] }>(jwksEndpoint);
    this.keys = keys;
  }

  /**
   * Execute a function with error handling and retry logic
   * @param fn Function to execute
   * @param data Data to pass to the function
   * @param retryLeft Number of retries left
   * @returns {Promise<TResponse>} Returns the response
   */
  async connectExec<TRequest, TResponse>(
    fn: (request: TRequest) => Promise<TResponse>,
    data: TRequest,
    retryLeft: number = 1,
  ): Promise<TResponse> {
    try {
      const res = await fn(data);
      return res;
    } catch (error) {
      // Transform the error to our specific exception types
      const transformedError = transformError(error);
      
      if (retryLeft > 0) {
        // Check if it's an authentication error that we can retry
        if (transformedError instanceof ScalekitServerException && transformedError.httpStatus === 401) {
          await this.authenticateClient();
          return this.connectExec(fn, data, retryLeft - 1);
        }
      }
      
      // Throw the transformed error
      throw transformedError;
    }
  }
}