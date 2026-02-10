import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/roles/roles.proto.
 */
export declare const file_scalekit_v1_roles_roles: GenFile;
/**
 * @generated from message scalekit.v1.roles.Role
 */
export type Role = Message<"scalekit.v1.roles.Role"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.Role.
 * Use `create(RoleSchema)` to create a new message.
 */
export declare const RoleSchema: GenMessage<Role>;
/**
 * @generated from message scalekit.v1.roles.CreateRole
 */
export type CreateRole = Message<"scalekit.v1.roles.CreateRole"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.CreateRole.
 * Use `create(CreateRoleSchema)` to create a new message.
 */
export declare const CreateRoleSchema: GenMessage<CreateRole>;
/**
 * @generated from message scalekit.v1.roles.CreateOrganizationRole
 */
export type CreateOrganizationRole = Message<"scalekit.v1.roles.CreateOrganizationRole"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.CreateOrganizationRole.
 * Use `create(CreateOrganizationRoleSchema)` to create a new message.
 */
export declare const CreateOrganizationRoleSchema: GenMessage<CreateOrganizationRole>;
/**
 * @generated from message scalekit.v1.roles.CreateRoleRequest
 */
export type CreateRoleRequest = Message<"scalekit.v1.roles.CreateRoleRequest"> & {
    /**
     * @generated from field: scalekit.v1.roles.CreateRole role = 2;
     */
    role?: CreateRole;
};
/**
 * Describes the message scalekit.v1.roles.CreateRoleRequest.
 * Use `create(CreateRoleRequestSchema)` to create a new message.
 */
export declare const CreateRoleRequestSchema: GenMessage<CreateRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.CreateRoleResponse
 */
export type CreateRoleResponse = Message<"scalekit.v1.roles.CreateRoleResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
};
/**
 * Describes the message scalekit.v1.roles.CreateRoleResponse.
 * Use `create(CreateRoleResponseSchema)` to create a new message.
 */
export declare const CreateRoleResponseSchema: GenMessage<CreateRoleResponse>;
/**
 * @generated from message scalekit.v1.roles.GetRoleRequest
 */
export type GetRoleRequest = Message<"scalekit.v1.roles.GetRoleRequest"> & {
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    /**
     * @generated from field: optional string include = 3;
     */
    include?: string;
};
/**
 * Describes the message scalekit.v1.roles.GetRoleRequest.
 * Use `create(GetRoleRequestSchema)` to create a new message.
 */
export declare const GetRoleRequestSchema: GenMessage<GetRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.GetRoleResponse
 */
export type GetRoleResponse = Message<"scalekit.v1.roles.GetRoleResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
};
/**
 * Describes the message scalekit.v1.roles.GetRoleResponse.
 * Use `create(GetRoleResponseSchema)` to create a new message.
 */
export declare const GetRoleResponseSchema: GenMessage<GetRoleResponse>;
/**
 * @generated from message scalekit.v1.roles.ListRolesRequest
 */
export type ListRolesRequest = Message<"scalekit.v1.roles.ListRolesRequest"> & {
    /**
     * @generated from field: optional string include = 2;
     */
    include?: string;
};
/**
 * Describes the message scalekit.v1.roles.ListRolesRequest.
 * Use `create(ListRolesRequestSchema)` to create a new message.
 */
export declare const ListRolesRequestSchema: GenMessage<ListRolesRequest>;
/**
 * @generated from message scalekit.v1.roles.ListRolesResponse
 */
export type ListRolesResponse = Message<"scalekit.v1.roles.ListRolesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.roles.Role roles = 1;
     */
    roles: Role[];
};
/**
 * Describes the message scalekit.v1.roles.ListRolesResponse.
 * Use `create(ListRolesResponseSchema)` to create a new message.
 */
export declare const ListRolesResponseSchema: GenMessage<ListRolesResponse>;
/**
 * @generated from message scalekit.v1.roles.UpdateRole
 */
export type UpdateRole = Message<"scalekit.v1.roles.UpdateRole"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.UpdateRole.
 * Use `create(UpdateRoleSchema)` to create a new message.
 */
