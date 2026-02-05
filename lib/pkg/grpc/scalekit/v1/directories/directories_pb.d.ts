import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/directories/directories.proto.
 */
export declare const file_scalekit_v1_directories_directories: GenFile;
/**
 * @generated from message scalekit.v1.directories.GetDirectoryRequest
 */
export type GetDirectoryRequest = Message<"scalekit.v1.directories.GetDirectoryRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
};
/**
 * Describes the message scalekit.v1.directories.GetDirectoryRequest.
 * Use `create(GetDirectoryRequestSchema)` to create a new message.
 */
export declare const GetDirectoryRequestSchema: GenMessage<GetDirectoryRequest>;
/**
 * @generated from message scalekit.v1.directories.GetDirectoryResponse
 */
export type GetDirectoryResponse = Message<"scalekit.v1.directories.GetDirectoryResponse"> & {
    /**
     * @generated from field: scalekit.v1.directories.Directory directory = 1;
     */
    directory?: Directory;
};
/**
 * Describes the message scalekit.v1.directories.GetDirectoryResponse.
 * Use `create(GetDirectoryResponseSchema)` to create a new message.
 */
export declare const GetDirectoryResponseSchema: GenMessage<GetDirectoryResponse>;
/**
 * @generated from message scalekit.v1.directories.CreateDirectoryRequest
 */
export type CreateDirectoryRequest = Message<"scalekit.v1.directories.CreateDirectoryRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.directories.CreateDirectory directory = 2;
     */
    directory?: CreateDirectory;
};
/**
 * Describes the message scalekit.v1.directories.CreateDirectoryRequest.
 * Use `create(CreateDirectoryRequestSchema)` to create a new message.
 */
export declare const CreateDirectoryRequestSchema: GenMessage<CreateDirectoryRequest>;
/**
 * @generated from message scalekit.v1.directories.CreateDirectory
 */
export type CreateDirectory = Message<"scalekit.v1.directories.CreateDirectory"> & {
    /**
     * @generated from field: scalekit.v1.directories.DirectoryType directory_type = 1;
     */
    directoryType: DirectoryType;
    /**
     * @generated from field: scalekit.v1.directories.DirectoryProvider directory_provider = 2;
     */
    directoryProvider: DirectoryProvider;
};
/**
 * Describes the message scalekit.v1.directories.CreateDirectory.
 * Use `create(CreateDirectorySchema)` to create a new message.
 */
export declare const CreateDirectorySchema: GenMessage<CreateDirectory>;
/**
 * @generated from message scalekit.v1.directories.CreateDirectoryResponse
 */
export type CreateDirectoryResponse = Message<"scalekit.v1.directories.CreateDirectoryResponse"> & {
    /**
     * @generated from field: scalekit.v1.directories.Directory directory = 1;
     */
    directory?: Directory;
};
/**
 * Describes the message scalekit.v1.directories.CreateDirectoryResponse.
 * Use `create(CreateDirectoryResponseSchema)` to create a new message.
 */
export declare const CreateDirectoryResponseSchema: GenMessage<CreateDirectoryResponse>;
/**
 * @generated from message scalekit.v1.directories.UpdateDirectoryRequest
 */
export type UpdateDirectoryRequest = Message<"scalekit.v1.directories.UpdateDirectoryRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.directories.UpdateDirectory directory = 3;
     */
    directory?: UpdateDirectory;
};
/**
 * Describes the message scalekit.v1.directories.UpdateDirectoryRequest.
 * Use `create(UpdateDirectoryRequestSchema)` to create a new message.
 */
export declare const UpdateDirectoryRequestSchema: GenMessage<UpdateDirectoryRequest>;
/**
 * @generated from message scalekit.v1.directories.UpdateDirectory
 */
