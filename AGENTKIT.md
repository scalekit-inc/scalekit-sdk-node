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
- `request` — proxied HTTP to `{envUrl}/proxy/...` with `connection_name` / `identifier` headers (returns `AxiosResponse`). A `path` that would resolve outside `{envUrl}/proxy/` (for example through `..` segments, encoded dots or control characters) is rejected with an `Error` before any request is sent; every other path is sent unchanged. Redirects are followed as before, but a redirect hop outside `{envUrl}/proxy/` (another origin, or a same-origin path outside the prefix) is sent without `Authorization`, `connection_name` and `identifier`.
- `uploadResumable` — uploads a file of any size to Google Drive, Cloud Storage or YouTube with Google's resumable protocol: chunks of 4 MiB by default, a failed chunk resumes instead of restarting, and it returns the created resource. Errors: `ScalekitUploadHttpException`, `ScalekitUploadSessionExpiredException`, `ScalekitUploadProtocolException`, `ScalekitUploadTimeoutException`, `ScalekitUploadConnectionException`.

There is no separate `connect` export on Node; use `actions` for the facade.

</dd></dl>
</details>

## Connections

`client.actions` also manages AgentKit connections with the AgentKit-only connection APIs: only AgentKit fields, with `provider`, `connectionName`, `useScalekitCreds` and `providerConfigurations`. The existing `actions.listConnections` is unchanged.

<details><summary>Methods</summary>
<dl><dd>

- `createConnection({ provider, connectionName?, authMode?, providerDomain? })` — creates a connection. The type comes from the connector (a connector with several auth types is refused). `providerDomain` is only for regional connectors such as `MIXPANELMCP`. Add credentials and options afterwards with `updateConnection`.
- `getConnection(nameOrId)` — one connection by name (case-insensitive) or by ID (`conn_...`). Also accepts `{ connectionName }` or `{ connectionId }`.
- `listConnectionSummaries({ provider?, query?, pageSize?, pageToken? })` — summaries, newest first (`pageSize` up to 100, `query` at least 3 characters).
- `updateConnection({ connectionName | connectionId, oauth | googleDwd | staticConfig, providerConfigurations?, newConnectionName? })` — a partial merge: what you leave out keeps its stored value, and a list or map you pass empty (`scopes: []`, `extraAuthorizeParams: {}`) is cleared. A name costs one extra read to find the ID.
- `deleteConnection(nameOrId | { connectionName } | { connectionId })` — pass the connection's name or its ID (`conn_...`); a plain string is treated as a name unless it looks like an ID. It throws `CONNECTION_IN_USE` while connected accounts or MCP configurations still use the connection, and is never retried after a timeout.

```typescript
const connection = await scalekitClient.actions.createConnection({
  provider: 'GMAIL',
  connectionName: 'gmail-work',
});
await scalekitClient.actions.updateConnection({
  connectionName: 'gmail-work',
  oauth: {
    clientId: '...',
    clientSecret: '...',
    scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
  },
});
```

Failures raise `ScalekitAgentKitConnectionError` with a stable `code` (`CONNECTION_NOT_FOUND`, `CONNECTION_NAME_CONFLICT`, `CONNECTION_IN_USE`, `PROVIDER_NOT_FOUND`, `AMBIGUOUS_AUTH_TYPE`, `INVALID_CONFIGURATION`, `NOT_AUTHORIZED`, `OUTCOME_UNKNOWN`, ...), `retryable` and the original server error as `cause`. Invalid arguments raise `ScalekitValidationError` before anything is sent.

</dd></dl>
</details>

## Virtual MCP tool exposure

`actions.mcp.createConfig({ ..., toolExposure })` and `updateConfig({ ..., toolExposure })` take `'DIRECT'` or `'META'`. `DIRECT` (the default when you leave it out) lists every mapped tool and allows at most 25 connections. `META` gives agents five tools (`search_available_tools`, `list_available_tools`, `get_tool_details`, `execute_tool`, `connect_account`) that reach every tool of the configuration's connections, with no connection limit; it must be enabled for your environment. An update that leaves `toolExposure` out never changes the mode.
