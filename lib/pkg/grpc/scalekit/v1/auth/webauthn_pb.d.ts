import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Struct, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from message scalekit.v1.auth.webauthn.BeginRegistrationRequest
 */
export declare class BeginRegistrationRequest extends Message<BeginRegistrationRequest> {
    constructor(data?: PartialMessage<BeginRegistrationRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.BeginRegistrationRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BeginRegistrationRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BeginRegistrationRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BeginRegistrationRequest;
    static equals(a: BeginRegistrationRequest | PlainMessage<BeginRegistrationRequest> | undefined, b: BeginRegistrationRequest | PlainMessage<BeginRegistrationRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.BeginRegistrationResponse
 */
export declare class BeginRegistrationResponse extends Message<BeginRegistrationResponse> {
    /**
     * @generated from field: google.protobuf.Struct options = 1;
     */
    options?: Struct;
    constructor(data?: PartialMessage<BeginRegistrationResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.BeginRegistrationResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BeginRegistrationResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BeginRegistrationResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BeginRegistrationResponse;
    static equals(a: BeginRegistrationResponse | PlainMessage<BeginRegistrationResponse> | undefined, b: BeginRegistrationResponse | PlainMessage<BeginRegistrationResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.FinishRegistrationRequest
 */
export declare class FinishRegistrationRequest extends Message<FinishRegistrationRequest> {
    /**
     * @generated from field: bytes credential_id = 1;
     */
    credentialId: Uint8Array;
    /**
     * @generated from field: bytes attestation_object = 2;
     */
    attestationObject: Uint8Array;
    /**
     * @generated from field: bytes client_data_json = 3;
     */
    clientDataJson: Uint8Array;
    /**
     * @generated from field: string type = 4;
     */
    type: string;
    /**
     * @generated from field: repeated string transports = 5;
     */
    transports: string[];
    /**
     * @generated from field: string authenticator_attachment = 6;
     */
    authenticatorAttachment: string;
    /**
     * @generated from field: google.protobuf.Struct client_extension_results = 7;
     */
    clientExtensionResults?: Struct;
    constructor(data?: PartialMessage<FinishRegistrationRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.FinishRegistrationRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): FinishRegistrationRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): FinishRegistrationRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): FinishRegistrationRequest;
    static equals(a: FinishRegistrationRequest | PlainMessage<FinishRegistrationRequest> | undefined, b: FinishRegistrationRequest | PlainMessage<FinishRegistrationRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.FinishRegistrationResponse
 */
export declare class FinishRegistrationResponse extends Message<FinishRegistrationResponse> {
    /**
     * @generated from field: bool success = 1;
     */
    success: boolean;
    constructor(data?: PartialMessage<FinishRegistrationResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.FinishRegistrationResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): FinishRegistrationResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): FinishRegistrationResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): FinishRegistrationResponse;
    static equals(a: FinishRegistrationResponse | PlainMessage<FinishRegistrationResponse> | undefined, b: FinishRegistrationResponse | PlainMessage<FinishRegistrationResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.BeginAuthenticationRequest
 */
export declare class BeginAuthenticationRequest extends Message<BeginAuthenticationRequest> {
    /**
     * @generated from field: optional string email = 1;
     */
    email?: string;
    constructor(data?: PartialMessage<BeginAuthenticationRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.BeginAuthenticationRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BeginAuthenticationRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BeginAuthenticationRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BeginAuthenticationRequest;
    static equals(a: BeginAuthenticationRequest | PlainMessage<BeginAuthenticationRequest> | undefined, b: BeginAuthenticationRequest | PlainMessage<BeginAuthenticationRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.BeginAuthenticationResponse
 */
export declare class BeginAuthenticationResponse extends Message<BeginAuthenticationResponse> {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: google.protobuf.Struct options = 2;
     */
    options?: Struct;
    constructor(data?: PartialMessage<BeginAuthenticationResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.BeginAuthenticationResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BeginAuthenticationResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BeginAuthenticationResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BeginAuthenticationResponse;
    static equals(a: BeginAuthenticationResponse | PlainMessage<BeginAuthenticationResponse> | undefined, b: BeginAuthenticationResponse | PlainMessage<BeginAuthenticationResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.FinishAuthenticationRequest
 */
export declare class FinishAuthenticationRequest extends Message<FinishAuthenticationRequest> {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: bytes credential_id = 2;
     */
    credentialId: Uint8Array;
    /**
     * @generated from field: google.protobuf.Struct client_extension_results = 3;
     */
    clientExtensionResults?: Struct;
    /**
     * @generated from field: string type = 4;
     */
    type: string;
    /**
     * @generated from field: scalekit.v1.auth.webauthn.AuthenticatorAssertionResponse response = 5;
     */
    response?: AuthenticatorAssertionResponse;
    /**
     * @generated from field: string authenticator_attachment = 6;
     */
    authenticatorAttachment: string;
    constructor(data?: PartialMessage<FinishAuthenticationRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.FinishAuthenticationRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): FinishAuthenticationRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): FinishAuthenticationRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): FinishAuthenticationRequest;
    static equals(a: FinishAuthenticationRequest | PlainMessage<FinishAuthenticationRequest> | undefined, b: FinishAuthenticationRequest | PlainMessage<FinishAuthenticationRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.AuthenticatorAssertionResponse
 */
export declare class AuthenticatorAssertionResponse extends Message<AuthenticatorAssertionResponse> {
    /**
     * @generated from field: bytes authenticator_data = 1;
     */
    authenticatorData: Uint8Array;
    /**
     * @generated from field: bytes client_data_json = 2;
     */
    clientDataJson: Uint8Array;
    /**
     * @generated from field: bytes signature = 3;
     */
    signature: Uint8Array;
    /**
     * @generated from field: bytes user_handle = 4;
     */
    userHandle: Uint8Array;
    constructor(data?: PartialMessage<AuthenticatorAssertionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.AuthenticatorAssertionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AuthenticatorAssertionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AuthenticatorAssertionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AuthenticatorAssertionResponse;
    static equals(a: AuthenticatorAssertionResponse | PlainMessage<AuthenticatorAssertionResponse> | undefined, b: AuthenticatorAssertionResponse | PlainMessage<AuthenticatorAssertionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.FinishAuthenticationResponse
 */
export declare class FinishAuthenticationResponse extends Message<FinishAuthenticationResponse> {
    /**
     * @generated from field: bool success = 1;
     */
    success: boolean;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: string session_token = 3;
     */
    sessionToken: string;
    constructor(data?: PartialMessage<FinishAuthenticationResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.FinishAuthenticationResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): FinishAuthenticationResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): FinishAuthenticationResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): FinishAuthenticationResponse;
    static equals(a: FinishAuthenticationResponse | PlainMessage<FinishAuthenticationResponse> | undefined, b: FinishAuthenticationResponse | PlainMessage<FinishAuthenticationResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnConfiguration
 */
export declare class WebAuthnConfiguration extends Message<WebAuthnConfiguration> {
    /**
     * @generated from field: string rp_id = 1;
     */
    rpId: string;
    /**
     * @generated from field: string rp_origin = 2;
     */
    rpOrigin: string;
    /**
     * @generated from field: string user_verification = 3;
     */
    userVerification: string;
    /**
     * @generated from field: string authenticator_attachment = 4;
     */
    authenticatorAttachment: string;
    /**
     * @generated from field: string resident_key = 5;
     */
    residentKey: string;
    /**
     * @generated from field: int64 timeout = 6;
     */
    timeout: bigint;
    /**
     * @generated from field: repeated string allowed_transports = 7;
     */
    allowedTransports: string[];
    constructor(data?: PartialMessage<WebAuthnConfiguration>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.WebAuthnConfiguration";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthnConfiguration;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthnConfiguration;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthnConfiguration;
    static equals(a: WebAuthnConfiguration | PlainMessage<WebAuthnConfiguration> | undefined, b: WebAuthnConfiguration | PlainMessage<WebAuthnConfiguration> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.ListCredentialsRequest
 */
export declare class ListCredentialsRequest extends Message<ListCredentialsRequest> {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    constructor(data?: PartialMessage<ListCredentialsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.ListCredentialsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListCredentialsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListCredentialsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListCredentialsRequest;
    static equals(a: ListCredentialsRequest | PlainMessage<ListCredentialsRequest> | undefined, b: ListCredentialsRequest | PlainMessage<ListCredentialsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.ListCredentialsResponse
 */
export declare class ListCredentialsResponse extends Message<ListCredentialsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.auth.webauthn.WebAuthnCredential credentials = 1;
     */
    credentials: WebAuthnCredential[];
    /**
     * @generated from field: scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions all_accepted_credentials_options = 2;
     */
    allAcceptedCredentialsOptions?: AllAcceptedCredentialsOptions;
    constructor(data?: PartialMessage<ListCredentialsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.ListCredentialsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListCredentialsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListCredentialsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListCredentialsResponse;
    static equals(a: ListCredentialsResponse | PlainMessage<ListCredentialsResponse> | undefined, b: ListCredentialsResponse | PlainMessage<ListCredentialsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.DeleteCredentialRequest
 */
export declare class DeleteCredentialRequest extends Message<DeleteCredentialRequest> {
    /**
     * @generated from field: string credential_id = 1;
     */
    credentialId: string;
    constructor(data?: PartialMessage<DeleteCredentialRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.DeleteCredentialRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteCredentialRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteCredentialRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteCredentialRequest;
    static equals(a: DeleteCredentialRequest | PlainMessage<DeleteCredentialRequest> | undefined, b: DeleteCredentialRequest | PlainMessage<DeleteCredentialRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.DeleteCredentialResponse
 */
export declare class DeleteCredentialResponse extends Message<DeleteCredentialResponse> {
    /**
     * @generated from field: bool success = 1;
     */
    success: boolean;
    /**
     * @generated from field: scalekit.v1.auth.webauthn.UnknownCredentialOptions unknown_credential_options = 2;
     */
    unknownCredentialOptions?: UnknownCredentialOptions;
    constructor(data?: PartialMessage<DeleteCredentialResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.DeleteCredentialResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteCredentialResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteCredentialResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteCredentialResponse;
    static equals(a: DeleteCredentialResponse | PlainMessage<DeleteCredentialResponse> | undefined, b: DeleteCredentialResponse | PlainMessage<DeleteCredentialResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.UnknownCredentialOptions
 */
export declare class UnknownCredentialOptions extends Message<UnknownCredentialOptions> {
    /**
     * @generated from field: string rp_id = 1;
     */
    rpId: string;
    /**
     * @generated from field: string credential_id = 2;
     */
    credentialId: string;
    constructor(data?: PartialMessage<UnknownCredentialOptions>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.UnknownCredentialOptions";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UnknownCredentialOptions;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UnknownCredentialOptions;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UnknownCredentialOptions;
    static equals(a: UnknownCredentialOptions | PlainMessage<UnknownCredentialOptions> | undefined, b: UnknownCredentialOptions | PlainMessage<UnknownCredentialOptions> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions
 */
export declare class AllAcceptedCredentialsOptions extends Message<AllAcceptedCredentialsOptions> {
    /**
     * @generated from field: string rp_id = 1;
     */
    rpId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: repeated string all_accepted_credential_ids = 3;
     */
    allAcceptedCredentialIds: string[];
    constructor(data?: PartialMessage<AllAcceptedCredentialsOptions>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AllAcceptedCredentialsOptions;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AllAcceptedCredentialsOptions;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AllAcceptedCredentialsOptions;
    static equals(a: AllAcceptedCredentialsOptions | PlainMessage<AllAcceptedCredentialsOptions> | undefined, b: AllAcceptedCredentialsOptions | PlainMessage<AllAcceptedCredentialsOptions> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.UpdateCredentialRequest
 */
export declare class UpdateCredentialRequest extends Message<UpdateCredentialRequest> {
    /**
     * @generated from field: string credential_id = 1;
     */
    credentialId: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
    constructor(data?: PartialMessage<UpdateCredentialRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.UpdateCredentialRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateCredentialRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateCredentialRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateCredentialRequest;
    static equals(a: UpdateCredentialRequest | PlainMessage<UpdateCredentialRequest> | undefined, b: UpdateCredentialRequest | PlainMessage<UpdateCredentialRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.UpdateCredentialResponse
 */
export declare class UpdateCredentialResponse extends Message<UpdateCredentialResponse> {
    /**
     * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential credential = 1;
     */
    credential?: WebAuthnCredential;
    constructor(data?: PartialMessage<UpdateCredentialResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.UpdateCredentialResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateCredentialResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateCredentialResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateCredentialResponse;
    static equals(a: UpdateCredentialResponse | PlainMessage<UpdateCredentialResponse> | undefined, b: UpdateCredentialResponse | PlainMessage<UpdateCredentialResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential
 */
export declare class WebAuthnCredential extends Message<WebAuthnCredential> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: bytes credential_id = 3;
     */
    credentialId: Uint8Array;
    /**
     * @generated from field: string attestation_type = 4;
     */
    attestationType: string;
    /**
     * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential.Authenticator authenticator = 5;
     */
    authenticator?: WebAuthnCredential_Authenticator;
    /**
     * @generated from field: repeated string transports = 6;
     */
    transports: string[];
    /**
     * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential.AuthenticatorFlags authenticator_flags = 7;
     */
    authenticatorFlags?: WebAuthnCredential_AuthenticatorFlags;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 8;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 9;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential.UserAgent user_agent = 10;
     */
    userAgent?: WebAuthnCredential_UserAgent;
    /**
     * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential.ClientInfo client_info = 11;
     */
    clientInfo?: WebAuthnCredential_ClientInfo;
    /**
     * @generated from field: optional string display_name = 12;
     */
    displayName?: string;
    constructor(data?: PartialMessage<WebAuthnCredential>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.WebAuthnCredential";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthnCredential;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthnCredential;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthnCredential;
    static equals(a: WebAuthnCredential | PlainMessage<WebAuthnCredential> | undefined, b: WebAuthnCredential | PlainMessage<WebAuthnCredential> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.AuthenticatorFlags
 */
export declare class WebAuthnCredential_AuthenticatorFlags extends Message<WebAuthnCredential_AuthenticatorFlags> {
    /**
     * @generated from field: bool user_present = 1;
     */
    userPresent: boolean;
    /**
     * @generated from field: bool user_verified = 2;
     */
    userVerified: boolean;
    /**
     * @generated from field: bool backup_eligible = 3;
     */
    backupEligible: boolean;
    /**
     * @generated from field: bool backup_state = 4;
     */
    backupState: boolean;
    constructor(data?: PartialMessage<WebAuthnCredential_AuthenticatorFlags>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.WebAuthnCredential.AuthenticatorFlags";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthnCredential_AuthenticatorFlags;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthnCredential_AuthenticatorFlags;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthnCredential_AuthenticatorFlags;
    static equals(a: WebAuthnCredential_AuthenticatorFlags | PlainMessage<WebAuthnCredential_AuthenticatorFlags> | undefined, b: WebAuthnCredential_AuthenticatorFlags | PlainMessage<WebAuthnCredential_AuthenticatorFlags> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.Authenticator
 */
export declare class WebAuthnCredential_Authenticator extends Message<WebAuthnCredential_Authenticator> {
    /**
     * @generated from field: string aaguid = 1;
     */
    aaguid: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string attachment = 3;
     */
    attachment: string;
    /**
     * @generated from field: string icon_dark = 4;
     */
    iconDark: string;
    /**
     * @generated from field: string icon_light = 5;
     */
    iconLight: string;
    constructor(data?: PartialMessage<WebAuthnCredential_Authenticator>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.WebAuthnCredential.Authenticator";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthnCredential_Authenticator;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthnCredential_Authenticator;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthnCredential_Authenticator;
    static equals(a: WebAuthnCredential_Authenticator | PlainMessage<WebAuthnCredential_Authenticator> | undefined, b: WebAuthnCredential_Authenticator | PlainMessage<WebAuthnCredential_Authenticator> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.UserAgent
 */
export declare class WebAuthnCredential_UserAgent extends Message<WebAuthnCredential_UserAgent> {
    /**
     * @generated from field: string raw = 1;
     */
    raw: string;
    /**
     * @generated from field: string url = 2;
     */
    url: string;
    /**
     * @generated from field: string browser = 3;
     */
    browser: string;
    /**
     * @generated from field: string browser_version = 4;
     */
    browserVersion: string;
    /**
     * @generated from field: string os = 5;
     */
    os: string;
    /**
     * @generated from field: string os_version = 6;
     */
    osVersion: string;
    /**
     * @generated from field: string device_type = 7;
     */
    deviceType: string;
    /**
     * @generated from field: string device_model = 8;
     */
    deviceModel: string;
    constructor(data?: PartialMessage<WebAuthnCredential_UserAgent>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.WebAuthnCredential.UserAgent";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthnCredential_UserAgent;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthnCredential_UserAgent;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthnCredential_UserAgent;
    static equals(a: WebAuthnCredential_UserAgent | PlainMessage<WebAuthnCredential_UserAgent> | undefined, b: WebAuthnCredential_UserAgent | PlainMessage<WebAuthnCredential_UserAgent> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.ClientInfo
 */
export declare class WebAuthnCredential_ClientInfo extends Message<WebAuthnCredential_ClientInfo> {
    /**
     * @generated from field: string ip = 1;
     */
    ip: string;
    /**
     * @generated from field: string region = 2;
     */
    region: string;
    /**
     * @generated from field: string region_subdivision = 3;
     */
    regionSubdivision: string;
    /**
     * @generated from field: string city = 4;
     */
    city: string;
    constructor(data?: PartialMessage<WebAuthnCredential_ClientInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.WebAuthnCredential.ClientInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthnCredential_ClientInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthnCredential_ClientInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthnCredential_ClientInfo;
    static equals(a: WebAuthnCredential_ClientInfo | PlainMessage<WebAuthnCredential_ClientInfo> | undefined, b: WebAuthnCredential_ClientInfo | PlainMessage<WebAuthnCredential_ClientInfo> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.GetRelatedOriginsRequest
 */
export declare class GetRelatedOriginsRequest extends Message<GetRelatedOriginsRequest> {
    constructor(data?: PartialMessage<GetRelatedOriginsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.GetRelatedOriginsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetRelatedOriginsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetRelatedOriginsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetRelatedOriginsRequest;
    static equals(a: GetRelatedOriginsRequest | PlainMessage<GetRelatedOriginsRequest> | undefined, b: GetRelatedOriginsRequest | PlainMessage<GetRelatedOriginsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auth.webauthn.GetRelatedOriginsResponse
 */
export declare class GetRelatedOriginsResponse extends Message<GetRelatedOriginsResponse> {
    /**
     * @generated from field: repeated string origins = 1;
     */
    origins: string[];
    constructor(data?: PartialMessage<GetRelatedOriginsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auth.webauthn.GetRelatedOriginsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetRelatedOriginsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetRelatedOriginsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetRelatedOriginsResponse;
    static equals(a: GetRelatedOriginsResponse | PlainMessage<GetRelatedOriginsResponse> | undefined, b: GetRelatedOriginsResponse | PlainMessage<GetRelatedOriginsResponse> | undefined): boolean;
}
