import { Empty } from '@bufbuild/protobuf';
import GrpcConnect from './connect';
import CoreClient from './core';
import { CreatePermissionResponse, GetPermissionResponse, UpdatePermissionResponse, ListPermissionsResponse, ListRolePermissionsResponse, AddPermissionsToRoleResponse, ListEffectiveRolePermissionsResponse, CreatePermission } from './pkg/grpc/scalekit/v1/roles/roles_pb';
export default class PermissionClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Create a new permission
     * @param {CreatePermission} permission The permission creation object
     * @returns {Promise<CreatePermissionResponse>} The created permission
     */
    createPermission(permission: CreatePermission): Promise<CreatePermissionResponse>;
    /**
     * Get permission by name
     * @param {string} permissionName The permission name
     * @returns {Promise<GetPermissionResponse>} The permission details
     */
    getPermission(permissionName: string): Promise<GetPermissionResponse>;
    /**
     * List all permissions
     * @param {string} [pageToken] Token for pagination
     * @param {number} [pageSize] Number of permissions per page
     * @returns {Promise<ListPermissionsResponse>} List of permissions
     */
    listPermissions(pageToken?: string, pageSize?: number): Promise<ListPermissionsResponse>;
    /**
     * Update an existing permission by name
     * @param {string} permissionName The permission name to update
     * @param {CreatePermission} permission The permission update object
     * @returns {Promise<UpdatePermissionResponse>} The updated permission
     */
    updatePermission(permissionName: string, permission: CreatePermission): Promise<UpdatePermissionResponse>;
    /**
     * Delete permission by name
     * @param {string} permissionName The permission name to be deleted
     * @returns {Promise<Empty>} Empty response
     */
    deletePermission(permissionName: string): Promise<Empty>;
    /**
     * List all permissions associated with a role
     * @param {string} roleName The role name to get permissions for
     * @returns {Promise<ListRolePermissionsResponse>} List of role permissions
     */
    listRolePermissions(roleName: string): Promise<ListRolePermissionsResponse>;
    /**
     * Add permissions to a role
     * @param {string} roleName The role name to add permissions to
     * @param {string[]} permissionNames List of permission names to add
     * @returns {Promise<AddPermissionsToRoleResponse>} The response after adding permissions
     */
    addPermissionsToRole(roleName: string, permissionNames: string[]): Promise<AddPermissionsToRoleResponse>;
    /**
     * Remove a permission from a role
     * @param {string} roleName The role name to remove permission from
     * @param {string} permissionName The permission name to remove
     * @returns {Promise<Empty>} Empty response
     */
    removePermissionFromRole(roleName: string, permissionName: string): Promise<Empty>;
    /**
     * List all effective permissions for a role (including inherited permissions)
     * @param {string} roleName The role name to get effective permissions for
     * @returns {Promise<ListEffectiveRolePermissionsResponse>} List of effective role permissions
     */
    listEffectiveRolePermissions(roleName: string): Promise<ListEffectiveRolePermissionsResponse>;
}
