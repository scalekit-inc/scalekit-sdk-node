import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from message scalekit.v1.sessions.SessionDetailsRequest
 */
export declare class SessionDetailsRequest extends Message<SessionDetailsRequest> {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    constructor(data?: PartialMessage<SessionDetailsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.SessionDetailsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SessionDetailsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SessionDetailsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SessionDetailsRequest;
    static equals(a: SessionDetailsRequest | PlainMessage<SessionDetailsRequest> | undefined, b: SessionDetailsRequest | PlainMessage<SessionDetailsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.UserSessionDetailsRequest
 */
export declare class UserSessionDetailsRequest extends Message<UserSessionDetailsRequest> {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
    /**
     * @generated from field: scalekit.v1.sessions.UserSessionFilter filter = 4;
     */
    filter?: UserSessionFilter;
    constructor(data?: PartialMessage<UserSessionDetailsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.UserSessionDetailsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UserSessionDetailsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UserSessionDetailsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UserSessionDetailsRequest;
    static equals(a: UserSessionDetailsRequest | PlainMessage<UserSessionDetailsRequest> | undefined, b: UserSessionDetailsRequest | PlainMessage<UserSessionDetailsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.UserSessionFilter
 */
export declare class UserSessionFilter extends Message<UserSessionFilter> {
    /**
     * @generated from field: repeated string status = 1;
     */
    status: string[];
    /**
     * @generated from field: google.protobuf.Timestamp start_time = 2;
     */
    startTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp end_time = 3;
     */
    endTime?: Timestamp;
    constructor(data?: PartialMessage<UserSessionFilter>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.UserSessionFilter";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UserSessionFilter;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UserSessionFilter;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UserSessionFilter;
    static equals(a: UserSessionFilter | PlainMessage<UserSessionFilter> | undefined, b: UserSessionFilter | PlainMessage<UserSessionFilter> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.RevokeSessionRequest
 */
export declare class RevokeSessionRequest extends Message<RevokeSessionRequest> {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    constructor(data?: PartialMessage<RevokeSessionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.RevokeSessionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RevokeSessionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RevokeSessionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RevokeSessionRequest;
    static equals(a: RevokeSessionRequest | PlainMessage<RevokeSessionRequest> | undefined, b: RevokeSessionRequest | PlainMessage<RevokeSessionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.RevokeSessionResponse
 */
export declare class RevokeSessionResponse extends Message<RevokeSessionResponse> {
    /**
     * @generated from field: scalekit.v1.sessions.RevokedSessionDetails revoked_session = 1;
     */
    revokedSession?: RevokedSessionDetails;
    constructor(data?: PartialMessage<RevokeSessionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.RevokeSessionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RevokeSessionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RevokeSessionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RevokeSessionResponse;
    static equals(a: RevokeSessionResponse | PlainMessage<RevokeSessionResponse> | undefined, b: RevokeSessionResponse | PlainMessage<RevokeSessionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.RevokeAllUserSessionsRequest
 */
export declare class RevokeAllUserSessionsRequest extends Message<RevokeAllUserSessionsRequest> {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    constructor(data?: PartialMessage<RevokeAllUserSessionsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.RevokeAllUserSessionsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RevokeAllUserSessionsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RevokeAllUserSessionsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RevokeAllUserSessionsRequest;
    static equals(a: RevokeAllUserSessionsRequest | PlainMessage<RevokeAllUserSessionsRequest> | undefined, b: RevokeAllUserSessionsRequest | PlainMessage<RevokeAllUserSessionsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.RevokeAllUserSessionsResponse
 */
export declare class RevokeAllUserSessionsResponse extends Message<RevokeAllUserSessionsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.sessions.RevokedSessionDetails revoked_sessions = 1;
     */
    revokedSessions: RevokedSessionDetails[];
    /**
     * @generated from field: uint32 total_revoked = 2;
     */
    totalRevoked: number;
    constructor(data?: PartialMessage<RevokeAllUserSessionsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.RevokeAllUserSessionsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RevokeAllUserSessionsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RevokeAllUserSessionsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RevokeAllUserSessionsResponse;
    static equals(a: RevokeAllUserSessionsResponse | PlainMessage<RevokeAllUserSessionsResponse> | undefined, b: RevokeAllUserSessionsResponse | PlainMessage<RevokeAllUserSessionsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.UserSessionDetails
 */
export declare class UserSessionDetails extends Message<UserSessionDetails> {
    /**
     * @generated from field: repeated scalekit.v1.sessions.SessionDetails sessions = 1;
     */
    sessions: SessionDetails[];
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
    constructor(data?: PartialMessage<UserSessionDetails>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.UserSessionDetails";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UserSessionDetails;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UserSessionDetails;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UserSessionDetails;
    static equals(a: UserSessionDetails | PlainMessage<UserSessionDetails> | undefined, b: UserSessionDetails | PlainMessage<UserSessionDetails> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.SessionDetails
 */
export declare class SessionDetails extends Message<SessionDetails> {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: repeated string authenticated_organizations = 3;
     */
    authenticatedOrganizations: string[];
    /**
     * @generated from field: string organization_id = 4;
     */
    organizationId: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 5;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 6;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp idle_expires_at = 7;
     */
    idleExpiresAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp absolute_expires_at = 8;
     */
    absoluteExpiresAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp expired_at = 9;
     */
    expiredAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp logout_at = 10;
     */
    logoutAt?: Timestamp;
    /**
     * @generated from field: string status = 11;
     */
    status: string;
    /**
     * @generated from field: scalekit.v1.sessions.DeviceDetails device = 12;
     */
    device?: DeviceDetails;
    /**
     * @generated from field: google.protobuf.Timestamp last_active_at = 13;
     */
    lastActiveAt?: Timestamp;
    constructor(data?: PartialMessage<SessionDetails>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.SessionDetails";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SessionDetails;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SessionDetails;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SessionDetails;
    static equals(a: SessionDetails | PlainMessage<SessionDetails> | undefined, b: SessionDetails | PlainMessage<SessionDetails> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.DeviceDetails
 */
export declare class DeviceDetails extends Message<DeviceDetails> {
    /**
     * @generated from field: string user_agent = 12;
     */
    userAgent: string;
    /**
     * @generated from field: string os = 13;
     */
    os: string;
    /**
     * @generated from field: string os_version = 14;
     */
    osVersion: string;
    /**
     * @generated from field: string browser = 15;
     */
    browser: string;
    /**
     * @generated from field: string browser_version = 16;
     */
    browserVersion: string;
    /**
     * @generated from field: string device_type = 17;
     */
    deviceType: string;
    /**
     * @generated from field: string ip = 19;
     */
    ip: string;
    /**
     * @generated from field: scalekit.v1.sessions.Location location = 20;
     */
    location?: Location;
    constructor(data?: PartialMessage<DeviceDetails>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.DeviceDetails";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeviceDetails;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeviceDetails;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeviceDetails;
    static equals(a: DeviceDetails | PlainMessage<DeviceDetails> | undefined, b: DeviceDetails | PlainMessage<DeviceDetails> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.RevokedSessionDetails
 */
export declare class RevokedSessionDetails extends Message<RevokedSessionDetails> {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 5;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 6;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp idle_expires_at = 7;
     */
    idleExpiresAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp absolute_expires_at = 8;
     */
    absoluteExpiresAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp expired_at = 9;
     */
    expiredAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp logout_at = 10;
     */
    logoutAt?: Timestamp;
    /**
     * @generated from field: string status = 11;
     */
    status: string;
    /**
     * @generated from field: google.protobuf.Timestamp last_active_at = 12;
     */
    lastActiveAt?: Timestamp;
    constructor(data?: PartialMessage<RevokedSessionDetails>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.RevokedSessionDetails";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RevokedSessionDetails;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RevokedSessionDetails;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RevokedSessionDetails;
    static equals(a: RevokedSessionDetails | PlainMessage<RevokedSessionDetails> | undefined, b: RevokedSessionDetails | PlainMessage<RevokedSessionDetails> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.sessions.Location
 */
export declare class Location extends Message<Location> {
    /**
     * @generated from field: string region = 1;
     */
    region: string;
    /**
     * @generated from field: string region_subdivision = 2;
     */
    regionSubdivision: string;
    /**
     * @generated from field: string city = 3;
     */
    city: string;
    /**
     * @generated from field: string latitude = 4;
     */
    latitude: string;
    /**
     * @generated from field: string longitude = 5;
     */
    longitude: string;
    constructor(data?: PartialMessage<Location>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.sessions.Location";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Location;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Location;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Location;
    static equals(a: Location | PlainMessage<Location> | undefined, b: Location | PlainMessage<Location> | undefined): boolean;
}