export declare const UpdateRoleSchema: GenMessage<UpdateRole>;
/**
 * @generated from message scalekit.v1.roles.UpdateRoleRequest
 */
export type UpdateRoleRequest = Message<"scalekit.v1.roles.UpdateRoleRequest"> & {
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
    /**
     * @generated from field: scalekit.v1.roles.UpdateRole role = 3;
     */
    role?: UpdateRole;
};
/**
 * Describes the message scalekit.v1.roles.UpdateRoleRequest.
 * Use `create(UpdateRoleRequestSchema)` to create a new message.
 */
export declare const UpdateRoleRequestSchema: GenMessage<UpdateRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.UpdateRoleResponse
 */
export type UpdateRoleResponse = Message<"scalekit.v1.roles.UpdateRoleResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
};
/**
 * Describes the message scalekit.v1.roles.UpdateRoleResponse.
 * Use `create(UpdateRoleResponseSchema)` to create a new message.
 */
export declare const UpdateRoleResponseSchema: GenMessage<UpdateRoleResponse>;
/**
 * @generated from message scalekit.v1.roles.DeleteRoleRequest
 */
export type DeleteRoleRequest = Message<"scalekit.v1.roles.DeleteRoleRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.DeleteRoleRequest.
 * Use `create(DeleteRoleRequestSchema)` to create a new message.
 */
export declare const DeleteRoleRequestSchema: GenMessage<DeleteRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.CreateOrganizationRoleRequest
 */
export type CreateOrganizationRoleRequest = Message<"scalekit.v1.roles.CreateOrganizationRoleRequest"> & {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: scalekit.v1.roles.CreateOrganizationRole role = 2;
     */
    role?: CreateOrganizationRole;
};
/**
 * Describes the message scalekit.v1.roles.CreateOrganizationRoleRequest.
 * Use `create(CreateOrganizationRoleRequestSchema)` to create a new message.
 */
export declare const CreateOrganizationRoleRequestSchema: GenMessage<CreateOrganizationRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.CreateOrganizationRoleResponse
 */
export type CreateOrganizationRoleResponse = Message<"scalekit.v1.roles.CreateOrganizationRoleResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
};
/**
 * Describes the message scalekit.v1.roles.CreateOrganizationRoleResponse.
 * Use `create(CreateOrganizationRoleResponseSchema)` to create a new message.
 */
export declare const CreateOrganizationRoleResponseSchema: GenMessage<CreateOrganizationRoleResponse>;
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleRequest
 */
export type GetOrganizationRoleRequest = Message<"scalekit.v1.roles.GetOrganizationRoleRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.GetOrganizationRoleRequest.
 * Use `create(GetOrganizationRoleRequestSchema)` to create a new message.
 */
export declare const GetOrganizationRoleRequestSchema: GenMessage<GetOrganizationRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleResponse
 */
export type GetOrganizationRoleResponse = Message<"scalekit.v1.roles.GetOrganizationRoleResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
};
/**
 * Describes the message scalekit.v1.roles.GetOrganizationRoleResponse.
 * Use `create(GetOrganizationRoleResponseSchema)` to create a new message.
 */
export declare const GetOrganizationRoleResponseSchema: GenMessage<GetOrganizationRoleResponse>;
/**
 * @generated from message scalekit.v1.roles.ListOrganizationRolesRequest
 */
export type ListOrganizationRolesRequest = Message<"scalekit.v1.roles.ListOrganizationRolesRequest"> & {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: optional string include = 2;
     */
    include?: string;
};
/**
 * Describes the message scalekit.v1.roles.ListOrganizationRolesRequest.
 * Use `create(ListOrganizationRolesRequestSchema)` to create a new message.
 */
export declare const ListOrganizationRolesRequestSchema: GenMessage<ListOrganizationRolesRequest>;
/**
 * @generated from message scalekit.v1.roles.ListOrganizationRolesResponse
 */
export type ListOrganizationRolesResponse = Message<"scalekit.v1.roles.ListOrganizationRolesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.roles.Role roles = 1;
     */
    roles: Role[];
};
/**
 * Describes the message scalekit.v1.roles.ListOrganizationRolesResponse.
 * Use `create(ListOrganizationRolesResponseSchema)` to create a new message.
 */
