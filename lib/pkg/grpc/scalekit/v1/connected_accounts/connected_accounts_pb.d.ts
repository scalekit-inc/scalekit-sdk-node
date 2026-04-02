import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/connected_accounts/connected_accounts.proto.
 */
export declare const file_scalekit_v1_connected_accounts_connected_accounts: GenFile;
/**
 * @generated from message scalekit.v1.connected_accounts.ListConnectedAccountsRequest
 */
export type ListConnectedAccountsRequest = Message<"scalekit.v1.connected_accounts.ListConnectedAccountsRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.ListConnectedAccountsRequest.
 * Use `create(ListConnectedAccountsRequestSchema)` to create a new message.
 */
export declare const ListConnectedAccountsRequestSchema: GenMessage<ListConnectedAccountsRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.ListConnectedAccountsResponse
 */
export type ListConnectedAccountsResponse = Message<"scalekit.v1.connected_accounts.ListConnectedAccountsResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.ListConnectedAccountsResponse.
 * Use `create(ListConnectedAccountsResponseSchema)` to create a new message.
 */
export declare const ListConnectedAccountsResponseSchema: GenMessage<ListConnectedAccountsResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.SearchConnectedAccountsRequest
 */
export type SearchConnectedAccountsRequest = Message<"scalekit.v1.connected_accounts.SearchConnectedAccountsRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.SearchConnectedAccountsRequest.
 * Use `create(SearchConnectedAccountsRequestSchema)` to create a new message.
 */
export declare const SearchConnectedAccountsRequestSchema: GenMessage<SearchConnectedAccountsRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.SearchConnectedAccountsResponse
 */
export type SearchConnectedAccountsResponse = Message<"scalekit.v1.connected_accounts.SearchConnectedAccountsResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.SearchConnectedAccountsResponse.
 * Use `create(SearchConnectedAccountsResponseSchema)` to create a new message.
 */
export declare const SearchConnectedAccountsResponseSchema: GenMessage<SearchConnectedAccountsResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.CreateConnectedAccountRequest
 */
export type CreateConnectedAccountRequest = Message<"scalekit.v1.connected_accounts.CreateConnectedAccountRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.CreateConnectedAccountRequest.
 * Use `create(CreateConnectedAccountRequestSchema)` to create a new message.
 */
export declare const CreateConnectedAccountRequestSchema: GenMessage<CreateConnectedAccountRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.CreateConnectedAccountResponse
 */
export type CreateConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.CreateConnectedAccountResponse"> & {
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
     */
    connectedAccount?: ConnectedAccount;
};
/**
 * Describes the message scalekit.v1.connected_accounts.CreateConnectedAccountResponse.
 * Use `create(CreateConnectedAccountResponseSchema)` to create a new message.
 */
export declare const CreateConnectedAccountResponseSchema: GenMessage<CreateConnectedAccountResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.UpdateConnectedAccountRequest
 */
export type UpdateConnectedAccountRequest = Message<"scalekit.v1.connected_accounts.UpdateConnectedAccountRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.UpdateConnectedAccountRequest.
 * Use `create(UpdateConnectedAccountRequestSchema)` to create a new message.
 */
export declare const UpdateConnectedAccountRequestSchema: GenMessage<UpdateConnectedAccountRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.UpdateConnectedAccountResponse
 */
export type UpdateConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.UpdateConnectedAccountResponse"> & {
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
     */
    connectedAccount?: ConnectedAccount;
};
/**
 * Describes the message scalekit.v1.connected_accounts.UpdateConnectedAccountResponse.
 * Use `create(UpdateConnectedAccountResponseSchema)` to create a new message.
 */
export declare const UpdateConnectedAccountResponseSchema: GenMessage<UpdateConnectedAccountResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.DeleteConnectedAccountRequest
 */
export type DeleteConnectedAccountRequest = Message<"scalekit.v1.connected_accounts.DeleteConnectedAccountRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.DeleteConnectedAccountRequest.
 * Use `create(DeleteConnectedAccountRequestSchema)` to create a new message.
 */
export declare const DeleteConnectedAccountRequestSchema: GenMessage<DeleteConnectedAccountRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.DeleteConnectedAccountResponse
 */
export type DeleteConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.DeleteConnectedAccountResponse"> & {};
/**
 * Describes the message scalekit.v1.connected_accounts.DeleteConnectedAccountResponse.
 * Use `create(DeleteConnectedAccountResponseSchema)` to create a new message.
 */
export declare const DeleteConnectedAccountResponseSchema: GenMessage<DeleteConnectedAccountResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountRequest
 */
export type GetMagicLinkForConnectedAccountRequest = Message<"scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountRequest"> & {
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
    /**
     * @generated from field: optional string state = 7;
     */
    state?: string;
    /**
     * @generated from field: optional string user_verify_url = 8;
     */
    userVerifyUrl?: string;
};
/**
 * Describes the message scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountRequest.
 * Use `create(GetMagicLinkForConnectedAccountRequestSchema)` to create a new message.
 */
export declare const GetMagicLinkForConnectedAccountRequestSchema: GenMessage<GetMagicLinkForConnectedAccountRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountResponse
 */
