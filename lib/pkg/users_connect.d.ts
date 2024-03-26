import { CreateUserRequest, CreateUserResponse, DeleteUserRequest, GetUserRequest, GetUserResponse, ListUserRequest, ListUserResponse, UpdateUserRequest, UpdateUserResponse } from "./users_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.users.UserService
 */
export declare const UserService: {
    readonly typeName: "scalekit.v1.users.UserService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.users.UserService.CreateUser
         */
        readonly createUser: {
            readonly name: "CreateUser";
            readonly I: typeof CreateUserRequest;
            readonly O: typeof CreateUserResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.UpdateUser
         */
        readonly updateUser: {
            readonly name: "UpdateUser";
            readonly I: typeof UpdateUserRequest;
            readonly O: typeof UpdateUserResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.GetUser
         */
        readonly getUser: {
            readonly name: "GetUser";
            readonly I: typeof GetUserRequest;
            readonly O: typeof GetUserResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.ListUsers
         */
        readonly listUsers: {
            readonly name: "ListUsers";
            readonly I: typeof ListUserRequest;
            readonly O: typeof ListUserResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.DeleteUser
         */
        readonly deleteUser: {
            readonly name: "DeleteUser";
            readonly I: typeof DeleteUserRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
    };
};
