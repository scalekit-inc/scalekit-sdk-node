import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, FieldMask, Timestamp } from "@bufbuild/protobuf/wkt";
import type { RegionCode } from "../commons/commons_pb";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/organizations/organizations.proto.
 */
export declare const file_scalekit_v1_organizations_organizations: GenFile;
/**
 * @generated from message scalekit.v1.organizations.CreateOrganizationRequest
 */
export type CreateOrganizationRequest = Message<"scalekit.v1.organizations.CreateOrganizationRequest"> & {
    /**
     * Organization details
     *
     * @generated from field: scalekit.v1.organizations.CreateOrganization organization = 1;
     */
    organization?: CreateOrganization;
};
/**
 * Describes the message scalekit.v1.organizations.CreateOrganizationRequest.
 * Use `create(CreateOrganizationRequestSchema)` to create a new message.
 */
export declare const CreateOrganizationRequestSchema: GenMessage<CreateOrganizationRequest>;
/**
 * @generated from message scalekit.v1.organizations.CreateOrganizationResponse
 */
export type CreateOrganizationResponse = Message<"scalekit.v1.organizations.CreateOrganizationResponse"> & {
    /**
     * @generated from field: scalekit.v1.organizations.Organization organization = 1;
     */
    organization?: Organization;
};
/**
 * Describes the message scalekit.v1.organizations.CreateOrganizationResponse.
 * Use `create(CreateOrganizationResponseSchema)` to create a new message.
 */
export declare const CreateOrganizationResponseSchema: GenMessage<CreateOrganizationResponse>;
/**
 * @generated from message scalekit.v1.organizations.CreateOrganization
 */
