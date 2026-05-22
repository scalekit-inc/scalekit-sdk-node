import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, FieldMask, Timestamp } from "@bufbuild/protobuf/wkt";
import type { RegionCode, TimeUnit } from "../commons/commons_pb";
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
    /**
     * @generated from field: optional string slug = 9;
     */
    slug?: string;
    /**
     * @generated from field: optional string logo_url = 10;
     */
    logoUrl?: string;
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
    /**
     * @generated from field: optional string slug = 9;
     */
    slug?: string;
    /**
     * @generated from field: optional string logo_url = 10;
     */
    logoUrl?: string;
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
    /**
     * @generated from field: optional string slug = 9;
     */
    slug?: string;
    /**
     * @generated from field: optional string logo_url = 10;
     */
    logoUrl?: string;
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
 * @generated from message scalekit.v1.organizations.OrganizationSessionPolicySettings
 */
export type OrganizationSessionPolicySettings = Message<"scalekit.v1.organizations.OrganizationSessionPolicySettings"> & {
    /**
     * @generated from field: scalekit.v1.organizations.SessionPolicyType policy_source = 1;
     */
    policySource: SessionPolicyType;
    /**
     * Timeout value interpreted with absolute_session_timeout_unit on write; always returned in minutes on read.
     *
     * @generated from field: google.protobuf.Int32Value absolute_session_timeout = 2;
     */
    absoluteSessionTimeout?: number;
    /**
     * Unit for absolute_session_timeout: "minutes", "hours", or "days". Responses always use "minutes".
     *
     * @generated from field: optional scalekit.v1.commons.TimeUnit absolute_session_timeout_unit = 3;
     */
    absoluteSessionTimeoutUnit?: TimeUnit;
    /**
     * @generated from field: google.protobuf.BoolValue idle_session_timeout_enabled = 4;
     */
    idleSessionTimeoutEnabled?: boolean;
    /**
     * Timeout value interpreted with idle_session_timeout_unit on write; always returned in minutes on read.
     *
     * @generated from field: google.protobuf.Int32Value idle_session_timeout = 5;
     */
    idleSessionTimeout?: number;
    /**
     * Unit for idle_session_timeout: "minutes", "hours", or "days". Responses always use "minutes".
     *
     * @generated from field: optional scalekit.v1.commons.TimeUnit idle_session_timeout_unit = 6;
     */
    idleSessionTimeoutUnit?: TimeUnit;
};
/**
 * Describes the message scalekit.v1.organizations.OrganizationSessionPolicySettings.
 * Use `create(OrganizationSessionPolicySettingsSchema)` to create a new message.
 */
export declare const OrganizationSessionPolicySettingsSchema: GenMessage<OrganizationSessionPolicySettings>;
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationSessionPolicyRequest
 */
export type GetOrganizationSessionPolicyRequest = Message<"scalekit.v1.organizations.GetOrganizationSessionPolicyRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
};
/**
 * Describes the message scalekit.v1.organizations.GetOrganizationSessionPolicyRequest.
 * Use `create(GetOrganizationSessionPolicyRequestSchema)` to create a new message.
 */
export declare const GetOrganizationSessionPolicyRequestSchema: GenMessage<GetOrganizationSessionPolicyRequest>;
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationSessionPolicyResponse
 */
export type GetOrganizationSessionPolicyResponse = Message<"scalekit.v1.organizations.GetOrganizationSessionPolicyResponse"> & {
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationSessionPolicySettings policy = 1;
     */
    policy?: OrganizationSessionPolicySettings;
};
/**
 * Describes the message scalekit.v1.organizations.GetOrganizationSessionPolicyResponse.
 * Use `create(GetOrganizationSessionPolicyResponseSchema)` to create a new message.
 */
export declare const GetOrganizationSessionPolicyResponseSchema: GenMessage<GetOrganizationSessionPolicyResponse>;
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationSessionPolicyRequest
 */
export type UpdateOrganizationSessionPolicyRequest = Message<"scalekit.v1.organizations.UpdateOrganizationSessionPolicyRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.organizations.SessionPolicyType policy_source = 2;
     */
    policySource: SessionPolicyType;
    /**
     * @generated from field: google.protobuf.Int32Value absolute_session_timeout = 3;
     */
    absoluteSessionTimeout?: number;
    /**
     * @generated from field: optional scalekit.v1.commons.TimeUnit absolute_session_timeout_unit = 4;
     */
    absoluteSessionTimeoutUnit?: TimeUnit;
    /**
     * @generated from field: google.protobuf.BoolValue idle_session_timeout_enabled = 5;
     */
    idleSessionTimeoutEnabled?: boolean;
    /**
     * @generated from field: google.protobuf.Int32Value idle_session_timeout = 6;
     */
    idleSessionTimeout?: number;
    /**
     * @generated from field: optional scalekit.v1.commons.TimeUnit idle_session_timeout_unit = 7;
     */
    idleSessionTimeoutUnit?: TimeUnit;
};
/**
 * Describes the message scalekit.v1.organizations.UpdateOrganizationSessionPolicyRequest.
 * Use `create(UpdateOrganizationSessionPolicyRequestSchema)` to create a new message.
 */
export declare const UpdateOrganizationSessionPolicyRequestSchema: GenMessage<UpdateOrganizationSessionPolicyRequest>;
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationSessionPolicyResponse
 */
export type UpdateOrganizationSessionPolicyResponse = Message<"scalekit.v1.organizations.UpdateOrganizationSessionPolicyResponse"> & {
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationSessionPolicySettings policy = 1;
     */
    policy?: OrganizationSessionPolicySettings;
};
/**
 * Describes the message scalekit.v1.organizations.UpdateOrganizationSessionPolicyResponse.
 * Use `create(UpdateOrganizationSessionPolicyResponseSchema)` to create a new message.
 */
