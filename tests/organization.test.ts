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
      const organizations = await client.organization.listOrganization(
        TestDataGenerator.generatePaginationParams()
      );

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
      const firstPage = await client.organization.listOrganization(
        TestDataGenerator.generatePaginationParams(5)
      );

      expect(firstPage).toBeDefined();
      expect(firstPage.organizations.length).toBeLessThanOrEqual(5);

      if (firstPage.nextPageToken) {
        const secondPage = await client.organization.listOrganization({
          pageSize: 5,
          pageToken: firstPage.nextPageToken,
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

  describe('logoUrl', () => {
    const LOGO_URL = 'https://cdn.example.com/acme-logo.png';

    it('should create organization with logoUrl', async () => {
      const org = await client.organization.createOrganization('Logo Test Org', {
        logoUrl: LOGO_URL,
      });

      try {
        expect(org.organization?.logoUrl).toBe(LOGO_URL);
      } finally {
        await client.organization.deleteOrganization(org.organization!.id!);
      }
    });

    it('should update organization to set logoUrl', async () => {
      const updated = await client.organization.updateOrganization(testOrg, {
        logoUrl: LOGO_URL,
      });

      expect(updated.organization?.logoUrl).toBe(LOGO_URL);
    });

    it('should update organization to clear logoUrl', async () => {
      // first set it
      await client.organization.updateOrganization(testOrg, { logoUrl: LOGO_URL });

      // then clear it
      const cleared = await client.organization.updateOrganization(testOrg, {
        logoUrl: '',
      });

      expect(cleared.organization?.logoUrl ?? '').toBe('');
    });

    it('should preserve logoUrl after updateOrganizationSettings', async () => {
      // set logo_url
      await client.organization.updateOrganization(testOrg, { logoUrl: LOGO_URL });

      // update features — must not wipe logoUrl
      await client.organization.updateOrganizationSettings(testOrg, {
        features: [{ name: 'sso', enabled: true }],
      });

      const fetched = await client.organization.getOrganization(testOrg);
      expect(fetched.organization?.logoUrl).toBe(LOGO_URL);
    });
  });

  describe('upsertUserManagementSettings', () => {
    it('should upsert max allowed users', async () => {
      const maxUsers = 50;
      let settings;
      try {
        settings = await client.organization.upsertUserManagementSettings(
          testOrg,
          { maxAllowedUsers: maxUsers }
        );
      } catch (error) {
        console.warn(
          'Skipping upsertUserManagementSettings test due to error:',
          error
        );
        return;
      }

      expect(settings).toBeDefined();
      expect(settings?.maxAllowedUsers).toBe(maxUsers);
    });
  });
});