export type UpdateDirectory = Message<"scalekit.v1.directories.UpdateDirectory"> & {
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: scalekit.v1.directories.DirectoryType directory_type = 3;
     */
    directoryType: DirectoryType;
    /**
     * @generated from field: bool enabled = 7;
     */
    enabled: boolean;
    /**
     * @generated from field: scalekit.v1.directories.DirectoryProvider directory_provider = 8;
     */
    directoryProvider: DirectoryProvider;
    /**
     * @generated from field: scalekit.v1.directories.DirectoryStatus status = 9;
     */
    status: DirectoryStatus;
    /**
     * @generated from field: repeated scalekit.v1.directories.DirectoryMapping mappings = 10;
     */
    mappings: DirectoryMapping[];
    /**
     * @generated from field: repeated scalekit.v1.directories.ExternalGroup groups = 15;
     */
    groups: ExternalGroup[];
};
/**
 * Describes the message scalekit.v1.directories.UpdateDirectory.
 * Use `create(UpdateDirectorySchema)` to create a new message.
 */
export declare const UpdateDirectorySchema: GenMessage<UpdateDirectory>;
/**
 * @generated from message scalekit.v1.directories.UpdateDirectoryResponse
 */
export type UpdateDirectoryResponse = Message<"scalekit.v1.directories.UpdateDirectoryResponse"> & {
    /**
     * @generated from field: scalekit.v1.directories.Directory directory = 1;
     */
    directory?: Directory;
};
/**
 * Describes the message scalekit.v1.directories.UpdateDirectoryResponse.
 * Use `create(UpdateDirectoryResponseSchema)` to create a new message.
 */
export declare const UpdateDirectoryResponseSchema: GenMessage<UpdateDirectoryResponse>;
/**
 * @generated from message scalekit.v1.directories.AssignGroupsForDirectoryRequest
 */
export type AssignGroupsForDirectoryRequest = Message<"scalekit.v1.directories.AssignGroupsForDirectoryRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    /**
     * @generated from field: repeated string external_ids = 3;
     */
    externalIds: string[];
};
/**
 * Describes the message scalekit.v1.directories.AssignGroupsForDirectoryRequest.
 * Use `create(AssignGroupsForDirectoryRequestSchema)` to create a new message.
 */
export declare const AssignGroupsForDirectoryRequestSchema: GenMessage<AssignGroupsForDirectoryRequest>;
/**
 * @generated from message scalekit.v1.directories.ListDirectoriesRequest
 */
export type ListDirectoriesRequest = Message<"scalekit.v1.directories.ListDirectoriesRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
};
/**
 * Describes the message scalekit.v1.directories.ListDirectoriesRequest.
 * Use `create(ListDirectoriesRequestSchema)` to create a new message.
 */
export declare const ListDirectoriesRequestSchema: GenMessage<ListDirectoriesRequest>;
/**
 * @generated from message scalekit.v1.directories.ListDirectoriesResponse
 */
export type ListDirectoriesResponse = Message<"scalekit.v1.directories.ListDirectoriesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.directories.Directory directories = 1;
     */
    directories: Directory[];
};
/**
 * Describes the message scalekit.v1.directories.ListDirectoriesResponse.
 * Use `create(ListDirectoriesResponseSchema)` to create a new message.
 */
export declare const ListDirectoriesResponseSchema: GenMessage<ListDirectoriesResponse>;
/**
 * @generated from message scalekit.v1.directories.ListDirectoryUsersRequest
 */
export type ListDirectoryUsersRequest = Message<"scalekit.v1.directories.ListDirectoryUsersRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string directory_id = 2;
     */
    directoryId: string;
    /**
     * @generated from field: uint32 page_size = 3;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 4;
     */
    pageToken: string;
    /**
     * @generated from field: optional bool include_detail = 5;
     */
    includeDetail?: boolean;
    /**
     * @generated from field: optional string directory_group_id = 6;
     */
    directoryGroupId?: string;
    /**
     * @generated from field: optional google.protobuf.Timestamp updated_after = 7;
     */
    updatedAfter?: Timestamp;
};
/**
 * Describes the message scalekit.v1.directories.ListDirectoryUsersRequest.
 * Use `create(ListDirectoryUsersRequestSchema)` to create a new message.
 */
export declare const ListDirectoryUsersRequestSchema: GenMessage<ListDirectoryUsersRequest>;
/**
 * @generated from message scalekit.v1.directories.ListDirectoryUsersResponse
 */
