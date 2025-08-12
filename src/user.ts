import { Empty, PartialMessage } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { UserService } from './pkg/grpc/scalekit/v1/users/users_connect';
import { 
  CreateUserAndMembershipRequest,
  CreateUserAndMembershipResponse,
  DeleteUserRequest,
  GetUserRequest,
  GetUserResponse,
  ListUsersRequest,
  ListUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  User,
  UpdateUser,
  CreateUser,
  CreateUserProfile,
  CreateMembershipRequest,
  CreateMembershipResponse,
  DeleteMembershipRequest,
  UpdateMembershipRequest,
  UpdateMembershipResponse,
  ListOrganizationUsersRequest,
  ListOrganizationUsersResponse,
  CreateMembership,
  UpdateMembership,
  ResendInviteRequest,
  ResendInviteResponse
} from './pkg/grpc/scalekit/v1/users/users_pb';
import { CreateUserRequest, UpdateUserRequest as UpdateUserRequestType } from './types/user';

export default class UserClient {
  private client: PromiseClient<typeof UserService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(UserService);
  }

  /**
   * Create a new user and add them to an organization
   * @param {string} organizationId The organization id
   * @param {CreateUserRequest} options The user creation options
   * @returns {Promise<CreateUserAndMembershipResponse>} The created user
   */
  async createUserAndMembership(organizationId: string, options: CreateUserRequest): Promise<CreateUserAndMembershipResponse> {
    if (!organizationId) {
      throw new Error('organizationId is required');
    }
    if (!options.email) {
      throw new Error('email is required');
    }

    const user = new CreateUser({
      email: options.email,
      userProfile: options.userProfile ? new CreateUserProfile({
        firstName: options.userProfile.firstName,
        lastName: options.userProfile.lastName
      }) : undefined,
      metadata: options.metadata
    });

    const request: PartialMessage<CreateUserAndMembershipRequest> = {
      organizationId,
      user
    };

    if (options.sendInvitationEmail !== undefined) {
      request.sendInvitationEmail = options.sendInvitationEmail;
    }

    const response = await this.coreClient.connectExec(
      this.client.createUserAndMembership,
      request
    );
    
    if (!response.user) {
      throw new Error('Failed to create user');
    }
    
    return response;
  }

  /**
   * Get a user by id
   * @param {string} userId The user id
   * @returns {Promise<GetUserResponse>} The user
   */
  async getUser(userId: string): Promise<GetUserResponse> {
    return this.coreClient.connectExec(
      this.client.getUser,
      {
        identities: {
          case: 'id',
          value: userId
        }
      }
    );
  }

  /**
   * List users with pagination
   * @param {object} options The pagination options
   * @param {number} options.pageSize The page size
   * @param {string} options.pageToken The page token
   * @returns {Promise<ListUsersResponse>} The list of users
   */
  async listUsers(options?: {
    pageSize?: number,
    pageToken?: string
  }): Promise<ListUsersResponse> {
    return this.coreClient.connectExec(
      this.client.listUsers,
      {
        pageSize: options?.pageSize,
        pageToken: options?.pageToken
      }
    );
  }

  /**
   * Update a user
   * @param {string} userId The user id
   * @param {UpdateUserRequestType} options The update options
   * @returns {Promise<UpdateUserResponse>} The updated user
   */
  async updateUser(userId: string, options: UpdateUserRequestType): Promise<UpdateUserResponse> {
    const updateUser = new UpdateUser({
      userProfile: options.userProfile ? {
        firstName: options.userProfile.firstName,
        lastName: options.userProfile.lastName
      } : undefined,
      metadata: options.metadata
    });

    return this.coreClient.connectExec(
      this.client.updateUser,
      {
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
   * @param {string} userId The user id
   * @returns {Promise<Empty>} Empty response
   */
  async deleteUser(userId: string): Promise<Empty> {
    return this.coreClient.connectExec(
      this.client.deleteUser,
      {
        identities: {
          case: 'id',
          value: userId
        }
      }
    );
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
  async createMembership(
    organizationId: string,
    userId: string,
    options: {
      roles?: string[],
      metadata?: Record<string, string>,
      sendInvitationEmail?: boolean
    } = {}
  ): Promise<CreateMembershipResponse> {
    const membership = new CreateMembership({
      roles: options.roles?.map(role => ({ name: role })) || [],
      metadata: options.metadata || {}
    });

    const request: PartialMessage<CreateMembershipRequest> = {
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

    return this.coreClient.connectExec(
      this.client.createMembership,
      request
    );
  }

  /**
   * Delete a user's membership from an organization
   * @param {string} organizationId The organization id
   * @param {string} userId The user id
   * @returns {Promise<Empty>} Empty response
   */
  async deleteMembership(
    organizationId: string,
    userId: string
  ): Promise<Empty> {
    return this.coreClient.connectExec(
      this.client.deleteMembership,
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
   * Update a user's membership in an organization
   * @param {string} organizationId The organization id
   * @param {string} userId The user id
   * @param {object} options The update options
   * @param {string[]} options.roles The roles to assign
   * @param {Record<string, string>} options.metadata Optional metadata
   * @returns {Promise<UpdateMembershipResponse>} The response with updated user
   */
  async updateMembership(
    organizationId: string,
    userId: string,
    options: {
      roles?: string[],
      metadata?: Record<string, string>
    } = {}
  ): Promise<UpdateMembershipResponse> {
    const membership = new UpdateMembership({
      roles: options.roles?.map(role => ({ name: role })) || [],
      metadata: options.metadata || {}
    });

    return this.coreClient.connectExec(
      this.client.updateMembership,
      {
        organizationId,
        identities: {
          case: 'id',
          value: userId
        },
        membership
      }
    );
  }

  /**
   * List users in an organization with pagination
   * @param {string} organizationId The organization id
   * @param {object} options The pagination options
   * @param {number} options.pageSize The page size
   * @param {string} options.pageToken The page token
   * @returns {Promise<ListOrganizationUsersResponse>} The list of users in the organization
   */
  async listOrganizationUsers(
    organizationId: string,
    options?: {
      pageSize?: number,
      pageToken?: string
    }
  ): Promise<ListOrganizationUsersResponse> {
    return this.coreClient.connectExec(
      this.client.listOrganizationUsers,
      {
        organizationId,
        pageSize: options?.pageSize,
        pageToken: options?.pageToken
      }
    );
  }

  /**
   * Resend an invitation to a user
   * @param {string} organizationId The organization id
   * @param {string} userId The user id
   * @returns {Promise<ResendInviteResponse>} The response with the invite
   */
  async resendInvite(organizationId: string, userId: string): Promise<ResendInviteResponse> {
    if (!organizationId) {
      throw new Error('organizationId is required');
    }
    if (!userId) {
      throw new Error('userId is required');
    }

    const request = new ResendInviteRequest({
      organizationId,
      id: userId
    });

    return this.coreClient.connectExec(
      this.client.resendInvite,
      request
    );
  }
}