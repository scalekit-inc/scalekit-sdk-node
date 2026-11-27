import type { ToolCollectionRun as ToolCollectionRunMessage } from './pkg/grpc/scalekit/v1/providers/providers_pb';
/**
 * Status of a {@link ToolCollectionRun}. A run goes from `QUEUED` to
 * `PROCESSING` and ends as `COMPLETED` or `FAILED`.
 *
 * The API sends the status as a plain string, so a value the SDK does not know
 * yet passes through unchanged.
 */
export declare const ToolCollectionRunStatus: {
    readonly QUEUED: "QUEUED";
    readonly PROCESSING: "PROCESSING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
/** See {@link (ToolCollectionRunStatus:variable)}. Open: unknown values are plain strings. */
export type ToolCollectionRunStatus = (typeof ToolCollectionRunStatus)[keyof typeof ToolCollectionRunStatus] | (string & {});
/**
 * One operation of an OpenAPI spec that a tool collection run did not turn into
 * a tool. A skipped operation does not fail the run.
 *
 * `reason` is text for people: Scalekit can reword it, so do not match on it.
 */
export interface SkippedTool {
    /** The operation's `operationId` in the spec. Empty when the spec has none, or when the entry is not about one operation. */
    operationId: string;
    /** HTTP method of the operation in upper case, for example `GET`. */
    method: string;
    /** Path of the operation, as written in the spec. */
    path: string;
    reason: string;
}
/**
 * A tool collection run: one attempt to read an OpenAPI-sourced connector's spec
 * and turn its operations into tools. Returned by `actions.invokeToolCollection`
 * and `actions.getToolCollectionRun`.
 *
 * Same fields as the API's `ToolCollectionRun`, except that `status` is typed
 * as {@link ToolCollectionRunStatus} and `skippedTools` is `skippedToolsJson`
 * parsed. `createdAt`, `startedAt` and `finishedAt` are protobuf timestamps,
 * whose `seconds` is a `bigint`.
 *
 * - `totalEndpoints`: operations found in the spec, before leaving out those
 *   that cannot become tools.
 * - `toolsCreated`, `toolsUpdated`, `toolsDeleted`: tools added, refreshed, and
 *   removed because their operation is no longer in the spec. Putting the
 *   operation back in the spec creates a new tool.
 * - `skippedToolsJson`: the skipped operations as JSON text, empty until the run
 *   is `COMPLETED` or `FAILED`. Its shape is not settled yet, so prefer
 *   `skippedTools`.
 * - `errorMessage`: why the run failed. Empty unless `status` is `FAILED`.
 * - `createdAt`: when the run was queued. `startedAt` is unset while `QUEUED`,
 *   and `finishedAt` until the run is `COMPLETED` or `FAILED`.
 */
export type ToolCollectionRun = Omit<ToolCollectionRunMessage, '$typeName' | 'status'> & {
    status: ToolCollectionRunStatus;
    skippedTools: SkippedTool[];
};
/**
 * Adds the parsed `skippedTools` to a run and types its `status`. The raw
 * `skippedToolsJson` stays on the result.
 */
export declare function toToolCollectionRun(message: ToolCollectionRunMessage): ToolCollectionRun;
/**
 * Parses a run's `skippedToolsJson`. The API leaves it empty until the run has
 * finished, and the JSON text `null` can stand for "nothing skipped": an empty
 * string, `null` and `[]` all give an empty list. Text that is not a JSON array
 * also gives an empty list, rather than failing a poll over a field whose shape
 * is not settled; read `skippedToolsJson` on the run to see it. Entries that are
 * not objects are left out, and a missing field becomes an empty string.
 */
export declare function parseSkippedTools(skippedToolsJson: string): SkippedTool[];
