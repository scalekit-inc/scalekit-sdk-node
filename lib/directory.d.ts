import GrpcConnect from './connect';
import CoreClient from './core';
import { GetDirectoryResponse, Directory, ListDirectoriesResponse, ListDirectoryGroupsResponse, ListDirectoryUsersResponse, ToggleDirectoryResponse } from './pkg/grpc/scalekit/v1/directories/directories_pb';
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
     * List users in a directory for an organization
     * @param {string} organizationId The organization id
     * @param {string} directoryId The directory id
     * @param {object} options The options to list directory users
     * @param {number} options.pageSize The page size
     * @param {string} options.pageToken The page token
     * @param {boolean} options.includeDetail Include detail
     * @param {string} options.directoryGroupId The directory group id
     * @param {string} options.updatedAfter The updated after
     * @returns {Promise<ListDirectoryUsersResponse>} Returns the list of directory users
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
