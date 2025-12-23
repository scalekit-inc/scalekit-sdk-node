import { PromiseClient } from "@connectrpc/connect";
import GrpcConnect from "./connect";
import CoreClient from "./core";
import { ConnectionService } from "./pkg/grpc/scalekit/v1/connections/connections_connect";
import {
  GetConnectionResponse,
  ToggleConnectionResponse,
  ListConnectionsResponse,
} from "./pkg/grpc/scalekit/v1/connections/connections_pb";

/**
 * Client for managing enterprise SSO connections for organizations.
 *
 * Connections represent the SSO integration between an organization and their identity provider (IdP).
 * Each organization can have an enterprise connection supporting different protocols (SAML, OIDC) and
 * providers (Okta, Azure AD, Google Workspace, etc.). Use this client to retrieve connection details,
 * list connections, and enable/disable them.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const connectionClient = scalekitClient.connection;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/connections | Connection API Documentation}
 */
export default class ConnectionClient {
  private client: PromiseClient<typeof ConnectionService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(ConnectionService);
  }

  /**
   * Retrieves complete configuration and status details for a specific SSO connection.
   *
   * Use this method to fetch comprehensive information about an organization's SSO connection,
   * including provider settings, protocol details (SAML/OIDC), enabled status, and configuration
   * metadata. This is useful for verifying connection setup, auditing configurations, checking
   * connection health before authentication flows, or displaying connection details to administrators.
   *
   * @param {string} organizationId - The organization ID that owns the connection (format: "org_...")
   * @param {string} id - The connection identifier to retrieve (format: "conn_...")
   *
   * @returns {Promise<GetConnectionResponse>} Response containing:
   *   - connection: Complete connection object with:
   *     - id: Unique connection identifier
   *     - organizationId: Parent organization ID
   *     - provider: Identity provider name (e.g., "okta", "azure_ad", "google")
   *     - type: Protocol type ("saml", "oidc")
   *     - enabled: Whether the connection is active
   *     - status: Configuration status
   *     - domains: Associated email domains for this connection
   *     - metadata: Provider-specific configuration details
   *     - createTime: When the connection was created
   *     - updateTime: When the connection was last modified
   *
   * @throws {Error} If the organization or connection is not found
   *
   * @example
   * // Get connection details
   * const response = await scalekitClient.connection.getConnection(
   *   'org_123456',
   *   'conn_abc123'
   * );
   *
   * const conn = response.connection;
   * console.log('Provider:', conn.provider);
   * console.log('Type:', conn.type);
   * console.log('Status:', conn.enabled ? 'Enabled' : 'Disabled');
   * console.log('Domains:', conn.domains);
   *
   * @example
   * // Verify connection is ready for authentication
   * const response = await scalekitClient.connection.getConnection(orgId, connId);
   *
   * if (response.connection.enabled && response.connection.status === 'active') {
   *   console.log('Connection is ready for SSO authentication');
   * } else {
   *   console.log('Connection not ready:', response.connection.status);
   * }
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | Get Connection API}
   * @see {@link listConnections} - List all connections for an organization
   * @see {@link enableConnection} - Enable this connection
   * @see {@link disableConnection} - Disable this connection
   */
  async getConnection(
    organizationId: string,
    id: string
  ): Promise<GetConnectionResponse> {
    return this.coreClient.connectExec(this.client.getConnection, {
      id,
      organizationId,
    });
  }

  /**
   * Lists all SSO connections associated with a specific email domain.
   *
   * Use this method to discover which organizations have SSO configured for a particular
   * domain. This is useful for implementing domain-based SSO routing where users are
   * automatically directed to their organization's SSO based on their email domain.
   *
   * @param {string} domain - The email domain to search for (e.g., "acme.com")
   *
   * @returns {Promise<ListConnectionsResponse>} Response containing:
   *   - connections: Array of connection objects for the domain
   *
   * @example
   * // Find SSO connections for a domain
   * const response = await scalekitClient.connection.listConnectionsByDomain('acme.com');
   *
   * if (response.connections.length > 0) {
   *   console.log('SSO available for domain acme.com');
   *   const connection = response.connections[0];
   *   console.log('Organization:', connection.organizationId);
   *   console.log('Provider:', connection.provider);
   * }
   *
   * @example
   * // Implement domain-based SSO routing
   * app.post('/auth/login', async (req, res) => {
   *   const email = req.body.email;
   *   const domain = email.split('@')[1];
   *
   *   const response = await scalekitClient.connection.listConnectionsByDomain(domain);
   *
   *   if (response.connections.length > 0) {
   *     // Redirect to SSO
   *     const authUrl = scalekitClient.getAuthorizationUrl(redirectUri, {
   *       connectionId: response.connections[0].id,
   *       loginHint: email
   *     });
   *     return res.redirect(authUrl);
   *   } else {
   *     // Use password-based login
   *     return res.render('password-login');
   *   }
   * });
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | List Connections API}
   * @see {@link listConnections} - List all connections for an organization
   */
  async listConnectionsByDomain(
    domain: string
  ): Promise<ListConnectionsResponse> {
    return this.coreClient.connectExec(this.client.listConnections, {
      domain,
    });
  }

  /**
   * Lists all SSO connections configured for an organization.
   *
   * Retrieves all enterprise SSO connections (SAML, OIDC) that have been configured for
   * the specified organization. Each connection includes details about the provider,
   * status, and configuration.
   *
   * @param {string} organizationId - The organization ID
   *
   * @returns {Promise<ListConnectionsResponse>} Response containing:
   *   - connections: Array of connection objects with provider details and status
   *
   * @example
   * // List all SSO connections for an organization
   * const response = await scalekitClient.connection.listConnections('org_123456');
   *
   * console.log(`Found ${response.connections.length} connections`);
   * response.connections.forEach(conn => {
   *   console.log(`- ${conn.provider} (${conn.type}): ${conn.enabled ? 'Enabled' : 'Disabled'}`);
   * });
   *
   * @example
   * // Check if organization has any enabled connections
   * const response = await scalekitClient.connection.listConnections('org_123456');
   * const hasEnabledSSO = response.connections.some(conn => conn.enabled);
   *
   * if (!hasEnabledSSO) {
   *   console.log('No SSO connections enabled for this organization');
   * }
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | List Connections API}
   * @see {@link getConnection} - Get details of a specific connection
   * @see {@link enableConnection} - Enable a connection
   * @see {@link disableConnection} - Disable a connection
   */
  async listConnections(
    organizationId: string
  ): Promise<ListConnectionsResponse> {
    return this.coreClient.connectExec(this.client.listConnections, {
      organizationId,
    });
  }

  /**
   * Enables an SSO connection for an organization.
   *
   * Activates a previously disabled or newly configured SSO connection, allowing users
   * from the organization to authenticate using this identity provider. Once enabled,
   * users can immediately start using SSO to log in.
   *
   * @param {string} organizationId - The organization ID
   * @param {string} id - The connection ID to enable
   *
   * @returns {Promise<ToggleConnectionResponse>} Response with updated connection status
   *
   * @example
   * // Enable an SSO connection
   * const response = await scalekitClient.connection.enableConnection(
   *   'org_123456',
   *   'conn_abc123'
   * );
   *
   * console.log('Connection enabled:', response.connection.enabled); // true
   *
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | Enable Connection API}
   * @see {@link disableConnection} - Disable a connection
   * @see {@link listConnections} - List all connections
   */
  async enableConnection(
    organizationId: string,
    id: string
  ): Promise<ToggleConnectionResponse> {
    return this.coreClient.connectExec(this.client.enableConnection, {
      id,
      organizationId,
    });
  }

  /**
   * Disables an SSO connection for an organization.
   *
   * Deactivates an SSO connection, preventing users from authenticating via this identity
   * provider. This is useful for temporarily suspending SSO access, during maintenance,
   * or when migrating to a different provider. Existing user sessions remain valid.
   *
   * @param {string} organizationId - The organization ID
   * @param {string} id - The connection ID to disable
   *
   * @returns {Promise<ToggleConnectionResponse>} Response with updated connection status
   *
   * @example
   * // Disable an SSO connection
   * const response = await scalekitClient.connection.disableConnection(
   *   'org_123456',
   *   'conn_abc123'
   * );
   *
   * console.log('Connection disabled:', !response.connection.enabled); // true
   *
   * @see {@link https://docs.scalekit.com/apis/#tag/connections | Disable Connection API}
   * @see {@link enableConnection} - Enable a connection
   * @see {@link listConnections} - List all connections
   */
  async disableConnection(
    organizationId: string,
    id: string
  ): Promise<ToggleConnectionResponse> {
    return this.coreClient.connectExec(this.client.disableConnection, {
      id,
      organizationId,
    });
  }
}
