import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, FieldMask, Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/clients/clients.proto.
 */
export declare const file_scalekit_v1_clients_clients: GenFile;
/**
 * @generated from message scalekit.v1.clients.CreateResourceRequest
 */
export type CreateResourceRequest = Message<"scalekit.v1.clients.CreateResourceRequest"> & {
    /**
     * @generated from field: scalekit.v1.clients.CreateResource resource = 1;
     */
    resource?: CreateResource;
};
/**
 * Describes the message scalekit.v1.clients.CreateResourceRequest.
 * Use `create(CreateResourceRequestSchema)` to create a new message.
 */
export declare const CreateResourceRequestSchema: GenMessage<CreateResourceRequest>;
/**
 * @generated from message scalekit.v1.clients.CreateResource
 */
export type CreateResource = Message<"scalekit.v1.clients.CreateResource"> & {
    /**
     * @generated from field: scalekit.v1.clients.ResourceType resource_type = 1;
     */
    resourceType: ResourceType;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * @generated from field: string resource_uri = 4;
     */
    resourceUri: string;
    /**
     * @generated from field: int64 access_token_expiry = 5;
     */
    accessTokenExpiry: bigint;
    /**
     * @generated from field: int64 refresh_token_expiry = 6;
     */
    refreshTokenExpiry: bigint;
    /**
     * @generated from field: bool disable_dynamic_client_registration = 7;
     */
    disableDynamicClientRegistration: boolean;
    /**
     * @generated from field: string logo_uri = 8;
     */
    logoUri: string;
    /**
     * @generated from field: string provider = 9;
     */
    provider: string;
    /**
     * @generated from field: string resource_id = 10;
     */
    resourceId: string;
    /**
     * @generated from field: repeated string scopes = 11;
     */
    scopes: string[];
    /**
     * @generated from field: bool intersect_scopes_user_permission = 12;
     */
    intersectScopesUserPermission: boolean;
    /**
     *
     * string tos_uri = 10 [
     * (buf.validate.field).string = {max_len: 512},
     * (grpc.gateway.protoc_gen_openapiv2.options.openapiv2_field) = {
     * description: "Terms of Service URI for the resource"
     * example: "\"https://example.com/tos\""
     * }
     * ];
     *
     * string policy_uri = 11 [
     * (buf.validate.field).string = {max_len: 512},
     * (grpc.gateway.protoc_gen_openapiv2.options.openapiv2_field) = {
     * description: "Policy URI for the resource"
     * example: "\"https://example.com/policy\""
     * }
     * ];
     *
     * @generated from field: bool enable_cimd = 13;
     */
    enableCimd: boolean;
};
/**
 * Describes the message scalekit.v1.clients.CreateResource.
 * Use `create(CreateResourceSchema)` to create a new message.
 */
export declare const CreateResourceSchema: GenMessage<CreateResource>;
/**
 * @generated from message scalekit.v1.clients.ResourceClient
 */
export type ResourceClient = Message<"scalekit.v1.clients.ResourceClient"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: repeated string scopes = 3;
     */
    scopes: string[];
    /**
     * @generated from field: repeated string audience = 4;
     */
    audience: string[];
    /**
     * @generated from field: repeated scalekit.v1.clients.CustomClaim custom_claims = 5;
     */
    customClaims: CustomClaim[];
    /**
     * @generated from field: int64 expiry = 6;
     */
    expiry: bigint;
    /**
     * @generated from field: repeated string redirect_uris = 7;
     */
    redirectUris: string[];
};
/**
 * Describes the message scalekit.v1.clients.ResourceClient.
 * Use `create(ResourceClientSchema)` to create a new message.
 */
export declare const ResourceClientSchema: GenMessage<ResourceClient>;
/**
 * @generated from message scalekit.v1.clients.CreateResourceResponse
 */
export type CreateResourceResponse = Message<"scalekit.v1.clients.CreateResourceResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.Resource resource = 1;
     */
    resource?: Resource;
};
/**
 * Describes the message scalekit.v1.clients.CreateResourceResponse.
 * Use `create(CreateResourceResponseSchema)` to create a new message.
 */
export declare const CreateResourceResponseSchema: GenMessage<CreateResourceResponse>;
/**
 * @generated from message scalekit.v1.clients.GetResourceRequest
 */
export type GetResourceRequest = Message<"scalekit.v1.clients.GetResourceRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
};
/**
 * Describes the message scalekit.v1.clients.GetResourceRequest.
 * Use `create(GetResourceRequestSchema)` to create a new message.
 */
export declare const GetResourceRequestSchema: GenMessage<GetResourceRequest>;
/**
 * @generated from message scalekit.v1.clients.GetResourceResponse
 */
export type GetResourceResponse = Message<"scalekit.v1.clients.GetResourceResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.Resource resource = 1;
     */
    resource?: Resource;
};
/**
 * Describes the message scalekit.v1.clients.GetResourceResponse.
 * Use `create(GetResourceResponseSchema)` to create a new message.
 */
export declare const GetResourceResponseSchema: GenMessage<GetResourceResponse>;
/**
 * @generated from message scalekit.v1.clients.DeleteResourceProviderRequest
 */
export type DeleteResourceProviderRequest = Message<"scalekit.v1.clients.DeleteResourceProviderRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
};
/**
 * Describes the message scalekit.v1.clients.DeleteResourceProviderRequest.
 * Use `create(DeleteResourceProviderRequestSchema)` to create a new message.
 */
export declare const DeleteResourceProviderRequestSchema: GenMessage<DeleteResourceProviderRequest>;
/**
 * @generated from message scalekit.v1.clients.DeleteResourceRequest
 */
export type DeleteResourceRequest = Message<"scalekit.v1.clients.DeleteResourceRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
};
/**
 * Describes the message scalekit.v1.clients.DeleteResourceRequest.
 * Use `create(DeleteResourceRequestSchema)` to create a new message.
 */
export declare const DeleteResourceRequestSchema: GenMessage<DeleteResourceRequest>;
/**
 * for backward compatibility
 *
 * @generated from message scalekit.v1.clients.Application
 */
export type Application = Message<"scalekit.v1.clients.Application"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string resource_id = 3;
     */
    resourceId: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: scalekit.v1.clients.ResourceType application_type = 5;
     */
    applicationType: ResourceType;
    /**
     * @generated from field: bool disable_dynamic_client_registration = 6;
     */
    disableDynamicClientRegistration: boolean;
    /**
     * @generated from field: string logo_uri = 7;
     */
    logoUri: string;
    /**
     * @generated from field: int64 access_token_expiry = 8;
     */
    accessTokenExpiry: bigint;
    /**
     * @generated from field: int64 refresh_token_expiry = 9;
     */
    refreshTokenExpiry: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 10;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 11;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: string provider = 12;
     */
    provider: string;
};
/**
 * Describes the message scalekit.v1.clients.Application.
 * Use `create(ApplicationSchema)` to create a new message.
 */
export declare const ApplicationSchema: GenMessage<Application>;
/**
 * @generated from message scalekit.v1.clients.Resource
 */
export type Resource = Message<"scalekit.v1.clients.Resource"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string resource_uri = 3;
     */
    resourceUri: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: scalekit.v1.clients.ResourceType resource_type = 5;
     */
    resourceType: ResourceType;
    /**
     * @generated from field: bool disable_dynamic_client_registration = 6;
     */
    disableDynamicClientRegistration: boolean;
    /**
     * @generated from field: string logo_uri = 7;
     */
    logoUri: string;
    /**
     * @generated from field: int64 access_token_expiry = 8;
     */
    accessTokenExpiry: bigint;
    /**
     * @generated from field: int64 refresh_token_expiry = 9;
     */
    refreshTokenExpiry: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 10;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 11;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: string provider = 12;
     */
    provider: string;
    /**
     * @generated from field: google.protobuf.Struct protected_metadata = 13;
     */
    protectedMetadata?: JsonObject;
    /**
     * @generated from field: string protected_metadata_uri = 14;
     */
    protectedMetadataUri: string;
    /**
     * @generated from field: string resource_id = 15;
     */
    resourceId: string;
    /**
     * @generated from field: repeated scalekit.v1.clients.Scope scopes = 16;
     */
    scopes: Scope[];
    /**
     * @generated from field: scalekit.v1.clients.ResourceConnection connection_details = 17;
     */
    connectionDetails?: ResourceConnection;
    /**
     * @generated from field: bool disallow_connection_update = 18;
     */
    disallowConnectionUpdate: boolean;
    /**
     * @generated from field: bool intersect_scopes_user_permission = 19;
     */
    intersectScopesUserPermission: boolean;
    /**
     * @generated from field: bool enable_cimd = 20;
     */
    enableCimd: boolean;
};
/**
 * Describes the message scalekit.v1.clients.Resource.
 * Use `create(ResourceSchema)` to create a new message.
 */
