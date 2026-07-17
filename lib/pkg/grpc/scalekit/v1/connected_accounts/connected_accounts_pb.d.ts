import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/connected_accounts/connected_accounts.proto.
 */
export declare const file_scalekit_v1_connected_accounts_connected_accounts: GenFile;
/**
 * @generated from message scalekit.v1.connected_accounts.ListMyAppConnectionsRequest
 */
export type ListMyAppConnectionsRequest = Message<"scalekit.v1.connected_accounts.ListMyAppConnectionsRequest"> & {};
/**
 * Describes the message scalekit.v1.connected_accounts.ListMyAppConnectionsRequest.
 * Use `create(ListMyAppConnectionsRequestSchema)` to create a new message.
 */
export declare const ListMyAppConnectionsRequestSchema: GenMessage<ListMyAppConnectionsRequest>;
/**
 * Per-connection row mirroring Gateway's connectionEntry shape.
 *
 * @generated from message scalekit.v1.connected_accounts.MyAppConnectionEntry
 */
export type MyAppConnectionEntry = Message<"scalekit.v1.connected_accounts.MyAppConnectionEntry"> & {
    /**
     * connection_id: con_…
     *
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string provider = 2;
     */
    provider: string;
    /**
     * connection_name: the admin-assigned key_id (e.g. "slack-prod").
     *
     * @generated from field: string connection_name = 3;
     */
    connectionName: string;
    /**
     * @generated from field: bool enabled = 4;
     */
    enabled: boolean;
    /**
     * user_status: CONNECTED / NOT_CONNECTED / EXPIRED / PENDING_AUTH /
     * PENDING_VERIFICATION / DISCONNECTED. Matches the strings the
     * Gateway list_connections meta-tool returns.
     *
     * @generated from field: string user_status = 5;
     */
    userStatus: string;
    /**
     * connected_account_id is empty when user_status == NOT_CONNECTED.
     *
     * @generated from field: string connected_account_id = 6;
     */
    connectedAccountId: string;
};
/**
 * Describes the message scalekit.v1.connected_accounts.MyAppConnectionEntry.
 * Use `create(MyAppConnectionEntrySchema)` to create a new message.
 */
export declare const MyAppConnectionEntrySchema: GenMessage<MyAppConnectionEntry>;
/**
 * @generated from message scalekit.v1.connected_accounts.ListMyAppConnectionsResponse
 */
export type ListMyAppConnectionsResponse = Message<"scalekit.v1.connected_accounts.ListMyAppConnectionsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.connected_accounts.MyAppConnectionEntry connections = 1;
     */
    connections: MyAppConnectionEntry[];
};
/**
 * Describes the message scalekit.v1.connected_accounts.ListMyAppConnectionsResponse.
 * Use `create(ListMyAppConnectionsResponseSchema)` to create a new message.
 */
export declare const ListMyAppConnectionsResponseSchema: GenMessage<ListMyAppConnectionsResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.DisconnectMyConnectedAccountRequest
 */
export type DisconnectMyConnectedAccountRequest = Message<"scalekit.v1.connected_accounts.DisconnectMyConnectedAccountRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.connected_accounts.DisconnectMyConnectedAccountRequest.
 * Use `create(DisconnectMyConnectedAccountRequestSchema)` to create a new message.
 */
export declare const DisconnectMyConnectedAccountRequestSchema: GenMessage<DisconnectMyConnectedAccountRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetMyConnectionMagicLinkRequest
 */
export type GetMyConnectionMagicLinkRequest = Message<"scalekit.v1.connected_accounts.GetMyConnectionMagicLinkRequest"> & {
    /**
     * @generated from field: string connection_name = 1;
     */
    connectionName: string;
};
/**
 * Describes the message scalekit.v1.connected_accounts.GetMyConnectionMagicLinkRequest.
 * Use `create(GetMyConnectionMagicLinkRequestSchema)` to create a new message.
 */
export declare const GetMyConnectionMagicLinkRequestSchema: GenMessage<GetMyConnectionMagicLinkRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetMyConnectionMagicLinkResponse
 */
export type GetMyConnectionMagicLinkResponse = Message<"scalekit.v1.connected_accounts.GetMyConnectionMagicLinkResponse"> & {
    /**
     * @generated from field: string link = 1;
     */
    link: string;
    /**
     * @generated from field: google.protobuf.Timestamp expiry = 2;
     */
    expiry?: Timestamp | undefined;
};
/**
 * Describes the message scalekit.v1.connected_accounts.GetMyConnectionMagicLinkResponse.
 * Use `create(GetMyConnectionMagicLinkResponseSchema)` to create a new message.
 */
