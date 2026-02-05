import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/errdetails/errdetails.proto.
 */
export declare const file_scalekit_v1_errdetails_errdetails: GenFile;
/**
 * @generated from message scalekit.v1.errdetails.ErrorInfo
 */
export type ErrorInfo = Message<"scalekit.v1.errdetails.ErrorInfo"> & {
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
};
/**
 * Describes the message scalekit.v1.errdetails.ErrorInfo.
 * Use `create(ErrorInfoSchema)` to create a new message.
 */
export declare const ErrorInfoSchema: GenMessage<ErrorInfo>;
/**
 * Describes additional debugging info.
 *
 * @generated from message scalekit.v1.errdetails.DebugInfo
 */
export type DebugInfo = Message<"scalekit.v1.errdetails.DebugInfo"> & {
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
};
/**
 * Describes the message scalekit.v1.errdetails.DebugInfo.
 * Use `create(DebugInfoSchema)` to create a new message.
 */
export declare const DebugInfoSchema: GenMessage<DebugInfo>;
/**
 * Describes violations in a client request. This error type focuses on the
 * syntactic aspects of the request.
 *
 * @generated from message scalekit.v1.errdetails.ValidationErrorInfo
 */
export type ValidationErrorInfo = Message<"scalekit.v1.errdetails.ValidationErrorInfo"> & {
    /**
     * Describes all violations in a client request.
     *
     * @generated from field: repeated scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation field_violations = 1;
     */
    fieldViolations: ValidationErrorInfo_FieldViolation[];
};
/**
 * Describes the message scalekit.v1.errdetails.ValidationErrorInfo.
 * Use `create(ValidationErrorInfoSchema)` to create a new message.
 */
export declare const ValidationErrorInfoSchema: GenMessage<ValidationErrorInfo>;
/**
 * A message type used to describe a single bad request field.
 *
 * @generated from message scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation
 */
export type ValidationErrorInfo_FieldViolation = Message<"scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation"> & {
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
};
/**
 * Describes the message scalekit.v1.errdetails.ValidationErrorInfo.FieldViolation.
 * Use `create(ValidationErrorInfo_FieldViolationSchema)` to create a new message.
 */
export declare const ValidationErrorInfo_FieldViolationSchema: GenMessage<ValidationErrorInfo_FieldViolation>;
/**
 * Contains metadata about the request that clients can attach when filing a bug
 * or providing other forms of feedback.
 *
 * @generated from message scalekit.v1.errdetails.RequestInfo
 */
export type RequestInfo = Message<"scalekit.v1.errdetails.RequestInfo"> & {
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
};
/**
 * Describes the message scalekit.v1.errdetails.RequestInfo.
 * Use `create(RequestInfoSchema)` to create a new message.
 */
export declare const RequestInfoSchema: GenMessage<RequestInfo>;
/**
 * Describes the resource that is being accessed.
 *
 * @generated from message scalekit.v1.errdetails.ResourceInfo
 */
export type ResourceInfo = Message<"scalekit.v1.errdetails.ResourceInfo"> & {
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
    /**
     * The required permissions needed to access the resource.
     *
     * @generated from field: repeated string required_permissions = 5;
     */
    requiredPermissions: string[];
    /**
     * @generated from field: string user = 6;
     */
    user: string;
};
/**
 * Describes the message scalekit.v1.errdetails.ResourceInfo.
 * Use `create(ResourceInfoSchema)` to create a new message.
 */
export declare const ResourceInfoSchema: GenMessage<ResourceInfo>;
/**
 * @generated from message scalekit.v1.errdetails.HelpInfo
 */
export type HelpInfo = Message<"scalekit.v1.errdetails.HelpInfo"> & {
    /**
     * @generated from field: repeated scalekit.v1.errdetails.HelpInfo.Link links = 1;
     */
    links: HelpInfo_Link[];
};
/**
 * Describes the message scalekit.v1.errdetails.HelpInfo.
 * Use `create(HelpInfoSchema)` to create a new message.
 */
export declare const HelpInfoSchema: GenMessage<HelpInfo>;
/**
 * @generated from message scalekit.v1.errdetails.HelpInfo.Link
 */
export type HelpInfo_Link = Message<"scalekit.v1.errdetails.HelpInfo.Link"> & {
    /**
     * @generated from field: string description = 1;
     */
    description: string;
    /**
     * @generated from field: string url = 2;
     */
    url: string;
};
/**
 * Describes the message scalekit.v1.errdetails.HelpInfo.Link.
 * Use `create(HelpInfo_LinkSchema)` to create a new message.
 */
export declare const HelpInfo_LinkSchema: GenMessage<HelpInfo_Link>;
/**
 * @generated from message scalekit.v1.errdetails.LocalizedMessageInfo
 */
export type LocalizedMessageInfo = Message<"scalekit.v1.errdetails.LocalizedMessageInfo"> & {
    /**
     * @generated from field: string locale = 1;
     */
    locale: string;
    /**
     * @generated from field: string message = 2;
     */
    message: string;
};
/**
 * Describes the message scalekit.v1.errdetails.LocalizedMessageInfo.
 * Use `create(LocalizedMessageInfoSchema)` to create a new message.
 */
export declare const LocalizedMessageInfoSchema: GenMessage<LocalizedMessageInfo>;
/**
 * @generated from message scalekit.v1.errdetails.ToolErrorInfo
 */
export type ToolErrorInfo = Message<"scalekit.v1.errdetails.ToolErrorInfo"> & {
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
};
/**
 * Describes the message scalekit.v1.errdetails.ToolErrorInfo.
 * Use `create(ToolErrorInfoSchema)` to create a new message.
 */
export declare const ToolErrorInfoSchema: GenMessage<ToolErrorInfo>;
