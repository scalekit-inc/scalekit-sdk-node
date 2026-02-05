import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { ConnectionType, PasswordlessType } from "../connections/connections_pb";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/auth/auth.proto.
 */
export declare const file_scalekit_v1_auth_auth: GenFile;
/**
 * @generated from message scalekit.v1.auth.ListAuthMethodsRequest
 */
export type ListAuthMethodsRequest = Message<"scalekit.v1.auth.ListAuthMethodsRequest"> & {
    /**
     * @generated from field: string intent = 1;
     */
    intent: string;
};
/**
 * Describes the message scalekit.v1.auth.ListAuthMethodsRequest.
 * Use `create(ListAuthMethodsRequestSchema)` to create a new message.
 */
export declare const ListAuthMethodsRequestSchema: GenMessage<ListAuthMethodsRequest>;
/**
 * @generated from message scalekit.v1.auth.ListAuthMethodsResponse
 */
export type ListAuthMethodsResponse = Message<"scalekit.v1.auth.ListAuthMethodsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.auth.AuthMethod auth_methods = 1;
     */
    authMethods: AuthMethod[];
};
/**
 * Describes the message scalekit.v1.auth.ListAuthMethodsResponse.
 * Use `create(ListAuthMethodsResponseSchema)` to create a new message.
 */
export declare const ListAuthMethodsResponseSchema: GenMessage<ListAuthMethodsResponse>;
/**
 * @generated from message scalekit.v1.auth.AuthMethod
 */
export type AuthMethod = Message<"scalekit.v1.auth.AuthMethod"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: scalekit.v1.connections.ConnectionType connection_type = 2;
     */
    connectionType: ConnectionType;
    /**
     * @generated from field: string provider = 3;
     */
    provider: string;
    /**
     * @generated from field: string auth_initiation_uri = 4;
     */
    authInitiationUri: string;
    /**
     * @generated from field: optional scalekit.v1.connections.PasswordlessType passwordless_type = 5;
     */
    passwordlessType?: PasswordlessType;
    /**
     * @generated from field: optional uint32 code_challenge_length = 6;
     */
    codeChallengeLength?: number;
    /**
     * @generated from field: optional bool enable_webauthn_auto_registration = 7;
     */
    enableWebauthnAutoRegistration?: boolean;
    /**
     * @generated from field: optional bool show_passkey_button = 8;
     */
    showPasskeyButton?: boolean;
    /**
     * @generated from field: optional bool enable_webauthn_conditional_login = 9;
     */
    enableWebauthnConditionalLogin?: boolean;
};
/**
 * Describes the message scalekit.v1.auth.AuthMethod.
 * Use `create(AuthMethodSchema)` to create a new message.
 */
export declare const AuthMethodSchema: GenMessage<AuthMethod>;
/**
 * @generated from message scalekit.v1.auth.DiscoveryAuthMethodRequest
 */
export type DiscoveryAuthMethodRequest = Message<"scalekit.v1.auth.DiscoveryAuthMethodRequest"> & {
    /**
     * @generated from field: scalekit.v1.auth.DiscoveryRequest discovery_request = 2;
     */
    discoveryRequest?: DiscoveryRequest;
};
/**
 * Describes the message scalekit.v1.auth.DiscoveryAuthMethodRequest.
 * Use `create(DiscoveryAuthMethodRequestSchema)` to create a new message.
 */
export declare const DiscoveryAuthMethodRequestSchema: GenMessage<DiscoveryAuthMethodRequest>;
/**
 * @generated from message scalekit.v1.auth.DiscoveryRequest
 */
export type DiscoveryRequest = Message<"scalekit.v1.auth.DiscoveryRequest"> & {
    /**
     * @generated from field: string email = 1;
     */
    email: string;
    /**
     * @generated from field: scalekit.v1.auth.Intent intent = 2;
     */
    intent: Intent;
};
/**
 * Describes the message scalekit.v1.auth.DiscoveryRequest.
 * Use `create(DiscoveryRequestSchema)` to create a new message.
 */
export declare const DiscoveryRequestSchema: GenMessage<DiscoveryRequest>;
/**
 * @generated from message scalekit.v1.auth.DiscoveryAuthMethodResponse
 */
export type DiscoveryAuthMethodResponse = Message<"scalekit.v1.auth.DiscoveryAuthMethodResponse"> & {
    /**
     * @generated from field: scalekit.v1.auth.AuthMethod auth_method = 1;
     */
    authMethod?: AuthMethod;
};
/**
 * Describes the message scalekit.v1.auth.DiscoveryAuthMethodResponse.
 * Use `create(DiscoveryAuthMethodResponseSchema)` to create a new message.
 */
