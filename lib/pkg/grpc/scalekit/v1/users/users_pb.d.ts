import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { OrganizationMembership, Role, UserProfile } from "../commons/commons_pb";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/users/users.proto.
 */
export declare const file_scalekit_v1_users_users: GenFile;
/**
 * @generated from message scalekit.v1.users.User
 */
export type User = Message<"scalekit.v1.users.User"> & {
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
};
/**
 * Describes the message scalekit.v1.users.User.
 * Use `create(UserSchema)` to create a new message.
 */
export declare const UserSchema: GenMessage<User>;
/**
 * @generated from message scalekit.v1.users.CreateUserAndMembershipRequest
 */
export type CreateUserAndMembershipRequest = Message<"scalekit.v1.users.CreateUserAndMembershipRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.CreateUserAndMembershipRequest.
 * Use `create(CreateUserAndMembershipRequestSchema)` to create a new message.
 */
export declare const CreateUserAndMembershipRequestSchema: GenMessage<CreateUserAndMembershipRequest>;
/**
 * @generated from message scalekit.v1.users.CreateUserAndMembershipResponse
 */
export type CreateUserAndMembershipResponse = Message<"scalekit.v1.users.CreateUserAndMembershipResponse"> & {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
};
/**
 * Describes the message scalekit.v1.users.CreateUserAndMembershipResponse.
 * Use `create(CreateUserAndMembershipResponseSchema)` to create a new message.
 */
export declare const CreateUserAndMembershipResponseSchema: GenMessage<CreateUserAndMembershipResponse>;
/**
 * @generated from message scalekit.v1.users.UpdateUser
 */
export type UpdateUser = Message<"scalekit.v1.users.UpdateUser"> & {
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
};
/**
 * Describes the message scalekit.v1.users.UpdateUser.
 * Use `create(UpdateUserSchema)` to create a new message.
 */
export declare const UpdateUserSchema: GenMessage<UpdateUser>;
/**
 * @generated from message scalekit.v1.users.UpdateUserRequest
 */
export type UpdateUserRequest = Message<"scalekit.v1.users.UpdateUserRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.UpdateUserRequest.
 * Use `create(UpdateUserRequestSchema)` to create a new message.
 */
export declare const UpdateUserRequestSchema: GenMessage<UpdateUserRequest>;
/**
 * @generated from message scalekit.v1.users.UpdateUserResponse
 */
export type UpdateUserResponse = Message<"scalekit.v1.users.UpdateUserResponse"> & {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
};
/**
 * Describes the message scalekit.v1.users.UpdateUserResponse.
 * Use `create(UpdateUserResponseSchema)` to create a new message.
 */
export declare const UpdateUserResponseSchema: GenMessage<UpdateUserResponse>;
/**
 * @generated from message scalekit.v1.users.GetUserRequest
 */
export type GetUserRequest = Message<"scalekit.v1.users.GetUserRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.GetUserRequest.
 * Use `create(GetUserRequestSchema)` to create a new message.
 */
export declare const GetUserRequestSchema: GenMessage<GetUserRequest>;
/**
 * @generated from message scalekit.v1.users.GetUserResponse
 */
export type GetUserResponse = Message<"scalekit.v1.users.GetUserResponse"> & {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
};
/**
 * Describes the message scalekit.v1.users.GetUserResponse.
 * Use `create(GetUserResponseSchema)` to create a new message.
 */
export declare const GetUserResponseSchema: GenMessage<GetUserResponse>;
/**
 * @generated from message scalekit.v1.users.GetCurrentUserResponse
 */
export type GetCurrentUserResponse = Message<"scalekit.v1.users.GetCurrentUserResponse"> & {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
    /**
     * @generated from field: string current_session_id = 2;
     */
    currentSessionId: string;
};
/**
 * Describes the message scalekit.v1.users.GetCurrentUserResponse.
 * Use `create(GetCurrentUserResponseSchema)` to create a new message.
 */
export declare const GetCurrentUserResponseSchema: GenMessage<GetCurrentUserResponse>;
/**
 * Empty message - user ID extracted from authentication context
 *
 * @generated from message scalekit.v1.users.GetCurrentUserRequest
 */
