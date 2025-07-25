// @generated by protoc-gen-connect-es v1.4.0 with parameter "target=ts"
// @generated from file scalekit/v1/users/users.proto (package scalekit.v1.users, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { CreateMembershipRequest, CreateMembershipResponse, CreateUserAndMembershipRequest, CreateUserAndMembershipResponse, DeleteMembershipRequest, DeleteUserRequest, GetUserRequest, GetUserResponse, ListOrganizationUsersRequest, ListOrganizationUsersResponse, ListUsersRequest, ListUsersResponse, SearchOrganizationUsersRequest, SearchOrganizationUsersResponse, SearchUsersRequest, SearchUsersResponse, UpdateMembershipRequest, UpdateMembershipResponse, UpdateUserRequest, UpdateUserResponse } from "./users_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service scalekit.v1.users.UserService
 */
export const UserService = {
  typeName: "scalekit.v1.users.UserService",
  methods: {
    /**
     * Users
     *
     * @generated from rpc scalekit.v1.users.UserService.GetUser
     */
    getUser: {
      name: "GetUser",
      I: GetUserRequest,
      O: GetUserResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.users.UserService.ListUsers
     */
    listUsers: {
      name: "ListUsers",
      I: ListUsersRequest,
      O: ListUsersResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.users.UserService.SearchUsers
     */
    searchUsers: {
      name: "SearchUsers",
      I: SearchUsersRequest,
      O: SearchUsersResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.users.UserService.SearchOrganizationUsers
     */
    searchOrganizationUsers: {
      name: "SearchOrganizationUsers",
      I: SearchOrganizationUsersRequest,
      O: SearchOrganizationUsersResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.users.UserService.UpdateUser
     */
    updateUser: {
      name: "UpdateUser",
      I: UpdateUserRequest,
      O: UpdateUserResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.users.UserService.DeleteUser
     */
    deleteUser: {
      name: "DeleteUser",
      I: DeleteUserRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * Memberships
     *
     * @generated from rpc scalekit.v1.users.UserService.CreateMembership
     */
    createMembership: {
      name: "CreateMembership",
      I: CreateMembershipRequest,
      O: CreateMembershipResponse,
      kind: MethodKind.Unary,
    },
    /**
     * TODO Check cascade behaviour currently its ignored
     *
     * @generated from rpc scalekit.v1.users.UserService.DeleteMembership
     */
    deleteMembership: {
      name: "DeleteMembership",
      I: DeleteMembershipRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.users.UserService.UpdateMembership
     */
    updateMembership: {
      name: "UpdateMembership",
      I: UpdateMembershipRequest,
      O: UpdateMembershipResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc scalekit.v1.users.UserService.CreateUserAndMembership
     */
    createUserAndMembership: {
      name: "CreateUserAndMembership",
      I: CreateUserAndMembershipRequest,
      O: CreateUserAndMembershipResponse,
      kind: MethodKind.Unary,
    },
    /**
     * only memberships of the organization
     *
     * @generated from rpc scalekit.v1.users.UserService.ListOrganizationUsers
     */
    listOrganizationUsers: {
      name: "ListOrganizationUsers",
      I: ListOrganizationUsersRequest,
      O: ListOrganizationUsersResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

