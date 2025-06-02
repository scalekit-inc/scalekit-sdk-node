import { ResendPasswordlessRequest, SendPasswordlessRequest, SendPasswordlessResponse, VerifyPasswordLessRequest, VerifyPasswordLessResponse } from "./passwordless_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.auth.passwordless.PasswordlessService
 */
export declare const PasswordlessService: {
    readonly typeName: "scalekit.v1.auth.passwordless.PasswordlessService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.auth.passwordless.PasswordlessService.SendPasswordlessEmail
         */
        readonly sendPasswordlessEmail: {
            readonly name: "SendPasswordlessEmail";
            readonly I: typeof SendPasswordlessRequest;
            readonly O: typeof SendPasswordlessResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.passwordless.PasswordlessService.VerifyPasswordlessEmail
         */
        readonly verifyPasswordlessEmail: {
            readonly name: "VerifyPasswordlessEmail";
            readonly I: typeof VerifyPasswordLessRequest;
            readonly O: typeof VerifyPasswordLessResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.auth.passwordless.PasswordlessService.ResendPasswordlessEmail
         */
        readonly resendPasswordlessEmail: {
            readonly name: "ResendPasswordlessEmail";
            readonly I: typeof ResendPasswordlessRequest;
            readonly O: typeof SendPasswordlessResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
