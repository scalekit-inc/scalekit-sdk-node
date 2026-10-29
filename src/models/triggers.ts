/**
 * Types, enums and mappers for `scalekit.actions.triggers` management calls.
 *
 * The public types here are the SDK's own: camelCase, `readonly`, `Date` for
 * instants, `number` for counts and durations (with the unit in the field
 * name), and open string unions for enums. Generated protobuf messages never
 * reach callers; the mappers at the bottom of this file are the only code
 * that reads them.
 */
import { timestampDate, timestampFromDate } from '@bufbuild/protobuf/wkt';
import type { Timestamp } from '@bufbuild/protobuf/wkt';
import {
  ScalekitException,
  ScalekitValidationError,
} from '../errors/base-exception';
import type { ConnectExecOptions } from '../core';
import type { DeliveryScope, DetectionMode } from '../triggers';
import type { RequestOptions } from '../types/request-options';
import * as pb from '../pkg/grpc/scalekit/v1/triggers/triggers_pb';

// ---------------------------------------------------------------------------
// Enums. Values are the API's value names. Every enum is open: a value this
// SDK version does not know arrives as its name, or as its number written as
// a decimal string when the SDK does not know the number either. An unset
// value is `undefined`, never a member.
// ---------------------------------------------------------------------------

/** The state of a trigger subscription. */
export const TriggerSubscriptionStatus = {
  /** Running normally. */
  ACTIVE: 'ACTIVE',
  /** Running, but slower than requested because the polling budget is shared. */
  THROTTLED: 'THROTTLED',
  /** Not running. */
  PAUSED: 'PAUSED',
  /** Not running because the connected account's credential stopped working. */
  PAUSED_CREDENTIAL: 'PAUSED_CREDENTIAL',
} as const;
/** See {@link (TriggerSubscriptionStatus:variable)}. Open: unknown values are plain strings. */
export type TriggerSubscriptionStatus =
  | (typeof TriggerSubscriptionStatus)[keyof typeof TriggerSubscriptionStatus]
  | (string & {});

/** Why the most recent run of a polled subscription failed. */
export const TriggerPollErrorCode = {
  RATE_LIMITED: 'RATE_LIMITED',
  CREDENTIAL_REVOKED: 'CREDENTIAL_REVOKED',
  INVALID_CONFIGURATION: 'INVALID_CONFIGURATION',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  DELIVERY_FAILED: 'DELIVERY_FAILED',
  TIMED_OUT: 'TIMED_OUT',
  POLL_FAILED: 'POLL_FAILED',
} as const;
/** See {@link (TriggerPollErrorCode:variable)}. Open: unknown values are plain strings. */
export type TriggerPollErrorCode =
  | (typeof TriggerPollErrorCode)[keyof typeof TriggerPollErrorCode]
  | (string & {});

/** Whether a connected account can receive triggers. */
export const AccountHealthState = {
  READY: 'READY',
  AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
  WRONG_APP: 'WRONG_APP',
  DISCONNECTED: 'DISCONNECTED',
  NEEDS_REAUTHENTICATION: 'NEEDS_REAUTHENTICATION',
} as const;
/** See {@link (AccountHealthState:variable)}. Open: unknown values are plain strings. */
export type AccountHealthState =
  | (typeof AccountHealthState)[keyof typeof AccountHealthState]
  | (string & {});

/** The one action that makes an unhealthy connected account healthy again. */
export const AccountHealthAction = {
  RECONNECT: 'RECONNECT',
  COMPLETE_SETUP: 'COMPLETE_SETUP',
} as const;
/** See {@link (AccountHealthAction:variable)}. Open: unknown values are plain strings. */
export type AccountHealthAction =
  | (typeof AccountHealthAction)[keyof typeof AccountHealthAction]
  | (string & {});

/** Whether a trigger can run on Scalekit's shared provider app. */
export const TriggerPlatformCredentials = {
  SUPPORTED: 'SUPPORTED',
  UNSUPPORTED: 'UNSUPPORTED',
} as const;
/** See {@link (TriggerPlatformCredentials:variable)}. Open: unknown values are plain strings. */
export type TriggerPlatformCredentials =
  | (typeof TriggerPlatformCredentials)[keyof typeof TriggerPlatformCredentials]
  | (string & {});

/** Why a trigger is unavailable on a connection, when the reason has a code. */
export const TriggerRefusalCode = {
  /** The trigger needs your own provider app; the connection uses the shared one. */
  SHARED_APP: 'SHARED_APP',
  /** A polled trigger that cannot run on a connection-scoped subscription. */
  POLL_CONNECTION_SCOPE: 'POLL_CONNECTION_SCOPE',
} as const;
/** See {@link (TriggerRefusalCode:variable)}. Open: unknown values are plain strings. */
export type TriggerRefusalCode =
  | (typeof TriggerRefusalCode)[keyof typeof TriggerRefusalCode]
  | (string & {});

/** What happened to one account in `batchCreateSubscriptions`. */
export const TriggerSubscribeOutcome = {
  CREATED: 'CREATED',
  /** An earlier call already created this subscription. Safe to treat as success. */
  ALREADY_SUBSCRIBED: 'ALREADY_SUBSCRIBED',
  /** The account cannot take this subscription; `reason` says what to change. */
  REFUSED: 'REFUSED',
  NOT_FOUND: 'NOT_FOUND',
  /** A transient failure; retrying the batch is safe. */
  FAILED: 'FAILED',
} as const;
/** See {@link (TriggerSubscribeOutcome:variable)}. Open: unknown values are plain strings. */
export type TriggerSubscribeOutcome =
  | (typeof TriggerSubscribeOutcome)[keyof typeof TriggerSubscribeOutcome]
  | (string & {});

