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
class RoleClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(roles_connect_1.RolesService);
    }
    /**
     * Create a new role
     * @param {CreateRole} role The role creation object
     * @returns {Promise<CreateRoleResponse>} The created role
     */
    createRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.createRole, { role });
        });
    }
    /**
     * Get role by name
     * @param {string} roleName The role name
     * @returns {Promise<GetRoleResponse>} The role details
     */
    getRole(roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getRole, { roleName });
        });
    }
    /**
     * List all roles
     * @returns {Promise<ListRolesResponse>} List of roles
     */
    listRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listRoles, {});
        });
    }
    /**
     * Update an existing role by name
     * @param {string} roleName The role name to update
     * @param {UpdateRole} role The role update object
     * @returns {Promise<UpdateRoleResponse>} The updated role
     */
    updateRole(roleName, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.updateRole, {
                roleName,
                role
            });
        });
    }
    /**
     * Delete role by name
     * @param {string} roleName The role name to be deleted
     * @param {string} [reassignRoleName] The role name to reassign users to when deleting this role
     * @returns {Promise<Empty>} Empty response
     */
    deleteRole(roleName, reassignRoleName) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = { roleName };
            if (reassignRoleName) {
                request.reassignRoleName = reassignRoleName;
            }
            return this.coreClient.connectExec(this.client.deleteRole, request);
        });
    }
    /**
     * Get the count of users associated with a role
     * @param {string} roleName The role name to get user count for
     * @returns {Promise<GetRoleUsersCountResponse>} The user count response
     */
    getRoleUsersCount(roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getRoleUsersCount, { roleName });
        });
    }
    // Organization Role CRUD Methods
    /**
     * Create a new organization role
     * @param {string} orgId The organization ID
     * @param {CreateOrganizationRole} role The organization role creation object
     * @returns {Promise<CreateOrganizationRoleResponse>} The created organization role
     */
    createOrganizationRole(orgId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.createOrganizationRole, {
                orgId,
                role
            });
        });
    }
    /**
     * Get organization role by name
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name
     * @returns {Promise<GetOrganizationRoleResponse>} The organization role details
     */
    getOrganizationRole(orgId, roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getOrganizationRole, {
                orgId,
                roleName
            });
        });
    }
    /**
     * List all organization roles
     * @param {string} orgId The organization ID
     * @returns {Promise<ListOrganizationRolesResponse>} List of organization roles
     */
    listOrganizationRoles(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listOrganizationRoles, { orgId });
        });
    }
    /**
     * Update an existing organization role by name
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name to update
     * @param {UpdateRole} role The organization role update object
     * @returns {Promise<UpdateOrganizationRoleResponse>} The updated organization role
     */
    updateOrganizationRole(orgId, roleName, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.updateOrganizationRole, {
                orgId,
                roleName,
                role
            });
        });
    }
    /**
     * Delete organization role by name
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name to be deleted
     * @param {string} [reassignRoleName] The role name to reassign users to when deleting this role
     * @returns {Promise<Empty>} Empty response
     */
    deleteOrganizationRole(orgId, roleName, reassignRoleName) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                orgId,
                roleName
            };
            if (reassignRoleName) {
                request.reassignRoleName = reassignRoleName;
            }
            return this.coreClient.connectExec(this.client.deleteOrganizationRole, request);
        });
    }
    /**
     * Get the count of users associated with an organization role
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name to get user count for
     * @returns {Promise<GetOrganizationRoleUsersCountResponse>} The user count response
     */
    getOrganizationRoleUsersCount(orgId, roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getOrganizationRoleUsersCount, {
                orgId,
                roleName
            });
        });
    }
    /**
     * Update default organization roles
     * @param {string} orgId The organization ID
     * @param {string} defaultMemberRole The default member role name
     * @returns {Promise<UpdateDefaultOrganizationRolesResponse>} The updated default roles response
     */
    updateDefaultOrganizationRoles(orgId, defaultMemberRole) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.updateDefaultOrganizationRoles, {
                orgId,
                defaultMemberRole
            });
        });
    }
    /**
     * Delete organization role base relationship
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name to remove base relationship for
     * @returns {Promise<Empty>} Empty response
     */
    deleteOrganizationRoleBase(orgId, roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteOrganizationRoleBase, {
                orgId,
                roleName
            });
        });
    }
}
exports.default = RoleClient;
//# sourceMappingURL=role.js.map