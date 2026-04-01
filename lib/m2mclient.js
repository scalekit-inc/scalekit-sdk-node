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
const clients_pb_1 = require("./pkg/grpc/scalekit/v1/clients/clients_pb");
function toCustomClaims(claims) {
    return Object.entries(claims).map(([key, value]) => (0, protobuf_1.create)(clients_pb_1.CustomClaimSchema, { key, value }));
}
/**
 * Client for managing M2M (machine-to-machine) API clients per organization.
 *
 * Each organization client represents an automated system credential scoped
 * to one organization, using the client_credentials OAuth flow.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const m2m = scalekitClient.m2m;
 *
 * @see {@link https://docs.scalekit.com/m2m/overview | M2M Documentation}
 */
class M2MClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(clients_pb_1.ClientService);
    }
    /**
     * Creates a new M2M API client for an organization.
     *
     * Returns a `clientId` and a plain `secret` (only available at creation time).
     *
     * @param organizationId - The organization to create the client for
     * @param options - Optional client properties (name, description, customClaims, audience, scopes)
     * @returns CreateOrganizationClientResponse with clientId, secret, and client metadata
     */
    createOrganizationClient(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId)
                throw new Error('organizationId is required');
            return this.coreClient.connectExec(this.client.createOrganizationClient, {
                organizationId,
                client: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.name) && { name: options.name })), ((options === null || options === void 0 ? void 0 : options.description) && { description: options.description })), ((options === null || options === void 0 ? void 0 : options.customClaims) && {
                    customClaims: toCustomClaims(options.customClaims),
                })), ((options === null || options === void 0 ? void 0 : options.audience) && { audience: options.audience })), ((options === null || options === void 0 ? void 0 : options.scopes) && { scopes: options.scopes })),
            });
        });
    }
    /**
     * Retrieves details of a specific M2M client for an organization.
     *
     * @param organizationId - The organization ID
     * @param clientId - The client ID (format: skc_xxxxx)
     * @returns GetOrganizationClientResponse with client metadata and active secrets (values hidden)
     */
    getOrganizationClient(organizationId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId)
                throw new Error('organizationId is required');
            if (!clientId)
                throw new Error('clientId is required');
            return this.coreClient.connectExec(this.client.getOrganizationClient, {
                organizationId,
                clientId,
            });
        });
    }
    /**
     * Updates the configuration of an existing M2M client.
     *
     * @param organizationId - The organization ID
     * @param clientId - The client ID to update
     * @param options - Fields to update (name, description, customClaims, audience, scopes)
     * @returns UpdateOrganizationClientResponse with updated client metadata
     */
    updateOrganizationClient(organizationId, clientId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId)
                throw new Error('organizationId is required');
            if (!clientId)
                throw new Error('clientId is required');
            return this.coreClient.connectExec(this.client.updateOrganizationClient, {
                organizationId,
                clientId,
                client: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.name) && { name: options.name })), ((options === null || options === void 0 ? void 0 : options.description) && { description: options.description })), ((options === null || options === void 0 ? void 0 : options.customClaims) && {
                    customClaims: toCustomClaims(options.customClaims),
                })), ((options === null || options === void 0 ? void 0 : options.audience) && { audience: options.audience })), ((options === null || options === void 0 ? void 0 : options.scopes) && { scopes: options.scopes })),
            });
        });
    }
    /**
     * Permanently deletes an M2M client from an organization.
     *
     * This operation cannot be undone. All associated secrets are invalidated.
     *
     * @param organizationId - The organization ID
     * @param clientId - The client ID to delete
     * @returns Empty response on success
     */
    deleteOrganizationClient(organizationId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId)
                throw new Error('organizationId is required');
            if (!clientId)
                throw new Error('clientId is required');
            return this.coreClient.connectExec(this.client.deleteOrganizationClient, {
                organizationId,
                clientId,
            });
        });
    }
    /**
     * Adds a new secret to an M2M client.
     *
     * The plain secret value is returned only at creation time and cannot be retrieved again.
     *
     * @param organizationId - The organization ID
     * @param clientId - The client ID to add a secret to
     * @returns CreateOrganizationClientSecretResponse with secretId and plain secret
     */
    addOrganizationClientSecret(organizationId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId)
                throw new Error('organizationId is required');
            if (!clientId)
                throw new Error('clientId is required');
            return this.coreClient.connectExec(this.client.createOrganizationClientSecret, { organizationId, clientId });
        });
    }
    /**
     * Permanently removes a secret from an M2M client.
     *
     * @param organizationId - The organization ID
     * @param clientId - The client ID
     * @param secretId - The secret ID to remove
     * @returns Empty response on success
     */
    removeOrganizationClientSecret(organizationId, clientId, secretId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId)
                throw new Error('organizationId is required');
            if (!clientId)
                throw new Error('clientId is required');
            if (!secretId)
                throw new Error('secretId is required');
            return this.coreClient.connectExec(this.client.deleteOrganizationClientSecret, { organizationId, clientId, secretId });
        });
    }
    /**
     * Lists all M2M clients for an organization with pagination.
     *
     * @param organizationId - The organization ID
     * @param options - Optional pagination options (pageSize 10–100, pageToken)
     * @returns ListOrganizationClientsResponse with clients array and pagination cursors
     */
    listOrganizationClients(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organizationId)
                throw new Error('organizationId is required');
            return this.coreClient.connectExec(this.client.listOrganizationClients, Object.assign(Object.assign({ organizationId }, ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined && { pageSize: options.pageSize })), ((options === null || options === void 0 ? void 0 : options.pageToken) && { pageToken: options.pageToken })));
        });
    }
}
exports.default = M2MClient;
//# sourceMappingURL=m2mclient.js.map