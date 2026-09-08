import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/tools/tools.proto.
 */
export declare const file_scalekit_v1_tools_tools: GenFile;
/**
 * @generated from message scalekit.v1.tools.CreateToolRequest
 */
export type CreateToolRequest = Message<"scalekit.v1.tools.CreateToolRequest"> & {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool | undefined;
};
/**
 * Describes the message scalekit.v1.tools.CreateToolRequest.
 * Use `create(CreateToolRequestSchema)` to create a new message.
 */
export declare const CreateToolRequestSchema: GenMessage<CreateToolRequest>;
/**
 * @generated from message scalekit.v1.tools.CreateToolResponse
 */
export type CreateToolResponse = Message<"scalekit.v1.tools.CreateToolResponse"> & {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool | undefined;
};
/**
 * Describes the message scalekit.v1.tools.CreateToolResponse.
 * Use `create(CreateToolResponseSchema)` to create a new message.
 */
export declare const CreateToolResponseSchema: GenMessage<CreateToolResponse>;
/**
 * @generated from message scalekit.v1.tools.Tool
 */
export type Tool = Message<"scalekit.v1.tools.Tool"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string provider = 2;
     */
    provider: string;
    /**
     * @generated from field: google.protobuf.Struct definition = 3;
     */
    definition?: JsonObject | undefined;
    /**
     * @generated from field: google.protobuf.Struct metadata = 4;
     */
    metadata?: JsonObject | undefined;
    /**
     * @generated from field: repeated string tags = 5;
     */
    tags: string[];
    /**
     * @generated from field: google.protobuf.BoolValue is_default = 6;
     */
    isDefault?: boolean | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 7;
     */
    updatedAt?: Timestamp | undefined;
};
/**
 * Describes the message scalekit.v1.tools.Tool.
 * Use `create(ToolSchema)` to create a new message.
 */
export declare const ToolSchema: GenMessage<Tool>;
/**
 * @generated from message scalekit.v1.tools.ScopedTool
 */
export type ScopedTool = Message<"scalekit.v1.tools.ScopedTool"> & {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool | undefined;
    /**
     * @generated from field: string identifier = 2;
     */
    identifier: string;
    /**
     * @generated from field: string connected_account_id = 3;
     */
    connectedAccountId: string;
};
/**
 * Describes the message scalekit.v1.tools.ScopedTool.
 * Use `create(ScopedToolSchema)` to create a new message.
 */
export declare const ScopedToolSchema: GenMessage<ScopedTool>;
/**
 * @generated from message scalekit.v1.tools.ListToolsRequest
 */
