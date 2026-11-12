import {
  create,
  type JsonObject,
  type MessageInitShape,
} from '@bufbuild/protobuf';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { ScalekitValidationError } from './errors';
import {
  DeleteCustomToolRequestSchema,
  ExecuteToolResponse,
  FilterSchema,
  ListAvailableToolsRequestSchema,
  ListAvailableToolsResponse,
  ListScopedToolsRequestSchema,
  ListScopedToolsResponse,
  ListToolsRequestSchema,
  ListToolsResponse,
  RefreshToolsRequestSchema,
  RefreshToolsResponse,
  ScopedToolFilterSchema,
  SearchToolsRequestSchema,
  SearchToolsResponse,
  ToolService,
} from './pkg/grpc/scalekit/v1/tools/tools_pb';

/**
 * Client for listing and executing tools.
 *
 * This client provides convenient helpers around the `ToolService` for:
 * - listing all tools available in your workspace
 * - listing tools scoped to a specific connected account identifier
 * - executing tools using connected account credentials
 *
 * It mirrors the capabilities of the Python SDK `ToolsClient` while following
 * the idioms and patterns used across the Node SDK.
 */
export default class ToolsClient {
  private client: Client<typeof ToolService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(ToolService);
  }

  /**
   * Lists tools available in your workspace with optional filtering and pagination.
   *
   * @param options Optional filter and pagination parameters
   * @param options.filter Filter configuration. Supports `provider`, `identifier`, `toolName`, `summary`, `query`,
   *                       `connector`, `organizationId`, `userId`, and `connectedAccountId` fields.
   *                       Use `provider` with a connector's identifier to list the tools of a connector
   *                       created from an OpenAPI spec; no connected account is needed, because those tools belong to
   *                       the connector.
   *                       Use `query` to search tools by name: it is split on spaces and underscores, every part must
   *                       appear in the tool name (ignoring case), and it must be 3 to 100 characters. It searches
   *                       built-in tools only, so it never returns the tools of a custom connector.
   *                       Use `connector` together with `identifier` to resolve a specific connected account and include its custom MCP tools.
   *                       A connection name on its own does not identify a connected account.
   *                       Use `connectedAccountId` as a direct alternative to the `identifier` + `connector` combination.
   *                       When the connector, identifier or connected account matches none, the call fails
   *                       with `ScalekitNotFoundException`.
   * @param options.pageSize Maximum number of tools to return per page. Defaults to 300 when omitted or 0. The
   *                         maximum is 1000: a larger value is reduced to 1000, not rejected. With `filter.query`,
   *                         a page holds at most 100 tools.
   * @param options.pageToken Token from a previous `listTools` response for pagination.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async listTools(options?: {
    filter?: MessageInitShape<typeof FilterSchema>;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ListToolsResponse> {
    return this.coreClient.connectExec(
      this.client.listTools,
      create(ListToolsRequestSchema, {
        ...(options?.filter && {
          filter: create(FilterSchema, options.filter),
        }),
        ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
        ...(options?.pageToken && { pageToken: options.pageToken }),
      }),
      { timeoutMs: this.coreClient.toolTimeoutMs }
    );
  }

  /**
   * Lists tools that are scoped to a specific connected account identifier.
   *
   * It includes the tools of a custom connector the identifier has a connected
   * account on: those of a connector created from an OpenAPI spec while the
   * `custom_api_tools` feature is on for your environment, and those of a
   * connector that fronts an MCP server while `custom_mcp_tools` is on.
   *
   * @param identifier Connected account identifier to scope the tools list (for example,
   *                   a workspace identifier or email).
   * @param options Filter and pagination parameters
   * @param options.filter Filter configuration for scoped tools (providers, tool names, connection names). Required.
   * @param options.pageSize Maximum number of tools to return per page.
   * @param options.pageToken Token from a previous `listScopedTools` response for pagination.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async listScopedTools(
    identifier: string,
    options: {
      filter: MessageInitShape<typeof ScopedToolFilterSchema>;
      pageSize?: number;
      pageToken?: string;
    }
  ): Promise<ListScopedToolsResponse> {
    return this.coreClient.connectExec(
      this.client.listScopedTools,
      create(ListScopedToolsRequestSchema, {
        identifier,
        filter: create(ScopedToolFilterSchema, options.filter),
        ...(options.pageSize !== undefined && { pageSize: options.pageSize }),
        ...(options.pageToken && { pageToken: options.pageToken }),
      }),
      { timeoutMs: this.coreClient.toolTimeoutMs }
    );
  }

  /**
   * Lists tools that are available for a specific connected account identifier.
   *
   * This is similar to `listScopedTools` but returns the tools that can be
   * made available for a given identifier, rather than the tools that are
   * already scoped to it. Like `listScopedTools`, it includes the tools of the
   * custom connectors the identifier has a connected account on.
   *
   * @param identifier Connected account identifier to scope the available tools list (for example,
   *                   a workspace identifier or email).
   * @param options Optional pagination parameters
   * @param options.pageSize Maximum number of tools to return per page.
   * @param options.pageToken Token from a previous `listAvailableTools` response for pagination.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async listAvailableTools(
    identifier: string,
    options?: {
      pageSize?: number;
      pageToken?: string;
    }
  ): Promise<ListAvailableToolsResponse> {
    return this.coreClient.connectExec(
      this.client.listAvailableTools,
      create(ListAvailableToolsRequestSchema, {
        identifier,
        ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
        ...(options?.pageToken && { pageToken: options.pageToken }),
      }),
      { timeoutMs: this.coreClient.toolTimeoutMs }
    );
  }

  /**
   * Re-reads the tool list of a custom MCP connector's connected account from
   * its upstream MCP server, and returns the full refreshed list.
   *
   * Call it when the upstream server has added, renamed or removed tools and the
   * list Scalekit holds for the account is out of date. Scalekit also refreshes it
   * when the account is created or re-authenticated and when its metadata is
   * updated. New and changed tools are saved, and tools the server no longer
   * lists are removed.
   *
   * It works only for a connected account of a connector that fronts an MCP server
   * (`is_mcp: true` on its auth pattern). The tools of a connector created from an
   * OpenAPI spec are refreshed with `providers.triggerToolCollection` instead.
   *
   * PREVIEW — the underlying `RefreshTools` RPC is marked preview in the API and
   * may change.
   *
   * Like `listTools`, this can fail to decode a tool whose definition nests more
   * than about 50 levels deep when `@bufbuild/protobuf` 2.12.1 or later is
   * installed: this SDK version cannot yet ask the API for definitions as JSON
   * text (`definition_format`), which needs a later proto update.
   *
   * @param params Identify the connected account with `connectedAccountId`, or
   *               with `connector` (the connection name) together with `identifier`.
   * @param params.connectedAccountId ID of the connected account (`ca_...`).
   * @param params.connector Connection name, used with `identifier`.
   * @param params.identifier Your identifier for the connected account, used with `connector`.
   * @param params.organizationId Narrows the lookup when the same identifier exists in several organizations.
   * @param params.userId Narrows the lookup when the same identifier exists for several users.
   * @returns `tools`, the account's full tool list after the refresh, and `totalSize`.
   * @throws {ScalekitNotFoundException} If no connected account matches.
   * @throws {ScalekitBadRequestException} If none of `connectedAccountId`, `connector`
   *   and `identifier` is set, if the account does not belong to a custom MCP
   *   connector (`connected account is not a custom MCP connector`), or if custom
   *   MCP tools are not enabled for your environment.
   * @throws {ScalekitTooManyRequestsException} If a refresh of the same account is
   *   already running, with the error code `DISCOVERY_IN_PROGRESS`. Retry in a few seconds.
   * @throws {ScalekitServerException} If the upstream server fails, or a network or server error occurs.
   */
  async refreshTools(params: {
    connectedAccountId?: string;
    connector?: string;
    identifier?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<RefreshToolsResponse> {
    const {
      connectedAccountId,
      connector,
      identifier,
      organizationId,
      userId,
    } = params;

    return this.coreClient.connectExec(
      this.client.refreshTools,
      create(RefreshToolsRequestSchema, {
        ...(connectedAccountId && { connectedAccountId }),
        ...(connector && { connector }),
        ...(identifier && { identifier }),
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
      }),
      { timeoutMs: this.coreClient.toolTimeoutMs }
    );
  }

  /**
   * Deletes one tool of a connector created from an OpenAPI spec, by its name.
   *
   * The tool is gone when the call returns. `toolName` is the name the tool is listed under:
   * `a-<connector name>_<operation>` in lower case, for example `a-acme_get_user`. The connector
   * name is the connector's identifier prefix in lower case without spaces (`ACMETICKETS:1234`
   * gives `acmetickets`), and the operation is the sanitised `operationId` (or the method and
   * path) and can carry a numeric suffix: list the connector's tools with
   * `listTools({ filter: { provider } })` for the exact names. Capitals in `toolName` are folded
   * to lower case (ASCII letters only), as names are stored. A name carries its connector's
   * name, so it picks the tool without `providerIdentifier`.
   *
   * Only a tool of a connector created from an OpenAPI spec, in your own environment, can be
   * deleted this way. A tool of a connector that fronts an MCP server, a built-in tool, another
   * environment's tool, a tool whose connector no longer exists and a name that matches nothing
   * all fail the same way, with `ScalekitNotFoundException`; the message does not say which.
   *
   * The deletion is not permanent. A full sync of the connector creates the tool again (same
   * name, new ID) while its operation is still in the spec, for example after the spec's content
   * or the connector's base URL has changed; a sync that is skipped because nothing changed does
   * not. If you control the spec, take the operation out of it to remove the tool for good: the
   * next sync then removes it. While a sync of the connector is queued or running, the call fails
   * with `ScalekitConflictException`, because that sync could create the tool again: wait for
   * the run with `actions.providers.getToolCollectionRun`, then call again. Without a `runId`
   * that call usually shows the run that blocks this one, but not always: the server blocks on
   * any run that has not finished, and an older unfinished run can sit behind a newer finished
   * one. The `ScalekitConflictException` is what counts, so call again until it stops. A run
   * that makes no progress for about 30 minutes is failed automatically.
   *
   * A Virtual MCP configuration that lists the tool is not edited, and it serves nothing for that
   * name. If the connection lists other tools too, reading the configuration returns only those,
   * and saving it back works. If the deleted tool was the only tool listed for the connection,
   * reading the configuration still returns its name, and saving it fails with
   * `ScalekitBadRequestException` until you set the connection's tools to tools that still exist
   * (`actions.mcp.updateConfig`) or remove the connection from the configuration.
   *
   * Like most of the SDK's calls, this one is retried when the service is unavailable
   * (`triggerToolCollection` is the exception: a repeat of it queues a second run). Each attempt
   * has its own tool-call deadline (`toolTimeoutMs`). If the first attempt had already deleted
   * the tool and only its response was lost, the retry answers `ScalekitNotFoundException`, or
   * `ScalekitConflictException` if a sync was queued in between, although the tool was deleted.
   * To tell, list the connector's tools.
   *
   * @param params.toolName Name of the tool. Surrounding whitespace is ignored. At most 2048
   *   characters.
   * @param params.providerIdentifier `provider.identifier` of the connector that owns the tool,
   *   matched exactly (case included). Leave it out unless a call answered `TOOL_NAME_AMBIGUOUS`.
   *   Surrounding whitespace is ignored; a blank value is an error. At most 512 characters.
   * @returns Resolves once the tool is deleted.
   * @throws {ScalekitValidationError} If `toolName` is empty or blank, or if `providerIdentifier`
   *   is given and is not a string or is blank. No request is sent.
   * @throws {ScalekitBadRequestException} If `toolName` is longer than 2048 characters or
   *   `providerIdentifier` longer than 512, if either has a control character other than
   *   surrounding whitespace (the SDK trims that), or if OpenAPI-sourced connectors are not
   *   enabled for your environment (error code `FEATURE_NOT_ENABLED`).
   * @throws {ScalekitNotFoundException} If no deletable tool has this name, or none of that name
   *   belongs to `providerIdentifier` (`custom tool not found`).
   * @throws {ScalekitConflictException} If a sync of the connector is queued or running (error
   *   code `RESOURCE_ALREADY_EXISTS`): nothing is deleted, so call again once it has finished.
   *   Also, with the error code `TOOL_NAME_AMBIGUOUS`, if tools of more than one connector of
   *   your environment have this name (leftovers of an earlier connector): nothing is deleted,
   *   and the message names two of the connectors. Repeat the call with `providerIdentifier`
   *   set to the OpenAPI-sourced connector whose tool you mean. A leftover tool of a connector
   *   that no longer exists, or that is not OpenAPI-sourced, answers
   *   `ScalekitNotFoundException` once `providerIdentifier` names that connector, and cannot be
   *   deleted through this API.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async deleteCustomTool(params: {
    toolName: string;
    providerIdentifier?: string;
  }): Promise<void> {
    const toolName =
      typeof params?.toolName === 'string' ? params.toolName.trim() : '';
    if (!toolName) {
      throw new ScalekitValidationError('toolName is required');
    }
    // Not given (undefined or null) is fine. A value that is given must name a connector: a blank
    // one is refused here instead of being dropped, because the server would answer 404 for it,
    // and dropping it would turn that into a delete by name alone.
    const rawProviderIdentifier: unknown = params.providerIdentifier;
    let providerIdentifier: string | undefined;
    if (rawProviderIdentifier !== undefined && rawProviderIdentifier !== null) {
      if (typeof rawProviderIdentifier !== 'string') {
        throw new ScalekitValidationError(
          'providerIdentifier must be a string'
        );
      }
      providerIdentifier = rawProviderIdentifier.trim();
      if (!providerIdentifier) {
        throw new ScalekitValidationError(
          'providerIdentifier must not be blank'
        );
      }
    }

    // Replayed after `Unavailable` like most calls. Deleting by name changes nothing the second
    // time (the replay answers NotFound if the first attempt had already deleted the tool), so
    // unlike `providers.triggerToolCollection` it does not need to be kept from `connectExec`'s
    // retry.
    await this.coreClient.connectExec(
      this.client.deleteCustomTool,
      create(DeleteCustomToolRequestSchema, {
        toolName,
        ...(providerIdentifier && { providerIdentifier }),
      }),
      { timeoutMs: this.coreClient.toolTimeoutMs }
    );
  }

  /**
   * Searches tools ranked by relevance to a natural-language query — the job to be
   * done, not an exact tool name.
   *
   * Each result's `score` is a relevance score where higher is better; it is only
   * comparable within the results of a single response, not across separate calls.
   *
   * Pass `identifier` to also get per-connection readiness (usable now, needs a new
   * connection, or needs re-auth) on each result's `connections`. `connections` is
   * populated only when `identifier` is set: an empty array means the identifier has
   * no connection at all for that tool's provider (not an error, and different from
   * `NEEDS_CONNECTION`, which means a connected-account row exists but is inactive);
   * more than one entry means the identifier has accounts on multiple connections for
   * that provider (for example, two Slack workspaces) — inspect each entry's own
   * `readinessState` rather than assuming one answer for the whole tool.
   *
   * @param query Natural-language query or keywords describing the job to be done. 1-256 characters.
   * @param options Optional parameters
   * @param options.identifier Connected-account identifier (for example, email or workspace ID).
   *                            When set, each result is annotated with readiness for this identifier's connections.
   * @param options.topK Maximum number of ranked results to return. Defaults to 10, capped at 50.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async searchTools(
    query: string,
    options?: {
      identifier?: string;
      topK?: number;
    }
  ): Promise<SearchToolsResponse> {
    return this.coreClient.connectExec(
      this.client.searchTools,
      create(SearchToolsRequestSchema, {
        query,
        ...(options?.identifier && { identifier: options.identifier }),
        ...(options?.topK !== undefined && { topK: options.topK }),
      }),
      { timeoutMs: this.coreClient.toolTimeoutMs }
    );
  }

  /**
   * Executes a tool using credentials from a connected account.
   *
   * You can either:
   * - reference the connected account directly via `connectedAccountId`, or
   * - identify it using a combination of `identifier`, `connector`, `organizationId`, and `userId`.
   *
   * @param params Execution configuration
   * @param params.toolName Name of the tool to execute.
   * @param params.identifier Optional connected account identifier (for example, email or workspace ID).
   * @param params.params JSON parameters required by the tool. These will be sent as a structured payload.
   * @param params.connectedAccountId Optional direct ID of the connected account (`ca_...`).
   * @param params.connector Optional connector/provider name when using identifier-based lookup.
   * @param params.organizationId Optional organization ID to scope the connected account lookup.
   * @param params.userId Optional user ID to scope the connected account lookup.
   * @throws {ScalekitServerException} If a network or server error occurs.
   */
  async executeTool(params: {
    toolName: string;
    identifier?: string;
    params?: Record<string, unknown>;
    connectedAccountId?: string;
    connector?: string;
    organizationId?: string;
    userId?: string;
  }): Promise<ExecuteToolResponse> {
    const {
      toolName,
      identifier,
      params: toolParams,
      connectedAccountId,
      connector,
      organizationId,
      userId,
    } = params;

    return this.coreClient.connectExec(
      this.client.executeTool,
      {
        toolName,
        ...(identifier && { identifier }),
        ...(toolParams && { params: toolParams as JsonObject }),
        ...(connectedAccountId && { connectedAccountId }),
        ...(connector && { connector }),
        ...(organizationId && { organizationId }),
        ...(userId && { userId }),
      },
      { timeoutMs: this.coreClient.toolTimeoutMs }
    );
  }
}
