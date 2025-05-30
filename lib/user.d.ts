import { Empty } from '@bufbuild/protobuf';
import GrpcConnect from './connect';
import CoreClient from './core';
import { CreateUserResponse, GetUserResponse, ListUserResponse, UpdateUserResponse, AddUserResponse } from './pkg/grpc/scalekit/v1/users/users_pb';
import { CreateUserRequest, UpdateUserRequest } from './types/user';
export default class UserClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Create a new user in an organization
     * @param {string} organizationId The organization id
     * @param {CreateUserRequest} options The user creation options
     * @returns {Promise<CreateUserResponse>} The created user
     */
    createUser(organizationId: string, options: CreateUserRequest): Promise<CreateUserResponse>;
    /**
     * Get a user by id
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<GetUserResponse>} The user
     */
    getUser(organizationId: string, userId: string): Promise<GetUserResponse>;
    /**
     * List users with pagination
     * @param {string} organizationId The organization id
     * @param {object} options The pagination options
     * @param {number} options.pageSize The page size
     * @param {string} options.pageToken The page token
     * @returns {Promise<ListUserResponse>} The list of users
     */
    listUsers(organizationId: string, options?: {
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListUserResponse>;
    /**
     * Update a user
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @param {UpdateUserRequest} options The update options
     * @returns {Promise<UpdateUserResponse>} The updated user
     */
    updateUser(organizationId: string, userId: string, options: UpdateUserRequest): Promise<UpdateUserResponse>;
    /**
     * Delete a user
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<Empty>} Empty response
     */
    deleteUser(organizationId: string, userId: string): Promise<Empty>;
    /**
     * Add a user to an organization
     * @param {string} organizationId The organization id
     * @param {string} userId The user id
     * @returns {Promise<AddUserResponse>} The response
     */
    addUserToOrganization(organizationId: string, userId: string): Promise<AddUserResponse>;
}