export declare const ListOrganizationRolesResponseSchema: GenMessage<ListOrganizationRolesResponse>;
/**
 * @generated from message scalekit.v1.roles.UpdateOrganizationRoleRequest
 */
export type UpdateOrganizationRoleRequest = Message<"scalekit.v1.roles.UpdateOrganizationRoleRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.UpdateOrganizationRoleRequest.
 * Use `create(UpdateOrganizationRoleRequestSchema)` to create a new message.
 */
export declare const UpdateOrganizationRoleRequestSchema: GenMessage<UpdateOrganizationRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.UpdateOrganizationRoleResponse
 */
export type UpdateOrganizationRoleResponse = Message<"scalekit.v1.roles.UpdateOrganizationRoleResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Role role = 1;
     */
    role?: Role;
};
/**
 * Describes the message scalekit.v1.roles.UpdateOrganizationRoleResponse.
 * Use `create(UpdateOrganizationRoleResponseSchema)` to create a new message.
 */
export declare const UpdateOrganizationRoleResponseSchema: GenMessage<UpdateOrganizationRoleResponse>;
/**
 * @generated from message scalekit.v1.roles.DeleteOrganizationRoleRequest
 */
export type DeleteOrganizationRoleRequest = Message<"scalekit.v1.roles.DeleteOrganizationRoleRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.DeleteOrganizationRoleRequest.
 * Use `create(DeleteOrganizationRoleRequestSchema)` to create a new message.
 */
export declare const DeleteOrganizationRoleRequestSchema: GenMessage<DeleteOrganizationRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.GetRoleUsersCountRequest
 */
export type GetRoleUsersCountRequest = Message<"scalekit.v1.roles.GetRoleUsersCountRequest"> & {
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
};
/**
 * Describes the message scalekit.v1.roles.GetRoleUsersCountRequest.
 * Use `create(GetRoleUsersCountRequestSchema)` to create a new message.
 */
export declare const GetRoleUsersCountRequestSchema: GenMessage<GetRoleUsersCountRequest>;
/**
 * @generated from message scalekit.v1.roles.GetRoleUsersCountResponse
 */
export type GetRoleUsersCountResponse = Message<"scalekit.v1.roles.GetRoleUsersCountResponse"> & {
    /**
     * @generated from field: int64 count = 1;
     */
    count: bigint;
};
/**
 * Describes the message scalekit.v1.roles.GetRoleUsersCountResponse.
 * Use `create(GetRoleUsersCountResponseSchema)` to create a new message.
 */
export declare const GetRoleUsersCountResponseSchema: GenMessage<GetRoleUsersCountResponse>;
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleUsersCountRequest
 */
export type GetOrganizationRoleUsersCountRequest = Message<"scalekit.v1.roles.GetOrganizationRoleUsersCountRequest"> & {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
};
/**
 * Describes the message scalekit.v1.roles.GetOrganizationRoleUsersCountRequest.
 * Use `create(GetOrganizationRoleUsersCountRequestSchema)` to create a new message.
 */
export declare const GetOrganizationRoleUsersCountRequestSchema: GenMessage<GetOrganizationRoleUsersCountRequest>;
/**
 * @generated from message scalekit.v1.roles.GetOrganizationRoleUsersCountResponse
 */
export type GetOrganizationRoleUsersCountResponse = Message<"scalekit.v1.roles.GetOrganizationRoleUsersCountResponse"> & {
    /**
     * @generated from field: int64 count = 1;
     */
    count: bigint;
};
/**
 * Describes the message scalekit.v1.roles.GetOrganizationRoleUsersCountResponse.
 * Use `create(GetOrganizationRoleUsersCountResponseSchema)` to create a new message.
 */
export declare const GetOrganizationRoleUsersCountResponseSchema: GenMessage<GetOrganizationRoleUsersCountResponse>;
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultRolesRequest
 */
export type UpdateDefaultRolesRequest = Message<"scalekit.v1.roles.UpdateDefaultRolesRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.UpdateDefaultRolesRequest.
 * Use `create(UpdateDefaultRolesRequestSchema)` to create a new message.
 */
export declare const UpdateDefaultRolesRequestSchema: GenMessage<UpdateDefaultRolesRequest>;
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultOrganizationRolesRequest
 */
