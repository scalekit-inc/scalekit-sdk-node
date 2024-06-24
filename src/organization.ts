import { Empty, PartialMessage } from '@bufbuild/protobuf';
import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { OrganizationService } from './pkg/grpc/scalekit/v1/organizations/organizations_connect';
import { CreateOrganizationResponse, GetOrganizationResponse, Link, ListOrganizationsResponse, UpdateOrganization, UpdateOrganizationResponse } from './pkg/grpc/scalekit/v1/organizations/organizations_pb';

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
  * @param {string} name The organization name
  * @param {object} options The options to create an organization
  * @param {string} options.externalId The external id
  * @returns {Promise<CreateOrganizationResponse>} The created organization
  */
  async createOrganization(name: string, options?: { externalId?: string }): Promise<CreateOrganizationResponse> {
    return this.coreClient.connectExec(
      this.client.createOrganization,
      {
        organization: {
          displayName: name,
          ...(options?.externalId && {
            externalId: options.externalId
          })
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
   * Delete an organization by id
   * @param {string} organizationId The organization id
   * @returns {Promise<Empty>} Returns nothing
   */
  async deleteOrganization(organizationId: string): Promise<Empty> {
    return this.coreClient.connectExec(
      this.client.deleteOrganization,
      {
        identities: { case: "id", value: organizationId, },
      },
    )
  }

  /**
   * Generate admin portal link for an organization
   * @param organizationId  The organization id
   * @returns {Promise<Link>} The admin portal link object with expiration time and location
   */
  async generatePortalLink(organizationId: string): Promise<Link> {
    const response = await this.coreClient.connectExec(
      this.client.generatePortalLink,
      {
        id: organizationId
      },
    )
    if (!response.link) {
      throw new Error('Error generating portal link');
    }

    return response.link
  }

  /**
   * Get admin portal links for an organization
   * @param organizationId  The organization id
   * @returns {Promise<Link[]>} The admin portal link object with expiration time and location
   */
  async getPortalLinks(organizationId: string): Promise<Link[]> {
    const response = await this.coreClient.connectExec(
      this.client.getPortalLinks,
      {
        id: organizationId
      },
    )

    return response.links
  }

  /**
   * Delete admin portal link for an organization
   * @param organizationId  The organization id
   * @param linkId The link id
   * @returns {Promise<Empty>} Returns nothing
   */
  async deletePortalLink(organizationId: string, linkId: string): Promise<Empty> {
    return this.coreClient.connectExec(
      this.client.deletePortalLink,
      {
        id: organizationId,
        linkId
      },
    )
  }
}

