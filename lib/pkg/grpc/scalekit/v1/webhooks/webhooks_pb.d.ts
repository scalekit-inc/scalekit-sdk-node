import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { StructSchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/webhooks/webhooks.proto.
 */
export declare const file_scalekit_v1_webhooks_webhooks: GenFile;
/**
 * @generated from message scalekit.v1.webhooks.SendTestEventRequest
 */
export type SendTestEventRequest = Message<"scalekit.v1.webhooks.SendTestEventRequest"> & {
    /**
     * @generated from field: string event_type = 1;
     */
    eventType: string;
};
/**
 * Describes the message scalekit.v1.webhooks.SendTestEventRequest.
 * Use `create(SendTestEventRequestSchema)` to create a new message.
 */
export declare const SendTestEventRequestSchema: GenMessage<SendTestEventRequest>;
/**
 * @generated from message scalekit.v1.webhooks.SendTestEventResponse
 */
export type SendTestEventResponse = Message<"scalekit.v1.webhooks.SendTestEventResponse"> & {
    /**
     * @generated from field: string event_type = 1;
     */
    eventType: string;
    /**
     * @generated from field: google.protobuf.Struct event_payload = 2;
     */
    eventPayload?: JsonObject;
};
/**
 * Describes the message scalekit.v1.webhooks.SendTestEventResponse.
 * Use `create(SendTestEventResponseSchema)` to create a new message.
 */
export declare const SendTestEventResponseSchema: GenMessage<SendTestEventResponse>;
/**
 * @generated from message scalekit.v1.webhooks.GetPortalURLRequest
 */
export type GetPortalURLRequest = Message<"scalekit.v1.webhooks.GetPortalURLRequest"> & {};
/**
 * Describes the message scalekit.v1.webhooks.GetPortalURLRequest.
 * Use `create(GetPortalURLRequestSchema)` to create a new message.
 */
export declare const GetPortalURLRequestSchema: GenMessage<GetPortalURLRequest>;
/**
 * @generated from message scalekit.v1.webhooks.GetPortalURLResponse
 */
export type GetPortalURLResponse = Message<"scalekit.v1.webhooks.GetPortalURLResponse"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
};
/**
 * Describes the message scalekit.v1.webhooks.GetPortalURLResponse.
 * Use `create(GetPortalURLResponseSchema)` to create a new message.
 */
export declare const GetPortalURLResponseSchema: GenMessage<GetPortalURLResponse>;
/**
 * @generated from message scalekit.v1.webhooks.WebhookWrapperRequest
 */
export type WebhookWrapperRequest = Message<"scalekit.v1.webhooks.WebhookWrapperRequest"> & {
    /**
     * @generated from field: optional google.protobuf.Struct request_body = 1;
     */
    requestBody?: JsonObject;
};
/**
 * Describes the message scalekit.v1.webhooks.WebhookWrapperRequest.
 * Use `create(WebhookWrapperRequestSchema)` to create a new message.
 */
export declare const WebhookWrapperRequestSchema: GenMessage<WebhookWrapperRequest>;
/**
 * @generated from message scalekit.v1.webhooks.WebhookWrapperResponse
 */
export type WebhookWrapperResponse = Message<"scalekit.v1.webhooks.WebhookWrapperResponse"> & {
    /**
     * @generated from field: google.protobuf.Struct response_body = 1;
     */
    responseBody?: JsonObject;
};
/**
 * Describes the message scalekit.v1.webhooks.WebhookWrapperResponse.
 * Use `create(WebhookWrapperResponseSchema)` to create a new message.
 */
export declare const WebhookWrapperResponseSchema: GenMessage<WebhookWrapperResponse>;
/**
 * Generic event wrapper, useful for routing and versioning.
 *
 * @generated from message scalekit.v1.webhooks.WebhookEvent
 */
