import { type MessageInitShape } from '@bufbuild/protobuf';
import GrpcConnect from './connect';
import CoreClient from './core';
import { ExecuteToolResponse, FilterSchema, ListAvailableToolsResponse, ListScopedToolsResponse, ListToolsResponse, ScopedToolFilterSchema, SearchToolsResponse } from './pkg/grpc/scalekit/v1/tools/tools_pb';
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
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Lists tools available in your workspace with optional filtering and pagination.
     *
     * @param options Optional filter and pagination parameters
     * @param options.filter Filter configuration. Supports `provider`, `identifier`, `toolName`, `summary`, `query`,
     *                       `connector`, `organizationId`, `userId`, and `connectedAccountId` fields.
     *                       Use `provider` with a connector's identifier to list the tools of a connector
     *                       created from an OpenAPI spec; no connected account is needed, because those tools belong to
     *                       the connector. A `provider` set to an unknown identifier, to a deleted connector or to a
     *                       custom connector not created from an OpenAPI spec returns an empty result, not an error.
     *                       Use `query` to search tools by name: it is split on spaces and underscores, every part must
     *                       appear in the tool name (ignoring case), and it must be 3 to 100 characters. It searches
     *                       built-in tools only, so it never returns the tools of a custom connector.
     *                       Use `connector` together with `identifier` to resolve a specific connected account and include its custom MCP tools.
     *                       A connection name on its own does not identify a connected account.
     *                       Use `connectedAccountId` as a direct alternative to the `identifier` + `connector` combination.
     *                       A `connectedAccountId`, or a `connector` with an `identifier`, that matches no connected
     *                       account fails with `ScalekitNotFoundException`.
     * @param options.pageSize Maximum number of tools to return per page. Defaults to 300 when omitted or 0. The
     *                         maximum is 1000: a larger value is reduced to 1000, not rejected. With `filter.query`,
     *                         a page holds at most 100 tools.
     * @param options.pageToken Token from a previous `listTools` response for pagination.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listTools(options?: {
        filter?: MessageInitShape<typeof FilterSchema>;
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListToolsResponse>;
    /**
     * Lists tools that are scoped to a specific connected account identifier.
     *
     * It includes the tools of a custom connector the identifier has a connected
     * account on: those of a connector created from an OpenAPI spec while
     * OpenAPI-sourced connectors are enabled for your environment, and those of a
     * connector that fronts an MCP server while custom MCP connectors are enabled.
     *
     * @param identifier Connected account identifier to scope the tools list (for example,
     *                   a workspace identifier or email).
     * @param options Filter and pagination parameters
     * @param options.filter Filter configuration for scoped tools (providers, tool names, connection names). Required.
     * @param options.pageSize Maximum number of tools to return per page.
     * @param options.pageToken Token from a previous `listScopedTools` response for pagination.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listScopedTools(identifier: string, options: {
        filter: MessageInitShape<typeof ScopedToolFilterSchema>;
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListScopedToolsResponse>;
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
    listAvailableTools(identifier: string, options?: {
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListAvailableToolsResponse>;
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
    searchTools(query: string, options?: {
        identifier?: string;
        topK?: number;
    }): Promise<SearchToolsResponse>;
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
    executeTool(params: {
        toolName: string;
        identifier?: string;
        params?: Record<string, unknown>;
        connectedAccountId?: string;
        connector?: string;
        organizationId?: string;
        userId?: string;
    }): Promise<ExecuteToolResponse>;
}
