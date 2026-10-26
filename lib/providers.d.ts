import GrpcConnect from './connect';
import CoreClient from './core';
import { DeleteProviderResponse, Provider as ProviderMessage, ProviderType } from './pkg/grpc/scalekit/v1/providers/providers_pb';
/** One selectable choice on an {@link AuthField} whose `input_type` is `select`. */
export interface AuthFieldOption {
    /** Value stored when this choice is selected. */
    value: string;
    /** Label shown in the dropdown. */
    display_name?: string;
    /** Longer explanation shown as helper text. */
    description?: string;
    /** Whether this choice is pre-selected. At most one option is the default. */
    default?: boolean;
}
/**
 * One credential input shown to the user while they connect.
 *
 * Used with `BEARER`, `API_KEY` and `BASIC` patterns. An `OAUTH` flow collects
 * its own credentials, and `NO_AUTH` takes none, so leave `fields` empty for those.
 */
export interface AuthField {
    /**
     * Key the credential is stored under. Use `token` for bearer patterns and
     * `api_key` for API-key patterns.
     */
    field_name: string;
    /** Label shown above the input. */
    label?: string;
    /** Use `password` for anything secret so the UI masks it. */
    input_type?: 'text' | 'password' | 'select' | 'textarea' | (string & {});
    /** Helper text shown with the input. */
    hint?: string;
    /** Whether the user must fill this in before the connection can be saved. */
    required?: boolean;
    /** Choices for a `select` field. Leave empty for every other input type. */
    options?: AuthFieldOption[];
    /**
     * `true` when the value goes into the request path, for connectors whose base
     * URL embeds a tenant or region, instead of being sent as a credential.
     */
    is_path_param?: boolean;
    /**
     * On an `API_KEY` pattern, sends this field's value as this exact HTTP header.
     * Setting it on any field puts the pattern in multiple-headers mode; leave it
     * unset to use the pattern's `auth_header_key_override` (single-key mode).
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
    /** Authentication method. */
    type: 'OAUTH' | 'BEARER' | 'API_KEY' | 'BASIC' | 'NO_AUTH' | (string & {});
    /** Name of this method, shown to the user while they connect. */
    display_name: string;
    /** Short explanation of this method, shown to the user. */
    description?: string;
    /**
     * `true` makes this an MCP connector; the default makes it an API connector.
     *
     * @deprecated Pass `isMcp` to `createCustomProvider` or `updateCustomProvider`
     * instead. This still works and is still sent to the server.
     */
    is_mcp?: boolean;
    /**
     * Credential inputs for `BEARER`, `API_KEY` and `BASIC`. Leave empty for
     * `OAUTH` and `NO_AUTH`.
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
     * Creating a connector whose name normalizes the same as an existing one does
     * not fail: it gets a numbered identifier. Only two creates racing on the same
     * name fail with a conflict; retry.
     *
     * A request that fails validation (a missing `authPatterns`, a `displayName`
     * with a symbol, an `http://` `proxyUrl`) throws a `ScalekitBadRequestException`
     * whose message is only `[invalid_argument] Validation error`. The field and the
     * reason are on the error:
     * `error.unpackedDetails[0].validationErrorInfo.fieldViolations`, where each
     * entry has a `field` (for example `provider.proxy_url`) and a `description`.
     *
     * @param params.displayName Name shown in the UI. Letters, digits and spaces only
     *                           (max 200 characters); symbols such as `_` or `-` are
     *                           rejected. The identifier is derived from it
     *                           (`Acme MCP` becomes `ACMEMCP:<environment id>`). The
     *                           names of the built-in login providers (Github, Google,
     *                           Gitlab, Microsoft, LinkedIn, Salesforce, Facebook) are
     *                           rejected; other built-in names such as Gmail are
     *                           accepted. Suffix it with "MCP" when the connector
     *                           fronts an MCP server.
     * @param params.proxyUrl HTTPS URL of the external service, and the address
     *                        Scalekit sends proxied requests to. For an MCP connector
     *                        it is the MCP server's URL; for an API connector it is
     *                        the API's base URL.
     * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
     * @param params.authPatterns How users authenticate. Required in practice:
     *                            leaving it out fails with a validation error on
     *                            `provider.auth_patterns`, and an empty array fails
     *                            with `auth patterns cannot be empty`. Exactly one
     *                            pattern is supported today; the array is for future use.
     * @param params.isMcp `true` creates an MCP connector; otherwise it is an API
     *                     connector. Use it instead of the deprecated `is_mcp` on
     *                     the pattern. A value that conflicts with the pattern's
     *                     `is_mcp` throws.
     * @returns `provider.identifier` on the response is the id you pass to
     *          {@link updateCustomProvider} and {@link deleteCustomProvider}, and the
     *          `providerKey` when you create a connection for this connector.
     * @throws {Error} If `isMcp` conflicts with `is_mcp` on a pattern.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createCustomProvider(params: {
        displayName: string;
        proxyUrl: string;
        proxyEnabled?: boolean;
        description?: string;
        authPatterns?: AuthPattern[];
        isMcp?: boolean;
        iconSrc?: string;
        metadata?: Record<string, string>;
    }): Promise<CreateProviderResponse>;
    /**
     * Updates a custom connector.
     *
     * Treat this as a PUT: read the current connector with {@link listProviders}
     * first, then send back every field you want to keep alongside the ones you
     * are changing. `provider.authPatterns` from that response can be passed here
     * as-is.
     *
     * What the server does with each field:
     * - `displayName`, `proxyUrl` and `authPatterns` are required on every update.
     *   Omitting `authPatterns` fails with `[invalid_argument] Validation error`, and
     *   it replaces the whole list rather than merging into it. The pattern's
     *   `type` and `is_mcp` cannot be changed, and an `API_KEY` pattern cannot
     *   switch between single-key and multiple-headers mode. Editing the header
     *   fields of a multiple-headers connector means its connected accounts must
     *   re-authorize.
     * - `metadata` replaces the stored map, so leaving it out clears it.
     * - `description` and `iconSrc` keep their stored values when left out. An empty
     *   string does not clear them: the server ignores empty values.
     *
     * @param params.identifier From `provider.identifier` on a create or list response.
     * @param params.isMcp Must match the connector's existing kind: the server
     *                     rejects changing it between MCP and API. Pass `true` when
     *                     updating an MCP connector so the pattern stays MCP. Use it
     *                     instead of the deprecated `is_mcp` on the pattern; a value
     *                     that conflicts with the pattern's `is_mcp` throws.
     * @throws {Error} If `isMcp` conflicts with `is_mcp` on a pattern.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    updateCustomProvider(params: {
        identifier: string;
        displayName: string;
        proxyUrl: string;
        /** Required by the server on update, not just on create. */
        authPatterns: AuthPattern[];
        isMcp?: boolean;
        description?: string;
        iconSrc?: string;
        metadata?: Record<string, string>;
    }): Promise<UpdateProviderResponse>;
    /**
     * Deletes a custom connector.
     *
     * Remove the connector's connections and connected accounts first; the server
     * refuses to delete one that is still in use, with
     * `[invalid_argument] cannot delete custom provider with existing connections`.
     * A connection that still has connected accounts cannot be deleted either
     * (`[invalid_argument] connection has connected accounts, cannot be deleted`),
     * so remove the accounts first, then the connections. Deleting also removes the connector's discovered custom MCP tools.
     *
     * Connected accounts come off with `actions.deleteConnectedAccount`. The app
     * connection itself has to go from the Scalekit dashboard: this SDK wraps no
     * delete for an environment-scoped connection, and `connection.deleteConnection`
     * takes an `organizationId`, which an app connection does not have.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    deleteCustomProvider(identifier: string): Promise<DeleteProviderResponse>;
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