export type CreateOrganization = Message<"scalekit.v1.organizations.CreateOrganization"> & {
    /**
     * @generated from field: string display_name = 4;
     */
    displayName: string;
    /**
     * @generated from field: scalekit.v1.commons.RegionCode region_code = 5;
     */
    regionCode: RegionCode;
    /**
     * @generated from field: optional string external_id = 6;
     */
    externalId?: string;
    /**
     * @generated from field: map<string, string> metadata = 7;
     */
    metadata: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.organizations.CreateOrganization.
 * Use `create(CreateOrganizationSchema)` to create a new message.
 */
export declare const CreateOrganizationSchema: GenMessage<CreateOrganization>;
/**
 * @generated from message scalekit.v1.organizations.Organization
 */
export type Organization = Message<"scalekit.v1.organizations.Organization"> & {
    /**
     * Id
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Created Time
     *
     * @generated from field: google.protobuf.Timestamp create_time = 2;
     */
    createTime?: Timestamp;
    /**
     * Updated time
     *
     * @generated from field: google.protobuf.Timestamp update_time = 3;
     */
    updateTime?: Timestamp;
    /**
     * Name of the org to be used in display
     *
     * @generated from field: string display_name = 4;
     */
    displayName: string;
    /**
     * Optional regioncode
     *
     * @generated from field: scalekit.v1.commons.RegionCode region_code = 5;
     */
    regionCode: RegionCode;
    /**
     * External Id is useful to store a unique identifier for a given Org that. The unique Identifier can be the id of your tenant / org in your SaaSApp
     *
     * @generated from field: optional string external_id = 6;
     */
    externalId?: string;
    /**
     * Key value pairs extension attributes.
     *
     * @generated from field: map<string, string> metadata = 7;
     */
    metadata: {
        [key: string]: string;
    };
    /**
     * Organization Settings
     *
     * @generated from field: scalekit.v1.organizations.OrganizationSettings settings = 8;
     */
    settings?: OrganizationSettings;
};
/**
 * Describes the message scalekit.v1.organizations.Organization.
 * Use `create(OrganizationSchema)` to create a new message.
 */
export declare const OrganizationSchema: GenMessage<Organization>;
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationRequest
 */
export type UpdateOrganizationRequest = Message<"scalekit.v1.organizations.UpdateOrganizationRequest"> & {
    /**
     * @generated from oneof scalekit.v1.organizations.UpdateOrganizationRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 1;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 2;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: scalekit.v1.organizations.UpdateOrganization organization = 3;
     */
    organization?: UpdateOrganization;
    /**
     * @generated from field: google.protobuf.FieldMask update_mask = 99;
     */
    updateMask?: FieldMask;
};
/**
 * Describes the message scalekit.v1.organizations.UpdateOrganizationRequest.
 * Use `create(UpdateOrganizationRequestSchema)` to create a new message.
 */
export declare const UpdateOrganizationRequestSchema: GenMessage<UpdateOrganizationRequest>;
/**
 * For update messages ensure the indexes are same as the base model itself.
 *
 * @generated from message scalekit.v1.organizations.UpdateOrganization
 */
export type UpdateOrganization = Message<"scalekit.v1.organizations.UpdateOrganization"> & {
    /**
     * @generated from field: optional string display_name = 4;
     */
    displayName?: string;
    /**
     * @generated from field: optional string external_id = 6;
     */
    externalId?: string;
    /**
     * @generated from field: map<string, string> metadata = 7;
     */
    metadata: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.organizations.UpdateOrganization.
 * Use `create(UpdateOrganizationSchema)` to create a new message.
 */
export declare const UpdateOrganizationSchema: GenMessage<UpdateOrganization>;
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationResponse
 */
export type UpdateOrganizationResponse = Message<"scalekit.v1.organizations.UpdateOrganizationResponse"> & {
    /**
     * @generated from field: scalekit.v1.organizations.Organization organization = 1;
     */
    organization?: Organization;
};
/**
 * Describes the message scalekit.v1.organizations.UpdateOrganizationResponse.
 * Use `create(UpdateOrganizationResponseSchema)` to create a new message.
 */
export declare const UpdateOrganizationResponseSchema: GenMessage<UpdateOrganizationResponse>;
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationRequest
 */
export type GetOrganizationRequest = Message<"scalekit.v1.organizations.GetOrganizationRequest"> & {
    /**
     * @generated from oneof scalekit.v1.organizations.GetOrganizationRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 1;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 2;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message scalekit.v1.organizations.GetOrganizationRequest.
 * Use `create(GetOrganizationRequestSchema)` to create a new message.
 */
export declare const GetOrganizationRequestSchema: GenMessage<GetOrganizationRequest>;
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationResponse
 */
export type GetOrganizationResponse = Message<"scalekit.v1.organizations.GetOrganizationResponse"> & {
    /**
     * @generated from field: scalekit.v1.organizations.Organization organization = 1;
     */
    organization?: Organization;
};
/**
 * Describes the message scalekit.v1.organizations.GetOrganizationResponse.
 * Use `create(GetOrganizationResponseSchema)` to create a new message.
 */
export declare const GetOrganizationResponseSchema: GenMessage<GetOrganizationResponse>;
/**
 * @generated from message scalekit.v1.organizations.ListOrganizationsRequest
 */
export type ListOrganizationsRequest = Message<"scalekit.v1.organizations.ListOrganizationsRequest"> & {
    /**
     * @generated from field: uint32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
    /**
     * @generated from field: optional string external_id = 3;
     */
    externalId?: string;
};
/**
 * Describes the message scalekit.v1.organizations.ListOrganizationsRequest.
 * Use `create(ListOrganizationsRequestSchema)` to create a new message.
 */
export declare const ListOrganizationsRequestSchema: GenMessage<ListOrganizationsRequest>;
/**
 * @generated from message scalekit.v1.organizations.ListOrganizationsResponse
 */
export type ListOrganizationsResponse = Message<"scalekit.v1.organizations.ListOrganizationsResponse"> & {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.organizations.Organization organizations = 3;
     */
    organizations: Organization[];
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.organizations.ListOrganizationsResponse.
 * Use `create(ListOrganizationsResponseSchema)` to create a new message.
 */
export declare const ListOrganizationsResponseSchema: GenMessage<ListOrganizationsResponse>;
/**
 * @generated from message scalekit.v1.organizations.SearchOrganizationsRequest
 */
export type SearchOrganizationsRequest = Message<"scalekit.v1.organizations.SearchOrganizationsRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.organizations.SearchOrganizationsRequest.
 * Use `create(SearchOrganizationsRequestSchema)` to create a new message.
 */
export declare const SearchOrganizationsRequestSchema: GenMessage<SearchOrganizationsRequest>;
/**
 * @generated from message scalekit.v1.organizations.SearchOrganizationsResponse
 */
export type SearchOrganizationsResponse = Message<"scalekit.v1.organizations.SearchOrganizationsResponse"> & {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.organizations.Organization organizations = 3;
     */
    organizations: Organization[];
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.organizations.SearchOrganizationsResponse.
 * Use `create(SearchOrganizationsResponseSchema)` to create a new message.
 */
export declare const SearchOrganizationsResponseSchema: GenMessage<SearchOrganizationsResponse>;
/**
 * @generated from message scalekit.v1.organizations.DeleteOrganizationRequest
 */
export type DeleteOrganizationRequest = Message<"scalekit.v1.organizations.DeleteOrganizationRequest"> & {
    /**
     * @generated from oneof scalekit.v1.organizations.DeleteOrganizationRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 1;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 2;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message scalekit.v1.organizations.DeleteOrganizationRequest.
 * Use `create(DeleteOrganizationRequestSchema)` to create a new message.
 */
export declare const DeleteOrganizationRequestSchema: GenMessage<DeleteOrganizationRequest>;
/**
 * @generated from message scalekit.v1.organizations.GeneratePortalLinkRequest
 */
export type GeneratePortalLinkRequest = Message<"scalekit.v1.organizations.GeneratePortalLinkRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Deprecated: Use features
     *
     * @generated from field: optional bool sso = 2 [deprecated = true];
     * @deprecated
     */
    sso?: boolean;
    /**
     * Deprecated: Use features
     *
     * @generated from field: optional bool directory_sync = 3 [deprecated = true];
     * @deprecated
     */
    directorySync?: boolean;
    /**
     * @generated from field: repeated scalekit.v1.organizations.Feature features = 4;
     */
    features: Feature[];
};
/**
 * Describes the message scalekit.v1.organizations.GeneratePortalLinkRequest.
 * Use `create(GeneratePortalLinkRequestSchema)` to create a new message.
 */
export declare const GeneratePortalLinkRequestSchema: GenMessage<GeneratePortalLinkRequest>;
/**
 * @generated from message scalekit.v1.organizations.GetPortalLinkRequest
 */
export type GetPortalLinkRequest = Message<"scalekit.v1.organizations.GetPortalLinkRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.organizations.GetPortalLinkRequest.
 * Use `create(GetPortalLinkRequestSchema)` to create a new message.
 */
export declare const GetPortalLinkRequestSchema: GenMessage<GetPortalLinkRequest>;
/**
 * @generated from message scalekit.v1.organizations.DeletePortalLinkRequest
 */
export type DeletePortalLinkRequest = Message<"scalekit.v1.organizations.DeletePortalLinkRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message scalekit.v1.organizations.DeletePortalLinkRequest.
 * Use `create(DeletePortalLinkRequestSchema)` to create a new message.
 */
export declare const DeletePortalLinkRequestSchema: GenMessage<DeletePortalLinkRequest>;
/**
 * @generated from message scalekit.v1.organizations.DeletePortalLinkByIdRequest
 */
export type DeletePortalLinkByIdRequest = Message<"scalekit.v1.organizations.DeletePortalLinkByIdRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string link_id = 2;
     */
    linkId: string;
};
/**
 * Describes the message scalekit.v1.organizations.DeletePortalLinkByIdRequest.
 * Use `create(DeletePortalLinkByIdRequestSchema)` to create a new message.
 */
export declare const DeletePortalLinkByIdRequestSchema: GenMessage<DeletePortalLinkByIdRequest>;
/**
 * @generated from message scalekit.v1.organizations.Link
 */
export type Link = Message<"scalekit.v1.organizations.Link"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string location = 2;
     */
    location: string;
    /**
     * @generated from field: google.protobuf.Timestamp expire_time = 3;
     */
    expireTime?: Timestamp;
};
/**
 * Describes the message scalekit.v1.organizations.Link.
 * Use `create(LinkSchema)` to create a new message.
 */
export declare const LinkSchema: GenMessage<Link>;
/**
 * @generated from message scalekit.v1.organizations.GeneratePortalLinkResponse
 */
export type GeneratePortalLinkResponse = Message<"scalekit.v1.organizations.GeneratePortalLinkResponse"> & {
    /**
     * @generated from field: scalekit.v1.organizations.Link link = 1;
     */
    link?: Link;
};
/**
 * Describes the message scalekit.v1.organizations.GeneratePortalLinkResponse.
 * Use `create(GeneratePortalLinkResponseSchema)` to create a new message.
 */
export declare const GeneratePortalLinkResponseSchema: GenMessage<GeneratePortalLinkResponse>;
/**
 * @generated from message scalekit.v1.organizations.GetPortalLinksResponse
 */
export type GetPortalLinksResponse = Message<"scalekit.v1.organizations.GetPortalLinksResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.organizations.Link links = 1;
     */
    links: Link[];
};
/**
 * Describes the message scalekit.v1.organizations.GetPortalLinksResponse.
 * Use `create(GetPortalLinksResponseSchema)` to create a new message.
 */
export declare const GetPortalLinksResponseSchema: GenMessage<GetPortalLinksResponse>;
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationSettingsRequest
 */
export type UpdateOrganizationSettingsRequest = Message<"scalekit.v1.organizations.UpdateOrganizationSettingsRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationSettings settings = 2;
     */
    settings?: OrganizationSettings;
};
/**
 * Describes the message scalekit.v1.organizations.UpdateOrganizationSettingsRequest.
 * Use `create(UpdateOrganizationSettingsRequestSchema)` to create a new message.
 */
export declare const UpdateOrganizationSettingsRequestSchema: GenMessage<UpdateOrganizationSettingsRequest>;
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationSessionSettingsRequest
 */
export type UpdateOrganizationSessionSettingsRequest = Message<"scalekit.v1.organizations.UpdateOrganizationSessionSettingsRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string environment_id = 2;
     */
    environmentId: string;
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationSessionSettings session_settings = 3;
     */
    sessionSettings?: OrganizationSessionSettings;
};
/**
 * Describes the message scalekit.v1.organizations.UpdateOrganizationSessionSettingsRequest.
 * Use `create(UpdateOrganizationSessionSettingsRequestSchema)` to create a new message.
 */
