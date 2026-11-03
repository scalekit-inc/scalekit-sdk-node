import { type AxiosResponse } from 'axios';
import { ScalekitException } from './errors/base-exception';
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
export declare function headerRecord(headers: unknown): Record<string, string>;
export declare function bodyText(data: unknown): string;
/** Error body for callers: parsed JSON when it is JSON, otherwise the text. */
export declare function errorBody(response: AxiosResponse): unknown;
/**
 * A 401 the Scalekit proxy sent itself (JSON
 * `{ "detail": ..., "code": "UNAUTHORIZED" }`, exactly), not one relayed from
 * the provider with the provider's own body. The proxy answers both a
 * rejected Scalekit access token and a connected account's own credential
 * failure this way, so a new token may or may not fix it.
 */
export declare function isScalekitUnauthorized(response: AxiosResponse): boolean;
export declare function setCause<T extends Error>(error: T, cause: unknown): T;
/**
 * Maps a failed HTTP call (or token request) to the exception callers get: an
 * HTTP error response to its `ScalekitServerException`, a timeout to
 * `ScalekitGatewayTimeoutException` (the same type a gRPC deadline gives), and
 * anything else to `ScalekitException`. Scalekit exceptions pass through.
 */
export declare function toScalekitException(error: unknown): ScalekitException;
/**
 * A failed access-token request as a `ScalekitException` (see
 * `toScalekitException`) that still carries the `AxiosError` fields callers
 * could read before, as non-enumerable properties, so `axios.isAxiosError()`,
 * `error.response.status` and `error.code` keep working. Used for gRPC calls,
 * which threw the raw `AxiosError` in earlier releases.
 */
export declare function toScalekitTokenError(error: unknown): ScalekitException;
