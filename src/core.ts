import { Code, ConnectError } from '@connectrpc/connect';
import axios, { Axios, AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { JWK } from 'jose';
import QueryString from "qs";
import { version } from "../package.json";
import { GrantType } from './types/scalekit';

const tokenEndpoint = "oauth/token";
const jwksEndpoint = "keys";

export default class CoreClient {
  public keys: JWK[] = [];
  public accessToken: string | null = null;
  public axios: Axios;
  constructor(
    readonly envUrl: string,
    readonly clientId: string,
    readonly clientSecret: string
  ) { 
    this.axios = axios.create({
      baseURL: envUrl,
      headers: {
        "User-Agent": `scalekit-node/${version}`
      }
    });
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
   * @returns {Promise<AxiosResponse<{ access_token: string, id_token: string }>>} Returns access token and id token
   */
  async authenticate(data: string): Promise<AxiosResponse<{ access_token: string; id_token: string; }, any>> {
    return this.axios.post<{ access_token: string, id_token: string }>(
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
   * 
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
      if (retryLeft > 0) {
        let isUnauthenticatedError = false;
        if (error instanceof AxiosError) {
          if (error.status == HttpStatusCode.Unauthorized) {
            isUnauthenticatedError = true;
          } else {
            throw new Error(error.message);
          }
        }
        // ConnectError is a custom error class that extends Error class and has a code property
        if (error instanceof ConnectError) {
          if (error.code == Code.Unauthenticated) {
            isUnauthenticatedError = true;
          } else {
            throw error;
          }
        }
        if (isUnauthenticatedError) {
          await this.authenticateClient();
          return this.connectExec(fn, data, retryLeft - 1);
        }
      }
      throw error;
    }
  }
}