export declare const DiscoveryAuthMethodResponseSchema: GenMessage<DiscoveryAuthMethodResponse>;
/**
 * @generated from message scalekit.v1.auth.GetAuthCustomizationsRequest
 */
export type GetAuthCustomizationsRequest = Message<"scalekit.v1.auth.GetAuthCustomizationsRequest"> & {};
/**
 * Describes the message scalekit.v1.auth.GetAuthCustomizationsRequest.
 * Use `create(GetAuthCustomizationsRequestSchema)` to create a new message.
 */
export declare const GetAuthCustomizationsRequestSchema: GenMessage<GetAuthCustomizationsRequest>;
/**
 * @generated from message scalekit.v1.auth.GetAuthCustomizationsResponse
 */
export type GetAuthCustomizationsResponse = Message<"scalekit.v1.auth.GetAuthCustomizationsResponse"> & {
    /**
     * @generated from field: google.protobuf.Struct customization_settings = 2;
     */
    customizationSettings?: JsonObject;
};
/**
 * Describes the message scalekit.v1.auth.GetAuthCustomizationsResponse.
 * Use `create(GetAuthCustomizationsResponseSchema)` to create a new message.
 */
export declare const GetAuthCustomizationsResponseSchema: GenMessage<GetAuthCustomizationsResponse>;
/**
 * @generated from message scalekit.v1.auth.GetAuthFeaturesResponse
 */
export type GetAuthFeaturesResponse = Message<"scalekit.v1.auth.GetAuthFeaturesResponse"> & {
    /**
     * @generated from field: google.protobuf.Struct features = 1;
     */
    features?: JsonObject;
};
/**
 * Describes the message scalekit.v1.auth.GetAuthFeaturesResponse.
 * Use `create(GetAuthFeaturesResponseSchema)` to create a new message.
 */
export declare const GetAuthFeaturesResponseSchema: GenMessage<GetAuthFeaturesResponse>;
/**
 * @generated from message scalekit.v1.auth.VerifyPasswordLessOtpRequest
 */
export type VerifyPasswordLessOtpRequest = Message<"scalekit.v1.auth.VerifyPasswordLessOtpRequest"> & {
    /**
     * @generated from field: scalekit.v1.auth.OTPRequest otp_req = 2;
     */
    otpReq?: OTPRequest;
};
/**
 * Describes the message scalekit.v1.auth.VerifyPasswordLessOtpRequest.
 * Use `create(VerifyPasswordLessOtpRequestSchema)` to create a new message.
 */
export declare const VerifyPasswordLessOtpRequestSchema: GenMessage<VerifyPasswordLessOtpRequest>;
/**
 * @generated from message scalekit.v1.auth.VerifyPasswordLessOtpResponse
 */
export type VerifyPasswordLessOtpResponse = Message<"scalekit.v1.auth.VerifyPasswordLessOtpResponse"> & {};
/**
 * Describes the message scalekit.v1.auth.VerifyPasswordLessOtpResponse.
 * Use `create(VerifyPasswordLessOtpResponseSchema)` to create a new message.
 */
export declare const VerifyPasswordLessOtpResponseSchema: GenMessage<VerifyPasswordLessOtpResponse>;
/**
 * @generated from message scalekit.v1.auth.OTPRequest
 */
export type OTPRequest = Message<"scalekit.v1.auth.OTPRequest"> & {
    /**
     * @generated from field: string code_challenge = 1;
     */
    codeChallenge: string;
};
/**
 * Describes the message scalekit.v1.auth.OTPRequest.
 * Use `create(OTPRequestSchema)` to create a new message.
 */
export declare const OTPRequestSchema: GenMessage<OTPRequest>;
/**
 * @generated from message scalekit.v1.auth.ListUserOrganizationsResponse
 */
export type ListUserOrganizationsResponse = Message<"scalekit.v1.auth.ListUserOrganizationsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.auth.Organization organizations = 1;
     */
    organizations: Organization[];
    /**
     * @generated from field: scalekit.v1.auth.UserDetails user = 2;
     */
    user?: UserDetails;
    /**
     * @generated from field: scalekit.v1.auth.Intent intent = 3;
     */
    intent: Intent;
};
/**
 * Describes the message scalekit.v1.auth.ListUserOrganizationsResponse.
 * Use `create(ListUserOrganizationsResponseSchema)` to create a new message.
 */
