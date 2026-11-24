import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { DeleteProviderResponse, Provider as ProviderMessage, ProviderService, ProviderType } from './pkg/grpc/scalekit/v1/providers/providers_pb';
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
    /**
     * The connector's `identifier` (`NAME:environment-id`, such as `ACMEAPI:70219645518265104`):
     * `provider.identifier` on a create or list response, not `provider.id` (`prvd_...`).
     */
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
    /**
     * @internal ActionsClient calls the RPCs that have no ProvidersClient method
     * through it. Not part of the public API.
     */
    readonly client: Client<typeof ProviderService>;
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
    updateCustomProvider(params: UpdateCustomProviderParams): Promise<UpdateProviderResponse>;
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
    deleteCustomProvider(identifier: string): Promise<DeleteProviderResponse>;
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
    listProviders(params?: {
        pageSize?: number;
        pageToken?: string;
        providerType?: ProviderType;
        identifier?: string;
    }): Promise<ListProvidersResponse>;
}
