import { Code, ConnectError, type CallOptions } from '@connectrpc/connect';
import axios, {
  Axios,
  AxiosError,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}
import { JWK } from 'jose';
import os from 'os';
import QueryString from 'qs';
import { GrantType } from './types/scalekit';
import { TokenResponse } from './types/auth';
import {
  ScalekitException,
  ScalekitServerException,
} from './errors/base-exception';
import { ScalekitGatewayTimeoutException } from './errors/specific-exceptions';
import { ErrorInfoSchema } from './pkg/grpc/scalekit/v1/errdetails/errdetails_pb';

export const headers = {
  'user-agent': 'user-agent',
  'x-sdk-version': 'x-sdk-version',
  'x-api-version': 'x-api-version',
  authorization: 'authorization',
};

const tokenEndpoint = 'oauth/token';
const jwksEndpoint = 'keys';
const DEFAULT_TOOL_TIMEOUT_MS = 60_000;
export const DEFAULT_TIMEOUT_MS = 20_000;

// A non-positive timeout is never what the caller wants: connect-es treats a
// per-call timeoutMs <= 0 as "no deadline" (reintroducing indefinite hangs)
// but a transport defaultTimeoutMs of 0 as an immediately-expired deadline,
// and axios treats 0 as "no timeout". Reject invalid values up front instead
// of letting the same input pick a different semantic per path.
export function assertValidTimeout(name: string, value: number): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(
      `${name} must be a positive finite number of milliseconds, got ${value}`
    );
  }
}

export default class CoreClient {
  public keys: JWK[] = [];
  public accessToken: string | null = null;
  public axios: Axios;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  public sdkVersion = `Scalekit-Node/${(require('../package.json') as { version: string }).version}`;
  // YYYYMMDD
  public apiVersion = '20260716';
  public userAgent = `${this.sdkVersion} Node/${process.version} (${
    process.platform
  }; ${os.arch()})`;
  constructor(
    readonly envUrl: string,
    readonly clientId: string,
    readonly clientSecret: string,
    readonly toolTimeoutMs: number = DEFAULT_TOOL_TIMEOUT_MS,
    readonly timeoutMs: number = DEFAULT_TIMEOUT_MS
  ) {
    assertValidTimeout('toolTimeoutMs', toolTimeoutMs);
    assertValidTimeout('timeoutMs', timeoutMs);
    // The instance-level timeout bounds every HTTP call made through this
    // client — including the token endpoint and JWKS fetches, which otherwise
    // hang forever on a silently dropped connection (the same failure mode
    // the gRPC transport deadline guards against). Calls that need a longer
    // budget (the actions proxy) set a per-request timeout, which overrides
    // this default.
    this.axios = axios.create({ baseURL: envUrl, timeout: this.timeoutMs });
    this.axios.interceptors.request.use((config) => {
      config.headers[headers['user-agent']] = this.userAgent;
      config.headers[headers['x-sdk-version']] = this.sdkVersion;
      config.headers[headers['x-api-version']] = this.apiVersion;
      if (this.accessToken && !config.skipAuth) {
        config.headers[headers.authorization] = `Bearer ${this.accessToken}`;
      }

      return config;
    });
    // removing token creation at the time of constructor and instead letting the retry functionality handle generating a token whenever required.
    //this.authenticateClient();
  }

  private async authenticateClient() {
    const res = await this.authenticate(
      QueryString.stringify({
        grant_type: GrantType.ClientCredentials,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      })
    );

    this.accessToken = res.data.access_token;
  }
  /**
   * Authenticate with the code
   * @param {string} data Data to authenticate
   * @returns {Promise<AxiosResponse<TokenResponse>>} Returns access token and id token
   */
  async authenticate(data: string): Promise<AxiosResponse<TokenResponse, any>> {
    return this.axios.post<TokenResponse>(tokenEndpoint, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      skipAuth: true,
    });
  }

  /**
   * Get the JWKS from the server and store it in the client instance
   * @returns {Promise<void>} Returns nothing
   */
  async getJwks(): Promise<void> {
    if (this.keys.length) {
      return Promise.resolve();
    }
    const {
      data: { keys },
    } = await this.axios.get<{ keys: JWK[] }>(jwksEndpoint);
    this.keys = keys;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Execute a function with error handling and retry logic.
   *
   * @param fn Function to execute
   * @param data Data to pass to the function
   * @param options Optional per-call gRPC options (e.g. `timeoutMs`), forwarded to `fn` as-is.
   *                Omit to use the transport's default deadline.
   * @returns {Promise<TResponse>} Returns the response
   */
  async connectExec<TRequest, TResponse>(
    fn: (request: TRequest, options?: CallOptions) => Promise<TResponse>,
    data: TRequest,
    options?: CallOptions
  ): Promise<TResponse> {
    return this._connectExec(fn, data, 3, 0, options);
  }

  private async _connectExec<TRequest, TResponse>(
    fn: (request: TRequest, options?: CallOptions) => Promise<TResponse>,
    data: TRequest,
    retryLeft: number,
    attempt: number,
    options?: CallOptions
  ): Promise<TResponse> {
    try {
      return await fn(data, options);
    } catch (error) {
      // Handle gRPC Connect errors
      if (error instanceof ConnectError) {
        // If the error originated from an upstream tool provider (errorCode == "TOOL_ERROR"),
        // surface it immediately — never retry, never refresh the M2M token.
        // Retrying a provider 429 would triple the rate-limit damage; refreshing the
        // Scalekit M2M token does nothing for a provider auth failure.
        const isToolError = error
          .findDetails(ErrorInfoSchema)
          .some((d) => d.errorCode === 'TOOL_ERROR');

        if (!isToolError && retryLeft > 0) {
          if (error.code === Code.Unauthenticated) {
            await this.authenticateClient();
            return this._connectExec(
              fn,
              data,
              retryLeft - 1,
              attempt + 1,
              options
            );
          }
          // Retry transient infrastructure errors (Unavailable) with backoff.
          // This covers the Connect transport mapping HTTP 429 → Code.Unavailable.
          // Scalekit ResourceExhausted (429) is NOT retried — surfaces immediately.
          if (error.code === Code.Unavailable) {
            const baseBackoff = Math.min(1000 * 2 ** attempt, 30000);
            const backoffMs = baseBackoff * (0.5 + Math.random() * 0.5);
            await this.sleep(backoffMs);
            return this._connectExec(
              fn,
              data,
              retryLeft - 1,
              attempt + 1,
              options
            );
          }
        }
        throw ScalekitServerException.promote(error, isToolError);
      }
      // Handle HTTP/Axios errors
      if (error instanceof AxiosError) {
        if (error.response) {
          if (retryLeft > 0) {
            if (error.response.status === HttpStatusCode.Unauthorized) {
              await this.authenticateClient();
              return this._connectExec(
                fn,
                data,
                retryLeft - 1,
                attempt + 1,
                options
              );
            }
            // NOTE: HTTP 429 responses are surfaced immediately — no backoff retry.
          }
          throw ScalekitServerException.promote(error.response);
        } else {
          // A timed-out request has no response; surface it as the same
          // exception type a gRPC deadline expiry produces.
          if (ScalekitGatewayTimeoutException.isAxiosTimeout(error)) {
            throw ScalekitGatewayTimeoutException.fromAxiosTimeout(error);
          }
          throw new ScalekitException(error);
        }
      }
      // Handle existing ScalekitException instances
      if (error instanceof ScalekitException) {
        throw error;
      }
      // Handle generic errors
      throw new ScalekitException(error);
    }
  }
}