export declare const ListUserOrganizationsResponseSchema: GenMessage<ListUserOrganizationsResponse>;
/**
 * @generated from message scalekit.v1.auth.Organization
 */
export type Organization = Message<"scalekit.v1.auth.Organization"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string membership_status = 3;
     */
    membershipStatus: string;
    /**
     * @generated from field: optional string invitation_inviter_email = 4;
     */
    invitationInviterEmail?: string;
    /**
     * @generated from field: optional google.protobuf.Timestamp invitation_accepted_at = 5;
     */
    invitationAcceptedAt?: Timestamp;
    /**
     * @generated from field: optional google.protobuf.Timestamp invitation_created_at = 6;
     */
    invitationCreatedAt?: Timestamp;
    /**
     * @generated from field: optional google.protobuf.Timestamp invitation_expires_at = 7;
     */
    invitationExpiresAt?: Timestamp;
};
/**
 * Describes the message scalekit.v1.auth.Organization.
 * Use `create(OrganizationSchema)` to create a new message.
 */
export declare const OrganizationSchema: GenMessage<Organization>;
/**
 * @generated from message scalekit.v1.auth.UserDetails
 */
export type UserDetails = Message<"scalekit.v1.auth.UserDetails"> & {
    /**
     * @generated from field: string email = 1;
     */
    email: string;
    /**
     * @generated from field: string first_name = 2;
     */
    firstName: string;
    /**
     * @generated from field: string last_name = 3;
     */
    lastName: string;
};
/**
 * Describes the message scalekit.v1.auth.UserDetails.
 * Use `create(UserDetailsSchema)` to create a new message.
 */
export declare const UserDetailsSchema: GenMessage<UserDetails>;
/**
 * @generated from message scalekit.v1.auth.SignupOrganizationRequest
 */
export type SignupOrganizationRequest = Message<"scalekit.v1.auth.SignupOrganizationRequest"> & {
    /**
     * making all optional for now
     *
     * @generated from field: string organization_name = 1;
     */
    organizationName: string;
    /**
     * @generated from field: string first_name = 2;
     */
    firstName: string;
    /**
     * @generated from field: string last_name = 3;
     */
    lastName: string;
    /**
     * @generated from field: string full_name = 4;
     */
    fullName: string;
    /**
     * @generated from field: string phone_number = 5;
     */
    phoneNumber: string;
};
/**
 * Describes the message scalekit.v1.auth.SignupOrganizationRequest.
 * Use `create(SignupOrganizationRequestSchema)` to create a new message.
 */
export declare const SignupOrganizationRequestSchema: GenMessage<SignupOrganizationRequest>;
/**
 * @generated from message scalekit.v1.auth.SignupOrganizationResponse
 */
export type SignupOrganizationResponse = Message<"scalekit.v1.auth.SignupOrganizationResponse"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string organization_name = 2;
     */
    organizationName: string;
};
/**
 * Describes the message scalekit.v1.auth.SignupOrganizationResponse.
 * Use `create(SignupOrganizationResponseSchema)` to create a new message.
 */
export declare const SignupOrganizationResponseSchema: GenMessage<SignupOrganizationResponse>;
/**
 * @generated from message scalekit.v1.auth.UpdateLoginUserDetailsRequest
 */
export type UpdateLoginUserDetailsRequest = Message<"scalekit.v1.auth.UpdateLoginUserDetailsRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string login_request_id = 2;
     */
    loginRequestId: string;
    /**
     * @generated from field: scalekit.v1.auth.User user = 3;
     */
    user?: User;
};
/**
 * Describes the message scalekit.v1.auth.UpdateLoginUserDetailsRequest.
 * Use `create(UpdateLoginUserDetailsRequestSchema)` to create a new message.
 */
export declare const UpdateLoginUserDetailsRequestSchema: GenMessage<UpdateLoginUserDetailsRequest>;
/**
 * @generated from message scalekit.v1.auth.User
 */
