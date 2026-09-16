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
exports.ResourceType = void 0;
const protobuf_1 = require("@bufbuild/protobuf");
const wkt_1 = require("@bufbuild/protobuf/wkt");
const clients_pb_1 = require("./pkg/grpc/scalekit/v1/clients/clients_pb");
Object.defineProperty(exports, "ResourceType", { enumerable: true, get: function () { return clients_pb_1.ResourceType; } });
function toCustomClaims(claims) {
    return Object.entries(claims).map(([key, value]) => (0, protobuf_1.create)(clients_pb_1.CustomClaimSchema, { key, value }));
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
class ResourceClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(clients_pb_1.ClientService);
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
    getResource(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!resourceId)
                throw new Error('resourceId is required');
            return this.coreClient.connectExec(this.client.getResource, {
                resourceId,
            });
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
    listResources(resourceType, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listResources, Object.assign(Object.assign({ resourceType }, ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined && { pageSize: options.pageSize })), ((options === null || options === void 0 ? void 0 : options.pageToken) && { pageToken: options.pageToken })));
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
    createResourceClient(resourceId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!resourceId)
                throw new Error('resourceId is required');
            return this.coreClient.connectExec(this.client.createResourceClient, {
                resourceId,
                client: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.name) && { name: options.name })), ((options === null || options === void 0 ? void 0 : options.description) && { description: options.description })), ((options === null || options === void 0 ? void 0 : options.scopes) && { scopes: options.scopes })), ((options === null || options === void 0 ? void 0 : options.audience) && { audience: options.audience })), ((options === null || options === void 0 ? void 0 : options.customClaims) && {
                    customClaims: toCustomClaims(options.customClaims),
                })), ((options === null || options === void 0 ? void 0 : options.expiry) !== undefined && {
                    expiry: BigInt(options.expiry),
                })), ((options === null || options === void 0 ? void 0 : options.redirectUris) && { redirectUris: options.redirectUris })),
            });
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
    getResourceClient(resourceId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!resourceId)
                throw new Error('resourceId is required');
            if (!clientId)
                throw new Error('clientId is required');
            return this.coreClient.connectExec(this.client.getResourceClient, {
                resourceId,
                clientId,
            });
        });
    }
    /**
     * Lists every API client scoped to a resource.
     *
     * @param resourceId - The resource whose clients to list (format: res_xxxxx)
     * @returns ListResourceClientsResponse with clients array and DCR/static client counts
     */
    listResourceClients(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!resourceId)
                throw new Error('resourceId is required');
            return this.coreClient.connectExec(this.client.listResourceClients, {
                resourceId,
            });
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
    updateResourceClient(resourceId, clientId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!resourceId)
                throw new Error('resourceId is required');
            if (!clientId)
                throw new Error('clientId is required');
            const paths = [];
            const client = {};
            if ((options === null || options === void 0 ? void 0 : options.name) !== undefined) {
                client.name = options.name;
                paths.push('name');
            }
            if ((options === null || options === void 0 ? void 0 : options.description) !== undefined) {
                client.description = options.description;
                paths.push('description');
            }
            if ((options === null || options === void 0 ? void 0 : options.scopes) !== undefined) {
                client.scopes = options.scopes;
                paths.push('scopes');
            }
            if ((options === null || options === void 0 ? void 0 : options.audience) !== undefined) {
                client.audience = options.audience;
                paths.push('audience');
            }
            if ((options === null || options === void 0 ? void 0 : options.customClaims) !== undefined) {
                client.customClaims = toCustomClaims(options.customClaims);
                paths.push('custom_claims');
            }
            if ((options === null || options === void 0 ? void 0 : options.expiry) !== undefined) {
                client.expiry = BigInt(options.expiry);
                paths.push('expiry');
            }
            if ((options === null || options === void 0 ? void 0 : options.redirectUris) !== undefined) {
                client.redirectUris = options.redirectUris;
                paths.push('redirect_uris');
            }
            return this.coreClient.connectExec(this.client.updateResourceClient, Object.assign({ resourceId,
                clientId,
                client }, (paths.length > 0 && {
                updateMask: (0, protobuf_1.create)(wkt_1.FieldMaskSchema, { paths }),
            })));
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
    deleteResourceClient(resourceId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!resourceId)
                throw new Error('resourceId is required');
            if (!clientId)
                throw new Error('clientId is required');
            const { client } = yield this.getResourceClient(resourceId, clientId);
            if (!client || client.resourceId !== resourceId) {
                throw new Error(`Client ${clientId} does not belong to resource ${resourceId}`);
            }
            return this.coreClient.connectExec(this.client.deleteResourceClient, {
                resourceId,
                clientId,
            });
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
     * The backend caps how many secrets a client can hold at once (a
     * configurable limit — 5 in Scalekit's own dev environment, verified live;
     * treat the exact number as environment-specific, not a fixed constant).
     * Exceeding it throws (the server rejects it as INVALID_ARGUMENT, "only N
     * secrets are allowed") — delete an existing secret first via
     * `deleteResourceClientSecret`. The dashboard itself is more conservative
     * than the server limit: it only shows an "Add new secret" action while a
     * client has fewer than 2 secrets. Match whichever threshold — the actual
     * server limit or the dashboard's stricter 2 — fits your own UX.
     *
     * @param resourceId - The resource the client must belong to (format: res_xxxxx)
     * @param clientId - The client ID to create a secret for
     * @returns CreateClientSecretResponse with the new secret's plainSecret and metadata; throws if the client does not belong to resourceId
     */
    createResourceClientSecret(resourceId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!resourceId)
                throw new Error('resourceId is required');
            if (!clientId)
                throw new Error('clientId is required');
            const { client } = yield this.getResourceClient(resourceId, clientId);
            if (!client || client.resourceId !== resourceId) {
                throw new Error(`Client ${clientId} does not belong to resource ${resourceId}`);
            }
            return this.coreClient.connectExec(this.client.createClientSecret, {
                clientId,
            });
        });
    }
    /**
     * Permanently deletes a secret from an API client scoped to a resource.
     *
     * Like `createResourceClientSecret`, the underlying delete call is keyed by
     * `clientId` alone, so this verifies the client belongs to `resourceId`
     * first rather than trusting the id pair blindly.
     *
     * A client must always keep at least 1 secret. Calling this on a client's
     * last remaining secret throws (the server rejects it as INVALID_ARGUMENT,
     * "at least one secret is required"). Mirror the dashboard's own UX: only
     * offer a "Revoke" action on a secret while the client has more than 1.
     *
     * @param resourceId - The resource the client must belong to (format: res_xxxxx)
     * @param clientId - The client ID the secret belongs to
     * @param secretId - The secret ID to delete
     * @returns Empty response on success; throws if the client does not belong to resourceId
     */
    deleteResourceClientSecret(resourceId, clientId, secretId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!resourceId)
                throw new Error('resourceId is required');
            if (!clientId)
                throw new Error('clientId is required');
            if (!secretId)
                throw new Error('secretId is required');
            const { client } = yield this.getResourceClient(resourceId, clientId);
            if (!client || client.resourceId !== resourceId) {
                throw new Error(`Client ${clientId} does not belong to resource ${resourceId}`);
            }
            return this.coreClient.connectExec(this.client.deleteClientSecret, {
                clientId,
                secretId,
            });
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
    listUserConsents(resourceId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!resourceId)
                throw new Error('resourceId is required');
            return this.coreClient.connectExec(this.client.listResourceUserConsents, Object.assign(Object.assign(Object.assign(Object.assign({ resourceId }, ((options === null || options === void 0 ? void 0 : options.search) && { search: options.search })), ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined && { pageSize: options.pageSize })), ((options === null || options === void 0 ? void 0 : options.pageToken) && { pageToken: options.pageToken })), (((_a = options === null || options === void 0 ? void 0 : options.userIds) === null || _a === void 0 ? void 0 : _a.length) && {
                filter: { externalUserId: options.userIds },
            })));
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
    revokeUserConsent(clientId, consentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!clientId)
                throw new Error('clientId is required');
            if (!consentId)
                throw new Error('consentId is required');
            return this.coreClient.connectExec(this.client.revokeUserConsent, {
                clientId,
                consentId,
            });
        });
    }
}
exports.default = ResourceClient;
//# sourceMappingURL=resource.js.map