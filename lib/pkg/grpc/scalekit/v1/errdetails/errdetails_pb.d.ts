import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
/**
 * @generated from message scalekit.v1.errdetails.ErrorInfo
 */
export declare class ErrorInfo extends Message<ErrorInfo> {
    /**
     * @generated from field: string error_code = 1;
     */
    errorCode: string;
    /**
     * @generated from field: optional scalekit.v1.errdetails.DebugInfo debug_info = 2;
     */
    debugInfo?: DebugInfo;
    /**
     * @generated from field: optional scalekit.v1.errdetails.HelpInfo help_info = 3;
     */
    helpInfo?: HelpInfo;
    /**
     * @generated from field: optional scalekit.v1.errdetails.LocalizedMessageInfo localized_message_info = 4;
     */
    localizedMessageInfo?: LocalizedMessageInfo;
    /**
     * @generated from field: optional scalekit.v1.errdetails.ResourceInfo resource_info = 5;
     */
    resourceInfo?: ResourceInfo;
    /**
     * @generated from field: optional scalekit.v1.errdetails.RequestInfo request_info = 6;
     */
    requestInfo?: RequestInfo;
    /**
     * @generated from field: optional scalekit.v1.errdetails.ValidationErrorInfo validation_error_info = 8;
     */
    validationErrorInfo?: ValidationErrorInfo;
    /**
     * @generated from field: optional scalekit.v1.errdetails.ToolErrorInfo tool_error_info = 9;
     */
    toolErrorInfo?: ToolErrorInfo;
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
 * @generated from message scalekit.v1.errdetails.ValidationErrorInfo
 */
export declare class ValidationErrorInfo extends Message<ValidationErrorInfo> {
    /**
     * Describes all violations in a client request.
     *
     * @generated from field: repeated scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation field_violations = 1;
     */
    fieldViolations: ValidationErrorInfo_FieldViolation[];
    constructor(data?: PartialMessage<ValidationErrorInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.ValidationErrorInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ValidationErrorInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ValidationErrorInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ValidationErrorInfo;
    static equals(a: ValidationErrorInfo | PlainMessage<ValidationErrorInfo> | undefined, b: ValidationErrorInfo | PlainMessage<ValidationErrorInfo> | undefined): boolean;
}
/**
 * A message type used to describe a single bad request field.
 *
 * @generated from message scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation
 */
export declare class ValidationErrorInfo_FieldViolation extends Message<ValidationErrorInfo_FieldViolation> {
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
    constructor(data?: PartialMessage<ValidationErrorInfo_FieldViolation>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ValidationErrorInfo_FieldViolation;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ValidationErrorInfo_FieldViolation;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ValidationErrorInfo_FieldViolation;
    static equals(a: ValidationErrorInfo_FieldViolation | PlainMessage<ValidationErrorInfo_FieldViolation> | undefined, b: ValidationErrorInfo_FieldViolation | PlainMessage<ValidationErrorInfo_FieldViolation> | undefined): boolean;
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
 * @generated from message scalekit.v1.errdetails.HelpInfo
 */
export declare class HelpInfo extends Message<HelpInfo> {
    /**
     * @generated from field: repeated scalekit.v1.errdetails.HelpInfo.Link links = 1;
     */
    links: HelpInfo_Link[];
    constructor(data?: PartialMessage<HelpInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.HelpInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): HelpInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): HelpInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): HelpInfo;
    static equals(a: HelpInfo | PlainMessage<HelpInfo> | undefined, b: HelpInfo | PlainMessage<HelpInfo> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.errdetails.HelpInfo.Link
 */
export declare class HelpInfo_Link extends Message<HelpInfo_Link> {
    /**
     * @generated from field: string description = 1;
     */
    description: string;
    /**
     * @generated from field: string url = 2;
     */
    url: string;
    constructor(data?: PartialMessage<HelpInfo_Link>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.HelpInfo.Link";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): HelpInfo_Link;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): HelpInfo_Link;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): HelpInfo_Link;
    static equals(a: HelpInfo_Link | PlainMessage<HelpInfo_Link> | undefined, b: HelpInfo_Link | PlainMessage<HelpInfo_Link> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.errdetails.LocalizedMessageInfo
 */
export declare class LocalizedMessageInfo extends Message<LocalizedMessageInfo> {
    /**
     * @generated from field: string locale = 1;
     */
    locale: string;
    /**
     * @generated from field: string message = 2;
     */
    message: string;
    constructor(data?: PartialMessage<LocalizedMessageInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.LocalizedMessageInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LocalizedMessageInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LocalizedMessageInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LocalizedMessageInfo;
    static equals(a: LocalizedMessageInfo | PlainMessage<LocalizedMessageInfo> | undefined, b: LocalizedMessageInfo | PlainMessage<LocalizedMessageInfo> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.errdetails.ToolErrorInfo
 */
export declare class ToolErrorInfo extends Message<ToolErrorInfo> {
    /**
     * @generated from field: string execution_id = 1;
     */
    executionId: string;
    /**
     * @generated from field: string tool_error_message = 2;
     */
    toolErrorMessage: string;
    /**
     * @generated from field: string tool_error_code = 3;
     */
    toolErrorCode: string;
    constructor(data?: PartialMessage<ToolErrorInfo>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.errdetails.ToolErrorInfo";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ToolErrorInfo;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ToolErrorInfo;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ToolErrorInfo;
    static equals(a: ToolErrorInfo | PlainMessage<ToolErrorInfo> | undefined, b: ToolErrorInfo | PlainMessage<ToolErrorInfo> | undefined): boolean;
}
