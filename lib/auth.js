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
const protobuf_1 = require("@bufbuild/protobuf");
const auth_pb_1 = require("./pkg/grpc/scalekit/v1/auth/auth_pb");
/**
 * If you are using Auth for MCP solution of Scalekit in "Bring your own Auth" mode, this client helps updating Scalekit with the currently logged in user details for the ongoing authentication request.
 *
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const authClient = scalekitClient.auth;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/api%20auth | Authentication API Documentation}
 */
class AuthClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(auth_pb_1.AuthService);
    }
    /**
     * Updates user details for an ongoing authentication request.
     *
     *
     * @param {string} connectionId - The SSO connection ID being used for authentication
     * @param {string} loginRequestId - The unique login request identifier from the auth flow
     * @param {UserInput} user - User details to update or associate with the login request
     * @param {string} [user.email] - User's email address
     * @param {string} [user.sub] - Unique user identifier (subject)
     *
     * @returns {Promise<MessageShape<EmptySchema>>} Empty response on successful update
     *
     * @throws {Error} When connectionId is missing or invalid
     * @throws {Error} When loginRequestId is missing or invalid
     * @throws {Error} When user object is invalid
     *
     * @example
     * await scalekitClient.auth.updateLoginUserDetails(
     *   'conn_abc123',
     *   'login_xyz789',
     *   {
     *     email: 'john.doe@company.com',
     *     sub: 'unique_user_id_456',
     *   }
     * );
     *
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/api%20auth | Update Login User Details API}
     */
    updateLoginUserDetails(connectionId, loginRequestId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!connectionId || typeof connectionId !== "string") {
                throw new Error("connectionId must be a non-empty string");
            }
            if (!loginRequestId || typeof loginRequestId !== "string") {
                throw new Error("loginRequestId must be a non-empty string");
            }
            if (!user || typeof user !== "object") {
                throw new Error("user must be a valid object");
            }
            const userMessage = (0, protobuf_1.create)(auth_pb_1.UserSchema, user);
            const request = (0, protobuf_1.create)(auth_pb_1.UpdateLoginUserDetailsRequestSchema, {
                connectionId,
                loginRequestId,
                user: userMessage,
            });
            return this.coreClient.connectExec(this.client.updateLoginUserDetails, request);
        });
    }
}
exports.default = AuthClient;
//# sourceMappingURL=auth.js.map