export declare const UpdateOrganizationSessionSettingsRequestSchema: GenMessage<UpdateOrganizationSessionSettingsRequest>;
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationSessionSettingsResponse
 */
export type UpdateOrganizationSessionSettingsResponse = Message<"scalekit.v1.organizations.UpdateOrganizationSessionSettingsResponse"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationSessionSettings session_settings = 3;
     */
    sessionSettings?: OrganizationSessionSettings;
};
/**
 * Describes the message scalekit.v1.organizations.UpdateOrganizationSessionSettingsResponse.
 * Use `create(UpdateOrganizationSessionSettingsResponseSchema)` to create a new message.
 */
export declare const UpdateOrganizationSessionSettingsResponseSchema: GenMessage<UpdateOrganizationSessionSettingsResponse>;
/**
 * @generated from message scalekit.v1.organizations.OrganizationUserManagementSettings
 */
export type OrganizationUserManagementSettings = Message<"scalekit.v1.organizations.OrganizationUserManagementSettings"> & {
    /**
     * @generated from field: google.protobuf.Int32Value max_allowed_users = 1;
     */
    maxAllowedUsers?: number;
};
/**
 * Describes the message scalekit.v1.organizations.OrganizationUserManagementSettings.
 * Use `create(OrganizationUserManagementSettingsSchema)` to create a new message.
 */
