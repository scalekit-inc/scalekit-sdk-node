import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Duration, EmptySchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { Domain } from "../domains/domains_pb";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/connections/connections.proto.
 */
export declare const file_scalekit_v1_connections_connections: GenFile;
/**
 * @generated from message scalekit.v1.connections.AssignDomainsToConnectionRequest
 */
export type AssignDomainsToConnectionRequest = Message<"scalekit.v1.connections.AssignDomainsToConnectionRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.AssignDomainsToConnectionRequest.
 * Use `create(AssignDomainsToConnectionRequestSchema)` to create a new message.
 */
export declare const AssignDomainsToConnectionRequestSchema: GenMessage<AssignDomainsToConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.AssignDomainsToConnectionResponse
 */
export type AssignDomainsToConnectionResponse = Message<"scalekit.v1.connections.AssignDomainsToConnectionResponse"> & {
    /**
     * @generated from field: scalekit.v1.connections.Connection connection = 1;
     */
    connection?: Connection;
};
/**
 * Describes the message scalekit.v1.connections.AssignDomainsToConnectionResponse.
 * Use `create(AssignDomainsToConnectionResponseSchema)` to create a new message.
 */
export declare const AssignDomainsToConnectionResponseSchema: GenMessage<AssignDomainsToConnectionResponse>;
/**
 * @generated from message scalekit.v1.connections.GetProvidersRequest
 */
export type GetProvidersRequest = Message<"scalekit.v1.connections.GetProvidersRequest"> & {};
/**
 * Describes the message scalekit.v1.connections.GetProvidersRequest.
 * Use `create(GetProvidersRequestSchema)` to create a new message.
 */
export declare const GetProvidersRequestSchema: GenMessage<GetProvidersRequest>;
/**
 * @generated from message scalekit.v1.connections.GetProvidersResponse
 */
export type GetProvidersResponse = Message<"scalekit.v1.connections.GetProvidersResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.connections.Provider providers = 1;
     */
    providers: Provider[];
};
/**
 * Describes the message scalekit.v1.connections.GetProvidersResponse.
 * Use `create(GetProvidersResponseSchema)` to create a new message.
 */
export declare const GetProvidersResponseSchema: GenMessage<GetProvidersResponse>;
/**
 * @generated from message scalekit.v1.connections.Provider
 */
export type Provider = Message<"scalekit.v1.connections.Provider"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.Provider.
 * Use `create(ProviderSchema)` to create a new message.
 */
export declare const ProviderSchema: GenMessage<Provider>;
/**
 * @generated from message scalekit.v1.connections.CreateEnvironmentConnectionRequest
 */
export type CreateEnvironmentConnectionRequest = Message<"scalekit.v1.connections.CreateEnvironmentConnectionRequest"> & {
    /**
     * @generated from field: scalekit.v1.connections.CreateConnection connection = 1;
     */
    connection?: CreateConnection;
    /**
     * @generated from field: optional scalekit.v1.connections.Flags flags = 2;
     */
    flags?: Flags;
};
/**
 * Describes the message scalekit.v1.connections.CreateEnvironmentConnectionRequest.
 * Use `create(CreateEnvironmentConnectionRequestSchema)` to create a new message.
 */
export declare const CreateEnvironmentConnectionRequestSchema: GenMessage<CreateEnvironmentConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.CreateConnectionRequest
 */
export type CreateConnectionRequest = Message<"scalekit.v1.connections.CreateConnectionRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.connections.CreateConnection connection = 3;
     */
    connection?: CreateConnection;
};
/**
 * Describes the message scalekit.v1.connections.CreateConnectionRequest.
 * Use `create(CreateConnectionRequestSchema)` to create a new message.
 */
export declare const CreateConnectionRequestSchema: GenMessage<CreateConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.CreateConnection
 */
export type CreateConnection = Message<"scalekit.v1.connections.CreateConnection"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.CreateConnection.
 * Use `create(CreateConnectionSchema)` to create a new message.
 */
export declare const CreateConnectionSchema: GenMessage<CreateConnection>;
/**
 * @generated from message scalekit.v1.connections.Connection
 */
