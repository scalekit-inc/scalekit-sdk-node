import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
/**
 * @generated from message scalekit.v1.errdetails.ErrorInfo
 */
export declare class ErrorInfo extends Message<ErrorInfo> {
    /**
     * @generated from field: string code_id = 3;
     */
    codeId: string;
    /**
     * @generated from field: string error_code = 4;
     */
    errorCode: string;
    constructor(data?: PartialMessage<ErrorInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.ErrorInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ErrorInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ErrorInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ErrorInfo;
    static equals(a: ErrorInfo | PlainMessage<ErrorInfo> | undefined, b: ErrorInfo | PlainMessage<ErrorInfo> | undefined): boolean;
}
/**
 * Describes additional debugging info.
 *
 * @generated from message scalekit.v1.errdetails.DebugInfo
 */
export declare class DebugInfo extends Message<DebugInfo> {
    /**
     * The stack trace entries indicating where the error occurred.
     *
     * @generated from field: repeated string stack_entries = 1;
     */
    stackEntries: string[];
    /**
     * Additional debugging information provided by the server.
     *
     * @generated from field: string detail = 2;
     */
    detail: string;
    constructor(data?: PartialMessage<DebugInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.DebugInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DebugInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DebugInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DebugInfo;
    static equals(a: DebugInfo | PlainMessage<DebugInfo> | undefined, b: DebugInfo | PlainMessage<DebugInfo> | undefined): boolean;
}
/**
 * Describes violations in a client request. This error type focuses on the
 * syntactic aspects of the request.
 *
 * @generated from message scalekit.v1.errdetails.BadRequest
 */
export declare class BadRequest extends Message<BadRequest> {
    /**
     * Describes all violations in a client request.
     *
     * @generated from field: repeated scalekit.v1.errdetails.BadRequest.FieldViolation field_violations = 1;
     */
    fieldViolations: BadRequest_FieldViolation[];
    constructor(data?: PartialMessage<BadRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.BadRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BadRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BadRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BadRequest;
    static equals(a: BadRequest | PlainMessage<BadRequest> | undefined, b: BadRequest | PlainMessage<BadRequest> | undefined): boolean;
}
/**
 * A message type used to describe a single bad request field.
 *
 * @generated from message scalekit.v1.errdetails.BadRequest.FieldViolation
 */
export declare class BadRequest_FieldViolation extends Message<BadRequest_FieldViolation> {
    /**
     * @generated from field: string field = 1;
     */
    field: string;
    /**
     * A description of why the request element is bad.
     *
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: string constraint = 3;
     */
    constraint: string;
    constructor(data?: PartialMessage<BadRequest_FieldViolation>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.BadRequest.FieldViolation";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BadRequest_FieldViolation;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BadRequest_FieldViolation;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BadRequest_FieldViolation;
    static equals(a: BadRequest_FieldViolation | PlainMessage<BadRequest_FieldViolation> | undefined, b: BadRequest_FieldViolation | PlainMessage<BadRequest_FieldViolation> | undefined): boolean;
}
/**
 * Contains metadata about the request that clients can attach when filing a bug
 * or providing other forms of feedback.
 *
 * @generated from message scalekit.v1.errdetails.RequestInfo
 */
export declare class RequestInfo extends Message<RequestInfo> {
    /**
     * An opaque string that should only be interpreted by the service generating
     * it. For example, it can be used to identify requests in the service's logs.
     *
     * @generated from field: string request_id = 1;
     */
    requestId: string;
    /**
     * Any data that was used to serve this request. For example, an encrypted
     * stack trace that can be sent back to the service provider for debugging.
     *
     * @generated from field: string serving_data = 2;
     */
    servingData: string;
    constructor(data?: PartialMessage<RequestInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.RequestInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RequestInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RequestInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RequestInfo;
    static equals(a: RequestInfo | PlainMessage<RequestInfo> | undefined, b: RequestInfo | PlainMessage<RequestInfo> | undefined): boolean;
}
/**
 * Describes the resource that is being accessed.
 *
 * @generated from message scalekit.v1.errdetails.ResourceInfo
 */
export declare class ResourceInfo extends Message<ResourceInfo> {
    /**
     * @generated from field: string resource_type = 1;
     */
    resourceType: string;
    /**
     * @generated from field: string resource_name = 2;
     */
    resourceName: string;
    /**
     * @generated from field: string owner = 3;
     */
    owner: string;
    /**
     * Describes what error is encountered when accessing this resource.
     * For example, updating a cloud project may require the `writer` permission
     * on the developer console project.
     *
     * @generated from field: string description = 4;
     */
    description: string;
    constructor(data?: PartialMessage<ResourceInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.ResourceInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ResourceInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ResourceInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ResourceInfo;
    static equals(a: ResourceInfo | PlainMessage<ResourceInfo> | undefined, b: ResourceInfo | PlainMessage<ResourceInfo> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.errdetails.Help
 */
export declare class Help extends Message<Help> {
    /**
     * @generated from field: repeated scalekit.v1.errdetails.Help.Link links = 1;
     */
    links: Help_Link[];
    constructor(data?: PartialMessage<Help>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.Help";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Help;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Help;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Help;
    static equals(a: Help | PlainMessage<Help> | undefined, b: Help | PlainMessage<Help> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.errdetails.Help.Link
 */
export declare class Help_Link extends Message<Help_Link> {
    /**
     * @generated from field: string description = 1;
     */
    description: string;
    /**
     * @generated from field: string url = 2;
     */
    url: string;
    constructor(data?: PartialMessage<Help_Link>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.Help.Link";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Help_Link;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Help_Link;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Help_Link;
    static equals(a: Help_Link | PlainMessage<Help_Link> | undefined, b: Help_Link | PlainMessage<Help_Link> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.errdetails.LocalizedMessage
 */
export declare class LocalizedMessage extends Message<LocalizedMessage> {
    /**
     * @generated from field: string locale = 1;
     */
    locale: string;
    /**
     * @generated from field: string message = 2;
     */
    message: string;
    constructor(data?: PartialMessage<LocalizedMessage>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.LocalizedMessage";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LocalizedMessage;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LocalizedMessage;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LocalizedMessage;
    static equals(a: LocalizedMessage | PlainMessage<LocalizedMessage> | undefined, b: LocalizedMessage | PlainMessage<LocalizedMessage> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.errdetails.SsoErrorInfo
 */
export declare class SsoErrorInfo extends Message<SsoErrorInfo> {
    /**
     * @generated from field: string code = 1;
     */
    code: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: map<string, string> redirect_params = 3;
     */
    redirectParams: {
        [key: string]: string;
    };
    /**
     * @generated from field: string redirect_url = 4;
     */
    redirectUrl: string;
    constructor(data?: PartialMessage<SsoErrorInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.SsoErrorInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SsoErrorInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SsoErrorInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SsoErrorInfo;
    static equals(a: SsoErrorInfo | PlainMessage<SsoErrorInfo> | undefined, b: SsoErrorInfo | PlainMessage<SsoErrorInfo> | undefined): boolean;
}
