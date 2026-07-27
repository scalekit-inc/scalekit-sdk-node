import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/events/events.proto.
 */
export declare const file_scalekit_v1_events_events: GenFile;
/**
 * @generated from message scalekit.v1.events.SendCustomEventRequest
 */
export type SendCustomEventRequest = Message<"scalekit.v1.events.SendCustomEventRequest"> & {
    /**
     * @generated from field: string event_type = 1;
     */
    eventType: string;
    /**
     * @generated from field: google.protobuf.Struct event = 2;
     */
    event?: JsonObject | undefined;
};
/**
 * Describes the message scalekit.v1.events.SendCustomEventRequest.
 * Use `create(SendCustomEventRequestSchema)` to create a new message.
 */
export declare const SendCustomEventRequestSchema: GenMessage<SendCustomEventRequest>;
/**
 * @generated from message scalekit.v1.events.SendCustomEventResponse
 */
export type SendCustomEventResponse = Message<"scalekit.v1.events.SendCustomEventResponse"> & {
    /**
     * @generated from field: string event_id = 1;
     */
    eventId: string;
};
/**
 * Describes the message scalekit.v1.events.SendCustomEventResponse.
 * Use `create(SendCustomEventResponseSchema)` to create a new message.
 */
export declare const SendCustomEventResponseSchema: GenMessage<SendCustomEventResponse>;
/**
 * @generated from message scalekit.v1.events.IEventPaginationTokens
 */
export type IEventPaginationTokens = Message<"scalekit.v1.events.IEventPaginationTokens"> & {
    /**
     * @generated from field: string NextPage = 1;
     */
    NextPage: string;
    /**
     * @generated from field: string PreviousPage = 2;
     */
    PreviousPage: string;
    /**
     * @generated from field: uint32 Total = 3;
     */
    Total: number;
};
/**
 * Describes the message scalekit.v1.events.IEventPaginationTokens.
 * Use `create(IEventPaginationTokensSchema)` to create a new message.
 */
export declare const IEventPaginationTokensSchema: GenMessage<IEventPaginationTokens>;
/**
 * @generated from message scalekit.v1.events.ListEventsRequest
 */
export type ListEventsRequest = Message<"scalekit.v1.events.ListEventsRequest"> & {
    /**
     * @generated from field: scalekit.v1.events.EventFilter filter = 1;
     */
    filter?: EventFilter | undefined;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.events.ListEventsRequest.
 * Use `create(ListEventsRequestSchema)` to create a new message.
 */
export declare const ListEventsRequestSchema: GenMessage<ListEventsRequest>;
/**
 * @generated from message scalekit.v1.events.ListEventsResponse
 */
export type ListEventsResponse = Message<"scalekit.v1.events.ListEventsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.events.ScalekitEvent events = 1;
     */
    events: ScalekitEvent[];
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
};
/**
 * Describes the message scalekit.v1.events.ListEventsResponse.
 * Use `create(ListEventsResponseSchema)` to create a new message.
 */
export declare const ListEventsResponseSchema: GenMessage<ListEventsResponse>;
/**
 * @generated from message scalekit.v1.events.ListEventsPaginatedRequest
 */
