import { type AxiosResponse } from 'axios';
import { ScalekitException } from './errors/base-exception';
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
export declare function headerRecord(headers: unknown): Record<string, string>;
export declare function bodyText(data: unknown): string;
/** Error body for callers: parsed JSON when it is JSON, otherwise the text. */
export declare function errorBody(response: AxiosResponse): unknown;
/**
 * A 401 the Scalekit proxy itself sent (JSON `{ "detail": ..., "code":
 * "UNAUTHORIZED" }`), as opposed to a 401 from the provider. The proxy sends
 * this shape both when it rejects the access token and when the connected
 * account's own credentials fail, so it only says the request never reached
 * the provider, which makes a resend safe. `CoreClient.withAccessToken`
 * decides whether the access token is the likely cause.
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
