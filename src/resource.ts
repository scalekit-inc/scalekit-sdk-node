import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import {
  ClientService,
  ResourceUserConsent,
  ListResourceUserConsentsResponse,
  RevokeUserConsentResponse,
} from './pkg/grpc/scalekit/v1/clients/clients_pb';

export interface ListUserConsentsOptions {
  /** Case-insensitive substring match on external user IDs. */
  search?: string;
  /** Page size, max 30. */
  pageSize?: number;
  /** Pagination cursor. */
  pageToken?: string;
}

/**
 * Client for reading and revoking end-user consents granted against a resource.
 *
 * A consent records that one of your end users allowed a specific API client to
 * act on their behalf against a resource (for example an MCP server). Each
 * consent identifies the user by `externalUserId` — the identifier your own
 * application supplied when the consent was granted.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const resources = scalekitClient.resources;
 */
export default class ResourceClient {
  private client: Client<typeof ClientService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(ClientService);
  }

  /**
   * Lists the end-user consents granted against a resource, with pagination.
   *
   * Each returned consent carries `id`, `externalUserId`, `clientId`,
   * `clientName`, `scopes` and `grantedAt`. The response also carries
   * `totalSize` plus `nextPageToken` / `prevPageToken` cursors.
   *
   * @param resourceId - The resource whose consents to list (format: res_xxxxx)
   * @param options - Optional search and pagination options
   * @returns ListResourceUserConsentsResponse with consents array and pagination cursors
   */
  async listUserConsents(
    resourceId: string,
    options?: ListUserConsentsOptions
  ): Promise<ListResourceUserConsentsResponse> {
    if (!resourceId) throw new Error('resourceId is required');
    return this.coreClient.connectExec(this.client.listResourceUserConsents, {
      resourceId,
      ...(options?.search && { search: options.search }),
      ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
      ...(options?.pageToken && { pageToken: options.pageToken }),
    });
  }

  /**
   * Revokes a single end-user consent held by an API client.
   *
   * Deletes the consent, so the client is prompted for consent again on its
   * next authorization attempt, and revokes every active refresh token issued
   * to that client for the same user. Access tokens already issued stay valid
   * until they expire.
   *
   * Note that `clientId` is the API client that holds the consent (format:
   * m2m_xxxxx), not the resource id.
   *
   * @param clientId - The client holding the consent (format: m2m_xxxxx)
   * @param consentId - The consent to revoke (format: usrcnst_xxxxx)
   * @returns Empty response on success; throws on failure
   */
  async revokeUserConsent(
    clientId: string,
    consentId: string
  ): Promise<RevokeUserConsentResponse> {
    if (!clientId) throw new Error('clientId is required');
    if (!consentId) throw new Error('consentId is required');
    return this.coreClient.connectExec(this.client.revokeUserConsent, {
      clientId,
      consentId,
    });
  }
}

export {
  ResourceUserConsent,
  ListResourceUserConsentsResponse,
  RevokeUserConsentResponse,
};