/** What happened to one subscription in `batchDeleteSubscriptions`. */
export const TriggerSubscriptionDeleteOutcome = {
  DELETED: 'DELETED',
  /** Already gone (for example deleted by an earlier attempt). Treat like `DELETED`. */
  NOT_FOUND: 'NOT_FOUND',
  FAILED: 'FAILED',
  /** The call ran out of time before reaching it; send it again. */
  NOT_ATTEMPTED: 'NOT_ATTEMPTED',
} as const;
/** See {@link (TriggerSubscriptionDeleteOutcome:variable)}. Open: unknown values are plain strings. */
export type TriggerSubscriptionDeleteOutcome =
  | (typeof TriggerSubscriptionDeleteOutcome)[keyof typeof TriggerSubscriptionDeleteOutcome]
  | (string & {});

/** The size of each entry in a usage response. */
export const TriggerUsageBucket = {
  /** One entry per UTC calendar day, in `days`. */
  DAY: 'DAY',
  /** One entry per UTC clock hour, in `hours`. */
  HOUR: 'HOUR',
} as const;
/** See {@link (TriggerUsageBucket:variable)}. Open: unknown values are plain strings. */
export type TriggerUsageBucket =
  | (typeof TriggerUsageBucket)[keyof typeof TriggerUsageBucket]
  | (string & {});

/** The delivery state of one trigger event to one delivery endpoint. */
export const TriggerDeliveryStatus = {
  DELIVERED: 'DELIVERED',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  RETRYING: 'RETRYING',
} as const;
/** See {@link (TriggerDeliveryStatus:variable)}. Open: unknown values are plain strings. */
export type TriggerDeliveryStatus =
  | (typeof TriggerDeliveryStatus)[keyof typeof TriggerDeliveryStatus]
  | (string & {});

/** What happened to one ID in `batchLookupDeliveries`. */
export const TriggerDeliveryLookupOutcome = {
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND',
  /** Refused for volume; the batch stopped here. Send it again shortly. */
  RATE_LIMITED: 'RATE_LIMITED',
  FAILED: 'FAILED',
  /** Not looked up because the batch stopped earlier. Send it again. */
  NOT_ATTEMPTED: 'NOT_ATTEMPTED',
} as const;
/** See {@link (TriggerDeliveryLookupOutcome:variable)}. Open: unknown values are plain strings. */
export type TriggerDeliveryLookupOutcome =
  | (typeof TriggerDeliveryLookupOutcome)[keyof typeof TriggerDeliveryLookupOutcome]
  | (string & {});

/** What happened to one target in `batchResendDeliveries`. */
export const TriggerDeliveryResendOutcome = {
  /** A new attempt was accepted for delivery (not yet delivered). */
  QUEUED: 'QUEUED',
  NOT_FOUND: 'NOT_FOUND',
  /** Refused for volume; the batch stopped here. Resend this target later. */
  RATE_LIMITED: 'RATE_LIMITED',
  /** Not queued, or not confirmed: a timed-out target may still have been queued. */
  FAILED: 'FAILED',
  /** Not sent because the batch stopped earlier. Resend this target. */
  NOT_ATTEMPTED: 'NOT_ATTEMPTED',
} as const;
/** See {@link (TriggerDeliveryResendOutcome:variable)}. Open: unknown values are plain strings. */
export type TriggerDeliveryResendOutcome =
  | (typeof TriggerDeliveryResendOutcome)[keyof typeof TriggerDeliveryResendOutcome]
  | (string & {});

/** What started a delivery attempt. */
export const TriggerDeliveryAttemptTriggerType = {
  /** The first attempt or an automatic retry. */
  SCHEDULED: 'SCHEDULED',
  /** A resend you asked for. */
  MANUAL: 'MANUAL',
} as const;
/** See {@link (TriggerDeliveryAttemptTriggerType:variable)}. Open: unknown values are plain strings. */
export type TriggerDeliveryAttemptTriggerType =
  | (typeof TriggerDeliveryAttemptTriggerType)[keyof typeof TriggerDeliveryAttemptTriggerType]
  | (string & {});

/** The outcome of one delivery attempt. */
export const TriggerDeliveryAttemptStatus = {
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  FAIL: 'FAIL',
  SENDING: 'SENDING',
  CANCELED: 'CANCELED',
} as const;
/** See {@link (TriggerDeliveryAttemptStatus:variable)}. Open: unknown values are plain strings. */
export type TriggerDeliveryAttemptStatus =
  | (typeof TriggerDeliveryAttemptStatus)[keyof typeof TriggerDeliveryAttemptStatus]
  | (string & {});

/** A preset usage period ending now: `'24h'` (hourly), `'7d'` or `'30d'` (daily). Sent exactly as given. */
export type TriggerUsagePeriod = '24h' | '7d' | '30d' | (string & {});

/** The state of a delivery recovery when the call returned. */
export type TriggerDeliveryRecoveryStatus =
  | 'running'
  | 'finished'
  | (string & {});

// ---------------------------------------------------------------------------
// Request parameters
// ---------------------------------------------------------------------------

/** Optional parameters for `triggers.listEligibleAccounts`. */
export interface TriggerEligibleAccountListParams {
  /** Only accounts whose identifier contains this text, case-insensitively. */
  query?: string;
  /** Accounts per page. The server defaults to 10 and caps larger values at 100. */
  pageSize?: number;
  /** `nextPageToken` or `prevPageToken` from a previous page. */
  pageToken?: string;
}

/** Optional parameters for `triggers.listSubscriptions`. */
export interface TriggerSubscriptionListParams {
  /** Only this trigger's subscriptions. */
  triggerName?: string;
  /**
   * Only subscriptions in these statuses (the server accepts at most 4).
   * Does not affect `statusCounts`.
   */
  statuses?: readonly TriggerSubscriptionStatus[];
  /** Subscriptions per page. The server defaults to 10 and caps larger values at 100. */
  pageSize?: number;
  /** `nextPageToken` or `prevPageToken` from a previous page. */
  pageToken?: string;
}

