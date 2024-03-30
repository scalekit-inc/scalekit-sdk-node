import { Code, ConnectError } from '@connectrpc/connect';
import axios, { AxiosError, HttpStatusCode } from "axios";
import { JWK } from 'jose';
import QueryString from "qs";
import { GrantType } from './types/scalekit';

const tokenEndpoint = "oauth/token";
const jwksEndpoint = "keys";

export default class CoreClient {
  public keys: JWK[] = [];
  public accessToken: string | null = null;
  constructor(
    private readonly envUrl: string,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) { }

  private async authenticateClient() {
    const res = await this.authenticate(QueryString.stringify({
      grant_type: GrantType.ClientCredentials,
      client_id: this.clientId,
      client_secret: this.clientSecret
    }))

    this.accessToken = res.data.access_token;
  }

  async authenticate(data: string) {
    return axios.post<{ access_token: string, id_token: string }>(
      `${this.envUrl}/${tokenEndpoint}`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
  }

  async getJwks() {
    if (!this.keys.length) {
      const { data: { keys } } = await axios.get<{ keys: JWK[] }>(`${this.envUrl}/${jwksEndpoint}`);
      this.keys = keys;
    }
  }

  async retryWithAuthentication<T>(fn: () => Promise<T>, retryLeft: number = 1): Promise<T> {
    try {
      const res = await fn();
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
        if (error instanceof ConnectError) {
          if (error.code == Code.Unauthenticated) {
            isUnauthenticatedError = true;
          } else {
            throw error;
          }
        }
        if (isUnauthenticatedError) {
          await this.authenticateClient();
          return this.retryWithAuthentication(fn, retryLeft - 1);
        }
      }
      throw error;
    }
  }
}