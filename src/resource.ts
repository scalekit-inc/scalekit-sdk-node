import type { MessageShape } from '@bufbuild/protobuf';
import { create } from '@bufbuild/protobuf';
import { EmptySchema, FieldMaskSchema } from '@bufbuild/protobuf/wkt';
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
  CreateClientSecretResponse,
  Resource,
  Scope,
  ResourceType,
  GetResourceResponse,
  ListResourcesResponse,
} from './pkg/grpc/scalekit/v1/clients/clients_pb';

function toCustomClaims(claims: { [key: string]: string }): CustomClaim[] {
  return Object.entries(claims).map(([key, value]) =>
    create(CustomClaimSchema, { key, value })
  );
}

export interface ListResourcesOptions {
  /** Page size, max 30. */
  pageSize?: number;
  /** Pagination cursor. */
  pageToken?: string;
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
  /** Updated name. An empty string is a no-op server-side, not a clear — the server only applies this field when non-empty. */
  name?: string;
  /** Updated description. An empty string is a no-op server-side, not a clear — the server only applies this field when non-empty. */
  description?: string;
  /** Updated scopes (replaces existing; pass [] to clear) */
  scopes?: string[];
  /** Not settable on update by design — a resource client's audience is fixed to the resource it was created under, so this is a no-op server-side regardless of value. Present here only to mirror the underlying proto shape. */
  audience?: string[];
  /** Custom claims to set (replaces existing; pass {} to clear) */
  customClaims?: { [key: string]: string };
  /** Updated access token lifetime in seconds */
  expiry?: number;
  /** Updated redirect URIs (replaces existing; pass [] to clear) */
  redirectUris?: string[];
}

/**
 * Client for reading resources, managing the API clients scoped to a
 * resource, and reading and revoking end-user consents granted against one.
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
   * Retrieves a single resource by id.
   *
   * A resource client's `scopes` are only actually granted in an issued
   * token when they also appear in the resource's own `scopes` allowlist
   * (the server intersects requested scopes against the environment's
   * permissions, the resource's allowed scopes, and the client's own
   * scopes) — call this first to see what the resource actually allows
   * before creating or updating a resource client with `scopes`.
   *
   * @param resourceId - The resource to fetch (format: res_xxxxx)
   * @returns GetResourceResponse with the resource, including its allowed `scopes`
   */
  async getResource(resourceId: string): Promise<GetResourceResponse> {
    if (!resourceId) throw new Error('resourceId is required');
    return this.coreClient.connectExec(this.client.getResource, {
      resourceId,
    });
  }

  /**
   * Lists resources of a given type in the environment, with pagination.
   *
   * `resourceType` is required by the underlying API — there is no way to
   * list every type in one call; list each type separately if needed.
   *
   * @param resourceType - The resource type to filter by (e.g. ResourceType.MCP_SERVER)
   * @param options - Optional pagination options
   * @returns ListResourcesResponse with resources array and pagination cursors
   */
  async listResources(
    resourceType: ResourceType,
    options?: ListResourcesOptions
  ): Promise<ListResourcesResponse> {
    return this.coreClient.connectExec(this.client.listResources, {
      resourceType,
      ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
      ...(options?.pageToken && { pageToken: options.pageToken }),
    });
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
   * from those same fields is sent alongside the partial `client` payload, but
   * the server only honors that mask for `scopes`, `customClaims` and
   * `redirectUris` — pass an empty value (e.g. `scopes: []`) to clear one of
   * those. `name` and `description` are applied only when non-empty (an empty
   * string is a no-op, not a clear). `audience` cannot be changed here at all
   * — a resource client's audience is fixed to the resource it belongs to, by
   * design, not something this call can widen or repoint.
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
   * Creates a new secret for an API client scoped to a resource.
   *
   * The underlying secret-creation call is keyed by `clientId` alone — it has
   * no notion of a resource — so this fetches the client first and verifies
   * it belongs to `resourceId` before creating a secret for it, the same
   * ownership check `deleteResourceClient` applies.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID to create a secret for
   * @returns CreateClientSecretResponse with the new secret's plainSecret and metadata; throws if the client does not belong to resourceId
   */
  async createResourceClientSecret(
    resourceId: string,
    clientId: string
  ): Promise<CreateClientSecretResponse> {
    if (!resourceId) throw new Error('resourceId is required');
    if (!clientId) throw new Error('clientId is required');

    const { client } = await this.getResourceClient(resourceId, clientId);
    if (!client || client.resourceId !== resourceId) {
      throw new Error(
        `Client ${clientId} does not belong to resource ${resourceId}`
      );
    }

    return this.coreClient.connectExec(this.client.createClientSecret, {
      clientId,
    });
  }

  /**
   * Permanently deletes a secret from an API client scoped to a resource.
   *
   * Like `createResourceClientSecret`, the underlying delete call is keyed by
   * `clientId` alone, so this verifies the client belongs to `resourceId`
   * first rather than trusting the id pair blindly.
   *
   * @param resourceId - The resource the client must belong to (format: res_xxxxx)
   * @param clientId - The client ID the secret belongs to
   * @param secretId - The secret ID to delete
   * @returns Empty response on success; throws if the client does not belong to resourceId
   */
  async deleteResourceClientSecret(
    resourceId: string,
    clientId: string,
    secretId: string
  ): Promise<MessageShape<typeof EmptySchema>> {
    if (!resourceId) throw new Error('resourceId is required');
    if (!clientId) throw new Error('clientId is required');
    if (!secretId) throw new Error('secretId is required');

    const { client } = await this.getResourceClient(resourceId, clientId);
    if (!client || client.resourceId !== resourceId) {
      throw new Error(
        `Client ${clientId} does not belong to resource ${resourceId}`
      );
    }

    return this.coreClient.connectExec(this.client.deleteClientSecret, {
      clientId,
      secretId,
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
  CreateClientSecretResponse,
  Resource,
  Scope,
  ResourceType,
  GetResourceResponse,
  ListResourcesResponse,
};
