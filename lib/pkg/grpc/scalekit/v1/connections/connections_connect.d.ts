import { AssignDomainsToConnectionRequest, AssignDomainsToConnectionResponse, CreateConnectionRequest, CreateConnectionResponse, CreateEnvironmentConnectionRequest, DeleteConnectionRequest, DeleteEnvironmentConnectionRequest, GetConnectionRequest, GetConnectionResponse, GetConnectionTestResultRequest, GetConnectionTestResultResponse, GetEnvironmentConnectionRequest, ListAppConnectionsRequest, ListAppConnectionsResponse, ListConnectionsRequest, ListConnectionsResponse, ListOrganizationConnectionsRequest, ListOrganizationConnectionsResponse, SearchOrganizationConnectionsRequest, SearchOrganizationConnectionsResponse, ToggleConnectionRequest, ToggleConnectionResponse, ToggleEnvironmentConnectionRequest, UpdateConnectionRequest, UpdateConnectionResponse, UpdateEnvironmentConnectionRequest } from "./connections_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.connections.ConnectionService
 */
export declare const ConnectionService: {
    readonly typeName: "scalekit.v1.connections.ConnectionService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.CreateEnvironmentConnection
         */
        readonly createEnvironmentConnection: {
            readonly name: "CreateEnvironmentConnection";
            readonly I: typeof CreateEnvironmentConnectionRequest;
            readonly O: typeof CreateConnectionResponse;
            readonly kind: MethodKind.Unary;
        };
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
         * @generated from rpc scalekit.v1.connections.ConnectionService.AssignDomainsToConnection
         */
        readonly assignDomainsToConnection: {
            readonly name: "AssignDomainsToConnection";
            readonly I: typeof AssignDomainsToConnectionRequest;
            readonly O: typeof AssignDomainsToConnectionResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.GetEnvironmentConnection
         */
        readonly getEnvironmentConnection: {
            readonly name: "GetEnvironmentConnection";
            readonly I: typeof GetEnvironmentConnectionRequest;
            readonly O: typeof GetConnectionResponse;
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
         * @generated from rpc scalekit.v1.connections.ConnectionService.ListOrganizationConnections
         */
        readonly listOrganizationConnections: {
            readonly name: "ListOrganizationConnections";
            readonly I: typeof ListOrganizationConnectionsRequest;
            readonly O: typeof ListOrganizationConnectionsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.SearchOrganizationConnections
         */
        readonly searchOrganizationConnections: {
            readonly name: "SearchOrganizationConnections";
            readonly I: typeof SearchOrganizationConnectionsRequest;
            readonly O: typeof SearchOrganizationConnectionsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.UpdateEnvironmentConnection
         */
        readonly updateEnvironmentConnection: {
            readonly name: "UpdateEnvironmentConnection";
            readonly I: typeof UpdateEnvironmentConnectionRequest;
            readonly O: typeof UpdateConnectionResponse;
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
         * @generated from rpc scalekit.v1.connections.ConnectionService.DeleteEnvironmentConnection
         */
        readonly deleteEnvironmentConnection: {
            readonly name: "DeleteEnvironmentConnection";
            readonly I: typeof DeleteEnvironmentConnectionRequest;
            readonly O: typeof Empty;
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
         * @generated from rpc scalekit.v1.connections.ConnectionService.EnableEnvironmentConnection
         */
        readonly enableEnvironmentConnection: {
            readonly name: "EnableEnvironmentConnection";
            readonly I: typeof ToggleEnvironmentConnectionRequest;
            readonly O: typeof ToggleConnectionResponse;
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
         * @generated from rpc scalekit.v1.connections.ConnectionService.DisableEnvironmentConnection
         */
        readonly disableEnvironmentConnection: {
            readonly name: "DisableEnvironmentConnection";
            readonly I: typeof ToggleEnvironmentConnectionRequest;
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
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.GetConnectionTestResult
         */
        readonly getConnectionTestResult: {
            readonly name: "GetConnectionTestResult";
            readonly I: typeof GetConnectionTestResultRequest;
            readonly O: typeof GetConnectionTestResultResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.connections.ConnectionService.ListAppConnections
         */
        readonly listAppConnections: {
            readonly name: "ListAppConnections";
            readonly I: typeof ListAppConnectionsRequest;
            readonly O: typeof ListAppConnectionsResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