export type ListToolsRequest = Message<"scalekit.v1.tools.ListToolsRequest"> & {
    /**
     * @generated from field: scalekit.v1.tools.Filter filter = 1;
     */
    filter?: Filter | undefined;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.tools.ListToolsRequest.
 * Use `create(ListToolsRequestSchema)` to create a new message.
 */
export declare const ListToolsRequestSchema: GenMessage<ListToolsRequest>;
/**
 * @generated from message scalekit.v1.tools.Filter
 */
export type Filter = Message<"scalekit.v1.tools.Filter"> & {
    /**
     * @generated from field: google.protobuf.BoolValue summary = 1;
     */
    summary?: boolean | undefined;
    /**
     * @generated from field: string provider = 2;
     */
    provider: string;
    /**
     * @generated from field: string identifier = 3;
     */
    identifier: string;
    /**
     * @generated from field: repeated string tool_name = 4;
     */
    toolName: string[];
    /**
     * @generated from field: optional string query = 5;
     */
    query?: string | undefined;
    /**
     * Fields 6-9 mirror GetConnectedAccountByIdentifierRequest, enabling ListTools to
     * resolve a specific connected account and include its custom MCP tools alongside
     * global tools. When connector or connected_account_id is set, a CA lookup is performed.
     *
     * @generated from field: optional string connector = 6;
     */
    connector?: string | undefined;
    /**
     * @generated from field: optional string organization_id = 7;
     */
    organizationId?: string | undefined;
    /**
     * @generated from field: optional string user_id = 8;
     */
    userId?: string | undefined;
    /**
     * @generated from field: optional string connected_account_id = 9;
     */
    connectedAccountId?: string | undefined;
};
/**
 * Describes the message scalekit.v1.tools.Filter.
 * Use `create(FilterSchema)` to create a new message.
 */
export declare const FilterSchema: GenMessage<Filter>;
/**
 * @generated from message scalekit.v1.tools.ListToolsResponse
 */
export type ListToolsResponse = Message<"scalekit.v1.tools.ListToolsResponse"> & {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
    /**
     * @generated from field: repeated string tool_names = 4;
     */
    toolNames: string[];
    /**
     * @generated from field: repeated scalekit.v1.tools.Tool tools = 5;
     */
    tools: Tool[];
};
/**
 * Describes the message scalekit.v1.tools.ListToolsResponse.
 * Use `create(ListToolsResponseSchema)` to create a new message.
 */
export declare const ListToolsResponseSchema: GenMessage<ListToolsResponse>;
/**
 * @generated from message scalekit.v1.tools.ExecuteToolRequest
 */
export type ExecuteToolRequest = Message<"scalekit.v1.tools.ExecuteToolRequest"> & {
    /**
     * @generated from field: string tool_name = 1;
     */
    toolName: string;
    /**
     * @generated from field: optional string identifier = 2;
     */
    identifier?: string | undefined;
    /**
     * @generated from field: google.protobuf.Struct params = 3;
     */
    params?: JsonObject | undefined;
    /**
     * @generated from field: optional string connected_account_id = 4;
     */
    connectedAccountId?: string | undefined;
    /**
     * @generated from field: optional string connector = 5;
     */
    connector?: string | undefined;
    /**
     * @generated from field: optional string organization_id = 6;
     */
    organizationId?: string | undefined;
    /**
     * @generated from field: optional string user_id = 7;
     */
    userId?: string | undefined;
    /**
     * @generated from field: optional string agent_run_id = 8;
     */
    agentRunId?: string | undefined;
};
/**
 * Describes the message scalekit.v1.tools.ExecuteToolRequest.
 * Use `create(ExecuteToolRequestSchema)` to create a new message.
 */
export declare const ExecuteToolRequestSchema: GenMessage<ExecuteToolRequest>;
/**
 * @generated from message scalekit.v1.tools.ExecuteToolResponse
 */
export type ExecuteToolResponse = Message<"scalekit.v1.tools.ExecuteToolResponse"> & {
    /**
     * @generated from field: google.protobuf.Struct data = 1;
     */
    data?: JsonObject | undefined;
    /**
     * @generated from field: string execution_id = 2;
     */
    executionId: string;
};
/**
 * Describes the message scalekit.v1.tools.ExecuteToolResponse.
 * Use `create(ExecuteToolResponseSchema)` to create a new message.
 */
export declare const ExecuteToolResponseSchema: GenMessage<ExecuteToolResponse>;
/**
 * RefreshToolsRequest identifies a single connected account whose tool cache should be
 * resynced. The fields mirror ExecuteToolRequest: supply connected_account_id to identify
 * the account directly, or connector together with identifier (optionally scoped by
 * organization_id / user_id when the same identifier exists across orgs or users).
 *
 * @generated from message scalekit.v1.tools.RefreshToolsRequest
 */
export type RefreshToolsRequest = Message<"scalekit.v1.tools.RefreshToolsRequest"> & {
    /**
     * @generated from field: optional string identifier = 1;
     */
    identifier?: string | undefined;
    /**
     * @generated from field: optional string connected_account_id = 2;
     */
    connectedAccountId?: string | undefined;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string | undefined;
    /**
     * @generated from field: optional string organization_id = 4;
     */
    organizationId?: string | undefined;
    /**
     * @generated from field: optional string user_id = 5;
     */
    userId?: string | undefined;
};
/**
 * Describes the message scalekit.v1.tools.RefreshToolsRequest.
 * Use `create(RefreshToolsRequestSchema)` to create a new message.
 */
export declare const RefreshToolsRequestSchema: GenMessage<RefreshToolsRequest>;
/**
 * @generated from message scalekit.v1.tools.RefreshToolsResponse
 */
export type RefreshToolsResponse = Message<"scalekit.v1.tools.RefreshToolsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.tools.Tool tools = 1;
     */
    tools: Tool[];
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
};
/**
 * Describes the message scalekit.v1.tools.RefreshToolsResponse.
 * Use `create(RefreshToolsResponseSchema)` to create a new message.
 */
