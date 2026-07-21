import type { Client } from '@connectrpc/connect';
import type { Timestamp } from '@bufbuild/protobuf/wkt';
import GrpcConnect from './connect';
import CoreClient from './core';
import {
  AuditLogsService,
  ListAuthLogResponse,
} from './pkg/grpc/scalekit/v1/auditlogs/auditlogs_pb';

/**
 * Client for listing authentication request logs.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const auditLogsClient = scalekitClient.auditLogs;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/audit-logs | Audit Logs API Documentation}
 */
export default class AuditLogsClient {
  private client: Client<typeof AuditLogsService>;
  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(AuditLogsService);
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
  async listAuthRequests(options?: {
    email?: string;
    status?: string[];
    startTime?: Timestamp;
    endTime?: Timestamp;
    resourceId?: string;
    connectedAccountIdentifier?: string;
    clientId?: string;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListAuthLogResponse> {
    return this.coreClient.connectExec(this.client.listAuthRequests, {
      email: options?.email ?? '',
      status: options?.status ?? [],
      ...(options?.startTime && { startTime: options.startTime }),
      ...(options?.endTime && { endTime: options.endTime }),
      resourceId: options?.resourceId ?? '',
      connectedAccountIdentifier: options?.connectedAccountIdentifier ?? '',
      clientId: options?.clientId ?? '',
      pageSize: options?.pageSize ?? 0,
      pageToken: options?.pageToken ?? '',
    });
  }
}
