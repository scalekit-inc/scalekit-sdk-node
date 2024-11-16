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
class DirectoryClient {
    constructor(grpcConncet, coreClient) {
        this.grpcConncet = grpcConncet;
        this.coreClient = coreClient;
        this.client = this.grpcConncet.createClient(directories_connect_1.DirectoryService);
    }
    /**
     * List directories for an organization
     * @param {string} organizationId The organization id
     * @returns {Promise<ListDirectoriesResponse>} Returns the list of directories
     */
    listDirectories(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listDirectories, { organizationId });
        });
    }
    /**
     * Get a directory for an organization
     * @param {string} organizationId The organization id
     * @param {string} directoryId The directory id
     * @returns {Promise<GetDirectoryResponse>} Returns the directory
     */
    getDirectory(organizationId, directoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getDirectory, { organizationId, id: directoryId });
        });
    }
    /**
     * Get a directory for an organization
     * @param {string} organizationId The organization id
     * @returns {Promise<Directory>} Returns the directory
     */
    getPrimaryDirectoryByOrganizationId(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const directories = yield this.listDirectories(organizationId);
            if (!directories || directories.directories.length === 0) {
                return Promise.reject('directory does not exist for organization');
            }
            return directories.directories[0];
        });
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
    listDirectoryUsers(organizationId, directoryId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestOptions = {};
            if (options) {
                requestOptions = Object.assign(Object.assign({}, options), (options.updatedAfter && {
                    updatedAfter: protobuf_1.Timestamp.fromDate(new Date(options.updatedAfter))
                }));
            }
            return this.coreClient.connectExec(this.client.listDirectoryUsers, Object.assign({ organizationId,
                directoryId }, requestOptions));
        });
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
    listDirectoryGroups(organizationId, directoryId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestOptions = {};
            if (options) {
                requestOptions = Object.assign(Object.assign({}, options), (options.updatedAfter && {
                    updatedAfter: protobuf_1.Timestamp.fromDate(new Date(options.updatedAfter))
                }));
            }
            return this.coreClient.connectExec(this.client.listDirectoryGroups, Object.assign({ organizationId,
                directoryId }, requestOptions));
        });
    }
    /**
     * Enable a directory for an organization
     * @param {string} organizationId The organization id
     * @param {string} directoryId The directory id
     * @returns {Promise<ToggleDirectoryResponse>} Returns the directory enable response
     */
    enableDirectory(organizationId, directoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.enableDirectory, { organizationId, id: directoryId });
        });
    }
    /**
     * Disable a directory for an organization
     * @param {string} organizationId The organization id
     * @param {string} directoryId The directory id
     * @returns {Promise<ToggleDirectoryResponse>} Returns the directory disable response
     */
    disableDirectory(organizationId, directoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.disableDirectory, { organizationId, id: directoryId });
        });
    }
}
exports.default = DirectoryClient;
//# sourceMappingURL=directory.js.map