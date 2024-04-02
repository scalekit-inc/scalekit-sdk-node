import { PartialMessage } from '@bufbuild/protobuf';
import GrpcConnect from './connect';
import CoreClient from './core';
import { UpdateOrganization } from './pkg/organizations_pb';
export default class OrganizationClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    listOrganization(options?: {
        pageSize?: number;
        pageToken?: string;
    }): Promise<import("./pkg/organizations_pb").ListOrganizationsResponse>;
    getOrganization(id: string): Promise<import("./pkg/organizations_pb").GetOrganizationResponse>;
    getOrganizationByExternalId(externalId: string): Promise<import("./pkg/organizations_pb").GetOrganizationResponse>;
    updateOrganization(id: string, organization: PartialMessage<UpdateOrganization>): Promise<import("./pkg/organizations_pb").UpdateOrganizationResponse>;
    updateOrganizationByExternalId(externalId: string, organization: PartialMessage<UpdateOrganization>): Promise<import("./pkg/organizations_pb").UpdateOrganizationResponse>;
}
