import { create } from '@bufbuild/protobuf';
import { FieldMaskSchema } from '@bufbuild/protobuf/wkt';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import {
  ClientService,
  ResourceUserConsent,
  ResourceUserConsentFilter,
  ListResourceUserConsentsResponse,
  RevokeUserConsentResponse,
  CustomClaim,
  CustomClaimSchema,
  M2MClient,
  ConsentedUser,
  CreateResourceClientResponse,
  GetResourceClientResponse,
  UpdateResourceClientResponse,
  ListResourceClientsResponse,
  DeleteResourceClientResponse,
} from './pkg/grpc/scalekit/v1/clients/clients_pb';

function toCustomClaims(claims: { [key: string]: string }): CustomClaim[] {
  return Object.entries(claims).map(([key, value]) =>
    create(CustomClaimSchema, { key, value })
  );
}

export interface ListUserConsentsOptions {
  /** Case-insensitive substring match on external user IDs. Ignored when userIds is set. */
  search?: string;
  /** Page size, max 30. */
  pageSize?: number;
  /** Pagination cursor. */
  pageToken?: string;
  /** Exact match on external user IDs, max 25. Takes precedence over search. */
  userIds?: string[];
}

export interface CreateResourceClientOptions {
  /** Human-readable name for the client. Defaults to "Resource Client" if omitted. */
  name?: string;
  /** Optional description */
  description?: string;
  /** Scopes to grant */
  scopes?: string[];
  /** Audience values for access tokens. Ignored for MCP server/gateway resources, which get their audience from the resource itself. */
  audience?: string[];
  /** Custom claims to embed in access tokens (key-value pairs) */
  customClaims?: { [key: string]: string };
  /** Access token lifetime in seconds. Defaults to the resource's configured expiry, or one day. */
  expiry?: number;
  /** Allowed redirect URIs, for a pre-registered (non-DCR) client */
  redirectUris?: string[];
}

export interface UpdateResourceClientOptions {
  /** Updated name */
  name?: string;
  /** Updated description */
  description?: string;
  /** Updated scopes (replaces existing) */
  scopes?: string[];
  /** Updated audience values (replaces existing) */
  audience?: string[];
  /** Custom claims to set (replaces existing) */
  customClaims?: { [key: string]: string };
  /** Updated access token lifetime in seconds */
  expiry?: number;
  /** Updated redirect URIs (replaces existing) */
  redirectUris?: string[];
}

