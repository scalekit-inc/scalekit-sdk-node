import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
import { OrganizationMembership, Role, UserProfile } from "../commons/commons_pb.js";
/**
 * @generated from message scalekit.v1.users.User
 */
export declare class User extends Message<User> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string environment_id = 2;
     */
    environmentId: string;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 3;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 4;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: string email = 5;
     */
    email: string;
    /**
     * @generated from field: optional string external_id = 6;
     */
    externalId?: string;
    /**
     * @generated from field: repeated scalekit.v1.commons.OrganizationMembership memberships = 7;
     */
    memberships: OrganizationMembership[];
    /**
     * @generated from field: scalekit.v1.commons.UserProfile user_profile = 8;
     */
    userProfile?: UserProfile;
    /**
     * @generated from field: map<string, string> metadata = 9;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * @generated from field: google.protobuf.Timestamp last_login_time = 10;
     */
    lastLoginTime?: Timestamp;
    constructor(data?: PartialMessage<User>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.User";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): User;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): User;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): User;
    static equals(a: User | PlainMessage<User> | undefined, b: User | PlainMessage<User> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.CreateUserAndMembershipRequest
 */
export declare class CreateUserAndMembershipRequest extends Message<CreateUserAndMembershipRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.users.CreateUser user = 2;
     */
    user?: CreateUser;
    /**
     * @generated from field: optional bool send_invitation_email = 3;
     */
    sendInvitationEmail?: boolean;
    constructor(data?: PartialMessage<CreateUserAndMembershipRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.CreateUserAndMembershipRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateUserAndMembershipRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateUserAndMembershipRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateUserAndMembershipRequest;
    static equals(a: CreateUserAndMembershipRequest | PlainMessage<CreateUserAndMembershipRequest> | undefined, b: CreateUserAndMembershipRequest | PlainMessage<CreateUserAndMembershipRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.CreateUserAndMembershipResponse
 */
export declare class CreateUserAndMembershipResponse extends Message<CreateUserAndMembershipResponse> {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
    constructor(data?: PartialMessage<CreateUserAndMembershipResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.CreateUserAndMembershipResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateUserAndMembershipResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateUserAndMembershipResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateUserAndMembershipResponse;
    static equals(a: CreateUserAndMembershipResponse | PlainMessage<CreateUserAndMembershipResponse> | undefined, b: CreateUserAndMembershipResponse | PlainMessage<CreateUserAndMembershipResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateUser
 */
export declare class UpdateUser extends Message<UpdateUser> {
    /**
     * @generated from field: optional string external_id = 6;
     */
    externalId?: string;
    /**
     * @generated from field: scalekit.v1.users.UpdateUserProfile user_profile = 8;
     */
    userProfile?: UpdateUserProfile;
    /**
     * @generated from field: map<string, string> metadata = 9;
     */
    metadata: {
        [key: string]: string;
    };
    constructor(data?: PartialMessage<UpdateUser>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateUser";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateUser;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateUser;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateUser;
    static equals(a: UpdateUser | PlainMessage<UpdateUser> | undefined, b: UpdateUser | PlainMessage<UpdateUser> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateUserRequest
 */
export declare class UpdateUserRequest extends Message<UpdateUserRequest> {
    /**
     * @generated from oneof scalekit.v1.users.UpdateUserRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 1;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 2;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: scalekit.v1.users.UpdateUser user = 3;
     */
    user?: UpdateUser;
    constructor(data?: PartialMessage<UpdateUserRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateUserRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateUserRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateUserRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateUserRequest;
    static equals(a: UpdateUserRequest | PlainMessage<UpdateUserRequest> | undefined, b: UpdateUserRequest | PlainMessage<UpdateUserRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateUserResponse
 */
export declare class UpdateUserResponse extends Message<UpdateUserResponse> {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
    constructor(data?: PartialMessage<UpdateUserResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateUserResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateUserResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateUserResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateUserResponse;
    static equals(a: UpdateUserResponse | PlainMessage<UpdateUserResponse> | undefined, b: UpdateUserResponse | PlainMessage<UpdateUserResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.GetUserRequest
 */
export declare class GetUserRequest extends Message<GetUserRequest> {
    /**
     * @generated from oneof scalekit.v1.users.GetUserRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 1;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 2;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    constructor(data?: PartialMessage<GetUserRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.GetUserRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetUserRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetUserRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetUserRequest;
    static equals(a: GetUserRequest | PlainMessage<GetUserRequest> | undefined, b: GetUserRequest | PlainMessage<GetUserRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.GetUserResponse
 */
export declare class GetUserResponse extends Message<GetUserResponse> {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
    constructor(data?: PartialMessage<GetUserResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.GetUserResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetUserResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetUserResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetUserResponse;
    static equals(a: GetUserResponse | PlainMessage<GetUserResponse> | undefined, b: GetUserResponse | PlainMessage<GetUserResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListOrganizationUsersRequest
 */
export declare class ListOrganizationUsersRequest extends Message<ListOrganizationUsersRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
    constructor(data?: PartialMessage<ListOrganizationUsersRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListOrganizationUsersRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListOrganizationUsersRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListOrganizationUsersRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListOrganizationUsersRequest;
    static equals(a: ListOrganizationUsersRequest | PlainMessage<ListOrganizationUsersRequest> | undefined, b: ListOrganizationUsersRequest | PlainMessage<ListOrganizationUsersRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListOrganizationUsersResponse
 */
export declare class ListOrganizationUsersResponse extends Message<ListOrganizationUsersResponse> {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.users.User users = 3;
     */
    users: User[];
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
    constructor(data?: PartialMessage<ListOrganizationUsersResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListOrganizationUsersResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListOrganizationUsersResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListOrganizationUsersResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListOrganizationUsersResponse;
    static equals(a: ListOrganizationUsersResponse | PlainMessage<ListOrganizationUsersResponse> | undefined, b: ListOrganizationUsersResponse | PlainMessage<ListOrganizationUsersResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.DeleteMembershipRequest
 */
export declare class DeleteMembershipRequest extends Message<DeleteMembershipRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from oneof scalekit.v1.users.DeleteMembershipRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 2;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 3;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: optional bool cascade = 5;
     */
    cascade?: boolean;
    constructor(data?: PartialMessage<DeleteMembershipRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.DeleteMembershipRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteMembershipRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteMembershipRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteMembershipRequest;
    static equals(a: DeleteMembershipRequest | PlainMessage<DeleteMembershipRequest> | undefined, b: DeleteMembershipRequest | PlainMessage<DeleteMembershipRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.CreateMembershipRequest
 */
export declare class CreateMembershipRequest extends Message<CreateMembershipRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.users.CreateMembership membership = 2;
     */
    membership?: CreateMembership;
    /**
     * @generated from oneof scalekit.v1.users.CreateMembershipRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 3;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 4;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: optional bool send_invitation_email = 5;
     */
    sendInvitationEmail?: boolean;
    constructor(data?: PartialMessage<CreateMembershipRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.CreateMembershipRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateMembershipRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateMembershipRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateMembershipRequest;
    static equals(a: CreateMembershipRequest | PlainMessage<CreateMembershipRequest> | undefined, b: CreateMembershipRequest | PlainMessage<CreateMembershipRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.CreateMembershipResponse
 */
export declare class CreateMembershipResponse extends Message<CreateMembershipResponse> {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
    constructor(data?: PartialMessage<CreateMembershipResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.CreateMembershipResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateMembershipResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateMembershipResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateMembershipResponse;
    static equals(a: CreateMembershipResponse | PlainMessage<CreateMembershipResponse> | undefined, b: CreateMembershipResponse | PlainMessage<CreateMembershipResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListUsersRequest
 */
export declare class ListUsersRequest extends Message<ListUsersRequest> {
    /**
     * @generated from field: uint32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
    constructor(data?: PartialMessage<ListUsersRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListUsersRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListUsersRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListUsersRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListUsersRequest;
    static equals(a: ListUsersRequest | PlainMessage<ListUsersRequest> | undefined, b: ListUsersRequest | PlainMessage<ListUsersRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListUsersResponse
 */
export declare class ListUsersResponse extends Message<ListUsersResponse> {
    /**
     * @generated from field: repeated scalekit.v1.users.User users = 1;
     */
    users: User[];
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 3;
     */
    totalSize: number;
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
    constructor(data?: PartialMessage<ListUsersResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListUsersResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListUsersResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListUsersResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListUsersResponse;
    static equals(a: ListUsersResponse | PlainMessage<ListUsersResponse> | undefined, b: ListUsersResponse | PlainMessage<ListUsersResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.SearchUsersRequest
 */
export declare class SearchUsersRequest extends Message<SearchUsersRequest> {
    /**
     * @generated from field: string query = 1;
     */
    query: string;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
    constructor(data?: PartialMessage<SearchUsersRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.SearchUsersRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchUsersRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchUsersRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchUsersRequest;
    static equals(a: SearchUsersRequest | PlainMessage<SearchUsersRequest> | undefined, b: SearchUsersRequest | PlainMessage<SearchUsersRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.SearchUsersResponse
 */
export declare class SearchUsersResponse extends Message<SearchUsersResponse> {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.users.User users = 3;
     */
    users: User[];
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
    constructor(data?: PartialMessage<SearchUsersResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.SearchUsersResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchUsersResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchUsersResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchUsersResponse;
    static equals(a: SearchUsersResponse | PlainMessage<SearchUsersResponse> | undefined, b: SearchUsersResponse | PlainMessage<SearchUsersResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.DeleteUserRequest
 */
export declare class DeleteUserRequest extends Message<DeleteUserRequest> {
    /**
     * @generated from oneof scalekit.v1.users.DeleteUserRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 1;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 2;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    constructor(data?: PartialMessage<DeleteUserRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.DeleteUserRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteUserRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteUserRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteUserRequest;
    static equals(a: DeleteUserRequest | PlainMessage<DeleteUserRequest> | undefined, b: DeleteUserRequest | PlainMessage<DeleteUserRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateMembershipRequest
 */
export declare class UpdateMembershipRequest extends Message<UpdateMembershipRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from oneof scalekit.v1.users.UpdateMembershipRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 2;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 3;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: scalekit.v1.users.UpdateMembership membership = 5;
     */
    membership?: UpdateMembership;
    constructor(data?: PartialMessage<UpdateMembershipRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateMembershipRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateMembershipRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateMembershipRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateMembershipRequest;
    static equals(a: UpdateMembershipRequest | PlainMessage<UpdateMembershipRequest> | undefined, b: UpdateMembershipRequest | PlainMessage<UpdateMembershipRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateMembership
 */
export declare class UpdateMembership extends Message<UpdateMembership> {
    /**
     * @generated from field: repeated scalekit.v1.commons.Role roles = 4;
     */
    roles: Role[];
    /**
     * @generated from field: map<string, string> metadata = 7;
     */
    metadata: {
        [key: string]: string;
    };
    constructor(data?: PartialMessage<UpdateMembership>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateMembership";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateMembership;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateMembership;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateMembership;
    static equals(a: UpdateMembership | PlainMessage<UpdateMembership> | undefined, b: UpdateMembership | PlainMessage<UpdateMembership> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.CreateMembership
 */
export declare class CreateMembership extends Message<CreateMembership> {
    /**
     * @generated from field: repeated scalekit.v1.commons.Role roles = 4;
     */
    roles: Role[];
    /**
     * @generated from field: map<string, string> metadata = 7;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * @generated from field: optional string inviter_email = 8;
     */
    inviterEmail?: string;
    constructor(data?: PartialMessage<CreateMembership>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.CreateMembership";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateMembership;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateMembership;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateMembership;
    static equals(a: CreateMembership | PlainMessage<CreateMembership> | undefined, b: CreateMembership | PlainMessage<CreateMembership> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateMembershipResponse
 */
export declare class UpdateMembershipResponse extends Message<UpdateMembershipResponse> {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
    constructor(data?: PartialMessage<UpdateMembershipResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateMembershipResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateMembershipResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateMembershipResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateMembershipResponse;
    static equals(a: UpdateMembershipResponse | PlainMessage<UpdateMembershipResponse> | undefined, b: UpdateMembershipResponse | PlainMessage<UpdateMembershipResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.SearchOrganizationUsersRequest
 */
export declare class SearchOrganizationUsersRequest extends Message<SearchOrganizationUsersRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string query = 2;
     */
    query: string;
    /**
     * @generated from field: uint32 page_size = 3;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 4;
     */
    pageToken: string;
    constructor(data?: PartialMessage<SearchOrganizationUsersRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.SearchOrganizationUsersRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchOrganizationUsersRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchOrganizationUsersRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchOrganizationUsersRequest;
    static equals(a: SearchOrganizationUsersRequest | PlainMessage<SearchOrganizationUsersRequest> | undefined, b: SearchOrganizationUsersRequest | PlainMessage<SearchOrganizationUsersRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.SearchOrganizationUsersResponse
 */
export declare class SearchOrganizationUsersResponse extends Message<SearchOrganizationUsersResponse> {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.users.User users = 3;
     */
    users: User[];
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
    constructor(data?: PartialMessage<SearchOrganizationUsersResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.SearchOrganizationUsersResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchOrganizationUsersResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchOrganizationUsersResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchOrganizationUsersResponse;
    static equals(a: SearchOrganizationUsersResponse | PlainMessage<SearchOrganizationUsersResponse> | undefined, b: SearchOrganizationUsersResponse | PlainMessage<SearchOrganizationUsersResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.CreateUser
 */
export declare class CreateUser extends Message<CreateUser> {
    /**
     * @generated from field: string email = 5;
     */
    email: string;
    /**
     * @generated from field: optional string external_id = 6;
     */
    externalId?: string;
    /**
     * @generated from field: scalekit.v1.users.CreateMembership membership = 7;
     */
    membership?: CreateMembership;
    /**
     * @generated from field: scalekit.v1.users.CreateUserProfile user_profile = 8;
     */
    userProfile?: CreateUserProfile;
    /**
     * @generated from field: map<string, string> metadata = 9;
     */
    metadata: {
        [key: string]: string;
    };
    constructor(data?: PartialMessage<CreateUser>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.CreateUser";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateUser;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateUser;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateUser;
    static equals(a: CreateUser | PlainMessage<CreateUser> | undefined, b: CreateUser | PlainMessage<CreateUser> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.CreateUserProfile
 */
export declare class CreateUserProfile extends Message<CreateUserProfile> {
    /**
     * @generated from field: string given_name = 2;
     */
    givenName: string;
    /**
     * @generated from field: string family_name = 3;
     */
    familyName: string;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * @generated from field: string locale = 5;
     */
    locale: string;
    /**
     * @generated from field: string phone_number = 7;
     */
    phoneNumber: string;
    /**
     * @generated from field: map<string, string> metadata = 8;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * @generated from field: map<string, string> custom_attributes = 9;
     */
    customAttributes: {
        [key: string]: string;
    };
    /**
     * @generated from field: string preferred_username = 10;
     */
    preferredUsername: string;
    /**
     * @generated from field: optional string picture = 11;
     */
    picture?: string;
    /**
     * @generated from field: optional string gender = 12;
     */
    gender?: string;
    /**
     * @generated from field: repeated string groups = 13;
     */
    groups: string[];
    /**
     * @generated from field: string first_name = 21 [deprecated = true];
     * @deprecated
     */
    firstName: string;
    /**
     * @generated from field: string last_name = 22 [deprecated = true];
     * @deprecated
     */
    lastName: string;
    constructor(data?: PartialMessage<CreateUserProfile>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.CreateUserProfile";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateUserProfile;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateUserProfile;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateUserProfile;
    static equals(a: CreateUserProfile | PlainMessage<CreateUserProfile> | undefined, b: CreateUserProfile | PlainMessage<CreateUserProfile> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateUserProfile
 */
export declare class UpdateUserProfile extends Message<UpdateUserProfile> {
    /**
     * @generated from field: optional string given_name = 2;
     */
    givenName?: string;
    /**
     * @generated from field: optional string family_name = 3;
     */
    familyName?: string;
    /**
     * @generated from field: optional string name = 4;
     */
    name?: string;
    /**
     * @generated from field: optional string locale = 5;
     */
    locale?: string;
    /**
     * @generated from field: optional string phone_number = 7;
     */
    phoneNumber?: string;
    /**
     * @generated from field: map<string, string> metadata = 8;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * @generated from field: map<string, string> custom_attributes = 9;
     */
    customAttributes: {
        [key: string]: string;
    };
    /**
     * @generated from field: optional string first_name = 21 [deprecated = true];
     * @deprecated
     */
    firstName?: string;
    /**
     * @generated from field: optional string last_name = 22 [deprecated = true];
     * @deprecated
     */
    lastName?: string;
    /**
     * @generated from field: optional string preferred_username = 10;
     */
    preferredUsername?: string;
    /**
     * @generated from field: optional string picture = 11;
     */
    picture?: string;
    /**
     * @generated from field: optional string gender = 12;
     */
    gender?: string;
    /**
     * @generated from field: repeated string groups = 13;
     */
    groups: string[];
    constructor(data?: PartialMessage<UpdateUserProfile>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateUserProfile";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateUserProfile;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateUserProfile;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateUserProfile;
    static equals(a: UpdateUserProfile | PlainMessage<UpdateUserProfile> | undefined, b: UpdateUserProfile | PlainMessage<UpdateUserProfile> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.Invite
 */
export declare class Invite extends Message<Invite> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: optional string inviter_email = 3;
     */
    inviterEmail?: string;
    /**
     * @generated from field: string status = 4;
     */
    status: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 5;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 6;
     */
    expiresAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp resent_at = 7;
     */
    resentAt?: Timestamp;
    /**
     * @generated from field: int32 resent_count = 8;
     */
    resentCount: number;
    constructor(data?: PartialMessage<Invite>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.Invite";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Invite;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Invite;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Invite;
    static equals(a: Invite | PlainMessage<Invite> | undefined, b: Invite | PlainMessage<Invite> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ResendInviteRequest
 */
export declare class ResendInviteRequest extends Message<ResendInviteRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    constructor(data?: PartialMessage<ResendInviteRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ResendInviteRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ResendInviteRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ResendInviteRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ResendInviteRequest;
    static equals(a: ResendInviteRequest | PlainMessage<ResendInviteRequest> | undefined, b: ResendInviteRequest | PlainMessage<ResendInviteRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ResendInviteResponse
 */
export declare class ResendInviteResponse extends Message<ResendInviteResponse> {
    /**
     * @generated from field: scalekit.v1.users.Invite invite = 1;
     */
    invite?: Invite;
    constructor(data?: PartialMessage<ResendInviteResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ResendInviteResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ResendInviteResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ResendInviteResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ResendInviteResponse;
    static equals(a: ResendInviteResponse | PlainMessage<ResendInviteResponse> | undefined, b: ResendInviteResponse | PlainMessage<ResendInviteResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListUserRolesRequest
 */
export declare class ListUserRolesRequest extends Message<ListUserRolesRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    constructor(data?: PartialMessage<ListUserRolesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListUserRolesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListUserRolesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListUserRolesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListUserRolesRequest;
    static equals(a: ListUserRolesRequest | PlainMessage<ListUserRolesRequest> | undefined, b: ListUserRolesRequest | PlainMessage<ListUserRolesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListUserRolesResponse
 */
export declare class ListUserRolesResponse extends Message<ListUserRolesResponse> {
    /**
     * @generated from field: repeated scalekit.v1.commons.Role roles = 1;
     */
    roles: Role[];
    constructor(data?: PartialMessage<ListUserRolesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListUserRolesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListUserRolesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListUserRolesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListUserRolesResponse;
    static equals(a: ListUserRolesResponse | PlainMessage<ListUserRolesResponse> | undefined, b: ListUserRolesResponse | PlainMessage<ListUserRolesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.AssignUserRolesRequest
 */
export declare class AssignUserRolesRequest extends Message<AssignUserRolesRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: repeated scalekit.v1.users.AssignRoleRequest roles = 3;
     */
    roles: AssignRoleRequest[];
    constructor(data?: PartialMessage<AssignUserRolesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.AssignUserRolesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssignUserRolesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssignUserRolesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssignUserRolesRequest;
    static equals(a: AssignUserRolesRequest | PlainMessage<AssignUserRolesRequest> | undefined, b: AssignUserRolesRequest | PlainMessage<AssignUserRolesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.AssignRoleRequest
 */
export declare class AssignRoleRequest extends Message<AssignRoleRequest> {
    /**
     * @generated from field: string id = 1 [deprecated = true];
     * @deprecated
     */
    id: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    constructor(data?: PartialMessage<AssignRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.AssignRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssignRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssignRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssignRoleRequest;
    static equals(a: AssignRoleRequest | PlainMessage<AssignRoleRequest> | undefined, b: AssignRoleRequest | PlainMessage<AssignRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.AssignUserRolesResponse
 */
export declare class AssignUserRolesResponse extends Message<AssignUserRolesResponse> {
    /**
     * @generated from field: repeated scalekit.v1.commons.Role roles = 1;
     */
    roles: Role[];
    constructor(data?: PartialMessage<AssignUserRolesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.AssignUserRolesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssignUserRolesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssignUserRolesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssignUserRolesResponse;
    static equals(a: AssignUserRolesResponse | PlainMessage<AssignUserRolesResponse> | undefined, b: AssignUserRolesResponse | PlainMessage<AssignUserRolesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.RemoveUserRoleRequest
 */
export declare class RemoveUserRoleRequest extends Message<RemoveUserRoleRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: string role_name = 3;
     */
    roleName: string;
    constructor(data?: PartialMessage<RemoveUserRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.RemoveUserRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RemoveUserRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RemoveUserRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RemoveUserRoleRequest;
    static equals(a: RemoveUserRoleRequest | PlainMessage<RemoveUserRoleRequest> | undefined, b: RemoveUserRoleRequest | PlainMessage<RemoveUserRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListUserPermissionsRequest
 */
export declare class ListUserPermissionsRequest extends Message<ListUserPermissionsRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    constructor(data?: PartialMessage<ListUserPermissionsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListUserPermissionsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListUserPermissionsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListUserPermissionsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListUserPermissionsRequest;
    static equals(a: ListUserPermissionsRequest | PlainMessage<ListUserPermissionsRequest> | undefined, b: ListUserPermissionsRequest | PlainMessage<ListUserPermissionsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.Permission
 */
export declare class Permission extends Message<Permission> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * @generated from field: repeated string tags = 4;
     */
    tags: string[];
    constructor(data?: PartialMessage<Permission>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.Permission";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Permission;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Permission;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Permission;
    static equals(a: Permission | PlainMessage<Permission> | undefined, b: Permission | PlainMessage<Permission> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListUserPermissionsResponse
 */
export declare class ListUserPermissionsResponse extends Message<ListUserPermissionsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.users.Permission permissions = 1;
     */
    permissions: Permission[];
    constructor(data?: PartialMessage<ListUserPermissionsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListUserPermissionsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListUserPermissionsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListUserPermissionsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListUserPermissionsResponse;
    static equals(a: ListUserPermissionsResponse | PlainMessage<ListUserPermissionsResponse> | undefined, b: ListUserPermissionsResponse | PlainMessage<ListUserPermissionsResponse> | undefined): boolean;
}
