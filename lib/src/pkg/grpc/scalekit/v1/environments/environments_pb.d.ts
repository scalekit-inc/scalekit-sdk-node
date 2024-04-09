import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
import { EnvironmentType, RegionCode } from "../commons/commons_pb.js";
/**
 * @generated from enum scalekit.v1.environments.CustomDomainStatus
 */
export declare enum CustomDomainStatus {
    /**
     * @generated from enum value: UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: PENDING = 1;
     */
    PENDING = 1,
    /**
     * @generated from enum value: ACTIVE = 2;
     */
    ACTIVE = 2,
    /**
     * @generated from enum value: FAILED = 3;
     */
    FAILED = 3
}
/**
 * @generated from message scalekit.v1.environments.CreateCustomDomainRequest
 */
export declare class CreateCustomDomainRequest extends Message<CreateCustomDomainRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string custom_domain = 2;
     */
    customDomain: string;
    constructor(data?: PartialMessage<CreateCustomDomainRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.CreateCustomDomainRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateCustomDomainRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateCustomDomainRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateCustomDomainRequest;
    static equals(a: CreateCustomDomainRequest | PlainMessage<CreateCustomDomainRequest> | undefined, b: CreateCustomDomainRequest | PlainMessage<CreateCustomDomainRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.CreateCustomDomainResponse
 */
export declare class CreateCustomDomainResponse extends Message<CreateCustomDomainResponse> {
    /**
     * @generated from field: scalekit.v1.environments.Environment environment = 1;
     */
    environment?: Environment;
    constructor(data?: PartialMessage<CreateCustomDomainResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.CreateCustomDomainResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateCustomDomainResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateCustomDomainResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateCustomDomainResponse;
    static equals(a: CreateCustomDomainResponse | PlainMessage<CreateCustomDomainResponse> | undefined, b: CreateCustomDomainResponse | PlainMessage<CreateCustomDomainResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.GetDNSRecordsRequest
 */
export declare class GetDNSRecordsRequest extends Message<GetDNSRecordsRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string custom_domain = 2;
     */
    customDomain: string;
    constructor(data?: PartialMessage<GetDNSRecordsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.GetDNSRecordsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDNSRecordsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDNSRecordsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDNSRecordsRequest;
    static equals(a: GetDNSRecordsRequest | PlainMessage<GetDNSRecordsRequest> | undefined, b: GetDNSRecordsRequest | PlainMessage<GetDNSRecordsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.GetDNSRecordsResponse
 */
export declare class GetDNSRecordsResponse extends Message<GetDNSRecordsResponse> {
    /**
     * @generated from field: repeated scalekit.v1.environments.DNSRecords dns_records = 1;
     */
    dnsRecords: DNSRecords[];
    constructor(data?: PartialMessage<GetDNSRecordsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.GetDNSRecordsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDNSRecordsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDNSRecordsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDNSRecordsResponse;
    static equals(a: GetDNSRecordsResponse | PlainMessage<GetDNSRecordsResponse> | undefined, b: GetDNSRecordsResponse | PlainMessage<GetDNSRecordsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.DNSRecords
 */
export declare class DNSRecords extends Message<DNSRecords> {
    /**
     * @generated from field: string host_name = 1;
     */
    hostName: string;
    /**
     * @generated from field: string type = 2;
     */
    type: string;
    /**
     * @generated from field: string value = 3;
     */
    value: string;
    constructor(data?: PartialMessage<DNSRecords>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.DNSRecords";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DNSRecords;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DNSRecords;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DNSRecords;
    static equals(a: DNSRecords | PlainMessage<DNSRecords> | undefined, b: DNSRecords | PlainMessage<DNSRecords> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.Environment
 */
export declare class Environment extends Message<Environment> {
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
     * @generated from field: string display_name = 4;
     */
    displayName: string;
    /**
     * @generated from field: string domain = 5;
     */
    domain: string;
    /**
     * @generated from field: scalekit.v1.commons.RegionCode region_code = 6;
     */
    regionCode: RegionCode;
    /**
     * @generated from field: scalekit.v1.commons.EnvironmentType type = 7;
     */
    type: EnvironmentType;
    /**
     * @generated from field: optional string custom_domain = 8;
     */
    customDomain?: string;
    /**
     * @generated from field: scalekit.v1.environments.CustomDomainStatus custom_domain_status = 9;
     */
    customDomainStatus: CustomDomainStatus;
    constructor(data?: PartialMessage<Environment>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.Environment";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Environment;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Environment;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Environment;
    static equals(a: Environment | PlainMessage<Environment> | undefined, b: Environment | PlainMessage<Environment> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.CreateEnvironment
 */
export declare class CreateEnvironment extends Message<CreateEnvironment> {
    /**
     * @generated from field: string display_name = 4;
     */
    displayName: string;
    /**
     * @generated from field: optional scalekit.v1.commons.RegionCode region_code = 6;
     */
    regionCode?: RegionCode;
    /**
     * @generated from field: optional scalekit.v1.commons.EnvironmentType type = 7;
     */
    type?: EnvironmentType;
    constructor(data?: PartialMessage<CreateEnvironment>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.CreateEnvironment";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateEnvironment;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateEnvironment;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateEnvironment;
    static equals(a: CreateEnvironment | PlainMessage<CreateEnvironment> | undefined, b: CreateEnvironment | PlainMessage<CreateEnvironment> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.UpdateEnvironment
 */
export declare class UpdateEnvironment extends Message<UpdateEnvironment> {
    /**
     * @generated from field: optional string display_name = 4;
     */
    displayName?: string;
    constructor(data?: PartialMessage<UpdateEnvironment>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.UpdateEnvironment";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateEnvironment;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateEnvironment;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateEnvironment;
    static equals(a: UpdateEnvironment | PlainMessage<UpdateEnvironment> | undefined, b: UpdateEnvironment | PlainMessage<UpdateEnvironment> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.UpdateEnvironmentDomain
 */
export declare class UpdateEnvironmentDomain extends Message<UpdateEnvironmentDomain> {
    /**
     * @generated from field: optional string domain = 5;
     */
    domain?: string;
    constructor(data?: PartialMessage<UpdateEnvironmentDomain>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.UpdateEnvironmentDomain";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateEnvironmentDomain;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateEnvironmentDomain;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateEnvironmentDomain;
    static equals(a: UpdateEnvironmentDomain | PlainMessage<UpdateEnvironmentDomain> | undefined, b: UpdateEnvironmentDomain | PlainMessage<UpdateEnvironmentDomain> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.CreateEnvironmentRequest
 */
export declare class CreateEnvironmentRequest extends Message<CreateEnvironmentRequest> {
    /**
     * @generated from field: scalekit.v1.environments.CreateEnvironment environment = 1;
     */
    environment?: CreateEnvironment;
    constructor(data?: PartialMessage<CreateEnvironmentRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.CreateEnvironmentRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateEnvironmentRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateEnvironmentRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateEnvironmentRequest;
    static equals(a: CreateEnvironmentRequest | PlainMessage<CreateEnvironmentRequest> | undefined, b: CreateEnvironmentRequest | PlainMessage<CreateEnvironmentRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.CreateEnvironmentResponse
 */
export declare class CreateEnvironmentResponse extends Message<CreateEnvironmentResponse> {
    /**
     * @generated from field: scalekit.v1.environments.Environment environment = 1;
     */
    environment?: Environment;
    constructor(data?: PartialMessage<CreateEnvironmentResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.CreateEnvironmentResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateEnvironmentResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateEnvironmentResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateEnvironmentResponse;
    static equals(a: CreateEnvironmentResponse | PlainMessage<CreateEnvironmentResponse> | undefined, b: CreateEnvironmentResponse | PlainMessage<CreateEnvironmentResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.UpdateEnvironmentRequest
 */
export declare class UpdateEnvironmentRequest extends Message<UpdateEnvironmentRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.environments.UpdateEnvironment environment = 2;
     */
    environment?: UpdateEnvironment;
    constructor(data?: PartialMessage<UpdateEnvironmentRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.UpdateEnvironmentRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateEnvironmentRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateEnvironmentRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateEnvironmentRequest;
    static equals(a: UpdateEnvironmentRequest | PlainMessage<UpdateEnvironmentRequest> | undefined, b: UpdateEnvironmentRequest | PlainMessage<UpdateEnvironmentRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.UpdateEnvironmentDomainRequest
 */
export declare class UpdateEnvironmentDomainRequest extends Message<UpdateEnvironmentDomainRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.environments.UpdateEnvironmentDomain environment = 2;
     */
    environment?: UpdateEnvironmentDomain;
    constructor(data?: PartialMessage<UpdateEnvironmentDomainRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.UpdateEnvironmentDomainRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateEnvironmentDomainRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateEnvironmentDomainRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateEnvironmentDomainRequest;
    static equals(a: UpdateEnvironmentDomainRequest | PlainMessage<UpdateEnvironmentDomainRequest> | undefined, b: UpdateEnvironmentDomainRequest | PlainMessage<UpdateEnvironmentDomainRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.UpdateEnvironmentResponse
 */
export declare class UpdateEnvironmentResponse extends Message<UpdateEnvironmentResponse> {
    /**
     * @generated from field: scalekit.v1.environments.Environment environment = 1;
     */
    environment?: Environment;
    constructor(data?: PartialMessage<UpdateEnvironmentResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.UpdateEnvironmentResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateEnvironmentResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateEnvironmentResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateEnvironmentResponse;
    static equals(a: UpdateEnvironmentResponse | PlainMessage<UpdateEnvironmentResponse> | undefined, b: UpdateEnvironmentResponse | PlainMessage<UpdateEnvironmentResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.GetEnvironmentRequest
 */
export declare class GetEnvironmentRequest extends Message<GetEnvironmentRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    constructor(data?: PartialMessage<GetEnvironmentRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.GetEnvironmentRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetEnvironmentRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetEnvironmentRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetEnvironmentRequest;
    static equals(a: GetEnvironmentRequest | PlainMessage<GetEnvironmentRequest> | undefined, b: GetEnvironmentRequest | PlainMessage<GetEnvironmentRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.GetEnvironmentResponse
 */
export declare class GetEnvironmentResponse extends Message<GetEnvironmentResponse> {
    /**
     * @generated from field: scalekit.v1.environments.Environment environment = 1;
     */
    environment?: Environment;
    constructor(data?: PartialMessage<GetEnvironmentResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.GetEnvironmentResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetEnvironmentResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetEnvironmentResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetEnvironmentResponse;
    static equals(a: GetEnvironmentResponse | PlainMessage<GetEnvironmentResponse> | undefined, b: GetEnvironmentResponse | PlainMessage<GetEnvironmentResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.ListEnvironmentsRequest
 */
export declare class ListEnvironmentsRequest extends Message<ListEnvironmentsRequest> {
    /**
     * @generated from field: uint32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
    constructor(data?: PartialMessage<ListEnvironmentsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.ListEnvironmentsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListEnvironmentsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListEnvironmentsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListEnvironmentsRequest;
    static equals(a: ListEnvironmentsRequest | PlainMessage<ListEnvironmentsRequest> | undefined, b: ListEnvironmentsRequest | PlainMessage<ListEnvironmentsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.ListEnvironmentsResponse
 */
export declare class ListEnvironmentsResponse extends Message<ListEnvironmentsResponse> {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.environments.Environment environments = 3;
     */
    environments: Environment[];
    constructor(data?: PartialMessage<ListEnvironmentsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.ListEnvironmentsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListEnvironmentsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListEnvironmentsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListEnvironmentsResponse;
    static equals(a: ListEnvironmentsResponse | PlainMessage<ListEnvironmentsResponse> | undefined, b: ListEnvironmentsResponse | PlainMessage<ListEnvironmentsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.environments.DeleteEnvironmentRequest
 */
export declare class DeleteEnvironmentRequest extends Message<DeleteEnvironmentRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    constructor(data?: PartialMessage<DeleteEnvironmentRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.environments.DeleteEnvironmentRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteEnvironmentRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteEnvironmentRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteEnvironmentRequest;
    static equals(a: DeleteEnvironmentRequest | PlainMessage<DeleteEnvironmentRequest> | undefined, b: DeleteEnvironmentRequest | PlainMessage<DeleteEnvironmentRequest> | undefined): boolean;
}