export type Connection = Message<"scalekit.v1.connections.Connection"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.Connection.
 * Use `create(ConnectionSchema)` to create a new message.
 */
export declare const ConnectionSchema: GenMessage<Connection>;
/**
 * @generated from message scalekit.v1.connections.CreateConnectionResponse
 */
export type CreateConnectionResponse = Message<"scalekit.v1.connections.CreateConnectionResponse"> & {
    /**
     * @generated from field: scalekit.v1.connections.Connection connection = 1;
     */
    connection?: Connection;
};
/**
 * Describes the message scalekit.v1.connections.CreateConnectionResponse.
 * Use `create(CreateConnectionResponseSchema)` to create a new message.
 */
export declare const CreateConnectionResponseSchema: GenMessage<CreateConnectionResponse>;
/**
 * @generated from message scalekit.v1.connections.UpdateEnvironmentConnectionRequest
 */
export type UpdateEnvironmentConnectionRequest = Message<"scalekit.v1.connections.UpdateEnvironmentConnectionRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: scalekit.v1.connections.UpdateConnection connection = 3;
     */
    connection?: UpdateConnection;
};
/**
 * Describes the message scalekit.v1.connections.UpdateEnvironmentConnectionRequest.
 * Use `create(UpdateEnvironmentConnectionRequestSchema)` to create a new message.
 */
export declare const UpdateEnvironmentConnectionRequestSchema: GenMessage<UpdateEnvironmentConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.UpdateConnectionRequest
 */
export type UpdateConnectionRequest = Message<"scalekit.v1.connections.UpdateConnectionRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.UpdateConnectionRequest.
 * Use `create(UpdateConnectionRequestSchema)` to create a new message.
 */
export declare const UpdateConnectionRequestSchema: GenMessage<UpdateConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.UpdateConnection
 */
export type UpdateConnection = Message<"scalekit.v1.connections.UpdateConnection"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.UpdateConnection.
 * Use `create(UpdateConnectionSchema)` to create a new message.
 */
export declare const UpdateConnectionSchema: GenMessage<UpdateConnection>;
/**
 * @generated from message scalekit.v1.connections.UpdateConnectionResponse
 */
export type UpdateConnectionResponse = Message<"scalekit.v1.connections.UpdateConnectionResponse"> & {
    /**
     * @generated from field: scalekit.v1.connections.Connection connection = 1;
     */
    connection?: Connection;
};
/**
 * Describes the message scalekit.v1.connections.UpdateConnectionResponse.
 * Use `create(UpdateConnectionResponseSchema)` to create a new message.
 */
export declare const UpdateConnectionResponseSchema: GenMessage<UpdateConnectionResponse>;
/**
 * @generated from message scalekit.v1.connections.DeleteEnvironmentConnectionRequest
 */
export type DeleteEnvironmentConnectionRequest = Message<"scalekit.v1.connections.DeleteEnvironmentConnectionRequest"> & {
    /**
     * @generated from field: string connection_id = 3;
     */
    connectionId: string;
};
/**
 * Describes the message scalekit.v1.connections.DeleteEnvironmentConnectionRequest.
 * Use `create(DeleteEnvironmentConnectionRequestSchema)` to create a new message.
 */
export declare const DeleteEnvironmentConnectionRequestSchema: GenMessage<DeleteEnvironmentConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.DeleteConnectionRequest
 */
export type DeleteConnectionRequest = Message<"scalekit.v1.connections.DeleteConnectionRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.connections.DeleteConnectionRequest.
 * Use `create(DeleteConnectionRequestSchema)` to create a new message.
 */
export declare const DeleteConnectionRequestSchema: GenMessage<DeleteConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.GetEnvironmentConnectionRequest
 */
export type GetEnvironmentConnectionRequest = Message<"scalekit.v1.connections.GetEnvironmentConnectionRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
};
/**
 * Describes the message scalekit.v1.connections.GetEnvironmentConnectionRequest.
 * Use `create(GetEnvironmentConnectionRequestSchema)` to create a new message.
 */
export declare const GetEnvironmentConnectionRequestSchema: GenMessage<GetEnvironmentConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.GetConnectionRequest
 */
