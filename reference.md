## ScalekitClient

<details><summary><code>client.<a href="/src/scalekit.ts">getAuthorizationUrl</a>(redirectUri, options?) -> string</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Utility method to generate the OAuth 2.0 authorization URL to initiate the SSO authentication flow.

This method doesn't make any network calls but instead generates a fully formed Authorization URL as a string that you can redirect your users to initiate authentication.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
// Initiate Enterprise SSO authentication for a given org_id
const authUrl = scalekitClient.getAuthorizationUrl(
  'https://yourapp.com/auth/callback',
  {
    state: 'random-state-value',
    organizationId: 'org_123456'
  }
);
// Redirect user to authUrl
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**redirectUri:** `string` - The URL where users will be redirected after authentication. Must match one of the redirect URIs configured in your Scalekit dashboard.

</dd>
</dl>

<dl>
<dd>

**options:** `AuthorizationUrlOptions` - Optional configuration for the authorization request
- `scopes?: string[]` - OAuth scopes to request (default: ['openid', 'profile', 'email'])
- `state?: string` - Opaque value to maintain state between request and callback
- `nonce?: string` - String value used to associate a client session with an ID Token
- `loginHint?: string` - Hint about the login identifier the user might use
- `domainHint?: string` - Domain hint to identify which organization's IdP to use
- `connectionId?: string` - Specific SSO connection ID to use for authentication
- `organizationId?: string` - Organization ID to authenticate against
- `provider?: string` - Social login provider (e.g., 'google', 'github', 'microsoft')
- `codeChallenge?: string` - PKCE code challenge for enhanced security
- `codeChallengeMethod?: string` - Method used to generate the code challenge (S256)
- `prompt?: string` - Controls authentication behavior (e.g., 'login', 'consent', 'create')

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/scalekit.ts">authenticateWithCode</a>(code, redirectUri, options?) -> Promise&lt;AuthenticationResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Exchanges an authorization code for access tokens and user information.

This method completes the OAuth 2.0 authorization code flow by exchanging the code received in the callback for access tokens, ID tokens, and user profile information. Call this method in your redirect URI handler after receiving the authorization code.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  const result = await scalekitClient.authenticateWithCode(
    code,
    'https://yourapp.com/auth/callback'
  );

  req.session.accessToken = result.accessToken;
  req.session.user = result.user;

  res.redirect('/dashboard');
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**code:** `string` - The authorization code received in the callback URL after user authentication

</dd>
</dl>

<dl>
<dd>

**redirectUri:** `string` - The same redirect URI used in getAuthorizationUrl(). Must match exactly.

</dd>
</dl>

<dl>
<dd>

**options:** `AuthenticationOptions` - Optional authentication configuration
- `codeVerifier?: string` - PKCE code verifier to validate the code challenge (required if PKCE was used)

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/scalekit.ts">getIdpInitiatedLoginClaims</a>(idpInitiatedLoginToken, options?) -> Promise&lt;IdpInitiatedLoginClaims&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Extracts and validates claims from an IdP-initiated login token.