export type GetMagicLinkForConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountResponse"> & {
    /**
     * @generated from field: string link = 1;
     */
    link: string;
    /**
     * @generated from field: google.protobuf.Timestamp expiry = 2;
     */
    expiry?: Timestamp;
};
/**
 * Describes the message scalekit.v1.connected_accounts.GetMagicLinkForConnectedAccountResponse.
 * Use `create(GetMagicLinkForConnectedAccountResponseSchema)` to create a new message.
 */
export declare const GetMagicLinkForConnectedAccountResponseSchema: GenMessage<GetMagicLinkForConnectedAccountResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.VerifyConnectedAccountUserRequest
 */
export type VerifyConnectedAccountUserRequest = Message<"scalekit.v1.connected_accounts.VerifyConnectedAccountUserRequest"> & {
    /**
     * @generated from field: string auth_request_id = 1;
     */
    authRequestId: string;
    /**
     * @generated from field: string identifier = 2;
     */
    identifier: string;
};
/**
 * Describes the message scalekit.v1.connected_accounts.VerifyConnectedAccountUserRequest.
 * Use `create(VerifyConnectedAccountUserRequestSchema)` to create a new message.
 */
export declare const VerifyConnectedAccountUserRequestSchema: GenMessage<VerifyConnectedAccountUserRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.VerifyConnectedAccountUserResponse
 */
export type VerifyConnectedAccountUserResponse = Message<"scalekit.v1.connected_accounts.VerifyConnectedAccountUserResponse"> & {
    /**
     * @generated from field: string post_user_verify_redirect_url = 1;
     */
    postUserVerifyRedirectUrl: string;
};
/**
 * Describes the message scalekit.v1.connected_accounts.VerifyConnectedAccountUserResponse.
 * Use `create(VerifyConnectedAccountUserResponseSchema)` to create a new message.
 */
export declare const VerifyConnectedAccountUserResponseSchema: GenMessage<VerifyConnectedAccountUserResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierRequest
 */
export type GetConnectedAccountByIdentifierRequest = Message<"scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierRequest.
 * Use `create(GetConnectedAccountByIdentifierRequestSchema)` to create a new message.
 */
export declare const GetConnectedAccountByIdentifierRequestSchema: GenMessage<GetConnectedAccountByIdentifierRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierResponse
 */
export type GetConnectedAccountByIdentifierResponse = Message<"scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierResponse"> & {
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
     */
    connectedAccount?: ConnectedAccount;
};
/**
 * Describes the message scalekit.v1.connected_accounts.GetConnectedAccountByIdentifierResponse.
 * Use `create(GetConnectedAccountByIdentifierResponseSchema)` to create a new message.
 */
export declare const GetConnectedAccountByIdentifierResponseSchema: GenMessage<GetConnectedAccountByIdentifierResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.ConnectedAccount
 */
export type ConnectedAccount = Message<"scalekit.v1.connected_accounts.ConnectedAccount"> & {
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
    apiConfig?: JsonObject;
};
/**
 * Describes the message scalekit.v1.connected_accounts.ConnectedAccount.
 * Use `create(ConnectedAccountSchema)` to create a new message.
 */
export declare const ConnectedAccountSchema: GenMessage<ConnectedAccount>;
/**
 * Payload for creating a new connected account - authorization details are optional
 *
 * @generated from message scalekit.v1.connected_accounts.CreateConnectedAccount
 */
export type CreateConnectedAccount = Message<"scalekit.v1.connected_accounts.CreateConnectedAccount"> & {
    /**
     * @generated from field: scalekit.v1.connected_accounts.AuthorizationDetails authorization_details = 5;
     */
    authorizationDetails?: AuthorizationDetails;
    /**
     * @generated from field: google.protobuf.Struct api_config = 11;
     */
    apiConfig?: JsonObject;
};
/**
 * Describes the message scalekit.v1.connected_accounts.CreateConnectedAccount.
 * Use `create(CreateConnectedAccountSchema)` to create a new message.
 */
export declare const CreateConnectedAccountSchema: GenMessage<CreateConnectedAccount>;
/**
 * Payload for updating an existing connected account - all fields optional
 *
 * @generated from message scalekit.v1.connected_accounts.UpdateConnectedAccount
 */
export type UpdateConnectedAccount = Message<"scalekit.v1.connected_accounts.UpdateConnectedAccount"> & {
    /**
     * @generated from field: scalekit.v1.connected_accounts.AuthorizationDetails authorization_details = 5;
     */
    authorizationDetails?: AuthorizationDetails;
    /**
     * @generated from field: google.protobuf.Struct api_config = 10;
     */
    apiConfig?: JsonObject;
};
/**
 * Describes the message scalekit.v1.connected_accounts.UpdateConnectedAccount.
 * Use `create(UpdateConnectedAccountSchema)` to create a new message.
 */
export declare const UpdateConnectedAccountSchema: GenMessage<UpdateConnectedAccount>;
/**
 * Connected account summary for list operations - excludes sensitive authorization details
 *
 * @generated from message scalekit.v1.connected_accounts.ConnectedAccountForList
 */
