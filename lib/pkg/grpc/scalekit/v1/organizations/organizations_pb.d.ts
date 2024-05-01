import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { FieldMask, Message, proto3, Timestamp } from "@bufbuild/protobuf";
import { RegionCode } from "../commons/commons_pb.js";
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
