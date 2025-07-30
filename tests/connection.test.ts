import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestOrganizationManager } from './utils/test-data';

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
      const connections = await client.connection.listConnectionsByDomain(domain);

      expect(connections).toBeDefined();
      expect(connections.connections).toBeDefined();
      expect(Array.isArray(connections.connections)).toBe(true);
    });
  });
}); 