export type ListDirectoryUsersResponse = Message<"scalekit.v1.directories.ListDirectoryUsersResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.directories.DirectoryUser users = 1;
     */
    users: DirectoryUser[];
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: string next_page_token = 3;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.directories.ListDirectoryUsersResponse.
 * Use `create(ListDirectoryUsersResponseSchema)` to create a new message.
 */
export declare const ListDirectoryUsersResponseSchema: GenMessage<ListDirectoryUsersResponse>;
/**
 * @generated from message scalekit.v1.directories.ListDirectoryGroupsRequest
 */
export type ListDirectoryGroupsRequest = Message<"scalekit.v1.directories.ListDirectoryGroupsRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string directory_id = 2;
     */
    directoryId: string;
    /**
     * @generated from field: uint32 page_size = 3;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 4;
     */
    pageToken: string;
    /**
     * @generated from field: optional google.protobuf.Timestamp updated_after = 5;
     */
    updatedAfter?: Timestamp;
    /**
     * @generated from field: optional bool include_detail = 6;
     */
    includeDetail?: boolean;
    /**
     * @generated from field: optional bool include_external_groups = 7;
     */
    includeExternalGroups?: boolean;
};
/**
 * Describes the message scalekit.v1.directories.ListDirectoryGroupsRequest.
 * Use `create(ListDirectoryGroupsRequestSchema)` to create a new message.
 */
export declare const ListDirectoryGroupsRequestSchema: GenMessage<ListDirectoryGroupsRequest>;
/**
 * @generated from message scalekit.v1.directories.ListDirectoryGroupsResponse
 */
export type ListDirectoryGroupsResponse = Message<"scalekit.v1.directories.ListDirectoryGroupsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.directories.DirectoryGroup groups = 1;
     */
    groups: DirectoryGroup[];
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: string next_page_token = 3;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.directories.ListDirectoryGroupsResponse.
 * Use `create(ListDirectoryGroupsResponseSchema)` to create a new message.
 */
export declare const ListDirectoryGroupsResponseSchema: GenMessage<ListDirectoryGroupsResponse>;
/**
 * @generated from message scalekit.v1.directories.ListDirectoryGroupsSummaryRequest
 */
export type ListDirectoryGroupsSummaryRequest = Message<"scalekit.v1.directories.ListDirectoryGroupsSummaryRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string directory_id = 2;
     */
    directoryId: string;
};
/**
 * Describes the message scalekit.v1.directories.ListDirectoryGroupsSummaryRequest.
 * Use `create(ListDirectoryGroupsSummaryRequestSchema)` to create a new message.
 */
export declare const ListDirectoryGroupsSummaryRequestSchema: GenMessage<ListDirectoryGroupsSummaryRequest>;
/**
 * @generated from message scalekit.v1.directories.Directory
 */
export type Directory = Message<"scalekit.v1.directories.Directory"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: scalekit.v1.directories.DirectoryType directory_type = 3;
     */
    directoryType: DirectoryType;
    /**
     * @generated from field: string organization_id = 4;
     */
    organizationId: string;
    /**
     * @generated from field: bool enabled = 5;
     */
    enabled: boolean;
    /**
     * @generated from field: scalekit.v1.directories.DirectoryProvider directory_provider = 6;
     */
    directoryProvider: DirectoryProvider;
    /**
     * @generated from field: google.protobuf.Timestamp last_synced_at = 7;
     */
    lastSyncedAt?: Timestamp;
    /**
     * @generated from field: string directory_endpoint = 8;
     */
    directoryEndpoint: string;
    /**
     * @generated from field: int32 total_users = 9;
     */
    totalUsers: number;
    /**
     * @generated from field: int32 total_groups = 10;
     */
    totalGroups: number;
    /**
     * @generated from field: repeated scalekit.v1.directories.Secret secrets = 11;
     */
    secrets: Secret[];
    /**
     * @generated from field: scalekit.v1.directories.Stats stats = 12;
     */
    stats?: Stats;
    /**
     * @generated from field: scalekit.v1.directories.RoleAssignments role_assignments = 13;
     */
    roleAssignments?: RoleAssignments;
    /**
     * @generated from field: scalekit.v1.directories.AttributeMappings attribute_mappings = 14;
     */
    attributeMappings?: AttributeMappings;
    /**
     * @generated from field: string status = 15;
     */
    status: string;
    /**
     * @generated from field: string email = 16;
     */
    email: string;
    /**
     * @generated from field: string groups_tracked = 17;
     */
    groupsTracked: string;
};
/**
 * Describes the message scalekit.v1.directories.Directory.
 * Use `create(DirectorySchema)` to create a new message.
 */
