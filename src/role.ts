import { Empty, PartialMessage } from "@bufbuild/protobuf";
import { PromiseClient } from "@connectrpc/connect";
import GrpcConnect from "./connect";
import CoreClient from "./core";
import { RolesService } from "./pkg/grpc/scalekit/v1/roles/roles_connect";
import {
  CreateRoleRequest,
  CreateRoleResponse,
  UpdateRoleRequest,
  UpdateRoleResponse,
  GetRoleRequest,
  GetRoleResponse,
  ListRolesRequest,
  ListRolesResponse,
  DeleteRoleRequest,
  CreateOrganizationRoleRequest,
  CreateOrganizationRoleResponse,
  UpdateOrganizationRoleRequest,
  UpdateOrganizationRoleResponse,
  GetOrganizationRoleRequest,
  GetOrganizationRoleResponse,
  ListOrganizationRolesRequest,
  ListOrganizationRolesResponse,
  DeleteOrganizationRoleRequest,
  GetRoleUsersCountRequest,
  GetRoleUsersCountResponse,
  GetOrganizationRoleUsersCountRequest,
  GetOrganizationRoleUsersCountResponse,
  UpdateDefaultOrganizationRolesRequest,
  UpdateDefaultOrganizationRolesResponse,
  DeleteOrganizationRoleBaseRequest,
  CreateRole,
  UpdateRole,
  CreateOrganizationRole,
} from "./pkg/grpc/scalekit/v1/roles/roles_pb";

/**
 * Client for managing roles at both environment and organization levels.
 *
 * Roles define sets of permissions that control user access to resources and operations.
 * This client provides comprehensive role management including role hierarchies, permission
 * inheritance, and both environment-wide and organization-specific roles.
 *
 * **Environment Roles**: Available across your entire Scalekit environment, shared by all organizations
 * **Organization Roles**: Scoped to specific organizations for multi-tenant isolation. These are additional custom roles
 * that are only applicable for that organization beyond the Environment Roles that are applicable for all organizations.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const roleClient = scalekitClient.role;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/roles | Role API Documentation}
 */
