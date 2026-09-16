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
const tools_pb_1 = require("./pkg/grpc/scalekit/v1/tools/tools_pb");
const connected_accounts_pb_1 = require("./pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb");
/**
 * AgentKit bound to one end user. Created by `scalekit.forUser(identifier)`.
 *
 * Nothing here is new capability — every method composes calls that already
 * exist on `actions` and `tools`. What it removes is the repetition: carrying
 * one identifier across three clients, comparing a numeric status enum by hand,
 * filtering search results by readiness, and unwrapping a tool payload.
 *
 * The SDK exposes five top-level clients with eight duplicated methods between
 * them, so there is no obvious place to start. This is the obvious place to
 * start. Drop back to `actions`/`tools` whenever you need something it does not
 * cover; the two styles mix freely.
 */
class UserScope {
    constructor(identifier, actions, tools) {
        this.identifier = identifier;
        this.actions = actions;
        this.tools = tools;
    }
    /**
     * Returns this user's state for a connection, with a link if action is needed.
     *
     * Composes `actions.getOrCreateConnectedAccount` and, when the account is not
     * yet active, `actions.getAuthorizationLink`. Executes nothing.
     *
     * @param connectionName Connection name exactly as it appears in the dashboard
     *                       under **AgentKit > Connections**. Case-sensitive.
     * @returns Check `.isActive`; when false, send `.authorizationLink` to the
     *          user and call again once they finish.
     */
    ensureConnected(connectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.actions.getOrCreateConnectedAccount({
                connectionName,
                identifier: this.identifier,
            });
            const account = response.connectedAccount;
            const status = ((_a = account === null || account === void 0 ? void 0 : account.status) !== null && _a !== void 0 ? _a : connected_accounts_pb_1.ConnectorStatus.CONNECTION_STATUS_UNSPECIFIED);
            if (status === connected_accounts_pb_1.ConnectorStatus.ACTIVE) {
                return {
                    connectionName,
                    status,
                    isActive: true,
                    connectedAccountId: account === null || account === void 0 ? void 0 : account.id,
                };
            }
            const link = yield this.actions.getAuthorizationLink({
                connectionName,
                identifier: this.identifier,
            });
            return {
                connectionName,
                status,
                isActive: false,
                connectedAccountId: account === null || account === void 0 ? void 0 : account.id,
                authorizationLink: link.link,
            };
        });
    }
    /**
     * Finds tools that fit a goal and that this user can actually call.
     *
     * Composes `tools.searchTools` and keeps only results with a connection in the
     * READY state, pairing each with the account id to execute against. Results
     * needing connection or re-auth are dropped — resolve those with
     * {@link ensureConnected} first.
     *
     * Prefer this over listing a whole connector: binding 217 tools to a model is
     * roughly 85k tokens of schema per request and measurably worsens selection.
     *
     * @param goal The job to be done, in plain language.
     * @param limit Maximum ranked results to consider. Defaults to 5.
     * @returns Ready tools, best match first. May be empty.
     */
    findTools(goal_1) {
        return __awaiter(this, arguments, void 0, function* (goal, limit = 5) {
            const response = yield this.tools.searchTools(goal, {
                identifier: this.identifier,
                topK: limit,
            });
            const ready = [];
            for (const tool of response.tools) {
                const connection = tool.connections.find((c) => c.readinessState === tools_pb_1.ToolReadinessState.READY);
                if (connection) {
                    ready.push({
                        name: tool.name,
                        connectedAccountId: connection.connectedAccountId,
                        connectionName: connection.connectionName,
                        provider: tool.provider,
                        score: tool.score,
                        description: tool.description,
                    });
                }
            }
            return ready;
        });
    }
    /**
     * Executes a tool for this user and returns the payload.
     *
     * Composes `actions.executeTool`. Results cross the wire as a protobuf
     * `Struct`, so a list-returning tool arrives wrapped as `{ array: [...] }`;
     * this unwraps that so you get the array directly. Every number in the payload
     * is a float as a result of that encoding — cast before formatting.
     *
     * Pass `connectedAccountId` (from {@link findTools}) when you have it.
     * Otherwise supply `connectionName` and the account is resolved from this
     * scope's identifier.
     *
     * @returns The tool's payload. Use `actions.executeTool` directly if you also
     *          need the execution id.
     */
    run(toolName_1) {
        return __awaiter(this, arguments, void 0, function* (toolName, inputs = {}, options) {
            const response = yield this.actions.executeTool(Object.assign({ toolName, toolInput: inputs }, ((options === null || options === void 0 ? void 0 : options.connectedAccountId)
                ? { connectedAccountId: options.connectedAccountId }
                : Object.assign({ identifier: this.identifier }, ((options === null || options === void 0 ? void 0 : options.connectionName) && {
                    connector: options.connectionName,
                })))));
            const data = response.data;
            if (data && !Array.isArray(data)) {
                const keys = Object.keys(data);
                if (keys.length === 1 && keys[0] === 'array') {
                    return data.array;
                }
            }
            return data;
        });
    }
}
exports.default = UserScope;
//# sourceMappingURL=agent.js.map