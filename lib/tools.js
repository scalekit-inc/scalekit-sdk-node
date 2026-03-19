"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const protobuf_1 = require("@bufbuild/protobuf");
const tools_pb_1 = require("./pkg/grpc/scalekit/v1/tools/tools_pb");
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
class ToolsClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(tools_pb_1.ToolService);
    }
    /**
     * Lists tools available in your workspace with optional filtering and pagination.
     *
     * @param options Optional filter and pagination parameters
     * @param options.filter Filter configuration. Supports `provider`, `identifier`, `toolName`, `summary`, and `query` fields.
     *                       Use `query` to do a text search across tool metadata (names, descriptions, identifiers).
     * @param options.pageSize Maximum number of tools to return per page.
     * @param options.pageToken Token from a previous `listTools` response for pagination.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listTools(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listTools, (0, protobuf_1.create)(tools_pb_1.ListToolsRequestSchema, Object.assign(Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.filter) && {
                filter: (0, protobuf_1.create)(tools_pb_1.FilterSchema, options.filter),
            })), ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined && { pageSize: options.pageSize })), ((options === null || options === void 0 ? void 0 : options.pageToken) && { pageToken: options.pageToken }))));
        });
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
    listScopedTools(identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listScopedTools, (0, protobuf_1.create)(tools_pb_1.ListScopedToolsRequestSchema, Object.assign(Object.assign({ identifier, filter: (0, protobuf_1.create)(tools_pb_1.ScopedToolFilterSchema, options.filter) }, (options.pageSize !== undefined && { pageSize: options.pageSize })), (options.pageToken && { pageToken: options.pageToken }))));
        });
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
    listAvailableTools(identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.listAvailableTools, (0, protobuf_1.create)(tools_pb_1.ListAvailableToolsRequestSchema, Object.assign(Object.assign({ identifier }, ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined && { pageSize: options.pageSize })), ((options === null || options === void 0 ? void 0 : options.pageToken) && { pageToken: options.pageToken }))));
        });
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
    executeTool(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { toolName, identifier, params: toolParams, connectedAccountId, connector, organizationId, userId, } = params;
            return this.coreClient.connectExec(this.client.executeTool, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ toolName }, (identifier && { identifier })), (toolParams && { params: toolParams })), (connectedAccountId && { connectedAccountId })), (connector && { connector })), (organizationId && { organizationId })), (userId && { userId })));
        });
    }
}
exports.default = ToolsClient;
//# sourceMappingURL=tools.js.map