export type UpdateDefaultOrganizationRolesRequest = Message<"scalekit.v1.roles.UpdateDefaultOrganizationRolesRequest"> & {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: string default_member_role = 2;
     */
    defaultMemberRole: string;
};
/**
 * Describes the message scalekit.v1.roles.UpdateDefaultOrganizationRolesRequest.
 * Use `create(UpdateDefaultOrganizationRolesRequestSchema)` to create a new message.
 */
export declare const UpdateDefaultOrganizationRolesRequestSchema: GenMessage<UpdateDefaultOrganizationRolesRequest>;
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultRolesResponse
 */
export type UpdateDefaultRolesResponse = Message<"scalekit.v1.roles.UpdateDefaultRolesResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Role default_creator = 1;
     */
    defaultCreator?: Role;
    /**
     * @generated from field: scalekit.v1.roles.Role default_member = 2;
     */
    defaultMember?: Role;
};
/**
 * Describes the message scalekit.v1.roles.UpdateDefaultRolesResponse.
 * Use `create(UpdateDefaultRolesResponseSchema)` to create a new message.
 */
export declare const UpdateDefaultRolesResponseSchema: GenMessage<UpdateDefaultRolesResponse>;
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultOrganizationRolesResponse
 */
export type UpdateDefaultOrganizationRolesResponse = Message<"scalekit.v1.roles.UpdateDefaultOrganizationRolesResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Role default_member = 2;
     */
    defaultMember?: Role;
};
/**
 * Describes the message scalekit.v1.roles.UpdateDefaultOrganizationRolesResponse.
 * Use `create(UpdateDefaultOrganizationRolesResponseSchema)` to create a new message.
 */
export declare const UpdateDefaultOrganizationRolesResponseSchema: GenMessage<UpdateDefaultOrganizationRolesResponse>;
/**
 * @generated from message scalekit.v1.roles.UpdateDefaultRole
 */
export type UpdateDefaultRole = Message<"scalekit.v1.roles.UpdateDefaultRole"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: optional string name = 2;
     */
    name?: string;
};
/**
 * Describes the message scalekit.v1.roles.UpdateDefaultRole.
 * Use `create(UpdateDefaultRoleSchema)` to create a new message.
 */
export declare const UpdateDefaultRoleSchema: GenMessage<UpdateDefaultRole>;
/**
 * Permission Entity
 *
 * @generated from message scalekit.v1.roles.Permission
 */
export type Permission = Message<"scalekit.v1.roles.Permission"> & {
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
     * @generated from field: bool is_scalekit_permission = 6;
     */
    isScalekitPermission: boolean;
};
/**
 * Describes the message scalekit.v1.roles.Permission.
 * Use `create(PermissionSchema)` to create a new message.
 */
export declare const PermissionSchema: GenMessage<Permission>;
/**
 * RolePermissions represents a permission with role source information
 *
 * @generated from message scalekit.v1.roles.RolePermission
 */
export type RolePermission = Message<"scalekit.v1.roles.RolePermission"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.RolePermission.
 * Use `create(RolePermissionSchema)` to create a new message.
 */
export declare const RolePermissionSchema: GenMessage<RolePermission>;
/**
 * @generated from message scalekit.v1.roles.CreatePermission
 */
export type CreatePermission = Message<"scalekit.v1.roles.CreatePermission"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
};
/**
 * Describes the message scalekit.v1.roles.CreatePermission.
 * Use `create(CreatePermissionSchema)` to create a new message.
 */
export declare const CreatePermissionSchema: GenMessage<CreatePermission>;
/**
 * Permission Request/Response Messages
 *
 * @generated from message scalekit.v1.roles.CreatePermissionRequest
 */
export type CreatePermissionRequest = Message<"scalekit.v1.roles.CreatePermissionRequest"> & {
    /**
     * @generated from field: scalekit.v1.roles.CreatePermission permission = 1;
     */
    permission?: CreatePermission;
};
/**
 * Describes the message scalekit.v1.roles.CreatePermissionRequest.
 * Use `create(CreatePermissionRequestSchema)` to create a new message.
 */
