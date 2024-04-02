import { PartialMessage } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { OrganizationService } from './pkg/organizations_connect';
import { UpdateOrganization } from './pkg/organizations_pb';

export default class OrganizationClient {
  private client: PromiseClient<typeof OrganizationService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(OrganizationService);
  }

  async listOrganization(options?: {
    pageSize?: number,
    pageToken?: string
  }) {
    return this.coreClient.connectExec(
      this.client.listOrganization,
      options ? options : {},
    )
  }

  async getOrganization(id: string) {
    return this.coreClient.connectExec(
      this.client.getOrganization,
      { identities: { case: 'id', value: id } },
    )
  }

  async getOrganizationByExternalId(externalId: string) {
    return this.coreClient.connectExec(
      this.client.getOrganization,
      { identities: { case: 'externalId', value: externalId } },
    )
  }

  async updateOrganization(id: string, organization: PartialMessage<UpdateOrganization>) {
    return this.coreClient.connectExec(
      this.client.updateOrganization,
      {
        identities: { case: "id", value: id },
        organization
      },
    )
  }

  async updateOrganizationByExternalId(externalId: string, organization: PartialMessage<UpdateOrganization>) {
    return this.coreClient.connectExec(
      this.client.updateOrganization,
      {
        identities: { case: "externalId", value: externalId, },
        organization
      },
    )
  }
}

