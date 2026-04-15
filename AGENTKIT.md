# AgentKit API reference (Node.js)

This document lists **AgentKit** Scalekit SDK surfaces: tools, connected accounts, and the `actions` facade.

For the full SDK (organizations, SSO **connections**, users, sessions, WebAuthn, etc.), see [`REFERENCE.md`](REFERENCE.md).

**Note:** `client.connection` (enterprise SSO IdP **connections**) is not part of AgentKit; it remains documented only in `REFERENCE.md`.

## Table of contents

- [Initialize the client](#initialize-the-client)
- [AgentKit namespaces](#agentkit-namespaces)
- [Tools](#tools)
- [Connected Accounts](#connected-accounts)
- [Actions](#actions)

## Initialize the client

Create a single [`ScalekitClient`](https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/scalekit.ts) with your environment URL, client ID, and client secret from **Scalekit Dashboard → Developers → API credentials**. All sections below use the same instance.

```typescript
import { ScalekitClient } from '@scalekit-sdk/node';

const scalekitClient = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!,
);
```

Requires **Node.js ≥ 18**. Install: `npm install @scalekit-sdk/node`. Use environment variables or a secret manager in production; do not commit secrets.

## AgentKit namespaces

These properties on `scalekitClient` are the AgentKit-related entry points:

| Namespace | Role |
|-----------|------|
| `tools` | List and execute tools against connected accounts. |
| `connectedAccounts` | List, create, update, delete connected accounts; magic links; verification. |
| `actions` | Facade that composes `tools` and `connectedAccounts` with ergonomic names (`connectionName`, etc.). There is no separate `connect` export in Node — use `actions`. |

OAuth login (`getAuthorizationUrl`, `authenticateWithCode`, …) and MCP **Bring-your-own-auth** (`client.auth.updateLoginUserDetails`) are documented under **Getting Started**, **ScalekitClient**, and **Auth** in [`REFERENCE.md`](REFERENCE.md), not in this AgentKit guide.

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

