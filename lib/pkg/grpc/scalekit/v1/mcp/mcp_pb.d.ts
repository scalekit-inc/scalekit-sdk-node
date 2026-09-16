import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Duration, Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/mcp/mcp.proto.
 */
export declare const file_scalekit_v1_mcp_mcp: GenFile;
/**
 * @generated from message scalekit.v1.mcp.CreateMcpRequest
 */
export type CreateMcpRequest = Message<"scalekit.v1.mcp.CreateMcpRequest"> & {
    /**
     * @generated from field: scalekit.v1.mcp.Mcp mcp = 1;
     */
    mcp?: Mcp | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.CreateMcpRequest.
 * Use `create(CreateMcpRequestSchema)` to create a new message.
 */
export declare const CreateMcpRequestSchema: GenMessage<CreateMcpRequest>;
/**
 * @generated from message scalekit.v1.mcp.CreateMcpResponse
 */
export type CreateMcpResponse = Message<"scalekit.v1.mcp.CreateMcpResponse"> & {
    /**
     * @generated from field: scalekit.v1.mcp.Mcp mcp = 1;
     */
    mcp?: Mcp | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.CreateMcpResponse.
 * Use `create(CreateMcpResponseSchema)` to create a new message.
 */
export declare const CreateMcpResponseSchema: GenMessage<CreateMcpResponse>;
/**
 * @generated from message scalekit.v1.mcp.Mcp
 */
export type Mcp = Message<"scalekit.v1.mcp.Mcp"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: repeated scalekit.v1.mcp.ToolMapping tool_mappings = 2;
     */
    toolMappings: ToolMapping[];
    /**
     * @generated from field: string connected_account_identifier = 3;
     */
    connectedAccountIdentifier: string;
    /**
     * @generated from field: string url = 4;
     */
    url: string;
};
/**
 * Describes the message scalekit.v1.mcp.Mcp.
 * Use `create(McpSchema)` to create a new message.
 */
export declare const McpSchema: GenMessage<Mcp>;
/**
 * @generated from message scalekit.v1.mcp.ToolMapping
 */
export type ToolMapping = Message<"scalekit.v1.mcp.ToolMapping"> & {
    /**
     * @generated from field: repeated string tool_names = 1;
     */
    toolNames: string[];
    /**
     * @generated from field: string connection_name = 2;
     */
    connectionName: string;
    /**
     * @generated from field: string status = 3;
     */
    status: string;
};
/**
 * Describes the message scalekit.v1.mcp.ToolMapping.
 * Use `create(ToolMappingSchema)` to create a new message.
 */
export declare const ToolMappingSchema: GenMessage<ToolMapping>;
/**
 * @generated from message scalekit.v1.mcp.GetMcpRequest
 */
export type GetMcpRequest = Message<"scalekit.v1.mcp.GetMcpRequest"> & {
    /**
     * @generated from field: string mcp_id = 1;
     */
    mcpId: string;
};
/**
 * Describes the message scalekit.v1.mcp.GetMcpRequest.
 * Use `create(GetMcpRequestSchema)` to create a new message.
 */
export declare const GetMcpRequestSchema: GenMessage<GetMcpRequest>;
/**
 * @generated from message scalekit.v1.mcp.GetMcpResponse
 */
export type GetMcpResponse = Message<"scalekit.v1.mcp.GetMcpResponse"> & {
    /**
     * @generated from field: scalekit.v1.mcp.Mcp mcp = 1;
     */
    mcp?: Mcp | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.GetMcpResponse.
 * Use `create(GetMcpResponseSchema)` to create a new message.
 */
export declare const GetMcpResponseSchema: GenMessage<GetMcpResponse>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpRequest
 */
export type ListMcpRequest = Message<"scalekit.v1.mcp.ListMcpRequest"> & {
    /**
     * @generated from field: scalekit.v1.mcp.ListMcpRequest.Filter filter = 1;
     */
    filter?: ListMcpRequest_Filter | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.ListMcpRequest.
 * Use `create(ListMcpRequestSchema)` to create a new message.
 */
export declare const ListMcpRequestSchema: GenMessage<ListMcpRequest>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpRequest.Filter
 */
export type ListMcpRequest_Filter = Message<"scalekit.v1.mcp.ListMcpRequest.Filter"> & {
    /**
     * @generated from field: string connected_account_identifier = 1;
     */
    connectedAccountIdentifier: string;
    /**
     * @generated from field: string link_token = 2;
     */
    linkToken: string;
};
/**
 * Describes the message scalekit.v1.mcp.ListMcpRequest.Filter.
 * Use `create(ListMcpRequest_FilterSchema)` to create a new message.
 */
export declare const ListMcpRequest_FilterSchema: GenMessage<ListMcpRequest_Filter>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpResponse
 */
export type ListMcpResponse = Message<"scalekit.v1.mcp.ListMcpResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.mcp.Mcp mcps = 1;
     */
    mcps: Mcp[];
};
/**
 * Describes the message scalekit.v1.mcp.ListMcpResponse.
 * Use `create(ListMcpResponseSchema)` to create a new message.
 */
export declare const ListMcpResponseSchema: GenMessage<ListMcpResponse>;
/**
 * @generated from message scalekit.v1.mcp.DeleteMcpRequest
 */
export type DeleteMcpRequest = Message<"scalekit.v1.mcp.DeleteMcpRequest"> & {
    /**
     * @generated from field: string mcp_id = 1;
     */
    mcpId: string;
};
/**
 * Describes the message scalekit.v1.mcp.DeleteMcpRequest.
 * Use `create(DeleteMcpRequestSchema)` to create a new message.
 */
export declare const DeleteMcpRequestSchema: GenMessage<DeleteMcpRequest>;
/**
 * @generated from message scalekit.v1.mcp.DeleteMcpResponse
 */
export type DeleteMcpResponse = Message<"scalekit.v1.mcp.DeleteMcpResponse"> & {};
/**
 * Describes the message scalekit.v1.mcp.DeleteMcpResponse.
 * Use `create(DeleteMcpResponseSchema)` to create a new message.
 */
export declare const DeleteMcpResponseSchema: GenMessage<DeleteMcpResponse>;
/**
 * @generated from message scalekit.v1.mcp.CreateMcpConfigRequest
 */
export type CreateMcpConfigRequest = Message<"scalekit.v1.mcp.CreateMcpConfigRequest"> & {
    /**
     * @generated from field: scalekit.v1.mcp.McpConfig config = 1;
     */
    config?: McpConfig | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.CreateMcpConfigRequest.
 * Use `create(CreateMcpConfigRequestSchema)` to create a new message.
 */
export declare const CreateMcpConfigRequestSchema: GenMessage<CreateMcpConfigRequest>;
/**
 * @generated from message scalekit.v1.mcp.CreateMcpConfigResponse
 */
export type CreateMcpConfigResponse = Message<"scalekit.v1.mcp.CreateMcpConfigResponse"> & {
    /**
     * @generated from field: scalekit.v1.mcp.McpConfig config = 1;
     */
    config?: McpConfig | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.CreateMcpConfigResponse.
 * Use `create(CreateMcpConfigResponseSchema)` to create a new message.
 */
export declare const CreateMcpConfigResponseSchema: GenMessage<CreateMcpConfigResponse>;
/**
 * @generated from message scalekit.v1.mcp.UpdateMcpConfigRequest
 */
export type UpdateMcpConfigRequest = Message<"scalekit.v1.mcp.UpdateMcpConfigRequest"> & {
    /**
     * @generated from field: string config_id = 1;
     */
    configId: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: repeated scalekit.v1.mcp.McpConfigConnectionToolMapping connection_tool_mappings = 3;
     */
    connectionToolMappings: McpConfigConnectionToolMapping[];
};
/**
 * Describes the message scalekit.v1.mcp.UpdateMcpConfigRequest.
 * Use `create(UpdateMcpConfigRequestSchema)` to create a new message.
 */
export declare const UpdateMcpConfigRequestSchema: GenMessage<UpdateMcpConfigRequest>;
/**
 * @generated from message scalekit.v1.mcp.UpdateMcpConfigResponse
 */
export type UpdateMcpConfigResponse = Message<"scalekit.v1.mcp.UpdateMcpConfigResponse"> & {
    /**
     * @generated from field: scalekit.v1.mcp.McpConfig config = 1;
     */
    config?: McpConfig | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.UpdateMcpConfigResponse.
 * Use `create(UpdateMcpConfigResponseSchema)` to create a new message.
 */
export declare const UpdateMcpConfigResponseSchema: GenMessage<UpdateMcpConfigResponse>;
/**
 * @generated from message scalekit.v1.mcp.DeleteMcpConfigRequest
 */
export type DeleteMcpConfigRequest = Message<"scalekit.v1.mcp.DeleteMcpConfigRequest"> & {
    /**
     * @generated from field: string config_id = 1;
     */
    configId: string;
};
/**
 * Describes the message scalekit.v1.mcp.DeleteMcpConfigRequest.
 * Use `create(DeleteMcpConfigRequestSchema)` to create a new message.
 */
export declare const DeleteMcpConfigRequestSchema: GenMessage<DeleteMcpConfigRequest>;
/**
 * @generated from message scalekit.v1.mcp.DeleteMcpConfigResponse
 */
export type DeleteMcpConfigResponse = Message<"scalekit.v1.mcp.DeleteMcpConfigResponse"> & {};
/**
 * Describes the message scalekit.v1.mcp.DeleteMcpConfigResponse.
 * Use `create(DeleteMcpConfigResponseSchema)` to create a new message.
 */
export declare const DeleteMcpConfigResponseSchema: GenMessage<DeleteMcpConfigResponse>;
/**
 * @generated from message scalekit.v1.mcp.GetMcpConfigRequest
 */
export type GetMcpConfigRequest = Message<"scalekit.v1.mcp.GetMcpConfigRequest"> & {
    /**
     * @generated from field: string config_id = 1;
     */
    configId: string;
};
/**
 * Describes the message scalekit.v1.mcp.GetMcpConfigRequest.
 * Use `create(GetMcpConfigRequestSchema)` to create a new message.
 */
export declare const GetMcpConfigRequestSchema: GenMessage<GetMcpConfigRequest>;
/**
 * @generated from message scalekit.v1.mcp.GetMcpConfigResponse
 */
export type GetMcpConfigResponse = Message<"scalekit.v1.mcp.GetMcpConfigResponse"> & {
    /**
     * @generated from field: scalekit.v1.mcp.McpConfig config = 1;
     */
    config?: McpConfig | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.GetMcpConfigResponse.
 * Use `create(GetMcpConfigResponseSchema)` to create a new message.
 */
export declare const GetMcpConfigResponseSchema: GenMessage<GetMcpConfigResponse>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpConfigsRequest
 */
export type ListMcpConfigsRequest = Message<"scalekit.v1.mcp.ListMcpConfigsRequest"> & {
    /**
     * @generated from field: scalekit.v1.mcp.ListMcpConfigsRequest.Filter filter = 1;
     */
    filter?: ListMcpConfigsRequest_Filter | undefined;
    /**
     * @generated from field: string search = 2;
     */
    search: string;
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
 * Describes the message scalekit.v1.mcp.ListMcpConfigsRequest.
 * Use `create(ListMcpConfigsRequestSchema)` to create a new message.
 */
export declare const ListMcpConfigsRequestSchema: GenMessage<ListMcpConfigsRequest>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpConfigsRequest.Filter
 */
export type ListMcpConfigsRequest_Filter = Message<"scalekit.v1.mcp.ListMcpConfigsRequest.Filter"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string provider = 3;
     */
    provider: string;
    /**
     * @generated from field: string mcp_server_url = 4;
     */
    mcpServerUrl: string;
};
/**
 * Describes the message scalekit.v1.mcp.ListMcpConfigsRequest.Filter.
 * Use `create(ListMcpConfigsRequest_FilterSchema)` to create a new message.
 */
export declare const ListMcpConfigsRequest_FilterSchema: GenMessage<ListMcpConfigsRequest_Filter>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpConfigsResponse
 */
export type ListMcpConfigsResponse = Message<"scalekit.v1.mcp.ListMcpConfigsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.mcp.McpConfig configs = 1;
     */
    configs: McpConfig[];
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
    /**
     * @generated from field: uint32 total_size = 4;
     */
    totalSize: number;
};
/**
 * Describes the message scalekit.v1.mcp.ListMcpConfigsResponse.
 * Use `create(ListMcpConfigsResponseSchema)` to create a new message.
 */
export declare const ListMcpConfigsResponseSchema: GenMessage<ListMcpConfigsResponse>;
/**
 * @generated from message scalekit.v1.mcp.EnsureMcpInstanceRequest
 */
export type EnsureMcpInstanceRequest = Message<"scalekit.v1.mcp.EnsureMcpInstanceRequest"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string config_name = 2;
     */
    configName: string;
    /**
     * @generated from field: string user_identifier = 3;
     */
    userIdentifier: string;
};
/**
 * Describes the message scalekit.v1.mcp.EnsureMcpInstanceRequest.
 * Use `create(EnsureMcpInstanceRequestSchema)` to create a new message.
 */
export declare const EnsureMcpInstanceRequestSchema: GenMessage<EnsureMcpInstanceRequest>;
/**
 * @generated from message scalekit.v1.mcp.EnsureMcpInstanceResponse
 */
export type EnsureMcpInstanceResponse = Message<"scalekit.v1.mcp.EnsureMcpInstanceResponse"> & {
    /**
     * @generated from field: scalekit.v1.mcp.McpInstance instance = 1;
     */
    instance?: McpInstance | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.EnsureMcpInstanceResponse.
 * Use `create(EnsureMcpInstanceResponseSchema)` to create a new message.
 */
export declare const EnsureMcpInstanceResponseSchema: GenMessage<EnsureMcpInstanceResponse>;
/**
 * @generated from message scalekit.v1.mcp.McpConnectionAuthState
 */
export type McpConnectionAuthState = Message<"scalekit.v1.mcp.McpConnectionAuthState"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string connection_name = 2;
     */
    connectionName: string;
    /**
     * @generated from field: string provider = 3;
     */
    provider: string;
    /**
     * @generated from field: optional string connected_account_id = 4;
     */
    connectedAccountId?: string | undefined;
    /**
     * @generated from field: optional string connected_account_status = 5;
     */
    connectedAccountStatus?: string | undefined;
    /**
     * @generated from field: string authentication_link = 6;
     */
    authenticationLink: string;
};
/**
 * Describes the message scalekit.v1.mcp.McpConnectionAuthState.
 * Use `create(McpConnectionAuthStateSchema)` to create a new message.
 */
export declare const McpConnectionAuthStateSchema: GenMessage<McpConnectionAuthState>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpConnectedAccountsRequest
 */
export type ListMcpConnectedAccountsRequest = Message<"scalekit.v1.mcp.ListMcpConnectedAccountsRequest"> & {
    /**
     * @generated from field: string config_id = 1;
     */
    configId: string;
    /**
     * @generated from field: string identifier = 2;
     */
    identifier: string;
    /**
     * @generated from field: bool include_auth_link = 3;
     */
    includeAuthLink: boolean;
};
/**
 * Describes the message scalekit.v1.mcp.ListMcpConnectedAccountsRequest.
 * Use `create(ListMcpConnectedAccountsRequestSchema)` to create a new message.
 */
export declare const ListMcpConnectedAccountsRequestSchema: GenMessage<ListMcpConnectedAccountsRequest>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpConnectedAccountsResponse
 */
export type ListMcpConnectedAccountsResponse = Message<"scalekit.v1.mcp.ListMcpConnectedAccountsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.mcp.McpConnectionAuthState connected_accounts = 1;
     */
    connectedAccounts: McpConnectionAuthState[];
};
/**
 * Describes the message scalekit.v1.mcp.ListMcpConnectedAccountsResponse.
 * Use `create(ListMcpConnectedAccountsResponseSchema)` to create a new message.
 */
export declare const ListMcpConnectedAccountsResponseSchema: GenMessage<ListMcpConnectedAccountsResponse>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpInstancesRequest
 */
export type ListMcpInstancesRequest = Message<"scalekit.v1.mcp.ListMcpInstancesRequest"> & {
    /**
     * @generated from field: scalekit.v1.mcp.ListMcpInstancesRequest.Filter filter = 1;
     */
    filter?: ListMcpInstancesRequest_Filter | undefined;
    /**
     * @generated from field: string search = 2;
     */
    search: string;
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
 * Describes the message scalekit.v1.mcp.ListMcpInstancesRequest.
 * Use `create(ListMcpInstancesRequestSchema)` to create a new message.
 */
export declare const ListMcpInstancesRequestSchema: GenMessage<ListMcpInstancesRequest>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpInstancesRequest.Filter
 */
export type ListMcpInstancesRequest_Filter = Message<"scalekit.v1.mcp.ListMcpInstancesRequest.Filter"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string config_name = 3;
     */
    configName: string;
    /**
     * @generated from field: string user_identifier = 4;
     */
    userIdentifier: string;
};
/**
 * Describes the message scalekit.v1.mcp.ListMcpInstancesRequest.Filter.
 * Use `create(ListMcpInstancesRequest_FilterSchema)` to create a new message.
 */
export declare const ListMcpInstancesRequest_FilterSchema: GenMessage<ListMcpInstancesRequest_Filter>;
/**
 * @generated from message scalekit.v1.mcp.ListMcpInstancesResponse
 */
export type ListMcpInstancesResponse = Message<"scalekit.v1.mcp.ListMcpInstancesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.mcp.McpInstance instances = 1;
     */
    instances: McpInstance[];
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
    /**
     * @generated from field: uint32 total_size = 4;
     */
    totalSize: number;
};
/**
 * Describes the message scalekit.v1.mcp.ListMcpInstancesResponse.
 * Use `create(ListMcpInstancesResponseSchema)` to create a new message.
 */
export declare const ListMcpInstancesResponseSchema: GenMessage<ListMcpInstancesResponse>;
/**
 * @generated from message scalekit.v1.mcp.DeleteMcpInstanceRequest
 */
export type DeleteMcpInstanceRequest = Message<"scalekit.v1.mcp.DeleteMcpInstanceRequest"> & {
    /**
     * @generated from field: string instance_id = 1;
     */
    instanceId: string;
};
/**
 * Describes the message scalekit.v1.mcp.DeleteMcpInstanceRequest.
 * Use `create(DeleteMcpInstanceRequestSchema)` to create a new message.
 */
export declare const DeleteMcpInstanceRequestSchema: GenMessage<DeleteMcpInstanceRequest>;
/**
 * @generated from message scalekit.v1.mcp.DeleteMcpInstanceResponse
 */
export type DeleteMcpInstanceResponse = Message<"scalekit.v1.mcp.DeleteMcpInstanceResponse"> & {};
/**
 * Describes the message scalekit.v1.mcp.DeleteMcpInstanceResponse.
 * Use `create(DeleteMcpInstanceResponseSchema)` to create a new message.
 */
export declare const DeleteMcpInstanceResponseSchema: GenMessage<DeleteMcpInstanceResponse>;
/**
 * @generated from message scalekit.v1.mcp.UpdateMcpInstanceRequest
 */
export type UpdateMcpInstanceRequest = Message<"scalekit.v1.mcp.UpdateMcpInstanceRequest"> & {
    /**
     * @generated from field: string instance_id = 1;
     */
    instanceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string config_name = 3;
     */
    configName: string;
};
/**
 * Describes the message scalekit.v1.mcp.UpdateMcpInstanceRequest.
 * Use `create(UpdateMcpInstanceRequestSchema)` to create a new message.
 */
export declare const UpdateMcpInstanceRequestSchema: GenMessage<UpdateMcpInstanceRequest>;
/**
 * @generated from message scalekit.v1.mcp.UpdateMcpInstanceResponse
 */
export type UpdateMcpInstanceResponse = Message<"scalekit.v1.mcp.UpdateMcpInstanceResponse"> & {
    /**
     * @generated from field: scalekit.v1.mcp.McpInstance instance = 1;
     */
    instance?: McpInstance | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.UpdateMcpInstanceResponse.
 * Use `create(UpdateMcpInstanceResponseSchema)` to create a new message.
 */
export declare const UpdateMcpInstanceResponseSchema: GenMessage<UpdateMcpInstanceResponse>;
/**
 * @generated from message scalekit.v1.mcp.GetMcpInstanceRequest
 */
export type GetMcpInstanceRequest = Message<"scalekit.v1.mcp.GetMcpInstanceRequest"> & {
    /**
     * @generated from field: string instance_id = 1;
     */
    instanceId: string;
};
/**
 * Describes the message scalekit.v1.mcp.GetMcpInstanceRequest.
 * Use `create(GetMcpInstanceRequestSchema)` to create a new message.
 */
export declare const GetMcpInstanceRequestSchema: GenMessage<GetMcpInstanceRequest>;
/**
 * @generated from message scalekit.v1.mcp.GetMcpInstanceResponse
 */
export type GetMcpInstanceResponse = Message<"scalekit.v1.mcp.GetMcpInstanceResponse"> & {
    /**
     * @generated from field: scalekit.v1.mcp.McpInstance instance = 1;
     */
    instance?: McpInstance | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.GetMcpInstanceResponse.
 * Use `create(GetMcpInstanceResponseSchema)` to create a new message.
 */
export declare const GetMcpInstanceResponseSchema: GenMessage<GetMcpInstanceResponse>;
/**
 * @generated from message scalekit.v1.mcp.GetMcpInstanceAuthStateRequest
 */
export type GetMcpInstanceAuthStateRequest = Message<"scalekit.v1.mcp.GetMcpInstanceAuthStateRequest"> & {
    /**
     * @generated from field: string instance_id = 1;
     */
    instanceId: string;
    /**
     * @generated from field: bool include_auth_links = 2;
     */
    includeAuthLinks: boolean;
};
/**
 * Describes the message scalekit.v1.mcp.GetMcpInstanceAuthStateRequest.
 * Use `create(GetMcpInstanceAuthStateRequestSchema)` to create a new message.
 */
export declare const GetMcpInstanceAuthStateRequestSchema: GenMessage<GetMcpInstanceAuthStateRequest>;
/**
 * @generated from message scalekit.v1.mcp.McpInstanceConnectionAuthState
 */
export type McpInstanceConnectionAuthState = Message<"scalekit.v1.mcp.McpInstanceConnectionAuthState"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string connection_name = 2;
     */
    connectionName: string;
    /**
     * @generated from field: string provider = 3;
     */
    provider: string;
    /**
     * @generated from field: string connected_account_id = 4;
     */
    connectedAccountId: string;
    /**
     * @generated from field: string connected_account_status = 5;
     */
    connectedAccountStatus: string;
    /**
     * @generated from field: string authentication_link = 6;
     */
    authenticationLink: string;
};
/**
 * Describes the message scalekit.v1.mcp.McpInstanceConnectionAuthState.
 * Use `create(McpInstanceConnectionAuthStateSchema)` to create a new message.
 */
export declare const McpInstanceConnectionAuthStateSchema: GenMessage<McpInstanceConnectionAuthState>;
/**
 * @generated from message scalekit.v1.mcp.GetMcpInstanceAuthStateResponse
 */
export type GetMcpInstanceAuthStateResponse = Message<"scalekit.v1.mcp.GetMcpInstanceAuthStateResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.mcp.McpInstanceConnectionAuthState connections = 1;
     */
    connections: McpInstanceConnectionAuthState[];
};
/**
 * Describes the message scalekit.v1.mcp.GetMcpInstanceAuthStateResponse.
 * Use `create(GetMcpInstanceAuthStateResponseSchema)` to create a new message.
 */
export declare const GetMcpInstanceAuthStateResponseSchema: GenMessage<GetMcpInstanceAuthStateResponse>;
/**
 * @generated from message scalekit.v1.mcp.McpInstance
 */
export type McpInstance = Message<"scalekit.v1.mcp.McpInstance"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string user_identifier = 3;
     */
    userIdentifier: string;
    /**
     * @generated from field: scalekit.v1.mcp.McpConfig config = 4;
     */
    config?: McpConfig | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp last_used_at = 5;
     */
    lastUsedAt?: Timestamp | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 6;
     */
    updatedAt?: Timestamp | undefined;
    /**
     * @generated from field: string url = 7;
     */
    url: string;
};
/**
 * Describes the message scalekit.v1.mcp.McpInstance.
 * Use `create(McpInstanceSchema)` to create a new message.
 */
export declare const McpInstanceSchema: GenMessage<McpInstance>;
/**
 * @generated from message scalekit.v1.mcp.McpConfig
 */
export type McpConfig = Message<"scalekit.v1.mcp.McpConfig"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * @generated from field: repeated scalekit.v1.mcp.McpConfigConnectionToolMapping connection_tool_mappings = 4;
     */
    connectionToolMappings: McpConfigConnectionToolMapping[];
    /**
     * @generated from field: string mcp_server_url = 5;
     */
    mcpServerUrl: string;
};
/**
 * Describes the message scalekit.v1.mcp.McpConfig.
 * Use `create(McpConfigSchema)` to create a new message.
 */
