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
 * A 401 the Scalekit proxy itself sent (JSON `{ "detail": ..., "code":
 * "UNAUTHORIZED" }`), as opposed to a 401 from the provider. The proxy sends
 * this shape both when it rejects the access token and when the connected
 * account's own credentials fail, so it only says the request never reached
 * the provider, which makes a resend safe. `CoreClient.withAccessToken`
 * decides whether the access token is the likely cause.
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
