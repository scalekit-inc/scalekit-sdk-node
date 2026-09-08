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
const clients_pb_1 = require("./pkg/grpc/scalekit/v1/clients/clients_pb");
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
class ResourceClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(clients_pb_1.ClientService);
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