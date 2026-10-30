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

| Namespace           | Role                                                                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tools`             | List and execute tools against connected accounts.                                                                                                                                                                              |
| `connectedAccounts` | List, create, update, delete connected accounts; magic links; verification.                                                                                                                                                     |
| `actions`           | Facade that composes `tools` and `connectedAccounts` with ergonomic names (`connectionName`, etc.). There is no separate `connect` export in Node — use `actions`.                                                              |
| `actions.triggers`  | Triggers: list a connection's triggers, subscribe connected accounts, set up the webhook URL and signing secret, read activity, usage and deliveries, and verify delivered events. See [Managing triggers](#managing-triggers). |

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

- `triggers` — trigger management and event verification; see [Managing triggers](#managing-triggers).

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

## Managing triggers

`client.actions.triggers` — [`src/triggers.ts`](https://github.com/scalekit-inc/scalekit-sdk-node/blob/main/src/triggers.ts). Every method is listed with its parameters under [Triggers](REFERENCE.md#triggers) in `REFERENCE.md`; verifying the events delivered to your endpoint is under [Trigger Events](REFERENCE.md#trigger-events). Every networked method takes an optional `{ signal, timeoutMs }` last.

### Subscribe accounts to a trigger

```typescript
// 1. What can this connection send, and what does each trigger need?
const { triggers: catalog } =
  await scalekitClient.actions.triggers.listAvailable('conn_123');
const trigger = catalog.find(
  (t) => t.available && t.name === 'example.item.created'
);

// 2. Which connected accounts can receive it?
const page = await scalekitClient.actions.triggers.listEligibleAccounts(
  'conn_123',
  'example.item.created'
);
const ids = page.accounts.filter((a) => a.eligible).map((a) => a.id);

// 3. Subscribe them. Each account gets its own outcome; retrying is safe.
const { results } =
  await scalekitClient.actions.triggers.batchCreateSubscriptions(
    'conn_123',
    'example.item.created',
    {
      connectedAccountIds: ids,
      config: { channel: 'C123' }, // keys from trigger.configFields
    }
  );
for (const r of results.filter((r) => r.outcome === 'REFUSED')) {
  console.log(r.connectedAccountId, r.reason);
}
```

`actions.triggers.createSubscription(connectionId, triggerName, params?)` subscribes one account, or the whole connection for a connection-scoped trigger (omit `connectedAccountId`). It is not retried when the service is briefly unavailable, and the same subscription twice is a `ScalekitConflictException`. `actions.triggers.listSubscriptions` shows each subscription's `status`, its intervals and, for polled triggers, its `pollState`; `statusCounts` totals every status across every page.

### Webhook URL and signing secret

A webhook trigger needs the connection's webhook URL registered with the provider, and the secret the provider signs with stored in Scalekit:

```typescript
const endpoint =
  await scalekitClient.actions.triggers.createIngressEndpoint('conn_123'); // idempotent
// Register endpoint.url in the provider's app configuration (keep it confidential:
// it carries the endpoint's token), then:
await scalekitClient.actions.triggers.setSigningSecret('conn_123', {
  signingSecret: process.env.PROVIDER_SIGNING_SECRET!,
});
```

For a provider that sends no signature of its own (its triggers report `providesBearerSecret`), call `actions.triggers.generateSigningSecret('conn_123')` instead and store the returned `signingSecret`; it is returned only once. `console.log` shows it as `[redacted]`, but `JSON.stringify` and spreading the result keep the real value, so treat any serialised copy as a secret.

Rotating: setting (or generating) a different secret starts a rotation, and both secrets are accepted until you confirm it, or for at most 24 hours. Confirm once the provider uses the new secret:

```typescript
const current =
  await scalekitClient.actions.triggers.getIngressEndpoint('conn_123');
