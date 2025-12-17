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