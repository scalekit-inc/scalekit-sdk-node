import type { GenEnum, GenExtension, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { MethodOptions } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/options/options.proto.
 */
export declare const file_scalekit_v1_options_options: GenFile;
/**
 * @generated from message scalekit.v1.options.AuthOption
 */
export type AuthOption = Message<"scalekit.v1.options.AuthOption"> & {
    /**
     * @generated from field: scalekit.v1.options.AuthenticationType authentication_type = 3;
     */
    authenticationType: AuthenticationType;
    /**
     * @generated from field: repeated string permissions = 1;
     */
    permissions: string[];
    /**
     * @generated from field: scalekit.v1.options.Policy policy = 2;
     */
    policy: Policy;
};
/**
 * Describes the message scalekit.v1.options.AuthOption.
 * Use `create(AuthOptionSchema)` to create a new message.
 */
export declare const AuthOptionSchema: GenMessage<AuthOption>;
/**
 * @generated from enum scalekit.v1.options.Policy
 */
export declare enum Policy {
    /**
     * @generated from enum value: DENY = 0;
     */
    DENY = 0,
    /**
     * @generated from enum value: PARTIAL = 1;
     */
    PARTIAL = 1,
    /**
     * @generated from enum value: ALLOW = 2;
     */
    ALLOW = 2
}
/**
 * Describes the enum scalekit.v1.options.Policy.
 */
export declare const PolicySchema: GenEnum<Policy>;
/**
 * @generated from enum scalekit.v1.options.AuthenticationType
 */
export declare enum AuthenticationType {
    /**
     * API is Blocked to access
     *
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
     * Workspace auth option is for Scalekit Dashboard
     *
     * workspace_id is in claims
     *
     * @generated from enum value: WORKSPACE = 64;
     */
    WORKSPACE = 64,
    /**
     * Customer portal is for customer admin portal access
     *
     * claims has organisation ID
     *
     * @generated from enum value: CUSTOMER_PORTAL = 32;
     */
    CUSTOMER_PORTAL = 32,
    /**
     * (UI audience in claims) this is for API that need to work on env.scalekit.com scoped access alone.
     *
     * @generated from enum value: SESSION = 16;
     */
    SESSION = 16,
    /**
     * @generated from enum value: WORKSPACE_SESSION = 80;
     */
    WORKSPACE_SESSION = 80,
    /**
     * workspace_id is in claims and UI in audience
     *
     * @generated from enum value: WORKSPACE_CLIENT = 68;
     */
    WORKSPACE_CLIENT = 68,
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
     * @generated from enum value: WORKSPACE_CUSTOMER_PORTAL_CLIENT = 100;
     */
    WORKSPACE_CUSTOMER_PORTAL_CLIENT = 100,
    /**
     * workspace_id,organization_id is in claims and client Id is in subject
     *
     * @generated from enum value: WORKSPACE_CUSTOMER_PORTAL = 96;
     */
    WORKSPACE_CUSTOMER_PORTAL = 96,
    /**
     * user_id is in claims
     *
     * @generated from enum value: USER = 8;
     */
    USER = 8,
    /**
     * client is environment primary client ID
     *
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
 * Describes the enum scalekit.v1.options.AuthenticationType.
 */
export declare const AuthenticationTypeSchema: GenEnum<AuthenticationType>;
/**
 * @generated from extension: scalekit.v1.options.AuthOption auth_option = 50000;
 */
export declare const auth_option: GenExtension<MethodOptions, AuthOption>;
