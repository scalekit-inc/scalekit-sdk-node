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
const domain_connect_1 = require("./pkg/domain_connect");
class DomainClient {
    constructor(grpcConncet, coreClient) {
        this.grpcConncet = grpcConncet;
        this.coreClient = coreClient;
        this.client = this.grpcConncet.createClient(domain_connect_1.DomainService);
    }
    getDomain(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organizationId } = options;
            return this.coreClient.connectExec(this.client.getDomain, {
                id,
                identities: {
                    case: 'organizationId',
                    value: organizationId
                }
            });
        });
    }
    getDomainByExternalOrganizationId(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, externalId } = options;
            return this.coreClient.connectExec(this.client.getDomain, {
                id,
                identities: {
                    case: 'externalId',
                    value: externalId
                }
            });
        });
    }
    listDomains(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listDomains, {
                identities: {
                    case: 'organizationId',
                    value: organizationId
                }
            });
        });
    }
    listDomainsByExternalOrganizationId(externalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listDomains, {
                identities: {
                    case: 'externalId',
                    value: externalId
                }
            });
        });
    }
}
exports.default = DomainClient;
//# sourceMappingURL=domain.js.map