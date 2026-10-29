import type GrpcConnect from './connect';
import type CoreClient from './core';
import { type GeneratedTriggerSigningSecret, type TriggerActivity, type TriggerCatalog, type TriggerDeliveryAttemptList, type TriggerDeliveryAttemptListParams, type TriggerDeliveryBatchLookupParams, type TriggerDeliveryBatchLookupResult, type TriggerDeliveryBatchResendParams, type TriggerDeliveryBatchResendResult, type TriggerDeliveryDetails, type TriggerDeliveryList, type TriggerDeliveryListParams, type TriggerDeliveryRecoverParams, type TriggerDeliveryRecovery, type TriggerEligibleAccountList, type TriggerEligibleAccountListParams, type TriggerIngressEndpoint, type TriggerMessageAttemptList, type TriggerSigningSecretRotationConfirmParams, type TriggerSigningSecretSetParams, type TriggerSubscription, type TriggerSubscriptionBatchCreateParams, type TriggerSubscriptionBatchCreateResult, type TriggerSubscriptionBatchDeleteParams, type TriggerSubscriptionBatchDeleteResult, type TriggerSubscriptionCreateParams, type TriggerSubscriptionList, type TriggerSubscriptionListParams, type TriggerUsage, type TriggerUsageGetParams } from './models/triggers';
import type { JsonValue } from './types/json';
import type { RequestOptions } from './types/request-options';
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
 * AgentKit triggers: discover a connection's triggers, subscribe connected
 * accounts to them, set up the webhook URL and its signing secret, read
 * activity and usage, inspect and resend deliveries, and verify the events
 * delivered to your endpoint. Reached as `scalekit.actions.triggers`.
 *
 * @remarks
 * Every networked method takes an optional {@link RequestOptions} last
 * (`signal`, `timeoutMs`). Errors:
 * - Invalid arguments throw `ScalekitValidationError` before any request.
 * - A server error rejects with a `ScalekitServerException` subclass chosen
 *   by status: `ScalekitBadRequestException` (400),
 *   `ScalekitNotFoundException` (404), `ScalekitConflictException` (409),
 *   `ScalekitTooManyRequestsException` (429),
 *   `ScalekitInternalServerException` (500),
 *   `ScalekitServiceUnavailableException` (503) and
 *   `ScalekitGatewayTimeoutException` (deadline). Branch on `errorCode` for
 *   the reason, for example `TRIGGER_INGRESS_ENDPOINT_NOT_CREATED`.
 * - An aborted `signal` rejects with `ScalekitAbortError`.
 * - Calls that are safe to repeat are retried when the service is briefly
 *   unavailable. `createSubscription`, `setSigningSecret`,
 *   `generateSigningSecret`, `batchResendDeliveries` and `recoverDeliveries`
 *   are not, because a repeat could apply them twice.
 * - Batch methods report each item's outcome in `results`; a refused or
 *   missing item never throws.
 *
 * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md: Triggers}
 */
