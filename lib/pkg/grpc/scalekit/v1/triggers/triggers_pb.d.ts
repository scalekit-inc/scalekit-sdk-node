import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, StructSchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/triggers/triggers.proto.
 */
export declare const file_scalekit_v1_triggers_triggers: GenFile;
/**
 * A permission the trigger needs on the connected account's grant.
 *
 * @generated from message scalekit.v1.triggers.RequiredScope
 */
export type RequiredScope = Message<"scalekit.v1.triggers.RequiredScope"> & {
    /**
     * @generated from field: string scope = 1;
     */
    scope: string;
    /**
     * @generated from field: string grant = 2;
     */
    grant: string;
};
/**
 * Describes the message scalekit.v1.triggers.RequiredScope.
 * Use `create(RequiredScopeSchema)` to create a new message.
 */
export declare const RequiredScopeSchema: GenMessage<RequiredScope>;
/**
 * A customer-settable value on a subscription.
 *
 * Derived server-side from the trigger's own matching rules rather than declared separately, so
 * the two cannot disagree: a field a client offers that no rule reads does nothing, and a rule
 * referencing a key no client offers can never be satisfied.
 *
 * @generated from message scalekit.v1.triggers.ConfigField
 */
export type ConfigField = Message<"scalekit.v1.triggers.ConfigField"> & {
    /**
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
    /**
     * @generated from field: string help_text = 3;
     */
    helpText: string;
    /**
     * @generated from field: string placeholder = 4;
     */
    placeholder: string;
    /**
     * @generated from field: bool required = 5;
     */
    required: boolean;
};
/**
 * Describes the message scalekit.v1.triggers.ConfigField.
 * Use `create(ConfigFieldSchema)` to create a new message.
 */
export declare const ConfigFieldSchema: GenMessage<ConfigField>;
/**
 * One trigger, as it applies to one connection.
 *
 * @generated from message scalekit.v1.triggers.AvailableTrigger
 */
export type AvailableTrigger = Message<"scalekit.v1.triggers.AvailableTrigger"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
    /**
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * @generated from field: string provider = 4;
     */
    provider: string;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerMode mode = 5;
     */
    mode: TriggerMode;
    /**
     * @generated from field: repeated scalekit.v1.triggers.RequiredScope required_scopes = 7;
     */
    requiredScopes: RequiredScope[];
    /**
     * @generated from field: int32 min_interval_seconds = 8;
     */
    minIntervalSeconds: number;
    /**
     * @generated from field: int32 default_interval_seconds = 9;
     */
    defaultIntervalSeconds: number;
    /**
     * @generated from field: repeated scalekit.v1.triggers.ConfigField config_fields = 10;
     */
    configFields: ConfigField[];
    /**
     * @generated from field: bool available = 11;
     */
    available: boolean;
    /**
     * @generated from field: string reason = 12;
     */
    reason: string;
    /**
     * @generated from field: string remedy = 13;
     */
    remedy: string;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerDeliveryScope delivery_scope = 14;
     */
    deliveryScope: TriggerDeliveryScope;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerPlatformCredentials platform_credentials = 15;
     */
    platformCredentials: TriggerPlatformCredentials;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerRefusalCode refusal_code = 16;
     */
    refusalCode: TriggerRefusalCode;
    /**
     * @generated from field: bool requires_signing_secret = 17;
     */
    requiresSigningSecret: boolean;
    /**
     * @generated from field: string register_hint = 18;
     */
    registerHint: string;
    /**
     * @generated from field: string secret_hint = 19;
     */
    secretHint: string;
    /**
     * @generated from field: bool provides_bearer_secret = 20;
     */
    providesBearerSecret: boolean;
};
/**
 * Describes the message scalekit.v1.triggers.AvailableTrigger.
 * Use `create(AvailableTriggerSchema)` to create a new message.
 */
export declare const AvailableTriggerSchema: GenMessage<AvailableTrigger>;
/**
 * A connected account, with whether it can receive a particular trigger.
 *
 * @generated from message scalekit.v1.triggers.EligibleAccount
 */
export type EligibleAccount = Message<"scalekit.v1.triggers.EligibleAccount"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string identifier = 2;
     */
    identifier: string;
    /**
     * @generated from field: bool eligible = 3;
     */
    eligible: boolean;
    /**
     * @generated from field: string reason = 4;
     */
    reason: string;
    /**
     * @generated from field: string remedy = 5;
     */
    remedy: string;
    /**
     * @generated from field: scalekit.v1.triggers.AccountHealth health = 6;
     */
    health?: AccountHealth | undefined;
};
/**
 * Describes the message scalekit.v1.triggers.EligibleAccount.
 * Use `create(EligibleAccountSchema)` to create a new message.
 */
export declare const EligibleAccountSchema: GenMessage<EligibleAccount>;
/**
 * Whether a connected account can receive triggers at all.
 *
 * Derived from the account on every read rather than stored, so a cause nobody instrumented still
 * surfaces here instead of leaving the account looking healthy.
 *
 * @generated from message scalekit.v1.triggers.AccountHealth
 */
export type AccountHealth = Message<"scalekit.v1.triggers.AccountHealth"> & {
    /**
     * @generated from field: scalekit.v1.triggers.AccountHealthState state = 1;
     */
    state: AccountHealthState;
    /**
     * @generated from field: string reason = 2;
     */
    reason: string;
    /**
     * @generated from field: string remedy = 3;
     */
    remedy: string;
    /**
     * @generated from field: scalekit.v1.triggers.AccountHealthAction action = 4;
     */
    action: AccountHealthAction;
    /**
     * @generated from field: bool blocks_tool_calls = 5;
     */
    blocksToolCalls: boolean;
};
/**
 * Describes the message scalekit.v1.triggers.AccountHealth.
 * Use `create(AccountHealthSchema)` to create a new message.
 */
export declare const AccountHealthSchema: GenMessage<AccountHealth>;
/**
 * @generated from message scalekit.v1.triggers.TriggerSubscription
 */
export type TriggerSubscription = Message<"scalekit.v1.triggers.TriggerSubscription"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string connected_account_id = 2;
     */
    connectedAccountId: string;
    /**
     * @generated from field: string connection_id = 3;
     */
    connectionId: string;
    /**
     * @generated from field: string provider = 4;
     */
    provider: string;
    /**
     * @generated from field: string trigger_name = 5;
     */
    triggerName: string;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerSubscriptionStatus status = 6;
     */
    status: TriggerSubscriptionStatus;
    /**
     * @generated from field: int32 requested_interval_seconds = 7;
     */
    requestedIntervalSeconds: number;
    /**
     * @generated from field: int32 effective_interval_seconds = 8;
     */
    effectiveIntervalSeconds: number;
    /**
     * @generated from field: map<string, string> config = 9;
     */
    config: {
        [key: string]: string;
    };
    /**
     * @generated from field: scalekit.v1.triggers.TriggerDeliveryScope delivery_scope = 10;
     */
    deliveryScope: TriggerDeliveryScope;
    /**
     * @generated from field: string connected_account_identifier = 11;
     */
    connectedAccountIdentifier: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 12;
     */
    createdAt?: Timestamp | undefined;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerPollState poll_state = 13;
     */
    pollState?: TriggerPollState | undefined;
    /**
     * @generated from field: optional scalekit.v1.triggers.AccountHealthState account_health = 14;
     */
    accountHealth?: AccountHealthState | undefined;
};
/**
 * Describes the message scalekit.v1.triggers.TriggerSubscription.
 * Use `create(TriggerSubscriptionSchema)` to create a new message.
 */
export declare const TriggerSubscriptionSchema: GenMessage<TriggerSubscription>;
/**
 * The state of a poll subscription's feed, as of its most recent run.
 *
 * Read from the feed's own stored state on every request rather than derived, so a feed that is
 * failing, rate limited, or held off is visible without looking at logs. A subscription whose
 * status is ACTIVE can still be failing every run; this is where that shows.
 *
 * @generated from message scalekit.v1.triggers.TriggerPollState
 */
export type TriggerPollState = Message<"scalekit.v1.triggers.TriggerPollState"> & {
    /**
     * @generated from field: google.protobuf.Timestamp last_run_at = 1;
     */
    lastRunAt?: Timestamp | undefined;
    /**
     * @generated from field: string last_error = 2;
     */
    lastError: string;
    /**
     * @generated from field: uint32 consecutive_failures = 3;
     */
    consecutiveFailures: number;
    /**
     * @generated from field: google.protobuf.Timestamp backoff_until = 4;
     */
    backoffUntil?: Timestamp | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp watermark_updated_at = 5;
     */
    watermarkUpdatedAt?: Timestamp | undefined;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerPollErrorCode last_error_code = 6;
     */
    lastErrorCode: TriggerPollErrorCode;
};
/**
 * Describes the message scalekit.v1.triggers.TriggerPollState.
 * Use `create(TriggerPollStateSchema)` to create a new message.
 */
export declare const TriggerPollStateSchema: GenMessage<TriggerPollState>;
/**
 * @generated from message scalekit.v1.triggers.ListAvailableTriggersRequest
 */
export type ListAvailableTriggersRequest = Message<"scalekit.v1.triggers.ListAvailableTriggersRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
};
/**
 * Describes the message scalekit.v1.triggers.ListAvailableTriggersRequest.
 * Use `create(ListAvailableTriggersRequestSchema)` to create a new message.
 */
export declare const ListAvailableTriggersRequestSchema: GenMessage<ListAvailableTriggersRequest>;
/**
 * @generated from message scalekit.v1.triggers.ListAvailableTriggersResponse
 */
export type ListAvailableTriggersResponse = Message<"scalekit.v1.triggers.ListAvailableTriggersResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.AvailableTrigger triggers = 1;
     */
    triggers: AvailableTrigger[];
    /**
     * @generated from field: bool connection_uses_shared_app = 2;
     */
    connectionUsesSharedApp: boolean;
};
/**
 * Describes the message scalekit.v1.triggers.ListAvailableTriggersResponse.
 * Use `create(ListAvailableTriggersResponseSchema)` to create a new message.
 */
export declare const ListAvailableTriggersResponseSchema: GenMessage<ListAvailableTriggersResponse>;
/**
 * @generated from message scalekit.v1.triggers.ListEligibleAccountsRequest
 */
