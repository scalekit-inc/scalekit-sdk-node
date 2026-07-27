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
