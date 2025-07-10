import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, MethodOptions, proto3 } from "@bufbuild/protobuf";
/**
 * @generated from enum scalekit.v1.options.AuthenticationType
 */
export declare enum AuthenticationType {
    /**
     * API is blocked / private  and default
     *
     * @generated from enum value: BLOCKED = 0;
     */
    BLOCKED = 0,
    /**
     * API is open
     *
     * @generated from enum value: NONE = 1;
     */
    NONE = 1,
    /**
     * workspace_id is in claims
     *
     * @generated from enum value: WORKSPACE = 64;
     */
    WORKSPACE = 64,
    /**
     * claims has organisation ID
     *
     * @generated from enum value: CUSTOMER_PORTAL = 32;
     */
    CUSTOMER_PORTAL = 32,
    /**
     * claims has UI in audience
     *
     * @generated from enum value: SESSION = 16;
     */
    SESSION = 16,
    /**
     * workspace_id is in claims and UI in audience
     *
     * @generated from enum value: WORKSPACE_SESSION = 80;
     */
    WORKSPACE_SESSION = 80,
    /**
     * @generated from enum value: WORKSPACE_SESSION_CUSTOMER_PORTAL = 112;
     */
    WORKSPACE_SESSION_CUSTOMER_PORTAL = 112,
    /**
     * workspace_id,organization_id is in claims and UI in audience
     *
     * @generated from enum value: WORKSPACE_SESSION_CUSTOMER_PORTAL_CLIENT = 116;
     */
    WORKSPACE_SESSION_CUSTOMER_PORTAL_CLIENT = 116,
    /**
     * user_id is in claims
     *
     * @generated from enum value: USER = 8;
     */
    USER = 8,
    /**
     * client Id is in subject
     *
     * @generated from enum value: CLIENT = 4;
     */
    CLIENT = 4,
    /**
     * UI in audience or client Id is in subject
     *
     * @generated from enum value: SESSION_CLIENT = 20;
     */
    SESSION_CLIENT = 20,
    /**
     * workspace_id is in claims, UI in audience and client Id is in subject
     *
     * @generated from enum value: WORKSPACE_SESSION_CLIENT = 84;
     */
    WORKSPACE_SESSION_CLIENT = 84,
    /**
     * claims has organisation ID, UI in audience and client Id is in subject
     *
     * @generated from enum value: CUSTOMER_PORTAL_SESSION_CLIENT = 52;
     */
    CUSTOMER_PORTAL_SESSION_CLIENT = 52
}
/**
 * @generated from message scalekit.v1.options.AuthOption
 */
export declare class AuthOption extends Message<AuthOption> {
    /**
     * @generated from field: scalekit.v1.options.AuthenticationType authentication_type = 3;
     */
    authenticationType: AuthenticationType;
    /**
     * @generated from field: string permission = 1;
     */
    permission: string;
    constructor(data?: PartialMessage<AuthOption>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.options.AuthOption";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AuthOption;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AuthOption;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AuthOption;
    static equals(a: AuthOption | PlainMessage<AuthOption> | undefined, b: AuthOption | PlainMessage<AuthOption> | undefined): boolean;
}
/**
 * @generated from extension: scalekit.v1.options.AuthOption auth_option = 50000;
 */
export declare const auth_option: import("@bufbuild/protobuf").Extension<MethodOptions, AuthOption>;