export declare const ResourceSchema: GenMessage<Resource>;
/**
 * @generated from message scalekit.v1.clients.RegisterClientRequest
 */
export type RegisterClientRequest = Message<"scalekit.v1.clients.RegisterClientRequest"> & {
    /**
     * @generated from field: string res_id = 1;
     */
    resId: string;
    /**
     * @generated from field: scalekit.v1.clients.RegisterClient client = 2;
     */
    client?: RegisterClient;
};
/**
 * Describes the message scalekit.v1.clients.RegisterClientRequest.
 * Use `create(RegisterClientRequestSchema)` to create a new message.
 */
export declare const RegisterClientRequestSchema: GenMessage<RegisterClientRequest>;
/**
 * @generated from message scalekit.v1.clients.RegisterClient
 */
export type RegisterClient = Message<"scalekit.v1.clients.RegisterClient"> & {
    /**
     * @generated from field: string client_name = 1;
     */
    clientName: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: repeated string redirect_uris = 3;
     */
    redirectUris: string[];
    /**
     * @generated from field: string scope = 4;
     */
    scope: string;
    /**
     * @generated from field: string client_uri = 5;
     */
    clientUri: string;
    /**
     * @generated from field: string logo_uri = 6;
     */
    logoUri: string;
    /**
     * @generated from field: string tos_uri = 7;
     */
    tosUri: string;
    /**
     * @generated from field: string policy_uri = 8;
     */
    policyUri: string;
};
/**
 * Describes the message scalekit.v1.clients.RegisterClient.
 * Use `create(RegisterClientSchema)` to create a new message.
 */
export declare const RegisterClientSchema: GenMessage<RegisterClient>;
/**
 * @generated from message scalekit.v1.clients.RegisterClientResponse
 */
export type RegisterClientResponse = Message<"scalekit.v1.clients.RegisterClientResponse"> & {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * @generated from field: repeated scalekit.v1.clients.ClientSecret secrets = 2;
     */
    secrets: ClientSecret[];
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 5;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 6;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: repeated string scopes = 7;
     */
    scopes: string[];
    /**
     * @generated from field: repeated string audience = 8;
     */
    audience: string[];
    /**
     * @generated from field: repeated scalekit.v1.clients.CustomClaim custom_claims = 9;
     */
    customClaims: CustomClaim[];
    /**
     * @generated from field: int64 expiry = 10;
     */
    expiry: bigint;
    /**
     * @generated from field: string resource_id = 11;
     */
    resourceId: string;
    /**
     * @generated from field: repeated string redirect_uris = 12;
     */
    redirectUris: string[];
    /**
     * @generated from field: string client_secret = 13;
     */
    clientSecret: string;
    /**
     *  M2MClient client = 1 [(grpc.gateway.protoc_gen_openapiv2.options.openapiv2_field) = {description: "Details of the registered client"}];
     *
     * @generated from field: int32 client_secret_expires_at = 14;
     */
    clientSecretExpiresAt: number;
};
/**
 * Describes the message scalekit.v1.clients.RegisterClientResponse.
 * Use `create(RegisterClientResponseSchema)` to create a new message.
 */
export declare const RegisterClientResponseSchema: GenMessage<RegisterClientResponse>;
/**
 * @generated from message scalekit.v1.clients.ListResourcesRequest
 */
export type ListResourcesRequest = Message<"scalekit.v1.clients.ListResourcesRequest"> & {
    /**
     * @generated from field: scalekit.v1.clients.ResourceType resource_type = 1;
     */
    resourceType: ResourceType;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
    /**
     * @generated from field: uint32 page_size = 3;
     */
    pageSize: number;
};
/**
 * Describes the message scalekit.v1.clients.ListResourcesRequest.
 * Use `create(ListResourcesRequestSchema)` to create a new message.
 */
export declare const ListResourcesRequestSchema: GenMessage<ListResourcesRequest>;
/**
 * @generated from message scalekit.v1.clients.ListResourcesResponse
 */
export type ListResourcesResponse = Message<"scalekit.v1.clients.ListResourcesResponse"> & {
    /**
     * @generated from field: uint32 total_size = 1;
     */
    totalSize: number;
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
    /**
     * @generated from field: repeated scalekit.v1.clients.Resource resources = 3;
     */
    resources: Resource[];
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.clients.ListResourcesResponse.
 * Use `create(ListResourcesResponseSchema)` to create a new message.
 */
export declare const ListResourcesResponseSchema: GenMessage<ListResourcesResponse>;
/**
 * @generated from message scalekit.v1.clients.UpdateResourceRequest
 */
export type UpdateResourceRequest = Message<"scalekit.v1.clients.UpdateResourceRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
    /**
     * @generated from field: scalekit.v1.clients.UpdateResource resource = 2;
     */
    resource?: UpdateResource;
    /**
     * @generated from field: google.protobuf.FieldMask update_mask = 99;
     */
    updateMask?: FieldMask;
};
/**
 * Describes the message scalekit.v1.clients.UpdateResourceRequest.
 * Use `create(UpdateResourceRequestSchema)` to create a new message.
 */
export declare const UpdateResourceRequestSchema: GenMessage<UpdateResourceRequest>;
/**
 * @generated from message scalekit.v1.clients.UpdateResource
 */
export type UpdateResource = Message<"scalekit.v1.clients.UpdateResource"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: string resource_uri = 3;
     */
    resourceUri: string;
    /**
     * @generated from field: int64 access_token_expiry = 4;
     */
    accessTokenExpiry: bigint;
    /**
     * @generated from field: int64 refresh_token_expiry = 5;
     */
    refreshTokenExpiry: bigint;
    /**
     * @generated from field: google.protobuf.BoolValue disable_dynamic_client_registration = 6;
     */
    disableDynamicClientRegistration?: boolean;
    /**
     * @generated from field: string logo_uri = 7;
     */
    logoUri: string;
    /**
     * @generated from field: string provider = 10;
     */
    provider: string;
    /**
     * @generated from field: string resource_id = 11;
     */
    resourceId: string;
    /**
     * @generated from field: repeated string scopes = 12;
     */
    scopes: string[];
    /**
     * @generated from oneof scalekit.v1.clients.UpdateResource.settings
     */
    settings: {
        /**
         * @generated from field: scalekit.v1.clients.ResourceCustomConnectionSettings custom_connection_settings = 13;
         */
        value: ResourceCustomConnectionSettings;
        case: "customConnectionSettings";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: google.protobuf.BoolValue intersect_scopes_user_permission = 14;
     */
    intersectScopesUserPermission?: boolean;
    /**
     * @generated from field: google.protobuf.BoolValue enable_cimd = 15;
     */
    enableCimd?: boolean;
};
/**
 * Describes the message scalekit.v1.clients.UpdateResource.
 * Use `create(UpdateResourceSchema)` to create a new message.
 */
export declare const UpdateResourceSchema: GenMessage<UpdateResource>;
/**
 * @generated from message scalekit.v1.clients.UpdateResourceResponse
 */
export type UpdateResourceResponse = Message<"scalekit.v1.clients.UpdateResourceResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.Resource resource = 1;
     */
    resource?: Resource;
};
/**
 * Describes the message scalekit.v1.clients.UpdateResourceResponse.
 * Use `create(UpdateResourceResponseSchema)` to create a new message.
 */
export declare const UpdateResourceResponseSchema: GenMessage<UpdateResourceResponse>;
/**
 * @generated from message scalekit.v1.clients.CreateResourceClientRequest
 */
export type CreateResourceClientRequest = Message<"scalekit.v1.clients.CreateResourceClientRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
    /**
     * @generated from field: scalekit.v1.clients.ResourceClient client = 2;
     */
    client?: ResourceClient;
};
/**
 * Describes the message scalekit.v1.clients.CreateResourceClientRequest.
 * Use `create(CreateResourceClientRequestSchema)` to create a new message.
 */
export declare const CreateResourceClientRequestSchema: GenMessage<CreateResourceClientRequest>;
/**
 * @generated from message scalekit.v1.clients.CreateResourceClientResponse
 */
export type CreateResourceClientResponse = Message<"scalekit.v1.clients.CreateResourceClientResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.M2MClient client = 1;
     */
    client?: M2MClient;
    /**
     * @generated from field: string plain_secret = 2;
     */
    plainSecret: string;
};
/**
 * Describes the message scalekit.v1.clients.CreateResourceClientResponse.
 * Use `create(CreateResourceClientResponseSchema)` to create a new message.
 */
export declare const CreateResourceClientResponseSchema: GenMessage<CreateResourceClientResponse>;
/**
 * @generated from message scalekit.v1.clients.UpdateResourceClientRequest
 */