export declare const OrganizationUserManagementSettingsSchema: GenMessage<OrganizationUserManagementSettings>;
/**
 * @generated from message scalekit.v1.organizations.OrganizationSessionSettings
 */
export type OrganizationSessionSettings = Message<"scalekit.v1.organizations.OrganizationSessionSettings"> & {
    /**
     * @generated from field: google.protobuf.Int32Value absolute_session_timeout = 1;
     */
    absoluteSessionTimeout?: number;
    /**
     * @generated from field: google.protobuf.BoolValue session_management_enabled = 2;
     */
    sessionManagementEnabled?: boolean;
    /**
     * @generated from field: google.protobuf.Int32Value idle_session_timeout = 3;
     */
    idleSessionTimeout?: number;
    /**
     * @generated from field: google.protobuf.BoolValue idle_session_enabled = 4;
     */
    idleSessionEnabled?: boolean;
};
/**
 * Describes the message scalekit.v1.organizations.OrganizationSessionSettings.
 * Use `create(OrganizationSessionSettingsSchema)` to create a new message.
 */
export declare const OrganizationSessionSettingsSchema: GenMessage<OrganizationSessionSettings>;
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationSessionSettingsRequest
 */
export type GetOrganizationSessionSettingsRequest = Message<"scalekit.v1.organizations.GetOrganizationSessionSettingsRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string environment_id = 2;
     */
    environmentId: string;
};
/**
 * Describes the message scalekit.v1.organizations.GetOrganizationSessionSettingsRequest.
 * Use `create(GetOrganizationSessionSettingsRequestSchema)` to create a new message.
 */
