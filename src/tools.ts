import {
  create,
  type JsonObject,
  type MessageInitShape,
} from '@bufbuild/protobuf';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import {
  ExecuteToolResponse,
  FilterSchema,
  ListAvailableToolsRequestSchema,
  ListAvailableToolsResponse,
  ListScopedToolsRequestSchema,
  ListScopedToolsResponse,
  ListToolsRequestSchema,
  ListToolsResponse,
  ScopedToolFilterSchema,
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
   *                       Use `query` to do a text search across tool metadata (names, descriptions, identifiers).
   *                       Use `connector` together with `identifier` to resolve a specific connected account and include its custom MCP tools.
   *                       Use `connectedAccountId` as a direct alternative to the `identifier` + `connector` combination.
   * @param options.pageSize Maximum number of tools to return per page.
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
      })
    );
  }

  /**
   * Lists tools that are scoped to a specific connected account identifier.
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
      })
    );
  }

  /**
   * Lists tools that are available for a specific connected account identifier.
   *
   * This is similar to `listScopedTools` but returns the tools that can be
   * made available for a given identifier, rather than the tools that are
   * already scoped to it.
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
      })
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

    return this.coreClient.connectExec(this.client.executeTool, {
      toolName,
      ...(identifier && { identifier }),
      ...(toolParams && { params: toolParams as JsonObject }),
      ...(connectedAccountId && { connectedAccountId }),
      ...(connector && { connector }),
      ...(organizationId && { organizationId }),
      ...(userId && { userId }),
    });
  }
}
