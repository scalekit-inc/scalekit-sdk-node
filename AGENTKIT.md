# AgentKit

## Initialize the client

Create a single [`ScalekitClient`](https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/scalekit.ts) with your environment URL, client ID, and client secret from **Scalekit Dashboard → Developers → API credentials**. All sections below use the same instance.

```typescript
import { ScalekitClient } from '@scalekit-sdk/node';

const scalekitClient = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);
```

Requires **Node.js ≥ 18**. Install: `npm install @scalekit-sdk/node`. Use environment variables or a secret manager in production; do not commit secrets.

## AgentKit namespaces

These properties on `scalekitClient` are the AgentKit-related entry points:

| Namespace           | Role                                                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tools`             | List and execute tools against connected accounts.                                                                                                                 |
| `connectedAccounts` | List, create, update, delete connected accounts; magic links; verification.                                                                                        |
| `actions`           | Facade that composes `tools` and `connectedAccounts` with ergonomic names (`connectionName`, etc.). There is no separate `connect` export in Node — use `actions`. |

**Which one to use:** use `actions` for almost everything. `tools` and `connectedAccounts` are the lower layers it wraps. The lower layers (and `actions.executeTool`) call the connection name `connector`; the rest of `actions` calls it `connectionName`.

Two words appear in almost every call:

- **`connectionName`** (`connector` on `executeTool` and the lower layers) is the name of a connection, for example `slack-b1fqL2Dr`, as shown for the connection in the dashboard. It is not the provider's name (`Slack`).
- **`identifier`** is the identifier a connected account was created with, usually your end user's ID or email. It is yours to choose, and it is how Scalekit finds that user's account.

## How the pieces fit together

To run a tool for one of your users:

1. **Create the connection** for the service in the dashboard. Its name is your `connectionName`.
2. **Send the user an authorization link.** This is also how a connected account is created:

   ```typescript
   const { link, expiry } = await scalekitClient.actions.getAuthorizationLink({
     connectionName: 'slack-b1fqL2Dr',
     identifier: 'user_123',
   });
   // send `link` to the user before `expiry`
   ```

3. **The user authorizes.** If you passed `userVerifyUrl`, they are redirected there with an `authRequestId`. Confirm the user with `scalekitClient.actions.verifyConnectedAccountUser({ authRequestId, identifier: 'user_123' })`.
4. **Run the tool:**

   ```typescript
   const result = await scalekitClient.actions.executeTool({
     toolName: 'slack.chat.postMessage',
     toolInput: { channel: 'C0123', text: 'hi' },
     identifier: 'user_123',
     connector: 'slack-b1fqL2Dr', // the connection name
   });
   ```

   `identifier` alone is enough when that user has exactly one account for the tool's provider. If there is none the call fails as not found, and if there are several it fails as a bad request: then add `connector` or pass `connectedAccountId`.

## Virtual MCP servers

A virtual MCP server exposes a chosen set of connections and tools over the Model Context Protocol. Create one configuration per agent role with `actions.mcp.createConfig`, and mint a short-lived session token per user with `actions.mcp.createSessionToken`. Only the generally available configuration API is exposed. See [Virtual MCP Servers](REFERENCE.md#virtual-mcp-servers) in the reference.

OAuth login (`getAuthorizationUrl`, `authenticateWithCode`, …) and MCP **Bring-your-own-auth** (`client.auth.updateLoginUserDetails`) are documented under **Getting Started**, **ScalekitClient**, and **Auth** in [`REFERENCE.md`](REFERENCE.md), not in this AgentKit guide.

## Tools

`client.tools` — [`src/tools.ts`](https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts).

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">listTools</a>(options?) -> Promise&lt;ListToolsResponse&gt;</code></summary>
<dl><dd>

### 📝 Description

Lists tools in the workspace with optional filter and pagination (`filter`, `pageSize`, `pageToken`).

### 🔌 Usage

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

### 📝 Description

Lists tools scoped to a connected-account identifier. `options.filter` is required.

</dd></dl>
</details>

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">listAvailableTools</a>(identifier, options?) -> Promise&lt;ListAvailableToolsResponse&gt;</code></summary>
<dl><dd>

### 📝 Description

Lists tools that can be made available for an identifier (distinct from scoped tools already bound).

</dd></dl>
</details>

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">searchTools</a>(query, options?) -> Promise&lt;SearchToolsResponse&gt;</code></summary>
<dl><dd>

### 📝 Description

Searches tools ranked by relevance to a natural-language query — the job to be done,
not an exact tool name. Pass `options.identifier` to also get per-connection readiness
(usable now, needs a new connection, or needs re-auth) so you can gate execution on
the right auth step.

### 🔌 Usage

```typescript
const res = await scalekitClient.tools.searchTools(
  'send a message to a slack channel',
  { identifier: 'user@example.com', topK: 10 }
);

for (const tool of res.tools) {
  console.log(tool.name, tool.score);
  for (const connection of tool.connections) {
    console.log(
      ' ',
      connection.connectionName,
      connection.readinessState,
      connection.connectedAccountId
    );
  }
}
```

</dd></dl>
</details>

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">executeTool</a>(params) -> Promise&lt;ExecuteToolResponse&gt;</code></summary>
<dl><dd>

### 📝 Description

Executes a tool. Pass `toolName`, optional `params` (JSON), and either `connectedAccountId` or `identifier` with optional `connector`, `organizationId`, `userId`.

### 🔌 Usage

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

Each method wraps the gRPC `ConnectedAccountService`; see JSDoc in the source file for parameter shapes. Parameter shapes and examples for the `actions` versions of `executeTool`, the tool-search methods and `getAuthorizationLink` are in [REFERENCE.md](REFERENCE.md#actions).

</dd></dl>
</details>

## Actions

`client.actions` — [`src/actions.ts`](https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/actions.ts). Composes `tools` and `connectedAccounts` with ergonomic parameter names (`connectionName` ↔ `connector`).

<details><summary>Methods</summary>
<dl><dd>

- `searchTools`, `listScopedTools`, `listAvailableTools`, `listTools` — find which tools exist, optionally for one `identifier`.
- `executeTool` — runs a tool for a connected account (`toolInput` maps to tool `params`; the connection name is `connector` here). See [`executeTool`](REFERENCE.md#actions) in the reference.
- `getAuthorizationLink` — magic link for connect / re-auth.
- `verifyConnectedAccountUser` — completes OAuth user verification.
- `listConnectedAccounts`, `deleteConnectedAccount`, `getConnectedAccount`
- `createConnectedAccount`, `getOrCreateConnectedAccount`, `updateConnectedAccount`
- `request` — proxied HTTP to `{envUrl}/proxy/...` with `connection_name` / `identifier` headers (returns `AxiosResponse`).
- `listConnections` — lists your app-level connections (not the SSO connections of one organization).

There is no separate `connect` export on Node; use `actions` for the facade.

</dd></dl>
</details>
