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
const users_connect_1 = require("./pkg/grpc/scalekit/v1/users/users_connect");
const users_pb_1 = require("./pkg/grpc/scalekit/v1/users/users_pb");
class UserClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(users_connect_1.UserService);
    }
    /**
     * Create a new user in an organization
     * @param {string} organizationId The organization id
     * @param {CreateUserRequest} options The user creation options
     * @returns {Promise<CreateUserResponse>} The created user
     */
    createUser(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!organizationId) {
                throw new Error('organizationId is required');
            }
            if (!options.email) {
                throw new Error('email is required');
            }
            const user = new users_pb_1.User({
                email: options.email,
                userProfile: {
                    firstName: (_a = options.userProfile) === null || _a === void 0 ? void 0 : _a.firstName,
                    lastName: (_b = options.userProfile) === null || _b === void 0 ? void 0 : _b.lastName
                },
                metadata: options.metadata
            });
            const response = yield this.coreClient.connectExec(this.client.createUser, {
                organizationId,
                user
            });
            if (!response.user) {
                throw new Error('Failed to create user');
            }
            return response;
        });
    }
    /**
     * Get a user by id
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<GetUserResponse>} The user
     */
    getUser(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getUser, {
                organizationId,
                identities: {
                    case: 'id',
                    value: userId
                }
            });
        });
    }
    /**
     * List users with pagination
     * @param {string} organizationId The organization id
     * @param {object} options The pagination options
     * @param {number} options.pageSize The page size
     * @param {string} options.pageToken The page token
     * @returns {Promise<ListUserResponse>} The list of users
     */
    listUsers(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listUsers, Object.assign({ organizationId }, options));
        });
    }
    /**
     * Update a user
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @param {UpdateUserRequest} options The update options
     * @returns {Promise<UpdateUserResponse>} The updated user
     */
    updateUser(organizationId, userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const updateUser = new users_pb_1.UpdateUser({
                userProfile: {
                    firstName: (_a = options.userProfile) === null || _a === void 0 ? void 0 : _a.firstName,
                    lastName: (_b = options.userProfile) === null || _b === void 0 ? void 0 : _b.lastName
                },
                metadata: options.metadata
            });
            return this.coreClient.connectExec(this.client.updateUser, {
                organizationId,
                identities: {
                    case: 'id',
                    value: userId
                },
                user: updateUser
            });
        });
    }
    /**
     * Delete a user
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<Empty>} Empty response
     */
    deleteUser(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteUser, {
                organizationId,
                identities: {
                    case: 'id',
                    value: userId
                }
            });
        });
    }
    /**
     * Add a user to an organization
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<AddUserResponse>} The response
     */
    addUserToOrganization(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.addUserToOrganization, {
                organizationId,
                identities: {
                    case: 'id',
                    value: userId
                }
            });
        });
    }
}
exports.default = UserClient;
//# sourceMappingURL=user.js.map