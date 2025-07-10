import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Struct, Timestamp } from "@bufbuild/protobuf";
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
 * @generated from message scalekit.v1.directories.GetDirectoryRequest
 */
export declare class GetDirectoryRequest extends Message<GetDirectoryRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    constructor(data?: PartialMessage<GetDirectoryRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.GetDirectoryRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDirectoryRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDirectoryRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDirectoryRequest;
    static equals(a: GetDirectoryRequest | PlainMessage<GetDirectoryRequest> | undefined, b: GetDirectoryRequest | PlainMessage<GetDirectoryRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.GetDirectoryResponse
 */
export declare class GetDirectoryResponse extends Message<GetDirectoryResponse> {
    /**
     * @generated from field: scalekit.v1.directories.Directory directory = 1;
     */
    directory?: Directory;
    constructor(data?: PartialMessage<GetDirectoryResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.GetDirectoryResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDirectoryResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDirectoryResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDirectoryResponse;
    static equals(a: GetDirectoryResponse | PlainMessage<GetDirectoryResponse> | undefined, b: GetDirectoryResponse | PlainMessage<GetDirectoryResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.CreateDirectoryRequest
 */
export declare class CreateDirectoryRequest extends Message<CreateDirectoryRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.directories.CreateDirectory directory = 2;
     */
    directory?: CreateDirectory;
    constructor(data?: PartialMessage<CreateDirectoryRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.CreateDirectoryRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDirectoryRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDirectoryRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDirectoryRequest;
    static equals(a: CreateDirectoryRequest | PlainMessage<CreateDirectoryRequest> | undefined, b: CreateDirectoryRequest | PlainMessage<CreateDirectoryRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.CreateDirectory
 */
export declare class CreateDirectory extends Message<CreateDirectory> {
    /**
     * @generated from field: scalekit.v1.directories.DirectoryType directory_type = 1;
     */
    directoryType: DirectoryType;
    /**
     * @generated from field: scalekit.v1.directories.DirectoryProvider directory_provider = 2;
     */
    directoryProvider: DirectoryProvider;
    constructor(data?: PartialMessage<CreateDirectory>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.CreateDirectory";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDirectory;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDirectory;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDirectory;
    static equals(a: CreateDirectory | PlainMessage<CreateDirectory> | undefined, b: CreateDirectory | PlainMessage<CreateDirectory> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.CreateDirectoryResponse
 */
export declare class CreateDirectoryResponse extends Message<CreateDirectoryResponse> {
    /**
     * @generated from field: scalekit.v1.directories.Directory directory = 1;
     */
    directory?: Directory;
    constructor(data?: PartialMessage<CreateDirectoryResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.CreateDirectoryResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDirectoryResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDirectoryResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDirectoryResponse;
    static equals(a: CreateDirectoryResponse | PlainMessage<CreateDirectoryResponse> | undefined, b: CreateDirectoryResponse | PlainMessage<CreateDirectoryResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.UpdateDirectoryRequest
 */
export declare class UpdateDirectoryRequest extends Message<UpdateDirectoryRequest> {
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
    constructor(data?: PartialMessage<UpdateDirectoryRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.UpdateDirectoryRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDirectoryRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDirectoryRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDirectoryRequest;
    static equals(a: UpdateDirectoryRequest | PlainMessage<UpdateDirectoryRequest> | undefined, b: UpdateDirectoryRequest | PlainMessage<UpdateDirectoryRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.UpdateDirectory
 */
export declare class UpdateDirectory extends Message<UpdateDirectory> {
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
    constructor(data?: PartialMessage<UpdateDirectory>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.UpdateDirectory";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDirectory;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDirectory;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDirectory;
    static equals(a: UpdateDirectory | PlainMessage<UpdateDirectory> | undefined, b: UpdateDirectory | PlainMessage<UpdateDirectory> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.UpdateDirectoryResponse
 */
export declare class UpdateDirectoryResponse extends Message<UpdateDirectoryResponse> {
    /**
     * @generated from field: scalekit.v1.directories.Directory directory = 1;
     */
    directory?: Directory;
    constructor(data?: PartialMessage<UpdateDirectoryResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.UpdateDirectoryResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDirectoryResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDirectoryResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDirectoryResponse;
    static equals(a: UpdateDirectoryResponse | PlainMessage<UpdateDirectoryResponse> | undefined, b: UpdateDirectoryResponse | PlainMessage<UpdateDirectoryResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.AssignGroupsForDirectoryRequest
 */
export declare class AssignGroupsForDirectoryRequest extends Message<AssignGroupsForDirectoryRequest> {
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
    constructor(data?: PartialMessage<AssignGroupsForDirectoryRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.AssignGroupsForDirectoryRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssignGroupsForDirectoryRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssignGroupsForDirectoryRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssignGroupsForDirectoryRequest;
    static equals(a: AssignGroupsForDirectoryRequest | PlainMessage<AssignGroupsForDirectoryRequest> | undefined, b: AssignGroupsForDirectoryRequest | PlainMessage<AssignGroupsForDirectoryRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ListDirectoriesRequest
 */
export declare class ListDirectoriesRequest extends Message<ListDirectoriesRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    constructor(data?: PartialMessage<ListDirectoriesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ListDirectoriesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDirectoriesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDirectoriesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDirectoriesRequest;
    static equals(a: ListDirectoriesRequest | PlainMessage<ListDirectoriesRequest> | undefined, b: ListDirectoriesRequest | PlainMessage<ListDirectoriesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ListDirectoriesResponse
 */
export declare class ListDirectoriesResponse extends Message<ListDirectoriesResponse> {
    /**
     * @generated from field: repeated scalekit.v1.directories.Directory directories = 1;
     */
    directories: Directory[];
    constructor(data?: PartialMessage<ListDirectoriesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ListDirectoriesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDirectoriesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDirectoriesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDirectoriesResponse;
    static equals(a: ListDirectoriesResponse | PlainMessage<ListDirectoriesResponse> | undefined, b: ListDirectoriesResponse | PlainMessage<ListDirectoriesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ListDirectoryUsersRequest
 */
export declare class ListDirectoryUsersRequest extends Message<ListDirectoryUsersRequest> {
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
    constructor(data?: PartialMessage<ListDirectoryUsersRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ListDirectoryUsersRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDirectoryUsersRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDirectoryUsersRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDirectoryUsersRequest;
    static equals(a: ListDirectoryUsersRequest | PlainMessage<ListDirectoryUsersRequest> | undefined, b: ListDirectoryUsersRequest | PlainMessage<ListDirectoryUsersRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ListDirectoryUsersResponse
 */
export declare class ListDirectoryUsersResponse extends Message<ListDirectoryUsersResponse> {
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
    constructor(data?: PartialMessage<ListDirectoryUsersResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ListDirectoryUsersResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDirectoryUsersResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDirectoryUsersResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDirectoryUsersResponse;
    static equals(a: ListDirectoryUsersResponse | PlainMessage<ListDirectoryUsersResponse> | undefined, b: ListDirectoryUsersResponse | PlainMessage<ListDirectoryUsersResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ListDirectoryGroupsRequest
 */
export declare class ListDirectoryGroupsRequest extends Message<ListDirectoryGroupsRequest> {
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
    constructor(data?: PartialMessage<ListDirectoryGroupsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ListDirectoryGroupsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDirectoryGroupsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDirectoryGroupsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDirectoryGroupsRequest;
    static equals(a: ListDirectoryGroupsRequest | PlainMessage<ListDirectoryGroupsRequest> | undefined, b: ListDirectoryGroupsRequest | PlainMessage<ListDirectoryGroupsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ListDirectoryGroupsResponse
 */
export declare class ListDirectoryGroupsResponse extends Message<ListDirectoryGroupsResponse> {
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
    constructor(data?: PartialMessage<ListDirectoryGroupsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ListDirectoryGroupsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDirectoryGroupsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDirectoryGroupsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDirectoryGroupsResponse;
    static equals(a: ListDirectoryGroupsResponse | PlainMessage<ListDirectoryGroupsResponse> | undefined, b: ListDirectoryGroupsResponse | PlainMessage<ListDirectoryGroupsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ListDirectoryGroupsSummaryRequest
 */
export declare class ListDirectoryGroupsSummaryRequest extends Message<ListDirectoryGroupsSummaryRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string directory_id = 2;
     */
    directoryId: string;
    constructor(data?: PartialMessage<ListDirectoryGroupsSummaryRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ListDirectoryGroupsSummaryRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDirectoryGroupsSummaryRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDirectoryGroupsSummaryRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDirectoryGroupsSummaryRequest;
    static equals(a: ListDirectoryGroupsSummaryRequest | PlainMessage<ListDirectoryGroupsSummaryRequest> | undefined, b: ListDirectoryGroupsSummaryRequest | PlainMessage<ListDirectoryGroupsSummaryRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.Directory
 */
export declare class Directory extends Message<Directory> {
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
    constructor(data?: PartialMessage<Directory>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.Directory";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Directory;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Directory;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Directory;
    static equals(a: Directory | PlainMessage<Directory> | undefined, b: Directory | PlainMessage<Directory> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ToggleDirectoryRequest
 */
export declare class ToggleDirectoryRequest extends Message<ToggleDirectoryRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
    constructor(data?: PartialMessage<ToggleDirectoryRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ToggleDirectoryRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ToggleDirectoryRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ToggleDirectoryRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ToggleDirectoryRequest;
    static equals(a: ToggleDirectoryRequest | PlainMessage<ToggleDirectoryRequest> | undefined, b: ToggleDirectoryRequest | PlainMessage<ToggleDirectoryRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ToggleDirectoryResponse
 */
export declare class ToggleDirectoryResponse extends Message<ToggleDirectoryResponse> {
    /**
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * @generated from field: optional string error_message = 2;
     */
    errorMessage?: string;
    constructor(data?: PartialMessage<ToggleDirectoryResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ToggleDirectoryResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ToggleDirectoryResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ToggleDirectoryResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ToggleDirectoryResponse;
    static equals(a: ToggleDirectoryResponse | PlainMessage<ToggleDirectoryResponse> | undefined, b: ToggleDirectoryResponse | PlainMessage<ToggleDirectoryResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.DirectoryMapping
 */
export declare class DirectoryMapping extends Message<DirectoryMapping> {
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
    constructor(data?: PartialMessage<DirectoryMapping>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.DirectoryMapping";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DirectoryMapping;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DirectoryMapping;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DirectoryMapping;
    static equals(a: DirectoryMapping | PlainMessage<DirectoryMapping> | undefined, b: DirectoryMapping | PlainMessage<DirectoryMapping> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.DirectoryUser
 */
export declare class DirectoryUser extends Message<DirectoryUser> {
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
    userDetail?: Struct;
    constructor(data?: PartialMessage<DirectoryUser>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.DirectoryUser";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DirectoryUser;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DirectoryUser;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DirectoryUser;
    static equals(a: DirectoryUser | PlainMessage<DirectoryUser> | undefined, b: DirectoryUser | PlainMessage<DirectoryUser> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.ExternalGroup
 */
export declare class ExternalGroup extends Message<ExternalGroup> {
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
    constructor(data?: PartialMessage<ExternalGroup>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.ExternalGroup";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ExternalGroup;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ExternalGroup;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ExternalGroup;
    static equals(a: ExternalGroup | PlainMessage<ExternalGroup> | undefined, b: ExternalGroup | PlainMessage<ExternalGroup> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.DirectoryGroup
 */
export declare class DirectoryGroup extends Message<DirectoryGroup> {
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
    groupDetail?: Struct;
    constructor(data?: PartialMessage<DirectoryGroup>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.DirectoryGroup";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DirectoryGroup;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DirectoryGroup;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DirectoryGroup;
    static equals(a: DirectoryGroup | PlainMessage<DirectoryGroup> | undefined, b: DirectoryGroup | PlainMessage<DirectoryGroup> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.CreateDirectorySecretRequest
 */
export declare class CreateDirectorySecretRequest extends Message<CreateDirectorySecretRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string directory_id = 2;
     */
    directoryId: string;
    constructor(data?: PartialMessage<CreateDirectorySecretRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.CreateDirectorySecretRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDirectorySecretRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDirectorySecretRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDirectorySecretRequest;
    static equals(a: CreateDirectorySecretRequest | PlainMessage<CreateDirectorySecretRequest> | undefined, b: CreateDirectorySecretRequest | PlainMessage<CreateDirectorySecretRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.CreateDirectorySecretResponse
 */
export declare class CreateDirectorySecretResponse extends Message<CreateDirectorySecretResponse> {
    /**
     * @generated from field: string plain_secret = 1;
     */
    plainSecret: string;
    /**
     * @generated from field: scalekit.v1.directories.Secret secret = 2;
     */
    secret?: Secret;
    constructor(data?: PartialMessage<CreateDirectorySecretResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.CreateDirectorySecretResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDirectorySecretResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDirectorySecretResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDirectorySecretResponse;
    static equals(a: CreateDirectorySecretResponse | PlainMessage<CreateDirectorySecretResponse> | undefined, b: CreateDirectorySecretResponse | PlainMessage<CreateDirectorySecretResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.RegenerateDirectorySecretRequest
 */
export declare class RegenerateDirectorySecretRequest extends Message<RegenerateDirectorySecretRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string directory_id = 2;
     */
    directoryId: string;
    constructor(data?: PartialMessage<RegenerateDirectorySecretRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.RegenerateDirectorySecretRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RegenerateDirectorySecretRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RegenerateDirectorySecretRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RegenerateDirectorySecretRequest;
    static equals(a: RegenerateDirectorySecretRequest | PlainMessage<RegenerateDirectorySecretRequest> | undefined, b: RegenerateDirectorySecretRequest | PlainMessage<RegenerateDirectorySecretRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.RegenerateDirectorySecretResponse
 */
export declare class RegenerateDirectorySecretResponse extends Message<RegenerateDirectorySecretResponse> {
    /**
     * @generated from field: string plain_secret = 1;
     */
    plainSecret: string;
    /**
     * @generated from field: scalekit.v1.directories.Secret secret = 2;
     */
    secret?: Secret;
    constructor(data?: PartialMessage<RegenerateDirectorySecretResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.RegenerateDirectorySecretResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RegenerateDirectorySecretResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RegenerateDirectorySecretResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RegenerateDirectorySecretResponse;
    static equals(a: RegenerateDirectorySecretResponse | PlainMessage<RegenerateDirectorySecretResponse> | undefined, b: RegenerateDirectorySecretResponse | PlainMessage<RegenerateDirectorySecretResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.Secret
 */
export declare class Secret extends Message<Secret> {
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
    constructor(data?: PartialMessage<Secret>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.Secret";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Secret;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Secret;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Secret;
    static equals(a: Secret | PlainMessage<Secret> | undefined, b: Secret | PlainMessage<Secret> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.Stats
 */
export declare class Stats extends Message<Stats> {
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
    constructor(data?: PartialMessage<Stats>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.Stats";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Stats;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Stats;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Stats;
    static equals(a: Stats | PlainMessage<Stats> | undefined, b: Stats | PlainMessage<Stats> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.AssignRolesRequest
 */
export declare class AssignRolesRequest extends Message<AssignRolesRequest> {
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
    constructor(data?: PartialMessage<AssignRolesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.AssignRolesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssignRolesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssignRolesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssignRolesRequest;
    static equals(a: AssignRolesRequest | PlainMessage<AssignRolesRequest> | undefined, b: AssignRolesRequest | PlainMessage<AssignRolesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.RoleAssignments
 */
export declare class RoleAssignments extends Message<RoleAssignments> {
    /**
     * @generated from field: repeated scalekit.v1.directories.RoleAssignment assignments = 1;
     */
    assignments: RoleAssignment[];
    constructor(data?: PartialMessage<RoleAssignments>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.RoleAssignments";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RoleAssignments;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RoleAssignments;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RoleAssignments;
    static equals(a: RoleAssignments | PlainMessage<RoleAssignments> | undefined, b: RoleAssignments | PlainMessage<RoleAssignments> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.AssignRolesResponse
 */
export declare class AssignRolesResponse extends Message<AssignRolesResponse> {
    /**
     * @generated from field: scalekit.v1.directories.RoleAssignments role_assignments = 1;
     */
    roleAssignments?: RoleAssignments;
    constructor(data?: PartialMessage<AssignRolesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.AssignRolesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssignRolesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssignRolesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssignRolesResponse;
    static equals(a: AssignRolesResponse | PlainMessage<AssignRolesResponse> | undefined, b: AssignRolesResponse | PlainMessage<AssignRolesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.RoleAssignment
 */
export declare class RoleAssignment extends Message<RoleAssignment> {
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
    constructor(data?: PartialMessage<RoleAssignment>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.RoleAssignment";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RoleAssignment;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RoleAssignment;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RoleAssignment;
    static equals(a: RoleAssignment | PlainMessage<RoleAssignment> | undefined, b: RoleAssignment | PlainMessage<RoleAssignment> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.UpdateAttributesRequest
 */
export declare class UpdateAttributesRequest extends Message<UpdateAttributesRequest> {
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
    constructor(data?: PartialMessage<UpdateAttributesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.UpdateAttributesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateAttributesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateAttributesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateAttributesRequest;
    static equals(a: UpdateAttributesRequest | PlainMessage<UpdateAttributesRequest> | undefined, b: UpdateAttributesRequest | PlainMessage<UpdateAttributesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.AttributeMappings
 */
export declare class AttributeMappings extends Message<AttributeMappings> {
    /**
     * @generated from field: repeated scalekit.v1.directories.AttributeMapping attributes = 1;
     */
    attributes: AttributeMapping[];
    constructor(data?: PartialMessage<AttributeMappings>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.AttributeMappings";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AttributeMappings;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AttributeMappings;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AttributeMappings;
    static equals(a: AttributeMappings | PlainMessage<AttributeMappings> | undefined, b: AttributeMappings | PlainMessage<AttributeMappings> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.AttributeMapping
 */
export declare class AttributeMapping extends Message<AttributeMapping> {
    /**
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string map_to = 2;
     */
    mapTo: string;
    constructor(data?: PartialMessage<AttributeMapping>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.AttributeMapping";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AttributeMapping;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AttributeMapping;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AttributeMapping;
    static equals(a: AttributeMapping | PlainMessage<AttributeMapping> | undefined, b: AttributeMapping | PlainMessage<AttributeMapping> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.UpdateAttributesResponse
 */
export declare class UpdateAttributesResponse extends Message<UpdateAttributesResponse> {
    /**
     * @generated from field: scalekit.v1.directories.AttributeMappings attribute_mappings = 1;
     */
    attributeMappings?: AttributeMappings;
    constructor(data?: PartialMessage<UpdateAttributesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.UpdateAttributesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateAttributesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateAttributesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateAttributesResponse;
    static equals(a: UpdateAttributesResponse | PlainMessage<UpdateAttributesResponse> | undefined, b: UpdateAttributesResponse | PlainMessage<UpdateAttributesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.DeleteDirectoryRequest
 */
export declare class DeleteDirectoryRequest extends Message<DeleteDirectoryRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
    constructor(data?: PartialMessage<DeleteDirectoryRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.DeleteDirectoryRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteDirectoryRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteDirectoryRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteDirectoryRequest;
    static equals(a: DeleteDirectoryRequest | PlainMessage<DeleteDirectoryRequest> | undefined, b: DeleteDirectoryRequest | PlainMessage<DeleteDirectoryRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.directories.TriggerDirectorySyncRequest
 */
export declare class TriggerDirectorySyncRequest extends Message<TriggerDirectorySyncRequest> {
    /**
     * @generated from field: string directory_id = 1;
     */
    directoryId: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    constructor(data?: PartialMessage<TriggerDirectorySyncRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.directories.TriggerDirectorySyncRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TriggerDirectorySyncRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TriggerDirectorySyncRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TriggerDirectorySyncRequest;
    static equals(a: TriggerDirectorySyncRequest | PlainMessage<TriggerDirectorySyncRequest> | undefined, b: TriggerDirectorySyncRequest | PlainMessage<TriggerDirectorySyncRequest> | undefined): boolean;
}
