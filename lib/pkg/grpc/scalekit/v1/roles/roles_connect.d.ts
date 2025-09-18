import { AddPermissionsToRoleRequest, AddPermissionsToRoleResponse, CreateOrganizationRoleRequest, CreateOrganizationRoleResponse, CreatePermissionRequest, CreatePermissionResponse, CreateRoleRequest, CreateRoleResponse, DeleteOrganizationRoleBaseRequest, DeleteOrganizationRoleRequest, DeletePermissionRequest, DeleteRoleBaseRequest, DeleteRoleRequest, GetOrganizationRoleRequest, GetOrganizationRoleResponse, GetOrganizationRoleUsersCountRequest, GetOrganizationRoleUsersCountResponse, GetPermissionRequest, GetPermissionResponse, GetRoleRequest, GetRoleResponse, GetRoleUsersCountRequest, GetRoleUsersCountResponse, ListDependentRolesRequest, ListDependentRolesResponse, ListEffectiveRolePermissionsRequest, ListEffectiveRolePermissionsResponse, ListOrganizationRolesRequest, ListOrganizationRolesResponse, ListPermissionsRequest, ListPermissionsResponse, ListRolePermissionsRequest, ListRolePermissionsResponse, ListRolesRequest, ListRolesResponse, RemovePermissionFromRoleRequest, UpdateDefaultOrganizationRolesRequest, UpdateDefaultOrganizationRolesResponse, UpdateDefaultRolesRequest, UpdateDefaultRolesResponse, UpdateOrganizationRoleRequest, UpdateOrganizationRoleResponse, UpdatePermissionRequest, UpdatePermissionResponse, UpdateRoleRequest, UpdateRoleResponse } from "./roles_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.roles.RolesService
 */
export declare const RolesService: {
    readonly typeName: "scalekit.v1.roles.RolesService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.CreateRole
         */
        readonly createRole: {
            readonly name: "CreateRole";
            readonly I: typeof CreateRoleRequest;
            readonly O: typeof CreateRoleResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.UpdateRole
         */
        readonly updateRole: {
            readonly name: "UpdateRole";
            readonly I: typeof UpdateRoleRequest;
            readonly O: typeof UpdateRoleResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.GetRole
         */
        readonly getRole: {
            readonly name: "GetRole";
            readonly I: typeof GetRoleRequest;
            readonly O: typeof GetRoleResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.ListRoles
         */
        readonly listRoles: {
            readonly name: "ListRoles";
            readonly I: typeof ListRolesRequest;
            readonly O: typeof ListRolesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.DeleteRole
         */
        readonly deleteRole: {
            readonly name: "DeleteRole";
            readonly I: typeof DeleteRoleRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.CreateOrganizationRole
         */
        readonly createOrganizationRole: {
            readonly name: "CreateOrganizationRole";
            readonly I: typeof CreateOrganizationRoleRequest;
            readonly O: typeof CreateOrganizationRoleResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.UpdateOrganizationRole
         */
        readonly updateOrganizationRole: {
            readonly name: "UpdateOrganizationRole";
            readonly I: typeof UpdateOrganizationRoleRequest;
            readonly O: typeof UpdateOrganizationRoleResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.GetOrganizationRole
         */
        readonly getOrganizationRole: {
            readonly name: "GetOrganizationRole";
            readonly I: typeof GetOrganizationRoleRequest;
            readonly O: typeof GetOrganizationRoleResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.ListOrganizationRoles
         */
        readonly listOrganizationRoles: {
            readonly name: "ListOrganizationRoles";
            readonly I: typeof ListOrganizationRolesRequest;
            readonly O: typeof ListOrganizationRolesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.DeleteOrganizationRole
         */
        readonly deleteOrganizationRole: {
            readonly name: "DeleteOrganizationRole";
            readonly I: typeof DeleteOrganizationRoleRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.GetRoleUsersCount
         */
        readonly getRoleUsersCount: {
            readonly name: "GetRoleUsersCount";
            readonly I: typeof GetRoleUsersCountRequest;
            readonly O: typeof GetRoleUsersCountResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.GetOrganizationRoleUsersCount
         */
        readonly getOrganizationRoleUsersCount: {
            readonly name: "GetOrganizationRoleUsersCount";
            readonly I: typeof GetOrganizationRoleUsersCountRequest;
            readonly O: typeof GetOrganizationRoleUsersCountResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.UpdateDefaultRoles
         */
        readonly updateDefaultRoles: {
            readonly name: "UpdateDefaultRoles";
            readonly I: typeof UpdateDefaultRolesRequest;
            readonly O: typeof UpdateDefaultRolesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.UpdateDefaultOrganizationRoles
         */
        readonly updateDefaultOrganizationRoles: {
            readonly name: "UpdateDefaultOrganizationRoles";
            readonly I: typeof UpdateDefaultOrganizationRolesRequest;
            readonly O: typeof UpdateDefaultOrganizationRolesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Role Hierarchy Management RPCs
         *
         * @generated from rpc scalekit.v1.roles.RolesService.ListDependentRoles
         */
        readonly listDependentRoles: {
            readonly name: "ListDependentRoles";
            readonly I: typeof ListDependentRolesRequest;
            readonly O: typeof ListDependentRolesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.DeleteRoleBase
         */
        readonly deleteRoleBase: {
            readonly name: "DeleteRoleBase";
            readonly I: typeof DeleteRoleBaseRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.DeleteOrganizationRoleBase
         */
        readonly deleteOrganizationRoleBase: {
            readonly name: "DeleteOrganizationRoleBase";
            readonly I: typeof DeleteOrganizationRoleBaseRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Permission Management RPCs
         *
         * @generated from rpc scalekit.v1.roles.RolesService.CreatePermission
         */
        readonly createPermission: {
            readonly name: "CreatePermission";
            readonly I: typeof CreatePermissionRequest;
            readonly O: typeof CreatePermissionResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.GetPermission
         */
        readonly getPermission: {
            readonly name: "GetPermission";
            readonly I: typeof GetPermissionRequest;
            readonly O: typeof GetPermissionResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.UpdatePermission
         */
        readonly updatePermission: {
            readonly name: "UpdatePermission";
            readonly I: typeof UpdatePermissionRequest;
            readonly O: typeof UpdatePermissionResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.ListPermissions
         */
        readonly listPermissions: {
            readonly name: "ListPermissions";
            readonly I: typeof ListPermissionsRequest;
            readonly O: typeof ListPermissionsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.DeletePermission
         */
        readonly deletePermission: {
            readonly name: "DeletePermission";
            readonly I: typeof DeletePermissionRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Role-Permission Management RPCs
         *
         * @generated from rpc scalekit.v1.roles.RolesService.ListRolePermissions
         */
        readonly listRolePermissions: {
            readonly name: "ListRolePermissions";
            readonly I: typeof ListRolePermissionsRequest;
            readonly O: typeof ListRolePermissionsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.AddPermissionsToRole
         */
        readonly addPermissionsToRole: {
            readonly name: "AddPermissionsToRole";
            readonly I: typeof AddPermissionsToRoleRequest;
            readonly O: typeof AddPermissionsToRoleResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.RemovePermissionFromRole
         */
        readonly removePermissionFromRole: {
            readonly name: "RemovePermissionFromRole";
            readonly I: typeof RemovePermissionFromRoleRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.roles.RolesService.ListEffectiveRolePermissions
         */
        readonly listEffectiveRolePermissions: {
            readonly name: "ListEffectiveRolePermissions";
            readonly I: typeof ListEffectiveRolePermissionsRequest;
            readonly O: typeof ListEffectiveRolePermissionsResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