export declare const RefreshToolsResponseSchema: GenMessage<RefreshToolsResponse>;
/**
 * @generated from message scalekit.v1.tools.SetToolDefaultRequest
 */
export type SetToolDefaultRequest = Message<"scalekit.v1.tools.SetToolDefaultRequest"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string schema_version = 2;
     */
    schemaVersion: string;
    /**
     * @generated from field: string tool_version = 3;
     */
    toolVersion: string;
};
/**
 * Describes the message scalekit.v1.tools.SetToolDefaultRequest.
 * Use `create(SetToolDefaultRequestSchema)` to create a new message.
 */
export declare const SetToolDefaultRequestSchema: GenMessage<SetToolDefaultRequest>;
/**
 * @generated from message scalekit.v1.tools.SetToolDefaultResponse
 */
export type SetToolDefaultResponse = Message<"scalekit.v1.tools.SetToolDefaultResponse"> & {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool | undefined;
};
/**
 * Describes the message scalekit.v1.tools.SetToolDefaultResponse.
 * Use `create(SetToolDefaultResponseSchema)` to create a new message.
 */
export declare const SetToolDefaultResponseSchema: GenMessage<SetToolDefaultResponse>;
/**
 * @generated from message scalekit.v1.tools.UpdateToolRequest
 */
export type UpdateToolRequest = Message<"scalekit.v1.tools.UpdateToolRequest"> & {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool | undefined;
};
/**
 * Describes the message scalekit.v1.tools.UpdateToolRequest.
 * Use `create(UpdateToolRequestSchema)` to create a new message.
 */
export declare const UpdateToolRequestSchema: GenMessage<UpdateToolRequest>;
/**
 * @generated from message scalekit.v1.tools.UpdateToolResponse
 */
export type UpdateToolResponse = Message<"scalekit.v1.tools.UpdateToolResponse"> & {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool | undefined;
};
/**
 * Describes the message scalekit.v1.tools.UpdateToolResponse.
 * Use `create(UpdateToolResponseSchema)` to create a new message.
 */
export declare const UpdateToolResponseSchema: GenMessage<UpdateToolResponse>;
/**
 * @generated from message scalekit.v1.tools.DeleteToolRequest
 */
export type DeleteToolRequest = Message<"scalekit.v1.tools.DeleteToolRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.tools.DeleteToolRequest.
 * Use `create(DeleteToolRequestSchema)` to create a new message.
 */
export declare const DeleteToolRequestSchema: GenMessage<DeleteToolRequest>;
/**
 * @generated from message scalekit.v1.tools.ListScopedToolsRequest
 */
