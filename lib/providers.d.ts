import GrpcConnect from './connect';
import CoreClient from './core';
import { DeleteProviderResponse, Provider as ProviderMessage, ProviderType, ToolCollectionRun as ToolCollectionRunMessage } from './pkg/grpc/scalekit/v1/providers/providers_pb';
/**
 * One credential input shown to the user while they connect.
 *
 * Used with `BEARER`, `API_KEY` and `BASIC` patterns. An `OAUTH` flow collects
 * its own credentials, and `NO_AUTH` takes none, so leave `fields` empty for those.
 */
export interface AuthField {
    /**
     * Key the credential is stored under. Use `token` for bearer patterns,
     * `api_key` for single-key API-key patterns, and the two fields `username`
     * and `password` for a `BASIC` pattern, which Scalekit sends as an HTTP Basic
     * `Authorization` header. When `header_name` is set, Scalekit derives it from
     * the header name, so each header gets its own key.
     */
    field_name: string;
    /** Label shown above the input. */
    label?: string;
    /** Use `password` for anything secret so the UI masks it. */
    input_type?: 'text' | 'password' | 'select';
    /** Helper text shown with the input. */
    hint?: string;
    /** Whether the user must fill this in before the connection can be saved. */
    required?: boolean;
    /**
     * On an `API_KEY` pattern, sends this field's value as this exact HTTP header
     * (case preserved). Setting it on any field puts the pattern in multiple-headers
     * mode, so each field is sent as its own header. Leave it unset for single-key
     * mode, which uses the pattern's `auth_header_key_override`.
     *
     * Scalekit rejects a violation of these rules with the error code
     * `INVALID_HEADER_CONFIG`: every credential field needs a `header_name`; there
     * can be at most 10 headers; a name may use only letters, `.`, `-` and `_`, so
     * no digits or spaces; names must be unique, ignoring case; and `connection`,
     * `keep-alive`, `proxy-authenticate`, `proxy-authorization`, `te`, `trailer`,
     * `transfer-encoding`, `upgrade`, `host` and `content-length` are reserved. A
     * connector cannot be switched between single-key and multiple-headers mode
     * after it is created. Renaming or removing a header later makes the calls of
     * the accounts connected before the change fail with `MISSING_REQUIRED_HEADER`
     * until their users connect again.
     */
    header_name?: string;
}
/**
 * One way a user can authenticate against your connector.
 *
 * Sent to the API as-is, so the keys are snake_case to match the wire format
 * rather than the camelCase used elsewhere in this SDK.
 */
export interface AuthPattern {
    /**
     * Authentication method. A `BASIC` pattern takes the fields `username` and
     * `password` (see {@link AuthField.field_name}). Use `BASIC` on a connector
     * created from an OpenAPI spec or another REST connector, not on one that
     * fronts an MCP server.
     */
    type: 'OAUTH' | 'BEARER' | 'API_KEY' | 'BASIC' | 'NO_AUTH' | (string & {});
    /** Name of this method, shown to the user while they connect. */
    display_name: string;
    /** Short explanation of this method, shown to the user. */
    description?: string;
    /**
     * Set to `true` when the connector fronts an MCP server. Scalekit sets it to
     * `false` on a connector created from an OpenAPI spec, whatever you send.
     */
    is_mcp?: boolean;
    /**
     * Set by Scalekit, never by you: `true` on every pattern of a connector
     * created from an OpenAPI spec (see `openapiSpecUrl` on
     * {@link ProvidersClient.createCustomProvider}). Scalekit sets it on create,
     * whatever you send. It comes back on {@link Provider.authPatterns}. When you
     * update a connector created from a spec, send those patterns back unchanged,
     * `is_open_api` included: patterns that differ from the stored ones are
     * rejected.
     */
    is_open_api?: boolean;
    /**
     * Credential inputs for `BEARER`, `API_KEY` and `BASIC`. Leave empty for
     * `OAUTH` and `NO_AUTH`. On a connector created from an OpenAPI spec,
     * `actions.executeTool` sends the credential only for an operation that requires
     * authentication: a non-empty `security` list without an empty `{}` alternative.
     */
    fields?: AuthField[];
    /**
     * OAuth settings for an `OAUTH` pattern. Pass `{}` to use the upstream
     * server's discovered defaults.
     */
    oauth_config?: Record<string, unknown>;
    /**
     * Header name to send an `API_KEY` credential in, when the upstream expects
     * something other than the default.
     */
    auth_header_key_override?: string;
    [key: string]: unknown;
}
/**
 * A connector, built-in or custom, as returned by {@link ProvidersClient}.
 *
 * Same fields as the API's provider, except `authPatterns` is decoded into
 * plain {@link AuthPattern} objects. The API sends it as an untyped
 * `google.protobuf.ListValue`, so the raw value cannot be passed back to
 * {@link ProvidersClient.updateCustomProvider}; this shape can, which matches
 * Python's `Provider.auth_patterns`.
 *
 * `openapiSpecUrl` is the URL of the OpenAPI spec a connector was created from,
 * and an empty string for every other connector. On such a connector `proxyUrl`
 * is the base URL its tools call. Scalekit fills it from the spec's own server
 * URL when a tool collection run reads the spec, but only while `proxyUrl` is
 * still empty and that server URL is `https://`.
 */