export type UpdateResourceClientRequest = Message<"scalekit.v1.clients.UpdateResourceClientRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
    /**
     * @generated from field: string client_id = 2;
     */
    clientId: string;
    /**
     * @generated from field: scalekit.v1.clients.ResourceClient client = 3;
     */
    client?: ResourceClient;
    /**
     * @generated from field: google.protobuf.FieldMask update_mask = 4;
     */
    updateMask?: FieldMask;
};
/**
 * Describes the message scalekit.v1.clients.UpdateResourceClientRequest.
 * Use `create(UpdateResourceClientRequestSchema)` to create a new message.
 */
export declare const UpdateResourceClientRequestSchema: GenMessage<UpdateResourceClientRequest>;
/**
 * @generated from message scalekit.v1.clients.UpdateResourceClientResponse
 */
export type UpdateResourceClientResponse = Message<"scalekit.v1.clients.UpdateResourceClientResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.M2MClient client = 1;
     */
    client?: M2MClient;
};
/**
 * Describes the message scalekit.v1.clients.UpdateResourceClientResponse.
 * Use `create(UpdateResourceClientResponseSchema)` to create a new message.
 */
export declare const UpdateResourceClientResponseSchema: GenMessage<UpdateResourceClientResponse>;
/**
 * @generated from message scalekit.v1.clients.GetResourceClientRequest
 */
export type GetResourceClientRequest = Message<"scalekit.v1.clients.GetResourceClientRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
    /**
     * @generated from field: string client_id = 2;
     */
    clientId: string;
};
/**
 * Describes the message scalekit.v1.clients.GetResourceClientRequest.
 * Use `create(GetResourceClientRequestSchema)` to create a new message.
 */
export declare const GetResourceClientRequestSchema: GenMessage<GetResourceClientRequest>;
/**
 * @generated from message scalekit.v1.clients.GetResourceClientResponse
 */
export type GetResourceClientResponse = Message<"scalekit.v1.clients.GetResourceClientResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.M2MClient client = 2;
     */
    client?: M2MClient;
    /**
     * @generated from field: repeated scalekit.v1.clients.ConsentedUser consented_users = 3;
     */
    consentedUsers: ConsentedUser[];
};
/**
 * Describes the message scalekit.v1.clients.GetResourceClientResponse.
 * Use `create(GetResourceClientResponseSchema)` to create a new message.
 */
export declare const GetResourceClientResponseSchema: GenMessage<GetResourceClientResponse>;
/**
 * @generated from message scalekit.v1.clients.ConsentedUser
 */
export type ConsentedUser = Message<"scalekit.v1.clients.ConsentedUser"> & {
    /**
     * @generated from field: string consent_id = 1;
     */
    consentId: string;
    /**
     * @generated from field: string external_user_id = 2;
     */
    externalUserId: string;
    /**
     * @generated from field: repeated string scopes = 3;
     */
    scopes: string[];
};
/**
 * Describes the message scalekit.v1.clients.ConsentedUser.
 * Use `create(ConsentedUserSchema)` to create a new message.
 */
export declare const ConsentedUserSchema: GenMessage<ConsentedUser>;
/**
 * @generated from message scalekit.v1.clients.ListResourceUserConsentsRequest
 */
export type ListResourceUserConsentsRequest = Message<"scalekit.v1.clients.ListResourceUserConsentsRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
    /**
     * @generated from field: string search = 2;
     */
    search: string;
    /**
     * @generated from field: uint32 page_size = 3;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 4;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.clients.ListResourceUserConsentsRequest.
 * Use `create(ListResourceUserConsentsRequestSchema)` to create a new message.
 */
export declare const ListResourceUserConsentsRequestSchema: GenMessage<ListResourceUserConsentsRequest>;
/**
 * @generated from message scalekit.v1.clients.ListResourceUserConsentsResponse
 */
export type ListResourceUserConsentsResponse = Message<"scalekit.v1.clients.ListResourceUserConsentsResponse"> & {
    /**
     * @generated from field: uint32 total_size = 1;
     */
    totalSize: number;
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
    /**
     * @generated from field: repeated scalekit.v1.clients.ResourceUserConsent consents = 3;
     */
    consents: ResourceUserConsent[];
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.clients.ListResourceUserConsentsResponse.
 * Use `create(ListResourceUserConsentsResponseSchema)` to create a new message.
 */
export declare const ListResourceUserConsentsResponseSchema: GenMessage<ListResourceUserConsentsResponse>;
/**
 * @generated from message scalekit.v1.clients.ResourceUserConsent
 */
export type ResourceUserConsent = Message<"scalekit.v1.clients.ResourceUserConsent"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string external_user_id = 2;
     */
    externalUserId: string;
    /**
     * @generated from field: string client_id = 3;
     */
    clientId: string;
    /**
     * @generated from field: string client_name = 4;
     */
    clientName: string;
    /**
     * @generated from field: repeated string scopes = 5;
     */
    scopes: string[];
    /**
     * @generated from field: google.protobuf.Timestamp granted_at = 6;
     */
    grantedAt?: Timestamp;
};
/**
 * Describes the message scalekit.v1.clients.ResourceUserConsent.
 * Use `create(ResourceUserConsentSchema)` to create a new message.
 */
export declare const ResourceUserConsentSchema: GenMessage<ResourceUserConsent>;
/**
 * @generated from message scalekit.v1.clients.ListResourceClientsRequest
 */
export type ListResourceClientsRequest = Message<"scalekit.v1.clients.ListResourceClientsRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
};
/**
 * Describes the message scalekit.v1.clients.ListResourceClientsRequest.
 * Use `create(ListResourceClientsRequestSchema)` to create a new message.
 */
export declare const ListResourceClientsRequestSchema: GenMessage<ListResourceClientsRequest>;
/**
 * @generated from message scalekit.v1.clients.ListResourceClientsResponse
 */
export type ListResourceClientsResponse = Message<"scalekit.v1.clients.ListResourceClientsResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.clients.M2MClient clients = 2;
     */
    clients: M2MClient[];
    /**
     * @generated from field: int32 total_dcr_clients = 3;
     */
    totalDcrClients: number;
    /**
     * @generated from field: int32 total_static_clients = 4;
     */
    totalStaticClients: number;
};
/**
 * Describes the message scalekit.v1.clients.ListResourceClientsResponse.
 * Use `create(ListResourceClientsResponseSchema)` to create a new message.
 */
export declare const ListResourceClientsResponseSchema: GenMessage<ListResourceClientsResponse>;
/**
 * @generated from message scalekit.v1.clients.DeleteResourceClientRequest
 */
export type DeleteResourceClientRequest = Message<"scalekit.v1.clients.DeleteResourceClientRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
    /**
     * @generated from field: string client_id = 2;
     */
    clientId: string;
};
/**
 * Describes the message scalekit.v1.clients.DeleteResourceClientRequest.
 * Use `create(DeleteResourceClientRequestSchema)` to create a new message.
 */
export declare const DeleteResourceClientRequestSchema: GenMessage<DeleteResourceClientRequest>;
/**
 * @generated from message scalekit.v1.clients.DeleteResourceClientResponse
 */
export type DeleteResourceClientResponse = Message<"scalekit.v1.clients.DeleteResourceClientResponse"> & {};
/**
 * Describes the message scalekit.v1.clients.DeleteResourceClientResponse.
 * Use `create(DeleteResourceClientResponseSchema)` to create a new message.
 */
export declare const DeleteResourceClientResponseSchema: GenMessage<DeleteResourceClientResponse>;
/**
 * @generated from message scalekit.v1.clients.CreateOrganizationClientRequest
 */
export type CreateOrganizationClientRequest = Message<"scalekit.v1.clients.CreateOrganizationClientRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.clients.OrganizationClient client = 2;
     */
    client?: OrganizationClient;
};
/**
 * Describes the message scalekit.v1.clients.CreateOrganizationClientRequest.
 * Use `create(CreateOrganizationClientRequestSchema)` to create a new message.
 */
export declare const CreateOrganizationClientRequestSchema: GenMessage<CreateOrganizationClientRequest>;
/**
 * @generated from message scalekit.v1.clients.OrganizationClient
 */
export type OrganizationClient = Message<"scalekit.v1.clients.OrganizationClient"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: repeated string scopes = 3;
     */
    scopes: string[];
    /**
     * @generated from field: repeated string audience = 4;
     */
    audience: string[];
    /**
     * @generated from field: repeated scalekit.v1.clients.CustomClaim custom_claims = 5;
     */
    customClaims: CustomClaim[];
    /**
     * @generated from field: int64 expiry = 6;
     */
    expiry: bigint;
};
/**
 * Describes the message scalekit.v1.clients.OrganizationClient.
 * Use `create(OrganizationClientSchema)` to create a new message.
 */
export declare const OrganizationClientSchema: GenMessage<OrganizationClient>;
/**
 * @generated from message scalekit.v1.clients.CreateOrganizationClientResponse
 */
export type CreateOrganizationClientResponse = Message<"scalekit.v1.clients.CreateOrganizationClientResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.M2MClient client = 1;
     */
    client?: M2MClient;
    /**
     * @generated from field: string plain_secret = 2;
     */
    plainSecret: string;
};
/**
 * Describes the message scalekit.v1.clients.CreateOrganizationClientResponse.
 * Use `create(CreateOrganizationClientResponseSchema)` to create a new message.
 */
