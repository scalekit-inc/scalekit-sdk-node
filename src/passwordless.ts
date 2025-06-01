import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { PasswordlessService } from './pkg/grpc/scalekit/v1/passwordless/passwordless_connect';
import { 
  SendPasswordlessResponse, 
  VerifyPasswordLessResponse,
  TemplateType,
  SendPasswordlessRequest
} from './pkg/grpc/scalekit/v1/passwordless/passwordless_pb';

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
   * @param {number} options.expiresIn Optional expiration time in seconds (default: 3600)
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
      expiresIn?: number;
    }
  ): Promise<SendPasswordlessResponse> {
    // Validate email
    if (!email || typeof email !== 'string') {
      throw new Error('Email must be a valid string');
    }

    // Validate template if provided
    let templateValue: TemplateType | undefined;
    if (options?.template) {
      if (typeof options.template === 'string') {
        // Convert string to enum value
        templateValue = TemplateType[options.template as keyof typeof TemplateType];
        if (templateValue === undefined) {
          throw new Error('Invalid template type');
        }
      } else {
        templateValue = options.template;
      }
    }

    // Validate state if provided
    if (options?.state && typeof options.state !== 'string') {
      throw new Error('State must be a string');
    }

    // Create the request object with explicit type
    const request: SendPasswordlessRequest = new SendPasswordlessRequest({
      email,
      template: templateValue,
      state: options?.state,
      expiresIn: options?.expiresIn ? Number(options.expiresIn) : undefined
    });

    // Log the request object and its types
    console.log('Request object:', request);
    console.log('Request types:', {
      email: typeof request.email,
      template: request.template ? typeof request.template : 'undefined',
      state: request.state ? typeof request.state : 'undefined',
      expiresIn: request.expiresIn ? typeof request.expiresIn : 'undefined'
    });
    console.log('Template value:', request.template);

    return this.coreClient.connectExec(
      this.client.sendPasswordlessEmail,
      request
    );
  }

  /**
   * Verify a passwordless authentication code
   * @param {string} code The one-time code received via email
   * @param {string} authRequestId The auth request ID from the send response
   * @returns {Promise<VerifyPasswordLessResponse>} The response containing:
   * - email: The email address that was verified
   * - state: Optional state parameter that was passed in the send request
   * - template: The template type used for the authentication
   * - passwordlessType: Type of passwordless authentication used
   */
  async verifyPasswordlessEmail(
    code: string,
    authRequestId: string
  ): Promise<VerifyPasswordLessResponse> {
    return this.coreClient.connectExec(
      this.client.verifyPasswordlessEmail,
      {
        code,
        authRequestId
      }
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