export type Provider = Omit<ProviderMessage, '$typeName' | 'authPatterns'> & {
    authPatterns: AuthPattern[];
};
/** Response returned by {@link ProvidersClient.createCustomProvider}. */
export interface CreateProviderResponse {
    provider?: Provider;
}
/** Response returned by {@link ProvidersClient.updateCustomProvider}. */
export interface UpdateProviderResponse {
    provider?: Provider;
}
/** Response returned by {@link ProvidersClient.listProviders}. */
export interface ListProvidersResponse {
    providers: Provider[];
    nextPageToken: string;
    prevPageToken: string;
    totalSize: number;
}
/**
 * Parameters of {@link ProvidersClient.createCustomProvider}. A connector is
 * sourced from an MCP server or from an OpenAPI spec: set exactly one of
 * `proxyUrl` and `openapiSpecUrl`.
 */
export type CreateCustomProviderParams = {
    /** Human-readable name. Letters, digits and spaces only. */
    displayName: string;
    /**
     * Ignored: a custom connector is always created with `proxyEnabled` true,
     * whatever you pass. Kept so that existing calls keep working.
     */
    proxyEnabled?: boolean;
    description?: string;
    /**
     * How users authenticate. Exactly one pattern is supported today: a longer list
     * is refused with `ScalekitValidationError` before anything is sent.
     */
    authPatterns?: AuthPattern[];
    iconSrc?: string;
    metadata?: Record<string, string>;
} & ({
    /** HTTPS URL of the upstream service: the MCP server URL for an MCP connector. */
    proxyUrl: string;
    openapiSpecUrl?: undefined;
} | {
    /**
     * HTTPS URL of an OpenAPI spec (JSON or YAML) to generate the connector's
     * tools from. Not accepted together with `proxyUrl`.
     */
    openapiSpecUrl: string;
    proxyUrl?: undefined;
});
/** Parameters of {@link ProvidersClient.updateCustomProvider}. */
export interface UpdateCustomProviderParams {
    /** From `provider.identifier` on a create or list response. */
    identifier: string;
    displayName: string;
    /**
     * Required for an MCP-sourced connector. For a connector created from an
     * OpenAPI spec this is its base URL: leave it out to keep the stored value.
     */
    proxyUrl?: string;
    /**
     * Only for a connector created from an OpenAPI spec. Sending the stored value
     * changes nothing; a different value is rejected unless your workspace has
     * that capability enabled.
     */
    openapiSpecUrl?: string;
    /** Required by the server on update, not just on create. */
    authPatterns: AuthPattern[];
    proxyEnabled?: boolean;
    description?: string;
    iconSrc?: string;
    metadata?: Record<string, string>;
}
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
 * and turn its operations into tools. Returned by
 * {@link ProvidersClient.triggerToolCollection} and
 * {@link ProvidersClient.getToolCollectionRun}.
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
 * Client for bring-your-own connectors (custom providers).
 *
 * A custom connector puts a service Scalekit does not ship in front of the same
 * machinery as a built-in one: users connect an account, you call it through
 * `actions.request`, and Scalekit injects the credentials.
 *
 * Mirrors Python's `actions.providers`, including the preview status of
 * {@link listProviders} — see that method before you depend on it.
 */