export declare const CreateOrganizationClientResponseSchema: GenMessage<CreateOrganizationClientResponse>;
/**
 * @generated from message scalekit.v1.clients.UpdateOrganizationClientRequest
 */
export type UpdateOrganizationClientRequest = Message<"scalekit.v1.clients.UpdateOrganizationClientRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string client_id = 2;
     */
    clientId: string;
    /**
     * @generated from field: scalekit.v1.clients.OrganizationClient client = 3;
     */
    client?: OrganizationClient;
};
/**
 * Describes the message scalekit.v1.clients.UpdateOrganizationClientRequest.
 * Use `create(UpdateOrganizationClientRequestSchema)` to create a new message.
 */
export declare const UpdateOrganizationClientRequestSchema: GenMessage<UpdateOrganizationClientRequest>;
/**
 * @generated from message scalekit.v1.clients.UpdateOrganizationClientResponse
 */
export type UpdateOrganizationClientResponse = Message<"scalekit.v1.clients.UpdateOrganizationClientResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.M2MClient client = 1;
     */
    client?: M2MClient;
};
/**
 * Describes the message scalekit.v1.clients.UpdateOrganizationClientResponse.
 * Use `create(UpdateOrganizationClientResponseSchema)` to create a new message.
 */
export declare const UpdateOrganizationClientResponseSchema: GenMessage<UpdateOrganizationClientResponse>;
/**
 * @generated from message scalekit.v1.clients.M2MClient
 */
export type M2MClient = Message<"scalekit.v1.clients.M2MClient"> & {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * @generated from field: repeated scalekit.v1.clients.ClientSecret secrets = 2;
     */
    secrets: ClientSecret[];
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: string organization_id = 5;
     */
    organizationId: string;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 6;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 7;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: repeated string scopes = 8;
     */
    scopes: string[];
    /**
     * @generated from field: repeated string audience = 9;
     */
    audience: string[];
    /**
     * @generated from field: repeated scalekit.v1.clients.CustomClaim custom_claims = 10;
     */
    customClaims: CustomClaim[];
    /**
     * @generated from field: int64 expiry = 11;
     */
    expiry: bigint;
    /**
     * @generated from field: string resource_id = 12;
     */
    resourceId: string;
    /**
     * @generated from field: repeated string redirect_uris = 13;
     */
    redirectUris: string[];
    /**
     * @generated from field: bool is_dcr = 15;
     */
    isDcr: boolean;
    /**
     * @generated from field: bool is_cimd = 16;
     */
    isCimd: boolean;
    /**
     * @generated from field: string metadata_uri = 17;
     */
    metadataUri: string;
};
/**
 * Describes the message scalekit.v1.clients.M2MClient.
 * Use `create(M2MClientSchema)` to create a new message.
 */
export declare const M2MClientSchema: GenMessage<M2MClient>;
/**
 * @generated from message scalekit.v1.clients.GetOrganizationClientRequest
 */
export type GetOrganizationClientRequest = Message<"scalekit.v1.clients.GetOrganizationClientRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string client_id = 2;
     */
    clientId: string;
};
/**
 * Describes the message scalekit.v1.clients.GetOrganizationClientRequest.
 * Use `create(GetOrganizationClientRequestSchema)` to create a new message.
 */
export declare const GetOrganizationClientRequestSchema: GenMessage<GetOrganizationClientRequest>;
/**
 * @generated from message scalekit.v1.clients.GetOrganizationClientResponse
 */
export type GetOrganizationClientResponse = Message<"scalekit.v1.clients.GetOrganizationClientResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.M2MClient client = 1;
     */
    client?: M2MClient;
};
/**
 * Describes the message scalekit.v1.clients.GetOrganizationClientResponse.
 * Use `create(GetOrganizationClientResponseSchema)` to create a new message.
 */
export declare const GetOrganizationClientResponseSchema: GenMessage<GetOrganizationClientResponse>;
/**
 * @generated from message scalekit.v1.clients.CustomClaim
 */
export type CustomClaim = Message<"scalekit.v1.clients.CustomClaim"> & {
    /**
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string value = 2;
     */
    value: string;
};
/**
 * Describes the message scalekit.v1.clients.CustomClaim.
 * Use `create(CustomClaimSchema)` to create a new message.
 */
export declare const CustomClaimSchema: GenMessage<CustomClaim>;
/**
 * @generated from message scalekit.v1.clients.CreateOrganizationClientSecretRequest
 */
export type CreateOrganizationClientSecretRequest = Message<"scalekit.v1.clients.CreateOrganizationClientSecretRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string client_id = 2;
     */
    clientId: string;
};
/**
 * Describes the message scalekit.v1.clients.CreateOrganizationClientSecretRequest.
 * Use `create(CreateOrganizationClientSecretRequestSchema)` to create a new message.
 */
export declare const CreateOrganizationClientSecretRequestSchema: GenMessage<CreateOrganizationClientSecretRequest>;
/**
 * @generated from message scalekit.v1.clients.CreateOrganizationClientSecretResponse
 */
export type CreateOrganizationClientSecretResponse = Message<"scalekit.v1.clients.CreateOrganizationClientSecretResponse"> & {
    /**
     * @generated from field: string plain_secret = 1;
     */
    plainSecret: string;
    /**
     * @generated from field: scalekit.v1.clients.ClientSecret secret = 2;
     */
    secret?: ClientSecret;
};
/**
 * Describes the message scalekit.v1.clients.CreateOrganizationClientSecretResponse.
 * Use `create(CreateOrganizationClientSecretResponseSchema)` to create a new message.
 */
export declare const CreateOrganizationClientSecretResponseSchema: GenMessage<CreateOrganizationClientSecretResponse>;
/**
 * @generated from message scalekit.v1.clients.DeleteOrganizationClientSecretRequest
 */
export type DeleteOrganizationClientSecretRequest = Message<"scalekit.v1.clients.DeleteOrganizationClientSecretRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string client_id = 2;
     */
    clientId: string;
    /**
     * @generated from field: string secret_id = 3;
     */
    secretId: string;
};
/**
 * Describes the message scalekit.v1.clients.DeleteOrganizationClientSecretRequest.
 * Use `create(DeleteOrganizationClientSecretRequestSchema)` to create a new message.
 */
export declare const DeleteOrganizationClientSecretRequestSchema: GenMessage<DeleteOrganizationClientSecretRequest>;
/**
 * @generated from message scalekit.v1.clients.ListOrganizationClientsRequest
 */
