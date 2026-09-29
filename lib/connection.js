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
const protobuf_1 = require("@bufbuild/protobuf");
const connections_pb_1 = require("./pkg/grpc/scalekit/v1/connections/connections_pb");
const connections_pb_2 = require("./pkg/grpc/scalekit/v1/connections/connections_pb");
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
class ConnectionClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(connections_pb_1.ConnectionService);
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
    getConnection(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.getConnection, {
                id,
                organizationId,
            });
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
    listConnectionsByDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listConnections, {
                domain,
            });
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
    listConnections(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listConnections, {
                organizationId,
            });
        });
    }
    /**
     * Lists app-level connections configured for the account (not scoped to an organization).
     *
     * Unlike {@link listConnections}, which returns the SSO connections for a specific
     * organization, this method returns the connections defined at the application level.
     * Results are paginated and can optionally be filtered by provider.
     *
     * @param {object} [params] - Optional pagination and filtering parameters
     * @param {number} [params.pageSize] - Maximum number of connections to return per page (max 30;
     *   a larger value fails with `[invalid_argument] Validation error`)
     * @param {string} [params.pageToken] - Token identifying the page of results to return
     * @param {string} [params.provider] - Filter results to a specific provider (e.g., "okta", "google")
     *
     * @returns {Promise<ListAppConnectionsResponse>} Response containing:
     *   - connections: Array of connection objects
     *   - nextPageToken: Token for retrieving the next page of results (empty if none)
     *   - prevPageToken: Token for retrieving the previous page of results (empty if none)
     *   - totalSize: Total number of connections matching the query
     *
     * @example
     * // List all app connections
     * const response = await scalekitClient.connection.listAppConnections();
     * console.log(`Found ${response.totalSize} app connections`);
     *
     * @example
     * // Paginate through app connections for a specific provider
     * let pageToken: string | undefined;
     * do {
     *   const response = await scalekitClient.connection.listAppConnections({
     *     pageSize: 20,
     *     pageToken,
     *     provider: 'okta',
     *   });
     *   response.connections.forEach(conn => console.log(conn.id));
     *   pageToken = response.nextPageToken || undefined;
     * } while (pageToken);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/connections | Connections API}
     * @see {@link listConnections} - List connections for a specific organization
     */
    listAppConnections(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listAppConnections, {
                pageSize: params === null || params === void 0 ? void 0 : params.pageSize,
                pageToken: params === null || params === void 0 ? void 0 : params.pageToken,
                provider: params === null || params === void 0 ? void 0 : params.provider,
                query: params === null || params === void 0 ? void 0 : params.query,
            });
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
    enableConnection(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.enableConnection, {
                id,
                organizationId,
            });
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
    disableConnection(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.disableConnection, {
                id,
                organizationId,
            });
        });
    }
    /**
     * Creates a new SSO connection for an organization.
     *
     * @param {string} organizationId - The organization ID (format: "org_...")
     * @param {CreateConnection} connection - The connection configuration to create
     *
     * @returns {Promise<CreateConnectionResponse>} Response containing the created connection
     *
     * @throws {ScalekitServerException} If the organization is not found or connection configuration is invalid
     */
    createConnection(organizationId, connection) {
        const request = (0, protobuf_1.create)(connections_pb_2.CreateConnectionRequestSchema, {
            organizationId,
            connection,
        });
        return this.coreClient.connectExec(this.client.createConnection, request);
    }
    /**
     * Deletes an SSO connection for an organization.
     *
     * @param {string} organizationId - The organization ID (format: "org_...")
     * @param {string} id - The connection ID to delete (format: "conn_...")
     *
     * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
     *
     * @throws {ScalekitServerException} If the organization or connection is not found
     */
    deleteConnection(organizationId, id) {
        const request = (0, protobuf_1.create)(connections_pb_2.DeleteConnectionRequestSchema, {
            organizationId,
            id,
        });
        return this.coreClient.connectExec(this.client.deleteConnection, request);
    }
    /**
     * Creates an environment-scoped connection.
     *
     * Unlike {@link createConnection}, which creates an SSO connection owned by an
     * organization, this creates a connection that belongs to the environment itself.
     * Use it for AgentKit app connections: pass `flags: { isApp: true }` and set
     * `providerKey` to the connector's identifier, such as a custom connector's
     * `provider.identifier` from `actions.providers.createCustomProvider`. The
     * returned connection's `keyId` is the connection name the AgentKit methods on
     * `actions` take.
     *
     * PREVIEW: the underlying `CreateEnvironmentConnection` RPC is marked preview
     * in the API and may change. It maps to `POST /api/v1/connections`, requires a
     * workspace client, and needs the `sso:write` permission.
     *
     * @param {CreateConnection} connection - The connection to create, as a plain object:
     *   - providerKey: Identifier of the connector the connection is for
     *   - type: Authentication type, e.g. `ConnectionType.OAUTH`
     *   - keyId: Optional connection name; generated when omitted
     * @param {Flags} [flags] - Optional flags. Set `isApp: true` for an AgentKit app connection.
     *
     * @returns {Promise<CreateConnectionResponse>} Response containing the created connection,
     *   including its `id` and `keyId`
     *
     * @throws {ScalekitServerException} If the connection configuration is invalid or the
     *   client lacks permission
     *
     * @example
     * // Create an AgentKit app connection for a custom OAuth connector
     * import { ConnectionType } from '@scalekit-sdk/node';
     *
     * const { connection } = await scalekitClient.connection.createEnvironmentConnection(
     *   { providerKey: provider.identifier, type: ConnectionType.OAUTH },
     *   { isApp: true }
     * );
     * console.log(connection?.id, connection?.keyId);
     *
     * @see {@link getEnvironmentConnection} - Fetch an environment connection by id
     * @see {@link updateEnvironmentConnection} - Update an environment connection
     */
    createEnvironmentConnection(connection, flags) {
        const request = (0, protobuf_1.create)(connections_pb_2.CreateEnvironmentConnectionRequestSchema, Object.assign({ connection }, (flags && { flags })));
        return this.coreClient.connectExec(this.client.createEnvironmentConnection, request);
    }
    /**
     * Retrieves an environment-scoped connection by id.
     *
     * Use this to read back a connection created with
     * {@link createEnvironmentConnection}, for example an AgentKit app connection.
     * For an organization's SSO connection, use {@link getConnection} instead.
     *
     * PREVIEW: the underlying `GetEnvironmentConnection` RPC is marked preview in
     * the API and may change. It maps to `GET /api/v1/connections/{connection_id}`,
     * accepts a workspace or actions-portal client, and needs the `sso:read`
     * permission.
     *
     * @param {string} connectionId - The connection identifier (format: "conn_...")
     *
     * @returns {Promise<GetConnectionResponse>} Response containing the connection
     *
     * @throws {ScalekitServerException} If the connection is not found or the client lacks
     *   permission
     *
     * @example
     * const { connection } =
     *   await scalekitClient.connection.getEnvironmentConnection('conn_abc123');
     * console.log(connection?.keyId, connection?.enabled);
     *
     * @see {@link createEnvironmentConnection} - Create an environment connection
     * @see {@link updateEnvironmentConnection} - Update an environment connection
     */
    getEnvironmentConnection(connectionId) {
        const request = (0, protobuf_1.create)(connections_pb_2.GetEnvironmentConnectionRequestSchema, {
            connectionId,
        });
        return this.coreClient.connectExec(this.client.getEnvironmentConnection, request);
    }
    /**
     * Updates an environment-scoped connection.
     *
     * Use this to change the OAuth settings of a connection created with
     * {@link createEnvironmentConnection}. Organization SSO connections are not
     * updated through this method.
     *
     * Despite the `PATCH` verb, the server validates the whole connection rather
     * than merging a partial one. Read the connection with
     * {@link getEnvironmentConnection} first, then send `type`, `providerKey` and
     * `keyId` back alongside what you are changing. Each missing field fails
     * differently, and none of the errors name the method:
     * - no `keyId` -> `[invalid_argument] keyId is required`
     * - no `providerKey` -> `[invalid_argument] Validation error`
     * - no `type` -> `[internal] error converting connection`
     *
     * On an AgentKit app connection `settings` is the only field an update
     * actually changes. `provider`, `uiButtonTitle`, `debugEnabled`,
     * `configurationType` and `attributeMapping` are all accepted and then
     * discarded: the call succeeds and the stored values do not move. Change
     * those from the Scalekit dashboard instead.
     *
     * PREVIEW: the underlying `UpdateEnvironmentConnection` RPC is marked preview
     * in the API and may change. It maps to `PATCH /api/v1/connections/{connection_id}`,
     * requires a workspace client, and needs the `sso:write` permission.
     *
     * @param {string} connectionId - The connection identifier (format: "conn_...")
     * @param {UpdateConnection} connection - The connection to store, as a plain object.
     *   `type`, `providerKey` and `keyId` are required on every call. `settings` is a
     *   protobuf oneof, so it takes `{ case: 'oauthConfig', value: {...} }`.
     *
     * @returns {Promise<UpdateConnectionResponse>} Response containing the updated connection
     *
     * @throws {ScalekitServerException} If the connection is not found, the update is
     *   invalid, or the client lacks permission
     *
     * @example
     * // Narrow the OAuth scopes on an app connection
     * import { ConnectionType } from '@scalekit-sdk/node';
     *
     * const { connection: current } =
     *   await scalekitClient.connection.getEnvironmentConnection('conn_abc123');
     * if (current?.settings.case !== 'oauthConfig') {
     *   throw new Error('not an OAuth connection');
     * }
     *
     * const { connection } = await scalekitClient.connection.updateEnvironmentConnection(
     *   'conn_abc123',
     *   {
     *     type: ConnectionType.OAUTH,
     *     providerKey: current.providerKey,
     *     keyId: current.keyId,
     *     settings: {
     *       case: 'oauthConfig',
     *       value: { ...current.settings.value, scopes: ['openid', 'email', 'profile'] },
     *     },
     *   }
     * );
     * console.log(connection?.settings.value);
     *
     * @see {@link getEnvironmentConnection} - Fetch an environment connection by id
     */
    updateEnvironmentConnection(connectionId, connection) {
        const request = (0, protobuf_1.create)(connections_pb_2.UpdateEnvironmentConnectionRequestSchema, {
            connectionId,
            connection,
        });
        return this.coreClient.connectExec(this.client.updateEnvironmentConnection, request);
    }
}
exports.default = ConnectionClient;
//# sourceMappingURL=connection.js.map