export type ListEligibleAccountsRequest = Message<"scalekit.v1.triggers.ListEligibleAccountsRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string trigger_name = 2;
     */
    triggerName: string;
    /**
     * @generated from field: string query = 3;
     */
    query: string;
    /**
     * @generated from field: uint32 page_size = 4;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 5;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.triggers.ListEligibleAccountsRequest.
 * Use `create(ListEligibleAccountsRequestSchema)` to create a new message.
 */
export declare const ListEligibleAccountsRequestSchema: GenMessage<ListEligibleAccountsRequest>;
/**
 * @generated from message scalekit.v1.triggers.ListEligibleAccountsResponse
 */
export type ListEligibleAccountsResponse = Message<"scalekit.v1.triggers.ListEligibleAccountsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.EligibleAccount accounts = 1;
     */
    accounts: EligibleAccount[];
    /**
     * @generated from field: string next_page_token = 3;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
    /**
     * @generated from field: uint32 total_size = 5;
     */
    totalSize: number;
};
/**
 * Describes the message scalekit.v1.triggers.ListEligibleAccountsResponse.
 * Use `create(ListEligibleAccountsResponseSchema)` to create a new message.
 */
export declare const ListEligibleAccountsResponseSchema: GenMessage<ListEligibleAccountsResponse>;
/**
 * @generated from message scalekit.v1.triggers.ListTriggerSubscriptionsRequest
 */
export type ListTriggerSubscriptionsRequest = Message<"scalekit.v1.triggers.ListTriggerSubscriptionsRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string trigger_name = 2;
     */
    triggerName: string;
    /**
     * @generated from field: repeated scalekit.v1.triggers.TriggerSubscriptionStatus statuses = 3;
     */
    statuses: TriggerSubscriptionStatus[];
    /**
     * @generated from field: uint32 page_size = 4;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 5;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.triggers.ListTriggerSubscriptionsRequest.
 * Use `create(ListTriggerSubscriptionsRequestSchema)` to create a new message.
 */
export declare const ListTriggerSubscriptionsRequestSchema: GenMessage<ListTriggerSubscriptionsRequest>;
/**
 * @generated from message scalekit.v1.triggers.ListTriggerSubscriptionsResponse
 */
export type ListTriggerSubscriptionsResponse = Message<"scalekit.v1.triggers.ListTriggerSubscriptionsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.TriggerSubscription subscriptions = 1;
     */
    subscriptions: TriggerSubscription[];
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
    /**
     * @generated from field: uint32 total_size = 4;
     */
    totalSize: number;
    /**
     * @generated from field: map<string, uint32> status_counts = 5;
     */
    statusCounts: {
        [key: string]: number;
    };
};
/**
 * Describes the message scalekit.v1.triggers.ListTriggerSubscriptionsResponse.
 * Use `create(ListTriggerSubscriptionsResponseSchema)` to create a new message.
 */
export declare const ListTriggerSubscriptionsResponseSchema: GenMessage<ListTriggerSubscriptionsResponse>;
/**
 * @generated from message scalekit.v1.triggers.CreateTriggerSubscriptionRequest
 */
export type CreateTriggerSubscriptionRequest = Message<"scalekit.v1.triggers.CreateTriggerSubscriptionRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string connected_account_id = 2;
     */
    connectedAccountId: string;
    /**
     * @generated from field: string trigger_name = 3;
     */
    triggerName: string;
    /**
     * @generated from field: int32 interval_seconds = 4;
     */
    intervalSeconds: number;
    /**
     * @generated from field: map<string, string> config = 5;
     */
    config: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.triggers.CreateTriggerSubscriptionRequest.
 * Use `create(CreateTriggerSubscriptionRequestSchema)` to create a new message.
 */
export declare const CreateTriggerSubscriptionRequestSchema: GenMessage<CreateTriggerSubscriptionRequest>;
/**
 * @generated from message scalekit.v1.triggers.BatchCreateTriggerSubscriptionsRequest
 */
export type BatchCreateTriggerSubscriptionsRequest = Message<"scalekit.v1.triggers.BatchCreateTriggerSubscriptionsRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * Not REQUIRED: empty is the valid request for a connection-scoped trigger, and a REQUIRED
     * annotation would tell generated clients otherwise. Whether empty is allowed depends on the
     * trigger's delivery_scope, which only the service has loaded, so it is checked there.
     *
     * @generated from field: repeated string connected_account_ids = 2;
     */
    connectedAccountIds: string[];
    /**
     * @generated from field: string trigger_name = 3;
     */
    triggerName: string;
    /**
     * @generated from field: int32 interval_seconds = 4;
     */
    intervalSeconds: number;
    /**
     * @generated from field: map<string, string> config = 5;
     */
    config: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.triggers.BatchCreateTriggerSubscriptionsRequest.
 * Use `create(BatchCreateTriggerSubscriptionsRequestSchema)` to create a new message.
 */
export declare const BatchCreateTriggerSubscriptionsRequestSchema: GenMessage<BatchCreateTriggerSubscriptionsRequest>;
/**
 * One account's result within a batch.
 *
 * @generated from message scalekit.v1.triggers.BatchCreateTriggerSubscriptionResult
 */
export type BatchCreateTriggerSubscriptionResult = Message<"scalekit.v1.triggers.BatchCreateTriggerSubscriptionResult"> & {
    /**
     * @generated from field: string connected_account_id = 1;
     */
    connectedAccountId: string;
    /**
     * @generated from field: scalekit.v1.triggers.BatchSubscribeOutcome outcome = 2;
     */
    outcome: BatchSubscribeOutcome;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerSubscription subscription = 3;
     */
    subscription?: TriggerSubscription | undefined;
    /**
     * Field 5 was a separate `remedy`. The refusal machinery renders reason and remedy as one
     * sentence and holds no accessor that returns them apart, so a separate field could only be
     * filled by re-deriving the remedy from the error — the duplication that previously let the
     * create path and the eligibility list give different advice about the same account.
     *
     * @generated from field: string reason = 4;
     */
    reason: string;
};
/**
 * Describes the message scalekit.v1.triggers.BatchCreateTriggerSubscriptionResult.
 * Use `create(BatchCreateTriggerSubscriptionResultSchema)` to create a new message.
 */
export declare const BatchCreateTriggerSubscriptionResultSchema: GenMessage<BatchCreateTriggerSubscriptionResult>;
/**
 * @generated from message scalekit.v1.triggers.BatchCreateTriggerSubscriptionsResponse
 */
export type BatchCreateTriggerSubscriptionsResponse = Message<"scalekit.v1.triggers.BatchCreateTriggerSubscriptionsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.BatchCreateTriggerSubscriptionResult results = 1;
     */
    results: BatchCreateTriggerSubscriptionResult[];
    /**
     * @generated from field: uint32 created_count = 2;
     */
    createdCount: number;
};
/**
 * Describes the message scalekit.v1.triggers.BatchCreateTriggerSubscriptionsResponse.
 * Use `create(BatchCreateTriggerSubscriptionsResponseSchema)` to create a new message.
 */
export declare const BatchCreateTriggerSubscriptionsResponseSchema: GenMessage<BatchCreateTriggerSubscriptionsResponse>;
/**
 * @generated from message scalekit.v1.triggers.DeleteTriggerSubscriptionRequest
 */
export type DeleteTriggerSubscriptionRequest = Message<"scalekit.v1.triggers.DeleteTriggerSubscriptionRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string subscription_id = 2;
     */
    subscriptionId: string;
};
/**
 * Describes the message scalekit.v1.triggers.DeleteTriggerSubscriptionRequest.
 * Use `create(DeleteTriggerSubscriptionRequestSchema)` to create a new message.
 */
export declare const DeleteTriggerSubscriptionRequestSchema: GenMessage<DeleteTriggerSubscriptionRequest>;
/**
 * Which subscriptions to delete: subscription_ids, or trigger_name with connected_account_ids.
 *
 * Exactly one selector, checked by the service rather than by a message rule: the service has to
 * check it anyway, since in-process callers bypass the validation interceptor, and checking in one
 * place keeps the refusal to the one message the 400 response documents. trigger_name alone — every
 * subscription to a trigger — is deliberately not a selector: a wide delete behind one string, and
 * a client that wants it can page ListTriggerSubscriptions and send the ids.
 *
 * @generated from message scalekit.v1.triggers.BatchDeleteTriggerSubscriptionsRequest
 */
export type BatchDeleteTriggerSubscriptionsRequest = Message<"scalekit.v1.triggers.BatchDeleteTriggerSubscriptionsRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: repeated string subscription_ids = 2;
     */
    subscriptionIds: string[];
    /**
     * @generated from field: string trigger_name = 3;
     */
    triggerName: string;
    /**
     * @generated from field: repeated string connected_account_ids = 4;
     */
    connectedAccountIds: string[];
};
/**
 * Describes the message scalekit.v1.triggers.BatchDeleteTriggerSubscriptionsRequest.
 * Use `create(BatchDeleteTriggerSubscriptionsRequestSchema)` to create a new message.
 */
export declare const BatchDeleteTriggerSubscriptionsRequestSchema: GenMessage<BatchDeleteTriggerSubscriptionsRequest>;
/**
 * One subscription's result within a batch delete.
 *
 * @generated from message scalekit.v1.triggers.BatchDeleteTriggerSubscriptionResult
 */
export type BatchDeleteTriggerSubscriptionResult = Message<"scalekit.v1.triggers.BatchDeleteTriggerSubscriptionResult"> & {
    /**
     * @generated from field: string subscription_id = 1;
     */
    subscriptionId: string;
    /**
     * @generated from field: string connected_account_id = 2;
     */
    connectedAccountId: string;
    /**
     * @generated from field: scalekit.v1.triggers.BatchDeleteOutcome outcome = 3;
     */
    outcome: BatchDeleteOutcome;
    /**
     * @generated from field: string reason = 4;
     */
    reason: string;
};
/**
 * Describes the message scalekit.v1.triggers.BatchDeleteTriggerSubscriptionResult.
 * Use `create(BatchDeleteTriggerSubscriptionResultSchema)` to create a new message.
 */
export declare const BatchDeleteTriggerSubscriptionResultSchema: GenMessage<BatchDeleteTriggerSubscriptionResult>;
/**
 * @generated from message scalekit.v1.triggers.BatchDeleteTriggerSubscriptionsResponse
 */
