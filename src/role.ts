import { Empty, PartialMessage } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { RolesService } from './pkg/grpc/scalekit/v1/roles/roles_connect';
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
  CreateOrganizationRole
} from './pkg/grpc/scalekit/v1/roles/roles_pb';

export default class RoleClient {
  private client: PromiseClient<typeof RolesService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(RolesService);
  }

  /**
   * Create a new role
   * @param {CreateRole} role The role creation object
   * @returns {Promise<CreateRoleResponse>} The created role
   */
  async createRole(role: CreateRole): Promise<CreateRoleResponse> {
    return this.coreClient.connectExec(
      this.client.createRole,
      { role }
    );
  }

  /**
   * Get role by name
   * @param {string} roleName The role name
   * @returns {Promise<GetRoleResponse>} The role details
   */
  async getRole(roleName: string): Promise<GetRoleResponse> {
    return this.coreClient.connectExec(
      this.client.getRole,
      { roleName }
    );
  }

  /**
   * List all roles
   * @returns {Promise<ListRolesResponse>} List of roles
   */
  async listRoles(): Promise<ListRolesResponse> {
    return this.coreClient.connectExec(
      this.client.listRoles,
      {}
    );
  }

  /**
   * Update an existing role by name
   * @param {string} roleName The role name to update
   * @param {UpdateRole} role The role update object
   * @returns {Promise<UpdateRoleResponse>} The updated role
   */
  async updateRole(roleName: string, role: UpdateRole): Promise<UpdateRoleResponse> {
    return this.coreClient.connectExec(
      this.client.updateRole,
      { 
        roleName,
        role 
      }
    );
  }

  /**
   * Delete role by name
   * @param {string} roleName The role name to be deleted
   * @param {string} [reassignRoleName] The role name to reassign users to when deleting this role
   * @returns {Promise<Empty>} Empty response
   */
  async deleteRole(roleName: string, reassignRoleName?: string): Promise<Empty> {
    const request: PartialMessage<DeleteRoleRequest> = { roleName };
    if (reassignRoleName) {
      request.reassignRoleName = reassignRoleName;
    }
    
    return this.coreClient.connectExec(
      this.client.deleteRole,
      request
    );
  }

  /**
   * Get the count of users associated with a role
   * @param {string} roleName The role name to get user count for
   * @returns {Promise<GetRoleUsersCountResponse>} The user count response
   */
  async getRoleUsersCount(roleName: string): Promise<GetRoleUsersCountResponse> {
    return this.coreClient.connectExec(
      this.client.getRoleUsersCount,
      { roleName }
    );
  }

  // Organization Role CRUD Methods

  /**
   * Create a new organization role
   * @param {string} orgId The organization ID
   * @param {CreateOrganizationRole} role The organization role creation object
   * @returns {Promise<CreateOrganizationRoleResponse>} The created organization role
   */
  async createOrganizationRole(orgId: string, role: CreateOrganizationRole): Promise<CreateOrganizationRoleResponse> {
    return this.coreClient.connectExec(
      this.client.createOrganizationRole,
      {
        orgId,
        role
      }
    );
  }

  /**
   * Get organization role by name
   * @param {string} orgId The organization ID
   * @param {string} roleName The role name
   * @returns {Promise<GetOrganizationRoleResponse>} The organization role details
   */
  async getOrganizationRole(orgId: string, roleName: string): Promise<GetOrganizationRoleResponse> {
    return this.coreClient.connectExec(
      this.client.getOrganizationRole,
      {
        orgId,
        roleName
      }
    );
  }

  /**
   * List all organization roles
   * @param {string} orgId The organization ID
   * @returns {Promise<ListOrganizationRolesResponse>} List of organization roles
   */
  async listOrganizationRoles(orgId: string): Promise<ListOrganizationRolesResponse> {
    return this.coreClient.connectExec(
      this.client.listOrganizationRoles,
      { orgId }
    );
  }

  /**
   * Update an existing organization role by name
   * @param {string} orgId The organization ID
   * @param {string} roleName The role name to update
   * @param {UpdateRole} role The organization role update object
   * @returns {Promise<UpdateOrganizationRoleResponse>} The updated organization role
   */
  async updateOrganizationRole(orgId: string, roleName: string, role: UpdateRole): Promise<UpdateOrganizationRoleResponse> {
    return this.coreClient.connectExec(
      this.client.updateOrganizationRole,
      {
        orgId,
        roleName,
        role
      }
    );
  }

  /**
   * Delete organization role by name
   * @param {string} orgId The organization ID
   * @param {string} roleName The role name to be deleted
   * @param {string} [reassignRoleName] The role name to reassign users to when deleting this role
   * @returns {Promise<Empty>} Empty response
   */
  async deleteOrganizationRole(orgId: string, roleName: string, reassignRoleName?: string): Promise<Empty> {
    const request: PartialMessage<DeleteOrganizationRoleRequest> = {
      orgId,
      roleName
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
   * Get the count of users associated with an organization role
   * @param {string} orgId The organization ID
   * @param {string} roleName The role name to get user count for
   * @returns {Promise<GetOrganizationRoleUsersCountResponse>} The user count response
   */
  async getOrganizationRoleUsersCount(orgId: string, roleName: string): Promise<GetOrganizationRoleUsersCountResponse> {
    return this.coreClient.connectExec(
      this.client.getOrganizationRoleUsersCount,
      {
        orgId,
        roleName
      }
    );
  }

  /**
   * Update default organization roles
   * @param {string} orgId The organization ID
   * @param {string} defaultMemberRole The default member role name
   * @returns {Promise<UpdateDefaultOrganizationRolesResponse>} The updated default roles response
   */
  async updateDefaultOrganizationRoles(orgId: string, defaultMemberRole: string): Promise<UpdateDefaultOrganizationRolesResponse> {
    return this.coreClient.connectExec(
      this.client.updateDefaultOrganizationRoles,
      {
        orgId,
        defaultMemberRole
      }
    );
  }

  /**
   * Delete organization role base relationship
   * @param {string} orgId The organization ID
   * @param {string} roleName The role name to remove base relationship for
   * @returns {Promise<Empty>} Empty response
   */
  async deleteOrganizationRoleBase(orgId: string, roleName: string): Promise<Empty> {
    return this.coreClient.connectExec(
      this.client.deleteOrganizationRoleBase,
      {
        orgId,
        roleName
      }
    );
  }
}