/** Optional parameters for `triggers.createSubscription`. */
export interface TriggerSubscriptionCreateParams {
  /**
   * The connected account to subscribe (`ca_...`). Required for an
   * account-scoped trigger; omit it for a connection-scoped one.
   */
  connectedAccountId?: string;
  /**
   * Polling interval for a polled trigger, in whole seconds. Omit it for the
   * trigger's default. An interval below the trigger's minimum is refused,
   * not rounded up; webhook triggers take none.
   */
  intervalSeconds?: number;
  /** Filter values, keyed exactly as the trigger's `configFields` declare them. */
  config?: Readonly<Record<string, string>>;
}

/** Optional parameters for `triggers.batchCreateSubscriptions`. */
export interface TriggerSubscriptionBatchCreateParams {
  /**
   * The connected accounts to subscribe (at most 100, no duplicates). Leave
   * it empty or omit it for a connection-scoped trigger.
   */
  connectedAccountIds?: readonly string[];
  /** Polling interval for a polled trigger, in whole seconds. Omit it for the default. */
  intervalSeconds?: number;
  /** Filter values, keyed exactly as the trigger's `configFields` declare them. */
  config?: Readonly<Record<string, string>>;
}

/**
 * Which subscriptions `triggers.batchDeleteSubscriptions` deletes. Use
 * exactly one selector: `subscriptionIds`, or `triggerName` together with
 * `connectedAccountIds`. The server refuses anything else.
 */
export interface TriggerSubscriptionBatchDeleteParams {
  /** Subscriptions to delete (`trgs_...`, at most 100). */
  subscriptionIds?: readonly string[];
  /** With `connectedAccountIds`: delete every subscription those accounts hold to this trigger. */
  triggerName?: string;
  /** With `triggerName`: the accounts whose subscriptions to delete (at most 100). */
  connectedAccountIds?: readonly string[];
}

/**
 * The range `triggers.getUsage` reads: a preset `period` ending now, or
 * `from` and `to` UTC calendar dates (`'YYYY-MM-DD'`, both inclusive). A
 * `from` or `to` that is not a real date in that form is refused before the
 * request.
 */
export type TriggerUsageGetParams =
  | { period: TriggerUsagePeriod; from?: never; to?: never }
  | { from: string; to: string; period?: never };

/** Parameters for `triggers.setSigningSecret`. */
export interface TriggerSigningSecretSetParams {
  /**
   * The secret the provider signs its webhook events with, copied from the
   * provider's app configuration. Leading and trailing whitespace is removed
   * by the server.
   */
  signingSecret: string;
}

/** Optional parameters for `triggers.confirmSigningSecretRotation`. */
export interface TriggerSigningSecretRotationConfirmParams {
  /**
   * `signingSecretRotationId` from the latest endpoint you read. Required
   * while a rotation is in progress; ignored when none is.
   */
  signingSecretRotationId?: number;
}

/** Optional parameters for `triggers.listDeliveryAttemptsByEndpoint`. */
export interface TriggerDeliveryAttemptListParams {
  /** Attempts to return. The server defaults to 20 and caps larger values at 100. */
  pageSize?: number;
}

/** Optional parameters for `triggers.listDeliveries`. */
export interface TriggerDeliveryListParams {
  /** Deliveries per page. The server defaults to 20 and caps larger values at 100. */
  pageSize?: number;
  /** `nextPageToken` from a previous page, with the same endpoint and filters. */
  pageToken?: string;
  /** Only deliveries in this state. Omit it for every state. */
  status?: TriggerDeliveryStatus;
  /** Only deliveries from this connection (`conn_...`) or trigger subscription (`trgs_...`). */
  channel?: string;
  /** Only deliveries after this instant. A `Date`, or an ISO 8601 date-time with `Z` or an offset. */
  after?: Date | string;
  /** Only deliveries before this instant. A `Date`, or an ISO 8601 date-time with `Z` or an offset. */
  before?: Date | string;
}

/** Parameters for `triggers.batchLookupDeliveries`. */
export interface TriggerDeliveryBatchLookupParams {
  /** Message IDs (`msg_...`) or event IDs, in any mix (1 to 25). */
  deliveryIds: readonly string[];
}

/** One event to deliver again, and the endpoint to deliver it to. */
export interface TriggerDeliveryResendTarget {
  /** The message ID (`msg_...`). */
  msgId: string;
  /** The delivery endpoint ID (`ep_...`). */
  endpointId: string;
}

/** Parameters for `triggers.batchResendDeliveries`. */
export interface TriggerDeliveryBatchResendParams {
  /** The events to resend (1 to 50), each to one endpoint. */
  targets: readonly TriggerDeliveryResendTarget[];
}

/** Parameters for `triggers.recoverDeliveries`. */
export interface TriggerDeliveryRecoverParams {
  /** Start of the window (inclusive). A `Date`, or an ISO 8601 date-time with `Z` or an offset. */
  since: Date | string;
  /**
   * End of the window (exclusive), at most 14 days after `since`. Omit it to
   * recover up to now. A `Date`, or an ISO 8601 date-time with `Z` or an
   * offset.
   */
  until?: Date | string;
}

// ---------------------------------------------------------------------------
// Returned types
// ---------------------------------------------------------------------------

/** A permission a trigger needs on the connected account's grant. */
export interface TriggerRequiredScope {
  readonly scope: string;
  readonly grant: string;
}

/** A value a subscriber can set on a subscription, such as the channel to watch. */
export interface TriggerConfigField {
  /** The key to use in `config`. */
  readonly key: string;
  readonly displayName: string;
  readonly helpText: string;
  readonly placeholder: string;
  readonly required: boolean;
}