export type User = Message<"scalekit.v1.auth.User"> & {
    /**
     * @generated from field: string sub = 1;
     */
    sub: string;
    /**
     * @generated from field: string email = 2;
     */
    email: string;
    /**
     * @generated from field: string given_name = 3;
     */
    givenName: string;
    /**
     * @generated from field: string family_name = 4;
     */
    familyName: string;
    /**
     * @generated from field: bool email_verified = 5;
     */
    emailVerified: boolean;
    /**
     * @generated from field: string phone_number = 6;
     */
    phoneNumber: string;
    /**
     * @generated from field: bool phone_number_verified = 7;
     */
    phoneNumberVerified: boolean;
    /**
     * @generated from field: string name = 8;
     */
    name: string;
    /**
     * @generated from field: string preferred_username = 9;
     */
    preferredUsername: string;
    /**
     * @generated from field: string picture = 10;
     */
    picture: string;
    /**
     * @generated from field: string gender = 11;
     */
    gender: string;
    /**
     * @generated from field: string locale = 12;
     */
    locale: string;
    /**
     * @generated from field: repeated string groups = 13;
     */
    groups: string[];
    /**
     * @generated from field: google.protobuf.Struct custom_attributes = 14;
     */
    customAttributes?: JsonObject;
};
/**
 * Describes the message scalekit.v1.auth.User.
 * Use `create(UserSchema)` to create a new message.
 */
export declare const UserSchema: GenMessage<User>;
/**
 * @generated from message scalekit.v1.auth.GetAuthStateResponse
 */
export type GetAuthStateResponse = Message<"scalekit.v1.auth.GetAuthStateResponse"> & {
    /**
     * @generated from field: scalekit.v1.auth.AuthState auth_state = 1;
     */
    authState: AuthState;
    /**
     * @generated from field: scalekit.v1.auth.UserDetails user = 2;
     */
    user?: UserDetails;
};
/**
 * Describes the message scalekit.v1.auth.GetAuthStateResponse.
 * Use `create(GetAuthStateResponseSchema)` to create a new message.
 */
export declare const GetAuthStateResponseSchema: GenMessage<GetAuthStateResponse>;
/**
 * @generated from message scalekit.v1.auth.GetAuthErrorRequest
 */
export type GetAuthErrorRequest = Message<"scalekit.v1.auth.GetAuthErrorRequest"> & {
    /**
     * @generated from field: string error_id = 1;
     */
    errorId: string;
};
/**
 * Describes the message scalekit.v1.auth.GetAuthErrorRequest.
 * Use `create(GetAuthErrorRequestSchema)` to create a new message.
 */
export declare const GetAuthErrorRequestSchema: GenMessage<GetAuthErrorRequest>;
/**
 * @generated from message scalekit.v1.auth.GetAuthErrorResponse
 */
export type GetAuthErrorResponse = Message<"scalekit.v1.auth.GetAuthErrorResponse"> & {
    /**
     * @generated from field: string error = 1;
     */
    error: string;
    /**
     * @generated from field: string error_description = 2;
     */
    errorDescription: string;
};
/**
 * Describes the message scalekit.v1.auth.GetAuthErrorResponse.
 * Use `create(GetAuthErrorResponseSchema)` to create a new message.
 */
export declare const GetAuthErrorResponseSchema: GenMessage<GetAuthErrorResponse>;
/**
 * @generated from enum scalekit.v1.auth.Intent
 */
export declare enum Intent {
    /**
     * @generated from enum value: INTENT_UNSPECIFIED = 0;
     */
    INTENT_UNSPECIFIED = 0,
    /**
     * @generated from enum value: sign_in = 1;
     */
    sign_in = 1,
    /**
     * @generated from enum value: sign_up = 2;
     */
    sign_up = 2
}
/**
 * Describes the enum scalekit.v1.auth.Intent.
 */
export declare const IntentSchema: GenEnum<Intent>;
/**
 * @generated from enum scalekit.v1.auth.AuthState
 */
