import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Organizations', () => {
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

  describe('listOrganization', () => {
    it('should list organizations', async () => {
      const organizations = await client.organization.listOrganization({
        pageSize: 10,
        pageToken: ''
      });

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
      const firstPage = await client.organization.listOrganization({
        pageSize: 5,
        pageToken: ''
      });

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
}); 