export type ListEventsPaginatedRequest = Message<"scalekit.v1.events.ListEventsPaginatedRequest"> & {
    /**
     * @generated from field: scalekit.v1.events.EventFilter filter = 1;
     */
    filter?: EventFilter | undefined;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.events.ListEventsPaginatedRequest.
 * Use `create(ListEventsPaginatedRequestSchema)` to create a new message.
 */
export declare const ListEventsPaginatedRequestSchema: GenMessage<ListEventsPaginatedRequest>;
/**
 * @generated from message scalekit.v1.events.ListEventsPaginatedResponse
 */
export type ListEventsPaginatedResponse = Message<"scalekit.v1.events.ListEventsPaginatedResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.events.ScalekitEvent events = 1;
     */
    events: ScalekitEvent[];
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.events.ListEventsPaginatedResponse.
 * Use `create(ListEventsPaginatedResponseSchema)` to create a new message.
 */
export declare const ListEventsPaginatedResponseSchema: GenMessage<ListEventsPaginatedResponse>;
/**
 * @generated from message scalekit.v1.events.IEvent
 */
export type IEvent = Message<"scalekit.v1.events.IEvent"> & {
    /**
     * @generated from field: string spec_version = 1;
     */
    specVersion: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string type = 3;
     */
    type: string;
    /**
     * @generated from field: google.protobuf.Timestamp occurred_at = 4;
     */
    occurredAt?: Timestamp | undefined;
    /**
     * @generated from field: scalekit.v1.events.Actor actor = 5;
     */
    actor?: Actor | undefined;
    /**
     * @generated from field: string tenant_id = 6;
     */
    tenantId: string;
    /**
     * @generated from field: scalekit.v1.events.Target target = 7;
     */
    target?: Target | undefined;
    /**
     * @generated from field: string source = 8;
     */
    source: string;
    /**
     * @generated from field: google.protobuf.Struct data = 9;
     */
    data?: JsonObject | undefined;
    /**
     * @generated from field: google.protobuf.Struct old_data = 10;
     */
    oldData?: JsonObject | undefined;
    /**
     * @generated from field: map<string, string> context = 11;
     */
    context: {
        [key: string]: string;
    };
    /**
     * @generated from field: map<string, string> metadata = 12;
     */
    metadata: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.events.IEvent.
 * Use `create(IEventSchema)` to create a new message.
 */
export declare const IEventSchema: GenMessage<IEvent>;
/**
 * @generated from message scalekit.v1.events.Event
 */
export type Event = Message<"scalekit.v1.events.Event"> & {
    /**
     * @generated from field: string spec_version = 1;
     */
    specVersion: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string type = 3;
     */
    type: string;
    /**
     * @generated from field: google.protobuf.Timestamp occurred_at = 4;
     */
    occurredAt?: Timestamp | undefined;
    /**
     * @generated from field: scalekit.v1.events.Actor actor = 5;
     */
    actor?: Actor | undefined;
    /**
     * @generated from field: string tenant_id = 6;
     */
    tenantId: string;
    /**
     * @generated from field: scalekit.v1.events.Target target = 7;
     */
    target?: Target | undefined;
    /**
     * @generated from field: string source = 8;
     */
    source: string;
    /**
     * @generated from field: google.protobuf.Struct data = 9;
     */
    data?: JsonObject | undefined;
    /**
     * @generated from field: google.protobuf.Struct old_data = 10;
     */
    oldData?: JsonObject | undefined;
    /**
     * @generated from field: map<string, string> context = 11;
     */
    context: {
        [key: string]: string;
    };
    /**
     * @generated from field: map<string, string> metadata = 12;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * @generated from field: scalekit.v1.events.ObjectType object = 13;
     */
    object: ObjectType;
};
/**
 * Describes the message scalekit.v1.events.Event.
 * Use `create(EventSchema)` to create a new message.
 */
export declare const EventSchema: GenMessage<Event>;
/**
 * @generated from message scalekit.v1.events.Actor
 */
export type Actor = Message<"scalekit.v1.events.Actor"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.events.EventActor type = 2;
     */
    type: EventActor;
};
/**
 * Describes the message scalekit.v1.events.Actor.
 * Use `create(ActorSchema)` to create a new message.
 */
export declare const ActorSchema: GenMessage<Actor>;
/**
 * @generated from message scalekit.v1.events.Target
 */
export type Target = Message<"scalekit.v1.events.Target"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.events.EventTarget type = 2;
     */
    type: EventTarget;
};
/**
 * Describes the message scalekit.v1.events.Target.
 * Use `create(TargetSchema)` to create a new message.
 */
export declare const TargetSchema: GenMessage<Target>;
/**
 * @generated from message scalekit.v1.events.IEventFilter
 */
