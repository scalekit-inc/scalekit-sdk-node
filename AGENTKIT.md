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
- `createConnectedAccount`, `getOrCreateConnectedAccount`, `updateConnectedAccount` — `authorizationDetails` is a plain object (`details: { case: 'oauthToken' | 'staticAuth' | ..., value }`). To import an OAuth token obtained outside Scalekit:

  ```ts
  import { timestampFromDate } from '@bufbuild/protobuf/wkt';

  await scalekit.actions.createConnectedAccount({
    connectionName: 'gmail',
    identifier: 'user_123',
    authorizationDetails: {
      details: {
        case: 'oauthToken',
        value: {
          accessToken: 'ya29.a0...',
          refreshToken: '1//0g...', // optional
          scopes: ['https://www.googleapis.com/auth/gmail.readonly'], // optional
          expiresAt: timestampFromDate(new Date('2026-12-01T10:00:00Z')), // optional
        },
      },
    },
  });
  ```

  `oauthToken.expiresAt` (optional) is when the supplied access token expires: a `Timestamp`, sent as UTC. It is read only when importing a token obtained outside Scalekit for a connection that uses your own OAuth app: the account becomes `ACTIVE` and its `tokenExpiresAt` is set to `expiresAt`.

  - **Without `expiresAt`**, the account has no token expiry and the token is used until the provider rejects it. If a `refreshToken` was imported, tool calls then refresh and retry automatically, and proxy callers refresh with the refresh connected account tokens API (`POST /api/v1/connected_accounts:refresh_tokens`). Without a `refreshToken`, nothing can be refreshed, and the account must be updated with new tokens or authorized again.
  - **To correct the expiry** of the current token, update the account with the same `accessToken` and the new `expiresAt`. Only `tokenExpiresAt` changes; the account status does not, so an `EXPIRED` account stays `EXPIRED` until you send new tokens. The same `accessToken` without `expiresAt` changes nothing.
  - **Resending the same `accessToken`** keeps the stored `refreshToken` and `scopes` unless the request supplies new non-empty values. A different `accessToken` is stored exactly as sent.
  - **`expiresAt` is never returned.** Read the expiry back from the account's `tokenExpiresAt`.

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
- `listAppConnections({ provider?, query?, pageSize?, pageToken? })` — summaries, newest first (`pageSize` up to 100, `query` at least 3 characters).
- `updateConnection({ connectionName | connectionId, oauth | googleDwd, providerConfigurations?, newConnectionName? })` — pass at most one of `oauth` or `googleDwd`; a rename or a `providerConfigurations` change needs neither. `providerConfigurations` goes with `oauth` or on its own, never with `googleDwd`. It is a partial merge: what you leave out keeps its stored value, and a list or map you pass empty (`scopes: []`, `extraAuthorizeParams: {}`) is cleared. A name costs one extra read to find the ID.
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
