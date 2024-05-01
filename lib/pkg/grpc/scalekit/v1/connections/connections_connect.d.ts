import { CreateConnectionRequest, CreateConnectionResponse, DeleteConnectionRequest, GetConnectionRequest, GetConnectionResponse, ListConnectionsRequest, ListConnectionsResponse, ToggleConnectionRequest, ToggleConnectionResponse, UpdateConnectionRequest, UpdateConnectionResponse } from "./connections_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.connections.ConnectionService
 */
export declare const ConnectionService: {
    readonly typeName: "scalekit.v1.connections.ConnectionService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.CreateConnection
         */
        readonly createConnection: {
            readonly name: "CreateConnection";
            readonly I: typeof CreateConnectionRequest;
            readonly O: typeof CreateConnectionResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.GetConnection
         */
        readonly getConnection: {
            readonly name: "GetConnection";
            readonly I: typeof GetConnectionRequest;
            readonly O: typeof GetConnectionResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.ListConnections
         */
        readonly listConnections: {
            readonly name: "ListConnections";
            readonly I: typeof ListConnectionsRequest;
            readonly O: typeof ListConnectionsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.UpdateConnection
         */
        readonly updateConnection: {
            readonly name: "UpdateConnection";
            readonly I: typeof UpdateConnectionRequest;
            readonly O: typeof UpdateConnectionResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.DeleteConnection
         */
        readonly deleteConnection: {
            readonly name: "DeleteConnection";
            readonly I: typeof DeleteConnectionRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.EnableConnection
         */
        readonly enableConnection: {
            readonly name: "EnableConnection";
            readonly I: typeof ToggleConnectionRequest;
            readonly O: typeof ToggleConnectionResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.DisableConnection
         */
        readonly disableConnection: {
            readonly name: "DisableConnection";
            readonly I: typeof ToggleConnectionRequest;
            readonly O: typeof ToggleConnectionResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
