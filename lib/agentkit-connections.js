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
exports.AgentKitConnections = void 0;
exports.toRef = toRef;
const protobuf_1 = require("@bufbuild/protobuf");
const wkt_1 = require("@bufbuild/protobuf/wkt");
const errors_1 = require("./errors");
const agentkit_connection_exceptions_1 = require("./errors/agentkit-connection-exceptions");
const connections_pb_1 = require("./pkg/grpc/scalekit/v1/connections/connections_pb");
const AUTH_MODES = {
    USER: connections_pb_1.ConnectionAuthMode.USER,
    ORG_WIDE: connections_pb_1.ConnectionAuthMode.ORG_WIDE,
};
const TOKEN_AUTH_METHODS = {
    NONE: connections_pb_1.AppOAuthConfig_TokenEndpointAuthMethod.NONE,
    BASIC_AUTH: connections_pb_1.AppOAuthConfig_TokenEndpointAuthMethod.BASIC_AUTH,
    REQUEST_BODY: connections_pb_1.AppOAuthConfig_TokenEndpointAuthMethod.REQUEST_BODY,
    DEFAULT: connections_pb_1.AppOAuthConfig_TokenEndpointAuthMethod.DEFAULT,
};
const CONNECTION_ID = /^conn_\d+$/;
/** A string that looks like `conn_<digits>` is an ID; anything else is a name. An object is used as given. */
function toRef(connection) {
    if (typeof connection !== 'string')
        return connection;
    const value = connection.trim();
    return CONNECTION_ID.test(value)
        ? { connectionId: value }
        : { connectionName: value };
}
function invalid(message) {
    return new errors_1.ScalekitValidationError(message);
}
function pick(source, keys) {
    const out = {};
    for (const key of keys) {
        if (source[key] !== undefined)
            out[key] = source[key];
    }
    return out;
}
function providerConfigurations(settings) {
    return (0, protobuf_1.create)(connections_pb_1.AppProviderConfigurationsSchema, pick(settings, [
        'providerDomain',
        'slackConnectionType',
        'googleadsDeveloperToken',
        'microsoftTenantId',
        'trelloAppName',
        'smartFhirAud',
        'smartFhirDomain',
    ]));
}
/** Builds the OAuth message and records the list/map settings that are sent empty, which the server clears. */
function oauthConfig(settings, cleared) {
    var _a, _b, _c;
    const { optionalScopes, extraAuthorizeParams, tokenEndpointAuthMethod, scopes, requiredScopes, requiredOptionalScopes, } = settings;
    if (tokenEndpointAuthMethod !== undefined) {
        if (!(tokenEndpointAuthMethod in TOKEN_AUTH_METHODS)) {
            throw invalid('tokenEndpointAuthMethod must be one of NONE, BASIC_AUTH, REQUEST_BODY or DEFAULT');
        }
    }
    if ((scopes === null || scopes === void 0 ? void 0 : scopes.length) === 0)
        cleared.push('oauth_config.scopes');
    if ((requiredScopes === null || requiredScopes === void 0 ? void 0 : requiredScopes.length) === 0) {
        cleared.push('oauth_config.required_scopes');
    }
    if ((requiredOptionalScopes === null || requiredOptionalScopes === void 0 ? void 0 : requiredOptionalScopes.length) === 0) {
        cleared.push('oauth_config.required_optional_scopes');
    }
    if (((_a = optionalScopes === null || optionalScopes === void 0 ? void 0 : optionalScopes.scopes) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        cleared.push('oauth_config.optional_scopes.scopes');
    }
    if (extraAuthorizeParams && Object.keys(extraAuthorizeParams).length === 0) {
        cleared.push('oauth_config.extra_authorize_params');
    }
    return (0, protobuf_1.create)(connections_pb_1.AppOAuthConfigSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, pick(settings, [
        'authorizeUri',
        'tokenUri',
        'userInfoUri',
        'clientId',
        'clientSecret',
        'pkceEnabled',
        'prompt',
        'useScalekitCreds',
        'accessType',
        'tokenAccessType',
        'scopeSelectionAllowed',
    ])), (scopes && { scopes })), (requiredScopes && { requiredScopes })), (requiredOptionalScopes && { requiredOptionalScopes })), (extraAuthorizeParams && { extraAuthorizeParams })), (optionalScopes && {
        optionalScopes: (0, protobuf_1.create)(connections_pb_1.OptionalScopesSchema, {
            scopes: (_b = optionalScopes.scopes) !== null && _b !== void 0 ? _b : [],
            fieldName: (_c = optionalScopes.fieldName) !== null && _c !== void 0 ? _c : '',
        }),
    })), (tokenEndpointAuthMethod !== undefined && {
        tokenEndpointAuthMethod: TOKEN_AUTH_METHODS[tokenEndpointAuthMethod],
    })));
}
function googleDwdConfig(settings, cleared) {
    var _a, _b;
    if (((_a = settings.scopes) === null || _a === void 0 ? void 0 : _a.length) === 0)
        cleared.push('google_dwd_config.scopes');
    if (((_b = settings.requiredScopes) === null || _b === void 0 ? void 0 : _b.length) === 0) {
        cleared.push('google_dwd_config.required_scopes');
    }
    return (0, protobuf_1.create)(connections_pb_1.GoogleDWDConfigSchema, Object.assign(Object.assign(Object.assign({}, pick(settings, [
        'serviceAccountJson',
        'tokenUri',
        'scopeSelectionAllowed',
    ])), (settings.scopes && { scopes: settings.scopes })), (settings.requiredScopes && { requiredScopes: settings.requiredScopes })));
}
/**
 * AgentKit connection methods behind `scalekit.actions.createConnection` and friends.
 * They call the AgentKit-only connection APIs (`/api/v1/agentkit/connection`) for create, get, list and
 * update, and the environment connection RPCs for enable, disable and delete.
 * @internal
 */
