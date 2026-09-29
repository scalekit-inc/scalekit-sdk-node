import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { ListValue } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/providers/providers.proto.
 */
export declare const file_scalekit_v1_providers_providers: GenFile;
/**
 * Provider represents a connected app provider
 *
 * @generated from message scalekit.v1.providers.Provider
 */
export type Provider = Message<"scalekit.v1.providers.Provider"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string identifier = 2;
     */
    identifier: string;
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: repeated string categories = 5;
     */
    categories: string[];
    /**
     * @generated from field: google.protobuf.ListValue auth_patterns = 6;
     */
    authPatterns?: ListValue | undefined;
    /**
     * @generated from field: string icon_src = 7;
     */
    iconSrc: string;
    /**
     * @generated from field: int32 display_priority = 8;
     */
    displayPriority: number;
    /**
     * @generated from field: bool coming_soon = 9;
     */
    comingSoon: boolean;
    /**
     * @generated from field: string proxy_url = 10;
     */
    proxyUrl: string;
    /**
     * @generated from field: bool proxy_enabled = 11;
     */
    proxyEnabled: boolean;
    /**
     * @generated from field: bool is_custom = 12;
     */
    isCustom: boolean;
    /**
     * @generated from field: bool is_custom_mcp = 13;
     */
    isCustomMcp: boolean;
    /**
     * @generated from field: map<string, string> metadata = 14;
     */
    metadata: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.providers.Provider.
 * Use `create(ProviderSchema)` to create a new message.
 */
export declare const ProviderSchema: GenMessage<Provider>;
/**
 * @generated from message scalekit.v1.providers.CreateProvider
 */
export type CreateProvider = Message<"scalekit.v1.providers.CreateProvider"> & {
    /**
     * @generated from field: string identifier = 2;
     */
    identifier: string;
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: repeated string categories = 5;
     */
    categories: string[];
    /**
     * @generated from field: google.protobuf.ListValue auth_patterns = 6;
     */
    authPatterns?: ListValue | undefined;
    /**
     * @generated from field: string icon_src = 7;
     */
    iconSrc: string;
    /**
     * @generated from field: int32 display_priority = 8;
     */
    displayPriority: number;
    /**
     * @generated from field: bool coming_soon = 9;
     */
    comingSoon: boolean;
    /**
     * @generated from field: string proxy_url = 10;
     */
    proxyUrl: string;
    /**
     * @generated from field: bool proxy_enabled = 11;
     */
    proxyEnabled: boolean;
};
/**
 * Describes the message scalekit.v1.providers.CreateProvider.
 * Use `create(CreateProviderSchema)` to create a new message.
 */
export declare const CreateProviderSchema: GenMessage<CreateProvider>;
/**
 * Create Provider
 *
 * @generated from message scalekit.v1.providers.CreateProviderRequest
 */
export type CreateProviderRequest = Message<"scalekit.v1.providers.CreateProviderRequest"> & {
    /**
     * @generated from field: scalekit.v1.providers.CreateProvider provider = 1;
     */
    provider?: CreateProvider | undefined;
};
/**
 * Describes the message scalekit.v1.providers.CreateProviderRequest.
 * Use `create(CreateProviderRequestSchema)` to create a new message.
 */
export declare const CreateProviderRequestSchema: GenMessage<CreateProviderRequest>;
/**
 * @generated from message scalekit.v1.providers.CreateCustomProvider
 */
