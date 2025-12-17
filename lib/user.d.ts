/**
 * Client for managing users and their organization memberships.
 *
 * This client provides comprehensive user management capabilities including creating users,
 * managing their memberships across organizations, updating user profiles, and handling
 * invitation emails. Users can belong to multiple organizations with different roles.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const userClient = scalekitClient.user;
 *
 * @see {@link https://docs.scalekit.com/apis/user | User API Documentation}
 */
import { Empty } from '@bufbuild/protobuf';
import GrpcConnect from './connect';
import CoreClient from './core';
import { CreateUserAndMembershipResponse, GetUserResponse, ListUsersResponse, UpdateUserResponse, CreateMembershipResponse, UpdateMembershipResponse, ListOrganizationUsersResponse, ResendInviteResponse } from './pkg/grpc/scalekit/v1/users/users_pb';
import { CreateUserRequest, UpdateUserRequest as UpdateUserRequestType } from './types/user';
export default class UserClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
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
    createUserAndMembership(organizationId: string, options: CreateUserRequest): Promise<CreateUserAndMembershipResponse>;
    /**
     * Get a user by id
     * @param {string} userId The user id
     * @returns {Promise<GetUserResponse>} The user
     */
    getUser(userId: string): Promise<GetUserResponse>;
    /**
     * List users with pagination
     * @param {object} options The pagination options
     * @param {number} options.pageSize The page size
     * @param {string} options.pageToken The page token
     * @returns {Promise<ListUsersResponse>} The list of users
     */
    listUsers(options?: {
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListUsersResponse>;
    /**
     * Update a user
     * @param {string} userId The user id
     * @param {UpdateUserRequestType} options The update options
     * @returns {Promise<UpdateUserResponse>} The updated user
     */
    updateUser(userId: string, options: UpdateUserRequestType): Promise<UpdateUserResponse>;
    /**
     * Delete a user
     * @param {string} userId The user id
     * @returns {Promise<Empty>} Empty response
     */
    deleteUser(userId: string): Promise<Empty>;
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
    createMembership(organizationId: string, userId: string, options?: {
        roles?: string[];
        metadata?: Record<string, string>;
        sendInvitationEmail?: boolean;
    }): Promise<CreateMembershipResponse>;
    /**
     * Delete a user's membership from an organization
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<Empty>} Empty response
     */
    deleteMembership(organizationId: string, userId: string): Promise<Empty>;
    /**
     * Update a user's membership in an organization
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @param {object} options The update options
     * @param {string[]} options.roles The roles to assign
     * @param {Record<string, string>} options.metadata Optional metadata
     * @returns {Promise<UpdateMembershipResponse>} The response with updated user
     */
    updateMembership(organizationId: string, userId: string, options?: {
        roles?: string[];
        metadata?: Record<string, string>;
    }): Promise<UpdateMembershipResponse>;
    /**
     * List users in an organization with pagination
     * @param {string} organizationId The organization id
     * @param {object} options The pagination options
     * @param {number} options.pageSize The page size
     * @param {string} options.pageToken The page token
     * @returns {Promise<ListOrganizationUsersResponse>} The list of users in the organization
     */
    listOrganizationUsers(organizationId: string, options?: {
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListOrganizationUsersResponse>;
    /**
     * Resend an invitation to a user
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<ResendInviteResponse>} The response with the invite
     */
    resendInvite(organizationId: string, userId: string): Promise<ResendInviteResponse>;
}
