import { ListAuthLogRequest, ListAuthLogResponse } from "./auditlogs_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.auditlogs.AuditLogsService
 */
export declare const AuditLogsService: {
    readonly typeName: "scalekit.v1.auditlogs.AuditLogsService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.auditlogs.AuditLogsService.ListAuthRequests
         */
        readonly listAuthRequests: {
            readonly name: "ListAuthRequests";
            readonly I: typeof ListAuthLogRequest;
            readonly O: typeof ListAuthLogResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