export declare const DirectorySchema: GenMessage<Directory>;
/**
 * @generated from message scalekit.v1.directories.ToggleDirectoryRequest
 */
export type ToggleDirectoryRequest = Message<"scalekit.v1.directories.ToggleDirectoryRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.directories.ToggleDirectoryRequest.
 * Use `create(ToggleDirectoryRequestSchema)` to create a new message.
 */
export declare const ToggleDirectoryRequestSchema: GenMessage<ToggleDirectoryRequest>;
/**
 * @generated from message scalekit.v1.directories.ToggleDirectoryResponse
 */
export type ToggleDirectoryResponse = Message<"scalekit.v1.directories.ToggleDirectoryResponse"> & {
    /**
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * @generated from field: optional string error_message = 2;
     */
    errorMessage?: string;
};
/**
 * Describes the message scalekit.v1.directories.ToggleDirectoryResponse.
 * Use `create(ToggleDirectoryResponseSchema)` to create a new message.
 */
export declare const ToggleDirectoryResponseSchema: GenMessage<ToggleDirectoryResponse>;
/**
 * @generated from message scalekit.v1.directories.DirectoryMapping
 */
export type DirectoryMapping = Message<"scalekit.v1.directories.DirectoryMapping"> & {
    /**
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string map_to = 2;
     */
    mapTo: string;
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
};
/**
 * Describes the message scalekit.v1.directories.DirectoryMapping.
 * Use `create(DirectoryMappingSchema)` to create a new message.
 */
export declare const DirectoryMappingSchema: GenMessage<DirectoryMapping>;
/**
 * @generated from message scalekit.v1.directories.DirectoryUser
 */
export type DirectoryUser = Message<"scalekit.v1.directories.DirectoryUser"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string email = 2;
     */
    email: string;
    /**
     * @generated from field: string preferred_username = 3;
     */
    preferredUsername: string;
    /**
     * @generated from field: string given_name = 4;
     */
    givenName: string;
    /**
     * @generated from field: string family_name = 5;
     */
    familyName: string;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 6;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: repeated string emails = 16;
     */
    emails: string[];
    /**
     * @generated from field: repeated scalekit.v1.directories.DirectoryGroup groups = 17;
     */
    groups: DirectoryGroup[];
    /**
     * @generated from field: google.protobuf.Struct user_detail = 18;
     */
    userDetail?: JsonObject;
};
/**
 * Describes the message scalekit.v1.directories.DirectoryUser.
 * Use `create(DirectoryUserSchema)` to create a new message.
 */
export declare const DirectoryUserSchema: GenMessage<DirectoryUser>;
/**
 * @generated from message scalekit.v1.directories.ExternalGroup
 */
export type ExternalGroup = Message<"scalekit.v1.directories.ExternalGroup"> & {
    /**
     * @generated from field: string external_id = 1;
     */
    externalId: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
    /**
     * @generated from field: string email = 3;
     */
    email: string;
};
/**
 * Describes the message scalekit.v1.directories.ExternalGroup.
 * Use `create(ExternalGroupSchema)` to create a new message.
 */
export declare const ExternalGroupSchema: GenMessage<ExternalGroup>;
/**
 * @generated from message scalekit.v1.directories.DirectoryGroup
 */