export declare const GetMyConnectionMagicLinkResponseSchema: GenMessage<GetMyConnectionMagicLinkResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.ListConnectedAccountsRequest
 */
export type ListConnectedAccountsRequest = Message<"scalekit.v1.connected_accounts.ListConnectedAccountsRequest"> & {
    /**
     * @generated from field: optional string organization_id = 1;
     */
    organizationId?: string | undefined;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string | undefined;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string | undefined;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string | undefined;
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
    /**
     * @generated from field: repeated string connection_names = 9;
     */
    connectionNames: string[];
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
    organizationId?: string | undefined;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string | undefined;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string | undefined;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string | undefined;
    /**
     * @generated from field: scalekit.v1.connected_accounts.CreateConnectedAccount connected_account = 5;
     */
    connectedAccount?: CreateConnectedAccount | undefined;
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
    connectedAccount?: ConnectedAccount | undefined;
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
    organizationId?: string | undefined;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string | undefined;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string | undefined;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string | undefined;
    /**
     * @generated from field: optional string id = 6;
     */
    id?: string | undefined;
    /**
     * @generated from field: scalekit.v1.connected_accounts.UpdateConnectedAccount connected_account = 5;
     */
    connectedAccount?: UpdateConnectedAccount | undefined;
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
    connectedAccount?: ConnectedAccount | undefined;
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
    organizationId?: string | undefined;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string | undefined;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string | undefined;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string | undefined;
    /**
     * @generated from field: optional string id = 5;
     */
    id?: string | undefined;
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
    organizationId?: string | undefined;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string | undefined;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string | undefined;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string | undefined;
    /**
     * @generated from field: optional string id = 5;
     */
    id?: string | undefined;
    /**
     * @generated from field: optional string state = 7;
     */
    state?: string | undefined;
    /**
     * @generated from field: optional string user_verify_url = 8;
     */
    userVerifyUrl?: string | undefined;
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
    expiry?: Timestamp | undefined;
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
    organizationId?: string | undefined;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string | undefined;
    /**
     * @generated from field: optional string connector = 3;
     */
    connector?: string | undefined;
    /**
     * @generated from field: optional string identifier = 4;
     */
    identifier?: string | undefined;
    /**
     * @generated from field: optional string id = 5;
     */
    id?: string | undefined;
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
    connectedAccount?: ConnectedAccount | undefined;
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
    authorizationDetails?: AuthorizationDetails | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp token_expires_at = 6;
     */
    tokenExpiresAt?: Timestamp | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 7;
     */
    updatedAt?: Timestamp | undefined;
    /**
     * @generated from field: string connector = 8;
     */
    connector: string;
    /**
     * @generated from field: google.protobuf.Timestamp last_used_at = 9;
     */
    lastUsedAt?: Timestamp | undefined;
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
    apiConfig?: JsonObject | undefined;
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
    authorizationDetails?: AuthorizationDetails | undefined;
    /**
     * @generated from field: google.protobuf.Struct api_config = 11;
     */
    apiConfig?: JsonObject | undefined;
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
    authorizationDetails?: AuthorizationDetails | undefined;
    /**
     * @generated from field: google.protobuf.Struct api_config = 10;
     */
    apiConfig?: JsonObject | undefined;
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
    tokenExpiresAt?: Timestamp | undefined;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 7;
     */
    updatedAt?: Timestamp | undefined;
    /**
     * @generated from field: string connector = 8;
     */
    connector: string;
    /**
     * @generated from field: google.protobuf.Timestamp last_used_at = 9;
     */
    lastUsedAt?: Timestamp | undefined;
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
        /**
         * Google Domain-Wide Delegation credentials
         *
         * @generated from field: scalekit.v1.connected_accounts.GoogleDWDAuth google_dwd = 3;
         */
        value: GoogleDWDAuth;
        case: "googleDwd";
    } | {
        /**
         * Trusted IDP federated credentials (e.g. AWS STS temporary credentials)
         *
         * @generated from field: scalekit.v1.connected_accounts.TrustedIDPAuth trusted_idp = 4;
         */
        value: TrustedIDPAuth;
        case: "trustedIdp";
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
 * Google Domain-Wide Delegation authentication — used for GOOGLE_DWD connections.
 * Send only subject in requests; access_token, scopes, and token_expires_at are response-only.
 *
 * @generated from message scalekit.v1.connected_accounts.GoogleDWDAuth
 */
export type GoogleDWDAuth = Message<"scalekit.v1.connected_accounts.GoogleDWDAuth"> & {
    /**
     * @generated from field: string subject = 1;
     */
    subject: string;
    /**
     * @generated from field: string access_token = 2;
     */
    accessToken: string;
    /**
     * @generated from field: repeated string scopes = 3;
     */
    scopes: string[];
    /**
     * @generated from field: google.protobuf.Timestamp token_expires_at = 4;
     */
    tokenExpiresAt?: Timestamp | undefined;
};
/**
 * Describes the message scalekit.v1.connected_accounts.GoogleDWDAuth.
 * Use `create(GoogleDWDAuthSchema)` to create a new message.
 */
export declare const GoogleDWDAuthSchema: GenMessage<GoogleDWDAuth>;
/**
 * Trusted IDP federated authentication — used for TRUSTED_IDP connections (e.g. AWS Redshift).
 * Send only db_user in requests; cached temporary credentials are managed server-side and
 * returned only on output paths. secret_access_key and session_token are never exposed in
 * public API responses.
 *
 * @generated from message scalekit.v1.connected_accounts.TrustedIDPAuth
 */
export type TrustedIDPAuth = Message<"scalekit.v1.connected_accounts.TrustedIDPAuth"> & {
    /**
     * @generated from field: string db_user = 1;
     */
    dbUser: string;
    /**
     * @generated from field: string access_key_id = 2;
     */
    accessKeyId: string;
    /**
     * @generated from field: string secret_access_key = 3;
     */
    secretAccessKey: string;
    /**
     * @generated from field: string session_token = 4;
     */
    sessionToken: string;
    /**
     * @generated from field: google.protobuf.Timestamp expiry = 5;
     */
    expiry?: Timestamp | undefined;
};
/**
 * Describes the message scalekit.v1.connected_accounts.TrustedIDPAuth.
 * Use `create(TrustedIDPAuthSchema)` to create a new message.
 */
export declare const TrustedIDPAuthSchema: GenMessage<TrustedIDPAuth>;
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
    details?: JsonObject | undefined;
};
/**
 * Describes the message scalekit.v1.connected_accounts.StaticAuth.
 * Use `create(StaticAuthSchema)` to create a new message.
 */
