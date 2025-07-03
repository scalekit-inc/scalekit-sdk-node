import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
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
 * @generated from message scalekit.v1.auth.passwordless.SendPasswordlessRequest
 */
export declare class SendPasswordlessRequest extends Message<SendPasswordlessRequest> {
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
    constructor(data?: PartialMessage<SendPasswordlessRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.passwordless.SendPasswordlessRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SendPasswordlessRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SendPasswordlessRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SendPasswordlessRequest;
    static equals(a: SendPasswordlessRequest | PlainMessage<SendPasswordlessRequest> | undefined, b: SendPasswordlessRequest | PlainMessage<SendPasswordlessRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.passwordless.SendPasswordlessResponse
 */
export declare class SendPasswordlessResponse extends Message<SendPasswordlessResponse> {
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
    constructor(data?: PartialMessage<SendPasswordlessResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.passwordless.SendPasswordlessResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SendPasswordlessResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SendPasswordlessResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SendPasswordlessResponse;
    static equals(a: SendPasswordlessResponse | PlainMessage<SendPasswordlessResponse> | undefined, b: SendPasswordlessResponse | PlainMessage<SendPasswordlessResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.passwordless.VerifyPasswordLessRequest
 */
export declare class VerifyPasswordLessRequest extends Message<VerifyPasswordLessRequest> {
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
    constructor(data?: PartialMessage<VerifyPasswordLessRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.passwordless.VerifyPasswordLessRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): VerifyPasswordLessRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): VerifyPasswordLessRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): VerifyPasswordLessRequest;
    static equals(a: VerifyPasswordLessRequest | PlainMessage<VerifyPasswordLessRequest> | undefined, b: VerifyPasswordLessRequest | PlainMessage<VerifyPasswordLessRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.passwordless.ResendPasswordlessRequest
 */
export declare class ResendPasswordlessRequest extends Message<ResendPasswordlessRequest> {
    /**
     * @generated from field: string auth_request_id = 1;
     */
    authRequestId: string;
    constructor(data?: PartialMessage<ResendPasswordlessRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.passwordless.ResendPasswordlessRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ResendPasswordlessRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ResendPasswordlessRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ResendPasswordlessRequest;
    static equals(a: ResendPasswordlessRequest | PlainMessage<ResendPasswordlessRequest> | undefined, b: ResendPasswordlessRequest | PlainMessage<ResendPasswordlessRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.passwordless.VerifyPasswordLessResponse
 */
export declare class VerifyPasswordLessResponse extends Message<VerifyPasswordLessResponse> {
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
    constructor(data?: PartialMessage<VerifyPasswordLessResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.passwordless.VerifyPasswordLessResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): VerifyPasswordLessResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): VerifyPasswordLessResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): VerifyPasswordLessResponse;
    static equals(a: VerifyPasswordLessResponse | PlainMessage<VerifyPasswordLessResponse> | undefined, b: VerifyPasswordLessResponse | PlainMessage<VerifyPasswordLessResponse> | undefined): boolean;
}
