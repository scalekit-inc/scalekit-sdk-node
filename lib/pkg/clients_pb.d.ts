import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { FieldMask, Message, proto3, Timestamp } from "@bufbuild/protobuf";
/**
 * @generated from enum scalekit.v1.clients.ClientSecretStatus
 */
export declare enum ClientSecretStatus {
    /**
     * @generated from enum value: ACTIVE = 0;
     */
    ACTIVE = 0,
    /**
     * @generated from enum value: INACTIVE = 1;
     */
    INACTIVE = 1
}
/**
 * @generated from message scalekit.v1.clients.GetClientRequest
 */
export declare class GetClientRequest extends Message<GetClientRequest> {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    constructor(data?: PartialMessage<GetClientRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.GetClientRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetClientRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetClientRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetClientRequest;
    static equals(a: GetClientRequest | PlainMessage<GetClientRequest> | undefined, b: GetClientRequest | PlainMessage<GetClientRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.GetClientResponse
 */
export declare class GetClientResponse extends Message<GetClientResponse> {
    /**
     * @generated from field: scalekit.v1.clients.Client client = 1;
     */
    client?: Client;
    constructor(data?: PartialMessage<GetClientResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.GetClientResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetClientResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetClientResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetClientResponse;
    static equals(a: GetClientResponse | PlainMessage<GetClientResponse> | undefined, b: GetClientResponse | PlainMessage<GetClientResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.ListClientsRequest
 */
export declare class ListClientsRequest extends Message<ListClientsRequest> {
    constructor(data?: PartialMessage<ListClientsRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.ListClientsRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListClientsRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListClientsRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListClientsRequest;
    static equals(a: ListClientsRequest | PlainMessage<ListClientsRequest> | undefined, b: ListClientsRequest | PlainMessage<ListClientsRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.ListClientsResponse
 */
export declare class ListClientsResponse extends Message<ListClientsResponse> {
    /**
     * @generated from field: uint32 total_size = 1;
     */
    totalSize: number;
    /**
     * @generated from field: repeated scalekit.v1.clients.Client clients = 2;
     */
    clients: Client[];
    constructor(data?: PartialMessage<ListClientsResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.ListClientsResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListClientsResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListClientsResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListClientsResponse;
    static equals(a: ListClientsResponse | PlainMessage<ListClientsResponse> | undefined, b: ListClientsResponse | PlainMessage<ListClientsResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.UpdateClientRequest
 */
export declare class UpdateClientRequest extends Message<UpdateClientRequest> {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * @generated from field: scalekit.v1.clients.UpdateClient client = 2;
     */
    client?: UpdateClient;
    /**
     * @generated from field: google.protobuf.FieldMask mask = 3;
     */
    mask?: FieldMask;
    constructor(data?: PartialMessage<UpdateClientRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.UpdateClientRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateClientRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateClientRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateClientRequest;
    static equals(a: UpdateClientRequest | PlainMessage<UpdateClientRequest> | undefined, b: UpdateClientRequest | PlainMessage<UpdateClientRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.UpdateClient
 */
export declare class UpdateClient extends Message<UpdateClient> {
    /**
     * @generated from field: repeated string redirect_uris = 2;
     */
    redirectUris: string[];
    /**
     * @generated from field: optional string default_redirect_uri = 3;
     */
    defaultRedirectUri?: string;
    constructor(data?: PartialMessage<UpdateClient>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.UpdateClient";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateClient;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateClient;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateClient;
    static equals(a: UpdateClient | PlainMessage<UpdateClient> | undefined, b: UpdateClient | PlainMessage<UpdateClient> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.UpdateClientResponse
 */
export declare class UpdateClientResponse extends Message<UpdateClientResponse> {
    /**
     * @generated from field: scalekit.v1.clients.Client client = 1;
     */
    client?: Client;
    constructor(data?: PartialMessage<UpdateClientResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.UpdateClientResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateClientResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateClientResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateClientResponse;
    static equals(a: UpdateClientResponse | PlainMessage<UpdateClientResponse> | undefined, b: UpdateClientResponse | PlainMessage<UpdateClientResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.CreateClientSecretRequest
 */
export declare class CreateClientSecretRequest extends Message<CreateClientSecretRequest> {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    constructor(data?: PartialMessage<CreateClientSecretRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.CreateClientSecretRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateClientSecretRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateClientSecretRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateClientSecretRequest;
    static equals(a: CreateClientSecretRequest | PlainMessage<CreateClientSecretRequest> | undefined, b: CreateClientSecretRequest | PlainMessage<CreateClientSecretRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.CreateClientSecretResponse
 */
export declare class CreateClientSecretResponse extends Message<CreateClientSecretResponse> {
    /**
     * @generated from field: string plain_secret = 1;
     */
    plainSecret: string;
    /**
     * @generated from field: scalekit.v1.clients.ClientSecret secret = 2;
     */
    secret?: ClientSecret;
    constructor(data?: PartialMessage<CreateClientSecretResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.CreateClientSecretResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateClientSecretResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateClientSecretResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateClientSecretResponse;
    static equals(a: CreateClientSecretResponse | PlainMessage<CreateClientSecretResponse> | undefined, b: CreateClientSecretResponse | PlainMessage<CreateClientSecretResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.UpdateClientSecretRequest
 */
export declare class UpdateClientSecretRequest extends Message<UpdateClientSecretRequest> {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * @generated from field: string secret_id = 2;
     */
    secretId: string;
    /**
     * @generated from field: scalekit.v1.clients.UpdateClientSecret secret = 3;
     */
    secret?: UpdateClientSecret;
    /**
     * @generated from field: google.protobuf.FieldMask mask = 4;
     */
    mask?: FieldMask;
    constructor(data?: PartialMessage<UpdateClientSecretRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.UpdateClientSecretRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateClientSecretRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateClientSecretRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateClientSecretRequest;
    static equals(a: UpdateClientSecretRequest | PlainMessage<UpdateClientSecretRequest> | undefined, b: UpdateClientSecretRequest | PlainMessage<UpdateClientSecretRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.UpdateClientSecret
 */
export declare class UpdateClientSecret extends Message<UpdateClientSecret> {
    /**
     * @generated from field: scalekit.v1.clients.ClientSecretStatus status = 1;
     */
    status: ClientSecretStatus;
    constructor(data?: PartialMessage<UpdateClientSecret>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.UpdateClientSecret";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateClientSecret;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateClientSecret;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateClientSecret;
    static equals(a: UpdateClientSecret | PlainMessage<UpdateClientSecret> | undefined, b: UpdateClientSecret | PlainMessage<UpdateClientSecret> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.UpdateClientSecretResponse
 */
export declare class UpdateClientSecretResponse extends Message<UpdateClientSecretResponse> {
    /**
     * @generated from field: scalekit.v1.clients.ClientSecret secret = 1;
     */
    secret?: ClientSecret;
    constructor(data?: PartialMessage<UpdateClientSecretResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.UpdateClientSecretResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpdateClientSecretResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpdateClientSecretResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpdateClientSecretResponse;
    static equals(a: UpdateClientSecretResponse | PlainMessage<UpdateClientSecretResponse> | undefined, b: UpdateClientSecretResponse | PlainMessage<UpdateClientSecretResponse> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.DeleteClientSecretRequest
 */
export declare class DeleteClientSecretRequest extends Message<DeleteClientSecretRequest> {
    /**
     * @generated from field: string client_id = 1;
     */
    clientId: string;
    /**
     * @generated from field: string secret_id = 2;
     */
    secretId: string;
    constructor(data?: PartialMessage<DeleteClientSecretRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.DeleteClientSecretRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteClientSecretRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteClientSecretRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteClientSecretRequest;
    static equals(a: DeleteClientSecretRequest | PlainMessage<DeleteClientSecretRequest> | undefined, b: DeleteClientSecretRequest | PlainMessage<DeleteClientSecretRequest> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.Client
 */
export declare class Client extends Message<Client> {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string keyId = 2;
     */
    keyId: string;
    /**
     * @generated from field: google.protobuf.Timestamp create_time = 3;
     */
    createTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp update_time = 4;
     */
    updateTime?: Timestamp;
    /**
     * @generated from field: repeated string redirect_uris = 5;
     */
    redirectUris: string[];
    /**
     * @generated from field: string default_redirect_uri = 6;
     */
    defaultRedirectUri: string;
    /**
     * @generated from field: repeated scalekit.v1.clients.ClientSecret secrets = 7;
     */
    secrets: ClientSecret[];
    constructor(data?: PartialMessage<Client>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.Client";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Client;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Client;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Client;
    static equals(a: Client | PlainMessage<Client> | undefined, b: Client | PlainMessage<Client> | undefined): boolean;
}
/**
 * @generated from message scalekit.v1.clients.ClientSecret
 */
export declare class ClientSecret extends Message<ClientSecret> {
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
     * @generated from field: string secret_suffix = 4;
     */
    secretSuffix: string;
    /**
     * @generated from field: optional string created_by = 5;
     */
    createdBy?: string;
    /**
     * @generated from field: scalekit.v1.clients.ClientSecretStatus status = 6;
     */
    status: ClientSecretStatus;
    /**
     * @generated from field: google.protobuf.Timestamp expire_time = 7;
     */
    expireTime?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_used_time = 8;
     */
    lastUsedTime?: Timestamp;
    constructor(data?: PartialMessage<ClientSecret>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "scalekit.v1.clients.ClientSecret";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ClientSecret;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ClientSecret;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ClientSecret;
    static equals(a: ClientSecret | PlainMessage<ClientSecret> | undefined, b: ClientSecret | PlainMessage<ClientSecret> | undefined): boolean;
}
