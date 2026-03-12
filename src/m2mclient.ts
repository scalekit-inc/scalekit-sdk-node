import type { MessageShape } from '@bufbuild/protobuf';
import { EmptySchema } from '@bufbuild/protobuf/wkt';
import type { Client } from '@connectrpc/connect';
import GrpcConnect from './connect';
import CoreClient from './core';
import {
  ClientService,
  OrganizationClient,
  CustomClaim,
  CreateOrganizationClientResponse,
  GetOrganizationClientResponse,
  UpdateOrganizationClientResponse,
  CreateOrganizationClientSecretResponse,
  ListOrganizationClientsResponse,
} from './pkg/grpc/scalekit/v1/clients/clients_pb';

function toCustomClaims(claims: { [key: string]: string }): CustomClaim[] {
  return Object.entries(claims).map(
    ([key, value]) => ({ key, value }) as CustomClaim
  );
}

export interface CreateOrganizationClientOptions {
  /** Human-readable name for the client */
  name?: string;
  /** Optional description */
  description?: string;
  /** Custom claims to embed in access tokens (key-value pairs) */
  customClaims?: { [key: string]: string };
  /** Audience values for access tokens */
  audience?: string[];
  /** Scopes to grant */
  scopes?: string[];
}

export interface UpdateOrganizationClientOptions {
  /** Updated name */
  name?: string;
  /** Updated description */
  description?: string;
  /** Custom claims to set (replaces existing) */
  customClaims?: { [key: string]: string };
  /** Updated audience values */
  audience?: string[];
  /** Updated scopes */
  scopes?: string[];
}

export interface ListOrganizationClientsOptions {
  /** Page size (between 10 and 100) */
  pageSize?: number;
  /** Pagination cursor for next page */
  pageToken?: string;
}

/**
 * Client for managing M2M (machine-to-machine) API clients per organization.
 *
 * Each organization client represents an automated system credential scoped
 * to one organization, using the client_credentials OAuth flow.
 *
 * @example
 * const scalekitClient = new ScalekitClient(envUrl, clientId, clientSecret);
 * const m2m = scalekitClient.m2m;
 *
 * @see {@link https://docs.scalekit.com/m2m/overview | M2M Documentation}
 */
export default class M2MClient {
  private client: Client<typeof ClientService>;

  constructor(
    private readonly grpcConnect: GrpcConnect,
    private readonly coreClient: CoreClient
  ) {
    this.client = this.grpcConnect.createClient(ClientService);
  }

  /**
   * Creates a new M2M API client for an organization.
   *
   * Returns a `clientId` and a plain `secret` (only available at creation time).
   *
   * @param organizationId - The organization to create the client for
   * @param options - Optional client properties (name, description, customClaims, audience, scopes)
   * @returns CreateOrganizationClientResponse with clientId, secret, and client metadata
   */
  async createOrganizationClient(
    organizationId: string,
    options?: CreateOrganizationClientOptions
  ): Promise<CreateOrganizationClientResponse> {
    if (!organizationId) throw new Error('organizationId is required');
    return this.coreClient.connectExec(this.client.createOrganizationClient, {
      organizationId,
      client: {
        ...(options?.name && { name: options.name }),
        ...(options?.description && { description: options.description }),
        ...(options?.customClaims && {
          customClaims: toCustomClaims(options.customClaims),
        }),
        ...(options?.audience && { audience: options.audience }),
        ...(options?.scopes && { scopes: options.scopes }),
      },
    });
  }

  /**
   * Retrieves details of a specific M2M client for an organization.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID (format: skc_xxxxx)
   * @returns GetOrganizationClientResponse with client metadata and active secrets (values hidden)
   */
  async getOrganizationClient(
    organizationId: string,
    clientId: string
  ): Promise<GetOrganizationClientResponse> {
    if (!organizationId) throw new Error('organizationId is required');
    if (!clientId) throw new Error('clientId is required');
    return this.coreClient.connectExec(this.client.getOrganizationClient, {
      organizationId,
      clientId,
    });
  }