class AgentKitConnections {
    constructor(connection) {
        this.connection = connection;
    }
    create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const provider = ((_a = params === null || params === void 0 ? void 0 : params.provider) !== null && _a !== void 0 ? _a : '').trim();
            if (!provider) {
                throw invalid("provider is required, for example 'GMAIL'.");
            }
            if (params.authMode !== undefined && !(params.authMode in AUTH_MODES)) {
                throw invalid("authMode must be 'USER' or 'ORG_WIDE'");
            }
            const request = (0, protobuf_1.create)(connections_pb_1.CreateAppConnectionRequestSchema, {
                connection: (0, protobuf_1.create)(connections_pb_1.CreateAppConnectionSchema, Object.assign(Object.assign(Object.assign({ provider }, (params.connectionName !== undefined && {
                    connectionName: params.connectionName,
                })), (params.authMode !== undefined && {
                    authMode: AUTH_MODES[params.authMode],
                })), (params.providerDomain !== undefined && {
                    providerConfigurations: providerConfigurations({
                        providerDomain: params.providerDomain,
                    }),
                }))),
            });
            try {
                const response = yield this.connection.createAppConnection(request);
                return response.connection;
            }
            catch (error) {
                throw (0, agentkit_connection_exceptions_1.toAgentKitConnectionError)(error, 'write');
            }
        });
    }
    get(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const identifier = this.identifierOf(ref);
            try {
                const response = yield this.connection.getAppConnection(identifier);
                return response.connection;
            }
            catch (error) {
                throw (0, agentkit_connection_exceptions_1.toAgentKitConnectionError)(error, 'read');
            }
        });
    }
    list(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((params === null || params === void 0 ? void 0 : params.query) !== undefined && params.query.trim().length < 3) {
                throw invalid('query needs at least 3 characters');
            }
            try {
                return yield this.connection.listAppConnectionSummaries(params);
            }
            catch (error) {
                throw (0, agentkit_connection_exceptions_1.toAgentKitConnectionError)(error, 'read');
            }
        });
    }
    update(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = [params.oauth, params.googleDwd, params.staticConfig].filter((group) => group !== undefined);
            if (groups.length > 1) {
                throw invalid('send only one of oauth, googleDwd or staticConfig');
            }
            if (groups.length === 0 &&
                params.providerConfigurations === undefined &&
                params.newConnectionName === undefined) {
                throw invalid('nothing to update: pass oauth, googleDwd, staticConfig, providerConfigurations or newConnectionName');
            }
            const cleared = [];
            const body = (0, protobuf_1.create)(connections_pb_1.AppConnectionUpdateSchema, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (params.oauth && { oauthConfig: oauthConfig(params.oauth, cleared) })), (params.googleDwd && {
                googleDwdConfig: googleDwdConfig(params.googleDwd, cleared),
            })), (params.staticConfig && {
                staticConfig: (0, protobuf_1.create)(connections_pb_1.StaticAuthConfigSchema, {
                    staticConfig: params.staticConfig,
                }),
            })), (params.providerConfigurations && {
                providerConfigurations: providerConfigurations(params.providerConfigurations),
            })), (params.newConnectionName !== undefined && {
                connectionName: params.newConnectionName,
            })));
            const connectionId = yield this.idOf(params);
            // The SDK talks gRPC, so the gateway does not derive the mask from the body. The server clears a
            // list or map only when it is sent empty and its path is in the mask; everything else is a partial merge.
            const request = (0, protobuf_1.create)(connections_pb_1.UpdateAppConnectionRequestSchema, Object.assign({ connectionId, connection: body }, (cleared.length > 0 && {
                updateMask: (0, protobuf_1.create)(wkt_1.FieldMaskSchema, { paths: cleared }),
            })));
            try {
                const response = yield this.connection.updateAppConnection(request);
                return response.connection;
            }
            catch (error) {
                throw (0, agentkit_connection_exceptions_1.toAgentKitConnectionError)(error, 'write');
            }
        });
    }
    /** Enables or disables a connection and returns the new enabled state. */
    setEnabled(ref, enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionId = yield this.idOf(ref);
            try {
                const response = yield this.connection.toggleEnvironmentConnection(connectionId, enabled);
                return response.enabled;
            }
            catch (error) {
                throw (0, agentkit_connection_exceptions_1.toAgentKitConnectionError)(error, 'write');
            }
        });
    }
    delete(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionId = yield this.idOf(ref);
            try {
                yield this.connection.deleteEnvironmentConnection(connectionId);
            }
            catch (error) {
                throw (0, agentkit_connection_exceptions_1.toAgentKitConnectionError)(error, 'write');
            }
        });
    }
    identifierOf(ref) {
        var _a, _b;
        if (typeof ref === 'string') {
            if (!ref.trim())
                throw invalid('connection name or id is required');
            return ref.trim();
        }
        const name = (_a = ref === null || ref === void 0 ? void 0 : ref.connectionName) === null || _a === void 0 ? void 0 : _a.trim();
        const id = (_b = ref === null || ref === void 0 ? void 0 : ref.connectionId) === null || _b === void 0 ? void 0 : _b.trim();
        if (name && id) {
            throw invalid('pass connectionName or connectionId, not both');
        }
        if (!name && !id)
            throw invalid('connectionName or connectionId is required');
        return (name || id);
    }
    /** The connection ID: validated when given, resolved with one read when only a name is given. */
    idOf(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const identifier = this.identifierOf(ref);
            if (ref.connectionId) {
                if (!CONNECTION_ID.test(identifier)) {
                    throw invalid('connectionId is not valid; connection ids look like conn_...');
                }
                return identifier;
            }
            return (yield this.get(identifier)).id;
        });
    }
}
exports.AgentKitConnections = AgentKitConnections;
//# sourceMappingURL=agentkit-connections.js.map