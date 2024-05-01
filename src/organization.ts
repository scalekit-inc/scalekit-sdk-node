import { PartialMessage } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { OrganizationService } from './pkg/grpc/scalekit/v1/organizations/organizations_connect';
import { CreateOrganizationResponse, GetOrganizationResponse, ListOrganizationsResponse, UpdateOrganization, UpdateOrganizationResponse } from './pkg/grpc/scalekit/v1/organizations/organizations_pb';

export default class OrganizationClient {
  private client: PromiseClient<typeof OrganizationService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(OrganizationService);
  }

  /** 
  * Create an organization with the given name. Optionally, you can provide an external id.
  * @param {object} options The options to create an organization
  * @param {string} options.name The organization name
  * @param {string} options.externalId The external id
  * @returns {Promise<CreateOrganizationResponse>} The created organization
  */
  async createOrganization(options: { name: string, externalId?: string }): Promise<CreateOrganizationResponse> {
    const { name, externalId } = options;
    return this.coreClient.connectExec(
      this.client.createOrganization,
      {
        organization: {
          displayName: name,
          externalId: externalId
        }
      }
    )
  }

  /**
   * List organizations with pagination
   * @param {object} options The options to list organizations
   * @param {number} options.pageSize The page size
   * @param {string} options.pageToken The page token
   * @returns {Promise<ListOrganizationResponse>} The list of organizations
   */
  async listOrganization(options?: {
    pageSize?: number,
    pageToken?: string
  }): Promise<ListOrganizationsResponse> {
    return this.coreClient.connectExec(
      this.client.listOrganization,
      options ? options : {},
    )
  }

  /**
   * Get an organization by id
   * @param {string} id The organization id
   * @returns {Promise<GetOrganizationResponse>} The organization
   */
  async getOrganization(id: string): Promise<GetOrganizationResponse> {
    return this.coreClient.connectExec(
      this.client.getOrganization,
      { identities: { case: 'id', value: id } },
    )
  }

  /**
   * Get an organization by external id
   * @param {string} externalId The external id
   * @returns {Promise<GetOrganizationResponse>} The organization
   */
  async getOrganizationByExternalId(externalId: string): Promise<GetOrganizationResponse> {
    return this.coreClient.connectExec(
      this.client.getOrganization,
      { identities: { case: 'externalId', value: externalId } },
    )
  }

  /**
   * Update an organization by id
   * @param {string} id The organization id
   * @param {PartialMessage<UpdateOrganization>} organization The organization to update
   * @returns {Promise<UpdateOrganizationResponse>} The updated organization
   */
  async updateOrganization(id: string, organization: PartialMessage<UpdateOrganization>): Promise<UpdateOrganizationResponse> {
    return this.coreClient.connectExec(
      this.client.updateOrganization,
      {
        identities: { case: "id", value: id },
        organization
      },
    )
  }

  /**
   * Update an organization by external id
   * @param {string} externalId The external id
   * @param {PartialMessage<UpdateOrganization>} organization The organization to update
   * @returns {Promise<UpdateOrganizationResponse>} The updated organization   
   */
  async updateOrganizationByExternalId(externalId: string, organization: PartialMessage<UpdateOrganization>): Promise<UpdateOrganizationResponse> {
    return this.coreClient.connectExec(
      this.client.updateOrganization,
      {
        identities: { case: "externalId", value: externalId, },
        organization
      },
    )
  }

  /**
   * Generate Admin portal link for an organization
   * @param organizationId  The organization id
   * @returns {Promise<string>} The customer portal link
   */
  async generatePortalLink(organizationId: string): Promise<string> {
    const response = await this.coreClient.connectExec(
      this.client.generatePortalLink,
      {
        id: organizationId
      },
    )
    if (!response.link) {
      throw new Error('Error generating customer portal link');
    }

    return response.link?.location
  }
}

