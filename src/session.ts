import { PartialMessage } from "@bufbuild/protobuf";
import { PromiseClient } from "@connectrpc/connect";
import GrpcConnect from "./connect";
import CoreClient from "./core";
import { SessionService } from "./pkg/grpc/scalekit/v1/sessions/sessions_connect";
import {
  SessionDetailsRequest,
  SessionDetails,
  UserSessionDetailsRequest,
  UserSessionDetails,
  UserSessionFilter,
  RevokeSessionRequest,
  RevokeSessionResponse,
  RevokeAllUserSessionsRequest,
  RevokeAllUserSessionsResponse,
} from "./pkg/grpc/scalekit/v1/sessions/sessions_pb";
import { Timestamp } from "@bufbuild/protobuf";

export default class SessionClient {
  private client: PromiseClient<typeof SessionService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(SessionService);
  }

  /**
   * Retrieves comprehensive metadata and status for a specific user session.
   *
   * Fetches complete session information including authentication status, device details,
   * IP address, geolocation, and expiration timelines.
   *
   * @param {string} sessionId - The session identifier to retrieve (format: "ses_...")
   *
   * @returns {Promise<SessionDetails>} Session details containing:
   *   - sessionId: Unique session identifier
   *   - userId: User who owns this session
   *   - organizationId: Organization context for the session
   *   - status: Current session status ('active', 'expired', 'revoked', 'logout')
   *   - deviceInfo: Browser and operating system information
   *   - ipAddress: IP address from which session was created
   *   - geoLocation: Geographic location data (city, region, country)
   *   - createTime: When the session was created
   *   - lastActivityTime: Most recent session activity
   *   - idleExpirationTime: When session expires due to inactivity
   *   - absoluteExpirationTime: Maximum session lifetime
   *   - expirationTime: Actual expiration time (if session has ended)
   *
   * @throws {Error} If the session is not found
   *
   * @example
   * // Get session details
   * const session = await scalekitClient.session.getSession('ses_123456');
   *
   * console.log('Status:', session.status);
   * console.log('User:', session.userId);
   * console.log('Device:', session.deviceInfo);
   * console.log('Location:', session.geoLocation);
   * console.log('Last active:', session.lastActivityTime);
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/sessions | Get Session API}
   * @see {@link getUserSessions} - List all sessions for a user
   * @see {@link revokeSession} - Revoke this session
   */
  async getSession(sessionId: string): Promise<SessionDetails> {
    return this.coreClient.connectExec(this.client.getSession, {
      sessionId,
    });
  }

  /**
   * Retrieves a paginated list of all sessions for a specific user across all devices and browsers.
   *
   * Lists all user sessions with support for filtering by status and time range. Essential for
   * displaying active sessions in account management, auditing user activity, verifying authentication
   * across devices, or identifying suspicious sessions. Use filtering to find active sessions,
   * sessions from specific time periods, or sessions with particular statuses.
   *
   * @param {string} userId - The user identifier (format: "usr_...")
   * @param {object} [options] - Optional pagination and filtering parameters
   * @param {number} [options.pageSize] - Number of sessions to return per page
   * @param {string} [options.pageToken] - Token for retrieving the next page from previous response
   * @param {object} [options.filter] - Filter criteria for sessions
   * @param {string[]} [options.filter.status] - Filter by status values: 'active', 'expired', 'revoked', 'logout'
   *                                             (multiple values use OR logic)
   * @param {Date} [options.filter.startTime] - Include sessions created on or after this time
   * @param {Date} [options.filter.endTime] - Include sessions created before this time
   *                                           (must be after startTime)
   *
   * @returns {Promise<UserSessionDetails>} Response containing:
   *   - sessions: Array of session objects with device info, location, and status
   *   - nextPageToken: Token for fetching the next page
   *   - totalSize: Total number of sessions matching the filter
   *
   * @example
   * // List all active sessions for a user
   * const response = await scalekitClient.session.getUserSessions('usr_123456', {
   *   filter: { status: ['active'] },
   *   pageSize: 20
   * });
   *
   * console.log(`User has ${response.totalSize} active sessions`);
   * response.sessions.forEach(session => {
   *   console.log(`- ${session.deviceInfo} from ${session.geoLocation?.city}`);
   *   console.log(`  Last active: ${session.lastActivityTime}`);
   * });
   *
   * @example
   * // Get all sessions (active and inactive)
   * const response = await scalekitClient.session.getUserSessions('usr_123456');
   * console.log(`Total sessions: ${response.totalSize}`);
   *
   * @example
   * // Find sessions from the last 7 days
   * const sevenDaysAgo = new Date();
   * sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
   *
   * const response = await scalekitClient.session.getUserSessions('usr_123456', {
   *   filter: {
   *     startTime: sevenDaysAgo,
   *     status: ['active', 'logout']
   *   }
   * });
   *
   * console.log(`Sessions in last 7 days: ${response.sessions.length}`);
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/sessions | List User Sessions API}
   * @see {@link getSession} - Get details of a specific session
   * @see {@link revokeSession} - Revoke a specific session
   * @see {@link revokeAllUserSessions} - Revoke all sessions for user
   */
  async getUserSessions(
    userId: string,
    options?: {
      pageSize?: number;
      pageToken?: string;
      filter?: {
        status?: string[];
        startTime?: Date;
        endTime?: Date;
      };
    }
  ): Promise<UserSessionDetails> {
    const request: PartialMessage<UserSessionDetailsRequest> = {
      userId,
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

    return this.coreClient.connectExec(this.client.getUserSessions, request);
  }

  /**
   * Immediately invalidates a specific user session by setting its status to 'revoked'.
   *
   * Terminates a single session, forcing the user to re-authenticate on that specific device.
   * Use this for session-level logout, terminating suspicious sessions, forcing re-authentication
   * on specific devices, or implementing "logout from this device" functionality. The revocation
   * is instantaneous and irreversible - once revoked, the session cannot be used for any future
   * API requests or application access.
   *
   * @param {string} sessionId - The session identifier to revoke (format: "ses_...")
   *
   * @returns {Promise<RevokeSessionResponse>} Response containing:
   *   - sessionId: The ID of the revoked session
   *   - userId: User who owned the session
   *   - revokedAt: Timestamp when the session was revoked
   *   - status: Updated session status ('revoked')
   *
   * @throws {Error} If the session is not found
   *
   * @example
   * // Revoke a specific session
   * const response = await scalekitClient.session.revokeSession('ses_123456');
   * console.log('Session revoked at:', response.revokedAt);
   * console.log('Status:', response.status); // 'revoked'
   *
   * @example
   * // Logout from specific device
   * app.post('/api/sessions/:sessionId/logout', async (req, res) => {
   *   const { sessionId } = req.params;
   *
   *   try {
   *     await scalekitClient.session.revokeSession(sessionId);
   *     res.json({ message: 'Session terminated successfully' });
   *   } catch (error) {
   *     res.status(500).json({ error: 'Failed to revoke session' });
   *   }
   * });
   *
   * @example
   * // Revoke suspicious session
   * const session = await scalekitClient.session.getSession(sessionId);
   *
   * if (session.geoLocation?.country !== expectedCountry) {
   *   console.log('Suspicious session detected');
   *   console.log(`Location: ${session.geoLocation?.city}, ${session.geoLocation?.country}`);
   *   console.log(`IP: ${session.ipAddress}`);
   *
   *   await scalekitClient.session.revokeSession(sessionId);
   *   console.log('Session revoked for security');
   *
   *   // Send security alert to user
   *   await sendSecurityAlert(session.userId, {
   *     message: 'Unusual login location detected and session terminated',
   *     location: session.geoLocation
   *   });
   * }
   *
   * @example
   * // Revoke all non-current sessions for a user
   * const response = await scalekitClient.session.getUserSessions(userId, {
   *   filter: { status: ['active'] }
   * });
   *
   * for (const session of response.sessions) {
   *   if (session.sessionId !== currentSessionId) {
   *     await scalekitClient.session.revokeSession(session.sessionId);
   *     console.log(`Revoked session from: ${session.deviceInfo}`);
   *   }
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/sessions | Revoke Session API}
   * @see {@link revokeAllUserSessions} - Revoke all sessions for a user
   * @see {@link getUserSessions} - List user sessions to find suspicious ones
   * @see {@link getSession} - Get session details before revoking
   */
  async revokeSession(sessionId: string): Promise<RevokeSessionResponse> {
    return this.coreClient.connectExec(this.client.revokeSession, {
      sessionId,
    });
  }

  /**
   * Immediately invalidates all active sessions for a user across all devices and browsers.
   *
   * Terminates all active sessions simultaneously, forcing the user to re-authenticate everywhere.
   * Use this to implement global logout, force re-authentication after security incidents (password
   * compromise, suspicious activity), terminate all sessions following password reset, or revoke
   * access after account changes. Only active sessions are revoked; already expired, logout, or
   * previously revoked sessions remain unchanged. This operation is atomic, instantaneous, and
   * cannot be undone.
   *
   * @param {string} userId - The user identifier whose sessions should be revoked (format: "usr_...")
   *
   * @returns {Promise<RevokeAllUserSessionsResponse>} Response containing:
   *   - revokedSessions: Array of all revoked session objects with details
   *   - totalCount: Number of sessions that were revoked
   *   - revokedAt: Timestamp when revocation occurred
   *
   * @throws {Error} When userId is missing or invalid
   * @throws {Error} If the user is not found
   *
   * @example
   * // Revoke all user sessions (global logout)
   * const response = await scalekitClient.session.revokeAllUserSessions('usr_123456');
   *
   * console.log(`Revoked ${response.totalCount} sessions`);
   * console.log('User must re-authenticate on all devices');
   *
   * @example
   * // Force logout after password reset
   * app.post('/api/users/:userId/reset-password', async (req, res) => {
   *   const { userId } = req.params;
   *   const { newPassword } = req.body;
   *
   *   try {
   *     // Update password
   *     await updateUserPassword(userId, newPassword);
   *
   *     // Revoke all existing sessions
   *     const response = await scalekitClient.session.revokeAllUserSessions(userId);
   *
   *     res.json({
   *       message: 'Password updated successfully',
   *       sessionsRevoked: response.totalCount,
   *       note: 'Please log in again with your new password'
   *     });
   *   } catch (error) {
   *     res.status(500).json({ error: 'Failed to reset password' });
   *   }
   * });
   *
   * @example
   * // Force re-authentication after role change
   * async function updateUserRole(userId, newRole) {
   *   await updateRole(userId, newRole);
   *
   *   // Force re-authentication to apply new permissions
   *   await scalekitClient.session.revokeAllUserSessions(userId);
   *   console.log('User will re-authenticate with new role permissions');
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/sessions | Revoke All Sessions API}
   * @see {@link revokeSession} - Revoke a specific session
   * @see {@link getUserSessions} - View user's active sessions before revoking
   */
  async revokeAllUserSessions(
    userId: string
  ): Promise<RevokeAllUserSessionsResponse> {
    if (!userId) {
      throw new Error("userId is required");
    }

    return this.coreClient.connectExec(this.client.revokeAllUserSessions, {
      userId,
    });
  }
}
