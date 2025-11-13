import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from message scalekit.v1.auditlogs.ListAuthLogRequest
 */
export declare class ListAuthLogRequest extends Message<ListAuthLogRequest> {
    /**
     * @generated from field: uint32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
    /**
     * @generated from field: string email = 3;
     */
    email: string;
    /**
     * @generated from field: repeated string status = 4;
     */
    status: string[];
    /**
     * @generated from field: google.protobuf.Timestamp start_time = 5;
     */
    startTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp end_time = 6;
     */
    endTime?: Timestamp;
    /**
     * @generated from field: string resource_id = 7;
     */
    resourceId: string;
    constructor(data?: PartialMessage<ListAuthLogRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auditlogs.ListAuthLogRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAuthLogRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAuthLogRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAuthLogRequest;
    static equals(a: ListAuthLogRequest | PlainMessage<ListAuthLogRequest> | undefined, b: ListAuthLogRequest | PlainMessage<ListAuthLogRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auditlogs.ListAuthLogResponse
 */
export declare class ListAuthLogResponse extends Message<ListAuthLogResponse> {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 2;
     */
    prevPageToken: string;
    /**
     * @generated from field: uint32 total_size = 3;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.auditlogs.AuthLogRequest authRequests = 4;
     */
    authRequests: AuthLogRequest[];
    constructor(data?: PartialMessage<ListAuthLogResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auditlogs.ListAuthLogResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAuthLogResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAuthLogResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAuthLogResponse;
    static equals(a: ListAuthLogResponse | PlainMessage<ListAuthLogResponse> | undefined, b: ListAuthLogResponse | PlainMessage<ListAuthLogResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auditlogs.AuthLogRequest
 */
export declare class AuthLogRequest extends Message<AuthLogRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string environment_id = 2;
     */
    environmentId: string;
    /**
     * @generated from field: string connection_id = 3;
     */
    connectionId: string;
    /**
     * @generated from field: string auth_request_id = 4;
     */
    authRequestId: string;
    /**
     * @generated from field: string email = 5;
     */
    email: string;
    /**
     * @generated from field: string connection_type = 6;
     */
    connectionType: string;
    /**
     * @generated from field: string connection_provider = 7;
     */
    connectionProvider: string;
    /**
     * @generated from field: string status = 8;
     */
    status: string;
    /**
     * @generated from field: google.protobuf.Timestamp timestamp = 9;
     */
    timestamp?: Timestamp;
    /**
     * @generated from field: repeated scalekit.v1.auditlogs.ConnectionDetails connection_details = 10;
     */
    connectionDetails: ConnectionDetails[];
    /**
     * @generated from field: string workflow = 11;
     */
    workflow: string;
    /**
     * @generated from field: string resource_id = 12;
     */
    resourceId: string;
    /**
     * @generated from field: string resource_name = 13;
     */
    resourceName: string;
    /**
     * @generated from field: string resource_type = 14;
     */
    resourceType: string;
    constructor(data?: PartialMessage<AuthLogRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auditlogs.AuthLogRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AuthLogRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AuthLogRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AuthLogRequest;
    static equals(a: AuthLogRequest | PlainMessage<AuthLogRequest> | undefined, b: AuthLogRequest | PlainMessage<AuthLogRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.auditlogs.ConnectionDetails
 */
export declare class ConnectionDetails extends Message<ConnectionDetails> {
    /**
     * @generated from field: string connection_id = 1;
     */
    connectionId: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    /**
     * @generated from field: string connection_type = 3;
     */
    connectionType: string;
    /**
     * @generated from field: string connection_provider = 4;
     */
    connectionProvider: string;
    constructor(data?: PartialMessage<ConnectionDetails>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.auditlogs.ConnectionDetails";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ConnectionDetails;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ConnectionDetails;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ConnectionDetails;
    static equals(a: ConnectionDetails | PlainMessage<ConnectionDetails> | undefined, b: ConnectionDetails | PlainMessage<ConnectionDetails> | undefined): boolean;
}
