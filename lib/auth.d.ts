import { Empty, PartialMessage, JsonValue } from '@bufbuild/protobuf';
import CoreClient from './core';
import GrpcConnect from './connect';
import { User } from './pkg/grpc/scalekit/v1/auth/auth_pb';
type UserInput = PartialMessage<User> & {
    customAttributes?: Record<string, JsonValue>;
};
export default class AuthClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private readonly client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Update user details for an ongoing login request.
     * @param {string} connectionId The connection ID used for authentication.
     * @param {string} loginRequestId The login request identifier issued during auth initiation.
     * @param {UserInput} user Optional user details to associate with the login request.
     * @returns {Promise<Empty>} Empty response.
     */
    updateLoginUserDetails(connectionId: string, loginRequestId: string, user: UserInput): Promise<Empty>;
}
export {};
