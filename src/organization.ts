import { Empty, PartialMessage } from "@bufbuild/protobuf";
import { PromiseClient } from "@connectrpc/connect";
import GrpcConnect from "./connect";
import CoreClient from "./core";
import { OrganizationService } from "./pkg/grpc/scalekit/v1/organizations/organizations_connect";
import {
  CreateOrganizationResponse,
  GetOrganizationResponse,
  Link,
  ListOrganizationsResponse,
  OrganizationUserManagementSettings as OrganizationUserManagementSettingsMessage,
  UpdateOrganization,
  UpdateOrganizationResponse,
} from "./pkg/grpc/scalekit/v1/organizations/organizations_pb";
import {
  OrganizationSettings,
  OrganizationUserManagementSettingsInput,
} from "./types/organization";

/**
 * Client for managing organizations (tenants) in your Scalekit application.
 *
 * Organizations represent your B2B customers or tenants. Each organization can have
 * its own SSO connection, users, and settings. Use this client to perform CRUD
 * operations on organizations and manage organization-level configurations.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const orgClient = scalekitClient.organization;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Organization API Documentation}
 */
export default class OrganizationClient {
  private client: PromiseClient<typeof OrganizationService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(OrganizationService);
  }

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
   *   - externalId: Unique Identifier of this organization as identified in your system. (if provided)
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
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Create Organization API}
   * @see {@link getOrganization} - Retrieve organization by Scalekit ID
   * @see {@link getOrganizationByExternalId} - Retrieve organization by your external ID
   */
  async createOrganization(
    name: string,
    options?: { externalId?: string }
  ): Promise<CreateOrganizationResponse> {
    return this.coreClient.connectExec(this.client.createOrganization, {
      organization: {
        displayName: name,
        ...(options?.externalId && {
          externalId: options.externalId,
        }),
      },
    });
  }

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
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | List Organizations API}
   * @see {@link getOrganization} - Get a specific organization by ID
   */
  async listOrganization(options?: {
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListOrganizationsResponse> {
    return this.coreClient.connectExec(
      this.client.listOrganization,
      options ? options : {}
    );
  }

  /**
   * Retrieves detailed information about a specific organization using its Scalekit ID.
   *
   * Use this method to fetch complete organization details including display name, region,
   * metadata, settings, and configuration. This is useful for displaying organization info
   * in your application or checking organization status.
   *
   * @param {string} id - The Scalekit-generated organization identifier (format: "org_...")
   *
   * @returns {Promise<GetOrganizationResponse>} Response containing:
   *   - organization: Complete organization object with:
   *     - id: Scalekit's unique identifier
   *     - displayName: Organization's display name
   *     - externalId: Your system's identifier (if set)
   *     - metadata: Custom metadata key-value pairs
   *     - createTime: When the organization was created
   *     - updateTime: When the organization was last updated
   *
   * @throws {Error} If the organization is not found or access is denied
   *
   * @example
   * // Get organization details
   * const response = await scalekitClient.organization.getOrganization('org_12345');
   * const org = response.organization;
   *
   * console.log('Organization:', org.displayName);
   * console.log('External ID:', org.externalId);
   *
   * @example
   * // Check if organization exists before operations
   * try {
   *   const response = await scalekitClient.organization.getOrganization(orgId);
   *   // Proceed with organization operations
   * } catch (error) {
   *   console.error('Organization not found:', error);
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Get Organization API}
   * @see {@link getOrganizationByExternalId} - Retrieve organization using your external ID
   * @see {@link listOrganization} - List all organizations
   */
  async getOrganization(id: string): Promise<GetOrganizationResponse> {
    return this.coreClient.connectExec(this.client.getOrganization, {
      identities: { case: "id", value: id },
    });
  }

  /**
   * Retrieves detailed information about an organization using your system's external identifier.
   *
   * This is particularly useful when you need to look up an organization using your own
   * internal identifiers rather than Scalekit's ID. The external ID is typically set when
   * creating or updating an organization to maintain a mapping between your system and Scalekit.
   *
   * @param {string} externalId - Your system's unique identifier for the organization
   *                               (e.g., "customer_12345", "tenant_abc")
   *
   * @returns {Promise<GetOrganizationResponse>} Response containing:
   *   - organization: Complete organization object with all details
   *     (same structure as {@link getOrganization})
   *
   * @throws {Error} If no organization is found with the provided external ID
   *
   * @example
   * // Retrieve organization using your internal customer ID
   * const response = await scalekitClient.organization.getOrganizationByExternalId('customer_12345');
   * const org = response.organization;
   *
   * console.log('Scalekit ID:', org.id);
   * console.log('Organization:', org.displayName);
   *
   * @example
   * // Use in API endpoints where you have your customer ID
   * app.get('/api/customers/:customerId/sso', async (req, res) => {
   *   const { customerId } = req.params;
   *
   *   try {
   *     const response = await scalekitClient.organization.getOrganizationByExternalId(customerId);
   *     res.json({ organization: response.organization });
   *   } catch (error) {
   *     res.status(404).json({ error: 'Organization not found' });
   *   }
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Get Organization API}
   * @see {@link getOrganization} - Retrieve organization using Scalekit ID
   * @see {@link createOrganization} - Create organization with external ID mapping
   */
  async getOrganizationByExternalId(
    externalId: string
  ): Promise<GetOrganizationResponse> {
    return this.coreClient.connectExec(this.client.getOrganization, {
      identities: { case: "externalId", value: externalId },
    });
  }

  /**
   * Updates an organization's properties using its Scalekit ID.
   *
   * Use this method to modify an organization's display name, external ID, or custom metadata.
   * Only the fields you specify in the update object will be changed; all other fields remain
   * unchanged. Note that the region code cannot be modified once set.
   *
   * @param {string} id - The Scalekit organization identifier (format: "org_...")
   * @param {PartialMessage<UpdateOrganization>} organization - Object containing fields to update:
   *   - displayName?: New display name for the organization
   *   - externalId?: New external ID to map to your system
   *   - metadata?: Custom key-value pairs for storing additional data
   *
   * @returns {Promise<UpdateOrganizationResponse>} Response containing:
   *   - organization: The updated organization object with all current values
   *
   * @throws {Error} If the organization is not found or update fails
   *
   * @example
   * // Update organization display name
   * const response = await scalekitClient.organization.updateOrganization('org_12345', {
   *   displayName: 'Acme Corporation (Updated)'
   * });
   *
   * console.log('Updated:', response.organization.displayName);
   *
   * @example
   * // Add external ID to existing organization
   * await scalekitClient.organization.updateOrganization('org_12345', {
   *   externalId: 'customer_abc'
   * });
   *
   * @example
   * // Update multiple fields including metadata
   * const response = await scalekitClient.organization.updateOrganization('org_12345', {
   *   displayName: 'Acme Corp',
   *   metadata: {
   *     industry: 'Technology',
   *     size: 'Enterprise',
   *     plan: 'Premium'
   *   }
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Update Organization API}
   * @see {@link updateOrganizationByExternalId} - Update using your external ID
   * @see {@link getOrganization} - Retrieve current organization details
   */
  async updateOrganization(
    id: string,
    organization: PartialMessage<UpdateOrganization>
  ): Promise<UpdateOrganizationResponse> {
    return this.coreClient.connectExec(this.client.updateOrganization, {
      identities: { case: "id", value: id },
      organization,
    });
  }

  /**
   * Updates an organization's properties using your system's external identifier.
   *
   * This method provides the same functionality as {@link updateOrganization} but allows you
   * to reference the organization using your own internal identifier instead of Scalekit's ID.
   * Only specified fields will be updated; all other fields remain unchanged.
   *
   * @param {string} externalId - Your system's unique identifier for the organization
   * @param {PartialMessage<UpdateOrganization>} organization - Object containing fields to update:
   *   - displayName?: New display name for the organization
   *   - externalId?: New external ID (useful for migrating identifiers)
   *   - metadata?: Custom key-value pairs for storing additional data
   *
   * @returns {Promise<UpdateOrganizationResponse>} Response containing:
   *   - organization: The updated organization object with all current values
   *
   * @throws {Error} If no organization is found with the provided external ID
   *
   * @example
   * // Update organization using your customer ID
   * const response = await scalekitClient.organization.updateOrganizationByExternalId(
   *   'customer_12345',
   *   { displayName: 'New Company Name' }
   * );
   *
   * @example
   * // Update metadata for reporting and analytics
   * await scalekitClient.organization.updateOrganizationByExternalId('customer_12345', {
   *   metadata: {
   *     accountManager: 'john@example.com',
   *     renewalDate: '2025-12-31',
   *     tier: 'enterprise'
   *   }
   * });
   *
   * @example
   * // Use in API endpoints with your customer identifiers
   * app.patch('/api/customers/:customerId', async (req, res) => {
   *   const { customerId } = req.params;
   *   const { name } = req.body;
   *
   *   const response = await scalekitClient.organization.updateOrganizationByExternalId(
   *     customerId,
   *     { displayName: name }
   *   );
   *
   *   res.json({ organization: response.organization });
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Update Organization API}
   * @see {@link updateOrganization} - Update using Scalekit ID
   * @see {@link getOrganizationByExternalId} - Retrieve organization by external ID
   */
  async updateOrganizationByExternalId(
    externalId: string,
    organization: PartialMessage<UpdateOrganization>
  ): Promise<UpdateOrganizationResponse> {
    return this.coreClient.connectExec(this.client.updateOrganization, {
      identities: { case: "externalId", value: externalId },
      organization,
    });
  }

  /**
   * Permanently deletes an organization from your Scalekit environment.
   *
   * This operation removes the organization and all associated data including SSO connections,
   * users, and settings. This action cannot be undone, so use with caution.
   *
   * @param {string} organizationId - The Scalekit organization identifier to delete
   *
   * @returns {Promise<Empty>} Empty response on successful deletion
   *
   * @throws {Error} If the organization is not found or deletion fails
   *
   * @example
   * // Delete an organization
   * await scalekitClient.organization.deleteOrganization('org_12345');
   * console.log('Organization deleted successfully');
   *
   * @example
   * // Delete with confirmation flow
   * const confirmDelete = await askUserConfirmation(
   *   'Are you sure you want to delete this organization? This cannot be undone.'
   * );
   *
   * if (confirmDelete) {
   *   try {
   *     await scalekitClient.organization.deleteOrganization(orgId);
   *     console.log('Organization deleted');
   *   } catch (error) {
   *     console.error('Failed to delete organization:', error);
   *   }
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Delete Organization API}
   * @see {@link getOrganization} - Check if organization exists before deletion
   */
  async deleteOrganization(organizationId: string): Promise<Empty> {
    return this.coreClient.connectExec(this.client.deleteOrganization, {
      identities: { case: "id", value: organizationId },
    });
  }

  /**
   * Creates a single use Admin Portal URL valid for 1 minute.
   *
   * Once the generated admin portal URL is accessed or rendered, a temporary session of 6 hours
   * is created to allow the admin to update SSO/SCIM configuration.
   *
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
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Generate Portal Link API}
   * @see {@link https://docs.scalekit.com/authenticate/sso/admin-portal/ | Admin Portal Guide}
   */
  async generatePortalLink(organizationId: string): Promise<Link> {
    const response = await this.coreClient.connectExec(
      this.client.generatePortalLink,
      {
        id: organizationId,
      }
    );
    if (!response.link) {
      throw new Error("Error generating portal link");
    }

    return response.link;
  }

  /**
   * Updates configuration settings and feature flags for an organization.
   *
   * Use this method to enable or disable organization-level features such as SSO configuration,
   * directory synchronization, session management, and other organization-specific settings.
   * This allows you to customize the capabilities available to each organization based on
   * their subscription tier or requirements.
   *
   * @param {string} organizationId - The Scalekit organization identifier (format: "org_...")
   * @param {OrganizationSettings} settings - Configuration settings object containing:
   *   - features: Array of feature objects, each with:
   *     - name: Feature identifier (e.g., "sso", "directory_sync")
   *     - enabled: Boolean flag to enable/disable the feature
   *
   * @returns {Promise<GetOrganizationResponse>} Response containing:
   *   - organization: Complete organization object with updated settings
   *
   * @throws {Error} If the organization is not found or settings update fails
   *
   * @example
   * // Enable SSO and directory sync for an organization
   * const response = await scalekitClient.organization.updateOrganizationSettings('org_12345', {
   *   features: [
   *     { name: 'sso', enabled: true },
   *     { name: 'directory_sync', enabled: true }
   *   ]
   * });
   *
   * console.log('Settings updated:', response.organization.settings);
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | Update Organization Settings API}
   * @see {@link getOrganization} - Retrieve current organization settings
   * @see {@link upsertUserManagementSettings} - Update user management settings
   */
  async updateOrganizationSettings(
    organizationId: string,
    settings: OrganizationSettings
  ): Promise<GetOrganizationResponse> {
    const request = {
      id: organizationId,
      settings: {
        features: settings.features.map((feature) => ({
          name: feature.name,
          enabled: feature.enabled,
        })),
      },
    };

    return this.coreClient.connectExec(
      this.client.updateOrganizationSettings,
      request
    );
  }

  /**
   * Creates or updates user management settings for an organization.
   *
   * This method allows you to configure user-related constraints and policies at the
   * organization level, such as setting a maximum number of allowed users. This is
   * useful for enforcing subscription limits, preventing overuse, or managing capacity.
   * If settings already exist, they will be updated; otherwise, new settings are created.
   *
   * @param {string} organizationId - The Scalekit organization identifier (format: "org_...")
   * @param {OrganizationUserManagementSettingsInput} settings - User management configuration:
   *   - maxAllowedUsers?: Maximum number of users allowed in the organization.
   *                       Set to null or undefined to remove the limit.
   *
   * @returns {Promise<OrganizationUserManagementSettingsMessage | undefined>} The updated settings object containing:
   *   - maxAllowedUsers: The configured user limit (if set)
   *
   * @throws {Error} If the organization is not found or settings update fails
   *
   * @example
   * // Set maximum user limit for an organization
   * const settings = await scalekitClient.organization.upsertUserManagementSettings(
   *   'org_12345',
   *   { maxAllowedUsers: 100 }
   * );
   *
   * console.log('Max users allowed:', settings?.maxAllowedUsers);
   *
   * @example
   * // Remove user limit (set to unlimited)
   * await scalekitClient.organization.upsertUserManagementSettings('org_12345', {
   *   maxAllowedUsers: null
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/organizations | User Management Settings API}
   * @see {@link getOrganization} - Retrieve current organization settings
   * @see {@link updateOrganizationSettings} - Update other organization settings
   */
  async upsertUserManagementSettings(
    organizationId: string,
    settings: OrganizationUserManagementSettingsInput
  ): Promise<OrganizationUserManagementSettingsMessage | undefined> {
    const requestSettings: PartialMessage<OrganizationUserManagementSettingsMessage> =
      {};
    if (
      settings.maxAllowedUsers !== undefined &&
      settings.maxAllowedUsers !== null
    ) {
      requestSettings.maxAllowedUsers = settings.maxAllowedUsers;
    }

    const response = await this.coreClient.connectExec(
      this.client.upsertUserManagementSettings,
      {
        organizationId,
        settings: requestSettings,
      }
    );

    return response.settings;
  }
}