export type BatchDeleteTriggerSubscriptionsResponse = Message<"scalekit.v1.triggers.BatchDeleteTriggerSubscriptionsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.BatchDeleteTriggerSubscriptionResult results = 1;
     */
    results: BatchDeleteTriggerSubscriptionResult[];
    /**
     * @generated from field: uint32 deleted_count = 2;
     */
    deletedCount: number;
};
/**
 * Describes the message scalekit.v1.triggers.BatchDeleteTriggerSubscriptionsResponse.
 * Use `create(BatchDeleteTriggerSubscriptionsResponseSchema)` to create a new message.
 */
export declare const BatchDeleteTriggerSubscriptionsResponseSchema: GenMessage<BatchDeleteTriggerSubscriptionsResponse>;
/**
 * @generated from message scalekit.v1.triggers.GetTriggerActivityRequest
 */
export type GetTriggerActivityRequest = Message<"scalekit.v1.triggers.GetTriggerActivityRequest"> & {};
/**
 * Describes the message scalekit.v1.triggers.GetTriggerActivityRequest.
 * Use `create(GetTriggerActivityRequestSchema)` to create a new message.
 */
export declare const GetTriggerActivityRequestSchema: GenMessage<GetTriggerActivityRequest>;
/**
 * What happened to this environment's trigger events, and what this cannot tell you.
 *
 * @generated from message scalekit.v1.triggers.GetTriggerActivityResponse
 */
export type GetTriggerActivityResponse = Message<"scalekit.v1.triggers.GetTriggerActivityResponse"> & {
    /**
     * Counts over the window, keyed by outcome. Every key is present, including the zeroes — a
     * missing key renders as a gap, and "filtered: 0" is an answer while a blank is not.
     *
     * Keys: received, filtered, unresolved, delivered, delivery_failed, duplicate, signature_failed,
     * discarded. Scoped to the calling environment; no other tenant's counts and no identifiers of
     * any kind appear here.
     *
     * @generated from field: map<string, int64> counts = 1;
     */
    counts: {
        [key: string]: bigint;
    };
    /**
     * @generated from field: int32 window_hours = 2;
     */
    windowHours: number;
    /**
     * @generated from field: bool signature_banner = 3;
     */
    signatureBanner: boolean;
    /**
     * @generated from field: bool degraded = 4;
     */
    degraded: boolean;
    /**
     * Always false. Present so a client renders the limitation rather than implying a per-event
     * lookup exists: nothing on the event path is stored, so there is no record of one specific
     * event to look up, and there is no plan for one. A customer who believes otherwise opens a
     * support ticket asking for something nobody can produce.
     *
     * @generated from field: bool explains_individual_events = 5;
     */
    explainsIndividualEvents: boolean;
    /**
     * Where delivery problems AFTER handoff are visible: attempts, response codes, and retries for
     * each endpoint. Delivered counts a successful handoff to the delivery service, not receipt by
     * the customer's own endpoint, and the difference is exactly what this link resolves.
     *
     * @generated from field: string delivery_details_path = 6;
     */
    deliveryDetailsPath: string;
};
/**
 * Describes the message scalekit.v1.triggers.GetTriggerActivityResponse.
 * Use `create(GetTriggerActivityResponseSchema)` to create a new message.
 */
export declare const GetTriggerActivityResponseSchema: GenMessage<GetTriggerActivityResponse>;
/**
 * What to read metered trigger usage for: a preset period ending now, or the UTC calendar dates
 * from and to, both inclusive. Exactly one of the two.
 *
 * @generated from message scalekit.v1.triggers.GetTriggerUsageRequest
 */
export type GetTriggerUsageRequest = Message<"scalekit.v1.triggers.GetTriggerUsageRequest"> & {
    /**
     * First UTC calendar date to include, as YYYY-MM-DD. Required unless period is set.
     *
     * @generated from field: string from = 1;
     */
    from: string;
    /**
     * Last UTC calendar date to include, as YYYY-MM-DD. Required unless period is set.
     *
     * Matched exactly: "24H", " 24h" and "1d" are refused, not normalised. Empty means the request
     * uses from and to instead, so the list check skips it, as the date patterns do.
     *
     * @generated from field: string to = 2;
     */
    to: string;
    /**
     * A preset period ending now: 24h (hourly), 7d or 30d (UTC days). Sent instead of from and to.
     *
     * @generated from field: string period = 3;
     */
    period: string;
};
/**
 * Describes the message scalekit.v1.triggers.GetTriggerUsageRequest.
 * Use `create(GetTriggerUsageRequestSchema)` to create a new message.
 */
export declare const GetTriggerUsageRequestSchema: GenMessage<GetTriggerUsageRequest>;
/**
 * Metered trigger deliveries for each hour (period 24h) or UTC day (everything else) of the range
 * read that has any.
 *
 * @generated from message scalekit.v1.triggers.GetTriggerUsageResponse
 */
export type GetTriggerUsageResponse = Message<"scalekit.v1.triggers.GetTriggerUsageResponse"> & {
    /**
     * @generated from field: string from = 1;
     */
    from: string;
    /**
     * @generated from field: string to = 2;
     */
    to: string;
    /**
     * @generated from field: string today = 3;
     */
    today: string;
    /**
     * @generated from field: repeated scalekit.v1.triggers.TriggerUsageDay days = 4;
     */
    days: TriggerUsageDay[];
    /**
     * @generated from field: string period = 5;
     */
    period: string;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerUsageBucket bucket = 6;
     */
    bucket: TriggerUsageBucket;
    /**
     * @generated from field: repeated scalekit.v1.triggers.TriggerUsageHour hours = 7;
     */
    hours: TriggerUsageHour[];
    /**
     * @generated from field: string current_hour = 8;
     */
    currentHour: string;
};
/**
 * Describes the message scalekit.v1.triggers.GetTriggerUsageResponse.
 * Use `create(GetTriggerUsageResponseSchema)` to create a new message.
 */
export declare const GetTriggerUsageResponseSchema: GenMessage<GetTriggerUsageResponse>;
/**
 * Trigger deliveries metered for an environment in one UTC clock hour.
 *
 * @generated from message scalekit.v1.triggers.TriggerUsageHour
 */
export type TriggerUsageHour = Message<"scalekit.v1.triggers.TriggerUsageHour"> & {
    /**
     * @generated from field: string start = 1;
     */
    start: string;
    /**
     * @generated from field: int64 units = 2;
     */
    units: bigint;
};
/**
 * Describes the message scalekit.v1.triggers.TriggerUsageHour.
 * Use `create(TriggerUsageHourSchema)` to create a new message.
 */
export declare const TriggerUsageHourSchema: GenMessage<TriggerUsageHour>;
/**
 * Trigger deliveries metered for an environment on one UTC calendar day.
 *
 * @generated from message scalekit.v1.triggers.TriggerUsageDay
 */
export type TriggerUsageDay = Message<"scalekit.v1.triggers.TriggerUsageDay"> & {
    /**
     * @generated from field: string date = 1;
     */
    date: string;
    /**
     * @generated from field: int64 units = 2;
     */
    units: bigint;
};
/**
 * Describes the message scalekit.v1.triggers.TriggerUsageDay.
 * Use `create(TriggerUsageDaySchema)` to create a new message.
 */
export declare const TriggerUsageDaySchema: GenMessage<TriggerUsageDay>;
/**
 * Where a provider posts a connection's events, and the state of the secret those events are
 * signed with.
 *
 * The signing secret itself is absent by construction, not filtered on the way out. It is stored
 * encrypted under the owning environment's key and is only ever decrypted on the event path to
 * check a signature — so there is no read path that could return it, and masked_signing_secret
 * exists to answer the only question a customer actually has about it: which one is stored.
 *
 * @generated from message scalekit.v1.triggers.TriggerIngressEndpoint
 */
export type TriggerIngressEndpoint = Message<"scalekit.v1.triggers.TriggerIngressEndpoint"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string connection_id = 2;
     */
    connectionId: string;
    /**
     * @generated from field: string url = 3;
     */
    url: string;
    /**
     * @generated from field: bool signing_secret_configured = 4;
     */
    signingSecretConfigured: boolean;
    /**
     * @generated from field: string masked_signing_secret = 5;
     */
    maskedSigningSecret: string;
    /**
     * @generated from field: bool rotation_in_progress = 6;
     */
    rotationInProgress: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp previous_signing_secret_expires_at = 7;
     */
    previousSigningSecretExpiresAt?: Timestamp | undefined;
    /**
     * @generated from field: int64 signing_secret_rotation_id = 8;
     */
    signingSecretRotationId: bigint;
};
/**
 * Describes the message scalekit.v1.triggers.TriggerIngressEndpoint.
 * Use `create(TriggerIngressEndpointSchema)` to create a new message.
 */
export declare const TriggerIngressEndpointSchema: GenMessage<TriggerIngressEndpoint>;
/**
 * @generated from message scalekit.v1.triggers.GetTriggerIngressEndpointRequest
 */
export type GetTriggerIngressEndpointRequest = Message<"scalekit.v1.triggers.GetTriggerIngressEndpointRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
};
/**
 * Describes the message scalekit.v1.triggers.GetTriggerIngressEndpointRequest.
 * Use `create(GetTriggerIngressEndpointRequestSchema)` to create a new message.
 */
export declare const GetTriggerIngressEndpointRequestSchema: GenMessage<GetTriggerIngressEndpointRequest>;
/**
 * @generated from message scalekit.v1.triggers.CreateTriggerIngressEndpointRequest
 */
export type CreateTriggerIngressEndpointRequest = Message<"scalekit.v1.triggers.CreateTriggerIngressEndpointRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
};
/**
 * Describes the message scalekit.v1.triggers.CreateTriggerIngressEndpointRequest.
 * Use `create(CreateTriggerIngressEndpointRequestSchema)` to create a new message.
 */
export declare const CreateTriggerIngressEndpointRequestSchema: GenMessage<CreateTriggerIngressEndpointRequest>;
/**
 * @generated from message scalekit.v1.triggers.SetTriggerSigningSecretRequest
 */