export type ConnectedAccountForList = Message<"scalekit.v1.connected_accounts.ConnectedAccountForList"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.ConnectedAccountForList.
 * Use `create(ConnectedAccountForListSchema)` to create a new message.
 */
export declare const ConnectedAccountForListSchema: GenMessage<ConnectedAccountForList>;
/**
 * Authentication credentials container supporting multiple auth types
 *
 * @generated from message scalekit.v1.connected_accounts.AuthorizationDetails
 */
export type AuthorizationDetails = Message<"scalekit.v1.connected_accounts.AuthorizationDetails"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.AuthorizationDetails.
 * Use `create(AuthorizationDetailsSchema)` to create a new message.
 */
export declare const AuthorizationDetailsSchema: GenMessage<AuthorizationDetails>;
/**
 * OAuth 2.0 access and refresh tokens with scopes
 *
 * @generated from message scalekit.v1.connected_accounts.OauthToken
 */
export type OauthToken = Message<"scalekit.v1.connected_accounts.OauthToken"> & {
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
};
/**
 * Describes the message scalekit.v1.connected_accounts.OauthToken.
 * Use `create(OauthTokenSchema)` to create a new message.
 */
export declare const OauthTokenSchema: GenMessage<OauthToken>;
/**
 * Static authentication credentials for API keys, bearer tokens, or basic auth
 *
 * @generated from message scalekit.v1.connected_accounts.StaticAuth
 */
export type StaticAuth = Message<"scalekit.v1.connected_accounts.StaticAuth"> & {
    /**
     * @generated from field: google.protobuf.Struct details = 1;
     */
    details?: JsonObject;
};
/**
 * Describes the message scalekit.v1.connected_accounts.StaticAuth.
 * Use `create(StaticAuthSchema)` to create a new message.
 */
export declare const StaticAuthSchema: GenMessage<StaticAuth>;
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
     * Account awaiting user authorization (re-auth initiated)
     *
     * @generated from enum value: PENDING_AUTH = 3;
     */
    PENDING_AUTH = 3,
    /**
     * OAuth complete; awaiting user identity verification before activation
     *
     * @generated from enum value: PENDING_VERIFICATION = 4;
     */
    PENDING_VERIFICATION = 4
}
/**
 * Describes the enum scalekit.v1.connected_accounts.ConnectorStatus.
 */
export declare const ConnectorStatusSchema: GenEnum<ConnectorStatus>;
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
 * Describes the enum scalekit.v1.connected_accounts.ConnectorType.
 */
export declare const ConnectorTypeSchema: GenEnum<ConnectorType>;
/**
 * @generated from service scalekit.v1.connected_accounts.ConnectedAccountService
 */
export declare const ConnectedAccountService: GenService<{
    /**
     * List Connected Accounts
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.ListConnectedAccounts
     */
    listConnectedAccounts: {
        methodKind: "unary";
        input: typeof ListConnectedAccountsRequestSchema;
        output: typeof ListConnectedAccountsResponseSchema;
    };
    /**
     * Search Connected Accounts
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.SearchConnectedAccounts
     */
    searchConnectedAccounts: {
        methodKind: "unary";
        input: typeof SearchConnectedAccountsRequestSchema;
        output: typeof SearchConnectedAccountsResponseSchema;
    };
    /**
     * Create Connected Account
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.CreateConnectedAccount
     */
    createConnectedAccount: {
        methodKind: "unary";
        input: typeof CreateConnectedAccountRequestSchema;
        output: typeof CreateConnectedAccountResponseSchema;
    };
    /**
     * Update Connected Account
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.UpdateConnectedAccount
     */
    updateConnectedAccount: {
        methodKind: "unary";
        input: typeof UpdateConnectedAccountRequestSchema;
        output: typeof UpdateConnectedAccountResponseSchema;
    };
    /**
     * Delete Connected Account
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.DeleteConnectedAccount
     */
    deleteConnectedAccount: {
        methodKind: "unary";
        input: typeof DeleteConnectedAccountRequestSchema;
        output: typeof DeleteConnectedAccountResponseSchema;
    };
    /**
     * Generate Magic Link for Account Connection
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.GetMagicLinkForConnectedAccount
     */
    getMagicLinkForConnectedAccount: {
        methodKind: "unary";
        input: typeof GetMagicLinkForConnectedAccountRequestSchema;
        output: typeof GetMagicLinkForConnectedAccountResponseSchema;
    };
    /**
     * Get Connected Account Authentication Details
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.GetConnectedAccountAuth
     */
    getConnectedAccountAuth: {
        methodKind: "unary";
        input: typeof GetConnectedAccountByIdentifierRequestSchema;
        output: typeof GetConnectedAccountByIdentifierResponseSchema;
    };
    /**
     * Verify connected account user after OAuth callback
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.VerifyConnectedAccountUser
     */
    verifyConnectedAccountUser: {
        methodKind: "unary";
        input: typeof VerifyConnectedAccountUserRequestSchema;
        output: typeof VerifyConnectedAccountUserResponseSchema;
    };
}>;