export type ListScopedToolsRequest = Message<"scalekit.v1.tools.ListScopedToolsRequest"> & {
    /**
     * @generated from field: string identifier = 1;
     */
    identifier: string;
    /**
     * @generated from field: scalekit.v1.tools.ScopedToolFilter filter = 2;
     */
    filter?: ScopedToolFilter | undefined;
    /**
     * @generated from field: uint32 page_size = 3;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 4;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.tools.ListScopedToolsRequest.
 * Use `create(ListScopedToolsRequestSchema)` to create a new message.
 */
export declare const ListScopedToolsRequestSchema: GenMessage<ListScopedToolsRequest>;
/**
 * @generated from message scalekit.v1.tools.ListScopedToolsResponse
 */
export type ListScopedToolsResponse = Message<"scalekit.v1.tools.ListScopedToolsResponse"> & {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
    /**
     * @generated from field: repeated scalekit.v1.tools.ScopedTool tools = 5;
     */
    tools: ScopedTool[];
};
/**
 * Describes the message scalekit.v1.tools.ListScopedToolsResponse.
 * Use `create(ListScopedToolsResponseSchema)` to create a new message.
 */
export declare const ListScopedToolsResponseSchema: GenMessage<ListScopedToolsResponse>;
/**
 * @generated from message scalekit.v1.tools.ScopedToolFilter
 */
export type ScopedToolFilter = Message<"scalekit.v1.tools.ScopedToolFilter"> & {
    /**
     * @generated from field: repeated string providers = 1;
     */
    providers: string[];
    /**
     * @generated from field: repeated string tool_names = 2;
     */
    toolNames: string[];
    /**
     * @generated from field: repeated string connection_names = 3;
     */
    connectionNames: string[];
};
/**
 * Describes the message scalekit.v1.tools.ScopedToolFilter.
 * Use `create(ScopedToolFilterSchema)` to create a new message.
 */
export declare const ScopedToolFilterSchema: GenMessage<ScopedToolFilter>;
/**
 * @generated from message scalekit.v1.tools.ListAvailableToolsRequest
 */
export type ListAvailableToolsRequest = Message<"scalekit.v1.tools.ListAvailableToolsRequest"> & {
    /**
     * @generated from field: string identifier = 1;
     */
    identifier: string;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.tools.ListAvailableToolsRequest.
 * Use `create(ListAvailableToolsRequestSchema)` to create a new message.
 */
export declare const ListAvailableToolsRequestSchema: GenMessage<ListAvailableToolsRequest>;
/**
 * @generated from message scalekit.v1.tools.ListAvailableToolsResponse
 */
export type ListAvailableToolsResponse = Message<"scalekit.v1.tools.ListAvailableToolsResponse"> & {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
    /**
     * @generated from field: repeated scalekit.v1.tools.Tool tools = 4;
     */
    tools: Tool[];
};
/**
 * Describes the message scalekit.v1.tools.ListAvailableToolsResponse.
 * Use `create(ListAvailableToolsResponseSchema)` to create a new message.
 */
export declare const ListAvailableToolsResponseSchema: GenMessage<ListAvailableToolsResponse>;
/**
 * @generated from message scalekit.v1.tools.SearchToolsRequest
 */
export type SearchToolsRequest = Message<"scalekit.v1.tools.SearchToolsRequest"> & {
    /**
     * @generated from field: string query = 1;
     */
    query: string;
    /**
     * @generated from field: optional string identifier = 2;
     */
    identifier?: string | undefined;
    /**
     * @generated from field: uint32 top_k = 3;
     */
    topK: number;
};
/**
 * Describes the message scalekit.v1.tools.SearchToolsRequest.
 * Use `create(SearchToolsRequestSchema)` to create a new message.
 */
export declare const SearchToolsRequestSchema: GenMessage<SearchToolsRequest>;
/**
 * @generated from message scalekit.v1.tools.SearchToolsResponse
 */
export type SearchToolsResponse = Message<"scalekit.v1.tools.SearchToolsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.tools.SearchedTool tools = 1;
     */
    tools: SearchedTool[];
};
/**
 * Describes the message scalekit.v1.tools.SearchToolsResponse.
 * Use `create(SearchToolsResponseSchema)` to create a new message.
 */
export declare const SearchToolsResponseSchema: GenMessage<SearchToolsResponse>;
/**
 * @generated from message scalekit.v1.tools.SearchedTool
 */
export type SearchedTool = Message<"scalekit.v1.tools.SearchedTool"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string provider = 2;
     */
    provider: string;
    /**
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * @generated from field: double score = 4;
     */
    score: number;
    /**
     * @generated from field: repeated scalekit.v1.tools.ConnectionReadiness connections = 5;
     */
    connections: ConnectionReadiness[];
};
/**
 * Describes the message scalekit.v1.tools.SearchedTool.
 * Use `create(SearchedToolSchema)` to create a new message.
 */
export declare const SearchedToolSchema: GenMessage<SearchedTool>;
/**
 * @generated from message scalekit.v1.tools.ConnectionReadiness
 */
export type ConnectionReadiness = Message<"scalekit.v1.tools.ConnectionReadiness"> & {
    /**
     * @generated from field: string connection_name = 1;
     */
    connectionName: string;
    /**
     * @generated from field: string connected_account_id = 2;
     */
    connectedAccountId: string;
    /**
     * @generated from field: scalekit.v1.tools.ToolReadinessState readiness_state = 3;
     */
    readinessState: ToolReadinessState;
};
/**
 * Describes the message scalekit.v1.tools.ConnectionReadiness.
 * Use `create(ConnectionReadinessSchema)` to create a new message.
 */