export declare class TriggersClient {
    private readonly client;
    private readonly coreClient;
    /**
     * @internal Use `scalekit.actions.triggers`. A client built without a
     * transport can only verify events; its networked methods reject.
     */
    constructor(grpcConnect?: GrpcConnect, coreClient?: CoreClient);
    private transport;
    /**
     * Lists every trigger the connection's provider publishes, each marked as
     * available or not on this connection.
     *
     * @remarks
     * An unavailable trigger is still listed, with `available: false`, a
     * `reason`, a `remedy` and, where one applies, a `refusalCode`. Use it to
     * build a trigger picker, then {@link TriggersClient.listEligibleAccounts}
     * to see who can subscribe. Safe to retry.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param options - Per-call options.
     * @returns The connection's triggers and whether it uses Scalekit's shared provider app.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitNotFoundException} If the connection does not exist in this environment.
     * @throws {@link ScalekitValidationError} If `connectionId` is empty.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const { triggers } = await scalekit.actions.triggers.listAvailable('conn_123');
     * for (const t of triggers.filter((t) => t.available)) {
     *   console.log(t.name, t.mode, t.configFields.map((f) => f.key));
     * }
     * ```
     */
    listAvailable(connectionId: string, options?: RequestOptions): Promise<TriggerCatalog>;
    /**
     * Lists the connection's connected accounts, each marked as eligible or not
     * for one trigger, with its health.
     *
     * @remarks
     * Ineligible accounts are listed with a `reason` and `remedy` rather than
     * left out. Returns one page; pass `nextPageToken` back as `pageToken`.
     * Safe to retry.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param triggerName - A trigger `name` from {@link TriggersClient.listAvailable}.
     * @param params - Optional search and paging.
     * @param options - Per-call options.
     * @returns One page of accounts, page tokens and the total match count.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitNotFoundException} If the connection or trigger does not exist.
     * @throws {@link ScalekitBadRequestException} If `pageToken` is not one the server issued.
     * @throws {@link ScalekitValidationError} If `connectionId` or `triggerName` is empty.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const page = await scalekit.actions.triggers.listEligibleAccounts(
     *   'conn_123',
     *   'example.item.created',
     *   { query: 'acme', pageSize: 50 }
     * );
     * const ids = page.accounts.filter((a) => a.eligible).map((a) => a.id);
     * ```
     */
    listEligibleAccounts(connectionId: string, triggerName: string, params?: TriggerEligibleAccountListParams, options?: RequestOptions): Promise<TriggerEligibleAccountList>;
    /**
     * Lists the connection's trigger subscriptions, newest first.
     *
     * @remarks
     * Polled subscriptions carry their requested and effective intervals and
     * their poll state. `statusCounts` counts every status across every page.
     * Returns one page; pass `nextPageToken` back as `pageToken`. Safe to retry.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param params - Optional filters and paging. `statuses` takes
     *   {@link (TriggerSubscriptionStatus:variable)} values; a value newer than
     *   this SDK can be passed as its number in a string, such as `'5'`.
     * @param options - Per-call options.
     * @returns One page of subscriptions, page tokens, the total and per-status counts.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitNotFoundException} If the connection does not exist in this environment.
     * @throws {@link ScalekitBadRequestException} If a filter or `pageToken` is refused.
     * @throws {@link ScalekitValidationError} If `connectionId` is empty or a status name is unknown.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * import { TriggerSubscriptionStatus } from '@scalekit-sdk/node';
     *
     * const page = await scalekit.actions.triggers.listSubscriptions('conn_123', {
     *   statuses: [TriggerSubscriptionStatus.PAUSED_CREDENTIAL],
     * });
     * console.log(page.statusCounts.ACTIVE ?? 0, 'active');
     * ```
     */
    listSubscriptions(connectionId: string, params?: TriggerSubscriptionListParams, options?: RequestOptions): Promise<TriggerSubscriptionList>;
    /**
     * Subscribes one connected account, or the whole connection, to a trigger.
     *
     * @remarks
     * Pass `connectedAccountId` for an account-scoped trigger and omit it for a
     * connection-scoped one. A refusal (a missing scope, an interval below the
     * minimum, an unhealthy account) is a 400 whose message says what to
     * change. Not retried when the service is briefly unavailable: a repeat
     * could find the first attempt's subscription and answer 409. To subscribe
     * many accounts, or to retry safely, use
     * {@link TriggersClient.batchCreateSubscriptions}.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param triggerName - A trigger `name` from {@link TriggersClient.listAvailable}.
     * @param params - The account, polling interval and filter values.
     * @param options - Per-call options.
     * @returns The new subscription.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitConflictException} If the same subscription (account, trigger and config) already exists.
     * @throws {@link ScalekitNotFoundException} If the connection, trigger or connected account does not exist.
     * @throws {@link ScalekitBadRequestException} If the server refuses the subscription; the message names the remedy.
     * @throws {@link ScalekitValidationError} If `connectionId` or `triggerName` is empty, `intervalSeconds` is not a whole number, or a `config` value is not a string.
     * @throws {@link ScalekitServiceUnavailableException} If the service is unavailable; the subscription may or may not have been created, so check `listSubscriptions` before calling again.
     * @throws {@link ScalekitGatewayTimeoutException} If the deadline passes; the subscription may still have been created, so check `listSubscriptions` before calling again.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const sub = await scalekit.actions.triggers.createSubscription(
     *   'conn_123',
     *   'example.item.created',
     *   { connectedAccountId: 'ca_123', config: { channel: 'C123' } }
     * );
     * console.log(sub.id, sub.status);
     * ```
     */
    createSubscription(connectionId: string, triggerName: string, params?: TriggerSubscriptionCreateParams, options?: RequestOptions): Promise<TriggerSubscription>;
    /**
     * Subscribes many connected accounts to one trigger with one filter, and
     * reports each account's outcome.
     *
     * @remarks
     * Best effort, not all or nothing: each result has its own `outcome`
     * (`CREATED`, `ALREADY_SUBSCRIBED`, `REFUSED`, `NOT_FOUND`, `FAILED`) and
     * a refused account never throws. Retrying the whole call is safe: an
     * account subscribed earlier comes back `ALREADY_SUBSCRIBED`. For a
     * connection-scoped trigger, omit `connectedAccountIds`; the one
     * subscription comes back as a single result with an empty
     * `connectedAccountId`.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param triggerName - A trigger `name` from {@link TriggersClient.listAvailable}.
     * @param params - The accounts, polling interval and filter values.
     * @param options - Per-call options.
     * @returns One result per account, in request order, and how many were created.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitNotFoundException} If the connection or trigger does not exist.
     * @throws {@link ScalekitBadRequestException} If the request as a whole is refused (for example a malformed account ID, or no accounts for an account-scoped trigger).
     * @throws {@link ScalekitValidationError} If `connectionId` or `triggerName` is empty, `intervalSeconds` is not a whole number, or a `config` value is not a string.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const { results, createdCount } =
     *   await scalekit.actions.triggers.batchCreateSubscriptions(
     *     'conn_123',
     *     'example.item.created',
     *     { connectedAccountIds: ['ca_1', 'ca_2'] }
     *   );
     * const refused = results.filter((r) => r.outcome === 'REFUSED');
     * ```
     */
    batchCreateSubscriptions(connectionId: string, triggerName: string, params?: TriggerSubscriptionBatchCreateParams, options?: RequestOptions): Promise<TriggerSubscriptionBatchCreateResult>;
    /**
     * Deletes one trigger subscription. Permanent: new events stop matching
     * it, and a polled subscription stops polling.
     *
     * @remarks
     * Retried when the service is briefly unavailable. A 404 after such a
     * retry can mean the first attempt already deleted it; treat
     * `ScalekitNotFoundException` as "gone" if that suits you.
     *
     * @param connectionId - The connection the subscription belongs to (`conn_...`).
     * @param subscriptionId - The subscription (`trgs_...`).
     * @param options - Per-call options.
     * @returns Nothing.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitNotFoundException} If no such subscription exists on this connection.
     * @throws {@link ScalekitBadRequestException} If an ID is malformed.
     * @throws {@link ScalekitValidationError} If `connectionId` or `subscriptionId` is empty.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * await scalekit.actions.triggers.deleteSubscription('conn_123', 'trgs_123');
     * ```
     */
    deleteSubscription(connectionId: string, subscriptionId: string, options?: RequestOptions): Promise<void>;
    /**
     * Deletes many trigger subscriptions on one connection, and reports each
     * one's outcome.
     *
     * @remarks
     * Name the subscriptions in exactly one way: `subscriptionIds`, or
     * `triggerName` together with `connectedAccountIds` (every subscription
     * those accounts hold to that trigger). The server refuses anything else
     * with a 400. Best effort and safe to retry: treat `DELETED` and
     * `NOT_FOUND` alike as gone, and send `NOT_ATTEMPTED` items again.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param params - The selector.
     * @param options - Per-call options.
     * @returns One result per subscription, and how many were deleted.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the selector is refused.
     * @throws {@link ScalekitTooManyRequestsException} If batch deletes are rate limited.
     * @throws {@link ScalekitValidationError} If `connectionId` is empty or `params` is missing.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const { deletedCount } = await scalekit.actions.triggers.batchDeleteSubscriptions(
     *   'conn_123',
     *   { subscriptionIds: ['trgs_1', 'trgs_2'] }
     * );
     * ```
     */
    batchDeleteSubscriptions(connectionId: string, params: TriggerSubscriptionBatchDeleteParams, options?: RequestOptions): Promise<TriggerSubscriptionBatchDeleteResult>;
    /**
     * Returns counts of what happened to the environment's trigger events over
     * the last day, by outcome, across every connection.
     *
     * @remarks
     * Use it to diagnose a trigger that did not fire. The counts are
     * aggregates only; individual events are not stored. Safe to retry.
     *
     * @param options - Per-call options.
     * @returns The counts, the window they cover and health indicators.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const activity = await scalekit.actions.triggers.getActivity();
     * if (activity.signatureBanner) console.warn('check the signing secret');
     * console.log(activity.counts.delivered, 'delivered');
     * ```
     */
    getActivity(options?: RequestOptions): Promise<TriggerActivity>;
    /**
     * Returns the trigger deliveries metered for this environment over a
     * period: hourly for `period: '24h'`, daily otherwise.
     *
     * @remarks
     * Pass a preset `period` (`'24h'`, `'7d'`, `'30d'`, exactly) or a `from`
     * and `to` UTC date range (`'YYYY-MM-DD'`, inclusive). Hours and days with
     * no deliveries are absent, not zero. The range read is returned as
     * `from` and `to`, which differ from the request when it was clamped to
     * the readable window (today and the 30 days before it). Safe to retry.
     *
     * @param params - The period or date range.
     * @param options - Per-call options.
     * @returns The usage entries and the range read.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the period or range is refused.
     * @throws {@link ScalekitNotFoundException} If usage is not metered for this environment (`errorCode` `TRIGGER_USAGE_NOT_METERED`).
     * @throws {@link ScalekitServiceUnavailableException} If usage cannot be read right now.
     * @throws {@link ScalekitValidationError} If `params` is missing, or `from` or `to` is not a real `YYYY-MM-DD` date.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const usage = await scalekit.actions.triggers.getUsage({ period: '24h' });
     * for (const h of usage.hours) console.log(h.start.toISOString(), h.units);
     * ```
     */
    getUsage(params: TriggerUsageGetParams, options?: RequestOptions): Promise<TriggerUsage>;
    /**
     * Returns the connection's webhook URL and the state of its signing
     * secret. Never creates a URL; see {@link TriggersClient.createIngressEndpoint}.
     *
     * @remarks Safe to retry. The secret itself is never returned. Treat
     * `url` as confidential: it carries the endpoint's token, so anyone
     * holding it can send events to the connection. `console.log` shows it
     * as `[redacted]`.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param options - Per-call options.
     * @returns The endpoint.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitNotFoundException} If the connection has no webhook URL yet (`errorCode` `TRIGGER_INGRESS_ENDPOINT_NOT_CREATED`) or does not exist (`RESOURCE_NOT_FOUND`).
     * @throws {@link ScalekitValidationError} If `connectionId` is empty.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const endpoint = await scalekit.actions.triggers.getIngressEndpoint('conn_123');
     * console.log(endpoint.url, endpoint.signingSecretConfigured);
     * ```
     */
    getIngressEndpoint(connectionId: string, options?: RequestOptions): Promise<TriggerIngressEndpoint>;
    /**
     * Creates the connection's webhook URL, the one to register in the
     * provider's app configuration.
     *
     * @remarks
     * Treat the URL as confidential: it carries the endpoint's token, so
     * anyone holding it can send events to the connection (`console.log`
     * shows it as `[redacted]`). Idempotent: when the connection already has
     * a URL, that URL comes back
     * unchanged. Only a connection whose provider publishes a webhook trigger
     * can have one. Next, store the provider's secret with
     * {@link TriggersClient.setSigningSecret}, or, when its triggers report
     * `providesBearerSecret`, call {@link TriggersClient.generateSigningSecret}.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param options - Per-call options.
     * @returns The endpoint.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the provider has no webhook trigger (`errorCode` `TRIGGER_INGRESS_NOT_APPLICABLE`) or its trigger definitions cannot be read (`TRIGGER_INGRESS_DEFINITIONS_UNAVAILABLE`).
     * @throws {@link ScalekitNotFoundException} If the connection does not exist.
     * @throws {@link ScalekitValidationError} If `connectionId` is empty.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const { url } = await scalekit.actions.triggers.createIngressEndpoint('conn_123');
     * ```
     */
    createIngressEndpoint(connectionId: string, options?: RequestOptions): Promise<TriggerIngressEndpoint>;
    /**
     * Stores the secret the provider signs its webhook events with.
     *
     * @remarks
     * The first secret is stored as is. Setting a different one later starts a
     * rotation: both are accepted until you call
     * {@link TriggersClient.confirmSigningSecretRotation}, or for at most 24
     * hours. Setting the stored secret again changes nothing. Not retried when
     * the service is briefly unavailable, because a repeat could advance the
     * rotation.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param params - The secret, copied from the provider's app configuration.
     * @param options - Per-call options.
     * @returns The endpoint with its masked secret and rotation state.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the secret is refused, or the provider takes a generated secret instead (`errorCode` `TRIGGER_SIGNING_SECRET_GENERATED_ONLY`).
     * @throws {@link ScalekitConflictException} If a rotation is already in progress.
     * @throws {@link ScalekitNotFoundException} If the connection has no webhook URL yet (`TRIGGER_INGRESS_ENDPOINT_NOT_CREATED`).
     * @throws {@link ScalekitValidationError} If `connectionId` is empty or `params` is missing.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const endpoint = await scalekit.actions.triggers.setSigningSecret('conn_123', {
     *   signingSecret: process.env.PROVIDER_SIGNING_SECRET!,
     * });
     * if (endpoint.rotationInProgress) {
     *   // update the provider, then confirm endpoint.signingSecretRotationId
     * }
     * ```
     */
    setSigningSecret(connectionId: string, params: TriggerSigningSecretSetParams, options?: RequestOptions): Promise<TriggerIngressEndpoint>;
    /**
     * Ends a signing-secret rotation by retiring the previous secret.
     *
     * @remarks
     * Pass the `signingSecretRotationId` from the endpoint you last read, so
     * only that rotation is confirmed. Succeeds and changes nothing when no
     * rotation is in progress. Safe to retry.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param params - The rotation to confirm.
     * @param options - Per-call options.
     * @returns The endpoint's current signing-secret state.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If a rotation is in progress and the ID is missing or does not match it.
     * @throws {@link ScalekitNotFoundException} If the connection has no webhook URL yet.
     * @throws {@link ScalekitValidationError} If `connectionId` is empty or the ID is not a safe integer.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const current = await scalekit.actions.triggers.getIngressEndpoint('conn_123');
     * await scalekit.actions.triggers.confirmSigningSecretRotation('conn_123', {
     *   signingSecretRotationId: current.signingSecretRotationId,
     * });
     * ```
     */
    confirmSigningSecretRotation(connectionId: string, params?: TriggerSigningSecretRotationConfirmParams, options?: RequestOptions): Promise<TriggerIngressEndpoint>;
    /**
     * Generates and stores a random signing secret for a provider that sends
     * no signature of its own (its triggers report `providesBearerSecret`).
     *
     * @remarks
     * The plain-text secret is returned only by this call: store it, or give
     * the provider `urlWithSecret`. `console.log` and `util.inspect` show both
     * as `[redacted]`; reading them, spreading the result or `JSON.stringify`
     * gives the real values. When a secret already exists,
     * this starts a rotation, as {@link TriggersClient.setSigningSecret} does.
     * Not retried when the service is briefly unavailable, because a repeat
     * would replace the secret you never saw.
     *
     * @param connectionId - The connection (`conn_...`).
     * @param options - Per-call options.
     * @returns The secret, the URL that carries it, and the endpoint.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the provider signs its own events (`errorCode` `TRIGGER_SIGNING_SECRET_NOT_GENERATABLE`).
     * @throws {@link ScalekitConflictException} If a rotation is already in progress.
     * @throws {@link ScalekitNotFoundException} If the connection has no webhook URL yet.
     * @throws {@link ScalekitValidationError} If `connectionId` is empty.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const generated = await scalekit.actions.triggers.generateSigningSecret('conn_123');
     * await saveSecret(generated.signingSecret); // your own secret store
     * ```
     */
    generateSigningSecret(connectionId: string, options?: RequestOptions): Promise<GeneratedTriggerSigningSecret>;
    /**
     * Lists the most recent attempts to deliver trigger events to one of your
     * delivery endpoints, newest first.
     *
     * @remarks
     * Only the most recent attempts are returned; there is no page token. A
     * failed attempt is retried, so check the newest attempt for a message
     * before concluding it was not delivered. Safe to retry.
     *
     * @param endpointId - The delivery endpoint.
     * @param params - Optional page size.
     * @param options - Per-call options.
     * @returns The attempts.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the endpoint is unknown in this environment (a 400 here, unlike `recoverDeliveries`).
     * @throws {@link ScalekitValidationError} If `endpointId` is empty.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const { attempts } =
     *   await scalekit.actions.triggers.listDeliveryAttemptsByEndpoint('ep_123');
     * ```
     */
    listDeliveryAttemptsByEndpoint(endpointId: string, params?: TriggerDeliveryAttemptListParams, options?: RequestOptions): Promise<TriggerDeliveryAttemptList>;
    /**
     * Lists one page of the trigger events delivered to one delivery endpoint,
     * newest first, one entry per event.
     *
     * @remarks
     * Deliveries are kept for 90 days. Pass `nextPageToken` back as
     * `pageToken`, with the same endpoint and filters, for older ones. Safe to
     * retry.
     *
     * @param endpointId - The delivery endpoint.
     * @param params - Optional filters and paging.
     * @param options - Per-call options.
     * @returns One page of deliveries.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the endpoint is unknown, or a filter or `pageToken` is refused.
     * @throws {@link ScalekitTooManyRequestsException} If reads are rate limited.
     * @throws {@link ScalekitValidationError} If `endpointId` is empty, `status` is unknown, or `after` or `before` is an invalid `Date` or a string without `Z` or an offset.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const page = await scalekit.actions.triggers.listDeliveries('ep_123', {
     *   status: 'FAILED',
     *   after: new Date(Date.now() - 24 * 60 * 60 * 1000),
     * });
     * ```
     */
    listDeliveries(endpointId: string, params?: TriggerDeliveryListParams, options?: RequestOptions): Promise<TriggerDeliveryList>;
    /**
     * Lists every attempt to deliver one trigger event to one delivery
     * endpoint, oldest first.
     *
     * @remarks
     * At most 50 attempts (the newest 50) are returned; `truncated` says when
     * there are more. Response bodies are cut to 4096 bytes. Safe to retry.
     *
     * @param endpointId - The delivery endpoint.
     * @param msgId - The message (`msg_...`).
     * @param options - Per-call options.
     * @returns The attempts.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the endpoint or message is unknown.
     * @throws {@link ScalekitValidationError} If `endpointId` or `msgId` is empty.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const { attempts, truncated } =
     *   await scalekit.actions.triggers.listDeliveryAttemptsByMessage('ep_123', 'msg_123');
     * ```
     */
    listDeliveryAttemptsByMessage(endpointId: string, msgId: string, options?: RequestOptions): Promise<TriggerMessageAttemptList>;
    /**
     * Finds one trigger event by its message ID or its event ID, with its
     * attempts across every delivery endpoint in this environment.
     *
     * @remarks
     * The message ID arrives at your endpoint as the `webhook-id` header; the
     * event ID is the payload's `dedupe_key`. Attempt IDs (`atmpt_...`) are
     * refused. Safe to retry.
     *
     * @param deliveryId - A message ID (`msg_...`) or an event ID.
     * @param options - Per-call options.
     * @returns The event and its attempts, oldest first.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitNotFoundException} If no such event exists in this environment (`errorCode` `NOT_FOUND`).
     * @throws {@link ScalekitBadRequestException} If the ID is malformed.
     * @throws {@link ScalekitTooManyRequestsException} If reads are rate limited.
     * @throws {@link ScalekitValidationError} If `deliveryId` is empty.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const delivery = await scalekit.actions.triggers.lookupDelivery(
     *   req.headers['webhook-id'] as string
     * );
     * ```
     */
    lookupDelivery(deliveryId: string, options?: RequestOptions): Promise<TriggerDeliveryDetails>;
    /**
     * Finds up to 25 trigger events by message ID or event ID, as
     * {@link TriggersClient.lookupDelivery} does for one.
     *
     * @remarks
     * Each ID has its own `outcome` and never throws. When reads are refused
     * for volume partway through, that ID is `RATE_LIMITED` and the rest are
     * `NOT_ATTEMPTED`. Attempts carry no response bodies here. Read only, so
     * always safe to retry.
     *
     * @param params - The IDs.
     * @param options - Per-call options.
     * @returns One result per ID, in the order sent, and how many were found.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the list is refused (empty, too long, duplicates or an attempt ID).
     * @throws {@link ScalekitTooManyRequestsException} If batch lookups are rate limited.
     * @throws {@link ScalekitValidationError} If `deliveryIds` is not an array of strings.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const { results } = await scalekit.actions.triggers.batchLookupDeliveries({
     *   deliveryIds: ['msg_1', 'evt_2'],
     * });
     * ```
     */
    batchLookupDeliveries(params: TriggerDeliveryBatchLookupParams, options?: RequestOptions): Promise<TriggerDeliveryBatchLookupResult>;
    /**
     * Queues a new delivery attempt for up to 50 trigger events, each to one
     * delivery endpoint, and reports each target's outcome.
     *
     * @remarks
     * `QUEUED` means a new attempt was accepted, not delivered. Not
     * idempotent: every call queues one more attempt per target, so after a
     * partial failure resend only the targets that came back `RATE_LIMITED`,
     * `FAILED` or `NOT_ATTEMPTED`. Not retried when the service is briefly
     * unavailable.
     *
     * @param params - The targets.
     * @param options - Per-call options.
     * @returns One result per target, in the order sent, and how many were queued.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitBadRequestException} If the list is refused (empty, too long, a repeated or malformed target).
     * @throws {@link ScalekitTooManyRequestsException} If resends are rate limited.
     * @throws {@link ScalekitValidationError} If `targets` is not an array, or a target's `msgId` or `endpointId` is not a string.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const { results } = await scalekit.actions.triggers.batchResendDeliveries({
     *   targets: [{ msgId: 'msg_123', endpointId: 'ep_123' }],
     * });
     * ```
     */
    batchResendDeliveries(params: TriggerDeliveryBatchResendParams, options?: RequestOptions): Promise<TriggerDeliveryBatchResendResult>;
    /**
     * Starts a background recovery that resends every trigger event whose
     * delivery to one endpoint failed within a time window.
     *
     * @remarks
     * Use it once your endpoint is healthy again after an outage. The window is
     * at most 14 days; omit `until` to recover up to now. The response confirms
     * the recovery started, not that anything was delivered; one call recovers
     * at most 10,000 events. Not retried when the service is briefly
     * unavailable. A `ScalekitInternalServerException` here can mean the
     * recovery started anyway, so check the deliveries before calling again.
     *
     * @param endpointId - The delivery endpoint (`ep_...`).
     * @param params - The window.
     * @param options - Per-call options.
     * @returns The recovery's task ID and status.
     * @throws {ScalekitServerException} If a network or server error occurs.
     * @throws {@link ScalekitNotFoundException} If the endpoint is unknown (a 404 here, unlike the list methods).
     * @throws {@link ScalekitBadRequestException} If the window is refused.
     * @throws {@link ScalekitTooManyRequestsException} If recoveries are rate limited.
     * @throws {@link ScalekitValidationError} If `endpointId` is empty, `since` is missing, or `since` or `until` is an invalid `Date` or a string without `Z` or an offset.
     * @throws {@link ScalekitAbortError} If `options.signal` aborts.
     * @see {@link https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/REFERENCE.md#triggers | REFERENCE.md}
     *
     * @example
     * ```ts
     * const recovery = await scalekit.actions.triggers.recoverDeliveries('ep_123', {
     *   since: new Date(Date.now() - 6 * 60 * 60 * 1000),
     * });
     * console.log(recovery.taskId, recovery.status);
     * ```
     */
    recoverDeliveries(endpointId: string, params: TriggerDeliveryRecoverParams, options?: RequestOptions): Promise<TriggerDeliveryRecovery>;
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
