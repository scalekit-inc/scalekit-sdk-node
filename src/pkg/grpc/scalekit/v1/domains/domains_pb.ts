// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file scalekit/v1/domains/domains.proto (package scalekit.v1.domains, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Int32Value, Message, proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * @generated from enum scalekit.v1.domains.VerificationStatus
 */
export enum VerificationStatus {
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
}
// Retrieve enum metadata with: proto3.getEnumType(VerificationStatus)
proto3.util.setEnumType(VerificationStatus, "scalekit.v1.domains.VerificationStatus", [
  { no: 0, name: "VERIFICATION_STATUS_UNSPECIFIED" },
  { no: 1, name: "PENDING" },
  { no: 2, name: "VERIFIED" },
  { no: 3, name: "FAILED" },
]);

/**
 * @generated from message scalekit.v1.domains.CreateDomainRequest
 */
export class CreateDomainRequest extends Message<CreateDomainRequest> {
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
  } | { case: undefined; value?: undefined } = { case: undefined };

  /**
   * @generated from field: optional string connection_id = 3;
   */
  connectionId?: string;

  /**
   * @generated from field: scalekit.v1.domains.CreateDomain domain = 4;
   */
  domain?: CreateDomain;

  constructor(data?: PartialMessage<CreateDomainRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.CreateDomainRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "organization_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 2, name: "external_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 3, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 4, name: "domain", kind: "message", T: CreateDomain },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDomainRequest {
    return new CreateDomainRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDomainRequest {
    return new CreateDomainRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDomainRequest {
    return new CreateDomainRequest().fromJsonString(jsonString, options);
  }

  static equals(a: CreateDomainRequest | PlainMessage<CreateDomainRequest> | undefined, b: CreateDomainRequest | PlainMessage<CreateDomainRequest> | undefined): boolean {
    return proto3.util.equals(CreateDomainRequest, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.CreateDomainResponse
 */
export class CreateDomainResponse extends Message<CreateDomainResponse> {
  /**
   * @generated from field: scalekit.v1.domains.Domain domain = 1;
   */
  domain?: Domain;

  constructor(data?: PartialMessage<CreateDomainResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.CreateDomainResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "domain", kind: "message", T: Domain },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDomainResponse {
    return new CreateDomainResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDomainResponse {
    return new CreateDomainResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDomainResponse {
    return new CreateDomainResponse().fromJsonString(jsonString, options);
  }

  static equals(a: CreateDomainResponse | PlainMessage<CreateDomainResponse> | undefined, b: CreateDomainResponse | PlainMessage<CreateDomainResponse> | undefined): boolean {
    return proto3.util.equals(CreateDomainResponse, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.CreateDomain
 */
export class CreateDomain extends Message<CreateDomain> {
  /**
   * @generated from field: string domain = 1;
   */
  domain = "";

  constructor(data?: PartialMessage<CreateDomain>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.CreateDomain";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "domain", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateDomain {
    return new CreateDomain().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateDomain {
    return new CreateDomain().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateDomain {
    return new CreateDomain().fromJsonString(jsonString, options);
  }

  static equals(a: CreateDomain | PlainMessage<CreateDomain> | undefined, b: CreateDomain | PlainMessage<CreateDomain> | undefined): boolean {
    return proto3.util.equals(CreateDomain, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.UpdateDomainRequest
 */
export class UpdateDomainRequest extends Message<UpdateDomainRequest> {
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
  } | { case: undefined; value?: undefined } = { case: undefined };

  /**
   * @generated from field: optional string connection_id = 3;
   */
  connectionId?: string;

  /**
   * @generated from field: string id = 4;
   */
  id = "";

  /**
   * @generated from field: scalekit.v1.domains.UpdateDomain domain = 5;
   */
  domain?: UpdateDomain;

  constructor(data?: PartialMessage<UpdateDomainRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.UpdateDomainRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "organization_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 2, name: "external_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 3, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 4, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "domain", kind: "message", T: UpdateDomain },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDomainRequest {
    return new UpdateDomainRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDomainRequest {
    return new UpdateDomainRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDomainRequest {
    return new UpdateDomainRequest().fromJsonString(jsonString, options);
  }

  static equals(a: UpdateDomainRequest | PlainMessage<UpdateDomainRequest> | undefined, b: UpdateDomainRequest | PlainMessage<UpdateDomainRequest> | undefined): boolean {
    return proto3.util.equals(UpdateDomainRequest, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.UpdateDomain
 */
export class UpdateDomain extends Message<UpdateDomain> {
  constructor(data?: PartialMessage<UpdateDomain>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.UpdateDomain";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDomain {
    return new UpdateDomain().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDomain {
    return new UpdateDomain().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDomain {
    return new UpdateDomain().fromJsonString(jsonString, options);
  }

  static equals(a: UpdateDomain | PlainMessage<UpdateDomain> | undefined, b: UpdateDomain | PlainMessage<UpdateDomain> | undefined): boolean {
    return proto3.util.equals(UpdateDomain, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.UpdateDomainResponse
 */
export class UpdateDomainResponse extends Message<UpdateDomainResponse> {
  /**
   * @generated from field: scalekit.v1.domains.Domain domain = 1;
   */
  domain?: Domain;

  constructor(data?: PartialMessage<UpdateDomainResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.UpdateDomainResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "domain", kind: "message", T: Domain },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateDomainResponse {
    return new UpdateDomainResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateDomainResponse {
    return new UpdateDomainResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateDomainResponse {
    return new UpdateDomainResponse().fromJsonString(jsonString, options);
  }

  static equals(a: UpdateDomainResponse | PlainMessage<UpdateDomainResponse> | undefined, b: UpdateDomainResponse | PlainMessage<UpdateDomainResponse> | undefined): boolean {
    return proto3.util.equals(UpdateDomainResponse, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.GetDomainRequest
 */
export class GetDomainRequest extends Message<GetDomainRequest> {
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
  } | { case: undefined; value?: undefined } = { case: undefined };

  /**
   * @generated from field: string id = 3;
   */
  id = "";

  constructor(data?: PartialMessage<GetDomainRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.GetDomainRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "organization_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 2, name: "external_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 3, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDomainRequest {
    return new GetDomainRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDomainRequest {
    return new GetDomainRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDomainRequest {
    return new GetDomainRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetDomainRequest | PlainMessage<GetDomainRequest> | undefined, b: GetDomainRequest | PlainMessage<GetDomainRequest> | undefined): boolean {
    return proto3.util.equals(GetDomainRequest, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.GetDomainResponse
 */
export class GetDomainResponse extends Message<GetDomainResponse> {
  /**
   * @generated from field: scalekit.v1.domains.Domain domain = 1;
   */
  domain?: Domain;

  constructor(data?: PartialMessage<GetDomainResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.GetDomainResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "domain", kind: "message", T: Domain },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetDomainResponse {
    return new GetDomainResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetDomainResponse {
    return new GetDomainResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetDomainResponse {
    return new GetDomainResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetDomainResponse | PlainMessage<GetDomainResponse> | undefined, b: GetDomainResponse | PlainMessage<GetDomainResponse> | undefined): boolean {
    return proto3.util.equals(GetDomainResponse, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.DeleteDomainRequest
 */
export class DeleteDomainRequest extends Message<DeleteDomainRequest> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

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
  } | { case: undefined; value?: undefined } = { case: undefined };

  /**
   * @generated from field: optional string connection_id = 4;
   */
  connectionId?: string;

  constructor(data?: PartialMessage<DeleteDomainRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.DeleteDomainRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "organization_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 3, name: "external_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 4, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteDomainRequest {
    return new DeleteDomainRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteDomainRequest {
    return new DeleteDomainRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteDomainRequest {
    return new DeleteDomainRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DeleteDomainRequest | PlainMessage<DeleteDomainRequest> | undefined, b: DeleteDomainRequest | PlainMessage<DeleteDomainRequest> | undefined): boolean {
    return proto3.util.equals(DeleteDomainRequest, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.ListDomainRequest
 */
export class ListDomainRequest extends Message<ListDomainRequest> {
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
  } | { case: undefined; value?: undefined } = { case: undefined };

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

  constructor(data?: PartialMessage<ListDomainRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.ListDomainRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "organization_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 2, name: "external_id", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "identities" },
    { no: 3, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 4, name: "include", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 5, name: "page_size", kind: "message", T: Int32Value },
    { no: 6, name: "page_number", kind: "message", T: Int32Value },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDomainRequest {
    return new ListDomainRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDomainRequest {
    return new ListDomainRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDomainRequest {
    return new ListDomainRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ListDomainRequest | PlainMessage<ListDomainRequest> | undefined, b: ListDomainRequest | PlainMessage<ListDomainRequest> | undefined): boolean {
    return proto3.util.equals(ListDomainRequest, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.ListDomainResponse
 */
export class ListDomainResponse extends Message<ListDomainResponse> {
  /**
   * @generated from field: int32 page_size = 1;
   */
  pageSize = 0;

  /**
   * @generated from field: int32 page_number = 2;
   */
  pageNumber = 0;

  /**
   * @generated from field: repeated scalekit.v1.domains.Domain domains = 3;
   */
  domains: Domain[] = [];

  constructor(data?: PartialMessage<ListDomainResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.ListDomainResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "page_size", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "page_number", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "domains", kind: "message", T: Domain, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListDomainResponse {
    return new ListDomainResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListDomainResponse {
    return new ListDomainResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListDomainResponse {
    return new ListDomainResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ListDomainResponse | PlainMessage<ListDomainResponse> | undefined, b: ListDomainResponse | PlainMessage<ListDomainResponse> | undefined): boolean {
    return proto3.util.equals(ListDomainResponse, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.ListAuthorizedDomainRequest
 */
export class ListAuthorizedDomainRequest extends Message<ListAuthorizedDomainRequest> {
  /**
   * @generated from field: string origin = 1;
   */
  origin = "";

  constructor(data?: PartialMessage<ListAuthorizedDomainRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.ListAuthorizedDomainRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "origin", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAuthorizedDomainRequest {
    return new ListAuthorizedDomainRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAuthorizedDomainRequest {
    return new ListAuthorizedDomainRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAuthorizedDomainRequest {
    return new ListAuthorizedDomainRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ListAuthorizedDomainRequest | PlainMessage<ListAuthorizedDomainRequest> | undefined, b: ListAuthorizedDomainRequest | PlainMessage<ListAuthorizedDomainRequest> | undefined): boolean {
    return proto3.util.equals(ListAuthorizedDomainRequest, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.ListAuthorizedDomainResponse
 */
export class ListAuthorizedDomainResponse extends Message<ListAuthorizedDomainResponse> {
  /**
   * @generated from field: repeated string domains = 1;
   */
  domains: string[] = [];

  constructor(data?: PartialMessage<ListAuthorizedDomainResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.ListAuthorizedDomainResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "domains", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAuthorizedDomainResponse {
    return new ListAuthorizedDomainResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAuthorizedDomainResponse {
    return new ListAuthorizedDomainResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAuthorizedDomainResponse {
    return new ListAuthorizedDomainResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ListAuthorizedDomainResponse | PlainMessage<ListAuthorizedDomainResponse> | undefined, b: ListAuthorizedDomainResponse | PlainMessage<ListAuthorizedDomainResponse> | undefined): boolean {
    return proto3.util.equals(ListAuthorizedDomainResponse, a, b);
  }
}

/**
 * @generated from message scalekit.v1.domains.Domain
 */
export class Domain extends Message<Domain> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: string domain = 2;
   */
  domain = "";

  /**
   * @generated from field: string environment_id = 3;
   */
  environmentId = "";

  /**
   * @generated from field: string organization_id = 4;
   */
  organizationId = "";

  /**
   * @generated from field: string connection_id = 5;
   */
  connectionId = "";

  /**
   * @generated from field: string txt_record_key = 6;
   */
  txtRecordKey = "";

  /**
   * @generated from field: string txt_record_secret = 7;
   */
  txtRecordSecret = "";

  /**
   * @generated from field: scalekit.v1.domains.VerificationStatus verification_status = 8;
   */
  verificationStatus = VerificationStatus.VERIFICATION_STATUS_UNSPECIFIED;

  /**
   * @generated from field: google.protobuf.Timestamp create_time = 9;
   */
  createTime?: Timestamp;

  /**
   * @generated from field: google.protobuf.Timestamp update_time = 10;
   */
  updateTime?: Timestamp;

  /**
   * @generated from field: optional string created_by = 11;
   */
  createdBy?: string;

  constructor(data?: PartialMessage<Domain>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "scalekit.v1.domains.Domain";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "domain", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "environment_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "organization_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "connection_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "txt_record_key", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "txt_record_secret", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "verification_status", kind: "enum", T: proto3.getEnumType(VerificationStatus) },
    { no: 9, name: "create_time", kind: "message", T: Timestamp },
    { no: 10, name: "update_time", kind: "message", T: Timestamp },
    { no: 11, name: "created_by", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Domain {
    return new Domain().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Domain {
    return new Domain().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Domain {
    return new Domain().fromJsonString(jsonString, options);
  }

  static equals(a: Domain | PlainMessage<Domain> | undefined, b: Domain | PlainMessage<Domain> | undefined): boolean {
    return proto3.util.equals(Domain, a, b);
  }
}

