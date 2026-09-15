import GrpcConnect from './connect';
import CoreClient from './core';
import { ResourceUserConsent, ResourceUserConsentFilter, ListResourceUserConsentsResponse, RevokeUserConsentResponse, M2MClient, ConsentedUser, CreateResourceClientResponse, GetResourceClientResponse, UpdateResourceClientResponse, ListResourceClientsResponse, DeleteResourceClientResponse } from './pkg/grpc/scalekit/v1/clients/clients_pb';
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
    /** Updated name */
    name?: string;
    /** Updated description */
    description?: string;
    /** Updated scopes (replaces existing) */
    scopes?: string[];
    /** Updated audience values (replaces existing) */
    audience?: string[];
    /** Custom claims to set (replaces existing) */
    customClaims?: {
        [key: string]: string;
    };
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
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
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
     * from those same fields is sent alongside the partial `client` payload, so
     * the server never mistakes "not passed" for "clear this field" — pass an
     * empty array (e.g. `scopes: []`) to clear a field instead of omitting it.
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
export { ResourceUserConsent, ResourceUserConsentFilter, ListResourceUserConsentsResponse, RevokeUserConsentResponse, M2MClient, ConsentedUser, CreateResourceClientResponse, GetResourceClientResponse, UpdateResourceClientResponse, ListResourceClientsResponse, DeleteResourceClientResponse, };
