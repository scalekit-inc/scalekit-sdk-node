import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";
import { RegionCode } from "./commons_pb.js";
/**
 * @generated from enum scalekit.v1.workspaces.YesNo
 */
export declare enum YesNo {
    /**
     * @generated from enum value: YES = 0;
     */
    YES = 0,
    /**
     * @generated from enum value: NO = 1;
     */
    NO = 1
}
/**
 * @generated from message scalekit.v1.workspaces.Workspace
 */
export declare class Workspace extends Message<Workspace> {
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
     * @generated from field: string display_name = 4;
     */
    displayName: string;
    /**
     * @generated from field: scalekit.v1.commons.RegionCode region_code = 6;
     */
    regionCode: RegionCode;
    constructor(data?: PartialMessage<Workspace>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.Workspace";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Workspace;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Workspace;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Workspace;
    static equals(a: Workspace | PlainMessage<Workspace> | undefined, b: Workspace | PlainMessage<Workspace> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.CreateWorkspace
 */
export declare class CreateWorkspace extends Message<CreateWorkspace> {
    /**
     * @generated from field: string email = 1;
     */
    email: string;
    /**
     * @generated from field: optional string company = 2;
     */
    company?: string;
    /**
     * @generated from field: optional scalekit.v1.workspaces.YesNo send_welcome_email = 3;
     */
    sendWelcomeEmail?: YesNo;
    constructor(data?: PartialMessage<CreateWorkspace>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.CreateWorkspace";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateWorkspace;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateWorkspace;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateWorkspace;
    static equals(a: CreateWorkspace | PlainMessage<CreateWorkspace> | undefined, b: CreateWorkspace | PlainMessage<CreateWorkspace> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.UpdateWorkspace
 */
export declare class UpdateWorkspace extends Message<UpdateWorkspace> {
    /**
     * @generated from field: string display_name = 1;
     */
    displayName: string;
    constructor(data?: PartialMessage<UpdateWorkspace>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.UpdateWorkspace";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateWorkspace;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateWorkspace;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateWorkspace;
    static equals(a: UpdateWorkspace | PlainMessage<UpdateWorkspace> | undefined, b: UpdateWorkspace | PlainMessage<UpdateWorkspace> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.CreateWorkspaceRequest
 */
export declare class CreateWorkspaceRequest extends Message<CreateWorkspaceRequest> {
    /**
     * @generated from field: scalekit.v1.workspaces.CreateWorkspace workspace = 1;
     */
    workspace?: CreateWorkspace;
    constructor(data?: PartialMessage<CreateWorkspaceRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.CreateWorkspaceRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateWorkspaceRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateWorkspaceRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateWorkspaceRequest;
    static equals(a: CreateWorkspaceRequest | PlainMessage<CreateWorkspaceRequest> | undefined, b: CreateWorkspaceRequest | PlainMessage<CreateWorkspaceRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.CreateWorkspaceResponse
 */
export declare class CreateWorkspaceResponse extends Message<CreateWorkspaceResponse> {
    /**
     * @generated from field: scalekit.v1.workspaces.Workspace workspace = 1;
     */
    workspace?: Workspace;
    /**
     * @generated from field: string link = 2;
     */
    link: string;
    constructor(data?: PartialMessage<CreateWorkspaceResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.CreateWorkspaceResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateWorkspaceResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateWorkspaceResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateWorkspaceResponse;
    static equals(a: CreateWorkspaceResponse | PlainMessage<CreateWorkspaceResponse> | undefined, b: CreateWorkspaceResponse | PlainMessage<CreateWorkspaceResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.UpdateWorkspaceRequest
 */
export declare class UpdateWorkspaceRequest extends Message<UpdateWorkspaceRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: scalekit.v1.workspaces.UpdateWorkspace workspace = 2;
     */
    workspace?: UpdateWorkspace;
    constructor(data?: PartialMessage<UpdateWorkspaceRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.UpdateWorkspaceRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateWorkspaceRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateWorkspaceRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateWorkspaceRequest;
    static equals(a: UpdateWorkspaceRequest | PlainMessage<UpdateWorkspaceRequest> | undefined, b: UpdateWorkspaceRequest | PlainMessage<UpdateWorkspaceRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.UpdateCurrentWorkspaceRequest
 */
export declare class UpdateCurrentWorkspaceRequest extends Message<UpdateCurrentWorkspaceRequest> {
    /**
     * @generated from field: scalekit.v1.workspaces.UpdateWorkspace workspace = 1;
     */
    workspace?: UpdateWorkspace;
    constructor(data?: PartialMessage<UpdateCurrentWorkspaceRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.UpdateCurrentWorkspaceRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateCurrentWorkspaceRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateCurrentWorkspaceRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateCurrentWorkspaceRequest;
    static equals(a: UpdateCurrentWorkspaceRequest | PlainMessage<UpdateCurrentWorkspaceRequest> | undefined, b: UpdateCurrentWorkspaceRequest | PlainMessage<UpdateCurrentWorkspaceRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.UpdateWorkspaceResponse
 */
export declare class UpdateWorkspaceResponse extends Message<UpdateWorkspaceResponse> {
    /**
     * @generated from field: scalekit.v1.workspaces.Workspace workspace = 1;
     */
    workspace?: Workspace;
    constructor(data?: PartialMessage<UpdateWorkspaceResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.UpdateWorkspaceResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateWorkspaceResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateWorkspaceResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateWorkspaceResponse;
    static equals(a: UpdateWorkspaceResponse | PlainMessage<UpdateWorkspaceResponse> | undefined, b: UpdateWorkspaceResponse | PlainMessage<UpdateWorkspaceResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.GetWorkspaceRequest
 */
export declare class GetWorkspaceRequest extends Message<GetWorkspaceRequest> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    constructor(data?: PartialMessage<GetWorkspaceRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.GetWorkspaceRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetWorkspaceRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetWorkspaceRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetWorkspaceRequest;
    static equals(a: GetWorkspaceRequest | PlainMessage<GetWorkspaceRequest> | undefined, b: GetWorkspaceRequest | PlainMessage<GetWorkspaceRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.GetCurrentWorkspaceRequest
 */
export declare class GetCurrentWorkspaceRequest extends Message<GetCurrentWorkspaceRequest> {
    constructor(data?: PartialMessage<GetCurrentWorkspaceRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.GetCurrentWorkspaceRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetCurrentWorkspaceRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetCurrentWorkspaceRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetCurrentWorkspaceRequest;
    static equals(a: GetCurrentWorkspaceRequest | PlainMessage<GetCurrentWorkspaceRequest> | undefined, b: GetCurrentWorkspaceRequest | PlainMessage<GetCurrentWorkspaceRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.workspaces.GetWorkspaceResponse
 */
export declare class GetWorkspaceResponse extends Message<GetWorkspaceResponse> {
    /**
     * @generated from field: scalekit.v1.workspaces.Workspace workspace = 1;
     */
    workspace?: Workspace;
    constructor(data?: PartialMessage<GetWorkspaceResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.workspaces.GetWorkspaceResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetWorkspaceResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetWorkspaceResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetWorkspaceResponse;
    static equals(a: GetWorkspaceResponse | PlainMessage<GetWorkspaceResponse> | undefined, b: GetWorkspaceResponse | PlainMessage<GetWorkspaceResponse> | undefined): boolean;
}
