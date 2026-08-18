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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ScalekitEdgeClient = exports.ScalekitEdgeError = void 0;
const jose = __importStar(require("jose"));
const qs_1 = __importDefault(require("qs"));
const user_1 = require("./constants/user");
const scalekit_1 = require("./types/scalekit");
/**
 * Raised on any non-2xx response from Scalekit's REST endpoints. Simple,
 * REST-native shape (statusCode/message/errorCode) rather than the gRPC-
 * oriented src/errors/ hierarchy, which models Connect-RPC status codes that
 * don't map cleanly onto OAuth token-endpoint error responses
 * (invalid_grant, invalid_client, ...).
 */
class ScalekitEdgeError extends Error {
    constructor(statusCode, message, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.name = 'ScalekitEdgeError';
    }
}
exports.ScalekitEdgeError = ScalekitEdgeError;
const AUTHORIZE_PATH = 'oauth/authorize';
const LOGOUT_PATH = 'oidc/logout';
const TOKEN_PATH = 'oauth/token';
const JWKS_PATH = 'keys';
/**
 * Fetch + jose based auth client covering only the methods
 * ScalekitAuth/ScalekitAuthNext need -- an opt-in alternative to
 * ScalekitClient for Next.js Edge Runtime, where ScalekitClient's gRPC
 * transport and os/process-based User-Agent construction do not work. Not a
 * replacement: no organization/connection/directory/etc. methods, and
 * ScalekitClient remains the default for everything else.
 */
