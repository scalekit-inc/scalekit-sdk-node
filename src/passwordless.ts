import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { PasswordlessService } from './pkg/grpc/scalekit/v1/passwordless/passwordless_connect';
import { 
  SendPasswordlessResponse, 
  VerifyPasswordLessResponse,
  TemplateType
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
    if (options?.template && !Object.values(TemplateType).includes(options.template)) {
      throw new Error('Invalid template type');
    }

    // Validate state if provided
    if (options?.state && typeof options.state !== 'string') {
      throw new Error('State must be a string');
    }

    // Validate and convert expiresIn if provided
    let expiresIn: number | undefined;
    if (options?.expiresIn !== undefined) {
      expiresIn = Number(options.expiresIn);
      if (isNaN(expiresIn) || expiresIn < 0 || !Number.isInteger(expiresIn)) {
        throw new Error('expiresIn must be a positive integer');
      }
    }

    return this.coreClient.connectExec(
      this.client.sendPasswordlessEmail,
      {
        email,
        ...(options?.template && { template: options.template }),
        ...(options?.state && { state: options.state }),
        ...(expiresIn !== undefined && { expiresIn })
      }
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