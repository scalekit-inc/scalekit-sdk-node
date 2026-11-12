"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.parseSkippedTools = parseSkippedTools;
const protobuf_1 = require("@bufbuild/protobuf");
const wkt_1 = require("@bufbuild/protobuf/wkt");
const connect_1 = require("@connectrpc/connect");
const errors_1 = require("./errors");
const providers_pb_1 = require("./pkg/grpc/scalekit/v1/providers/providers_pb");
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
 * Client for bring-your-own connectors (custom providers).
 *
 * A custom connector puts a service Scalekit does not ship in front of the same
 * machinery as a built-in one: users connect an account, you call it through
 * `actions.request`, and Scalekit injects the credentials.
 *
 * Mirrors Python's `actions.providers`, including the preview status of
 * {@link listProviders} — see that method before you depend on it.
 */
class ProvidersClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(providers_pb_1.ProviderService);
    }
    /**
     * Creates a custom connector.
     *
     * A connector is sourced from an MCP server or from an OpenAPI spec. Set
     * exactly one of `proxyUrl` and `openapiSpecUrl`: both fail with
     * `[invalid_argument] proxy_url cannot be set together with openapi_spec_url`,
     * and neither with `[invalid_argument] either proxy_url or openapi_spec_url must be set`.
     *
     * With `openapiSpecUrl`, Scalekit generates the connector's tools from the spec:
     * - It fetches and checks the spec during this call, before it stores anything.
     *   A spec that fails the check is rejected with
     *   `[invalid_argument] openapi_spec_url failed validation: <reason>`: not a
     *   valid URL, not `https`, a host that cannot be reached for security reasons,
     *   a URL that could not be reached or read, not a valid OpenAPI or Swagger
     *   document, or larger than the environment's size limit (5 MB for each file
     *   by default, and 50 MB for the spec and the external files it references
     *   together). The server allows this check up to 2 minutes, while the SDK's
     *   default `timeoutMs` is 20 seconds, so raise `timeoutMs` when you create the
     *   client if your spec is slow to download.
     * - The call returns as soon as the connector is stored. The first tool
     *   collection run is queued in the background just after the response is
     *   built, so {@link getToolCollectionRun} can answer
     *   `ScalekitNotFoundException` (no run yet) for a moment, and keeps doing so
     *   if queueing failed (Scalekit only logs that). Treat it as "not queued yet"
     *   for a few seconds, then call {@link triggerToolCollection}. Poll until the
     *   run's `status` is `COMPLETED` or `FAILED` before you list the tools.
     * - `provider.proxyUrl` is empty in the response. Scalekit fills it from the
     *   spec's own server URL (see {@link Provider}); change it later with
     *   {@link updateCustomProvider}.
     * - For an `OAUTH` pattern, a run fills a blank `authorize_uri`, `token_uri`
     *   and the available scopes of `oauth_config` from the spec's OAuth2 security
     *   scheme. The stored pattern can then differ from the one you sent, so read
     *   it back with {@link listProviders} before you update the connector.
     * - An environment holds one OpenAPI-sourced connector per name, ignoring case
     *   and spaces: a second one fails with `[already_exists] an OpenAPI connector
     *   named "<NAME>" already exists in this environment`.
     * - OpenAPI-sourced connectors must be enabled for your environment (the
     *   `custom_api_tools` feature). Otherwise the call fails with the error code
     *   `FEATURE_NOT_ENABLED` and `OpenAPI-sourced connectors are not enabled for this environment`.
     *
     * @param params.displayName Human-readable name. Letters, digits and spaces only.
     *                           Suffix it with "MCP" when the connector fronts an MCP server.
     * @param params.proxyUrl HTTPS URL of the upstream service: the MCP server URL for
     *                        an MCP connector. At most 2048 characters. Leave it out when
     *                        you set `openapiSpecUrl`.
     * @param params.openapiSpecUrl HTTPS URL of an OpenAPI spec, in JSON or YAML, to
     *                              generate the connector's tools from. Swagger 2.0 and 1.x
     *                              documents are converted. At most 2048 characters.
     * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
     * @param params.authPatterns How users authenticate. Exactly one pattern is
     *                            supported today; the array is for future use.
     * @returns `provider.identifier` on the response is the id you pass to
     *          {@link updateCustomProvider}, {@link deleteCustomProvider},
     *          {@link triggerToolCollection} and {@link getToolCollectionRun}.
     * @throws {ScalekitServiceUnavailableException} If the service is unavailable.
     *   With `openapiSpecUrl` the call is not retried automatically, because the
     *   first attempt may already have stored the connector (a retry would fail
     *   with `already_exists`): look it up with {@link listProviders} before you
     *   create it again.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createCustomProvider(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const provider = (0, protobuf_1.create)(providers_pb_1.CreateCustomProviderSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ displayName: params.displayName, description: (_a = params.description) !== null && _a !== void 0 ? _a : '' }, (params.proxyUrl !== undefined && { proxyUrl: params.proxyUrl })), (params.openapiSpecUrl !== undefined && {
                openapiSpecUrl: params.openapiSpecUrl,
            })), { proxyEnabled: (_b = params.proxyEnabled) !== null && _b !== void 0 ? _b : true }), (params.iconSrc !== undefined && { iconSrc: params.iconSrc })), (params.metadata && { metadata: params.metadata })), (params.authPatterns && {
                authPatterns: toListValue(params.authPatterns),
            })));
            // A create from a spec is not replayed after `Unavailable`: the first attempt
            // may have stored the connector, and a replay would answer `already_exists`.
            const createCall = params.openapiSpecUrl
                ? withoutUnavailableRetry(this.client.createCustomProvider)
                : this.client.createCustomProvider;
            const response = yield this.coreClient.connectExec(createCall, (0, protobuf_1.create)(providers_pb_1.CreateCustomProviderRequestSchema, { provider }));
            return { provider: toProvider(response.provider) };
        });
    }
    /**
     * Updates a custom connector.
     *
     * Treat this as a PUT: read the current connector with {@link listProviders}
     * first, then send back every field you want to keep alongside the ones you
     * are changing. `provider.authPatterns` and `provider.proxyEnabled` from that
     * response can be passed here as-is.
     *
     * What the server does with each field:
     * - `displayName` and `authPatterns` are required on every update, and so is
     *   `proxyUrl` for an MCP-sourced connector (`[invalid_argument] proxy_url is
     *   required for an MCP-sourced connector`). Omitting `authPatterns` fails with
     *   `[invalid_argument] Validation error`, and it replaces the whole list rather
     *   than merging into it. The pattern's `type` and `is_mcp` cannot be changed.
     * - `metadata` replaces the stored map, so leaving it out clears it.
     * - `proxyEnabled` is always applied. It defaults to `true` here, so pass the
     *   current value to keep a connector's proxying switched off.
     * - `description` and `iconSrc` keep their stored values when left out.
     *
     * A connector created from an OpenAPI spec (`provider.openapiSpecUrl` is set)
     * follows stricter rules, because Scalekit manages its tools and its auth:
     * - Only `displayName`, `description`, `iconSrc`, `metadata` and `proxyUrl` can
     *   change. A different `proxyEnabled`, or `authPatterns` that differ in
     *   content from the stored ones, fail with `[invalid_argument] an
     *   OpenAPI-sourced connector can only update metadata, display_name,
     *   description, icon_src and proxy_url`. Send back `provider.proxyEnabled`
     *   and `provider.authPatterns` from {@link listProviders} unchanged, even
     *   `is_open_api`: re-sending the stored values is not a change.
     * - `proxyUrl` is the connector's base URL. Leave it out to keep the stored
     *   value. A different value (a trailing slash does not count) is saved and
     *   re-reads the spec, so every tool is generated against the new base URL.
     * - `openapiSpecUrl` is fixed once the connector exists. Re-sending the stored
     *   URL changes nothing. A different URL fails with the error code
     *   `FEATURE_NOT_ENABLED` and `updating the OpenAPI spec URL of an existing
     *   connector is not enabled for this workspace`, unless your workspace has that
     *   capability enabled (the `custom_api_tools_spec_url_update` feature). When it
     *   does, Scalekit checks the new spec as {@link createCustomProvider} does,
     *   saves the URL and re-reads the spec. A connector that was not created from a
     *   spec can never get one: `[invalid_argument] openapi_spec_url can only be set
     *   on a connector that was created as an OpenAPI-sourced connector`.
     * - Changing `proxyUrl` or `openapiSpecUrl` queues a tool collection run; follow
     *   it with {@link getToolCollectionRun}. If a run is already in progress, the
     *   new value is still saved but no run is queued, and the call fails with
     *   `[already_exists] <field> was saved, but an ingestion run is already in
     *   progress for this connector`. Call {@link triggerToolCollection} once that
     *   run has finished.
     * - Both changes need OpenAPI-sourced connectors to be enabled for your
     *   environment (the `custom_api_tools` feature), as on create.
     *
     * @param params.identifier From `provider.identifier` on a create or list response.
     * @param params.proxyUrl Required for an MCP-sourced connector. For one created
     *                        from an OpenAPI spec this is its base URL, and leaving it
     *                        out keeps the stored value.
     * @param params.openapiSpecUrl Only for a connector created from an OpenAPI spec.
     * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    updateCustomProvider(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const provider = (0, protobuf_1.create)(providers_pb_1.UpdateCustomProviderSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ displayName: params.displayName }, (params.proxyUrl !== undefined && { proxyUrl: params.proxyUrl })), (params.openapiSpecUrl !== undefined && {
                openapiSpecUrl: params.openapiSpecUrl,
            })), { 
                // Always sent: the server applies proxy_enabled on every update, so an
                // unset field would switch proxying off.
                proxyEnabled: (_a = params.proxyEnabled) !== null && _a !== void 0 ? _a : true }), (params.description !== undefined && {
                description: params.description,
            })), (params.iconSrc !== undefined && { iconSrc: params.iconSrc })), (params.metadata && { metadata: params.metadata })), { authPatterns: toListValue(params.authPatterns) }));
            const response = yield this.coreClient.connectExec(this.client.updateCustomProvider, (0, protobuf_1.create)(providers_pb_1.UpdateCustomProviderRequestSchema, {
                identifier: params.identifier,
                provider,
            }));
            return { provider: toProvider(response.provider) };
        });
    }
    /**
     * Deletes a custom connector.
     *
     * Remove the connector's connections and connected accounts first; the server
     * refuses to delete one that is still in use, with
     * `[invalid_argument] cannot delete custom provider with existing connections`.
     *
     * Connected accounts come off with `actions.deleteConnectedAccount`, and then
     * the connector's connections with `actions.deleteConnection`.
     * `connection.deleteConnection` takes an `organizationId`, which an app
     * connection does not have, so it is not the one to use here.
     * `actions.deleteConnection` throws `CONNECTION_IN_USE` while a Virtual MCP
     * configuration still maps the connection: remove it from those configurations
     * first.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    deleteCustomProvider(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteCustomProvider, (0, protobuf_1.create)(providers_pb_1.DeleteProviderRequestSchema, { identifier }));
        });
    }
    /**
     * Queues a new tool collection run for a connector created from an OpenAPI
     * spec, and returns it with the status `QUEUED`.
     *
     * The run reads the connector's stored spec again and brings its tools in line
     * with it. Creating the connector, and changing its base URL or spec URL,
     * already queue a run for you. Call this to pick up a spec that changed
     * upstream, or to retry a run that failed. It returns at once: poll
     * {@link getToolCollectionRun} for the outcome.
     *
     * Scalekit checks the stored spec URL during this call, with the same checks
     * and errors as {@link createCustomProvider}. When the spec, the connector's
     * base URL and its auth patterns are all unchanged since the last completed run,
     * and the spec does not reference external files, the run changes no tools and
     * reports `toolsCreated`, `toolsUpdated` and `toolsDeleted` as 0.
     *
     * The server allows the spec check up to 2 minutes, while the SDK's default
     * `timeoutMs` is 20 seconds, so raise `timeoutMs` when you create the client if
     * your spec is slow to download.
     *
     * @param providerIdentifier `provider.identifier` of the connector.
     * @returns The queued {@link ToolCollectionRun}.
     * @throws {ScalekitValidationError} If `providerIdentifier` is empty. No request is sent.
     * @throws {ScalekitNotFoundException} If no connector in your environment has this identifier.
     * @throws {ScalekitBadRequestException} If the connector was not created from an
     *   OpenAPI spec (`this connector is not sourced from an OpenAPI spec`), if
     *   OpenAPI-sourced connectors are not enabled for your environment (error code
     *   `FEATURE_NOT_ENABLED`), or if the stored spec URL fails the check.
     * @throws {ScalekitConflictException} If a run is already in progress, with the
     *   error code `RESOURCE_ALREADY_EXISTS`. A connector has at most one active run.
     * @throws {ScalekitServiceUnavailableException} If the service is unavailable.
     *   This call is not retried automatically, because the first attempt may already
     *   have queued a run. You cannot tell whether it did, and a run you then find
     *   may be another caller's: call {@link getToolCollectionRun}, wait for an active
     *   run to finish, and trigger again if you need a run that started after your call.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    triggerToolCollection(providerIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not replayed after `Unavailable`: the first attempt may already have queued a run.
            const response = yield this.coreClient.connectExec(withoutUnavailableRetry(this.client.triggerToolCollection), (0, protobuf_1.create)(providers_pb_1.TriggerToolCollectionRequestSchema, {
                providerIdentifier: requireProviderIdentifier(providerIdentifier),
            }));
            return toToolCollectionRun(response);
        });
    }
    /**
     * Fetches one tool collection run of a connector created from an OpenAPI spec:
     * its status, its counters and, once it has finished, the operations that were
     * skipped and why.
     *
     * Poll this after {@link createCustomProvider}, {@link updateCustomProvider} or
     * {@link triggerToolCollection} until `status` is `COMPLETED` or `FAILED`.
     * Right after {@link createCustomProvider} the first run may not exist yet, and
     * this call can answer `ScalekitNotFoundException`: see
     * {@link createCustomProvider} for how to wait for it.
     * A run is `QUEUED`, then `PROCESSING`. It fails if Scalekit cannot fetch or
     * parse the spec, if the spec yields no tool at all, if processing takes longer
     * than 3 minutes, or if the run makes no progress for 30 minutes. A spec
     * operation that cannot become a tool is skipped and listed in `skippedTools`,
     * and does not fail the run. The operations skipped are those that:
     * - use a method other than GET, POST, PUT, PATCH or DELETE;
     * - have a request body that is not JSON, form-encoded or a plain string (for
     *   example multipart, binary or XML), or a form-encoded body that is not an object;
     * - need authentication while the connector's auth type is not one that
     *   Scalekit can sign requests for;
     * - have no base URL, or need authentication but have a plain `http://` base
     *   URL (other than on localhost);
     * - use a path parameter the operation does not declare, or an object query
     *   parameter with `style: form`.
     *
     * Each tool is named `a-<connector name>_<operationId>`, in lower case, with the
     * connector name taken from its identifier. Without an `operationId`, the method
     * and path stand in for it, and a name that is already taken gets a numeric suffix.
     * Operations that left the spec are deleted from the connector.
     *
     * @param providerIdentifier `provider.identifier` of the connector.
     * @param runId A run's `runId`. Omit it, or pass `'latest'`, for the connector's newest run.
     * @returns The {@link ToolCollectionRun}.
     * @throws {ScalekitValidationError} If `providerIdentifier` is empty. No request is sent.
     * @throws {ScalekitNotFoundException} If no connector has this identifier, or
     *   the connector has no run yet, or `runId` is not one of its runs
     *   (`tool collection run not found`).
     * @throws {ScalekitBadRequestException} If `runId` is malformed (`invalid run_id`).
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    getToolCollectionRun(providerIdentifier, runId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.coreClient.connectExec(this.client.getToolCollectionRun, (0, protobuf_1.create)(providers_pb_1.GetToolCollectionRunRequestSchema, {
                providerIdentifier: requireProviderIdentifier(providerIdentifier),
                runId: runId || 'latest',
            }));
            return toToolCollectionRun(response);
        });
    }
    /**
     * Lists connectors, built-in and custom.
     *
     * Use it to find a connector's `identifier` before updating or deleting it.
     *
     * PREVIEW — the underlying `ListProviders` RPC is marked preview in the API and
     * may change. It is exposed because create, update and delete are generally
     * available but need an identifier this is the only way to discover. The Python
     * SDK wraps the same RPC at `actions.providers.list_providers`.
     *
     * @param params.providerType Filter by kind: `ProviderType.CUSTOM` for your own
     *                            connectors, `ProviderType.ALL` for built-ins and
     *                            custom together. Omitting it behaves like
     *                            `ProviderType.DEFAULT` and returns built-ins only,
     *                            so pass `CUSTOM` or `ALL` to find a custom
     *                            connector's identifier.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listProviders(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const response = yield this.coreClient.connectExec(this.client.listProviders, (0, protobuf_1.create)(providers_pb_1.ListProvidersRequestSchema, Object.assign({ identifier: (_a = params === null || params === void 0 ? void 0 : params.identifier) !== null && _a !== void 0 ? _a : '', pageSize: (_b = params === null || params === void 0 ? void 0 : params.pageSize) !== null && _b !== void 0 ? _b : 0, pageToken: (_c = params === null || params === void 0 ? void 0 : params.pageToken) !== null && _c !== void 0 ? _c : '' }, ((params === null || params === void 0 ? void 0 : params.providerType) !== undefined && {
                filter: (0, protobuf_1.create)(providers_pb_1.ListProvidersRequest_FilterSchema, {
                    providerType: params.providerType,
                }),
            }))));
            return {
                providers: response.providers.map((p) => toProvider(p)),
                nextPageToken: response.nextPageToken,
                prevPageToken: response.prevPageToken,
                totalSize: response.totalSize,
            };
        });
    }
}
exports.default = ProvidersClient;
/**
 * Auth patterns cross the wire as a `google.protobuf.ListValue` of arbitrary JSON,
 * so they are parsed from plain objects rather than built from a generated message
 * type. Python does the same thing via `ParseDict`.
 *
 * Keys set to `undefined` are dropped first, as `JSON.stringify` would drop them:
 * `fromJson` rejects `undefined` with an error that does not name the field, and
 * `{ description: opts.description }` is an easy way to produce one.
 */