export declare const GetOrganizationSessionSettingsRequestSchema: GenMessage<GetOrganizationSessionSettingsRequest>;
/**
 * @generated from message scalekit.v1.organizations.CreateOrganizationSessionSettingsRequest
 */
export type CreateOrganizationSessionSettingsRequest = Message<"scalekit.v1.organizations.CreateOrganizationSessionSettingsRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string environment_id = 2;
     */
    environmentId: string;
};
/**
 * Describes the message scalekit.v1.organizations.CreateOrganizationSessionSettingsRequest.
 * Use `create(CreateOrganizationSessionSettingsRequestSchema)` to create a new message.
 */
export declare const CreateOrganizationSessionSettingsRequestSchema: GenMessage<CreateOrganizationSessionSettingsRequest>;
/**
 * @generated from message scalekit.v1.organizations.CreateOrganizationSessionSettingsResponse
 */
export type CreateOrganizationSessionSettingsResponse = Message<"scalekit.v1.organizations.CreateOrganizationSessionSettingsResponse"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationSessionSettings session_settings = 3;
     */
    sessionSettings?: OrganizationSessionSettings;
};
/**
 * Describes the message scalekit.v1.organizations.CreateOrganizationSessionSettingsResponse.
 * Use `create(CreateOrganizationSessionSettingsResponseSchema)` to create a new message.
 */
export declare const CreateOrganizationSessionSettingsResponseSchema: GenMessage<CreateOrganizationSessionSettingsResponse>;
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationSessionSettingsResponse
 */
export type GetOrganizationSessionSettingsResponse = Message<"scalekit.v1.organizations.GetOrganizationSessionSettingsResponse"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationSessionSettings session_settings = 3;
     */
    sessionSettings?: OrganizationSessionSettings;
};
/**
 * Describes the message scalekit.v1.organizations.GetOrganizationSessionSettingsResponse.
 * Use `create(GetOrganizationSessionSettingsResponseSchema)` to create a new message.
 */
export declare const GetOrganizationSessionSettingsResponseSchema: GenMessage<GetOrganizationSessionSettingsResponse>;
/**
 * @generated from message scalekit.v1.organizations.DeleteOrganizationSessionSettingsRequest
 */
export type DeleteOrganizationSessionSettingsRequest = Message<"scalekit.v1.organizations.DeleteOrganizationSessionSettingsRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string environment_id = 2;
     */
    environmentId: string;
};
/**
 * Describes the message scalekit.v1.organizations.DeleteOrganizationSessionSettingsRequest.
 * Use `create(DeleteOrganizationSessionSettingsRequestSchema)` to create a new message.
 */
export declare const DeleteOrganizationSessionSettingsRequestSchema: GenMessage<DeleteOrganizationSessionSettingsRequest>;
/**
 * @generated from message scalekit.v1.organizations.OrganizationSettings
 */
