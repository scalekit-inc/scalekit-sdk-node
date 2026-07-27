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
const protobuf_1 = require("@bufbuild/protobuf");
const events_pb_1 = require("./pkg/grpc/scalekit/v1/events/events_pb");
const events_pb_2 = require("./pkg/grpc/scalekit/v1/events/events_pb");
/**
 * Client for reading Scalekit events.
 *
 * Events capture activity that occurs within your Scalekit environment — authentication
 * journeys, directory sync changes, connected-account activity, and more. Use this client
 * to page through the event log for auditing, monitoring, or building an activity feed.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const eventsClient = scalekitClient.events;
 *
 * @see {@link https://docs.scalekit.com/apis/ | Scalekit API Documentation}
 */
class EventsClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(events_pb_1.EventsService);
    }
    /**
     * Lists events for the current environment using cursor-based pagination.
     *
     * Returns a page of events ordered most-recent first. The response carries cursor tokens
     * for forward and backward pagination but omits the total event count. To page forward,
     * pass the returned `nextPageToken` as the `pageToken` on the next call.
     *
     * @param {number} [pageSize] - Number of events per page. Defaults to 10 and is clamped to 100 server-side.
     * @param {string} [pageToken] - Opaque cursor from a previous response (`nextPageToken`/`prevPageToken`).
     * @param {MessageInitShape<typeof EventFilterSchema>} [filter] - Optional filter. Accepts a plain
     *   object literal with any of: `eventTypes`, `startTime`, `endTime`, `organizationId`, `source`,
     *   `authRequestId`, `interceptorId`, `interceptorStatus`, `interceptorDecision`, `connectionId`,
     *   `connectedAccountId`. All fields are optional and fully type-checked.
     *
     * @returns {Promise<ListEventsPaginatedResponse>} A page of events with `nextPageToken` and `prevPageToken` cursors
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     *
     * @example
     * const response = await scalekitClient.events.listEventsPaginated(10, '');
     * response.events.forEach((event) => console.log(event.type, event.object));
     *
     * @example
     * // With a filter — pass a plain object literal, no cast required.
     * const response = await scalekitClient.events.listEventsPaginated(25, '', {
     *   eventTypes: ['user.created'],
     * });
     *
     * @see {@link https://docs.scalekit.com/apis/ | List Events API}
     */
    listEventsPaginated(pageSize, pageToken, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = (0, protobuf_1.create)(events_pb_2.ListEventsPaginatedRequestSchema, Object.assign(Object.assign(Object.assign({}, (filter !== undefined && { filter })), (pageSize !== undefined && { pageSize })), (pageToken !== undefined && { pageToken })));
            return this.coreClient.connectExec(this.client.listEventsPaginated, request);
        });
    }
}
exports.default = EventsClient;
//# sourceMappingURL=events.js.map