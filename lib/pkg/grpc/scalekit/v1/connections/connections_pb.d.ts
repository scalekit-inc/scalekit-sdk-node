import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Duration, Message, proto3, Struct, Timestamp } from "@bufbuild/protobuf";
import { Domain } from "../domains/domains_pb.js";
/**
 * @generated from enum scalekit.v1.connections.CodeChallengeType
 */
export declare enum CodeChallengeType {
    /**
     * @generated from enum value: CODE_CHALLENGE_TYPE_UNSPECIFIED = 0;
     */
    CODE_CHALLENGE_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: NUMERIC = 1;
     */
    NUMERIC = 1,
    /**
     * @generated from enum value: ALPHANUMERIC = 2;
     */
    ALPHANUMERIC = 2
}
/**
 * @generated from enum scalekit.v1.connections.ConfigurationType
 */
export declare enum ConfigurationType {
    /**
     * @generated from enum value: CONFIGURATION_TYPE_UNSPECIFIED = 0;
     */
    CONFIGURATION_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: DISCOVERY = 1;
     */
    DISCOVERY = 1,
    /**
     * @generated from enum value: MANUAL = 2;
     */
    MANUAL = 2
}
/**
 * @generated from enum scalekit.v1.connections.NameIdFormat
 */
export declare enum NameIdFormat {
    /**
     * @generated from enum value: NAME_ID_FORMAT_NIL = 0;
     */
    NAME_ID_FORMAT_NIL = 0,
    /**
     * @generated from enum value: UNSPECIFIED = 1;
     */
    UNSPECIFIED = 1,
    /**
     * @generated from enum value: EMAIL = 2;
     */
    EMAIL = 2,
    /**
     * @generated from enum value: TRANSIENT = 3;
     */
    TRANSIENT = 3,
    /**
     * @generated from enum value: PERSISTENT = 4;
     */
    PERSISTENT = 4
}
/**
 * @generated from enum scalekit.v1.connections.PasswordlessType
 */
export declare enum PasswordlessType {
    /**
     * @generated from enum value: PasswordlessType_UNSPECIFIED = 0;
     */
    PasswordlessType_UNSPECIFIED = 0,
    /**
     * @generated from enum value: LINK = 1;
     */
    LINK = 1,
    /**
     * @generated from enum value: OTP = 2;
     */
    OTP = 2,
    /**
     * @generated from enum value: LINK_OTP = 3;
     */
    LINK_OTP = 3
}
/**
 * @generated from enum scalekit.v1.connections.TestResultStatus
 */
export declare enum TestResultStatus {
    /**
     * @generated from enum value: PENDING = 0;
     */
    PENDING = 0,
    /**
     * @generated from enum value: SUCCESS = 1;
     */
    SUCCESS = 1,
    /**
     * @generated from enum value: FAILURE = 2;
     */
    FAILURE = 2
}
/**
 * enums all
 *
 * @generated from enum scalekit.v1.connections.SAMLSigningOptions
 */
export declare enum SAMLSigningOptions {
    /**
     * @generated from enum value: SAML_SIGNING_OPTIONS_UNSPECIFIED = 0;
     */
    SAML_SIGNING_OPTIONS_UNSPECIFIED = 0,
    /**
     * @generated from enum value: NO_SIGNING = 1;
     */
    NO_SIGNING = 1,
    /**
     * @generated from enum value: SAML_ONLY_RESPONSE_SIGNING = 2;
     */
    SAML_ONLY_RESPONSE_SIGNING = 2,
    /**
     * @generated from enum value: SAML_ONLY_ASSERTION_SIGNING = 3;
     */
    SAML_ONLY_ASSERTION_SIGNING = 3,
    /**
     * @generated from enum value: SAML_RESPONSE_ASSERTION_SIGNING = 4;
     */
    SAML_RESPONSE_ASSERTION_SIGNING = 4,
    /**
     * @generated from enum value: SAML_RESPONSE_OR_ASSERTION_SIGNING = 5;
     */
    SAML_RESPONSE_OR_ASSERTION_SIGNING = 5
}
/**
 * @generated from enum scalekit.v1.connections.RequestBinding
 */
export declare enum RequestBinding {
    /**
     * @generated from enum value: REQUEST_BINDING_UNSPECIFIED = 0;
     */
    REQUEST_BINDING_UNSPECIFIED = 0,
    /**
     * @generated from enum value: HTTP_POST = 1;
     */
    HTTP_POST = 1,
    /**
     * @generated from enum value: HTTP_REDIRECT = 2;
     */
    HTTP_REDIRECT = 2
}
/**
 * @generated from enum scalekit.v1.connections.TokenAuthType
 */
export declare enum TokenAuthType {
    /**
     * @generated from enum value: TOKEN_AUTH_TYPE_UNSPECIFIED = 0;
     */
    TOKEN_AUTH_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: URL_PARAMS = 1;
     */
    URL_PARAMS = 1,
    /**
     * @generated from enum value: BASIC_AUTH = 2;
     */
    BASIC_AUTH = 2
}
/**
 * @generated from enum scalekit.v1.connections.OIDCScope
 */
export declare enum OIDCScope {
    /**
     * @generated from enum value: OIDC_SCOPE_UNSPECIFIED = 0;
     */
    OIDC_SCOPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: openid = 1;
     */
    openid = 1,
    /**
     * @generated from enum value: profile = 2;
     */
    profile = 2,
    /**
     * @generated from enum value: email = 3;
     */
    email = 3,
    /**
     * @generated from enum value: address = 4;
     */
    address = 4,
    /**
     * @generated from enum value: phone = 5;
     */
    phone = 5
}
/**
 * @generated from enum scalekit.v1.connections.ConnectionType
 */
export declare enum ConnectionType {
    /**
     * @generated from enum value: INVALID = 0;
     */
    INVALID = 0,
    /**
     * @generated from enum value: OIDC = 1;
     */
    OIDC = 1,
    /**
     * @generated from enum value: SAML = 2;
     */
    SAML = 2,
    /**
     * @generated from enum value: PASSWORD = 3;
     */
    PASSWORD = 3,
    /**
     * @generated from enum value: OAUTH = 4;
     */
    OAUTH = 4,
    /**
     * @generated from enum value: PASSWORDLESS = 5;
     */
    PASSWORDLESS = 5,
    /**
     * @generated from enum value: BASIC = 6;
     */
    BASIC = 6,
    /**
     * @generated from enum value: BEARER = 7;
     */
    BEARER = 7,
    /**
     * @generated from enum value: API_KEY = 8;
     */
    API_KEY = 8,
    /**
     * @generated from enum value: WEBAUTHN = 9;
     */
    WEBAUTHN = 9
}
/**
 * @generated from enum scalekit.v1.connections.ConnectionStatus
 */
export declare enum ConnectionStatus {
    /**
     * @generated from enum value: CONNECTION_STATUS_UNSPECIFIED = 0;
     */
    CONNECTION_STATUS_UNSPECIFIED = 0,
    /**
     * @generated from enum value: DRAFT = 1;
     */
    DRAFT = 1,
    /**
     * @generated from enum value: IN_PROGRESS = 2;
     */
    IN_PROGRESS = 2,
    /**
     * @generated from enum value: COMPLETED = 3;
     */
    COMPLETED = 3
}
/**
 * @generated from enum scalekit.v1.connections.ConnectionProvider
 */
