import { type AxiosResponse } from 'axios';
import { ScalekitException } from './errors/base-exception';
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
export declare function headerRecord(headers: unknown): Record<string, string>;
export declare function bodyText(data: unknown): string;
/** Error body for callers: parsed JSON when it is JSON, otherwise the text. */
export declare function errorBody(response: AxiosResponse): unknown;
/**
 * The Scalekit proxy marks every response it relays from the provider with
 * this header (any value), and never one it wrote itself.
 */
export declare const UPSTREAM_RESPONSE_HEADER = "x-scalekit-upstream";
/**
 * A 401 the Scalekit proxy itself sent because it rejected the access token
 * (JSON `{ "detail": ..., "code": "UNAUTHORIZED" }`), the one 401 a token
 * refresh can fix. Never one relayed from the provider (it carries
 * `X-Scalekit-Upstream`), and never a connected account's own credential
 * failure, which the proxy sends with code `TOOL_ERROR`. The proxy rejects
 * such a request before forwarding it, so a resend is safe.
 *
 * Proxies deployed before `TOOL_ERROR` was used here sent connected-account
 * failures as `UNAUTHORIZED` too; `CoreClient.withAccessToken` limits the
 * refreshes those cost.
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
