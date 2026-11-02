import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import {
  ScalekitException,
  ScalekitServerException,
} from './errors/base-exception';
import { ScalekitGatewayTimeoutException } from './errors/specific-exceptions';

// Shared by `CoreClient` and the HTTP features built on it (the actions proxy,
// resumable uploads): reading an axios response, recognising a 401 the
// Scalekit proxy sent itself, and mapping failures to Scalekit exceptions.

export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function headerRecord(headers: unknown): Record<string, string> {
  const record: Record<string, string> = {};
  if (!headers || typeof headers !== 'object') return record;
  const plain =
    headers instanceof AxiosHeaders
      ? (headers.toJSON() as Record<string, unknown>)
      : (headers as Record<string, unknown>);
  for (const [name, value] of Object.entries(plain)) {
    if (value === undefined || value === null) continue;
    record[name.toLowerCase()] = Array.isArray(value)
      ? value.map(String).join(', ')
      : String(value);
  }
  return record;
}

export function bodyText(data: unknown): string {
  if (data === undefined || data === null) return '';
  if (typeof data === 'string') return data;
  if (data instanceof Uint8Array) return Buffer.from(data).toString('utf8');
  return JSON.stringify(data);
}

function isJsonContentType(headers: Record<string, string>): boolean {
  const [mime = ''] = (headers['content-type'] ?? '').split(';');
  const type = mime.trim().toLowerCase();
  return type === 'application/json' || type.endsWith('+json');
}

/** Error body for callers: parsed JSON when it is JSON, otherwise the text. */
export function errorBody(response: AxiosResponse): unknown {
  if (
    response.data !== null &&
    typeof response.data === 'object' &&
    !(response.data instanceof Uint8Array)
  ) {
    return response.data;
  }
  const text = bodyText(response.data);
  if (text.trim() === '') return text;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/**
 * A 401 the Scalekit proxy itself sent because it rejected the access token
 * (JSON `{ "detail": ..., "code": "UNAUTHORIZED" }`, exactly), the one 401 a
 * token refresh can fix. Not a connected account's own credential failure,
 * which the proxy sends with code `TOOL_ERROR`, and not a provider's 401,
 * which the proxy relays with the provider's own body. The proxy rejects such
 * a request before forwarding it, so a resend is safe.
 *
 * Proxies deployed before `TOOL_ERROR` was used here sent connected-account
 * failures as `UNAUTHORIZED` too; against those, `CoreClient.withAccessToken`
 * spends one token request and one resend per call.
 */
export function isScalekitUnauthorized(response: AxiosResponse): boolean {
  if (response.status !== 401) return false;
  if (!isJsonContentType(headerRecord(response.headers))) return false;
  const body = errorBody(response);
  if (!isPlainObject(body)) return false;
  const keys = Object.keys(body).sort();
  return (
    keys.length === 2 &&
    keys[0] === 'code' &&
    keys[1] === 'detail' &&
    body.code === 'UNAUTHORIZED'
  );
}

export function setCause<T extends Error>(error: T, cause: unknown): T {
  Object.defineProperty(error, 'cause', {
    value: cause,
    writable: true,
    configurable: true,
    enumerable: false,
  });
  return error;
}

/**
 * Maps a failed HTTP call (or token request) to the exception callers get: an
 * HTTP error response to its `ScalekitServerException`, a timeout to
 * `ScalekitGatewayTimeoutException` (the same type a gRPC deadline gives), and
 * anything else to `ScalekitException`. Scalekit exceptions pass through.
 */
export function toScalekitException(error: unknown): ScalekitException {
  if (error instanceof ScalekitException) return error;
  if (error instanceof AxiosError) {
    if (error.response) {
      return setCause(ScalekitServerException.promote(error.response), error);
    }
    if (ScalekitGatewayTimeoutException.isAxiosTimeout(error)) {
      return setCause(
        ScalekitGatewayTimeoutException.fromAxiosTimeout(error),
        error
      );
    }
  }
  return setCause(new ScalekitException(error), error);
}

// The AxiosError fields callers of earlier releases could read on a failed
// token request. `request` is not among them: the client's response
// interceptor removes it, since it carries the credentials.
const AXIOS_ERROR_FIELDS = [
  'isAxiosError',
  'code',
  'status',
  'response',
  'config',
] as const;

/**
 * A failed access-token request as a `ScalekitException` (see
 * `toScalekitException`) that still carries the `AxiosError` fields callers
 * could read before, as non-enumerable properties, so `axios.isAxiosError()`,
 * `error.response.status` and `error.code` keep working. Used for gRPC calls,
 * which threw the raw `AxiosError` in earlier releases.
 */
export function toScalekitTokenError(error: unknown): ScalekitException {
  const mapped = toScalekitException(error);
  if (error instanceof AxiosError && mapped !== error) {
    for (const field of AXIOS_ERROR_FIELDS) {
      if (error[field] === undefined) continue;
      Object.defineProperty(mapped, field, {
        value: error[field],
        writable: true,
        configurable: true,
        enumerable: false,
      });
    }
  }
  return mapped;
}
