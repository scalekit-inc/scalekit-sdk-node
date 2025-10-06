import GrpcConnect from './connect';
import CoreClient from './core';
import { SessionDetails, UserSessionDetails, RevokeSessionResponse, RevokeAllUserSessionsResponse } from './pkg/grpc/scalekit/v1/sessions/sessions_pb';
export default class SessionClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Get details for a specific session
     * @param {string} sessionId The session id
     * @returns {Promise<SessionDetails>} The session details
     */
    getSession(sessionId: string): Promise<SessionDetails>;
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
    getUserSessions(userId: string, options?: {
        pageSize?: number;
        pageToken?: string;
        filter?: {
            status?: string[];
            startTime?: Date;
            endTime?: Date;
        };
    }): Promise<UserSessionDetails>;
    /**
     * Revoke a session for a user
     * @param {string} sessionId The session id to revoke
     * @returns {Promise<RevokeSessionResponse>} The response with revoked session details
     */
    revokeSession(sessionId: string): Promise<RevokeSessionResponse>;
    /**
     * Revoke all sessions for a user
     * @param {string} userId The user id whose sessions should be revoked
     * @returns {Promise<RevokeAllUserSessionsResponse>} The response with all revoked session details
     */
    revokeAllUserSessions(userId: string): Promise<RevokeAllUserSessionsResponse>;
}
