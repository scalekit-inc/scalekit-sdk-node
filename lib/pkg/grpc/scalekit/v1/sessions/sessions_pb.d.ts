import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/sessions/sessions.proto.
 */
export declare const file_scalekit_v1_sessions_sessions: GenFile;
/**
 * @generated from message scalekit.v1.sessions.SessionDetailsRequest
 */
export type SessionDetailsRequest = Message<"scalekit.v1.sessions.SessionDetailsRequest"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
};
/**
 * Describes the message scalekit.v1.sessions.SessionDetailsRequest.
 * Use `create(SessionDetailsRequestSchema)` to create a new message.
 */
export declare const SessionDetailsRequestSchema: GenMessage<SessionDetailsRequest>;
/**
 * @generated from message scalekit.v1.sessions.UserSessionDetailsRequest
 */
export type UserSessionDetailsRequest = Message<"scalekit.v1.sessions.UserSessionDetailsRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.sessions.UserSessionDetailsRequest.
 * Use `create(UserSessionDetailsRequestSchema)` to create a new message.
 */
export declare const UserSessionDetailsRequestSchema: GenMessage<UserSessionDetailsRequest>;
/**
 * @generated from message scalekit.v1.sessions.UserSessionFilter
 */
export type UserSessionFilter = Message<"scalekit.v1.sessions.UserSessionFilter"> & {
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
};
/**
 * Describes the message scalekit.v1.sessions.UserSessionFilter.
 * Use `create(UserSessionFilterSchema)` to create a new message.
 */
export declare const UserSessionFilterSchema: GenMessage<UserSessionFilter>;
/**
 * @generated from message scalekit.v1.sessions.RevokeSessionRequest
 */
export type RevokeSessionRequest = Message<"scalekit.v1.sessions.RevokeSessionRequest"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
};
/**
 * Describes the message scalekit.v1.sessions.RevokeSessionRequest.
 * Use `create(RevokeSessionRequestSchema)` to create a new message.
 */
export declare const RevokeSessionRequestSchema: GenMessage<RevokeSessionRequest>;
/**
 * @generated from message scalekit.v1.sessions.RevokeSessionResponse
 */
export type RevokeSessionResponse = Message<"scalekit.v1.sessions.RevokeSessionResponse"> & {
    /**
     * @generated from field: scalekit.v1.sessions.RevokedSessionDetails revoked_session = 1;
     */
    revokedSession?: RevokedSessionDetails;
};
/**
 * Describes the message scalekit.v1.sessions.RevokeSessionResponse.
 * Use `create(RevokeSessionResponseSchema)` to create a new message.
 */
export declare const RevokeSessionResponseSchema: GenMessage<RevokeSessionResponse>;
/**
 * @generated from message scalekit.v1.sessions.RevokeAllUserSessionsRequest
 */
export type RevokeAllUserSessionsRequest = Message<"scalekit.v1.sessions.RevokeAllUserSessionsRequest"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
};
/**
 * Describes the message scalekit.v1.sessions.RevokeAllUserSessionsRequest.
 * Use `create(RevokeAllUserSessionsRequestSchema)` to create a new message.
 */
export declare const RevokeAllUserSessionsRequestSchema: GenMessage<RevokeAllUserSessionsRequest>;
/**
 * @generated from message scalekit.v1.sessions.RevokeAllUserSessionsResponse
 */
export type RevokeAllUserSessionsResponse = Message<"scalekit.v1.sessions.RevokeAllUserSessionsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.sessions.RevokedSessionDetails revoked_sessions = 1;
     */
    revokedSessions: RevokedSessionDetails[];
    /**
     * @generated from field: uint32 total_revoked = 2;
     */
    totalRevoked: number;
};
/**
 * Describes the message scalekit.v1.sessions.RevokeAllUserSessionsResponse.
 * Use `create(RevokeAllUserSessionsResponseSchema)` to create a new message.
 */
