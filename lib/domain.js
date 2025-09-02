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
const domains_connect_1 = require("./pkg/grpc/scalekit/v1/domains/domains_connect");
const domains_pb_1 = require("./pkg/grpc/scalekit/v1/domains/domains_pb");
class DomainClient {
    constructor(grpcConncet, coreClient) {
        this.grpcConncet = grpcConncet;
        this.coreClient = coreClient;
        this.client = this.grpcConncet.createClient(domains_connect_1.DomainService);
    }
    /**
     * Create a domain for an organization with the given name. Optionally, you can provide an external id.
     * @param {string} organizationId  The organization id
     * @param {string} name The domain name
     * @param {object} options The options to create a domain
     * @param {DomainType | string} options.domainType The type of domain (ALLOWED_EMAIL_DOMAIN or ORGANIZATION_DOMAIN)
     * @returns {Promise<CreateDomainResponse>} The created domain
    */
    createDomain(organizationId, name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let domainTypeValue;
            if (options === null || options === void 0 ? void 0 : options.domainType) {
                if (typeof options.domainType === 'string') {
                    domainTypeValue = domains_pb_1.DomainType[options.domainType];
                    if (domainTypeValue === undefined) {
                        throw new Error('Invalid domain type');
                    }
                }
                else {
                    domainTypeValue = options.domainType;
                }
            }
            return this.coreClient.connectExec(this.client.createDomain, {
                identities: {
                    case: 'organizationId',
                    value: organizationId
                },
                domain: Object.assign({ domain: name }, (domainTypeValue && { domainType: domainTypeValue }))
            });
        });
    }
    /**
     * Get a specific domain by ID for an organization
     * @param organizationId The organization id
     * @param domainId The domain id
     * @returns {Promise<GetDomainResponse>} The domain details
     */
    getDomain(organizationId, domainId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getDomain, {
                id: domainId,
                identities: {
                    case: 'organizationId',
                    value: organizationId
                }
            });
        });
    }
    /**
     * List domains for an organization
     * @param organizationId The organization id
     * @returns {Promise<ListDomainResponse>} The list of domains for the organization
     */
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
    deleteDomain(organizationId, domainId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteDomain, {
                id: domainId,
                identities: {
                    case: 'organizationId',
                    value: organizationId
                }
            });
        });
    }
}
exports.default = DomainClient;
//# sourceMappingURL=domain.js.map