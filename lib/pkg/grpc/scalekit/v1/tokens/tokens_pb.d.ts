import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { EmptySchema, Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file scalekit/v1/tokens/tokens.proto.
 */
export declare const file_scalekit_v1_tokens_tokens: GenFile;
/**
 * @generated from message scalekit.v1.tokens.CreateTokenRequest
 */
export type CreateTokenRequest = Message<"scalekit.v1.tokens.CreateTokenRequest"> & {
    /**
     * @generated from field: scalekit.v1.tokens.CreateToken token = 1;
     */
    token?: CreateToken;
};
/**
 * Describes the message scalekit.v1.tokens.CreateTokenRequest.
 * Use `create(CreateTokenRequestSchema)` to create a new message.
 */
export declare const CreateTokenRequestSchema: GenMessage<CreateTokenRequest>;
/**
 * @generated from message scalekit.v1.tokens.CreateToken
 */
export type CreateToken = Message<"scalekit.v1.tokens.CreateToken"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: map<string, string> custom_claims = 3;
     */
    customClaims: {
        [key: string]: string;
    };
    /**
     * @generated from field: google.protobuf.Timestamp expiry = 4;
     */
    expiry?: Timestamp;
    /**
     * @generated from field: string description = 5;
     */
    description: string;
};
/**
 * Describes the message scalekit.v1.tokens.CreateToken.
 * Use `create(CreateTokenSchema)` to create a new message.
 */
export declare const CreateTokenSchema: GenMessage<CreateToken>;
/**
 * @generated from message scalekit.v1.tokens.CreateTokenResponse
 */
export type CreateTokenResponse = Message<"scalekit.v1.tokens.CreateTokenResponse"> & {
    /**
     * @generated from field: string token = 1;
     */
    token: string;
    /**
     * @generated from field: string token_id = 2;
     */
    tokenId: string;
    /**
     * @generated from field: scalekit.v1.tokens.Token token_info = 3;
     */
    tokenInfo?: Token;
};
/**
 * Describes the message scalekit.v1.tokens.CreateTokenResponse.
 * Use `create(CreateTokenResponseSchema)` to create a new message.
 */
export declare const CreateTokenResponseSchema: GenMessage<CreateTokenResponse>;
/**
 * @generated from message scalekit.v1.tokens.ValidateTokenRequest
 */
export type ValidateTokenRequest = Message<"scalekit.v1.tokens.ValidateTokenRequest"> & {
    /**
     * @generated from field: string token = 1;
     */
    token: string;
};
/**
 * Describes the message scalekit.v1.tokens.ValidateTokenRequest.
 * Use `create(ValidateTokenRequestSchema)` to create a new message.
 */
export declare const ValidateTokenRequestSchema: GenMessage<ValidateTokenRequest>;
/**
 * @generated from message scalekit.v1.tokens.ValidateTokenResponse
 */
export type ValidateTokenResponse = Message<"scalekit.v1.tokens.ValidateTokenResponse"> & {
    /**
     * @generated from field: scalekit.v1.tokens.Token token_info = 1;
     */
    tokenInfo?: Token;
};
/**
 * Describes the message scalekit.v1.tokens.ValidateTokenResponse.
 * Use `create(ValidateTokenResponseSchema)` to create a new message.
 */
export declare const ValidateTokenResponseSchema: GenMessage<ValidateTokenResponse>;
/**
 * @generated from message scalekit.v1.tokens.InvalidateTokenRequest
 */
export type InvalidateTokenRequest = Message<"scalekit.v1.tokens.InvalidateTokenRequest"> & {
    /**
     * @generated from field: string token = 1;
     */
    token: string;
};
/**
 * Describes the message scalekit.v1.tokens.InvalidateTokenRequest.
 * Use `create(InvalidateTokenRequestSchema)` to create a new message.
 */
export declare const InvalidateTokenRequestSchema: GenMessage<InvalidateTokenRequest>;
/**
 * @generated from message scalekit.v1.tokens.ListTokensRequest
 */
