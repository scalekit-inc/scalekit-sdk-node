import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from enum scalekit.v1.members.MemberRole
 */
export declare enum MemberRole {
    /**
     * @generated from enum value: MEMBER_ROLE_UNSPECIFIED = 0;
     */
    MEMBER_ROLE_UNSPECIFIED = 0,
    /**
     * @generated from enum value: ADMIN = 1;
     */
    ADMIN = 1,
    /**
     * @generated from enum value: USER = 2;
     */
    USER = 2
}
/**
 * @generated from message scalekit.v1.members.Member
 */
export declare class Member extends Message<Member> {
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
     * @generated from field: string workspace_id = 4;
     */
    workspaceId: string;
    /**
     * @generated from field: scalekit.v1.members.MemberRole role = 5;
     */
    role: MemberRole;
    /**
     * @generated from field: optional string first_name = 6;
     */
    firstName?: string;
    /**
     * @generated from field: optional string last_name = 7;
     */
    lastName?: string;
    /**
     * @generated from field: string email = 8;
     */
    email: string;
    /**
     * @generated from field: map<string, string> metadata = 9;
     */
    metadata: {
        [key: string]: string;
    };
    constructor(data?: PartialMessage<Member>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.Member";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Member;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Member;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Member;
    static equals(a: Member | PlainMessage<Member> | undefined, b: Member | PlainMessage<Member> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.CreateMemberRequest
 */
export declare class CreateMemberRequest extends Message<CreateMemberRequest> {
    /**
     * @generated from field: scalekit.v1.members.Member member = 1;
     */
    member?: Member;
    constructor(data?: PartialMessage<CreateMemberRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.CreateMemberRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateMemberRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateMemberRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateMemberRequest;
    static equals(a: CreateMemberRequest | PlainMessage<CreateMemberRequest> | undefined, b: CreateMemberRequest | PlainMessage<CreateMemberRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.CreateMemberResponse
 */
export declare class CreateMemberResponse extends Message<CreateMemberResponse> {
    /**
     * @generated from field: scalekit.v1.members.Member member = 1;
     */
    member?: Member;
    constructor(data?: PartialMessage<CreateMemberResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.CreateMemberResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateMemberResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateMemberResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateMemberResponse;
    static equals(a: CreateMemberResponse | PlainMessage<CreateMemberResponse> | undefined, b: CreateMemberResponse | PlainMessage<CreateMemberResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.UpdateMember
 */
export declare class UpdateMember extends Message<UpdateMember> {
    /**
     * @generated from field: optional scalekit.v1.members.MemberRole role = 5;
     */
    role?: MemberRole;
    /**
     * @generated from field: optional string first_name = 6;
     */
    firstName?: string;
    /**
     * @generated from field: optional string last_name = 7;
     */
    lastName?: string;
    /**
     * @generated from field: map<string, string> metadata = 9;
     */
    metadata: {
        [key: string]: string;
    };
    constructor(data?: PartialMessage<UpdateMember>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.UpdateMember";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateMember;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateMember;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateMember;
    static equals(a: UpdateMember | PlainMessage<UpdateMember> | undefined, b: UpdateMember | PlainMessage<UpdateMember> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.UpdateCurrentMemberRequest
 */
export declare class UpdateCurrentMemberRequest extends Message<UpdateCurrentMemberRequest> {
    /**
     * @generated from field: scalekit.v1.members.UpdateMember member = 1;
     */
    member?: UpdateMember;
    constructor(data?: PartialMessage<UpdateCurrentMemberRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.UpdateCurrentMemberRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateCurrentMemberRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateCurrentMemberRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateCurrentMemberRequest;
    static equals(a: UpdateCurrentMemberRequest | PlainMessage<UpdateCurrentMemberRequest> | undefined, b: UpdateCurrentMemberRequest | PlainMessage<UpdateCurrentMemberRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.UpdateMemberRequest
 */
export declare class UpdateMemberRequest extends Message<UpdateMemberRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.members.UpdateMember member = 2;
     */
    member?: UpdateMember;
    constructor(data?: PartialMessage<UpdateMemberRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.UpdateMemberRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateMemberRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateMemberRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateMemberRequest;
    static equals(a: UpdateMemberRequest | PlainMessage<UpdateMemberRequest> | undefined, b: UpdateMemberRequest | PlainMessage<UpdateMemberRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.UpdateMemberResponse
 */
export declare class UpdateMemberResponse extends Message<UpdateMemberResponse> {
    /**
     * @generated from field: scalekit.v1.members.Member member = 1;
     */
    member?: Member;
    constructor(data?: PartialMessage<UpdateMemberResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.UpdateMemberResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateMemberResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateMemberResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateMemberResponse;
    static equals(a: UpdateMemberResponse | PlainMessage<UpdateMemberResponse> | undefined, b: UpdateMemberResponse | PlainMessage<UpdateMemberResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.GetCurrentMemberRequest
 */
export declare class GetCurrentMemberRequest extends Message<GetCurrentMemberRequest> {
    constructor(data?: PartialMessage<GetCurrentMemberRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.GetCurrentMemberRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetCurrentMemberRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetCurrentMemberRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetCurrentMemberRequest;
    static equals(a: GetCurrentMemberRequest | PlainMessage<GetCurrentMemberRequest> | undefined, b: GetCurrentMemberRequest | PlainMessage<GetCurrentMemberRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.GetMemberRequest
 */
export declare class GetMemberRequest extends Message<GetMemberRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    constructor(data?: PartialMessage<GetMemberRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.GetMemberRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetMemberRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetMemberRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetMemberRequest;
    static equals(a: GetMemberRequest | PlainMessage<GetMemberRequest> | undefined, b: GetMemberRequest | PlainMessage<GetMemberRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.GetMemberResponse
 */
export declare class GetMemberResponse extends Message<GetMemberResponse> {
    /**
     * @generated from field: scalekit.v1.members.Member member = 1;
     */
    member?: Member;
    constructor(data?: PartialMessage<GetMemberResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.GetMemberResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetMemberResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetMemberResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetMemberResponse;
    static equals(a: GetMemberResponse | PlainMessage<GetMemberResponse> | undefined, b: GetMemberResponse | PlainMessage<GetMemberResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.ListMemberRequest
 */
export declare class ListMemberRequest extends Message<ListMemberRequest> {
    /**
     * @generated from field: uint32 page_size = 1;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 2;
     */
    pageToken: string;
    constructor(data?: PartialMessage<ListMemberRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.ListMemberRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListMemberRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListMemberRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListMemberRequest;
    static equals(a: ListMemberRequest | PlainMessage<ListMemberRequest> | undefined, b: ListMemberRequest | PlainMessage<ListMemberRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.ListMemberResponse
 */
export declare class ListMemberResponse extends Message<ListMemberResponse> {
    /**
     * @generated from field: string next_page_token = 1;
     */
    nextPageToken: string;
    /**
     * @generated from field: uint32 total_size = 2;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.members.Member members = 3;
     */
    members: Member[];
    constructor(data?: PartialMessage<ListMemberResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.ListMemberResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListMemberResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListMemberResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListMemberResponse;
    static equals(a: ListMemberResponse | PlainMessage<ListMemberResponse> | undefined, b: ListMemberResponse | PlainMessage<ListMemberResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.members.DeleteMemberRequest
 */
export declare class DeleteMemberRequest extends Message<DeleteMemberRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    constructor(data?: PartialMessage<DeleteMemberRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.members.DeleteMemberRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteMemberRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteMemberRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteMemberRequest;
    static equals(a: DeleteMemberRequest | PlainMessage<DeleteMemberRequest> | undefined, b: DeleteMemberRequest | PlainMessage<DeleteMemberRequest> | undefined): boolean;
}