export type IEventFilter = Message<"scalekit.v1.events.IEventFilter"> & {
    /**
     * @generated from field: repeated string event_types = 1;
     */
    eventTypes: string[];
    /**
     * @generated from field: google.protobuf.Timestamp start_time = 2;
     */
    startTime?: Timestamp | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp end_time = 3;
     */
    endTime?: Timestamp | undefined;
    /**
     * @generated from field: string tenant_id = 4;
     */
    tenantId: string;
    /**
     * @generated from field: scalekit.v1.events.Target target = 5;
     */
    target?: Target | undefined;
    /**
     * @generated from field: scalekit.v1.events.Source source = 6;
     */
    source: Source;
    /**
     * @generated from field: map<string, string> metadata = 7;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * @generated from field: repeated string internal_events = 8;
     */
    internalEvents: string[];
};
/**
 * Describes the message scalekit.v1.events.IEventFilter.
 * Use `create(IEventFilterSchema)` to create a new message.
 */
export declare const IEventFilterSchema: GenMessage<IEventFilter>;
/**
 * @generated from message scalekit.v1.events.EventFilter
 */
export type EventFilter = Message<"scalekit.v1.events.EventFilter"> & {
    /**
     * @generated from field: repeated string event_types = 1;
     */
    eventTypes: string[];
    /**
     * @generated from field: google.protobuf.Timestamp start_time = 2;
     */
    startTime?: Timestamp | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp end_time = 3;
     */
    endTime?: Timestamp | undefined;
    /**
     * @generated from field: string organization_id = 4;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.events.Source source = 5;
     */
    source: Source;
    /**
     * @generated from field: string auth_request_id = 6;
     */
    authRequestId: string;
    /**
     * @generated from field: optional string interceptor_id = 7;
     */
    interceptorId?: string | undefined;
    /**
     * @generated from field: optional string interceptor_status = 8;
     */
    interceptorStatus?: string | undefined;
    /**
     * @generated from field: optional string interceptor_decision = 9;
     */
    interceptorDecision?: string | undefined;
    /**
     * @generated from field: optional string connection_id = 10;
     */
    connectionId?: string | undefined;
    /**
     * map<string, string> metadata = 7 [(buf.validate.field).map = {
     *  keys: {
     *    string: {
     *      min_len: 3
     *      max_len: 25
     *    }
     *  }
     *  values: {
     *    string: {
     *      min_len: 1
     *      max_len: 2000
     *    }
     *  }
     * }];
     *  optional MetadataFilter metadata_filter = 6;
     *
     * @generated from field: optional string connected_account_id = 11;
     */
    connectedAccountId?: string | undefined;
};
/**
 * Describes the message scalekit.v1.events.EventFilter.
 * Use `create(EventFilterSchema)` to create a new message.
 */
export declare const EventFilterSchema: GenMessage<EventFilter>;
/**
 * @generated from message scalekit.v1.events.ScalekitEvent
 */
export type ScalekitEvent = Message<"scalekit.v1.events.ScalekitEvent"> & {
    /**
     * @generated from field: string spec_version = 1;
     */
    specVersion: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * Not adding a enum for forward compatibility
     *
     * @generated from field: string type = 3;
     */
    type: string;
    /**
     * @generated from field: google.protobuf.Timestamp occurred_at = 4;
     */
    occurredAt?: Timestamp | undefined;
    /**
     * @generated from field: string environment_id = 6;
     */
    environmentId: string;
    /**
     * @generated from field: optional string organization_id = 7;
     */
    organizationId?: string | undefined;
    /**
     * @generated from field: scalekit.v1.events.ObjectType object = 8;
     */
    object: ObjectType;
    /**
     * JSON - No Schema { id , object_type, data }
     *
     * @generated from field: google.protobuf.Struct data = 9;
     */
    data?: JsonObject | undefined;
    /**
     * @generated from field: string display_name = 10;
     */
    displayName: string;
};
/**
 * Describes the message scalekit.v1.events.ScalekitEvent.
 * Use `create(ScalekitEventSchema)` to create a new message.
 */
export declare const ScalekitEventSchema: GenMessage<ScalekitEvent>;
/**
 * @generated from enum scalekit.v1.events.EventActor
 */
export declare enum EventActor {
    /**
     * @generated from enum value: ACTOR_UNSPECIFIED = 0;
     */
    ACTOR_UNSPECIFIED = 0,
    /**
     * @generated from enum value: HUMAN = 1;
     */
    HUMAN = 1,
    /**
     * @generated from enum value: MACHINE = 2;
     */
    MACHINE = 2,
    /**
     * @generated from enum value: API = 3;
     */
    API = 3
}
/**
 * Describes the enum scalekit.v1.events.EventActor.
 */
