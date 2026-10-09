"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggersClient = exports.PayloadState = exports.DetectionMode = exports.DeliveryScope = void 0;
exports.verifyTriggerEvent = verifyTriggerEvent;
const base_exception_1 = require("./errors/base-exception");
const specific_exceptions_1 = require("./errors/specific-exceptions");
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
    // A string with a lone UTF-16 surrogate has no UTF-8 encoding, so it cannot
    // be the bytes that were signed (Node would sign U+FFFD in its place).
    if (typeof body === 'string' && LONE_SURROGATE.test(body)) {
        throw new base_exception_1.WebhookVerificationError('Trigger event body is not valid UTF-8');
    }
    const webhookId = singleHeader(headers, 'webhook-id');
    const webhookTimestamp = singleHeader(headers, 'webhook-timestamp');
    const webhookSignature = joinedHeader(headers, 'webhook-signature');
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
/**
 * Trigger events delivered to your endpoint. Reached as
 * `scalekit.actions.triggers`.
 */
class TriggersClient {
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