if (current.rotationInProgress) {
  await scalekitClient.actions.triggers.confirmSigningSecretRotation(
    'conn_123',
    {
      signingSecretRotationId: current.signingSecretRotationId,
    }
  );
}
```

### Activity, usage and deliveries

- `actions.triggers.getActivity()` counts what happened to the environment's events over the last day (`received`, `filtered`, `delivered`, `signature_failed`, …). `signatureBanner` means most arrivals failed signature verification: check the signing secret.
- `actions.triggers.getUsage({ period: '24h' })` or `actions.triggers.getUsage({ from: '2026-10-01', to: '2026-10-28' })` returns metered deliveries by hour or by UTC day; hours and days with none are absent.
- `actions.triggers.listDeliveries(endpointId, { status: 'FAILED' })`, `actions.triggers.listDeliveryAttemptsByMessage(endpointId, msgId)` and `actions.triggers.listDeliveryAttemptsByEndpoint(endpointId)` show what reached your delivery endpoint. `actions.triggers.lookupDelivery(id)` and `actions.triggers.batchLookupDeliveries({ deliveryIds })` find an event by the `webhook-id` header you received or by its `dedupe_key`.
- `actions.triggers.batchResendDeliveries({ targets })` queues a new attempt per target and is not idempotent: after a partial failure, resend only the targets that came back `RATE_LIMITED`, `FAILED` or `NOT_ATTEMPTED`. `actions.triggers.recoverDeliveries(endpointId, { since })` resends every failed delivery in a window of up to 14 days, in the background.

### Errors

Server errors reject with a `ScalekitServerException` subclass; branch on the class and on `errorCode`:

| Class                                 | `errorCode`                               | Meaning                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScalekitNotFoundException`           | `RESOURCE_NOT_FOUND`                      | The connection, trigger, account or subscription does not exist in this environment, or triggers are not available for the environment.                                                                                                                                                                                                                                                                     |
| `ScalekitNotFoundException`           | `TRIGGER_INGRESS_ENDPOINT_NOT_CREATED`    | The connection has no webhook URL yet; call `actions.triggers.createIngressEndpoint`.                                                                                                                                                                                                                                                                                                                       |
| `ScalekitNotFoundException`           | `TRIGGER_USAGE_NOT_METERED`               | Usage is not metered for this environment.                                                                                                                                                                                                                                                                                                                                                                  |
| `ScalekitNotFoundException`           | `NOT_FOUND`                               | `actions.triggers.lookupDelivery` found no such event.                                                                                                                                                                                                                                                                                                                                                      |
| `ScalekitBadRequestException`         | `TRIGGER_INGRESS_NOT_APPLICABLE`          | The provider has no webhook trigger, so the connection takes no webhook URL.                                                                                                                                                                                                                                                                                                                                |
| `ScalekitBadRequestException`         | `TRIGGER_INGRESS_DEFINITIONS_UNAVAILABLE` | The provider's trigger definitions cannot be read right now.                                                                                                                                                                                                                                                                                                                                                |
| `ScalekitBadRequestException`         | `TRIGGER_SIGNING_SECRET_GENERATED_ONLY`   | Use `actions.triggers.generateSigningSecret` for this provider.                                                                                                                                                                                                                                                                                                                                             |
| `ScalekitBadRequestException`         | `TRIGGER_SIGNING_SECRET_NOT_GENERATABLE`  | The provider signs its own events; use `actions.triggers.setSigningSecret`.                                                                                                                                                                                                                                                                                                                                 |
| `ScalekitBadRequestException`         | `INVALID_ARGUMENT`                        | A refused value; the message says what to change. The delivery list methods also answer this for an unknown delivery endpoint (`actions.triggers.recoverDeliveries` answers 404).                                                                                                                                                                                                                           |
| `ScalekitConflictException`           | `RESOURCE_ALREADY_EXISTS`                 | The subscription already exists, or a secret rotation is already in progress.                                                                                                                                                                                                                                                                                                                               |
| `ScalekitTooManyRequestsException`    | `RATE_LIMITED`                            | Too many batch, resend or recover calls; wait and try again. Not retried by the SDK.                                                                                                                                                                                                                                                                                                                        |
| `ScalekitServiceUnavailableException` | (none)                                    | The service, or a dependency such as usage reporting, is briefly unavailable. Calls that are safe to repeat were already retried. `actions.triggers.createSubscription`, `actions.triggers.setSigningSecret`, `actions.triggers.generateSigningSecret`, `actions.triggers.batchResendDeliveries` and `actions.triggers.recoverDeliveries` are never repeated, so check the result before sending one again. |
| `ScalekitGatewayTimeoutException`     | (none)                                    | The deadline (`timeoutMs`) passed. For `actions.triggers.createSubscription`, `actions.triggers.setSigningSecret`, `actions.triggers.generateSigningSecret`, `actions.triggers.batchResendDeliveries` and `actions.triggers.recoverDeliveries` the request may still have taken effect: check before calling again.                                                                                         |
| `ScalekitInternalServerException`     | `INTERNAL_ERROR`                          | On `actions.triggers.recoverDeliveries`, the recovery may have started anyway: check deliveries before calling again.                                                                                                                                                                                                                                                                                       |

Invalid arguments (an empty ID, an unknown enum name, an invalid date, or a date-time string without `Z` or an offset) throw `ScalekitValidationError` before any request, and an aborted `signal` rejects with `ScalekitAbortError`. Batch methods never throw for a single item: read each result's `outcome`.