export declare const EventActorSchema: GenEnum<EventActor>;
/**
 * @generated from enum scalekit.v1.events.Source
 */
export declare enum Source {
    /**
     * @generated from enum value: SOURCE_UNSPECIFIED = 0;
     */
    SOURCE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: SCALEKIT = 1;
     */
    SCALEKIT = 1,
    /**
     * @generated from enum value: DIR_SYNC = 2;
     */
    DIR_SYNC = 2
}
/**
 * Describes the enum scalekit.v1.events.Source.
 */
export declare const SourceSchema: GenEnum<Source>;
/**
 * @generated from enum scalekit.v1.events.EventTarget
 */
export declare enum EventTarget {
    /**
     * @generated from enum value: EVENT_TARGET_UNSPECIFIED = 0;
     */
    EVENT_TARGET_UNSPECIFIED = 0,
    /**
     * @generated from enum value: WORKSPACE = 1;
     */
    WORKSPACE = 1,
    /**
     * @generated from enum value: ENVIRONMENT = 2;
     */
    ENVIRONMENT = 2,
    /**
     * @generated from enum value: ORGANIZATION = 3;
     */
    ORGANIZATION = 3,
    /**
     * @generated from enum value: USER = 4;
     */
    USER = 4,
    /**
     * @generated from enum value: SESSION = 5;
     */
    SESSION = 5,
    /**
     * @generated from enum value: TEMPLATE = 6;
     */
    TEMPLATE = 6,
    /**
     * @generated from enum value: EMAIL_SERVER = 7;
     */
    EMAIL_SERVER = 7,
    /**
     * @generated from enum value: EMAIL = 8;
     */
    EMAIL = 8,
    /**
     * @generated from enum value: CONNECTED_ACCOUNT = 9;
     */
    CONNECTED_ACCOUNT = 9,
    /**
     * @generated from enum value: ROLE = 10;
     */
    ROLE = 10,
    /**
     * @generated from enum value: PERMISSION = 11;
     */
    PERMISSION = 11
}
/**
 * Describes the enum scalekit.v1.events.EventTarget.
 */
export declare const EventTargetSchema: GenEnum<EventTarget>;
/**
 * @generated from enum scalekit.v1.events.EventCategory
 */
export declare enum EventCategory {
    /**
     * @generated from enum value: EVENT_SOURCE_UNSPECIFIED = 0;
     */
    EVENT_SOURCE_UNSPECIFIED = 0,
    /**
     * Org, Usr , Org.Domain
     *
     * @generated from enum value: CORE = 1;
     */
    CORE = 1,
    /**
     * Conn , SocialConn, Conn.Enabled, Conn.Disabled
     *
     * @generated from enum value: SSO = 2;
     */
    SSO = 2,
    /**
     * DirUser, DirGroup , Directory, Directory.Enabled, Directory.Disabled
     *
     * @generated from enum value: DIRSYNC = 3;
     */
    DIRSYNC = 3
}
/**
 * Describes the enum scalekit.v1.events.EventCategory.
 */
export declare const EventCategorySchema: GenEnum<EventCategory>;
/**
 * @generated from enum scalekit.v1.events.ObjectType
 */