export type CreateCustomProvider = Message<"scalekit.v1.providers.CreateCustomProvider"> & {
    /**
     * @generated from field: string display_name = 1;
     */
    displayName: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: google.protobuf.ListValue auth_patterns = 4;
     */
    authPatterns?: ListValue | undefined;
    /**
     * @generated from field: string proxy_url = 7;
     */
    proxyUrl: string;
    /**
     * @generated from field: bool proxy_enabled = 8;
     */
    proxyEnabled: boolean;
    /**
     * @generated from field: string icon_src = 9;
     */
    iconSrc: string;
    /**
     * @generated from field: map<string, string> metadata = 10;
     */
    metadata: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.providers.CreateCustomProvider.
 * Use `create(CreateCustomProviderSchema)` to create a new message.
 */
export declare const CreateCustomProviderSchema: GenMessage<CreateCustomProvider>;
/**
 * @generated from message scalekit.v1.providers.CreateCustomProviderRequest
 */
export type CreateCustomProviderRequest = Message<"scalekit.v1.providers.CreateCustomProviderRequest"> & {
    /**
     * @generated from field: scalekit.v1.providers.CreateCustomProvider provider = 1;
     */
    provider?: CreateCustomProvider | undefined;
};
/**
 * Describes the message scalekit.v1.providers.CreateCustomProviderRequest.
 * Use `create(CreateCustomProviderRequestSchema)` to create a new message.
 */
export declare const CreateCustomProviderRequestSchema: GenMessage<CreateCustomProviderRequest>;
/**
 * @generated from message scalekit.v1.providers.CreateProviderResponse
 */
export type CreateProviderResponse = Message<"scalekit.v1.providers.CreateProviderResponse"> & {
    /**
     * @generated from field: scalekit.v1.providers.Provider provider = 1;
     */
    provider?: Provider | undefined;
};
/**
 * Describes the message scalekit.v1.providers.CreateProviderResponse.
 * Use `create(CreateProviderResponseSchema)` to create a new message.
 */
export declare const CreateProviderResponseSchema: GenMessage<CreateProviderResponse>;
/**
 * @generated from message scalekit.v1.providers.UpdateProvider
 */
export type UpdateProvider = Message<"scalekit.v1.providers.UpdateProvider"> & {
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: repeated string categories = 5;
     */
    categories: string[];
    /**
     * @generated from field: google.protobuf.ListValue auth_patterns = 6;
     */
    authPatterns?: ListValue | undefined;
    /**
     * @generated from field: string icon_src = 7;
     */
    iconSrc: string;
    /**
     * @generated from field: int32 display_priority = 8;
     */
    displayPriority: number;
    /**
     * @generated from field: google.protobuf.BoolValue coming_soon = 9;
     */
    comingSoon?: boolean | undefined;
    /**
     * @generated from field: string proxy_url = 10;
     */
    proxyUrl: string;
    /**
     * @generated from field: google.protobuf.BoolValue proxy_enabled = 11;
     */
    proxyEnabled?: boolean | undefined;
};
/**
 * Describes the message scalekit.v1.providers.UpdateProvider.
 * Use `create(UpdateProviderSchema)` to create a new message.
 */
export declare const UpdateProviderSchema: GenMessage<UpdateProvider>;
/**
 * Update Provider
 *
 * @generated from message scalekit.v1.providers.UpdateProviderRequest
 */
export type UpdateProviderRequest = Message<"scalekit.v1.providers.UpdateProviderRequest"> & {
    /**
     * @generated from field: string identifier = 1;
     */
    identifier: string;
    /**
     * @generated from field: scalekit.v1.providers.UpdateProvider provider = 2;
     */
    provider?: UpdateProvider | undefined;
};
/**
 * Describes the message scalekit.v1.providers.UpdateProviderRequest.
 * Use `create(UpdateProviderRequestSchema)` to create a new message.
 */
export declare const UpdateProviderRequestSchema: GenMessage<UpdateProviderRequest>;
/**
 * @generated from message scalekit.v1.providers.UpdateCustomProvider
 */
export type UpdateCustomProvider = Message<"scalekit.v1.providers.UpdateCustomProvider"> & {
    /**
     * @generated from field: string display_name = 1;
     */
    displayName: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: google.protobuf.ListValue auth_patterns = 4;
     */
    authPatterns?: ListValue | undefined;
    /**
     * @generated from field: string proxy_url = 7;
     */
    proxyUrl: string;
    /**
     * @generated from field: bool proxy_enabled = 8;
     */
    proxyEnabled: boolean;
    /**
     * @generated from field: string icon_src = 9;
     */
    iconSrc: string;
    /**
     * @generated from field: map<string, string> metadata = 10;
     */
    metadata: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.providers.UpdateCustomProvider.
 * Use `create(UpdateCustomProviderSchema)` to create a new message.
 */
export declare const UpdateCustomProviderSchema: GenMessage<UpdateCustomProvider>;
/**
 * @generated from message scalekit.v1.providers.UpdateCustomProviderRequest
 */
export type UpdateCustomProviderRequest = Message<"scalekit.v1.providers.UpdateCustomProviderRequest"> & {
    /**
     * @generated from field: string identifier = 1;
     */
    identifier: string;
    /**
     * @generated from field: scalekit.v1.providers.UpdateCustomProvider provider = 2;
     */
    provider?: UpdateCustomProvider | undefined;
};
/**
 * Describes the message scalekit.v1.providers.UpdateCustomProviderRequest.
 * Use `create(UpdateCustomProviderRequestSchema)` to create a new message.
 */
export declare const UpdateCustomProviderRequestSchema: GenMessage<UpdateCustomProviderRequest>;
/**
 * @generated from message scalekit.v1.providers.UpdateProviderResponse
 */
export type UpdateProviderResponse = Message<"scalekit.v1.providers.UpdateProviderResponse"> & {
    /**
     * @generated from field: scalekit.v1.providers.Provider provider = 1;
     */
    provider?: Provider | undefined;
};
/**
 * Describes the message scalekit.v1.providers.UpdateProviderResponse.
 * Use `create(UpdateProviderResponseSchema)` to create a new message.
 */
export declare const UpdateProviderResponseSchema: GenMessage<UpdateProviderResponse>;
/**
 * List Providers
 *
 * @generated from message scalekit.v1.providers.ListProvidersRequest
 */
export type ListProvidersRequest = Message<"scalekit.v1.providers.ListProvidersRequest"> & {
    /**
     * @generated from field: string identifier = 1;
     */
    identifier: string;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
    /**
     * @generated from field: scalekit.v1.providers.ListProvidersRequest.Filter filter = 4;
     */
    filter?: ListProvidersRequest_Filter | undefined;
};
/**
 * Describes the message scalekit.v1.providers.ListProvidersRequest.
 * Use `create(ListProvidersRequestSchema)` to create a new message.
 */
export declare const ListProvidersRequestSchema: GenMessage<ListProvidersRequest>;
/**
 * @generated from message scalekit.v1.providers.ListProvidersRequest.Filter
 */
export type ListProvidersRequest_Filter = Message<"scalekit.v1.providers.ListProvidersRequest.Filter"> & {
    /**
     * DEFAULT, CUSTOM, ALL
     *
     * @generated from field: scalekit.v1.providers.ProviderType provider_type = 1;
     */
    providerType: ProviderType;
};
/**
 * Describes the message scalekit.v1.providers.ListProvidersRequest.Filter.
 * Use `create(ListProvidersRequest_FilterSchema)` to create a new message.
 */
export declare const ListProvidersRequest_FilterSchema: GenMessage<ListProvidersRequest_Filter>;
/**
 * @generated from message scalekit.v1.providers.ListProvidersResponse
 */
export type ListProvidersResponse = Message<"scalekit.v1.providers.ListProvidersResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.providers.Provider providers = 1;
     */
    providers: Provider[];
    /**
     * @generated from field: string next_page_token = 2;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 3;
     */
    totalSize: number;
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.providers.ListProvidersResponse.
 * Use `create(ListProvidersResponseSchema)` to create a new message.
 */
export declare const ListProvidersResponseSchema: GenMessage<ListProvidersResponse>;
/**
 * Phase 2 — request shape for the SESSION_USER ListMyProviders RPC.
 * No filter — the server forces ALL (built-in + this env's customs)
 * from the session. Pagination only.
 *
 * @generated from message scalekit.v1.providers.ListMyProvidersRequest
 */
export type ListMyProvidersRequest = Message<"scalekit.v1.providers.ListMyProvidersRequest"> & {
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
 * Describes the message scalekit.v1.providers.ListMyProvidersRequest.
 * Use `create(ListMyProvidersRequestSchema)` to create a new message.
 */
export declare const ListMyProvidersRequestSchema: GenMessage<ListMyProvidersRequest>;
/**
 * @generated from message scalekit.v1.providers.DeleteProviderRequest
 */
export type DeleteProviderRequest = Message<"scalekit.v1.providers.DeleteProviderRequest"> & {
    /**
     * @generated from field: string identifier = 1;
     */
    identifier: string;
};
/**
 * Describes the message scalekit.v1.providers.DeleteProviderRequest.
 * Use `create(DeleteProviderRequestSchema)` to create a new message.
 */
export declare const DeleteProviderRequestSchema: GenMessage<DeleteProviderRequest>;
/**
 * @generated from message scalekit.v1.providers.DeleteProviderResponse
 */
export type DeleteProviderResponse = Message<"scalekit.v1.providers.DeleteProviderResponse"> & {};
/**
 * Describes the message scalekit.v1.providers.DeleteProviderResponse.
 * Use `create(DeleteProviderResponseSchema)` to create a new message.
 */
export declare const DeleteProviderResponseSchema: GenMessage<DeleteProviderResponse>;
/**
 * @generated from enum scalekit.v1.providers.ProviderType
 */
export declare enum ProviderType {
    /**
     * @generated from enum value: DEFAULT = 0;
     */
    DEFAULT = 0,
    /**
     * @generated from enum value: CUSTOM = 1;
     */
    CUSTOM = 1,
    /**
     * @generated from enum value: ALL = 2;
     */
    ALL = 2
}
/**
 * Describes the enum scalekit.v1.providers.ProviderType.
 */
export declare const ProviderTypeSchema: GenEnum<ProviderType>;
/**
 * Service definition
 *
 * @generated from service scalekit.v1.providers.ProviderService
 */
export declare const ProviderService: GenService<{
    /**
     * @generated from rpc scalekit.v1.providers.ProviderService.CreateProvider
     */
    createProvider: {
        methodKind: "unary";
        input: typeof CreateProviderRequestSchema;
        output: typeof CreateProviderResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.providers.ProviderService.CreateCustomProvider
     */
    createCustomProvider: {
        methodKind: "unary";
        input: typeof CreateCustomProviderRequestSchema;
        output: typeof CreateProviderResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.providers.ProviderService.UpdateProvider
     */
    updateProvider: {
        methodKind: "unary";
        input: typeof UpdateProviderRequestSchema;
        output: typeof UpdateProviderResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.providers.ProviderService.UpdateCustomProvider
     */
    updateCustomProvider: {
        methodKind: "unary";
        input: typeof UpdateCustomProviderRequestSchema;
        output: typeof UpdateProviderResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.providers.ProviderService.DeleteProvider
     */
    deleteProvider: {
        methodKind: "unary";
        input: typeof DeleteProviderRequestSchema;
        output: typeof DeleteProviderResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.providers.ProviderService.DeleteCustomProvider
     */
    deleteCustomProvider: {
        methodKind: "unary";
        input: typeof DeleteProviderRequestSchema;
        output: typeof DeleteProviderResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.providers.ProviderService.ListProviders
     */
    listProviders: {
        methodKind: "unary";
        input: typeof ListProvidersRequestSchema;
        output: typeof ListProvidersResponseSchema;
    };
    /**
     * Phase 2 — SESSION_USER-authed counterpart to ListProviders, for the
     * /ui end-user surface. Reuses the same per-env scoping as
     * ListProviders(filter.provider_type=ALL): built-in catalog + this
     * env's custom providers; cross-env / cross-workspace catalog
     * entries are never returned (env_id resolves from the session, not
     * a client header — see service/providers.go).
     *
     * Excludes coming_soon entries so the end-user catalog stays
     * actionable. Same response shape as ListProviders, so the
     * frontend's providerMap consumer doesn't need to branch.
     *
     * @generated from rpc scalekit.v1.providers.ProviderService.ListMyProviders
     */
    listMyProviders: {
        methodKind: "unary";
        input: typeof ListMyProvidersRequestSchema;
        output: typeof ListProvidersResponseSchema;
    };
}>;
