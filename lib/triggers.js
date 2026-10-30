"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggersClient = exports.PayloadState = exports.DetectionMode = exports.DeliveryScope = void 0;
exports.verifyTriggerEvent = verifyTriggerEvent;
const protobuf_1 = require("@bufbuild/protobuf");
const base_exception_1 = require("./errors/base-exception");
const specific_exceptions_1 = require("./errors/specific-exceptions");
const triggers_1 = require("./models/triggers");
const pb = __importStar(require("./pkg/grpc/scalekit/v1/triggers/triggers_pb"));
const webhook_signature_1 = require("./webhook-signature");
/**
 * Who a trigger event is delivered for. Branch on it before acting:
 * `'account'` events concern one connected account
 * ({@link TriggerEvent.connectedAccountId}); `'connection'` events concern the
 * whole connection and carry an empty `connectedAccountId`.
 *
 * Values the SDK does not know yet pass through unchanged as strings.
 */
exports.DeliveryScope = {
    ACCOUNT: 'account',
    CONNECTION: 'connection',
};
/**
 * How the change behind a trigger event was detected: pushed by the provider
 * (`'webhook'`) or found by polling (`'poll'`).
 *
 * Values the SDK does not know yet pass through unchanged as strings.
 */
exports.DetectionMode = {
    WEBHOOK: 'webhook',
    POLL: 'poll',
};
/**
 * Whether a trigger event carries the resource. `'full'`: `payload` holds it.
 * `'reference'`: `payload` is `null`; fetch the resource identified by
 * `resourceType` and `resourceId` yourself.
 *
 * Values the SDK does not know yet pass through unchanged as strings.
 */