export declare const ConnectionReadinessSchema: GenMessage<ConnectionReadiness>;
/**
 * ToolReadinessState describes whether a tool in a search result can be
 * invoked right now for a given connected-account identifier and one specific
 * connection, or needs a setup step first. Set per-connection (see
 * ConnectionReadiness) — only meaningful when the search request supplies an
 * identifier; otherwise it is TOOL_READINESS_STATE_UNSPECIFIED.
 *
 * @generated from enum scalekit.v1.tools.ToolReadinessState
 */
export declare enum ToolReadinessState {
    /**
     * Readiness was not evaluated (no identifier supplied in the request).
     *
     * @generated from enum value: TOOL_READINESS_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * The identifier has an active connected account for this connection; the
     * tool can be executed immediately via ExecuteTool using its
     * connected_account_id.
     *
     * @generated from enum value: TOOL_READINESS_STATE_READY = 1;
     */
    READY = 1,
    /**
     * A connected account exists for this connection but is not active (e.g.
     * disconnected or pending); the end user must re-establish the connection
     * before the tool can be used through it. A connection the identifier has
     * never connected at all is not represented by this state — it is left
     * out of the connections list entirely instead.
     *
     * @generated from enum value: TOOL_READINESS_STATE_NEEDS_CONNECTION = 2;
     */
    NEEDS_CONNECTION = 2,
    /**
     * A connected account exists for this connection but its token is expired;
     * the end user must re-authenticate before the tool can be used through it.
     *
     * @generated from enum value: TOOL_READINESS_STATE_NEEDS_REAUTH = 3;
     */
    NEEDS_REAUTH = 3
}
/**
 * Describes the enum scalekit.v1.tools.ToolReadinessState.
 */
export declare const ToolReadinessStateSchema: GenEnum<ToolReadinessState>;
/**
 * @generated from service scalekit.v1.tools.ToolService
 */
export declare const ToolService: GenService<{
    /**
     * @generated from rpc scalekit.v1.tools.ToolService.CreateTool
     */
    createTool: {
        methodKind: "unary";
        input: typeof CreateToolRequestSchema;
        output: typeof CreateToolResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.tools.ToolService.ListTools
     */
    listTools: {
        methodKind: "unary";
        input: typeof ListToolsRequestSchema;
        output: typeof ListToolsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.tools.ToolService.ListScopedTools
     */
    listScopedTools: {
        methodKind: "unary";
        input: typeof ListScopedToolsRequestSchema;
        output: typeof ListScopedToolsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.tools.ToolService.ListAvailableTools
     */
    listAvailableTools: {
        methodKind: "unary";
        input: typeof ListAvailableToolsRequestSchema;
        output: typeof ListAvailableToolsResponseSchema;
    };
    /**
     * Search tools by natural-language query
     *
     * @generated from rpc scalekit.v1.tools.ToolService.SearchTools
     */
    searchTools: {
        methodKind: "unary";
        input: typeof SearchToolsRequestSchema;
        output: typeof SearchToolsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.tools.ToolService.SetToolDefault
     */
    setToolDefault: {
        methodKind: "unary";
        input: typeof SetToolDefaultRequestSchema;
        output: typeof SetToolDefaultResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.tools.ToolService.UpdateTool
     */
    updateTool: {
        methodKind: "unary";
        input: typeof UpdateToolRequestSchema;
        output: typeof UpdateToolResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.tools.ToolService.DeleteTool
     */
    deleteTool: {
        methodKind: "unary";
        input: typeof DeleteToolRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * Execute Tool
     *
     * @generated from rpc scalekit.v1.tools.ToolService.ExecuteTool
     */
    executeTool: {
        methodKind: "unary";
        input: typeof ExecuteToolRequestSchema;
        output: typeof ExecuteToolResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.tools.ToolService.RefreshTools
     */
    refreshTools: {
        methodKind: "unary";
        input: typeof RefreshToolsRequestSchema;
        output: typeof RefreshToolsResponseSchema;
    };
}>;
