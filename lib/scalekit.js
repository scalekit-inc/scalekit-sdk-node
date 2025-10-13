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
const user_2 = __importDefault(require("./user"));
const session_1 = __importDefault(require("./session"));
const role_1 = __importDefault(require("./role"));
const permission_1 = __importDefault(require("./permission"));
const scalekit_1 = require("./types/scalekit");
const base_exception_1 = require("./errors/base-exception");
const authorizeEndpoint = "oauth/authorize";
const logoutEndpoint = "oidc/logout";
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
        this.user = new user_2.default(this.grpcConnect, this.coreClient);
        this.session = new session_1.default(this.grpcConnect, this.coreClient);
        this.role = new role_1.default(this.grpcConnect, this.coreClient);
        this.permission = new permission_1.default(this.grpcConnect, this.coreClient);
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
     * @param {string} options.prompt Prompt parameter to control the authorization server's authentication behavior
     *
     * @example
     * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
     * const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, {
     *   scopes: ['openid', 'profile'],
     *   prompt: 'create'
     * });
     * @returns {string} authorization url
     */
    getAuthorizationUrl(redirectUri, options) {
        var _a;
        const defaultOptions = {
            scopes: ['openid', 'profile', 'email']
        };
        options = Object.assign(Object.assign({}, defaultOptions), options);
        const qs = qs_1.default.stringify(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ response_type: 'code', client_id: this.coreClient.clientId, redirect_uri: redirectUri, scope: (_a = options.scopes) === null || _a === void 0 ? void 0 : _a.join(" ") }, (options.state && { state: options.state })), (options.nonce && { nonce: options.nonce })), (options.loginHint && { login_hint: options.loginHint })), (options.domainHint && { domain_hint: options.domainHint })), (options.domainHint && { domain: options.domainHint })), (options.connectionId && { connection_id: options.connectionId })), (options.organizationId && { organization_id: options.organizationId })), (options.codeChallenge && { code_challenge: options.codeChallenge })), (options.codeChallengeMethod && { code_challenge_method: options.codeChallengeMethod })), (options.provider && { provider: options.provider })), (options.prompt && { prompt: options.prompt })));
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
            const { id_token, access_token, expires_in, refresh_token } = res.data;
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
                expiresIn: expires_in,
                refreshToken: refresh_token
            };
        });
    }
    /**
    * Get the idp initiated login claims
    *
    * @param {string} idpInitiatedLoginToken The idp_initiated_login query param from the URL
    * @param {TokenValidationOptions} options Optional validation options for issuer and audience
    * @returns {object} Returns the idp initiated login claims
    */
    getIdpInitiatedLoginClaims(idpInitiatedLoginToken, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.validateToken(idpInitiatedLoginToken, options);
        });
    }
    /**
     * Validates the access token and returns a boolean result.
     *
     * @param {string} token The token to be validated.
     * @param {TokenValidationOptions} options Optional validation options for issuer, audience, and scopes
     * @return {Promise<boolean>} Returns true if the token is valid, false otherwise.
     */
    validateAccessToken(token, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validateToken(token, options);
                return true;
            }
            catch (_) {
                return false;
            }
        });
    }
    /**
     * Returns the logout URL that can be used to log out the user.
     * @param {LogoutUrlOptions} options Logout URL options
     * @param {string} options.idTokenHint The ID Token previously issued to the client
     * @param {string} options.postLogoutRedirectUri URL to redirect after logout
     * @param {string} options.state Opaque value to maintain state between request and callback
     * @returns {string} The logout URL
     *
     * @example
     * const scalekit = new Scalekit(envUrl, clientId, clientSecret);
     * const logoutUrl = scalekit.getLogoutUrl({
     *   postLogoutRedirectUri: 'https://example.com',
     *   state: 'some-state'
     * });
     */
    getLogoutUrl(options) {
        const qs = qs_1.default.stringify(Object.assign(Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.idTokenHint) && { id_token_hint: options.idTokenHint })), ((options === null || options === void 0 ? void 0 : options.postLogoutRedirectUri) && { post_logout_redirect_uri: options.postLogoutRedirectUri })), ((options === null || options === void 0 ? void 0 : options.state) && { state: options.state })));
        return `${this.coreClient.envUrl}/${logoutEndpoint}${qs ? `?${qs}` : ''}`;
    }
    /**
     * Verify webhook payload
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
        return this.verifyPayloadSignature(secret, webhookId, webhookTimestamp, webhookSignature, payload);
    }
    /**
     * Verify interceptor payload
     *
     * @param {string} secret The secret
     * @param {Record<string, string>} headers The headers
     * @param {string} payload The payload
     * @return {boolean} Returns true if the payload is valid.
     */
    verifyInterceptorPayload(secret, headers, payload) {
        const interceptorId = headers['interceptor-id'];
        const interceptorTimestamp = headers['interceptor-timestamp'];
        const interceptorSignature = headers['interceptor-signature'];
        return this.verifyPayloadSignature(secret, interceptorId, interceptorTimestamp, interceptorSignature, payload);
    }
    /**
     * Common payload signature verification logic
     *
     * @param {string} secret The secret
     * @param {string} id The webhook/interceptor id
     * @param {string} timestamp The timestamp
     * @param {string} signature The signature
     * @param {string} payload The payload
     * @return {boolean} Returns true if the payload signature is valid.
     */
    verifyPayloadSignature(secret, id, timestamp, signature, payload) {
        if (!id || !timestamp || !signature) {
            throw new base_exception_1.WebhookVerificationError("Missing required headers");
        }
        const secretParts = secret.split("_");
        if (secretParts.length < 2) {
            throw new base_exception_1.WebhookVerificationError("Invalid secret");
        }
        try {
            const timestampDate = this.verifyTimestamp(timestamp);
            const data = `${id}.${Math.floor(timestampDate.getTime() / 1000)}.${payload}`;
            const secretBytes = Buffer.from(secretParts[1], 'base64');
            const computedSignature = this.computeSignature(secretBytes, data);
            const receivedSignatures = signature.split(" ");
            for (const versionedSignature of receivedSignatures) {
                const [version, receivedSignature] = versionedSignature.split(",");
                if (version !== WEBHOOK_SIGNATURE_VERSION) {
                    continue;
                }
                if (crypto_1.default.timingSafeEqual(Buffer.from(receivedSignature, 'base64'), Buffer.from(computedSignature, 'base64'))) {
                    return true;
                }
            }
            throw new base_exception_1.WebhookVerificationError("Invalid signature");
        }
        catch (error) {
            if (error instanceof base_exception_1.WebhookVerificationError) {
                throw error;
            }
            throw new base_exception_1.WebhookVerificationError("Invalid signature");
        }
    }
    /**
     * Validates a token and returns its payload if valid.
     * Supports issuer, audience, and scope validation.
     *
     * @param {string} token The token to be validated
     * @param {TokenValidationOptions} options Optional validation options for issuer, audience, and scopes
     * @return {Promise<T>} Returns the token payload if valid
     * @throws {ScalekitValidateTokenFailureException} If token is invalid or missing required scopes
     */
    validateToken(token, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.coreClient.getJwks();
            const jwks = jose.createLocalJWKSet({
                keys: this.coreClient.keys
            });
            try {
                const { payload } = yield jose.jwtVerify(token, jwks, Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.issuer) && { issuer: options.issuer })), ((options === null || options === void 0 ? void 0 : options.audience) && { audience: options.audience })));
                if ((options === null || options === void 0 ? void 0 : options.requiredScopes) && options.requiredScopes.length > 0) {
                    this.verifyScopes(token, options.requiredScopes);
                }
                return payload;
            }
            catch (error) {
                throw new base_exception_1.ScalekitValidateTokenFailureException(error);
            }
        });
    }
    /**
     * Verify that the token contains the required scopes
     *
     * @param {string} token The token to verify
     * @param {string[]} requiredScopes The scopes that must be present in the token
     * @return {boolean} Returns true if all required scopes are present
     * @throws {ScalekitValidateTokenFailureException} If required scopes are missing, with details about which scopes are missing
     */
    verifyScopes(token, requiredScopes) {
        const payload = jose.decodeJwt(token);
        const scopes = this.extractScopesFromPayload(payload);
        const missingScopes = requiredScopes.filter(scope => !scopes.includes(scope));
        if (missingScopes.length > 0) {
            throw new base_exception_1.ScalekitValidateTokenFailureException(`Token missing required scopes: ${missingScopes.join(', ')}`);
        }
        return true;
    }
    /**
     * Extract scopes from token payload
     *
     * @param {any} payload The token payload
     * @return {string[]} Array of scopes found in the token
     */
    extractScopesFromPayload(payload) {
        const scopes = payload.scopes;
        return Array.isArray(scopes)
            ? scopes.filter((scope) => { var _a; return !!((_a = scope.trim) === null || _a === void 0 ? void 0 : _a.call(scope)); })
            : [];
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
            throw new base_exception_1.WebhookVerificationError("Invalid Signature Headers");
        }
        if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new base_exception_1.WebhookVerificationError("Message timestamp too old");
        }
        if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new base_exception_1.WebhookVerificationError("Message timestamp too new");
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
    /**
     * Refresh access token using a refresh token
     * @param {string} refreshToken The refresh token to use
     * @returns {Promise<RefreshTokenResponse>} Returns new access token, refresh token and other details
     * @throws {Error} When authentication fails or response data is invalid
     */
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw new Error("Refresh token is required");
            }
            let res;
            try {
                res = yield this.coreClient.authenticate(qs_1.default.stringify({
                    grant_type: scalekit_1.GrantType.RefreshToken,
                    client_id: this.coreClient.clientId,
                    client_secret: this.coreClient.clientSecret,
                    refresh_token: refreshToken
                }));
            }
            catch (error) {
                throw new Error(`Failed to refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            if (!res || !res.data) {
                throw new Error("Invalid response from authentication server");
            }
            const { access_token, refresh_token } = res.data;
            // Validate that all required properties exist
            if (!access_token) {
                throw new Error("Missing access_token in authentication response");
            }
            if (!refresh_token) {
                throw new Error("Missing refresh_token in authentication response");
            }
            return {
                accessToken: access_token,
                refreshToken: refresh_token
            };
        });
    }
}
exports.default = ScalekitClient;
//# sourceMappingURL=scalekit.js.map