export type SetTriggerSigningSecretRequest = Message<"scalekit.v1.triggers.SetTriggerSigningSecretRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * Write-only. Deliberately given no example: an example value in a public API reference is the
     * one string every reader pastes while testing, and this field takes a live credential.
     *
     * @generated from field: string signing_secret = 2;
     */
    signingSecret: string;
};
/**
 * Describes the message scalekit.v1.triggers.SetTriggerSigningSecretRequest.
 * Use `create(SetTriggerSigningSecretRequestSchema)` to create a new message.
 */
export declare const SetTriggerSigningSecretRequestSchema: GenMessage<SetTriggerSigningSecretRequest>;
/**
 * @generated from message scalekit.v1.triggers.ConfirmTriggerSigningSecretRotationRequest
 */
export type ConfirmTriggerSigningSecretRotationRequest = Message<"scalekit.v1.triggers.ConfirmTriggerSigningSecretRotationRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: int64 signing_secret_rotation_id = 2;
     */
    signingSecretRotationId: bigint;
};
/**
 * Describes the message scalekit.v1.triggers.ConfirmTriggerSigningSecretRotationRequest.
 * Use `create(ConfirmTriggerSigningSecretRotationRequestSchema)` to create a new message.
 */
export declare const ConfirmTriggerSigningSecretRotationRequestSchema: GenMessage<ConfirmTriggerSigningSecretRotationRequest>;
/**
 * @generated from message scalekit.v1.triggers.GenerateTriggerSigningSecretRequest
 */
export type GenerateTriggerSigningSecretRequest = Message<"scalekit.v1.triggers.GenerateTriggerSigningSecretRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
};
/**
 * Describes the message scalekit.v1.triggers.GenerateTriggerSigningSecretRequest.
 * Use `create(GenerateTriggerSigningSecretRequestSchema)` to create a new message.
 */
export declare const GenerateTriggerSigningSecretRequestSchema: GenMessage<GenerateTriggerSigningSecretRequest>;
/**
 * The one response in this API that carries a signing secret in plain text, and the only time
 * the caller ever sees it: the endpoint is rendered by the same masked renderer as every other
 * ingress response, and the plaintext lives only in the two fields beside it.
 *
 * @generated from message scalekit.v1.triggers.GenerateTriggerSigningSecretResponse
 */
export type GenerateTriggerSigningSecretResponse = Message<"scalekit.v1.triggers.GenerateTriggerSigningSecretResponse"> & {
    /**
     * @generated from field: scalekit.v1.triggers.TriggerIngressEndpoint endpoint = 1;
     */
    endpoint?: TriggerIngressEndpoint | undefined;
    /**
     * Plaintext, returned only here. Deliberately given no example: an example value in a public API
     * reference is the one string every reader pastes while testing, and this field is a live credential.
     *
     * @generated from field: string signing_secret = 2;
     */
    signingSecret: string;
    /**
     * Deliberately given no example: the value embeds the live signing secret.
     *
     * @generated from field: string url_with_secret = 3;
     */
    urlWithSecret: string;
};
/**
 * Describes the message scalekit.v1.triggers.GenerateTriggerSigningSecretResponse.
 * Use `create(GenerateTriggerSigningSecretResponseSchema)` to create a new message.
 */
export declare const GenerateTriggerSigningSecretResponseSchema: GenMessage<GenerateTriggerSigningSecretResponse>;
/**
 * @generated from message scalekit.v1.triggers.SyncTriggerDefinitionsRequest
 */
export type SyncTriggerDefinitionsRequest = Message<"scalekit.v1.triggers.SyncTriggerDefinitionsRequest"> & {
    /**
     * @generated from field: string provider = 1;
     */
    provider: string;
    /**
     * @generated from field: repeated google.protobuf.Struct definitions = 2;
     */
    definitions: JsonObject[];
    /**
     * @generated from field: google.protobuf.Struct provider_metadata = 3;
     */
    providerMetadata?: JsonObject | undefined;
};
/**
 * Describes the message scalekit.v1.triggers.SyncTriggerDefinitionsRequest.
 * Use `create(SyncTriggerDefinitionsRequestSchema)` to create a new message.
 */
export declare const SyncTriggerDefinitionsRequestSchema: GenMessage<SyncTriggerDefinitionsRequest>;
/**
 * @generated from message scalekit.v1.triggers.SyncTriggerDefinitionsResponse
 */
export type SyncTriggerDefinitionsResponse = Message<"scalekit.v1.triggers.SyncTriggerDefinitionsResponse"> & {
    /**
     * @generated from field: string provider = 1;
     */
    provider: string;
    /**
     * @generated from field: int32 submitted = 2;
     */
    submitted: number;
    /**
     * @generated from field: int32 stored = 3;
     */
    stored: number;
    /**
     * @generated from field: repeated string skipped_drafts = 4;
     */
    skippedDrafts: string[];
    /**
     * @generated from field: bool identity_declared = 5;
     */
    identityDeclared: boolean;
};
/**
 * Describes the message scalekit.v1.triggers.SyncTriggerDefinitionsResponse.
 * Use `create(SyncTriggerDefinitionsResponseSchema)` to create a new message.
 */
export declare const SyncTriggerDefinitionsResponseSchema: GenMessage<SyncTriggerDefinitionsResponse>;
/**
 * @generated from message scalekit.v1.triggers.ListTriggerDeliveryAttemptsByEndpointRequest
 */
export type ListTriggerDeliveryAttemptsByEndpointRequest = Message<"scalekit.v1.triggers.ListTriggerDeliveryAttemptsByEndpointRequest"> & {
    /**
     * @generated from field: string endpoint_id = 1;
     */
    endpointId: string;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
};
/**
 * Describes the message scalekit.v1.triggers.ListTriggerDeliveryAttemptsByEndpointRequest.
 * Use `create(ListTriggerDeliveryAttemptsByEndpointRequestSchema)` to create a new message.
 */
export declare const ListTriggerDeliveryAttemptsByEndpointRequestSchema: GenMessage<ListTriggerDeliveryAttemptsByEndpointRequest>;
/**
 * @generated from message scalekit.v1.triggers.ListTriggerDeliveryAttemptsByEndpointResponse
 */
export type ListTriggerDeliveryAttemptsByEndpointResponse = Message<"scalekit.v1.triggers.ListTriggerDeliveryAttemptsByEndpointResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.TriggerDeliveryAttempt attempts = 1;
     */
    attempts: TriggerDeliveryAttempt[];
};
/**
 * Describes the message scalekit.v1.triggers.ListTriggerDeliveryAttemptsByEndpointResponse.
 * Use `create(ListTriggerDeliveryAttemptsByEndpointResponseSchema)` to create a new message.
 */
export declare const ListTriggerDeliveryAttemptsByEndpointResponseSchema: GenMessage<ListTriggerDeliveryAttemptsByEndpointResponse>;
/**
 * @generated from message scalekit.v1.triggers.ListTriggerDeliveriesByEndpointRequest
 */
export type ListTriggerDeliveriesByEndpointRequest = Message<"scalekit.v1.triggers.ListTriggerDeliveriesByEndpointRequest"> & {
    /**
     * @generated from field: string endpoint_id = 1;
     */
    endpointId: string;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerDeliveryStatus status = 4;
     */
    status: TriggerDeliveryStatus;
    /**
     * @generated from field: string channel = 5;
     */
    channel: string;
    /**
     * @generated from field: google.protobuf.Timestamp after = 6;
     */
    after?: Timestamp | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp before = 7;
     */
    before?: Timestamp | undefined;
};
/**
 * Describes the message scalekit.v1.triggers.ListTriggerDeliveriesByEndpointRequest.
 * Use `create(ListTriggerDeliveriesByEndpointRequestSchema)` to create a new message.
 */
export declare const ListTriggerDeliveriesByEndpointRequestSchema: GenMessage<ListTriggerDeliveriesByEndpointRequest>;
/**
 * @generated from message scalekit.v1.triggers.ListTriggerDeliveriesByEndpointResponse
 */
export type ListTriggerDeliveriesByEndpointResponse = Message<"scalekit.v1.triggers.ListTriggerDeliveriesByEndpointResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.TriggerDelivery deliveries = 1;
     */
    deliveries: TriggerDelivery[];
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
};
/**
 * Describes the message scalekit.v1.triggers.ListTriggerDeliveriesByEndpointResponse.
 * Use `create(ListTriggerDeliveriesByEndpointResponseSchema)` to create a new message.
 */
export declare const ListTriggerDeliveriesByEndpointResponseSchema: GenMessage<ListTriggerDeliveriesByEndpointResponse>;
/**
 * One trigger event's delivery to one endpoint: a single entry however many attempts it took.
 *
 * @generated from message scalekit.v1.triggers.TriggerDelivery
 */
export type TriggerDelivery = Message<"scalekit.v1.triggers.TriggerDelivery"> & {
    /**
     * @generated from field: string msg_id = 1;
     */
    msgId: string;
    /**
     * @generated from field: string event_id = 2;
     */
    eventId: string;
    /**
     * @generated from field: google.protobuf.Timestamp message_timestamp = 3;
     */
    messageTimestamp?: Timestamp | undefined;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerDeliveryStatus status = 4;
     */
    status: TriggerDeliveryStatus;
    /**
     * @generated from field: google.protobuf.Timestamp next_attempt_at = 5;
     */
    nextAttemptAt?: Timestamp | undefined;
    /**
     * @generated from field: string subscription_id = 6;
     */
    subscriptionId: string;
    /**
     * @generated from field: string trigger_name = 7;
     */
    triggerName: string;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerMode trigger_mode = 8;
     */
    triggerMode: TriggerMode;
    /**
     * @generated from field: string connection_id = 9;
     */
    connectionId: string;
    /**
     * @generated from field: string connection_provider = 10;
     */
    connectionProvider: string;
    /**
     * @generated from field: string connection_key_id = 11;
     */
    connectionKeyId: string;
    /**
     * @generated from field: string endpoint_id = 12;
     */
    endpointId: string;
};
/**
 * Describes the message scalekit.v1.triggers.TriggerDelivery.
 * Use `create(TriggerDeliverySchema)` to create a new message.
 */
export declare const TriggerDeliverySchema: GenMessage<TriggerDelivery>;
/**
 * @generated from message scalekit.v1.triggers.ListTriggerDeliveryAttemptsByMessageRequest
 */
