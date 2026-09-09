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
