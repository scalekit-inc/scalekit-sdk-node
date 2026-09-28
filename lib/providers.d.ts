import GrpcConnect from './connect';
import CoreClient from './core';
import { DeleteProviderResponse, Provider as ProviderMessage, ProviderType } from './pkg/grpc/scalekit/v1/providers/providers_pb';
/**
 * One credential input shown to the user while they connect.
 *
 * Used with `BEARER`, `API_KEY` and `BASIC` patterns. An `OAUTH` flow collects
 * its own credentials, and `NO_AUTH` takes none, so leave `fields` empty for those.
 */
export interface AuthField {
    /**
     * Key the credential is stored under. Use `token` for bearer patterns and
     * `api_key` for API-key patterns; pass the same key in `staticAuth` details
     * when you connect an account programmatically.
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
    /** Set to `true` when the connector fronts an MCP server. */
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
     * @param params.displayName Human-readable name. Letters, digits and spaces only.
     *                           Suffix it with "MCP" when the connector fronts an MCP server.
     * @param params.proxyUrl Base HTTPS URL of the upstream service.
     * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
     * @param params.authPatterns How users authenticate. Exactly one pattern is
     *                            supported today; the array is for future use.
     * @returns `provider.identifier` on the response is the id you pass to
     *          {@link updateCustomProvider} and {@link deleteCustomProvider}.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createCustomProvider(params: {
        displayName: string;
        proxyUrl: string;
        proxyEnabled?: boolean;
        description?: string;
        authPatterns?: AuthPattern[];
        iconSrc?: string;
        metadata?: Record<string, string>;
    }): Promise<CreateProviderResponse>;
    /**
     * Updates a custom connector.
     *
     * `displayName`, `proxyUrl` and `authPatterns` are all required by the server on
     * every update, even when unchanged — omitting `authPatterns` fails with
     * `[invalid_argument] Validation error`. Read the current connector with
     * {@link listProviders} first and send its values back; `provider.authPatterns`
     * from that response can be passed here as-is. `authPatterns` replaces the
     * whole list rather than merging into it.
     *
     * @param params.identifier From `provider.identifier` on a create or list response.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    updateCustomProvider(params: {
        identifier: string;
        displayName: string;
        proxyUrl: string;
        /** Required by the server on update, not just on create. */
        authPatterns: AuthPattern[];
        description?: string;
        iconSrc?: string;
        metadata?: Record<string, string>;
    }): Promise<UpdateProviderResponse>;
    /**
     * Deletes a custom connector.
     *
     * Remove the connector's connections and connected accounts first; the server
     * refuses to delete one that is still in use.
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
