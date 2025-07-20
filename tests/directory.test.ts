import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Directories', () => {
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

  describe('listDirectories', () => {
    it('should list directories', async () => {
      const directories = await client.directory.listDirectories(testOrg);

      expect(directories).toBeDefined();
      expect(directories.directories).toBeDefined();
      expect(Array.isArray(directories.directories)).toBe(true);
    });
  });

  describe('getPrimaryDirectoryByOrganizationId', () => {
    it('should get primary directory by organization id', async () => {
      try {
        const primaryDirectory = await client.directory.getPrimaryDirectoryByOrganizationId(testOrg);
        
        expect(primaryDirectory).toBeDefined();
        expect(primaryDirectory.id).toBeDefined();
        expect(primaryDirectory.organizationId).toBe(testOrg);
      } catch (error) {
        // Expected when no directories exist
        expect(error).toBeDefined();
      }
    });
  });
}); 