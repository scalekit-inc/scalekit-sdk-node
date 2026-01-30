import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Struct, Timestamp } from "@bufbuild/protobuf";
/**
 * Status of a connected account indicating its current state
 *
 * @generated from enum scalekit.v1.connected_accounts.ConnectorStatus
 */
export declare enum ConnectorStatus {
    /**
     * Default/unknown status
     *
     * @generated from enum value: CONNECTION_STATUS_UNSPECIFIED = 0;
     */
    CONNECTION_STATUS_UNSPECIFIED = 0,
    /**
     * Account is connected and credentials are valid
     *
     * @generated from enum value: ACTIVE = 1;
     */
    ACTIVE = 1,
    /**
     * Access token has expired and needs refresh
     *
     * @generated from enum value: EXPIRED = 2;
     */
    EXPIRED = 2,
    /**
     * Account awaiting user authorization
     *
     * @generated from enum value: PENDING_AUTH = 3;
     */
    PENDING_AUTH = 3
}
/**
 * Type of authentication mechanism used for the connected account
 *
 * @generated from enum scalekit.v1.connected_accounts.ConnectorType
 */
export declare enum ConnectorType {
    /**
     * Default/unknown type
     *
     * @generated from enum value: CONNECTION_TYPE_UNSPECIFIED = 0;
     */
    CONNECTION_TYPE_UNSPECIFIED = 0,
    /**
     * OAuth 2.0 authorization with access and refresh tokens
     *
     * @generated from enum value: OAUTH = 1;
     */
    OAUTH = 1,
    /**
     * Static API key authentication
     *
     * @generated from enum value: API_KEY = 2;
     */
    API_KEY = 2,
    /**
     * HTTP Basic Authentication (username/password)
     *
     * @generated from enum value: BASIC_AUTH = 3;
     */
    BASIC_AUTH = 3,
    /**
     * Bearer token authentication
     *
     * @generated from enum value: BEARER_TOKEN = 4;
     */
    BEARER_TOKEN = 4,
    /**
     * Custom authentication mechanism
     *
     * @generated from enum value: CUSTOM = 5;
     */
    CUSTOM = 5,
    /**
     * Basic authentication (alias)
     *
     * @generated from enum value: BASIC = 6;
     */
    BASIC = 6
}
/**
 * @generated from message scalekit.v1.connected_accounts.ListConnectedAccountsRequest
 */
