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
  UserSessionFilter,
  RevokeSessionRequest,
  RevokeSessionResponse,
  RevokeAllUserSessionsRequest,
  RevokeAllUserSessionsResponse
} from './pkg/grpc/scalekit/v1/sessions/sessions_pb';
import { Timestamp } from '@bufbuild/protobuf';

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
   * Get all session details for a user with pagination and filtering
   * @param {string} userId The user id
   * @param {object} options The pagination and filtering options
   * @param {number} options.pageSize The page size
   * @param {string} options.pageToken The page token
   * @param {object} options.filter The session filter options
   * @param {string[]} options.filter.status The session statuses to filter by
   * @param {Date} options.filter.startTime The start time for filtering sessions
   * @param {Date} options.filter.endTime The end time for filtering sessions
   * @returns {Promise<UserSessionDetails>} The user session details
   */
  async getUserSessions(
    userId: string,
    options?: {
      pageSize?: number,
      pageToken?: string,
      filter?: {
        status?: string[],
        startTime?: Date,
        endTime?: Date
      }
    }
  ): Promise<UserSessionDetails> {
    const request: PartialMessage<UserSessionDetailsRequest> = {
      userId
    };

    if (options?.pageSize !== undefined) {
      request.pageSize = options.pageSize;
    }

    if (options?.pageToken) {
      request.pageToken = options.pageToken;
    }

    if (options?.filter) {
      const filter = new UserSessionFilter();
      
      if (options.filter.status) {
        filter.status = options.filter.status;
      }
      
      if (options.filter.startTime) {
        filter.startTime = Timestamp.fromDate(options.filter.startTime);
      }
      
      if (options.filter.endTime) {
        filter.endTime = Timestamp.fromDate(options.filter.endTime);
      }
      
      request.filter = filter;
    }

    return this.coreClient.connectExec(
      this.client.getUserSessions,
      request
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

  /**
   * Revoke all sessions for a user
   * @param {string} userId The user id whose sessions should be revoked
   * @returns {Promise<RevokeAllUserSessionsResponse>} The response with all revoked session details
   */
  async revokeAllUserSessions(userId: string): Promise<RevokeAllUserSessionsResponse> {
    if (!userId) {
      throw new Error('userId is required');
    }

    return this.coreClient.connectExec(
      this.client.revokeAllUserSessions,
      {
        userId
      }
    );
  }
}
