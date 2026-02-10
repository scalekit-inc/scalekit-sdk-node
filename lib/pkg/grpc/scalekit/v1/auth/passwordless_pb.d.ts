import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/auth/passwordless.proto.
 */
export declare const file_scalekit_v1_auth_passwordless: GenFile;
/**
 * @generated from message scalekit.v1.auth.passwordless.SendPasswordlessRequest
 */
export type SendPasswordlessRequest = Message<"scalekit.v1.auth.passwordless.SendPasswordlessRequest"> & {
    /**
     * @generated from field: string email = 1;
     */
    email: string;
    /**
     * @generated from field: optional scalekit.v1.auth.passwordless.TemplateType template = 2;
     */
    template?: TemplateType;
    /**
     * @generated from field: optional string magiclink_auth_uri = 3;
     */
    magiclinkAuthUri?: string;
    /**
     * @generated from field: optional string state = 4;
     */
    state?: string;
    /**
     * @generated from field: optional uint32 expires_in = 5;
     */
    expiresIn?: number;
    /**
     * @generated from field: map<string, string> template_variables = 6;
     */
    templateVariables: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.auth.passwordless.SendPasswordlessRequest.
 * Use `create(SendPasswordlessRequestSchema)` to create a new message.
 */
export declare const SendPasswordlessRequestSchema: GenMessage<SendPasswordlessRequest>;
/**
 * @generated from message scalekit.v1.auth.passwordless.SendPasswordlessResponse
 */
export type SendPasswordlessResponse = Message<"scalekit.v1.auth.passwordless.SendPasswordlessResponse"> & {
    /**
     * @generated from field: string auth_request_id = 1;
     */
    authRequestId: string;
    /**
     * @generated from field: int64 expires_at = 2;
     */
    expiresAt: bigint;
    /**
     * @generated from field: uint32 expires_in = 3;
     */
    expiresIn: number;
    /**
     * @generated from field: scalekit.v1.auth.passwordless.PasswordlessType passwordless_type = 4;
     */
    passwordlessType: PasswordlessType;
};
/**
 * Describes the message scalekit.v1.auth.passwordless.SendPasswordlessResponse.
 * Use `create(SendPasswordlessResponseSchema)` to create a new message.
 */
export declare const SendPasswordlessResponseSchema: GenMessage<SendPasswordlessResponse>;
/**
 * @generated from message scalekit.v1.auth.passwordless.VerifyPasswordLessRequest
 */
export type VerifyPasswordLessRequest = Message<"scalekit.v1.auth.passwordless.VerifyPasswordLessRequest"> & {
    /**
     * @generated from oneof scalekit.v1.auth.passwordless.VerifyPasswordLessRequest.auth_credential
     */
    authCredential: {
        /**
         * @generated from field: string code = 1;
         */
        value: string;
        case: "code";
    } | {
        /**
         * @generated from field: string link_token = 2;
         */
        value: string;
        case: "linkToken";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: optional string auth_request_id = 3;
     */
    authRequestId?: string;
};
/**
 * Describes the message scalekit.v1.auth.passwordless.VerifyPasswordLessRequest.
 * Use `create(VerifyPasswordLessRequestSchema)` to create a new message.
 */
export declare const VerifyPasswordLessRequestSchema: GenMessage<VerifyPasswordLessRequest>;
/**
 * @generated from message scalekit.v1.auth.passwordless.ResendPasswordlessRequest
 */
export type ResendPasswordlessRequest = Message<"scalekit.v1.auth.passwordless.ResendPasswordlessRequest"> & {
    /**
     * @generated from field: string auth_request_id = 1;
     */
    authRequestId: string;
};
/**
 * Describes the message scalekit.v1.auth.passwordless.ResendPasswordlessRequest.
 * Use `create(ResendPasswordlessRequestSchema)` to create a new message.
 */
export declare const ResendPasswordlessRequestSchema: GenMessage<ResendPasswordlessRequest>;
/**
 * @generated from message scalekit.v1.auth.passwordless.VerifyPasswordLessResponse
 */
export type VerifyPasswordLessResponse = Message<"scalekit.v1.auth.passwordless.VerifyPasswordLessResponse"> & {
    /**
     * @generated from field: string email = 1;
     */
    email: string;
    /**
     * @generated from field: optional string state = 2;
     */
    state?: string;
    /**
     * @generated from field: optional scalekit.v1.auth.passwordless.TemplateType template = 3;
     */
    template?: TemplateType;
    /**
     * @generated from field: scalekit.v1.auth.passwordless.PasswordlessType passwordless_type = 4;
     */
    passwordlessType: PasswordlessType;
};
/**
 * Describes the message scalekit.v1.auth.passwordless.VerifyPasswordLessResponse.
 * Use `create(VerifyPasswordLessResponseSchema)` to create a new message.
 */
export declare const VerifyPasswordLessResponseSchema: GenMessage<VerifyPasswordLessResponse>;
/**
 * @generated from enum scalekit.v1.auth.passwordless.TemplateType
 */
export declare enum TemplateType {
    /**
     * @generated from enum value: UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: SIGNIN = 1;
     */
    SIGNIN = 1,
    /**
     * @generated from enum value: SIGNUP = 2;
     */
    SIGNUP = 2
}
/**
 * Describes the enum scalekit.v1.auth.passwordless.TemplateType.
 */
export declare const TemplateTypeSchema: GenEnum<TemplateType>;
/**
 * @generated from enum scalekit.v1.auth.passwordless.PasswordlessType
 */
export declare enum PasswordlessType {
    /**
     * @generated from enum value: PASSWORDLESS_TYPE_UNSPECIFIED = 0;
     */
    PASSWORDLESS_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: OTP = 1;
     */
    OTP = 1,
    /**
     * @generated from enum value: LINK = 2;
     */
    LINK = 2,
    /**
     * @generated from enum value: LINK_OTP = 3;
     */
    LINK_OTP = 3
}
/**
 * Describes the enum scalekit.v1.auth.passwordless.PasswordlessType.
 */
export declare const PasswordlessTypeSchema: GenEnum<PasswordlessType>;
/**
 * @generated from service scalekit.v1.auth.passwordless.PasswordlessService
 */
export declare const PasswordlessService: GenService<{
    /**
     * @generated from rpc scalekit.v1.auth.passwordless.PasswordlessService.SendPasswordlessEmail
     */
    sendPasswordlessEmail: {
        methodKind: "unary";
        input: typeof SendPasswordlessRequestSchema;
        output: typeof SendPasswordlessResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.passwordless.PasswordlessService.VerifyPasswordlessEmail
     */
    verifyPasswordlessEmail: {
        methodKind: "unary";
        input: typeof VerifyPasswordLessRequestSchema;
        output: typeof VerifyPasswordLessResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.passwordless.PasswordlessService.ResendPasswordlessEmail
     */
    resendPasswordlessEmail: {
        methodKind: "unary";
        input: typeof ResendPasswordlessRequestSchema;
        output: typeof SendPasswordlessResponseSchema;
    };
}>;
