import { PartialMessage } from "@bufbuild/protobuf";
import GrpcConnect from "./connect";
import CoreClient from "./core";
import { ExecuteToolResponse, Filter, ListScopedToolsResponse, ListToolsResponse, ScopedToolFilter } from "./pkg/grpc/scalekit/v1/tools/tools_pb";
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
     * @param options.filter Filter configuration matching the `Filter` proto message.
     *                       Use this to filter by provider, identifier, or tool names.
     * @param options.pageSize Maximum number of tools to return per page.
     * @param options.pageToken Token from a previous `listTools` response for pagination.
     */
    listTools(options?: {
        filter?: PartialMessage<Filter>;
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListToolsResponse>;
    /**
     * Lists tools that are scoped to a specific connected account identifier.
     *
     * @param identifier Connected account identifier to scope the tools list (for example,
     *                   a workspace identifier or email).
     * @param options Optional filter and pagination parameters
     * @param options.filter Filter configuration for scoped tools (providers, tool names, connection names).
     * @param options.pageSize Maximum number of tools to return per page.
     * @param options.pageToken Token from a previous `listScopedTools` response for pagination.
     */
    listScopedTools(identifier: string, options?: {
        filter?: PartialMessage<ScopedToolFilter>;
        pageSize?: number;
        pageToken?: string;
    }): Promise<ListScopedToolsResponse>;
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
