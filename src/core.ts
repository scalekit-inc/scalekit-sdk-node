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
// Must clear the backend's EnforcementPolicy.MinTime (30s, scalekit's cmd/grpc.go)
// with real margin, not just match it: connect-node's ping loop keeps running at
// this interval for as long as a stream is open (see http2-session-manager.js's
// resetPingInterval, gated on streamCount > 0 independent of pingIdleConnection),
// so a value equal to MinTime leaves zero room for jitter between our timer and
// the server's strike window — one early ping is a strike, enough strikes and the
// server GOAWAYs the connection mid-call. This bit the Python SDK for the same
// reason (scalekit-sdk-python#195 raised its equivalent default 30s -> 60s); the
// Java SDK's 60s keepAliveTime is the precedent the backend's own MinTime margin
// was sized against.
export const DEFAULT_PING_INTERVAL_MS = 60_000;
export const DEFAULT_PING_TIMEOUT_MS = 5_000;

// The floor tracks DEFAULT_PING_INTERVAL_MS for the same reason spelled out
// above: connect-node has no clamp of its own (unlike grpc-core, which
// silently raises sub-10s keepalive values to 10s), so a caller-supplied
// value below this genuinely pings at that rate, every ping under the
// backend's 30s MinTime a strike. 0 is handled separately (see
// assertValidPingInterval below) as the deliberate "disabled" escape hatch —
// only 1..59999 is rejected.
export const MIN_PING_INTERVAL_MS = 60_000;

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

// pingIntervalMs=0 is a deliberate escape hatch (mirrors the Python SDK's
// keepalive_time_ms=0): connect-node's own default is pingIntervalMs:
// Infinity ("never ping"), and a customer whose network path or corporate
// proxy rejects our pings needs a runtime way back to that default without
// downgrading the whole SDK. Anything else must clear MIN_PING_INTERVAL_MS
// with real margin — see the constant's own comment for why.
export function assertValidPingInterval(value: number): void {
  if (value === 0) {
    return;
  }
  assertValidTimeout('pingIntervalMs', value);
  if (value < MIN_PING_INTERVAL_MS) {
    throw new Error(
      `pingIntervalMs must be 0 (disabled) or >= ${MIN_PING_INTERVAL_MS}; got ${value}. ` +
        `A value below the default leaves too little margin over the Scalekit ` +
        `server's 30s keepalive MinTime — early pings are struck as abusive, ` +
        `and enough strikes GOAWAYs the connection mid-call.`
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
  public apiVersion = '20260727';
  public userAgent = `${this.sdkVersion} Node/${process.version} (${
    process.platform
  }; ${os.arch()})`;
  constructor(
    readonly envUrl: string,
    readonly clientId: string,
    readonly clientSecret: string,
    readonly toolTimeoutMs: number = DEFAULT_TOOL_TIMEOUT_MS,
    readonly timeoutMs: number = DEFAULT_TIMEOUT_MS,
    readonly pingIntervalMs: number = DEFAULT_PING_INTERVAL_MS,
    readonly pingTimeoutMs: number = DEFAULT_PING_TIMEOUT_MS
  ) {
    assertValidTimeout('toolTimeoutMs', toolTimeoutMs);
    assertValidTimeout('timeoutMs', timeoutMs);
    assertValidPingInterval(pingIntervalMs);
    assertValidTimeout('pingTimeoutMs', pingTimeoutMs);
    // A pingTimeoutMs at or above pingIntervalMs means the interval timer can
    // fire again (scheduling the next ping and its own watchdog) before the
    // previous ping's watchdog would ever have tripped — resetPingInterval's
    // stopPingInterval() cancels that stale watchdog outright, so a hung ping
    // response would silently never be detected as hung. Skip when pinging is
    // disabled (pingIntervalMs === 0); pingTimeoutMs is unused in that state.
    if (pingIntervalMs !== 0 && pingTimeoutMs >= pingIntervalMs) {
      throw new Error(
        `pingTimeoutMs (${pingTimeoutMs}) must be less than pingIntervalMs (${pingIntervalMs}).`
      );
    }
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
    // On failure, axios attaches copies of the outgoing request to the error
    // that carry two credentials: the plaintext client_secret in the token
    // endpoint's request body (`error.config.data`) and the Bearer access token
    // in the Authorization header — the latter living on `error.config.headers`
    // and, with the real Node adapter, on the raw `http.ClientRequest` at
    // `error.request` / `error.response.request` (whose serialized `_header`
    // holds it too). `AxiosError.toJSON()` and util.inspect (`console.error(err)`
    // and Node's default uncaught-exception/unhandledRejection handler) would
    // surface these if the error is logged wholesale or propagates uncaught.
    // Drop the credential-bearing request copies off the error entirely. The
    // response (status/body/headers), `message`, and `code` are untouched, so
    // callers and the retry logic — which read only `error.response`,
    // `error.response.status`, and `error.code` — keep working; only the
    // non-secret request echo (body fields, request headers) is lost with them.
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error instanceof AxiosError) {
          if (error.config) {
            const config = error.config as {
              data?: unknown;
              headers?: unknown;
            };
            delete config.data;
            delete config.headers;
          }
          delete (error as { request?: unknown }).request;
          if (error.response) {
            delete (error.response as { request?: unknown }).request;
          }
        }
        return Promise.reject(error);
      }
    );
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