export type GetConnectionRequest = Message<"scalekit.v1.connections.GetConnectionRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.connections.GetConnectionRequest.
 * Use `create(GetConnectionRequestSchema)` to create a new message.
 */
export declare const GetConnectionRequestSchema: GenMessage<GetConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.GetConnectionResponse
 */
export type GetConnectionResponse = Message<"scalekit.v1.connections.GetConnectionResponse"> & {
    /**
     * @generated from field: scalekit.v1.connections.Connection connection = 1;
     */
    connection?: Connection;
};
/**
 * Describes the message scalekit.v1.connections.GetConnectionResponse.
 * Use `create(GetConnectionResponseSchema)` to create a new message.
 */
export declare const GetConnectionResponseSchema: GenMessage<GetConnectionResponse>;
/**
 * @generated from message scalekit.v1.connections.ListConnectionsRequest
 */
export type ListConnectionsRequest = Message<"scalekit.v1.connections.ListConnectionsRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.ListConnectionsRequest.
 * Use `create(ListConnectionsRequestSchema)` to create a new message.
 */
export declare const ListConnectionsRequestSchema: GenMessage<ListConnectionsRequest>;
/**
 * @generated from message scalekit.v1.connections.ListConnectionsResponse
 */
export type ListConnectionsResponse = Message<"scalekit.v1.connections.ListConnectionsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.connections.ListConnection connections = 1;
     */
    connections: ListConnection[];
};
/**
 * Describes the message scalekit.v1.connections.ListConnectionsResponse.
 * Use `create(ListConnectionsResponseSchema)` to create a new message.
 */
export declare const ListConnectionsResponseSchema: GenMessage<ListConnectionsResponse>;
/**
 * @generated from message scalekit.v1.connections.ListConnection
 */
export type ListConnection = Message<"scalekit.v1.connections.ListConnection"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.ListConnection.
 * Use `create(ListConnectionSchema)` to create a new message.
 */
export declare const ListConnectionSchema: GenMessage<ListConnection>;
/**
 * @generated from message scalekit.v1.connections.ListOrganizationConnectionsRequest
 */
