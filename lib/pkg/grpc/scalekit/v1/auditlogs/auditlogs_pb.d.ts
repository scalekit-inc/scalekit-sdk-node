import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/auditlogs/auditlogs.proto.
 */
export declare const file_scalekit_v1_auditlogs_auditlogs: GenFile;
/**
 * @generated from message scalekit.v1.auditlogs.ListAuthLogRequest
 */
export type ListAuthLogRequest = Message<"scalekit.v1.auditlogs.ListAuthLogRequest"> & {
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
    /**
     * @generated from field: string connected_account_identifier = 8;
     */
    connectedAccountIdentifier: string;
    /**
     * @generated from field: string client_id = 9;
     */
    clientId: string;
};
/**
 * Describes the message scalekit.v1.auditlogs.ListAuthLogRequest.
 * Use `create(ListAuthLogRequestSchema)` to create a new message.
 */
export declare const ListAuthLogRequestSchema: GenMessage<ListAuthLogRequest>;
/**
 * @generated from message scalekit.v1.auditlogs.ListAuthLogResponse
 */
export type ListAuthLogResponse = Message<"scalekit.v1.auditlogs.ListAuthLogResponse"> & {
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
};
/**
 * Describes the message scalekit.v1.auditlogs.ListAuthLogResponse.
 * Use `create(ListAuthLogResponseSchema)` to create a new message.
 */
export declare const ListAuthLogResponseSchema: GenMessage<ListAuthLogResponse>;
/**
 * @generated from message scalekit.v1.auditlogs.AuthLogRequest
 */
export type AuthLogRequest = Message<"scalekit.v1.auditlogs.AuthLogRequest"> & {
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
    /**
     * @generated from field: string connected_account_identifier = 15;
     */
    connectedAccountIdentifier: string;
    /**
     * @generated from field: string client_id = 16;
     */
    clientId: string;
    /**
     * @generated from field: string client_name = 17;
     */
    clientName: string;
    /**
     * @generated from field: string client_type = 18;
     */
    clientType: string;
};
/**
 * Describes the message scalekit.v1.auditlogs.AuthLogRequest.
 * Use `create(AuthLogRequestSchema)` to create a new message.
 */
export declare const AuthLogRequestSchema: GenMessage<AuthLogRequest>;
/**
 * @generated from message scalekit.v1.auditlogs.ConnectionDetails
 */
export type ConnectionDetails = Message<"scalekit.v1.auditlogs.ConnectionDetails"> & {
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
};
/**
 * Describes the message scalekit.v1.auditlogs.ConnectionDetails.
 * Use `create(ConnectionDetailsSchema)` to create a new message.
 */
export declare const ConnectionDetailsSchema: GenMessage<ConnectionDetails>;
/**
 * @generated from service scalekit.v1.auditlogs.AuditLogsService
 */
export declare const AuditLogsService: GenService<{
    /**
     * @generated from rpc scalekit.v1.auditlogs.AuditLogsService.ListAuthRequests
     */
    listAuthRequests: {
        methodKind: "unary";
        input: typeof ListAuthLogRequestSchema;
        output: typeof ListAuthLogResponseSchema;
    };
}>;
