import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Any, Message, proto3, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from enum scalekit.v1.events.EventType
 */
export declare enum EventType {
    /**
     * @generated from enum value: EVENT_TYPE_UNSPECIFIED = 0;
     */
    EVENT_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: ORGANIZATION_CREATE = 11;
     */
    ORGANIZATION_CREATE = 11
}
/**
 * @generated from message scalekit.v1.events.Event
 */
export declare class Event extends Message<Event> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.events.EventType type = 2;
     */
    type: EventType;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 3;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: scalekit.v1.events.Event.Actor actor = 4;
     */
    actor?: Event_Actor;
    /**
     * @generated from field: string trace_context = 5;
     */
    traceContext: string;
    /**
     * @generated from field: string source = 6;
     */
    source: string;
    /**
     * @generated from field: string request_id = 7;
     */
    requestId: string;
    /**
     * @generated from field: google.protobuf.Any payload = 11;
     */
    payload?: Any;
    /**
     * @generated from field: google.protobuf.Any previous_payload = 12;
     */
    previousPayload?: Any;
    constructor(data?: PartialMessage<Event>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.events.Event";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Event;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Event;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Event;
    static equals(a: Event | PlainMessage<Event> | undefined, b: Event | PlainMessage<Event> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.events.Event.Actor
 */
export declare class Event_Actor extends Message<Event_Actor> {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    /**
     * @generated from field: string user_id = 3;
     */
    userId: string;
    /**
     * @generated from field: scalekit.v1.events.Event.Actor.UserType user_type = 4;
     */
    userType: Event_Actor_UserType;
    /**
     * @generated from field: string ip_addr = 5;
     */
    ipAddr: string;
    /**
     * @generated from field: string user_agent = 6;
     */
    userAgent: string;
    constructor(data?: PartialMessage<Event_Actor>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.events.Event.Actor";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Event_Actor;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Event_Actor;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Event_Actor;
    static equals(a: Event_Actor | PlainMessage<Event_Actor> | undefined, b: Event_Actor | PlainMessage<Event_Actor> | undefined): boolean;
}
/**
 * @generated from enum scalekit.v1.events.Event.Actor.UserType
 */
export declare enum Event_Actor_UserType {
    /**
     * @generated from enum value: USER_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: USER_TYPE_HUMAN = 1;
     */
    HUMAN = 1,
    /**
     * @generated from enum value: USER_TYPE_MACHINE = 2;
     */
    MACHINE = 2
}
