import GrpcConnect from './connect';
import CoreClient from './core';
import { GetDirectoryResponse, Directory, ListDirectoriesResponse, ListDirectoryGroupsResponse, ListDirectoryUsersResponse, ToggleDirectoryResponse } from './pkg/grpc/scalekit/v1/directories/directories_pb';
/**
 * Client for managing SCIM directory synchronization.
 *
 * Directories represent SCIM connections that automatically sync users and groups from an
 * organization's identity provider (Okta, Azure AD, Google Workspace, etc.) to your application.
 * Use this client to retrieve synchronized user/group data, manage directory settings, and
 * monitor sync status.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const directoryClient = scalekitClient.directory;
 *
 * @see {@link https://docs.scalekit.com/apis/directory | Directory API Documentation}
 * @see {@link https://docs.scalekit.com/scim | SCIM Directory Sync Guide}
 */
export default class DirectoryClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    /**
     * List directories for an organization
     * @param {string} organizationId The organization id
     * @returns {Promise<ListDirectoriesResponse>} Returns the list of directories
     */
    listDirectories(organizationId: string): Promise<ListDirectoriesResponse>;
    /**
     * Get a directory for an organization
     * @param {string} organizationId The organization id
     * @param {string} directoryId The directory id
     * @returns {Promise<GetDirectoryResponse>} Returns the directory
     */
    getDirectory(organizationId: string, directoryId: string): Promise<GetDirectoryResponse>;
    /**
     * Get a directory for an organization
     * @param {string} organizationId The organization id
     * @returns {Promise<Directory>} Returns the directory
     */
    getPrimaryDirectoryByOrganizationId(organizationId: string): Promise<Directory>;
    /**
     * Lists users synchronized from an identity provider via SCIM directory sync.
     *
     * Retrieves all users that have been synced from the organization's IdP to your application.
     * This includes user profile information, group memberships, and sync status. Use this to
     * display organization users, implement user search, or track provisioning/deprovisioning.
     *
     * @param {string} organizationId - The organization ID
     * @param {string} directoryId - The directory ID
     * @param {object} [options] - Optional filtering and pagination parameters
     * @param {number} [options.pageSize] - Number of users per page (max: 100)
     * @param {string} [options.pageToken] - Token for next page from previous response
     * @param {boolean} [options.includeDetail] - Include full user profile details
     * @param {string} [options.directoryGroupId] - Filter users by group membership
     * @param {string} [options.updatedAfter] - ISO 8601 timestamp to fetch only users updated after this time
     *
     * @returns {Promise<ListDirectoryUsersResponse>} Response containing:
     *   - users: Array of directory user objects with profiles and attributes
     *   - nextPageToken: Token for retrieving the next page
     *   - totalSize: Total number of users in the directory
     *
     * @example
     * // List all directory users with pagination
     * const response = await scalekitClient.directory.listDirectoryUsers(
     *   'org_123456',
     *   'dir_abc123',
     *   { pageSize: 50 }
     * );
     *
     * console.log(`Found ${response.totalSize} users`);
     * response.users.forEach(user => {
     *   console.log(`- ${user.email} (${user.firstName} ${user.lastName})`);
     * });
     *
     * @example
     * // Get users from a specific group
     * const response = await scalekitClient.directory.listDirectoryUsers(
     *   'org_123456',
     *   'dir_abc123',
     *   {
     *     directoryGroupId: 'group_xyz',
     *     includeDetail: true
     *   }
     * );
     *
     * @example
     * // Fetch only recently updated users (incremental sync)
     * const lastSyncTime = '2024-01-01T00:00:00Z';
     * const response = await scalekitClient.directory.listDirectoryUsers(
     *   'org_123456',
     *   'dir_abc123',
     *   { updatedAfter: lastSyncTime }
     * );
     *
     * console.log(`${response.users.length} users updated since last sync`);
     *
     * @see {@link https://docs.scalekit.com/apis/directory#list-directory-users | List Directory Users API}
     * @see {@link listDirectoryGroups} - List directory groups
     * @see {@link listDirectories} - List all directories for an organization
     */
    listDirectoryUsers(organizationId: string, directoryId: string, options?: {
        pageSize?: number;
        pageToken?: string;
        includeDetail?: boolean;
        directoryGroupId?: string;
        updatedAfter?: string;
    }): Promise<ListDirectoryUsersResponse>;
    /**
     * List groups in a directory for an organization
     * @param {string} organizationId The organization id
     * @param {string} directoryId The directory id
     * @param {object} options The options to list directory groups
     * @param {number} options.pageSize The page size
     * @param {string} options.pageToken The page token
     * @param {boolean} options.includeDetail Include detail
     * @param {string} options.updatedAfter The updated after
     * @returns {Promise<ListDirectoryGroupsResponse>} Returns the list of directory groups
     */
    listDirectoryGroups(organizationId: string, directoryId: string, options?: {
        pageSize?: number;
        pageToken?: string;
        includeDetail?: boolean;
        updatedAfter?: string;
    }): Promise<ListDirectoryGroupsResponse>;
    /**
     * Enable a directory for an organization
     * @param {string} organizationId The organization id
     * @param {string} directoryId The directory id
     * @returns {Promise<ToggleDirectoryResponse>} Returns the directory enable response
     */
    enableDirectory(organizationId: string, directoryId: string): Promise<ToggleDirectoryResponse>;
    /**
     * Disable a directory for an organization
     * @param {string} organizationId The organization id
     * @param {string} directoryId The directory id
     * @returns {Promise<ToggleDirectoryResponse>} Returns the directory disable response
     */
    disableDirectory(organizationId: string, directoryId: string): Promise<ToggleDirectoryResponse>;
}