export declare class ListConnectedAccountsRequest extends Message<ListConnectedAccountsRequest> {
    /**
     * @generated from field: optional string organization_id = 1;
     */
    organizationId?: string;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string;
    /**
     * @generated from field: string provider = 5;
     */
    provider: string;
    /**
     * @generated from field: uint32 page_size = 6;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 7;
     */
    pageToken: string;
    /**
     * @generated from field: string query = 8;
     */
    query: string;
    constructor(data?: PartialMessage<ListConnectedAccountsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.ListConnectedAccountsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListConnectedAccountsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListConnectedAccountsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListConnectedAccountsRequest;
    static equals(a: ListConnectedAccountsRequest | PlainMessage<ListConnectedAccountsRequest> | undefined, b: ListConnectedAccountsRequest | PlainMessage<ListConnectedAccountsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.ListConnectedAccountsResponse
 */
export declare class ListConnectedAccountsResponse extends Message<ListConnectedAccountsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.connected_accounts.ConnectedAccountForList connected_accounts = 1;
     */
    connectedAccounts: ConnectedAccountForList[];
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: string next_page_token = 3;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
    constructor(data?: PartialMessage<ListConnectedAccountsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.ListConnectedAccountsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListConnectedAccountsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListConnectedAccountsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListConnectedAccountsResponse;
    static equals(a: ListConnectedAccountsResponse | PlainMessage<ListConnectedAccountsResponse> | undefined, b: ListConnectedAccountsResponse | PlainMessage<ListConnectedAccountsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.SearchConnectedAccountsRequest
 */
export declare class SearchConnectedAccountsRequest extends Message<SearchConnectedAccountsRequest> {
    /**
     * @generated from field: string query = 1;
     */
    query: string;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
    /**
     * @generated from field: string connection_id = 4;
     */
    connectionId: string;
    constructor(data?: PartialMessage<SearchConnectedAccountsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.SearchConnectedAccountsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchConnectedAccountsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchConnectedAccountsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchConnectedAccountsRequest;
    static equals(a: SearchConnectedAccountsRequest | PlainMessage<SearchConnectedAccountsRequest> | undefined, b: SearchConnectedAccountsRequest | PlainMessage<SearchConnectedAccountsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.SearchConnectedAccountsResponse
 */
export declare class SearchConnectedAccountsResponse extends Message<SearchConnectedAccountsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.connected_accounts.ConnectedAccountForList connected_accounts = 1;
     */
    connectedAccounts: ConnectedAccountForList[];
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: string next_page_token = 3;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
    constructor(data?: PartialMessage<SearchConnectedAccountsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.SearchConnectedAccountsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchConnectedAccountsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchConnectedAccountsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchConnectedAccountsResponse;
    static equals(a: SearchConnectedAccountsResponse | PlainMessage<SearchConnectedAccountsResponse> | undefined, b: SearchConnectedAccountsResponse | PlainMessage<SearchConnectedAccountsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.CreateConnectedAccountRequest
 */
export declare class CreateConnectedAccountRequest extends Message<CreateConnectedAccountRequest> {
    /**
     * @generated from field: optional string organization_id = 1;
     */
    organizationId?: string;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string;
    /**
     * @generated from field: scalekit.v1.connected_accounts.CreateConnectedAccount connected_account = 5;
     */
    connectedAccount?: CreateConnectedAccount;
    constructor(data?: PartialMessage<CreateConnectedAccountRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.CreateConnectedAccountRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateConnectedAccountRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateConnectedAccountRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateConnectedAccountRequest;
    static equals(a: CreateConnectedAccountRequest | PlainMessage<CreateConnectedAccountRequest> | undefined, b: CreateConnectedAccountRequest | PlainMessage<CreateConnectedAccountRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.CreateConnectedAccountResponse
 */
export declare class CreateConnectedAccountResponse extends Message<CreateConnectedAccountResponse> {
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
     */
    connectedAccount?: ConnectedAccount;
    constructor(data?: PartialMessage<CreateConnectedAccountResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.CreateConnectedAccountResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateConnectedAccountResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateConnectedAccountResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateConnectedAccountResponse;
    static equals(a: CreateConnectedAccountResponse | PlainMessage<CreateConnectedAccountResponse> | undefined, b: CreateConnectedAccountResponse | PlainMessage<CreateConnectedAccountResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.UpdateConnectedAccountRequest
 */
export declare class UpdateConnectedAccountRequest extends Message<UpdateConnectedAccountRequest> {
    /**
     * @generated from field: optional string organization_id = 1;
     */
    organizationId?: string;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string;
    /**
     * @generated from field: optional string id = 6;
     */
    id?: string;
    /**
     * @generated from field: scalekit.v1.connected_accounts.UpdateConnectedAccount connected_account = 5;
     */
    connectedAccount?: UpdateConnectedAccount;
    constructor(data?: PartialMessage<UpdateConnectedAccountRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.UpdateConnectedAccountRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateConnectedAccountRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateConnectedAccountRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateConnectedAccountRequest;
    static equals(a: UpdateConnectedAccountRequest | PlainMessage<UpdateConnectedAccountRequest> | undefined, b: UpdateConnectedAccountRequest | PlainMessage<UpdateConnectedAccountRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.UpdateConnectedAccountResponse
 */
export declare class UpdateConnectedAccountResponse extends Message<UpdateConnectedAccountResponse> {
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
     */
    connectedAccount?: ConnectedAccount;
    constructor(data?: PartialMessage<UpdateConnectedAccountResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.UpdateConnectedAccountResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateConnectedAccountResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateConnectedAccountResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateConnectedAccountResponse;
    static equals(a: UpdateConnectedAccountResponse | PlainMessage<UpdateConnectedAccountResponse> | undefined, b: UpdateConnectedAccountResponse | PlainMessage<UpdateConnectedAccountResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.DeleteConnectedAccountRequest
 */
export declare class DeleteConnectedAccountRequest extends Message<DeleteConnectedAccountRequest> {
    /**
     * @generated from field: optional string organization_id = 1;
     */
    organizationId?: string;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string;
    /**
     * @generated from field: optional string id = 5;
     */
    id?: string;
    constructor(data?: PartialMessage<DeleteConnectedAccountRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.DeleteConnectedAccountRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteConnectedAccountRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteConnectedAccountRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteConnectedAccountRequest;
    static equals(a: DeleteConnectedAccountRequest | PlainMessage<DeleteConnectedAccountRequest> | undefined, b: DeleteConnectedAccountRequest | PlainMessage<DeleteConnectedAccountRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.DeleteConnectedAccountResponse
 */
export declare class DeleteConnectedAccountResponse extends Message<DeleteConnectedAccountResponse> {
    constructor(data?: PartialMessage<DeleteConnectedAccountResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.DeleteConnectedAccountResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteConnectedAccountResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteConnectedAccountResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteConnectedAccountResponse;
    static equals(a: DeleteConnectedAccountResponse | PlainMessage<DeleteConnectedAccountResponse> | undefined, b: DeleteConnectedAccountResponse | PlainMessage<DeleteConnectedAccountResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountRequest
 */
export declare class GetMagicLinkForConnectedAccountRequest extends Message<GetMagicLinkForConnectedAccountRequest> {
    /**
     * @generated from field: optional string organization_id = 1;
     */
    organizationId?: string;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string;
    /**
     * @generated from field: optional string id = 5;
     */
    id?: string;
    constructor(data?: PartialMessage<GetMagicLinkForConnectedAccountRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetMagicLinkForConnectedAccountRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetMagicLinkForConnectedAccountRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetMagicLinkForConnectedAccountRequest;
    static equals(a: GetMagicLinkForConnectedAccountRequest | PlainMessage<GetMagicLinkForConnectedAccountRequest> | undefined, b: GetMagicLinkForConnectedAccountRequest | PlainMessage<GetMagicLinkForConnectedAccountRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountResponse
 */
export declare class GetMagicLinkForConnectedAccountResponse extends Message<GetMagicLinkForConnectedAccountResponse> {
    /**
     * @generated from field: string link = 1;
     */
    link: string;
    /**
     * @generated from field: google.protobuf.Timestamp expiry = 2;
     */
    expiry?: Timestamp;
    constructor(data?: PartialMessage<GetMagicLinkForConnectedAccountResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetMagicLinkForConnectedAccountResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetMagicLinkForConnectedAccountResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetMagicLinkForConnectedAccountResponse;
    static equals(a: GetMagicLinkForConnectedAccountResponse | PlainMessage<GetMagicLinkForConnectedAccountResponse> | undefined, b: GetMagicLinkForConnectedAccountResponse | PlainMessage<GetMagicLinkForConnectedAccountResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierRequest
 */
export declare class GetConnectedAccountByIdentifierRequest extends Message<GetConnectedAccountByIdentifierRequest> {
    /**
     * @generated from field: optional string organization_id = 1;
     */
    organizationId?: string;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string;
    /**
     * @generated from field: optional string id = 5;
     */
    id?: string;
    constructor(data?: PartialMessage<GetConnectedAccountByIdentifierRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetConnectedAccountByIdentifierRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetConnectedAccountByIdentifierRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetConnectedAccountByIdentifierRequest;
    static equals(a: GetConnectedAccountByIdentifierRequest | PlainMessage<GetConnectedAccountByIdentifierRequest> | undefined, b: GetConnectedAccountByIdentifierRequest | PlainMessage<GetConnectedAccountByIdentifierRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierResponse
 */
export declare class GetConnectedAccountByIdentifierResponse extends Message<GetConnectedAccountByIdentifierResponse> {
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
     */
    connectedAccount?: ConnectedAccount;
    constructor(data?: PartialMessage<GetConnectedAccountByIdentifierResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetConnectedAccountByIdentifierResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetConnectedAccountByIdentifierResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetConnectedAccountByIdentifierResponse;
    static equals(a: GetConnectedAccountByIdentifierResponse | PlainMessage<GetConnectedAccountByIdentifierResponse> | undefined, b: GetConnectedAccountByIdentifierResponse | PlainMessage<GetConnectedAccountByIdentifierResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.connected_accounts.ConnectedAccount
 */
export declare class ConnectedAccount extends Message<ConnectedAccount> {
    /**
     * @generated from field: string identifier = 1;
     */
    identifier: string;
    /**
     * @generated from field: string provider = 2;
     */
    provider: string;
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectorStatus status = 3;
     */
    status: ConnectorStatus;
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectorType authorization_type = 4;
     */
    authorizationType: ConnectorType;
    /**
     * @generated from field: scalekit.v1.connected_accounts.AuthorizationDetails authorization_details = 5;
     */
    authorizationDetails?: AuthorizationDetails;
    /**
     * @generated from field: google.protobuf.Timestamp token_expires_at = 6;
     */
    tokenExpiresAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 7;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: string connector = 8;
     */
    connector: string;
    /**
     * @generated from field: google.protobuf.Timestamp last_used_at = 9;
     */
    lastUsedAt?: Timestamp;
    /**
     * @generated from field: string id = 10;
     */
    id: string;
    /**
     * @generated from field: string connection_id = 11;
     */
    connectionId: string;
    /**
     * @generated from field: google.protobuf.Struct api_config = 12;
     */
    apiConfig?: Struct;
    constructor(data?: PartialMessage<ConnectedAccount>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.ConnectedAccount";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ConnectedAccount;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ConnectedAccount;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ConnectedAccount;
    static equals(a: ConnectedAccount | PlainMessage<ConnectedAccount> | undefined, b: ConnectedAccount | PlainMessage<ConnectedAccount> | undefined): boolean;
}
/**
 * Payload for creating a new connected account - only authorization details required
 *
 * @generated from message scalekit.v1.connected_accounts.CreateConnectedAccount
 */
export declare class CreateConnectedAccount extends Message<CreateConnectedAccount> {
    /**
     * @generated from field: scalekit.v1.connected_accounts.AuthorizationDetails authorization_details = 5;
     */
    authorizationDetails?: AuthorizationDetails;
    /**
     * @generated from field: google.protobuf.Struct api_config = 11;
     */
    apiConfig?: Struct;
    constructor(data?: PartialMessage<CreateConnectedAccount>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.CreateConnectedAccount";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateConnectedAccount;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateConnectedAccount;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateConnectedAccount;
    static equals(a: CreateConnectedAccount | PlainMessage<CreateConnectedAccount> | undefined, b: CreateConnectedAccount | PlainMessage<CreateConnectedAccount> | undefined): boolean;
}
/**
 * Payload for updating an existing connected account - all fields optional
 *
 * @generated from message scalekit.v1.connected_accounts.UpdateConnectedAccount
 */
export declare class UpdateConnectedAccount extends Message<UpdateConnectedAccount> {
    /**
     * @generated from field: scalekit.v1.connected_accounts.AuthorizationDetails authorization_details = 5;
     */
    authorizationDetails?: AuthorizationDetails;
    /**
     * @generated from field: google.protobuf.Struct api_config = 10;
     */
    apiConfig?: Struct;
    constructor(data?: PartialMessage<UpdateConnectedAccount>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.UpdateConnectedAccount";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateConnectedAccount;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateConnectedAccount;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateConnectedAccount;
    static equals(a: UpdateConnectedAccount | PlainMessage<UpdateConnectedAccount> | undefined, b: UpdateConnectedAccount | PlainMessage<UpdateConnectedAccount> | undefined): boolean;
}
/**
 * Connected account summary for list operations - excludes sensitive authorization details
 *
 * @generated from message scalekit.v1.connected_accounts.ConnectedAccountForList
 */
export declare class ConnectedAccountForList extends Message<ConnectedAccountForList> {
    /**
     * @generated from field: string identifier = 1;
     */
    identifier: string;
    /**
     * @generated from field: string provider = 2;
     */
    provider: string;
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectorStatus status = 3;
     */
    status: ConnectorStatus;
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectorType authorization_type = 4;
     */
    authorizationType: ConnectorType;
    /**
     * @generated from field: google.protobuf.Timestamp token_expires_at = 6;
     */
    tokenExpiresAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 7;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: string connector = 8;
     */
    connector: string;
    /**
     * @generated from field: google.protobuf.Timestamp last_used_at = 9;
     */
    lastUsedAt?: Timestamp;
    /**
     * @generated from field: string id = 10;
     */
    id: string;
    /**
     * @generated from field: string connection_id = 11;
     */
    connectionId: string;
    constructor(data?: PartialMessage<ConnectedAccountForList>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.ConnectedAccountForList";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ConnectedAccountForList;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ConnectedAccountForList;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ConnectedAccountForList;
    static equals(a: ConnectedAccountForList | PlainMessage<ConnectedAccountForList> | undefined, b: ConnectedAccountForList | PlainMessage<ConnectedAccountForList> | undefined): boolean;
}
/**
 * Authentication credentials container supporting multiple auth types
 *
 * @generated from message scalekit.v1.connected_accounts.AuthorizationDetails
 */
export declare class AuthorizationDetails extends Message<AuthorizationDetails> {
    /**
     * @generated from oneof scalekit.v1.connected_accounts.AuthorizationDetails.details
     */
    details: {
        /**
         * OAuth 2.0 credentials
         *
         * @generated from field: scalekit.v1.connected_accounts.OauthToken oauth_token = 1;
         */
        value: OauthToken;
        case: "oauthToken";
    } | {
        /**
         * Static authentication credentials
         *
         * @generated from field: scalekit.v1.connected_accounts.StaticAuth static_auth = 2;
         */
        value: StaticAuth;
        case: "staticAuth";
    } | {
        case: undefined;
        value?: undefined;
    };
    constructor(data?: PartialMessage<AuthorizationDetails>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.AuthorizationDetails";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AuthorizationDetails;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AuthorizationDetails;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AuthorizationDetails;
    static equals(a: AuthorizationDetails | PlainMessage<AuthorizationDetails> | undefined, b: AuthorizationDetails | PlainMessage<AuthorizationDetails> | undefined): boolean;
}
/**
 * OAuth 2.0 access and refresh tokens with scopes
 *
 * @generated from message scalekit.v1.connected_accounts.OauthToken
 */
export declare class OauthToken extends Message<OauthToken> {
    /**
     * @generated from field: string access_token = 1;
     */
    accessToken: string;
    /**
     * @generated from field: string refresh_token = 2;
     */
    refreshToken: string;
    /**
     * @generated from field: repeated string scopes = 3;
     */
    scopes: string[];
    /**
     * @generated from field: string domain = 4;
     */
    domain: string;
    constructor(data?: PartialMessage<OauthToken>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.OauthToken";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OauthToken;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OauthToken;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OauthToken;
    static equals(a: OauthToken | PlainMessage<OauthToken> | undefined, b: OauthToken | PlainMessage<OauthToken> | undefined): boolean;
}
/**
 * Static authentication credentials for API keys, bearer tokens, or basic auth
 *
 * @generated from message scalekit.v1.connected_accounts.StaticAuth
 */
export declare class StaticAuth extends Message<StaticAuth> {
    /**
     * @generated from field: google.protobuf.Struct details = 1;
     */
    details?: Struct;
    constructor(data?: PartialMessage<StaticAuth>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.connected_accounts.StaticAuth";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): StaticAuth;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): StaticAuth;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): StaticAuth;
    static equals(a: StaticAuth | PlainMessage<StaticAuth> | undefined, b: StaticAuth | PlainMessage<StaticAuth> | undefined): boolean;
}
