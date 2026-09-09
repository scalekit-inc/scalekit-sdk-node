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