export type GetCurrentUserRequest = Message<"scalekit.v1.users.GetCurrentUserRequest"> & {};
/**
 * Describes the message scalekit.v1.users.GetCurrentUserRequest.
 * Use `create(GetCurrentUserRequestSchema)` to create a new message.
 */
export declare const GetCurrentUserRequestSchema: GenMessage<GetCurrentUserRequest>;
/**
 * @generated from message scalekit.v1.users.ListOrganizationUsersRequest
 */
export type ListOrganizationUsersRequest = Message<"scalekit.v1.users.ListOrganizationUsersRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.ListOrganizationUsersRequest.
 * Use `create(ListOrganizationUsersRequestSchema)` to create a new message.
 */
export declare const ListOrganizationUsersRequestSchema: GenMessage<ListOrganizationUsersRequest>;
/**
 * @generated from message scalekit.v1.users.ListOrganizationUsersResponse
 */
export type ListOrganizationUsersResponse = Message<"scalekit.v1.users.ListOrganizationUsersResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.users.ListOrganizationUsersResponse.
 * Use `create(ListOrganizationUsersResponseSchema)` to create a new message.
 */
export declare const ListOrganizationUsersResponseSchema: GenMessage<ListOrganizationUsersResponse>;
/**
 * @generated from message scalekit.v1.users.DeleteMembershipRequest
 */
export type DeleteMembershipRequest = Message<"scalekit.v1.users.DeleteMembershipRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.DeleteMembershipRequest.
 * Use `create(DeleteMembershipRequestSchema)` to create a new message.
 */
export declare const DeleteMembershipRequestSchema: GenMessage<DeleteMembershipRequest>;
/**
 * @generated from message scalekit.v1.users.CreateMembershipRequest
 */
export type CreateMembershipRequest = Message<"scalekit.v1.users.CreateMembershipRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.CreateMembershipRequest.
 * Use `create(CreateMembershipRequestSchema)` to create a new message.
 */
export declare const CreateMembershipRequestSchema: GenMessage<CreateMembershipRequest>;
/**
 * @generated from message scalekit.v1.users.CreateMembershipResponse
 */
export type CreateMembershipResponse = Message<"scalekit.v1.users.CreateMembershipResponse"> & {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
};
/**
 * Describes the message scalekit.v1.users.CreateMembershipResponse.
 * Use `create(CreateMembershipResponseSchema)` to create a new message.
 */
export declare const CreateMembershipResponseSchema: GenMessage<CreateMembershipResponse>;
/**
 * @generated from message scalekit.v1.users.ListUsersRequest
 */
