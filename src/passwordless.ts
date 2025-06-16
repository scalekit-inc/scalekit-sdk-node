import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { PasswordlessService } from './pkg/grpc/scalekit/v1/auth/passwordless_connect';
import { 
  SendPasswordlessResponse, 
  VerifyPasswordLessResponse,
  TemplateType,
  SendPasswordlessRequest,
  VerifyPasswordLessRequest
} from './pkg/grpc/scalekit/v1/auth/passwordless_pb';

export default class PasswordlessClient {
  private client: PromiseClient<typeof PasswordlessService>;
  constructor(
    private readonly grpcConncet: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConncet.createClient(PasswordlessService);
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
  async sendPasswordlessEmail(
    email: string,
    options?: {
      template?: TemplateType;
      state?: string;
      magiclinkAuthUri?: string;
      expiresIn?: number;
      templateVariables?: Record<string, string>;
    }
  ): Promise<SendPasswordlessResponse> {
    if (!email || typeof email !== 'string') {
      throw new Error('Email must be a valid string');
    }

    let templateValue: TemplateType | undefined;
    if (options?.template) {
      if (typeof options.template === 'string') {
        templateValue = TemplateType[options.template as keyof typeof TemplateType];
        if (templateValue === undefined) {
          throw new Error('Invalid template type');
        }
      } else {
        templateValue = options.template;
      }
    }

    if (options?.state && typeof options.state !== 'string') {
      throw new Error('State must be a string');
    }

    if (options?.magiclinkAuthUri && typeof options.magiclinkAuthUri !== 'string') {
      throw new Error('Magic link auth URI must be a string');
    }

    const request: SendPasswordlessRequest = new SendPasswordlessRequest({
      email,
      template: templateValue,
      state: options?.state,
      magiclinkAuthUri: options?.magiclinkAuthUri,
      expiresIn: options?.expiresIn,
      templateVariables: options?.templateVariables || {}
    });

    return this.coreClient.connectExec(
      this.client.sendPasswordlessEmail,
      request
    );
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
  async verifyPasswordlessEmail(
    credential: { code?: string; linkToken?: string },
    authRequestId?: string
  ): Promise<VerifyPasswordLessResponse> {
    if (!credential.code && !credential.linkToken) {
      throw new Error('Either code or linkToken must be provided');
    }

    const request = new VerifyPasswordLessRequest({
      authRequestId,
      authCredential: credential.code 
        ? { case: "code", value: credential.code }
        : { case: "linkToken", value: credential.linkToken! }
    });

    return this.coreClient.connectExec(
      this.client.verifyPasswordlessEmail,
      request
    );
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
  async resendPasswordlessEmail(
    authRequestId: string
  ): Promise<SendPasswordlessResponse> {
    return this.coreClient.connectExec(
      this.client.resendPasswordlessEmail,
      {
        authRequestId
      }
    );
  }
} 