export type DirectoryGroup = Message<"scalekit.v1.directories.DirectoryGroup"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
    /**
     * @generated from field: int32 total_users = 3;
     */
    totalUsers: number;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 4;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Struct group_detail = 5;
     */
    groupDetail?: JsonObject;
};
/**
 * Describes the message scalekit.v1.directories.DirectoryGroup.
 * Use `create(DirectoryGroupSchema)` to create a new message.
 */
export declare const DirectoryGroupSchema: GenMessage<DirectoryGroup>;
/**
 * @generated from message scalekit.v1.directories.CreateDirectorySecretRequest
 */
export type CreateDirectorySecretRequest = Message<"scalekit.v1.directories.CreateDirectorySecretRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string directory_id = 2;
     */
    directoryId: string;
};
/**
 * Describes the message scalekit.v1.directories.CreateDirectorySecretRequest.
 * Use `create(CreateDirectorySecretRequestSchema)` to create a new message.
 */
export declare const CreateDirectorySecretRequestSchema: GenMessage<CreateDirectorySecretRequest>;
/**
 * @generated from message scalekit.v1.directories.CreateDirectorySecretResponse
 */
export type CreateDirectorySecretResponse = Message<"scalekit.v1.directories.CreateDirectorySecretResponse"> & {
    /**
     * @generated from field: string plain_secret = 1;
     */
    plainSecret: string;
    /**
     * @generated from field: scalekit.v1.directories.Secret secret = 2;
     */
    secret?: Secret;
};
/**
 * Describes the message scalekit.v1.directories.CreateDirectorySecretResponse.
 * Use `create(CreateDirectorySecretResponseSchema)` to create a new message.
 */
export declare const CreateDirectorySecretResponseSchema: GenMessage<CreateDirectorySecretResponse>;
/**
 * @generated from message scalekit.v1.directories.RegenerateDirectorySecretRequest
 */
export type RegenerateDirectorySecretRequest = Message<"scalekit.v1.directories.RegenerateDirectorySecretRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string directory_id = 2;
     */
    directoryId: string;
};
/**
 * Describes the message scalekit.v1.directories.RegenerateDirectorySecretRequest.
 * Use `create(RegenerateDirectorySecretRequestSchema)` to create a new message.
 */
export declare const RegenerateDirectorySecretRequestSchema: GenMessage<RegenerateDirectorySecretRequest>;
/**
 * @generated from message scalekit.v1.directories.RegenerateDirectorySecretResponse
 */
export type RegenerateDirectorySecretResponse = Message<"scalekit.v1.directories.RegenerateDirectorySecretResponse"> & {
    /**
     * @generated from field: string plain_secret = 1;
     */
    plainSecret: string;
    /**
     * @generated from field: scalekit.v1.directories.Secret secret = 2;
     */
    secret?: Secret;
};
/**
 * Describes the message scalekit.v1.directories.RegenerateDirectorySecretResponse.
 * Use `create(RegenerateDirectorySecretResponseSchema)` to create a new message.
 */
export declare const RegenerateDirectorySecretResponseSchema: GenMessage<RegenerateDirectorySecretResponse>;
/**
 * @generated from message scalekit.v1.directories.Secret
 */
export type Secret = Message<"scalekit.v1.directories.Secret"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 2;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: string secret_suffix = 4;
     */
    secretSuffix: string;
    /**
     * @generated from field: scalekit.v1.directories.SecretStatus status = 5;
     */
    status: SecretStatus;
    /**
     * @generated from field: google.protobuf.Timestamp expire_time = 6;
     */
    expireTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_used_time = 7;
     */
    lastUsedTime?: Timestamp;
    /**
     * @generated from field: string directory_id = 9;
     */
    directoryId: string;
};
/**
 * Describes the message scalekit.v1.directories.Secret.
 * Use `create(SecretSchema)` to create a new message.
 */
export declare const SecretSchema: GenMessage<Secret>;
/**
 * @generated from message scalekit.v1.directories.Stats
 */