function toListValue(patterns) {
    return (0, protobuf_1.fromJson)(wkt_1.ListValueSchema, stripUndefined(patterns));
}
function stripUndefined(value) {
    if (Array.isArray(value))
        return value.map(stripUndefined);
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, stripUndefined(v)]));
    }
    return value;
}
/**
 * Decodes a provider's `authPatterns` from `ListValue` into plain objects, the
 * reverse of {@link toListValue}. Python does the same via `MessageToDict`.
 */
function toProvider(message) {
    if (!message)
        return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $typeName, authPatterns } = message, fields = __rest(message, ["$typeName", "authPatterns"]);
    return Object.assign(Object.assign({}, fields), { authPatterns: fromListValue(authPatterns) });
}
function fromListValue(value) {
    return value ? (0, protobuf_1.toJson)(wkt_1.ListValueSchema, value) : [];
}
/** The connector identifier goes into the request path, so an empty one is rejected before any request is sent. */
function requireProviderIdentifier(providerIdentifier) {
    if (typeof providerIdentifier !== 'string' || !providerIdentifier.trim()) {
        throw new errors_1.ScalekitValidationError('providerIdentifier is required');
    }
    return providerIdentifier;
}
/**
 * Wraps a gRPC method so that `CoreClient.connectExec` does not replay it when
 * the service answers `Unavailable`. `connectExec` retries that code, which is
 * safe for a read but not for a call whose first attempt may have worked even
 * though its response was lost: a replayed {@link ProvidersClient.triggerToolCollection}
 * can queue a second run or answer `ScalekitConflictException` for the first,
 * and a replayed create from a spec answers `already_exists` for the connector
 * it has just made. The wrapper raises the same
 * `ScalekitServiceUnavailableException` that `connectExec` raises once it runs
 * out of retries, so the caller sees one error type either way. Every other
 * code, including the `Unauthenticated` that makes `connectExec` fetch a new
 * token, passes through untouched.
 */
function withoutUnavailableRetry(call) {
    return (request, options) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield call(request, options);
        }
        catch (error) {
            if (error instanceof connect_1.ConnectError && error.code === connect_1.Code.Unavailable) {
                throw errors_1.ScalekitServerException.promote(error);
            }
            throw error;
        }
    });
}
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
//# sourceMappingURL=providers.js.map