export type ListTokensRequest = Message<"scalekit.v1.tokens.ListTokensRequest"> & {
    /**
     * @generated from field: string organization_id = 1;
     */
    organizationId: string;
    /**
     * @generated from field: optional string user_id = 2;
     */
    userId?: string;
    /**
     * @generated from field: int32 page_size = 3;
     */
    pageSize: number;
    /**
     * @generated from field: string page_token = 4;
     */
    pageToken: string;
};
/**
 * Describes the message scalekit.v1.tokens.ListTokensRequest.
 * Use `create(ListTokensRequestSchema)` to create a new message.
 */
export declare const ListTokensRequestSchema: GenMessage<ListTokensRequest>;
/**
 * @generated from message scalekit.v1.tokens.ListTokensResponse
 */
export type ListTokensResponse = Message<"scalekit.v1.tokens.ListTokensResponse"> & {
    /**
     * @generated from field: repeated scalekit.v1.tokens.Token tokens = 1;
     */
    tokens: Token[];
    /**
     * @generated from field: int32 total_count = 2;
     */
    totalCount: number;
    /**
     * @generated from field: string next_page_token = 3;
     */
    nextPageToken: string;
    /**
     * @generated from field: string prev_page_token = 4;
     */
    prevPageToken: string;
};
/**
 * Describes the message scalekit.v1.tokens.ListTokensResponse.
 * Use `create(ListTokensResponseSchema)` to create a new message.
 */
export declare const ListTokensResponseSchema: GenMessage<ListTokensResponse>;
/**
 * @generated from message scalekit.v1.tokens.UpdateTokenRequest
 */
export type UpdateTokenRequest = Message<"scalekit.v1.tokens.UpdateTokenRequest"> & {
    /**
     * @generated from field: string token = 1;
     */
    token: string;
    /**
     * @generated from field: map<string, string> custom_claims = 3;
     */
    customClaims: {
        [key: string]: string;
    };
    /**
     * @generated from field: optional string description = 2;
     */
    description?: string;
};
/**
 * Describes the message scalekit.v1.tokens.UpdateTokenRequest.
 * Use `create(UpdateTokenRequestSchema)` to create a new message.
 */
export declare const UpdateTokenRequestSchema: GenMessage<UpdateTokenRequest>;
/**
 * @generated from message scalekit.v1.tokens.UpdateTokenResponse
 */
export type UpdateTokenResponse = Message<"scalekit.v1.tokens.UpdateTokenResponse"> & {
    /**
     * @generated from field: scalekit.v1.tokens.Token token_info = 1;
     */
    tokenInfo?: Token;
};
/**
 * Describes the message scalekit.v1.tokens.UpdateTokenResponse.
 * Use `create(UpdateTokenResponseSchema)` to create a new message.
 */
export declare const UpdateTokenResponseSchema: GenMessage<UpdateTokenResponse>;
/**
 * @generated from message scalekit.v1.tokens.Token
 */
export type Token = Message<"scalekit.v1.tokens.Token"> & {
    /**
     * @generated from field: string token_id = 1;
     */
    tokenId: string;
    /**
     * @generated from field: string organization_id = 2;
     */
    organizationId: string;
    /**
     * @generated from field: string organization_external_id = 3;
     */
    organizationExternalId: string;
    /**
     * @generated from field: optional string user_id = 4;
     */
    userId?: string;
    /**
     * @generated from field: optional string user_external_id = 5;
     */
    userExternalId?: string;
    /**
     * @generated from field: map<string, string> custom_claims = 6;
     */
    customClaims: {
        [key: string]: string;
    };
    /**
     * @generated from field: optional google.protobuf.Timestamp expiry = 7;
     */
    expiry?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 8;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: optional string description = 9;
     */
    description?: string;
    /**
     * @generated from field: string token_suffix = 10;
     */
    tokenSuffix: string;
    /**
     * @generated from field: optional string email = 11;
     */
    email?: string;
    /**
     * @generated from field: repeated string roles = 12;
     */
    roles: string[];
};
/**
 * Describes the message scalekit.v1.tokens.Token.
 * Use `create(TokenSchema)` to create a new message.
 */
export declare const TokenSchema: GenMessage<Token>;
/**
 * @generated from message scalekit.v1.tokens.UserProfile
 */