export type ListTriggerDeliveryAttemptsByMessageRequest = Message<"scalekit.v1.triggers.ListTriggerDeliveryAttemptsByMessageRequest"> & {
    /**
     * @generated from field: string endpoint_id = 1;
     */
    endpointId: string;
    /**
     * @generated from field: string msg_id = 2;
     */
    msgId: string;
};
/**
 * Describes the message scalekit.v1.triggers.ListTriggerDeliveryAttemptsByMessageRequest.
 * Use `create(ListTriggerDeliveryAttemptsByMessageRequestSchema)` to create a new message.
 */
export declare const ListTriggerDeliveryAttemptsByMessageRequestSchema: GenMessage<ListTriggerDeliveryAttemptsByMessageRequest>;
/**
 * @generated from message scalekit.v1.triggers.ListTriggerDeliveryAttemptsByMessageResponse
 */
export type ListTriggerDeliveryAttemptsByMessageResponse = Message<"scalekit.v1.triggers.ListTriggerDeliveryAttemptsByMessageResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.TriggerDeliveryAttempt attempts = 1;
     */
    attempts: TriggerDeliveryAttempt[];
    /**
     * @generated from field: bool truncated = 2;
     */
    truncated: boolean;
};
/**
 * Describes the message scalekit.v1.triggers.ListTriggerDeliveryAttemptsByMessageResponse.
 * Use `create(ListTriggerDeliveryAttemptsByMessageResponseSchema)` to create a new message.
 */
export declare const ListTriggerDeliveryAttemptsByMessageResponseSchema: GenMessage<ListTriggerDeliveryAttemptsByMessageResponse>;
/**
 * @generated from message scalekit.v1.triggers.LookupTriggerDeliveryRequest
 */
export type LookupTriggerDeliveryRequest = Message<"scalekit.v1.triggers.LookupTriggerDeliveryRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.triggers.LookupTriggerDeliveryRequest.
 * Use `create(LookupTriggerDeliveryRequestSchema)` to create a new message.
 */
export declare const LookupTriggerDeliveryRequestSchema: GenMessage<LookupTriggerDeliveryRequest>;
/**
 * @generated from message scalekit.v1.triggers.LookupTriggerDeliveryResponse
 */
export type LookupTriggerDeliveryResponse = Message<"scalekit.v1.triggers.LookupTriggerDeliveryResponse"> & {
    /**
     * @generated from field: string msg_id = 1;
     */
    msgId: string;
    /**
     * @generated from field: string event_id = 2;
     */
    eventId: string;
    /**
     * @generated from field: google.protobuf.Timestamp message_timestamp = 3;
     */
    messageTimestamp?: Timestamp | undefined;
    /**
     * @generated from field: string subscription_id = 4;
     */
    subscriptionId: string;
    /**
     * @generated from field: string trigger_name = 5;
     */
    triggerName: string;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerMode trigger_mode = 6;
     */
    triggerMode: TriggerMode;
    /**
     * @generated from field: string connection_id = 7;
     */
    connectionId: string;
    /**
     * @generated from field: string connection_provider = 8;
     */
    connectionProvider: string;
    /**
     * @generated from field: string connection_key_id = 9;
     */
    connectionKeyId: string;
    /**
     * @generated from field: repeated scalekit.v1.triggers.TriggerDeliveryAttempt attempts = 10;
     */
    attempts: TriggerDeliveryAttempt[];
    /**
     * @generated from field: bool truncated = 11;
     */
    truncated: boolean;
};
/**
 * Describes the message scalekit.v1.triggers.LookupTriggerDeliveryResponse.
 * Use `create(LookupTriggerDeliveryResponseSchema)` to create a new message.
 */
export declare const LookupTriggerDeliveryResponseSchema: GenMessage<LookupTriggerDeliveryResponse>;
/**
 * @generated from message scalekit.v1.triggers.BatchLookupTriggerDeliveriesRequest
 */
export type BatchLookupTriggerDeliveriesRequest = Message<"scalekit.v1.triggers.BatchLookupTriggerDeliveriesRequest"> & {
    /**
     * @generated from field: repeated string ids = 1;
     */
    ids: string[];
};
/**
 * Describes the message scalekit.v1.triggers.BatchLookupTriggerDeliveriesRequest.
 * Use `create(BatchLookupTriggerDeliveriesRequestSchema)` to create a new message.
 */
export declare const BatchLookupTriggerDeliveriesRequestSchema: GenMessage<BatchLookupTriggerDeliveriesRequest>;
/**
 * One ID's result within a batch lookup.
 *
 * @generated from message scalekit.v1.triggers.BatchLookupTriggerDeliveryResult
 */
export type BatchLookupTriggerDeliveryResult = Message<"scalekit.v1.triggers.BatchLookupTriggerDeliveryResult"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.triggers.BatchLookupOutcome outcome = 2;
     */
    outcome: BatchLookupOutcome;
    /**
     * @generated from field: string reason = 3;
     */
    reason: string;
    /**
     * @generated from field: scalekit.v1.triggers.LookupTriggerDeliveryResponse delivery = 4;
     */
    delivery?: LookupTriggerDeliveryResponse | undefined;
};
/**
 * Describes the message scalekit.v1.triggers.BatchLookupTriggerDeliveryResult.
 * Use `create(BatchLookupTriggerDeliveryResultSchema)` to create a new message.
 */
export declare const BatchLookupTriggerDeliveryResultSchema: GenMessage<BatchLookupTriggerDeliveryResult>;
/**
 * @generated from message scalekit.v1.triggers.BatchLookupTriggerDeliveriesResponse
 */
export type BatchLookupTriggerDeliveriesResponse = Message<"scalekit.v1.triggers.BatchLookupTriggerDeliveriesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.BatchLookupTriggerDeliveryResult results = 1;
     */
    results: BatchLookupTriggerDeliveryResult[];
    /**
     * @generated from field: uint32 found_count = 2;
     */
    foundCount: number;
};
/**
 * Describes the message scalekit.v1.triggers.BatchLookupTriggerDeliveriesResponse.
 * Use `create(BatchLookupTriggerDeliveriesResponseSchema)` to create a new message.
 */
export declare const BatchLookupTriggerDeliveriesResponseSchema: GenMessage<BatchLookupTriggerDeliveriesResponse>;
/**
 * One delivery to retry: a trigger event and the endpoint to deliver it to again.
 *
 * @generated from message scalekit.v1.triggers.TriggerDeliveryResendTarget
 */
export type TriggerDeliveryResendTarget = Message<"scalekit.v1.triggers.TriggerDeliveryResendTarget"> & {
    /**
     * @generated from field: string msg_id = 1;
     */
    msgId: string;
    /**
     * @generated from field: string endpoint_id = 2;
     */
    endpointId: string;
};
/**
 * Describes the message scalekit.v1.triggers.TriggerDeliveryResendTarget.
 * Use `create(TriggerDeliveryResendTargetSchema)` to create a new message.
 */
export declare const TriggerDeliveryResendTargetSchema: GenMessage<TriggerDeliveryResendTarget>;
/**
 * The deliveries to retry. A repeated msg_id and endpoint_id pair is refused by the service:
 * unique cannot be declared on a list of messages, and sending the pair twice would queue two
 * attempts.
 *
 * @generated from message scalekit.v1.triggers.BatchResendTriggerDeliveriesRequest
 */
export type BatchResendTriggerDeliveriesRequest = Message<"scalekit.v1.triggers.BatchResendTriggerDeliveriesRequest"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.TriggerDeliveryResendTarget targets = 1;
     */
    targets: TriggerDeliveryResendTarget[];
};
/**
 * Describes the message scalekit.v1.triggers.BatchResendTriggerDeliveriesRequest.
 * Use `create(BatchResendTriggerDeliveriesRequestSchema)` to create a new message.
 */
export declare const BatchResendTriggerDeliveriesRequestSchema: GenMessage<BatchResendTriggerDeliveriesRequest>;
/**
 * One target's result within a batch resend.
 *
 * @generated from message scalekit.v1.triggers.BatchResendTriggerDeliveryResult
 */
export type BatchResendTriggerDeliveryResult = Message<"scalekit.v1.triggers.BatchResendTriggerDeliveryResult"> & {
    /**
     * @generated from field: string msg_id = 1;
     */
    msgId: string;
    /**
     * @generated from field: string endpoint_id = 2;
     */
    endpointId: string;
    /**
     * @generated from field: scalekit.v1.triggers.BatchResendOutcome outcome = 3;
     */
    outcome: BatchResendOutcome;
    /**
     * @generated from field: string reason = 4;
     */
    reason: string;
};
/**
 * Describes the message scalekit.v1.triggers.BatchResendTriggerDeliveryResult.
 * Use `create(BatchResendTriggerDeliveryResultSchema)` to create a new message.
 */
export declare const BatchResendTriggerDeliveryResultSchema: GenMessage<BatchResendTriggerDeliveryResult>;
/**
 * @generated from message scalekit.v1.triggers.BatchResendTriggerDeliveriesResponse
 */
export type BatchResendTriggerDeliveriesResponse = Message<"scalekit.v1.triggers.BatchResendTriggerDeliveriesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.triggers.BatchResendTriggerDeliveryResult results = 1;
     */
    results: BatchResendTriggerDeliveryResult[];
    /**
     * @generated from field: uint32 queued_count = 2;
     */
    queuedCount: number;
};
/**
 * Describes the message scalekit.v1.triggers.BatchResendTriggerDeliveriesResponse.
 * Use `create(BatchResendTriggerDeliveriesResponseSchema)` to create a new message.
 */
export declare const BatchResendTriggerDeliveriesResponseSchema: GenMessage<BatchResendTriggerDeliveriesResponse>;
/**
 * The endpoint and the window to recover failed deliveries for.
 *
 * The window rules (since not in the future, until after since and not in the future, at most 14
 * days) are checked by the service rather than by protovalidate, so each refusal carries the fixed
 * message the 400 response documents. 14 days is the delivery application's own limit; checking it
 * here first turns its unexplained 422 into a 400 that names the rule.
 *
 * @generated from message scalekit.v1.triggers.RecoverTriggerDeliveriesRequest
 */