export type ListOrganizationClientsRequest = Message<"scalekit.v1.clients.ListOrganizationClientsRequest"> & {
    /**
     * Unique identifier of the organization
     *
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * Maximum number of clients to return per page
     *
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * Pagination token from the previous response
     *
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.clients.ListOrganizationClientsRequest.
 * Use `create(ListOrganizationClientsRequestSchema)` to create a new message.
 */
export declare const ListOrganizationClientsRequestSchema: GenMessage<ListOrganizationClientsRequest>;
/**
 * @generated from message scalekit.v1.clients.ListOrganizationClientsResponse
 */
export type ListOrganizationClientsResponse = Message<"scalekit.v1.clients.ListOrganizationClientsResponse"> & {
    /**
     * Pagination token for the next page of results
     *
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * Total number of clients in the organization
     *
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * List of organization API clients
     *
     * @generated from field: repeated scalekit.v1.clients.M2MClient clients = 3;
     */
    clients: M2MClient[];
    /**
     * Pagination token for the previous page of results
     *
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.clients.ListOrganizationClientsResponse.
 * Use `create(ListOrganizationClientsResponseSchema)` to create a new message.
 */
export declare const ListOrganizationClientsResponseSchema: GenMessage<ListOrganizationClientsResponse>;
/**
 * @generated from message scalekit.v1.clients.DeleteOrganizationClientRequest
 */
export type DeleteOrganizationClientRequest = Message<"scalekit.v1.clients.DeleteOrganizationClientRequest"> & {
    /**
     * Unique identifier of the organization
     *
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * Unique identifier of the client to delete
     *
     * @generated from field: string client_id = 2;
     */
    clientId: string;
};
/**
 * Describes the message scalekit.v1.clients.DeleteOrganizationClientRequest.
 * Use `create(DeleteOrganizationClientRequestSchema)` to create a new message.
 */
export declare const DeleteOrganizationClientRequestSchema: GenMessage<DeleteOrganizationClientRequest>;
/**
 * @generated from message scalekit.v1.clients.GetClientRequest
 */
export type GetClientRequest = Message<"scalekit.v1.clients.GetClientRequest"> & {
    /**
     * Unique identifier of the client resource to retrieve
     *
     * @generated from field: string client_id = 1;
     */
    clientId: string;
};
/**
 * Describes the message scalekit.v1.clients.GetClientRequest.
 * Use `create(GetClientRequestSchema)` to create a new message.
 */
export declare const GetClientRequestSchema: GenMessage<GetClientRequest>;
/**
 * @generated from message scalekit.v1.clients.GetClientResponse
 */
export type GetClientResponse = Message<"scalekit.v1.clients.GetClientResponse"> & {
    /**
     * Complete client configuration with all settings
     *
     * @generated from field: scalekit.v1.clients.Client client = 1;
     */
    client?: Client;
};
/**
 * Describes the message scalekit.v1.clients.GetClientResponse.
 * Use `create(GetClientResponseSchema)` to create a new message.
 */
export declare const GetClientResponseSchema: GenMessage<GetClientResponse>;
/**
 * @generated from message scalekit.v1.clients.ListClientsRequest
 */
export type ListClientsRequest = Message<"scalekit.v1.clients.ListClientsRequest"> & {
    /**
     * Controls whether plain secret values are included in the response
     *
     * @generated from field: bool include_plain_secret = 1;
     */
    includePlainSecret: boolean;
    /**
     * @generated from field: scalekit.v1.clients.ListClientsRequest.Filter filter = 3;
     */
    filter?: ListClientsRequest_Filter;
    /**
     * @generated from field: string page_token = 4;
     */
    pageToken: string;
    /**
     * @generated from field: uint32 page_size = 5;
     */
    pageSize: number;
};
/**
 * Describes the message scalekit.v1.clients.ListClientsRequest.
 * Use `create(ListClientsRequestSchema)` to create a new message.
 */
export declare const ListClientsRequestSchema: GenMessage<ListClientsRequest>;
/**
 * @generated from message scalekit.v1.clients.ListClientsRequest.Filter
 */
export type ListClientsRequest_Filter = Message<"scalekit.v1.clients.ListClientsRequest.Filter"> & {
    /**
     * @generated from field: repeated string client_type = 1;
     */
    clientType: string[];
};
/**
 * Describes the message scalekit.v1.clients.ListClientsRequest.Filter.
 * Use `create(ListClientsRequest_FilterSchema)` to create a new message.
 */
export declare const ListClientsRequest_FilterSchema: GenMessage<ListClientsRequest_Filter>;
/**
 * @generated from message scalekit.v1.clients.ListClientsResponse
 */
export type ListClientsResponse = Message<"scalekit.v1.clients.ListClientsResponse"> & {
    /**
     * Total number of clients matching the query criteria
     *
     * @generated from field: uint32 total_size = 1;
     */
    totalSize: number;
    /**
     * List of client resources
     *
     * @generated from field: repeated scalekit.v1.clients.Client clients = 2;
     */
    clients: Client[];
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
 * Describes the message scalekit.v1.clients.ListClientsResponse.
 * Use `create(ListClientsResponseSchema)` to create a new message.
 */
export declare const ListClientsResponseSchema: GenMessage<ListClientsResponse>;
/**
 * @generated from message scalekit.v1.clients.CreateClientRequest
 */
export type CreateClientRequest = Message<"scalekit.v1.clients.CreateClientRequest"> & {
    /**
     * @generated from field: scalekit.v1.clients.CreateClient client = 1;
     */
    client?: CreateClient;
};
/**
 * Describes the message scalekit.v1.clients.CreateClientRequest.
 * Use `create(CreateClientRequestSchema)` to create a new message.
 */
export declare const CreateClientRequestSchema: GenMessage<CreateClientRequest>;
/**
 * @generated from message scalekit.v1.clients.CreateClient
 */
export type CreateClient = Message<"scalekit.v1.clients.CreateClient"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string client_type = 2;
     */
    clientType: string;
    /**
     * @generated from field: repeated string back_channel_logout_uris = 3;
     */
    backChannelLogoutUris: string[];
    /**
     * @generated from field: repeated string post_logout_redirect_uris = 4;
     */
    postLogoutRedirectUris: string[];
    /**
     * @generated from field: optional string initiate_login_uri = 5;
     */
    initiateLoginUri?: string;
    /**
     * @generated from field: repeated string post_login_uris = 6;
     */
    postLoginUris: string[];
    /**
     * @generated from field: int64 access_token_expiry = 7;
     */
    accessTokenExpiry: bigint;
    /**
     * @generated from field: repeated string scopes = 8;
     */
    scopes: string[];
    /**
     * @generated from field: repeated scalekit.v1.clients.CustomClaim custom_claims = 9;
     */
    customClaims: CustomClaim[];
    /**
     * @generated from field: google.protobuf.BoolValue disallow_scalekit_api_access = 10;
     */
    disallowScalekitApiAccess?: boolean;
    /**
     * @generated from field: repeated string grant_types = 11;
     */
    grantTypes: string[];
    /**
     * @generated from field: google.protobuf.BoolValue enforce_pkce = 12;
     */
    enforcePkce?: boolean;
};
/**
 * Describes the message scalekit.v1.clients.CreateClient.
 * Use `create(CreateClientSchema)` to create a new message.
 */
export declare const CreateClientSchema: GenMessage<CreateClient>;
/**
 * @generated from message scalekit.v1.clients.CreateClientResponse
 */
export type CreateClientResponse = Message<"scalekit.v1.clients.CreateClientResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.Client client = 1;
     */
    client?: Client;
};
/**
 * Describes the message scalekit.v1.clients.CreateClientResponse.
 * Use `create(CreateClientResponseSchema)` to create a new message.
 */
export declare const CreateClientResponseSchema: GenMessage<CreateClientResponse>;
/**
 * @generated from message scalekit.v1.clients.UpdateClientRequest
 */
export type UpdateClientRequest = Message<"scalekit.v1.clients.UpdateClientRequest"> & {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * @generated from field: scalekit.v1.clients.UpdateClient client = 2;
     */
    client?: UpdateClient;
    /**
     * @generated from field: google.protobuf.FieldMask mask = 3;
     */
    mask?: FieldMask;
};
/**
 * Describes the message scalekit.v1.clients.UpdateClientRequest.
 * Use `create(UpdateClientRequestSchema)` to create a new message.
 */
export declare const UpdateClientRequestSchema: GenMessage<UpdateClientRequest>;
/**
 * @generated from message scalekit.v1.clients.UpdateClient
 */
export type UpdateClient = Message<"scalekit.v1.clients.UpdateClient"> & {
    /**
     * @generated from field: repeated string back_channel_logout_uris = 4;
     */
    backChannelLogoutUris: string[];
    /**
     * @generated from field: repeated string post_logout_redirect_uris = 5;
     */
    postLogoutRedirectUris: string[];
    /**
     * @generated from field: optional string initiate_login_uri = 6;
     */
    initiateLoginUri?: string;
    /**
     * @generated from field: repeated string post_login_uris = 7;
     */
    postLoginUris: string[];
    /**
     * @generated from field: string name = 8;
     */
    name: string;
    /**
     * @generated from field: int64 access_token_expiry = 9;
     */
    accessTokenExpiry: bigint;
    /**
     * @generated from field: repeated string scopes = 11;
     */
    scopes: string[];
    /**
     * @generated from field: repeated scalekit.v1.clients.CustomClaim custom_claims = 12;
     */
    customClaims: CustomClaim[];
    /**
     * @generated from field: google.protobuf.BoolValue disallow_scalekit_api_access = 13;
     */
    disallowScalekitApiAccess?: boolean;
    /**
     * @generated from field: repeated string grant_types = 14;
     */
    grantTypes: string[];
    /**
     * @generated from field: google.protobuf.BoolValue enforce_pkce = 15;
     */
    enforcePkce?: boolean;
};
/**
 * Describes the message scalekit.v1.clients.UpdateClient.
 * Use `create(UpdateClientSchema)` to create a new message.
 */
export declare const UpdateClientSchema: GenMessage<UpdateClient>;
/**
 * @generated from message scalekit.v1.clients.UpdateClientResponse
 */
export type UpdateClientResponse = Message<"scalekit.v1.clients.UpdateClientResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.Client client = 1;
     */
    client?: Client;
};
/**
 * Describes the message scalekit.v1.clients.UpdateClientResponse.
 * Use `create(UpdateClientResponseSchema)` to create a new message.
 */
export declare const UpdateClientResponseSchema: GenMessage<UpdateClientResponse>;
/**
 * @generated from message scalekit.v1.clients.CreateClientSecretRequest
 */
export type CreateClientSecretRequest = Message<"scalekit.v1.clients.CreateClientSecretRequest"> & {
    /**
     * Unique identifier of the client for which to create a secret
     *
     * @generated from field: string client_id = 1;
     */
    clientId: string;
};
/**
 * Describes the message scalekit.v1.clients.CreateClientSecretRequest.
 * Use `create(CreateClientSecretRequestSchema)` to create a new message.
 */
