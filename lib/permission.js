"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_connect_1 = require("./pkg/grpc/scalekit/v1/roles/roles_connect");
class PermissionClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(roles_connect_1.RolesService);
    }
    /**
     * Create a new permission
     * @param {CreatePermission} permission The permission creation object
     * @returns {Promise<CreatePermissionResponse>} The created permission
     */
    createPermission(permission) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.createPermission, { permission });
        });
    }
    /**
     * Get permission by name
     * @param {string} permissionName The permission name
     * @returns {Promise<GetPermissionResponse>} The permission details
     */
    getPermission(permissionName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getPermission, { permissionName });
        });
    }
    /**
     * List all permissions
     * @param {string} [pageToken] Token for pagination
     * @param {number} [pageSize] Number of permissions per page
     * @returns {Promise<ListPermissionsResponse>} List of permissions
     */
    listPermissions(pageToken, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {};
            if (pageToken) {
                request.pageToken = pageToken;
            }
            if (pageSize) {
                request.pageSize = pageSize;
            }
            return this.coreClient.connectExec(this.client.listPermissions, request);
        });
    }
    /**
     * Update an existing permission by name
     * @param {string} permissionName The permission name to update
     * @param {CreatePermission} permission The permission update object
     * @returns {Promise<UpdatePermissionResponse>} The updated permission
     */
    updatePermission(permissionName, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.updatePermission, {
                permissionName,
                permission
            });
        });
    }
    /**
     * Delete permission by name
     * @param {string} permissionName The permission name to be deleted
     * @returns {Promise<Empty>} Empty response
     */
    deletePermission(permissionName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deletePermission, { permissionName });
        });
    }
    /**
     * List all permissions associated with a role
     * @param {string} roleName The role name to get permissions for
     * @returns {Promise<ListRolePermissionsResponse>} List of role permissions
     */
    listRolePermissions(roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listRolePermissions, { roleName });
        });
    }
    /**
     * Add permissions to a role
     * @param {string} roleName The role name to add permissions to
     * @param {string[]} permissionNames List of permission names to add
     * @returns {Promise<AddPermissionsToRoleResponse>} The response after adding permissions
     */
    addPermissionsToRole(roleName, permissionNames) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.addPermissionsToRole, {
                roleName,
                permissionNames
            });
        });
    }
    /**
     * Remove a permission from a role
     * @param {string} roleName The role name to remove permission from
     * @param {string} permissionName The permission name to remove
     * @returns {Promise<Empty>} Empty response
     */
    removePermissionFromRole(roleName, permissionName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.removePermissionFromRole, {
                roleName,
                permissionName
            });
        });
    }
    /**
     * List all effective permissions for a role (including inherited permissions)
     * @param {string} roleName The role name to get effective permissions for
     * @returns {Promise<ListEffectiveRolePermissionsResponse>} List of effective role permissions
     */
    listEffectiveRolePermissions(roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listEffectiveRolePermissions, { roleName });
        });
    }
}
exports.default = PermissionClient;
//# sourceMappingURL=permission.js.map