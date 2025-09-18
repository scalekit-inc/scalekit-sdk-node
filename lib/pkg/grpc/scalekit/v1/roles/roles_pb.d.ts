import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from message scalekit.v1.roles.Role
 */
export declare class Role extends Message<Role> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: bool default_creator = 6;
     */
    defaultCreator: boolean;
    /**
     * @generated from field: bool default_member = 7;
     */
    defaultMember: boolean;
    /**
     * @generated from field: optional string extends = 8;
     */
    extends?: string;
    /**
     * @generated from field: repeated scalekit.v1.roles.RolePermission permissions = 9;
     */
    permissions: RolePermission[];
    /**
     * @generated from field: int32 dependent_roles_count = 10;
     */
    dependentRolesCount: number;
    /**
     * @generated from field: bool is_org_role = 11;
     */
    isOrgRole: boolean;
    constructor(data?: PartialMessage<Role>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.Role";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Role;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Role;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Role;
    static equals(a: Role | PlainMessage<Role> | undefined, b: Role | PlainMessage<Role> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.CreateRole
 */
export declare class CreateRole extends Message<CreateRole> {
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
    /**
     * @generated from field: optional string description = 4;
     */
    description?: string;
    /**
     * @generated from field: optional string extends = 8;
     */
    extends?: string;
    /**
     * @generated from field: repeated string permissions = 9;
     */
    permissions: string[];
    constructor(data?: PartialMessage<CreateRole>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.CreateRole";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateRole;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateRole;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateRole;
    static equals(a: CreateRole | PlainMessage<CreateRole> | undefined, b: CreateRole | PlainMessage<CreateRole> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.CreateOrganizationRole
 */
export declare class CreateOrganizationRole extends Message<CreateOrganizationRole> {
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
    /**
     * @generated from field: optional string description = 4;
     */
    description?: string;
    /**
     * @generated from field: optional string extends = 8;
     */
    extends?: string;
    /**
     * @generated from field: repeated string permissions = 9;
     */
    permissions: string[];
    constructor(data?: PartialMessage<CreateOrganizationRole>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.CreateOrganizationRole";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateOrganizationRole;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateOrganizationRole;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateOrganizationRole;
    static equals(a: CreateOrganizationRole | PlainMessage<CreateOrganizationRole> | undefined, b: CreateOrganizationRole | PlainMessage<CreateOrganizationRole> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.CreateRoleRequest
 */
export declare class CreateRoleRequest extends Message<CreateRoleRequest> {
    /**
     * @generated from field: scalekit.v1.roles.CreateRole role = 2;
     */
    role?: CreateRole;
    constructor(data?: PartialMessage<CreateRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.CreateRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateRoleRequest;
    static equals(a: CreateRoleRequest | PlainMessage<CreateRoleRequest> | undefined, b: CreateRoleRequest | PlainMessage<CreateRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.CreateRoleResponse
 */
export declare class CreateRoleResponse extends Message<CreateRoleResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
    constructor(data?: PartialMessage<CreateRoleResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.CreateRoleResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateRoleResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateRoleResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateRoleResponse;
    static equals(a: CreateRoleResponse | PlainMessage<CreateRoleResponse> | undefined, b: CreateRoleResponse | PlainMessage<CreateRoleResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetRoleRequest
 */
export declare class GetRoleRequest extends Message<GetRoleRequest> {
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    /**
     * @generated from field: optional string include = 3;
     */
    include?: string;
    constructor(data?: PartialMessage<GetRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetRoleRequest;
    static equals(a: GetRoleRequest | PlainMessage<GetRoleRequest> | undefined, b: GetRoleRequest | PlainMessage<GetRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetRoleResponse
 */
export declare class GetRoleResponse extends Message<GetRoleResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
    constructor(data?: PartialMessage<GetRoleResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetRoleResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetRoleResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetRoleResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetRoleResponse;
    static equals(a: GetRoleResponse | PlainMessage<GetRoleResponse> | undefined, b: GetRoleResponse | PlainMessage<GetRoleResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListRolesRequest
 */
export declare class ListRolesRequest extends Message<ListRolesRequest> {
    /**
     * @generated from field: optional string include = 2;
     */
    include?: string;
    constructor(data?: PartialMessage<ListRolesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListRolesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListRolesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListRolesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListRolesRequest;
    static equals(a: ListRolesRequest | PlainMessage<ListRolesRequest> | undefined, b: ListRolesRequest | PlainMessage<ListRolesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListRolesResponse
 */
export declare class ListRolesResponse extends Message<ListRolesResponse> {
    /**
     * @generated from field: repeated scalekit.v1.roles.Role roles = 1;
     */
    roles: Role[];
    constructor(data?: PartialMessage<ListRolesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListRolesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListRolesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListRolesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListRolesResponse;
    static equals(a: ListRolesResponse | PlainMessage<ListRolesResponse> | undefined, b: ListRolesResponse | PlainMessage<ListRolesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateRole
 */
export declare class UpdateRole extends Message<UpdateRole> {
    /**
     * @generated from field: optional string display_name = 1;
     */
    displayName?: string;
    /**
     * @generated from field: optional string description = 2;
     */
    description?: string;
    /**
     * @generated from field: optional string extends = 6;
     */
    extends?: string;
    /**
     * @generated from field: repeated string permissions = 7;
     */
    permissions: string[];
    constructor(data?: PartialMessage<UpdateRole>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateRole";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateRole;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateRole;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateRole;
    static equals(a: UpdateRole | PlainMessage<UpdateRole> | undefined, b: UpdateRole | PlainMessage<UpdateRole> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateRoleRequest
 */
export declare class UpdateRoleRequest extends Message<UpdateRoleRequest> {
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    /**
     * @generated from field: scalekit.v1.roles.UpdateRole role = 3;
     */
    role?: UpdateRole;
    constructor(data?: PartialMessage<UpdateRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateRoleRequest;
    static equals(a: UpdateRoleRequest | PlainMessage<UpdateRoleRequest> | undefined, b: UpdateRoleRequest | PlainMessage<UpdateRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateRoleResponse
 */
export declare class UpdateRoleResponse extends Message<UpdateRoleResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
    constructor(data?: PartialMessage<UpdateRoleResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateRoleResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateRoleResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateRoleResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateRoleResponse;
    static equals(a: UpdateRoleResponse | PlainMessage<UpdateRoleResponse> | undefined, b: UpdateRoleResponse | PlainMessage<UpdateRoleResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.DeleteRoleRequest
 */
export declare class DeleteRoleRequest extends Message<DeleteRoleRequest> {
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    /**
     * @generated from field: optional string reassign_role_id = 3 [deprecated = true];
     * @deprecated
     */
    reassignRoleId?: string;
    /**
     * @generated from field: optional string reassign_role_name = 4;
     */
    reassignRoleName?: string;
    constructor(data?: PartialMessage<DeleteRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.DeleteRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteRoleRequest;
    static equals(a: DeleteRoleRequest | PlainMessage<DeleteRoleRequest> | undefined, b: DeleteRoleRequest | PlainMessage<DeleteRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.CreateOrganizationRoleRequest
 */
export declare class CreateOrganizationRoleRequest extends Message<CreateOrganizationRoleRequest> {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: scalekit.v1.roles.CreateOrganizationRole role = 2;
     */
    role?: CreateOrganizationRole;
    constructor(data?: PartialMessage<CreateOrganizationRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.CreateOrganizationRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateOrganizationRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateOrganizationRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateOrganizationRoleRequest;
    static equals(a: CreateOrganizationRoleRequest | PlainMessage<CreateOrganizationRoleRequest> | undefined, b: CreateOrganizationRoleRequest | PlainMessage<CreateOrganizationRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.CreateOrganizationRoleResponse
 */
export declare class CreateOrganizationRoleResponse extends Message<CreateOrganizationRoleResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
    constructor(data?: PartialMessage<CreateOrganizationRoleResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.CreateOrganizationRoleResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateOrganizationRoleResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateOrganizationRoleResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateOrganizationRoleResponse;
    static equals(a: CreateOrganizationRoleResponse | PlainMessage<CreateOrganizationRoleResponse> | undefined, b: CreateOrganizationRoleResponse | PlainMessage<CreateOrganizationRoleResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleRequest
 */
export declare class GetOrganizationRoleRequest extends Message<GetOrganizationRoleRequest> {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    /**
     * @generated from field: optional string include = 3;
     */
    include?: string;
    constructor(data?: PartialMessage<GetOrganizationRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetOrganizationRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationRoleRequest;
    static equals(a: GetOrganizationRoleRequest | PlainMessage<GetOrganizationRoleRequest> | undefined, b: GetOrganizationRoleRequest | PlainMessage<GetOrganizationRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleResponse
 */
export declare class GetOrganizationRoleResponse extends Message<GetOrganizationRoleResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
    constructor(data?: PartialMessage<GetOrganizationRoleResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetOrganizationRoleResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationRoleResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationRoleResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationRoleResponse;
    static equals(a: GetOrganizationRoleResponse | PlainMessage<GetOrganizationRoleResponse> | undefined, b: GetOrganizationRoleResponse | PlainMessage<GetOrganizationRoleResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListOrganizationRolesRequest
 */
export declare class ListOrganizationRolesRequest extends Message<ListOrganizationRolesRequest> {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: optional string include = 2;
     */
    include?: string;
    constructor(data?: PartialMessage<ListOrganizationRolesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListOrganizationRolesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListOrganizationRolesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListOrganizationRolesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListOrganizationRolesRequest;
    static equals(a: ListOrganizationRolesRequest | PlainMessage<ListOrganizationRolesRequest> | undefined, b: ListOrganizationRolesRequest | PlainMessage<ListOrganizationRolesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListOrganizationRolesResponse
 */
export declare class ListOrganizationRolesResponse extends Message<ListOrganizationRolesResponse> {
    /**
     * @generated from field: repeated scalekit.v1.roles.Role roles = 1;
     */
    roles: Role[];
    constructor(data?: PartialMessage<ListOrganizationRolesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListOrganizationRolesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListOrganizationRolesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListOrganizationRolesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListOrganizationRolesResponse;
    static equals(a: ListOrganizationRolesResponse | PlainMessage<ListOrganizationRolesResponse> | undefined, b: ListOrganizationRolesResponse | PlainMessage<ListOrganizationRolesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateOrganizationRoleRequest
 */
export declare class UpdateOrganizationRoleRequest extends Message<UpdateOrganizationRoleRequest> {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    /**
     * @generated from field: scalekit.v1.roles.UpdateRole role = 3;
     */
    role?: UpdateRole;
    constructor(data?: PartialMessage<UpdateOrganizationRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateOrganizationRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateOrganizationRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateOrganizationRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateOrganizationRoleRequest;
    static equals(a: UpdateOrganizationRoleRequest | PlainMessage<UpdateOrganizationRoleRequest> | undefined, b: UpdateOrganizationRoleRequest | PlainMessage<UpdateOrganizationRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateOrganizationRoleResponse
 */
export declare class UpdateOrganizationRoleResponse extends Message<UpdateOrganizationRoleResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
    constructor(data?: PartialMessage<UpdateOrganizationRoleResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateOrganizationRoleResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateOrganizationRoleResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateOrganizationRoleResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateOrganizationRoleResponse;
    static equals(a: UpdateOrganizationRoleResponse | PlainMessage<UpdateOrganizationRoleResponse> | undefined, b: UpdateOrganizationRoleResponse | PlainMessage<UpdateOrganizationRoleResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.DeleteOrganizationRoleRequest
 */
export declare class DeleteOrganizationRoleRequest extends Message<DeleteOrganizationRoleRequest> {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    /**
     * @generated from field: optional string reassign_role_name = 3;
     */
    reassignRoleName?: string;
    constructor(data?: PartialMessage<DeleteOrganizationRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.DeleteOrganizationRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteOrganizationRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteOrganizationRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteOrganizationRoleRequest;
    static equals(a: DeleteOrganizationRoleRequest | PlainMessage<DeleteOrganizationRoleRequest> | undefined, b: DeleteOrganizationRoleRequest | PlainMessage<DeleteOrganizationRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetRoleUsersCountRequest
 */
export declare class GetRoleUsersCountRequest extends Message<GetRoleUsersCountRequest> {
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    constructor(data?: PartialMessage<GetRoleUsersCountRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetRoleUsersCountRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetRoleUsersCountRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetRoleUsersCountRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetRoleUsersCountRequest;
    static equals(a: GetRoleUsersCountRequest | PlainMessage<GetRoleUsersCountRequest> | undefined, b: GetRoleUsersCountRequest | PlainMessage<GetRoleUsersCountRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetRoleUsersCountResponse
 */
export declare class GetRoleUsersCountResponse extends Message<GetRoleUsersCountResponse> {
    /**
     * @generated from field: int64 count = 1;
     */
    count: bigint;
    constructor(data?: PartialMessage<GetRoleUsersCountResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetRoleUsersCountResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetRoleUsersCountResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetRoleUsersCountResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetRoleUsersCountResponse;
    static equals(a: GetRoleUsersCountResponse | PlainMessage<GetRoleUsersCountResponse> | undefined, b: GetRoleUsersCountResponse | PlainMessage<GetRoleUsersCountResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleUsersCountRequest
 */
export declare class GetOrganizationRoleUsersCountRequest extends Message<GetOrganizationRoleUsersCountRequest> {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    constructor(data?: PartialMessage<GetOrganizationRoleUsersCountRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetOrganizationRoleUsersCountRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationRoleUsersCountRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationRoleUsersCountRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationRoleUsersCountRequest;
    static equals(a: GetOrganizationRoleUsersCountRequest | PlainMessage<GetOrganizationRoleUsersCountRequest> | undefined, b: GetOrganizationRoleUsersCountRequest | PlainMessage<GetOrganizationRoleUsersCountRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleUsersCountResponse
 */
export declare class GetOrganizationRoleUsersCountResponse extends Message<GetOrganizationRoleUsersCountResponse> {
    /**
     * @generated from field: int64 count = 1;
     */
    count: bigint;
    constructor(data?: PartialMessage<GetOrganizationRoleUsersCountResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetOrganizationRoleUsersCountResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationRoleUsersCountResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationRoleUsersCountResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationRoleUsersCountResponse;
    static equals(a: GetOrganizationRoleUsersCountResponse | PlainMessage<GetOrganizationRoleUsersCountResponse> | undefined, b: GetOrganizationRoleUsersCountResponse | PlainMessage<GetOrganizationRoleUsersCountResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultRolesRequest
 */
export declare class UpdateDefaultRolesRequest extends Message<UpdateDefaultRolesRequest> {
    /**
     * @generated from field: scalekit.v1.roles.UpdateDefaultRole default_creator = 2 [deprecated = true];
     * @deprecated
     */
    defaultCreator?: UpdateDefaultRole;
    /**
     * @generated from field: scalekit.v1.roles.UpdateDefaultRole default_member = 3 [deprecated = true];
     * @deprecated
     */
    defaultMember?: UpdateDefaultRole;
    /**
     * @generated from field: optional string default_creator_role = 4;
     */
    defaultCreatorRole?: string;
    /**
     * @generated from field: optional string default_member_role = 5;
     */
    defaultMemberRole?: string;
    constructor(data?: PartialMessage<UpdateDefaultRolesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateDefaultRolesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDefaultRolesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDefaultRolesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDefaultRolesRequest;
    static equals(a: UpdateDefaultRolesRequest | PlainMessage<UpdateDefaultRolesRequest> | undefined, b: UpdateDefaultRolesRequest | PlainMessage<UpdateDefaultRolesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultOrganizationRolesRequest
 */
export declare class UpdateDefaultOrganizationRolesRequest extends Message<UpdateDefaultOrganizationRolesRequest> {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: string default_member_role = 2;
     */
    defaultMemberRole: string;
    constructor(data?: PartialMessage<UpdateDefaultOrganizationRolesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateDefaultOrganizationRolesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDefaultOrganizationRolesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDefaultOrganizationRolesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDefaultOrganizationRolesRequest;
    static equals(a: UpdateDefaultOrganizationRolesRequest | PlainMessage<UpdateDefaultOrganizationRolesRequest> | undefined, b: UpdateDefaultOrganizationRolesRequest | PlainMessage<UpdateDefaultOrganizationRolesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultRolesResponse
 */
export declare class UpdateDefaultRolesResponse extends Message<UpdateDefaultRolesResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Role default_creator = 1;
     */
    defaultCreator?: Role;
    /**
     * @generated from field: scalekit.v1.roles.Role default_member = 2;
     */
    defaultMember?: Role;
    constructor(data?: PartialMessage<UpdateDefaultRolesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateDefaultRolesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDefaultRolesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDefaultRolesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDefaultRolesResponse;
    static equals(a: UpdateDefaultRolesResponse | PlainMessage<UpdateDefaultRolesResponse> | undefined, b: UpdateDefaultRolesResponse | PlainMessage<UpdateDefaultRolesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultOrganizationRolesResponse
 */
export declare class UpdateDefaultOrganizationRolesResponse extends Message<UpdateDefaultOrganizationRolesResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Role default_member = 2;
     */
    defaultMember?: Role;
    constructor(data?: PartialMessage<UpdateDefaultOrganizationRolesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateDefaultOrganizationRolesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDefaultOrganizationRolesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDefaultOrganizationRolesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDefaultOrganizationRolesResponse;
    static equals(a: UpdateDefaultOrganizationRolesResponse | PlainMessage<UpdateDefaultOrganizationRolesResponse> | undefined, b: UpdateDefaultOrganizationRolesResponse | PlainMessage<UpdateDefaultOrganizationRolesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultRole
 */
export declare class UpdateDefaultRole extends Message<UpdateDefaultRole> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: optional string name = 2;
     */
    name?: string;
    constructor(data?: PartialMessage<UpdateDefaultRole>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdateDefaultRole";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDefaultRole;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDefaultRole;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDefaultRole;
    static equals(a: UpdateDefaultRole | PlainMessage<UpdateDefaultRole> | undefined, b: UpdateDefaultRole | PlainMessage<UpdateDefaultRole> | undefined): boolean;
}
/**
 * Permission Entity
 *
 * @generated from message scalekit.v1.roles.Permission
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
     * @generated from field: google.protobuf.Timestamp create_time = 4;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 5;
     */
    updateTime?: Timestamp;
    constructor(data?: PartialMessage<Permission>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.Permission";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Permission;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Permission;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Permission;
    static equals(a: Permission | PlainMessage<Permission> | undefined, b: Permission | PlainMessage<Permission> | undefined): boolean;
}
/**
 * RolePermissions represents a permission with role source information
 *
 * @generated from message scalekit.v1.roles.RolePermission
 */
export declare class RolePermission extends Message<RolePermission> {
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
     * @generated from field: google.protobuf.Timestamp create_time = 4;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 5;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: string role_name = 6;
     */
    roleName: string;
    constructor(data?: PartialMessage<RolePermission>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.RolePermission";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RolePermission;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RolePermission;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RolePermission;
    static equals(a: RolePermission | PlainMessage<RolePermission> | undefined, b: RolePermission | PlainMessage<RolePermission> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.CreatePermission
 */
export declare class CreatePermission extends Message<CreatePermission> {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    constructor(data?: PartialMessage<CreatePermission>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.CreatePermission";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreatePermission;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreatePermission;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreatePermission;
    static equals(a: CreatePermission | PlainMessage<CreatePermission> | undefined, b: CreatePermission | PlainMessage<CreatePermission> | undefined): boolean;
}
/**
 * Permission Request/Response Messages
 *
 * @generated from message scalekit.v1.roles.CreatePermissionRequest
 */
export declare class CreatePermissionRequest extends Message<CreatePermissionRequest> {
    /**
     * @generated from field: scalekit.v1.roles.CreatePermission permission = 1;
     */
    permission?: CreatePermission;
    constructor(data?: PartialMessage<CreatePermissionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.CreatePermissionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreatePermissionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreatePermissionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreatePermissionRequest;
    static equals(a: CreatePermissionRequest | PlainMessage<CreatePermissionRequest> | undefined, b: CreatePermissionRequest | PlainMessage<CreatePermissionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.CreatePermissionResponse
 */
export declare class CreatePermissionResponse extends Message<CreatePermissionResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Permission permission = 1;
     */
    permission?: Permission;
    constructor(data?: PartialMessage<CreatePermissionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.CreatePermissionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreatePermissionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreatePermissionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreatePermissionResponse;
    static equals(a: CreatePermissionResponse | PlainMessage<CreatePermissionResponse> | undefined, b: CreatePermissionResponse | PlainMessage<CreatePermissionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetPermissionRequest
 */
export declare class GetPermissionRequest extends Message<GetPermissionRequest> {
    /**
     * @generated from field: string permission_name = 1;
     */
    permissionName: string;
    constructor(data?: PartialMessage<GetPermissionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetPermissionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetPermissionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetPermissionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetPermissionRequest;
    static equals(a: GetPermissionRequest | PlainMessage<GetPermissionRequest> | undefined, b: GetPermissionRequest | PlainMessage<GetPermissionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.GetPermissionResponse
 */
export declare class GetPermissionResponse extends Message<GetPermissionResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Permission permission = 1;
     */
    permission?: Permission;
    constructor(data?: PartialMessage<GetPermissionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.GetPermissionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetPermissionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetPermissionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetPermissionResponse;
    static equals(a: GetPermissionResponse | PlainMessage<GetPermissionResponse> | undefined, b: GetPermissionResponse | PlainMessage<GetPermissionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdatePermissionRequest
 */
export declare class UpdatePermissionRequest extends Message<UpdatePermissionRequest> {
    /**
     * @generated from field: string permission_name = 1;
     */
    permissionName: string;
    /**
     * @generated from field: scalekit.v1.roles.CreatePermission permission = 3;
     */
    permission?: CreatePermission;
    constructor(data?: PartialMessage<UpdatePermissionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdatePermissionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdatePermissionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdatePermissionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdatePermissionRequest;
    static equals(a: UpdatePermissionRequest | PlainMessage<UpdatePermissionRequest> | undefined, b: UpdatePermissionRequest | PlainMessage<UpdatePermissionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.UpdatePermissionResponse
 */
export declare class UpdatePermissionResponse extends Message<UpdatePermissionResponse> {
    /**
     * @generated from field: scalekit.v1.roles.Permission permission = 1;
     */
    permission?: Permission;
    constructor(data?: PartialMessage<UpdatePermissionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.UpdatePermissionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdatePermissionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdatePermissionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdatePermissionResponse;
    static equals(a: UpdatePermissionResponse | PlainMessage<UpdatePermissionResponse> | undefined, b: UpdatePermissionResponse | PlainMessage<UpdatePermissionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListPermissionsRequest
 */
export declare class ListPermissionsRequest extends Message<ListPermissionsRequest> {
    /**
     * @generated from field: optional string page_token = 1;
     */
    pageToken?: string;
    /**
     * @generated from field: optional uint32 page_size = 2;
     */
    pageSize?: number;
    constructor(data?: PartialMessage<ListPermissionsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListPermissionsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListPermissionsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListPermissionsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListPermissionsRequest;
    static equals(a: ListPermissionsRequest | PlainMessage<ListPermissionsRequest> | undefined, b: ListPermissionsRequest | PlainMessage<ListPermissionsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListPermissionsResponse
 */
export declare class ListPermissionsResponse extends Message<ListPermissionsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
     */
    permissions: Permission[];
    /**
     * @generated from field: string prev_page_token = 2;
     */
    prevPageToken: string;
    /**
     * @generated from field: string next_page_token = 3;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 4;
     */
    totalSize: number;
    constructor(data?: PartialMessage<ListPermissionsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListPermissionsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListPermissionsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListPermissionsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListPermissionsResponse;
    static equals(a: ListPermissionsResponse | PlainMessage<ListPermissionsResponse> | undefined, b: ListPermissionsResponse | PlainMessage<ListPermissionsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.DeletePermissionRequest
 */
export declare class DeletePermissionRequest extends Message<DeletePermissionRequest> {
    /**
     * @generated from field: string permission_name = 1;
     */
    permissionName: string;
    constructor(data?: PartialMessage<DeletePermissionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.DeletePermissionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeletePermissionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeletePermissionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeletePermissionRequest;
    static equals(a: DeletePermissionRequest | PlainMessage<DeletePermissionRequest> | undefined, b: DeletePermissionRequest | PlainMessage<DeletePermissionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListRolePermissionsRequest
 */
export declare class ListRolePermissionsRequest extends Message<ListRolePermissionsRequest> {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
    constructor(data?: PartialMessage<ListRolePermissionsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListRolePermissionsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListRolePermissionsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListRolePermissionsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListRolePermissionsRequest;
    static equals(a: ListRolePermissionsRequest | PlainMessage<ListRolePermissionsRequest> | undefined, b: ListRolePermissionsRequest | PlainMessage<ListRolePermissionsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListRolePermissionsResponse
 */
export declare class ListRolePermissionsResponse extends Message<ListRolePermissionsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
     */
    permissions: Permission[];
    constructor(data?: PartialMessage<ListRolePermissionsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListRolePermissionsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListRolePermissionsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListRolePermissionsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListRolePermissionsResponse;
    static equals(a: ListRolePermissionsResponse | PlainMessage<ListRolePermissionsResponse> | undefined, b: ListRolePermissionsResponse | PlainMessage<ListRolePermissionsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.AddPermissionsToRoleRequest
 */
export declare class AddPermissionsToRoleRequest extends Message<AddPermissionsToRoleRequest> {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
    /**
     * @generated from field: repeated string permission_names = 2;
     */
    permissionNames: string[];
    constructor(data?: PartialMessage<AddPermissionsToRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.AddPermissionsToRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AddPermissionsToRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AddPermissionsToRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AddPermissionsToRoleRequest;
    static equals(a: AddPermissionsToRoleRequest | PlainMessage<AddPermissionsToRoleRequest> | undefined, b: AddPermissionsToRoleRequest | PlainMessage<AddPermissionsToRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.AddPermissionsToRoleResponse
 */
export declare class AddPermissionsToRoleResponse extends Message<AddPermissionsToRoleResponse> {
    /**
     * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
     */
    permissions: Permission[];
    constructor(data?: PartialMessage<AddPermissionsToRoleResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.AddPermissionsToRoleResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AddPermissionsToRoleResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AddPermissionsToRoleResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AddPermissionsToRoleResponse;
    static equals(a: AddPermissionsToRoleResponse | PlainMessage<AddPermissionsToRoleResponse> | undefined, b: AddPermissionsToRoleResponse | PlainMessage<AddPermissionsToRoleResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.RemovePermissionFromRoleRequest
 */
export declare class RemovePermissionFromRoleRequest extends Message<RemovePermissionFromRoleRequest> {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
    /**
     * @generated from field: string permission_name = 2;
     */
    permissionName: string;
    constructor(data?: PartialMessage<RemovePermissionFromRoleRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.RemovePermissionFromRoleRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RemovePermissionFromRoleRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RemovePermissionFromRoleRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RemovePermissionFromRoleRequest;
    static equals(a: RemovePermissionFromRoleRequest | PlainMessage<RemovePermissionFromRoleRequest> | undefined, b: RemovePermissionFromRoleRequest | PlainMessage<RemovePermissionFromRoleRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListEffectiveRolePermissionsRequest
 */
export declare class ListEffectiveRolePermissionsRequest extends Message<ListEffectiveRolePermissionsRequest> {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
    constructor(data?: PartialMessage<ListEffectiveRolePermissionsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListEffectiveRolePermissionsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListEffectiveRolePermissionsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListEffectiveRolePermissionsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListEffectiveRolePermissionsRequest;
    static equals(a: ListEffectiveRolePermissionsRequest | PlainMessage<ListEffectiveRolePermissionsRequest> | undefined, b: ListEffectiveRolePermissionsRequest | PlainMessage<ListEffectiveRolePermissionsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListEffectiveRolePermissionsResponse
 */
export declare class ListEffectiveRolePermissionsResponse extends Message<ListEffectiveRolePermissionsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
     */
    permissions: Permission[];
    constructor(data?: PartialMessage<ListEffectiveRolePermissionsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListEffectiveRolePermissionsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListEffectiveRolePermissionsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListEffectiveRolePermissionsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListEffectiveRolePermissionsResponse;
    static equals(a: ListEffectiveRolePermissionsResponse | PlainMessage<ListEffectiveRolePermissionsResponse> | undefined, b: ListEffectiveRolePermissionsResponse | PlainMessage<ListEffectiveRolePermissionsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListDependentRolesRequest
 */
export declare class ListDependentRolesRequest extends Message<ListDependentRolesRequest> {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
    constructor(data?: PartialMessage<ListDependentRolesRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListDependentRolesRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDependentRolesRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDependentRolesRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDependentRolesRequest;
    static equals(a: ListDependentRolesRequest | PlainMessage<ListDependentRolesRequest> | undefined, b: ListDependentRolesRequest | PlainMessage<ListDependentRolesRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.ListDependentRolesResponse
 */
export declare class ListDependentRolesResponse extends Message<ListDependentRolesResponse> {
    /**
     * @generated from field: repeated scalekit.v1.roles.Role roles = 1;
     */
    roles: Role[];
    constructor(data?: PartialMessage<ListDependentRolesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.ListDependentRolesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDependentRolesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDependentRolesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDependentRolesResponse;
    static equals(a: ListDependentRolesResponse | PlainMessage<ListDependentRolesResponse> | undefined, b: ListDependentRolesResponse | PlainMessage<ListDependentRolesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.DeleteRoleBaseRequest
 */
export declare class DeleteRoleBaseRequest extends Message<DeleteRoleBaseRequest> {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
    constructor(data?: PartialMessage<DeleteRoleBaseRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.DeleteRoleBaseRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteRoleBaseRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteRoleBaseRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteRoleBaseRequest;
    static equals(a: DeleteRoleBaseRequest | PlainMessage<DeleteRoleBaseRequest> | undefined, b: DeleteRoleBaseRequest | PlainMessage<DeleteRoleBaseRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.roles.DeleteOrganizationRoleBaseRequest
 */
export declare class DeleteOrganizationRoleBaseRequest extends Message<DeleteOrganizationRoleBaseRequest> {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    constructor(data?: PartialMessage<DeleteOrganizationRoleBaseRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.roles.DeleteOrganizationRoleBaseRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteOrganizationRoleBaseRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteOrganizationRoleBaseRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteOrganizationRoleBaseRequest;
    static equals(a: DeleteOrganizationRoleBaseRequest | PlainMessage<DeleteOrganizationRoleBaseRequest> | undefined, b: DeleteOrganizationRoleBaseRequest | PlainMessage<DeleteOrganizationRoleBaseRequest> | undefined): boolean;
}