export default class RoleClient {
  private client: PromiseClient<typeof RolesService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(RolesService);
  }

  /**
   * Creates a new environment-level role with specified permissions.
   *
   * Environment roles are available across all organizations in your environment. Use this to
   * establish foundational access control structures, create role hierarchies, or define granular
   * permission sets that can be reused across organizations.
   *
   * @param {CreateRole} role - Role creation object containing:
   *   - name: Unique role identifier (alphanumeric with underscores, 1-64 chars)
   *   - displayName: Human-readable name for display
   *   - description: Purpose and scope of the role
   *   - permissions: Array of permission strings
   *   - baseRole?: Optional parent role for permission inheritance
   *
   * @returns {Promise<CreateRoleResponse>} The created role with metadata
   *
   * @example
   * // Create a basic role
   * const response = await scalekitClient.role.createRole({
   *   name: 'content_editor',
   *   displayName: 'Content Editor',
   *   description: 'Can create and edit content',
   *   permissions: ['content:read', 'content:write', 'content:edit']
   * });
   *
   * @example
   * // Create role with inheritance
   * await scalekitClient.role.createRole({
   *   name: 'senior_editor',
   *   displayName: 'Senior Editor',
   *   description: 'Editor with publishing rights',
   *   baseRole: 'content_editor',
   *   permissions: ['content:publish', 'content:delete']
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Create Role API}
   */
  async createRole(role: CreateRole): Promise<CreateRoleResponse> {
    return this.coreClient.connectExec(this.client.createRole, { role });
  }

  /**
   * Retrieves complete information for a specific environment role.
   *
   * @param {string} roleName - Unique role identifier (alphanumeric with underscores, 1-64 chars)
   *
   * @returns {Promise<GetRoleResponse>} Role details including permissions and inheritance
   *
   * @example
   * const response = await scalekitClient.role.getRole('content_editor');
   * console.log('Role:', response.role.displayName);
   * console.log('Permissions:', response.role.permissions);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Get Role API}
   */
  async getRole(roleName: string): Promise<GetRoleResponse> {
    return this.coreClient.connectExec(this.client.getRole, { roleName });
  }

  /**
   * Lists all environment-level roles available in your Scalekit environment.
   *
   * @returns {Promise<ListRolesResponse>} Array of all roles with their metadata
   *
   * @example
   * const response = await scalekitClient.role.listRoles();
   * response.roles.forEach(role => {
   *   console.log(`${role.displayName}: ${role.permissions.length} permissions`);
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | List Roles API}
   */
  async listRoles(): Promise<ListRolesResponse> {
    return this.coreClient.connectExec(this.client.listRoles, {});
  }

  /**
   * Updates an existing environment role's properties and permissions.
   *
   * Only specified fields are updated. The new permission list replaces existing permissions.
   *
   * @param {string} roleName - Role to update
   * @param {UpdateRole} role - Updated role properties
   *
   * @returns {Promise<UpdateRoleResponse>} Updated role details
   *
   * @example
   * await scalekitClient.role.updateRole('content_editor', {
   *   displayName: 'Content Editor (Updated)',
   *   permissions: ['content:read', 'content:write', 'content:edit', 'content:review']
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Update Role API}
   */
  async updateRole(
    roleName: string,
    role: UpdateRole
  ): Promise<UpdateRoleResponse> {
    return this.coreClient.connectExec(this.client.updateRole, {
      roleName,
      role,
    });
  }

  /**
   * Deletes an environment role and reassigns its users to another role.
   *
   * Cannot delete if dependent roles exist. Users must be reassigned before deletion.
   * This operation is irreversible.
   *
   * @param {string} roleName - Role to delete
   * @param {string} [reassignRoleName] - Target role for user migration
   *
   * @returns {Promise<Empty>} Empty response on success
   *
   * @example
   * await scalekitClient.role.deleteRole('old_role', 'new_role');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Delete Role API}
   */
  async deleteRole(
    roleName: string,
    reassignRoleName?: string
  ): Promise<Empty> {
    const request: PartialMessage<DeleteRoleRequest> = { roleName };
    if (reassignRoleName) {
      request.reassignRoleName = reassignRoleName;
    }

    return this.coreClient.connectExec(this.client.deleteRole, request);
  }

  /**
   * Gets the number of users assigned to an environment role.
   *
   * Useful for capacity planning, security auditing, and impact assessment before role changes.
   *
   * @param {string} roleName - Role to count users for
   *
   * @returns {Promise<GetRoleUsersCountResponse>} Total user count (direct and inherited)
   *
   * @example
   * const response = await scalekitClient.role.getRoleUsersCount('admin');
   * console.log(`${response.count} users have admin role`);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Get Role User Count API}
   */
  async getRoleUsersCount(
    roleName: string
  ): Promise<GetRoleUsersCountResponse> {
    return this.coreClient.connectExec(this.client.getRoleUsersCount, {
      roleName,
    });
  }

  // Organization Role CRUD Methods

  /**
   * Creates a new organization-specific role with custom permissions.
   *
   * Organization roles are scoped to a specific organization for multi-tenant isolation.
   * Use this for organization-specific access control and compartmentalized role management.
   *
   * @param {string} orgId - Organization identifier (format: "org_...")
   * @param {CreateOrganizationRole} role - Role configuration containing:
   *   - name: Unique role identifier within the organization
   *   - displayName: Human-readable name
   *   - description: Purpose and scope
   *   - permissions: Organization-specific permission array
   *   - baseRole?: Parent role for inheritance
   *
   * @returns {Promise<CreateOrganizationRoleResponse>} Created organization role
   *
   * @example
   * await scalekitClient.role.createOrganizationRole('org_123456', {
   *   name: 'department_lead',
   *   displayName: 'Department Lead',
   *   description: 'Manages department members',
   *   permissions: ['dept:members:read', 'dept:members:invite']
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Create Organization Role API}
   */
  async createOrganizationRole(
    orgId: string,
    role: CreateOrganizationRole
  ): Promise<CreateOrganizationRoleResponse> {
    return this.coreClient.connectExec(this.client.createOrganizationRole, {
      orgId,
      role,
    });
  }

  /**
   * Retrieves details for a specific organization role.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role name to retrieve
   *
   * @returns {Promise<GetOrganizationRoleResponse>} Organization role details
   *
   * @example
   * const response = await scalekitClient.role.getOrganizationRole(
   *   'org_123456',
   *   'department_lead'
   * );
   * console.log('Permissions:', response.role.permissions);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Get Organization Role API}
   */
  async getOrganizationRole(
    orgId: string,
    roleName: string
  ): Promise<GetOrganizationRoleResponse> {
    return this.coreClient.connectExec(this.client.getOrganizationRole, {
      orgId,
      roleName,
    });
  }

  /**
   * Lists all roles available to an organization (environment + organization-specific).
   *
   * Returns both environment-level roles and organization-scoped roles.
   *
   * @param {string} orgId - Organization identifier
   *
   * @returns {Promise<ListOrganizationRolesResponse>} Array of available roles
   *
   * @example
   * const response = await scalekitClient.role.listOrganizationRoles('org_123456');
   * response.roles.forEach(role => {
   *   console.log(`${role.displayName} (${role.scope})`);
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | List Organization Roles API}
   */
  async listOrganizationRoles(
    orgId: string
  ): Promise<ListOrganizationRolesResponse> {
    return this.coreClient.connectExec(this.client.listOrganizationRoles, {
      orgId,
    });
  }

  /**
   * Updates an organization role's properties and permissions.
   *
   * Only specified fields are updated. New permissions replace existing ones.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role to update
   * @param {UpdateRole} role - Updated role properties
   *
   * @returns {Promise<UpdateOrganizationRoleResponse>} Updated role
   *
   * @example
   * await scalekitClient.role.updateOrganizationRole('org_123456', 'department_lead', {
   *   permissions: ['dept:members:read', 'dept:members:invite', 'dept:members:remove']
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Update Organization Role API}
   */
  async updateOrganizationRole(
    orgId: string,
    roleName: string,
    role: UpdateRole
  ): Promise<UpdateOrganizationRoleResponse> {
    return this.coreClient.connectExec(this.client.updateOrganizationRole, {
      orgId,
      roleName,
      role,
    });
  }

  /**
   * Deletes an organization role and reassigns its users.
   *
   * Cannot delete if dependent roles exist. Users must be reassigned. Operation is irreversible.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role to delete
   * @param {string} [reassignRoleName] - Target role for user migration
   *
   * @returns {Promise<Empty>} Empty response on success
   *
   * @example
   * await scalekitClient.role.deleteOrganizationRole(
   *   'org_123456',
   *   'old_role',
   *   'new_role'
   * );
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Delete Organization Role API}
   */
  async deleteOrganizationRole(
    orgId: string,
    roleName: string,
    reassignRoleName?: string
  ): Promise<Empty> {
    const request: PartialMessage<DeleteOrganizationRoleRequest> = {
      orgId,
      roleName,
    };
    if (reassignRoleName) {
      request.reassignRoleName = reassignRoleName;
    }

    return this.coreClient.connectExec(
      this.client.deleteOrganizationRole,
      request
    );
  }

  /**
   * Gets the number of users assigned to an organization role.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role to count users for
   *
   * @returns {Promise<GetOrganizationRoleUsersCountResponse>} User count
   *
   * @example
   * const response = await scalekitClient.role.getOrganizationRoleUsersCount(
   *   'org_123456',
   *   'admin'
   * );
   * console.log(`${response.count} admins in this organization`);
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Get Organization Role User Count API}
   */
  async getOrganizationRoleUsersCount(
    orgId: string,
    roleName: string
  ): Promise<GetOrganizationRoleUsersCountResponse> {
    return this.coreClient.connectExec(
      this.client.getOrganizationRoleUsersCount,
      {
        orgId,
        roleName,
      }
    );
  }

  /**
   * Sets the default role automatically assigned to new organization members.
   * This is the role that is by default assigned to every new user added to this organization.
   *
   * Affects all new user invitations and memberships within the organization.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} defaultMemberRole - Role name to assign by default
   *
   * @returns {Promise<UpdateDefaultOrganizationRolesResponse>} Updated configuration
   *
   * @example
   * await scalekitClient.role.updateDefaultOrganizationRoles('org_123456', 'member');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Update Default Organization Roles API}
   */
  async updateDefaultOrganizationRoles(
    orgId: string,
    defaultMemberRole: string
  ): Promise<UpdateDefaultOrganizationRolesResponse> {
    return this.coreClient.connectExec(
      this.client.updateDefaultOrganizationRoles,
      {
        orgId,
        defaultMemberRole,
      }
    );
  }

  /**
   * Removes a role's inheritance relationship, eliminating inherited permissions from base role.
   *
   * Role retains only directly assigned permissions after removal. This action cannot be undone.
   *
   * @param {string} orgId - Organization identifier
   * @param {string} roleName - Role to remove inheritance from
   *
   * @returns {Promise<Empty>} Empty response on success
   *
   * @example
   * await scalekitClient.role.deleteOrganizationRoleBase('org_123456', 'custom_role');
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/roles | Delete Organization Role Base API}
   */
  async deleteOrganizationRoleBase(
    orgId: string,
    roleName: string
  ): Promise<Empty> {
    return this.coreClient.connectExec(this.client.deleteOrganizationRoleBase, {
      orgId,
      roleName,
    });
  }
}
