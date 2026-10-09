import type { JsonValue } from './types/json';
/**
 * Who a trigger event is delivered for. Branch on it before acting:
 * `'account'` events concern one connected account
 * ({@link TriggerEvent.connectedAccountId}); `'connection'` events concern the
 * whole connection and carry an empty `connectedAccountId`.
 *
 * Values the SDK does not know yet pass through unchanged as strings.
 */
export declare const DeliveryScope: {
    readonly ACCOUNT: "account";
    readonly CONNECTION: "connection";
};
/** See {@link (DeliveryScope:variable)}. Open: unknown values are plain strings. */
export type DeliveryScope = (typeof DeliveryScope)[keyof typeof DeliveryScope] | (string & {});
/**
 * How the change behind a trigger event was detected: pushed by the provider
 * (`'webhook'`) or found by polling (`'poll'`).
 *
 * Values the SDK does not know yet pass through unchanged as strings.
 */
export declare const DetectionMode: {
    readonly WEBHOOK: "webhook";
    readonly POLL: "poll";
};
/** See {@link (DetectionMode:variable)}. Open: unknown values are plain strings. */
export type DetectionMode = (typeof DetectionMode)[keyof typeof DetectionMode] | (string & {});
/**
 * Whether a trigger event carries the resource. `'full'`: `payload` holds it.
 * `'reference'`: `payload` is `null`; fetch the resource identified by
 * `resourceType` and `resourceId` yourself.
 *
 * Values the SDK does not know yet pass through unchanged as strings.
 */
export declare const PayloadState: {
    readonly FULL: "full";
    readonly REFERENCE: "reference";
};
/** See {@link (PayloadState:variable)}. Open: unknown values are plain strings. */
export type PayloadState = (typeof PayloadState)[keyof typeof PayloadState] | (string & {});
/**
 * A verified trigger event, as returned by {@link verifyTriggerEvent} and
 * `scalekit.actions.triggers.verifyEvent`.
 *
 * Field names are the camelCase form of the wire names (`trigger_type` →
 * `triggerType`). Top-level fields this SDK version does not know are kept,
 * under their wire names, in {@link TriggerEvent.extra}.
 */
export interface TriggerEvent {
    /** Event format version, as sent (not validated, so newer versions still parse). */
    readonly version: string;
    /** The trigger that fired, for example `'example.item.created'`. */
    readonly triggerType: string;
    /** The trigger subscription this delivery belongs to. */
    readonly subscriptionId: string;
    /** `'account'` or `'connection'`; see {@link (DeliveryScope:type)}. */
    readonly deliveryScope: DeliveryScope;
    /** The connection the event came from. */
    readonly connectionId: string;
    /**
     * The connected account the event is for. An empty string when
     * `deliveryScope` is `'connection'`.
     */
    readonly connectedAccountId: string;
    /** Kind of resource that changed, as named by the provider. */
    readonly resourceType: string;
    /**
     * ID of the resource that changed. `undefined` when the event has none
     * (absent or `null` on the wire); an empty string is kept as `''`.
     */
    readonly resourceId: string | undefined;
    /**
     * When the change happened. `undefined` when absent, `null` or `''` on the
     * wire. Sub-millisecond digits are truncated.
     */
    readonly occurredAt: Date | undefined;
    /** `'webhook'` or `'poll'`; see {@link (DetectionMode:type)}. */
    readonly detectionMode: DetectionMode;
    /** `'full'` or `'reference'`; see {@link (PayloadState:type)}. */
    readonly payloadState: PayloadState;
    /** The resource as sent by the provider; `null` when absent (always for `'reference'`). */
    readonly payload: JsonValue;
    /** Stable key for de-duplicating redeliveries of the same event. */
    readonly dedupeKey: string;
    /** Links follow-up work back to the event that caused it. */
    readonly correlationId: string;
    /**
     * Top-level fields this SDK version does not recognise, under their wire
     * (snake_case) names. Empty when there are none.
     */
    readonly extra: Readonly<Record<string, JsonValue>>;
}
/**
 * Request headers as your framework exposes them: a Fetch `Headers` object
 * (Next.js route handlers, Hono, Workers) or a plain object such as Node's
 * `IncomingHttpHeaders` (`req.headers` in Express).
 *
 * In a plain object, names are matched case-insensitively. An object with a
 * `get(name)` method (Fetch `Headers`, or a `Map`) is queried with the
 * lower-case names `webhook-id`, `webhook-timestamp` and `webhook-signature`;
 * Fetch `Headers` is case-insensitive itself, but a `Map` must use lower-case
 * keys.
 */
