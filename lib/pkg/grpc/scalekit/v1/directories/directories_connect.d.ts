import { AssignRolesRequest, AssignRolesResponse, CreateDirectoryRequest, CreateDirectoryResponse, CreateDirectorySecretRequest, CreateDirectorySecretResponse, GetDirectoryRequest, GetDirectoryResponse, ListDirectoriesRequest, ListDirectoriesResponse, ListDirectoryGroupsRequest, ListDirectoryGroupsResponse, ListDirectoryUsersRequest, ListDirectoryUsersResponse, RegenerateDirectorySecretRequest, RegenerateDirectorySecretResponse, ToggleDirectoryRequest, ToggleDirectoryResponse, UpdateAttributesRequest, UpdateAttributesResponse, UpdateDirectoryRequest, UpdateDirectoryResponse } from "./directories_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.directories.DirectoryService
 */
export declare const DirectoryService: {
    readonly typeName: "scalekit.v1.directories.DirectoryService";
    readonly methods: {
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.CreateDirectory
         */
        readonly createDirectory: {
            readonly name: "CreateDirectory";
            readonly I: typeof CreateDirectoryRequest;
            readonly O: typeof CreateDirectoryResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.UpdateDirectory
         */
        readonly updateDirectory: {
            readonly name: "UpdateDirectory";
            readonly I: typeof UpdateDirectoryRequest;
            readonly O: typeof UpdateDirectoryResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.AssignRoles
         */
        readonly assignRoles: {
            readonly name: "AssignRoles";
            readonly I: typeof AssignRolesRequest;
            readonly O: typeof AssignRolesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.UpdateAttributes
         */
        readonly updateAttributes: {
            readonly name: "UpdateAttributes";
            readonly I: typeof UpdateAttributesRequest;
            readonly O: typeof UpdateAttributesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.GetDirectory
         */
        readonly getDirectory: {
            readonly name: "GetDirectory";
            readonly I: typeof GetDirectoryRequest;
            readonly O: typeof GetDirectoryResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.ListDirectories
         */
        readonly listDirectories: {
            readonly name: "ListDirectories";
            readonly I: typeof ListDirectoriesRequest;
            readonly O: typeof ListDirectoriesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.EnableDirectory
         */
        readonly enableDirectory: {
            readonly name: "EnableDirectory";
            readonly I: typeof ToggleDirectoryRequest;
            readonly O: typeof ToggleDirectoryResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.DisableDirectory
         */
        readonly disableDirectory: {
            readonly name: "DisableDirectory";
            readonly I: typeof ToggleDirectoryRequest;
            readonly O: typeof ToggleDirectoryResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.ListDirectoryUsers
         */
        readonly listDirectoryUsers: {
            readonly name: "ListDirectoryUsers";
            readonly I: typeof ListDirectoryUsersRequest;
            readonly O: typeof ListDirectoryUsersResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.ListDirectoryGroups
         */
        readonly listDirectoryGroups: {
            readonly name: "ListDirectoryGroups";
            readonly I: typeof ListDirectoryGroupsRequest;
            readonly O: typeof ListDirectoryGroupsResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.CreateDirectorySecret
         */
        readonly createDirectorySecret: {
            readonly name: "CreateDirectorySecret";
            readonly I: typeof CreateDirectorySecretRequest;
            readonly O: typeof CreateDirectorySecretResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.directories.DirectoryService.RegenerateDirectorySecret
         */
        readonly regenerateDirectorySecret: {
            readonly name: "RegenerateDirectorySecret";
            readonly I: typeof RegenerateDirectorySecretRequest;
            readonly O: typeof RegenerateDirectorySecretResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
