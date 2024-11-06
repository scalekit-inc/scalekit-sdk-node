import { Timestamp } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { DirectoryService } from './pkg/grpc/scalekit/v1/directories/directories_connect';
import {
  GetDirectoryResponse,
  Directory,
  ListDirectoriesResponse,
  ListDirectoryGroupsResponse,
  ListDirectoryUsersResponse,
  ToggleDirectoryResponse
} from './pkg/grpc/scalekit/v1/directories/directories_pb';

export default class DirectoryClient {
  private client: PromiseClient<typeof DirectoryService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(DirectoryService);
  }

  /**
   * List directories for an organization
   * @param {string} organizationId The organization id
   * @returns {Promise<ListDirectoriesResponse>} Returns the list of directories
   */
  async listDirectories(organizationId: string): Promise<ListDirectoriesResponse> {
    return this.coreClient.connectExec(
      this.client.listDirectories,
      { organizationId }
    )
  }

  /**
   * Get a directory for an organization
   * @param {string} organizationId The organization id
   * @param {string} directoryId The directory id
   * @returns {Promise<GetDirectoryResponse>} Returns the directory
   */
  async getDirectory(organizationId: string, directoryId: string): Promise<GetDirectoryResponse> {
    return this.coreClient.connectExec(
      this.client.getDirectory,
      { organizationId, id: directoryId }
    )
  }

  /**
   * Get a directory for an organization
   * @param {string} organizationId The organization id
   * @returns {Promise<Directory>} Returns the directory
   */
  async getDirectoryByOrganizationId(organizationId: string): Promise<Directory> {
    const directories = await this.listDirectories(organizationId);
    if (!directories || directories.directories.length === 0) {
      return Promise.reject('directory does not exist for organization');
    }

    return directories.directories[0];
  }

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
  async listDirectoryUsers(
    organizationId: string,
    directoryId: string,
    options?: {
      pageSize?: number,
      pageToken?: string,
      includeDetail?: boolean,
      directoryGroupId?: string,
      updatedAfter?: string,
    }
  ): Promise<ListDirectoryUsersResponse> {
    let requestOptions = {};
    if (options) {
      requestOptions = {
        ...options,
        ...(options.updatedAfter && {
          updatedAfter: Timestamp.fromDate(new Date(options.updatedAfter))
        })
      }
    }

    return this.coreClient.connectExec(
      this.client.listDirectoryUsers,
      {
        organizationId,
        directoryId,
        requestOptions,
      }
    )
  }

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
  async listDirectoryGroups(
    organizationId: string,
    directoryId: string,
    options?: {
      pageSize?: number,
      pageToken?: string,
      includeDetail?: boolean,
      updatedAfter?: string,
    }
  ): Promise<ListDirectoryGroupsResponse> {
    let requestOptions = {};
    if (options) {
      requestOptions = {
        ...options,
        ...(options.updatedAfter && {
          updatedAfter: Timestamp.fromDate(new Date(options.updatedAfter))
        })
      }
    }

    return this.coreClient.connectExec(
      this.client.listDirectoryGroups,
      {
        organizationId,
        directoryId,
        requestOptions,
      }
    )
  }

  /**
   * Enable a directory for an organization
   * @param {string} organizationId The organization id
   * @param {string} directoryId The directory id
   * @returns {Promise<ToggleDirectoryResponse>} Returns the directory enable response
   */
  async enableDirectory(organizationId: string, directoryId: string): Promise<ToggleDirectoryResponse> {
    return this.coreClient.connectExec(
      this.client.enableDirectory,
      { organizationId, id: directoryId }
    )
  }

  /**
   * Disable a directory for an organization
   * @param {string} organizationId The organization id
   * @param {string} directoryId The directory id
   * @returns {Promise<ToggleDirectoryResponse>} Returns the directory disable response
   */
  async disableDirectory(organizationId: string, directoryId: string): Promise<ToggleDirectoryResponse> {
    return this.coreClient.connectExec(
      this.client.disableDirectory,
      { organizationId, id: directoryId }
    )
  }
}

