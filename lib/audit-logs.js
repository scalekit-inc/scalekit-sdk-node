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
const auditlogs_pb_1 = require("./pkg/grpc/scalekit/v1/auditlogs/auditlogs_pb");
/**
 * Client for listing authentication request logs.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const auditLogsClient = scalekitClient.auditLogs;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/audit-logs | Audit Logs API Documentation}
 */
class AuditLogsClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(auditlogs_pb_1.AuditLogsService);
    }
    /**
     * Lists authentication request logs for the current environment, ordered most-recent first.
     *
     * Each entry's `authRequestId` can be passed to `scalekitClient.events.listEvents`'s
     * `authRequestId` filter to see every event a specific login produced.
     *
     * @param {object} [options] - Optional filters and pagination
     * @param {string} [options.email] - Filter by the end user's email address
     * @param {string[]} [options.status] - Filter by one or more outcome statuses (e.g. "SUCCESS", "FAILED")
     * @param {Timestamp} [options.startTime] - Only return logs at or after this timestamp
     * @param {Timestamp} [options.endTime] - Only return logs at or before this timestamp
     * @param {string} [options.resourceId] - Filter by resource ID
     * @param {string} [options.connectedAccountIdentifier] - Filter by connected account identifier
     * @param {string} [options.clientId] - Filter by client ID
     * @param {number} [options.pageSize] - Number of logs per page (defaults to 10 when unset)
     * @param {string} [options.pageToken] - Opaque pagination cursor from a previous response
     *
     * @returns {Promise<ListAuthLogResponse>} Authentication request logs, next/prev page tokens, and totalSize
     *
     * @throws {ScalekitServerException}
     *
     * @example
     * const response = await scalekitClient.auditLogs.listAuthRequests({ email: 'jane.doe@example.com' });
     * console.log(`Found ${response.totalSize} authentication requests`);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/audit-logs | List Authentication Request Logs API}
     */
    listAuthRequests(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            return this.coreClient.connectExec(this.client.listAuthRequests, Object.assign(Object.assign(Object.assign({ email: (_a = options === null || options === void 0 ? void 0 : options.email) !== null && _a !== void 0 ? _a : '', status: (_b = options === null || options === void 0 ? void 0 : options.status) !== null && _b !== void 0 ? _b : [] }, ((options === null || options === void 0 ? void 0 : options.startTime) && { startTime: options.startTime })), ((options === null || options === void 0 ? void 0 : options.endTime) && { endTime: options.endTime })), { resourceId: (_c = options === null || options === void 0 ? void 0 : options.resourceId) !== null && _c !== void 0 ? _c : '', connectedAccountIdentifier: (_d = options === null || options === void 0 ? void 0 : options.connectedAccountIdentifier) !== null && _d !== void 0 ? _d : '', clientId: (_e = options === null || options === void 0 ? void 0 : options.clientId) !== null && _e !== void 0 ? _e : '', pageSize: (_f = options === null || options === void 0 ? void 0 : options.pageSize) !== null && _f !== void 0 ? _f : 0, pageToken: (_g = options === null || options === void 0 ? void 0 : options.pageToken) !== null && _g !== void 0 ? _g : '' }));
        });
    }
}
exports.default = AuditLogsClient;
//# sourceMappingURL=audit-logs.js.map