export type Stats = Message<"scalekit.v1.directories.Stats"> & {
    /**
     * @generated from field: int32 total_users = 1;
     */
    totalUsers: number;
    /**
     * @generated from field: int32 total_groups = 2;
     */
    totalGroups: number;
    /**
     * @generated from field: google.protobuf.Timestamp group_updated_at = 3;
     */
    groupUpdatedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp user_updated_at = 4;
     */
    userUpdatedAt?: Timestamp;
};
/**
 * Describes the message scalekit.v1.directories.Stats.
 * Use `create(StatsSchema)` to create a new message.
 */
export declare const StatsSchema: GenMessage<Stats>;
/**
 * @generated from message scalekit.v1.directories.AssignRolesRequest
 */
export type AssignRolesRequest = Message<"scalekit.v1.directories.AssignRolesRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.directories.RoleAssignments role_assignments = 3;
     */
    roleAssignments?: RoleAssignments;
};
/**
 * Describes the message scalekit.v1.directories.AssignRolesRequest.
 * Use `create(AssignRolesRequestSchema)` to create a new message.
 */
export declare const AssignRolesRequestSchema: GenMessage<AssignRolesRequest>;
/**
 * @generated from message scalekit.v1.directories.RoleAssignments
 */
export type RoleAssignments = Message<"scalekit.v1.directories.RoleAssignments"> & {
    /**
     * @generated from field: repeated scalekit.v1.directories.RoleAssignment assignments = 1;
     */
    assignments: RoleAssignment[];
};
/**
 * Describes the message scalekit.v1.directories.RoleAssignments.
 * Use `create(RoleAssignmentsSchema)` to create a new message.
 */
export declare const RoleAssignmentsSchema: GenMessage<RoleAssignments>;
/**
 * @generated from message scalekit.v1.directories.AssignRolesResponse
 */
export type AssignRolesResponse = Message<"scalekit.v1.directories.AssignRolesResponse"> & {
    /**
     * @generated from field: scalekit.v1.directories.RoleAssignments role_assignments = 1;
     */
    roleAssignments?: RoleAssignments;
};
/**
 * Describes the message scalekit.v1.directories.AssignRolesResponse.
 * Use `create(AssignRolesResponseSchema)` to create a new message.
 */
export declare const AssignRolesResponseSchema: GenMessage<AssignRolesResponse>;
/**
 * @generated from message scalekit.v1.directories.RoleAssignment
 */
export type RoleAssignment = Message<"scalekit.v1.directories.RoleAssignment"> & {
    /**
     * @generated from field: string group_id = 1;
     */
    groupId: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    /**
     * @generated from field: string role_id = 3;
     */
    roleId: string;
};
/**
 * Describes the message scalekit.v1.directories.RoleAssignment.
 * Use `create(RoleAssignmentSchema)` to create a new message.
 */
export declare const RoleAssignmentSchema: GenMessage<RoleAssignment>;
/**
 * @generated from message scalekit.v1.directories.UpdateAttributesRequest
 */
export type UpdateAttributesRequest = Message<"scalekit.v1.directories.UpdateAttributesRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.directories.AttributeMappings attribute_mapping = 3;
     */
    attributeMapping?: AttributeMappings;
};
/**
 * Describes the message scalekit.v1.directories.UpdateAttributesRequest.
 * Use `create(UpdateAttributesRequestSchema)` to create a new message.
 */
export declare const UpdateAttributesRequestSchema: GenMessage<UpdateAttributesRequest>;
/**
 * @generated from message scalekit.v1.directories.AttributeMappings
 */
export type AttributeMappings = Message<"scalekit.v1.directories.AttributeMappings"> & {
    /**
     * @generated from field: repeated scalekit.v1.directories.AttributeMapping attributes = 1;
     */
    attributes: AttributeMapping[];
};
/**
 * Describes the message scalekit.v1.directories.AttributeMappings.
 * Use `create(AttributeMappingsSchema)` to create a new message.
 */
export declare const AttributeMappingsSchema: GenMessage<AttributeMappings>;
/**
 * @generated from message scalekit.v1.directories.AttributeMapping
 */
export type AttributeMapping = Message<"scalekit.v1.directories.AttributeMapping"> & {
    /**
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string map_to = 2;
     */
    mapTo: string;
};
/**
 * Describes the message scalekit.v1.directories.AttributeMapping.
 * Use `create(AttributeMappingSchema)` to create a new message.
 */
