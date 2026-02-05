import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/auth/webauthn.proto.
 */
export declare const file_scalekit_v1_auth_webauthn: GenFile;
/**
 * @generated from message scalekit.v1.auth.webauthn.BeginRegistrationRequest
 */
export type BeginRegistrationRequest = Message<"scalekit.v1.auth.webauthn.BeginRegistrationRequest"> & {};
/**
 * Describes the message scalekit.v1.auth.webauthn.BeginRegistrationRequest.
 * Use `create(BeginRegistrationRequestSchema)` to create a new message.
 */
export declare const BeginRegistrationRequestSchema: GenMessage<BeginRegistrationRequest>;
/**
 * @generated from message scalekit.v1.auth.webauthn.BeginRegistrationResponse
 */
export type BeginRegistrationResponse = Message<"scalekit.v1.auth.webauthn.BeginRegistrationResponse"> & {
    /**
     * @generated from field: google.protobuf.Struct options = 1;
     */
    options?: JsonObject;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.BeginRegistrationResponse.
 * Use `create(BeginRegistrationResponseSchema)` to create a new message.
 */
export declare const BeginRegistrationResponseSchema: GenMessage<BeginRegistrationResponse>;
/**
 * @generated from message scalekit.v1.auth.webauthn.FinishRegistrationRequest
 */
export type FinishRegistrationRequest = Message<"scalekit.v1.auth.webauthn.FinishRegistrationRequest"> & {
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
    clientExtensionResults?: JsonObject;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.FinishRegistrationRequest.
 * Use `create(FinishRegistrationRequestSchema)` to create a new message.
 */
export declare const FinishRegistrationRequestSchema: GenMessage<FinishRegistrationRequest>;
/**
 * @generated from message scalekit.v1.auth.webauthn.FinishRegistrationResponse
 */
export type FinishRegistrationResponse = Message<"scalekit.v1.auth.webauthn.FinishRegistrationResponse"> & {
    /**
     * @generated from field: bool success = 1;
     */
    success: boolean;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.FinishRegistrationResponse.
 * Use `create(FinishRegistrationResponseSchema)` to create a new message.
 */
export declare const FinishRegistrationResponseSchema: GenMessage<FinishRegistrationResponse>;
/**
 * @generated from message scalekit.v1.auth.webauthn.BeginAuthenticationRequest
 */
export type BeginAuthenticationRequest = Message<"scalekit.v1.auth.webauthn.BeginAuthenticationRequest"> & {
    /**
     * @generated from field: optional string email = 1;
     */
    email?: string;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.BeginAuthenticationRequest.
 * Use `create(BeginAuthenticationRequestSchema)` to create a new message.
 */
export declare const BeginAuthenticationRequestSchema: GenMessage<BeginAuthenticationRequest>;
/**
 * @generated from message scalekit.v1.auth.webauthn.BeginAuthenticationResponse
 */
export type BeginAuthenticationResponse = Message<"scalekit.v1.auth.webauthn.BeginAuthenticationResponse"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: google.protobuf.Struct options = 2;
     */
    options?: JsonObject;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.BeginAuthenticationResponse.
 * Use `create(BeginAuthenticationResponseSchema)` to create a new message.
 */
export declare const BeginAuthenticationResponseSchema: GenMessage<BeginAuthenticationResponse>;
/**
 * @generated from message scalekit.v1.auth.webauthn.FinishAuthenticationRequest
 */
export type FinishAuthenticationRequest = Message<"scalekit.v1.auth.webauthn.FinishAuthenticationRequest"> & {
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
    clientExtensionResults?: JsonObject;
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.FinishAuthenticationRequest.
 * Use `create(FinishAuthenticationRequestSchema)` to create a new message.
 */
export declare const FinishAuthenticationRequestSchema: GenMessage<FinishAuthenticationRequest>;
/**
 * @generated from message scalekit.v1.auth.webauthn.AuthenticatorAssertionResponse
 */
export type AuthenticatorAssertionResponse = Message<"scalekit.v1.auth.webauthn.AuthenticatorAssertionResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.AuthenticatorAssertionResponse.
 * Use `create(AuthenticatorAssertionResponseSchema)` to create a new message.
 */
export declare const AuthenticatorAssertionResponseSchema: GenMessage<AuthenticatorAssertionResponse>;
/**
 * @generated from message scalekit.v1.auth.webauthn.FinishAuthenticationResponse
 */
export type FinishAuthenticationResponse = Message<"scalekit.v1.auth.webauthn.FinishAuthenticationResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.FinishAuthenticationResponse.
 * Use `create(FinishAuthenticationResponseSchema)` to create a new message.
 */
export declare const FinishAuthenticationResponseSchema: GenMessage<FinishAuthenticationResponse>;
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnConfiguration
 */
export type WebAuthnConfiguration = Message<"scalekit.v1.auth.webauthn.WebAuthnConfiguration"> & {
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.WebAuthnConfiguration.
 * Use `create(WebAuthnConfigurationSchema)` to create a new message.
 */
export declare const WebAuthnConfigurationSchema: GenMessage<WebAuthnConfiguration>;
/**
 * @generated from message scalekit.v1.auth.webauthn.ListCredentialsRequest
 */
export type ListCredentialsRequest = Message<"scalekit.v1.auth.webauthn.ListCredentialsRequest"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.ListCredentialsRequest.
 * Use `create(ListCredentialsRequestSchema)` to create a new message.
 */
export declare const ListCredentialsRequestSchema: GenMessage<ListCredentialsRequest>;
/**
 * @generated from message scalekit.v1.auth.webauthn.ListCredentialsResponse
 */
export type ListCredentialsResponse = Message<"scalekit.v1.auth.webauthn.ListCredentialsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.auth.webauthn.WebAuthnCredential credentials = 1;
     */
    credentials: WebAuthnCredential[];
    /**
     * @generated from field: scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions all_accepted_credentials_options = 2;
     */
    allAcceptedCredentialsOptions?: AllAcceptedCredentialsOptions;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.ListCredentialsResponse.
 * Use `create(ListCredentialsResponseSchema)` to create a new message.
 */
export declare const ListCredentialsResponseSchema: GenMessage<ListCredentialsResponse>;
/**
 * @generated from message scalekit.v1.auth.webauthn.DeleteCredentialRequest
 */
export type DeleteCredentialRequest = Message<"scalekit.v1.auth.webauthn.DeleteCredentialRequest"> & {
    /**
     * @generated from field: string credential_id = 1;
     */
    credentialId: string;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.DeleteCredentialRequest.
 * Use `create(DeleteCredentialRequestSchema)` to create a new message.
 */
export declare const DeleteCredentialRequestSchema: GenMessage<DeleteCredentialRequest>;
/**
 * @generated from message scalekit.v1.auth.webauthn.DeleteCredentialResponse
 */
export type DeleteCredentialResponse = Message<"scalekit.v1.auth.webauthn.DeleteCredentialResponse"> & {
    /**
     * @generated from field: bool success = 1;
     */
    success: boolean;
    /**
     * @generated from field: scalekit.v1.auth.webauthn.UnknownCredentialOptions unknown_credential_options = 2;
     */
    unknownCredentialOptions?: UnknownCredentialOptions;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.DeleteCredentialResponse.
 * Use `create(DeleteCredentialResponseSchema)` to create a new message.
 */
export declare const DeleteCredentialResponseSchema: GenMessage<DeleteCredentialResponse>;
/**
 * @generated from message scalekit.v1.auth.webauthn.UnknownCredentialOptions
 */
export type UnknownCredentialOptions = Message<"scalekit.v1.auth.webauthn.UnknownCredentialOptions"> & {
    /**
     * @generated from field: string rp_id = 1;
     */
    rpId: string;
    /**
     * @generated from field: string credential_id = 2;
     */
    credentialId: string;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.UnknownCredentialOptions.
 * Use `create(UnknownCredentialOptionsSchema)` to create a new message.
 */
export declare const UnknownCredentialOptionsSchema: GenMessage<UnknownCredentialOptions>;
/**
 * @generated from message scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions
 */
export type AllAcceptedCredentialsOptions = Message<"scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions"> & {
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.AllAcceptedCredentialsOptions.
 * Use `create(AllAcceptedCredentialsOptionsSchema)` to create a new message.
 */
export declare const AllAcceptedCredentialsOptionsSchema: GenMessage<AllAcceptedCredentialsOptions>;
/**
 * @generated from message scalekit.v1.auth.webauthn.UpdateCredentialRequest
 */
export type UpdateCredentialRequest = Message<"scalekit.v1.auth.webauthn.UpdateCredentialRequest"> & {
    /**
     * @generated from field: string credential_id = 1;
     */
    credentialId: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.UpdateCredentialRequest.
 * Use `create(UpdateCredentialRequestSchema)` to create a new message.
 */
export declare const UpdateCredentialRequestSchema: GenMessage<UpdateCredentialRequest>;
/**
 * @generated from message scalekit.v1.auth.webauthn.UpdateCredentialResponse
 */
export type UpdateCredentialResponse = Message<"scalekit.v1.auth.webauthn.UpdateCredentialResponse"> & {
    /**
     * @generated from field: scalekit.v1.auth.webauthn.WebAuthnCredential credential = 1;
     */
    credential?: WebAuthnCredential;
};
/**
 * Describes the message scalekit.v1.auth.webauthn.UpdateCredentialResponse.
 * Use `create(UpdateCredentialResponseSchema)` to create a new message.
 */
export declare const UpdateCredentialResponseSchema: GenMessage<UpdateCredentialResponse>;
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential
 */
export type WebAuthnCredential = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential"> & {
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.WebAuthnCredential.
 * Use `create(WebAuthnCredentialSchema)` to create a new message.
 */
export declare const WebAuthnCredentialSchema: GenMessage<WebAuthnCredential>;
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.AuthenticatorFlags
 */
export type WebAuthnCredential_AuthenticatorFlags = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential.AuthenticatorFlags"> & {
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.WebAuthnCredential.AuthenticatorFlags.
 * Use `create(WebAuthnCredential_AuthenticatorFlagsSchema)` to create a new message.
 */
export declare const WebAuthnCredential_AuthenticatorFlagsSchema: GenMessage<WebAuthnCredential_AuthenticatorFlags>;
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.Authenticator
 */
export type WebAuthnCredential_Authenticator = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential.Authenticator"> & {
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.WebAuthnCredential.Authenticator.
 * Use `create(WebAuthnCredential_AuthenticatorSchema)` to create a new message.
 */
export declare const WebAuthnCredential_AuthenticatorSchema: GenMessage<WebAuthnCredential_Authenticator>;
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.UserAgent
 */
export type WebAuthnCredential_UserAgent = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential.UserAgent"> & {
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.WebAuthnCredential.UserAgent.
 * Use `create(WebAuthnCredential_UserAgentSchema)` to create a new message.
 */
export declare const WebAuthnCredential_UserAgentSchema: GenMessage<WebAuthnCredential_UserAgent>;
/**
 * @generated from message scalekit.v1.auth.webauthn.WebAuthnCredential.ClientInfo
 */
export type WebAuthnCredential_ClientInfo = Message<"scalekit.v1.auth.webauthn.WebAuthnCredential.ClientInfo"> & {
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
};
/**
 * Describes the message scalekit.v1.auth.webauthn.WebAuthnCredential.ClientInfo.
 * Use `create(WebAuthnCredential_ClientInfoSchema)` to create a new message.
 */
export declare const WebAuthnCredential_ClientInfoSchema: GenMessage<WebAuthnCredential_ClientInfo>;
/**
 * @generated from message scalekit.v1.auth.webauthn.GetRelatedOriginsRequest
 */
export type GetRelatedOriginsRequest = Message<"scalekit.v1.auth.webauthn.GetRelatedOriginsRequest"> & {};
/**
 * Describes the message scalekit.v1.auth.webauthn.GetRelatedOriginsRequest.
 * Use `create(GetRelatedOriginsRequestSchema)` to create a new message.
 */
export declare const GetRelatedOriginsRequestSchema: GenMessage<GetRelatedOriginsRequest>;
/**
 * @generated from message scalekit.v1.auth.webauthn.GetRelatedOriginsResponse
 */
export type GetRelatedOriginsResponse = Message<"scalekit.v1.auth.webauthn.GetRelatedOriginsResponse"> & {
    /**
     * @generated from field: repeated string origins = 1;
     */
    origins: string[];
};
/**
 * Describes the message scalekit.v1.auth.webauthn.GetRelatedOriginsResponse.
 * Use `create(GetRelatedOriginsResponseSchema)` to create a new message.
 */
export declare const GetRelatedOriginsResponseSchema: GenMessage<GetRelatedOriginsResponse>;
/**
 * @generated from service scalekit.v1.auth.webauthn.WebAuthnService
 */
export declare const WebAuthnService: GenService<{
    /**
     * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.BeginRegistration
     */
    beginRegistration: {
        methodKind: "unary";
        input: typeof BeginRegistrationRequestSchema;
        output: typeof BeginRegistrationResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.FinishRegistration
     */
    finishRegistration: {
        methodKind: "unary";
        input: typeof FinishRegistrationRequestSchema;
        output: typeof FinishRegistrationResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.BeginAuthentication
     */
    beginAuthentication: {
        methodKind: "unary";
        input: typeof BeginAuthenticationRequestSchema;
        output: typeof BeginAuthenticationResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.FinishAuthentication
     */
    finishAuthentication: {
        methodKind: "unary";
        input: typeof FinishAuthenticationRequestSchema;
        output: typeof FinishAuthenticationResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.ListCredentials
     */
    listCredentials: {
        methodKind: "unary";
        input: typeof ListCredentialsRequestSchema;
        output: typeof ListCredentialsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.DeleteCredential
     */
    deleteCredential: {
        methodKind: "unary";
        input: typeof DeleteCredentialRequestSchema;
        output: typeof DeleteCredentialResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.UpdateCredential
     */
    updateCredential: {
        methodKind: "unary";
        input: typeof UpdateCredentialRequestSchema;
        output: typeof UpdateCredentialResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.auth.webauthn.WebAuthnService.GetRelatedOrigins
     */
    getRelatedOrigins: {
        methodKind: "unary";
        input: typeof GetRelatedOriginsRequestSchema;
        output: typeof GetRelatedOriginsResponseSchema;
    };
}>;
