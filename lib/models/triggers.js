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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerDeliveryAttemptStatus = exports.TriggerDeliveryAttemptTriggerType = exports.TriggerDeliveryResendOutcome = exports.TriggerDeliveryLookupOutcome = exports.TriggerDeliveryStatus = exports.TriggerUsageBucket = exports.TriggerSubscriptionDeleteOutcome = exports.TriggerSubscribeOutcome = exports.TriggerRefusalCode = exports.TriggerPlatformCredentials = exports.AccountHealthAction = exports.AccountHealthState = exports.TriggerPollErrorCode = exports.TriggerSubscriptionStatus = void 0;
exports.requireId = requireId;
exports.requireParams = requireParams;
exports.optionalParams = optionalParams;
exports.stringArray = stringArray;
exports.stringRecord = stringRecord;
exports.pageSize = pageSize;
exports.intervalSeconds = intervalSeconds;
exports.safeIntegerToBigInt = safeIntegerToBigInt;
exports.toTimestamp = toTimestamp;
exports.calendarDate = calendarDate;
exports.toProtoEnum = toProtoEnum;
exports.execOptions = execOptions;
exports.mapCatalog = mapCatalog;
exports.mapEligibleAccounts = mapEligibleAccounts;
exports.mapSubscription = mapSubscription;
exports.mapSubscriptionList = mapSubscriptionList;
exports.mapBatchCreate = mapBatchCreate;
exports.mapBatchDelete = mapBatchDelete;
exports.mapActivity = mapActivity;
exports.mapUsage = mapUsage;
exports.mapIngressEndpoint = mapIngressEndpoint;
exports.mapGeneratedSecret = mapGeneratedSecret;
exports.mapAttemptList = mapAttemptList;
exports.mapDeliveryList = mapDeliveryList;
exports.mapMessageAttemptList = mapMessageAttemptList;
exports.mapDeliveryDetails = mapDeliveryDetails;
exports.mapBatchLookup = mapBatchLookup;
exports.mapBatchResend = mapBatchResend;
exports.mapRecovery = mapRecovery;
/**
 * Types, enums and mappers for `scalekit.actions.triggers` management calls.
 *
 * The public types here are the SDK's own: camelCase, `readonly`, `Date` for
 * instants, `number` for counts and durations (with the unit in the field
 * name), and open string unions for enums. Generated protobuf messages never
 * reach callers; the mappers at the bottom of this file are the only code
 * that reads them.
 */