export declare enum ObjectType {
    /**
     * @generated from enum value: OBJECT_TYPE_UNSPECIFIED = 0;
     */
    OBJECT_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: Workspace = 1;
     */
    Workspace = 1,
    /**
     * @generated from enum value: Environment = 2;
     */
    Environment = 2,
    /**
     * @generated from enum value: Organization = 3;
     */
    Organization = 3,
    /**
     * @generated from enum value: Connection = 4;
     */
    Connection = 4,
    /**
     * @generated from enum value: User = 5;
     */
    User = 5,
    /**
     * @generated from enum value: Role = 6;
     */
    Role = 6,
    /**
     * @generated from enum value: CustomAttributes = 7;
     */
    CustomAttributes = 7,
    /**
     * @generated from enum value: Directory = 8;
     */
    Directory = 8,
    /**
     * @generated from enum value: DirectoryUser = 9;
     */
    DirectoryUser = 9,
    /**
     * @generated from enum value: DirectoryGroup = 10;
     */
    DirectoryGroup = 10,
    /**
     * @generated from enum value: Session = 11;
     */
    Session = 11,
    /**
     * @generated from enum value: Template = 12;
     */
    Template = 12,
    /**
     * @generated from enum value: Job = 13;
     */
    Job = 13,
    /**
     * @generated from enum value: Domain = 14;
     */
    Domain = 14,
    /**
     * @generated from enum value: EmailServer = 15;
     */
    EmailServer = 15,
    /**
     * @generated from enum value: Email = 16;
     */
    Email = 16,
    /**
     * @generated from enum value: AuthRequest = 17;
     */
    AuthRequest = 17,
    /**
     * @generated from enum value: SAMLRequest = 18;
     */
    SAMLRequest = 18,
    /**
     * @generated from enum value: SAMLResponse = 19;
     */
    SAMLResponse = 19,
    /**
     * @generated from enum value: TokenClaims = 20;
     */
    TokenClaims = 20,
    /**
     * @generated from enum value: OIDCReqParams = 21;
     */
    OIDCReqParams = 21,
    /**
     * @generated from enum value: OIDCRespClaims = 22;
     */
    OIDCRespClaims = 22,
    /**
     * @generated from enum value: SSOError = 23;
     */
    SSOError = 23,
    /**
     * @generated from enum value: GenericError = 24;
     */
    GenericError = 24,
    /**
     * @generated from enum value: RefreshTokens = 25;
     */
    RefreshTokens = 25,
    /**
     * @generated from enum value: EndSessionRequest = 26;
     */
    EndSessionRequest = 26,
    /**
     * @generated from enum value: LogoutTokenClaims = 27;
     */
    LogoutTokenClaims = 27,
    /**
     * @generated from enum value: OAuthResponse = 28;
     */
    OAuthResponse = 28,
    /**
     * @generated from enum value: JSON = 29;
     */
    JSON = 29,
    /**
     * @generated from enum value: SKErrors = 30;
     */
    SKErrors = 30,
    /**
     * @generated from enum value: OrgMembership = 31;
     */
    OrgMembership = 31,
    /**
     * @generated from enum value: UserProfile = 32;
     */
    UserProfile = 32,
    /**
     * @generated from enum value: IDPInitiatedPayload = 33;
     */
    IDPInitiatedPayload = 33,
    /**
     * @generated from enum value: DeviceDetails = 34;
     */
    DeviceDetails = 34,
    /**
     * @generated from enum value: Actions = 35;
     */
    Actions = 35,
    /**
     * @generated from enum value: InterceptorEvent = 36;
     */
    InterceptorEvent = 36,
    /**
     * @generated from enum value: Permission = 37;
     */
    Permission = 37,
    /**
     * @generated from enum value: OrgMembershipEvent = 38;
     */
    OrgMembershipEvent = 38,
    /**
     * @generated from enum value: UserLoginEvent = 39;
     */
    UserLoginEvent = 39,
    /**
     * @generated from enum value: UserLogoutEvent = 40;
     */
    UserLogoutEvent = 40,
    /**
     * @generated from enum value: ConnectedAccount = 41;
     */
    ConnectedAccount = 41
}
/**
 * Describes the enum scalekit.v1.events.ObjectType.
 */
export declare const ObjectTypeSchema: GenEnum<ObjectType>;
/**
 * @generated from service scalekit.v1.events.EventsService
 */
export declare const EventsService: GenService<{
    /**
     * @generated from rpc scalekit.v1.events.EventsService.ListEvents
     */
    listEvents: {
        methodKind: "unary";
        input: typeof ListEventsRequestSchema;
        output: typeof ListEventsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.events.EventsService.ListEventsPaginated
     */
    listEventsPaginated: {
        methodKind: "unary";
        input: typeof ListEventsPaginatedRequestSchema;
        output: typeof ListEventsPaginatedResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.events.EventsService.SendCustomEvent
     */
    sendCustomEvent: {
        methodKind: "unary";
        input: typeof SendCustomEventRequestSchema;
        output: typeof SendCustomEventResponseSchema;
    };
}>;
