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
const tools_connect_1 = require("./pkg/grpc/scalekit/v1/tools/tools_connect");
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
        this.client = this.grpcConnect.createClient(tools_connect_1.ToolService);
    }
    /**
     * Lists tools available in your workspace with optional filtering and pagination.
     *
     * @param options Optional filter and pagination parameters
     * @param options.filter Filter configuration matching the `Filter` proto message.
     *                       Use this to filter by provider, identifier, or tool names.
     * @param options.pageSize Maximum number of tools to return per page.
     * @param options.pageToken Token from a previous `listTools` response for pagination.
     */
    listTools(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {};
            if (options === null || options === void 0 ? void 0 : options.filter) {
                request.filter = options.filter;
            }
            if ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined) {
                request.pageSize = options.pageSize;
            }
            if (options === null || options === void 0 ? void 0 : options.pageToken) {
                request.pageToken = options.pageToken;
            }
            return this.coreClient.connectExec(this.client.listTools, request);
        });
    }
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
    listScopedTools(identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                identifier,
            };
            if (options === null || options === void 0 ? void 0 : options.filter) {
                request.filter = options.filter;
            }
            if ((options === null || options === void 0 ? void 0 : options.pageSize) !== undefined) {
                request.pageSize = options.pageSize;
            }
            if (options === null || options === void 0 ? void 0 : options.pageToken) {
                request.pageToken = options.pageToken;
            }
            return this.coreClient.connectExec(this.client.listScopedTools, request);
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
     */
    executeTool(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { toolName, identifier, params: toolParams, connectedAccountId, connector, organizationId, userId, } = params;
            const request = {
                toolName,
            };
            if (identifier) {
                request.identifier = identifier;
            }
            if (toolParams) {
                // `google.protobuf.Struct` messages in bufbuild accept plain JSON objects.
                request.params = toolParams;
            }
            if (connectedAccountId) {
                request.connectedAccountId = connectedAccountId;
            }
            if (connector) {
                request.connector = connector;
            }
            if (organizationId) {
                request.organizationId = organizationId;
            }
            if (userId) {
                request.userId = userId;
            }
            return this.coreClient.connectExec(this.client.executeTool, request);
        });
    }
}
exports.default = ToolsClient;
//# sourceMappingURL=tools.js.map