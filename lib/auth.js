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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const protobuf_1 = require("@bufbuild/protobuf");
const auth_connect_1 = require("./pkg/grpc/scalekit/v1/auth/auth_connect");
const auth_pb_1 = require("./pkg/grpc/scalekit/v1/auth/auth_pb");
class AuthClient {
    constructor(grpcConnect, coreClient) {
        this.grpcConnect = grpcConnect;
        this.coreClient = coreClient;
        this.client = this.grpcConnect.createClient(auth_connect_1.AuthService);
    }
    /**
     * Update user details for an ongoing login request.
     * @param {string} connectionId The connection ID used for authentication.
     * @param {string} loginRequestId The login request identifier issued during auth initiation.
     * @param {UserInput} user Optional user details to associate with the login request.
     * @returns {Promise<Empty>} Empty response.
     */
    updateLoginUserDetails(connectionId, loginRequestId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!connectionId || typeof connectionId !== 'string') {
                throw new Error('connectionId must be a non-empty string');
            }
            if (!loginRequestId || typeof loginRequestId !== 'string') {
                throw new Error('loginRequestId must be a non-empty string');
            }
            let userMessage;
            if (user) {
                const { customAttributes } = user, rest = __rest(user, ["customAttributes"]);
                userMessage = new auth_pb_1.User(rest);
                if (customAttributes !== undefined) {
                    userMessage.customAttributes = protobuf_1.Struct.fromJson(customAttributes);
                }
            }
            const request = new auth_pb_1.UpdateLoginUserDetailsRequest({
                connectionId,
                loginRequestId,
                user: userMessage
            });
            return this.coreClient.connectExec(this.client.updateLoginUserDetails, request);
        });
    }
}
exports.default = AuthClient;
//# sourceMappingURL=auth.js.map