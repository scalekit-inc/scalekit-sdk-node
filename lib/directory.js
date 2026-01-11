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
const protobuf_1 = require("@bufbuild/protobuf");
const directories_connect_1 = require("./pkg/grpc/scalekit/v1/directories/directories_connect");
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
 * @see {@link https://docs.scalekit.com/apis/#tag/directory | Directory API Documentation}
 * @see {@link https://docs.scalekit.com/directory/scim/quickstart/ | SCIM Directory Sync Guide}
 */
class DirectoryClient {
    constructor(grpcConncet, coreClient) {
        this.grpcConncet = grpcConncet;
        this.coreClient = coreClient;
        this.client = this.grpcConncet.createClient(directories_connect_1.DirectoryService);
    }
    /**
     * Retrieves all SCIM directories configured for an organization.
     *
     * Lists all directory sync connections that have been set up for the organization. Each directory
     * represents a SCIM integration with an identity provider (Okta, Azure AD, Google Workspace, etc.)
     * that automatically syncs users and groups. Use this to view directory configurations, check sync
     * status, and manage directory integrations.
     *
     * @param {string} organizationId - The organization ID to list directories for (format: "org_...")
     *
     * @returns {Promise<ListDirectoriesResponse>} Response containing:
     *   - directories: Array of directory objects with:
     *     - id: Unique directory identifier
     *     - organizationId: Parent organization ID
     *     - provider: Identity provider name (e.g., "okta", "azure_ad", "google")
     *     - enabled: Whether directory sync is active
     *     - status: Current synchronization status
     *     - lastSyncTime: When the last sync occurred
     *     - userCount: Number of synced users
     *     - groupCount: Number of synced groups
     *
     * @throws {Error} If the organization is not found
     *
     * @example
     * // List all directories for an organization
     * const response = await scalekitClient.directory.listDirectories('org_123456');
     *
     * console.log(`Found ${response.directories.length} directories`);
     * response.directories.forEach(dir => {
     *   console.log(`- ${dir.provider}: ${dir.enabled ? 'Active' : 'Inactive'}`);
     *   console.log(`  Users: ${dir.userCount}, Groups: ${dir.groupCount}`);
     * });
     *
     * @example
     * // Check if organization has any active directories
     * const response = await scalekitClient.directory.listDirectories('org_123456');
     * const hasActiveDirectory = response.directories.some(dir => dir.enabled);
     *
     * if (hasActiveDirectory) {
     *   console.log('Directory sync is enabled for this organization');
     * } else {
     *   console.log('No active directory sync');
     * }
     *
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/directory | List Directories API}
     * @see {@link getDirectory} - Get details of a specific directory
     * @see {@link enableDirectory} - Enable directory sync
     * @see {@link disableDirectory} - Disable directory sync
     */
    listDirectories(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listDirectories, {
                organizationId,
            });
        });
    }
    /**
     * Retrieves comprehensive details about a specific SCIM directory.
     *
     * Fetches complete configuration and status information for a directory, including provider settings,
     * synchronization status, user/group counts, and metadata. Use this to view directory configuration,
     * monitor sync health, verify setup, or display directory details in admin interfaces.
     *
     * @param {string} organizationId - The organization ID that owns the directory (format: "org_...")
     * @param {string} directoryId - The directory identifier to retrieve (format: "dir_...")
     *
     * @returns {Promise<GetDirectoryResponse>} Response containing:
     *   - directory: Complete directory object with:
     *     - id: Unique directory identifier
     *     - organizationId: Parent organization ID
     *     - provider: Identity provider name (e.g., "okta", "azure_ad", "google")
     *     - enabled: Whether directory sync is active
     *     - status: Current synchronization status
     *     - scimBaseUrl: SCIM endpoint URL
     *     - scimToken: Authentication token (masked)
     *     - lastSyncTime: Timestamp of last successful sync
     *     - nextSyncTime: Scheduled time for next sync
     *     - userCount: Number of synced users
     *     - groupCount: Number of synced groups
     *     - createTime: When directory was created
     *     - updateTime: When directory was last updated
     *
     * @throws {Error} If the organization or directory is not found
     *
     * @example
     * // Get directory details
     * const response = await scalekitClient.directory.getDirectory(
     *   'org_123456',
     *   'dir_abc123'
     * );
     *
     * const dir = response.directory;
     * console.log('Provider:', dir.provider);
     * console.log('Status:', dir.enabled ? 'Active' : 'Inactive');
     * console.log('Last sync:', dir.lastSyncTime);
     * console.log('Users:', dir.userCount);
     * console.log('Groups:', dir.groupCount);
     *
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/directory | Get Directory API}
     * @see {@link getPrimaryDirectoryByOrganizationId} - List the first directory in an Organization.
     *                                                  - Useful utility API if you don't know the directory ID but only have an organizationID.
     * @see {@link listDirectoryUsers} - List users in this directory
     * @see {@link listDirectoryGroups} - List groups in this directory
     */
    getDirectory(organizationId, directoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getDirectory, {
                organizationId,
                id: directoryId,
            });
        });
    }
    /**
     * Retrieves the primary (first) directory for an organization.
     *
     * This is a convenience method that fetches the first directory from the organization's list
     * of directories. Most organizations have a single directory, making this useful for quickly
     * accessing directory data without needing to know the specific directory ID. If the organization
     * has multiple directories, this returns the first one.
     *
     * @param {string} organizationId - The organization ID to get the primary directory for (format: "org_...")
     *
     * @returns {Promise<Directory>} The first directory object for the organization
     *
     * @throws {Error} When the organization has no directories configured
     *
     * @example
     * // Get primary directory for an organization
     * try {
     *   const directory = await scalekitClient.directory.getPrimaryDirectoryByOrganizationId('org_123456');
     *
     *   console.log('Primary Directory:', directory.provider);
     *   console.log('Users:', directory.userCount);
     *   console.log('Groups:', directory.groupCount);
     * } catch (error) {
     *   console.log('No directory configured for this organization');
     * }
     *
     *
     * @see {@link listDirectories} - List all directories for an organization
     * @see {@link getDirectory} - Get a specific directory by ID
     * @see {@link listDirectoryUsers} - List users in the directory
     */
    getPrimaryDirectoryByOrganizationId(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const directories = yield this.listDirectories(organizationId);
            if (!directories || directories.directories.length === 0) {
                return Promise.reject("directory does not exist for organization");
            }
            return directories.directories[0];
        });
    }
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
     * @see {@link https://docs.scalekit.com/apis/#tag/directory | List Directory Users API}
     * @see {@link listDirectoryGroups} - List directory groups
     * @see {@link listDirectories} - List all directories for an organization
     */
    listDirectoryUsers(organizationId, directoryId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestOptions = {};
            if (options) {
                requestOptions = Object.assign(Object.assign({}, options), (options.updatedAfter && {
                    updatedAfter: protobuf_1.Timestamp.fromDate(new Date(options.updatedAfter)),
                }));
            }
            return this.coreClient.connectExec(this.client.listDirectoryUsers, Object.assign({ organizationId,
                directoryId }, requestOptions));
        });
    }
    /**
     * Retrieves groups synchronized from an identity provider via SCIM directory sync.
     *
     * Fetches all groups that have been synced from the organization's IdP to your application.
     * Groups typically represent teams, departments, or organizational units. Use this to display
     * group hierarchies, implement group-based access control, manage group memberships, or track
     * organizational structure changes.
     *
     * @param {string} organizationId - The organization ID (format: "org_...")
     * @param {string} directoryId - The directory ID (format: "dir_...")
     * @param {object} [options] - Optional filtering and pagination parameters
     * @param {number} [options.pageSize] - Number of groups per page (max: 30, default: 10)
     * @param {string} [options.pageToken] - Token for next page from previous response
     * @param {boolean} [options.includeDetail] - Include full group details and member lists
     * @param {string} [options.updatedAfter] - ISO 8601 timestamp to fetch only groups updated after this time
     *
     * @returns {Promise<ListDirectoryGroupsResponse>} Response containing:
     *   - groups: Array of directory group objects with:
     *     - id: Group identifier
     *     - displayName: Group name
     *     - description: Group description
     *     - members: Array of member user IDs (when includeDetail is true)
     *     - attributes: Custom group attributes
     *     - updateTime: When the group was last updated
     *   - nextPageToken: Token for retrieving the next page
     *   - totalSize: Total number of groups in the directory
     *
     * @example
     * // List all directory groups with pagination
     * const response = await scalekitClient.directory.listDirectoryGroups(
     *   'org_123456',
     *   'dir_abc123',
     *   { pageSize: 30 }
     * );
     *
     * console.log(`Found ${response.totalSize} groups`);
     * response.groups.forEach(group => {
     *   console.log(`- ${group.displayName}`);
     *   if (group.description) console.log(`  ${group.description}`);
     * });
     *
     * @example
     * // Get groups with full member details
     * const response = await scalekitClient.directory.listDirectoryGroups(
     *   'org_123456',
     *   'dir_abc123',
     *   { includeDetail: true }
     * );
     *
     * response.groups.forEach(group => {
     *   console.log(`${group.displayName}: ${group.members?.length || 0} members`);
     * });
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/directory | List Directory Groups API}
     * @see {@link listDirectoryUsers} - List directory users
     * @see {@link getDirectory} - Get directory details
     */
    listDirectoryGroups(organizationId, directoryId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestOptions = {};
            if (options) {
                requestOptions = Object.assign(Object.assign({}, options), (options.updatedAfter && {
                    updatedAfter: protobuf_1.Timestamp.fromDate(new Date(options.updatedAfter)),
                }));
            }
            return this.coreClient.connectExec(this.client.listDirectoryGroups, Object.assign({ organizationId,
                directoryId }, requestOptions));
        });
    }
    /**
     * Enables SCIM directory synchronization for an organization.
     *
     * Activates automatic user and group synchronization from the organization's identity provider.
     * Once enabled, users and groups from the IdP will be synced to your application, and any changes
     * in the IdP (additions, updates, deletions) will be automatically reflected. This is essential
     * for implementing automated user provisioning and deprovisioning.
     *
     * @param {string} organizationId - The organization ID (format: "org_...")
     * @param {string} directoryId - The directory ID to enable (format: "dir_...")
     *
     * @returns {Promise<ToggleDirectoryResponse>} Response containing:
     *   - directory: The updated directory object with enabled status set to true
     *
     * @throws {Error} If the organization or directory is not found
     * @throws {Error} If the directory configuration is incomplete or invalid
     *
     * @example
     * // Enable directory sync
     * const response = await scalekitClient.directory.enableDirectory(
     *   'org_123456',
     *   'dir_abc123'
     * );
     *
     * console.log('Directory enabled:', response.directory.enabled); // true
     * console.log('Sync will start automatically');
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/directory | Enable Directory API}
     * @see {@link disableDirectory} - Disable directory sync
     * @see {@link getDirectory} - Check directory status
     * @see {@link listDirectoryUsers} - View synced users after enabling
     */
    enableDirectory(organizationId, directoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.enableDirectory, {
                organizationId,
                id: directoryId,
            });
        });
    }
    /**
     * Disables SCIM directory synchronization for an organization.
     *
     * Stops automatic user and group synchronization from the organization's identity provider.
     * When disabled, no new updates will be received from the IdP, but existing synced users and
     * groups remain in your application. This is useful for temporarily pausing sync during maintenance,
     * troubleshooting, or when migrating to a different directory provider. Does not delete existing data.
     *
     * @param {string} organizationId - The organization ID (format: "org_...")
     * @param {string} directoryId - The directory ID to disable (format: "dir_...")
     *
     * @returns {Promise<ToggleDirectoryResponse>} Response containing:
     *   - directory: The updated directory object with enabled status set to false
     *
     * @throws {Error} If the organization or directory is not found
     *
     * @example
     * // Disable directory sync
     * const response = await scalekitClient.directory.disableDirectory(
     *   'org_123456',
     *   'dir_abc123'
     * );
     *
     * console.log('Directory disabled:', !response.directory.enabled); // true
     * console.log('Existing users and groups are preserved');
     *
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/directory | Disable Directory API}
     * @see {@link enableDirectory} - Enable directory sync
     * @see {@link getDirectory} - Check directory status
     * @see {@link listDirectories} - List all directories
     */
    disableDirectory(organizationId, directoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.disableDirectory, {
                organizationId,
                id: directoryId,
            });
        });
    }
}
exports.default = DirectoryClient;
//# sourceMappingURL=directory.js.map