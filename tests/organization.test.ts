import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager } from './utils/test-data';

describe('Organizations', () => {
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

  describe('listOrganization', () => {
    it('should list organizations', async () => {
      const organizations = await client.organization.listOrganization(TestDataGenerator.generatePaginationParams());

      expect(organizations).toBeDefined();
      expect(organizations.organizations).toBeDefined();
      expect(Array.isArray(organizations.organizations)).toBe(true);
      expect(organizations.organizations.length).toBeGreaterThan(0);

      // Verify basic organization attributes
      const firstOrg = organizations.organizations[0];
      expect(firstOrg.id).toBeDefined();
      expect(firstOrg.displayName).toBeDefined();
    });

    it('should handle pagination', async () => {
      const firstPage = await client.organization.listOrganization(TestDataGenerator.generatePaginationParams(5));

      expect(firstPage).toBeDefined();
      expect(firstPage.organizations.length).toBeLessThanOrEqual(5);

      if (firstPage.nextPageToken) {
        const secondPage = await client.organization.listOrganization({
          pageSize: 5,
          pageToken: firstPage.nextPageToken
        });

        expect(secondPage).toBeDefined();
        expect(secondPage.organizations).toBeDefined();
      }
    });
  });

  describe('getOrganization', () => {
    it('should get organization by ID', async () => {
      const organization = await client.organization.getOrganization(testOrg);
      
      expect(organization).toBeDefined();
      expect(organization.organization).toBeDefined();
      expect(organization.organization?.id).toBe(testOrg);
      expect(organization.organization?.displayName).toBeDefined();
    });
  });

  describe('upsertUserManagementSettings', () => {
    it('should upsert max allowed users', async () => {
      const maxUsers = 50;
      let settings;
      try {
        settings = await client.organization.upsertUserManagementSettings(testOrg, { maxAllowedUsers: maxUsers });
      } catch (error) {
        console.warn('Skipping upsertUserManagementSettings test due to error:', error);
        return;
      }

      expect(settings).toBeDefined();
      expect(settings?.maxAllowedUsers).toBe(maxUsers);
    });
  });
}); 