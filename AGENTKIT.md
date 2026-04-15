# AgentKit API reference (Node.js)

This document lists **AgentKit-related** Scalekit SDK methods: Bring-your-own-auth for MCP, tools, connected accounts, and the `actions` facade.

For the full SDK (organizations, SSO **connections**, users, sessions, WebAuthn, etc.), see [`REFERENCE.md`](REFERENCE.md).

**Note:** `client.connection` (enterprise SSO IdP **connections**) is not part of AgentKit; it remains documented only in `REFERENCE.md`.

## Table of contents

- [Auth](#auth)
- [Tools](#tools)
- [Connected Accounts](#connected-accounts)
- [Actions](#actions)

## Auth

<details><summary><code>client.auth.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/auth.ts">updateLoginUserDetails</a>(connectionId, loginRequestId, user) -> Promise&lt;Empty&gt;</code></summary>
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

`client.tools` — [`src/tools.ts`](https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts).

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">listTools</a>(options?) -> Promise&lt;ListToolsResponse&gt;</code></summary>
<dl><dd>

#### 📝 Description

Lists tools in the workspace with optional filter and pagination (`filter`, `pageSize`, `pageToken`).

#### 🔌 Usage

```typescript
const res = await scalekitClient.tools.listTools({
  pageSize: 50,
  filter: { query: 'calendar' },
});
```

</dd></dl>
</details>

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">listScopedTools</a>(identifier, options) -> Promise&lt;ListScopedToolsResponse&gt;</code></summary>
<dl><dd>

#### 📝 Description

Lists tools scoped to a connected-account identifier. `options.filter` is required.

</dd></dl>
</details>

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">listAvailableTools</a>(identifier, options?) -> Promise&lt;ListAvailableToolsResponse&gt;</code></summary>
<dl><dd>

#### 📝 Description

Lists tools that can be made available for an identifier (distinct from scoped tools already bound).

</dd></dl>
</details>

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">executeTool</a>(params) -> Promise&lt;ExecuteToolResponse&gt;</code></summary>
<dl><dd>

#### 📝 Description

Executes a tool. Pass `toolName`, optional `params` (JSON), and either `connectedAccountId` or `identifier` with optional `connector`, `organizationId`, `userId`.

#### 🔌 Usage

```typescript
await scalekitClient.tools.executeTool({
  toolName: 'slack.chat.postMessage',
  identifier: 'T0123456',
  params: { channel: 'C0123', text: 'hi' },
});
```

</dd></dl>
</details>


## Connected Accounts

`client.connectedAccounts` — [`src/connected-accounts.ts`](https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/connected-accounts.ts).

<details><summary>Methods</summary>
<dl><dd>

- `listConnectedAccounts(options?)`
- `createConnectedAccount(params)`
- `getOrCreateConnectedAccount(params)`
- `updateConnectedAccount(params)`
- `deleteConnectedAccount(params)`
- `getMagicLinkForConnectedAccount(params)`
- `verifyConnectedAccountUser(params)`
- `getConnectedAccountByIdentifier(params)` — returns auth details for an account (sensitive).

Each method wraps the gRPC `ConnectedAccountService`; see JSDoc in the source file for parameter shapes.

</dd></dl>
</details>


## Actions

`client.actions` — [`src/actions.ts`](https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/actions.ts). Composes `tools` and `connectedAccounts` with ergonomic parameter names (`connectionName` ↔ `connector`).

<details><summary>Methods</summary>
<dl><dd>

- `executeTool` — wraps `tools.executeTool` (`toolInput` maps to tool `params`).
- `getAuthorizationLink` — magic link for connect / re-auth.
- `verifyConnectedAccountUser` — completes OAuth user verification.
- `listConnectedAccounts`, `deleteConnectedAccount`, `getConnectedAccount`
- `createConnectedAccount`, `getOrCreateConnectedAccount`, `updateConnectedAccount`
- `request` — proxied HTTP to `{envUrl}/proxy/...` with `connection_name` / `identifier` headers (returns `AxiosResponse`).

There is no separate `connect` export on Node; use `actions` for the facade.

</dd></dl>
</details>