export type WebhookEvent = Message<"scalekit.v1.webhooks.WebhookEvent"> & {
    /**
     * @generated from field: string spec_version = 1;
     */
    specVersion: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.webhooks.ObjectType object = 3;
     */
    object: ObjectType;
    /**
     * @generated from field: google.protobuf.Timestamp occurred_at = 4;
     */
    occurredAt?: Timestamp;
    /**
     * @generated from field: string environment_id = 6;
     */
    environmentId: string;
    /**
     * @generated from field: optional string organization_id = 5;
     */
    organizationId?: string;
    /**
     * @generated from field: scalekit.v1.webhooks.EventType type = 7;
     */
    type: EventType;
    /**
     * @generated from oneof scalekit.v1.webhooks.WebhookEvent.data
     */
    data: {
        /**
         * @generated from field: scalekit.v1.webhooks.OrganizationEventData organization = 8;
         */
        value: OrganizationEventData;
        case: "organization";
    } | {
        /**
         * @generated from field: scalekit.v1.webhooks.UserEventData user = 9;
         */
        value: UserEventData;
        case: "user";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message scalekit.v1.webhooks.WebhookEvent.
 * Use `create(WebhookEventSchema)` to create a new message.
 */
export declare const WebhookEventSchema: GenMessage<WebhookEvent>;
/**
 * @generated from message scalekit.v1.webhooks.Empty
 */
export type Empty = Message<"scalekit.v1.webhooks.Empty"> & {};
/**
 * Describes the message scalekit.v1.webhooks.Empty.
 * Use `create(EmptySchema)` to create a new message.
 */
export declare const EmptySchema: GenMessage<Empty>;
/**
 * Organization event data structure
 *
 * @generated from message scalekit.v1.webhooks.OrganizationEventData
 */
export type OrganizationEventData = Message<"scalekit.v1.webhooks.OrganizationEventData"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: optional string external_id = 2;
     */
    externalId?: string;
    /**
     * @generated from field: optional google.protobuf.Struct metadata = 3;
     */
    metadata?: JsonObject;
    /**
     * @generated from field: scalekit.v1.webhooks.OrganizationSettings settings = 4;
     */
    settings?: OrganizationSettings;
};
/**
 * Describes the message scalekit.v1.webhooks.OrganizationEventData.
 * Use `create(OrganizationEventDataSchema)` to create a new message.
 */
export declare const OrganizationEventDataSchema: GenMessage<OrganizationEventData>;
/**
 * @generated from message scalekit.v1.webhooks.OrganizationSettings
 */
export type OrganizationSettings = Message<"scalekit.v1.webhooks.OrganizationSettings"> & {
    /**
     * @generated from field: repeated scalekit.v1.webhooks.FeatureFlag features = 1;
     */
    features: FeatureFlag[];
};
/**
 * Describes the message scalekit.v1.webhooks.OrganizationSettings.
 * Use `create(OrganizationSettingsSchema)` to create a new message.
 */
export declare const OrganizationSettingsSchema: GenMessage<OrganizationSettings>;
/**
 * @generated from message scalekit.v1.webhooks.FeatureFlag
 */
export type FeatureFlag = Message<"scalekit.v1.webhooks.FeatureFlag"> & {
    /**
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
};
/**
 * Describes the message scalekit.v1.webhooks.FeatureFlag.
 * Use `create(FeatureFlagSchema)` to create a new message.
 */
export declare const FeatureFlagSchema: GenMessage<FeatureFlag>;
/**
 * User event data structures
 *
 * @generated from message scalekit.v1.webhooks.UserEventData
 */
export type UserEventData = Message<"scalekit.v1.webhooks.UserEventData"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string email = 2;
     */
    email: string;
    /**
     * @generated from field: optional string external_id = 3;
     */
    externalId?: string;
    /**
     * @generated from field: scalekit.v1.webhooks.UserProfile profile = 4;
     */
    profile?: UserProfile;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 5;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 6;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: optional scalekit.v1.webhooks.OrganizationReference organization = 7;
     */
    organization?: OrganizationReference;
};
/**
 * Describes the message scalekit.v1.webhooks.UserEventData.
 * Use `create(UserEventDataSchema)` to create a new message.
 */
export declare const UserEventDataSchema: GenMessage<UserEventData>;
/**
 * @generated from message scalekit.v1.webhooks.UserProfile
 */
export type UserProfile = Message<"scalekit.v1.webhooks.UserProfile"> & {
    /**
     * @generated from field: optional string given_name = 1;
     */
    givenName?: string;
    /**
     * @generated from field: optional string family_name = 2;
     */
    familyName?: string;
    /**
     * @generated from field: optional string picture = 3;
     */
    picture?: string;
    /**
     * @generated from field: bool email_verified = 4;
     */
    emailVerified: boolean;
};
/**
 * Describes the message scalekit.v1.webhooks.UserProfile.
 * Use `create(UserProfileSchema)` to create a new message.
 */
export declare const UserProfileSchema: GenMessage<UserProfile>;
/**
 * @generated from message scalekit.v1.webhooks.OrganizationReference
 */
export type OrganizationReference = Message<"scalekit.v1.webhooks.OrganizationReference"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: optional string external_id = 2;
     */
    externalId?: string;
};
/**
 * Describes the message scalekit.v1.webhooks.OrganizationReference.
 * Use `create(OrganizationReferenceSchema)` to create a new message.
 */
