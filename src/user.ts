import { Empty, PartialMessage } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { UserService } from './pkg/grpc/scalekit/v1/users/users_connect';
import { 
  CreateUserRequest as ProtoCreateUserRequest, 
  CreateUserResponse,
  DeleteUserRequest,
  GetUserRequest,
  GetUserResponse,
  ListUserRequest,
  ListUserResponse,
  UpdateUserRequest as ProtoUpdateUserRequest,
  UpdateUserResponse,
  AddUserRequest,
  AddUserResponse,
  User,
  UpdateUser 
} from './pkg/grpc/scalekit/v1/users/users_pb';
import { CreateUserRequest, UpdateUserRequest } from './types/user';

export default class UserClient {
  private client: PromiseClient<typeof UserService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(UserService);
  }

  /**
   * Create a new user in an organization
   * @param {string} organizationId The organization id
   * @param {CreateUserRequest} options The user creation options
   * @returns {Promise<CreateUserResponse>} The created user
   */
  async createUser(organizationId: string, options: CreateUserRequest): Promise<CreateUserResponse> {
    if (!organizationId) {
      throw new Error('organizationId is required');
    }
    if (!options.email) {
      throw new Error('email is required');
    }

    const user = new User({
      email: options.email,
      userProfile: {
        firstName: options.userProfile?.firstName,
        lastName: options.userProfile?.lastName
      },
      metadata: options.metadata
    });

    const response = await this.coreClient.connectExec(
      this.client.createUser,
      {
        organizationId,
        user
      }
    );
    
    if (!response.user) {
      throw new Error('Failed to create user');
    }
    
    return response;
  }

  /**
   * Get a user by id
   * @param {string} organizationId The organization id
   * @param {string} userId The user id
   * @returns {Promise<GetUserResponse>} The user
   */
  async getUser(organizationId: string, userId: string): Promise<GetUserResponse> {
    return this.coreClient.connectExec(
      this.client.getUser,
      {
        organizationId,
        identities: {
          case: 'id',
          value: userId
        }
      }
    );
  }

  /**
   * List users with pagination
   * @param {string} organizationId The organization id
   * @param {object} options The pagination options
   * @param {number} options.pageSize The page size
   * @param {string} options.pageToken The page token
   * @returns {Promise<ListUserResponse>} The list of users
   */
  async listUsers(organizationId: string, options?: {
    pageSize?: number,
    pageToken?: string
  }): Promise<ListUserResponse> {
    return this.coreClient.connectExec(
      this.client.listUsers,
      {
        organizationId,
        ...options
      }
    );
  }

  /**
   * Update a user
   * @param {string} organizationId The organization id
   * @param {string} userId The user id
   * @param {UpdateUserRequest} options The update options
   * @returns {Promise<UpdateUserResponse>} The updated user
   */
  async updateUser(organizationId: string, userId: string, options: UpdateUserRequest): Promise<UpdateUserResponse> {
    const updateUser = new UpdateUser({
      userProfile: {
        firstName: options.userProfile?.firstName,
        lastName: options.userProfile?.lastName
      },
      metadata: options.metadata
    });

    return this.coreClient.connectExec(
      this.client.updateUser,
      {
        organizationId,
        identities: {
          case: 'id',
          value: userId
        },
        user: updateUser
      }
    );
  }

  /**
   * Delete a user
   * @param {string} organizationId The organization id
   * @param {string} userId The user id
   * @returns {Promise<Empty>} Empty response
   */
  async deleteUser(organizationId: string, userId: string): Promise<Empty> {
    return this.coreClient.connectExec(
      this.client.deleteUser,
      {
        organizationId,
        identities: {
          case: 'id',
          value: userId
        }
      }
    );
  }

  /**
   * Add a user to an organization
   * @param {string} organizationId The organization id
   * @param {string} userId The user id
   * @returns {Promise<AddUserResponse>} The response
   */
  async addUserToOrganization(organizationId: string, userId: string): Promise<AddUserResponse> {
    return this.coreClient.connectExec(
      this.client.addUserToOrganization,
      {
        organizationId,
        identities: {
          case: 'id',
          value: userId
        }
      }
    );
  }
}