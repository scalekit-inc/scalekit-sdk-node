// @generated by protoc-gen-connect-es v1.4.0 with parameter "target=ts"
// @generated from file scalekit/v1/connections/connections.proto (package scalekit.v1.connections, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { CreateConnectionRequest, CreateConnectionResponse, DeleteConnectionRequest, GetConnectionRequest, GetConnectionResponse, ListConnectionsRequest, ListConnectionsResponse, ToggleConnectionRequest, ToggleConnectionResponse, UpdateConnectionRequest, UpdateConnectionResponse } from "./connections_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service scalekit.v1.connections.ConnectionService
 */
export const ConnectionService = {
  typeName: "scalekit.v1.connections.ConnectionService",
  methods: {
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.CreateConnection
     */
    createConnection: {
      name: "CreateConnection",
      I: CreateConnectionRequest,
      O: CreateConnectionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.GetConnection
     */
    getConnection: {
      name: "GetConnection",
      I: GetConnectionRequest,
      O: GetConnectionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.ListConnections
     */
    listConnections: {
      name: "ListConnections",
      I: ListConnectionsRequest,
      O: ListConnectionsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.UpdateConnection
     */
    updateConnection: {
      name: "UpdateConnection",
      I: UpdateConnectionRequest,
      O: UpdateConnectionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.DeleteConnection
     */
    deleteConnection: {
      name: "DeleteConnection",
      I: DeleteConnectionRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.EnableConnection
     */
    enableConnection: {
      name: "EnableConnection",
      I: ToggleConnectionRequest,
      O: ToggleConnectionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.connections.ConnectionService.DisableConnection
     */
    disableConnection: {
      name: "DisableConnection",
      I: ToggleConnectionRequest,
      O: ToggleConnectionResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