export declare const RevokeAllUserSessionsResponseSchema: GenMessage<RevokeAllUserSessionsResponse>;
/**
 * @generated from message scalekit.v1.sessions.UserSessionDetails
 */
export type UserSessionDetails = Message<"scalekit.v1.sessions.UserSessionDetails"> & {
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
};
/**
 * Describes the message scalekit.v1.sessions.UserSessionDetails.
 * Use `create(UserSessionDetailsSchema)` to create a new message.
 */
export declare const UserSessionDetailsSchema: GenMessage<UserSessionDetails>;
/**
 * @generated from message scalekit.v1.sessions.SessionDetails
 */
export type SessionDetails = Message<"scalekit.v1.sessions.SessionDetails"> & {
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
    /**
     * @generated from field: repeated scalekit.v1.sessions.AuthenticatedClients authenticated_clients = 14;
     */
    authenticatedClients: AuthenticatedClients[];
};
/**
 * Describes the message scalekit.v1.sessions.SessionDetails.
 * Use `create(SessionDetailsSchema)` to create a new message.
 */
export declare const SessionDetailsSchema: GenMessage<SessionDetails>;
/**
 * @generated from message scalekit.v1.sessions.DeviceDetails
 */
export type DeviceDetails = Message<"scalekit.v1.sessions.DeviceDetails"> & {
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
};
/**
 * Describes the message scalekit.v1.sessions.DeviceDetails.
 * Use `create(DeviceDetailsSchema)` to create a new message.
 */
export declare const DeviceDetailsSchema: GenMessage<DeviceDetails>;
/**
 * @generated from message scalekit.v1.sessions.RevokedSessionDetails
 */
export type RevokedSessionDetails = Message<"scalekit.v1.sessions.RevokedSessionDetails"> & {
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
};
/**
 * Describes the message scalekit.v1.sessions.RevokedSessionDetails.
 * Use `create(RevokedSessionDetailsSchema)` to create a new message.
 */
export declare const RevokedSessionDetailsSchema: GenMessage<RevokedSessionDetails>;
/**
 * @generated from message scalekit.v1.sessions.Location
 */
export type Location = Message<"scalekit.v1.sessions.Location"> & {
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
};
/**
 * Describes the message scalekit.v1.sessions.Location.
 * Use `create(LocationSchema)` to create a new message.
 */
export declare const LocationSchema: GenMessage<Location>;
/**
 * AuthenticatedClients represents an authenticated client in a session along with its organization context.
 *
 * @generated from message scalekit.v1.sessions.AuthenticatedClients
 */
export type AuthenticatedClients = Message<"scalekit.v1.sessions.AuthenticatedClients"> & {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
};
/**
 * Describes the message scalekit.v1.sessions.AuthenticatedClients.
 * Use `create(AuthenticatedClientsSchema)` to create a new message.
 */
export declare const AuthenticatedClientsSchema: GenMessage<AuthenticatedClients>;
/**
 * @generated from service scalekit.v1.sessions.SessionService
 */
export declare const SessionService: GenService<{
    /**
     * @generated from rpc scalekit.v1.sessions.SessionService.GetSession
     */
    getSession: {
        methodKind: "unary";
        input: typeof SessionDetailsRequestSchema;
        output: typeof SessionDetailsSchema;
    };
    /**
     * @generated from rpc scalekit.v1.sessions.SessionService.RevokeSession
     */
    revokeSession: {
        methodKind: "unary";
        input: typeof RevokeSessionRequestSchema;
        output: typeof RevokeSessionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.sessions.SessionService.GetUserSessions
     */
    getUserSessions: {
        methodKind: "unary";
        input: typeof UserSessionDetailsRequestSchema;
        output: typeof UserSessionDetailsSchema;
    };
    /**
     * @generated from rpc scalekit.v1.sessions.SessionService.RevokeAllUserSessions
     */
    revokeAllUserSessions: {
        methodKind: "unary";
        input: typeof RevokeAllUserSessionsRequestSchema;
        output: typeof RevokeAllUserSessionsResponseSchema;
    };
}>;
