import { PartialMessage } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { SessionService } from './pkg/grpc/scalekit/v1/sessions/sessions_connect';
import { 
  SessionDetailsRequest,
  SessionDetails,
  UserSessionDetailsRequest,
  UserSessionDetails,
  RevokeSessionRequest,
  RevokeSessionResponse
} from './pkg/grpc/scalekit/v1/sessions/sessions_pb';

export default class SessionClient {
  private client: PromiseClient<typeof SessionService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(SessionService);
  }

  /**
   * Get details for a specific session
   * @param {string} sessionId The session id
   * @returns {Promise<SessionDetails>} The session details
   */
  async getSession(sessionId: string): Promise<SessionDetails> {
    return this.coreClient.connectExec(
      this.client.getSession,
      {
        sessionId
      }
    );
  }

  /**
   * Get all session details for a user
   * @param {string} userId The user id
   * @returns {Promise<UserSessionDetails>} The user session details
   */
  async getUserSessions(userId: string): Promise<UserSessionDetails> {
    return this.coreClient.connectExec(
      this.client.getUserSessions,
      {
        userId
      }
    );
  }

  /**
   * Revoke a session for a user
   * @param {string} sessionId The session id to revoke
   * @returns {Promise<RevokeSessionResponse>} The response with revoked session details
   */
  async revokeSession(sessionId: string): Promise<RevokeSessionResponse> {
    return this.coreClient.connectExec(
      this.client.revokeSession,
      {
        sessionId
      }
    );
  }
}
