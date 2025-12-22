import GrpcConnect from './connect';
import CoreClient from './core';
import { ListCredentialsResponse, UpdateCredentialResponse, DeleteCredentialResponse } from './pkg/grpc/scalekit/v1/auth/webauthn_pb';
export default class WebAuthnClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * List all WebAuthn credentials for a user
     * @param {string} userId The user ID to list credentials for
     * @returns {Promise<ListCredentialsResponse>} The response containing:
     * - credentials: Array of WebAuthn credentials
     * - allAcceptedCredentialsOptions: Options for all accepted credentials
     */
    listCredentials(userId: string): Promise<ListCredentialsResponse>;
    /**
     * Update a WebAuthn credential's display name
     * @param {string} credentialId The credential ID to update
     * @param {string} displayName The new display name for the credential
     * @returns {Promise<UpdateCredentialResponse>} The response containing:
     * - credential: The updated WebAuthn credential
     */
    updateCredential(credentialId: string, displayName: string): Promise<UpdateCredentialResponse>;
    /**
     * Delete a WebAuthn credential
     * @param {string} credentialId The credential ID to delete
     * @returns {Promise<DeleteCredentialResponse>} The response containing:
     * - success: Boolean indicating if the deletion was successful
     * - unknownCredentialOptions: Options if the credential was not found
     */
    deleteCredential(credentialId: string): Promise<DeleteCredentialResponse>;
}
