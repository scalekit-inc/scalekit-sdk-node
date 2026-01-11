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
const webauthn_connect_1 = require("./pkg/grpc/scalekit/v1/auth/webauthn_connect");
const webauthn_pb_1 = require("./pkg/grpc/scalekit/v1/auth/webauthn_pb");
class WebAuthnClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(webauthn_connect_1.WebAuthnService);
    }
    /**
     * List all WebAuthn credentials for a user
     * @param {string} userId The user ID to list credentials for
     * @returns {Promise<ListCredentialsResponse>} The response containing:
     * - credentials: Array of WebAuthn credentials
     * - allAcceptedCredentialsOptions: Options for all accepted credentials
     */
    listCredentials(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || typeof userId !== 'string') {
                throw new Error('userId must be a non-empty string');
            }
            const request = new webauthn_pb_1.ListCredentialsRequest({
                userId
            });
            return this.coreClient.connectExec(this.client.listCredentials, request);
        });
    }
    /**
     * Update a WebAuthn credential's display name
     * @param {string} credentialId The credential ID to update
     * @param {string} displayName The new display name for the credential
     * @returns {Promise<UpdateCredentialResponse>} The response containing:
     * - credential: The updated WebAuthn credential
     */
    updateCredential(credentialId, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credentialId || typeof credentialId !== 'string') {
                throw new Error('credentialId must be a non-empty string');
            }
            if (!displayName || typeof displayName !== 'string') {
                throw new Error('displayName must be a non-empty string');
            }
            const request = new webauthn_pb_1.UpdateCredentialRequest({
                credentialId,
                displayName
            });
            return this.coreClient.connectExec(this.client.updateCredential, request);
        });
    }
    /**
     * Delete a WebAuthn credential
     * @param {string} credentialId The credential ID to delete
     * @returns {Promise<DeleteCredentialResponse>} The response containing:
     * - success: Boolean indicating if the deletion was successful
     * - unknownCredentialOptions: Options if the credential was not found
     */
    deleteCredential(credentialId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credentialId || typeof credentialId !== 'string') {
                throw new Error('credentialId must be a non-empty string');
            }
            const request = new webauthn_pb_1.DeleteCredentialRequest({
                credentialId
            });
            return this.coreClient.connectExec(this.client.deleteCredential, request);
        });
    }
}
exports.default = WebAuthnClient;
//# sourceMappingURL=webauthn.js.map