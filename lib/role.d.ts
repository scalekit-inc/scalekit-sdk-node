import { Empty } from '@bufbuild/protobuf';
import GrpcConnect from './connect';
import CoreClient from './core';
import { CreateRoleResponse, UpdateRoleResponse, GetRoleResponse, ListRolesResponse, CreateOrganizationRoleResponse, UpdateOrganizationRoleResponse, GetOrganizationRoleResponse, ListOrganizationRolesResponse, GetRoleUsersCountResponse, GetOrganizationRoleUsersCountResponse, UpdateDefaultOrganizationRolesResponse, CreateRole, UpdateRole, CreateOrganizationRole } from './pkg/grpc/scalekit/v1/roles/roles_pb';
export default class RoleClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Create a new role
     * @param {CreateRole} role The role creation object
     * @returns {Promise<CreateRoleResponse>} The created role
     */
    createRole(role: CreateRole): Promise<CreateRoleResponse>;
    /**
     * Get role by name
     * @param {string} roleName The role name
     * @returns {Promise<GetRoleResponse>} The role details
     */
    getRole(roleName: string): Promise<GetRoleResponse>;
    /**
     * List all roles
     * @returns {Promise<ListRolesResponse>} List of roles
     */
    listRoles(): Promise<ListRolesResponse>;
    /**
     * Update an existing role by name
     * @param {string} roleName The role name to update
     * @param {UpdateRole} role The role update object
     * @returns {Promise<UpdateRoleResponse>} The updated role
     */
    updateRole(roleName: string, role: UpdateRole): Promise<UpdateRoleResponse>;
    /**
     * Delete role by name
     * @param {string} roleName The role name to be deleted
     * @param {string} [reassignRoleName] The role name to reassign users to when deleting this role
     * @returns {Promise<Empty>} Empty response
     */
    deleteRole(roleName: string, reassignRoleName?: string): Promise<Empty>;
    /**
     * Get the count of users associated with a role
     * @param {string} roleName The role name to get user count for
     * @returns {Promise<GetRoleUsersCountResponse>} The user count response
     */
    getRoleUsersCount(roleName: string): Promise<GetRoleUsersCountResponse>;
    /**
     * Create a new organization role
     * @param {string} orgId The organization ID
     * @param {CreateOrganizationRole} role The organization role creation object
     * @returns {Promise<CreateOrganizationRoleResponse>} The created organization role
     */
    createOrganizationRole(orgId: string, role: CreateOrganizationRole): Promise<CreateOrganizationRoleResponse>;
    /**
     * Get organization role by name
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name
     * @returns {Promise<GetOrganizationRoleResponse>} The organization role details
     */
    getOrganizationRole(orgId: string, roleName: string): Promise<GetOrganizationRoleResponse>;
    /**
     * List all organization roles
     * @param {string} orgId The organization ID
     * @returns {Promise<ListOrganizationRolesResponse>} List of organization roles
     */
    listOrganizationRoles(orgId: string): Promise<ListOrganizationRolesResponse>;
    /**
     * Update an existing organization role by name
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name to update
     * @param {UpdateRole} role The organization role update object
     * @returns {Promise<UpdateOrganizationRoleResponse>} The updated organization role
     */
    updateOrganizationRole(orgId: string, roleName: string, role: UpdateRole): Promise<UpdateOrganizationRoleResponse>;
    /**
     * Delete organization role by name
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name to be deleted
     * @param {string} [reassignRoleName] The role name to reassign users to when deleting this role
     * @returns {Promise<Empty>} Empty response
     */
    deleteOrganizationRole(orgId: string, roleName: string, reassignRoleName?: string): Promise<Empty>;
    /**
     * Get the count of users associated with an organization role
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name to get user count for
     * @returns {Promise<GetOrganizationRoleUsersCountResponse>} The user count response
     */
    getOrganizationRoleUsersCount(orgId: string, roleName: string): Promise<GetOrganizationRoleUsersCountResponse>;
    /**
     * Update default organization roles
     * @param {string} orgId The organization ID
     * @param {string} defaultMemberRole The default member role name
     * @returns {Promise<UpdateDefaultOrganizationRolesResponse>} The updated default roles response
     */
    updateDefaultOrganizationRoles(orgId: string, defaultMemberRole: string): Promise<UpdateDefaultOrganizationRolesResponse>;
    /**
     * Delete organization role base relationship
     * @param {string} orgId The organization ID
     * @param {string} roleName The role name to remove base relationship for
     * @returns {Promise<Empty>} Empty response
     */
    deleteOrganizationRoleBase(orgId: string, roleName: string): Promise<Empty>;
}
