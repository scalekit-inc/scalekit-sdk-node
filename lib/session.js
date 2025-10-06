"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sessions_connect_1 = require("./pkg/grpc/scalekit/v1/sessions/sessions_connect");
const sessions_pb_1 = require("./pkg/grpc/scalekit/v1/sessions/sessions_pb");
const protobuf_1 = require("@bufbuild/protobuf");
class SessionClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(sessions_connect_1.SessionService);
    }
    /**
     * Get details for a specific session
     * @param {string} sessionId The session id
     * @returns {Promise<SessionDetails>} The session details
     */
    getSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getSession, {
                sessionId
            });
        });
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
    getUserSessions(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                userId
            };
            if ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined) {
                request.pageSize = options.pageSize;
            }
            if (options === null || options === void 0 ? void 0 : options.pageToken) {
                request.pageToken = options.pageToken;
            }
            if (options === null || options === void 0 ? void 0 : options.filter) {
                const filter = new sessions_pb_1.UserSessionFilter();
                if (options.filter.status) {
                    filter.status = options.filter.status;
                }
                if (options.filter.startTime) {
                    filter.startTime = protobuf_1.Timestamp.fromDate(options.filter.startTime);
                }
                if (options.filter.endTime) {
                    filter.endTime = protobuf_1.Timestamp.fromDate(options.filter.endTime);
                }
                request.filter = filter;
            }
            return this.coreClient.connectExec(this.client.getUserSessions, request);
        });
    }
    /**
     * Revoke a session for a user
     * @param {string} sessionId The session id to revoke
     * @returns {Promise<RevokeSessionResponse>} The response with revoked session details
     */
    revokeSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.revokeSession, {
                sessionId
            });
        });
    }
    /**
     * Revoke all sessions for a user
     * @param {string} userId The user id whose sessions should be revoked
     * @returns {Promise<RevokeAllUserSessionsResponse>} The response with all revoked session details
     */
    revokeAllUserSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error('userId is required');
            }
            return this.coreClient.connectExec(this.client.revokeAllUserSessions, {
                userId
            });
        });
    }
}
exports.default = SessionClient;
//# sourceMappingURL=session.js.map