export declare const OrganizationReferenceSchema: GenMessage<OrganizationReference>;
/**
 * @generated from enum scalekit.v1.webhooks.ObjectType
 */
export declare enum ObjectType {
    /**
     * @generated from enum value: OBJECT_TYPE_UNSPECIFIED = 0;
     */
    OBJECT_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: ORGANIZATION = 1;
     */
    ORGANIZATION = 1,
    /**
     * @generated from enum value: USER = 2;
     */
    USER = 2,
    /**
     * @generated from enum value: DIRECTORY_USER = 3;
     */
    DIRECTORY_USER = 3,
    /**
     * @generated from enum value: CONNECTION = 4;
     */
    CONNECTION = 4,
    /**
     * @generated from enum value: DIRECTORY = 5;
     */
    DIRECTORY = 5
}
/**
 * Describes the enum scalekit.v1.webhooks.ObjectType.
 */
export declare const ObjectTypeSchema: GenEnum<ObjectType>;
/**
 * @generated from enum scalekit.v1.webhooks.EventType
 */
export declare enum EventType {
    /**
     * @generated from enum value: EVENT_TYPE_UNSPECIFIED = 0;
     */
    EVENT_TYPE_UNSPECIFIED = 0,
    /**
     * Organization events
     *
     * @generated from enum value: ORGANIZATION_CREATED = 1;
     */
    ORGANIZATION_CREATED = 1,
    /**
     * @generated from enum value: ORGANIZATION_UPDATED = 2;
     */
    ORGANIZATION_UPDATED = 2,
    /**
     * @generated from enum value: ORGANIZATION_DELETED = 3;
     */
    ORGANIZATION_DELETED = 3,
    /**
     * User events
     *
     * @generated from enum value: USER_SIGNUP = 4;
     */
    USER_SIGNUP = 4,
    /**
     * @generated from enum value: USER_LOGIN = 5;
     */
    USER_LOGIN = 5,
    /**
     * @generated from enum value: USER_LOGOUT = 6;
     */
    USER_LOGOUT = 6,
    /**
     * @generated from enum value: USER_ORGANIZATION_INVITATION = 7;
     */
    USER_ORGANIZATION_INVITATION = 7,
    /**
     * @generated from enum value: USER_ORGANIZATION_MEMBERSHIP_CREATED = 8;
     */
    USER_ORGANIZATION_MEMBERSHIP_CREATED = 8,
    /**
     * @generated from enum value: USER_ORGANIZATION_MEMBERSHIP_UPDATED = 9;
     */
    USER_ORGANIZATION_MEMBERSHIP_UPDATED = 9,
    /**
     * @generated from enum value: USER_ORGANIZATION_MEMBERSHIP_DELETED = 10;
     */
    USER_ORGANIZATION_MEMBERSHIP_DELETED = 10
}
/**
 * Describes the enum scalekit.v1.webhooks.EventType.
 */
export declare const EventTypeSchema: GenEnum<EventType>;
/**
 * @generated from service scalekit.v1.webhooks.WebhookService
 */
export declare const WebhookService: GenService<{
    /**
     * @generated from rpc scalekit.v1.webhooks.WebhookService.GetPortalURL
     */
    getPortalURL: {
        methodKind: "unary";
        input: typeof GetPortalURLRequestSchema;
        output: typeof GetPortalURLResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.webhooks.WebhookService.WebhookWrapper
     */
    webhookWrapper: {
        methodKind: "unary";
        input: typeof WebhookWrapperRequestSchema;
        output: typeof StructSchema;
    };
    /**
     * @generated from rpc scalekit.v1.webhooks.WebhookService.SendTestEvent
     */
    sendTestEvent: {
        methodKind: "unary";
        input: typeof SendTestEventRequestSchema;
        output: typeof SendTestEventResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.webhooks.WebhookService.SendWebhookEvent
     */
    sendWebhookEvent: {
        methodKind: "unary";
        input: typeof WebhookEventSchema;
        output: typeof EmptySchema;
    };
}>;