/** One trigger, as it applies to one connection. */
export interface AvailableTrigger {
  /** The trigger name to subscribe with. */
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly provider: string;
  /** `'webhook'` or `'poll'`; `undefined` when the server does not say. */
  readonly mode: DetectionMode | undefined;
  readonly requiredScopes: readonly TriggerRequiredScope[];
  /** Shortest polling interval, in seconds. `undefined` for webhook triggers. */
  readonly minIntervalSeconds: number | undefined;
  /** Polling interval used when you set none, in seconds. `undefined` for webhook triggers. */
  readonly defaultIntervalSeconds: number | undefined;
  readonly configFields: readonly TriggerConfigField[];
  /** Whether the trigger can run on this connection. */
  readonly available: boolean;
  /** Why the trigger is unavailable; empty when it is available. */
  readonly reason: string;
  /** What to change to make it available; empty when it is available. */
  readonly remedy: string;
  /** `'account'` or `'connection'`; `undefined` when the server does not say. */
  readonly deliveryScope: DeliveryScope | undefined;
  /** Whether the trigger runs on Scalekit's shared app; `undefined` when not stated. */
  readonly platformCredentials: TriggerPlatformCredentials | undefined;
  /** A code for why the trigger is unavailable; `undefined` when there is none. */
  readonly refusalCode: TriggerRefusalCode | undefined;
  /** Whether the connection needs a signing secret before events are accepted. */
  readonly requiresSigningSecret: boolean;
  /** Where to register the webhook URL in the provider's app configuration. */
  readonly registerHint: string;
  /** Where to find the signing secret in the provider's app configuration. */
  readonly secretHint: string;
  /** `true` when the provider sends no signature: use `generateSigningSecret`. */
  readonly providesBearerSecret: boolean;
}

/** Returned by `triggers.listAvailable`. */
export interface TriggerCatalog {
  readonly triggers: readonly AvailableTrigger[];
  /** Whether the connection uses Scalekit's shared provider app. */
  readonly connectionUsesSharedApp: boolean;
}

/** Whether a connected account can receive triggers at all. */
export interface AccountHealth {
  /** `undefined` when the server does not say. */
  readonly state: AccountHealthState | undefined;
  readonly reason: string;
  readonly remedy: string;
  /** The one action that resolves the state; `undefined` when none is needed. */
  readonly action: AccountHealthAction | undefined;
  /** Whether the same problem also blocks tool calls for this account. */
  readonly blocksToolCalls: boolean;
}

/** A connected account, with whether it can receive one trigger. */
export interface EligibleAccount {
  /** Connected account ID (`ca_...`). */
  readonly id: string;
  readonly identifier: string;
  readonly eligible: boolean;
  /** Why the account is ineligible; empty when it is eligible. */
  readonly reason: string;
  /** What to change to make it eligible; empty when it is eligible. */
  readonly remedy: string;
  readonly health: AccountHealth | undefined;
}

/** One page returned by `triggers.listEligibleAccounts`. */
export interface TriggerEligibleAccountList {
  readonly accounts: readonly EligibleAccount[];
  /** Pass as `pageToken` for the next page; `undefined` on the last page. */
  readonly nextPageToken: string | undefined;
  /** Pass as `pageToken` for the previous page; `undefined` on the first page. */
  readonly prevPageToken: string | undefined;
  /** Accounts on the connection that match `query`, across every page. */
  readonly totalSize: number;
}

/** The state of a polled subscription's feed, as of its most recent run. */
export interface TriggerPollState {
  readonly lastRunAt: Date | undefined;
  /** Why the most recent run failed; empty when it succeeded. */
  readonly lastError: string;
  readonly consecutiveFailures: number;
  /** Polling is held off until this instant; `undefined` when it is not. */
  readonly backoffUntil: Date | undefined;
  readonly watermarkUpdatedAt: Date | undefined;
  /** `undefined` when the most recent run succeeded. */
  readonly lastErrorCode: TriggerPollErrorCode | undefined;
}

/** A subscription of one connected account, or of a whole connection, to one trigger. */
export interface TriggerSubscription {
  /** Subscription ID (`trgs_...`). */
  readonly id: string;
  /** Empty for a connection-scoped subscription. */
  readonly connectedAccountId: string;
  readonly connectionId: string;
  readonly provider: string;
  readonly triggerName: string;
  /** `undefined` when the server does not say. */
  readonly status: TriggerSubscriptionStatus | undefined;
  /** The polling interval you asked for, in seconds; `undefined` when none was set. */
  readonly requestedIntervalSeconds: number | undefined;
  /** The polling interval it runs at, in seconds; `undefined` for webhook triggers. */
  readonly effectiveIntervalSeconds: number | undefined;
  readonly config: Readonly<Record<string, string>>;
  /** `'account'` or `'connection'`; `undefined` when the server does not say. */
  readonly deliveryScope: DeliveryScope | undefined;
  readonly connectedAccountIdentifier: string;
  readonly createdAt: Date | undefined;
  /** Set for polled subscriptions only. */
  readonly pollState: TriggerPollState | undefined;
  /** The subscribed account's health; `undefined` when not reported. */
  readonly accountHealth: AccountHealthState | undefined;
}

/** One page returned by `triggers.listSubscriptions`. */
export interface TriggerSubscriptionList {
  /** Newest first. */
  readonly subscriptions: readonly TriggerSubscription[];
  /** Pass as `pageToken` for the next page; `undefined` on the last page. */
  readonly nextPageToken: string | undefined;
  /** Pass as `pageToken` for the previous page; `undefined` on the first page. */
  readonly prevPageToken: string | undefined;
  /** Subscriptions matching the filters, across every page. */
  readonly totalSize: number;
  /**
   * Subscriptions per status name (for example `ACTIVE`), across every page.
   * Honours `triggerName` but ignores `statuses`.
   */
  readonly statusCounts: Readonly<Record<string, number>>;
}

/** What happened to one account in `triggers.batchCreateSubscriptions`. */
export interface TriggerSubscriptionBatchCreateItem {
  /** Empty for a connection-scoped trigger. */
  readonly connectedAccountId: string;
  readonly outcome: TriggerSubscribeOutcome | undefined;
  /** Set when the outcome is `CREATED` or `ALREADY_SUBSCRIBED`. */
  readonly subscription: TriggerSubscription | undefined;
  readonly reason: string;
}