export default class ProvidersClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
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
     *   the spec is fetched. The server allows this check up to 2 minutes, while
     *   the SDK's default `timeoutMs` is 20 seconds, so raise `timeoutMs` when you
     *   create the client if your spec is slow to download.
     * - The call returns as soon as the connector is stored. The first tool
     *   collection run is queued in the background right after the connector is
     *   stored, so {@link getToolCollectionRun} can answer
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
     * @returns `provider.identifier` on the response is the id you pass to
     *          {@link updateCustomProvider}, {@link deleteCustomProvider},
     *          {@link triggerToolCollection} and {@link getToolCollectionRun}.
     * @throws {ScalekitValidationError} If `authPatterns` holds more than one
     *   pattern. No request is sent.
     * @throws {ScalekitServiceUnavailableException} If the service is unavailable.
     *   With `openapiSpecUrl` the call is not retried automatically, because the
     *   first attempt may already have stored the connector (a retry would fail
     *   with `already_exists`): look it up with {@link listProviders} before you
     *   create it again. An HTTP 429 from the edge never reached Scalekit and is retried.
     * @throws {ScalekitGatewayTimeoutException} If the call takes longer than `timeoutMs`
     *   (it is not retried). With `openapiSpecUrl` the server may still finish the
     *   create: look the connector up with {@link listProviders} before you create it
     *   again.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createCustomProvider(params: CreateCustomProviderParams): Promise<CreateProviderResponse>;
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
     *   client such as the dashboard or the REST API, or by a release of this SDK
     *   up to 2.22.0) as it is.
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
     *   trailing slash is saved as sent but triggers no re-read.
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
     *   it with {@link getToolCollectionRun}. If a run is already in progress, the
     *   new value is still saved but no run is queued, and the call fails with
     *   `ScalekitConflictException`. After a `proxyUrl` change the message is
     *   `[already_exists] base_url was saved, but an ingestion run is already in
     *   progress for this connector — call TriggerToolCollection once it completes
     *   to re-ingest against the new base_url`. Call {@link triggerToolCollection}
     *   once that run has finished.
     * - Both changes need OpenAPI-sourced connectors to be enabled for your
     *   environment, as on create.
     *
     * @param params.identifier From `provider.identifier` on a create or list response.
     * @param params.proxyUrl Required for an MCP-sourced connector. For one created
     *                        from an OpenAPI spec this is its base URL, and leaving it
     *                        out keeps the stored value.
     * @param params.openapiSpecUrl Only for a connector created from an OpenAPI spec.
     * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
     * @throws {ScalekitValidationError} If `authPatterns` holds more than one
     *   pattern: only one is supported. No request is sent.
     * @throws {ScalekitServiceUnavailableException} If the service is unavailable.
     *   With `openapiSpecUrl` the call is not retried automatically, because the
     *   first attempt may already have saved the new URL, and a repeat finds nothing
     *   to change: it queues no run and still succeeds. Read the connector back with
     *   {@link listProviders}. If its `openapiSpecUrl` is the new value, wait for any
     *   active run to finish ({@link getToolCollectionRun}) and call
     *   {@link triggerToolCollection}; otherwise send the update again. An update
     *   without `openapiSpecUrl` is retried as before, also one that changes the base
     *   URL (`proxyUrl`) of an OpenAPI-sourced connector: that change queues a run too,
     *   and a repeat after a lost answer finds nothing to change and queues none. After
     *   such an update call {@link getToolCollectionRun}, and {@link triggerToolCollection}
     *   if no new run appeared. With `openapiSpecUrl`, an HTTP 429 from the edge never reached Scalekit and is retried.
     * @throws {ScalekitGatewayTimeoutException} If the call takes longer than `timeoutMs`
     *   (it is not retried). The server may still have finished the update: check as
     *   described above before you repeat it.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    updateCustomProvider(params: UpdateCustomProviderParams): Promise<UpdateProviderResponse>;
    /**
     * Deletes a custom connector.
     *
     * Remove the connector's connections and connected accounts first; the server
     * refuses to delete one that still has connections, with the error code
     * `PROVIDER_HAS_EXISTING_CONNECTIONS` and the message
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
     * A connector created from an OpenAPI spec cannot be deleted while a tool
     * collection run of it is queued or processing: the call throws
     * `ScalekitConflictException` (`RESOURCE_ALREADY_EXISTS`) and deletes nothing.
     * Wait for the run with {@link getToolCollectionRun}, then call again until the
     * conflict stops.
     *
     * @throws {ScalekitBadRequestException} If the connector still has connections,
     *   with the error code `PROVIDER_HAS_EXISTING_CONNECTIONS`. Nothing is deleted.
     * @throws {ScalekitNotFoundException} If no custom connector has this identifier.
     * @throws {ScalekitConflictException} If the connector was created from an
     *   OpenAPI spec and a tool collection run of it is queued or processing, with the
     *   error code `RESOURCE_ALREADY_EXISTS`. The message names the run. Nothing is
     *   deleted.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    deleteCustomProvider(identifier: string): Promise<DeleteProviderResponse>;
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
     * reports `toolsCreated`, `toolsUpdated` and `toolsDeleted` as 0. If the first
     * run fills in the base URL, that counts as a change: the next run updates
     * every tool, and only the run after that reports 0.
     *
     * The server allows the spec check up to 2 minutes, while the SDK's default
     * `timeoutMs` is 20 seconds, so raise `timeoutMs` when you create the client if
     * your spec is slow to download.
     *
     * @param providerIdentifier `provider.identifier` of the connector. Whitespace around it is removed.
     * @returns The queued {@link ToolCollectionRun}.
     * @throws {ScalekitValidationError} If `providerIdentifier` is empty or blank. No request is sent.
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
     *   An HTTP 429 from the edge never reached Scalekit and is retried.
     * @throws {ScalekitGatewayTimeoutException} If the call takes longer than `timeoutMs`
     *   (it is not retried). The server may still have queued the run: check with
     *   {@link getToolCollectionRun} as above before you trigger again.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    triggerToolCollection(providerIdentifier: string): Promise<ToolCollectionRun>;
    /**
     * Fetches one tool collection run of a connector created from an OpenAPI spec:
     * its status, its counters and, once it has finished, the operations that were
     * skipped and why.
     *
     * After {@link createCustomProvider}, after {@link triggerToolCollection} and after an
     * {@link updateCustomProvider} that queued a run (a base URL or spec URL change: see its
     * rules), poll this until `status` is `COMPLETED` or `FAILED`. Any other update queues no
     * run, so this call then returns an older run, or `ScalekitNotFoundException` if there is
     * none.
     * Right after {@link createCustomProvider} the first run may not exist yet, and
     * this call can answer `ScalekitNotFoundException`: see
     * {@link createCustomProvider} for how to wait for it. After your own
     * {@link triggerToolCollection}, pass the `runId` it returned: without one you
     * get the newest run, which can be one that another caller queued.
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
     * @param providerIdentifier `provider.identifier` of the connector. Whitespace around it is removed.
     * @param runId A run's `runId`. Omit it, or pass `'latest'` (an empty or blank string means the same),
     *   for the connector's newest run. Whitespace around it is removed.
     * @returns The {@link ToolCollectionRun}.
     * @throws {ScalekitValidationError} If `providerIdentifier` is empty or blank, or `runId` is
     *   given and is not a string. No request is sent.
     * @throws {ScalekitNotFoundException} If no connector has this identifier, or
     *   the connector has no run yet, or `runId` is not one of its runs
     *   (`tool collection run not found`).
     * @throws {ScalekitBadRequestException} If `runId` is malformed (`invalid run_id`).
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    getToolCollectionRun(providerIdentifier: string, runId?: string): Promise<ToolCollectionRun>;
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
    listProviders(params?: {
        pageSize?: number;
        pageToken?: string;
        providerType?: ProviderType;
        identifier?: string;
    }): Promise<ListProvidersResponse>;
}
/**
 * Parses a run's `skippedToolsJson`. The API leaves it empty until the run has
 * finished, and the JSON text `null` can stand for "nothing skipped": an empty
 * string, `null` and `[]` all give an empty list. Text that is not a JSON array
 * also gives an empty list, rather than failing a poll over a field whose shape
 * is not settled; read `skippedToolsJson` on the run to see it. Entries that are
 * not objects are left out, and a missing field becomes an empty string.
 */
export declare function parseSkippedTools(skippedToolsJson: string): SkippedTool[];