export declare enum ConnectionProvider {
    /**
     * @generated from enum value: CONNECTION_PROVIDER_UNSPECIFIED = 0;
     */
    CONNECTION_PROVIDER_UNSPECIFIED = 0,
    /**
     * @generated from enum value: OKTA = 1;
     */
    OKTA = 1,
    /**
     * @generated from enum value: GOOGLE = 2;
     */
    GOOGLE = 2,
    /**
     * @generated from enum value: MICROSOFT_AD = 3;
     */
    MICROSOFT_AD = 3,
    /**
     * @generated from enum value: AUTH0 = 4;
     */
    AUTH0 = 4,
    /**
     * @generated from enum value: ONELOGIN = 5;
     */
    ONELOGIN = 5,
    /**
     * @generated from enum value: PING_IDENTITY = 6;
     */
    PING_IDENTITY = 6,
    /**
     * @generated from enum value: JUMPCLOUD = 7;
     */
    JUMPCLOUD = 7,
    /**
     * @generated from enum value: CUSTOM = 8;
     */
    CUSTOM = 8,
    /**
     * @generated from enum value: GITHUB = 9;
     */
    GITHUB = 9,
    /**
     * @generated from enum value: GITLAB = 10;
     */
    GITLAB = 10,
    /**
     * @generated from enum value: LINKEDIN = 11;
     */
    LINKEDIN = 11,
    /**
     * @generated from enum value: SALESFORCE = 12;
     */
    SALESFORCE = 12,
    /**
     * @generated from enum value: MICROSOFT = 13;
     */
    MICROSOFT = 13,
    /**
     * @generated from enum value: IDP_SIMULATOR = 14;
     */
    IDP_SIMULATOR = 14,
    /**
     * @generated from enum value: SCALEKIT = 15;
     */
    SCALEKIT = 15,
    /**
     * @generated from enum value: ADFS = 16;
     */
    ADFS = 16
}
/**
 * @generated from message scalekit.v1.connections.AssignDomainsToConnectionRequest
 */
