import type { Client } from '@connectrpc/connect';
import type { Timestamp } from '@bufbuild/protobuf/wkt';
import GrpcConnect from './connect';
import CoreClient from './core';
import {
  EventsService,
  ListEventsResponse,
  Source,
} from './pkg/grpc/scalekit/v1/events/events_pb';

/**
 * Client for listing environment events.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const eventsClient = scalekitClient.events;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/events | Events API Documentation}
 */
export default class EventsClient {
  private client: Client<typeof EventsService>;
  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(EventsService);
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
  async listEvents(options?: {
    eventTypes?: string[];
    startTime?: Timestamp;
    endTime?: Timestamp;
    organizationId?: string;
    source?: Source;
    authRequestId?: string;
    interceptorId?: string;
    interceptorStatus?: string;
    interceptorDecision?: string;
    connectionId?: string;
    connectedAccountId?: string;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListEventsResponse> {
    return this.coreClient.connectExec(this.client.listEvents, {
      filter: {
        eventTypes: options?.eventTypes ?? [],
        ...(options?.startTime && { startTime: options.startTime }),
        ...(options?.endTime && { endTime: options.endTime }),
        organizationId: options?.organizationId ?? '',
        source: options?.source ?? Source.SOURCE_UNSPECIFIED,
        authRequestId: options?.authRequestId ?? '',
        ...(options?.interceptorId && { interceptorId: options.interceptorId }),
        ...(options?.interceptorStatus && {
          interceptorStatus: options.interceptorStatus,
        }),
        ...(options?.interceptorDecision && {
          interceptorDecision: options.interceptorDecision,
        }),
        ...(options?.connectionId && { connectionId: options.connectionId }),
        ...(options?.connectedAccountId && {
          connectedAccountId: options.connectedAccountId,
        }),
      },
      pageSize: options?.pageSize ?? 0,
      pageToken: options?.pageToken ?? '',
    });
  }
}
