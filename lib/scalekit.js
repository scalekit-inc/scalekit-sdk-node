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
const crypto_1 = __importDefault(require("crypto"));
const jose = __importStar(require("jose"));
const qs_1 = __importDefault(require("qs"));
const connect_1 = __importDefault(require("./connect"));
const connection_1 = __importDefault(require("./connection"));
const user_1 = require("./constants/user");
const core_1 = __importDefault(require("./core"));
const directory_1 = __importDefault(require("./directory"));
const domain_1 = __importDefault(require("./domain"));
const organization_1 = __importDefault(require("./organization"));
const passwordless_1 = __importDefault(require("./passwordless"));
const scalekit_1 = require("./types/scalekit");
const authorizeEndpoint = "oauth/authorize";
const WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60; // 5 minutes
const WEBHOOK_SIGNATURE_VERSION = "v1";
/**
 * To initiate scalekit
 * @param {string} envUrl The environment url
 * @param {string} clientId The client id
 * @param {string} clientSecret The client secret
 * @returns {ScalekitClient} Returns the scalekit instance
 * @example
 * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
*/
class ScalekitClient {
    constructor(envUrl, clientId, clientSecret) {
        this.coreClient = new core_1.default(envUrl, clientId, clientSecret);
        this.grpcConnect = new connect_1.default(this.coreClient);
        this.organization = new organization_1.default(this.grpcConnect, this.coreClient);
        this.connection = new connection_1.default(this.grpcConnect, this.coreClient);
        this.domain = new domain_1.default(this.grpcConnect, this.coreClient);
        this.directory = new directory_1.default(this.grpcConnect, this.coreClient);
        this.passwordless = new passwordless_1.default(this.grpcConnect, this.coreClient);
    }
    /**
     * Returns the authorization url to initiate the authentication request.
     * @param {string} redirectUri Redirect uri
     * @param {AuthorizationUrlOptions} options Authorization url options
     * @param {string[]} options.scopes Scopes to request from the user
     * @param {string} options.state State parameter
     * @param {string} options.nonce Nonce parameter
     * @param {string} options.loginHint Login hint parameter
     * @param {string} options.domainHint Domain hint parameter
     * @param {string} options.connectionId Connection id parameter
     * @param {string} options.organizationId Organization id parameter
     * @param {string} options.provider Provider i.e. google, github, etc.
     * @param {string} options.codeChallenge Code challenge parameter in case of PKCE
     * @param {string} options.codeChallengeMethod Code challenge method parameter in case of PKCE
     *
     * @example
     * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
     * const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, { scopes: ['openid', 'profile'] });
     * @returns {string} authorization url
     */
    getAuthorizationUrl(redirectUri, options) {
        var _a;
        const defaultOptions = {
            scopes: ['openid', 'profile', 'email']
        };
        options = Object.assign(Object.assign({}, defaultOptions), options);
        const qs = qs_1.default.stringify(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ response_type: 'code', client_id: this.coreClient.clientId, redirect_uri: redirectUri, scope: (_a = options.scopes) === null || _a === void 0 ? void 0 : _a.join(" ") }, (options.state && { state: options.state })), (options.nonce && { nonce: options.nonce })), (options.loginHint && { login_hint: options.loginHint })), (options.domainHint && { domain_hint: options.domainHint })), (options.domainHint && { domain: options.domainHint })), (options.connectionId && { connection_id: options.connectionId })), (options.organizationId && { organization_id: options.organizationId })), (options.codeChallenge && { code_challenge: options.codeChallenge })), (options.codeChallengeMethod && { code_challenge_method: options.codeChallengeMethod })), (options.provider && { provider: options.provider })));
        return `${this.coreClient.envUrl}/${authorizeEndpoint}?${qs}`;
    }
    /**
     * Authenticate with the code
     * @param {string} code Code
     * @param {string} redirectUri Redirect uri
     * @param {AuthenticationOptions} options Code authentication options
     * @param {string} options.codeVerifier Code verifier in case of PKCE
     * @returns {Promise<AuthenticationResponse>} Returns user, id token and access token
     */
    authenticateWithCode(code, redirectUri, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.coreClient.authenticate(qs_1.default.stringify(Object.assign({ code: code, redirect_uri: redirectUri, grant_type: scalekit_1.GrantType.AuthorizationCode, client_id: this.coreClient.clientId, client_secret: this.coreClient.clientSecret }, ((options === null || options === void 0 ? void 0 : options.codeVerifier) && { code_verifier: options.codeVerifier }))));
            const { id_token, access_token, expires_in } = res.data;
            const claims = jose.decodeJwt(id_token);
            const user = {};
            for (const [k, v] of Object.entries(claims)) {
                if (user_1.IdTokenClaimToUserMap[k]) {
                    user[user_1.IdTokenClaimToUserMap[k]] = v;
                }
            }
            return {
                user,
                idToken: id_token,
                accessToken: access_token,
                expiresIn: expires_in
            };
        });
    }
    /**
    * Get the idp initiated login claims
    *
    * @param {string} idpInitiatedLoginToken The idp_initiated_login query param from the URL
    * @returns {object} Returns the idp initiated login claims
    */
    getIdpInitiatedLoginClaims(idpInitiatedLoginToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.validateToken(idpInitiatedLoginToken);
        });
    }
    /**
     * Validates the access token.
     *
     * @param {string} token The token to be validated.
     * @return {Promise<boolean>} Returns true if the token is valid, false otherwise.
     */
    validateAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validateToken(token);
                return true;
            }
            catch (_) {
                return false;
            }
        });
    }
    /**
     * Verifies the payload of the webhook
     *
     * @param {string} secret The secret
     * @param {Record<string, string>} headers The headers
     * @param {string} payload The payload
     * @return {boolean} Returns true if the payload is valid.
     */
    verifyWebhookPayload(secret, headers, payload) {
        const webhookId = headers['webhook-id'];
        const webhookTimestamp = headers['webhook-timestamp'];
        const webhookSignature = headers['webhook-signature'];
        if (!webhookId || !webhookTimestamp || !webhookSignature) {
            throw new Error("Missing required headers");
        }
        const timestamp = this.verifyTimestamp(webhookTimestamp);
        const data = `${webhookId}.${Math.floor(timestamp.getTime() / 1000)}.${payload}`;
        const secretBytes = Buffer.from(secret.split("_")[1], 'base64');
        const computedSignature = this.computeSignature(secretBytes, data);
        const receivedSignatures = webhookSignature.split(" ");
        for (const versionedSignature of receivedSignatures) {
            const [version, signature] = versionedSignature.split(",");
            if (version !== WEBHOOK_SIGNATURE_VERSION) {
                continue;
            }
            if (crypto_1.default.timingSafeEqual(Buffer.from(signature, 'base64'), Buffer.from(computedSignature, 'base64'))) {
                return true;
            }
        }
        throw new Error("Invalid Signature");
    }
    /**
     * Validate token
     *
     * @param {string} token The token to be validated
     * @return {Promise<T>} Returns the payload of the token
     */
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.coreClient.getJwks();
            const jwks = jose.createLocalJWKSet({
                keys: this.coreClient.keys
            });
            try {
                const { payload } = yield jose.jwtVerify(token, jwks);
                return payload;
            }
            catch (_) {
                throw new Error("Invalid token");
            }
        });
    }
    /**
     * Verify the timestamp
     *
     * @param {string} timestampStr The timestamp string
     * @return {Date} Returns the timestamp
     */
    verifyTimestamp(timestampStr) {
        const now = Math.floor(Date.now() / 1000);
        const timestamp = parseInt(timestampStr, 10);
        if (isNaN(timestamp)) {
            throw new Error("Invalid timestamp");
        }
        if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new Error("Message timestamp too old");
        }
        if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new Error("Message timestamp too new");
        }
        return new Date(timestamp * 1000);
    }
    /**
     * Compute the signature
     *
     * @param {Buffer} secretBytes The secret bytes
     * @param {string} data The data to be signed
     * @return {string} Returns the signature
     */
    computeSignature(secretBytes, data) {
        return crypto_1.default.createHmac('sha256', secretBytes).update(data).digest('base64');
    }
}
exports.default = ScalekitClient;
//# sourceMappingURL=scalekit.js.map