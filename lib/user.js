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
     * @see {@link https://docs.scalekit.com/apis/#tag/users | Create User API}
     * @see {@link createMembership} - Add existing user to another organization
     * @see {@link resendInvite} - Resend invitation email to a user
     */
    createUserAndMembership(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId) {
                throw new Error("organizationId is required");
            }
            if (!options.email) {
                throw new Error("email is required");
            }
            const user = new users_pb_1.CreateUser({
                email: options.email,
                userProfile: options.userProfile
                    ? new users_pb_1.CreateUserProfile({
                        firstName: options.userProfile.firstName,
                        lastName: options.userProfile.lastName,
                    })
                    : undefined,
                metadata: options.metadata,
            });
            const request = {
                organizationId,
                user,
            };
            if (options.sendInvitationEmail !== undefined) {
                request.sendInvitationEmail = options.sendInvitationEmail;
            }
            const response = yield this.coreClient.connectExec(this.client.createUserAndMembership, request);
            if (!response.user) {
                throw new Error("Failed to create user");
            }
            return response;
        });
    }
    /**
     * Retrieves comprehensive details about a specific user including their profile and memberships.
     *
     * Use this method to fetch complete user information including their organization memberships,
     * roles, profile details, and custom metadata. This is useful for displaying user profiles,
     * verifying user access, or checking membership status across organizations.
     *
     * @param {string} userId - The Scalekit-generated user identifier (format: "usr_...")
     *
     * @returns {Promise<GetUserResponse>} Response containing:
     *   - user: Complete user object with:
     *     - id: Scalekit's unique user identifier
     *     - email: User's email address
     *     - userProfile: Profile information (firstName, lastName)
     *     - memberships: Array of organization memberships with roles
     *     - metadata: Custom metadata key-value pairs
     *     - createTime: When the user was created
     *     - updateTime: When the user was last updated
     *
     * @throws {Error} If the user is not found or access is denied
     *
     * @example
     * // Get user details
     * const response = await scalekitClient.user.getUser('usr_123456');
     * const user = response.user;
     *
     * console.log('User:', user.email);
     * console.log('Name:', user.userProfile?.firstName, user.userProfile?.lastName);
     * console.log('Organizations:', user.memberships?.length);
     *
     * @example
     * // Check user's organization memberships
     * const response = await scalekitClient.user.getUser(userId);
     * const userOrgs = response.user.memberships?.map(m => m.organizationId) || [];
     *
     * if (userOrgs.includes('org_12345')) {
     *   console.log('User is a member of this organization');
     * }
     *
     * @example
     * // Display user profile in application
     * app.get('/api/profile', async (req, res) => {
     *   const userId = req.user.id;
     *
     *   try {
     *     const response = await scalekitClient.user.getUser(userId);
     *     res.json({
     *       email: response.user.email,
     *       profile: response.user.userProfile,
     *       organizations: response.user.memberships
     *     });
     *   } catch (error) {
     *     res.status(404).json({ error: 'User not found' });
     *   }
     * });
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/users | Get User API}
     * @see {@link listUsers} - List all users across the environment
     * @see {@link listOrganizationUsers} - List users in a specific organization
     */
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getUser, {
                identities: {
                    case: "id",
                    value: userId,
                },
            });
        });
    }
    /**
     * Retrieves a paginated list of all users across your Scalekit environment.
     *
     * This method returns all users in your environment regardless of organization membership.
     * It's useful for administrative oversight, auditing, user management interfaces, and
     * searching across all users. Use pagination to efficiently handle large user bases.
     *
     * @param {object} [options] - Optional pagination parameters
     * @param {number} [options.pageSize] - Number of users to return per page (valid range: 10-100, default: 10)
     * @param {string} [options.pageToken] - Token for retrieving the next page of results.
     *                                       Obtained from the previous response's nextPageToken.
     *
     * @returns {Promise<ListUsersResponse>} Response containing:
     *   - users: Array of user objects with profiles and membership details
     *   - nextPageToken: Token for fetching the next page (empty if no more pages)
     *   - totalSize: Total number of users in the environment
     *
     * @example
     * // List first page of users
     * const response = await scalekitClient.user.listUsers({
     *   pageSize: 20
     * });
     *
     * console.log('Users:', response.users.length);
     * console.log('Total users:', response.totalSize);
     *
     * @example
     * // Paginate through all users
     * let pageToken = undefined;
     * let allUsers = [];
     *
     * do {
     *   const response = await scalekitClient.user.listUsers({
     *     pageSize: 50,
     *     pageToken
     *   });
     *
     *   allUsers.push(...response.users);
     *   pageToken = response.nextPageToken;
     * } while (pageToken);
     *
     * console.log('Fetched all users:', allUsers.length);
     *
     * @example
     * // Build user management dashboard
     * app.get('/api/admin/users', async (req, res) => {
     *   const { pageSize = 25, pageToken } = req.query;
     *
     *   try {
     *     const response = await scalekitClient.user.listUsers({
     *       pageSize: parseInt(pageSize),
     *       pageToken
     *     });
     *
     *     res.json({
     *       users: response.users,
     *       nextPageToken: response.nextPageToken,
     *       total: response.totalSize
     *     });
     *   } catch (error) {
     *     res.status(500).json({ error: 'Failed to fetch users' });
     *   }
     * });
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/users | List Users API}
     * @see {@link listOrganizationUsers} - List users in a specific organization
     * @see {@link getUser} - Get details of a specific user
     */
    listUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listUsers, {
                pageSize: options === null || options === void 0 ? void 0 : options.pageSize,
                pageToken: options === null || options === void 0 ? void 0 : options.pageToken,
            });
        });
    }
    /**
     * Updates a user's profile information and custom metadata.
     *
     * Use this method to modify user profile details such as name or to update custom metadata
     * associated with the user. Note that the user's email address and user ID cannot be changed.
     * Only the fields you specify in the update object will be modified; all other fields remain unchanged.
     *
     * @param {string} userId - The Scalekit user identifier (format: "usr_...")
     * @param {UpdateUserRequestType} options - Object containing fields to update:
     *   - userProfile?: Profile information to update
     *     - firstName?: User's first name
     *     - lastName?: User's last name
     *   - metadata?: Custom key-value pairs for storing additional data
     *
     * @returns {Promise<UpdateUserResponse>} Response containing:
     *   - user: The updated user object with all current values
     *
     * @throws {Error} If the user is not found or update fails
     *
     * @example
     * // Update user's name
     * const response = await scalekitClient.user.updateUser('usr_123456', {
     *   userProfile: {
     *     firstName: 'John',
     *     lastName: 'Smith'
     *   }
     * });
     *
     * console.log('Updated user:', response.user.userProfile);
     *
     * @example
     * // Update user metadata only
     * await scalekitClient.user.updateUser('usr_123456', {
     *   metadata: {
     *     department: 'Engineering',
     *     title: 'Senior Developer',
     *     employeeId: 'EMP-12345'
     *   }
     * });
     *
     * @example
     * // Update both profile and metadata
     * const response = await scalekitClient.user.updateUser('usr_123456', {
     *   userProfile: {
     *     firstName: 'Jane',
     *     lastName: 'Doe'
     *   },
     *   metadata: {
     *     phoneNumber: '+1-555-0123',
     *     timezone: 'America/New_York'
     *   }
     * });
     *
     * @example
     * // Update user profile via API endpoint
     * app.patch('/api/users/:userId', async (req, res) => {
     *   const { userId } = req.params;
     *   const { firstName, lastName, metadata } = req.body;
     *
     *   try {
     *     const response = await scalekitClient.user.updateUser(userId, {
     *       userProfile: { firstName, lastName },
     *       metadata
     *     });
     *     res.json({ user: response.user });
     *   } catch (error) {
     *     res.status(500).json({ error: 'Failed to update user' });
     *   }
     * });
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/users | Update User API}
     * @see {@link getUser} - Retrieve current user details
     * @see {@link createUserAndMembership} - Create a new user
     */
    updateUser(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateUser = new users_pb_1.UpdateUser({
                userProfile: options.userProfile
                    ? {
                        firstName: options.userProfile.firstName,
                        lastName: options.userProfile.lastName,
                    }
                    : undefined,
                metadata: options.metadata,
            });
            return this.coreClient.connectExec(this.client.updateUser, {
                identities: {
                    case: "id",
                    value: userId,
                },
                user: updateUser,
            });
        });
    }
    /**
     * Permanently deletes a user from your Scalekit environment.
     *
     * This operation removes the user's profile, all organization memberships, and related data
     * across all organizations. This action is irreversible and cannot be undone. Use with extreme
     * caution, especially in production environments. Consider deactivating users or removing specific
     * memberships instead of full deletion for compliance and audit purposes.
     *
     * @param {string} userId - The Scalekit user identifier to delete (format: "usr_...")
     *
     * @returns {Promise<Empty>} Empty response on successful deletion
     *
     * @throws {Error} If the user is not found or deletion fails
     *
     * @example
     * // Delete a user
     * await scalekitClient.user.deleteUser('usr_123456');
     * console.log('User deleted successfully');
     *
     * @example
     * // Delete user with confirmation flow
     * const confirmDelete = await askUserConfirmation(
     *   'Are you sure you want to permanently delete this user? This action cannot be undone.'
     * );
     *
     * if (confirmDelete) {
     *   try {
     *     await scalekitClient.user.deleteUser(userId);
     *     console.log('User permanently deleted');
     *   } catch (error) {
     *     console.error('Failed to delete user:', error);
     *   }
     * }
     *
     *
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/users | Delete User API}
     * @see {@link deleteMembership} - Remove user from a specific organization only
     * @see {@link getUser} - Check if user exists before deletion
     */
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteUser, {
                identities: {
                    case: "id",
                    value: userId,
                },
            });
        });
    }
    /**
     * Adds an existing user as a member of a new organization with specified roles.
     *
     * Use this method to grant organization access to users who already have accounts in your
     * Scalekit environment. This is useful for adding users to additional organizations, managing
     * multi-tenant access, or onboarding existing users to new teams. Optionally sends an invitation
     * email to notify the user of their new organization access.
     *
     * @param {string} organizationId - The organization ID to add the user to (format: "org_...")
     * @param {string} userId - The user ID to add as a member (format: "usr_...")
     * @param {object} [options={}] - Optional membership configuration
     * @param {string[]} [options.roles] - Array of role names to assign to the user
     *                                     (e.g., ['admin', 'editor', 'viewer'])
     * @param {Record<string, string>} [options.metadata] - Custom metadata key-value pairs
     *                                                       for this specific membership
     * @param {boolean} [options.sendInvitationEmail=true] - Whether to send invitation email
     *                                                        notifying the user of new access
     *
     * @returns {Promise<CreateMembershipResponse>} Response containing:
     *   - user: The updated user object including the new membership details
     *
     * @throws {Error} When the user or organization is not found
     * @throws {Error} When the user is already a member of the organization
     *
     * @example
     * // Add user to organization with admin role
     * const response = await scalekitClient.user.createMembership(
     *   'org_123456',
     *   'usr_789012',
     *   {
     *     roles: ['admin'],
     *     sendInvitationEmail: true
     *   }
     * );
     *
     * console.log('Membership created:', response.user.memberships);
     *
     * @example
     * // Add user with multiple roles and metadata
     * await scalekitClient.user.createMembership(
     *   'org_123456',
     *   'usr_789012',
     *   {
     *     roles: ['member', 'billing_admin'],
     *     metadata: {
     *       department: 'Finance',
     *       accessLevel: 'full'
     *     },
     *     sendInvitationEmail: true
     *   }
     * );
     *
     * @example
     * // Add user to organization without sending email
     * await scalekitClient.user.createMembership(
     *   'org_123456',
     *   'usr_789012',
     *   { sendInvitationEmail: false }
     * );
  
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/users | Create Membership API}
     * @see {@link createUserAndMembership} - Create new user with initial membership
     * @see {@link updateMembership} - Modify existing membership roles
     * @see {@link deleteMembership} - Remove user from organization
     */
    createMembership(organizationId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (organizationId, userId, options = {}) {
            var _a;
            const membership = new users_pb_1.CreateMembership({
                roles: ((_a = options.roles) === null || _a === void 0 ? void 0 : _a.map((role) => ({ name: role }))) || [],
                metadata: options.metadata || {},
            });
            const request = {
                organizationId,
                identities: {
                    case: "id",
                    value: userId,
                },
                membership,
            };
            if (options.sendInvitationEmail !== undefined) {
                request.sendInvitationEmail = options.sendInvitationEmail;
            }
            return this.coreClient.connectExec(this.client.createMembership, request);
        });
    }
    /**
     * Removes a user's membership from a specific organization.
     *
     * This operation revokes the user's access to the specified organization while keeping their
     * user account intact. The user remains in the system and can still access other organizations
     * they're a member of. This is the recommended approach when you want to remove access to a
     * specific organization without deleting the entire user account. This action is irreversible.
     *
     * @param {string} organizationId - The organization ID to remove the user from (format: "org_...")
     * @param {string} userId - The user ID to remove (format: "usr_...")
     *
     * @returns {Promise<Empty>} Empty response on successful removal
     *
     * @throws {Error} If the user or organization is not found
     * @throws {Error} If the membership doesn't exist
     *
     * @example
     * // Remove user from organization
     * await scalekitClient.user.deleteMembership('org_123456', 'usr_789012');
     * console.log('User removed from organization');
     *
     * @example
     * // Remove user with confirmation
     * const confirmRemoval = await askUserConfirmation(
     *   'Remove this user from the organization?'
     * );
     *
     * if (confirmRemoval) {
     *   try {
     *     await scalekitClient.user.deleteMembership(organizationId, userId);
     *     console.log('User access revoked');
     *   } catch (error) {
     *     console.error('Failed to remove user:', error);
     *   }
     * }
     *
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/users | Delete Membership API}
     * @see {@link deleteUser} - Permanently delete user from all organizations
     * @see {@link createMembership} - Add user to an organization
     * @see {@link updateMembership} - Modify user's roles in organization
     */
    deleteMembership(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteMembership, {
                organizationId,
                identities: {
                    case: "id",
                    value: userId,
                },
            });
        });
    }
    /**
     * Updates a user's roles and metadata within a specific organization.
     *
     * Use this method to modify a user's permissions by changing their assigned roles or to
     * update membership-specific metadata. This allows you to adjust user access levels,
     * promote/demote users, or track organization-specific information without affecting
     * the user's memberships in other organizations.
     *
     * @param {string} organizationId - The organization ID where the membership exists (format: "org_...")
     * @param {string} userId - The user ID whose membership to update (format: "usr_...")
     * @param {object} [options={}] - Fields to update
     * @param {string[]} [options.roles] - Array of role names to assign (replaces existing roles)
     *                                     (e.g., ['admin'], ['member', 'billing'])
     * @param {Record<string, string>} [options.metadata] - Custom metadata key-value pairs
     *                                                       specific to this membership
     *
     * @returns {Promise<UpdateMembershipResponse>} Response containing:
     *   - user: The updated user object with modified membership details
     *
     * @throws {Error} If the user, organization, or membership is not found
     *
     * @example
     * // Promote user to admin
     * const response = await scalekitClient.user.updateMembership(
     *   'org_123456',
     *   'usr_789012',
     *   { roles: ['admin'] }
     * );
     *
     * console.log('User promoted:', response.user.memberships);
     *
     * @example
     * // Assign multiple roles
     * await scalekitClient.user.updateMembership(
     *   'org_123456',
     *   'usr_789012',
     *   { roles: ['member', 'billing_admin', 'support'] }
     * );
     *
     * @example
     * // Update membership metadata
     * await scalekitClient.user.updateMembership(
     *   'org_123456',
     *   'usr_789012',
     *   {
     *     metadata: {
     *       department: 'Engineering',
     *       team: 'Backend',
     *       startDate: '2025-01-01'
     *     }
     *   }
     * );
     *
     * @example
     * // Update both roles and metadata
     * await scalekitClient.user.updateMembership(
     *   'org_123456',
     *   'usr_789012',
     *   {
     *     roles: ['team_lead', 'developer'],
     *     metadata: {
     *       level: 'senior',
     *       permissions: 'full'
     *     }
     *   }
     * );
     *
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/users | Update Membership API}
     * @see {@link createMembership} - Add user to organization
     * @see {@link deleteMembership} - Remove user from organization
     * @see {@link getUser} - View current user roles and memberships
     */
    updateMembership(organizationId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (organizationId, userId, options = {}) {
            var _a;
            const membership = new users_pb_1.UpdateMembership({
                roles: ((_a = options.roles) === null || _a === void 0 ? void 0 : _a.map((role) => ({ name: role }))) || [],
                metadata: options.metadata || {},
            });
            return this.coreClient.connectExec(this.client.updateMembership, {
                organizationId,
                identities: {
                    case: "id",
                    value: userId,
                },
                membership,
            });
        });
    }
    /**
     * Retrieves a paginated list of all users who are members of a specific organization.
     *
     * This method returns all users with access to the specified organization, including their
     * roles, membership details, and profiles. This is useful for displaying team member lists,
     * managing organization access, or building user management interfaces. Use pagination to
     * efficiently handle organizations with large member counts.
     *
     * @param {string} organizationId - The organization ID to list users from (format: "org_...")
     * @param {object} [options] - Optional pagination parameters
     * @param {number} [options.pageSize] - Number of users to return per page (valid range: 1-100)
     * @param {string} [options.pageToken] - Token for retrieving the next page of results.
     *                                       Obtained from the previous response's nextPageToken.
     *
     * @returns {Promise<ListOrganizationUsersResponse>} Response containing:
     *   - users: Array of user objects with profiles, roles, and membership details
     *   - nextPageToken: Token for fetching the next page (empty if no more pages)
     *   - totalSize: Total number of users in the organization
     *
     * @throws {Error} If the organization is not found
     *
     * @example
     * // List first page of organization users
     * const response = await scalekitClient.user.listOrganizationUsers('org_123456', {
     *   pageSize: 25
     * });
     *
     * console.log('Organization users:', response.users.length);
     * console.log('Total members:', response.totalSize);
     *
     * @example
     * // Paginate through all organization members
     * let pageToken = undefined;
     * let allMembers = [];
     *
     * do {
     *   const response = await scalekitClient.user.listOrganizationUsers(
     *     'org_123456',
     *     { pageSize: 50, pageToken }
     *   );
     *
     *   allMembers.push(...response.users);
     *   pageToken = response.nextPageToken;
     * } while (pageToken);
     *
     * console.log('All organization members:', allMembers.length);
     *
     *
     * console.log('Organization admins:', admins.length);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/users | List Organization Users API}
     * @see {@link listUsers} - List all users across the environment
     * @see {@link getUser} - Get details of a specific user
     * @see {@link createMembership} - Add user to organization
     */
    listOrganizationUsers(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listOrganizationUsers, {
                organizationId,
                pageSize: options === null || options === void 0 ? void 0 : options.pageSize,
                pageToken: options === null || options === void 0 ? void 0 : options.pageToken,
            });
        });
    }
    /**
     * Resends an invitation email to a user for a specific organization.
     *
     * Use this method when a user hasn't received or has lost their invitation email. If the
     * original invitation is still valid, a reminder email will be sent. If the invitation has
     * expired, a new invitation with a secure magic link will be created and sent. This is useful
     * for helping users who need to complete their account setup or activate their organization access.
     *
     * @param {string} organizationId - The organization ID for which to resend the invite (format: "org_...")
     * @param {string} userId - The user ID who should receive the invite (format: "usr_...")
     *
     * @returns {Promise<ResendInviteResponse>} Response containing:
     *   - invite: The invitation details including status and expiration
     *
     * @throws {Error} When organizationId is missing or invalid
     * @throws {Error} When userId is missing or invalid
     * @throws {Error} When the user or organization is not found
     * @throws {Error} When the membership doesn't exist
     *
     * @example
     * // Resend invitation to a user
     * const response = await scalekitClient.user.resendInvite('org_123456', 'usr_789012');
     * console.log('Invitation resent:', response.invite);
     *
     * @example
     * // Resend invitation with error handling
     * try {
     *   await scalekitClient.user.resendInvite(organizationId, userId);
     *   console.log('Invitation email sent successfully');
     * } catch (error) {
     *   console.error('Failed to resend invitation:', error);
     * }
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/users | Resend Invite API}
     * @see {@link createUserAndMembership} - Create user with initial invitation
     * @see {@link createMembership} - Add user to organization with invitation option
     * @see {@link getUser} - Check user's invitation status
     */
    resendInvite(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId) {
                throw new Error("organizationId is required");
            }
            if (!userId) {
                throw new Error("userId is required");
            }
            const request = new users_pb_1.ResendInviteRequest({
                organizationId,
                id: userId,
            });
            return this.coreClient.connectExec(this.client.resendInvite, request);
        });
    }
}
exports.default = UserClient;
//# sourceMappingURL=user.js.map