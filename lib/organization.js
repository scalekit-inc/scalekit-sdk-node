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
const organizations_connect_1 = require("./pkg/organizations_connect");
class OrganizationClient {
    constructor(grpcConncet, coreClient) {
        this.grpcConncet = grpcConncet;
        this.coreClient = coreClient;
        this.client = this.grpcConncet.createClient(organizations_connect_1.OrganizationService);
    }
    listOrganization(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const fn = () => __awaiter(this, void 0, void 0, function* () { return this.client.listOrganization(options ? options : {}); });
            return this.coreClient.retryWithAuthentication(fn);
        });
    }
    getOrganization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fn = () => __awaiter(this, void 0, void 0, function* () {
                return this.client.getOrganization({
                    identities: { case: 'id', value: id }
                });
            });
            return this.coreClient.retryWithAuthentication(fn);
        });
    }
    getOrganizationByExternalId(externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fn = () => __awaiter(this, void 0, void 0, function* () {
                return this.client.getOrganization({
                    identities: { case: 'externalId', value: externalId }
                });
            });
            return this.coreClient.retryWithAuthentication(fn);
        });
    }
    updateOrganization(id, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const fn = () => __awaiter(this, void 0, void 0, function* () {
                return this.client.updateOrganization({
                    identities: { case: "id", value: id },
                    organization
                });
            });
            return this.coreClient.retryWithAuthentication(fn);
        });
    }
    updateOrganizationByExternalId(externalId, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const fn = () => __awaiter(this, void 0, void 0, function* () {
                return this.client.updateOrganization({
                    identities: { case: "externalId", value: externalId, },
                    organization
                });
            });
            return this.coreClient.retryWithAuthentication(fn);
        });
    }
}
exports.default = OrganizationClient;
//# sourceMappingURL=organization.js.map