export declare const CreateClientSecretRequestSchema: GenMessage<CreateClientSecretRequest>;
/**
 * @generated from message scalekit.v1.clients.CreateClientSecretResponse
 */
export type CreateClientSecretResponse = Message<"scalekit.v1.clients.CreateClientSecretResponse"> & {
    /**
     * The unhashed secret value; only returned once at creation time
     *
     * @generated from field: string plain_secret = 1;
     */
    plainSecret: string;
    /**
     * Metadata about the created secret (doesn't include the plain secret value)
     *
     * @generated from field: scalekit.v1.clients.ClientSecret secret = 2;
     */
    secret?: ClientSecret;
};
/**
 * Describes the message scalekit.v1.clients.CreateClientSecretResponse.
 * Use `create(CreateClientSecretResponseSchema)` to create a new message.
 */
export declare const CreateClientSecretResponseSchema: GenMessage<CreateClientSecretResponse>;
/**
 * @generated from message scalekit.v1.clients.UpdateClientSecretRequest
 */
export type UpdateClientSecretRequest = Message<"scalekit.v1.clients.UpdateClientSecretRequest"> & {
    /**
     * Unique identifier of the client containing the secret
     *
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * Unique identifier of the secret to update
     *
     * @generated from field: string secret_id = 2;
     */
    secretId: string;
    /**
     * New status to apply to the secret
     *
     * @generated from field: scalekit.v1.clients.UpdateClientSecret secret = 3;
     */
    secret?: UpdateClientSecret;
    /**
     * Fields to update (system-controlled parameter)
     *
     * @generated from field: google.protobuf.FieldMask mask = 4;
     */
    mask?: FieldMask;
};
/**
 * Describes the message scalekit.v1.clients.UpdateClientSecretRequest.
 * Use `create(UpdateClientSecretRequestSchema)` to create a new message.
 */
export declare const UpdateClientSecretRequestSchema: GenMessage<UpdateClientSecretRequest>;
/**
 * @generated from message scalekit.v1.clients.UpdateClientSecret
 */
export type UpdateClientSecret = Message<"scalekit.v1.clients.UpdateClientSecret"> & {
    /**
     * Status of the secret (active or inactive)
     *
     * @generated from field: scalekit.v1.clients.ClientSecretStatus status = 1;
     */
    status: ClientSecretStatus;
};
/**
 * Describes the message scalekit.v1.clients.UpdateClientSecret.
 * Use `create(UpdateClientSecretSchema)` to create a new message.
 */
export declare const UpdateClientSecretSchema: GenMessage<UpdateClientSecret>;
/**
 * @generated from message scalekit.v1.clients.UpdateClientSecretResponse
 */
export type UpdateClientSecretResponse = Message<"scalekit.v1.clients.UpdateClientSecretResponse"> & {
    /**
     * Updated secret metadata
     *
     * @generated from field: scalekit.v1.clients.ClientSecret secret = 1;
     */
    secret?: ClientSecret;
};
/**
 * Describes the message scalekit.v1.clients.UpdateClientSecretResponse.
 * Use `create(UpdateClientSecretResponseSchema)` to create a new message.
 */
export declare const UpdateClientSecretResponseSchema: GenMessage<UpdateClientSecretResponse>;
/**
 * @generated from message scalekit.v1.clients.DeleteClientRequest
 */
export type DeleteClientRequest = Message<"scalekit.v1.clients.DeleteClientRequest"> & {
    /**
     * Unique identifier of the client containing the secret
     *
     * @generated from field: string client_id = 1;
     */
    clientId: string;
};
/**
 * Describes the message scalekit.v1.clients.DeleteClientRequest.
 * Use `create(DeleteClientRequestSchema)` to create a new message.
 */
export declare const DeleteClientRequestSchema: GenMessage<DeleteClientRequest>;
/**
 * @generated from message scalekit.v1.clients.DeleteClientSecretRequest
 */
export type DeleteClientSecretRequest = Message<"scalekit.v1.clients.DeleteClientSecretRequest"> & {
    /**
     * Unique identifier of the client containing the secret
     *
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * Unique identifier of the secret to delete
     *
     * @generated from field: string secret_id = 2;
     */
    secretId: string;
};
/**
 * Describes the message scalekit.v1.clients.DeleteClientSecretRequest.
 * Use `create(DeleteClientSecretRequestSchema)` to create a new message.
 */
export declare const DeleteClientSecretRequestSchema: GenMessage<DeleteClientSecretRequest>;
/**
 * @generated from message scalekit.v1.clients.Client
 */
export type Client = Message<"scalekit.v1.clients.Client"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string keyId = 2;
     */
    keyId: string;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 3;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 4;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: repeated scalekit.v1.clients.ClientSecret secrets = 7;
     */
    secrets: ClientSecret[];
    /**
     * @generated from field: repeated string post_logout_redirect_uris = 8;
     */
    postLogoutRedirectUris: string[];
    /**
     * @generated from field: repeated string back_channel_logout_uris = 9;
     */
    backChannelLogoutUris: string[];
    /**
     * @generated from field: string initiate_login_uri = 10;
     */
    initiateLoginUri: string;
    /**
     * @generated from field: repeated string post_login_uris = 11;
     */
    postLoginUris: string[];
    /**
     * @generated from field: string name = 12;
     */
    name: string;
    /**
     * @generated from field: optional int64 access_token_expiry = 13;
     */
    accessTokenExpiry?: bigint;
    /**
     * @generated from field: repeated string scopes = 14;
     */
    scopes: string[];
    /**
     * @generated from field: repeated scalekit.v1.clients.CustomClaim custom_claims = 15;
     */
    customClaims: CustomClaim[];
    /**
     * @generated from field: bool disallow_scalekit_api_access = 16;
     */
    disallowScalekitApiAccess: boolean;
    /**
     * @generated from field: repeated string grant_types = 17;
     */
    grantTypes: string[];
    /**
     * @generated from field: string client_type = 18;
     */
    clientType: string;
    /**
     * @generated from field: bool enforce_pkce = 19;
     */
    enforcePkce: boolean;
};
/**
 * Describes the message scalekit.v1.clients.Client.
 * Use `create(ClientSchema)` to create a new message.
 */
export declare const ClientSchema: GenMessage<Client>;
/**
 * @generated from message scalekit.v1.clients.ClientSecret
 */
export type ClientSecret = Message<"scalekit.v1.clients.ClientSecret"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 2;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 3;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: string secret_suffix = 4;
     */
    secretSuffix: string;
    /**
     * @generated from field: optional string created_by = 5;
     */
    createdBy?: string;
    /**
     * @generated from field: scalekit.v1.clients.ClientSecretStatus status = 6;
     */
    status: ClientSecretStatus;
    /**
     * @generated from field: google.protobuf.Timestamp expire_time = 7;
     */
    expireTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_used_time = 8;
     */
    lastUsedTime?: Timestamp;
    /**
     * @generated from field: optional string plain_secret = 9;
     */
    plainSecret?: string;
};
/**
 * Describes the message scalekit.v1.clients.ClientSecret.
 * Use `create(ClientSecretSchema)` to create a new message.
 */
export declare const ClientSecretSchema: GenMessage<ClientSecret>;
/**
 * @generated from message scalekit.v1.clients.Scope
 */
export type Scope = Message<"scalekit.v1.clients.Scope"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * @generated from field: bool enabled = 4;
     */
    enabled: boolean;
};
/**
 * Describes the message scalekit.v1.clients.Scope.
 * Use `create(ScopeSchema)` to create a new message.
 */
export declare const ScopeSchema: GenMessage<Scope>;
/**
 * @generated from message scalekit.v1.clients.CreateScope
 */
export type CreateScope = Message<"scalekit.v1.clients.CreateScope"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
};
/**
 * Describes the message scalekit.v1.clients.CreateScope.
 * Use `create(CreateScopeSchema)` to create a new message.
 */
export declare const CreateScopeSchema: GenMessage<CreateScope>;
/**
 * @generated from message scalekit.v1.clients.CreateScopeRequest
 */
export type CreateScopeRequest = Message<"scalekit.v1.clients.CreateScopeRequest"> & {
    /**
     * @generated from field: scalekit.v1.clients.CreateScope scope = 1;
     */
    scope?: CreateScope;
    /**
     * @generated from field: string env_id = 2;
     */
    envId: string;
};
/**
 * Describes the message scalekit.v1.clients.CreateScopeRequest.
 * Use `create(CreateScopeRequestSchema)` to create a new message.
 */
export declare const CreateScopeRequestSchema: GenMessage<CreateScopeRequest>;
/**
 * @generated from message scalekit.v1.clients.CreateScopeResponse
 */
export type CreateScopeResponse = Message<"scalekit.v1.clients.CreateScopeResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.Scope scope = 1;
     */
    scope?: Scope;
};
/**
 * Describes the message scalekit.v1.clients.CreateScopeResponse.
 * Use `create(CreateScopeResponseSchema)` to create a new message.
 */