exports.PayloadState = {
    FULL: 'full',
    REFERENCE: 'reference',
};
// An unpaired high or low surrogate anywhere in a string.
const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;
const KNOWN_FIELDS = new Set([
    'version',
    'trigger_type',
    'subscription_id',
    'delivery_scope',
    'connection_id',
    'connected_account_id',
    'resource_type',
    'resource_id',
    'occurred_at',
    'detection_mode',
    'payload_state',
    'payload',
    'dedupe_key',
    'correlation_id',
]);
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
function verifyTriggerEvent(params) {
    // Wrong argument types are programming errors, not unauthentic requests:
    // they throw TypeError so they are not answered with a 400 and forgotten.
    if (params === null || typeof params !== 'object') {
        throw new TypeError('verifyTriggerEvent expects { body, headers, secret }');
    }
    const { body, headers, secret } = params;
    if (typeof body !== 'string' && !(body instanceof Uint8Array)) {
        throw new TypeError(`Trigger event body must be the raw request body as a string or Buffer/Uint8Array, got ${describeType(body)}; ` +
            'with Express, use express.raw({ type: "application/json" }) on this route');
    }
    if (!isFetchHeaders(headers) && !isPlainObject(headers)) {
        throw new TypeError(`Trigger event headers must be a Headers object or a plain object of header values, got ${describeType(headers)}`);
    }
    if (typeof secret !== 'string') {
        throw new TypeError(`Trigger event secret must be a string, got ${describeType(secret)}`);
    }
    const webhookId = singleHeader(headers, 'webhook-id');
    const webhookTimestamp = singleHeader(headers, 'webhook-timestamp');
    const webhookSignature = joinedHeader(headers, 'webhook-signature');
    // A string with a lone UTF-16 surrogate has no UTF-8 encoding, so it cannot
    // be the bytes that were signed (Node would sign U+FFFD in its place).
    if (typeof body === 'string' && LONE_SURROGATE.test(body)) {
        throw new base_exception_1.WebhookVerificationError('Trigger event body is not valid UTF-8');
    }
    try {
        (0, webhook_signature_1.verifyPayloadSignature)(secret, webhookId, webhookTimestamp, webhookSignature, body, {
            keepCause: true,
            skipMalformedSignatures: true,
            strictTimestamp: true,
            strictSecret: true,
        });
    }
    catch (error) {
        if (error instanceof base_exception_1.WebhookVerificationError) {
            throw error;
        }
        throw new base_exception_1.WebhookVerificationError('Invalid Signature', { cause: error });
    }
    let text;
    if (typeof body === 'string') {
        text = body;
    }
    else {
        try {
            // ignoreBOM keeps a leading BOM in the text, so JSON.parse rejects it
            // as it does for a string body: a BOM-prefixed body is a parse error.
            text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(body);
        }
        catch (error) {
            throw new base_exception_1.WebhookVerificationError('Trigger event body is not valid UTF-8', { cause: error });
        }
    }
    return parseTriggerEvent(text);
}
const NO_TRANSPORT = 'This TriggersClient has no connection to Scalekit; use scalekit.actions.triggers';
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
class TriggersClient {
    /**
     * @internal Use `scalekit.actions.triggers`. A client built without a
     * transport can only verify events; its networked methods reject.
     */
    constructor(grpcConnect, coreClient) {
        if (grpcConnect !== undefined && coreClient !== undefined) {
            this.client = grpcConnect.createClient(pb.TriggerService);
            this.coreClient = coreClient;
        }
        else {
            this.client = undefined;
            this.coreClient = undefined;
        }
    }
    transport() {
        if (this.client === undefined || this.coreClient === undefined) {
            throw new base_exception_1.ScalekitException(NO_TRANSPORT);
        }
        return { client: this.client, core: this.coreClient };
    }
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
    listAvailable(connectionId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            const request = (0, protobuf_1.create)(pb.ListAvailableTriggersRequestSchema, {
                connectionId: (0, triggers_1.requireId)('connectionId', connectionId),
            });
            const res = yield core.connectExec(client.listAvailableTriggers, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapCatalog)(res);
        });
    }
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
    listEligibleAccounts(connectionId, triggerName, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { client, core } = this.transport();
            (0, triggers_1.optionalParams)('params', params);
            const request = (0, protobuf_1.create)(pb.ListEligibleAccountsRequestSchema, Object.assign(Object.assign({ connectionId: (0, triggers_1.requireId)('connectionId', connectionId), triggerName: (0, triggers_1.requireId)('triggerName', triggerName) }, ((params === null || params === void 0 ? void 0 : params.query) !== undefined && { query: params.query })), { pageSize: (0, triggers_1.pageSize)('pageSize', params === null || params === void 0 ? void 0 : params.pageSize), pageToken: (_a = params === null || params === void 0 ? void 0 : params.pageToken) !== null && _a !== void 0 ? _a : '' }));
            const res = yield core.connectExec(client.listEligibleAccounts, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapEligibleAccounts)(res);
        });
    }
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
    listSubscriptions(connectionId, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { client, core } = this.transport();
            (0, triggers_1.optionalParams)('params', params);
            const statuses = (params === null || params === void 0 ? void 0 : params.statuses) === undefined
                ? undefined
                : (0, triggers_1.stringArray)('statuses', params.statuses).map((s) => (0, triggers_1.toProtoEnum)('statuses[]', pb.TriggerSubscriptionStatus, s));
            const request = (0, protobuf_1.create)(pb.ListTriggerSubscriptionsRequestSchema, Object.assign(Object.assign(Object.assign({ connectionId: (0, triggers_1.requireId)('connectionId', connectionId) }, ((params === null || params === void 0 ? void 0 : params.triggerName) !== undefined && {
                triggerName: params.triggerName,
            })), (statuses !== undefined && { statuses })), { pageSize: (0, triggers_1.pageSize)('pageSize', params === null || params === void 0 ? void 0 : params.pageSize), pageToken: (_a = params === null || params === void 0 ? void 0 : params.pageToken) !== null && _a !== void 0 ? _a : '' }));
            const res = yield core.connectExec(client.listTriggerSubscriptions, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapSubscriptionList)(res);
        });
    }
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
    createSubscription(connectionId, triggerName, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            (0, triggers_1.optionalParams)('params', params);
            const request = (0, protobuf_1.create)(pb.CreateTriggerSubscriptionRequestSchema, Object.assign(Object.assign(Object.assign({ connectionId: (0, triggers_1.requireId)('connectionId', connectionId), triggerName: (0, triggers_1.requireId)('triggerName', triggerName) }, ((params === null || params === void 0 ? void 0 : params.connectedAccountId) !== undefined && {
                connectedAccountId: params.connectedAccountId,
            })), { intervalSeconds: (0, triggers_1.intervalSeconds)('intervalSeconds', params === null || params === void 0 ? void 0 : params.intervalSeconds) }), ((params === null || params === void 0 ? void 0 : params.config) !== undefined && {
                config: (0, triggers_1.stringRecord)('config', params.config),
            })));
            const res = yield core.connectExec(client.createTriggerSubscription, request, (0, triggers_1.execOptions)(options, false));
            return (0, triggers_1.mapSubscription)(res);
        });
    }
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
    batchCreateSubscriptions(connectionId, triggerName, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            (0, triggers_1.optionalParams)('params', params);
            const request = (0, protobuf_1.create)(pb.BatchCreateTriggerSubscriptionsRequestSchema, Object.assign(Object.assign(Object.assign({ connectionId: (0, triggers_1.requireId)('connectionId', connectionId), triggerName: (0, triggers_1.requireId)('triggerName', triggerName) }, ((params === null || params === void 0 ? void 0 : params.connectedAccountIds) !== undefined && {
                connectedAccountIds: (0, triggers_1.stringArray)('connectedAccountIds', params.connectedAccountIds),
            })), { intervalSeconds: (0, triggers_1.intervalSeconds)('intervalSeconds', params === null || params === void 0 ? void 0 : params.intervalSeconds) }), ((params === null || params === void 0 ? void 0 : params.config) !== undefined && {
                config: (0, triggers_1.stringRecord)('config', params.config),
            })));
            const res = yield core.connectExec(client.batchCreateTriggerSubscriptions, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapBatchCreate)(res);
        });
    }
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
    deleteSubscription(connectionId, subscriptionId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            const request = (0, protobuf_1.create)(pb.DeleteTriggerSubscriptionRequestSchema, {
                connectionId: (0, triggers_1.requireId)('connectionId', connectionId),
                subscriptionId: (0, triggers_1.requireId)('subscriptionId', subscriptionId),
            });
            yield core.connectExec(client.deleteTriggerSubscription, request, (0, triggers_1.execOptions)(options, true));
        });
    }
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
    batchDeleteSubscriptions(connectionId, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            (0, triggers_1.requireParams)('params', params);
            const request = (0, protobuf_1.create)(pb.BatchDeleteTriggerSubscriptionsRequestSchema, Object.assign(Object.assign(Object.assign({ connectionId: (0, triggers_1.requireId)('connectionId', connectionId) }, (params.subscriptionIds !== undefined && {
                subscriptionIds: (0, triggers_1.stringArray)('subscriptionIds', params.subscriptionIds),
            })), (params.triggerName !== undefined && {
                triggerName: params.triggerName,
            })), (params.connectedAccountIds !== undefined && {
                connectedAccountIds: (0, triggers_1.stringArray)('connectedAccountIds', params.connectedAccountIds),
            })));
            const res = yield core.connectExec(client.batchDeleteTriggerSubscriptions, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapBatchDelete)(res);
        });
    }
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
    getActivity(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            const res = yield core.connectExec(client.getTriggerActivity, (0, protobuf_1.create)(pb.GetTriggerActivityRequestSchema, {}), (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapActivity)(res);
        });
    }
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
     * for (const h of usage.hours) console.log(h.start?.toISOString(), h.units);
     * ```
     */
    getUsage(params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            (0, triggers_1.requireParams)('params', params);
            const request = (0, protobuf_1.create)(pb.GetTriggerUsageRequestSchema, Object.assign(Object.assign(Object.assign({}, (params.period !== undefined && { period: params.period })), (params.from !== undefined && {
                from: (0, triggers_1.calendarDate)('from', params.from),
            })), (params.to !== undefined && { to: (0, triggers_1.calendarDate)('to', params.to) })));
            const res = yield core.connectExec(client.getTriggerUsage, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapUsage)(res);
        });
    }
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
    getIngressEndpoint(connectionId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            const request = (0, protobuf_1.create)(pb.GetTriggerIngressEndpointRequestSchema, {
                connectionId: (0, triggers_1.requireId)('connectionId', connectionId),
            });
            const res = yield core.connectExec(client.getTriggerIngressEndpoint, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapIngressEndpoint)(res);
        });
    }
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
    createIngressEndpoint(connectionId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            const request = (0, protobuf_1.create)(pb.CreateTriggerIngressEndpointRequestSchema, {
                connectionId: (0, triggers_1.requireId)('connectionId', connectionId),
            });
            const res = yield core.connectExec(client.createTriggerIngressEndpoint, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapIngressEndpoint)(res);
        });
    }
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
    setSigningSecret(connectionId, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            (0, triggers_1.requireParams)('params', params);
            const request = (0, protobuf_1.create)(pb.SetTriggerSigningSecretRequestSchema, Object.assign({ connectionId: (0, triggers_1.requireId)('connectionId', connectionId) }, (params.signingSecret !== undefined && {
                signingSecret: params.signingSecret,
            })));
            const res = yield core.connectExec(client.setTriggerSigningSecret, request, (0, triggers_1.execOptions)(options, false));
            return (0, triggers_1.mapIngressEndpoint)(res);
        });
    }
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
    confirmSigningSecretRotation(connectionId, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            (0, triggers_1.optionalParams)('params', params);
            const request = (0, protobuf_1.create)(pb.ConfirmTriggerSigningSecretRotationRequestSchema, Object.assign({ connectionId: (0, triggers_1.requireId)('connectionId', connectionId) }, ((params === null || params === void 0 ? void 0 : params.signingSecretRotationId) !== undefined && {
                signingSecretRotationId: (0, triggers_1.safeIntegerToBigInt)('signingSecretRotationId', params.signingSecretRotationId),
            })));
            const res = yield core.connectExec(client.confirmTriggerSigningSecretRotation, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapIngressEndpoint)(res);
        });
    }
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
    generateSigningSecret(connectionId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            const request = (0, protobuf_1.create)(pb.GenerateTriggerSigningSecretRequestSchema, {
                connectionId: (0, triggers_1.requireId)('connectionId', connectionId),
            });
            const res = yield core.connectExec(client.generateTriggerSigningSecret, request, (0, triggers_1.execOptions)(options, false));
            return (0, triggers_1.mapGeneratedSecret)(res);
        });
    }
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
    listDeliveryAttemptsByEndpoint(endpointId, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            (0, triggers_1.optionalParams)('params', params);
            const request = (0, protobuf_1.create)(pb.ListTriggerDeliveryAttemptsByEndpointRequestSchema, {
                endpointId: (0, triggers_1.requireId)('endpointId', endpointId),
                pageSize: (0, triggers_1.pageSize)('pageSize', params === null || params === void 0 ? void 0 : params.pageSize),
            });
            const res = yield core.connectExec(client.listTriggerDeliveryAttemptsByEndpoint, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapAttemptList)(res);
        });
    }
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
    listDeliveries(endpointId, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { client, core } = this.transport();
            (0, triggers_1.optionalParams)('params', params);
            const request = (0, protobuf_1.create)(pb.ListTriggerDeliveriesByEndpointRequestSchema, Object.assign(Object.assign(Object.assign(Object.assign({ endpointId: (0, triggers_1.requireId)('endpointId', endpointId), pageSize: (0, triggers_1.pageSize)('pageSize', params === null || params === void 0 ? void 0 : params.pageSize), pageToken: (_a = params === null || params === void 0 ? void 0 : params.pageToken) !== null && _a !== void 0 ? _a : '' }, ((params === null || params === void 0 ? void 0 : params.status) !== undefined && {
                status: (0, triggers_1.toProtoEnum)('status', pb.TriggerDeliveryStatus, params.status),
            })), ((params === null || params === void 0 ? void 0 : params.channel) !== undefined && { channel: params.channel })), ((params === null || params === void 0 ? void 0 : params.after) !== undefined && {
                after: (0, triggers_1.toTimestamp)('after', params.after),
            })), ((params === null || params === void 0 ? void 0 : params.before) !== undefined && {
                before: (0, triggers_1.toTimestamp)('before', params.before),
            })));
            const res = yield core.connectExec(client.listTriggerDeliveriesByEndpoint, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapDeliveryList)(res);
        });
    }
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
    listDeliveryAttemptsByMessage(endpointId, msgId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            const request = (0, protobuf_1.create)(pb.ListTriggerDeliveryAttemptsByMessageRequestSchema, {
                endpointId: (0, triggers_1.requireId)('endpointId', endpointId),
                msgId: (0, triggers_1.requireId)('msgId', msgId),
            });
            const res = yield core.connectExec(client.listTriggerDeliveryAttemptsByMessage, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapMessageAttemptList)(res);
        });
    }
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
    lookupDelivery(deliveryId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            const request = (0, protobuf_1.create)(pb.LookupTriggerDeliveryRequestSchema, {
                id: (0, triggers_1.requireId)('deliveryId', deliveryId),
            });
            const res = yield core.connectExec(client.lookupTriggerDelivery, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapDeliveryDetails)(res);
        });
    }
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
    batchLookupDeliveries(params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            (0, triggers_1.requireParams)('params', params);
            const request = (0, protobuf_1.create)(pb.BatchLookupTriggerDeliveriesRequestSchema, {
                ids: (0, triggers_1.stringArray)('deliveryIds', params.deliveryIds),
            });
            const res = yield core.connectExec(client.batchLookupTriggerDeliveries, request, (0, triggers_1.execOptions)(options, true));
            return (0, triggers_1.mapBatchLookup)(res);
        });
    }
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
    batchResendDeliveries(params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            (0, triggers_1.requireParams)('params', params);
            if (!Array.isArray(params.targets)) {
                throw new base_exception_1.ScalekitValidationError('targets must be an array');
            }
            const request = (0, protobuf_1.create)(pb.BatchResendTriggerDeliveriesRequestSchema, {
                targets: params.targets.map((t, i) => {
                    const target = (t !== null && t !== void 0 ? t : {});
                    if (typeof target.msgId !== 'string' ||
                        typeof target.endpointId !== 'string') {
                        throw new base_exception_1.ScalekitValidationError(`targets[${i}] must have string msgId and endpointId`);
                    }
                    return { msgId: target.msgId, endpointId: target.endpointId };
                }),
            });
            const res = yield core.connectExec(client.batchResendTriggerDeliveries, request, (0, triggers_1.execOptions)(options, false));
            return (0, triggers_1.mapBatchResend)(res);
        });
    }
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
    recoverDeliveries(endpointId, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client, core } = this.transport();
            const id = (0, triggers_1.requireId)('endpointId', endpointId);
            (0, triggers_1.requireParams)('params', params);
            if (params.since === undefined) {
                throw new base_exception_1.ScalekitValidationError('since is required');
            }
            const request = (0, protobuf_1.create)(pb.RecoverTriggerDeliveriesRequestSchema, Object.assign({ endpointId: id, since: (0, triggers_1.toTimestamp)('since', params.since) }, (params.until !== undefined && {
                until: (0, triggers_1.toTimestamp)('until', params.until),
            })));
            const res = yield core.connectExec(client.recoverTriggerDeliveries, request, (0, triggers_1.execOptions)(options, false));
            return (0, triggers_1.mapRecovery)(res);
        });
    }
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
    verifyEvent(params) {
        return verifyTriggerEvent(params);
    }
}
exports.TriggersClient = TriggersClient;
// Anything with a `get(name)` method: a Fetch `Headers` (from any realm) or a
// `Map`. It is asked for the lower-case name, as Fetch `Headers` expects.
function isFetchHeaders(headers) {
    return (headers !== null &&
        typeof headers === 'object' &&
        !Array.isArray(headers) &&
        typeof headers.get === 'function');
}
// A plain object such as Node's `IncomingHttpHeaders`: its prototype is null
// or an `Object.prototype` (from any realm, hence the structural check).
// Arrays (`req.rawHeaders`), Buffers, Sets and class instances are not.
function isPlainObject(value) {
    if (value === null ||
        typeof value !== 'object' ||
        Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === null || Object.getPrototypeOf(proto) === null;
}
function headerValueError(name, value) {
    // A wrong value type is a programming error; dropping it silently would
    // turn it into a confusing "Missing required headers".
    return new TypeError(`Trigger event header "${name}" must be a string, an array of strings or undefined, got ${describeType(value)}`);
}
function isStringArray(value) {
    return (Array.isArray(value) &&
        value.every((item) => typeof item === 'string'));
}
/** All values for `name` (lower-case), matched case-insensitively. */
function headerValues(headers, name) {
    if (isFetchHeaders(headers)) {
        const value = headers.get(name);
        if (value === null || value === undefined) {
            return []; // Fetch Headers returns null and Map undefined when absent
        }
        if (typeof value === 'string') {
            return [value];
        }
        if (isStringArray(value)) {
            return [...value];
        }
        throw headerValueError(name, value);
    }
    const values = [];
    for (const key of Object.keys(headers)) {
        if (key.toLowerCase() !== name) {
            continue;
        }
        const value = headers[key];
        if (value === undefined) {
            continue;
        }
        if (typeof value === 'string') {
            values.push(value);
        }
        else if (isStringArray(value)) {
            values.push(...value);
        }
        else {
            throw headerValueError(name, value);
        }
    }
    return values;
}
/**
 * A header that must have one value. Repeated headers reach us either as
 * separate values or joined with ', ' (Node and Fetch both join duplicates),
 * so values are split on ',' (and the spaces the join adds) before comparing.
 * IDs and timestamps never contain ','. Values are otherwise kept verbatim,
 * so a stray space fails the timestamp grammar instead of being trimmed away.
 * Returns `undefined` when the header is absent and `''` when it is present
 * but empty.
 */
function singleHeader(headers, name) {
    const values = headerValues(headers, name);
    if (values.length === 0) {
        return undefined;
    }
    const distinct = new Set();
    for (const value of values) {
        for (const part of value.split(/,[ \t]*/)) {
            if (part !== '') {
                distinct.add(part);
            }
        }
    }
    if (distinct.size > 1) {
        throw new base_exception_1.WebhookVerificationError(`Multiple ${name} headers with different values`);
    }
    return distinct.size === 1 ? [...distinct][0] : '';
}
/** `webhook-signature`: every value is a candidate, separated by ' '. */
function joinedHeader(headers, name) {
    const joined = headerValues(headers, name).join(' ');
    return joined === '' ? undefined : joined;
}
function parseTriggerEvent(text) {
    let raw;
    try {
        raw = JSON.parse(text);
    }
    catch (_a) {
        // The JSON.parse error is not kept as `cause`: its message quotes part
        // of the body, and errors must not carry event data into logs.
        throw new specific_exceptions_1.ScalekitTriggerEventParseError('Trigger event body is not valid JSON');
    }
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
        throw new specific_exceptions_1.ScalekitTriggerEventParseError(`Trigger event body must be a JSON object, got ${describeType(raw)}`);
    }
    const fields = raw;
    const event = {
        version: requiredString(fields, 'version'),
        triggerType: requiredString(fields, 'trigger_type'),
        subscriptionId: requiredString(fields, 'subscription_id'),
        deliveryScope: requiredString(fields, 'delivery_scope'),
        connectionId: requiredString(fields, 'connection_id'),
        connectedAccountId: requiredString(fields, 'connected_account_id'),
        resourceType: requiredString(fields, 'resource_type'),
        resourceId: optionalString(fields, 'resource_id'),
        occurredAt: optionalTimestamp(fields, 'occurred_at'),
        detectionMode: requiredString(fields, 'detection_mode'),
        payloadState: requiredString(fields, 'payload_state'),
        payload: hasOwn(fields, 'payload') ? fields['payload'] : null,
        dedupeKey: requiredString(fields, 'dedupe_key'),
        correlationId: requiredString(fields, 'correlation_id'),
        // Object.fromEntries defines own properties, so a "__proto__" key stays
        // data and never changes the prototype.
        extra: Object.freeze(Object.fromEntries(Object.entries(fields).filter(([key]) => !KNOWN_FIELDS.has(key)))),
    };
    return Object.freeze(event);
}
function hasOwn(fields, key) {
    return Object.prototype.hasOwnProperty.call(fields, key);
}
function requiredString(fields, key) {
    if (!hasOwn(fields, key)) {
        throw new specific_exceptions_1.ScalekitTriggerEventParseError(`Trigger event is missing required field "${key}"`);
    }
    const value = fields[key];
    if (typeof value !== 'string') {
        throw new specific_exceptions_1.ScalekitTriggerEventParseError(`Trigger event field "${key}" must be a string, got ${describeType(value)}`);
    }
    return value;
}
function optionalString(fields, key) {
    const value = hasOwn(fields, key) ? fields[key] : null;
    if (value === null) {
        return undefined;
    }
    if (typeof value !== 'string') {
        throw new specific_exceptions_1.ScalekitTriggerEventParseError(`Trigger event field "${key}" must be a string or null, got ${describeType(value)}`);
    }
    return value;
}
// RFC 3339 date-time with a required offset (Z or ±hh:mm). Ranges are checked
// here and day-of-month below, rather than trusting `new Date`, which accepts
// many other formats and rolls 2026-02-31 over into March.
const RFC3339 = /^(\d{4})-(\d{2})-(\d{2})[Tt]([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:\.(\d+))?(?:([Zz])|([+-])([01]\d|2[0-3]):([0-5]\d))$/;
function optionalTimestamp(fields, key) {
    const value = hasOwn(fields, key) ? fields[key] : null;
    if (value === null || value === '') {
        return undefined;
    }
    if (typeof value !== 'string') {
        throw new specific_exceptions_1.ScalekitTriggerEventParseError(`Trigger event field "${key}" must be an RFC 3339 timestamp string, got ${describeType(value)}`);
    }
    const date = parseRfc3339(value);
    if (date === undefined) {
        throw new specific_exceptions_1.ScalekitTriggerEventParseError(`Trigger event field "${key}" is not an RFC 3339 timestamp with an offset`);
    }
    return date;
}
function parseRfc3339(value) {
    const m = RFC3339.exec(value);
    if (m === null) {
        return undefined;
    }
    const year = Number(m[1]);
    if (year === 0) {
        return undefined; // RFC 3339 allows 0000, but it is not a valid event time
    }
    const month = Number(m[2]);
    const day = Number(m[3]);
    const millis = m[7] === undefined ? 0 : Number(m[7].slice(0, 3).padEnd(3, '0'));
    // setUTCFullYear (not Date.UTC) so years 0000-0099 are not mapped to 19xx.
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    date.setUTCHours(Number(m[4]), Number(m[5]), Number(m[6]), millis);
    if (date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day) {
        return undefined; // month 00/13 or a day the month does not have
    }
    if (m[8] === undefined) {
        const sign = m[9] === '-' ? -1 : 1;
        const offsetMinutes = Number(m[10]) * 60 + Number(m[11]);
        date.setTime(date.getTime() - sign * offsetMinutes * 60000);
    }
    const utcYear = date.getUTCFullYear();
    if (utcYear < 1 || utcYear > 9999) {
        return undefined; // the offset moved it outside years 0001-9999
    }
    return date;
}
function describeType(value) {
    if (value === null) {
        return 'null';
    }
    if (Array.isArray(value)) {
        return 'array';
    }
    return typeof value;
}
//# sourceMappingURL=triggers.js.map