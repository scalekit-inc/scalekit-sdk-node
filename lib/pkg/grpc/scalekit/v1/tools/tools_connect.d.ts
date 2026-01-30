import { CreateToolRequest, CreateToolResponse, DeleteToolRequest, ExecuteToolRequest, ExecuteToolResponse, ListScopedToolsRequest, ListScopedToolsResponse, ListToolsRequest, ListToolsResponse, SetToolDefaultRequest, SetToolDefaultResponse, UpdateToolRequest, UpdateToolResponse } from "./tools_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.tools.ToolService
 */
export declare const ToolService: {
    readonly typeName: "scalekit.v1.tools.ToolService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.tools.ToolService.CreateTool
         */
        readonly createTool: {
            readonly name: "CreateTool";
            readonly I: typeof CreateToolRequest;
            readonly O: typeof CreateToolResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.tools.ToolService.ListTools
         */
        readonly listTools: {
            readonly name: "ListTools";
            readonly I: typeof ListToolsRequest;
            readonly O: typeof ListToolsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.tools.ToolService.ListScopedTools
         */
        readonly listScopedTools: {
            readonly name: "ListScopedTools";
            readonly I: typeof ListScopedToolsRequest;
            readonly O: typeof ListScopedToolsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.tools.ToolService.SetToolDefault
         */
        readonly setToolDefault: {
            readonly name: "SetToolDefault";
            readonly I: typeof SetToolDefaultRequest;
            readonly O: typeof SetToolDefaultResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.tools.ToolService.UpdateTool
         */
        readonly updateTool: {
            readonly name: "UpdateTool";
            readonly I: typeof UpdateToolRequest;
            readonly O: typeof UpdateToolResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.tools.ToolService.DeleteTool
         */
        readonly deleteTool: {
            readonly name: "DeleteTool";
            readonly I: typeof DeleteToolRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Execute Tool
         *
         * @generated from rpc scalekit.v1.tools.ToolService.ExecuteTool
         */
        readonly executeTool: {
            readonly name: "ExecuteTool";
            readonly I: typeof ExecuteToolRequest;
            readonly O: typeof ExecuteToolResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
