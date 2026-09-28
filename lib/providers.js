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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const protobuf_1 = require("@bufbuild/protobuf");
const wkt_1 = require("@bufbuild/protobuf/wkt");
const providers_pb_1 = require("./pkg/grpc/scalekit/v1/providers/providers_pb");
/**
 * Client for bring-your-own connectors (custom providers).
 *
 * A custom connector puts a service Scalekit does not ship in front of the same
 * machinery as a built-in one: users connect an account, you call it through
 * `actions.request`, and Scalekit injects the credentials.
 *
 * Mirrors Python's `actions.providers`, including the preview status of
 * {@link listProviders} — see that method before you depend on it.
 */
class ProvidersClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(providers_pb_1.ProviderService);
    }
    /**
     * Creates a custom connector.
     *
     * @param params.displayName Human-readable name. Letters, digits and spaces only.
     *                           Suffix it with "MCP" when the connector fronts an MCP server.
     * @param params.proxyUrl Base HTTPS URL of the upstream service.
     * @param params.proxyEnabled Whether Scalekit proxies requests. Defaults to true.
     * @param params.authPatterns How users authenticate. Exactly one pattern is
     *                            supported today; the array is for future use.
     * @returns `provider.identifier` on the response is the id you pass to
     *          {@link updateCustomProvider} and {@link deleteCustomProvider}.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    createCustomProvider(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const provider = (0, protobuf_1.create)(providers_pb_1.CreateCustomProviderSchema, Object.assign(Object.assign(Object.assign({ displayName: params.displayName, description: (_a = params.description) !== null && _a !== void 0 ? _a : '', proxyUrl: params.proxyUrl, proxyEnabled: (_b = params.proxyEnabled) !== null && _b !== void 0 ? _b : true }, (params.iconSrc !== undefined && { iconSrc: params.iconSrc })), (params.metadata && { metadata: params.metadata })), (params.authPatterns && {
                authPatterns: toListValue(params.authPatterns),
            })));
            const response = yield this.coreClient.connectExec(this.client.createCustomProvider, (0, protobuf_1.create)(providers_pb_1.CreateCustomProviderRequestSchema, { provider }));
            return { provider: toProvider(response.provider) };
        });
    }
    /**
     * Updates a custom connector.
     *
     * `displayName`, `proxyUrl` and `authPatterns` are all required by the server on
     * every update, even when unchanged — omitting `authPatterns` fails with
     * `[invalid_argument] Validation error`. Read the current connector with
     * {@link listProviders} first and send its values back; `provider.authPatterns`
     * from that response can be passed here as-is. `authPatterns` replaces the
     * whole list rather than merging into it.
     *
     * @param params.identifier From `provider.identifier` on a create or list response.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    updateCustomProvider(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = (0, protobuf_1.create)(providers_pb_1.UpdateCustomProviderSchema, Object.assign(Object.assign(Object.assign(Object.assign({ displayName: params.displayName, proxyUrl: params.proxyUrl }, (params.description !== undefined && {
                description: params.description,
            })), (params.iconSrc !== undefined && { iconSrc: params.iconSrc })), (params.metadata && { metadata: params.metadata })), { authPatterns: toListValue(params.authPatterns) }));
            const response = yield this.coreClient.connectExec(this.client.updateCustomProvider, (0, protobuf_1.create)(providers_pb_1.UpdateCustomProviderRequestSchema, {
                identifier: params.identifier,
                provider,
            }));
            return { provider: toProvider(response.provider) };
        });
    }
    /**
     * Deletes a custom connector.
     *
     * Remove the connector's connections and connected accounts first; the server
     * refuses to delete one that is still in use.
     *
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    deleteCustomProvider(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.deleteCustomProvider, (0, protobuf_1.create)(providers_pb_1.DeleteProviderRequestSchema, { identifier }));
        });
    }
    /**
     * Lists connectors, built-in and custom.
     *
     * Use it to find a connector's `identifier` before updating or deleting it.
     *
     * PREVIEW — the underlying `ListProviders` RPC is marked preview in the API and
     * may change. It is exposed because create, update and delete are generally
     * available but need an identifier this is the only way to discover. The Python
     * SDK wraps the same RPC at `actions.providers.list_providers`.
     *
     * @param params.providerType Filter by kind: `ProviderType.CUSTOM` for your own
     *                            connectors, `ProviderType.ALL` for built-ins and
     *                            custom together. Omitting it behaves like
     *                            `ProviderType.DEFAULT` and returns built-ins only,
     *                            so pass `CUSTOM` or `ALL` to find a custom
     *                            connector's identifier.
     * @throws {ScalekitServerException} If a network or server error occurs.
     */
    listProviders(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const response = yield this.coreClient.connectExec(this.client.listProviders, (0, protobuf_1.create)(providers_pb_1.ListProvidersRequestSchema, Object.assign({ identifier: (_a = params === null || params === void 0 ? void 0 : params.identifier) !== null && _a !== void 0 ? _a : '', pageSize: (_b = params === null || params === void 0 ? void 0 : params.pageSize) !== null && _b !== void 0 ? _b : 0, pageToken: (_c = params === null || params === void 0 ? void 0 : params.pageToken) !== null && _c !== void 0 ? _c : '' }, ((params === null || params === void 0 ? void 0 : params.providerType) !== undefined && {
                filter: (0, protobuf_1.create)(providers_pb_1.ListProvidersRequest_FilterSchema, {
                    providerType: params.providerType,
                }),
            }))));
            return {
                providers: response.providers.map((p) => toProvider(p)),
                nextPageToken: response.nextPageToken,
                prevPageToken: response.prevPageToken,
                totalSize: response.totalSize,
            };
        });
    }
}
exports.default = ProvidersClient;
/**
 * Auth patterns cross the wire as a `google.protobuf.ListValue` of arbitrary JSON,
 * so they are parsed from plain objects rather than built from a generated message
 * type. Python does the same thing via `ParseDict`.
 */
function toListValue(patterns) {
    return (0, protobuf_1.fromJson)(wkt_1.ListValueSchema, patterns);
}
/**
 * Decodes a provider's `authPatterns` from `ListValue` into plain objects, the
 * reverse of {@link toListValue}. Python does the same via `MessageToDict`.
 */
function toProvider(message) {
    if (!message)
        return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $typeName, authPatterns } = message, fields = __rest(message, ["$typeName", "authPatterns"]);
    return Object.assign(Object.assign({}, fields), { authPatterns: fromListValue(authPatterns) });
}
function fromListValue(value) {
    return value ? (0, protobuf_1.toJson)(wkt_1.ListValueSchema, value) : [];
}
//# sourceMappingURL=providers.js.map