export type TriggerEventHeaders = Headers | Readonly<Record<string, string | readonly string[] | undefined>>;
/** Parameters for {@link verifyTriggerEvent} and `actions.triggers.verifyEvent`. */
export interface TriggerEventVerifyParams {
    /**
     * The raw request body exactly as received: a `Buffer`/`Uint8Array`
     * (preferred, for example from `express.raw()`) or a string. Do not pass a
     * parsed or re-serialised object; the signature covers the original bytes.
     */
    body: string | Uint8Array;
    /** The request headers; `webhook-id`, `webhook-timestamp` and `webhook-signature` are read. */
    headers: TriggerEventHeaders;
    /** The signing secret for your trigger endpoint (`whsec_...`). */
    secret: string;
}
/**
 * Verifies a trigger event delivered to your endpoint and returns it parsed.
 *
 * The signature is checked first (HMAC-SHA256 over
 * `webhook-id.webhook-timestamp.body`, a 5-minute timestamp tolerance and a
 * constant-time comparison); the body is parsed only once it is verified.
 * Needs no client: call it before constructing one, or in a separate service.
 *
 * @remarks
 * - Delivery is at least once: the same event can arrive more than once. Make
 *   your handler idempotent, keyed on `dedupeKey` together with the connected
 *   account you acted as.
 * - Branch on `deliveryScope`: `'account'` events are for
 *   `connectedAccountId`; `'connection'` events are for the whole connection
 *   and `connectedAccountId` is `''`.
 * - When `payloadState` is `'reference'`, `payload` is `null`: fetch the
 *   resource identified by `resourceType` and `resourceId`.
 * - `payload` is decoded with `JSON.parse`, so integers larger than
 *   `Number.MAX_SAFE_INTEGER` (2^53 - 1) lose precision. If you need such
 *   values exactly, parse the raw body again with a parser that preserves them.
 * - Headers are matched case-insensitively. Every `webhook-signature`
 *   candidate is tried and malformed ones (including any that are not strict
 *   padded standard base64) are skipped; several different `webhook-id` or
 *   `webhook-timestamp` values are rejected.
 *
 * @param params - The raw body, the request headers and your signing secret.
 * @returns The verified, parsed event.
 * @throws {@link WebhookVerificationError} when the event is not authentic:
 *   a required header is missing or repeated with different values,
 *   `webhook-timestamp` is not decimal digits, the secret is malformed (the
 *   key after `whsec_` must be non-empty padded standard base64), the
 *   timestamp is more than 5 minutes off, no signature matches, or the body
 *   is not valid UTF-8 (including a string body with a lone UTF-16
 *   surrogate; `cause` holds the underlying error where there is one).
 * @throws {@link ScalekitTriggerEventParseError} (a subclass of
 *   `WebhookVerificationError`) when the signature is valid but the body is
 *   not JSON (a leading byte order mark counts as not JSON), not a JSON
 *   object, lacks a required field, has a field of the wrong type, or has an
 *   `occurred_at` that is not an RFC 3339 timestamp with an offset in years
 *   0001-9999 (after conversion to UTC).
 * @throws `TypeError` when called with the wrong argument types: `body` is
 *   not a string, `Buffer` or `Uint8Array`, `headers` is neither a plain
 *   object nor an object with a `get(name)` method (an array such as
 *   `req.rawHeaders`, a `Buffer` or a `Set` is rejected), a
 *   `webhook-id`, `webhook-timestamp` or `webhook-signature` value is not a
 *   string, an array of strings or `undefined`, or `secret` is not a string.
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { verifyTriggerEvent, WebhookVerificationError } from '@scalekit-sdk/node';
 *
 * const app = express();
 * app.post('/triggers', express.raw({ type: 'application/json' }), (req, res) => {
 *   try {
 *     const event = verifyTriggerEvent({
 *       body: req.body,
 *       headers: req.headers,
 *       secret: process.env.SCALEKIT_TRIGGER_SECRET!,
 *     });
 *     // enqueue(event) and process it idempotently on event.dedupeKey
 *     res.sendStatus(204);
 *   } catch (err) {
 *     if (err instanceof WebhookVerificationError) return res.sendStatus(400);
 *     throw err;
 *   }
 * });
 * ```
 */
export declare function verifyTriggerEvent(params: TriggerEventVerifyParams): TriggerEvent;
/**
 * Trigger events delivered to your endpoint. Reached as
 * `scalekit.actions.triggers`.
 */
export declare class TriggersClient {
    /**
     * Verifies a trigger event delivered to your endpoint and returns it
     * parsed. Same behaviour as the standalone {@link verifyTriggerEvent},
     * which needs no client.
     *
     * @remarks
     * Delivery is at least once: de-duplicate on `dedupeKey` together with the
     * connected account you acted as. Branch on `deliveryScope`, and when
     * `payloadState` is `'reference'` fetch the resource yourself. See
     * {@link verifyTriggerEvent} for details.
     *
     * @param params - The raw body, the request headers and your signing secret.
     * @returns The verified, parsed event.
     * @throws {@link WebhookVerificationError} when the event is not authentic.
     * @throws {@link ScalekitTriggerEventParseError} when the signature is valid
     *   but the body is not a readable trigger event.
     * @throws `TypeError` when called with the wrong argument types.
     *
     * @example
     * ```ts
     * const event = scalekit.actions.triggers.verifyEvent({
     *   body: req.body, // raw Buffer, e.g. from express.raw()
     *   headers: req.headers,
     *   secret: process.env.SCALEKIT_TRIGGER_SECRET!,
     * });
     * ```
     */
    verifyEvent(params: TriggerEventVerifyParams): TriggerEvent;
}