export declare const McpConfigSchema: GenMessage<McpConfig>;
/**
 * @generated from message scalekit.v1.mcp.McpConfigConnectionToolMapping
 */
export type McpConfigConnectionToolMapping = Message<"scalekit.v1.mcp.McpConfigConnectionToolMapping"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string connection_name = 2;
     */
    connectionName: string;
    /**
     * @generated from field: string provider = 3;
     */
    provider: string;
    /**
     * @generated from field: repeated string tools = 4;
     */
    tools: string[];
    /**
     * @generated from field: optional string connected_account_id = 5;
     */
    connectedAccountId?: string | undefined;
    /**
     * @generated from field: optional string connected_account_status = 6;
     */
    connectedAccountStatus?: string | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.McpConfigConnectionToolMapping.
 * Use `create(McpConfigConnectionToolMappingSchema)` to create a new message.
 */
export declare const McpConfigConnectionToolMappingSchema: GenMessage<McpConfigConnectionToolMapping>;
/**
 * @generated from message scalekit.v1.mcp.CreateMcpSessionTokenRequest
 */
export type CreateMcpSessionTokenRequest = Message<"scalekit.v1.mcp.CreateMcpSessionTokenRequest"> & {
    /**
     * @generated from field: string mcp_config_id = 1;
     */
    mcpConfigId: string;
    /**
     * @generated from field: string identifier = 2;
     */
    identifier: string;
    /**
     * @generated from field: google.protobuf.Duration expiry = 3;
     */
    expiry?: Duration | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.CreateMcpSessionTokenRequest.
 * Use `create(CreateMcpSessionTokenRequestSchema)` to create a new message.
 */
export declare const CreateMcpSessionTokenRequestSchema: GenMessage<CreateMcpSessionTokenRequest>;
/**
 * @generated from message scalekit.v1.mcp.CreateMcpSessionTokenResponse
 */
export type CreateMcpSessionTokenResponse = Message<"scalekit.v1.mcp.CreateMcpSessionTokenResponse"> & {
    /**
     * @generated from field: string token = 1;
     */
    token: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 2;
     */
    expiresAt?: Timestamp | undefined;
};
/**
 * Describes the message scalekit.v1.mcp.CreateMcpSessionTokenResponse.
 * Use `create(CreateMcpSessionTokenResponseSchema)` to create a new message.
 */
export declare const CreateMcpSessionTokenResponseSchema: GenMessage<CreateMcpSessionTokenResponse>;
/**
 * @generated from service scalekit.v1.mcp.McpService
 */
export declare const McpService: GenService<{
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.CreateMcp
     */
    createMcp: {
        methodKind: "unary";
        input: typeof CreateMcpRequestSchema;
        output: typeof CreateMcpResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.GetMcp
     */
    getMcp: {
        methodKind: "unary";
        input: typeof GetMcpRequestSchema;
        output: typeof GetMcpResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.ListMcp
     */
    listMcp: {
        methodKind: "unary";
        input: typeof ListMcpRequestSchema;
        output: typeof ListMcpResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.DeleteMcp
     */
    deleteMcp: {
        methodKind: "unary";
        input: typeof DeleteMcpRequestSchema;
        output: typeof DeleteMcpResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.CreateMcpConfig
     */
    createMcpConfig: {
        methodKind: "unary";
        input: typeof CreateMcpConfigRequestSchema;
        output: typeof CreateMcpConfigResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.UpdateMcpConfig
     */
    updateMcpConfig: {
        methodKind: "unary";
        input: typeof UpdateMcpConfigRequestSchema;
        output: typeof UpdateMcpConfigResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.ListMcpConfigs
     */
    listMcpConfigs: {
        methodKind: "unary";
        input: typeof ListMcpConfigsRequestSchema;
        output: typeof ListMcpConfigsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.GetMcpConfig
     */
    getMcpConfig: {
        methodKind: "unary";
        input: typeof GetMcpConfigRequestSchema;
        output: typeof GetMcpConfigResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.DeleteMcpConfig
     */
    deleteMcpConfig: {
        methodKind: "unary";
        input: typeof DeleteMcpConfigRequestSchema;
        output: typeof DeleteMcpConfigResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.EnsureMcpInstance
     */
    ensureMcpInstance: {
        methodKind: "unary";
        input: typeof EnsureMcpInstanceRequestSchema;
        output: typeof EnsureMcpInstanceResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.ListMcpInstances
     */
    listMcpInstances: {
        methodKind: "unary";
        input: typeof ListMcpInstancesRequestSchema;
        output: typeof ListMcpInstancesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.DeleteMcpInstance
     */
    deleteMcpInstance: {
        methodKind: "unary";
        input: typeof DeleteMcpInstanceRequestSchema;
        output: typeof DeleteMcpInstanceResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.UpdateMcpInstance
     */
    updateMcpInstance: {
        methodKind: "unary";
        input: typeof UpdateMcpInstanceRequestSchema;
        output: typeof UpdateMcpInstanceResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.GetMcpInstance
     */
    getMcpInstance: {
        methodKind: "unary";
        input: typeof GetMcpInstanceRequestSchema;
        output: typeof GetMcpInstanceResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.GetMcpInstanceAuthState
     */
    getMcpInstanceAuthState: {
        methodKind: "unary";
        input: typeof GetMcpInstanceAuthStateRequestSchema;
        output: typeof GetMcpInstanceAuthStateResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.CreateMcpSessionToken
     */
    createMcpSessionToken: {
        methodKind: "unary";
        input: typeof CreateMcpSessionTokenRequestSchema;
        output: typeof CreateMcpSessionTokenResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.mcp.McpService.ListMcpConnectedAccounts
     */
    listMcpConnectedAccounts: {
        methodKind: "unary";
        input: typeof ListMcpConnectedAccountsRequestSchema;
        output: typeof ListMcpConnectedAccountsResponseSchema;
    };
}>;
