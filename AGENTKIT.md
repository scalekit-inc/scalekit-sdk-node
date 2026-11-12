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

`pageSize` defaults to 300 when you leave it out or pass 0, and is at most 1000: a larger value is reduced to 1000, not rejected. `filter.query` searches tool names (3 to 100 characters, every word must appear in the name, ignoring case), returns at most 100 tools per page, and covers built-in tools only, so it never finds the tools of a custom connector. To list the tools of a connector created from an OpenAPI spec, set `filter.provider` to the connector's identifier; no connected account is needed. A connector, identifier or connected account that matches nothing fails with `ScalekitNotFoundException`.

### 🔌 Usage

```typescript
const res = await scalekitClient.tools.listTools({
  pageSize: 50,
  filter: { query: 'calendar' },
});

// The tools of a connector created from an OpenAPI spec
const custom = await scalekitClient.tools.listTools({
  filter: { provider: '<PROVIDER_IDENTIFIER>' },
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

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">refreshTools</a>(params) -> Promise&lt;RefreshToolsResponse&gt;</code></summary>
<dl><dd>

### 📝 Description

Re-reads the tool list of a custom MCP connector's connected account from its upstream MCP server, and returns the full refreshed list. Identify the account with `connectedAccountId`, or with `connector` (the connection name) and `identifier`. `actions.refreshTools` does the same and takes `connectionName`. Preview: the underlying RPC is marked preview in the API. It works only for a connector that fronts an MCP server; the tools of a connector created from an OpenAPI spec are refreshed with `actions.providers.triggerToolCollection`. See [`REFERENCE.md`](REFERENCE.md#tools) for the errors.

### 🔌 Usage

```typescript
const res = await scalekitClient.tools.refreshTools({
  connector: 'acme-mcp',
  identifier: 'user_123',
});
console.log(res.totalSize);
```

</dd></dl>
</details>

<details><summary><code>client.tools.<a href="https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/tools.ts">deleteCustomTool</a>(params) -> Promise&lt;void&gt;</code></summary>
<dl><dd>

### 📝 Description

Deletes one tool of a connector created from an OpenAPI spec, by its name (`a-<connector name>_<operation>`, matched in lower case). `actions.deleteCustomTool` does the same. Any other tool, such as a built-in one or one of an MCP connector, fails with `ScalekitNotFoundException`. An empty or blank `toolName` raises `ScalekitValidationError` before anything is sent. The deletion is not permanent: a full sync of the connector creates the tool again while its operation is still in the spec, and while a sync is queued or running the call deletes nothing and fails with `ScalekitConflictException`: wait for the run with `actions.providers.getToolCollectionRun`, then call again. The call is retried when the service is unavailable, so after a retry a `ScalekitNotFoundException` can follow a deletion that succeeded: list the connector's tools to tell. See [`REFERENCE.md`](REFERENCE.md#tools) for the errors.

### 🔌 Usage

```typescript
await scalekitClient.tools.deleteCustomTool({ toolName: 'a-acme_get_user' });
```

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
- `refreshTools` — wraps `tools.refreshTools` for a custom MCP connector's connected account (`connectionName` maps to `connector`).
- `deleteCustomTool` — wraps `tools.deleteCustomTool`: deletes one tool of a connector created from an OpenAPI spec, by its name.
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

`oauth.tokenEndpointAuthMethod` sets how Scalekit sends the client credentials to the provider's token endpoint: `'BASIC_AUTH'` (an HTTP Basic header), `'REQUEST_BODY'` (POST body parameters), `'NONE'` (only `client_id`, for public or PKCE clients) or `'DEFAULT'` (clears the stored value; Scalekit makes a best-effort match for each request). Choose the value the provider's token endpoint documentation requires: a wrong one makes token exchange and refresh fail, and every connected account on the connection then has to authenticate again. Leave it out to keep the stored value. The environment connection methods (`connection.updateEnvironmentConnection`) name the same choices with `TokenAuthType` (`BASIC_AUTH`, `URL_PARAMS`, `NONE`); do not mix the two sets of names.

Failures raise `ScalekitAgentKitConnectionError` with a stable `code` (`CONNECTION_NOT_FOUND`, `CONNECTION_NAME_CONFLICT`, `CONNECTION_IN_USE`, `PROVIDER_NOT_FOUND`, `AMBIGUOUS_AUTH_TYPE`, `INVALID_CONFIGURATION`, `NOT_AUTHORIZED`, `OUTCOME_UNKNOWN`, ...), `retryable` and the original server error as `cause`. Invalid arguments raise `ScalekitValidationError` before anything is sent.

</dd></dl>
</details>

## Virtual MCP tool exposure

`actions.mcp.createConfig({ ..., toolExposure })` and `updateConfig({ ..., toolExposure })` take `'DIRECT'` or `'META'`. `DIRECT` (the default when you leave it out) lists every mapped tool and allows at most 25 connections. `META` gives agents five tools (`search_available_tools`, `list_available_tools`, `get_tool_details`, `execute_tool`, `connect_account`) that reach every tool of the configuration's connections, with no connection limit; it must be enabled for your environment. An update that leaves `toolExposure` out never changes the mode.

A mapping can name a connection on a custom connector in either mode: one created from an OpenAPI spec (its tools are named `a-<connector>_<operation>` in lower case, after the operation's `operationId`, or after its method and path when it has none, with a numeric suffix when two names collide: list the connector's tools for the exact names) or one that fronts an MCP server (its tool names start with `c-`). The rules and errors are under [Virtual MCP Servers](REFERENCE.md#virtual-mcp-servers) in `REFERENCE.md`.

## Custom connectors

`client.actions.providers` creates, updates, lists and deletes custom connectors. A connector is sourced from an MCP server (`proxyUrl`) or from an OpenAPI spec (`openapiSpecUrl`); set exactly one. A connector created from an OpenAPI spec gets a tool for each operation it supports, generated by a background tool collection run. The operations it cannot convert are listed in `skippedTools`:

- `createCustomProvider({ displayName, proxyUrl | openapiSpecUrl, authPatterns, ... })` — with `openapiSpecUrl` the spec is fetched and checked during the call, and the first run is queued in the background just after it returns (`getToolCollectionRun` can answer NotFound for a moment). With `openapiSpecUrl` the call is not retried automatically when the service is unavailable: the first attempt may already have stored the connector.
- `updateCustomProvider({ identifier, displayName, authPatterns, proxyUrl?, openapiSpecUrl?, metadata?, ... })` — on a connector created from a spec only the name, description, icon, metadata and base URL (`proxyUrl`) can change, and the spec URL (`openapiSpecUrl`) where your environment has that enabled. `metadata` replaces the stored map, so leaving it out clears it: read the connector first and send back the metadata to keep.
- `triggerToolCollection(providerIdentifier)` — queues a new run and returns it as `QUEUED`. It is not retried automatically when the service is unavailable (`ScalekitServiceUnavailableException`): the first attempt may already have queued a run, and a run you then find may be another caller's, so call `getToolCollectionRun`, wait for an active run to finish, and trigger again if you need a run that started after your call.
- `getToolCollectionRun(providerIdentifier, runId?)` — status, counters and skipped operations of a run; omit `runId` for the latest.
- `listProviders`, `deleteCustomProvider` — a connector created from an OpenAPI spec cannot be deleted while a run of it is queued or processing (`ScalekitConflictException`): wait for the run with `getToolCollectionRun`, then call again (without a `runId` it usually shows the run that blocks the call, but not always: the conflict is what counts). To delete one tool of such a connector, use `tools.deleteCustomTool({ toolName })` (see [Tools](#tools)).

A `BEARER`, `API_KEY` or `BASIC` credential can be sent in the URL path, the query string or the JSON body with `placement` on the credential field. Details, limits, errors and examples are under [Custom Connectors](REFERENCE.md#custom-connectors) in `REFERENCE.md`.

```typescript
import {
  ScalekitConflictException,
  ScalekitNotFoundException,
  ScalekitServiceUnavailableException,
  ToolCollectionRun,
  ToolCollectionRunStatus,
} from '@scalekit-sdk/node';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The first run is queued in the background after createCustomProvider returns, so the first
// calls can answer NotFound. If that lasts 45 seconds, queueing failed (Scalekit only logs it):
// queue a run yourself, once. A run is processed for up to 3 minutes.
async function waitForToolCollectionRun(
  providerIdentifier: string,
  timeoutMs = 600_000
): Promise<ToolCollectionRun> {
  const providers = scalekitClient.actions.providers;
  const start = Date.now();
  let triggered = false;
  while (Date.now() - start < timeoutMs) {
    try {
      const run = await providers.getToolCollectionRun(providerIdentifier);
      if (
        run.status === ToolCollectionRunStatus.COMPLETED ||
        run.status === ToolCollectionRunStatus.FAILED
      ) {
        return run;
      }
    } catch (error) {
      if (!(error instanceof ScalekitNotFoundException)) throw error;
      if (!triggered && Date.now() - start > 45_000) {
        triggered = true;
        try {
          await providers.triggerToolCollection(providerIdentifier);
        } catch (triggerError) {
          // A run was queued in the meantime, or the answer was lost: keep polling to find out.
          if (
            !(triggerError instanceof ScalekitConflictException) &&
            !(triggerError instanceof ScalekitServiceUnavailableException)
          )
            throw triggerError;
        }
      }
    }
    await wait(2000);
  }
  throw new Error(
    `The tool collection run did not finish within ${timeoutMs / 1000} seconds`
  );
}

const { provider } =
  await scalekitClient.actions.providers.createCustomProvider({
    displayName: 'Acme Tickets',
    openapiSpecUrl: 'https://api.acme.example.com/openapi.json',
    authPatterns: [
      {
        type: 'BEARER',
        display_name: 'Bearer Token',
        fields: [
          { field_name: 'token', label: 'API Token', input_type: 'password' },
        ],
      },
    ],
  });

const run = await waitForToolCollectionRun(provider!.identifier);
if (run.status === ToolCollectionRunStatus.FAILED) {
  throw new Error(`The run failed: ${run.errorMessage}`);
}
const { toolNames } = await scalekitClient.actions.listTools({
  provider: provider!.identifier,
  summary: true,
});
console.log(run.toolsCreated, run.skippedTools.length, toolNames);
```