export type RecoverTriggerDeliveriesRequest = Message<"scalekit.v1.triggers.RecoverTriggerDeliveriesRequest"> & {
    /**
     * @generated from field: string endpoint_id = 1;
     */
    endpointId: string;
    /**
     * @generated from field: google.protobuf.Timestamp since = 2;
     */
    since?: Timestamp | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp until = 3;
     */
    until?: Timestamp | undefined;
};
/**
 * Describes the message scalekit.v1.triggers.RecoverTriggerDeliveriesRequest.
 * Use `create(RecoverTriggerDeliveriesRequestSchema)` to create a new message.
 */
export declare const RecoverTriggerDeliveriesRequestSchema: GenMessage<RecoverTriggerDeliveriesRequest>;
/**
 * A recovery that has started. Its outcome is not reported: the delivery application runs it in the
 * background and keeps no record of it that can be read back.
 *
 * @generated from message scalekit.v1.triggers.RecoverTriggerDeliveriesResponse
 */
export type RecoverTriggerDeliveriesResponse = Message<"scalekit.v1.triggers.RecoverTriggerDeliveriesResponse"> & {
    /**
     * @generated from field: string task_id = 1;
     */
    taskId: string;
    /**
     * @generated from field: string status = 2;
     */
    status: string;
};
/**
 * Describes the message scalekit.v1.triggers.RecoverTriggerDeliveriesResponse.
 * Use `create(RecoverTriggerDeliveriesResponseSchema)` to create a new message.
 */
export declare const RecoverTriggerDeliveriesResponseSchema: GenMessage<RecoverTriggerDeliveriesResponse>;
/**
 * @generated from message scalekit.v1.triggers.TriggerDeliveryAttempt
 */
export type TriggerDeliveryAttempt = Message<"scalekit.v1.triggers.TriggerDeliveryAttempt"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string endpoint_id = 2;
     */
    endpointId: string;
    /**
     * @generated from field: string msg_id = 3;
     */
    msgId: string;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerDeliveryAttemptStatus status = 4;
     */
    status: TriggerDeliveryAttemptStatus;
    /**
     * @generated from field: int32 response_status_code = 5;
     */
    responseStatusCode: number;
    /**
     * @generated from field: string response = 6;
     */
    response: string;
    /**
     * @generated from field: google.protobuf.Timestamp timestamp = 7;
     */
    timestamp?: Timestamp | undefined;
    /**
     * @generated from field: int32 response_duration_ms = 8;
     */
    responseDurationMs: number;
    /**
     * @generated from field: scalekit.v1.triggers.TriggerDeliveryAttemptTriggerType trigger_type = 9;
     */
    triggerType: TriggerDeliveryAttemptTriggerType;
    /**
     * @generated from field: bool response_truncated = 10;
     */
    responseTruncated: boolean;
    /**
     * @generated from field: string endpoint_url = 11;
     */
    endpointUrl: string;
};
/**
 * Describes the message scalekit.v1.triggers.TriggerDeliveryAttempt.
 * Use `create(TriggerDeliveryAttemptSchema)` to create a new message.
 */
export declare const TriggerDeliveryAttemptSchema: GenMessage<TriggerDeliveryAttempt>;
/**
 * @generated from message scalekit.v1.triggers.TriggerWebhookWrapperRequest
 */
export type TriggerWebhookWrapperRequest = Message<"scalekit.v1.triggers.TriggerWebhookWrapperRequest"> & {
    /**
     * @generated from field: optional google.protobuf.Struct request_body = 1;
     */
    requestBody?: JsonObject | undefined;
};
/**
 * Describes the message scalekit.v1.triggers.TriggerWebhookWrapperRequest.
 * Use `create(TriggerWebhookWrapperRequestSchema)` to create a new message.
 */
export declare const TriggerWebhookWrapperRequestSchema: GenMessage<TriggerWebhookWrapperRequest>;
/**
 * How a trigger detects that something happened.
 *
 * @generated from enum scalekit.v1.triggers.TriggerMode
 */