/**
 * Client for managing API clients scoped to a resource, and reading and
 * revoking end-user consents granted against one.
 *
 * A resource (for example an MCP server) can have one or more API clients
 * registered against it, each using the client_credentials OAuth flow scoped
 * to that resource. A consent records that one of your end users allowed a
 * specific client to act on their behalf against the resource. Each consent
 * identifies the user by `externalUserId` — the identifier your own
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
   * Creates a new API client scoped to a resource.
   *
   * Returns the created `client` and a `plainSecret` — the plaintext client
   * secret, only available at creation time.
   *
   * @param resourceId - The resource to create the client for (format: res_xxxxx)
   * @param options - Optional client properties (name, description, scopes, audience, customClaims, expiry, redirectUris)
   * @returns CreateResourceClientResponse with client metadata and plainSecret
   */
  async createResourceClient(
    resourceId: string,
    options?: CreateResourceClientOptions
  ): Promise<CreateResourceClientResponse> {
    if (!resourceId) throw new Error('resourceId is required');
    return this.coreClient.connectExec(this.client.createResourceClient, {
      resourceId,
      client: {
        ...(options?.name && { name: options.name }),
        ...(options?.description && { description: options.description }),
        ...(options?.scopes && { scopes: options.scopes }),
        ...(options?.audience && { audience: options.audience }),
        ...(options?.customClaims && {
          customClaims: toCustomClaims(options.customClaims),
        }),
        ...(options?.expiry !== undefined && {
          expiry: BigInt(options.expiry),
        }),
        ...(options?.redirectUris && { redirectUris: options.redirectUris }),
      },
    });
  }

  /**
   * Retrieves a single API client scoped to a resource, along with the
   * end-users who have granted it consent.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID (format: m2m_xxxxx)
   * @returns GetResourceClientResponse with client metadata and consentedUsers
   */
  async getResourceClient(
    resourceId: string,
    clientId: string
  ): Promise<GetResourceClientResponse> {
    if (!resourceId) throw new Error('resourceId is required');
    if (!clientId) throw new Error('clientId is required');
    return this.coreClient.connectExec(this.client.getResourceClient, {
      resourceId,
      clientId,
    });
  }

  /**
   * Lists every API client scoped to a resource.
   *
   * @param resourceId - The resource whose clients to list (format: res_xxxxx)
   * @returns ListResourceClientsResponse with clients array and DCR/static client counts
   */
  async listResourceClients(
    resourceId: string
  ): Promise<ListResourceClientsResponse> {
    if (!resourceId) throw new Error('resourceId is required');
    return this.coreClient.connectExec(this.client.listResourceClients, {
      resourceId,
    });
  }

  /**
   * Updates an existing API client scoped to a resource.
   *
   * Only the fields present in `options` are changed. An `update_mask` built
   * from those same fields is sent alongside the partial `client` payload, so
   * the server never mistakes "not passed" for "clear this field" — pass an
   * empty array (e.g. `scopes: []`) to clear a field instead of omitting it.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID to update
   * @param options - Fields to update (name, description, scopes, audience, customClaims, expiry, redirectUris)
   * @returns UpdateResourceClientResponse with updated client metadata
   */
  async updateResourceClient(
    resourceId: string,
    clientId: string,
    options?: UpdateResourceClientOptions
  ): Promise<UpdateResourceClientResponse> {
    if (!resourceId) throw new Error('resourceId is required');
    if (!clientId) throw new Error('clientId is required');

    const paths: string[] = [];
    const client: {
      name?: string;
      description?: string;
      scopes?: string[];
      audience?: string[];
      customClaims?: CustomClaim[];
      expiry?: bigint;
      redirectUris?: string[];
    } = {};
    if (options?.name !== undefined) {
      client.name = options.name;
      paths.push('name');
    }
    if (options?.description !== undefined) {
      client.description = options.description;
      paths.push('description');
    }
    if (options?.scopes !== undefined) {
      client.scopes = options.scopes;
      paths.push('scopes');
    }
    if (options?.audience !== undefined) {
      client.audience = options.audience;
      paths.push('audience');
    }
    if (options?.customClaims !== undefined) {
      client.customClaims = toCustomClaims(options.customClaims);
      paths.push('custom_claims');
    }
    if (options?.expiry !== undefined) {
      client.expiry = BigInt(options.expiry);
      paths.push('expiry');
    }
    if (options?.redirectUris !== undefined) {
      client.redirectUris = options.redirectUris;
      paths.push('redirect_uris');
    }

    return this.coreClient.connectExec(this.client.updateResourceClient, {
      resourceId,
      clientId,
      client,
      ...(paths.length > 0 && {
        updateMask: create(FieldMaskSchema, { paths }),
      }),
    });
  }

  /**
   * Permanently deletes an API client scoped to a resource.
   *
   * `DeleteResourceClient` shares its underlying delete path with client
   * deletion in general, so nothing forces the given `clientId` to actually
   * belong to `resourceId` — but this method lives under `this.resources`,
   * so callers reasonably expect it to only ever touch clients within that
   * resource. This fetches the client first and verifies its own
   * `resourceId` matches before deleting, and refuses instead of trusting
   * the id pair blindly.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID to delete
   * @returns Empty response on success; throws if the client does not belong to resourceId
   */
  async deleteResourceClient(
    resourceId: string,
    clientId: string
  ): Promise<DeleteResourceClientResponse> {
    if (!resourceId) throw new Error('resourceId is required');
    if (!clientId) throw new Error('clientId is required');

    const { client } = await this.getResourceClient(resourceId, clientId);
    if (!client || client.resourceId !== resourceId) {
      throw new Error(
        `Client ${clientId} does not belong to resource ${resourceId}`
      );
    }

    return this.coreClient.connectExec(this.client.deleteResourceClient, {
      resourceId,
      clientId,
    });
  }

  /**
   * Lists the end-user consents granted against a resource, with pagination.
   *
   * Each returned consent carries `id`, `externalUserId`, `clientId`,
   * `clientName`, `scopes` and `grantedAt`. The response also carries
   * `totalSize` plus `nextPageToken` / `prevPageToken` cursors.
   *
   * Pass `userIds` to match specific users exactly, or `search` for a
   * case-insensitive substring match. When both are given, `userIds` wins and
   * `search` is ignored.
   *
   * @param resourceId - The resource whose consents to list (format: res_xxxxx)
   * @param options - Optional filter, search and pagination options
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
      ...(options?.userIds?.length && {
        filter: { externalUserId: options.userIds },
      }),
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
  ResourceUserConsentFilter,
  ListResourceUserConsentsResponse,
  RevokeUserConsentResponse,
  M2MClient,
  ConsentedUser,
  CreateResourceClientResponse,
  GetResourceClientResponse,
  UpdateResourceClientResponse,
  ListResourceClientsResponse,
  DeleteResourceClientResponse,
};