export declare const CreateScopeResponseSchema: GenMessage<CreateScopeResponse>;
/**
 * @generated from message scalekit.v1.clients.ListScopesRequest
 */
export type ListScopesRequest = Message<"scalekit.v1.clients.ListScopesRequest"> & {
    /**
     * @generated from field: string env_id = 1;
     */
    envId: string;
};
/**
 * Describes the message scalekit.v1.clients.ListScopesRequest.
 * Use `create(ListScopesRequestSchema)` to create a new message.
 */
export declare const ListScopesRequestSchema: GenMessage<ListScopesRequest>;
/**
 * @generated from message scalekit.v1.clients.ListScopesResponse
 */
export type ListScopesResponse = Message<"scalekit.v1.clients.ListScopesResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.clients.Scope scopes = 1;
     */
    scopes: Scope[];
};
/**
 * Describes the message scalekit.v1.clients.ListScopesResponse.
 * Use `create(ListScopesResponseSchema)` to create a new message.
 */
export declare const ListScopesResponseSchema: GenMessage<ListScopesResponse>;
/**
 * @generated from message scalekit.v1.clients.UpdateScopeRequest
 */
export type UpdateScopeRequest = Message<"scalekit.v1.clients.UpdateScopeRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.clients.UpdateScope scope = 2;
     */
    scope?: UpdateScope;
};
/**
 * Describes the message scalekit.v1.clients.UpdateScopeRequest.
 * Use `create(UpdateScopeRequestSchema)` to create a new message.
 */
export declare const UpdateScopeRequestSchema: GenMessage<UpdateScopeRequest>;
/**
 * @generated from message scalekit.v1.clients.UpdateScope
 */
export type UpdateScope = Message<"scalekit.v1.clients.UpdateScope"> & {
    /**
     * @generated from field: string description = 1;
     */
    description: string;
    /**
     * @generated from field: google.protobuf.BoolValue enabled = 2;
     */
    enabled?: boolean;
};
/**
 * Describes the message scalekit.v1.clients.UpdateScope.
 * Use `create(UpdateScopeSchema)` to create a new message.
 */
export declare const UpdateScopeSchema: GenMessage<UpdateScope>;
/**
 * @generated from message scalekit.v1.clients.UpdateScopeResponse
 */
export type UpdateScopeResponse = Message<"scalekit.v1.clients.UpdateScopeResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.Scope scope = 1;
     */
    scope?: Scope;
};
/**
 * Describes the message scalekit.v1.clients.UpdateScopeResponse.
 * Use `create(UpdateScopeResponseSchema)` to create a new message.
 */
export declare const UpdateScopeResponseSchema: GenMessage<UpdateScopeResponse>;
/**
 * @generated from message scalekit.v1.clients.DeleteScopeRequest
 */
export type DeleteScopeRequest = Message<"scalekit.v1.clients.DeleteScopeRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.clients.DeleteScopeRequest.
 * Use `create(DeleteScopeRequestSchema)` to create a new message.
 */
export declare const DeleteScopeRequestSchema: GenMessage<DeleteScopeRequest>;
/**
 * @generated from message scalekit.v1.clients.GetConsentDetailsResponse
 */
export type GetConsentDetailsResponse = Message<"scalekit.v1.clients.GetConsentDetailsResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.Resource resource = 1;
     */
    resource?: Resource;
    /**
     * @generated from field: scalekit.v1.clients.User user = 2;
     */
    user?: User;
    /**
     * @generated from field: scalekit.v1.clients.ConsentClient client = 3;
     */
    client?: ConsentClient;
    /**
     * @generated from field: repeated scalekit.v1.clients.ConsentScope scopes = 4;
     */
    scopes: ConsentScope[];
    /**
     * @generated from field: scalekit.v1.clients.Application application = 5;
     */
    application?: Application;
};
/**
 * Describes the message scalekit.v1.clients.GetConsentDetailsResponse.
 * Use `create(GetConsentDetailsResponseSchema)` to create a new message.
 */
export declare const GetConsentDetailsResponseSchema: GenMessage<GetConsentDetailsResponse>;
/**
 * @generated from message scalekit.v1.clients.ConsentClient
 */
export type ConsentClient = Message<"scalekit.v1.clients.ConsentClient"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string privacy_uri = 2;
     */
    privacyUri: string;
    /**
     * @generated from field: string tos_uri = 3;
     */
    tosUri: string;
    /**
     * @generated from field: string client_id = 4;
     */
    clientId: string;
    /**
     * @generated from field: string metadata_uri = 5;
     */
    metadataUri: string;
    /**
     * @generated from field: string logo_uri = 6;
     */
    logoUri: string;
};
/**
 * Describes the message scalekit.v1.clients.ConsentClient.
 * Use `create(ConsentClientSchema)` to create a new message.
 */
export declare const ConsentClientSchema: GenMessage<ConsentClient>;
/**
 * @generated from message scalekit.v1.clients.ConsentScope
 */
export type ConsentScope = Message<"scalekit.v1.clients.ConsentScope"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
};
/**
 * Describes the message scalekit.v1.clients.ConsentScope.
 * Use `create(ConsentScopeSchema)` to create a new message.
 */
export declare const ConsentScopeSchema: GenMessage<ConsentScope>;
/**
 * @generated from message scalekit.v1.clients.User
 */
export type User = Message<"scalekit.v1.clients.User"> & {
    /**
     * @generated from field: string email = 1;
     */
    email: string;
};
/**
 * Describes the message scalekit.v1.clients.User.
 * Use `create(UserSchema)` to create a new message.
 */
export declare const UserSchema: GenMessage<User>;
/**
 * @generated from message scalekit.v1.clients.RevokeUserConsentRequest
 */
export type RevokeUserConsentRequest = Message<"scalekit.v1.clients.RevokeUserConsentRequest"> & {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * @generated from field: string consent_id = 2;
     */
    consentId: string;
};
/**
 * Describes the message scalekit.v1.clients.RevokeUserConsentRequest.
 * Use `create(RevokeUserConsentRequestSchema)` to create a new message.
 */
export declare const RevokeUserConsentRequestSchema: GenMessage<RevokeUserConsentRequest>;
/**
 * @generated from message scalekit.v1.clients.RevokeUserConsentResponse
 */
export type RevokeUserConsentResponse = Message<"scalekit.v1.clients.RevokeUserConsentResponse"> & {};
/**
 * Describes the message scalekit.v1.clients.RevokeUserConsentResponse.
 * Use `create(RevokeUserConsentResponseSchema)` to create a new message.
 */
export declare const RevokeUserConsentResponseSchema: GenMessage<RevokeUserConsentResponse>;
/**
 * @generated from message scalekit.v1.clients.EnsureResourceConnectionRequest
 */
export type EnsureResourceConnectionRequest = Message<"scalekit.v1.clients.EnsureResourceConnectionRequest"> & {
    /**
     * @generated from field: string resource_id = 1;
     */
    resourceId: string;
};
/**
 * Describes the message scalekit.v1.clients.EnsureResourceConnectionRequest.
 * Use `create(EnsureResourceConnectionRequestSchema)` to create a new message.
 */
export declare const EnsureResourceConnectionRequestSchema: GenMessage<EnsureResourceConnectionRequest>;
/**
 * @generated from message scalekit.v1.clients.EnsureResourceConnectionResponse
 */
export type EnsureResourceConnectionResponse = Message<"scalekit.v1.clients.EnsureResourceConnectionResponse"> & {
    /**
     * @generated from field: scalekit.v1.clients.ResourceConnection connection = 1;
     */
    connection?: ResourceConnection;
};
/**
 * Describes the message scalekit.v1.clients.EnsureResourceConnectionResponse.
 * Use `create(EnsureResourceConnectionResponseSchema)` to create a new message.
 */
export declare const EnsureResourceConnectionResponseSchema: GenMessage<EnsureResourceConnectionResponse>;
/**
 * @generated from message scalekit.v1.clients.ResourceConnection
 */
export type ResourceConnection = Message<"scalekit.v1.clients.ResourceConnection"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.clients.ResourceConnectionType type = 2;
     */
    type: ResourceConnectionType;
    /**
     * @generated from field: string status = 3;
     */
    status: string;
    /**
     * @generated from field: bool enabled = 4;
     */
    enabled: boolean;
    /**
     * @generated from field: google.protobuf.Struct settings = 5;
     */
    settings?: JsonObject;
    /**
     * @generated from field: string provider = 6;
     */
    provider: string;
};
/**
 * Describes the message scalekit.v1.clients.ResourceConnection.
 * Use `create(ResourceConnectionSchema)` to create a new message.
 */
export declare const ResourceConnectionSchema: GenMessage<ResourceConnection>;
/**
 * @generated from message scalekit.v1.clients.ResourceCustomConnectionSettings
 */
