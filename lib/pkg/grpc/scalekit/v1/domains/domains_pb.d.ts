import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from enum scalekit.v1.domains.VerificationStatus
 */
export declare enum VerificationStatus {
    /**
     * @generated from enum value: VERIFICATION_STATUS_UNSPECIFIED = 0;
     */
    VERIFICATION_STATUS_UNSPECIFIED = 0,
    /**
     * @generated from enum value: PENDING = 1;
     */
    PENDING = 1,
    /**
     * @generated from enum value: VERIFIED = 2;
     */
    VERIFIED = 2,
    /**
     * @generated from enum value: FAILED = 3;
     */
    FAILED = 3,
    /**
     * @generated from enum value: AUTO_VERIFIED = 4;
     */
    AUTO_VERIFIED = 4
}
/**
 * @generated from enum scalekit.v1.domains.DomainType
 */
export declare enum DomainType {
    /**
     * @generated from enum value: DOMAIN_TYPE_UNSPECIFIED = 0;
     */
    DOMAIN_TYPE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: ALLOWED_EMAIL_DOMAIN = 1;
     */
    ALLOWED_EMAIL_DOMAIN = 1,
    /**
     * @generated from enum value: ORGANIZATION_DOMAIN = 2;
     */
    ORGANIZATION_DOMAIN = 2
}
/**
 * @generated from message scalekit.v1.domains.CreateDomainRequest
 */