export type ListUsersRequest = Message<"scalekit.v1.users.ListUsersRequest"> & {
    /**
     * @generated from field: uint32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.users.ListUsersRequest.
 * Use `create(ListUsersRequestSchema)` to create a new message.
 */
export declare const ListUsersRequestSchema: GenMessage<ListUsersRequest>;
/**
 * @generated from message scalekit.v1.users.ListUsersResponse
 */
export type ListUsersResponse = Message<"scalekit.v1.users.ListUsersResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.users.ListUsersResponse.
 * Use `create(ListUsersResponseSchema)` to create a new message.
 */
export declare const ListUsersResponseSchema: GenMessage<ListUsersResponse>;
/**
 * @generated from message scalekit.v1.users.SearchUsersRequest
 */
export type SearchUsersRequest = Message<"scalekit.v1.users.SearchUsersRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.SearchUsersRequest.
 * Use `create(SearchUsersRequestSchema)` to create a new message.
 */
export declare const SearchUsersRequestSchema: GenMessage<SearchUsersRequest>;
/**
 * @generated from message scalekit.v1.users.SearchUsersResponse
 */
export type SearchUsersResponse = Message<"scalekit.v1.users.SearchUsersResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.users.SearchUsersResponse.
 * Use `create(SearchUsersResponseSchema)` to create a new message.
 */
export declare const SearchUsersResponseSchema: GenMessage<SearchUsersResponse>;
/**
 * @generated from message scalekit.v1.users.DeleteUserRequest
 */
export type DeleteUserRequest = Message<"scalekit.v1.users.DeleteUserRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.DeleteUserRequest.
 * Use `create(DeleteUserRequestSchema)` to create a new message.
 */
export declare const DeleteUserRequestSchema: GenMessage<DeleteUserRequest>;
/**
 * @generated from message scalekit.v1.users.UpdateMembershipRequest
 */
export type UpdateMembershipRequest = Message<"scalekit.v1.users.UpdateMembershipRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.UpdateMembershipRequest.
 * Use `create(UpdateMembershipRequestSchema)` to create a new message.
 */
export declare const UpdateMembershipRequestSchema: GenMessage<UpdateMembershipRequest>;
/**
 * @generated from message scalekit.v1.users.UpdateMembership
 */
export type UpdateMembership = Message<"scalekit.v1.users.UpdateMembership"> & {
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
};
/**
 * Describes the message scalekit.v1.users.UpdateMembership.
 * Use `create(UpdateMembershipSchema)` to create a new message.
 */
export declare const UpdateMembershipSchema: GenMessage<UpdateMembership>;
/**
 * @generated from message scalekit.v1.users.CreateMembership
 */
export type CreateMembership = Message<"scalekit.v1.users.CreateMembership"> & {
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
};
/**
 * Describes the message scalekit.v1.users.CreateMembership.
 * Use `create(CreateMembershipSchema)` to create a new message.
 */
export declare const CreateMembershipSchema: GenMessage<CreateMembership>;
/**
 * @generated from message scalekit.v1.users.UpdateMembershipResponse
 */
export type UpdateMembershipResponse = Message<"scalekit.v1.users.UpdateMembershipResponse"> & {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
};
/**
 * Describes the message scalekit.v1.users.UpdateMembershipResponse.
 * Use `create(UpdateMembershipResponseSchema)` to create a new message.
 */
export declare const UpdateMembershipResponseSchema: GenMessage<UpdateMembershipResponse>;
/**
 * @generated from message scalekit.v1.users.SearchOrganizationUsersRequest
 */
export type SearchOrganizationUsersRequest = Message<"scalekit.v1.users.SearchOrganizationUsersRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.SearchOrganizationUsersRequest.
 * Use `create(SearchOrganizationUsersRequestSchema)` to create a new message.
 */
export declare const SearchOrganizationUsersRequestSchema: GenMessage<SearchOrganizationUsersRequest>;
/**
 * @generated from message scalekit.v1.users.SearchOrganizationUsersResponse
 */
export type SearchOrganizationUsersResponse = Message<"scalekit.v1.users.SearchOrganizationUsersResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.users.SearchOrganizationUsersResponse.
 * Use `create(SearchOrganizationUsersResponseSchema)` to create a new message.
 */
export declare const SearchOrganizationUsersResponseSchema: GenMessage<SearchOrganizationUsersResponse>;
/**
 * @generated from message scalekit.v1.users.CreateUser
 */
export type CreateUser = Message<"scalekit.v1.users.CreateUser"> & {
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
};
/**
 * Describes the message scalekit.v1.users.CreateUser.
 * Use `create(CreateUserSchema)` to create a new message.
 */
export declare const CreateUserSchema: GenMessage<CreateUser>;
/**
 * @generated from message scalekit.v1.users.CreateUserProfile
 */
export type CreateUserProfile = Message<"scalekit.v1.users.CreateUserProfile"> & {
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
};
/**
 * Describes the message scalekit.v1.users.CreateUserProfile.
 * Use `create(CreateUserProfileSchema)` to create a new message.
 */
export declare const CreateUserProfileSchema: GenMessage<CreateUserProfile>;
/**
 * @generated from message scalekit.v1.users.UpdateUserProfile
 */
export type UpdateUserProfile = Message<"scalekit.v1.users.UpdateUserProfile"> & {
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
};
/**
 * Describes the message scalekit.v1.users.UpdateUserProfile.
 * Use `create(UpdateUserProfileSchema)` to create a new message.
 */
export declare const UpdateUserProfileSchema: GenMessage<UpdateUserProfile>;
/**
 * @generated from message scalekit.v1.users.Invite
 */
export type Invite = Message<"scalekit.v1.users.Invite"> & {
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
};
/**
 * Describes the message scalekit.v1.users.Invite.
 * Use `create(InviteSchema)` to create a new message.
 */
export declare const InviteSchema: GenMessage<Invite>;
/**
 * @generated from message scalekit.v1.users.ResendInviteRequest
 */
export type ResendInviteRequest = Message<"scalekit.v1.users.ResendInviteRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.users.ResendInviteRequest.
 * Use `create(ResendInviteRequestSchema)` to create a new message.
 */
export declare const ResendInviteRequestSchema: GenMessage<ResendInviteRequest>;
/**
 * @generated from message scalekit.v1.users.ResendInviteResponse
 */
export type ResendInviteResponse = Message<"scalekit.v1.users.ResendInviteResponse"> & {
    /**
     * @generated from field: scalekit.v1.users.Invite invite = 1;
     */
    invite?: Invite;
};
/**
 * Describes the message scalekit.v1.users.ResendInviteResponse.
 * Use `create(ResendInviteResponseSchema)` to create a new message.
 */
export declare const ResendInviteResponseSchema: GenMessage<ResendInviteResponse>;
/**
 * @generated from message scalekit.v1.users.ListUserRolesRequest
 */
export type ListUserRolesRequest = Message<"scalekit.v1.users.ListUserRolesRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
};
/**
 * Describes the message scalekit.v1.users.ListUserRolesRequest.
 * Use `create(ListUserRolesRequestSchema)` to create a new message.
 */