export type ResourceCustomConnectionSettings = Message<"scalekit.v1.clients.ResourceCustomConnectionSettings"> & {
    /**
     * @generated from field: string authorize_uri = 1;
     */
    authorizeUri: string;
};
/**
 * Describes the message scalekit.v1.clients.ResourceCustomConnectionSettings.
 * Use `create(ResourceCustomConnectionSettingsSchema)` to create a new message.
 */
export declare const ResourceCustomConnectionSettingsSchema: GenMessage<ResourceCustomConnectionSettings>;
/**
 * @generated from enum scalekit.v1.clients.ResourceType
 */
export declare enum ResourceType {
    /**
     * @generated from enum value: RESOURCE_TYPE_UNSPECIFIED = 0;
     */
    RESOURCE_TYPE_UNSPECIFIED = 0,
    /**
     * Web resource
     *
     * @generated from enum value: WEB = 1;
     */
    WEB = 1,
    /**
     * Mobile resource
     *
     * @generated from enum value: MOBILE = 2;
     */
    MOBILE = 2,
    /**
     * Desktop resource
     *
     * @generated from enum value: DESKTOP = 3;
     */
    DESKTOP = 3,
    /**
     * Server resource OR Microservices
     *
     * @generated from enum value: SERVER = 4;
     */
    SERVER = 4,
    /**
     * Model Context Protocol Server
     *
     * @generated from enum value: MCP_SERVER = 5;
     */
    MCP_SERVER = 5
}
/**
 * Describes the enum scalekit.v1.clients.ResourceType.
 */
export declare const ResourceTypeSchema: GenEnum<ResourceType>;
/**
 * ClientSecretStatus indicates whether a client secret can be used for authentication.
 * ACTIVE secrets can be used for authentication while INACTIVE secrets cannot.
 *
 * @generated from enum scalekit.v1.clients.ClientSecretStatus
 */
export declare enum ClientSecretStatus {
    /**
     * The secret is active and can be used for authentication
     *
     * @generated from enum value: ACTIVE = 0;
     */
    ACTIVE = 0,
    /**
     * The secret is inactive and cannot be used for authentication
     *
     * @generated from enum value: INACTIVE = 1;
     */
    INACTIVE = 1
}
/**
 * Describes the enum scalekit.v1.clients.ClientSecretStatus.
 */
export declare const ClientSecretStatusSchema: GenEnum<ClientSecretStatus>;
/**
 * @generated from enum scalekit.v1.clients.ResourceConnectionType
 */
export declare enum ResourceConnectionType {
    /**
     * @generated from enum value: INVALID = 0;
     */
    INVALID = 0,
    /**
     * @generated from enum value: CUSTOM = 1;
     */
    CUSTOM = 1
}
/**
 * Describes the enum scalekit.v1.clients.ResourceConnectionType.
 */
export declare const ResourceConnectionTypeSchema: GenEnum<ResourceConnectionType>;
/**
 * @generated from service scalekit.v1.clients.ClientService
 */
export declare const ClientService: GenService<{
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.ListClient
     */
    listClient: {
        methodKind: "unary";
        input: typeof ListClientsRequestSchema;
        output: typeof ListClientsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.CreateClient
     */
    createClient: {
        methodKind: "unary";
        input: typeof CreateClientRequestSchema;
        output: typeof CreateClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.GetClient
     */
    getClient: {
        methodKind: "unary";
        input: typeof GetClientRequestSchema;
        output: typeof GetClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.UpdateClient
     */
    updateClient: {
        methodKind: "unary";
        input: typeof UpdateClientRequestSchema;
        output: typeof UpdateClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.DeleteClient
     */
    deleteClient: {
        methodKind: "unary";
        input: typeof DeleteClientRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.CreateClientSecret
     */
    createClientSecret: {
        methodKind: "unary";
        input: typeof CreateClientSecretRequestSchema;
        output: typeof CreateClientSecretResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.UpdateClientSecret
     */
    updateClientSecret: {
        methodKind: "unary";
        input: typeof UpdateClientSecretRequestSchema;
        output: typeof UpdateClientSecretResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.DeleteClientSecret
     */
    deleteClientSecret: {
        methodKind: "unary";
        input: typeof DeleteClientSecretRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.CreateOrganizationClient
     */
    createOrganizationClient: {
        methodKind: "unary";
        input: typeof CreateOrganizationClientRequestSchema;
        output: typeof CreateOrganizationClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.GetOrganizationClient
     */
    getOrganizationClient: {
        methodKind: "unary";
        input: typeof GetOrganizationClientRequestSchema;
        output: typeof GetOrganizationClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.CreateOrganizationClientSecret
     */
    createOrganizationClientSecret: {
        methodKind: "unary";
        input: typeof CreateOrganizationClientSecretRequestSchema;
        output: typeof CreateOrganizationClientSecretResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.DeleteOrganizationClientSecret
     */
    deleteOrganizationClientSecret: {
        methodKind: "unary";
        input: typeof DeleteOrganizationClientSecretRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.UpdateOrganizationClient
     */
    updateOrganizationClient: {
        methodKind: "unary";
        input: typeof UpdateOrganizationClientRequestSchema;
        output: typeof UpdateOrganizationClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.DeleteOrganizationClient
     */
    deleteOrganizationClient: {
        methodKind: "unary";
        input: typeof DeleteOrganizationClientRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.ListOrganizationClients
     */
    listOrganizationClients: {
        methodKind: "unary";
        input: typeof ListOrganizationClientsRequestSchema;
        output: typeof ListOrganizationClientsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.CreateResource
     */
    createResource: {
        methodKind: "unary";
        input: typeof CreateResourceRequestSchema;
        output: typeof CreateResourceResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.GetResource
     */
    getResource: {
        methodKind: "unary";
        input: typeof GetResourceRequestSchema;
        output: typeof GetResourceResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.ListResources
     */
    listResources: {
        methodKind: "unary";
        input: typeof ListResourcesRequestSchema;
        output: typeof ListResourcesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.UpdateResource
     */
    updateResource: {
        methodKind: "unary";
        input: typeof UpdateResourceRequestSchema;
        output: typeof UpdateResourceResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.DeleteResource
     */
    deleteResource: {
        methodKind: "unary";
        input: typeof DeleteResourceRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.DeleteResourceProvider
     */
    deleteResourceProvider: {
        methodKind: "unary";
        input: typeof DeleteResourceProviderRequestSchema;
        output: typeof GetResourceResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.CreateResourceClient
     */
    createResourceClient: {
        methodKind: "unary";
        input: typeof CreateResourceClientRequestSchema;
        output: typeof CreateResourceClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.UpdateResourceClient
     */
    updateResourceClient: {
        methodKind: "unary";
        input: typeof UpdateResourceClientRequestSchema;
        output: typeof UpdateResourceClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.GetResourceClient
     */
    getResourceClient: {
        methodKind: "unary";
        input: typeof GetResourceClientRequestSchema;
        output: typeof GetResourceClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.ListResourceClients
     */
    listResourceClients: {
        methodKind: "unary";
        input: typeof ListResourceClientsRequestSchema;
        output: typeof ListResourceClientsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.ListResourceUserConsents
     */
    listResourceUserConsents: {
        methodKind: "unary";
        input: typeof ListResourceUserConsentsRequestSchema;
        output: typeof ListResourceUserConsentsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.DeleteResourceClient
     */
    deleteResourceClient: {
        methodKind: "unary";
        input: typeof DeleteResourceClientRequestSchema;
        output: typeof DeleteResourceClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.RegisterClient
     */
    registerClient: {
        methodKind: "unary";
        input: typeof RegisterClientRequestSchema;
        output: typeof RegisterClientResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.CreateScope
     * @deprecated
     */
    createScope: {
        methodKind: "unary";
        input: typeof CreateScopeRequestSchema;
        output: typeof CreateScopeResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.ListScopes
     */
    listScopes: {
        methodKind: "unary";
        input: typeof ListScopesRequestSchema;
        output: typeof ListScopesResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.UpdateScope
     * @deprecated
     */
    updateScope: {
        methodKind: "unary";
        input: typeof UpdateScopeRequestSchema;
        output: typeof UpdateScopeResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.DeleteScope
     * @deprecated
     */
    deleteScope: {
        methodKind: "unary";
        input: typeof DeleteScopeRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.GetConsentDetails
     */
    getConsentDetails: {
        methodKind: "unary";
        input: typeof EmptySchema;
        output: typeof GetConsentDetailsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.RevokeUserConsent
     */
    revokeUserConsent: {
        methodKind: "unary";
        input: typeof RevokeUserConsentRequestSchema;
        output: typeof RevokeUserConsentResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.clients.ClientService.EnsureResourceConnection
     */
    ensureResourceConnection: {
        methodKind: "unary";
        input: typeof EnsureResourceConnectionRequestSchema;
        output: typeof EnsureResourceConnectionResponseSchema;
    };
}>;
