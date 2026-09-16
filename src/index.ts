import ScalekitClient from './scalekit';

export { ScalekitClient };
export { ScalekitClient as Scalekit };
export default ScalekitClient;

export * from './types/scalekit';
export * from './types/auth';

export * from './errors';

// Generated enums/types surfaced in the public `events.listEventsPaginated` API:
// `ObjectType` appears on the returned `ScalekitEvent.object`, and `Source` on the
// optional `EventFilter` parameter — re-export them so callers can name them.
export { ObjectType, Source } from './pkg/grpc/scalekit/v1/events/events_pb';
export type { EventFilter } from './pkg/grpc/scalekit/v1/events/events_pb';

// Generated enums/types surfaced on every connected account: `status` is a
// `ConnectorStatus` and `authorizationType` a `ConnectorType`. Both are numeric at
// runtime, so callers need the named constants to test them — re-export here rather
// than leaving `connectedAccount.status === 1` as the only option. The internal pb
// path is not reachable: `exports` in package.json exposes only '.', './express',
// './next' and './edge', so a deep import fails with ERR_PACKAGE_PATH_NOT_EXPORTED.
export {
  ConnectorStatus,
  ConnectorType,
} from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

// Generated enum/types surfaced in the public `tools.searchTools` API:
// `ToolReadinessState` appears on each result's `connections[].readinessState` —
// re-export it so callers can name it (e.g. `readinessState === ToolReadinessState.READY`)
// instead of importing the internal pb path or comparing against a raw number.
export { ToolReadinessState } from './pkg/grpc/scalekit/v1/tools/tools_pb';
export type {
  SearchToolsResponse,
  SearchedTool,
  ConnectionReadiness,
} from './pkg/grpc/scalekit/v1/tools/tools_pb';

// Generated types surfaced in the public `tools.listTools` API — re-export
// them so callers can name the return type instead of importing the internal
// pb path. `actions.listTools` returns the normalized ListToolsResult/ActionTool
// shape below instead (no `$typeName`), consistent with `actions.listConnections`.
export type {
  ListToolsResponse,
  Tool,
} from './pkg/grpc/scalekit/v1/tools/tools_pb';

// Normalized types surfaced in the public `actions.listTools` API.
export type { ActionTool, ListToolsResult } from './actions';

// Types surfaced by the public `mcp` client (Virtual MCP servers). Only the
// generally available McpConfig surface is re-exported; the PREVIEW `Mcp` and
// `McpInstance` families backing the older /mcp/v1/ and /mcp/v2/ server
// generations are intentionally omitted.
export type {
  McpConfig,
  McpConfigConnectionToolMapping,
  CreateMcpConfigResponse,
  GetMcpConfigResponse,
  ListMcpConfigsResponse,
  UpdateMcpConfigResponse,
  DeleteMcpConfigResponse,
  ListMcpConnectedAccountsResponse,
  CreateMcpSessionTokenResponse,
} from './pkg/grpc/scalekit/v1/mcp/mcp_pb';

// Types surfaced by the public `providers` client (bring-your-own connectors).
// AuthPattern/AuthField are hand-written rather than generated: auth patterns
// cross the wire as an untyped google.protobuf.ListValue, so these describe the
// JSON shape the API expects.
export type { AuthPattern, AuthField } from './providers';
export { ProviderType } from './pkg/grpc/scalekit/v1/providers/providers_pb';
export type {
  Provider,
  CreateProviderResponse,
  UpdateProviderResponse,
  DeleteProviderResponse,
  ListProvidersResponse,
} from './pkg/grpc/scalekit/v1/providers/providers_pb';

// User-scoped facade returned by `scalekit.forIdentifier(...)`.
export { default as UserScope } from './agent';
export type { ConnectionState, ReadyTool } from './agent';