/** Returned by `triggers.batchCreateSubscriptions`. */
export interface TriggerSubscriptionBatchCreateResult {
  /** One result per requested account, in request order. */
  readonly results: readonly TriggerSubscriptionBatchCreateItem[];
  /** How many subscriptions this call created. */
  readonly createdCount: number;
}

/** What happened to one subscription in `triggers.batchDeleteSubscriptions`. */
export interface TriggerSubscriptionBatchDeleteItem {
  readonly subscriptionId: string;
  readonly connectedAccountId: string;
  readonly outcome: TriggerSubscriptionDeleteOutcome | undefined;
  readonly reason: string;
}

/** Returned by `triggers.batchDeleteSubscriptions`. */
export interface TriggerSubscriptionBatchDeleteResult {
  readonly results: readonly TriggerSubscriptionBatchDeleteItem[];
  /** How many subscriptions this call deleted. */
  readonly deletedCount: number;
}

/** Returned by `triggers.getActivity`: what happened to the environment's trigger events. */
export interface TriggerActivity {
  /**
   * Event counts over the window, keyed by outcome (`received`, `filtered`,
   * `unresolved`, `delivered`, `delivery_failed`, `duplicate`,
   * `signature_failed`, `discarded`). Every key is present, zeroes included.
   */
  readonly counts: Readonly<Record<string, number>>;
  /** How far back the counts reach, ending now, in seconds. */
  readonly windowSeconds: number;
  /** `true` when most recent arrivals failed signature verification: check the signing secret. */
  readonly signatureBanner: boolean;
  /** `true` when some counts could not be read; do not read zeroes as "nothing arrived". */
  readonly degraded: boolean;
  /** Always `false`: individual events are not stored. */
  readonly explainsIndividualEvents: boolean;
  /** Dashboard path of the trigger delivery page. */
  readonly deliveryDetailsPath: string;
}

/** Metered deliveries on one UTC calendar day. */
export interface TriggerUsageDay {
  /** `'YYYY-MM-DD'`; `undefined` if the server sent none. */
  readonly date: string | undefined;
  readonly units: number;
}

/** Metered deliveries in one UTC clock hour. */
export interface TriggerUsageHour {
  /** Start of the hour; `undefined` if the server sent none or an unreadable one. */
  readonly start: Date | undefined;
  readonly units: number;
}

/** Returned by `triggers.getUsage`. Hours and days with no units are absent. */
export interface TriggerUsage {
  /**
   * First UTC date of the range read, `'YYYY-MM-DD'` (may differ from the
   * request when clamped); `undefined` if the server sent none.
   */
  readonly from: string | undefined;
  /** Last UTC date of the range read, `'YYYY-MM-DD'`; `undefined` if the server sent none. */
  readonly to: string | undefined;
  /**
   * The server's current UTC date, `'YYYY-MM-DD'`, whose count is still
   * growing; `undefined` if the server sent none.
   */
  readonly today: string | undefined;
  /** The `period` asked for; `undefined` when the request used `from` and `to`. */
  readonly period: TriggerUsagePeriod | undefined;
  /** `HOUR` or `DAY`; `undefined` when the request used `from` and `to` (counts are daily). */
  readonly bucket: TriggerUsageBucket | undefined;
  /** Daily counts, oldest first. Empty for `period: '24h'`. */
  readonly days: readonly TriggerUsageDay[];
  /** Hourly counts, oldest first. Only for `period: '24h'`. */
  readonly hours: readonly TriggerUsageHour[];
  /** The hour in progress; only for `period: '24h'`, and `undefined` if unreadable. */
  readonly currentHour: Date | undefined;
}

/**
 * A connection's webhook URL and the state of its signing secret.
 * `console.log` and `util.inspect` show `url` as `[redacted]`; reading it,
 * spreading the object and `JSON.stringify` give the real value.
 */
export interface TriggerIngressEndpoint {
  readonly id: string;
  readonly connectionId: string;
  /**
   * The URL to register in the provider's app configuration. Treat it as
   * confidential: it carries the endpoint's token, so anyone holding it can
   * send events to the connection.
   */
  readonly url: string;
  readonly signingSecretConfigured: boolean;
  /** At most the last four characters of the secret; the secret itself is never returned. */
  readonly maskedSigningSecret: string;
  /** Whether the previous secret is still accepted alongside the current one. */
  readonly rotationInProgress: boolean;
  /** When the previous secret stops being accepted; `undefined` when no rotation is in progress. */
  readonly previousSigningSecretExpiresAt: Date | undefined;
  /** The latest rotation, for `confirmSigningSecretRotation`; 0 when none has ever started. */
  readonly signingSecretRotationId: number;
}

/**
 * Returned by `triggers.generateSigningSecret`. `console.log` and
 * `util.inspect` show `signingSecret` and `urlWithSecret` as `[redacted]`.
 * They are ordinary enumerable properties otherwise, so reading them,
 * spreading the result and `JSON.stringify` keep the real values: treat any
 * serialised copy as a secret.
 */
export interface GeneratedTriggerSigningSecret {
  readonly endpoint: TriggerIngressEndpoint | undefined;
  /** The secret in plain text. Returned only by this call: store it now. */
  readonly signingSecret: string;
  /** The webhook URL with the secret as its final path segment. */
  readonly urlWithSecret: string;
}

/** One attempt to deliver one trigger event to one delivery endpoint. */
export interface TriggerDeliveryAttempt {
  readonly id: string;
  readonly endpointId: string;
  readonly msgId: string;
  readonly status: TriggerDeliveryAttemptStatus | undefined;
  /** The HTTP status your endpoint answered with. */
  readonly responseStatusCode: number;
  /** The response body your endpoint returned (cut to 4096 bytes when `responseTruncated`). */
  readonly response: string;
  readonly timestamp: Date | undefined;
  readonly responseDurationMs: number;
  readonly triggerType: TriggerDeliveryAttemptTriggerType | undefined;
  readonly responseTruncated: boolean;
  readonly endpointUrl: string;
}