export declare const StaticAuthSchema: GenMessage<StaticAuth>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetConnectedAccountRequest
 */
export type GetConnectedAccountRequest = Message<"scalekit.v1.connected_accounts.GetConnectedAccountRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.connected_accounts.GetConnectedAccountRequest.
 * Use `create(GetConnectedAccountRequestSchema)` to create a new message.
 */
export declare const GetConnectedAccountRequestSchema: GenMessage<GetConnectedAccountRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetConnectedAccountResponse
 */
export type GetConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.GetConnectedAccountResponse"> & {
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
     */
    connectedAccount?: ConnectedAccount | undefined;
};
/**
 * Describes the message scalekit.v1.connected_accounts.GetConnectedAccountResponse.
 * Use `create(GetConnectedAccountResponseSchema)` to create a new message.
 */
export declare const GetConnectedAccountResponseSchema: GenMessage<GetConnectedAccountResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.DisconnectConnectedAccountRequest
 */
export type DisconnectConnectedAccountRequest = Message<"scalekit.v1.connected_accounts.DisconnectConnectedAccountRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.connected_accounts.DisconnectConnectedAccountRequest.
 * Use `create(DisconnectConnectedAccountRequestSchema)` to create a new message.
 */
export declare const DisconnectConnectedAccountRequestSchema: GenMessage<DisconnectConnectedAccountRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.DisconnectConnectedAccountResponse
 */
export type DisconnectConnectedAccountResponse = Message<"scalekit.v1.connected_accounts.DisconnectConnectedAccountResponse"> & {
    /**
     * @generated from field: scalekit.v1.connected_accounts.ConnectedAccount connected_account = 1;
     */
    connectedAccount?: ConnectedAccount | undefined;
};
/**
 * Describes the message scalekit.v1.connected_accounts.DisconnectConnectedAccountResponse.
 * Use `create(DisconnectConnectedAccountResponseSchema)` to create a new message.
 */
export declare const DisconnectConnectedAccountResponseSchema: GenMessage<DisconnectConnectedAccountResponse>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetRedirectUrlRequest
 */
export type GetRedirectUrlRequest = Message<"scalekit.v1.connected_accounts.GetRedirectUrlRequest"> & {};
/**
 * Describes the message scalekit.v1.connected_accounts.GetRedirectUrlRequest.
 * Use `create(GetRedirectUrlRequestSchema)` to create a new message.
 */
export declare const GetRedirectUrlRequestSchema: GenMessage<GetRedirectUrlRequest>;
/**
 * @generated from message scalekit.v1.connected_accounts.GetRedirectUrlResponse
 */