export declare const CreatePermissionRequestSchema: GenMessage<CreatePermissionRequest>;
/**
 * @generated from message scalekit.v1.roles.CreatePermissionResponse
 */
export type CreatePermissionResponse = Message<"scalekit.v1.roles.CreatePermissionResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Permission permission = 1;
     */
    permission?: Permission;
};
/**
 * Describes the message scalekit.v1.roles.CreatePermissionResponse.
 * Use `create(CreatePermissionResponseSchema)` to create a new message.
 */
export declare const CreatePermissionResponseSchema: GenMessage<CreatePermissionResponse>;
/**
 * @generated from message scalekit.v1.roles.GetPermissionRequest
 */
export type GetPermissionRequest = Message<"scalekit.v1.roles.GetPermissionRequest"> & {
    /**
     * @generated from field: string permission_name = 1;
     */
    permissionName: string;
};
/**
 * Describes the message scalekit.v1.roles.GetPermissionRequest.
 * Use `create(GetPermissionRequestSchema)` to create a new message.
 */
export declare const GetPermissionRequestSchema: GenMessage<GetPermissionRequest>;
/**
 * @generated from message scalekit.v1.roles.GetPermissionResponse
 */
export type GetPermissionResponse = Message<"scalekit.v1.roles.GetPermissionResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Permission permission = 1;
     */
    permission?: Permission;
};
/**
 * Describes the message scalekit.v1.roles.GetPermissionResponse.
 * Use `create(GetPermissionResponseSchema)` to create a new message.
 */
export declare const GetPermissionResponseSchema: GenMessage<GetPermissionResponse>;
/**
 * @generated from message scalekit.v1.roles.UpdatePermissionRequest
 */
export type UpdatePermissionRequest = Message<"scalekit.v1.roles.UpdatePermissionRequest"> & {
    /**
     * @generated from field: string permission_name = 1;
     */
    permissionName: string;
    /**
     * @generated from field: scalekit.v1.roles.CreatePermission permission = 3;
     */
    permission?: CreatePermission;
};
/**
 * Describes the message scalekit.v1.roles.UpdatePermissionRequest.
 * Use `create(UpdatePermissionRequestSchema)` to create a new message.
 */
export declare const UpdatePermissionRequestSchema: GenMessage<UpdatePermissionRequest>;
/**
 * @generated from message scalekit.v1.roles.UpdatePermissionResponse
 */
export type UpdatePermissionResponse = Message<"scalekit.v1.roles.UpdatePermissionResponse"> & {
    /**
     * @generated from field: scalekit.v1.roles.Permission permission = 1;
     */
    permission?: Permission;
};
/**
 * Describes the message scalekit.v1.roles.UpdatePermissionResponse.
 * Use `create(UpdatePermissionResponseSchema)` to create a new message.
 */
export declare const UpdatePermissionResponseSchema: GenMessage<UpdatePermissionResponse>;
/**
 * @generated from message scalekit.v1.roles.ListPermissionsRequest
 */
export type ListPermissionsRequest = Message<"scalekit.v1.roles.ListPermissionsRequest"> & {
    /**
     * @generated from field: optional string page_token = 1;
     */
    pageToken?: string;
    /**
     * @generated from field: optional uint32 page_size = 2;
     */
    pageSize?: number;
    /**
     * @generated from field: scalekit.v1.roles.PermissionType type = 3;
     */
    type: PermissionType;
};
/**
 * Describes the message scalekit.v1.roles.ListPermissionsRequest.
 * Use `create(ListPermissionsRequestSchema)` to create a new message.
 */
export declare const ListPermissionsRequestSchema: GenMessage<ListPermissionsRequest>;
/**
 * @generated from message scalekit.v1.roles.ListPermissionsResponse
 */
export type ListPermissionsResponse = Message<"scalekit.v1.roles.ListPermissionsResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.roles.ListPermissionsResponse.
 * Use `create(ListPermissionsResponseSchema)` to create a new message.
 */
export declare const ListPermissionsResponseSchema: GenMessage<ListPermissionsResponse>;
/**
 * @generated from message scalekit.v1.roles.DeletePermissionRequest
 */