export declare enum AuthState {
    /**
     * @generated from enum value: AUTH_STATE_UNSPECIFIED = 0;
     */
    AUTH_STATE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: AUTHENTICATION_IN_PROGRESS = 1;
     */
    AUTHENTICATION_IN_PROGRESS = 1,
    /**
     * @generated from enum value: ORGANIZATION_SWITCHER = 2;
     */
    ORGANIZATION_SWITCHER = 2,
    /**
     * @generated from enum value: ORGANIZATION_SELECTED = 3;
     */
    ORGANIZATION_SELECTED = 3,
    /**
     * @generated from enum value: ORGANIZATION_SIGNUP = 4;
     */
    ORGANIZATION_SIGNUP = 4,
    /**
     * @generated from enum value: ORGANIZATION_SWITCHER_SIGNUP = 5;
     */
    ORGANIZATION_SWITCHER_SIGNUP = 5,
    /**
     * @generated from enum value: OTP_VERIFICATION_PENDING = 6;
     */
    OTP_VERIFICATION_PENDING = 6,
    /**
     * @generated from enum value: MAGIC_LINK_SENT = 7;
     */
    MAGIC_LINK_SENT = 7,
    /**
     * @generated from enum value: LINK_SENT_OTP_VERIFICATION_PENDING = 8;
     */
    LINK_SENT_OTP_VERIFICATION_PENDING = 8,
    /**
     * @generated from enum value: OTP_VERIFIED = 9;
     */
    OTP_VERIFIED = 9,
    /**
     * @generated from enum value: LINK_VERIFIED = 10;
     */
    LINK_VERIFIED = 10,
    /**
     * @generated from enum value: SSO_AUTHENTICATED = 11;
     */
    SSO_AUTHENTICATED = 11,
    /**
     * @generated from enum value: ORG_USER_CREATED = 12;
     */
    ORG_USER_CREATED = 12,
    /**
     * @generated from enum value: AUTHENTICATION_COMPLETED = 13;
     */
    AUTHENTICATION_COMPLETED = 13,
    /**
     * @generated from enum value: AUTHENTICATION_FAILED = 14;
     */
    AUTHENTICATION_FAILED = 14,
    /**
     * @generated from enum value: WEBAUTHN_VERIFIED = 15;
     */
    WEBAUTHN_VERIFIED = 15,
    /**
     * @generated from enum value: VERIFICATION_MAGIC_LINK_SENT = 16;
     */
    VERIFICATION_MAGIC_LINK_SENT = 16,
    /**
     * @generated from enum value: VERIFICATION_MAGIC_LINK_OTP_SENT = 17;
     */
    VERIFICATION_MAGIC_LINK_OTP_SENT = 17,
    /**
     * @generated from enum value: VERIFICATION_OTP_SENT = 18;
     */
    VERIFICATION_OTP_SENT = 18,
    /**
     * @generated from enum value: VERIFICATION_COMPLETED = 19;
     */
    VERIFICATION_COMPLETED = 19
}
/**
 * Describes the enum scalekit.v1.auth.AuthState.
 */
export declare const AuthStateSchema: GenEnum<AuthState>;
/**
 * @generated from service scalekit.v1.auth.AuthService
 */
export declare const AuthService: GenService<{
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.ListAuthMethods
     */
    listAuthMethods: {
        methodKind: "unary";
        input: typeof ListAuthMethodsRequestSchema;
        output: typeof ListAuthMethodsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.DiscoveryAuthMethod
     */
    discoveryAuthMethod: {
        methodKind: "unary";
        input: typeof DiscoveryAuthMethodRequestSchema;
        output: typeof DiscoveryAuthMethodResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.VerifyPasswordLessOtp
     */
    verifyPasswordLessOtp: {
        methodKind: "unary";
        input: typeof VerifyPasswordLessOtpRequestSchema;
        output: typeof VerifyPasswordLessOtpResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.ResendPasswordless
     */
    resendPasswordless: {
        methodKind: "unary";
        input: typeof EmptySchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.ListUserOrganizations
     */
    listUserOrganizations: {
        methodKind: "unary";
        input: typeof EmptySchema;
        output: typeof ListUserOrganizationsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.SignupOrganization
     */
    signupOrganization: {
        methodKind: "unary";
        input: typeof SignupOrganizationRequestSchema;
        output: typeof SignupOrganizationResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.GetAuthState
     */
    getAuthState: {
        methodKind: "unary";
        input: typeof EmptySchema;
        output: typeof GetAuthStateResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.GetAuthError
     */
    getAuthError: {
        methodKind: "unary";
        input: typeof GetAuthErrorRequestSchema;
        output: typeof GetAuthErrorResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.Logout
     */
    logout: {
        methodKind: "unary";
        input: typeof EmptySchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.GetAuthCustomizations
     */
    getAuthCustomizations: {
        methodKind: "unary";
        input: typeof GetAuthCustomizationsRequestSchema;
        output: typeof GetAuthCustomizationsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.GetAuthFeatures
     */
    getAuthFeatures: {
        methodKind: "unary";
        input: typeof EmptySchema;
        output: typeof GetAuthFeaturesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.AuthService.UpdateLoginUserDetails
     */
    updateLoginUserDetails: {
        methodKind: "unary";
        input: typeof UpdateLoginUserDetailsRequestSchema;
        output: typeof EmptySchema;
    };
}>;
