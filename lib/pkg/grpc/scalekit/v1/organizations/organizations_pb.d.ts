import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { FieldMask, Message, proto3, Timestamp } from "@bufbuild/protobuf";
import { RegionCode } from "../commons/commons_pb.js";
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
 * @generated from message scalekit.v1.organizations.CreateOrganizationRequest
 */
export declare class CreateOrganizationRequest extends Message<CreateOrganizationRequest> {
    /**
     * Organization details
     *
     * @generated from field: scalekit.v1.organizations.CreateOrganization organization = 1;
     */
    organization?: CreateOrganization;
    constructor(data?: PartialMessage<CreateOrganizationRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.CreateOrganizationRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateOrganizationRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateOrganizationRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateOrganizationRequest;
    static equals(a: CreateOrganizationRequest | PlainMessage<CreateOrganizationRequest> | undefined, b: CreateOrganizationRequest | PlainMessage<CreateOrganizationRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.CreateOrganizationResponse
 */
export declare class CreateOrganizationResponse extends Message<CreateOrganizationResponse> {
    /**
     * @generated from field: scalekit.v1.organizations.Organization organization = 1;
     */
    organization?: Organization;
    constructor(data?: PartialMessage<CreateOrganizationResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.CreateOrganizationResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateOrganizationResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateOrganizationResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateOrganizationResponse;
    static equals(a: CreateOrganizationResponse | PlainMessage<CreateOrganizationResponse> | undefined, b: CreateOrganizationResponse | PlainMessage<CreateOrganizationResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.CreateOrganization
 */
export declare class CreateOrganization extends Message<CreateOrganization> {
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
    constructor(data?: PartialMessage<CreateOrganization>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.CreateOrganization";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateOrganization;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateOrganization;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateOrganization;
    static equals(a: CreateOrganization | PlainMessage<CreateOrganization> | undefined, b: CreateOrganization | PlainMessage<CreateOrganization> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.Organization
 */
export declare class Organization extends Message<Organization> {
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
    constructor(data?: PartialMessage<Organization>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.Organization";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Organization;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Organization;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Organization;
    static equals(a: Organization | PlainMessage<Organization> | undefined, b: Organization | PlainMessage<Organization> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationRequest
 */
export declare class UpdateOrganizationRequest extends Message<UpdateOrganizationRequest> {
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
    constructor(data?: PartialMessage<UpdateOrganizationRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.UpdateOrganizationRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateOrganizationRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateOrganizationRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateOrganizationRequest;
    static equals(a: UpdateOrganizationRequest | PlainMessage<UpdateOrganizationRequest> | undefined, b: UpdateOrganizationRequest | PlainMessage<UpdateOrganizationRequest> | undefined): boolean;
}
/**
 * For update messages ensure the indexes are same as the base model itself.
 *
 * @generated from message scalekit.v1.organizations.UpdateOrganization
 */
export declare class UpdateOrganization extends Message<UpdateOrganization> {
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
    constructor(data?: PartialMessage<UpdateOrganization>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.UpdateOrganization";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateOrganization;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateOrganization;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateOrganization;
    static equals(a: UpdateOrganization | PlainMessage<UpdateOrganization> | undefined, b: UpdateOrganization | PlainMessage<UpdateOrganization> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationResponse
 */
export declare class UpdateOrganizationResponse extends Message<UpdateOrganizationResponse> {
    /**
     * @generated from field: scalekit.v1.organizations.Organization organization = 1;
     */
    organization?: Organization;
    constructor(data?: PartialMessage<UpdateOrganizationResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.UpdateOrganizationResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateOrganizationResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateOrganizationResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateOrganizationResponse;
    static equals(a: UpdateOrganizationResponse | PlainMessage<UpdateOrganizationResponse> | undefined, b: UpdateOrganizationResponse | PlainMessage<UpdateOrganizationResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationRequest
 */
export declare class GetOrganizationRequest extends Message<GetOrganizationRequest> {
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
    constructor(data?: PartialMessage<GetOrganizationRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GetOrganizationRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationRequest;
    static equals(a: GetOrganizationRequest | PlainMessage<GetOrganizationRequest> | undefined, b: GetOrganizationRequest | PlainMessage<GetOrganizationRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationResponse
 */
export declare class GetOrganizationResponse extends Message<GetOrganizationResponse> {
    /**
     * @generated from field: scalekit.v1.organizations.Organization organization = 1;
     */
    organization?: Organization;
    constructor(data?: PartialMessage<GetOrganizationResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GetOrganizationResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationResponse;
    static equals(a: GetOrganizationResponse | PlainMessage<GetOrganizationResponse> | undefined, b: GetOrganizationResponse | PlainMessage<GetOrganizationResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.ListOrganizationsRequest
 */
export declare class ListOrganizationsRequest extends Message<ListOrganizationsRequest> {
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
    constructor(data?: PartialMessage<ListOrganizationsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.ListOrganizationsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListOrganizationsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListOrganizationsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListOrganizationsRequest;
    static equals(a: ListOrganizationsRequest | PlainMessage<ListOrganizationsRequest> | undefined, b: ListOrganizationsRequest | PlainMessage<ListOrganizationsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.ListOrganizationsResponse
 */
export declare class ListOrganizationsResponse extends Message<ListOrganizationsResponse> {
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
    constructor(data?: PartialMessage<ListOrganizationsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.ListOrganizationsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListOrganizationsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListOrganizationsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListOrganizationsResponse;
    static equals(a: ListOrganizationsResponse | PlainMessage<ListOrganizationsResponse> | undefined, b: ListOrganizationsResponse | PlainMessage<ListOrganizationsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.SearchOrganizationsRequest
 */
export declare class SearchOrganizationsRequest extends Message<SearchOrganizationsRequest> {
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
    constructor(data?: PartialMessage<SearchOrganizationsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.SearchOrganizationsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchOrganizationsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchOrganizationsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchOrganizationsRequest;
    static equals(a: SearchOrganizationsRequest | PlainMessage<SearchOrganizationsRequest> | undefined, b: SearchOrganizationsRequest | PlainMessage<SearchOrganizationsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.SearchOrganizationsResponse
 */
export declare class SearchOrganizationsResponse extends Message<SearchOrganizationsResponse> {
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
    constructor(data?: PartialMessage<SearchOrganizationsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.SearchOrganizationsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchOrganizationsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchOrganizationsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchOrganizationsResponse;
    static equals(a: SearchOrganizationsResponse | PlainMessage<SearchOrganizationsResponse> | undefined, b: SearchOrganizationsResponse | PlainMessage<SearchOrganizationsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.DeleteOrganizationRequest
 */
export declare class DeleteOrganizationRequest extends Message<DeleteOrganizationRequest> {
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
    constructor(data?: PartialMessage<DeleteOrganizationRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.DeleteOrganizationRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteOrganizationRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteOrganizationRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteOrganizationRequest;
    static equals(a: DeleteOrganizationRequest | PlainMessage<DeleteOrganizationRequest> | undefined, b: DeleteOrganizationRequest | PlainMessage<DeleteOrganizationRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GeneratePortalLinkRequest
 */
export declare class GeneratePortalLinkRequest extends Message<GeneratePortalLinkRequest> {
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
    constructor(data?: PartialMessage<GeneratePortalLinkRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GeneratePortalLinkRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GeneratePortalLinkRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GeneratePortalLinkRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GeneratePortalLinkRequest;
    static equals(a: GeneratePortalLinkRequest | PlainMessage<GeneratePortalLinkRequest> | undefined, b: GeneratePortalLinkRequest | PlainMessage<GeneratePortalLinkRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GetPortalLinkRequest
 */
export declare class GetPortalLinkRequest extends Message<GetPortalLinkRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    constructor(data?: PartialMessage<GetPortalLinkRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GetPortalLinkRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetPortalLinkRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetPortalLinkRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetPortalLinkRequest;
    static equals(a: GetPortalLinkRequest | PlainMessage<GetPortalLinkRequest> | undefined, b: GetPortalLinkRequest | PlainMessage<GetPortalLinkRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.DeletePortalLinkRequest
 */
export declare class DeletePortalLinkRequest extends Message<DeletePortalLinkRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    constructor(data?: PartialMessage<DeletePortalLinkRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.DeletePortalLinkRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeletePortalLinkRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeletePortalLinkRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeletePortalLinkRequest;
    static equals(a: DeletePortalLinkRequest | PlainMessage<DeletePortalLinkRequest> | undefined, b: DeletePortalLinkRequest | PlainMessage<DeletePortalLinkRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.DeletePortalLinkByIdRequest
 */
export declare class DeletePortalLinkByIdRequest extends Message<DeletePortalLinkByIdRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string link_id = 2;
     */
    linkId: string;
    constructor(data?: PartialMessage<DeletePortalLinkByIdRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.DeletePortalLinkByIdRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeletePortalLinkByIdRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeletePortalLinkByIdRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeletePortalLinkByIdRequest;
    static equals(a: DeletePortalLinkByIdRequest | PlainMessage<DeletePortalLinkByIdRequest> | undefined, b: DeletePortalLinkByIdRequest | PlainMessage<DeletePortalLinkByIdRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.Link
 */
export declare class Link extends Message<Link> {
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
    constructor(data?: PartialMessage<Link>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.Link";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Link;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Link;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Link;
    static equals(a: Link | PlainMessage<Link> | undefined, b: Link | PlainMessage<Link> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GeneratePortalLinkResponse
 */
export declare class GeneratePortalLinkResponse extends Message<GeneratePortalLinkResponse> {
    /**
     * @generated from field: scalekit.v1.organizations.Link link = 1;
     */
    link?: Link;
    constructor(data?: PartialMessage<GeneratePortalLinkResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GeneratePortalLinkResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GeneratePortalLinkResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GeneratePortalLinkResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GeneratePortalLinkResponse;
    static equals(a: GeneratePortalLinkResponse | PlainMessage<GeneratePortalLinkResponse> | undefined, b: GeneratePortalLinkResponse | PlainMessage<GeneratePortalLinkResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GetPortalLinksResponse
 */
export declare class GetPortalLinksResponse extends Message<GetPortalLinksResponse> {
    /**
     * @generated from field: repeated scalekit.v1.organizations.Link links = 1;
     */
    links: Link[];
    constructor(data?: PartialMessage<GetPortalLinksResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GetPortalLinksResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetPortalLinksResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetPortalLinksResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetPortalLinksResponse;
    static equals(a: GetPortalLinksResponse | PlainMessage<GetPortalLinksResponse> | undefined, b: GetPortalLinksResponse | PlainMessage<GetPortalLinksResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationSettingsRequest
 */
export declare class UpdateOrganizationSettingsRequest extends Message<UpdateOrganizationSettingsRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationSettings settings = 2;
     */
    settings?: OrganizationSettings;
    constructor(data?: PartialMessage<UpdateOrganizationSettingsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.UpdateOrganizationSettingsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateOrganizationSettingsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateOrganizationSettingsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateOrganizationSettingsRequest;
    static equals(a: UpdateOrganizationSettingsRequest | PlainMessage<UpdateOrganizationSettingsRequest> | undefined, b: UpdateOrganizationSettingsRequest | PlainMessage<UpdateOrganizationSettingsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationSessionSettingsRequest
 */
export declare class UpdateOrganizationSessionSettingsRequest extends Message<UpdateOrganizationSessionSettingsRequest> {
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
    constructor(data?: PartialMessage<UpdateOrganizationSessionSettingsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.UpdateOrganizationSessionSettingsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateOrganizationSessionSettingsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateOrganizationSessionSettingsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateOrganizationSessionSettingsRequest;
    static equals(a: UpdateOrganizationSessionSettingsRequest | PlainMessage<UpdateOrganizationSessionSettingsRequest> | undefined, b: UpdateOrganizationSessionSettingsRequest | PlainMessage<UpdateOrganizationSessionSettingsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.UpdateOrganizationSessionSettingsResponse
 */
export declare class UpdateOrganizationSessionSettingsResponse extends Message<UpdateOrganizationSessionSettingsResponse> {
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
    constructor(data?: PartialMessage<UpdateOrganizationSessionSettingsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.UpdateOrganizationSessionSettingsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateOrganizationSessionSettingsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateOrganizationSessionSettingsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateOrganizationSessionSettingsResponse;
    static equals(a: UpdateOrganizationSessionSettingsResponse | PlainMessage<UpdateOrganizationSessionSettingsResponse> | undefined, b: UpdateOrganizationSessionSettingsResponse | PlainMessage<UpdateOrganizationSessionSettingsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.OrganizationUserManagementSettings
 */
export declare class OrganizationUserManagementSettings extends Message<OrganizationUserManagementSettings> {
    /**
     * @generated from field: google.protobuf.Int32Value max_allowed_users = 1;
     */
    maxAllowedUsers?: number;
    constructor(data?: PartialMessage<OrganizationUserManagementSettings>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.OrganizationUserManagementSettings";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OrganizationUserManagementSettings;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OrganizationUserManagementSettings;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OrganizationUserManagementSettings;
    static equals(a: OrganizationUserManagementSettings | PlainMessage<OrganizationUserManagementSettings> | undefined, b: OrganizationUserManagementSettings | PlainMessage<OrganizationUserManagementSettings> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.OrganizationSessionSettings
 */
export declare class OrganizationSessionSettings extends Message<OrganizationSessionSettings> {
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
    constructor(data?: PartialMessage<OrganizationSessionSettings>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.OrganizationSessionSettings";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OrganizationSessionSettings;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OrganizationSessionSettings;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OrganizationSessionSettings;
    static equals(a: OrganizationSessionSettings | PlainMessage<OrganizationSessionSettings> | undefined, b: OrganizationSessionSettings | PlainMessage<OrganizationSessionSettings> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationSessionSettingsRequest
 */
export declare class GetOrganizationSessionSettingsRequest extends Message<GetOrganizationSessionSettingsRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string environment_id = 2;
     */
    environmentId: string;
    constructor(data?: PartialMessage<GetOrganizationSessionSettingsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GetOrganizationSessionSettingsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationSessionSettingsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationSessionSettingsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationSessionSettingsRequest;
    static equals(a: GetOrganizationSessionSettingsRequest | PlainMessage<GetOrganizationSessionSettingsRequest> | undefined, b: GetOrganizationSessionSettingsRequest | PlainMessage<GetOrganizationSessionSettingsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.CreateOrganizationSessionSettingsRequest
 */
export declare class CreateOrganizationSessionSettingsRequest extends Message<CreateOrganizationSessionSettingsRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string environment_id = 2;
     */
    environmentId: string;
    constructor(data?: PartialMessage<CreateOrganizationSessionSettingsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.CreateOrganizationSessionSettingsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateOrganizationSessionSettingsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateOrganizationSessionSettingsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateOrganizationSessionSettingsRequest;
    static equals(a: CreateOrganizationSessionSettingsRequest | PlainMessage<CreateOrganizationSessionSettingsRequest> | undefined, b: CreateOrganizationSessionSettingsRequest | PlainMessage<CreateOrganizationSessionSettingsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.CreateOrganizationSessionSettingsResponse
 */
export declare class CreateOrganizationSessionSettingsResponse extends Message<CreateOrganizationSessionSettingsResponse> {
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
    constructor(data?: PartialMessage<CreateOrganizationSessionSettingsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.CreateOrganizationSessionSettingsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateOrganizationSessionSettingsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateOrganizationSessionSettingsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateOrganizationSessionSettingsResponse;
    static equals(a: CreateOrganizationSessionSettingsResponse | PlainMessage<CreateOrganizationSessionSettingsResponse> | undefined, b: CreateOrganizationSessionSettingsResponse | PlainMessage<CreateOrganizationSessionSettingsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationSessionSettingsResponse
 */
export declare class GetOrganizationSessionSettingsResponse extends Message<GetOrganizationSessionSettingsResponse> {
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
    constructor(data?: PartialMessage<GetOrganizationSessionSettingsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GetOrganizationSessionSettingsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationSessionSettingsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationSessionSettingsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationSessionSettingsResponse;
    static equals(a: GetOrganizationSessionSettingsResponse | PlainMessage<GetOrganizationSessionSettingsResponse> | undefined, b: GetOrganizationSessionSettingsResponse | PlainMessage<GetOrganizationSessionSettingsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.DeleteOrganizationSessionSettingsRequest
 */
export declare class DeleteOrganizationSessionSettingsRequest extends Message<DeleteOrganizationSessionSettingsRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string environment_id = 2;
     */
    environmentId: string;
    constructor(data?: PartialMessage<DeleteOrganizationSessionSettingsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.DeleteOrganizationSessionSettingsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteOrganizationSessionSettingsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteOrganizationSessionSettingsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteOrganizationSessionSettingsRequest;
    static equals(a: DeleteOrganizationSessionSettingsRequest | PlainMessage<DeleteOrganizationSessionSettingsRequest> | undefined, b: DeleteOrganizationSessionSettingsRequest | PlainMessage<DeleteOrganizationSessionSettingsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.OrganizationSettings
 */
export declare class OrganizationSettings extends Message<OrganizationSettings> {
    /**
     * @generated from field: repeated scalekit.v1.organizations.OrganizationSettingsFeature features = 1;
     */
    features: OrganizationSettingsFeature[];
    constructor(data?: PartialMessage<OrganizationSettings>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.OrganizationSettings";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OrganizationSettings;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OrganizationSettings;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OrganizationSettings;
    static equals(a: OrganizationSettings | PlainMessage<OrganizationSettings> | undefined, b: OrganizationSettings | PlainMessage<OrganizationSettings> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.OrganizationSettingsFeature
 */
export declare class OrganizationSettingsFeature extends Message<OrganizationSettingsFeature> {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: bool enabled = 2;
     */
    enabled: boolean;
    constructor(data?: PartialMessage<OrganizationSettingsFeature>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.OrganizationSettingsFeature";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OrganizationSettingsFeature;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OrganizationSettingsFeature;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OrganizationSettingsFeature;
    static equals(a: OrganizationSettingsFeature | PlainMessage<OrganizationSettingsFeature> | undefined, b: OrganizationSettingsFeature | PlainMessage<OrganizationSettingsFeature> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.UpsertUserManagementSettingsRequest
 */
export declare class UpsertUserManagementSettingsRequest extends Message<UpsertUserManagementSettingsRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationUserManagementSettings settings = 2;
     */
    settings?: OrganizationUserManagementSettings;
    constructor(data?: PartialMessage<UpsertUserManagementSettingsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.UpsertUserManagementSettingsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpsertUserManagementSettingsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpsertUserManagementSettingsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpsertUserManagementSettingsRequest;
    static equals(a: UpsertUserManagementSettingsRequest | PlainMessage<UpsertUserManagementSettingsRequest> | undefined, b: UpsertUserManagementSettingsRequest | PlainMessage<UpsertUserManagementSettingsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.UpsertUserManagementSettingsResponse
 */
export declare class UpsertUserManagementSettingsResponse extends Message<UpsertUserManagementSettingsResponse> {
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationUserManagementSettings settings = 1;
     */
    settings?: OrganizationUserManagementSettings;
    constructor(data?: PartialMessage<UpsertUserManagementSettingsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.UpsertUserManagementSettingsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpsertUserManagementSettingsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpsertUserManagementSettingsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpsertUserManagementSettingsResponse;
    static equals(a: UpsertUserManagementSettingsResponse | PlainMessage<UpsertUserManagementSettingsResponse> | undefined, b: UpsertUserManagementSettingsResponse | PlainMessage<UpsertUserManagementSettingsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationUserManagementSettingsRequest
 */
export declare class GetOrganizationUserManagementSettingsRequest extends Message<GetOrganizationUserManagementSettingsRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    constructor(data?: PartialMessage<GetOrganizationUserManagementSettingsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GetOrganizationUserManagementSettingsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationUserManagementSettingsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationUserManagementSettingsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationUserManagementSettingsRequest;
    static equals(a: GetOrganizationUserManagementSettingsRequest | PlainMessage<GetOrganizationUserManagementSettingsRequest> | undefined, b: GetOrganizationUserManagementSettingsRequest | PlainMessage<GetOrganizationUserManagementSettingsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.organizations.GetOrganizationUserManagementSettingsResponse
 */
export declare class GetOrganizationUserManagementSettingsResponse extends Message<GetOrganizationUserManagementSettingsResponse> {
    /**
     * @generated from field: scalekit.v1.organizations.OrganizationUserManagementSettings settings = 1;
     */
    settings?: OrganizationUserManagementSettings;
    constructor(data?: PartialMessage<GetOrganizationUserManagementSettingsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.organizations.GetOrganizationUserManagementSettingsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetOrganizationUserManagementSettingsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetOrganizationUserManagementSettingsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetOrganizationUserManagementSettingsResponse;
    static equals(a: GetOrganizationUserManagementSettingsResponse | PlainMessage<GetOrganizationUserManagementSettingsResponse> | undefined, b: GetOrganizationUserManagementSettingsResponse | PlainMessage<GetOrganizationUserManagementSettingsResponse> | undefined): boolean;
}
