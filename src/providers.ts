import { create, fromJson, type JsonValue } from '@bufbuild/protobuf';
import { ListValueSchema } from '@bufbuild/protobuf/wkt';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import {
  CreateCustomProviderRequestSchema,
  CreateCustomProviderSchema,
  CreateProviderResponse,
  DeleteProviderRequestSchema,
  DeleteProviderResponse,
  ListProvidersRequestSchema,
  ListProvidersRequest_FilterSchema,
  ListProvidersResponse,
  ProviderService,
  ProviderType,
  UpdateCustomProviderRequestSchema,
  UpdateCustomProviderSchema,
  UpdateProviderResponse,
} from './pkg/grpc/scalekit/v1/providers/providers_pb';

/**
 * One credential input shown to the user while they connect.
 *
 * Only used with `bearer` and `api_key` patterns — an OAuth flow collects its own
 * credentials, so never attach fields to an `oauth` pattern.
 */
export interface AuthField {
  /**
   * Machine-readable key the credential is stored under. Use `token` or
   * `bearer_token` for bearer patterns, `api_key` for API-key patterns.
   */
  field_name: string;
  /** Label shown above the input. */
  label?: string;
  /** Use `password` for anything secret so the UI masks it. Defaults to `text`. */
  input_type?: 'text' | 'password';
  /** Placeholder or helper text below the input. */
  hint?: string;
  /** Whether the user must fill this in before the connection can be saved. */
  required?: boolean;
}

/**
 * One way a user can authenticate against your connector.
 *
 * Passed through to the API as-is, so the keys are snake_case to match the wire
 * format rather than the camelCase used elsewhere in this SDK.
 */
export interface AuthPattern {
  auth_type: 'oauth' | 'bearer' | 'api_key' | string;
  /** Required for `bearer` and `api_key`. Leave unset for `oauth`. */
  fields?: AuthField[];
  [key: string]: unknown;
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

    return this.coreClient.connectExec(
      this.client.createCustomProvider,
      create(CreateCustomProviderRequestSchema, { provider })
    );
  }

  /**
   * Updates a custom connector.
   *
   * `displayName`, `proxyUrl` and `authPatterns` are all required by the server on
   * every update, even when unchanged — omitting `authPatterns` fails with
   * `[invalid_argument] Validation error`. Read the current connector with
   * {@link listProviders} first and echo them back. `authPatterns` replaces the
   * whole list rather than merging into it.
   *
   * @param params.identifier From `provider.identifier` on a create or list response.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async updateCustomProvider(params: {
    identifier: string;
    displayName: string;
    proxyUrl: string;
    /** Required by the server on update, not just on create. */
    authPatterns: AuthPattern[];
    description?: string;
    iconSrc?: string;
    metadata?: Record<string, string>;
  }): Promise<UpdateProviderResponse> {
    const provider = create(UpdateCustomProviderSchema, {
      displayName: params.displayName,
      proxyUrl: params.proxyUrl,
      ...(params.description !== undefined && {
        description: params.description,
      }),
      ...(params.iconSrc !== undefined && { iconSrc: params.iconSrc }),
      ...(params.metadata && { metadata: params.metadata }),
      authPatterns: toListValue(params.authPatterns),
    });

    return this.coreClient.connectExec(
      this.client.updateCustomProvider,
      create(UpdateCustomProviderRequestSchema, {
        identifier: params.identifier,
        provider,
      })
    );
  }

  /**
   * Deletes a custom connector.
   *
   * Remove the connector's connections and connected accounts first; the server
   * refuses to delete one that is still in use.
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
   *                            connectors, `ProviderType.DEFAULT` for built-ins.
   *                            Omit for all.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async listProviders(params?: {
    pageSize?: number;
    pageToken?: string;
    providerType?: ProviderType;
    identifier?: string;
  }): Promise<ListProvidersResponse> {
    return this.coreClient.connectExec(
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
  }
}

/**
 * Auth patterns cross the wire as a `google.protobuf.ListValue` of arbitrary JSON,
 * so they are parsed from plain objects rather than built from a generated message
 * type. Python does the same thing via `ParseDict`.
 */
function toListValue(patterns: AuthPattern[]) {
  return fromJson(ListValueSchema, patterns as JsonValue[]);
}