/** Returned by `triggers.listDeliveryAttemptsByEndpoint`: the most recent attempts, newest first. */
export interface TriggerDeliveryAttemptList {
  readonly attempts: readonly TriggerDeliveryAttempt[];
}

/** One trigger event delivered to one delivery endpoint. */
export interface TriggerDelivery {
  /** Message ID (`msg_...`), sent to your endpoint as the `webhook-id` header. */
  readonly msgId: string;
  /** Event ID, the payload's `dedupe_key`. */
  readonly eventId: string;
  readonly messageTimestamp: Date | undefined;
  readonly status: TriggerDeliveryStatus | undefined;
  /** When the next retry is due; `undefined` unless it is being retried. */
  readonly nextAttemptAt: Date | undefined;
  readonly subscriptionId: string;
  readonly triggerName: string;
  readonly triggerMode: DetectionMode | undefined;
  readonly connectionId: string;
  readonly connectionProvider: string;
  readonly connectionKeyId: string;
  readonly endpointId: string;
}

/** One page returned by `triggers.listDeliveries`, newest first. */
export interface TriggerDeliveryList {
  readonly deliveries: readonly TriggerDelivery[];
  /** Pass as `pageToken` for older deliveries; `undefined` on the last page. */
  readonly nextPageToken: string | undefined;
}

/** Returned by `triggers.listDeliveryAttemptsByMessage`: attempts, oldest first. */
export interface TriggerMessageAttemptList {
  readonly attempts: readonly TriggerDeliveryAttempt[];
  /** `true` when there are more than the 50 attempts returned. */
  readonly truncated: boolean;
}

/** One trigger event and its delivery attempts across every delivery endpoint. */
export interface TriggerDeliveryDetails {
  readonly msgId: string;
  readonly eventId: string;
  readonly messageTimestamp: Date | undefined;
  readonly subscriptionId: string;
  readonly triggerName: string;
  readonly triggerMode: DetectionMode | undefined;
  readonly connectionId: string;
  readonly connectionProvider: string;
  readonly connectionKeyId: string;
  /** Oldest first; at most 50 (the newest 50). */
  readonly attempts: readonly TriggerDeliveryAttempt[];
  /** `true` when the event has more attempts than those returned. */
  readonly truncated: boolean;
}

/** What happened to one ID in `triggers.batchLookupDeliveries`. */
export interface TriggerDeliveryBatchLookupItem {
  readonly id: string;
  readonly outcome: TriggerDeliveryLookupOutcome | undefined;
  readonly reason: string;
  /** Set when the outcome is `FOUND`. Attempts carry no response body here. */
  readonly delivery: TriggerDeliveryDetails | undefined;
}

/** Returned by `triggers.batchLookupDeliveries`. */
export interface TriggerDeliveryBatchLookupResult {
  /** One result per ID, in the order sent. */
  readonly results: readonly TriggerDeliveryBatchLookupItem[];
  readonly foundCount: number;
}

/** What happened to one target in `triggers.batchResendDeliveries`. */
export interface TriggerDeliveryBatchResendItem {
  readonly msgId: string;
  readonly endpointId: string;
  readonly outcome: TriggerDeliveryResendOutcome | undefined;
  readonly reason: string;
}

/** Returned by `triggers.batchResendDeliveries`. */
export interface TriggerDeliveryBatchResendResult {
  /** One result per target, in the order sent. */
  readonly results: readonly TriggerDeliveryBatchResendItem[];
  /** How many new attempts this call queued. */
  readonly queuedCount: number;
}

/** Returned by `triggers.recoverDeliveries`: the recovery started and runs in the background. */
export interface TriggerDeliveryRecovery {
  /** Empty in the rare case the recovery was accepted without an ID; it still runs. */
  readonly taskId: string;
  /** `'running'` or `'finished'` when the call returned; empty when `taskId` is. */
  readonly status: TriggerDeliveryRecoveryStatus;
}

// ---------------------------------------------------------------------------
// Internal: input checks. Only what is needed to encode the request; every
// rule about the values themselves is the server's.
// ---------------------------------------------------------------------------

const INT32_MIN = -2147483648;
const INT32_MAX = 2147483647;
const UINT32_MAX = 4294967295;

/** @internal A required ID or name: any non-empty string. */
export function requireId(name: string, value: unknown): string {
  if (typeof value !== 'string' || value === '') {
    throw new ScalekitValidationError(`${name} is required`);
  }
  return value;
}

/** @internal A required parameters object. */
export function requireParams(name: string, value: unknown): void {
  if (value === null || typeof value !== 'object') {
    throw new ScalekitValidationError(`${name} is required`);
  }
}

/** @internal An optional parameters object. */
export function optionalParams(name: string, value: unknown): void {
  if (value !== undefined && (value === null || typeof value !== 'object')) {
    throw new ScalekitValidationError(`${name} must be an object`);
  }
}

/** @internal An array of strings, as an encoding check. */
export function stringArray(name: string, value: unknown): string[] {
  if (
    !Array.isArray(value) ||
    !(value as unknown[]).every((item) => typeof item === 'string')
  ) {
    throw new ScalekitValidationError(`${name} must be an array of strings`);
  }
  return [...(value as string[])];
}

/** @internal A map of strings (such as `config`), as an encoding check. */
export function stringRecord(
  name: string,
  value: unknown
): Record<string, string> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new ScalekitValidationError(`${name} must be an object of strings`);
  }
  const out: Record<string, string> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (typeof item !== 'string') {
      throw new ScalekitValidationError(`${name}.${key} must be a string`);
    }
    out[key] = item;
  }
  return out;
}

/** @internal A uint32 page size. */
export function pageSize(name: string, value: unknown): number {
  if (value === undefined) {
    return 0;
  }
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > UINT32_MAX
  ) {
    throw new ScalekitValidationError(
      `${name} must be a non-negative whole number`
    );
  }
  return value;
}