export declare class CreateDomainRequest extends Message<CreateDomainRequest> {
    /**
     * @generated from oneof scalekit.v1.domains.CreateDomainRequest.identities
     */
    identities: {
        /**
         * @generated from field: string organization_id = 1;
         */
        value: string;
        case: "organizationId";
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
     * @generated from field: optional string connection_id = 3;
     */
    connectionId?: string;
    /**
     * @generated from field: scalekit.v1.domains.CreateDomain domain = 4;
     */
    domain?: CreateDomain;
    constructor(data?: PartialMessage<CreateDomainRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.CreateDomainRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDomainRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDomainRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDomainRequest;
    static equals(a: CreateDomainRequest | PlainMessage<CreateDomainRequest> | undefined, b: CreateDomainRequest | PlainMessage<CreateDomainRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.CreateDomainResponse
 */
export declare class CreateDomainResponse extends Message<CreateDomainResponse> {
    /**
     * @generated from field: scalekit.v1.domains.Domain domain = 1;
     */
    domain?: Domain;
    constructor(data?: PartialMessage<CreateDomainResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.CreateDomainResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDomainResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDomainResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDomainResponse;
    static equals(a: CreateDomainResponse | PlainMessage<CreateDomainResponse> | undefined, b: CreateDomainResponse | PlainMessage<CreateDomainResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.CreateDomain
 */
export declare class CreateDomain extends Message<CreateDomain> {
    /**
     * @generated from field: string domain = 1;
     */
    domain: string;
    /**
     * @generated from field: scalekit.v1.domains.DomainType domain_type = 2;
     */
    domainType: DomainType;
    constructor(data?: PartialMessage<CreateDomain>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.CreateDomain";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDomain;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDomain;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDomain;
    static equals(a: CreateDomain | PlainMessage<CreateDomain> | undefined, b: CreateDomain | PlainMessage<CreateDomain> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.UpdateDomainRequest
 */
export declare class UpdateDomainRequest extends Message<UpdateDomainRequest> {
    /**
     * @generated from oneof scalekit.v1.domains.UpdateDomainRequest.identities
     */
    identities: {
        /**
         * @generated from field: string organization_id = 1;
         */
        value: string;
        case: "organizationId";
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
     * @generated from field: optional string connection_id = 3;
     */
    connectionId?: string;
    /**
     * @generated from field: string id = 4;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.domains.UpdateDomain domain = 5;
     */
    domain?: UpdateDomain;
    constructor(data?: PartialMessage<UpdateDomainRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.UpdateDomainRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDomainRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDomainRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDomainRequest;
    static equals(a: UpdateDomainRequest | PlainMessage<UpdateDomainRequest> | undefined, b: UpdateDomainRequest | PlainMessage<UpdateDomainRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.UpdateDomain
 */
export declare class UpdateDomain extends Message<UpdateDomain> {
    constructor(data?: PartialMessage<UpdateDomain>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.UpdateDomain";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDomain;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDomain;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDomain;
    static equals(a: UpdateDomain | PlainMessage<UpdateDomain> | undefined, b: UpdateDomain | PlainMessage<UpdateDomain> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.UpdateDomainResponse
 */
export declare class UpdateDomainResponse extends Message<UpdateDomainResponse> {
    /**
     * @generated from field: scalekit.v1.domains.Domain domain = 1;
     */
    domain?: Domain;
    constructor(data?: PartialMessage<UpdateDomainResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.UpdateDomainResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDomainResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDomainResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDomainResponse;
    static equals(a: UpdateDomainResponse | PlainMessage<UpdateDomainResponse> | undefined, b: UpdateDomainResponse | PlainMessage<UpdateDomainResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.GetDomainRequest
 */
export declare class GetDomainRequest extends Message<GetDomainRequest> {
    /**
     * @generated from oneof scalekit.v1.domains.GetDomainRequest.identities
     */
    identities: {
        /**
         * @generated from field: string organization_id = 1;
         */
        value: string;
        case: "organizationId";
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
     * @generated from field: string id = 3;
     */
    id: string;
    constructor(data?: PartialMessage<GetDomainRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.GetDomainRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDomainRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDomainRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDomainRequest;
    static equals(a: GetDomainRequest | PlainMessage<GetDomainRequest> | undefined, b: GetDomainRequest | PlainMessage<GetDomainRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.GetDomainResponse
 */
export declare class GetDomainResponse extends Message<GetDomainResponse> {
    /**
     * @generated from field: scalekit.v1.domains.Domain domain = 1;
     */
    domain?: Domain;
    constructor(data?: PartialMessage<GetDomainResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.GetDomainResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDomainResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDomainResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDomainResponse;
    static equals(a: GetDomainResponse | PlainMessage<GetDomainResponse> | undefined, b: GetDomainResponse | PlainMessage<GetDomainResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.DeleteDomainRequest
 */
export declare class DeleteDomainRequest extends Message<DeleteDomainRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from oneof scalekit.v1.domains.DeleteDomainRequest.identities
     */
    identities: {
        /**
         * @generated from field: string organization_id = 2;
         */
        value: string;
        case: "organizationId";
    } | {
        /**
         * @generated from field: string external_id = 3;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: optional string connection_id = 4;
     */
    connectionId?: string;
    constructor(data?: PartialMessage<DeleteDomainRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.DeleteDomainRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteDomainRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteDomainRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteDomainRequest;
    static equals(a: DeleteDomainRequest | PlainMessage<DeleteDomainRequest> | undefined, b: DeleteDomainRequest | PlainMessage<DeleteDomainRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.ListDomainRequest
 */
export declare class ListDomainRequest extends Message<ListDomainRequest> {
    /**
     * @generated from oneof scalekit.v1.domains.ListDomainRequest.identities
     */
    identities: {
        /**
         * @generated from field: string organization_id = 1;
         */
        value: string;
        case: "organizationId";
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
     * @generated from field: optional string connection_id = 3;
     */
    connectionId?: string;
    /**
     * @generated from field: optional string include = 4;
     */
    include?: string;
    /**
     * @generated from field: google.protobuf.Int32Value page_size = 5;
     */
    pageSize?: number;
    /**
     * @generated from field: google.protobuf.Int32Value page_number = 6;
     */
    pageNumber?: number;
    /**
     * @generated from field: scalekit.v1.domains.DomainType domain_type = 7;
     */
    domainType: DomainType;
    constructor(data?: PartialMessage<ListDomainRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.ListDomainRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDomainRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDomainRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDomainRequest;
    static equals(a: ListDomainRequest | PlainMessage<ListDomainRequest> | undefined, b: ListDomainRequest | PlainMessage<ListDomainRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.VerifyDomainRequest
 */
export declare class VerifyDomainRequest extends Message<VerifyDomainRequest> {
    /**
     * @generated from oneof scalekit.v1.domains.VerifyDomainRequest.identities
     */
    identities: {
        /**
         * @generated from field: string organization_id = 1;
         */
        value: string;
        case: "organizationId";
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
     * @generated from field: string id = 4;
     */
    id: string;
    constructor(data?: PartialMessage<VerifyDomainRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.VerifyDomainRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): VerifyDomainRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): VerifyDomainRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): VerifyDomainRequest;
    static equals(a: VerifyDomainRequest | PlainMessage<VerifyDomainRequest> | undefined, b: VerifyDomainRequest | PlainMessage<VerifyDomainRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.ListDomainResponse
 */
export declare class ListDomainResponse extends Message<ListDomainResponse> {
    /**
     * @generated from field: int32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: int32 page_number = 2;
     */
    pageNumber: number;
    /**
     * @generated from field: repeated scalekit.v1.domains.Domain domains = 3;
     */
    domains: Domain[];
    constructor(data?: PartialMessage<ListDomainResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.ListDomainResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDomainResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDomainResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDomainResponse;
    static equals(a: ListDomainResponse | PlainMessage<ListDomainResponse> | undefined, b: ListDomainResponse | PlainMessage<ListDomainResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.ListAuthorizedDomainRequest
 */
export declare class ListAuthorizedDomainRequest extends Message<ListAuthorizedDomainRequest> {
    /**
     * @generated from field: string origin = 1;
     */
    origin: string;
    constructor(data?: PartialMessage<ListAuthorizedDomainRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.ListAuthorizedDomainRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAuthorizedDomainRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAuthorizedDomainRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAuthorizedDomainRequest;
    static equals(a: ListAuthorizedDomainRequest | PlainMessage<ListAuthorizedDomainRequest> | undefined, b: ListAuthorizedDomainRequest | PlainMessage<ListAuthorizedDomainRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.ListAuthorizedDomainResponse
 */
export declare class ListAuthorizedDomainResponse extends Message<ListAuthorizedDomainResponse> {
    /**
     * @generated from field: repeated string domains = 1;
     */
    domains: string[];
    constructor(data?: PartialMessage<ListAuthorizedDomainResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.ListAuthorizedDomainResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAuthorizedDomainResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAuthorizedDomainResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAuthorizedDomainResponse;
    static equals(a: ListAuthorizedDomainResponse | PlainMessage<ListAuthorizedDomainResponse> | undefined, b: ListAuthorizedDomainResponse | PlainMessage<ListAuthorizedDomainResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.domains.Domain
 */
export declare class Domain extends Message<Domain> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string domain = 2;
     */
    domain: string;
    /**
     * @generated from field: string environment_id = 3;
     */
    environmentId: string;
    /**
     * @generated from field: string organization_id = 4;
     */
    organizationId: string;
    /**
     * @generated from field: string txt_record_key = 6;
     */
    txtRecordKey: string;
    /**
     * @generated from field: string txt_record_secret = 7;
     */
    txtRecordSecret: string;
    /**
     * @generated from field: scalekit.v1.domains.VerificationStatus verification_status = 8;
     */
    verificationStatus: VerificationStatus;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 9;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 10;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: scalekit.v1.domains.DomainType domain_type = 12;
     */
    domainType: DomainType;
    constructor(data?: PartialMessage<Domain>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.domains.Domain";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Domain;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Domain;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Domain;
    static equals(a: Domain | PlainMessage<Domain> | undefined, b: Domain | PlainMessage<Domain> | undefined): boolean;
}