export type UserProfile = Message<"scalekit.v1.tokens.UserProfile"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: string email = 2;
     */
    email: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: map<string, string> attributes = 4;
     */
    attributes: {
        [key: string]: string;
    };
};
/**
 * Describes the message scalekit.v1.tokens.UserProfile.
 * Use `create(UserProfileSchema)` to create a new message.
 */
export declare const UserProfileSchema: GenMessage<UserProfile>;
/**
 * Request message for FetchToken RPC
 *
 * @generated from message scalekit.v1.tokens.FetchTokenRequest
 */
export type FetchTokenRequest = Message<"scalekit.v1.tokens.FetchTokenRequest"> & {
    /**
     * @generated from field: string token_id = 1;
     */
    tokenId: string;
};
/**
 * Describes the message scalekit.v1.tokens.FetchTokenRequest.
 * Use `create(FetchTokenRequestSchema)` to create a new message.
 */
export declare const FetchTokenRequestSchema: GenMessage<FetchTokenRequest>;
/**
 * Response message for FetchToken RPC
 *
 * @generated from message scalekit.v1.tokens.FetchTokenResponse
 */
export type FetchTokenResponse = Message<"scalekit.v1.tokens.FetchTokenResponse"> & {
    /**
     * @generated from field: string token = 1;
     */
    token: string;
    /**
     * @generated from field: google.protobuf.Timestamp retrieved_at = 2;
     */
    retrievedAt?: Timestamp;
    /**
     * @generated from field: scalekit.v1.tokens.Token token_info = 3;
     */
    tokenInfo?: Token;
};
/**
 * Describes the message scalekit.v1.tokens.FetchTokenResponse.
 * Use `create(FetchTokenResponseSchema)` to create a new message.
 */
export declare const FetchTokenResponseSchema: GenMessage<FetchTokenResponse>;
/**
 * ApiTokenService provides API token management operations
 * for secure authentication of external systems and applications.
 *
 * @generated from service scalekit.v1.tokens.ApiTokenService
 */
export declare const ApiTokenService: GenService<{
    /**
     * CreateToken generates a new API token for an organization or user.
     * Returns an opaque token string and token claims.
     *
     * @generated from rpc scalekit.v1.tokens.ApiTokenService.CreateToken
     */
    createToken: {
        methodKind: "unary";
        input: typeof CreateTokenRequestSchema;
        output: typeof CreateTokenResponseSchema;
    };
    /**
     * ValidateToken verifies an API token and returns associated context.
     *
     * @generated from rpc scalekit.v1.tokens.ApiTokenService.ValidateToken
     */
    validateToken: {
        methodKind: "unary";
        input: typeof ValidateTokenRequestSchema;
        output: typeof ValidateTokenResponseSchema;
    };
    /**
     * InvalidateToken marks an API token as deleted (soft delete for audit).
     *
     * @generated from rpc scalekit.v1.tokens.ApiTokenService.InvalidateToken
     */
    invalidateToken: {
        methodKind: "unary";
        input: typeof InvalidateTokenRequestSchema;
        output: typeof EmptySchema;
    };
    /**
     * ListTokens retrieves API tokens for an organization or user with pagination.
     *
     * @generated from rpc scalekit.v1.tokens.ApiTokenService.ListTokens
     */
    listTokens: {
        methodKind: "unary";
        input: typeof ListTokensRequestSchema;
        output: typeof ListTokensResponseSchema;
    };
    /**
     * UpdateToken updates the custom claims and description of an existing token
     *
     * @generated from rpc scalekit.v1.tokens.ApiTokenService.UpdateToken
     */
    updateToken: {
        methodKind: "unary";
        input: typeof UpdateTokenRequestSchema;
        output: typeof UpdateTokenResponseSchema;
    };
    /**
     * We dont wan to expose token fetch . So making the authentication empty. This would block the request.
     *
     * @generated from rpc scalekit.v1.tokens.ApiTokenService.FetchToken
     */
    fetchToken: {
        methodKind: "unary";
        input: typeof FetchTokenRequestSchema;
        output: typeof FetchTokenResponseSchema;
    };
}>;