  /**
   * Updates the configuration of an existing M2M client.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID to update
   * @param options - Fields to update (name, description, customClaims, audience, scopes)
   * @returns UpdateOrganizationClientResponse with updated client metadata
   */
  async updateOrganizationClient(
    organizationId: string,
    clientId: string,
    options?: UpdateOrganizationClientOptions
  ): Promise<UpdateOrganizationClientResponse> {
    if (!organizationId) throw new Error('organizationId is required');
    if (!clientId) throw new Error('clientId is required');
    return this.coreClient.connectExec(this.client.updateOrganizationClient, {
      organizationId,
      clientId,
      client: {
        ...(options?.name && { name: options.name }),
        ...(options?.description && { description: options.description }),
        ...(options?.customClaims && {
          customClaims: toCustomClaims(options.customClaims),
        }),
        ...(options?.audience && { audience: options.audience }),
        ...(options?.scopes && { scopes: options.scopes }),
      },
    });
  }

  /**
   * Permanently deletes an M2M client from an organization.
   *
   * This operation cannot be undone. All associated secrets are invalidated.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID to delete
   * @returns Empty response on success
   */
  async deleteOrganizationClient(
    organizationId: string,
    clientId: string
  ): Promise<MessageShape<typeof EmptySchema>> {
    if (!organizationId) throw new Error('organizationId is required');
    if (!clientId) throw new Error('clientId is required');
    return this.coreClient.connectExec(this.client.deleteOrganizationClient, {
      organizationId,
      clientId,
    });
  }

  /**
   * Creates a new secret for an M2M client.
   *
   * The plain secret value is returned only at creation time and cannot be retrieved again.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID to add a secret to
   * @returns CreateOrganizationClientSecretResponse with secretId and plain secret
   */
  async createOrganizationClientSecret(
    organizationId: string,
    clientId: string
  ): Promise<CreateOrganizationClientSecretResponse> {
    if (!organizationId) throw new Error('organizationId is required');
    if (!clientId) throw new Error('clientId is required');
    return this.coreClient.connectExec(
      this.client.createOrganizationClientSecret,
      { organizationId, clientId }
    );
  }

  /**
   * Permanently deletes a secret from an M2M client.
   *
   * @param organizationId - The organization ID
   * @param clientId - The client ID
   * @param secretId - The secret ID to delete
   * @returns Empty response on success
   */
  async deleteOrganizationClientSecret(
    organizationId: string,
    clientId: string,
    secretId: string
  ): Promise<MessageShape<typeof EmptySchema>> {
    if (!organizationId) throw new Error('organizationId is required');
    if (!clientId) throw new Error('clientId is required');
    if (!secretId) throw new Error('secretId is required');
    return this.coreClient.connectExec(
      this.client.deleteOrganizationClientSecret,
      { organizationId, clientId, secretId }
    );
  }

  /**
   * Lists all M2M clients for an organization with pagination.
   *
   * @param organizationId - The organization ID
   * @param options - Optional pagination options (pageSize 10–100, pageToken)
   * @returns ListOrganizationClientsResponse with clients array and pagination cursors
   */
  async listOrganizationClients(
    organizationId: string,
    options?: ListOrganizationClientsOptions
  ): Promise<ListOrganizationClientsResponse> {
    if (!organizationId) throw new Error('organizationId is required');
    return this.coreClient.connectExec(this.client.listOrganizationClients, {
      organizationId,
      ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
      ...(options?.pageToken && { pageToken: options.pageToken }),
    });
  }
}

export {
  OrganizationClient,
  CreateOrganizationClientResponse,
  GetOrganizationClientResponse,
  UpdateOrganizationClientResponse,
  CreateOrganizationClientSecretResponse,
  ListOrganizationClientsResponse,
};
