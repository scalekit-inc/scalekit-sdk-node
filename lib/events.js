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
const events_pb_1 = require("./pkg/grpc/scalekit/v1/events/events_pb");
/**
 * Client for listing environment events.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const eventsClient = scalekitClient.events;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/events | Events API Documentation}
 */
class EventsClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(events_pb_1.EventsService);
    }
    /**
     * Lists events for the current environment, ordered most-recent first, including a total count.
     *
     * Pass `authRequestId` to see every event a specific authentication request produced —
     * correlate it with the `authRequestId` returned by `scalekitClient.auditLogs.listAuthRequests`.
     *
     * @param {object} [options] - Optional filter and pagination
     * @param {string[]} [options.eventTypes] - Filter by one or more event type names
     * @param {Timestamp} [options.startTime] - Only return events at or after this timestamp
     * @param {Timestamp} [options.endTime] - Only return events at or before this timestamp
     * @param {string} [options.organizationId] - Filter by organization ID
     * @param {Source} [options.source] - Filter by event source (SCALEKIT or DIR_SYNC)
     * @param {string} [options.authRequestId] - Filter by the authentication request that produced the events
     * @param {string} [options.interceptorId] - Filter by interceptor ID
     * @param {string} [options.interceptorStatus] - Filter by interceptor status
     * @param {string} [options.interceptorDecision] - Filter by interceptor decision
     * @param {string} [options.connectionId] - Filter by connection ID
     * @param {string} [options.connectedAccountId] - Filter by connected account ID
     * @param {number} [options.pageSize] - Number of events per page (defaults to 10 when unset)
     * @param {string} [options.pageToken] - Opaque pagination cursor from a previous response
     *
     * @returns {Promise<ListEventsResponse>} Events matching the filter, next/prev page tokens, and totalSize
     *
     * @throws {ScalekitServerException}
     *
     * @example
     * const response = await scalekitClient.events.listEvents({ authRequestId: 'areq_123456' });
     * console.log(`Found ${response.totalSize} events`);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/events | List Events API}
     */
    listEvents(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            return this.coreClient.connectExec(this.client.listEvents, {
                filter: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ eventTypes: (_a = options === null || options === void 0 ? void 0 : options.eventTypes) !== null && _a !== void 0 ? _a : [] }, ((options === null || options === void 0 ? void 0 : options.startTime) && { startTime: options.startTime })), ((options === null || options === void 0 ? void 0 : options.endTime) && { endTime: options.endTime })), { organizationId: (_b = options === null || options === void 0 ? void 0 : options.organizationId) !== null && _b !== void 0 ? _b : '', source: (_c = options === null || options === void 0 ? void 0 : options.source) !== null && _c !== void 0 ? _c : events_pb_1.Source.SOURCE_UNSPECIFIED, authRequestId: (_d = options === null || options === void 0 ? void 0 : options.authRequestId) !== null && _d !== void 0 ? _d : '' }), ((options === null || options === void 0 ? void 0 : options.interceptorId) && { interceptorId: options.interceptorId })), ((options === null || options === void 0 ? void 0 : options.interceptorStatus) && {
                    interceptorStatus: options.interceptorStatus,
                })), ((options === null || options === void 0 ? void 0 : options.interceptorDecision) && {
                    interceptorDecision: options.interceptorDecision,
                })), ((options === null || options === void 0 ? void 0 : options.connectionId) && { connectionId: options.connectionId })), ((options === null || options === void 0 ? void 0 : options.connectedAccountId) && {
                    connectedAccountId: options.connectedAccountId,
                })),
                pageSize: (_e = options === null || options === void 0 ? void 0 : options.pageSize) !== null && _e !== void 0 ? _e : 0,
                pageToken: (_f = options === null || options === void 0 ? void 0 : options.pageToken) !== null && _f !== void 0 ? _f : '',
            });
        });
    }
}
exports.default = EventsClient;
//# sourceMappingURL=events.js.map