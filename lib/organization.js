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
const organizations_connect_1 = require("./pkg/grpc/scalekit/v1/organizations/organizations_connect");
class OrganizationClient {
    constructor(grpcConncet, coreClient) {
        this.grpcConncet = grpcConncet;
        this.coreClient = coreClient;
        this.client = this.grpcConncet.createClient(organizations_connect_1.OrganizationService);
    }
    /**
    * Create an organization with the given name. Optionally, you can provide an external id.
    * @param {string} name The organization name
    * @param {object} options The options to create an organization
    * @param {string} options.externalId The external id
    * @returns {Promise<CreateOrganizationResponse>} The created organization
    */
    createOrganization(name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.createOrganization, {
                organization: Object.assign({ displayName: name }, ((options === null || options === void 0 ? void 0 : options.externalId) && {
                    externalId: options.externalId
                }))
            });
        });
    }
    /**
     * List organizations with pagination
     * @param {object} options The options to list organizations
     * @param {number} options.pageSize The page size
     * @param {string} options.pageToken The page token
     * @returns {Promise<ListOrganizationResponse>} The list of organizations
     */
    listOrganization(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listOrganization, options ? options : {});
        });
    }
    /**
     * Get an organization by id
     * @param {string} id The organization id
     * @returns {Promise<GetOrganizationResponse>} The organization
     */
    getOrganization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getOrganization, { identities: { case: 'id', value: id } });
        });
    }
    /**
     * Get an organization by external id
     * @param {string} externalId The external id
     * @returns {Promise<GetOrganizationResponse>} The organization
     */
    getOrganizationByExternalId(externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getOrganization, { identities: { case: 'externalId', value: externalId } });
        });
    }
    /**
     * Update an organization by id
     * @param {string} id The organization id
     * @param {PartialMessage<UpdateOrganization>} organization The organization to update
     * @returns {Promise<UpdateOrganizationResponse>} The updated organization
     */
    updateOrganization(id, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.updateOrganization, {
                identities: { case: "id", value: id },
                organization
            });
        });
    }
    /**
     * Update an organization by external id
     * @param {string} externalId The external id
     * @param {PartialMessage<UpdateOrganization>} organization The organization to update
     * @returns {Promise<UpdateOrganizationResponse>} The updated organization
     */
    updateOrganizationByExternalId(externalId, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.updateOrganization, {
                identities: { case: "externalId", value: externalId, },
                organization
            });
        });
    }
    /**
     * Delete an organization by id
     * @param {string} organizationId The organization id
     * @returns {Promise<Empty>} Returns nothing
     */
    deleteOrganization(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteOrganization, {
                identities: { case: "id", value: organizationId, },
            });
        });
    }
    /**
     * Generate admin portal link for an organization
     * @param organizationId  The organization id
     * @returns {Promise<Link>} The admin portal link object with expiration time and location
     */
    generatePortalLink(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.coreClient.connectExec(this.client.generatePortalLink, {
                id: organizationId
            });
            if (!response.link) {
                throw new Error('Error generating portal link');
            }
            return response.link;
        });
    }
    /**
     * Get admin portal links for an organization
     * @param organizationId  The organization id
     * @returns {Promise<Link[]>} The admin portal link object with expiration time and location
     */
    getPortalLinks(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.coreClient.connectExec(this.client.getPortalLinks, {
                id: organizationId
            });
            return response.links;
        });
    }
    /**
     * Delete admin portal link for an organization
     * @param organizationId  The organization id
     * @param linkId The link id
     * @returns {Promise<Empty>} Returns nothing
     */
    deletePortalLink(organizationId, linkId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deletePortalLink, {
                id: organizationId,
                linkId
            });
        });
    }
}
exports.default = OrganizationClient;
//# sourceMappingURL=organization.js.map