export declare class AssignDomainsToConnectionRequest extends Message<AssignDomainsToConnectionRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string connection_id = 2;
     */
    connectionId: string;
    /**
     * @generated from field: repeated string domain_ids = 3;
     */
    domainIds: string[];
    constructor(data?: PartialMessage<AssignDomainsToConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.AssignDomainsToConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssignDomainsToConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssignDomainsToConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssignDomainsToConnectionRequest;
    static equals(a: AssignDomainsToConnectionRequest | PlainMessage<AssignDomainsToConnectionRequest> | undefined, b: AssignDomainsToConnectionRequest | PlainMessage<AssignDomainsToConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.AssignDomainsToConnectionResponse
 */
export declare class AssignDomainsToConnectionResponse extends Message<AssignDomainsToConnectionResponse> {
    /**
     * @generated from field: scalekit.v1.connections.Connection connection = 1;
     */
    connection?: Connection;
    constructor(data?: PartialMessage<AssignDomainsToConnectionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.AssignDomainsToConnectionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssignDomainsToConnectionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssignDomainsToConnectionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssignDomainsToConnectionResponse;
    static equals(a: AssignDomainsToConnectionResponse | PlainMessage<AssignDomainsToConnectionResponse> | undefined, b: AssignDomainsToConnectionResponse | PlainMessage<AssignDomainsToConnectionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetProvidersRequest
 */
export declare class GetProvidersRequest extends Message<GetProvidersRequest> {
    constructor(data?: PartialMessage<GetProvidersRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetProvidersRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetProvidersRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetProvidersRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetProvidersRequest;
    static equals(a: GetProvidersRequest | PlainMessage<GetProvidersRequest> | undefined, b: GetProvidersRequest | PlainMessage<GetProvidersRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetProvidersResponse
 */
export declare class GetProvidersResponse extends Message<GetProvidersResponse> {
    /**
     * @generated from field: repeated scalekit.v1.connections.Provider providers = 1;
     */
    providers: Provider[];
    constructor(data?: PartialMessage<GetProvidersResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetProvidersResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetProvidersResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetProvidersResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetProvidersResponse;
    static equals(a: GetProvidersResponse | PlainMessage<GetProvidersResponse> | undefined, b: GetProvidersResponse | PlainMessage<GetProvidersResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.Provider
 */
export declare class Provider extends Message<Provider> {
    /**
     * @generated from field: string key_id = 1;
     */
    keyId: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
    /**
     * @generated from field: optional string description = 3;
     */
    description?: string;
    constructor(data?: PartialMessage<Provider>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.Provider";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Provider;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Provider;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Provider;
    static equals(a: Provider | PlainMessage<Provider> | undefined, b: Provider | PlainMessage<Provider> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.CreateEnvironmentConnectionRequest
 */
export declare class CreateEnvironmentConnectionRequest extends Message<CreateEnvironmentConnectionRequest> {
    /**
     * @generated from field: scalekit.v1.connections.CreateConnection connection = 1;
     */
    connection?: CreateConnection;
    /**
     * @generated from field: optional scalekit.v1.connections.Flags flags = 2;
     */
    flags?: Flags;
    constructor(data?: PartialMessage<CreateEnvironmentConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.CreateEnvironmentConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateEnvironmentConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateEnvironmentConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateEnvironmentConnectionRequest;
    static equals(a: CreateEnvironmentConnectionRequest | PlainMessage<CreateEnvironmentConnectionRequest> | undefined, b: CreateEnvironmentConnectionRequest | PlainMessage<CreateEnvironmentConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.CreateConnectionRequest
 */
export declare class CreateConnectionRequest extends Message<CreateConnectionRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.connections.CreateConnection connection = 3;
     */
    connection?: CreateConnection;
    constructor(data?: PartialMessage<CreateConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.CreateConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateConnectionRequest;
    static equals(a: CreateConnectionRequest | PlainMessage<CreateConnectionRequest> | undefined, b: CreateConnectionRequest | PlainMessage<CreateConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.CreateConnection
 */
export declare class CreateConnection extends Message<CreateConnection> {
    /**
     * @generated from field: scalekit.v1.connections.ConnectionProvider provider = 1;
     */
    provider: ConnectionProvider;
    /**
     * @generated from field: scalekit.v1.connections.ConnectionType type = 2;
     */
    type: ConnectionType;
    /**
     * @generated from field: string provider_key = 3;
     */
    providerKey: string;
    /**
     * @generated from field: optional string key_id = 4;
     */
    keyId?: string;
    constructor(data?: PartialMessage<CreateConnection>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.CreateConnection";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateConnection;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateConnection;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateConnection;
    static equals(a: CreateConnection | PlainMessage<CreateConnection> | undefined, b: CreateConnection | PlainMessage<CreateConnection> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.Connection
 */
export declare class Connection extends Message<Connection> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.connections.ConnectionProvider provider = 2;
     */
    provider: ConnectionProvider;
    /**
     * @generated from field: scalekit.v1.connections.ConnectionType type = 3;
     */
    type: ConnectionType;
    /**
     * @generated from field: scalekit.v1.connections.ConnectionStatus status = 4;
     */
    status: ConnectionStatus;
    /**
     * @generated from field: bool enabled = 5;
     */
    enabled: boolean;
    /**
     * @generated from field: bool debug_enabled = 6;
     */
    debugEnabled: boolean;
    /**
     * @generated from field: optional string organization_id = 7;
     */
    organizationId?: string;
    /**
     * @generated from field: string ui_button_title = 8;
     */
    uiButtonTitle: string;
    /**
     * @generated from field: scalekit.v1.connections.ConfigurationType configuration_type = 9;
     */
    configurationType: ConfigurationType;
    /**
     * @generated from field: string test_connection_uri = 12;
     */
    testConnectionUri: string;
    /**
     * @generated from field: map<string, string> attribute_mapping = 15;
     */
    attributeMapping: {
        [key: string]: string;
    };
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 16;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 17;
     */
    updateTime?: Timestamp;
    /**
     * @generated from oneof scalekit.v1.connections.Connection.settings
     */
    settings: {
        /**
         * @generated from field: scalekit.v1.connections.OIDCConnectionConfig oidc_config = 18;
         */
        value: OIDCConnectionConfig;
        case: "oidcConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.SAMLConnectionConfigResponse saml_config = 19;
         */
        value: SAMLConnectionConfigResponse;
        case: "samlConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.OAuthConnectionConfig oauth_config = 20;
         */
        value: OAuthConnectionConfig;
        case: "oauthConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.PasswordLessConfig passwordless_config = 22;
         */
        value: PasswordLessConfig;
        case: "passwordlessConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.StaticAuthConfig static_config = 26;
         */
        value: StaticAuthConfig;
        case: "staticConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.WebAuthConfiguration webauthn_config = 27;
         */
        value: WebAuthConfiguration;
        case: "webauthnConfig";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: optional string key_id = 25;
     */
    keyId?: string;
    /**
     * @generated from field: string provider_key = 23;
     */
    providerKey: string;
    /**
     * @generated from field: repeated scalekit.v1.domains.Domain domains = 24;
     */
    domains: Domain[];
    constructor(data?: PartialMessage<Connection>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.Connection";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Connection;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Connection;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Connection;
    static equals(a: Connection | PlainMessage<Connection> | undefined, b: Connection | PlainMessage<Connection> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.CreateConnectionResponse
 */
export declare class CreateConnectionResponse extends Message<CreateConnectionResponse> {
    /**
     * @generated from field: scalekit.v1.connections.Connection connection = 1;
     */
    connection?: Connection;
    constructor(data?: PartialMessage<CreateConnectionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.CreateConnectionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateConnectionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateConnectionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateConnectionResponse;
    static equals(a: CreateConnectionResponse | PlainMessage<CreateConnectionResponse> | undefined, b: CreateConnectionResponse | PlainMessage<CreateConnectionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.UpdateEnvironmentConnectionRequest
 */
export declare class UpdateEnvironmentConnectionRequest extends Message<UpdateEnvironmentConnectionRequest> {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: scalekit.v1.connections.UpdateConnection connection = 3;
     */
    connection?: UpdateConnection;
    constructor(data?: PartialMessage<UpdateEnvironmentConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.UpdateEnvironmentConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateEnvironmentConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateEnvironmentConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateEnvironmentConnectionRequest;
    static equals(a: UpdateEnvironmentConnectionRequest | PlainMessage<UpdateEnvironmentConnectionRequest> | undefined, b: UpdateEnvironmentConnectionRequest | PlainMessage<UpdateEnvironmentConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.UpdateConnectionRequest
 */
export declare class UpdateConnectionRequest extends Message<UpdateConnectionRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.connections.UpdateConnection connection = 4;
     */
    connection?: UpdateConnection;
    constructor(data?: PartialMessage<UpdateConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.UpdateConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateConnectionRequest;
    static equals(a: UpdateConnectionRequest | PlainMessage<UpdateConnectionRequest> | undefined, b: UpdateConnectionRequest | PlainMessage<UpdateConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.UpdateConnection
 */
export declare class UpdateConnection extends Message<UpdateConnection> {
    /**
     * @generated from field: scalekit.v1.connections.ConnectionProvider provider = 2;
     */
    provider: ConnectionProvider;
    /**
     * @generated from field: scalekit.v1.connections.ConnectionType type = 3;
     */
    type: ConnectionType;
    /**
     * @generated from field: google.protobuf.BoolValue debug_enabled = 6;
     */
    debugEnabled?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue ui_button_title = 8;
     */
    uiButtonTitle?: string;
    /**
     * @generated from field: scalekit.v1.connections.ConfigurationType configuration_type = 11;
     */
    configurationType: ConfigurationType;
    /**
     * @generated from field: map<string, string> attribute_mapping = 15;
     */
    attributeMapping: {
        [key: string]: string;
    };
    /**
     * @generated from oneof scalekit.v1.connections.UpdateConnection.settings
     */
    settings: {
        /**
         * @generated from field: scalekit.v1.connections.OIDCConnectionConfig oidc_config = 16;
         */
        value: OIDCConnectionConfig;
        case: "oidcConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.SAMLConnectionConfigRequest saml_config = 17;
         */
        value: SAMLConnectionConfigRequest;
        case: "samlConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.OAuthConnectionConfig oauth_config = 18;
         */
        value: OAuthConnectionConfig;
        case: "oauthConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.PasswordLessConfig passwordless_config = 20;
         */
        value: PasswordLessConfig;
        case: "passwordlessConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.StaticAuthConfig static_config = 23;
         */
        value: StaticAuthConfig;
        case: "staticConfig";
    } | {
        /**
         * @generated from field: scalekit.v1.connections.WebAuthConfiguration webauthn_config = 24;
         */
        value: WebAuthConfiguration;
        case: "webauthnConfig";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: optional string key_id = 22;
     */
    keyId?: string;
    /**
     * @generated from field: string provider_key = 21;
     */
    providerKey: string;
    constructor(data?: PartialMessage<UpdateConnection>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.UpdateConnection";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateConnection;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateConnection;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateConnection;
    static equals(a: UpdateConnection | PlainMessage<UpdateConnection> | undefined, b: UpdateConnection | PlainMessage<UpdateConnection> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.UpdateConnectionResponse
 */
export declare class UpdateConnectionResponse extends Message<UpdateConnectionResponse> {
    /**
     * @generated from field: scalekit.v1.connections.Connection connection = 1;
     */
    connection?: Connection;
    constructor(data?: PartialMessage<UpdateConnectionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.UpdateConnectionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateConnectionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateConnectionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateConnectionResponse;
    static equals(a: UpdateConnectionResponse | PlainMessage<UpdateConnectionResponse> | undefined, b: UpdateConnectionResponse | PlainMessage<UpdateConnectionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.DeleteEnvironmentConnectionRequest
 */
export declare class DeleteEnvironmentConnectionRequest extends Message<DeleteEnvironmentConnectionRequest> {
    /**
     * @generated from field: string connection_id = 3;
     */
    connectionId: string;
    constructor(data?: PartialMessage<DeleteEnvironmentConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.DeleteEnvironmentConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteEnvironmentConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteEnvironmentConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteEnvironmentConnectionRequest;
    static equals(a: DeleteEnvironmentConnectionRequest | PlainMessage<DeleteEnvironmentConnectionRequest> | undefined, b: DeleteEnvironmentConnectionRequest | PlainMessage<DeleteEnvironmentConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.DeleteConnectionRequest
 */
export declare class DeleteConnectionRequest extends Message<DeleteConnectionRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
    constructor(data?: PartialMessage<DeleteConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.DeleteConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteConnectionRequest;
    static equals(a: DeleteConnectionRequest | PlainMessage<DeleteConnectionRequest> | undefined, b: DeleteConnectionRequest | PlainMessage<DeleteConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetEnvironmentConnectionRequest
 */
export declare class GetEnvironmentConnectionRequest extends Message<GetEnvironmentConnectionRequest> {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    constructor(data?: PartialMessage<GetEnvironmentConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetEnvironmentConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetEnvironmentConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetEnvironmentConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetEnvironmentConnectionRequest;
    static equals(a: GetEnvironmentConnectionRequest | PlainMessage<GetEnvironmentConnectionRequest> | undefined, b: GetEnvironmentConnectionRequest | PlainMessage<GetEnvironmentConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetConnectionRequest
 */
export declare class GetConnectionRequest extends Message<GetConnectionRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
    constructor(data?: PartialMessage<GetConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetConnectionRequest;
    static equals(a: GetConnectionRequest | PlainMessage<GetConnectionRequest> | undefined, b: GetConnectionRequest | PlainMessage<GetConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetConnectionResponse
 */
export declare class GetConnectionResponse extends Message<GetConnectionResponse> {
    /**
     * @generated from field: scalekit.v1.connections.Connection connection = 1;
     */
    connection?: Connection;
    constructor(data?: PartialMessage<GetConnectionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetConnectionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetConnectionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetConnectionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetConnectionResponse;
    static equals(a: GetConnectionResponse | PlainMessage<GetConnectionResponse> | undefined, b: GetConnectionResponse | PlainMessage<GetConnectionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ListConnectionsRequest
 */
export declare class ListConnectionsRequest extends Message<ListConnectionsRequest> {
    /**
     * @generated from field: optional string organization_id = 1;
     */
    organizationId?: string;
    /**
     * @generated from field: optional string domain = 3;
     */
    domain?: string;
    /**
     * @generated from field: optional string include = 4;
     */
    include?: string;
    constructor(data?: PartialMessage<ListConnectionsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ListConnectionsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListConnectionsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListConnectionsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListConnectionsRequest;
    static equals(a: ListConnectionsRequest | PlainMessage<ListConnectionsRequest> | undefined, b: ListConnectionsRequest | PlainMessage<ListConnectionsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ListConnectionsResponse
 */
export declare class ListConnectionsResponse extends Message<ListConnectionsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.connections.ListConnection connections = 1;
     */
    connections: ListConnection[];
    constructor(data?: PartialMessage<ListConnectionsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ListConnectionsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListConnectionsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListConnectionsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListConnectionsResponse;
    static equals(a: ListConnectionsResponse | PlainMessage<ListConnectionsResponse> | undefined, b: ListConnectionsResponse | PlainMessage<ListConnectionsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ListConnection
 */
export declare class ListConnection extends Message<ListConnection> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.connections.ConnectionProvider provider = 2;
     */
    provider: ConnectionProvider;
    /**
     * @generated from field: scalekit.v1.connections.ConnectionType type = 3;
     */
    type: ConnectionType;
    /**
     * @generated from field: scalekit.v1.connections.ConnectionStatus status = 4;
     */
    status: ConnectionStatus;
    /**
     * @generated from field: bool enabled = 5;
     */
    enabled: boolean;
    /**
     * @generated from field: string organization_id = 6;
     */
    organizationId: string;
    /**
     * @generated from field: string ui_button_title = 7;
     */
    uiButtonTitle: string;
    /**
     * @generated from field: repeated string domains = 8;
     */
    domains: string[];
    /**
     * @generated from field: string organization_name = 9;
     */
    organizationName: string;
    /**
     * @generated from field: string provider_key = 10;
     */
    providerKey: string;
    /**
     * @generated from field: string key_id = 11;
     */
    keyId: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 12;
     */
    createdAt?: Timestamp;
    constructor(data?: PartialMessage<ListConnection>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ListConnection";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListConnection;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListConnection;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListConnection;
    static equals(a: ListConnection | PlainMessage<ListConnection> | undefined, b: ListConnection | PlainMessage<ListConnection> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ListOrganizationConnectionsRequest
 */
export declare class ListOrganizationConnectionsRequest extends Message<ListOrganizationConnectionsRequest> {
    /**
     * @generated from field: uint32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
    constructor(data?: PartialMessage<ListOrganizationConnectionsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ListOrganizationConnectionsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListOrganizationConnectionsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListOrganizationConnectionsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListOrganizationConnectionsRequest;
    static equals(a: ListOrganizationConnectionsRequest | PlainMessage<ListOrganizationConnectionsRequest> | undefined, b: ListOrganizationConnectionsRequest | PlainMessage<ListOrganizationConnectionsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ListOrganizationConnectionsResponse
 */
export declare class ListOrganizationConnectionsResponse extends Message<ListOrganizationConnectionsResponse> {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
    /**
     * @generated from field: repeated scalekit.v1.connections.ListConnection connections = 4;
     */
    connections: ListConnection[];
    constructor(data?: PartialMessage<ListOrganizationConnectionsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ListOrganizationConnectionsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListOrganizationConnectionsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListOrganizationConnectionsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListOrganizationConnectionsResponse;
    static equals(a: ListOrganizationConnectionsResponse | PlainMessage<ListOrganizationConnectionsResponse> | undefined, b: ListOrganizationConnectionsResponse | PlainMessage<ListOrganizationConnectionsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.SearchOrganizationConnectionsRequest
 */
export declare class SearchOrganizationConnectionsRequest extends Message<SearchOrganizationConnectionsRequest> {
    /**
     * @generated from field: optional string query = 1;
     */
    query?: string;
    /**
     * @generated from field: optional string provider = 2;
     */
    provider?: string;
    /**
     * @generated from field: optional scalekit.v1.connections.ConnectionStatus status = 3;
     */
    status?: ConnectionStatus;
    /**
     * @generated from field: optional scalekit.v1.connections.ConnectionType connection_type = 4;
     */
    connectionType?: ConnectionType;
    /**
     * @generated from field: optional bool enabled = 7;
     */
    enabled?: boolean;
    /**
     * @generated from field: uint32 page_size = 5;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 6;
     */
    pageToken: string;
    constructor(data?: PartialMessage<SearchOrganizationConnectionsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.SearchOrganizationConnectionsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchOrganizationConnectionsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchOrganizationConnectionsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchOrganizationConnectionsRequest;
    static equals(a: SearchOrganizationConnectionsRequest | PlainMessage<SearchOrganizationConnectionsRequest> | undefined, b: SearchOrganizationConnectionsRequest | PlainMessage<SearchOrganizationConnectionsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.SearchOrganizationConnectionsResponse
 */
export declare class SearchOrganizationConnectionsResponse extends Message<SearchOrganizationConnectionsResponse> {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
    /**
     * @generated from field: repeated scalekit.v1.connections.ListConnection connections = 4;
     */
    connections: ListConnection[];
    constructor(data?: PartialMessage<SearchOrganizationConnectionsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.SearchOrganizationConnectionsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchOrganizationConnectionsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchOrganizationConnectionsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchOrganizationConnectionsResponse;
    static equals(a: SearchOrganizationConnectionsResponse | PlainMessage<SearchOrganizationConnectionsResponse> | undefined, b: SearchOrganizationConnectionsResponse | PlainMessage<SearchOrganizationConnectionsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ToggleEnvironmentConnectionRequest
 */
export declare class ToggleEnvironmentConnectionRequest extends Message<ToggleEnvironmentConnectionRequest> {
    /**
     * @generated from field: string connection_id = 2;
     */
    connectionId: string;
    constructor(data?: PartialMessage<ToggleEnvironmentConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ToggleEnvironmentConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ToggleEnvironmentConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ToggleEnvironmentConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ToggleEnvironmentConnectionRequest;
    static equals(a: ToggleEnvironmentConnectionRequest | PlainMessage<ToggleEnvironmentConnectionRequest> | undefined, b: ToggleEnvironmentConnectionRequest | PlainMessage<ToggleEnvironmentConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ToggleConnectionRequest
 */
export declare class ToggleConnectionRequest extends Message<ToggleConnectionRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
    constructor(data?: PartialMessage<ToggleConnectionRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ToggleConnectionRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ToggleConnectionRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ToggleConnectionRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ToggleConnectionRequest;
    static equals(a: ToggleConnectionRequest | PlainMessage<ToggleConnectionRequest> | undefined, b: ToggleConnectionRequest | PlainMessage<ToggleConnectionRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ToggleConnectionResponse
 */
export declare class ToggleConnectionResponse extends Message<ToggleConnectionResponse> {
    /**
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * @generated from field: optional string error_message = 2;
     */
    errorMessage?: string;
    constructor(data?: PartialMessage<ToggleConnectionResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ToggleConnectionResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ToggleConnectionResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ToggleConnectionResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ToggleConnectionResponse;
    static equals(a: ToggleConnectionResponse | PlainMessage<ToggleConnectionResponse> | undefined, b: ToggleConnectionResponse | PlainMessage<ToggleConnectionResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.OIDCConnectionConfig
 */
export declare class OIDCConnectionConfig extends Message<OIDCConnectionConfig> {
    /**
     * @generated from field: google.protobuf.StringValue issuer = 1;
     */
    issuer?: string;
    /**
     * @generated from field: google.protobuf.StringValue discovery_endpoint = 2;
     */
    discoveryEndpoint?: string;
    /**
     * @generated from field: google.protobuf.StringValue authorize_uri = 3;
     */
    authorizeUri?: string;
    /**
     * @generated from field: google.protobuf.StringValue token_uri = 4;
     */
    tokenUri?: string;
    /**
     * @generated from field: google.protobuf.StringValue user_info_uri = 5;
     */
    userInfoUri?: string;
    /**
     * @generated from field: google.protobuf.StringValue jwks_uri = 6;
     */
    jwksUri?: string;
    /**
     * @generated from field: google.protobuf.StringValue client_id = 8;
     */
    clientId?: string;
    /**
     * @generated from field: google.protobuf.StringValue client_secret = 9;
     */
    clientSecret?: string;
    /**
     * @generated from field: repeated scalekit.v1.connections.OIDCScope scopes = 10;
     */
    scopes: OIDCScope[];
    /**
     * @generated from field: scalekit.v1.connections.TokenAuthType token_auth_type = 11;
     */
    tokenAuthType: TokenAuthType;
    /**
     * @generated from field: string redirect_uri = 12;
     */
    redirectUri: string;
    /**
     * @generated from field: google.protobuf.BoolValue pkce_enabled = 13;
     */
    pkceEnabled?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue idp_logout_required = 14;
     */
    idpLogoutRequired?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue post_logout_redirect_uri = 15;
     */
    postLogoutRedirectUri?: string;
    /**
     * @generated from field: google.protobuf.StringValue backchannel_logout_redirect_uri = 16;
     */
    backchannelLogoutRedirectUri?: string;
    /**
     * @generated from field: google.protobuf.BoolValue sync_user_profile_on_login = 17;
     */
    syncUserProfileOnLogin?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue jit_provisioning_with_sso_enabled = 18;
     */
    jitProvisioningWithSsoEnabled?: boolean;
    constructor(data?: PartialMessage<OIDCConnectionConfig>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.OIDCConnectionConfig";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OIDCConnectionConfig;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OIDCConnectionConfig;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OIDCConnectionConfig;
    static equals(a: OIDCConnectionConfig | PlainMessage<OIDCConnectionConfig> | undefined, b: OIDCConnectionConfig | PlainMessage<OIDCConnectionConfig> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.OAuthConnectionConfig
 */
export declare class OAuthConnectionConfig extends Message<OAuthConnectionConfig> {
    /**
     * @generated from field: google.protobuf.StringValue authorize_uri = 3;
     */
    authorizeUri?: string;
    /**
     * @generated from field: google.protobuf.StringValue token_uri = 4;
     */
    tokenUri?: string;
    /**
     * @generated from field: google.protobuf.StringValue user_info_uri = 5;
     */
    userInfoUri?: string;
    /**
     * @generated from field: google.protobuf.StringValue client_id = 8;
     */
    clientId?: string;
    /**
     * @generated from field: google.protobuf.StringValue client_secret = 9;
     */
    clientSecret?: string;
    /**
     * @generated from field: repeated string scopes = 10;
     */
    scopes: string[];
    /**
     * @generated from field: string redirect_uri = 12;
     */
    redirectUri: string;
    /**
     * @generated from field: google.protobuf.BoolValue pkce_enabled = 13;
     */
    pkceEnabled?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue prompt = 14;
     */
    prompt?: string;
    /**
     * @generated from field: google.protobuf.BoolValue use_platform_creds = 15;
     */
    usePlatformCreds?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue access_type = 16;
     */
    accessType?: string;
    /**
     * @generated from field: google.protobuf.StringValue custom_scope_name = 17;
     */
    customScopeName?: string;
    /**
     * @generated from field: google.protobuf.BoolValue sync_user_profile_on_login = 18;
     */
    syncUserProfileOnLogin?: boolean;
    constructor(data?: PartialMessage<OAuthConnectionConfig>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.OAuthConnectionConfig";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OAuthConnectionConfig;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OAuthConnectionConfig;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OAuthConnectionConfig;
    static equals(a: OAuthConnectionConfig | PlainMessage<OAuthConnectionConfig> | undefined, b: OAuthConnectionConfig | PlainMessage<OAuthConnectionConfig> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.PasswordLessConfig
 */
export declare class PasswordLessConfig extends Message<PasswordLessConfig> {
    /**
     * @generated from field: scalekit.v1.connections.PasswordlessType type = 1;
     */
    type: PasswordlessType;
    /**
     * @generated from field: optional google.protobuf.UInt32Value frequency = 2;
     */
    frequency?: number;
    /**
     * @generated from field: optional google.protobuf.UInt32Value validity = 3;
     */
    validity?: number;
    /**
     * @generated from field: optional google.protobuf.BoolValue enforce_same_browser_origin = 4;
     */
    enforceSameBrowserOrigin?: boolean;
    /**
     * @generated from field: optional google.protobuf.UInt32Value code_challenge_length = 5;
     */
    codeChallengeLength?: number;
    /**
     * @generated from field: optional scalekit.v1.connections.CodeChallengeType code_challenge_type = 6;
     */
    codeChallengeType?: CodeChallengeType;
    /**
     * @generated from field: optional google.protobuf.BoolValue regenerate_passwordless_credentials_on_resend = 7;
     */
    regeneratePasswordlessCredentialsOnResend?: boolean;
    constructor(data?: PartialMessage<PasswordLessConfig>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.PasswordLessConfig";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PasswordLessConfig;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PasswordLessConfig;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PasswordLessConfig;
    static equals(a: PasswordLessConfig | PlainMessage<PasswordLessConfig> | undefined, b: PasswordLessConfig | PlainMessage<PasswordLessConfig> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.StaticAuthConfig
 */
export declare class StaticAuthConfig extends Message<StaticAuthConfig> {
    /**
     * @generated from field: google.protobuf.Struct static_config = 1;
     */
    staticConfig?: Struct;
    constructor(data?: PartialMessage<StaticAuthConfig>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.StaticAuthConfig";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StaticAuthConfig;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StaticAuthConfig;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StaticAuthConfig;
    static equals(a: StaticAuthConfig | PlainMessage<StaticAuthConfig> | undefined, b: StaticAuthConfig | PlainMessage<StaticAuthConfig> | undefined): boolean;
}
/**
 * WebAuthConfiguration defines WebAuthn (passkeys) configuration limited to RP and Attestation
 *
 * @generated from message scalekit.v1.connections.WebAuthConfiguration
 */
export declare class WebAuthConfiguration extends Message<WebAuthConfiguration> {
    /**
     * @generated from field: scalekit.v1.connections.WebAuthConfiguration.Rp rp = 1;
     */
    rp?: WebAuthConfiguration_Rp;
    /**
     * @generated from field: scalekit.v1.connections.WebAuthConfiguration.Attestation attestation = 2;
     */
    attestation?: WebAuthConfiguration_Attestation;
    /**
     * @generated from field: scalekit.v1.connections.WebAuthConfiguration.Authenticators authenticators = 3;
     */
    authenticators?: WebAuthConfiguration_Authenticators;
    /**
     * @generated from field: scalekit.v1.connections.WebAuthConfiguration.AuthenticatorSelection authenticator_selection = 4;
     */
    authenticatorSelection?: WebAuthConfiguration_AuthenticatorSelection;
    /**
     * @generated from field: scalekit.v1.connections.WebAuthConfiguration.Timeout timeout = 5;
     */
    timeout?: WebAuthConfiguration_Timeout;
    /**
     * @generated from field: bool enable_auto_registration = 6;
     */
    enableAutoRegistration: boolean;
    /**
     * @generated from field: bool show_passkey_button = 7;
     */
    showPasskeyButton: boolean;
    /**
     * @generated from field: bool enable_conditional_login = 8;
     */
    enableConditionalLogin: boolean;
    constructor(data?: PartialMessage<WebAuthConfiguration>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.WebAuthConfiguration";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthConfiguration;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthConfiguration;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthConfiguration;
    static equals(a: WebAuthConfiguration | PlainMessage<WebAuthConfiguration> | undefined, b: WebAuthConfiguration | PlainMessage<WebAuthConfiguration> | undefined): boolean;
}
/**
 * Rp contains relying party identifiers and origins
 *
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Rp
 */
export declare class WebAuthConfiguration_Rp extends Message<WebAuthConfiguration_Rp> {
    /**
     * Relying party IDs (derived from environment domain and verified custom domain)
     * At least one required; must be hostnames without scheme or path
     *
     * @generated from field: repeated string ids = 1;
     */
    ids: string[];
    /**
     * Allowed origins corresponding to the RP IDs (https://<domain>)
     * At least one required; must be HTTPS origins
     *
     * @generated from field: repeated string origins = 2;
     */
    origins: string[];
    constructor(data?: PartialMessage<WebAuthConfiguration_Rp>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.WebAuthConfiguration.Rp";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthConfiguration_Rp;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthConfiguration_Rp;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthConfiguration_Rp;
    static equals(a: WebAuthConfiguration_Rp | PlainMessage<WebAuthConfiguration_Rp> | undefined, b: WebAuthConfiguration_Rp | PlainMessage<WebAuthConfiguration_Rp> | undefined): boolean;
}
/**
 * Attestation preferences for registration
 *
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Attestation
 */
export declare class WebAuthConfiguration_Attestation extends Message<WebAuthConfiguration_Attestation> {
    /**
     * Conveyance preference
     *
     * @generated from field: google.protobuf.StringValue conveyance_preference = 1;
     */
    conveyancePreference?: string;
    /**
     * Enterprise-approved IDs (optional allowlist when enterprise attestation is used)
     *
     * @generated from field: repeated string enterprise_approved_ids = 2;
     */
    enterpriseApprovedIds: string[];
    constructor(data?: PartialMessage<WebAuthConfiguration_Attestation>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.WebAuthConfiguration.Attestation";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthConfiguration_Attestation;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthConfiguration_Attestation;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthConfiguration_Attestation;
    static equals(a: WebAuthConfiguration_Attestation | PlainMessage<WebAuthConfiguration_Attestation> | undefined, b: WebAuthConfiguration_Attestation | PlainMessage<WebAuthConfiguration_Attestation> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Authenticators
 */
export declare class WebAuthConfiguration_Authenticators extends Message<WebAuthConfiguration_Authenticators> {
    /**
     * @generated from field: google.protobuf.BoolValue validate_entry = 1;
     */
    validateEntry?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue validate_entry_permit_zero_aaguid = 2;
     */
    validateEntryPermitZeroAaguid?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue validate_anchors = 3;
     */
    validateAnchors?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue validate_status = 4;
     */
    validateStatus?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue validate_attestation_type = 5;
     */
    validateAttestationType?: boolean;
    /**
     * @generated from field: repeated string desired_authenticator_status = 6;
     */
    desiredAuthenticatorStatus: string[];
    /**
     * @generated from field: repeated string undesired_authenticator_status = 7;
     */
    undesiredAuthenticatorStatus: string[];
    constructor(data?: PartialMessage<WebAuthConfiguration_Authenticators>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.WebAuthConfiguration.Authenticators";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthConfiguration_Authenticators;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthConfiguration_Authenticators;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthConfiguration_Authenticators;
    static equals(a: WebAuthConfiguration_Authenticators | PlainMessage<WebAuthConfiguration_Authenticators> | undefined, b: WebAuthConfiguration_Authenticators | PlainMessage<WebAuthConfiguration_Authenticators> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.AuthenticatorSelection
 */
export declare class WebAuthConfiguration_AuthenticatorSelection extends Message<WebAuthConfiguration_AuthenticatorSelection> {
    /**
     * User verification requirement
     *
     * @generated from field: google.protobuf.StringValue user_verification = 1;
     */
    userVerification?: string;
    /**
     * @generated from field: google.protobuf.StringValue authenticator_attachment = 2;
     */
    authenticatorAttachment?: string;
    constructor(data?: PartialMessage<WebAuthConfiguration_AuthenticatorSelection>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.WebAuthConfiguration.AuthenticatorSelection";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthConfiguration_AuthenticatorSelection;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthConfiguration_AuthenticatorSelection;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthConfiguration_AuthenticatorSelection;
    static equals(a: WebAuthConfiguration_AuthenticatorSelection | PlainMessage<WebAuthConfiguration_AuthenticatorSelection> | undefined, b: WebAuthConfiguration_AuthenticatorSelection | PlainMessage<WebAuthConfiguration_AuthenticatorSelection> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Timeout
 */
export declare class WebAuthConfiguration_Timeout extends Message<WebAuthConfiguration_Timeout> {
    /**
     * @generated from field: google.protobuf.Duration registration = 1;
     */
    registration?: Duration;
    /**
     * @generated from field: google.protobuf.Duration registration_uvd = 2;
     */
    registrationUvd?: Duration;
    /**
     * @generated from field: google.protobuf.Duration login = 3;
     */
    login?: Duration;
    /**
     * @generated from field: google.protobuf.Duration login_uvd = 4;
     */
    loginUvd?: Duration;
    constructor(data?: PartialMessage<WebAuthConfiguration_Timeout>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.WebAuthConfiguration.Timeout";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): WebAuthConfiguration_Timeout;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): WebAuthConfiguration_Timeout;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): WebAuthConfiguration_Timeout;
    static equals(a: WebAuthConfiguration_Timeout | PlainMessage<WebAuthConfiguration_Timeout> | undefined, b: WebAuthConfiguration_Timeout | PlainMessage<WebAuthConfiguration_Timeout> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.SAMLConnectionConfigRequest
 */
export declare class SAMLConnectionConfigRequest extends Message<SAMLConnectionConfigRequest> {
    /**
     * @generated from field: google.protobuf.StringValue idp_metadata_url = 1;
     */
    idpMetadataUrl?: string;
    /**
     * @generated from field: google.protobuf.StringValue idp_entity_id = 2;
     */
    idpEntityId?: string;
    /**
     * @generated from field: google.protobuf.StringValue idp_sso_url = 3;
     */
    idpSsoUrl?: string;
    /**
     * @generated from field: google.protobuf.StringValue idp_certificate = 4;
     */
    idpCertificate?: string;
    /**
     * @generated from field: google.protobuf.StringValue idp_slo_url = 5;
     */
    idpSloUrl?: string;
    /**
     * @generated from field: google.protobuf.StringValue ui_button_title = 6;
     */
    uiButtonTitle?: string;
    /**
     * @generated from field: scalekit.v1.connections.NameIdFormat idp_name_id_format = 7;
     */
    idpNameIdFormat: NameIdFormat;
    /**
     * @generated from field: scalekit.v1.connections.RequestBinding idp_sso_request_binding = 8;
     */
    idpSsoRequestBinding: RequestBinding;
    /**
     * @generated from field: scalekit.v1.connections.RequestBinding idp_slo_request_binding = 9;
     */
    idpSloRequestBinding: RequestBinding;
    /**
     * @generated from field: scalekit.v1.connections.SAMLSigningOptions saml_signing_option = 10;
     */
    samlSigningOption: SAMLSigningOptions;
    /**
     * @generated from field: google.protobuf.BoolValue force_authn = 14;
     */
    forceAuthn?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue default_redirect_uri = 15;
     */
    defaultRedirectUri?: string;
    /**
     * @generated from field: google.protobuf.BoolValue assertion_encrypted = 16;
     */
    assertionEncrypted?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue want_request_signed = 17;
     */
    wantRequestSigned?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue certificate_id = 18;
     */
    certificateId?: string;
    /**
     * @generated from field: google.protobuf.BoolValue idp_slo_required = 19;
     */
    idpSloRequired?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue sp_entity_id = 20;
     */
    spEntityId?: string;
    /**
     * @generated from field: google.protobuf.StringValue sp_assertion_url = 21;
     */
    spAssertionUrl?: string;
    /**
     * @generated from field: google.protobuf.StringValue sp_slo_url = 22;
     */
    spSloUrl?: string;
    /**
     * @generated from field: google.protobuf.BoolValue sync_user_profile_on_login = 23;
     */
    syncUserProfileOnLogin?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue jit_provisioning_with_sso_enabled = 24;
     */
    jitProvisioningWithSsoEnabled?: boolean;
    constructor(data?: PartialMessage<SAMLConnectionConfigRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.SAMLConnectionConfigRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SAMLConnectionConfigRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SAMLConnectionConfigRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SAMLConnectionConfigRequest;
    static equals(a: SAMLConnectionConfigRequest | PlainMessage<SAMLConnectionConfigRequest> | undefined, b: SAMLConnectionConfigRequest | PlainMessage<SAMLConnectionConfigRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.SAMLConnectionConfigResponse
 */
export declare class SAMLConnectionConfigResponse extends Message<SAMLConnectionConfigResponse> {
    /**
     * @generated from field: string sp_entity_id = 1;
     */
    spEntityId: string;
    /**
     * @generated from field: string sp_assertion_url = 2;
     */
    spAssertionUrl: string;
    /**
     * @generated from field: string sp_metadata_url = 3;
     */
    spMetadataUrl: string;
    /**
     * @generated from field: google.protobuf.StringValue idp_metadata_url = 4;
     */
    idpMetadataUrl?: string;
    /**
     * @generated from field: google.protobuf.StringValue idp_entity_id = 5;
     */
    idpEntityId?: string;
    /**
     * @generated from field: google.protobuf.StringValue idp_sso_url = 6;
     */
    idpSsoUrl?: string;
    /**
     * @generated from field: repeated scalekit.v1.connections.IDPCertificate idp_certificates = 7;
     */
    idpCertificates: IDPCertificate[];
    /**
     * @generated from field: google.protobuf.StringValue idp_slo_url = 8;
     */
    idpSloUrl?: string;
    /**
     * @generated from field: google.protobuf.StringValue ui_button_title = 9;
     */
    uiButtonTitle?: string;
    /**
     * @generated from field: scalekit.v1.connections.NameIdFormat idp_name_id_format = 10;
     */
    idpNameIdFormat: NameIdFormat;
    /**
     * @generated from field: scalekit.v1.connections.RequestBinding idp_sso_request_binding = 11;
     */
    idpSsoRequestBinding: RequestBinding;
    /**
     * @generated from field: scalekit.v1.connections.RequestBinding idp_slo_request_binding = 12;
     */
    idpSloRequestBinding: RequestBinding;
    /**
     * @generated from field: scalekit.v1.connections.SAMLSigningOptions saml_signing_option = 13;
     */
    samlSigningOption: SAMLSigningOptions;
    /**
     * @generated from field: google.protobuf.BoolValue allow_idp_initiated_login = 14;
     */
    allowIdpInitiatedLogin?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue force_authn = 15;
     */
    forceAuthn?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue default_redirect_uri = 16;
     */
    defaultRedirectUri?: string;
    /**
     * @generated from field: google.protobuf.BoolValue assertion_encrypted = 17;
     */
    assertionEncrypted?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue want_request_signed = 18;
     */
    wantRequestSigned?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue certificate_id = 19;
     */
    certificateId?: string;
    /**
     * @generated from field: google.protobuf.BoolValue idp_slo_required = 20;
     */
    idpSloRequired?: boolean;
    /**
     * @generated from field: google.protobuf.StringValue sp_slo_url = 21;
     */
    spSloUrl?: string;
    /**
     * @generated from field: google.protobuf.BoolValue sync_user_profile_on_login = 22;
     */
    syncUserProfileOnLogin?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue jit_provisioning_with_sso_enabled = 23;
     */
    jitProvisioningWithSsoEnabled?: boolean;
    constructor(data?: PartialMessage<SAMLConnectionConfigResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.SAMLConnectionConfigResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SAMLConnectionConfigResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SAMLConnectionConfigResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SAMLConnectionConfigResponse;
    static equals(a: SAMLConnectionConfigResponse | PlainMessage<SAMLConnectionConfigResponse> | undefined, b: SAMLConnectionConfigResponse | PlainMessage<SAMLConnectionConfigResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.IDPCertificate
 */
export declare class IDPCertificate extends Message<IDPCertificate> {
    /**
     * @generated from field: string certificate = 1;
     */
    certificate: string;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 2;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp expiry_time = 3;
     */
    expiryTime?: Timestamp;
    /**
     * @generated from field: string id = 4;
     */
    id: string;
    /**
     * @generated from field: string issuer = 5;
     */
    issuer: string;
    constructor(data?: PartialMessage<IDPCertificate>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.IDPCertificate";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): IDPCertificate;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): IDPCertificate;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): IDPCertificate;
    static equals(a: IDPCertificate | PlainMessage<IDPCertificate> | undefined, b: IDPCertificate | PlainMessage<IDPCertificate> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetOIDCMetadataRequest
 */
export declare class GetOIDCMetadataRequest extends Message<GetOIDCMetadataRequest> {
    /**
     * @generated from field: scalekit.v1.connections.OIDCMetadataRequest metadata = 1;
     */
    metadata?: OIDCMetadataRequest;
    constructor(data?: PartialMessage<GetOIDCMetadataRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetOIDCMetadataRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOIDCMetadataRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOIDCMetadataRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOIDCMetadataRequest;
    static equals(a: GetOIDCMetadataRequest | PlainMessage<GetOIDCMetadataRequest> | undefined, b: GetOIDCMetadataRequest | PlainMessage<GetOIDCMetadataRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.OIDCMetadataRequest
 */
export declare class OIDCMetadataRequest extends Message<OIDCMetadataRequest> {
    /**
     * @generated from field: string issuer = 1;
     */
    issuer: string;
    constructor(data?: PartialMessage<OIDCMetadataRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.OIDCMetadataRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OIDCMetadataRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OIDCMetadataRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OIDCMetadataRequest;
    static equals(a: OIDCMetadataRequest | PlainMessage<OIDCMetadataRequest> | undefined, b: OIDCMetadataRequest | PlainMessage<OIDCMetadataRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetOIDCMetadataResponse
 */
export declare class GetOIDCMetadataResponse extends Message<GetOIDCMetadataResponse> {
    /**
     * @generated from field: string issuer = 1;
     */
    issuer: string;
    /**
     * @generated from field: string authorization_endpoint = 2;
     */
    authorizationEndpoint: string;
    /**
     * @generated from field: string token_endpoint = 3;
     */
    tokenEndpoint: string;
    /**
     * @generated from field: string userinfo_endpoint = 4;
     */
    userinfoEndpoint: string;
    /**
     * @generated from field: string jwks_uri = 5;
     */
    jwksUri: string;
    constructor(data?: PartialMessage<GetOIDCMetadataResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetOIDCMetadataResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOIDCMetadataResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOIDCMetadataResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOIDCMetadataResponse;
    static equals(a: GetOIDCMetadataResponse | PlainMessage<GetOIDCMetadataResponse> | undefined, b: GetOIDCMetadataResponse | PlainMessage<GetOIDCMetadataResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetSAMLMetadataRequest
 */
export declare class GetSAMLMetadataRequest extends Message<GetSAMLMetadataRequest> {
    /**
     * @generated from field: scalekit.v1.connections.SAMLMetadataRequest metadata = 1;
     */
    metadata?: SAMLMetadataRequest;
    constructor(data?: PartialMessage<GetSAMLMetadataRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetSAMLMetadataRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetSAMLMetadataRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetSAMLMetadataRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetSAMLMetadataRequest;
    static equals(a: GetSAMLMetadataRequest | PlainMessage<GetSAMLMetadataRequest> | undefined, b: GetSAMLMetadataRequest | PlainMessage<GetSAMLMetadataRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.SAMLMetadataRequest
 */
export declare class SAMLMetadataRequest extends Message<SAMLMetadataRequest> {
    /**
     * @generated from field: string metadata_url = 1;
     */
    metadataUrl: string;
    constructor(data?: PartialMessage<SAMLMetadataRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.SAMLMetadataRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SAMLMetadataRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SAMLMetadataRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SAMLMetadataRequest;
    static equals(a: SAMLMetadataRequest | PlainMessage<SAMLMetadataRequest> | undefined, b: SAMLMetadataRequest | PlainMessage<SAMLMetadataRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetSAMLMetadataResponse
 */
export declare class GetSAMLMetadataResponse extends Message<GetSAMLMetadataResponse> {
    /**
     * @generated from field: string idp_entity_id = 1;
     */
    idpEntityId: string;
    /**
     * @generated from field: string idp_sso_url = 2;
     */
    idpSsoUrl: string;
    /**
     * @generated from field: string idp_slo_url = 3;
     */
    idpSloUrl: string;
    /**
     * @generated from field: repeated string idp_certificates = 4;
     */
    idpCertificates: string[];
    /**
     * @generated from field: string idp_name_id_format = 5;
     */
    idpNameIdFormat: string;
    /**
     * @generated from field: string request_binding = 6;
     */
    requestBinding: string;
    /**
     * @generated from field: bool want_assertions_signed = 7;
     */
    wantAssertionsSigned: boolean;
    constructor(data?: PartialMessage<GetSAMLMetadataResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetSAMLMetadataResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetSAMLMetadataResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetSAMLMetadataResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetSAMLMetadataResponse;
    static equals(a: GetSAMLMetadataResponse | PlainMessage<GetSAMLMetadataResponse> | undefined, b: GetSAMLMetadataResponse | PlainMessage<GetSAMLMetadataResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetSAMLCertificateDetailsRequest
 */
export declare class GetSAMLCertificateDetailsRequest extends Message<GetSAMLCertificateDetailsRequest> {
    /**
     * @generated from field: scalekit.v1.connections.SAMLCertificateRequest certificate = 1;
     */
    certificate?: SAMLCertificateRequest;
    constructor(data?: PartialMessage<GetSAMLCertificateDetailsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetSAMLCertificateDetailsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetSAMLCertificateDetailsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetSAMLCertificateDetailsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetSAMLCertificateDetailsRequest;
    static equals(a: GetSAMLCertificateDetailsRequest | PlainMessage<GetSAMLCertificateDetailsRequest> | undefined, b: GetSAMLCertificateDetailsRequest | PlainMessage<GetSAMLCertificateDetailsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.SAMLCertificateRequest
 */
export declare class SAMLCertificateRequest extends Message<SAMLCertificateRequest> {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
    constructor(data?: PartialMessage<SAMLCertificateRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.SAMLCertificateRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SAMLCertificateRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SAMLCertificateRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SAMLCertificateRequest;
    static equals(a: SAMLCertificateRequest | PlainMessage<SAMLCertificateRequest> | undefined, b: SAMLCertificateRequest | PlainMessage<SAMLCertificateRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetSAMLCertificateDetailsResponse
 */
export declare class GetSAMLCertificateDetailsResponse extends Message<GetSAMLCertificateDetailsResponse> {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * @generated from field: int64 not_after = 2;
     */
    notAfter: bigint;
    /**
     * @generated from field: int64 not_before = 3;
     */
    notBefore: bigint;
    /**
     * @generated from field: string subject = 4;
     */
    subject: string;
    /**
     * @generated from field: string issuer = 5;
     */
    issuer: string;
    constructor(data?: PartialMessage<GetSAMLCertificateDetailsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetSAMLCertificateDetailsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetSAMLCertificateDetailsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetSAMLCertificateDetailsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetSAMLCertificateDetailsResponse;
    static equals(a: GetSAMLCertificateDetailsResponse | PlainMessage<GetSAMLCertificateDetailsResponse> | undefined, b: GetSAMLCertificateDetailsResponse | PlainMessage<GetSAMLCertificateDetailsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetConnectionTestResultRequest
 */
export declare class GetConnectionTestResultRequest extends Message<GetConnectionTestResultRequest> {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string test_request_id = 2;
     */
    testRequestId: string;
    constructor(data?: PartialMessage<GetConnectionTestResultRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetConnectionTestResultRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetConnectionTestResultRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetConnectionTestResultRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetConnectionTestResultRequest;
    static equals(a: GetConnectionTestResultRequest | PlainMessage<GetConnectionTestResultRequest> | undefined, b: GetConnectionTestResultRequest | PlainMessage<GetConnectionTestResultRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.GetConnectionTestResultResponse
 */
export declare class GetConnectionTestResultResponse extends Message<GetConnectionTestResultResponse> {
    /**
     * @generated from field: scalekit.v1.connections.TestResultStatus status = 1;
     */
    status: TestResultStatus;
    /**
     * @generated from field: optional string user_info = 2;
     */
    userInfo?: string;
    /**
     * @generated from field: optional string error = 3;
     */
    error?: string;
    /**
     * @generated from field: optional string error_description = 4;
     */
    errorDescription?: string;
    /**
     * @generated from field: optional string error_details = 5;
     */
    errorDetails?: string;
    constructor(data?: PartialMessage<GetConnectionTestResultResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.GetConnectionTestResultResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetConnectionTestResultResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetConnectionTestResultResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetConnectionTestResultResponse;
    static equals(a: GetConnectionTestResultResponse | PlainMessage<GetConnectionTestResultResponse> | undefined, b: GetConnectionTestResultResponse | PlainMessage<GetConnectionTestResultResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.PasswordConnectionConfig
 */
export declare class PasswordConnectionConfig extends Message<PasswordConnectionConfig> {
    constructor(data?: PartialMessage<PasswordConnectionConfig>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.PasswordConnectionConfig";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PasswordConnectionConfig;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PasswordConnectionConfig;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PasswordConnectionConfig;
    static equals(a: PasswordConnectionConfig | PlainMessage<PasswordConnectionConfig> | undefined, b: PasswordConnectionConfig | PlainMessage<PasswordConnectionConfig> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.Flags
 */
export declare class Flags extends Message<Flags> {
    /**
     * @generated from field: bool is_login = 1;
     */
    isLogin: boolean;
    /**
     * @generated from field: bool is_app = 2;
     */
    isApp: boolean;
    constructor(data?: PartialMessage<Flags>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.Flags";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Flags;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Flags;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Flags;
    static equals(a: Flags | PlainMessage<Flags> | undefined, b: Flags | PlainMessage<Flags> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ListAppConnectionsRequest
 */
export declare class ListAppConnectionsRequest extends Message<ListAppConnectionsRequest> {
    /**
     * @generated from field: uint32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
    /**
     * @generated from field: optional string provider = 3;
     */
    provider?: string;
    constructor(data?: PartialMessage<ListAppConnectionsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ListAppConnectionsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAppConnectionsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAppConnectionsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAppConnectionsRequest;
    static equals(a: ListAppConnectionsRequest | PlainMessage<ListAppConnectionsRequest> | undefined, b: ListAppConnectionsRequest | PlainMessage<ListAppConnectionsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connections.ListAppConnectionsResponse
 */
export declare class ListAppConnectionsResponse extends Message<ListAppConnectionsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.connections.ListConnection connections = 1;
     */
    connections: ListConnection[];
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 3;
     */
    prevPageToken: string;
    /**
     * @generated from field: uint32 total_size = 4;
     */
    totalSize: number;
    constructor(data?: PartialMessage<ListAppConnectionsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connections.ListAppConnectionsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAppConnectionsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAppConnectionsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAppConnectionsResponse;
    static equals(a: ListAppConnectionsResponse | PlainMessage<ListAppConnectionsResponse> | undefined, b: ListAppConnectionsResponse | PlainMessage<ListAppConnectionsResponse> | undefined): boolean;
}