export declare const AttributeMappingSchema: GenMessage<AttributeMapping>;
/**
 * @generated from message scalekit.v1.directories.UpdateAttributesResponse
 */
export type UpdateAttributesResponse = Message<"scalekit.v1.directories.UpdateAttributesResponse"> & {
    /**
     * @generated from field: scalekit.v1.directories.AttributeMappings attribute_mappings = 1;
     */
    attributeMappings?: AttributeMappings;
};
/**
 * Describes the message scalekit.v1.directories.UpdateAttributesResponse.
 * Use `create(UpdateAttributesResponseSchema)` to create a new message.
 */
export declare const UpdateAttributesResponseSchema: GenMessage<UpdateAttributesResponse>;
/**
 * @generated from message scalekit.v1.directories.DeleteDirectoryRequest
 */
export type DeleteDirectoryRequest = Message<"scalekit.v1.directories.DeleteDirectoryRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.directories.DeleteDirectoryRequest.
 * Use `create(DeleteDirectoryRequestSchema)` to create a new message.
 */
export declare const DeleteDirectoryRequestSchema: GenMessage<DeleteDirectoryRequest>;
/**
 * @generated from message scalekit.v1.directories.TriggerDirectorySyncRequest
 */
export type TriggerDirectorySyncRequest = Message<"scalekit.v1.directories.TriggerDirectorySyncRequest"> & {
    /**
     * @generated from field: string directory_id = 1;
     */
    directoryId: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
};
/**
 * Describes the message scalekit.v1.directories.TriggerDirectorySyncRequest.
 * Use `create(TriggerDirectorySyncRequestSchema)` to create a new message.
 */
export declare const TriggerDirectorySyncRequestSchema: GenMessage<TriggerDirectorySyncRequest>;
/**
 * @generated from enum scalekit.v1.directories.DirectoryType
 */
export declare enum DirectoryType {
    /**
     * @generated from enum value: DIRECTORY_TYPE_UNSPECIFIED = 0;
     */
    DIRECTORY_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: SCIM = 1;
     */
    SCIM = 1,
    /**
     * @generated from enum value: LDAP = 2;
     */
    LDAP = 2,
    /**
     * @generated from enum value: POLL = 3;
     */
    POLL = 3
}
/**
 * Describes the enum scalekit.v1.directories.DirectoryType.
 */
export declare const DirectoryTypeSchema: GenEnum<DirectoryType>;
/**
 * @generated from enum scalekit.v1.directories.DirectoryProvider
 */
export declare enum DirectoryProvider {
    /**
     * @generated from enum value: DIRECTORY_PROVIDER_UNSPECIFIED = 0;
     */
    DIRECTORY_PROVIDER_UNSPECIFIED = 0,
    /**
     * @generated from enum value: OKTA = 1;
     */
    OKTA = 1,
    /**
     * @generated from enum value: GOOGLE = 2;
     */
    GOOGLE = 2,
    /**
     * @generated from enum value: MICROSOFT_AD = 3;
     */
    MICROSOFT_AD = 3,
    /**
     * @generated from enum value: AUTH0 = 4;
     */
    AUTH0 = 4,
    /**
     * @generated from enum value: ONELOGIN = 5;
     */
    ONELOGIN = 5,
    /**
     * @generated from enum value: JUMPCLOUD = 6;
     */
    JUMPCLOUD = 6,
    /**
     * @generated from enum value: PING_IDENTITY = 7;
     */
    PING_IDENTITY = 7
}
/**
 * Describes the enum scalekit.v1.directories.DirectoryProvider.
 */
export declare const DirectoryProviderSchema: GenEnum<DirectoryProvider>;
/**
 * @generated from enum scalekit.v1.directories.DirectoryStatus
 */
