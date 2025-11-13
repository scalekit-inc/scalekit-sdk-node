import { Empty, PartialMessage, Struct, JsonValue } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import CoreClient from './core';
import GrpcConnect from './connect';
import { AuthService } from './pkg/grpc/scalekit/v1/auth/auth_connect';
import { UpdateLoginUserDetailsRequest, User } from './pkg/grpc/scalekit/v1/auth/auth_pb';

type UserInput = PartialMessage<User> & {
  customAttributes?: Record<string, unknown>;
};

export default class AuthClient {
  private readonly client: PromiseClient<typeof AuthService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(AuthService);
  }

  /**
   * Update user details for an ongoing login request.
   * @param {string} connectionId The connection ID used for authentication.
   * @param {string} loginRequestId The login request identifier issued during auth initiation.
   * @param {UserInput} user Optional user details to associate with the login request.
   * @returns {Promise<Empty>} Empty response.
   */
  async updateLoginUserDetails(
    connectionId: string,
    loginRequestId: string,
    user?: UserInput
  ): Promise<Empty> {
    if (!connectionId || typeof connectionId !== 'string') {
      throw new Error('connectionId must be a non-empty string');
    }

    if (!loginRequestId || typeof loginRequestId !== 'string') {
      throw new Error('loginRequestId must be a non-empty string');
    }

    let userMessage: User | undefined;

    if (user) {
      const { customAttributes, ...rest } = user;
      userMessage = new User(rest as PartialMessage<User>);

      if (customAttributes !== undefined) {
        userMessage.customAttributes = Struct.fromJson(customAttributes as JsonValue);
      }
    }

    const request = new UpdateLoginUserDetailsRequest({
      connectionId,
      loginRequestId,
      user: userMessage
    });

    return this.coreClient.connectExec(
      this.client.updateLoginUserDetails,
      request
    );
  }
}