export declare const ListUserRolesRequestSchema: GenMessage<ListUserRolesRequest>;
/**
 * @generated from message scalekit.v1.users.ListUserRolesResponse
 */
export type ListUserRolesResponse = Message<"scalekit.v1.users.ListUserRolesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.commons.Role roles = 1;
     */
    roles: Role[];
};
/**
 * Describes the message scalekit.v1.users.ListUserRolesResponse.
 * Use `create(ListUserRolesResponseSchema)` to create a new message.
 */
export declare const ListUserRolesResponseSchema: GenMessage<ListUserRolesResponse>;
/**
 * @generated from message scalekit.v1.users.AssignUserRolesRequest
 */
export type AssignUserRolesRequest = Message<"scalekit.v1.users.AssignUserRolesRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.AssignUserRolesRequest.
 * Use `create(AssignUserRolesRequestSchema)` to create a new message.
 */
export declare const AssignUserRolesRequestSchema: GenMessage<AssignUserRolesRequest>;
/**
 * @generated from message scalekit.v1.users.AssignRoleRequest
 */
export type AssignRoleRequest = Message<"scalekit.v1.users.AssignRoleRequest"> & {
    /**
     * @generated from field: string id = 1 [deprecated = true];
     * @deprecated
     */
    id: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
};
/**
 * Describes the message scalekit.v1.users.AssignRoleRequest.
 * Use `create(AssignRoleRequestSchema)` to create a new message.
 */
export declare const AssignRoleRequestSchema: GenMessage<AssignRoleRequest>;
/**
 * @generated from message scalekit.v1.users.AssignUserRolesResponse
 */
export type AssignUserRolesResponse = Message<"scalekit.v1.users.AssignUserRolesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.commons.Role roles = 1;
     */
    roles: Role[];
};
/**
 * Describes the message scalekit.v1.users.AssignUserRolesResponse.
 * Use `create(AssignUserRolesResponseSchema)` to create a new message.
 */
export declare const AssignUserRolesResponseSchema: GenMessage<AssignUserRolesResponse>;
/**
 * @generated from message scalekit.v1.users.RemoveUserRoleRequest
 */
export type RemoveUserRoleRequest = Message<"scalekit.v1.users.RemoveUserRoleRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.users.RemoveUserRoleRequest.
 * Use `create(RemoveUserRoleRequestSchema)` to create a new message.
 */
export declare const RemoveUserRoleRequestSchema: GenMessage<RemoveUserRoleRequest>;
/**
 * @generated from message scalekit.v1.users.ListUserPermissionsRequest
 */
export type ListUserPermissionsRequest = Message<"scalekit.v1.users.ListUserPermissionsRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
};
/**
 * Describes the message scalekit.v1.users.ListUserPermissionsRequest.
 * Use `create(ListUserPermissionsRequestSchema)` to create a new message.
 */
export declare const ListUserPermissionsRequestSchema: GenMessage<ListUserPermissionsRequest>;
/**
 * @generated from message scalekit.v1.users.Permission
 */
export type Permission = Message<"scalekit.v1.users.Permission"> & {
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
};
/**
 * Describes the message scalekit.v1.users.Permission.
 * Use `create(PermissionSchema)` to create a new message.
 */
