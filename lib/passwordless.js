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
const passwordless_connect_1 = require("./pkg/grpc/scalekit/v1/auth/passwordless_connect");
const passwordless_pb_1 = require("./pkg/grpc/scalekit/v1/auth/passwordless_pb");
class PasswordlessClient {
    constructor(grpcConncet, coreClient) {
        this.grpcConncet = grpcConncet;
        this.coreClient = coreClient;
        this.client = this.grpcConncet.createClient(passwordless_connect_1.PasswordlessService);
    }
    /**
     * Send a passwordless authentication email
     * @param {string} email The email address to send the passwordless link to
     * @param {object} options The options for sending the passwordless email
     * @param {TemplateType} options.template The template type (SIGNIN/SIGNUP)
     * @param {string} options.state Optional state parameter to maintain state between request and callback
     * @param {string} options.magiclinkAuthUri Optional auth URI for magic link authentication
     * @param {number} options.expiresIn Optional expiration time in seconds (default: 3600)
     * @param {object} options.templateVariables Optional template variables
     * @returns {Promise<SendPasswordlessResponse>} The response containing:
     * - authRequestId: Unique identifier for the passwordless authentication request
     * - expiresAt: Expiration time in seconds since epoch
     * - expiresIn: Expiration time in seconds
     * - passwordlessType: Type of passwordless authentication (OTP/LINK/LINK_OTP)
     */
    sendPasswordlessEmail(email, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || typeof email !== 'string') {
                throw new Error('Email must be a valid string');
            }
            let templateValue;
            if (options === null || options === void 0 ? void 0 : options.template) {
                if (typeof options.template === 'string') {
                    templateValue = passwordless_pb_1.TemplateType[options.template];
                    if (templateValue === undefined) {
                        throw new Error('Invalid template type');
                    }
                }
                else {
                    templateValue = options.template;
                }
            }
            if ((options === null || options === void 0 ? void 0 : options.state) && typeof options.state !== 'string') {
                throw new Error('State must be a string');
            }
            if ((options === null || options === void 0 ? void 0 : options.magiclinkAuthUri) && typeof options.magiclinkAuthUri !== 'string') {
                throw new Error('Magic link auth URI must be a string');
            }
            const request = new passwordless_pb_1.SendPasswordlessRequest({
                email,
                template: templateValue,
                state: options === null || options === void 0 ? void 0 : options.state,
                magiclinkAuthUri: options === null || options === void 0 ? void 0 : options.magiclinkAuthUri,
                expiresIn: options === null || options === void 0 ? void 0 : options.expiresIn,
                templateVariables: (options === null || options === void 0 ? void 0 : options.templateVariables) || {}
            });
            return this.coreClient.connectExec(this.client.sendPasswordlessEmail, request);
        });
    }
    /**
     * Verify a passwordless authentication code or link token
     * @param {object} credential The credential to verify
     * @param {string} credential.code The one-time code received via email
     * @param {string} credential.linkToken The link token received via email
     * @param {string} [authRequestId] Optional auth request ID from the send response
     * @returns {Promise<VerifyPasswordLessResponse>} The response containing:
     * - email: The email address that was verified
     * - state: Optional state parameter that was passed in the send request
     * - template: The template type used for the authentication
     * - passwordlessType: Type of passwordless authentication used
     */
    verifyPasswordlessEmail(credential, authRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credential.code && !credential.linkToken) {
                throw new Error('Either code or linkToken must be provided');
            }
            const request = new passwordless_pb_1.VerifyPasswordLessRequest({
                authRequestId,
                authCredential: credential.code
                    ? { case: "code", value: credential.code }
                    : { case: "linkToken", value: credential.linkToken }
            });
            return this.coreClient.connectExec(this.client.verifyPasswordlessEmail, request);
        });
    }
    /**
     * Resend a passwordless authentication email
     * @param {string} authRequestId The auth request ID from the original send response
     * @returns {Promise<SendPasswordlessResponse>} The response containing:
     * - authRequestId: New unique identifier for the passwordless authentication request
     * - expiresAt: New expiration time in seconds since epoch
     * - expiresIn: New expiration time in seconds
     * - passwordlessType: Type of passwordless authentication (OTP/LINK/LINK_OTP)
     */
    resendPasswordlessEmail(authRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coreClient.connectExec(this.client.resendPasswordlessEmail, {
                authRequestId
            });
        });
    }
}
exports.default = PasswordlessClient;
//# sourceMappingURL=passwordless.js.map