"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolCollectionRunStatus = void 0;
exports.toToolCollectionRun = toToolCollectionRun;
exports.parseSkippedTools = parseSkippedTools;
/**
 * Status of a {@link ToolCollectionRun}. A run goes from `QUEUED` to
 * `PROCESSING` and ends as `COMPLETED` or `FAILED`.
 *
 * The API sends the status as a plain string, so a value the SDK does not know
 * yet passes through unchanged.
 */
exports.ToolCollectionRunStatus = {
    QUEUED: 'QUEUED',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
};
/**
 * Adds the parsed `skippedTools` to a run and types its `status`. The raw
 * `skippedToolsJson` stays on the result.
 */
function toToolCollectionRun(message) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $typeName } = message, fields = __rest(message, ["$typeName"]);
    return Object.assign(Object.assign({}, fields), { skippedTools: parseSkippedTools(message.skippedToolsJson) });
}
/**
 * Parses a run's `skippedToolsJson`. The API leaves it empty until the run has
 * finished, and the JSON text `null` can stand for "nothing skipped": an empty
 * string, `null` and `[]` all give an empty list. Text that is not a JSON array
 * also gives an empty list, rather than failing a poll over a field whose shape
 * is not settled; read `skippedToolsJson` on the run to see it. Entries that are
 * not objects are left out, and a missing field becomes an empty string.
 */
function parseSkippedTools(skippedToolsJson) {
    const text = (skippedToolsJson !== null && skippedToolsJson !== void 0 ? skippedToolsJson : '').trim();
    if (!text)
        return [];
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch (_a) {
        return [];
    }
    if (!Array.isArray(parsed))
        return [];
    const asString = (value) => typeof value === 'string' ? value : '';
    return parsed
        .filter((entry) => entry !== null && typeof entry === 'object' && !Array.isArray(entry))
        .map((entry) => ({
        operationId: asString(entry.operation_id),
        method: asString(entry.method),
        path: asString(entry.path),
        reason: asString(entry.reason),
    }));
}
//# sourceMappingURL=tool-collection-runs.js.map