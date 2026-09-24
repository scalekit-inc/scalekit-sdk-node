import type { JsonObject } from '@bufbuild/protobuf';
import { create } from '@bufbuild/protobuf';
import CoreClient from './core';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import {
  AuthService,
  GetLoginRequestDetailsRequestSchema,
  UpdateLoginUserDetailsRequestSchema,
  UserSchema,
  type AuthRequestClient,
  type AuthRequestDetails,
  type AuthRequestResource,
  type GetLoginRequestDetailsResponse,
  type User,
  type UpdateLoginUserDetailsResponse,
} from './pkg/grpc/scalekit/v1/auth/auth_pb';

/** User input for updateLoginUserDetails; customAttributes is a plain object (proto Struct → JsonObject in v2). */
type UserInput = Partial<User> & {
  customAttributes?: JsonObject;
};

/**
 * If you are using Auth for MCP solution of Scalekit in "Bring your own Auth" mode, this client helps updating Scalekit with the currently logged in user details for the ongoing authentication request.
 *
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const authClient = scalekitClient.auth;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/api%20auth | Authentication API Documentation}
 */
export default class AuthClient {
  private readonly client: Client<typeof AuthService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(AuthService);
  }

  /**
   * Updates user details for an ongoing authentication request.
   *
   *
   * @param {string} connectionId - The SSO connection ID being used for authentication
   * @param {string} loginRequestId - The unique login request identifier from the auth flow
   * @param {UserInput} user - User details to update or associate with the login request
   * @param {string} [user.email] - User's email address
   * @param {string} [user.sub] - Unique user identifier (subject)
   *
   * @returns {Promise<UpdateLoginUserDetailsResponse>} Response containing the auth request ID,
   *   which can be used to look up the authentication journey of the user using auth logs
   *
   * @throws {Error} When connectionId is missing or invalid
   * @throws {Error} When loginRequestId is missing or invalid
   * @throws {Error} When user object is invalid
   * @throws {ScalekitServerException} If a network or server error occurs.
   *
   * @example
   * await scalekitClient.auth.updateLoginUserDetails(
   *   'conn_abc123',
   *   'login_xyz789',
   *   {
   *     email: 'john.doe@company.com',
   *     sub: 'unique_user_id_456',
   *   }
   * );
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/api%20auth | Update Login User Details API}
   */
  async updateLoginUserDetails(
    connectionId: string,
    loginRequestId: string,
    user: UserInput
  ): Promise<UpdateLoginUserDetailsResponse> {
    if (!connectionId || typeof connectionId !== 'string') {
      throw new Error('connectionId must be a non-empty string');
    }

    if (!loginRequestId || typeof loginRequestId !== 'string') {
      throw new Error('loginRequestId must be a non-empty string');
    }

    if (!user || typeof user !== 'object') {
      throw new Error('user must be a valid object');
    }

    const userMessage = create(
      UserSchema,
      user as Parameters<typeof create<typeof UserSchema>>[1]
    );

    const request = create(UpdateLoginUserDetailsRequestSchema, {
      connectionId,
      loginRequestId,
      user: userMessage,
    });

    return this.coreClient.connectExec(
      this.client.updateLoginUserDetails,
      request
    );
  }

  /**
   * Resolves a login request ID into the authorization request it was issued for,
   * the OAuth client that started it, and the resource being accessed.
   *
   * Call this when your own authentication service receives a login request ID on
   * the authorize redirect and needs to know which client is asking, which scopes
   * were requested, and which resource is being accessed.
   *
   * The login request ID is ephemeral: it is created when the authorization request
   * is handed off to your authentication service and lives for 15 minutes. Once it
   * expires the authorization request has expired too, and this call fails from then on.
   *
   * @param {string} loginRequestId - The login request identifier from the authorize
   *   redirect, in `lri_` format
   *
   * @returns {Promise<GetLoginRequestDetailsResponse>} The authorization request and its
   *   requested scopes, the client that started it, and the resource it targets.
   *   `resource` is absent when the authorization request is not scoped to a resource.
   *
   * @throws {Error} When loginRequestId is missing or invalid
   * @throws {ScalekitServerException} If a network or server error occurs, including when
   *   the login request ID is unknown, expired, or belongs to another environment — all of
   *   which return the same error, so it cannot be used to probe whether an ID exists.
   *
   * @example
   * const details = await scalekitClient.auth.getLoginRequestDetails('lri_73415099636808061');
   *
   * console.log(details.authRequest?.scopes);   // scopes the client requested
   * console.log(details.client?.clientName);    // who is asking
   * console.log(details.client?.clientId);      // CIMD metadata URL for a CIMD client, otherwise m2m_xxx
   * console.log(details.client?.skClientId);    // always m2m_xxx, for every client
   * console.log(details.resource?.name);        // may be undefined
   *
   * @see {@link https://docs.scalekit.com/mcp/auth-methods/custom-auth/ | Bring Your Own Auth}
   */
  async getLoginRequestDetails(
    loginRequestId: string
  ): Promise<GetLoginRequestDetailsResponse> {
    if (!loginRequestId || typeof loginRequestId !== 'string') {
      throw new Error('loginRequestId must be a non-empty string');
    }

    const request = create(GetLoginRequestDetailsRequestSchema, {
      loginRequestId,
    });

    return this.coreClient.connectExec(
      this.client.getLoginRequestDetails,
      request
    );
  }
}

export type {
  AuthRequestClient,
  AuthRequestDetails,
  AuthRequestResource,
  GetLoginRequestDetailsResponse,
};
