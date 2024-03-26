import { CreateWorkspaceRequest, CreateWorkspaceResponse, GetCurrentWorkspaceRequest, GetWorkspaceRequest, GetWorkspaceResponse, UpdateCurrentWorkspaceRequest, UpdateWorkspaceRequest, UpdateWorkspaceResponse } from "./workspaces_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.workspaces.WorkspaceService
 */
export declare const WorkspaceService: {
    readonly typeName: "scalekit.v1.workspaces.WorkspaceService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.workspaces.WorkspaceService.CreateWorkspace
         */
        readonly createWorkspace: {
            readonly name: "CreateWorkspace";
            readonly I: typeof CreateWorkspaceRequest;
            readonly O: typeof CreateWorkspaceResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.workspaces.WorkspaceService.GetWorkspace
         */
        readonly getWorkspace: {
            readonly name: "GetWorkspace";
            readonly I: typeof GetWorkspaceRequest;
            readonly O: typeof GetWorkspaceResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.workspaces.WorkspaceService.GetCurrentWorkspace
         */
        readonly getCurrentWorkspace: {
            readonly name: "GetCurrentWorkspace";
            readonly I: typeof GetCurrentWorkspaceRequest;
            readonly O: typeof GetWorkspaceResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.workspaces.WorkspaceService.UpdateWorkspace
         */
        readonly updateWorkspace: {
            readonly name: "UpdateWorkspace";
            readonly I: typeof UpdateWorkspaceRequest;
            readonly O: typeof UpdateWorkspaceResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.workspaces.WorkspaceService.UpdateCurrentWorkspace
         */
        readonly updateCurrentWorkspace: {
            readonly name: "UpdateCurrentWorkspace";
            readonly I: typeof UpdateCurrentWorkspaceRequest;
            readonly O: typeof UpdateWorkspaceResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