const wkt_1 = require("@bufbuild/protobuf/wkt");
const base_exception_1 = require("../errors/base-exception");
const pb = __importStar(require("../pkg/grpc/scalekit/v1/triggers/triggers_pb"));
// ---------------------------------------------------------------------------
// Enums. Values are the API's value names. Every enum is open: a value this
// SDK version does not know arrives as its name, or as its number written as
// a decimal string when the SDK does not know the number either. An unset
// value is `undefined`, never a member.
// ---------------------------------------------------------------------------
/** The state of a trigger subscription. */
exports.TriggerSubscriptionStatus = {
    /** Running normally. */
    ACTIVE: 'ACTIVE',
    /** Running, but slower than requested because the polling budget is shared. */
    THROTTLED: 'THROTTLED',
    /** Not running. */
    PAUSED: 'PAUSED',
    /** Not running because the connected account's credential stopped working. */
    PAUSED_CREDENTIAL: 'PAUSED_CREDENTIAL',
};
/** Why the most recent run of a polled subscription failed. */
exports.TriggerPollErrorCode = {
    RATE_LIMITED: 'RATE_LIMITED',
    CREDENTIAL_REVOKED: 'CREDENTIAL_REVOKED',
    INVALID_CONFIGURATION: 'INVALID_CONFIGURATION',
    PROVIDER_ERROR: 'PROVIDER_ERROR',
    DELIVERY_FAILED: 'DELIVERY_FAILED',
    TIMED_OUT: 'TIMED_OUT',
    POLL_FAILED: 'POLL_FAILED',
};
/** Whether a connected account can receive triggers. */
exports.AccountHealthState = {
    READY: 'READY',
    AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
    WRONG_APP: 'WRONG_APP',
    DISCONNECTED: 'DISCONNECTED',
    NEEDS_REAUTHENTICATION: 'NEEDS_REAUTHENTICATION',
};
/** The one action that makes an unhealthy connected account healthy again. */
exports.AccountHealthAction = {
    RECONNECT: 'RECONNECT',
    COMPLETE_SETUP: 'COMPLETE_SETUP',
};
/** Whether a trigger can run on Scalekit's shared provider app. */
exports.TriggerPlatformCredentials = {
    SUPPORTED: 'SUPPORTED',
    UNSUPPORTED: 'UNSUPPORTED',
};
/** Why a trigger is unavailable on a connection, when the reason has a code. */
exports.TriggerRefusalCode = {
    /** The trigger needs your own provider app; the connection uses the shared one. */
    SHARED_APP: 'SHARED_APP',
    /** A polled trigger that cannot run on a connection-scoped subscription. */
    POLL_CONNECTION_SCOPE: 'POLL_CONNECTION_SCOPE',
};
/** What happened to one account in `batchCreateSubscriptions`. */
exports.TriggerSubscribeOutcome = {
    CREATED: 'CREATED',
    /** An earlier call already created this subscription. Safe to treat as success. */
    ALREADY_SUBSCRIBED: 'ALREADY_SUBSCRIBED',
    /** The account cannot take this subscription; `reason` says what to change. */
    REFUSED: 'REFUSED',
    NOT_FOUND: 'NOT_FOUND',
    /** A transient failure; retrying the batch is safe. */
    FAILED: 'FAILED',
};
/** What happened to one subscription in `batchDeleteSubscriptions`. */
exports.TriggerSubscriptionDeleteOutcome = {
    DELETED: 'DELETED',
    /** Already gone (for example deleted by an earlier attempt). Treat like `DELETED`. */
    NOT_FOUND: 'NOT_FOUND',
    FAILED: 'FAILED',
    /** The call ran out of time before reaching it; send it again. */
    NOT_ATTEMPTED: 'NOT_ATTEMPTED',
};
/** The size of each entry in a usage response. */
exports.TriggerUsageBucket = {
    /** One entry per UTC calendar day, in `days`. */
    DAY: 'DAY',
    /** One entry per UTC clock hour, in `hours`. */
    HOUR: 'HOUR',
};
/** The delivery state of one trigger event to one delivery endpoint. */
exports.TriggerDeliveryStatus = {
    DELIVERED: 'DELIVERED',
    PENDING: 'PENDING',
    FAILED: 'FAILED',
    RETRYING: 'RETRYING',
};
/** What happened to one ID in `batchLookupDeliveries`. */
exports.TriggerDeliveryLookupOutcome = {
    FOUND: 'FOUND',
    NOT_FOUND: 'NOT_FOUND',
    /** Refused for volume; the batch stopped here. Send it again shortly. */
    RATE_LIMITED: 'RATE_LIMITED',
    FAILED: 'FAILED',
    /** Not looked up because the batch stopped earlier. Send it again. */
    NOT_ATTEMPTED: 'NOT_ATTEMPTED',
};
/** What happened to one target in `batchResendDeliveries`. */
exports.TriggerDeliveryResendOutcome = {
    /** A new attempt was accepted for delivery (not yet delivered). */
    QUEUED: 'QUEUED',
    NOT_FOUND: 'NOT_FOUND',
    /** Refused for volume; the batch stopped here. Resend this target later. */
    RATE_LIMITED: 'RATE_LIMITED',
    /** Not queued, or not confirmed: a timed-out target may still have been queued. */
    FAILED: 'FAILED',
    /** Not sent because the batch stopped earlier. Resend this target. */
    NOT_ATTEMPTED: 'NOT_ATTEMPTED',
};
/** What started a delivery attempt. */
exports.TriggerDeliveryAttemptTriggerType = {
    /** The first attempt or an automatic retry. */
    SCHEDULED: 'SCHEDULED',
    /** A resend you asked for. */
    MANUAL: 'MANUAL',
};
/** The outcome of one delivery attempt. */
exports.TriggerDeliveryAttemptStatus = {
    SUCCESS: 'SUCCESS',
    PENDING: 'PENDING',
    FAIL: 'FAIL',
    SENDING: 'SENDING',
    CANCELED: 'CANCELED',
};
// ---------------------------------------------------------------------------
// Internal: input checks. Only what is needed to encode the request; every
// rule about the values themselves is the server's.
// ---------------------------------------------------------------------------
const INT32_MIN = -2147483648;
const INT32_MAX = 2147483647;
const UINT32_MAX = 4294967295;
/** @internal A required ID or name: any non-empty string. */
function requireId(name, value) {
    if (typeof value !== 'string' || value === '') {
        throw new base_exception_1.ScalekitValidationError(`${name} is required`);
    }
    return value;
}
/** @internal A required parameters object. */
function requireParams(name, value) {
    if (value === null || typeof value !== 'object') {
        throw new base_exception_1.ScalekitValidationError(`${name} is required`);
    }
}
/** @internal An optional parameters object. */
function optionalParams(name, value) {
    if (value !== undefined && (value === null || typeof value !== 'object')) {
        throw new base_exception_1.ScalekitValidationError(`${name} must be an object`);
    }
}
/** @internal An array of strings, as an encoding check. */
function stringArray(name, value) {
    if (!Array.isArray(value) ||
        !value.every((item) => typeof item === 'string')) {
        throw new base_exception_1.ScalekitValidationError(`${name} must be an array of strings`);
    }
    return [...value];
}
/** @internal A map of strings (such as `config`), as an encoding check. */
function stringRecord(name, value) {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        throw new base_exception_1.ScalekitValidationError(`${name} must be an object of strings`);
    }
    const out = {};
    for (const [key, item] of Object.entries(value)) {
        if (typeof item !== 'string') {
            throw new base_exception_1.ScalekitValidationError(`${name}.${key} must be a string`);
        }
        out[key] = item;
    }
    return out;
}
/** @internal A uint32 page size. */
function pageSize(name, value) {
    if (value === undefined) {
        return 0;
    }
    if (typeof value !== 'number' ||
        !Number.isInteger(value) ||
        value < 0 ||
        value > UINT32_MAX) {
        throw new base_exception_1.ScalekitValidationError(`${name} must be a non-negative whole number`);
    }
    return value;
}
/** @internal An int32 interval in whole seconds. */
function intervalSeconds(name, value) {
    if (value === undefined) {
        return 0;
    }
    if (typeof value !== 'number' ||
        !Number.isInteger(value) ||
        value < INT32_MIN ||
        value > INT32_MAX) {
        throw new base_exception_1.ScalekitValidationError(`${name} must be a whole number of seconds`);
    }
    return value;
}
/** @internal An int64 counter sent as `bigint`. */
function safeIntegerToBigInt(name, value) {
    if (typeof value !== 'number' || !Number.isSafeInteger(value)) {
        throw new base_exception_1.ScalekitValidationError(`${name} must be a safe integer`);
    }
    return BigInt(value);
}
// An ISO 8601 / RFC 3339 date-time that names its offset (Z or ±hh:mm), so
// it means one instant wherever it is parsed. Seconds and fractions optional.
const DATE_TIME_WITH_OFFSET = /^(\d{4})-(\d{2})-(\d{2})[Tt]([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(?:\.\d+)?)?(?:[Zz]|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;
const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
/** Whether year, month and day name a day that exists. */
function isRealDay(year, month, day) {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    if (y < 1 || m < 1 || m > 12 || d < 1) {
        return false;
    }
    const probe = new Date(0);
    probe.setUTCFullYear(y, m - 1, d);
    return probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d;
}
/** A date-time string with an offset as a `Date`, or `undefined` when it is not one. */
function parseDateTime(value) {
    const m = DATE_TIME_WITH_OFFSET.exec(value);
    if (m === null || !isRealDay(m[1], m[2], m[3])) {
        return undefined;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
/**
 * @internal A `Date`, or a date-time string with `Z` or an offset, as a
 * protobuf `Timestamp`. A string without an offset is refused: it would be
 * read in the local time zone.
 */
function toTimestamp(name, value) {
    let date;
    if (value instanceof Date) {
        date = Number.isNaN(value.getTime()) ? undefined : value;
        if (date === undefined) {
            throw new base_exception_1.ScalekitValidationError(`${name} is not a valid date`);
        }
    }
    else if (typeof value === 'string') {
        date = parseDateTime(value);
        if (date === undefined) {
            throw new base_exception_1.ScalekitValidationError(`${name} must be an ISO 8601 date-time with Z or an offset, such as 2026-10-28T10:00:00Z`);
        }
    }
    else {
        throw new base_exception_1.ScalekitValidationError(`${name} must be a Date or an ISO 8601 date-time string`);
    }
    return (0, wkt_1.timestampFromDate)(date);
}
/** @internal A UTC calendar date, `'YYYY-MM-DD'`, that exists. */
function calendarDate(name, value) {
    const m = typeof value === 'string' ? CALENDAR_DATE.exec(value) : null;
    if (m === null || !isRealDay(m[1], m[2], m[3])) {
        throw new base_exception_1.ScalekitValidationError(`${name} must be a calendar date as YYYY-MM-DD, such as 2026-10-28`);
    }
    return value;
}
/**
 * @internal An SDK enum value (or a generated value name, or a numeric
 * string for a value newer than this SDK) as its wire number. An unknown
 * name cannot be encoded and is refused.
 */
function toProtoEnum(name, generated, value) {
    if (typeof value === 'string') {
        if (/^-?\d+$/.test(value)) {
            const n = Number(value);
            if (n >= INT32_MIN && n <= INT32_MAX) {
                return n;
            }
        }
        else if (Object.prototype.hasOwnProperty.call(generated, value)) {
            const n = generated[value];
            if (typeof n === 'number') {
                return n;
            }
        }
    }
    const known = Object.entries(generated)
        .filter(([, v]) => typeof v === 'number' && v !== 0)
        .map(([k]) => k);
    throw new base_exception_1.ScalekitValidationError(`${name} must be one of ${known.join(', ')}, or a value number as a string`);
}
/** @internal Per-call options for `connectExec`, from the caller's `RequestOptions`. */
function execOptions(options, retryOnUnavailable) {
    const exec = {};
    if (options !== undefined) {
        if (options === null || typeof options !== 'object') {
            throw new base_exception_1.ScalekitValidationError('options must be an object');
        }
        const { signal, timeoutMs } = options;
        if (timeoutMs !== undefined) {
            if (typeof timeoutMs !== 'number' ||
                !Number.isFinite(timeoutMs) ||
                timeoutMs <= 0) {
                throw new base_exception_1.ScalekitValidationError('options.timeoutMs must be a positive finite number of milliseconds');
            }
            exec.timeoutMs = timeoutMs;
        }
        if (signal !== undefined) {
            exec.signal = signal;
        }
    }
    if (!retryOnUnavailable) {
        exec.retryOnUnavailable = false;
    }
    return exec;
}
// ---------------------------------------------------------------------------
// Internal: mappers from generated messages
// ---------------------------------------------------------------------------
/** 0 (unset) → `undefined`; a known number → its name; anything else → `String(n)`. */
function enumName(generated, value) {
    if (value === 0) {
        return undefined;
    }
    const name = generated[value];
    return typeof name === 'string' ? name : String(value);
}
function deliveryScope(value) {
    switch (value) {
        case pb.TriggerDeliveryScope.TRIGGER_DELIVERY_SCOPE_UNSPECIFIED:
            return undefined;
        case pb.TriggerDeliveryScope.ACCOUNT:
            return 'account';
        case pb.TriggerDeliveryScope.CONNECTION:
            return 'connection';
        default:
            return String(value);
    }
}
function detectionMode(value) {
    switch (value) {
        case pb.TriggerMode.TRIGGER_MODE_UNSPECIFIED:
            return undefined;
        case pb.TriggerMode.WEBHOOK:
            return 'webhook';
        case pb.TriggerMode.POLL:
            return 'poll';
        default:
            return String(value);
    }
}
function date(ts) {
    return ts === undefined ? undefined : (0, wkt_1.timestampDate)(ts);
}
function nonZero(value) {
    return value === 0 ? undefined : value;
}
function token(value) {
    return value === '' ? undefined : value;
}
function safeNumber(field, value) {
    const n = Number(value);
    if (!Number.isSafeInteger(n)) {
        throw new base_exception_1.ScalekitException(`${field} (${value.toString()}) is too large to represent exactly as a number`);
    }
    return n;
}
/** A server instant string: `undefined` when empty or unreadable, never a throw. */
function instant(value) {
    return value === '' ? undefined : parseDateTime(value);
}
function nonEmpty(value) {
    return value === '' ? undefined : value;
}
function copyRecord(source) {
    return Object.fromEntries(Object.entries(source));
}
/** @internal */
function mapCatalog(res) {
    return {
        triggers: res.triggers.map(mapAvailableTrigger),
        connectionUsesSharedApp: res.connectionUsesSharedApp,
    };
}
function mapAvailableTrigger(t) {
    return {
        name: t.name,
        displayName: t.displayName,
        description: t.description,
        provider: t.provider,
        mode: detectionMode(t.mode),
        requiredScopes: t.requiredScopes.map((s) => ({
            scope: s.scope,
            grant: s.grant,
        })),
        minIntervalSeconds: nonZero(t.minIntervalSeconds),
        defaultIntervalSeconds: nonZero(t.defaultIntervalSeconds),
        configFields: t.configFields.map((f) => ({
            key: f.key,
            displayName: f.displayName,
            helpText: f.helpText,
            placeholder: f.placeholder,
            required: f.required,
        })),
        available: t.available,
        reason: t.reason,
        remedy: t.remedy,
        deliveryScope: deliveryScope(t.deliveryScope),
        platformCredentials: enumName(pb.TriggerPlatformCredentials, t.platformCredentials),
        refusalCode: enumName(pb.TriggerRefusalCode, t.refusalCode),
        requiresSigningSecret: t.requiresSigningSecret,
        registerHint: t.registerHint,
        secretHint: t.secretHint,
        providesBearerSecret: t.providesBearerSecret,
    };
}
function mapAccountHealth(h) {
    return {
        state: enumName(pb.AccountHealthState, h.state),
        reason: h.reason,
        remedy: h.remedy,
        action: enumName(pb.AccountHealthAction, h.action),
        blocksToolCalls: h.blocksToolCalls,
    };
}
/** @internal */
function mapEligibleAccounts(res) {
    return {
        accounts: res.accounts.map((a) => ({
            id: a.id,
            identifier: a.identifier,
            eligible: a.eligible,
            reason: a.reason,
            remedy: a.remedy,
            health: a.health === undefined ? undefined : mapAccountHealth(a.health),
        })),
        nextPageToken: token(res.nextPageToken),
        prevPageToken: token(res.prevPageToken),
        totalSize: res.totalSize,
    };
}
function mapPollState(p) {
    return {
        lastRunAt: date(p.lastRunAt),
        lastError: p.lastError,
        consecutiveFailures: p.consecutiveFailures,
        backoffUntil: date(p.backoffUntil),
        watermarkUpdatedAt: date(p.watermarkUpdatedAt),
        lastErrorCode: enumName(pb.TriggerPollErrorCode, p.lastErrorCode),
    };
}
/** @internal */
function mapSubscription(s) {
    return {
        id: s.id,
        connectedAccountId: s.connectedAccountId,
        connectionId: s.connectionId,
        provider: s.provider,
        triggerName: s.triggerName,
        status: enumName(pb.TriggerSubscriptionStatus, s.status),
        requestedIntervalSeconds: nonZero(s.requestedIntervalSeconds),
        effectiveIntervalSeconds: nonZero(s.effectiveIntervalSeconds),
        config: copyRecord(s.config),
        deliveryScope: deliveryScope(s.deliveryScope),
        connectedAccountIdentifier: s.connectedAccountIdentifier,
        createdAt: date(s.createdAt),
        pollState: s.pollState === undefined ? undefined : mapPollState(s.pollState),
        accountHealth: s.accountHealth === undefined
            ? undefined
            : enumName(pb.AccountHealthState, s.accountHealth),
    };
}
/** @internal */
function mapSubscriptionList(res) {
    return {
        subscriptions: res.subscriptions.map(mapSubscription),
        nextPageToken: token(res.nextPageToken),
        prevPageToken: token(res.prevPageToken),
        totalSize: res.totalSize,
        statusCounts: copyRecord(res.statusCounts),
    };
}
/** @internal */
function mapBatchCreate(res) {
    return {
        results: res.results.map((r) => ({
            connectedAccountId: r.connectedAccountId,
            outcome: enumName(pb.BatchSubscribeOutcome, r.outcome),
            subscription: r.subscription === undefined
                ? undefined
                : mapSubscription(r.subscription),
            reason: r.reason,
        })),
        createdCount: res.createdCount,
    };
}
/** @internal */
function mapBatchDelete(res) {
    return {
        results: res.results.map((r) => ({
            subscriptionId: r.subscriptionId,
            connectedAccountId: r.connectedAccountId,
            outcome: enumName(pb.BatchDeleteOutcome, r.outcome),
            reason: r.reason,
        })),
        deletedCount: res.deletedCount,
    };
}
/** @internal */
function mapActivity(res) {
    return {
        counts: Object.fromEntries(Object.entries(res.counts).map(([key, value]) => [
            key,
            safeNumber(`counts.${key}`, value),
        ])),
        windowSeconds: res.windowHours * 3600,
        signatureBanner: res.signatureBanner,
        degraded: res.degraded,
        explainsIndividualEvents: res.explainsIndividualEvents,
        deliveryDetailsPath: res.deliveryDetailsPath,
    };
}
/** @internal */
function mapUsage(res) {
    return {
        from: nonEmpty(res.from),
        to: nonEmpty(res.to),
        today: nonEmpty(res.today),
        period: nonEmpty(res.period),
        bucket: enumName(pb.TriggerUsageBucket, res.bucket),
        days: res.days.map((d) => ({
            date: nonEmpty(d.date),
            units: safeNumber('days[].units', d.units),
        })),
        hours: res.hours.map((h) => ({
            start: instant(h.start),
            units: safeNumber('hours[].units', h.units),
        })),
        currentHour: instant(res.currentHour),
    };
}
/** @internal */
function mapIngressEndpoint(e) {
    const endpoint = {
        id: e.id,
        connectionId: e.connectionId,
        url: e.url,
        signingSecretConfigured: e.signingSecretConfigured,
        maskedSigningSecret: e.maskedSigningSecret,
        rotationInProgress: e.rotationInProgress,
        previousSigningSecretExpiresAt: date(e.previousSigningSecretExpiresAt),
        signingSecretRotationId: safeNumber('signingSecretRotationId', e.signingSecretRotationId),
    };
    // The URL carries the endpoint's token: logging shows it redacted. The
    // hook is not enumerable, so spreading or serialising is unaffected.
    Object.defineProperty(endpoint, INSPECT_CUSTOM, {
        value: redactedEndpointView,
        enumerable: false,
    });
    return endpoint;
}
/** @internal */
function mapGeneratedSecret(res) {
    const result = {
        endpoint: res.endpoint === undefined ? undefined : mapIngressEndpoint(res.endpoint),
        signingSecret: res.signingSecret,
        urlWithSecret: res.urlWithSecret,
    };
    // Logging the result (console.log, util.inspect, an unhandled rejection
    // that carries it) shows the secret redacted. The hook is not enumerable,
    // so spreading or serialising the result is unaffected.
    Object.defineProperty(result, INSPECT_CUSTOM, {
        value: redactedSecretView,
        enumerable: false,
    });
    return result;
}
const INSPECT_CUSTOM = Symbol.for('nodejs.util.inspect.custom');
const REDACTED = '[redacted]';
function redactedEndpointView() {
    return Object.assign(Object.assign({}, this), { url: REDACTED });
}
function redactedSecretView() {
    return {
        endpoint: this.endpoint === undefined
            ? undefined
            : redactedEndpointView.call(this.endpoint),
        signingSecret: REDACTED,
        urlWithSecret: REDACTED,
    };
}
function mapAttempt(a) {
    return {
        id: a.id,
        endpointId: a.endpointId,
        msgId: a.msgId,
        status: enumName(pb.TriggerDeliveryAttemptStatus, a.status),
        responseStatusCode: a.responseStatusCode,
        response: a.response,
        timestamp: date(a.timestamp),
        responseDurationMs: a.responseDurationMs,
        triggerType: enumName(pb.TriggerDeliveryAttemptTriggerType, a.triggerType),
        responseTruncated: a.responseTruncated,
        endpointUrl: a.endpointUrl,
    };
}
/** @internal */
function mapAttemptList(res) {
    return { attempts: res.attempts.map(mapAttempt) };
}
/** @internal */
function mapDeliveryList(res) {
    return {
        deliveries: res.deliveries.map((d) => ({
            msgId: d.msgId,
            eventId: d.eventId,
            messageTimestamp: date(d.messageTimestamp),
            status: enumName(pb.TriggerDeliveryStatus, d.status),
            nextAttemptAt: date(d.nextAttemptAt),
            subscriptionId: d.subscriptionId,
            triggerName: d.triggerName,
            triggerMode: detectionMode(d.triggerMode),
            connectionId: d.connectionId,
            connectionProvider: d.connectionProvider,
            connectionKeyId: d.connectionKeyId,
            endpointId: d.endpointId,
        })),
        nextPageToken: token(res.nextPageToken),
    };
}
/** @internal */
function mapMessageAttemptList(res) {
    return {
        attempts: res.attempts.map(mapAttempt),
        truncated: res.truncated,
    };
}
/** @internal */
function mapDeliveryDetails(res) {
    return {
        msgId: res.msgId,
        eventId: res.eventId,
        messageTimestamp: date(res.messageTimestamp),
        subscriptionId: res.subscriptionId,
        triggerName: res.triggerName,
        triggerMode: detectionMode(res.triggerMode),
        connectionId: res.connectionId,
        connectionProvider: res.connectionProvider,
        connectionKeyId: res.connectionKeyId,
        attempts: res.attempts.map(mapAttempt),
        truncated: res.truncated,
    };
}
/** @internal */
function mapBatchLookup(res) {
    return {
        results: res.results.map((r) => ({
            id: r.id,
            outcome: enumName(pb.BatchLookupOutcome, r.outcome),
            reason: r.reason,
            delivery: r.delivery === undefined ? undefined : mapDeliveryDetails(r.delivery),
        })),
        foundCount: res.foundCount,
    };
}
/** @internal */
function mapBatchResend(res) {
    return {
        results: res.results.map((r) => ({
            msgId: r.msgId,
            endpointId: r.endpointId,
            outcome: enumName(pb.BatchResendOutcome, r.outcome),
            reason: r.reason,
        })),
        queuedCount: res.queuedCount,
    };
}
/** @internal */
function mapRecovery(res) {
    return { taskId: res.taskId, status: res.status };
}
//# sourceMappingURL=triggers.js.map