# Scalekit Node SDK API Reference

This document provides a comprehensive reference for all available API methods in the Scalekit Node SDK.

## Table of Contents

- [Initialization](#initialization)
- [Authentication](#authentication)
  - [getAuthorizationUrl](#getauthorizationurl)
  - [authenticateWithCode](#authenticatewithcode)
  - [validateAccessToken](#validateaccesstoken)
  - [getIdpInitiatedLoginClaims](#getidpinitiatedloginclaims)
  - [verifyWebhookPayload](#verifywebhookpayload)
- [Organization Management](#organization-management)
  - [createOrganization](#createorganization)
  - [listOrganization](#listorganization)
  - [getOrganization](#getorganization)
  - [getOrganizationByExternalId](#getorganizationbyexternalid)
  - [updateOrganization](#updateorganization)
  - [updateOrganizationByExternalId](#updateorganizationbyexternalid)
  - [deleteOrganization](#deleteorganization)
  - [generatePortalLink](#generateportallink)
  - [updateOrganizationSettings](#updateorganizationsettings)
- [Directory Management](#directory-management)
  - [listDirectories](#listdirectories)
  - [getDirectory](#getdirectory)
  - [getPrimaryDirectoryByOrganizationId](#getprimarydirectorybyorganizationid)
  - [listDirectoryUsers](#listdirectoryusers)
  - [listDirectoryGroups](#listdirectorygroups)
  - [enableDirectory](#enabledirectory)
  - [disableDirectory](#disabledirectory)
- [Domain Management](#domain-management)
  - [createDomain](#createdomain)
  - [listDomains](#listdomains)
- [Connection Management](#connection-management)
  - [getConnection](#getconnection)
  - [listConnectionsByDomain](#listconnectionsbydomain)
  - [listConnections](#listconnections)
  - [enableConnection](#enableconnection)
  - [disableConnection](#disableconnection)

## Initialization

To initialize the Scalekit SDK:

```javascript
const { ScalekitClient } = require('@scalekit-sdk/node');

const scalekit = new ScalekitClient(
  envUrl, // The Scalekit environment URL
  clientId, // Your client ID
  clientSecret // Your client secret
);
```

## Authentication

### getAuthorizationUrl

Returns the authorization URL to initiate the authentication request.

**Parameters:**

- `redirectUri` (string): The redirect URI after authentication
- `options` (object, optional): Configuration options
  - `scopes` (string[], optional): Scopes to request (default: ['openid', 'profile', 'email'])
  - `state` (string, optional): State parameter for CSRF protection
  - `nonce` (string, optional): Nonce parameter for replay attacks prevention
  - `loginHint` (string, optional): Login hint parameter
  - `domainHint` (string, optional): Domain hint parameter
  - `connectionId` (string, optional): Connection ID parameter
  - `organizationId` (string, optional): Organization ID parameter
  - `provider` (string, optional): Provider (e.g., 'google', 'github')
  - `codeChallenge` (string, optional): Code challenge parameter for PKCE
  - `codeChallengeMethod` (string, optional): Code challenge method parameter for PKCE

**Returns:**

- `string`: Authorization URL

**Example:**

```javascript
const authUrl = scalekit.getAuthorizationUrl('https://example.com/callback', {
  scopes: ['openid', 'profile', 'email'],
  state: 'random-state-value',
});
```

### authenticateWithCode

Authenticate with the authorization code returned from the authorization server.

**Parameters:**

- `code` (string): The authorization code
- `redirectUri` (string): The redirect URI used in the authorization request
- `options` (object, optional): Authentication options
  - `codeVerifier` (string, optional): Code verifier in case of PKCE

**Returns:**

- `Promise<AuthenticationResponse>`: Authentication response containing:
  - `user` (User): User object with profile information
  - `idToken` (string): ID token
  - `accessToken` (string): Access token
  - `expiresIn` (number): Token expiration time in seconds

**Example:**

```javascript
const authResponse = await scalekit.authenticateWithCode(
  'auth-code',
  'https://example.com/callback'
);
```

### validateAccessToken

Validates an access token.

**Parameters:**

- `token` (string): The access token to validate

**Returns:**

- `Promise<boolean>`: Returns true if the token is valid, false otherwise

**Example:**

```javascript
const isValid = await scalekit.validateAccessToken('access-token');
```

### getIdpInitiatedLoginClaims

Get the identity provider initiated login claims.

**Parameters:**

- `idpInitiatedLoginToken` (string): The IDP initiated login token

**Returns:**

- `Promise<IdpInitiatedLoginClaims>`: Returns the IdP initiated login claims

**Example:**

```javascript
const claims = await scalekit.getIdpInitiatedLoginClaims('idp-initiated-token');
```

### verifyWebhookPayload

Verifies the payload of a webhook.

**Parameters:**

- `secret` (string): The webhook secret
- `headers` (Record<string, string>): The headers from the webhook request
- `payload` (string): The payload from the webhook request

**Returns:**

- `boolean`: Returns true if the payload is valid

**Example:**

```javascript
const isValid = scalekit.verifyWebhookPayload(
  'webhook-secret',
  request.headers,
  request.body
);
```

## Organization Management

### createOrganization

Create a new organization.

**Parameters:**

- `name` (string): The organization name
- `options` (object, optional): Organization creation options
  - `externalId` (string, optional): External ID for the organization

**Returns:**

- `Promise<CreateOrganizationResponse>`: The created organization

**Example:**

```javascript
const org = await scalekit.organization.createOrganization('Acme Inc', {
  externalId: 'acme-123',
});
```

### listOrganization

List organizations with pagination.

**Parameters:**

- `options` (object, optional): Pagination options
  - `pageSize` (number, optional): The page size
  - `pageToken` (string, optional): The page token

**Returns:**

- `Promise<ListOrganizationsResponse>`: List of organizations

**Example:**

```javascript
const orgs = await scalekit.organization.listOrganization({ pageSize: 10 });
```

### getOrganization

Get an organization by ID.

**Parameters:**

- `id` (string): The organization ID

**Returns:**

- `Promise<GetOrganizationResponse>`: The organization

**Example:**

```javascript
const org = await scalekit.organization.getOrganization('org-id');
```

### getOrganizationByExternalId

Get an organization by external ID.

**Parameters:**

- `externalId` (string): The external ID

**Returns:**

- `Promise<GetOrganizationResponse>`: The organization

**Example:**

```javascript
const org = await scalekit.organization.getOrganizationByExternalId('acme-123');
```

### updateOrganization

Update an organization by ID.

**Parameters:**

- `id` (string): The organization ID
- `organization` (PartialMessage<UpdateOrganization>): The organization update details

**Returns:**

- `Promise<UpdateOrganizationResponse>`: The updated organization

**Example:**

```javascript
const org = await scalekit.organization.updateOrganization('org-id', {
  displayName: 'New Acme Inc',
});
```

### updateOrganizationByExternalId

Update an organization by external ID.

**Parameters:**

- `externalId` (string): The external ID
- `organization` (PartialMessage<UpdateOrganization>): The organization update details

**Returns:**

- `Promise<UpdateOrganizationResponse>`: The updated organization

**Example:**

```javascript
const org = await scalekit.organization.updateOrganizationByExternalId(
  'acme-123',
  { displayName: 'New Acme Inc' }
);
```

### deleteOrganization

Delete an organization.

**Parameters:**

- `organizationId` (string): The organization ID

**Returns:**

- `Promise<Empty>`: Empty response

**Example:**

```javascript
await scalekit.organization.deleteOrganization('org-id');
```

### generatePortalLink

Generate a portal link for an organization.

**Parameters:**

- `organizationId` (string): The organization ID

**Returns:**

- `Promise<Link>`: Link object containing the portal URL

**Example:**

```javascript
const link = await scalekit.organization.generatePortalLink('org-id');
```

### updateOrganizationSettings

Update an organization's settings.

**Parameters:**

- `organizationId` (string): The organization ID
- `settings` (OrganizationSettings): The organization settings

**Returns:**

- `Promise<GetOrganizationResponse>`: The updated organization

**Example:**

```javascript
const org = await scalekit.organization.updateOrganizationSettings('org-id', {
  /* settings */
});
```

## Directory Management

### listDirectories

List directories for an organization.

**Parameters:**

- `organizationId` (string): The organization ID

**Returns:**

- `Promise<ListDirectoriesResponse>`: List of directories

**Example:**

```javascript
const dirs = await scalekit.directory.listDirectories('org-id');
```

### getDirectory

Get a directory for an organization.

**Parameters:**

- `organizationId` (string): The organization ID
- `directoryId` (string): The directory ID

**Returns:**

- `Promise<GetDirectoryResponse>`: The directory

**Example:**

```javascript
const dir = await scalekit.directory.getDirectory('org-id', 'dir-id');
```

### getPrimaryDirectoryByOrganizationId

Get the primary directory for an organization.

**Parameters:**

- `organizationId` (string): The organization ID

**Returns:**

- `Promise<Directory>`: The primary directory

**Example:**

```javascript
const dir = await scalekit.directory.getPrimaryDirectoryByOrganizationId(
  'org-id'
);
```

### listDirectoryUsers

List users in a directory.

**Parameters:**

- `organizationId` (string): The organization ID
- `directoryId` (string): The directory ID
- `options` (object, optional): Listing options
  - `pageSize` (number, optional): The page size
  - `pageToken` (string, optional): The page token
  - `includeDetail` (boolean, optional): Include detailed information
  - `directoryGroupId` (string, optional): Filter by directory group ID
  - `updatedAfter` (string, optional): Filter by update timestamp

**Returns:**

- `Promise<ListDirectoryUsersResponse>`: List of directory users

**Example:**

```javascript
const users = await scalekit.directory.listDirectoryUsers('org-id', 'dir-id', {
  pageSize: 10,
});
```

### listDirectoryGroups

List groups in a directory.

**Parameters:**

- `organizationId` (string): The organization ID
- `directoryId` (string): The directory ID
- `options` (object, optional): Listing options
  - `pageSize` (number, optional): The page size
  - `pageToken` (string, optional): The page token
  - `includeDetail` (boolean, optional): Include detailed information
  - `updatedAfter` (string, optional): Filter by update timestamp

**Returns:**

- `Promise<ListDirectoryGroupsResponse>`: List of directory groups

**Example:**

```javascript
const groups = await scalekit.directory.listDirectoryGroups(
  'org-id',
  'dir-id',
  { pageSize: 10 }
);
```

### enableDirectory

Enable a directory.

**Parameters:**

- `organizationId` (string): The organization ID
- `directoryId` (string): The directory ID

**Returns:**

- `Promise<ToggleDirectoryResponse>`: The updated directory status

**Example:**

```javascript
const response = await scalekit.directory.enableDirectory('org-id', 'dir-id');
```

### disableDirectory

Disable a directory.

**Parameters:**

- `organizationId` (string): The organization ID
- `directoryId` (string): The directory ID

**Returns:**

- `Promise<ToggleDirectoryResponse>`: The updated directory status

**Example:**

```javascript
const response = await scalekit.directory.disableDirectory('org-id', 'dir-id');
```

## Domain Management

### createDomain

Create a domain for an organization.

**Parameters:**

- `organizationId` (string): The organization ID
- `name` (string): The domain name

**Returns:**

- `Promise<CreateDomainResponse>`: The created domain

**Example:**

```javascript
const domain = await scalekit.domain.createDomain('org-id', 'example.com');
```

### listDomains

List domains for an organization.

**Parameters:**

- `organizationId` (string): The organization ID

**Returns:**

- `Promise<ListDomainResponse>`: List of domains

**Example:**

```javascript
const domains = await scalekit.domain.listDomains('org-id');
```

## Connection Management

### getConnection

Get a connection by ID and organization ID.

**Parameters:**

- `organizationId` (string): The organization ID
- `id` (string): The connection ID

**Returns:**

- `Promise<GetConnectionResponse>`: The connection

**Example:**

```javascript
const connection = await scalekit.connection.getConnection('org-id', 'conn-id');
```

### listConnectionsByDomain

List connections by domain.

**Parameters:**

- `domain` (string): The domain

**Returns:**

- `Promise<ListConnectionsResponse>`: List of connections

**Example:**

```javascript
const connections = await scalekit.connection.listConnectionsByDomain(
  'example.com'
);
```

### listConnections

List connections by organization ID.

**Parameters:**

- `organizationId` (string): The organization ID

**Returns:**

- `Promise<ListConnectionsResponse>`: List of connections

**Example:**

```javascript
const connections = await scalekit.connection.listConnections('org-id');
```

### enableConnection

Enable a connection.

**Parameters:**

- `organizationId` (string): The organization ID
- `id` (string): The connection ID

**Returns:**

- `Promise<ToggleConnectionResponse>`: The updated connection status

**Example:**

```javascript
const response = await scalekit.connection.enableConnection(
  'org-id',
  'conn-id'
);
```

### disableConnection

Disable a connection.

**Parameters:**

- `organizationId` (string): The organization ID
- `id` (string): The connection ID

**Returns:**

- `Promise<ToggleConnectionResponse>`: The updated connection status

**Example:**

```javascript
const response = await scalekit.connection.disableConnection(
  'org-id',
  'conn-id'
);
```
