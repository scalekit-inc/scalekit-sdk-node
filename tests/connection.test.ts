import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Connections', () => {
  let client: ScalekitClient;
  let testOrg: string;

  beforeEach(async () => {
    // Use global client
    client = global.client;
    
    // Create test organization for each test
    const orgName = `Test Org ${Date.now()}`;
    const orgResponse = await client.organization.createOrganization(orgName, {
      externalId: `ext_org_${Date.now()}`
    });
    testOrg = orgResponse.organization?.id || '';
    
    if (!testOrg) {
      throw new Error('Failed to create test organization');
    }
  });

  afterEach(async () => {
    // Clean up test organization
    if (testOrg) {
      try {
        await client.organization.deleteOrganization(testOrg);
      } catch (error) {
        // Organization may already be deleted
      }
    }
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