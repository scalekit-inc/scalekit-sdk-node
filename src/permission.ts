import { Empty, PartialMessage } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { RolesService } from './pkg/grpc/scalekit/v1/roles/roles_connect';
import { 
  CreatePermissionRequest,
  CreatePermissionResponse,
  GetPermissionRequest,
  GetPermissionResponse,
  UpdatePermissionRequest,
  UpdatePermissionResponse,
  ListPermissionsRequest,
  ListPermissionsResponse,
  DeletePermissionRequest,
  ListRolePermissionsRequest,
  ListRolePermissionsResponse,
  AddPermissionsToRoleRequest,
  AddPermissionsToRoleResponse,
  RemovePermissionFromRoleRequest,
  ListEffectiveRolePermissionsRequest,
  ListEffectiveRolePermissionsResponse,
  CreatePermission
} from './pkg/grpc/scalekit/v1/roles/roles_pb';

export default class PermissionClient {
  private client: PromiseClient<typeof RolesService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(RolesService);
  }

  /**
   * Create a new permission
   * @param {CreatePermission} permission The permission creation object
   * @returns {Promise<CreatePermissionResponse>} The created permission
   */
  async createPermission(permission: CreatePermission): Promise<CreatePermissionResponse> {
    return this.coreClient.connectExec(
      this.client.createPermission,
      { permission }
    );
  }

  /**
   * Get permission by name
   * @param {string} permissionName The permission name
   * @returns {Promise<GetPermissionResponse>} The permission details
   */
  async getPermission(permissionName: string): Promise<GetPermissionResponse> {
    return this.coreClient.connectExec(
      this.client.getPermission,
      { permissionName }
    );
  }

  /**
   * List all permissions
   * @param {string} [pageToken] Token for pagination
   * @param {number} [pageSize] Number of permissions per page
   * @returns {Promise<ListPermissionsResponse>} List of permissions
   */
  async listPermissions(pageToken?: string, pageSize?: number): Promise<ListPermissionsResponse> {
    const request: PartialMessage<ListPermissionsRequest> = {};
    if (pageToken) {
      request.pageToken = pageToken;
    }
    if (pageSize) {
      request.pageSize = pageSize;
    }
    
    return this.coreClient.connectExec(
      this.client.listPermissions,
      request
    );
  }

  /**
   * Update an existing permission by name
   * @param {string} permissionName The permission name to update
   * @param {CreatePermission} permission The permission update object
   * @returns {Promise<UpdatePermissionResponse>} The updated permission
   */
  async updatePermission(permissionName: string, permission: CreatePermission): Promise<UpdatePermissionResponse> {
    return this.coreClient.connectExec(
      this.client.updatePermission,
      {
        permissionName,
        permission
      }
    );
  }

  /**
   * Delete permission by name
   * @param {string} permissionName The permission name to be deleted
   * @returns {Promise<Empty>} Empty response
   */
  async deletePermission(permissionName: string): Promise<Empty> {
    return this.coreClient.connectExec(
      this.client.deletePermission,
      { permissionName }
    );
  }

  /**
   * List all permissions associated with a role
   * @param {string} roleName The role name to get permissions for
   * @returns {Promise<ListRolePermissionsResponse>} List of role permissions
   */
  async listRolePermissions(roleName: string): Promise<ListRolePermissionsResponse> {
    return this.coreClient.connectExec(
      this.client.listRolePermissions,
      { roleName }
    );
  }

  /**
   * Add permissions to a role
   * @param {string} roleName The role name to add permissions to
   * @param {string[]} permissionNames List of permission names to add
   * @returns {Promise<AddPermissionsToRoleResponse>} The response after adding permissions
   */
  async addPermissionsToRole(roleName: string, permissionNames: string[]): Promise<AddPermissionsToRoleResponse> {
    return this.coreClient.connectExec(
      this.client.addPermissionsToRole,
      {
        roleName,
        permissionNames
      }
    );
  }

  /**
   * Remove a permission from a role
   * @param {string} roleName The role name to remove permission from
   * @param {string} permissionName The permission name to remove
   * @returns {Promise<Empty>} Empty response
   */
  async removePermissionFromRole(roleName: string, permissionName: string): Promise<Empty> {
    return this.coreClient.connectExec(
      this.client.removePermissionFromRole,
      {
        roleName,
        permissionName
      }
    );
  }

  /**
   * List all effective permissions for a role (including inherited permissions)
   * @param {string} roleName The role name to get effective permissions for
   * @returns {Promise<ListEffectiveRolePermissionsResponse>} List of effective role permissions
   */
  async listEffectiveRolePermissions(roleName: string): Promise<ListEffectiveRolePermissionsResponse> {
    return this.coreClient.connectExec(
      this.client.listEffectiveRolePermissions,
      { roleName }
    );
  }
}
