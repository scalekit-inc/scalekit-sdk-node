import { Empty, PartialMessage } from '@bufbuild/protobuf';
import GrpcConnect from './connect';
import CoreClient from './core';
import { CreateOrganizationResponse, GetOrganizationResponse, Link, ListOrganizationsResponse, OrganizationUserManagementSettings as OrganizationUserManagementSettingsMessage, UpdateOrganization, UpdateOrganizationResponse } from './pkg/grpc/scalekit/v1/organizations/organizations_pb';
import { OrganizationSettings, OrganizationUserManagementSettingsInput } from './types/organization';
/**
 * Client for managing organizations (tenants) in your Scalekit application.
 *
 * Organizations represent your B2B customers or tenants. Each organization can have
 * its own SSO connections, users, and settings. Use this client to perform CRUD
 * operations on organizations and manage organization-level configurations.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const orgClient = scalekitClient.organization;
 *
 * @see {@link https://docs.scalekit.com/apis/organization | Organization API Documentation}
 */
export default class OrganizationClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
    /**
     * Creates a new organization (tenant) in your Scalekit application.
     *
     * Organizations represent your B2B customers. Each organization can have its own
     * SSO connections, users, and configuration. Use the external ID to map Scalekit
     * organizations to your internal system's identifiers.
     *
     * @param {string} name - Display name for the organization (e.g., "Acme Corporation")
     * @param {object} [options] - Optional configuration
     * @param {string} [options.externalId] - Your system's unique identifier for this organization.
     *                                        Useful for mapping to your internal database.
     *
     * @returns {Promise<CreateOrganizationResponse>} The created organization with:
     *   - id: Scalekit's unique organization identifier
     *   - displayName: The organization's name
     *   - externalId: Your external identifier (if provided)
     *   - createTime: When the organization was created
     *   - updateTime: When the organization was last updated
     *
     * @example
     * // Create a basic organization
     * const org = await scalekitClient.organization.createOrganization('Acme Corp');
     * console.log('Organization ID:', org.organization.id);
     *
     * @example
     * // Create organization with external ID mapping
     * const org = await scalekitClient.organization.createOrganization(
     *   'Acme Corporation',
     *   { externalId: 'customer_12345' }
     * );
     * // Now you can look up this organization using either Scalekit ID or your external ID
     *
     * @see {@link https://docs.scalekit.com/apis/organization#create-organization | Create Organization API}
     * @see {@link getOrganization} - Retrieve organization by Scalekit ID
     * @see {@link getOrganizationByExternalId} - Retrieve organization by your external ID
     */
    createOrganization(name: string, options?: {
        externalId?: string;
    }): Promise<CreateOrganizationResponse>;
    /**
     * Retrieves a paginated list of all organizations in your Scalekit environment.
     *
     * This method returns all organizations with support for pagination. Use this to
     * display a list of your B2B customers, search for organizations, or perform bulk operations.
     *
     * @param {object} [options] - Optional pagination parameters
     * @param {number} [options.pageSize] - Number of organizations to return per page (default: 10, max: 100)
     * @param {string} [options.pageToken] - Token for retrieving the next page of results.
     *                                       Obtained from the previous response's nextPageToken.
     *
     * @returns {Promise<ListOrganizationsResponse>} Response containing:
     *   - organizations: Array of organization objects
     *   - nextPageToken: Token for fetching the next page (empty if no more pages)
     *   - totalSize: Total number of organizations
     *
     * @example
     * // List first page of organizations
     * const response = await scalekitClient.organization.listOrganization({
     *   pageSize: 20
     * });
     *
     * console.log('Organizations:', response.organizations);
     * console.log('Total:', response.totalSize);
     *
     * @example
     * // Paginate through all organizations
     * let pageToken = undefined;
     * let allOrgs = [];
     *
     * do {
     *   const response = await scalekitClient.organization.listOrganization({
     *     pageSize: 50,
     *     pageToken
     *   });
     *
     *   allOrgs.push(...response.organizations);
     *   pageToken = response.nextPageToken;
     * } while (pageToken);
     *
     * console.log('Fetched all organizations:', allOrgs.length);
     *
     * @see {@link https://docs.scalekit.com/apis/organization#list-organizations | List Organizations API}
     * @see {@link getOrganization} - Get a specific organization by ID
     */
    listOrganization(options?: {
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListOrganizationsResponse>;
    /**
     * Get an organization by id
     * @param {string} id The organization id
     * @returns {Promise<GetOrganizationResponse>} The organization
     */
    getOrganization(id: string): Promise<GetOrganizationResponse>;
    /**
     * Get an organization by external id
     * @param {string} externalId The external id
     * @returns {Promise<GetOrganizationResponse>} The organization
     */
    getOrganizationByExternalId(externalId: string): Promise<GetOrganizationResponse>;
    /**
     * Update an organization by id
     * @param {string} id The organization id
     * @param {PartialMessage<UpdateOrganization>} organization The organization to update
     * @returns {Promise<UpdateOrganizationResponse>} The updated organization
     */
    updateOrganization(id: string, organization: PartialMessage<UpdateOrganization>): Promise<UpdateOrganizationResponse>;
    /**
     * Update an organization by external id
     * @param {string} externalId The external id
     * @param {PartialMessage<UpdateOrganization>} organization The organization to update
     * @returns {Promise<UpdateOrganizationResponse>} The updated organization
     */
    updateOrganizationByExternalId(externalId: string, organization: PartialMessage<UpdateOrganization>): Promise<UpdateOrganizationResponse>;
    /**
     * Delete an organization by id
     * @param {string} organizationId The organization id
     * @returns {Promise<Empty>} Returns nothing
     */
    deleteOrganization(organizationId: string): Promise<Empty>;
    /**
     * Generates a single-use, time-limited URL for accessing an organization's admin portal.
     *
     * The admin portal allows organization administrators to self-configure their SSO settings,
     * manage users, and view audit logs without contacting your support team. The generated link
     * is valid for 60 seconds and can only be used once.
     *
     * @param {string} organizationId - The Scalekit organization ID
     *
     * @returns {Promise<Link>} Link object containing:
     *   - location: The complete portal URL to redirect the admin to
     *   - expiresAt: Timestamp when the link expires (60 seconds from generation)
     *
     * @throws {Error} When the link generation fails
     *
     * @example
     * // Generate admin portal link
     * app.get('/admin/sso-settings', async (req, res) => {
     *   const organizationId = req.user.organizationId;
     *
     *   try {
     *     const link = await scalekitClient.organization.generatePortalLink(organizationId);
     *
     *     // Redirect the admin to the portal
     *     res.redirect(link.location);
     *   } catch (error) {
     *     console.error('Failed to generate portal link:', error);
     *     res.status(500).send('Unable to access admin portal');
     *   }
     * });
     *
     * @example
     * // Send portal link via email
     * const link = await scalekitClient.organization.generatePortalLink('org_123456');
     *
     * await sendEmail({
     *   to: adminEmail,
     *   subject: 'Configure Your SSO Settings',
     *   body: `Click here to access your admin portal: ${link.location}
     *          This link expires in 60 seconds.`
     * });
     *
     * @see {@link https://docs.scalekit.com/apis/organization#generate-portal-link | Generate Portal Link API}
     * @see {@link https://docs.scalekit.com/directory/guides/admin-portal/ | Admin Portal Guide}
     */
    generatePortalLink(organizationId: string): Promise<Link>;
    /**
     * Update organization settings for an organization
     * @param organizationId  The organization id
     * @param settings The organization settings
     * @returns {Promise<GetOrganizationResponse>} The updated organization
     */
    updateOrganizationSettings(organizationId: string, settings: OrganizationSettings): Promise<GetOrganizationResponse>;
    /**
     * Upsert organization-level user management settings such as maximum allowed users.
     * @param organizationId The organization id
     * @param settings User management settings to apply
     * @returns {Promise<OrganizationUserManagementSettingsMessage | undefined>} The updated settings
     */
    upsertUserManagementSettings(organizationId: string, settings: OrganizationUserManagementSettingsInput): Promise<OrganizationUserManagementSettingsMessage | undefined>;
}
