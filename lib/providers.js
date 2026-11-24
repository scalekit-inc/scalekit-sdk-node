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
const protobuf_1 = require("@bufbuild/protobuf");
const wkt_1 = require("@bufbuild/protobuf/wkt");
const errors_1 = require("./errors");
const providers_pb_1 = require("./pkg/grpc/scalekit/v1/providers/providers_pb");
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
     * exactly one of `proxyUrl` and `openapiSpecUrl`: both fail with a message that starts
     * `[invalid_argument] proxy_url cannot be set together with openapi_spec_url`, and neither
     * with one that starts `[invalid_argument] either proxy_url or openapi_spec_url must be set`.
     * Each goes on with a dash and a sentence that says what to do instead.
     *
     * With `openapiSpecUrl`, Scalekit generates the connector's tools from the spec:
     * - It fetches and checks the spec during this call, before it stores anything.
     *   A spec that fails the check is rejected with
     *   `[invalid_argument] openapi_spec_url failed validation: <reason>`: not a
     *   valid URL, a host that cannot be reached for security reasons, a URL that
     *   could not be reached or read, not a valid OpenAPI or Swagger document, or
     *   larger than the environment's size limit (5 MB for each file by default,
     *   and 50 MB for the spec and the external files it references together). A
     *   URL that does not start with `https://` or is longer than 2048 characters
     *   fails request validation (`[invalid_argument] Validation error`) before
     *   the spec is fetched.
     * - The call returns as soon as the connector is stored. The first tool
     *   collection run is queued in the background right after the connector is
     *   stored, so `actions.getToolCollectionRun` can answer
     *   `ScalekitNotFoundException` (no run yet) for a moment, and keeps doing so
     *   if queueing failed (Scalekit only logs that). Treat it as "not queued yet"
     *   for a few seconds, then call `actions.invokeToolCollection`. Poll until the
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
     * - OpenAPI-sourced connectors must be enabled for your environment.
     *   Otherwise the call fails with the error code `FEATURE_NOT_ENABLED` and
     *   `OpenAPI-sourced connectors are not enabled for this environment`.
     *
     * @param params.displayName Human-readable name. Letters, digits and spaces only.
     *                           Suffix it with "MCP" when the connector fronts an MCP server.
     * @param params.proxyUrl HTTPS URL of the upstream service: the MCP server URL for
     *                        an MCP connector. At most 2048 characters. Leave it out when
     *                        you set `openapiSpecUrl`.
     * @param params.openapiSpecUrl HTTPS URL of an OpenAPI spec, in JSON or YAML, to
     *                              generate the connector's tools from. Swagger 2.0 and 1.x
     *                              documents are converted. At most 2048 characters.
     * @param params.proxyEnabled Ignored: a custom connector is always created with
     *                            `proxyEnabled` true, whatever you pass. Kept so that
     *                            existing calls keep working.
     * @param params.authPatterns How users authenticate. Exactly one pattern is
     *                            supported today; the array is for future use.
     *                            More than one is refused before anything is sent.
     * @returns `provider.identifier` on the response is the connector
     *          `identifier` (`NAME:environment-id`, not `provider.id`) you pass
     *          to {@link updateCustomProvider}, {@link deleteCustomProvider},
     *          `actions.invokeToolCollection` and `actions.getToolCollectionRun`.
     * @throws {ScalekitValidationError} If `authPatterns` holds more than one
     *   pattern. No request is sent.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createCustomProvider(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            assertAtMostOneAuthPattern(params.authPatterns);
            const provider = (0, protobuf_1.create)(providers_pb_1.CreateCustomProviderSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ displayName: params.displayName, description: (_a = params.description) !== null && _a !== void 0 ? _a : '' }, (params.proxyUrl !== undefined && { proxyUrl: params.proxyUrl })), (params.openapiSpecUrl !== undefined && {
                openapiSpecUrl: params.openapiSpecUrl,
            })), { 
                // Always true, whatever the caller passes: `params.proxyEnabled` is kept
                // only so that existing calls keep working.
                proxyEnabled: true }), (params.iconSrc !== undefined && { iconSrc: params.iconSrc })), (params.metadata && { metadata: params.metadata })), (params.authPatterns && {
                authPatterns: toListValue(params.authPatterns),
            })));
            const response = yield this.coreClient.connectExec(this.client.createCustomProvider, (0, protobuf_1.create)(providers_pb_1.CreateCustomProviderRequestSchema, { provider }));
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
     * - `proxyEnabled` is always applied. It defaults to `true` here, the value
     *   {@link createCustomProvider} always sets, so pass the current value to keep
     *   a connector that has proxying switched off (created that way by another
     *   client such as the dashboard or the REST API, or by an earlier release of
     *   this SDK) as it is.
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
     *   value. A different value is saved and re-reads the spec, so every tool is
     *   generated against the new base URL. A value that differs only by a
     *   trailing slash is saved as sent but queues no run.
     * - `openapiSpecUrl` is fixed once the connector exists. Re-sending the stored
     *   URL changes nothing. A different URL fails with the error code
     *   `FEATURE_NOT_ENABLED` and `updating the OpenAPI spec URL of an existing
     *   connector is not enabled for this workspace`, unless your workspace has that
     *   capability enabled. When it does, Scalekit checks the new spec as
     *   {@link createCustomProvider} does, saves the URL and re-reads the spec. A
     *   connector that was not created from a spec can never get one:
     *   `[invalid_argument] openapi_spec_url can only be set
     *   on a connector that was created as an OpenAPI-sourced connector`.
     * - Changing `proxyUrl` or `openapiSpecUrl` queues a tool collection run; follow
     *   it with `actions.getToolCollectionRun`. If a run is already in progress, the
     *   new value is still saved but no run is queued, and the call fails with
     *   `ScalekitConflictException`. After a `proxyUrl` change the message is
     *   `[already_exists] base_url was saved, but an ingestion run is already in
     *   progress for this connector — call TriggerToolCollection once it completes
     *   to re-ingest against the new base_url`. Call `actions.invokeToolCollection`
     *   once that run has finished.
     * - Both changes need OpenAPI-sourced connectors to be enabled for your
     *   environment, as on create.
     *
     * @param params.identifier The connector's `identifier` (`NAME:environment-id`, such as
     *   `ACMEAPI:70219645518265104`): `provider.identifier` on a create or list response, not
     *   `provider.id` (`prvd_...`).
     * @param params.proxyUrl Required for an MCP-sourced connector. For one created
     *                        from an OpenAPI spec this is its base URL, and leaving it
     *                        out keeps the stored value.
     * @param params.openapiSpecUrl Only for a connector created from an OpenAPI spec.
     * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
     * @returns The updated connector, as `provider` on the response.
     * @throws {ScalekitValidationError} If `authPatterns` holds more than one
     *   pattern: only one is supported. No request is sent.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    updateCustomProvider(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            assertAtMostOneAuthPattern(params.authPatterns);
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
     * refuses to delete one that still has connections, with the error code
     * `PROVIDER_HAS_EXISTING_CONNECTIONS` and the message
     * `[invalid_argument] cannot delete custom provider with existing connections`.
     * Deleting a connector cannot be undone.
     *
     * Connected accounts come off with `actions.deleteConnectedAccount`, and then
     * the connector's connections with `actions.deleteConnection`, which fails with
     * the code `CONNECTION_IN_USE` while connected accounts or Virtual MCP servers
     * still use the connection: remove those first.
     *
     * A connector created from an OpenAPI spec cannot be deleted while a tool
     * collection run of it is queued or processing: the call throws
     * `ScalekitConflictException` (`RESOURCE_ALREADY_EXISTS`) and deletes nothing.
     * Wait for the run with `actions.getToolCollectionRun`, then call again until the
     * conflict stops.
     *
     * @param identifier The connector's `identifier` (`NAME:environment-id`, such as
     *   `ACMEAPI:70219645518265104`): `provider.identifier` from a create or list response, not
     *   `provider.id` (`prvd_...`).
     * @returns The API's `DeleteProviderResponse`, which has no fields, once the
     *   connector is deleted.
     * @throws {ScalekitBadRequestException} If the connector still has connections,
     *   with the error code `PROVIDER_HAS_EXISTING_CONNECTIONS`. Nothing is deleted.
     * @throws {ScalekitNotFoundException} If no custom connector has this identifier.
     * @throws {ScalekitConflictException} If the connector was created from an
     *   OpenAPI spec and a tool collection run of it is queued or processing, with the
     *   error code `RESOURCE_ALREADY_EXISTS`. The message names the run. Nothing is
     *   deleted.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    deleteCustomProvider(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteCustomProvider, (0, protobuf_1.create)(providers_pb_1.DeleteProviderRequestSchema, { identifier }));
        });
    }
    /**
     * Lists connectors, built-in and custom.
     *
     * Use it to find a connector's `identifier` (`NAME:environment-id`, not `provider.id`) before
     * updating or deleting it.
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
/**
 * Only one auth pattern is supported today, but the server stores a longer list
 * without complaint, so a second pattern is refused here, before anything is sent.
 */
function assertAtMostOneAuthPattern(authPatterns) {
    if (Array.isArray(authPatterns) && authPatterns.length > 1) {
        throw new errors_1.ScalekitValidationError('authPatterns must contain at most one AuthPattern');
    }
}
//# sourceMappingURL=providers.js.map