export declare enum TriggerMode {
    /**
     * @generated from enum value: TRIGGER_MODE_UNSPECIFIED = 0;
     */
    TRIGGER_MODE_UNSPECIFIED = 0,
    /**
     * The provider posts to a Scalekit URL when the event occurs.
     *
     * @generated from enum value: WEBHOOK = 1;
     */
    WEBHOOK = 1,
    /**
     * Scalekit walks the provider's list on a cadence.
     *
     * @generated from enum value: POLL = 2;
     */
    POLL = 2
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerMode.
 */
export declare const TriggerModeSchema: GenEnum<TriggerMode>;
/**
 * Whether a trigger delivers once per connected account or once for the whole connection.
 *
 * A property of the trigger definition, not a customer choice: a polled trigger cannot be
 * connection-scoped, because each account-scoped subscription polls on its own account's
 * credential and carries its own cursor.
 *
 * @generated from enum scalekit.v1.triggers.TriggerDeliveryScope
 */
export declare enum TriggerDeliveryScope {
    /**
     * @generated from enum value: TRIGGER_DELIVERY_SCOPE_UNSPECIFIED = 0;
     */
    TRIGGER_DELIVERY_SCOPE_UNSPECIFIED = 0,
    /**
     * One event per subscribed connected account. For a webhook trigger, only when the account's
     * captured workspace and user both match the event's; a polled trigger polls per account, on
     * that account's own credential. Subscribed on a specific connected account.
     *
     * @generated from enum value: ACCOUNT = 1;
     */
    ACCOUNT = 1,
    /**
     * One event for the whole connection, whatever accounts exist on it. Subscribed on the
     * connection itself, naming no account.
     *
     * @generated from enum value: CONNECTION = 2;
     */
    CONNECTION = 2
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerDeliveryScope.
 */
export declare const TriggerDeliveryScopeSchema: GenEnum<TriggerDeliveryScope>;
/**
 * Whether a trigger works on a connection that uses Scalekit's shared provider app.
 *
 * @generated from enum scalekit.v1.triggers.TriggerPlatformCredentials
 */
export declare enum TriggerPlatformCredentials {
    /**
     * @generated from enum value: TRIGGER_PLATFORM_CREDENTIALS_UNSPECIFIED = 0;
     */
    TRIGGER_PLATFORM_CREDENTIALS_UNSPECIFIED = 0,
    /**
     * The trigger works on Scalekit's shared provider app as well as on the customer's own app.
     *
     * @generated from enum value: SUPPORTED = 1;
     */
    SUPPORTED = 1,
    /**
     * The trigger needs the customer's own provider app on the connection — for example because a
     * webhook URL is registered against the app, and the shared app has only one.
     *
     * @generated from enum value: UNSUPPORTED = 2;
     */
    UNSUPPORTED = 2
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerPlatformCredentials.
 */
export declare const TriggerPlatformCredentialsSchema: GenEnum<TriggerPlatformCredentials>;
/**
 * Which connection-level rule made a trigger unavailable, as a stable code a client can branch on
 * instead of parsing the human-readable reason.
 *
 * @generated from enum scalekit.v1.triggers.TriggerRefusalCode
 */
export declare enum TriggerRefusalCode {
    /**
     * @generated from enum value: TRIGGER_REFUSAL_CODE_UNSPECIFIED = 0;
     */
    TRIGGER_REFUSAL_CODE_UNSPECIFIED = 0,
    /**
     * The connection uses Scalekit's shared provider app and the trigger needs the customer's own.
     *
     * @generated from enum value: SHARED_APP = 1;
     */
    SHARED_APP = 1,
    /**
     * The trigger is polled and connection-scoped, which the poll path does not support.
     *
     * @generated from enum value: POLL_CONNECTION_SCOPE = 2;
     */
    POLL_CONNECTION_SCOPE = 2
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerRefusalCode.
 */
export declare const TriggerRefusalCodeSchema: GenEnum<TriggerRefusalCode>;
/**
 * A connected account's own state, evaluated for what the trigger in question routes by: a webhook
 * trigger needs the provider workspace captured, and an account-scoped webhook trigger the provider
 * user too.
 *
 * @generated from enum scalekit.v1.triggers.AccountHealthState
 */
export declare enum AccountHealthState {
    /**
     * @generated from enum value: ACCOUNT_HEALTH_STATE_UNSPECIFIED = 0;
     */
    ACCOUNT_HEALTH_STATE_UNSPECIFIED = 0,
    /**
     * The account can receive triggers.
     *
     * @generated from enum value: READY = 1;
     */
    READY = 1,
    /**
     * Connected and working, but Scalekit has not confirmed which provider workspace or user it
     * belongs to, so inbound events cannot be routed to it.
     *
     * @generated from enum value: AWAITING_CONFIRMATION = 2;
     */
    AWAITING_CONFIRMATION = 2,
    /**
     * Authorized under a different OAuth app than the connection now uses.
     *
     * @generated from enum value: WRONG_APP = 3;
     */
    WRONG_APP = 3,
    /**
     * The provider identity was revoked.
     *
     * @generated from enum value: DISCONNECTED = 4;
     */
    DISCONNECTED = 4,
    /**
     * The credential itself is unusable.
     *
     * @generated from enum value: NEEDS_REAUTHENTICATION = 5;
     */
    NEEDS_REAUTHENTICATION = 5
}
/**
 * Describes the enum scalekit.v1.triggers.AccountHealthState.
 */
export declare const AccountHealthStateSchema: GenEnum<AccountHealthState>;
/**
 * The single action that resolves an account's health state.
 *
 * @generated from enum scalekit.v1.triggers.AccountHealthAction
 */
export declare enum AccountHealthAction {
    /**
     * Nothing to do — the account is ready.
     *
     * @generated from enum value: ACCOUNT_HEALTH_ACTION_UNSPECIFIED = 0;
     */
    ACCOUNT_HEALTH_ACTION_UNSPECIFIED = 0,
    /**
     * @generated from enum value: RECONNECT = 1;
     */
    RECONNECT = 1,
    /**
     * @generated from enum value: COMPLETE_SETUP = 2;
     */
    COMPLETE_SETUP = 2
}
/**
 * Describes the enum scalekit.v1.triggers.AccountHealthAction.
 */
export declare const AccountHealthActionSchema: GenEnum<AccountHealthAction>;
/**
 * Why a subscription is or is not currently delivering.
 *
 * @generated from enum scalekit.v1.triggers.TriggerSubscriptionStatus
 */
export declare enum TriggerSubscriptionStatus {
    /**
     * @generated from enum value: TRIGGER_SUBSCRIPTION_STATUS_UNSPECIFIED = 0;
     */
    TRIGGER_SUBSCRIPTION_STATUS_UNSPECIFIED = 0,
    /**
     * @generated from enum value: ACTIVE = 1;
     */
    ACTIVE = 1,
    /**
     * Running slower than requested, not stopped. Still delivering.
     *
     * @generated from enum value: THROTTLED = 2;
     */
    THROTTLED = 2,
    /**
     * Stopped by the customer.
     *
     * @generated from enum value: PAUSED = 3;
     */
    PAUSED = 3,
    /**
     * Stopped because the account's credential no longer works. Distinct from PAUSED so the two
     * have distinguishable explanations for missing events.
     *
     * @generated from enum value: PAUSED_CREDENTIAL = 4;
     */
    PAUSED_CREDENTIAL = 4
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerSubscriptionStatus.
 */
export declare const TriggerSubscriptionStatusSchema: GenEnum<TriggerSubscriptionStatus>;
/**
 * Why a poll subscription's most recent run failed.
 *
 * @generated from enum scalekit.v1.triggers.TriggerPollErrorCode
 */
export declare enum TriggerPollErrorCode {
    /**
     * The most recent run succeeded, or no run has happened yet.
     *
     * @generated from enum value: TRIGGER_POLL_ERROR_CODE_UNSPECIFIED = 0;
     */
    TRIGGER_POLL_ERROR_CODE_UNSPECIFIED = 0,
    /**
     * The provider asked Scalekit to slow down. Polling resumes after backoff_until.
     *
     * @generated from enum value: RATE_LIMITED = 1;
     */
    RATE_LIMITED = 1,
    /**
     * The connected account's authorization was revoked or has expired. Reconnect the account.
     *
     * @generated from enum value: CREDENTIAL_REVOKED = 2;
     */
    CREDENTIAL_REVOKED = 2,
    /**
     * The subscription's configuration does not produce a valid request for this trigger. Update the
     * subscription's configuration.
     *
     * @generated from enum value: INVALID_CONFIGURATION = 3;
     */
    INVALID_CONFIGURATION = 3,
    /**
     * The provider returned an error. Retried on the next run.
     *
     * @generated from enum value: PROVIDER_ERROR = 4;
     */
    PROVIDER_ERROR = 4,
    /**
     * Events could not be handed to the delivery service. Retried on the next run.
     *
     * @generated from enum value: DELIVERY_FAILED = 5;
     */
    DELIVERY_FAILED = 5,
    /**
     * The run timed out before it finished. Retried on the next run.
     *
     * @generated from enum value: TIMED_OUT = 6;
     */
    TIMED_OUT = 6,
    /**
     * The run failed for a reason none of the other codes describes. Retried on the next run.
     *
     * @generated from enum value: POLL_FAILED = 7;
     */
    POLL_FAILED = 7
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerPollErrorCode.
 */
export declare const TriggerPollErrorCodeSchema: GenEnum<TriggerPollErrorCode>;
/**
 * What happened to one account in a batch.
 *
 * @generated from enum scalekit.v1.triggers.BatchSubscribeOutcome
 */
export declare enum BatchSubscribeOutcome {
    /**
     * @generated from enum value: BATCH_SUBSCRIBE_OUTCOME_UNSPECIFIED = 0;
     */
    BATCH_SUBSCRIBE_OUTCOME_UNSPECIFIED = 0,
    /**
     * A subscription was created for this account.
     *
     * @generated from enum value: CREATED = 1;
     */
    CREATED = 1,
    /**
     * This account already had a subscription to this trigger with this exact filter. The existing
     * subscription is returned. Not an error — it is what makes retrying a partly-failed batch safe.
     *
     * @generated from enum value: ALREADY_SUBSCRIBED = 2;
     */
    ALREADY_SUBSCRIBED = 2,
    /**
     * This account cannot receive this trigger. reason and remedy say why and what to do.
     *
     * @generated from enum value: REFUSED = 3;
     */
    REFUSED = 3,
    /**
     * No such account on this connection, in this environment.
     *
     * @generated from enum value: NOT_FOUND = 4;
     */
    NOT_FOUND = 4,
    /**
     * The attempt failed for a reason unrelated to this account — nothing was created for it, and
     * retrying it may succeed.
     *
     * @generated from enum value: FAILED = 5;
     */
    FAILED = 5
}
/**
 * Describes the enum scalekit.v1.triggers.BatchSubscribeOutcome.
 */
export declare const BatchSubscribeOutcomeSchema: GenEnum<BatchSubscribeOutcome>;
/**
 * What happened to one subscription in a batch delete.
 *
 * @generated from enum scalekit.v1.triggers.BatchDeleteOutcome
 */
export declare enum BatchDeleteOutcome {
    /**
     * @generated from enum value: BATCH_DELETE_OUTCOME_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * The subscription was deleted by this call.
     *
     * @generated from enum value: BATCH_DELETE_OUTCOME_DELETED = 1;
     */
    DELETED = 1,
    /**
     * No such subscription on this connection in this environment — including one an earlier
     * attempt already deleted, which is what makes retrying the whole batch safe. Another
     * connection's or another tenant's subscription is reported exactly like a missing one.
     *
     * @generated from enum value: BATCH_DELETE_OUTCOME_NOT_FOUND = 2;
     */
    NOT_FOUND = 2,
    /**
     * The delete could not be completed. It may or may not have happened; retrying is safe and
     * answers DELETED or NOT_FOUND.
     *
     * @generated from enum value: BATCH_DELETE_OUTCOME_FAILED = 3;
     */
    FAILED = 3,
    /**
     * The request ran out of time before this subscription was reached. Nothing was changed for
     * it; send it again.
     *
     * @generated from enum value: BATCH_DELETE_OUTCOME_NOT_ATTEMPTED = 4;
     */
    NOT_ATTEMPTED = 4
}
/**
 * Describes the enum scalekit.v1.triggers.BatchDeleteOutcome.
 */
export declare const BatchDeleteOutcomeSchema: GenEnum<BatchDeleteOutcome>;
/**
 * The size of each entry in a trigger usage response.
 *
 * @generated from enum scalekit.v1.triggers.TriggerUsageBucket
 */
export declare enum TriggerUsageBucket {
    /**
     * The request used from and to. Those counts are by UTC day, in days.
     *
     * @generated from enum value: TRIGGER_USAGE_BUCKET_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * One entry per UTC calendar day, in days. Returned for period 7d and 30d.
     *
     * @generated from enum value: TRIGGER_USAGE_BUCKET_DAY = 1;
     */
    DAY = 1,
    /**
     * One entry per UTC clock hour, in hours. Returned for period 24h.
     *
     * @generated from enum value: TRIGGER_USAGE_BUCKET_HOUR = 2;
     */
    HOUR = 2
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerUsageBucket.
 */
export declare const TriggerUsageBucketSchema: GenEnum<TriggerUsageBucket>;
/**
 * The state of one trigger event's delivery to one endpoint, across all its attempts.
 *
 * Numbered independently of the delivery application's own status integers, which start at zero
 * for delivered and would otherwise collide with the unspecified sentinel. The service maps them.
 * The values carry the enum's name as a prefix because enum values share one namespace across this
 * package, where PENDING and FAILED are already taken.
 *
 * @generated from enum scalekit.v1.triggers.TriggerDeliveryStatus
 */
export declare enum TriggerDeliveryStatus {
    /**
     * @generated from enum value: TRIGGER_DELIVERY_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * An attempt succeeded. No further attempt is made.
     *
     * @generated from enum value: TRIGGER_DELIVERY_STATUS_DELIVERED = 1;
     */
    DELIVERED = 1,
    /**
     * Accepted for delivery; no attempt has finished yet.
     *
     * @generated from enum value: TRIGGER_DELIVERY_STATUS_PENDING = 2;
     */
    PENDING = 2,
    /**
     * Every scheduled attempt failed. No further attempt is made unless one is started by hand.
     *
     * @generated from enum value: TRIGGER_DELIVERY_STATUS_FAILED = 3;
     */
    FAILED = 3,
    /**
     * An attempt failed and another is scheduled, at next_attempt_at.
     *
     * @generated from enum value: TRIGGER_DELIVERY_STATUS_RETRYING = 4;
     */
    RETRYING = 4
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerDeliveryStatus.
 */
export declare const TriggerDeliveryStatusSchema: GenEnum<TriggerDeliveryStatus>;
/**
 * What happened to one ID in a batch lookup.
 *
 * @generated from enum scalekit.v1.triggers.BatchLookupOutcome
 */
export declare enum BatchLookupOutcome {
    /**
     * @generated from enum value: BATCH_LOOKUP_OUTCOME_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * The event was found; the result's delivery holds it.
     *
     * @generated from enum value: BATCH_LOOKUP_OUTCOME_FOUND = 1;
     */
    FOUND = 1,
    /**
     * No trigger event with this message ID or event ID exists in this environment's trigger
     * delivery application. An ID from another environment is reported exactly like a missing one.
     *
     * @generated from enum value: BATCH_LOOKUP_OUTCOME_NOT_FOUND = 2;
     */
    NOT_FOUND = 2,
    /**
     * The trigger delivery application refused the read for volume. The batch stops: every ID that
     * had not started by then is NOT_ATTEMPTED, wherever it sits in the list.
     *
     * @generated from enum value: BATCH_LOOKUP_OUTCOME_RATE_LIMITED = 3;
     */
    RATE_LIMITED = 3,
    /**
     * The lookup could not be completed; retrying may succeed.
     *
     * @generated from enum value: BATCH_LOOKUP_OUTCOME_FAILED = 4;
     */
    FAILED = 4,
    /**
     * Not looked up, because an earlier ID was rate limited or the request ran out of time.
     *
     * @generated from enum value: BATCH_LOOKUP_OUTCOME_NOT_ATTEMPTED = 5;
     */
    NOT_ATTEMPTED = 5
}
/**
 * Describes the enum scalekit.v1.triggers.BatchLookupOutcome.
 */
export declare const BatchLookupOutcomeSchema: GenEnum<BatchLookupOutcome>;
/**
 * What happened to one target in a batch resend.
 *
 * @generated from enum scalekit.v1.triggers.BatchResendOutcome
 */
export declare enum BatchResendOutcome {
    /**
     * @generated from enum value: BATCH_RESEND_OUTCOME_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * A new manual delivery attempt was queued. Not yet delivered: its outcome appears with the
     * message's other attempts.
     *
     * @generated from enum value: BATCH_RESEND_OUTCOME_QUEUED = 1;
     */
    QUEUED = 1,
    /**
     * The message or the endpoint does not exist in this environment's trigger delivery
     * application. Another environment's IDs are reported exactly like missing ones.
     *
     * @generated from enum value: BATCH_RESEND_OUTCOME_NOT_FOUND = 2;
     */
    NOT_FOUND = 2,
    /**
     * Refused for volume. The batch stops: every target that had not started by then is
     * NOT_ATTEMPTED, wherever it sits in the list.
     *
     * @generated from enum value: BATCH_RESEND_OUTCOME_RATE_LIMITED = 3;
     */
    RATE_LIMITED = 3,
    /**
     * No new attempt could be confirmed as queued. A target whose request timed out may still have
     * been queued, so retrying it can queue a second attempt. A target whose event payload is no
     * longer stored is also FAILED, and resending it can never succeed; its reason says so.
     *
     * @generated from enum value: BATCH_RESEND_OUTCOME_FAILED = 4;
     */
    FAILED = 4,
    /**
     * Not sent, because an earlier target was rate limited or the request ran out of time. Nothing
     * was queued for it.
     *
     * @generated from enum value: BATCH_RESEND_OUTCOME_NOT_ATTEMPTED = 5;
     */
    NOT_ATTEMPTED = 5
}
/**
 * Describes the enum scalekit.v1.triggers.BatchResendOutcome.
 */
export declare const BatchResendOutcomeSchema: GenEnum<BatchResendOutcome>;
/**
 * Why a delivery attempt was made.
 *
 * @generated from enum scalekit.v1.triggers.TriggerDeliveryAttemptTriggerType
 */
export declare enum TriggerDeliveryAttemptTriggerType {
    /**
     * @generated from enum value: TRIGGER_DELIVERY_ATTEMPT_TRIGGER_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * The first attempt or an automatic retry on the delivery schedule.
     *
     * @generated from enum value: TRIGGER_DELIVERY_ATTEMPT_TRIGGER_TYPE_SCHEDULED = 1;
     */
    SCHEDULED = 1,
    /**
     * A retry someone started by hand.
     *
     * @generated from enum value: TRIGGER_DELIVERY_ATTEMPT_TRIGGER_TYPE_MANUAL = 2;
     */
    MANUAL = 2
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerDeliveryAttemptTriggerType.
 */
export declare const TriggerDeliveryAttemptTriggerTypeSchema: GenEnum<TriggerDeliveryAttemptTriggerType>;
/**
 * The outcome of one delivery attempt.
 *
 * Numbered independently of the delivery application's own status integers, which start at zero
 * for success and would otherwise collide with the unspecified sentinel. The service maps them.
 *
 * @generated from enum scalekit.v1.triggers.TriggerDeliveryAttemptStatus
 */
export declare enum TriggerDeliveryAttemptStatus {
    /**
     * @generated from enum value: TRIGGER_DELIVERY_ATTEMPT_STATUS_UNSPECIFIED = 0;
     */
    TRIGGER_DELIVERY_ATTEMPT_STATUS_UNSPECIFIED = 0,
    /**
     * @generated from enum value: SUCCESS = 1;
     */
    SUCCESS = 1,
    /**
     * @generated from enum value: PENDING = 2;
     */
    PENDING = 2,
    /**
     * @generated from enum value: FAIL = 3;
     */
    FAIL = 3,
    /**
     * @generated from enum value: SENDING = 4;
     */
    SENDING = 4,
    /**
     * @generated from enum value: CANCELED = 5;
     */
    CANCELED = 5
}
/**
 * Describes the enum scalekit.v1.triggers.TriggerDeliveryAttemptStatus.
 */
export declare const TriggerDeliveryAttemptStatusSchema: GenEnum<TriggerDeliveryAttemptStatus>;
/**
 * AgentKit Triggers — third-party events delivered to a customer's agent.
 *
 * Everything a client renders comes from these RPCs and nothing else. That is the property the
 * contract exists to protect: adding a connector must require no client change, which only holds
 * if every difference between connectors — detection mode, setup style, required scopes, config
 * fields, and whether a trigger is usable at all on a given connection — is described in data
 * rather than in the client's own code.
 *
 * @generated from service scalekit.v1.triggers.TriggerService
 */
export declare const TriggerService: GenService<{
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.ListAvailableTriggers
     */
    listAvailableTriggers: {
        methodKind: "unary";
        input: typeof ListAvailableTriggersRequestSchema;
        output: typeof ListAvailableTriggersResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.ListEligibleAccounts
     */
    listEligibleAccounts: {
        methodKind: "unary";
        input: typeof ListEligibleAccountsRequestSchema;
        output: typeof ListEligibleAccountsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.ListTriggerSubscriptions
     */
    listTriggerSubscriptions: {
        methodKind: "unary";
        input: typeof ListTriggerSubscriptionsRequestSchema;
        output: typeof ListTriggerSubscriptionsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.CreateTriggerSubscription
     */
    createTriggerSubscription: {
        methodKind: "unary";
        input: typeof CreateTriggerSubscriptionRequestSchema;
        output: typeof TriggerSubscriptionSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.BatchCreateTriggerSubscriptions
     */
    batchCreateTriggerSubscriptions: {
        methodKind: "unary";
        input: typeof BatchCreateTriggerSubscriptionsRequestSchema;
        output: typeof BatchCreateTriggerSubscriptionsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.DeleteTriggerSubscription
     */
    deleteTriggerSubscription: {
        methodKind: "unary";
        input: typeof DeleteTriggerSubscriptionRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.BatchDeleteTriggerSubscriptions
     */
    batchDeleteTriggerSubscriptions: {
        methodKind: "unary";
        input: typeof BatchDeleteTriggerSubscriptionsRequestSchema;
        output: typeof BatchDeleteTriggerSubscriptionsResponseSchema;
    };
    /**
     * GetTriggerActivity retrieves counts of what happened to this environment's trigger events
     * over the last day.
     *
     * @generated from rpc scalekit.v1.triggers.TriggerService.GetTriggerActivity
     */
    getTriggerActivity: {
        methodKind: "unary";
        input: typeof GetTriggerActivityRequestSchema;
        output: typeof GetTriggerActivityResponseSchema;
    };
    /**
     * GetTriggerUsage reads the trigger deliveries Metronome metered for this environment, either for
     * a preset period ending now (by the hour for 24h, by UTC day for 7d and 30d) or on each UTC day
     * of a date range, cut to the days that can be read: today and the 30 days before it.
     *
     * @generated from rpc scalekit.v1.triggers.TriggerService.GetTriggerUsage
     */
    getTriggerUsage: {
        methodKind: "unary";
        input: typeof GetTriggerUsageRequestSchema;
        output: typeof GetTriggerUsageResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.GetTriggerIngressEndpoint
     */
    getTriggerIngressEndpoint: {
        methodKind: "unary";
        input: typeof GetTriggerIngressEndpointRequestSchema;
        output: typeof TriggerIngressEndpointSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.CreateTriggerIngressEndpoint
     */
    createTriggerIngressEndpoint: {
        methodKind: "unary";
        input: typeof CreateTriggerIngressEndpointRequestSchema;
        output: typeof TriggerIngressEndpointSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.SetTriggerSigningSecret
     */
    setTriggerSigningSecret: {
        methodKind: "unary";
        input: typeof SetTriggerSigningSecretRequestSchema;
        output: typeof TriggerIngressEndpointSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.ConfirmTriggerSigningSecretRotation
     */
    confirmTriggerSigningSecretRotation: {
        methodKind: "unary";
        input: typeof ConfirmTriggerSigningSecretRotationRequestSchema;
        output: typeof TriggerIngressEndpointSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.GenerateTriggerSigningSecret
     */
    generateTriggerSigningSecret: {
        methodKind: "unary";
        input: typeof GenerateTriggerSigningSecretRequestSchema;
        output: typeof GenerateTriggerSigningSecretResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.SyncTriggerDefinitions
     */
    syncTriggerDefinitions: {
        methodKind: "unary";
        input: typeof SyncTriggerDefinitionsRequestSchema;
        output: typeof SyncTriggerDefinitionsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.ListTriggerDeliveryAttemptsByEndpoint
     */
    listTriggerDeliveryAttemptsByEndpoint: {
        methodKind: "unary";
        input: typeof ListTriggerDeliveryAttemptsByEndpointRequestSchema;
        output: typeof ListTriggerDeliveryAttemptsByEndpointResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.ListTriggerDeliveriesByEndpoint
     */
    listTriggerDeliveriesByEndpoint: {
        methodKind: "unary";
        input: typeof ListTriggerDeliveriesByEndpointRequestSchema;
        output: typeof ListTriggerDeliveriesByEndpointResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.ListTriggerDeliveryAttemptsByMessage
     */
    listTriggerDeliveryAttemptsByMessage: {
        methodKind: "unary";
        input: typeof ListTriggerDeliveryAttemptsByMessageRequestSchema;
        output: typeof ListTriggerDeliveryAttemptsByMessageResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.LookupTriggerDelivery
     */
    lookupTriggerDelivery: {
        methodKind: "unary";
        input: typeof LookupTriggerDeliveryRequestSchema;
        output: typeof LookupTriggerDeliveryResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.BatchLookupTriggerDeliveries
     */
    batchLookupTriggerDeliveries: {
        methodKind: "unary";
        input: typeof BatchLookupTriggerDeliveriesRequestSchema;
        output: typeof BatchLookupTriggerDeliveriesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.BatchResendTriggerDeliveries
     */
    batchResendTriggerDeliveries: {
        methodKind: "unary";
        input: typeof BatchResendTriggerDeliveriesRequestSchema;
        output: typeof BatchResendTriggerDeliveriesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.RecoverTriggerDeliveries
     */
    recoverTriggerDeliveries: {
        methodKind: "unary";
        input: typeof RecoverTriggerDeliveriesRequestSchema;
        output: typeof RecoverTriggerDeliveriesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.triggers.TriggerService.TriggerWebhookWrapper
     */
    triggerWebhookWrapper: {
        methodKind: "unary";
        input: typeof TriggerWebhookWrapperRequestSchema;
        output: typeof StructSchema;
    };
}>;