export declare const PermissionSchema: GenMessage<Permission>;
/**
 * @generated from message scalekit.v1.users.ListUserPermissionsResponse
 */
export type ListUserPermissionsResponse = Message<"scalekit.v1.users.ListUserPermissionsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.users.Permission permissions = 1;
     */
    permissions: Permission[];
};
/**
 * Describes the message scalekit.v1.users.ListUserPermissionsResponse.
 * Use `create(ListUserPermissionsResponseSchema)` to create a new message.
 */
export declare const ListUserPermissionsResponseSchema: GenMessage<ListUserPermissionsResponse>;
/**
 * @generated from service scalekit.v1.users.UserService
 */
export declare const UserService: GenService<{
    /**
     * Users
     *
     * @generated from rpc scalekit.v1.users.UserService.GetUser
     */
    getUser: {
        methodKind: "unary";
        input: typeof GetUserRequestSchema;
        output: typeof GetUserResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.GetCurrentUser
     */
    getCurrentUser: {
        methodKind: "unary";
        input: typeof GetCurrentUserRequestSchema;
        output: typeof GetCurrentUserResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.ListUsers
     */
    listUsers: {
        methodKind: "unary";
        input: typeof ListUsersRequestSchema;
        output: typeof ListUsersResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.SearchUsers
     */
    searchUsers: {
        methodKind: "unary";
        input: typeof SearchUsersRequestSchema;
        output: typeof SearchUsersResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.SearchOrganizationUsers
     */
    searchOrganizationUsers: {
        methodKind: "unary";
        input: typeof SearchOrganizationUsersRequestSchema;
        output: typeof SearchOrganizationUsersResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.UpdateUser
     */
    updateUser: {
        methodKind: "unary";
        input: typeof UpdateUserRequestSchema;
        output: typeof UpdateUserResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.DeleteUser
     */
    deleteUser: {
        methodKind: "unary";
        input: typeof DeleteUserRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * Memberships
     *
     * @generated from rpc scalekit.v1.users.UserService.CreateMembership
     */
    createMembership: {
        methodKind: "unary";
        input: typeof CreateMembershipRequestSchema;
        output: typeof CreateMembershipResponseSchema;
    };
    /**
     * TODO Check cascade behaviour currently its ignored
     *
     * @generated from rpc scalekit.v1.users.UserService.DeleteMembership
     */
    deleteMembership: {
        methodKind: "unary";
        input: typeof DeleteMembershipRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.UpdateMembership
     */
    updateMembership: {
        methodKind: "unary";
        input: typeof UpdateMembershipRequestSchema;
        output: typeof UpdateMembershipResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.CreateUserAndMembership
     */
    createUserAndMembership: {
        methodKind: "unary";
        input: typeof CreateUserAndMembershipRequestSchema;
        output: typeof CreateUserAndMembershipResponseSchema;
    };
    /**
     * only memberships of the organization
     *
     * @generated from rpc scalekit.v1.users.UserService.ListOrganizationUsers
     */
    listOrganizationUsers: {
        methodKind: "unary";
        input: typeof ListOrganizationUsersRequestSchema;
        output: typeof ListOrganizationUsersResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.ResendInvite
     */
    resendInvite: {
        methodKind: "unary";
        input: typeof ResendInviteRequestSchema;
        output: typeof ResendInviteResponseSchema;
    };
    /**
     * User Role Management
     *
     * @generated from rpc scalekit.v1.users.UserService.ListUserRoles
     */
    listUserRoles: {
        methodKind: "unary";
        input: typeof ListUserRolesRequestSchema;
        output: typeof ListUserRolesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.AssignUserRoles
     */
    assignUserRoles: {
        methodKind: "unary";
        input: typeof AssignUserRolesRequestSchema;
        output: typeof AssignUserRolesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.RemoveUserRole
     */
    removeUserRole: {
        methodKind: "unary";
        input: typeof RemoveUserRoleRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.users.UserService.ListUserPermissions
     */
    listUserPermissions: {
        methodKind: "unary";
        input: typeof ListUserPermissionsRequestSchema;
        output: typeof ListUserPermissionsResponseSchema;
    };
}>;