export type DeletePermissionRequest = Message<"scalekit.v1.roles.DeletePermissionRequest"> & {
    /**
     * @generated from field: string permission_name = 1;
     */
    permissionName: string;
};
/**
 * Describes the message scalekit.v1.roles.DeletePermissionRequest.
 * Use `create(DeletePermissionRequestSchema)` to create a new message.
 */
export declare const DeletePermissionRequestSchema: GenMessage<DeletePermissionRequest>;
/**
 * @generated from message scalekit.v1.roles.ListRolePermissionsRequest
 */
export type ListRolePermissionsRequest = Message<"scalekit.v1.roles.ListRolePermissionsRequest"> & {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
};
/**
 * Describes the message scalekit.v1.roles.ListRolePermissionsRequest.
 * Use `create(ListRolePermissionsRequestSchema)` to create a new message.
 */
export declare const ListRolePermissionsRequestSchema: GenMessage<ListRolePermissionsRequest>;
/**
 * @generated from message scalekit.v1.roles.ListRolePermissionsResponse
 */
export type ListRolePermissionsResponse = Message<"scalekit.v1.roles.ListRolePermissionsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
     */
    permissions: Permission[];
};
/**
 * Describes the message scalekit.v1.roles.ListRolePermissionsResponse.
 * Use `create(ListRolePermissionsResponseSchema)` to create a new message.
 */
export declare const ListRolePermissionsResponseSchema: GenMessage<ListRolePermissionsResponse>;
/**
 * @generated from message scalekit.v1.roles.AddPermissionsToRoleRequest
 */
export type AddPermissionsToRoleRequest = Message<"scalekit.v1.roles.AddPermissionsToRoleRequest"> & {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
    /**
     * @generated from field: repeated string permission_names = 2;
     */
    permissionNames: string[];
};
/**
 * Describes the message scalekit.v1.roles.AddPermissionsToRoleRequest.
 * Use `create(AddPermissionsToRoleRequestSchema)` to create a new message.
 */
export declare const AddPermissionsToRoleRequestSchema: GenMessage<AddPermissionsToRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.AddPermissionsToRoleResponse
 */
export type AddPermissionsToRoleResponse = Message<"scalekit.v1.roles.AddPermissionsToRoleResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
     */
    permissions: Permission[];
};
/**
 * Describes the message scalekit.v1.roles.AddPermissionsToRoleResponse.
 * Use `create(AddPermissionsToRoleResponseSchema)` to create a new message.
 */
export declare const AddPermissionsToRoleResponseSchema: GenMessage<AddPermissionsToRoleResponse>;
/**
 * @generated from message scalekit.v1.roles.RemovePermissionFromRoleRequest
 */
export type RemovePermissionFromRoleRequest = Message<"scalekit.v1.roles.RemovePermissionFromRoleRequest"> & {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
    /**
     * @generated from field: string permission_name = 2;
     */
    permissionName: string;
};
/**
 * Describes the message scalekit.v1.roles.RemovePermissionFromRoleRequest.
 * Use `create(RemovePermissionFromRoleRequestSchema)` to create a new message.
 */
export declare const RemovePermissionFromRoleRequestSchema: GenMessage<RemovePermissionFromRoleRequest>;
/**
 * @generated from message scalekit.v1.roles.ListEffectiveRolePermissionsRequest
 */
export type ListEffectiveRolePermissionsRequest = Message<"scalekit.v1.roles.ListEffectiveRolePermissionsRequest"> & {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
};
/**
 * Describes the message scalekit.v1.roles.ListEffectiveRolePermissionsRequest.
 * Use `create(ListEffectiveRolePermissionsRequestSchema)` to create a new message.
 */
export declare const ListEffectiveRolePermissionsRequestSchema: GenMessage<ListEffectiveRolePermissionsRequest>;
/**
 * @generated from message scalekit.v1.roles.ListEffectiveRolePermissionsResponse
 */
export type ListEffectiveRolePermissionsResponse = Message<"scalekit.v1.roles.ListEffectiveRolePermissionsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.roles.Permission permissions = 1;
     */
    permissions: Permission[];
};
/**
 * Describes the message scalekit.v1.roles.ListEffectiveRolePermissionsResponse.
 * Use `create(ListEffectiveRolePermissionsResponseSchema)` to create a new message.
 */