export declare const UpdateOrganizationSessionPolicyResponseSchema: GenMessage<UpdateOrganizationSessionPolicyResponse>;
/**
 * @generated from message scalekit.v1.organizations.GetApplicationSessionPolicyRequest
 */
export type GetApplicationSessionPolicyRequest = Message<"scalekit.v1.organizations.GetApplicationSessionPolicyRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
};
/**
 * Describes the message scalekit.v1.organizations.GetApplicationSessionPolicyRequest.
 * Use `create(GetApplicationSessionPolicyRequestSchema)` to create a new message.
 */
export declare const GetApplicationSessionPolicyRequestSchema: GenMessage<GetApplicationSessionPolicyRequest>;
/**
 * @generated from message scalekit.v1.organizations.ApplicationSessionPolicySettings
 */
export type ApplicationSessionPolicySettings = Message<"scalekit.v1.organizations.ApplicationSessionPolicySettings"> & {
    /**
     * @generated from field: int32 absolute_session_timeout = 1;
     */
    absoluteSessionTimeout: number;
    /**
     * @generated from field: bool idle_session_timeout_enabled = 2;
     */
    idleSessionTimeoutEnabled: boolean;
    /**
     * @generated from field: int32 idle_session_timeout = 3;
     */
    idleSessionTimeout: number;
    /**
     * @generated from field: int32 access_token_expiry = 4;
     */
    accessTokenExpiry: number;
    /**
     * @generated from field: optional scalekit.v1.commons.TimeUnit absolute_session_timeout_unit = 5;
     */
    absoluteSessionTimeoutUnit?: TimeUnit;
    /**
     * @generated from field: optional scalekit.v1.commons.TimeUnit idle_session_timeout_unit = 6;
     */
    idleSessionTimeoutUnit?: TimeUnit;
};
/**
 * Describes the message scalekit.v1.organizations.ApplicationSessionPolicySettings.
 * Use `create(ApplicationSessionPolicySettingsSchema)` to create a new message.
 */
export declare const ApplicationSessionPolicySettingsSchema: GenMessage<ApplicationSessionPolicySettings>;
/**
 * @generated from message scalekit.v1.organizations.GetApplicationSessionPolicyResponse
 */
export type GetApplicationSessionPolicyResponse = Message<"scalekit.v1.organizations.GetApplicationSessionPolicyResponse"> & {
    /**
     * @generated from field: scalekit.v1.organizations.ApplicationSessionPolicySettings application_policy = 1;
     */
    applicationPolicy?: ApplicationSessionPolicySettings;
};
/**
 * Describes the message scalekit.v1.organizations.GetApplicationSessionPolicyResponse.
 * Use `create(GetApplicationSessionPolicyResponseSchema)` to create a new message.
 */
export declare const GetApplicationSessionPolicyResponseSchema: GenMessage<GetApplicationSessionPolicyResponse>;
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
     * @generated from field: google.protobuf.Int32Value idle_session_timeout = 3;
     */
    idleSessionTimeout?: number;
    /**
     * Whether idle session timeout is enabled for this organization.
     * Effective idle timeout is enabled if either the environment or any organization with SESSION_POLICY_CUSTOM has it enabled.
     *
     * @generated from field: google.protobuf.BoolValue idle_session_timeout_enabled = 5;
     */
    idleSessionTimeoutEnabled?: boolean;
    /**
     * APPLICATION (default) = inherit application-level policy; CUSTOM = org-specific values are active.
     *
     * @generated from field: string policy_source = 6;
     */
    policySource: string;
};
/**
 * Describes the message scalekit.v1.organizations.OrganizationSessionSettings.
 * Use `create(OrganizationSessionSettingsSchema)` to create a new message.
 */
export declare const OrganizationSessionSettingsSchema: GenMessage<OrganizationSessionSettings>;
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
 * @generated from enum scalekit.v1.organizations.SessionPolicyType
 */
export declare enum SessionPolicyType {
    /**
     * @generated from enum value: SESSION_POLICY_TYPE_UNSPECIFIED = 0;
     */
    SESSION_POLICY_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: APPLICATION = 1;
     */
    APPLICATION = 1,
    /**
     * @generated from enum value: CUSTOM = 2;
     */
    CUSTOM = 2
}
/**
 * Describes the enum scalekit.v1.organizations.SessionPolicyType.
 */
export declare const SessionPolicyTypeSchema: GenEnum<SessionPolicyType>;
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
     * @generated from rpc scalekit.v1.organizations.OrganizationService.GetOrganizationByExternalId
     */
    getOrganizationByExternalId: {
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
     * @generated from rpc scalekit.v1.organizations.OrganizationService.UpdateOrganizationSessionPolicy
     */
    updateOrganizationSessionPolicy: {
        methodKind: "unary";
        input: typeof UpdateOrganizationSessionPolicyRequestSchema;
        output: typeof UpdateOrganizationSessionPolicyResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.GetOrganizationSessionPolicy
     */
    getOrganizationSessionPolicy: {
        methodKind: "unary";
        input: typeof GetOrganizationSessionPolicyRequestSchema;
        output: typeof GetOrganizationSessionPolicyResponseSchema;
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
    /**
     * @generated from rpc scalekit.v1.organizations.OrganizationService.GetApplicationSessionPolicy
     */
    getApplicationSessionPolicy: {
        methodKind: "unary";
        input: typeof GetApplicationSessionPolicyRequestSchema;
        output: typeof GetApplicationSessionPolicyResponseSchema;
    };
}>;
