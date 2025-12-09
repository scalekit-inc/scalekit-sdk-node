import { PromiseClient } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import { WebAuthnService } from './pkg/grpc/scalekit/v1/auth/webauthn_connect';
import {
  ListCredentialsRequest,
  ListCredentialsResponse,
  UpdateCredentialRequest,
  UpdateCredentialResponse,
  DeleteCredentialRequest,
  DeleteCredentialResponse
} from './pkg/grpc/scalekit/v1/auth/webauthn_pb';

export default class WebAuthnClient {
  private client: PromiseClient<typeof WebAuthnService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(WebAuthnService);
  }

  /**
   * List all WebAuthn credentials for a user
   * @param {string} userId The user ID to list credentials for
   * @returns {Promise<ListCredentialsResponse>} The response containing:
   * - credentials: Array of WebAuthn credentials
   * - allAcceptedCredentialsOptions: Options for all accepted credentials
   */
  async listCredentials(userId: string): Promise<ListCredentialsResponse> {
    if (!userId || typeof userId !== 'string') {
      throw new Error('userId must be a non-empty string');
    }

    const request = new ListCredentialsRequest({
      userId
    });

    return this.coreClient.connectExec(
      this.client.listCredentials,
      request
    );
  }

  /**
   * Update a WebAuthn credential's display name
   * @param {string} credentialId The credential ID to update
   * @param {string} displayName The new display name for the credential
   * @returns {Promise<UpdateCredentialResponse>} The response containing:
   * - credential: The updated WebAuthn credential
   */
  async updateCredential(
    credentialId: string,
    displayName: string
  ): Promise<UpdateCredentialResponse> {
    if (!credentialId || typeof credentialId !== 'string') {
      throw new Error('credentialId must be a non-empty string');
    }

    if (!displayName || typeof displayName !== 'string') {
      throw new Error('displayName must be a non-empty string');
    }

    const request = new UpdateCredentialRequest({
      credentialId,
      displayName
    });

    return this.coreClient.connectExec(
      this.client.updateCredential,
      request
    );
  }

  /**
   * Delete a WebAuthn credential
   * @param {string} credentialId The credential ID to delete
   * @returns {Promise<DeleteCredentialResponse>} The response containing:
   * - success: Boolean indicating if the deletion was successful
   * - unknownCredentialOptions: Options if the credential was not found
   */
  async deleteCredential(credentialId: string): Promise<DeleteCredentialResponse> {
    if (!credentialId || typeof credentialId !== 'string') {
      throw new Error('credentialId must be a non-empty string');
    }

    const request = new DeleteCredentialRequest({
      credentialId
    });

    return this.coreClient.connectExec(
      this.client.deleteCredential,
      request
    );
  }
}

