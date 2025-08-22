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
     * Create a new user and add them to an organization
     * @param {string} organizationId The organization id
     * @param {CreateUserRequest} options The user creation options
     * @returns {Promise<CreateUserAndMembershipResponse>} The created user
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
