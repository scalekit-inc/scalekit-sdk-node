import type { MessageShape } from "@bufbuild/protobuf";
import { EmptySchema } from "@bufbuild/protobuf/wkt";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import GrpcConnect from "./connect";
import CoreClient from "./core";
import { CreateTokenResponse, ValidateTokenResponse, ListTokensResponse, Token } from "./pkg/grpc/scalekit/v1/tokens/tokens_pb";
/**
 * Options for creating an API token.
 */
export interface CreateTokenOptions {
    /** Optional User ID to scope token to a specific user */
    userId?: string;
    /** Optional custom claims key-value pairs (max 20 entries) */
    customClaims?: {
        [key: string]: string;
    };
    /** Optional expiry timestamp */
    expiry?: Timestamp;
    /** Optional human-readable label (max 255 chars) */
    description?: string;
}
/**
 * Options for listing API tokens.
 */
export interface ListTokensOptions {
    /** Optional User ID to filter tokens */
    userId?: string;
    /** Page size (default 10, max 30) */
    pageSize?: number;
    /** Pagination cursor for next page */
    pageToken?: string;
}
/**
 * Client for managing API tokens in your Scalekit application.
 *
 * API tokens provide programmatic access credentials for automated clients
 * and external systems. Each token is scoped to an organization and optionally
 * to a specific user.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const tokenClient = scalekitClient.token;
 *
 * @see {@link https://docs.scalekit.com/apis/#tag/tokens | Token API Documentation}
 */
export default class TokenClient {
    private readonly grpcConnect;
    private readonly coreClient;
    private client;
    constructor(grpcConnect: GrpcConnect, coreClient: CoreClient);
    /**
     * Creates a new API token for an organization.
     *
     * Generates an opaque token string that can be used for programmatic access.
     * The plain-text token value is returned only at creation time.
     *
     * @param {string} organizationId - The organization ID to scope the token to
     * @param {CreateTokenOptions} [options] - Optional configuration
     * @param {string} [options.userId] - Optional user ID to scope the token to
     * @param {object} [options.customClaims] - Optional custom claims key-value pairs
     * @param {Timestamp} [options.expiry] - Optional expiry timestamp
     * @param {string} [options.description] - Optional human-readable label
     *
     * @returns {Promise<CreateTokenResponse>} Response containing:
     *   - token: The opaque token string (only returned at creation)
     *   - tokenId: Internal token identifier (format: apit_xxxxx)
     *   - tokenInfo: Token metadata
     *
     * @example
     * // Create a basic organization token
     * const response = await scalekitClient.token.createToken('org_12345');
     * console.log('Token:', response.token);
     * console.log('Token ID:', response.tokenId);
     *
     * @example
     * // Create a user-scoped token with custom claims
     * const response = await scalekitClient.token.createToken('org_12345', {
     *   userId: 'usr_67890',
     *   customClaims: { env: 'production', scope: 'read' },
     *   description: 'CI/CD pipeline token'
     * });
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/tokens | Create Token API}
     */
    createToken(organizationId: string, options?: CreateTokenOptions): Promise<CreateTokenResponse>;
    /**
     * Validates an API token and returns associated context.
     *
     * Verifies the token is valid and returns the organization/user context
     * along with any custom claims.
     *
     * @param {string} token - The opaque token string or token_id (apit_xxxxx)
     *
     * @returns {Promise<ValidateTokenResponse>} Response containing:
     *   - tokenInfo: Token metadata including organization, user, and custom claims
     *
     * @throws {Error} If the token is invalid, expired, or not found
     *
     * @example
     * // Validate a token
     * try {
     *   const response = await scalekitClient.token.validateToken('opaque_token_string');
     *   console.log('Organization:', response.tokenInfo?.organizationId);
     *   console.log('Custom Claims:', response.tokenInfo?.customClaims);
     * } catch (error) {
     *   console.error('Invalid token:', error);
     * }
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/tokens | Validate Token API}
     */
    validateToken(token: string): Promise<ValidateTokenResponse>;
    /**
     * Invalidates (soft deletes) an API token.
     *
     * Marks the token as invalid. This operation is idempotent - it succeeds
     * even if the token was already invalidated.
     *
     * @param {string} token - The opaque token string or token_id (apit_xxxxx)
     *
     * @returns {Promise<MessageShape<typeof EmptySchema>>} Empty response on success
     *
     * @example
     * // Revoke a token
     * await scalekitClient.token.invalidateToken('apit_123456789');
     * console.log('Token invalidated');
     *
     * @example
     * // Revoke using opaque token string
     * await scalekitClient.token.invalidateToken(opaqueTokenString);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/tokens | Invalidate Token API}
     */
    invalidateToken(token: string): Promise<MessageShape<typeof EmptySchema>>;
    /**
     * Lists API tokens for an organization with pagination.
     *
     * Retrieves all active tokens for an organization, with optional
     * filtering by user and support for pagination.
     *
     * @param {string} organizationId - The organization ID to list tokens for
     * @param {ListTokensOptions} [options] - Optional configuration
     * @param {string} [options.userId] - Optional user ID to filter tokens
     * @param {number} [options.pageSize] - Page size (default 10, max 30)
     * @param {string} [options.pageToken] - Pagination cursor for next page
     *
     * @returns {Promise<ListTokensResponse>} Response containing:
     *   - tokens: Array of token metadata objects
     *   - totalCount: Total number of matching tokens
     *   - nextPageToken: Cursor for next page (empty if no more pages)
     *   - prevPageToken: Cursor for previous page
     *
     * @example
     * // List tokens for an organization
     * const response = await scalekitClient.token.listTokens('org_12345', {
     *   pageSize: 20
     * });
     *
     * console.log('Tokens:', response.tokens);
     * console.log('Total:', response.totalCount);
     *
     * @example
     * // List tokens for a specific user
     * const response = await scalekitClient.token.listTokens('org_12345', {
     *   userId: 'usr_67890'
     * });
     *
     * @example
     * // Paginate through all tokens
     * let pageToken: string | undefined;
     * let allTokens: Token[] = [];
     *
     * do {
     *   const response = await scalekitClient.token.listTokens('org_12345', {
     *     pageSize: 30,
     *     pageToken
     *   });
     *
     *   allTokens.push(...response.tokens);
     *   pageToken = response.nextPageToken || undefined;
     * } while (pageToken);
     *
     * @see {@link https://docs.scalekit.com/apis/#tag/tokens | List Tokens API}
     */
    listTokens(organizationId: string, options?: ListTokensOptions): Promise<ListTokensResponse>;
}
export { Token, CreateTokenResponse, ValidateTokenResponse, ListTokensResponse };