export type ListOrganizationConnectionsRequest = Message<"scalekit.v1.connections.ListOrganizationConnectionsRequest"> & {
    /**
     * @generated from field: uint32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.connections.ListOrganizationConnectionsRequest.
 * Use `create(ListOrganizationConnectionsRequestSchema)` to create a new message.
 */
export declare const ListOrganizationConnectionsRequestSchema: GenMessage<ListOrganizationConnectionsRequest>;
/**
 * @generated from message scalekit.v1.connections.ListOrganizationConnectionsResponse
 */
export type ListOrganizationConnectionsResponse = Message<"scalekit.v1.connections.ListOrganizationConnectionsResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.ListOrganizationConnectionsResponse.
 * Use `create(ListOrganizationConnectionsResponseSchema)` to create a new message.
 */
export declare const ListOrganizationConnectionsResponseSchema: GenMessage<ListOrganizationConnectionsResponse>;
/**
 * @generated from message scalekit.v1.connections.SearchOrganizationConnectionsRequest
 */
export type SearchOrganizationConnectionsRequest = Message<"scalekit.v1.connections.SearchOrganizationConnectionsRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.SearchOrganizationConnectionsRequest.
 * Use `create(SearchOrganizationConnectionsRequestSchema)` to create a new message.
 */
export declare const SearchOrganizationConnectionsRequestSchema: GenMessage<SearchOrganizationConnectionsRequest>;
/**
 * @generated from message scalekit.v1.connections.SearchOrganizationConnectionsResponse
 */
export type SearchOrganizationConnectionsResponse = Message<"scalekit.v1.connections.SearchOrganizationConnectionsResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.SearchOrganizationConnectionsResponse.
 * Use `create(SearchOrganizationConnectionsResponseSchema)` to create a new message.
 */
export declare const SearchOrganizationConnectionsResponseSchema: GenMessage<SearchOrganizationConnectionsResponse>;
/**
 * @generated from message scalekit.v1.connections.ToggleEnvironmentConnectionRequest
 */
export type ToggleEnvironmentConnectionRequest = Message<"scalekit.v1.connections.ToggleEnvironmentConnectionRequest"> & {
    /**
     * @generated from field: string connection_id = 2;
     */
    connectionId: string;
};
/**
 * Describes the message scalekit.v1.connections.ToggleEnvironmentConnectionRequest.
 * Use `create(ToggleEnvironmentConnectionRequestSchema)` to create a new message.
 */
export declare const ToggleEnvironmentConnectionRequestSchema: GenMessage<ToggleEnvironmentConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.ToggleConnectionRequest
 */
export type ToggleConnectionRequest = Message<"scalekit.v1.connections.ToggleConnectionRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string id = 3;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.connections.ToggleConnectionRequest.
 * Use `create(ToggleConnectionRequestSchema)` to create a new message.
 */
export declare const ToggleConnectionRequestSchema: GenMessage<ToggleConnectionRequest>;
/**
 * @generated from message scalekit.v1.connections.ToggleConnectionResponse
 */
export type ToggleConnectionResponse = Message<"scalekit.v1.connections.ToggleConnectionResponse"> & {
    /**
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * @generated from field: optional string error_message = 2;
     */
    errorMessage?: string;
};
/**
 * Describes the message scalekit.v1.connections.ToggleConnectionResponse.
 * Use `create(ToggleConnectionResponseSchema)` to create a new message.
 */
export declare const ToggleConnectionResponseSchema: GenMessage<ToggleConnectionResponse>;
/**
 * @generated from message scalekit.v1.connections.OIDCConnectionConfig
 */
export type OIDCConnectionConfig = Message<"scalekit.v1.connections.OIDCConnectionConfig"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.OIDCConnectionConfig.
 * Use `create(OIDCConnectionConfigSchema)` to create a new message.
 */
export declare const OIDCConnectionConfigSchema: GenMessage<OIDCConnectionConfig>;
/**
 * @generated from message scalekit.v1.connections.OAuthConnectionConfig
 */
export type OAuthConnectionConfig = Message<"scalekit.v1.connections.OAuthConnectionConfig"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.OAuthConnectionConfig.
 * Use `create(OAuthConnectionConfigSchema)` to create a new message.
 */
export declare const OAuthConnectionConfigSchema: GenMessage<OAuthConnectionConfig>;
/**
 * @generated from message scalekit.v1.connections.PasswordLessConfig
 */
export type PasswordLessConfig = Message<"scalekit.v1.connections.PasswordLessConfig"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.PasswordLessConfig.
 * Use `create(PasswordLessConfigSchema)` to create a new message.
 */
export declare const PasswordLessConfigSchema: GenMessage<PasswordLessConfig>;
/**
 * @generated from message scalekit.v1.connections.StaticAuthConfig
 */
export type StaticAuthConfig = Message<"scalekit.v1.connections.StaticAuthConfig"> & {
    /**
     * @generated from field: google.protobuf.Struct static_config = 1;
     */
    staticConfig?: JsonObject;
};
/**
 * Describes the message scalekit.v1.connections.StaticAuthConfig.
 * Use `create(StaticAuthConfigSchema)` to create a new message.
 */
export declare const StaticAuthConfigSchema: GenMessage<StaticAuthConfig>;
/**
 * WebAuthConfiguration defines WebAuthn (passkeys) configuration limited to RP and Attestation
 *
 * @generated from message scalekit.v1.connections.WebAuthConfiguration
 */
export type WebAuthConfiguration = Message<"scalekit.v1.connections.WebAuthConfiguration"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.WebAuthConfiguration.
 * Use `create(WebAuthConfigurationSchema)` to create a new message.
 */
export declare const WebAuthConfigurationSchema: GenMessage<WebAuthConfiguration>;
/**
 * Rp contains relying party identifiers and origins
 *
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Rp
 */
export type WebAuthConfiguration_Rp = Message<"scalekit.v1.connections.WebAuthConfiguration.Rp"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.WebAuthConfiguration.Rp.
 * Use `create(WebAuthConfiguration_RpSchema)` to create a new message.
 */
export declare const WebAuthConfiguration_RpSchema: GenMessage<WebAuthConfiguration_Rp>;
/**
 * Attestation preferences for registration
 *
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Attestation
 */
export type WebAuthConfiguration_Attestation = Message<"scalekit.v1.connections.WebAuthConfiguration.Attestation"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.WebAuthConfiguration.Attestation.
 * Use `create(WebAuthConfiguration_AttestationSchema)` to create a new message.
 */
export declare const WebAuthConfiguration_AttestationSchema: GenMessage<WebAuthConfiguration_Attestation>;
/**
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Authenticators
 */
export type WebAuthConfiguration_Authenticators = Message<"scalekit.v1.connections.WebAuthConfiguration.Authenticators"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.WebAuthConfiguration.Authenticators.
 * Use `create(WebAuthConfiguration_AuthenticatorsSchema)` to create a new message.
 */
export declare const WebAuthConfiguration_AuthenticatorsSchema: GenMessage<WebAuthConfiguration_Authenticators>;
/**
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.AuthenticatorSelection
 */
export type WebAuthConfiguration_AuthenticatorSelection = Message<"scalekit.v1.connections.WebAuthConfiguration.AuthenticatorSelection"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.WebAuthConfiguration.AuthenticatorSelection.
 * Use `create(WebAuthConfiguration_AuthenticatorSelectionSchema)` to create a new message.
 */
export declare const WebAuthConfiguration_AuthenticatorSelectionSchema: GenMessage<WebAuthConfiguration_AuthenticatorSelection>;
/**
 * @generated from message scalekit.v1.connections.WebAuthConfiguration.Timeout
 */
export type WebAuthConfiguration_Timeout = Message<"scalekit.v1.connections.WebAuthConfiguration.Timeout"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.WebAuthConfiguration.Timeout.
 * Use `create(WebAuthConfiguration_TimeoutSchema)` to create a new message.
 */
export declare const WebAuthConfiguration_TimeoutSchema: GenMessage<WebAuthConfiguration_Timeout>;
/**
 * @generated from message scalekit.v1.connections.SAMLConnectionConfigRequest
 */
export type SAMLConnectionConfigRequest = Message<"scalekit.v1.connections.SAMLConnectionConfigRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.SAMLConnectionConfigRequest.
 * Use `create(SAMLConnectionConfigRequestSchema)` to create a new message.
 */
export declare const SAMLConnectionConfigRequestSchema: GenMessage<SAMLConnectionConfigRequest>;
/**
 * @generated from message scalekit.v1.connections.SAMLConnectionConfigResponse
 */
export type SAMLConnectionConfigResponse = Message<"scalekit.v1.connections.SAMLConnectionConfigResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.SAMLConnectionConfigResponse.
 * Use `create(SAMLConnectionConfigResponseSchema)` to create a new message.
 */
export declare const SAMLConnectionConfigResponseSchema: GenMessage<SAMLConnectionConfigResponse>;
/**
 * @generated from message scalekit.v1.connections.IDPCertificate
 */
export type IDPCertificate = Message<"scalekit.v1.connections.IDPCertificate"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.IDPCertificate.
 * Use `create(IDPCertificateSchema)` to create a new message.
 */
export declare const IDPCertificateSchema: GenMessage<IDPCertificate>;
/**
 * @generated from message scalekit.v1.connections.GetOIDCMetadataRequest
 */
export type GetOIDCMetadataRequest = Message<"scalekit.v1.connections.GetOIDCMetadataRequest"> & {
    /**
     * @generated from field: scalekit.v1.connections.OIDCMetadataRequest metadata = 1;
     */
    metadata?: OIDCMetadataRequest;
};
/**
 * Describes the message scalekit.v1.connections.GetOIDCMetadataRequest.
 * Use `create(GetOIDCMetadataRequestSchema)` to create a new message.
 */
export declare const GetOIDCMetadataRequestSchema: GenMessage<GetOIDCMetadataRequest>;
/**
 * @generated from message scalekit.v1.connections.OIDCMetadataRequest
 */
export type OIDCMetadataRequest = Message<"scalekit.v1.connections.OIDCMetadataRequest"> & {
    /**
     * @generated from field: string issuer = 1;
     */
    issuer: string;
};
/**
 * Describes the message scalekit.v1.connections.OIDCMetadataRequest.
 * Use `create(OIDCMetadataRequestSchema)` to create a new message.
 */
export declare const OIDCMetadataRequestSchema: GenMessage<OIDCMetadataRequest>;
/**
 * @generated from message scalekit.v1.connections.GetOIDCMetadataResponse
 */
export type GetOIDCMetadataResponse = Message<"scalekit.v1.connections.GetOIDCMetadataResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.GetOIDCMetadataResponse.
 * Use `create(GetOIDCMetadataResponseSchema)` to create a new message.
 */
export declare const GetOIDCMetadataResponseSchema: GenMessage<GetOIDCMetadataResponse>;
/**
 * @generated from message scalekit.v1.connections.GetSAMLMetadataRequest
 */
export type GetSAMLMetadataRequest = Message<"scalekit.v1.connections.GetSAMLMetadataRequest"> & {
    /**
     * @generated from field: scalekit.v1.connections.SAMLMetadataRequest metadata = 1;
     */
    metadata?: SAMLMetadataRequest;
};
/**
 * Describes the message scalekit.v1.connections.GetSAMLMetadataRequest.
 * Use `create(GetSAMLMetadataRequestSchema)` to create a new message.
 */
export declare const GetSAMLMetadataRequestSchema: GenMessage<GetSAMLMetadataRequest>;
/**
 * @generated from message scalekit.v1.connections.SAMLMetadataRequest
 */
export type SAMLMetadataRequest = Message<"scalekit.v1.connections.SAMLMetadataRequest"> & {
    /**
     * @generated from field: string metadata_url = 1;
     */
    metadataUrl: string;
};
/**
 * Describes the message scalekit.v1.connections.SAMLMetadataRequest.
 * Use `create(SAMLMetadataRequestSchema)` to create a new message.
 */
export declare const SAMLMetadataRequestSchema: GenMessage<SAMLMetadataRequest>;
/**
 * @generated from message scalekit.v1.connections.GetSAMLMetadataResponse
 */
export type GetSAMLMetadataResponse = Message<"scalekit.v1.connections.GetSAMLMetadataResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.GetSAMLMetadataResponse.
 * Use `create(GetSAMLMetadataResponseSchema)` to create a new message.
 */
export declare const GetSAMLMetadataResponseSchema: GenMessage<GetSAMLMetadataResponse>;
/**
 * @generated from message scalekit.v1.connections.GetSAMLCertificateDetailsRequest
 */
export type GetSAMLCertificateDetailsRequest = Message<"scalekit.v1.connections.GetSAMLCertificateDetailsRequest"> & {
    /**
     * @generated from field: scalekit.v1.connections.SAMLCertificateRequest certificate = 1;
     */
    certificate?: SAMLCertificateRequest;
};
/**
 * Describes the message scalekit.v1.connections.GetSAMLCertificateDetailsRequest.
 * Use `create(GetSAMLCertificateDetailsRequestSchema)` to create a new message.
 */
export declare const GetSAMLCertificateDetailsRequestSchema: GenMessage<GetSAMLCertificateDetailsRequest>;
/**
 * @generated from message scalekit.v1.connections.SAMLCertificateRequest
 */
export type SAMLCertificateRequest = Message<"scalekit.v1.connections.SAMLCertificateRequest"> & {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
};
/**
 * Describes the message scalekit.v1.connections.SAMLCertificateRequest.
 * Use `create(SAMLCertificateRequestSchema)` to create a new message.
 */
export declare const SAMLCertificateRequestSchema: GenMessage<SAMLCertificateRequest>;
/**
 * @generated from message scalekit.v1.connections.GetSAMLCertificateDetailsResponse
 */
export type GetSAMLCertificateDetailsResponse = Message<"scalekit.v1.connections.GetSAMLCertificateDetailsResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.GetSAMLCertificateDetailsResponse.
 * Use `create(GetSAMLCertificateDetailsResponseSchema)` to create a new message.
 */
export declare const GetSAMLCertificateDetailsResponseSchema: GenMessage<GetSAMLCertificateDetailsResponse>;
/**
 * @generated from message scalekit.v1.connections.GetConnectionTestResultRequest
 */
export type GetConnectionTestResultRequest = Message<"scalekit.v1.connections.GetConnectionTestResultRequest"> & {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string test_request_id = 2;
     */
    testRequestId: string;
};
/**
 * Describes the message scalekit.v1.connections.GetConnectionTestResultRequest.
 * Use `create(GetConnectionTestResultRequestSchema)` to create a new message.
 */
export declare const GetConnectionTestResultRequestSchema: GenMessage<GetConnectionTestResultRequest>;
/**
 * @generated from message scalekit.v1.connections.GetConnectionTestResultResponse
 */
export type GetConnectionTestResultResponse = Message<"scalekit.v1.connections.GetConnectionTestResultResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.GetConnectionTestResultResponse.
 * Use `create(GetConnectionTestResultResponseSchema)` to create a new message.
 */
export declare const GetConnectionTestResultResponseSchema: GenMessage<GetConnectionTestResultResponse>;
/**
 * @generated from message scalekit.v1.connections.PasswordConnectionConfig
 */
export type PasswordConnectionConfig = Message<"scalekit.v1.connections.PasswordConnectionConfig"> & {};
/**
 * Describes the message scalekit.v1.connections.PasswordConnectionConfig.
 * Use `create(PasswordConnectionConfigSchema)` to create a new message.
 */
export declare const PasswordConnectionConfigSchema: GenMessage<PasswordConnectionConfig>;
/**
 * @generated from message scalekit.v1.connections.Flags
 */
export type Flags = Message<"scalekit.v1.connections.Flags"> & {
    /**
     * @generated from field: bool is_login = 1;
     */
    isLogin: boolean;
    /**
     * @generated from field: bool is_app = 2;
     */
    isApp: boolean;
};
/**
 * Describes the message scalekit.v1.connections.Flags.
 * Use `create(FlagsSchema)` to create a new message.
 */
export declare const FlagsSchema: GenMessage<Flags>;
/**
 * @generated from message scalekit.v1.connections.ListAppConnectionsRequest
 */
export type ListAppConnectionsRequest = Message<"scalekit.v1.connections.ListAppConnectionsRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.ListAppConnectionsRequest.
 * Use `create(ListAppConnectionsRequestSchema)` to create a new message.
 */
export declare const ListAppConnectionsRequestSchema: GenMessage<ListAppConnectionsRequest>;
/**
 * @generated from message scalekit.v1.connections.ListAppConnectionsResponse
 */
export type ListAppConnectionsResponse = Message<"scalekit.v1.connections.ListAppConnectionsResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.connections.ListAppConnectionsResponse.
 * Use `create(ListAppConnectionsResponseSchema)` to create a new message.
 */
export declare const ListAppConnectionsResponseSchema: GenMessage<ListAppConnectionsResponse>;
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
 * Describes the enum scalekit.v1.connections.CodeChallengeType.
 */
export declare const CodeChallengeTypeSchema: GenEnum<CodeChallengeType>;
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
 * Describes the enum scalekit.v1.connections.ConfigurationType.
 */
export declare const ConfigurationTypeSchema: GenEnum<ConfigurationType>;
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
 * Describes the enum scalekit.v1.connections.NameIdFormat.
 */
export declare const NameIdFormatSchema: GenEnum<NameIdFormat>;
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
 * Describes the enum scalekit.v1.connections.PasswordlessType.
 */
export declare const PasswordlessTypeSchema: GenEnum<PasswordlessType>;
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
 * Describes the enum scalekit.v1.connections.TestResultStatus.
 */
export declare const TestResultStatusSchema: GenEnum<TestResultStatus>;
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
 * Describes the enum scalekit.v1.connections.SAMLSigningOptions.
 */
export declare const SAMLSigningOptionsSchema: GenEnum<SAMLSigningOptions>;
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
 * Describes the enum scalekit.v1.connections.RequestBinding.
 */
export declare const RequestBindingSchema: GenEnum<RequestBinding>;
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
 * Describes the enum scalekit.v1.connections.TokenAuthType.
 */
export declare const TokenAuthTypeSchema: GenEnum<TokenAuthType>;
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
 * Describes the enum scalekit.v1.connections.OIDCScope.
 */
export declare const OIDCScopeSchema: GenEnum<OIDCScope>;
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
 * Describes the enum scalekit.v1.connections.ConnectionType.
 */
export declare const ConnectionTypeSchema: GenEnum<ConnectionType>;
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
 * Describes the enum scalekit.v1.connections.ConnectionStatus.
 */
export declare const ConnectionStatusSchema: GenEnum<ConnectionStatus>;
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
 * Describes the enum scalekit.v1.connections.ConnectionProvider.
 */
export declare const ConnectionProviderSchema: GenEnum<ConnectionProvider>;
/**
 * @generated from service scalekit.v1.connections.ConnectionService
 */
export declare const ConnectionService: GenService<{
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.CreateEnvironmentConnection
     */
    createEnvironmentConnection: {
        methodKind: "unary";
        input: typeof CreateEnvironmentConnectionRequestSchema;
        output: typeof CreateConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.CreateConnection
     */
    createConnection: {
        methodKind: "unary";
        input: typeof CreateConnectionRequestSchema;
        output: typeof CreateConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.AssignDomainsToConnection
     */
    assignDomainsToConnection: {
        methodKind: "unary";
        input: typeof AssignDomainsToConnectionRequestSchema;
        output: typeof AssignDomainsToConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.GetEnvironmentConnection
     */
    getEnvironmentConnection: {
        methodKind: "unary";
        input: typeof GetEnvironmentConnectionRequestSchema;
        output: typeof GetConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.GetConnection
     */
    getConnection: {
        methodKind: "unary";
        input: typeof GetConnectionRequestSchema;
        output: typeof GetConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.ListConnections
     */
    listConnections: {
        methodKind: "unary";
        input: typeof ListConnectionsRequestSchema;
        output: typeof ListConnectionsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.ListOrganizationConnections
     */
    listOrganizationConnections: {
        methodKind: "unary";
        input: typeof ListOrganizationConnectionsRequestSchema;
        output: typeof ListOrganizationConnectionsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.SearchOrganizationConnections
     */
    searchOrganizationConnections: {
        methodKind: "unary";
        input: typeof SearchOrganizationConnectionsRequestSchema;
        output: typeof SearchOrganizationConnectionsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.UpdateEnvironmentConnection
     */
    updateEnvironmentConnection: {
        methodKind: "unary";
        input: typeof UpdateEnvironmentConnectionRequestSchema;
        output: typeof UpdateConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.UpdateConnection
     */
    updateConnection: {
        methodKind: "unary";
        input: typeof UpdateConnectionRequestSchema;
        output: typeof UpdateConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.DeleteEnvironmentConnection
     */
    deleteEnvironmentConnection: {
        methodKind: "unary";
        input: typeof DeleteEnvironmentConnectionRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.DeleteConnection
     */
    deleteConnection: {
        methodKind: "unary";
        input: typeof DeleteConnectionRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.EnableEnvironmentConnection
     */
    enableEnvironmentConnection: {
        methodKind: "unary";
        input: typeof ToggleEnvironmentConnectionRequestSchema;
        output: typeof ToggleConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.EnableConnection
     */
    enableConnection: {
        methodKind: "unary";
        input: typeof ToggleConnectionRequestSchema;
        output: typeof ToggleConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.DisableEnvironmentConnection
     */
    disableEnvironmentConnection: {
        methodKind: "unary";
        input: typeof ToggleEnvironmentConnectionRequestSchema;
        output: typeof ToggleConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.DisableConnection
     */
    disableConnection: {
        methodKind: "unary";
        input: typeof ToggleConnectionRequestSchema;
        output: typeof ToggleConnectionResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.GetConnectionTestResult
     */
    getConnectionTestResult: {
        methodKind: "unary";
        input: typeof GetConnectionTestResultRequestSchema;
        output: typeof GetConnectionTestResultResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.ListAppConnections
     */
    listAppConnections: {
        methodKind: "unary";
        input: typeof ListAppConnectionsRequestSchema;
        output: typeof ListAppConnectionsResponseSchema;
    };
}>;
