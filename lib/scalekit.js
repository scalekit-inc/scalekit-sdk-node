"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jose = __importStar(require("jose"));
const qs_1 = __importDefault(require("qs"));
const connection_1 = __importDefault(require("./connection"));
const user_1 = require("./constants/user");
const connect_1 = __importDefault(require("./connect"));
const core_1 = __importDefault(require("./core"));
const organization_1 = __importDefault(require("./organization"));
const scalekit_1 = require("./types/scalekit");
const authorizeEndpoint = "oauth/authorize";
class Scalekit {
    constructor(envUrl, clientId, clientSecret) {
        this.envUrl = envUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.coreClient = new core_1.default(this.envUrl, this.clientId, this.clientSecret);
        this.grpcConnect = new connect_1.default(this.envUrl, this.coreClient);
        this.organization = new organization_1.default(this.grpcConnect, this.coreClient);
        this.connection = new connection_1.default(this.grpcConnect, this.coreClient);
    }
    getAuthorizationUrl(redirectUri, options) {
        var _a;
        const defaultOptions = {
            scopes: ['openid', 'profile']
        };
        options = Object.assign(Object.assign({}, defaultOptions), options);
        const qs = qs_1.default.stringify(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ response_type: 'code', client_id: this.clientId, redirect_uri: redirectUri, scope: (_a = options.scopes) === null || _a === void 0 ? void 0 : _a.join(" ") }, (options.state && { state: options.state })), (options.nonce && { state: options.nonce })), (options.loginHint && { login_hint: options.loginHint })), (options.domainHint && { domain_hint: options.domainHint })), (options.connectionId && { connection_id: options.connectionId })), (options.organizationId && { organization_id: options.organizationId })));
        return `${this.envUrl}/${authorizeEndpoint}?${qs}`;
    }
    authenticateWithCode(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.coreClient.authenticate(qs_1.default.stringify(Object.assign({ code: options.code, redirect_uri: options.redirectUri, grant_type: scalekit_1.GrantType.AuthorizationCode, client_id: this.clientId, client_secret: this.clientSecret }, (options.codeVerifier && { code_verifier: options.codeVerifier }))));
            const { id_token, access_token } = res.data;
            const claims = jose.decodeJwt(id_token);
            const user = {};
            for (const [k, v] of Object.entries(claims)) {
                user[user_1.IdTokenClaimToUserMap[k]] = v;
            }
            return {
                user,
                idToken: id_token,
                accessToken: access_token
            };
        });
    }
    validateAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.coreClient.getJwks();
            const JWKS = jose.createLocalJWKSet({
                keys: this.coreClient.keys
            });
            const { payload } = yield jose.jwtVerify(token, JWKS);
            return payload;
        });
    }
}
exports.default = Scalekit;
//# sourceMappingURL=scalekit.js.map