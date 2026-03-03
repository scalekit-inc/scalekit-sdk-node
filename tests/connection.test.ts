import { create } from '@bufbuild/protobuf';
import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestOrganizationManager } from './utils/test-data';
import {
  ConnectionProvider,
  ConnectionType,
  CreateConnectionSchema,
} from '../src/pkg/grpc/scalekit/v1/connections/connections_pb';

describe('Connections', () => {
  let client: ScalekitClient;
  let testOrg: string;

  beforeEach(async () => {
    // Use global client
    client = global.client;

    // Create test organization for each test
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterEach(async () => {
    // Clean up test organization
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  describe('listConnections', () => {
    it('should list connections by organization', async () => {
      const connections = await client.connection.listConnections(testOrg);

      expect(connections).toBeDefined();
      expect(connections.connections).toBeDefined();
      expect(Array.isArray(connections.connections)).toBe(true);
    });
  });

  describe('listConnectionsByDomain', () => {
    it('should list connections by domain', async () => {
      const domain = 'example.com';
      const connections =
        await client.connection.listConnectionsByDomain(domain);

      expect(connections).toBeDefined();
      expect(connections.connections).toBeDefined();
      expect(Array.isArray(connections.connections)).toBe(true);
    });
  });

  describe('createConnection', () => {
    it('should create a new SSO connection for an organization', async () => {
      const response = await client.connection.createConnection(
        testOrg,
        create(CreateConnectionSchema, {
          provider: ConnectionProvider.OKTA,
          type: ConnectionType.SAML,
          providerKey: '',
        })
      );

      expect(response).toBeDefined();
      expect(response.connection).toBeDefined();
      expect(response.connection?.organizationId).toBe(testOrg);
      expect(response.connection?.provider).toBe(ConnectionProvider.OKTA);
      expect(response.connection?.type).toBe(ConnectionType.SAML);

      // Clean up the created connection
      if (response.connection?.id) {
        await client.connection.deleteConnection(
          testOrg,
          response.connection.id
        );
      }
    });
  });

  describe('deleteConnection', () => {
    it('should delete an existing SSO connection', async () => {
      // Create a connection first
      const createResponse = await client.connection.createConnection(
        testOrg,
        create(CreateConnectionSchema, {
          provider: ConnectionProvider.OKTA,
          type: ConnectionType.SAML,
          providerKey: '',
        })
      );

      expect(createResponse.connection?.id).toBeDefined();
      const connectionId = createResponse.connection!.id;

      const deleteResponse = await client.connection.deleteConnection(
        testOrg,
        connectionId
      );

      expect(deleteResponse).toBeDefined();

      // Verify the connection is gone
      const remaining = await client.connection.listConnections(testOrg);
      const stillExists = remaining.connections.some(
        (c) => c.id === connectionId
      );
      expect(stillExists).toBe(false);
    });
  });
});