export declare enum DirectoryStatus {
    /**
     * @generated from enum value: DIRECTORY_STATUS_UNSPECIFIED = 0;
     */
    DIRECTORY_STATUS_UNSPECIFIED = 0,
    /**
     * @generated from enum value: DRAFT = 1;
     */
    DRAFT = 1,
    /**
     * @generated from enum value: IN_PROGRESS = 2;
     */
    IN_PROGRESS = 2,
    /**
     * @generated from enum value: COMPLETED = 3;
     */
    COMPLETED = 3
}
/**
 * Describes the enum scalekit.v1.directories.DirectoryStatus.
 */
export declare const DirectoryStatusSchema: GenEnum<DirectoryStatus>;
/**
 * @generated from enum scalekit.v1.directories.SecretStatus
 */
export declare enum SecretStatus {
    /**
     * @generated from enum value: ACTIVE = 0;
     */
    ACTIVE = 0,
    /**
     * @generated from enum value: INACTIVE = 1;
     */
    INACTIVE = 1
}
/**
 * Describes the enum scalekit.v1.directories.SecretStatus.
 */
export declare const SecretStatusSchema: GenEnum<SecretStatus>;
/**
 * @generated from service scalekit.v1.directories.DirectoryService
 */
export declare const DirectoryService: GenService<{
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.CreateDirectory
     */
    createDirectory: {
        methodKind: "unary";
        input: typeof CreateDirectoryRequestSchema;
        output: typeof CreateDirectoryResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.DeleteDirectory
     */
    deleteDirectory: {
        methodKind: "unary";
        input: typeof DeleteDirectoryRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.UpdateDirectory
     */
    updateDirectory: {
        methodKind: "unary";
        input: typeof UpdateDirectoryRequestSchema;
        output: typeof UpdateDirectoryResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.AssignGroupsForDirectory
     */
    assignGroupsForDirectory: {
        methodKind: "unary";
        input: typeof AssignGroupsForDirectoryRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.AssignRoles
     */
    assignRoles: {
        methodKind: "unary";
        input: typeof AssignRolesRequestSchema;
        output: typeof AssignRolesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.UpdateAttributes
     */
    updateAttributes: {
        methodKind: "unary";
        input: typeof UpdateAttributesRequestSchema;
        output: typeof UpdateAttributesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.GetDirectory
     */
    getDirectory: {
        methodKind: "unary";
        input: typeof GetDirectoryRequestSchema;
        output: typeof GetDirectoryResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.ListDirectories
     */
    listDirectories: {
        methodKind: "unary";
        input: typeof ListDirectoriesRequestSchema;
        output: typeof ListDirectoriesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.EnableDirectory
     */
    enableDirectory: {
        methodKind: "unary";
        input: typeof ToggleDirectoryRequestSchema;
        output: typeof ToggleDirectoryResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.DisableDirectory
     */
    disableDirectory: {
        methodKind: "unary";
        input: typeof ToggleDirectoryRequestSchema;
        output: typeof ToggleDirectoryResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.ListDirectoryUsers
     */
    listDirectoryUsers: {
        methodKind: "unary";
        input: typeof ListDirectoryUsersRequestSchema;
        output: typeof ListDirectoryUsersResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.ListDirectoryGroups
     */
    listDirectoryGroups: {
        methodKind: "unary";
        input: typeof ListDirectoryGroupsRequestSchema;
        output: typeof ListDirectoryGroupsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.ListDirectoryGroupsSummary
     */
    listDirectoryGroupsSummary: {
        methodKind: "unary";
        input: typeof ListDirectoryGroupsSummaryRequestSchema;
        output: typeof ListDirectoryGroupsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.CreateDirectorySecret
     */
    createDirectorySecret: {
        methodKind: "unary";
        input: typeof CreateDirectorySecretRequestSchema;
        output: typeof CreateDirectorySecretResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.RegenerateDirectorySecret
     */
    regenerateDirectorySecret: {
        methodKind: "unary";
        input: typeof RegenerateDirectorySecretRequestSchema;
        output: typeof RegenerateDirectorySecretResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.directories.DirectoryService.TriggerDirectorySync
     */
    triggerDirectorySync: {
        methodKind: "unary";
        input: typeof TriggerDirectorySyncRequestSchema;
        output: typeof EmptySchema;
    };
}>;