export type OrganizationSettings = Message<"scalekit.v1.organizations.OrganizationSettings"> & {
    /**
     * @generated from field: repeated scalekit.v1.organizations.OrganizationSettingsFeature features = 1;
     */
    features: OrganizationSettingsFeature[];
};
/**
 * Describes the message scalekit.v1.organizations.OrganizationSettings.
 * Use `create(OrganizationSettingsSchema)` to create a new message.
 */
export declare const OrganizationSettingsSchema: GenMessage<OrganizationSettings>;
/**
 * @generated from message scalekit.v1.organizations.OrganizationSettingsFeature
 */
export type OrganizationSettingsFeature = Message<"scalekit.v1.organizations.OrganizationSettingsFeature"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: bool enabled = 2;
     */
    enabled: boolean;
};
/**
 * Describes the message scalekit.v1.organizations.OrganizationSettingsFeature.
 * Use `create(OrganizationSettingsFeatureSchema)` to create a new message.
 */
export declare const OrganizationSettingsFeatureSchema: GenMessage<OrganizationSettingsFeature>;
/**
 * @generated from message scalekit.v1.organizations.UpsertUserManagementSettingsRequest
 */
export type UpsertUserManagementSettingsRequest = Message<"scalekit.v1.organizations.UpsertUserManagementSettingsRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationUserManagementSettings settings = 2;
     */
    settings?: OrganizationUserManagementSettings;
};
/**
 * Describes the message scalekit.v1.organizations.UpsertUserManagementSettingsRequest.
 * Use `create(UpsertUserManagementSettingsRequestSchema)` to create a new message.
 */
export declare const UpsertUserManagementSettingsRequestSchema: GenMessage<UpsertUserManagementSettingsRequest>;
/**
 * @generated from message scalekit.v1.organizations.UpsertUserManagementSettingsResponse
 */
export type UpsertUserManagementSettingsResponse = Message<"scalekit.v1.organizations.UpsertUserManagementSettingsResponse"> & {
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationUserManagementSettings settings = 1;
     */
    settings?: OrganizationUserManagementSettings;
};
/**
 * Describes the message scalekit.v1.organizations.UpsertUserManagementSettingsResponse.
 * Use `create(UpsertUserManagementSettingsResponseSchema)` to create a new message.
 */
export declare const UpsertUserManagementSettingsResponseSchema: GenMessage<UpsertUserManagementSettingsResponse>;
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationUserManagementSettingsRequest
 */
export type GetOrganizationUserManagementSettingsRequest = Message<"scalekit.v1.organizations.GetOrganizationUserManagementSettingsRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
};
/**
 * Describes the message scalekit.v1.organizations.GetOrganizationUserManagementSettingsRequest.
 * Use `create(GetOrganizationUserManagementSettingsRequestSchema)` to create a new message.
 */
export declare const GetOrganizationUserManagementSettingsRequestSchema: GenMessage<GetOrganizationUserManagementSettingsRequest>;
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationUserManagementSettingsResponse
 */
export type GetOrganizationUserManagementSettingsResponse = Message<"scalekit.v1.organizations.GetOrganizationUserManagementSettingsResponse"> & {
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationUserManagementSettings settings = 1;
     */
    settings?: OrganizationUserManagementSettings;
};
/**
 * Describes the message scalekit.v1.organizations.GetOrganizationUserManagementSettingsResponse.
 * Use `create(GetOrganizationUserManagementSettingsResponseSchema)` to create a new message.
 */
export declare const GetOrganizationUserManagementSettingsResponseSchema: GenMessage<GetOrganizationUserManagementSettingsResponse>;
/**
 * Feature represents the available features that can be enabled for an organization's portal link
 *
 * @generated from enum scalekit.v1.organizations.Feature
 */
export declare enum Feature {
    /**
     * An unspecified or invalid feature value
     *
     * @generated from enum value: FEATURE_UNSPECIFIED = 0;
     */
    FEATURE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: UNSPECIFIED = 0 [deprecated = true];
     * @deprecated
     */
    UNSPECIFIED = 0,
    /**
     * Enables directory synchronization configuration in the portal
     *
     * @generated from enum value: dir_sync = 1;
     */
    dir_sync = 1,
    /**
     * Enables Single Sign-On (SSO) configuration in the portal
     *
     * @generated from enum value: sso = 2;
     */
    sso = 2
}
/**
 * Describes the enum scalekit.v1.organizations.Feature.
 */