export declare const ListEffectiveRolePermissionsResponseSchema: GenMessage<ListEffectiveRolePermissionsResponse>;
/**
 * @generated from message scalekit.v1.roles.ListDependentRolesRequest
 */
export type ListDependentRolesRequest = Message<"scalekit.v1.roles.ListDependentRolesRequest"> & {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
};
/**
 * Describes the message scalekit.v1.roles.ListDependentRolesRequest.
 * Use `create(ListDependentRolesRequestSchema)` to create a new message.
 */
export declare const ListDependentRolesRequestSchema: GenMessage<ListDependentRolesRequest>;
/**
 * @generated from message scalekit.v1.roles.ListDependentRolesResponse
 */
export type ListDependentRolesResponse = Message<"scalekit.v1.roles.ListDependentRolesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.roles.Role roles = 1;
     */
    roles: Role[];
};
/**
 * Describes the message scalekit.v1.roles.ListDependentRolesResponse.
 * Use `create(ListDependentRolesResponseSchema)` to create a new message.
 */
export declare const ListDependentRolesResponseSchema: GenMessage<ListDependentRolesResponse>;
/**
 * @generated from message scalekit.v1.roles.DeleteRoleBaseRequest
 */
export type DeleteRoleBaseRequest = Message<"scalekit.v1.roles.DeleteRoleBaseRequest"> & {
    /**
     * @generated from field: string role_name = 1;
     */
    roleName: string;
};
/**
 * Describes the message scalekit.v1.roles.DeleteRoleBaseRequest.
 * Use `create(DeleteRoleBaseRequestSchema)` to create a new message.
 */
export declare const DeleteRoleBaseRequestSchema: GenMessage<DeleteRoleBaseRequest>;
/**
 * @generated from message scalekit.v1.roles.DeleteOrganizationRoleBaseRequest
 */
export type DeleteOrganizationRoleBaseRequest = Message<"scalekit.v1.roles.DeleteOrganizationRoleBaseRequest"> & {
    /**
     * @generated from field: string org_id = 1;
     */
    orgId: string;
    /**
     * @generated from field: string role_name = 2;
     */
    roleName: string;
};
/**
 * Describes the message scalekit.v1.roles.DeleteOrganizationRoleBaseRequest.
 * Use `create(DeleteOrganizationRoleBaseRequestSchema)` to create a new message.
 */
export declare const DeleteOrganizationRoleBaseRequestSchema: GenMessage<DeleteOrganizationRoleBaseRequest>;
/**
 * @generated from enum scalekit.v1.roles.PermissionType
 */
export declare enum PermissionType {
    /**
     * @generated from enum value: ALL = 0;
     */
    ALL = 0,
    /**
     * @generated from enum value: SCALEKIT = 1;
     */
    SCALEKIT = 1,
    /**
     * @generated from enum value: ENVIRONMENT = 2;
     */
    ENVIRONMENT = 2
}
/**
 * Describes the enum scalekit.v1.roles.PermissionType.
 */
export declare const PermissionTypeSchema: GenEnum<PermissionType>;
/**
 * @generated from service scalekit.v1.roles.RolesService
 */
