import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Struct, Timestamp } from "@bufbuild/protobuf";
import { ConnectionType, PasswordlessType } from "../connections/connections_pb.js";
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
    WEBAUTHN_VERIFIED = 15
}
/**
 * @generated from message scalekit.v1.auth.ListAuthMethodsRequest
 */
export declare class ListAuthMethodsRequest extends Message<ListAuthMethodsRequest> {
    /**
     * @generated from field: string intent = 1;
     */
    intent: string;
    constructor(data?: PartialMessage<ListAuthMethodsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.ListAuthMethodsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAuthMethodsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAuthMethodsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAuthMethodsRequest;
    static equals(a: ListAuthMethodsRequest | PlainMessage<ListAuthMethodsRequest> | undefined, b: ListAuthMethodsRequest | PlainMessage<ListAuthMethodsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.ListAuthMethodsResponse
 */
export declare class ListAuthMethodsResponse extends Message<ListAuthMethodsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.auth.AuthMethod auth_methods = 1;
     */
    authMethods: AuthMethod[];
    constructor(data?: PartialMessage<ListAuthMethodsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.ListAuthMethodsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAuthMethodsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAuthMethodsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAuthMethodsResponse;
    static equals(a: ListAuthMethodsResponse | PlainMessage<ListAuthMethodsResponse> | undefined, b: ListAuthMethodsResponse | PlainMessage<ListAuthMethodsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.AuthMethod
 */
export declare class AuthMethod extends Message<AuthMethod> {
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
    constructor(data?: PartialMessage<AuthMethod>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.AuthMethod";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AuthMethod;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AuthMethod;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AuthMethod;
    static equals(a: AuthMethod | PlainMessage<AuthMethod> | undefined, b: AuthMethod | PlainMessage<AuthMethod> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.DiscoveryAuthMethodRequest
 */
export declare class DiscoveryAuthMethodRequest extends Message<DiscoveryAuthMethodRequest> {
    /**
     * @generated from field: scalekit.v1.auth.DiscoveryRequest discovery_request = 2;
     */
    discoveryRequest?: DiscoveryRequest;
    constructor(data?: PartialMessage<DiscoveryAuthMethodRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.DiscoveryAuthMethodRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DiscoveryAuthMethodRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DiscoveryAuthMethodRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DiscoveryAuthMethodRequest;
    static equals(a: DiscoveryAuthMethodRequest | PlainMessage<DiscoveryAuthMethodRequest> | undefined, b: DiscoveryAuthMethodRequest | PlainMessage<DiscoveryAuthMethodRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.DiscoveryRequest
 */
export declare class DiscoveryRequest extends Message<DiscoveryRequest> {
    /**
     * @generated from field: string email = 1;
     */
    email: string;
    /**
     * @generated from field: scalekit.v1.auth.Intent intent = 2;
     */
    intent: Intent;
    constructor(data?: PartialMessage<DiscoveryRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.DiscoveryRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DiscoveryRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DiscoveryRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DiscoveryRequest;
    static equals(a: DiscoveryRequest | PlainMessage<DiscoveryRequest> | undefined, b: DiscoveryRequest | PlainMessage<DiscoveryRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.DiscoveryAuthMethodResponse
 */
export declare class DiscoveryAuthMethodResponse extends Message<DiscoveryAuthMethodResponse> {
    /**
     * @generated from field: scalekit.v1.auth.AuthMethod auth_method = 1;
     */
    authMethod?: AuthMethod;
    constructor(data?: PartialMessage<DiscoveryAuthMethodResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.DiscoveryAuthMethodResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DiscoveryAuthMethodResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DiscoveryAuthMethodResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DiscoveryAuthMethodResponse;
    static equals(a: DiscoveryAuthMethodResponse | PlainMessage<DiscoveryAuthMethodResponse> | undefined, b: DiscoveryAuthMethodResponse | PlainMessage<DiscoveryAuthMethodResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.GetAuthCustomizationsRequest
 */
export declare class GetAuthCustomizationsRequest extends Message<GetAuthCustomizationsRequest> {
    constructor(data?: PartialMessage<GetAuthCustomizationsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.GetAuthCustomizationsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthCustomizationsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthCustomizationsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthCustomizationsRequest;
    static equals(a: GetAuthCustomizationsRequest | PlainMessage<GetAuthCustomizationsRequest> | undefined, b: GetAuthCustomizationsRequest | PlainMessage<GetAuthCustomizationsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.GetAuthCustomizationsResponse
 */
export declare class GetAuthCustomizationsResponse extends Message<GetAuthCustomizationsResponse> {
    /**
     * @generated from field: google.protobuf.Struct customization_settings = 2;
     */
    customizationSettings?: Struct;
    constructor(data?: PartialMessage<GetAuthCustomizationsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.GetAuthCustomizationsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthCustomizationsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthCustomizationsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthCustomizationsResponse;
    static equals(a: GetAuthCustomizationsResponse | PlainMessage<GetAuthCustomizationsResponse> | undefined, b: GetAuthCustomizationsResponse | PlainMessage<GetAuthCustomizationsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.GetAuthFeaturesResponse
 */
export declare class GetAuthFeaturesResponse extends Message<GetAuthFeaturesResponse> {
    /**
     * @generated from field: google.protobuf.Struct features = 1;
     */
    features?: Struct;
    constructor(data?: PartialMessage<GetAuthFeaturesResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.GetAuthFeaturesResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthFeaturesResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthFeaturesResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthFeaturesResponse;
    static equals(a: GetAuthFeaturesResponse | PlainMessage<GetAuthFeaturesResponse> | undefined, b: GetAuthFeaturesResponse | PlainMessage<GetAuthFeaturesResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.VerifyPasswordLessOtpRequest
 */
export declare class VerifyPasswordLessOtpRequest extends Message<VerifyPasswordLessOtpRequest> {
    /**
     * @generated from field: scalekit.v1.auth.OTPRequest otp_req = 2;
     */
    otpReq?: OTPRequest;
    constructor(data?: PartialMessage<VerifyPasswordLessOtpRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.VerifyPasswordLessOtpRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): VerifyPasswordLessOtpRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): VerifyPasswordLessOtpRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): VerifyPasswordLessOtpRequest;
    static equals(a: VerifyPasswordLessOtpRequest | PlainMessage<VerifyPasswordLessOtpRequest> | undefined, b: VerifyPasswordLessOtpRequest | PlainMessage<VerifyPasswordLessOtpRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.VerifyPasswordLessOtpResponse
 */
export declare class VerifyPasswordLessOtpResponse extends Message<VerifyPasswordLessOtpResponse> {
    constructor(data?: PartialMessage<VerifyPasswordLessOtpResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.VerifyPasswordLessOtpResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): VerifyPasswordLessOtpResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): VerifyPasswordLessOtpResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): VerifyPasswordLessOtpResponse;
    static equals(a: VerifyPasswordLessOtpResponse | PlainMessage<VerifyPasswordLessOtpResponse> | undefined, b: VerifyPasswordLessOtpResponse | PlainMessage<VerifyPasswordLessOtpResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.OTPRequest
 */
export declare class OTPRequest extends Message<OTPRequest> {
    /**
     * @generated from field: string code_challenge = 1;
     */
    codeChallenge: string;
    constructor(data?: PartialMessage<OTPRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.OTPRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OTPRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OTPRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OTPRequest;
    static equals(a: OTPRequest | PlainMessage<OTPRequest> | undefined, b: OTPRequest | PlainMessage<OTPRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.ListUserOrganizationsResponse
 */
export declare class ListUserOrganizationsResponse extends Message<ListUserOrganizationsResponse> {
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
    constructor(data?: PartialMessage<ListUserOrganizationsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.ListUserOrganizationsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListUserOrganizationsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListUserOrganizationsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListUserOrganizationsResponse;
    static equals(a: ListUserOrganizationsResponse | PlainMessage<ListUserOrganizationsResponse> | undefined, b: ListUserOrganizationsResponse | PlainMessage<ListUserOrganizationsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.Organization
 */
export declare class Organization extends Message<Organization> {
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
    constructor(data?: PartialMessage<Organization>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.Organization";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Organization;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Organization;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Organization;
    static equals(a: Organization | PlainMessage<Organization> | undefined, b: Organization | PlainMessage<Organization> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.UserDetails
 */
export declare class UserDetails extends Message<UserDetails> {
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
    constructor(data?: PartialMessage<UserDetails>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.UserDetails";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UserDetails;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UserDetails;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UserDetails;
    static equals(a: UserDetails | PlainMessage<UserDetails> | undefined, b: UserDetails | PlainMessage<UserDetails> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.SignupOrganizationRequest
 */
export declare class SignupOrganizationRequest extends Message<SignupOrganizationRequest> {
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
    constructor(data?: PartialMessage<SignupOrganizationRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.SignupOrganizationRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SignupOrganizationRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SignupOrganizationRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SignupOrganizationRequest;
    static equals(a: SignupOrganizationRequest | PlainMessage<SignupOrganizationRequest> | undefined, b: SignupOrganizationRequest | PlainMessage<SignupOrganizationRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.SignupOrganizationResponse
 */
export declare class SignupOrganizationResponse extends Message<SignupOrganizationResponse> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string organization_name = 2;
     */
    organizationName: string;
    constructor(data?: PartialMessage<SignupOrganizationResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.SignupOrganizationResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SignupOrganizationResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SignupOrganizationResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SignupOrganizationResponse;
    static equals(a: SignupOrganizationResponse | PlainMessage<SignupOrganizationResponse> | undefined, b: SignupOrganizationResponse | PlainMessage<SignupOrganizationResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.UpdateLoginUserDetailsRequest
 */
export declare class UpdateLoginUserDetailsRequest extends Message<UpdateLoginUserDetailsRequest> {
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
    constructor(data?: PartialMessage<UpdateLoginUserDetailsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.UpdateLoginUserDetailsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateLoginUserDetailsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateLoginUserDetailsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateLoginUserDetailsRequest;
    static equals(a: UpdateLoginUserDetailsRequest | PlainMessage<UpdateLoginUserDetailsRequest> | undefined, b: UpdateLoginUserDetailsRequest | PlainMessage<UpdateLoginUserDetailsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.User
 */
export declare class User extends Message<User> {
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
    customAttributes?: Struct;
    constructor(data?: PartialMessage<User>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.User";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): User;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): User;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): User;
    static equals(a: User | PlainMessage<User> | undefined, b: User | PlainMessage<User> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.GetAuthStateResponse
 */
export declare class GetAuthStateResponse extends Message<GetAuthStateResponse> {
    /**
     * @generated from field: scalekit.v1.auth.AuthState auth_state = 1;
     */
    authState: AuthState;
    constructor(data?: PartialMessage<GetAuthStateResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.GetAuthStateResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthStateResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthStateResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthStateResponse;
    static equals(a: GetAuthStateResponse | PlainMessage<GetAuthStateResponse> | undefined, b: GetAuthStateResponse | PlainMessage<GetAuthStateResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.GetAuthErrorRequest
 */
export declare class GetAuthErrorRequest extends Message<GetAuthErrorRequest> {
    /**
     * @generated from field: string error_id = 1;
     */
    errorId: string;
    constructor(data?: PartialMessage<GetAuthErrorRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.GetAuthErrorRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthErrorRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthErrorRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthErrorRequest;
    static equals(a: GetAuthErrorRequest | PlainMessage<GetAuthErrorRequest> | undefined, b: GetAuthErrorRequest | PlainMessage<GetAuthErrorRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.GetAuthErrorResponse
 */
export declare class GetAuthErrorResponse extends Message<GetAuthErrorResponse> {
    /**
     * @generated from field: string error = 1;
     */
    error: string;
    /**
     * @generated from field: string error_description = 2;
     */
    errorDescription: string;
    constructor(data?: PartialMessage<GetAuthErrorResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.GetAuthErrorResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthErrorResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthErrorResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthErrorResponse;
    static equals(a: GetAuthErrorResponse | PlainMessage<GetAuthErrorResponse> | undefined, b: GetAuthErrorResponse | PlainMessage<GetAuthErrorResponse> | undefined): boolean;
}