class ScalekitEdgeClient {
    constructor(envUrl, clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = envUrl.replace(/\/+$/, '');
    }
    getJwks() {
        if (!this.jwks) {
            this.jwks = jose.createRemoteJWKSet(new URL(`${this.baseUrl}/${JWKS_PATH}`));
        }
        return this.jwks;
    }
    buildUrl(path, params) {
        const url = new URL(`${this.baseUrl}/${path}`);
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) {
                url.searchParams.set(key, value);
            }
        }
        return url.toString();
    }
    getAuthorizationUrl(redirectUri, options) {
        var _a;
        const scopes = (_a = options === null || options === void 0 ? void 0 : options.scopes) !== null && _a !== void 0 ? _a : ['openid', 'profile', 'email'];
        return this.buildUrl(AUTHORIZE_PATH, {
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: redirectUri,
            scope: scopes.join(' '),
            connection_id: options === null || options === void 0 ? void 0 : options.connectionId,
            organization_id: options === null || options === void 0 ? void 0 : options.organizationId,
            state: options === null || options === void 0 ? void 0 : options.state,
            nonce: options === null || options === void 0 ? void 0 : options.nonce,
            domain_hint: options === null || options === void 0 ? void 0 : options.domainHint,
            domain: options === null || options === void 0 ? void 0 : options.domainHint,
            login_hint: options === null || options === void 0 ? void 0 : options.loginHint,
            code_challenge: options === null || options === void 0 ? void 0 : options.codeChallenge,
            code_challenge_method: options === null || options === void 0 ? void 0 : options.codeChallengeMethod,
            provider: options === null || options === void 0 ? void 0 : options.provider,
            prompt: options === null || options === void 0 ? void 0 : options.prompt,
        });
    }
    getLogoutUrl(options) {
        return this.buildUrl(LOGOUT_PATH, {
            id_token_hint: options === null || options === void 0 ? void 0 : options.idTokenHint,
            post_logout_redirect_uri: options === null || options === void 0 ? void 0 : options.postLogoutRedirectUri,
            state: options === null || options === void 0 ? void 0 : options.state,
        });
    }
    postToken(body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield fetch(`${this.baseUrl}/${TOKEN_PATH}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: qs_1.default.stringify(body),
            });
            // Read the body as text first rather than calling response.json()
            // directly -- a 502/504 HTML error page or a plain-text error response
            // (common from CDNs/edge proxies fronting Edge-deployed apps) would
            // otherwise throw a raw, unclassifiable SyntaxError from response.json()
            // itself instead of a catchable ScalekitEdgeError.
            const text = yield response.text();
            let data;
            try {
                data = JSON.parse(text);
            }
            catch (_c) {
                throw new ScalekitEdgeError(response.status, text || response.statusText);
            }
            if (!response.ok) {
                throw new ScalekitEdgeError(response.status, (_b = (_a = data.error_description) !== null && _a !== void 0 ? _a : data.error) !== null && _b !== void 0 ? _b : 'token request failed', data.error);
            }
            return data;
        });
    }
    authenticateWithCode(code, redirectUri, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.postToken(Object.assign({ code, redirect_uri: redirectUri, grant_type: scalekit_1.GrantType.AuthorizationCode, client_id: this.clientId, client_secret: this.clientSecret }, ((options === null || options === void 0 ? void 0 : options.codeVerifier) && { code_verifier: options.codeVerifier })));
            // Validate that all required properties exist. A 200 response missing
            // one of these otherwise produces a raw, undiagnosable TypeError from
            // inside jose.decodeJwt rather than a clear, catchable error.
            if (!data.id_token) {
                throw new Error('Missing id_token in authentication response');
            }
            if (!data.access_token) {
                throw new Error('Missing access_token in authentication response');
            }
            if (!data.refresh_token) {
                throw new Error('Missing refresh_token in authentication response');
            }
            if (data.expires_in === undefined) {
                throw new Error('Missing expires_in in authentication response');
            }
            const claims = jose.decodeJwt(data.id_token);
            const user = {};
            for (const [k, v] of Object.entries(claims)) {
                if (user_1.IdTokenClaimToUserMap[k]) {
                    user[user_1.IdTokenClaimToUserMap[k]] = v;
                }
            }
            return {
                user,
                idToken: data.id_token,
                accessToken: data.access_token,
                expiresIn: data.expires_in,
                refreshToken: data.refresh_token,
            };
        });
    }
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw new Error('Refresh token is required');
            }
            const data = yield this.postToken({
                grant_type: scalekit_1.GrantType.RefreshToken,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                refresh_token: refreshToken,
            });
            // Validate that all required properties exist
            if (!data.access_token) {
                throw new Error('Missing access_token in authentication response');
            }
            if (!data.refresh_token) {
                throw new Error('Missing refresh_token in authentication response');
            }
            return {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
            };
        });
    }
    validateToken(token, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payload } = yield jose.jwtVerify(token, this.getJwks(), Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.issuer) && { issuer: options.issuer })), ((options === null || options === void 0 ? void 0 : options.audience) && { audience: options.audience })));
                if ((options === null || options === void 0 ? void 0 : options.requiredScopes) && options.requiredScopes.length > 0) {
                    const claims = jose.decodeJwt(token);
                    const scopes = Array.isArray(claims.scopes)
                        ? claims.scopes.filter((scope) => { var _a; return !!((_a = scope === null || scope === void 0 ? void 0 : scope.trim) === null || _a === void 0 ? void 0 : _a.call(scope)); })
                        : [];
                    const missing = options.requiredScopes.filter((s) => !scopes.includes(s));
                    if (missing.length > 0) {
                        throw new Error(`Token missing required scopes: ${missing.join(', ')}`);
                    }
                }
                return payload;
            }
            catch (err) {
                // Explicit allowlist of bad-token-shaped errors that should be wrapped as 401.
                // These indicate the token itself is invalid, expired, or lacks required scopes.
                const badTokenShapedErrors = [
                    jose.errors.JWTClaimValidationFailed,
                    jose.errors.JWTExpired,
                    jose.errors.JWSSignatureVerificationFailed,
                    jose.errors.JWTInvalid,
                    jose.errors.JWSInvalid,
                    jose.errors.JWKSNoMatchingKey,
                ];
                // Check if error matches any bad-token-shaped class, or is our own requiredScopes check
                const isBadTokenError = badTokenShapedErrors.some((cls) => err instanceof cls) ||
                    (err instanceof Error &&
                        err.message.includes('Token missing required scopes'));
                if (isBadTokenError) {
                    const message = err instanceof Error ? err.message : String(err);
                    throw new ScalekitEdgeError(401, `token validation failed: ${message}`);
                }
                // Everything else (JWKSInvalid, JWKSMultipleMatchingKeys, JWKSTimeout, JOSENotSupported,
                // JOSEAlgNotAllowed, JWEInvalid, JWEDecryptionFailed, JWKInvalid, raw network errors, etc.)
                // propagates as-is. These are infrastructure/config problems, not bad-token-shaped failures.
                throw err;
            }
        });
    }
    getIdpInitiatedLoginClaims(idpInitiatedLoginToken, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.validateToken(idpInitiatedLoginToken, options);
        });
    }
}
exports.ScalekitEdgeClient = ScalekitEdgeClient;
//# sourceMappingURL=edge.js.map