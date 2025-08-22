import { AssignUserRolesRequest, AssignUserRolesResponse, CreateMembershipRequest, CreateMembershipResponse, CreateUserAndMembershipRequest, CreateUserAndMembershipResponse, DeleteMembershipRequest, DeleteUserRequest, GetUserRequest, GetUserResponse, ListOrganizationUsersRequest, ListOrganizationUsersResponse, ListUserPermissionsRequest, ListUserPermissionsResponse, ListUserRolesRequest, ListUserRolesResponse, ListUsersRequest, ListUsersResponse, RemoveUserRoleRequest, ResendInviteRequest, ResendInviteResponse, SearchOrganizationUsersRequest, SearchOrganizationUsersResponse, SearchUsersRequest, SearchUsersResponse, UpdateMembershipRequest, UpdateMembershipResponse, UpdateUserRequest, UpdateUserResponse } from "./users_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service scalekit.v1.users.UserService
 */
export declare const UserService: {
    readonly typeName: "scalekit.v1.users.UserService";
    readonly methods: {
        /**
         * Users
         *
         * @generated from rpc scalekit.v1.users.UserService.GetUser
         */
        readonly getUser: {
            readonly name: "GetUser";
            readonly I: typeof GetUserRequest;
            readonly O: typeof GetUserResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.ListUsers
         */
        readonly listUsers: {
            readonly name: "ListUsers";
            readonly I: typeof ListUsersRequest;
            readonly O: typeof ListUsersResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.SearchUsers
         */
        readonly searchUsers: {
            readonly name: "SearchUsers";
            readonly I: typeof SearchUsersRequest;
            readonly O: typeof SearchUsersResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.SearchOrganizationUsers
         */
        readonly searchOrganizationUsers: {
            readonly name: "SearchOrganizationUsers";
            readonly I: typeof SearchOrganizationUsersRequest;
            readonly O: typeof SearchOrganizationUsersResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.UpdateUser
         */
        readonly updateUser: {
            readonly name: "UpdateUser";
            readonly I: typeof UpdateUserRequest;
            readonly O: typeof UpdateUserResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.DeleteUser
         */
        readonly deleteUser: {
            readonly name: "DeleteUser";
            readonly I: typeof DeleteUserRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * Memberships
         *
         * @generated from rpc scalekit.v1.users.UserService.CreateMembership
         */
        readonly createMembership: {
            readonly name: "CreateMembership";
            readonly I: typeof CreateMembershipRequest;
            readonly O: typeof CreateMembershipResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * TODO Check cascade behaviour currently its ignored
         *
         * @generated from rpc scalekit.v1.users.UserService.DeleteMembership
         */
        readonly deleteMembership: {
            readonly name: "DeleteMembership";
            readonly I: typeof DeleteMembershipRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.UpdateMembership
         */
        readonly updateMembership: {
            readonly name: "UpdateMembership";
            readonly I: typeof UpdateMembershipRequest;
            readonly O: typeof UpdateMembershipResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.CreateUserAndMembership
         */
        readonly createUserAndMembership: {
            readonly name: "CreateUserAndMembership";
            readonly I: typeof CreateUserAndMembershipRequest;
            readonly O: typeof CreateUserAndMembershipResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * only memberships of the organization
         *
         * @generated from rpc scalekit.v1.users.UserService.ListOrganizationUsers
         */
        readonly listOrganizationUsers: {
            readonly name: "ListOrganizationUsers";
            readonly I: typeof ListOrganizationUsersRequest;
            readonly O: typeof ListOrganizationUsersResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.ResendInvite
         */
        readonly resendInvite: {
            readonly name: "ResendInvite";
            readonly I: typeof ResendInviteRequest;
            readonly O: typeof ResendInviteResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * User Role Management
         *
         * @generated from rpc scalekit.v1.users.UserService.ListUserRoles
         */
        readonly listUserRoles: {
            readonly name: "ListUserRoles";
            readonly I: typeof ListUserRolesRequest;
            readonly O: typeof ListUserRolesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.AssignUserRoles
         */
        readonly assignUserRoles: {
            readonly name: "AssignUserRoles";
            readonly I: typeof AssignUserRolesRequest;
            readonly O: typeof AssignUserRolesResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.RemoveUserRole
         */
        readonly removeUserRole: {
            readonly name: "RemoveUserRole";
            readonly I: typeof RemoveUserRoleRequest;
            readonly O: typeof Empty;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc scalekit.v1.users.UserService.ListUserPermissions
         */
        readonly listUserPermissions: {
            readonly name: "ListUserPermissions";
            readonly I: typeof ListUserPermissionsRequest;
            readonly O: typeof ListUserPermissionsResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
