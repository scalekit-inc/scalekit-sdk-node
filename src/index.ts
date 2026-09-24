import ScalekitClient from './scalekit';

export { ScalekitClient };
export { ScalekitClient as Scalekit };
export default ScalekitClient;

export * from './types/scalekit';
export * from './types/auth';

export * from './errors';

// Generated enum surfaced in the public `resources.listResources` API:
// `resourceType` is a required parameter, so callers need to name it (e.g.
// `ResourceType.MCP_SERVER`) without reaching into the internal pb path.
export { ResourceType } from './pkg/grpc/scalekit/v1/clients/clients_pb';
export type {
  Resource,
  Scope,
  GetResourceResponse,
  ListResourcesResponse,
} from './pkg/grpc/scalekit/v1/clients/clients_pb';

// Generated enum surfaced in the public connected-account APIs: `status` on a
// connected account is a `ConnectorStatus`, so callers can check
// `status === ConnectorStatus.ACTIVE` without importing the internal pb path
// (which the package `exports` map blocks).
export { ConnectorStatus } from './pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

// Generated enums/types surfaced in the public `events.listEventsPaginated` API:
// `ObjectType` appears on the returned `ScalekitEvent.object`, and `Source` on the
// optional `EventFilter` parameter — re-export them so callers can name them.
export { ObjectType, Source } from './pkg/grpc/scalekit/v1/events/events_pb';
export type { EventFilter } from './pkg/grpc/scalekit/v1/events/events_pb';

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

// Generated types surfaced in the public `auth.getLoginRequestDetails` API:
// the response and the three blocks it carries. Re-export them so callers can
// name the return type — e.g. annotating a handler that receives it — without
// importing the internal pb path.
export type {
  GetLoginRequestDetailsResponse,
  AuthRequestDetails,
  AuthRequestClient,
  AuthRequestResource,
} from './pkg/grpc/scalekit/v1/auth/auth_pb';
