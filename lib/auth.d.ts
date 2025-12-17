import { Empty, PartialMessage, JsonValue } from "@bufbuild/protobuf";
import CoreClient from "./core";
import GrpcConnect from "./connect";
import { User } from "./pkg/grpc/scalekit/v1/auth/auth_pb";
type UserInput = PartialMessage<User> & {
    customAttributes?: Record<string, JsonValue>;
};
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
export default class AuthClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private readonly client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
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
     * @returns {Promise<Empty>} Empty response on successful update
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
    updateLoginUserDetails(connectionId: string, loginRequestId: string, user: UserInput): Promise<Empty>;
}
export {};