export type GetRedirectUrlResponse = Message<"scalekit.v1.connected_accounts.GetRedirectUrlResponse"> & {
    /**
     * @generated from field: string redirect_url = 1;
     */
    redirectUrl: string;
};
/**
 * Describes the message scalekit.v1.connected_accounts.GetRedirectUrlResponse.
 * Use `create(GetRedirectUrlResponseSchema)` to create a new message.
 */
export declare const GetRedirectUrlResponseSchema: GenMessage<GetRedirectUrlResponse>;
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
    PENDING_VERIFICATION = 4,
    /**
     * Account has been manually disconnected
     *
     * @generated from enum value: DISCONNECTED = 5;
     */
    DISCONNECTED = 5
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
    BASIC = 6,
    /**
     * OAuth 2.0 client credentials (machine-to-machine)
     *
     * @generated from enum value: OAUTH_M2M = 7;
     */
    OAUTH_M2M = 7,
    /**
     * Trello token-based OAuth1-style browser authorization
     *
     * @generated from enum value: TRELLO_OAUTH1 = 8;
     */
    TRELLO_OAUTH1 = 8,
    /**
     * Google Domain-Wide Delegation
     *
     * @generated from enum value: GOOGLE_DWD = 9;
     */
    GOOGLE_DWD = 9,
    /**
     * Trusted Identity Provider federation (e.g. AWS STS AssumeRoleWithWebIdentity)
     *
     * @generated from enum value: TRUSTED_IDP = 10;
     */
    TRUSTED_IDP = 10,
    /**
     * SMART on FHIR (SMART App Launch) — OAuth 2.0 authorization for FHIR servers
     *
     * @generated from enum value: SMART_FHIR = 11;
     */
    SMART_FHIR = 11,
    /**
     * No authentication — connector requires no credentials (e.g. public docs MCP servers)
     *
     * @generated from enum value: NO_AUTH = 12;
     */
    NO_AUTH = 12
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
     * Get Connected Account by ID
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.GetConnectedAccount
     */
    getConnectedAccount: {
        methodKind: "unary";
        input: typeof GetConnectedAccountRequestSchema;
        output: typeof GetConnectedAccountResponseSchema;
    };
    /**
     * Disconnect a Connected Account
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.DisconnectConnectedAccount
     */
    disconnectConnectedAccount: {
        methodKind: "unary";
        input: typeof DisconnectConnectedAccountRequestSchema;
        output: typeof DisconnectConnectedAccountResponseSchema;
    };
    /**
     * Get Redirect URL for Connected Account Portal
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.GetRedirectUrl
     */
    getRedirectUrl: {
        methodKind: "unary";
        input: typeof GetRedirectUrlRequestSchema;
        output: typeof GetRedirectUrlResponseSchema;
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
     * Get Connected Account Details (without auth credentials)
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.GetConnectedAccountDetails
     */
    getConnectedAccountDetails: {
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
    /**
     * Phase 2 — SESSION_USER-authed: end-user lists every app connection
     * configured in the env joined with their own per-connection status
     * (CONNECTED / NOT_CONNECTED / EXPIRED / PENDING_AUTH / ...). Mirrors
     * the shape of Gateway's list_connections meta-tool so /ui and the
     * agent surface stay consistent. Server forces identifier from the
     * session.
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.ListMyAppConnections
     */
    listMyAppConnections: {
        methodKind: "unary";
        input: typeof ListMyAppConnectionsRequestSchema;
        output: typeof ListMyAppConnectionsResponseSchema;
    };
    /**
     * Phase 2 — SESSION_USER-authed: end-user disconnects one of their
     * own connected accounts. Ownership is enforced server-side: the
     * target CA's identifier must equal the session identifier, else
     * Forbidden.
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.DisconnectMyConnectedAccount
     */
    disconnectMyConnectedAccount: {
        methodKind: "unary";
        input: typeof DisconnectMyConnectedAccountRequestSchema;
        output: typeof DisconnectConnectedAccountResponseSchema;
    };
    /**
     * Phase 2 — SESSION_USER-authed: end-user gets a one-time magic link
     * to connect (or reconnect) a specific app connection by name. The
     * caller's identifier is resolved from the session — the request body
     * carries no identifier field so a /ui caller cannot impersonate.
     *
     * @generated from rpc scalekit.v1.connected_accounts.ConnectedAccountService.GetMyConnectionMagicLink
     */
    getMyConnectionMagicLink: {
        methodKind: "unary";
        input: typeof GetMyConnectionMagicLinkRequestSchema;
        output: typeof GetMyConnectionMagicLinkResponseSchema;
    };
}>;
