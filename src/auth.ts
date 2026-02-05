import type { JsonObject } from "@bufbuild/protobuf";
import { create } from "@bufbuild/protobuf";
import type { MessageShape } from "@bufbuild/protobuf";
import { EmptySchema } from "@bufbuild/protobuf/wkt";
import CoreClient from "./core";
import type { Client } from "@connectrpc/connect";
import GrpcConnect from "./connect";
import {
  AuthService,
  UpdateLoginUserDetailsRequestSchema,
  UserSchema,
  type User,
} from "./pkg/grpc/scalekit/v1/auth/auth_pb";

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
   * @returns {Promise<MessageShape<EmptySchema>>} Empty response on successful update
   *
   * @throws {Error} When connectionId is missing or invalid
   * @throws {Error} When loginRequestId is missing or invalid
   * @throws {Error} When user object is invalid
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
  ): Promise<MessageShape<typeof EmptySchema>> {
    if (!connectionId || typeof connectionId !== "string") {
      throw new Error("connectionId must be a non-empty string");
    }

    if (!loginRequestId || typeof loginRequestId !== "string") {
      throw new Error("loginRequestId must be a non-empty string");
    }

    if (!user || typeof user !== "object") {
      throw new Error("user must be a valid object");
    }

    const userMessage = create(UserSchema, user as Parameters<typeof create<typeof UserSchema>>[1]);

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
}