export declare const RolesService: GenService<{
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.CreateRole
     */
    createRole: {
        methodKind: "unary";
        input: typeof CreateRoleRequestSchema;
        output: typeof CreateRoleResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.UpdateRole
     */
    updateRole: {
        methodKind: "unary";
        input: typeof UpdateRoleRequestSchema;
        output: typeof UpdateRoleResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.GetRole
     */
    getRole: {
        methodKind: "unary";
        input: typeof GetRoleRequestSchema;
        output: typeof GetRoleResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.ListRoles
     */
    listRoles: {
        methodKind: "unary";
        input: typeof ListRolesRequestSchema;
        output: typeof ListRolesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.DeleteRole
     */
    deleteRole: {
        methodKind: "unary";
        input: typeof DeleteRoleRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.CreateOrganizationRole
     */
    createOrganizationRole: {
        methodKind: "unary";
        input: typeof CreateOrganizationRoleRequestSchema;
        output: typeof CreateOrganizationRoleResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.UpdateOrganizationRole
     */
    updateOrganizationRole: {
        methodKind: "unary";
        input: typeof UpdateOrganizationRoleRequestSchema;
        output: typeof UpdateOrganizationRoleResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.GetOrganizationRole
     */
    getOrganizationRole: {
        methodKind: "unary";
        input: typeof GetOrganizationRoleRequestSchema;
        output: typeof GetOrganizationRoleResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.ListOrganizationRoles
     */
    listOrganizationRoles: {
        methodKind: "unary";
        input: typeof ListOrganizationRolesRequestSchema;
        output: typeof ListOrganizationRolesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.DeleteOrganizationRole
     */
    deleteOrganizationRole: {
        methodKind: "unary";
        input: typeof DeleteOrganizationRoleRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.GetRoleUsersCount
     */
    getRoleUsersCount: {
        methodKind: "unary";
        input: typeof GetRoleUsersCountRequestSchema;
        output: typeof GetRoleUsersCountResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.GetOrganizationRoleUsersCount
     */
    getOrganizationRoleUsersCount: {
        methodKind: "unary";
        input: typeof GetOrganizationRoleUsersCountRequestSchema;
        output: typeof GetOrganizationRoleUsersCountResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.UpdateDefaultRoles
     */
    updateDefaultRoles: {
        methodKind: "unary";
        input: typeof UpdateDefaultRolesRequestSchema;
        output: typeof UpdateDefaultRolesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.UpdateDefaultOrganizationRoles
     */
    updateDefaultOrganizationRoles: {
        methodKind: "unary";
        input: typeof UpdateDefaultOrganizationRolesRequestSchema;
        output: typeof UpdateDefaultOrganizationRolesResponseSchema;
    };
    /**
     * Role Hierarchy Management RPCs
     *
     * @generated from rpc scalekit.v1.roles.RolesService.ListDependentRoles
     */
    listDependentRoles: {
        methodKind: "unary";
        input: typeof ListDependentRolesRequestSchema;
        output: typeof ListDependentRolesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.DeleteRoleBase
     */
    deleteRoleBase: {
        methodKind: "unary";
        input: typeof DeleteRoleBaseRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.DeleteOrganizationRoleBase
     */
    deleteOrganizationRoleBase: {
        methodKind: "unary";
        input: typeof DeleteOrganizationRoleBaseRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * Permission Management RPCs
     *
     * @generated from rpc scalekit.v1.roles.RolesService.CreatePermission
     */
    createPermission: {
        methodKind: "unary";
        input: typeof CreatePermissionRequestSchema;
        output: typeof CreatePermissionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.GetPermission
     */
    getPermission: {
        methodKind: "unary";
        input: typeof GetPermissionRequestSchema;
        output: typeof GetPermissionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.UpdatePermission
     */
    updatePermission: {
        methodKind: "unary";
        input: typeof UpdatePermissionRequestSchema;
        output: typeof UpdatePermissionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.ListPermissions
     */
    listPermissions: {
        methodKind: "unary";
        input: typeof ListPermissionsRequestSchema;
        output: typeof ListPermissionsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.DeletePermission
     */
    deletePermission: {
        methodKind: "unary";
        input: typeof DeletePermissionRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * Role-Permission Management RPCs
     *
     * @generated from rpc scalekit.v1.roles.RolesService.ListRolePermissions
     */
    listRolePermissions: {
        methodKind: "unary";
        input: typeof ListRolePermissionsRequestSchema;
        output: typeof ListRolePermissionsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.AddPermissionsToRole
     */
    addPermissionsToRole: {
        methodKind: "unary";
        input: typeof AddPermissionsToRoleRequestSchema;
        output: typeof AddPermissionsToRoleResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.RemovePermissionFromRole
     */
    removePermissionFromRole: {
        methodKind: "unary";
        input: typeof RemovePermissionFromRoleRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.roles.RolesService.ListEffectiveRolePermissions
     */
    listEffectiveRolePermissions: {
        methodKind: "unary";
        input: typeof ListEffectiveRolePermissionsRequestSchema;
        output: typeof ListEffectiveRolePermissionsResponseSchema;
    };
}>;