Use this method when handling IdP-initiated SSO flows, where the authentication is initiated from the identity provider's portal rather than your application. This validates the token and returns the necessary information to initiate a new SP Initiated SSO workflow.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
app.get('/auth/callback', async (req, res) => {
  const { idp_initiated_login } = req.query;

  if (idp_initiated_login) {
    const claims = await scalekitClient.getIdpInitiatedLoginClaims(idp_initiated_login);

    const authUrl = scalekitClient.getAuthorizationUrl(
      'https://yourapp.com/auth/callback',
      {
        connectionId: claims.connection_id,
        organizationId: claims.organization_id,
        loginHint: claims.login_hint,
        ...(claims.relay_state && { state: claims.relay_state })
      }
    );

    return res.redirect(authUrl);
  }
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idpInitiatedLoginToken:** `string` - The token received in the 'idp_initiated_login' query parameter

</dd>
</dl>

<dl>
<dd>

**options:** `TokenValidationOptions` - Optional token validation configuration

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/scalekit.ts">validateAccessToken</a>(token, options?) -> Promise&lt;boolean&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Validates the access token and returns a boolean result.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const isValid = await scalekitClient.validateAccessToken(token);
if (isValid) {
  // Token is valid, proceed with request
}
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**token:** `string` - The token to be validated

</dd>
</dl>

<dl>
<dd>

**options:** `TokenValidationOptions` - Optional validation options for issuer, audience, and scopes

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/scalekit.ts">getLogoutUrl</a>(options?) -> string</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the logout URL that can be used to log out the user.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const logoutUrl = scalekitClient.getLogoutUrl({
  postLogoutRedirectUri: 'https://example.com',
  state: 'some-state'
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**options:** `LogoutUrlOptions` - Logout URL options
- `idTokenHint?: string` - The ID Token previously issued to the client
- `postLogoutRedirectUri?: string` - URL to redirect after logout
- `state?: string` - Opaque value to maintain state between request and callback

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/scalekit.ts">verifyWebhookPayload</a>(secret, headers, payload) -> boolean</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Verifies the authenticity and integrity of webhook payloads from Scalekit.

Use this method to validate webhook requests from Scalekit by verifying the HMAC signature. This ensures the webhook was sent by Scalekit and hasn't been tampered with. The method checks the signature and timestamp to prevent replay attacks (5-minute tolerance window).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
app.post('/webhooks/scalekit', express.raw({ type: 'application/json' }), (req, res) => {
  const secret = process.env.SCALEKIT_WEBHOOK_SECRET;
  const headers = req.headers;
  const payload = req.body.toString();

  const isValid = scalekitClient.verifyWebhookPayload(secret, headers, payload);

  if (isValid) {
    const event = JSON.parse(payload);

    switch (event.type) {
      case 'user.created':
        console.log('New user created:', event.data);
        break;
      case 'connection.enabled':
        console.log('Connection enabled:', event.data);
        break;
    }

    res.status(200).send('Webhook received');
  }
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**secret:** `string` - Your webhook signing secret from the Scalekit dashboard (format: 'whsec_...')

</dd>
</dl>

<dl>
<dd>

**headers:** `Record<string, string>` - The HTTP headers from the webhook request

</dd>
</dl>

<dl>
<dd>

**payload:** `string` - The raw webhook request body as a string

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="/src/scalekit.ts">verifyInterceptorPayload</a>(secret, headers, payload) -> boolean</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Verifies the authenticity and integrity of interceptor payloads from Scalekit.

Use this method to validate HTTP interceptor requests from Scalekit by verifying the HMAC signature. This ensures the interceptor payload was sent by Scalekit and hasn't been tampered with.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const isValid = scalekitClient.verifyInterceptorPayload(secret, headers, payload);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**secret:** `string` - Your interceptor signing secret from Scalekit Dashboard

</dd>
</dl>

<dl>
<dd>

**headers:** `Record<string, string>` - The HTTP headers from the interceptor request

</dd>
</dl>

<dl>
<dd>

**payload:** `string` - The raw interceptor request body as a string

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Organizations

<details><summary><code>client.organization.<a href="/src/organization.ts">createOrganization</a>(name, options?) -> Promise&lt;CreateOrganizationResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new organization (tenant) in your Scalekit application.

Organizations represent your B2B customers. Each organization can have its own SSO connections, users, and configuration. Use the external ID to map Scalekit organizations to your internal system's identifiers.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const org = await scalekitClient.organization.createOrganization(
  'Acme Corporation',
  { externalId: 'customer_12345' }
);

console.log('Organization ID:', org.organization.id);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**name:** `string` - Display name for the organization

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Optional configuration
- `externalId?: string` - Your system's unique identifier for this organization

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.organization.<a href="/src/organization.ts">listOrganization</a>(options?) -> Promise&lt;ListOrganizationsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a paginated list of all organizations in your Scalekit environment.

This method returns all organizations with support for pagination. Use this to display a list of your B2B customers, search for organizations, or perform bulk operations.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.organization.listOrganization({
  pageSize: 20
});

console.log('Organizations:', response.organizations);
console.log('Total:', response.totalSize);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**options:** `object` - Optional pagination parameters
- `pageSize?: number` - Number of organizations to return per page (default: 10, max: 100)
- `pageToken?: string` - Token for retrieving the next page of results

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.organization.<a href="/src/organization.ts">getOrganization</a>(id) -> Promise&lt;GetOrganizationResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves detailed information about a specific organization using its Scalekit ID.

Use this method to fetch complete organization details including display name, region, metadata, settings, and configuration.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.organization.getOrganization('org_12345');
const org = response.organization;

console.log('Organization:', org.displayName);
console.log('External ID:', org.externalId);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` - The Scalekit-generated organization identifier (format: "org_...")

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.organization.<a href="/src/organization.ts">getOrganizationByExternalId</a>(externalId) -> Promise&lt;GetOrganizationResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves detailed information about an organization using your system's external identifier.

This is particularly useful when you need to look up an organization using your own internal identifiers rather than Scalekit's ID.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.organization.getOrganizationByExternalId('customer_12345');
const org = response.organization;

console.log('Scalekit ID:', org.id);
console.log('Organization:', org.displayName);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` - Your system's unique identifier for the organization

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.organization.<a href="/src/organization.ts">updateOrganization</a>(id, organization) -> Promise&lt;UpdateOrganizationResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an organization's properties using its Scalekit ID.

Use this method to modify an organization's display name, external ID, or custom metadata. Only the fields you specify in the update object will be changed.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.organization.updateOrganization('org_12345', {
  displayName: 'Acme Corporation (Updated)',
  metadata: {
    industry: 'Technology',
    size: 'Enterprise'
  }
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` - The Scalekit organization identifier (format: "org_...")

</dd>
</dl>

<dl>
<dd>

**organization:** `PartialMessage<UpdateOrganization>` - Object containing fields to update

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.organization.<a href="/src/organization.ts">updateOrganizationByExternalId</a>(externalId, organization) -> Promise&lt;UpdateOrganizationResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an organization's properties using your system's external identifier.

This method provides the same functionality as updateOrganization but allows you to reference the organization using your own internal identifier.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.organization.updateOrganizationByExternalId(
  'customer_12345',
  { displayName: 'New Company Name' }
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` - Your system's unique identifier for the organization

</dd>
</dl>

<dl>
<dd>

**organization:** `PartialMessage<UpdateOrganization>` - Object containing fields to update

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.organization.<a href="/src/organization.ts">deleteOrganization</a>(organizationId) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Permanently deletes an organization from your Scalekit environment.

This operation removes the organization and all associated data including SSO connections, users, and settings. This action cannot be undone, so use with caution.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.organization.deleteOrganization('org_12345');
console.log('Organization deleted successfully');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The Scalekit organization identifier to delete

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.organization.<a href="/src/organization.ts">generatePortalLink</a>(organizationId) -> Promise&lt;Link&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a single use Admin Portal URL valid for 1 minute.

Once the generated admin portal URL is accessed or rendered, a temporary session of 6 hours is created to allow the admin to update SSO/SCIM configuration.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
app.get('/admin/sso-settings', async (req, res) => {
  const organizationId = req.user.organizationId;

  const link = await scalekitClient.organization.generatePortalLink(organizationId);

  res.redirect(link.location);
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The Scalekit organization ID

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.organization.<a href="/src/organization.ts">updateOrganizationSettings</a>(organizationId, settings) -> Promise&lt;GetOrganizationResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates configuration settings and feature flags for an organization.

Use this method to enable or disable organization-level features such as SSO configuration, directory synchronization, session management, and other organization-specific settings.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.organization.updateOrganizationSettings('org_12345', {
  features: [
    { name: 'sso', enabled: true },
    { name: 'directory_sync', enabled: true }
  ]
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The Scalekit organization identifier

</dd>
</dl>

<dl>
<dd>

**settings:** `OrganizationSettings` - Configuration settings object

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.organization.<a href="/src/organization.ts">upsertUserManagementSettings</a>(organizationId, settings) -> Promise&lt;OrganizationUserManagementSettings | undefined&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates or updates user management settings for an organization.

This method allows you to configure user-related constraints and policies at the organization level, such as setting a maximum number of allowed users.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const settings = await scalekitClient.organization.upsertUserManagementSettings(
  'org_12345',
  { maxAllowedUsers: 100 }
);

console.log('Max users allowed:', settings?.maxAllowedUsers);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The Scalekit organization identifier

</dd>
</dl>

<dl>
<dd>

**settings:** `OrganizationUserManagementSettingsInput` - User management configuration

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Connections

<details><summary><code>client.connection.<a href="/src/connection.ts">getConnection</a>(organizationId, id) -> Promise&lt;GetConnectionResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves complete configuration and status details for a specific SSO connection.

Use this method to fetch comprehensive information about an organization's SSO connection, including provider settings, protocol details (SAML/OIDC), enabled status, and configuration metadata.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.connection.getConnection(
  'org_123456',
  'conn_abc123'
);

const conn = response.connection;
console.log('Provider:', conn.provider);
console.log('Type:', conn.type);
console.log('Status:', conn.enabled ? 'Enabled' : 'Disabled');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID that owns the connection

</dd>
</dl>

<dl>
<dd>

**id:** `string` - The connection identifier to retrieve

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.connection.<a href="/src/connection.ts">listConnectionsByDomain</a>(domain) -> Promise&lt;ListConnectionsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists all SSO connections associated with a specific email domain.

Use this method to discover which organizations have SSO configured for a particular domain. This is useful for implementing domain-based SSO routing where users are automatically directed to their organization's SSO based on their email domain.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.connection.listConnectionsByDomain('acme.com');

if (response.connections.length > 0) {
  console.log('SSO available for domain acme.com');
  const connection = response.connections[0];
  console.log('Organization:', connection.organizationId);
}
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**domain:** `string` - The email domain to search for (e.g., "acme.com")

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.connection.<a href="/src/connection.ts">listConnections</a>(organizationId) -> Promise&lt;ListConnectionsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists all SSO connections configured for an organization.

Retrieves all enterprise SSO connections (SAML, OIDC) that have been configured for the specified organization.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.connection.listConnections('org_123456');

console.log(`Found ${response.connections.length} connections`);
response.connections.forEach(conn => {
  console.log(`- ${conn.provider} (${conn.type}): ${conn.enabled ? 'Enabled' : 'Disabled'}`);
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.connection.<a href="/src/connection.ts">enableConnection</a>(organizationId, id) -> Promise&lt;ToggleConnectionResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Enables an SSO connection for an organization.

Activates a previously disabled or newly configured SSO connection, allowing users from the organization to authenticate using this identity provider.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.connection.enableConnection(
  'org_123456',
  'conn_abc123'
);

console.log('Connection enabled:', response.connection.enabled);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**id:** `string` - The connection ID to enable

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.connection.<a href="/src/connection.ts">disableConnection</a>(organizationId, id) -> Promise&lt;ToggleConnectionResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Disables an SSO connection for an organization.

Deactivates an SSO connection, preventing users from authenticating via this identity provider. Existing user sessions remain valid.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.connection.disableConnection(
  'org_123456',
  'conn_abc123'
);

console.log('Connection disabled:', !response.connection.enabled);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**id:** `string` - The connection ID to disable

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Users

<details><summary><code>client.user.<a href="/src/user.ts">createUserAndMembership</a>(organizationId, options) -> Promise&lt;CreateUserAndMembershipResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new user and adds them as a member of an organization in a single operation.

This is the primary method for user provisioning. It creates the user account and establishes their membership in the specified organization. Optionally sends an invitation email to the user.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.user.createUserAndMembership(
  'org_123456',
  {
    email: 'john.doe@company.com',
    userProfile: {
      firstName: 'John',
      lastName: 'Doe'
    },
    sendInvitationEmail: true,
    metadata: {
      department: 'Engineering'
    }
  }
);

console.log('User created:', response.user.id);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID to add the user to

</dd>
</dl>

<dl>
<dd>

**options:** `CreateUserRequest` - User creation configuration
- `email: string` - User's email address (required)
- `userProfile?: object` - User profile information
- `metadata?: Record<string, string>` - Custom metadata
- `sendInvitationEmail?: boolean` - Whether to send invitation email

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.user.<a href="/src/user.ts">getUser</a>(userId) -> Promise&lt;GetUserResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves comprehensive details about a specific user including their profile and memberships.

Use this method to fetch complete user information including their organization memberships, roles, profile details, and custom metadata.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.user.getUser('usr_123456');
const user = response.user;

console.log('User:', user.email);
console.log('Name:', user.userProfile?.firstName, user.userProfile?.lastName);
console.log('Organizations:', user.memberships?.length);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**userId:** `string` - The Scalekit-generated user identifier

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.user.<a href="/src/user.ts">listUsers</a>(options?) -> Promise&lt;ListUsersResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a paginated list of all users across your Scalekit environment.

This method returns all users in your environment regardless of organization membership.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.user.listUsers({
  pageSize: 20
});

console.log('Users:', response.users.length);
console.log('Total users:', response.totalSize);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**options:** `object` - Optional pagination parameters
- `pageSize?: number` - Number of users to return per page (10-100)
- `pageToken?: string` - Token for retrieving the next page

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.user.<a href="/src/user.ts">updateUser</a>(userId, options) -> Promise&lt;UpdateUserResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates a user's profile information and custom metadata.

Use this method to modify user profile details such as name or to update custom metadata associated with the user.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.user.updateUser('usr_123456', {
  userProfile: {
    firstName: 'John',
    lastName: 'Smith'
  },
  metadata: {
    department: 'Engineering',
    title: 'Senior Developer'
  }
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**userId:** `string` - The Scalekit user identifier

</dd>
</dl>

<dl>
<dd>

**options:** `UpdateUserRequestType` - Object containing fields to update

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.user.<a href="/src/user.ts">deleteUser</a>(userId) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Permanently deletes a user from your Scalekit environment.

This operation removes the user's profile, all organization memberships, and related data. This action is irreversible.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.user.deleteUser('usr_123456');
console.log('User deleted successfully');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**userId:** `string` - The Scalekit user identifier to delete

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.user.<a href="/src/user.ts">createMembership</a>(organizationId, userId, options?) -> Promise&lt;CreateMembershipResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Adds an existing user as a member of a new organization with specified roles.

Use this method to grant organization access to users who already have accounts in your Scalekit environment.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.user.createMembership(
  'org_123456',
  'usr_789012',
  {
    roles: ['admin'],
    sendInvitationEmail: true
  }
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID to add the user to

</dd>
</dl>

<dl>
<dd>

**userId:** `string` - The user ID to add as a member

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Optional membership configuration
- `roles?: string[]` - Array of role names
- `metadata?: Record<string, string>` - Custom metadata
- `sendInvitationEmail?: boolean` - Whether to send invitation email

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.user.<a href="/src/user.ts">deleteMembership</a>(organizationId, userId) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes a user's membership from a specific organization.

This operation revokes the user's access to the specified organization while keeping their user account intact.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.user.deleteMembership('org_123456', 'usr_789012');
console.log('User removed from organization');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID to remove the user from

</dd>
</dl>

<dl>
<dd>

**userId:** `string` - The user ID to remove

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.user.<a href="/src/user.ts">updateMembership</a>(organizationId, userId, options?) -> Promise&lt;UpdateMembershipResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates a user's roles and metadata within a specific organization.

Use this method to modify a user's permissions by changing their assigned roles or to update membership-specific metadata.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.user.updateMembership(
  'org_123456',
  'usr_789012',
  { roles: ['admin'] }
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**userId:** `string` - The user ID

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Fields to update
- `roles?: string[]` - Array of role names (replaces existing)
- `metadata?: Record<string, string>` - Custom metadata

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.user.<a href="/src/user.ts">listOrganizationUsers</a>(organizationId, options?) -> Promise&lt;ListOrganizationUsersResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a paginated list of all users who are members of a specific organization.

This method returns all users with access to the specified organization, including their roles, membership details, and profiles.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.user.listOrganizationUsers('org_123456', {
  pageSize: 25
});

console.log('Organization users:', response.users.length);
console.log('Total members:', response.totalSize);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Optional pagination parameters
- `pageSize?: number` - Number of users per page (1-100)
- `pageToken?: string` - Token for next page

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.user.<a href="/src/user.ts">resendInvite</a>(organizationId, userId) -> Promise&lt;ResendInviteResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Resends an invitation email to a user for a specific organization.

Use this method when a user hasn't received or has lost their invitation email.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.user.resendInvite('org_123456', 'usr_789012');
console.log('Invitation resent:', response.invite);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**userId:** `string` - The user ID

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Domains

<details><summary><code>client.domain.<a href="/src/domain.ts">createDomain</a>(organizationId, name, options?) -> Promise&lt;CreateDomainResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Adds a new domain configuration to an organization for SSO routing or user suggestions.

Domains serve two purposes based on their type:
- **ORGANIZATION_DOMAIN**: Used to identify the SSO connection for the organization
- **ALLOWED_EMAIL_DOMAIN**: Enables users to join the organization with automatic suggestions

Note: Public disposable domains (gmail.com, outlook.com, etc.) are automatically blocked for security.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.domain.createDomain(
  'org_123456',
  'acme.com',
  { domainType: 'ORGANIZATION_DOMAIN' }
);

console.log('Domain created:', response.domain.id);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**name:** `string` - The domain name (e.g., "acme.com")

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Optional domain configuration
- `domainType?: DomainType | string` - Domain type: 'ALLOWED_EMAIL_DOMAIN' or 'ORGANIZATION_DOMAIN'

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.domain.<a href="/src/domain.ts">getDomain</a>(organizationId, domainId) -> Promise&lt;GetDomainResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves detailed information about a specific domain configuration.

Returns complete domain details including the domain name, type, verification status, and timestamps.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.domain.getDomain(
  'org_123456',
  'domain_abc123'
);

console.log('Domain:', response.domain.domain);
console.log('Type:', response.domain.domainType);
console.log('Verified:', response.domain.verificationStatus);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**domainId:** `string` - The domain ID

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.domain.<a href="/src/domain.ts">listDomains</a>(organizationId, options?) -> Promise&lt;ListDomainResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves all domain configurations for an organization.

Returns a complete list of domains configured for the organization, including both ORGANIZATION_DOMAIN and ALLOWED_EMAIL_DOMAIN types.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.domain.listDomains('org_123456');

console.log(`Found ${response.domains.length} domains`);
response.domains.forEach(domain => {
  console.log(`- ${domain.domain} (${domain.domainType}): ${domain.verificationStatus}`);
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Optional parameters
- `domainType?: DomainType | string` - Filter by domain type

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.domain.<a href="/src/domain.ts">deleteDomain</a>(organizationId, domainId) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a domain from an organization.

Removes the domain configuration from the organization. Users with email addresses from this domain will no longer be automatically routed to this organization's SSO connection.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.domain.deleteDomain('org_123456', 'domain_abc123');
console.log('Domain deleted successfully');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**domainId:** `string` - The domain ID to delete

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Directories

<details><summary><code>client.directory.<a href="/src/directory.ts">listDirectories</a>(organizationId) -> Promise&lt;ListDirectoriesResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves all SCIM directories configured for an organization.

Lists all directory sync connections that have been set up for the organization. Each directory represents a SCIM integration with an identity provider.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.directory.listDirectories('org_123456');

console.log(`Found ${response.directories.length} directories`);
response.directories.forEach(dir => {
  console.log(`- ${dir.provider}: ${dir.enabled ? 'Active' : 'Inactive'}`);
  console.log(`  Users: ${dir.userCount}, Groups: ${dir.groupCount}`);
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.directory.<a href="/src/directory.ts">getDirectory</a>(organizationId, directoryId) -> Promise&lt;GetDirectoryResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves comprehensive details about a specific SCIM directory.

Fetches complete configuration and status information for a directory, including provider settings, synchronization status, user/group counts, and metadata.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.directory.getDirectory(
  'org_123456',
  'dir_abc123'
);

const dir = response.directory;
console.log('Provider:', dir.provider);
console.log('Status:', dir.enabled ? 'Active' : 'Inactive');
console.log('Users:', dir.userCount);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**directoryId:** `string` - The directory ID

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.directory.<a href="/src/directory.ts">getPrimaryDirectoryByOrganizationId</a>(organizationId) -> Promise&lt;Directory&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves the primary (first) directory for an organization.

This is a convenience method that fetches the first directory from the organization's list of directories. Most organizations have a single directory.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const directory = await scalekitClient.directory.getPrimaryDirectoryByOrganizationId('org_123456');

console.log('Primary Directory:', directory.provider);
console.log('Users:', directory.userCount);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.directory.<a href="/src/directory.ts">listDirectoryUsers</a>(organizationId, directoryId, options?) -> Promise&lt;ListDirectoryUsersResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists users synchronized from an identity provider via SCIM directory sync.

Retrieves all users that have been synced from the organization's IdP to your application.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.directory.listDirectoryUsers(
  'org_123456',
  'dir_abc123',
  { pageSize: 50 }
);

console.log(`Found ${response.totalSize} users`);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**directoryId:** `string` - The directory ID

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Optional filtering and pagination parameters
- `pageSize?: number` - Number of users per page (max: 100)
- `pageToken?: string` - Token for next page
- `includeDetail?: boolean` - Include full user profile details
- `directoryGroupId?: string` - Filter by group membership
- `updatedAfter?: string` - ISO 8601 timestamp

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.directory.<a href="/src/directory.ts">listDirectoryGroups</a>(organizationId, directoryId, options?) -> Promise&lt;ListDirectoryGroupsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves groups synchronized from an identity provider via SCIM directory sync.

Fetches all groups that have been synced from the organization's IdP to your application.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.directory.listDirectoryGroups(
  'org_123456',
  'dir_abc123',
  { pageSize: 30 }
);

console.log(`Found ${response.totalSize} groups`);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**directoryId:** `string` - The directory ID

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Optional filtering and pagination parameters
- `pageSize?: number` - Number of groups per page (max: 30)
- `pageToken?: string` - Token for next page
- `includeDetail?: boolean` - Include full group details
- `updatedAfter?: string` - ISO 8601 timestamp

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.directory.<a href="/src/directory.ts">enableDirectory</a>(organizationId, directoryId) -> Promise&lt;ToggleDirectoryResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Enables SCIM directory synchronization for an organization.

Activates automatic user and group synchronization from the organization's identity provider.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.directory.enableDirectory(
  'org_123456',
  'dir_abc123'
);

console.log('Directory enabled:', response.directory.enabled);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**directoryId:** `string` - The directory ID to enable

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.directory.<a href="/src/directory.ts">disableDirectory</a>(organizationId, directoryId) -> Promise&lt;ToggleDirectoryResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Disables SCIM directory synchronization for an organization.

Stops automatic user and group synchronization from the organization's identity provider. Existing synced users and groups remain in your application.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.directory.disableDirectory(
  'org_123456',
  'dir_abc123'
);

console.log('Directory disabled:', !response.directory.enabled);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**organizationId:** `string` - The organization ID

</dd>
</dl>

<dl>
<dd>

**directoryId:** `string` - The directory ID to disable

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Sessions

<details><summary><code>client.session.<a href="/src/session.ts">getSession</a>(sessionId) -> Promise&lt;SessionDetails&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves comprehensive metadata and status for a specific user session.

Fetches complete session information including authentication status, device details, IP address, geolocation, and expiration timelines.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const session = await scalekitClient.session.getSession('ses_123456');

console.log('Status:', session.status);
console.log('User:', session.userId);
console.log('Device:', session.deviceInfo);
console.log('Location:', session.geoLocation);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` - The session identifier to retrieve

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.session.<a href="/src/session.ts">getUserSessions</a>(userId, options?) -> Promise&lt;UserSessionDetails&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a paginated list of all sessions for a specific user across all devices and browsers.

Lists all user sessions with support for filtering by status and time range. Essential for displaying active sessions in account management.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.session.getUserSessions('usr_123456', {
  filter: { status: ['active'] },
  pageSize: 20
});

console.log(`User has ${response.totalSize} active sessions`);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**userId:** `string` - The user identifier

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Optional pagination and filtering parameters
- `pageSize?: number` - Number of sessions per page
- `pageToken?: string` - Token for next page
- `filter?: object` - Filter criteria
  - `status?: string[]` - Filter by status ('active', 'expired', 'revoked', 'logout')
  - `startTime?: Date` - Include sessions created after this time
  - `endTime?: Date` - Include sessions created before this time

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.session.<a href="/src/session.ts">revokeSession</a>(sessionId) -> Promise&lt;RevokeSessionResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Immediately invalidates a specific user session by setting its status to 'revoked'.

Terminates a single session, forcing the user to re-authenticate on that specific device. The revocation is instantaneous and irreversible.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.session.revokeSession('ses_123456');
console.log('Session revoked at:', response.revokedAt);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**sessionId:** `string` - The session identifier to revoke

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.session.<a href="/src/session.ts">revokeAllUserSessions</a>(userId) -> Promise&lt;RevokeAllUserSessionsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Immediately invalidates all active sessions for a user across all devices and browsers.

Terminates all active sessions simultaneously, forcing the user to re-authenticate everywhere. Only active sessions are revoked.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.session.revokeAllUserSessions('usr_123456');

console.log(`Revoked ${response.totalCount} sessions`);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**userId:** `string` - The user identifier whose sessions should be revoked

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Roles

<details><summary><code>client.role.<a href="/src/role.ts">createRole</a>(role) -> Promise&lt;CreateRoleResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new environment-level role with specified permissions.

Environment roles are available across all organizations in your environment.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.role.createRole({
  name: 'content_editor',
  displayName: 'Content Editor',
  description: 'Can create and edit content',
  permissions: ['content:read', 'content:write', 'content:edit']
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**role:** `CreateRole` - Role creation object containing:
- `name: string` - Unique role identifier
- `displayName: string` - Human-readable name
- `description: string` - Purpose and scope
- `permissions: string[]` - Array of permission strings
- `baseRole?: string` - Optional parent role for inheritance

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">getRole</a>(roleName) -> Promise&lt;GetRoleResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves complete information for a specific environment role.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.role.getRole('content_editor');
console.log('Role:', response.role.displayName);
console.log('Permissions:', response.role.permissions);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**roleName:** `string` - Unique role identifier

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">listRoles</a>() -> Promise&lt;ListRolesResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists all environment-level roles available in your Scalekit environment.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.role.listRoles();
response.roles.forEach(role => {
  console.log(`${role.displayName}: ${role.permissions.length} permissions`);
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

None

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">updateRole</a>(roleName, role) -> Promise&lt;UpdateRoleResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an existing environment role's properties and permissions.

Only specified fields are updated. The new permission list replaces existing permissions.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.role.updateRole('content_editor', {
  displayName: 'Content Editor (Updated)',
  permissions: ['content:read', 'content:write', 'content:edit', 'content:review']
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**roleName:** `string` - Role to update

</dd>
</dl>

<dl>
<dd>

**role:** `UpdateRole` - Updated role properties

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">deleteRole</a>(roleName, reassignRoleName?) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an environment role and reassigns its users to another role.

Cannot delete if dependent roles exist. Users must be reassigned before deletion. This operation is irreversible.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.role.deleteRole('old_role', 'new_role');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**roleName:** `string` - Role to delete

</dd>
</dl>

<dl>
<dd>

**reassignRoleName:** `string` - Target role for user migration (optional)

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">getRoleUsersCount</a>(roleName) -> Promise&lt;GetRoleUsersCountResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets the number of users assigned to an environment role.

Useful for capacity planning, security auditing, and impact assessment before role changes.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.role.getRoleUsersCount('admin');
console.log(`${response.count} users have admin role`);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**roleName:** `string` - Role to count users for

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">createOrganizationRole</a>(orgId, role) -> Promise&lt;CreateOrganizationRoleResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new organization-specific role with custom permissions.

Organization roles are scoped to a specific organization for multi-tenant isolation.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.role.createOrganizationRole('org_123456', {
  name: 'department_lead',
  displayName: 'Department Lead',
  description: 'Manages department members',
  permissions: ['dept:members:read', 'dept:members:invite']
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orgId:** `string` - Organization identifier

</dd>
</dl>

<dl>
<dd>

**role:** `CreateOrganizationRole` - Role configuration

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">getOrganizationRole</a>(orgId, roleName) -> Promise&lt;GetOrganizationRoleResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves details for a specific organization role.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.role.getOrganizationRole(
  'org_123456',
  'department_lead'
);

console.log('Permissions:', response.role.permissions);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orgId:** `string` - Organization identifier

</dd>
</dl>

<dl>
<dd>

**roleName:** `string` - Role name to retrieve

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">listOrganizationRoles</a>(orgId) -> Promise&lt;ListOrganizationRolesResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists all roles available to an organization (environment + organization-specific).

Returns both environment-level roles and organization-scoped roles.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.role.listOrganizationRoles('org_123456');
response.roles.forEach(role => {
  console.log(`${role.displayName} (${role.scope})`);
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orgId:** `string` - Organization identifier

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">updateOrganizationRole</a>(orgId, roleName, role) -> Promise&lt;UpdateOrganizationRoleResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an organization role's properties and permissions.

Only specified fields are updated. New permissions replace existing ones.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.role.updateOrganizationRole('org_123456', 'department_lead', {
  permissions: ['dept:members:read', 'dept:members:invite', 'dept:members:remove']
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orgId:** `string` - Organization identifier

</dd>
</dl>

<dl>
<dd>

**roleName:** `string` - Role to update

</dd>
</dl>

<dl>
<dd>

**role:** `UpdateRole` - Updated role properties

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">deleteOrganizationRole</a>(orgId, roleName, reassignRoleName?) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an organization role and reassigns its users.

Cannot delete if dependent roles exist. Users must be reassigned. Operation is irreversible.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.role.deleteOrganizationRole(
  'org_123456',
  'old_role',
  'new_role'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orgId:** `string` - Organization identifier

</dd>
</dl>

<dl>
<dd>

**roleName:** `string` - Role to delete

</dd>
</dl>

<dl>
<dd>

**reassignRoleName:** `string` - Target role for user migration (optional)

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">getOrganizationRoleUsersCount</a>(orgId, roleName) -> Promise&lt;GetOrganizationRoleUsersCountResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets the number of users assigned to an organization role.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.role.getOrganizationRoleUsersCount(
  'org_123456',
  'admin'
);

console.log(`${response.count} admins in this organization`);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orgId:** `string` - Organization identifier

</dd>
</dl>

<dl>
<dd>

**roleName:** `string` - Role to count users for

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">updateDefaultOrganizationRoles</a>(orgId, defaultMemberRole) -> Promise&lt;UpdateDefaultOrganizationRolesResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Sets the default role automatically assigned to new organization members.

This is the role that is by default assigned to every new user added to this organization.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.role.updateDefaultOrganizationRoles('org_123456', 'member');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orgId:** `string` - Organization identifier

</dd>
</dl>

<dl>
<dd>

**defaultMemberRole:** `string` - Role name to assign by default

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.role.<a href="/src/role.ts">deleteOrganizationRoleBase</a>(orgId, roleName) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes a role's inheritance relationship, eliminating inherited permissions from base role.

Role retains only directly assigned permissions after removal. This action cannot be undone.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.role.deleteOrganizationRoleBase('org_123456', 'custom_role');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orgId:** `string` - Organization identifier

</dd>
</dl>

<dl>
<dd>

**roleName:** `string` - Role to remove inheritance from

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Permissions

<details><summary><code>client.permission.<a href="/src/permission.ts">createPermission</a>(permission) -> Promise&lt;CreatePermissionResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new permission defining a specific action users can perform.

Permissions represent granular access controls following the 'action:resource' format.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.permission.createPermission({
  name: 'read:invoices',
  description: 'View invoice details'
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**permission:** `CreatePermission` - Permission object containing:
- `name: string` - Permission identifier (e.g., 'read:documents')
- `description?: string` - Explanation of what this permission grants

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.permission.<a href="/src/permission.ts">getPermission</a>(permissionName) -> Promise&lt;GetPermissionResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves complete information for a specific permission.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.permission.getPermission('read:invoices');
console.log('Description:', response.permission.description);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**permissionName:** `string` - Permission identifier

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.permission.<a href="/src/permission.ts">listPermissions</a>(pageToken?, pageSize?) -> Promise&lt;ListPermissionsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists all permissions with pagination support.

View all permission definitions for auditing, role management, or understanding available access controls.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.permission.listPermissions();
response.permissions.forEach(perm => {
  console.log(`${perm.name}: ${perm.description}`);
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**pageToken:** `string` - Token for retrieving the next page (optional)

</dd>
</dl>

<dl>
<dd>

**pageSize:** `number` - Number of permissions per page (max: 100) (optional)

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.permission.<a href="/src/permission.ts">updatePermission</a>(permissionName, permission) -> Promise&lt;UpdatePermissionResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an existing permission's attributes.

Note: The permission name itself cannot be changed as it serves as the immutable identifier.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.permission.updatePermission('read:invoices', {
  name: 'read:invoices',
  description: 'View invoice details and history (updated)'
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**permissionName:** `string` - Permission to update

</dd>
</dl>

<dl>
<dd>

**permission:** `CreatePermission` - Updated permission properties

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.permission.<a href="/src/permission.ts">deletePermission</a>(permissionName) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Permanently removes a permission.

Ensure no active roles depend on the permission before deletion.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.permission.deletePermission('deprecated:feature');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**permissionName:** `string` - Permission identifier to delete

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.permission.<a href="/src/permission.ts">listRolePermissions</a>(roleName) -> Promise&lt;ListRolePermissionsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists direct permissions assigned to a role (excluding inherited permissions).

Use this to view explicit permission assignments without inheritance from base roles.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.permission.listRolePermissions('editor');
console.log('Direct permissions:', response.permissions);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**roleName:** `string` - Role to examine

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.permission.<a href="/src/permission.ts">addPermissionsToRole</a>(roleName, permissionNames) -> Promise&lt;AddPermissionsToRoleResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Grants additional permissions to a role without removing existing assignments.

This is an incremental operation that adds new permissions while preserving existing ones.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.permission.addPermissionsToRole('editor', [
  'read:documents',
  'write:documents',
  'edit:documents'
]);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**roleName:** `string` - Target role to enhance

</dd>
</dl>

<dl>
<dd>

**permissionNames:** `string[]` - Array of permission identifiers to add

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.permission.<a href="/src/permission.ts">removePermissionFromRole</a>(roleName, permissionName) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Revokes a specific permission from a role, restricting access for all assigned users.

Only affects direct assignments; doesn't impact inherited permissions from base roles.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.permission.removePermissionFromRole('editor', 'delete:documents');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**roleName:** `string` - Role to modify

</dd>
</dl>

<dl>
<dd>

**permissionName:** `string` - Permission to remove

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.permission.<a href="/src/permission.ts">listEffectiveRolePermissions</a>(roleName) -> Promise&lt;ListEffectiveRolePermissionsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists all effective permissions for a role including both direct and inherited permissions.

This returns the complete set of capabilities available through the role hierarchy.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.permission.listEffectiveRolePermissions('senior_editor');

console.log('Total effective permissions:', response.permissions.length);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**roleName:** `string` - Role to analyze

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Passwordless

<details><summary><code>client.passwordless.<a href="/src/passwordless.ts">sendPasswordlessEmail</a>(email, options?) -> Promise&lt;SendPasswordlessResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Send a passwordless authentication email with OTP or magic link.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.passwordless.sendPasswordlessEmail(
  'user@example.com',
  {
    template: 'SIGNIN',
    state: 'random-state',
    expiresIn: 3600
  }
);

console.log('Auth Request ID:', response.authRequestId);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**email:** `string` - The email address to send the passwordless link to

</dd>
</dl>

<dl>
<dd>

**options:** `object` - The options for sending the passwordless email
- `template?: TemplateType` - The template type (SIGNIN/SIGNUP)
- `state?: string` - Optional state parameter
- `magiclinkAuthUri?: string` - Optional auth URI for magic link
- `expiresIn?: number` - Optional expiration time in seconds (default: 3600)
- `templateVariables?: Record<string, string>` - Optional template variables

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.passwordless.<a href="/src/passwordless.ts">verifyPasswordlessEmail</a>(credential, authRequestId?) -> Promise&lt;VerifyPasswordLessResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Verify a passwordless authentication code or link token.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.passwordless.verifyPasswordlessEmail(
  { code: '123456' },
  'auth_request_id'
);

console.log('Email:', response.email);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**credential:** `object` - The credential to verify
- `code?: string` - The one-time code received via email
- `linkToken?: string` - The link token received via email

</dd>
</dl>

<dl>
<dd>

**authRequestId:** `string` - Optional auth request ID from the send response

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.passwordless.<a href="/src/passwordless.ts">resendPasswordlessEmail</a>(authRequestId) -> Promise&lt;SendPasswordlessResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Resend a passwordless authentication email.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.passwordless.resendPasswordlessEmail('auth_request_id');
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**authRequestId:** `string` - The auth request ID from the original send response

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## WebAuthn

<details><summary><code>client.webauthn.<a href="/src/webauthn.ts">listCredentials</a>(userId) -> Promise&lt;ListCredentialsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all WebAuthn credentials for a user.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.webauthn.listCredentials('usr_123456');
console.log('Credentials:', response.credentials);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**userId:** `string` - The user ID to list credentials for

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webauthn.<a href="/src/webauthn.ts">updateCredential</a>(credentialId, displayName) -> Promise&lt;UpdateCredentialResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a WebAuthn credential's display name.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.webauthn.updateCredential(
  'cred_123',
  'My YubiKey'
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**credentialId:** `string` - The credential ID to update

</dd>
</dl>

<dl>
<dd>

**displayName:** `string` - The new display name for the credential

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webauthn.<a href="/src/webauthn.ts">deleteCredential</a>(credentialId) -> Promise&lt;DeleteCredentialResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a WebAuthn credential.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.webauthn.deleteCredential('cred_123');
console.log('Deleted:', response.success);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**credentialId:** `string` - The credential ID to delete

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Auth

<details><summary><code>client.auth.<a href="/src/auth.ts">updateLoginUserDetails</a>(connectionId, loginRequestId, user) -> Promise&lt;Empty&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates user details for an ongoing authentication request.

If you are using Auth for MCP solution of Scalekit in "Bring your own Auth" mode, this method helps updating Scalekit with the currently logged in user details for the ongoing authentication request.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.auth.updateLoginUserDetails(
  'conn_abc123',
  'login_xyz789',
  {
    email: 'john.doe@company.com',
    sub: 'unique_user_id_456',
  }
);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**connectionId:** `string` - The SSO connection ID being used for authentication

</dd>
</dl>

<dl>
<dd>

**loginRequestId:** `string` - The unique login request identifier from the auth flow

</dd>
</dl>

<dl>
<dd>

**user:** `UserInput` - User details to update
- `email?: string` - User's email address
- `sub?: string` - Unique user identifier (subject)

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Tools

<details><summary><code>client.tools.<a href="/src/tools.ts">listTools</a>(options?) -> Promise&lt;ListToolsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists tools available in your workspace with optional filtering and pagination. Use filter to narrow by provider, identifier, or tool names. Use summary filter to return only tool names.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
// List all tools
const response = await scalekitClient.tools.listTools();

// List tools with filter and pagination
const filtered = await scalekitClient.tools.listTools({
  filter: { provider: 'GOOGLE', toolName: ['gmail_send_email'] },
  pageSize: 20,
  pageToken: response.nextPageToken,
});

// List only tool names (summary mode)
const names = await scalekitClient.tools.listTools({
  filter: { summary: true },
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**options:** `object` (optional)
- `filter?: object` - Filter by provider, identifier, toolName, summary
- `pageSize?: number` - Maximum number of tools per page
- `pageToken?: string` - Token from a previous response for pagination

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/tools.ts">listScopedTools</a>(identifier, options) -> Promise&lt;ListScopedToolsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists tools scoped to a specific connected account identifier. The filter is required by the API: you must pass a filter object with at least one non-empty array among `providers`, `toolNames`, or `connectionNames`. Empty arrays or omitting the filter will result in an error.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
// List scoped tools (filter is required; at least one of providers, toolNames, or connectionNames must be a non-empty array)
const response = await scalekitClient.tools.listScopedTools('user@example.com', {
  filter: {
    providers: ['GOOGLE'],
    toolNames: ['gmail_send_email'],
  },
  pageSize: 10,
});

// Paginate scoped tools
const nextPage = await scalekitClient.tools.listScopedTools('user@example.com', {
  filter: { providers: ['GOOGLE'] },
  pageSize: 10,
  pageToken: response.nextPageToken,
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**identifier:** `string` - Connected account identifier (e.g., email or workspace ID) to scope the tools list

</dd>
</dl>

<dl>
<dd>

**options:** `object` - Required. Must include a filter (required by the API).
- `filter:` `object` - Required by the API. Must contain at least one non-empty array: `providers`, `toolNames`, or `connectionNames`. Example: `{ providers: ['GOOGLE'] }` or `{ toolNames: ['gmail_send_email'] }`.
- `pageSize?:` `number` - Maximum number of tools per page
- `pageToken?:` `string` - Token from a previous response for pagination

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/tools.ts">executeTool</a>(params) -> Promise&lt;ExecuteToolResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Executes a tool using credentials from a connected account. Identify the connected account either by connectedAccountId or by the combination of identifier, connector, and optional organizationId/userId.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
// Execute with connected account ID
const result = await scalekitClient.tools.executeTool({
  toolName: 'gmail_send_email',
  connectedAccountId: 'ca_123',
  params: {
    to: 'user@example.com',
    subject: 'Hello',
    body: 'Hello World',
  },
});

// Execute with identifier and connector
const result2 = await scalekitClient.tools.executeTool({
  toolName: 'gmail_send_email',
  identifier: 'user@example.com',
  connector: 'google_workspace',
  organizationId: 'org_123',
  params: { to: 'user@example.com', subject: 'Test', body: 'Body' },
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**params:** `object`
- `toolName:` `string` - Name of the tool to execute
- `identifier?:` `string` - Connected account identifier (e.g., email, workspace ID)
- `params?:` `Record<string, unknown>` - JSON parameters for the tool
- `connectedAccountId?:` `string` - Direct ID of the connected account (ca_...)
- `connector?:` `string` - Connector/provider name when using identifier-based lookup
- `organizationId?:` `string` - Organization ID to scope the lookup
- `userId?:` `string` - User ID to scope the lookup

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Connected Accounts

<details><summary><code>client.connectedAccounts.<a href="/src/connected-accounts.ts">listConnectedAccounts</a>(options?) -> Promise&lt;ListConnectedAccountsResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists connected accounts with optional filters (organization, user, connector, identifier, provider, query) and pagination.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
// List all connected accounts
const response = await scalekitClient.connectedAccounts.listConnectedAccounts();

// List with filters and pagination
const filtered = await scalekitClient.connectedAccounts.listConnectedAccounts({
  organizationId: 'org_123',
  connector: 'notion',
  pageSize: 10,
  pageToken: response.nextPageToken,
});

// Search by query
const search = await scalekitClient.connectedAccounts.listConnectedAccounts({
  query: 'google',
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**options:** `object` (optional)
- `organizationId?: string` - Filter by organization ID
- `userId?: string` - Filter by user ID
- `connector?: string` - Filter by connector (e.g., notion, slack)
- `identifier?: string` - Filter by account identifier
- `provider?: string` - Filter by provider (e.g., google)
- `pageSize?: number` - Results per page
- `pageToken?: string` - Pagination token
- `query?: string` - Text search query

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.connectedAccounts.<a href="/src/connected-accounts.ts">createConnectedAccount</a>(params) -> Promise&lt;CreateConnectedAccountResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new connected account with OAuth or static auth details. Optionally scope to an organization or user.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
import {
  CreateConnectedAccount,
  AuthorizationDetails,
  OauthToken,
} from '@scalekit-sdk/node';

const oauthToken = new OauthToken({
  accessToken: 'ya29.xxx',
  refreshToken: '1//xxx',
  scopes: ['read', 'write'],
});
const authDetails = new AuthorizationDetails({
  details: { case: 'oauthToken', value: oauthToken },
});
const connectedAccount = new CreateConnectedAccount({
  authorizationDetails: authDetails,
});

const response = await scalekitClient.connectedAccounts.createConnectedAccount({
  connector: 'notion',
  identifier: 'workspace_123',
  connectedAccount,
  organizationId: 'org_123',
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**params:** `object`
- `connector:` `string` - Connector identifier (e.g., notion, gmail)
- `identifier:` `string` - Unique identifier for the account in the third-party service
- `connectedAccount:` `CreateConnectedAccount` - Auth details (e.g., OAuth tokens)
- `organizationId?:` `string` - Scope to organization
- `userId?:` `string` - Scope to user

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.connectedAccounts.<a href="/src/connected-accounts.ts">updateConnectedAccount</a>(params) -> Promise&lt;UpdateConnectedAccountResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an existing connected account. Target by connector + identifier, or by connectedAccountId.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const updatedAuth = new AuthorizationDetails({
  details: {
    case: 'oauthToken',
    value: new OauthToken({
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
      scopes: ['read', 'write', 'admin'],
    }),
  },
});
const updatePayload = new UpdateConnectedAccount({
  authorizationDetails: updatedAuth,
});

await scalekitClient.connectedAccounts.updateConnectedAccount({
  connector: 'notion',
  identifier: 'workspace_123',
  connectedAccount: updatePayload,
  connectedAccountId: 'ca_123', // optional; or use connector + identifier
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**params:** `object`
- `connector:` `string` - Connector identifier
- `identifier:` `string` - Account identifier
- `connectedAccount:` `UpdateConnectedAccount` - Updated auth/config
- `organizationId?:` `string` - Organization scope
- `userId?:` `string` - User scope
- `connectedAccountId?:` `string` - Target by account ID (ca_...)

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.connectedAccounts.<a href="/src/connected-accounts.ts">deleteConnectedAccount</a>(params) -> Promise&lt;DeleteConnectedAccountResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a connected account and revokes its credentials. Target by connector + identifier, or by connectedAccountId.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await scalekitClient.connectedAccounts.deleteConnectedAccount({
  connector: 'notion',
  identifier: 'workspace_123',
  organizationId: 'org_123',
});

// Or by account ID
await scalekitClient.connectedAccounts.deleteConnectedAccount({
  connector: 'notion',
  identifier: 'workspace_123',
  connectedAccountId: 'ca_123',
});
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**params:** `object`
- `connector:` `string` - Connector identifier
- `identifier:` `string` - Account identifier
- `organizationId?:` `string` - Organization scope
- `userId?:` `string` - User scope
- `connectedAccountId?:` `string` - Target by account ID (ca_...)

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.connectedAccounts.<a href="/src/connected-accounts.ts">getMagicLinkForConnectedAccount</a>(params) -> Promise&lt;GetMagicLinkForConnectedAccountResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generates a time-limited magic link for connecting or re-authorizing a third-party account (OAuth flow).
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.connectedAccounts.getMagicLinkForConnectedAccount({
  connector: 'notion',
  identifier: 'workspace_123',
  organizationId: 'org_123',
});

// Redirect user to response.link; link expires at response.expiry
console.log(response.link, response.expiry);
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**params:** `object`
- `connector:` `string` - Connector identifier
- `identifier:` `string` - Account identifier
- `organizationId?:` `string` - Organization scope
- `userId?:` `string` - User scope
- `connectedAccountId?:` `string` - Target by account ID (ca_...)

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.connectedAccounts.<a href="/src/connected-accounts.ts">getConnectedAccountByIdentifier</a>(params) -> Promise&lt;GetConnectedAccountByIdentifierResponse&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves full authentication details for a connected account (including tokens). Returns sensitive data; protect access appropriately.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await scalekitClient.connectedAccounts.getConnectedAccountByIdentifier({
  connector: 'notion',
  identifier: 'workspace_123',
  organizationId: 'org_123',
});

const account = response.connectedAccount;
// account.authorizationDetails, account.id, etc.
```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**params:** `object`
- `connector:` `string` - Connector identifier
- `identifier:` `string` - Account identifier
- `organizationId?:` `string` - Organization scope
- `userId?:` `string` - User scope
- `connectedAccountId?:` `string` - Target by account ID (ca_...)

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

____
