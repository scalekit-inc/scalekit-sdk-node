import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import { OrganizationService } from './pkg/organizations_connect';
import { PartialMessage } from '@bufbuild/protobuf';
import { UpdateOrganization } from './pkg/organizations_pb';
import CoreClient from './core';

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
    const fn = async () => this.client.listOrganization(options ? options : {});
    return this.coreClient.retryWithAuthentication(fn)
  }

  async getOrganization(id: string) {
    const fn = async () => this.client.getOrganization({
      identities: { case: 'id', value: id }
    });
    return this.coreClient.retryWithAuthentication(fn)
  }

  async getOrganizationByExternalId(externalId: string) {
    const fn = async () => this.client.getOrganization({
      identities: { case: 'externalId', value: externalId }
    });
    return this.coreClient.retryWithAuthentication(fn)
  }

  async updateOrganization(id: string, organization: PartialMessage<UpdateOrganization>) {
    const fn = async () => this.client.updateOrganization({
      identities: { case: "id", value: id },
      organization
    })
    return this.coreClient.retryWithAuthentication(fn)
  }

  async updateOrganizationByExternalId(externalId: string, organization: PartialMessage<UpdateOrganization>) {
    const fn = async () => this.client.updateOrganization({
      identities: { case: "externalId", value: externalId, },
      organization
    })

    return this.coreClient.retryWithAuthentication(fn)
  }
}

