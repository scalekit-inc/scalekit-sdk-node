import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { BoolValueSchema, EmptySchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/domains/domains.proto.
 */
export declare const file_scalekit_v1_domains_domains: GenFile;
/**
 * @generated from message scalekit.v1.domains.CreateDomainRequest
 */
export type CreateDomainRequest = Message<"scalekit.v1.domains.CreateDomainRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.domains.CreateDomainRequest.
 * Use `create(CreateDomainRequestSchema)` to create a new message.
 */
export declare const CreateDomainRequestSchema: GenMessage<CreateDomainRequest>;
/**
 * @generated from message scalekit.v1.domains.CreateDomainResponse
 */
export type CreateDomainResponse = Message<"scalekit.v1.domains.CreateDomainResponse"> & {
    /**
     * @generated from field: scalekit.v1.domains.Domain domain = 1;
     */
    domain?: Domain;
};
/**
 * Describes the message scalekit.v1.domains.CreateDomainResponse.
 * Use `create(CreateDomainResponseSchema)` to create a new message.
 */
export declare const CreateDomainResponseSchema: GenMessage<CreateDomainResponse>;
/**
 * @generated from message scalekit.v1.domains.CreateDomain
 */
export type CreateDomain = Message<"scalekit.v1.domains.CreateDomain"> & {
    /**
     * @generated from field: string domain = 1;
     */
    domain: string;
    /**
     * @generated from field: scalekit.v1.domains.DomainType domain_type = 2;
     */
    domainType: DomainType;
};
/**
 * Describes the message scalekit.v1.domains.CreateDomain.
 * Use `create(CreateDomainSchema)` to create a new message.
 */
export declare const CreateDomainSchema: GenMessage<CreateDomain>;
/**
 * @generated from message scalekit.v1.domains.UpdateDomainRequest
 */
export type UpdateDomainRequest = Message<"scalekit.v1.domains.UpdateDomainRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.domains.UpdateDomainRequest.
 * Use `create(UpdateDomainRequestSchema)` to create a new message.
 */
export declare const UpdateDomainRequestSchema: GenMessage<UpdateDomainRequest>;
/**
 * @generated from message scalekit.v1.domains.UpdateDomain
 */
export type UpdateDomain = Message<"scalekit.v1.domains.UpdateDomain"> & {};
/**
 * Describes the message scalekit.v1.domains.UpdateDomain.
 * Use `create(UpdateDomainSchema)` to create a new message.
 */
export declare const UpdateDomainSchema: GenMessage<UpdateDomain>;
/**
 * @generated from message scalekit.v1.domains.UpdateDomainResponse
 */
export type UpdateDomainResponse = Message<"scalekit.v1.domains.UpdateDomainResponse"> & {
    /**
     * @generated from field: scalekit.v1.domains.Domain domain = 1;
     */
    domain?: Domain;
};
/**
 * Describes the message scalekit.v1.domains.UpdateDomainResponse.
 * Use `create(UpdateDomainResponseSchema)` to create a new message.
 */
export declare const UpdateDomainResponseSchema: GenMessage<UpdateDomainResponse>;
/**
 * @generated from message scalekit.v1.domains.GetDomainRequest
 */
export type GetDomainRequest = Message<"scalekit.v1.domains.GetDomainRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.domains.GetDomainRequest.
 * Use `create(GetDomainRequestSchema)` to create a new message.
 */
export declare const GetDomainRequestSchema: GenMessage<GetDomainRequest>;
/**
 * @generated from message scalekit.v1.domains.GetDomainResponse
 */
export type GetDomainResponse = Message<"scalekit.v1.domains.GetDomainResponse"> & {
    /**
     * @generated from field: scalekit.v1.domains.Domain domain = 1;
     */
    domain?: Domain;
};
/**
 * Describes the message scalekit.v1.domains.GetDomainResponse.
 * Use `create(GetDomainResponseSchema)` to create a new message.
 */
export declare const GetDomainResponseSchema: GenMessage<GetDomainResponse>;
/**
 * @generated from message scalekit.v1.domains.DeleteDomainRequest
 */
export type DeleteDomainRequest = Message<"scalekit.v1.domains.DeleteDomainRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.domains.DeleteDomainRequest.
 * Use `create(DeleteDomainRequestSchema)` to create a new message.
 */
export declare const DeleteDomainRequestSchema: GenMessage<DeleteDomainRequest>;
/**
 * @generated from message scalekit.v1.domains.ListDomainRequest
 */
export type ListDomainRequest = Message<"scalekit.v1.domains.ListDomainRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.domains.ListDomainRequest.
 * Use `create(ListDomainRequestSchema)` to create a new message.
 */
export declare const ListDomainRequestSchema: GenMessage<ListDomainRequest>;
/**
 * @generated from message scalekit.v1.domains.VerifyDomainRequest
 */
export type VerifyDomainRequest = Message<"scalekit.v1.domains.VerifyDomainRequest"> & {
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
};
/**
 * Describes the message scalekit.v1.domains.VerifyDomainRequest.
 * Use `create(VerifyDomainRequestSchema)` to create a new message.
 */
export declare const VerifyDomainRequestSchema: GenMessage<VerifyDomainRequest>;
/**
 * @generated from message scalekit.v1.domains.ListDomainResponse
 */
export type ListDomainResponse = Message<"scalekit.v1.domains.ListDomainResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.domains.ListDomainResponse.
 * Use `create(ListDomainResponseSchema)` to create a new message.
 */
export declare const ListDomainResponseSchema: GenMessage<ListDomainResponse>;
/**
 * @generated from message scalekit.v1.domains.ListAuthorizedDomainRequest
 */
export type ListAuthorizedDomainRequest = Message<"scalekit.v1.domains.ListAuthorizedDomainRequest"> & {
    /**
     * @generated from field: string origin = 1;
     */
    origin: string;
};
/**
 * Describes the message scalekit.v1.domains.ListAuthorizedDomainRequest.
 * Use `create(ListAuthorizedDomainRequestSchema)` to create a new message.
 */
export declare const ListAuthorizedDomainRequestSchema: GenMessage<ListAuthorizedDomainRequest>;
/**
 * @generated from message scalekit.v1.domains.ListAuthorizedDomainResponse
 */
export type ListAuthorizedDomainResponse = Message<"scalekit.v1.domains.ListAuthorizedDomainResponse"> & {
    /**
     * @generated from field: repeated string domains = 1;
     */
    domains: string[];
};
/**
 * Describes the message scalekit.v1.domains.ListAuthorizedDomainResponse.
 * Use `create(ListAuthorizedDomainResponseSchema)` to create a new message.
 */
export declare const ListAuthorizedDomainResponseSchema: GenMessage<ListAuthorizedDomainResponse>;
/**
 * @generated from message scalekit.v1.domains.Domain
 */
export type Domain = Message<"scalekit.v1.domains.Domain"> & {
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
};
/**
 * Describes the message scalekit.v1.domains.Domain.
 * Use `create(DomainSchema)` to create a new message.
 */
export declare const DomainSchema: GenMessage<Domain>;
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
 * Describes the enum scalekit.v1.domains.VerificationStatus.
 */
export declare const VerificationStatusSchema: GenEnum<VerificationStatus>;
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
 * Describes the enum scalekit.v1.domains.DomainType.
 */
export declare const DomainTypeSchema: GenEnum<DomainType>;
/**
 * @generated from service scalekit.v1.domains.DomainService
 */
export declare const DomainService: GenService<{
    /**
     * @generated from rpc scalekit.v1.domains.DomainService.CreateDomain
     */
    createDomain: {
        methodKind: "unary";
        input: typeof CreateDomainRequestSchema;
        output: typeof CreateDomainResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.domains.DomainService.UpdateDomain
     */
    updateDomain: {
        methodKind: "unary";
        input: typeof UpdateDomainRequestSchema;
        output: typeof UpdateDomainResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.domains.DomainService.VerifyDomain
     */
    verifyDomain: {
        methodKind: "unary";
        input: typeof VerifyDomainRequestSchema;
        output: typeof BoolValueSchema;
    };
    /**
     * @generated from rpc scalekit.v1.domains.DomainService.GetDomain
     */
    getDomain: {
        methodKind: "unary";
        input: typeof GetDomainRequestSchema;
        output: typeof GetDomainResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.domains.DomainService.DeleteDomain
     */
    deleteDomain: {
        methodKind: "unary";
        input: typeof DeleteDomainRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * @generated from rpc scalekit.v1.domains.DomainService.ListDomains
     */
    listDomains: {
        methodKind: "unary";
        input: typeof ListDomainRequestSchema;
        output: typeof ListDomainResponseSchema;
    };
    /**
     * @generated from rpc scalekit.v1.domains.DomainService.ListAuthorizedDomains
     */
    listAuthorizedDomains: {
        methodKind: "unary";
        input: typeof ListAuthorizedDomainRequestSchema;
        output: typeof ListAuthorizedDomainResponseSchema;
    };
}>;
