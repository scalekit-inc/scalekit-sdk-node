import { Empty } from "@bufbuild/protobuf";
import GrpcConnect from "./connect";
import CoreClient from "./core";
import { CreatePermissionResponse, GetPermissionResponse, UpdatePermissionResponse, ListPermissionsResponse, ListRolePermissionsResponse, AddPermissionsToRoleResponse, ListEffectiveRolePermissionsResponse, CreatePermission } from "./pkg/grpc/scalekit/v1/roles/roles_pb";
/**
 * Client for managing permissions and role-permission assignments.
 *
 * Permissions represent granular access controls defining specific actions users can perform
 * on resources (e.g., 'read:documents', 'write:settings', 'delete:users'). This client provides
 * comprehensive permission management including CRUD operations and role assignment.
 *
 * **Key Concepts:**
 * - **Direct Permissions**: Explicitly assigned to a role
 * - **Effective Permissions**: Direct + inherited from parent roles through hierarchy
 * - **Permission Format**: 'action:resource' (e.g., 'read:invoices', 'admin:users')
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const permissionClient = scalekitClient.permission;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Permission API Documentation}
 */
export default class PermissionClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Creates a new permission defining a specific action users can perform.
     *
     * Permissions represent granular access controls following the 'action:resource' format.
     * Use this to define the building blocks of your access control system.
     *
     * @param {CreatePermission} permission - Permission object containing:
     *   - name: Permission identifier in 'action:resource' format (e.g., 'read:documents', 'write:settings')
     *   - description: Optional explanation of what this permission grants
     *
     * @returns {Promise<CreatePermissionResponse>} Created permission with ID and timestamps
     *
     * @example
     * // Create basic permissions
     * await scalekitClient.permission.createPermission({
     *   name: 'read:invoices',
     *   description: 'View invoice details'
     * });
    
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Create Permission API}
     */
    createPermission(permission: CreatePermission): Promise<CreatePermissionResponse>;
    /**
     * Retrieves complete information for a specific permission.
     *
     * @param {string} permissionName - Permission identifier (e.g., 'read:documents')
     *
     * @returns {Promise<GetPermissionResponse>} Permission details including description and timestamps
     *
     * @example
     * const response = await scalekitClient.permission.getPermission('read:invoices');
     * console.log('Description:', response.permission.description);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Get Permission API}
     */
    getPermission(permissionName: string): Promise<GetPermissionResponse>;
    /**
     * Lists all permissions with pagination support.
     *
     * View all permission definitions for auditing, role management, or understanding available access controls.
     *
     * @param {string} [pageToken] - Token for retrieving the next page
     * @param {number} [pageSize] - Number of permissions per page (max: 100)
     *
     * @returns {Promise<ListPermissionsResponse>} Paginated list of permissions
     *
     * @example
     * // List all permissions
     * const response = await scalekitClient.permission.listPermissions();
     * response.permissions.forEach(perm => {
     *   console.log(`${perm.name}: ${perm.description}`);
     * });
     *
     * @example
     * // Paginate through permissions
     * let pageToken = undefined;
     * do {
     *   const response = await scalekitClient.permission.listPermissions(pageToken, 50);
     *   // Process permissions
     *   pageToken = response.nextPageToken;
     * } while (pageToken);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/permissions | List Permissions API}
     */
    listPermissions(pageToken?: string, pageSize?: number): Promise<ListPermissionsResponse>;
    /**
     * Updates an existing permission's attributes.
     *
     * Note: The permission name itself cannot be changed as it serves as the immutable identifier.
     *
     * @param {string} permissionName - Permission to update
     * @param {CreatePermission} permission - Updated permission properties
     *
     * @returns {Promise<UpdatePermissionResponse>} Updated permission details
     *
     * @example
     * await scalekitClient.permission.updatePermission('read:invoices', {
     *   name: 'read:invoices',
     *   description: 'View invoice details and history (updated)'
     * });
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Update Permission API}
     */
    updatePermission(permissionName: string, permission: CreatePermission): Promise<UpdatePermissionResponse>;
    /**
     * Permanently removes a permission.
     *
     * Ensure no active roles depend on the permission before deletion.
     *
     * @param {string} permissionName - Permission identifier to delete
     *
     * @returns {Promise<Empty>} Empty response on success
     *
     * @example
     * await scalekitClient.permission.deletePermission('deprecated:feature');
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Delete Permission API}
     */
    deletePermission(permissionName: string): Promise<Empty>;
    /**
     * Lists direct permissions assigned to a role (excluding inherited permissions).
     *
     * Use this to view explicit permission assignments without inheritance from base roles.
     *
     * @param {string} roleName - Role to examine
     *
     * @returns {Promise<ListRolePermissionsResponse>} List of directly assigned permissions only
     *
     * @example
     * const response = await scalekitClient.permission.listRolePermissions('editor');
     * console.log('Direct permissions:', response.permissions);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/permissions | List Role Permissions API}
     * @see {@link listEffectiveRolePermissions} - Get all permissions including inherited
     */
    listRolePermissions(roleName: string): Promise<ListRolePermissionsResponse>;
    /**
     * Grants additional permissions to a role without removing existing assignments.
     *
     * This is an incremental operation that adds new permissions while preserving existing ones.
     * System validates permission existence before assignment.
     *
     * @param {string} roleName - Target role to enhance
     * @param {string[]} permissionNames - Array of permission identifiers to add
     *
     * @returns {Promise<AddPermissionsToRoleResponse>} Updated list of all role permissions
     *
     * @example
     * // Add multiple permissions to a role
     * await scalekitClient.permission.addPermissionsToRole('editor', [
     *   'read:documents',
     *   'write:documents',
     *   'edit:documents'
     * ]);
     *
     * @example
     * // Incrementally add permissions
     * await scalekitClient.permission.addPermissionsToRole('support', ['read:tickets']);
     * await scalekitClient.permission.addPermissionsToRole('support', ['update:tickets']);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Add Permissions to Role API}
     */
    addPermissionsToRole(roleName: string, permissionNames: string[]): Promise<AddPermissionsToRoleResponse>;
    /**
     * Revokes a specific permission from a role, restricting access for all assigned users.
     *
     * Only affects direct assignments; doesn't impact inherited permissions from base roles.
     *
     * @param {string} roleName - Role to modify
     * @param {string} permissionName - Permission to remove
     *
     * @returns {Promise<Empty>} Empty response on success
     *
     * @example
     * // Remove delete permission from editor role
     * await scalekitClient.permission.removePermissionFromRole('editor', 'delete:documents');
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/permissions | Remove Permission from Role API}
     */
    removePermissionFromRole(roleName: string, permissionName: string): Promise<Empty>;
    /**
     * Lists all effective permissions for a role including both direct and inherited permissions.
     *
     * This returns the complete set of capabilities available through the role hierarchy.
     * Essential for understanding the full scope of access granted to users assigned to this role.
     *
     * @param {string} roleName - Role to analyze
     *
     * @returns {Promise<ListEffectiveRolePermissionsResponse>} Complete list including inherited permissions
     *
     * @example
     * // Compare direct vs effective permissions
     * const direct = await scalekitClient.permission.listRolePermissions('senior_editor');
     * const effective = await scalekitClient.permission.listEffectiveRolePermissions('senior_editor');
     *
     * console.log('Direct permissions:', direct.permissions.length);
     * console.log('Total effective permissions:', effective.permissions.length);
     * console.log('Inherited:', effective.permissions.length - direct.permissions.length);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/permissions | List Effective Role Permissions API}
     * @see {@link listRolePermissions} - Get only direct permissions
     */
    listEffectiveRolePermissions(roleName: string): Promise<ListEffectiveRolePermissionsResponse>;
}
