import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
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
    tool?: Tool;
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
    tool?: Tool;
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
    definition?: JsonObject;
    /**
     * @generated from field: google.protobuf.Struct metadata = 4;
     */
    metadata?: JsonObject;
    /**
     * @generated from field: repeated string tags = 5;
     */
    tags: string[];
    /**
     * @generated from field: google.protobuf.BoolValue is_default = 6;
     */
    isDefault?: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 7;
     */
    updatedAt?: Timestamp;
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
    tool?: Tool;
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
    filter?: Filter;
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
    summary?: boolean;
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
    query?: string;
    /**
     * Fields 6-9 mirror GetConnectedAccountByIdentifierRequest, enabling ListTools to
     * resolve a specific connected account and include its custom MCP tools alongside
     * global tools. When connector or connected_account_id is set, a CA lookup is performed.
     *
     * @generated from field: optional string connector = 6;
     */
    connector?: string;
    /**
     * @generated from field: optional string organization_id = 7;
     */
    organizationId?: string;
    /**
     * @generated from field: optional string user_id = 8;
     */
    userId?: string;
    /**
     * @generated from field: optional string connected_account_id = 9;
     */
    connectedAccountId?: string;
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
    identifier?: string;
    /**
     * @generated from field: google.protobuf.Struct params = 3;
     */
    params?: JsonObject;
    /**
     * @generated from field: optional string connected_account_id = 4;
     */
    connectedAccountId?: string;
    /**
     * @generated from field: optional string connector = 5;
     */
    connector?: string;
    /**
     * @generated from field: optional string organization_id = 6;
     */
    organizationId?: string;
    /**
     * @generated from field: optional string user_id = 7;
     */
    userId?: string;
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
    data?: JsonObject;
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
    tool?: Tool;
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
    tool?: Tool;
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
    tool?: Tool;
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
    filter?: ScopedToolFilter;
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
}>;
