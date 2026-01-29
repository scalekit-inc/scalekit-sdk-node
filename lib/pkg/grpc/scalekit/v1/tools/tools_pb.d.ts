import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Struct, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from message scalekit.v1.tools.CreateToolRequest
 */
export declare class CreateToolRequest extends Message<CreateToolRequest> {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool;
    constructor(data?: PartialMessage<CreateToolRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.CreateToolRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateToolRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateToolRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateToolRequest;
    static equals(a: CreateToolRequest | PlainMessage<CreateToolRequest> | undefined, b: CreateToolRequest | PlainMessage<CreateToolRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.CreateToolResponse
 */
export declare class CreateToolResponse extends Message<CreateToolResponse> {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool;
    constructor(data?: PartialMessage<CreateToolResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.CreateToolResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateToolResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateToolResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateToolResponse;
    static equals(a: CreateToolResponse | PlainMessage<CreateToolResponse> | undefined, b: CreateToolResponse | PlainMessage<CreateToolResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.Tool
 */
export declare class Tool extends Message<Tool> {
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
    definition?: Struct;
    /**
     * @generated from field: google.protobuf.Struct metadata = 4;
     */
    metadata?: Struct;
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
    constructor(data?: PartialMessage<Tool>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.Tool";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Tool;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Tool;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Tool;
    static equals(a: Tool | PlainMessage<Tool> | undefined, b: Tool | PlainMessage<Tool> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.ScopedTool
 */
export declare class ScopedTool extends Message<ScopedTool> {
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
    constructor(data?: PartialMessage<ScopedTool>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.ScopedTool";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ScopedTool;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ScopedTool;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ScopedTool;
    static equals(a: ScopedTool | PlainMessage<ScopedTool> | undefined, b: ScopedTool | PlainMessage<ScopedTool> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.ListToolsRequest
 */
export declare class ListToolsRequest extends Message<ListToolsRequest> {
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
    constructor(data?: PartialMessage<ListToolsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.ListToolsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListToolsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListToolsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListToolsRequest;
    static equals(a: ListToolsRequest | PlainMessage<ListToolsRequest> | undefined, b: ListToolsRequest | PlainMessage<ListToolsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.Filter
 */
export declare class Filter extends Message<Filter> {
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
    constructor(data?: PartialMessage<Filter>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.Filter";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Filter;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Filter;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Filter;
    static equals(a: Filter | PlainMessage<Filter> | undefined, b: Filter | PlainMessage<Filter> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.ListToolsResponse
 */
export declare class ListToolsResponse extends Message<ListToolsResponse> {
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
    constructor(data?: PartialMessage<ListToolsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.ListToolsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListToolsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListToolsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListToolsResponse;
    static equals(a: ListToolsResponse | PlainMessage<ListToolsResponse> | undefined, b: ListToolsResponse | PlainMessage<ListToolsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.ExecuteToolRequest
 */
export declare class ExecuteToolRequest extends Message<ExecuteToolRequest> {
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
    params?: Struct;
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
    constructor(data?: PartialMessage<ExecuteToolRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.ExecuteToolRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ExecuteToolRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ExecuteToolRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ExecuteToolRequest;
    static equals(a: ExecuteToolRequest | PlainMessage<ExecuteToolRequest> | undefined, b: ExecuteToolRequest | PlainMessage<ExecuteToolRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.ExecuteToolResponse
 */
export declare class ExecuteToolResponse extends Message<ExecuteToolResponse> {
    /**
     * @generated from field: google.protobuf.Struct data = 1;
     */
    data?: Struct;
    /**
     * @generated from field: string execution_id = 2;
     */
    executionId: string;
    constructor(data?: PartialMessage<ExecuteToolResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.ExecuteToolResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ExecuteToolResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ExecuteToolResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ExecuteToolResponse;
    static equals(a: ExecuteToolResponse | PlainMessage<ExecuteToolResponse> | undefined, b: ExecuteToolResponse | PlainMessage<ExecuteToolResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.SetToolDefaultRequest
 */
export declare class SetToolDefaultRequest extends Message<SetToolDefaultRequest> {
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
    constructor(data?: PartialMessage<SetToolDefaultRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.SetToolDefaultRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SetToolDefaultRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SetToolDefaultRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SetToolDefaultRequest;
    static equals(a: SetToolDefaultRequest | PlainMessage<SetToolDefaultRequest> | undefined, b: SetToolDefaultRequest | PlainMessage<SetToolDefaultRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.SetToolDefaultResponse
 */
export declare class SetToolDefaultResponse extends Message<SetToolDefaultResponse> {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool;
    constructor(data?: PartialMessage<SetToolDefaultResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.SetToolDefaultResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SetToolDefaultResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SetToolDefaultResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SetToolDefaultResponse;
    static equals(a: SetToolDefaultResponse | PlainMessage<SetToolDefaultResponse> | undefined, b: SetToolDefaultResponse | PlainMessage<SetToolDefaultResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.UpdateToolRequest
 */
export declare class UpdateToolRequest extends Message<UpdateToolRequest> {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool;
    constructor(data?: PartialMessage<UpdateToolRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.UpdateToolRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateToolRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateToolRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateToolRequest;
    static equals(a: UpdateToolRequest | PlainMessage<UpdateToolRequest> | undefined, b: UpdateToolRequest | PlainMessage<UpdateToolRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.UpdateToolResponse
 */
export declare class UpdateToolResponse extends Message<UpdateToolResponse> {
    /**
     * @generated from field: scalekit.v1.tools.Tool tool = 1;
     */
    tool?: Tool;
    constructor(data?: PartialMessage<UpdateToolResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.UpdateToolResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateToolResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateToolResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateToolResponse;
    static equals(a: UpdateToolResponse | PlainMessage<UpdateToolResponse> | undefined, b: UpdateToolResponse | PlainMessage<UpdateToolResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.DeleteToolRequest
 */
export declare class DeleteToolRequest extends Message<DeleteToolRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    constructor(data?: PartialMessage<DeleteToolRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.DeleteToolRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteToolRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteToolRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteToolRequest;
    static equals(a: DeleteToolRequest | PlainMessage<DeleteToolRequest> | undefined, b: DeleteToolRequest | PlainMessage<DeleteToolRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.ListScopedToolsRequest
 */
export declare class ListScopedToolsRequest extends Message<ListScopedToolsRequest> {
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
    constructor(data?: PartialMessage<ListScopedToolsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.ListScopedToolsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListScopedToolsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListScopedToolsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListScopedToolsRequest;
    static equals(a: ListScopedToolsRequest | PlainMessage<ListScopedToolsRequest> | undefined, b: ListScopedToolsRequest | PlainMessage<ListScopedToolsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.ListScopedToolsResponse
 */
export declare class ListScopedToolsResponse extends Message<ListScopedToolsResponse> {
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
    constructor(data?: PartialMessage<ListScopedToolsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.ListScopedToolsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListScopedToolsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListScopedToolsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListScopedToolsResponse;
    static equals(a: ListScopedToolsResponse | PlainMessage<ListScopedToolsResponse> | undefined, b: ListScopedToolsResponse | PlainMessage<ListScopedToolsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.tools.ScopedToolFilter
 */
export declare class ScopedToolFilter extends Message<ScopedToolFilter> {
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
    constructor(data?: PartialMessage<ScopedToolFilter>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.tools.ScopedToolFilter";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ScopedToolFilter;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ScopedToolFilter;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ScopedToolFilter;
    static equals(a: ScopedToolFilter | PlainMessage<ScopedToolFilter> | undefined, b: ScopedToolFilter | PlainMessage<ScopedToolFilter> | undefined): boolean;
}
