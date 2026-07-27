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

// Node's real http adapter sets `error.request` (and `error.response.request`,
// often the same reference) to the underlying `http.ClientRequest`. Its
// enumerable `_header` property holds the fully-serialized request headers —
// e.g. `Authorization: Bearer <token>\r\n...` — which `util.inspect` (and
// therefore `console.error` and Node's default uncaught-exception/
// unhandledRejection handler) prints verbatim. Redact the Authorization line
// in place rather than deleting `_header` or the request object, so the rest
// of the raw request remains available for debugging. Guarded for mocks/
// non-Node adapters where `request` or `_header` may not exist or may not be
// a string.
function redactRawRequestHeader(request: unknown): void {
  if (!request || typeof request !== 'object') {
    return;
  }
  const req = request as Record<PropertyKey, unknown>;
  if (typeof req._header === 'string') {
    req._header = req._header.replace(
      /^authorization:.*$/im,
      'Authorization: [REDACTED]'
    );
  }
  // Node also mirrors the outgoing headers on an internal symbol-keyed map
  // (`Symbol(kOutHeaders)`) that the ClientRequest builds up before
  // `_header` is serialized, and that map stays populated afterwards. It is
  // enumerable, so `util.inspect` walks into it independently of `_header` —
  // redact any Authorization entry there too. The stored shape is a
  // `[displayName, value]` tuple; fall back to overwriting the value
  // directly in case a future Node version stores a bare string instead.
  for (const symbolKey of Object.getOwnPropertySymbols(req)) {
    if (symbolKey.description !== 'kOutHeaders') {
      continue;
    }
    const outHeaders = req[symbolKey];
    if (!outHeaders || typeof outHeaders !== 'object') {
      continue;
    }
    const headerMap = outHeaders as Record<string, unknown>;
    for (const headerKey of Object.keys(headerMap)) {
      if (headerKey.toLowerCase() !== 'authorization') {
        continue;
      }
      const entry = headerMap[headerKey];
      if (Array.isArray(entry)) {
        entry[1] = '[REDACTED]';
      } else {
        headerMap[headerKey] = '[REDACTED]';
      }
    }
  }
  // By default (the config CoreClient actually runs with — `maxRedirects` is
  // never set to 0), axios's Node adapter issues the request through
  // `follow-redirects`, which leaves a `_redirectable` back-reference on the
  // real `http.ClientRequest` pointing at its own wrapper. That wrapper keeps
  // the original `_options.headers` object it was constructed with — a
  // separate plain object from both `config.headers` and the ones above —
  // still holding the plaintext Authorization value. Redact it too so the
  // default (non-`maxRedirects: 0`) request path doesn't leak the token via
  // this extra hop.
  const redirectable = (req as { _redirectable?: unknown })._redirectable;
  if (redirectable && typeof redirectable === 'object') {
    const options = (redirectable as { _options?: unknown })._options;
    if (options && typeof options === 'object') {
      const optionHeaders = (options as { headers?: unknown }).headers;
      if (optionHeaders && typeof optionHeaders === 'object') {
        const headerMap = optionHeaders as Record<string, unknown>;
        for (const headerKey of Object.keys(headerMap)) {
          if (headerKey.toLowerCase() === 'authorization') {
            headerMap[headerKey] = '[REDACTED]';
          }
        }
      }
    }
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
    // On failure, axios attaches the outgoing request config to the error, and
    // that config carries two credentials: the plaintext client_secret in the
    // token endpoint's request body (`config.data`) and the Bearer access
    // token in the Authorization header. `AxiosError.toJSON()` and Node's
    // default handler would dump both if the error is logged wholesale or
    // propagates uncaught. Redact just those two values in place — leaving the
    // response, status, headers, and request object intact for debugging — so
    // nothing downstream (a caller's log, an APM that instruments axios, a
    // user-registered interceptor) can observe the secret or the token.
    //
    // The real Node http adapter also attaches the raw `http.ClientRequest` as
    // `error.request` (and the same reference as `error.response.request`).
    // That object keeps the fully-serialized outgoing headers, including the
    // Bearer token, in its enumerable `_header` string — and `util.inspect`
    // (what `console.error(err)` and Node's default uncaught-exception/
    // unhandledRejection handler use) walks into `request`/`response.request`
    // and prints `_header` verbatim. Scrub the Authorization line out of
    // `_header` on both references too, so the token can't resurface there.
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error instanceof AxiosError && error.config) {
          if (typeof error.config.data === 'string') {
            // Anchor the match to a form-field boundary (start of string or
            // `&`) so a similarly-named field (e.g. `other_client_secret=`)
            // can't false-positive on the bare `client_secret=` substring,
            // and use the `g` flag so every occurrence is redacted, not just
            // the first, in case the body ever carries the field twice.
            error.config.data = error.config.data.replace(
              /(^|&)client_secret=[^&]*/g,
              '$1client_secret=[REDACTED]'
            );
          }
          const configHeaders = error.config.headers as
            | {
                set?: (k: string, v: string, rewrite?: boolean) => unknown;
                has?: (k: string) => boolean;
                [k: string]: unknown;
              }
            | undefined;
          if (configHeaders) {
            if (
              typeof configHeaders.set === 'function' &&
              typeof configHeaders.has === 'function'
            ) {
              // AxiosHeaders: case-insensitive lookup/set.
              if (configHeaders.has('Authorization')) {
                configHeaders.set('Authorization', '[REDACTED]', true);
              }
            } else {
              // Plain object headers: match the key case-insensitively.
              for (const key of Object.keys(configHeaders)) {
                if (key.toLowerCase() === 'authorization') {
                  configHeaders[key] = '[REDACTED]';
                }
              }
            }
          }
        }
        if (error instanceof AxiosError) {
          redactRawRequestHeader((error as { request?: unknown }).request);
          redactRawRequestHeader(
            (error.response as { request?: unknown } | undefined)?.request
          );
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
