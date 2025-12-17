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
     * Creates a new user and adds them as a member of an organization in a single operation.
     *
     * This is the primary method for user provisioning. It creates the user account and establishes
     * their membership in the specified organization. Optionally sends an invitation email to the user
     * with instructions to activate their account.
     *
     * @param {string} organizationId - The organization ID to add the user to
     * @param {CreateUserRequest} options - User creation configuration
     * @param {string} options.email - User's email address (required, must be unique)
     * @param {object} [options.userProfile] - Optional user profile information
     * @param {string} [options.userProfile.firstName] - User's first name
     * @param {string} [options.userProfile.lastName] - User's last name
     * @param {Record<string, string>} [options.metadata] - Custom metadata key-value pairs
     * @param {boolean} [options.sendInvitationEmail=true] - Whether to send invitation email to the user
     *
     * @returns {Promise<CreateUserAndMembershipResponse>} Response containing:
     *   - user: The created user object with profile and membership details
     *
     * @throws {Error} When organizationId is missing or invalid
     * @throws {Error} When email is missing or already exists
     * @throws {Error} When user creation fails
     *
     * @example
     * // Create user with profile and send invitation
     * const response = await scalekitClient.user.createUserAndMembership(
     *   'org_123456',
     *   {
     *     email: 'john.doe@company.com',
     *     userProfile: {
     *       firstName: 'John',
     *       lastName: 'Doe'
     *     },
     *     sendInvitationEmail: true,
     *     metadata: {
     *       department: 'Engineering',
     *       role: 'Developer'
     *     }
     *   }
     * );
     *
     * console.log('User created:', response.user.id);
     *
     * @example
     * // Create user without sending invitation
     * const response = await scalekitClient.user.createUserAndMembership(
     *   'org_123456',
     *   {
     *     email: 'jane.smith@company.com',
     *     sendInvitationEmail: false
     *   }
     * );
     *
     * @see {@link https://docs.scalekit.com/apis/user#create-user | Create User API}
     * @see {@link createMembership} - Add existing user to another organization
     * @see {@link resendInvite} - Resend invitation email to a user
     */
    createUserAndMembership(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId) {
                throw new Error('organizationId is required');
            }
            if (!options.email) {
                throw new Error('email is required');
            }
            const user = new users_pb_1.CreateUser({
                email: options.email,
                userProfile: options.userProfile ? new users_pb_1.CreateUserProfile({
                    firstName: options.userProfile.firstName,
                    lastName: options.userProfile.lastName
                }) : undefined,
                metadata: options.metadata
            });
            const request = {
                organizationId,
                user
            };
            if (options.sendInvitationEmail !== undefined) {
                request.sendInvitationEmail = options.sendInvitationEmail;
            }
            const response = yield this.coreClient.connectExec(this.client.createUserAndMembership, request);
            if (!response.user) {
                throw new Error('Failed to create user');
            }
            return response;
        });
    }
    /**
     * Get a user by id
     * @param {string} userId The user id
     * @returns {Promise<GetUserResponse>} The user
     */
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getUser, {
                identities: {
                    case: 'id',
                    value: userId
                }
            });
        });
    }
    /**
     * List users with pagination
     * @param {object} options The pagination options
     * @param {number} options.pageSize The page size
     * @param {string} options.pageToken The page token
     * @returns {Promise<ListUsersResponse>} The list of users
     */
    listUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listUsers, {
                pageSize: options === null || options === void 0 ? void 0 : options.pageSize,
                pageToken: options === null || options === void 0 ? void 0 : options.pageToken
            });
        });
    }
    /**
     * Update a user
     * @param {string} userId The user id
     * @param {UpdateUserRequestType} options The update options
     * @returns {Promise<UpdateUserResponse>} The updated user
     */
    updateUser(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateUser = new users_pb_1.UpdateUser({
                userProfile: options.userProfile ? {
                    firstName: options.userProfile.firstName,
                    lastName: options.userProfile.lastName
                } : undefined,
                metadata: options.metadata
            });
            return this.coreClient.connectExec(this.client.updateUser, {
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
     * @param {string} userId The user id
     * @returns {Promise<Empty>} Empty response
     */
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteUser, {
                identities: {
                    case: 'id',
                    value: userId
                }
            });
        });
    }
    /**
     * Create a membership for a user in an organization
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @param {object} options The membership options
     * @param {string[]} options.roles The roles to assign
     * @param {Record<string, string>} options.metadata Optional metadata
     * @param {boolean} options.sendInvitationEmail Whether to send invitation email
     * @returns {Promise<CreateMembershipResponse>} The response with updated user
     */
    createMembership(organizationId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (organizationId, userId, options = {}) {
            var _a;
            const membership = new users_pb_1.CreateMembership({
                roles: ((_a = options.roles) === null || _a === void 0 ? void 0 : _a.map(role => ({ name: role }))) || [],
                metadata: options.metadata || {}
            });
            const request = {
                organizationId,
                identities: {
                    case: 'id',
                    value: userId
                },
                membership
            };
            if (options.sendInvitationEmail !== undefined) {
                request.sendInvitationEmail = options.sendInvitationEmail;
            }
            return this.coreClient.connectExec(this.client.createMembership, request);
        });
    }
    /**
     * Delete a user's membership from an organization
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<Empty>} Empty response
     */
    deleteMembership(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteMembership, {
                organizationId,
                identities: {
                    case: 'id',
                    value: userId
                }
            });
        });
    }
    /**
     * Update a user's membership in an organization
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @param {object} options The update options
     * @param {string[]} options.roles The roles to assign
     * @param {Record<string, string>} options.metadata Optional metadata
     * @returns {Promise<UpdateMembershipResponse>} The response with updated user
     */
    updateMembership(organizationId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (organizationId, userId, options = {}) {
            var _a;
            const membership = new users_pb_1.UpdateMembership({
                roles: ((_a = options.roles) === null || _a === void 0 ? void 0 : _a.map(role => ({ name: role }))) || [],
                metadata: options.metadata || {}
            });
            return this.coreClient.connectExec(this.client.updateMembership, {
                organizationId,
                identities: {
                    case: 'id',
                    value: userId
                },
                membership
            });
        });
    }
    /**
     * List users in an organization with pagination
     * @param {string} organizationId The organization id
     * @param {object} options The pagination options
     * @param {number} options.pageSize The page size
     * @param {string} options.pageToken The page token
     * @returns {Promise<ListOrganizationUsersResponse>} The list of users in the organization
     */
    listOrganizationUsers(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listOrganizationUsers, {
                organizationId,
                pageSize: options === null || options === void 0 ? void 0 : options.pageSize,
                pageToken: options === null || options === void 0 ? void 0 : options.pageToken
            });
        });
    }
    /**
     * Resend an invitation to a user
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<ResendInviteResponse>} The response with the invite
     */
    resendInvite(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId) {
                throw new Error('organizationId is required');
            }
            if (!userId) {
                throw new Error('userId is required');
            }
            const request = new users_pb_1.ResendInviteRequest({
                organizationId,
                id: userId
            });
            return this.coreClient.connectExec(this.client.resendInvite, request);
        });
    }
}
exports.default = UserClient;
//# sourceMappingURL=user.js.map