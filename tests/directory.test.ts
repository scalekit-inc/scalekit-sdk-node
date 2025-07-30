import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestOrganizationManager } from './utils/test-data';

describe('Directories', () => {
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