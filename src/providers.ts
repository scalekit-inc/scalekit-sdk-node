import { create, fromJson, toJson, type JsonValue } from '@bufbuild/protobuf';
import { ListValueSchema, type ListValue } from '@bufbuild/protobuf/wkt';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import {
  CreateCustomProviderRequestSchema,
  CreateCustomProviderSchema,
  DeleteProviderRequestSchema,
  DeleteProviderResponse,
  ListProvidersRequestSchema,
  ListProvidersRequest_FilterSchema,
  Provider as ProviderMessage,
  ProviderService,
  ProviderType,
  UpdateCustomProviderRequestSchema,
  UpdateCustomProviderSchema,
} from './pkg/grpc/scalekit/v1/providers/providers_pb';

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
  private client: Client<typeof ProviderService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(ProviderService);
  }

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
  async createCustomProvider(params: {
    displayName: string;
    proxyUrl: string;
    proxyEnabled?: boolean;
    description?: string;
    authPatterns?: AuthPattern[];
    iconSrc?: string;
    metadata?: Record<string, string>;
  }): Promise<CreateProviderResponse> {
    const provider = create(CreateCustomProviderSchema, {
      displayName: params.displayName,
      description: params.description ?? '',
      proxyUrl: params.proxyUrl,
      proxyEnabled: params.proxyEnabled ?? true,
      ...(params.iconSrc !== undefined && { iconSrc: params.iconSrc }),
      ...(params.metadata && { metadata: params.metadata }),
      ...(params.authPatterns && {
        authPatterns: toListValue(params.authPatterns),
      }),
    });

    const response = await this.coreClient.connectExec(
      this.client.createCustomProvider,
      create(CreateCustomProviderRequestSchema, { provider })
    );
    return { provider: toProvider(response.provider) };
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
   * - `displayName`, `proxyUrl` and `authPatterns` are required on every update.
   *   Omitting `authPatterns` fails with `[invalid_argument] Validation error`, and
   *   it replaces the whole list rather than merging into it. The pattern's
   *   `type` and `is_mcp` cannot be changed.
   * - `metadata` replaces the stored map, so leaving it out clears it.
   * - `proxyEnabled` is always applied. It defaults to `true` here, so pass the
   *   current value to keep a connector's proxying switched off.
   * - `description` and `iconSrc` keep their stored values when left out.
   *
   * @param params.identifier From `provider.identifier` on a create or list response.
   * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async updateCustomProvider(params: {
    identifier: string;
    displayName: string;
    proxyUrl: string;
    /** Required by the server on update, not just on create. */
    authPatterns: AuthPattern[];
    proxyEnabled?: boolean;
    description?: string;
    iconSrc?: string;
    metadata?: Record<string, string>;
  }): Promise<UpdateProviderResponse> {
    const provider = create(UpdateCustomProviderSchema, {
      displayName: params.displayName,
      proxyUrl: params.proxyUrl,
      // Always sent: the server applies proxy_enabled on every update, so an
      // unset field would switch proxying off.
      proxyEnabled: params.proxyEnabled ?? true,
      ...(params.description !== undefined && {
        description: params.description,
      }),
      ...(params.iconSrc !== undefined && { iconSrc: params.iconSrc }),
      ...(params.metadata && { metadata: params.metadata }),
      authPatterns: toListValue(params.authPatterns),
    });

    const response = await this.coreClient.connectExec(
      this.client.updateCustomProvider,
      create(UpdateCustomProviderRequestSchema, {
        identifier: params.identifier,
        provider,
      })
    );
    return { provider: toProvider(response.provider) };
  }

  /**
   * Deletes a custom connector.
   *
   * Remove the connector's connections and connected accounts first; the server
   * refuses to delete one that is still in use, with
   * `[invalid_argument] cannot delete custom provider with existing connections`.
   *
   * Connected accounts come off with `actions.deleteConnectedAccount`. The app
   * connection itself has to go from the Scalekit dashboard: this SDK wraps no
   * delete for an environment-scoped connection, and `connection.deleteConnection`
   * takes an `organizationId`, which an app connection does not have.
   *
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async deleteCustomProvider(
    identifier: string
  ): Promise<DeleteProviderResponse> {
    return this.coreClient.connectExec(
      this.client.deleteCustomProvider,
      create(DeleteProviderRequestSchema, { identifier })
    );
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
  async listProviders(params?: {
    pageSize?: number;
    pageToken?: string;
    providerType?: ProviderType;
    identifier?: string;
  }): Promise<ListProvidersResponse> {
    const response = await this.coreClient.connectExec(
      this.client.listProviders,
      create(ListProvidersRequestSchema, {
        identifier: params?.identifier ?? '',
        pageSize: params?.pageSize ?? 0,
        pageToken: params?.pageToken ?? '',
        ...(params?.providerType !== undefined && {
          filter: create(ListProvidersRequest_FilterSchema, {
            providerType: params.providerType,
          }),
        }),
      })
    );
    return {
      providers: response.providers.map((p) => toProvider(p)!),
      nextPageToken: response.nextPageToken,
      prevPageToken: response.prevPageToken,
      totalSize: response.totalSize,
    };
  }
}

/**
 * Auth patterns cross the wire as a `google.protobuf.ListValue` of arbitrary JSON,
 * so they are parsed from plain objects rather than built from a generated message
 * type. Python does the same thing via `ParseDict`.
 *
 * Keys set to `undefined` are dropped first, as `JSON.stringify` would drop them:
 * `fromJson` rejects `undefined` with an error that does not name the field, and
 * `{ description: opts.description }` is an easy way to produce one.
 */
function toListValue(patterns: AuthPattern[]) {
  return fromJson(ListValueSchema, stripUndefined(patterns) as JsonValue[]);
}

function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)])
    );
  }
  return value;
}

/**
 * Decodes a provider's `authPatterns` from `ListValue` into plain objects, the
 * reverse of {@link toListValue}. Python does the same via `MessageToDict`.
 */
function toProvider(
  message: ProviderMessage | undefined
): Provider | undefined {
  if (!message) return undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { $typeName, authPatterns, ...fields } = message;
  return { ...fields, authPatterns: fromListValue(authPatterns) };
}

function fromListValue(value: ListValue | undefined): AuthPattern[] {
  return value ? (toJson(ListValueSchema, value) as AuthPattern[]) : [];
}