/** @internal An int32 interval in whole seconds. */
export function intervalSeconds(name: string, value: unknown): number {
  if (value === undefined) {
    return 0;
  }
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < INT32_MIN ||
    value > INT32_MAX
  ) {
    throw new ScalekitValidationError(
      `${name} must be a whole number of seconds`
    );
  }
  return value;
}

/** @internal An int64 counter sent as `bigint`. */
export function safeIntegerToBigInt(name: string, value: unknown): bigint {
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) {
    throw new ScalekitValidationError(`${name} must be a safe integer`);
  }
  return BigInt(value);
}

// An ISO 8601 / RFC 3339 date-time that names its offset (Z or ±hh:mm), so
// it means one instant wherever it is parsed. Seconds and fractions optional.
const DATE_TIME_WITH_OFFSET =
  /^(\d{4})-(\d{2})-(\d{2})[Tt]([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(?:\.\d+)?)?(?:[Zz]|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;
const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Whether year, month and day name a day that exists. */
function isRealDay(year: string, month: string, day: string): boolean {
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
function parseDateTime(value: string): Date | undefined {
  const m = DATE_TIME_WITH_OFFSET.exec(value);
  if (m === null || !isRealDay(m[1]!, m[2]!, m[3]!)) {
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
export function toTimestamp(name: string, value: unknown): Timestamp {
  let date: Date | undefined;
  if (value instanceof Date) {
    date = Number.isNaN(value.getTime()) ? undefined : value;
    if (date === undefined) {
      throw new ScalekitValidationError(`${name} is not a valid date`);
    }
  } else if (typeof value === 'string') {
    date = parseDateTime(value);
    if (date === undefined) {
      throw new ScalekitValidationError(
        `${name} must be an ISO 8601 date-time with Z or an offset, such as 2026-10-28T10:00:00Z`
      );
    }
  } else {
    throw new ScalekitValidationError(
      `${name} must be a Date or an ISO 8601 date-time string`
    );
  }
  return timestampFromDate(date);
}

/** @internal A UTC calendar date, `'YYYY-MM-DD'`, that exists. */
export function calendarDate(name: string, value: unknown): string {
  const m = typeof value === 'string' ? CALENDAR_DATE.exec(value) : null;
  if (m === null || !isRealDay(m[1]!, m[2]!, m[3]!)) {
    throw new ScalekitValidationError(
      `${name} must be a calendar date as YYYY-MM-DD, such as 2026-10-28`
    );
  }
  return value as string;
}

/**
 * @internal An SDK enum value (or a generated value name, or a numeric
 * string for a value newer than this SDK) as its wire number. An unknown
 * name cannot be encoded and is refused.
 */
export function toProtoEnum(
  name: string,
  generated: object,
  value: unknown
): number {
  if (typeof value === 'string') {
    if (/^-?\d+$/.test(value)) {
      const n = Number(value);
      if (n >= INT32_MIN && n <= INT32_MAX) {
        return n;
      }
    } else if (Object.prototype.hasOwnProperty.call(generated, value)) {
      const n = (generated as Record<string, unknown>)[value];
      if (typeof n === 'number') {
        return n;
      }
    }
  }
  const known = Object.entries(generated)
    .filter(([, v]) => typeof v === 'number' && v !== 0)
    .map(([k]) => k);
  throw new ScalekitValidationError(
    `${name} must be one of ${known.join(', ')}, or a value number as a string`
  );
}

/** @internal Per-call options for `connectExec`, from the caller's `RequestOptions`. */
export function execOptions(
  options: RequestOptions | undefined,
  retryOnUnavailable: boolean
): ConnectExecOptions {
  const exec: ConnectExecOptions = {};
  if (options !== undefined) {
    if (options === null || typeof options !== 'object') {
      throw new ScalekitValidationError('options must be an object');
    }
    const { signal, timeoutMs } = options;
    if (timeoutMs !== undefined) {
      if (
        typeof timeoutMs !== 'number' ||
        !Number.isFinite(timeoutMs) ||
        timeoutMs <= 0
      ) {
        throw new ScalekitValidationError(
          'options.timeoutMs must be a positive finite number of milliseconds'
        );
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
function enumName(generated: object, value: number): string | undefined {
  if (value === 0) {
    return undefined;
  }
  const name = (generated as Record<number, unknown>)[value];
  return typeof name === 'string' ? name : String(value);
}

function deliveryScope(
  value: pb.TriggerDeliveryScope
): DeliveryScope | undefined {
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

function detectionMode(value: pb.TriggerMode): DetectionMode | undefined {
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

function date(ts: Timestamp | undefined): Date | undefined {
  return ts === undefined ? undefined : timestampDate(ts);
}

function nonZero(value: number): number | undefined {
  return value === 0 ? undefined : value;
}

function token(value: string): string | undefined {
  return value === '' ? undefined : value;
}

function safeNumber(field: string, value: bigint): number {
  const n = Number(value);
  if (!Number.isSafeInteger(n)) {
    throw new ScalekitException(
      `${field} (${value.toString()}) is too large to represent exactly as a number`
    );
  }
  return n;
}

/** A server instant string: `undefined` when empty or unreadable, never a throw. */
function instant(value: string): Date | undefined {
  return value === '' ? undefined : parseDateTime(value);
}

function nonEmpty(value: string): string | undefined {
  return value === '' ? undefined : value;
}

function copyRecord<T>(source: { [key: string]: T }): Record<string, T> {
  return Object.fromEntries(Object.entries(source));
}

/** @internal */
export function mapCatalog(
  res: pb.ListAvailableTriggersResponse
): TriggerCatalog {
  return {
    triggers: res.triggers.map(mapAvailableTrigger),
    connectionUsesSharedApp: res.connectionUsesSharedApp,
  };
}

function mapAvailableTrigger(t: pb.AvailableTrigger): AvailableTrigger {
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
    platformCredentials: enumName(
      pb.TriggerPlatformCredentials,
      t.platformCredentials
    ),
    refusalCode: enumName(pb.TriggerRefusalCode, t.refusalCode),
    requiresSigningSecret: t.requiresSigningSecret,
    registerHint: t.registerHint,
    secretHint: t.secretHint,
    providesBearerSecret: t.providesBearerSecret,
  };
}

function mapAccountHealth(h: pb.AccountHealth): AccountHealth {
  return {
    state: enumName(pb.AccountHealthState, h.state),
    reason: h.reason,
    remedy: h.remedy,
    action: enumName(pb.AccountHealthAction, h.action),
    blocksToolCalls: h.blocksToolCalls,
  };
}

/** @internal */
export function mapEligibleAccounts(
  res: pb.ListEligibleAccountsResponse
): TriggerEligibleAccountList {
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

function mapPollState(p: pb.TriggerPollState): TriggerPollState {
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
export function mapSubscription(
  s: pb.TriggerSubscription
): TriggerSubscription {
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
    pollState:
      s.pollState === undefined ? undefined : mapPollState(s.pollState),
    accountHealth:
      s.accountHealth === undefined
        ? undefined
        : enumName(pb.AccountHealthState, s.accountHealth),
  };
}

/** @internal */
export function mapSubscriptionList(
  res: pb.ListTriggerSubscriptionsResponse
): TriggerSubscriptionList {
  return {
    subscriptions: res.subscriptions.map(mapSubscription),
    nextPageToken: token(res.nextPageToken),
    prevPageToken: token(res.prevPageToken),
    totalSize: res.totalSize,
    statusCounts: copyRecord(res.statusCounts),
  };
}

/** @internal */
export function mapBatchCreate(
  res: pb.BatchCreateTriggerSubscriptionsResponse
): TriggerSubscriptionBatchCreateResult {
  return {
    results: res.results.map((r) => ({
      connectedAccountId: r.connectedAccountId,
      outcome: enumName(pb.BatchSubscribeOutcome, r.outcome),
      subscription:
        r.subscription === undefined
          ? undefined
          : mapSubscription(r.subscription),
      reason: r.reason,
    })),
    createdCount: res.createdCount,
  };
}

/** @internal */
export function mapBatchDelete(
  res: pb.BatchDeleteTriggerSubscriptionsResponse
): TriggerSubscriptionBatchDeleteResult {
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
export function mapActivity(
  res: pb.GetTriggerActivityResponse
): TriggerActivity {
  return {
    counts: Object.fromEntries(
      Object.entries(res.counts).map(([key, value]) => [
        key,
        safeNumber(`counts.${key}`, value),
      ])
    ),
    windowSeconds: res.windowHours * 3600,
    signatureBanner: res.signatureBanner,
    degraded: res.degraded,
    explainsIndividualEvents: res.explainsIndividualEvents,
    deliveryDetailsPath: res.deliveryDetailsPath,
  };
}

/** @internal */
export function mapUsage(res: pb.GetTriggerUsageResponse): TriggerUsage {
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
export function mapIngressEndpoint(
  e: pb.TriggerIngressEndpoint
): TriggerIngressEndpoint {
  const endpoint: TriggerIngressEndpoint = {
    id: e.id,
    connectionId: e.connectionId,
    url: e.url,
    signingSecretConfigured: e.signingSecretConfigured,
    maskedSigningSecret: e.maskedSigningSecret,
    rotationInProgress: e.rotationInProgress,
    previousSigningSecretExpiresAt: date(e.previousSigningSecretExpiresAt),
    signingSecretRotationId: safeNumber(
      'signingSecretRotationId',
      e.signingSecretRotationId
    ),
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
export function mapGeneratedSecret(
  res: pb.GenerateTriggerSigningSecretResponse
): GeneratedTriggerSigningSecret {
  const result: GeneratedTriggerSigningSecret = {
    endpoint:
      res.endpoint === undefined ? undefined : mapIngressEndpoint(res.endpoint),
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

function redactedEndpointView(this: TriggerIngressEndpoint): object {
  return { ...this, url: REDACTED };
}

function redactedSecretView(this: GeneratedTriggerSigningSecret): object {
  return {
    endpoint:
      this.endpoint === undefined
        ? undefined
        : redactedEndpointView.call(this.endpoint),
    signingSecret: REDACTED,
    urlWithSecret: REDACTED,
  };
}

function mapAttempt(a: pb.TriggerDeliveryAttempt): TriggerDeliveryAttempt {
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
export function mapAttemptList(
  res: pb.ListTriggerDeliveryAttemptsByEndpointResponse
): TriggerDeliveryAttemptList {
  return { attempts: res.attempts.map(mapAttempt) };
}

/** @internal */
export function mapDeliveryList(
  res: pb.ListTriggerDeliveriesByEndpointResponse
): TriggerDeliveryList {
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
export function mapMessageAttemptList(
  res: pb.ListTriggerDeliveryAttemptsByMessageResponse
): TriggerMessageAttemptList {
  return {
    attempts: res.attempts.map(mapAttempt),
    truncated: res.truncated,
  };
}

/** @internal */
export function mapDeliveryDetails(
  res: pb.LookupTriggerDeliveryResponse
): TriggerDeliveryDetails {
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
export function mapBatchLookup(
  res: pb.BatchLookupTriggerDeliveriesResponse
): TriggerDeliveryBatchLookupResult {
  return {
    results: res.results.map((r) => ({
      id: r.id,
      outcome: enumName(pb.BatchLookupOutcome, r.outcome),
      reason: r.reason,
      delivery:
        r.delivery === undefined ? undefined : mapDeliveryDetails(r.delivery),
    })),
    foundCount: res.foundCount,
  };
}

/** @internal */
export function mapBatchResend(
  res: pb.BatchResendTriggerDeliveriesResponse
): TriggerDeliveryBatchResendResult {
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
export function mapRecovery(
  res: pb.RecoverTriggerDeliveriesResponse
): TriggerDeliveryRecovery {
  return { taskId: res.taskId, status: res.status };
}