export declare const FeatureSchema: GenEnum<Feature>;
/**
 * @generated from service scalekit.v1.organizations.OrganizationService
 */
export declare const OrganizationService: GenService<{
    /**
     * Create Organization
     *
     * @generated from rpc scalekit.v1.organizations.OrganizationService.CreateOrganization
     */
    createOrganization: {
        methodKind: "unary";
        input: typeof CreateOrganizationRequestSchema;
        output: typeof CreateOrganizationResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.UpdateOrganization
     */
    updateOrganization: {
        methodKind: "unary";
        input: typeof UpdateOrganizationRequestSchema;
        output: typeof UpdateOrganizationResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.GetOrganization
     */
    getOrganization: {
        methodKind: "unary";
        input: typeof GetOrganizationRequestSchema;
        output: typeof GetOrganizationResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.ListOrganization
     */
    listOrganization: {
        methodKind: "unary";
        input: typeof ListOrganizationsRequestSchema;
        output: typeof ListOrganizationsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.SearchOrganization
     */
    searchOrganization: {
        methodKind: "unary";
        input: typeof SearchOrganizationsRequestSchema;
        output: typeof SearchOrganizationsResponseSchema;
    };
    /**
     * Delete an Organization
     *
     * @generated from rpc scalekit.v1.organizations.OrganizationService.DeleteOrganization
     */
    deleteOrganization: {
        methodKind: "unary";
        input: typeof DeleteOrganizationRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * Generate Portal Link for Org
     *
     * @generated from rpc scalekit.v1.organizations.OrganizationService.GeneratePortalLink
     */
    generatePortalLink: {
        methodKind: "unary";
        input: typeof GeneratePortalLinkRequestSchema;
        output: typeof GeneratePortalLinkResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.DeletePortalLink
     */
    deletePortalLink: {
        methodKind: "unary";
        input: typeof DeletePortalLinkRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.DeletePortalLinkByID
     */
    deletePortalLinkByID: {
        methodKind: "unary";
        input: typeof DeletePortalLinkByIdRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.GetPortalLinks
     */
    getPortalLinks: {
        methodKind: "unary";
        input: typeof GetPortalLinkRequestSchema;
        output: typeof GetPortalLinksResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.UpdateOrganizationSettings
     */
    updateOrganizationSettings: {
        methodKind: "unary";
        input: typeof UpdateOrganizationSettingsRequestSchema;
        output: typeof GetOrganizationResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.CreateOrganizationSessionSettings
     */
    createOrganizationSessionSettings: {
        methodKind: "unary";
        input: typeof CreateOrganizationSessionSettingsRequestSchema;
        output: typeof CreateOrganizationSessionSettingsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.GetOrganizationSessionSettings
     */
    getOrganizationSessionSettings: {
        methodKind: "unary";
        input: typeof GetOrganizationSessionSettingsRequestSchema;
        output: typeof GetOrganizationSessionSettingsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.UpdateOrganizationSessionSettings
     */
    updateOrganizationSessionSettings: {
        methodKind: "unary";
        input: typeof UpdateOrganizationSessionSettingsRequestSchema;
        output: typeof UpdateOrganizationSessionSettingsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.DeleteOrganizationSessionSettings
     */
    deleteOrganizationSessionSettings: {
        methodKind: "unary";
        input: typeof DeleteOrganizationSessionSettingsRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * Update user management setting for an organization
     *
     * @generated from rpc scalekit.v1.organizations.OrganizationService.UpsertUserManagementSettings
     */
    upsertUserManagementSettings: {
        methodKind: "unary";
        input: typeof UpsertUserManagementSettingsRequestSchema;
        output: typeof UpsertUserManagementSettingsResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.GetOrganizationUserManagementSetting
     */
    getOrganizationUserManagementSetting: {
        methodKind: "unary";
        input: typeof GetOrganizationUserManagementSettingsRequestSchema;
        output: typeof GetOrganizationUserManagementSettingsResponseSchema;
    };
}>;
