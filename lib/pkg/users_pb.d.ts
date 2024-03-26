import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from message scalekit.v1.users.User
 */
export declare class User extends Message<User> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 2;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 3;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: string first_name = 4;
     */
    firstName: string;
    /**
     * @generated from field: string last_name = 5;
     */
    lastName: string;
    /**
     * @generated from field: string email = 6;
     */
    email: string;
    /**
     * @generated from field: optional string external_id = 7;
     */
    externalId?: string;
    /**
     * @generated from field: map<string, string> metadata = 8;
     */
    metadata: {
        [key: string]: string;
    };
    constructor(data?: PartialMessage<User>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.User";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): User;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): User;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): User;
    static equals(a: User | PlainMessage<User> | undefined, b: User | PlainMessage<User> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.CreateUserRequest
 */
export declare class CreateUserRequest extends Message<CreateUserRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: scalekit.v1.users.User user = 2;
     */
    user?: User;
    constructor(data?: PartialMessage<CreateUserRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.CreateUserRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateUserRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateUserRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateUserRequest;
    static equals(a: CreateUserRequest | PlainMessage<CreateUserRequest> | undefined, b: CreateUserRequest | PlainMessage<CreateUserRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.CreateUserResponse
 */
export declare class CreateUserResponse extends Message<CreateUserResponse> {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
    constructor(data?: PartialMessage<CreateUserResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.CreateUserResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateUserResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateUserResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateUserResponse;
    static equals(a: CreateUserResponse | PlainMessage<CreateUserResponse> | undefined, b: CreateUserResponse | PlainMessage<CreateUserResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateUser
 */
export declare class UpdateUser extends Message<UpdateUser> {
    /**
     * @generated from field: string first_name = 4;
     */
    firstName: string;
    /**
     * @generated from field: string last_name = 5;
     */
    lastName: string;
    /**
     * @generated from field: optional string external_id = 7;
     */
    externalId?: string;
    /**
     * @generated from field: map<string, string> metadata = 8;
     */
    metadata: {
        [key: string]: string;
    };
    constructor(data?: PartialMessage<UpdateUser>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateUser";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateUser;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateUser;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateUser;
    static equals(a: UpdateUser | PlainMessage<UpdateUser> | undefined, b: UpdateUser | PlainMessage<UpdateUser> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateUserRequest
 */
export declare class UpdateUserRequest extends Message<UpdateUserRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from oneof scalekit.v1.users.UpdateUserRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 2;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 3;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: scalekit.v1.users.UpdateUser user = 4;
     */
    user?: UpdateUser;
    constructor(data?: PartialMessage<UpdateUserRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateUserRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateUserRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateUserRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateUserRequest;
    static equals(a: UpdateUserRequest | PlainMessage<UpdateUserRequest> | undefined, b: UpdateUserRequest | PlainMessage<UpdateUserRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.UpdateUserResponse
 */
export declare class UpdateUserResponse extends Message<UpdateUserResponse> {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
    constructor(data?: PartialMessage<UpdateUserResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.UpdateUserResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateUserResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateUserResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateUserResponse;
    static equals(a: UpdateUserResponse | PlainMessage<UpdateUserResponse> | undefined, b: UpdateUserResponse | PlainMessage<UpdateUserResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.GetUserRequest
 */
export declare class GetUserRequest extends Message<GetUserRequest> {
    /**
     * validate the presence
     *
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from oneof scalekit.v1.users.GetUserRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 2;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 3;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    constructor(data?: PartialMessage<GetUserRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.GetUserRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetUserRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetUserRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetUserRequest;
    static equals(a: GetUserRequest | PlainMessage<GetUserRequest> | undefined, b: GetUserRequest | PlainMessage<GetUserRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.GetUserResponse
 */
export declare class GetUserResponse extends Message<GetUserResponse> {
    /**
     * @generated from field: scalekit.v1.users.User user = 1;
     */
    user?: User;
    constructor(data?: PartialMessage<GetUserResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.GetUserResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetUserResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetUserResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetUserResponse;
    static equals(a: GetUserResponse | PlainMessage<GetUserResponse> | undefined, b: GetUserResponse | PlainMessage<GetUserResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListUserRequest
 */
export declare class ListUserRequest extends Message<ListUserRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: uint32 page_size = 2;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 3;
     */
    pageToken: string;
    constructor(data?: PartialMessage<ListUserRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListUserRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListUserRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListUserRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListUserRequest;
    static equals(a: ListUserRequest | PlainMessage<ListUserRequest> | undefined, b: ListUserRequest | PlainMessage<ListUserRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.ListUserResponse
 */
export declare class ListUserResponse extends Message<ListUserResponse> {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.users.User user = 3;
     */
    user: User[];
    constructor(data?: PartialMessage<ListUserResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.ListUserResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListUserResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListUserResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListUserResponse;
    static equals(a: ListUserResponse | PlainMessage<ListUserResponse> | undefined, b: ListUserResponse | PlainMessage<ListUserResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.users.DeleteUserRequest
 */
export declare class DeleteUserRequest extends Message<DeleteUserRequest> {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from oneof scalekit.v1.users.DeleteUserRequest.identities
     */
    identities: {
        /**
         * @generated from field: string id = 2;
         */
        value: string;
        case: "id";
    } | {
        /**
         * @generated from field: string external_id = 3;
         */
        value: string;
        case: "externalId";
    } | {
        case: undefined;
        value?: undefined;
    };
    constructor(data?: PartialMessage<DeleteUserRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.users.DeleteUserRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteUserRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteUserRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteUserRequest;
    static equals(a: DeleteUserRequest | PlainMessage<DeleteUserRequest> | undefined, b: DeleteUserRequest | PlainMessage<DeleteUserRequest> | undefined): boolean;
}
