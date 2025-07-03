import GrpcConnect from './connect';
import CoreClient from './core';
import { SendPasswordlessResponse, VerifyPasswordLessResponse, TemplateType } from './pkg/grpc/scalekit/v1/auth/passwordless_pb';
export default class PasswordlessClient {
    private readonly grpcConncet;
    private readonly coreClient;
    private client;
    constructor(grpcConncet: GrpcConnect, coreClient: CoreClient);
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
    sendPasswordlessEmail(email: string, options?: {
        template?: TemplateType;
        state?: string;
        magiclinkAuthUri?: string;
        expiresIn?: number;
        templateVariables?: Record<string, string>;
    }): Promise<SendPasswordlessResponse>;
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
    verifyPasswordlessEmail(credential: {
        code?: string;
        linkToken?: string;
    }, authRequestId?: string): Promise<VerifyPasswordLessResponse>;
    /**
     * Resend a passwordless authentication email
     * @param {string} authRequestId The auth request ID from the original send response
     * @returns {Promise<SendPasswordlessResponse>} The response containing:
     * - authRequestId: New unique identifier for the passwordless authentication request
     * - expiresAt: New expiration time in seconds since epoch
     * - expiresIn: New expiration time in seconds
     * - passwordlessType: Type of passwordless authentication (OTP/LINK/LINK_OTP)
     */
    resendPasswordlessEmail(authRequestId: string): Promise<SendPasswordlessResponse>;
}
