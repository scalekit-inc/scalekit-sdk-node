import type { MessageShape } from '@bufbuild/protobuf';
import { EmptySchema } from '@bufbuild/protobuf/wkt';
import GrpcConnect from './connect';
import CoreClient from './core';
import { ResourceUserConsent, ResourceUserConsentFilter, ListResourceUserConsentsResponse, RevokeUserConsentResponse, M2MClient, ConsentedUser, CreateResourceClientResponse, GetResourceClientResponse, UpdateResourceClientResponse, ListResourceClientsResponse, DeleteResourceClientResponse, CreateClientSecretResponse, Resource, Scope, ResourceType, GetResourceResponse, ListResourcesResponse } from './pkg/grpc/scalekit/v1/clients/clients_pb';
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
    customClaims?: {
        [key: string]: string;
    };
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
    customClaims?: {
        [key: string]: string;
    };
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
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
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
    getResource(resourceId: string): Promise<GetResourceResponse>;
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
    listResources(resourceType: ResourceType, options?: ListResourcesOptions): Promise<ListResourcesResponse>;
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
    createResourceClient(resourceId: string, options?: CreateResourceClientOptions): Promise<CreateResourceClientResponse>;
    /**
     * Retrieves a single API client scoped to a resource, along with the
     * end-users who have granted it consent.
     *
     * @param resourceId - The resource the client must belong to (format: res_xxxxx)
     * @param clientId - The client ID (format: m2m_xxxxx)
     * @returns GetResourceClientResponse with client metadata and consentedUsers
     */
    getResourceClient(resourceId: string, clientId: string): Promise<GetResourceClientResponse>;
    /**
     * Lists every API client scoped to a resource.
     *
     * @param resourceId - The resource whose clients to list (format: res_xxxxx)
     * @returns ListResourceClientsResponse with clients array and DCR/static client counts
     */
    listResourceClients(resourceId: string): Promise<ListResourceClientsResponse>;
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
    updateResourceClient(resourceId: string, clientId: string, options?: UpdateResourceClientOptions): Promise<UpdateResourceClientResponse>;
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
    deleteResourceClient(resourceId: string, clientId: string): Promise<DeleteResourceClientResponse>;
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
    createResourceClientSecret(resourceId: string, clientId: string): Promise<CreateClientSecretResponse>;
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
    deleteResourceClientSecret(resourceId: string, clientId: string, secretId: string): Promise<MessageShape<typeof EmptySchema>>;
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
    listUserConsents(resourceId: string, options?: ListUserConsentsOptions): Promise<ListResourceUserConsentsResponse>;
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
    revokeUserConsent(clientId: string, consentId: string): Promise<RevokeUserConsentResponse>;
}
export { ResourceUserConsent, ResourceUserConsentFilter, ListResourceUserConsentsResponse, RevokeUserConsentResponse, M2MClient, ConsentedUser, CreateResourceClientResponse, GetResourceClientResponse, UpdateResourceClientResponse, ListResourceClientsResponse, DeleteResourceClientResponse, CreateClientSecretResponse, Resource, Scope, ResourceType, GetResourceResponse, ListResourcesResponse, };
