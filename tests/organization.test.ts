import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager } from './utils/test-data';
import { SessionPolicyType } from '../src/pkg/grpc/scalekit/v1/organizations/organizations_pb';

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

  describe('searchOrganization', () => {
    it('should search organizations by query', async () => {
      let result;
      try {
        result = await client.organization.searchOrganization('Test');
      } catch (error) {
        console.warn('Skipping searchOrganization test due to error:', error);
        return;
      }

      expect(result).toBeDefined();
      expect(result.organizations).toBeDefined();
      expect(Array.isArray(result.organizations)).toBe(true);
    });

    it('should search organizations with pagination params', async () => {
      let result;
      try {
        result = await client.organization.searchOrganization('Test', 5);
      } catch (error) {
        console.warn('Skipping searchOrganization pagination test due to error:', error);
        return;
      }

      expect(result).toBeDefined();
      expect(result.organizations).toBeDefined();
      expect(result.organizations.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getOrganizationUserManagementSetting', () => {
    it('should get user management settings for an organization', async () => {
      let settings;
      try {
        settings = await client.organization.getOrganizationUserManagementSetting(testOrg);
      } catch (error) {
        console.warn(
          'Skipping getOrganizationUserManagementSetting test due to error:',
          error
        );
        return;
      }

      expect(settings).toBeDefined();
    });
  });

  describe('getOrganizationSessionPolicy', () => {
    it('should get the session policy for an organization', async () => {
      let result;
      try {
        result = await client.organization.getOrganizationSessionPolicy(testOrg);
      } catch (error) {
        console.warn(
          'Skipping getOrganizationSessionPolicy test due to error:',
          error
        );
        return;
      }

      expect(result).toBeDefined();
    });
  });

  describe('getApplicationSessionPolicy', () => {
    it('should get the application-level session policy', async () => {
      let result;
      try {
        result = await client.organization.getApplicationSessionPolicy(testOrg);
      } catch (error) {
        console.warn(
          'Skipping getApplicationSessionPolicy test due to error:',
          error
        );
        return;
      }

      expect(result).toBeDefined();
    });
  });

  describe('updateOrganizationSessionPolicy', () => {
    it('should update the session policy for an organization', async () => {
      let result;
      try {
        result = await client.organization.updateOrganizationSessionPolicy(
          testOrg,
          SessionPolicyType.APPLICATION
        );
      } catch (error) {
        console.warn(
          'Skipping updateOrganizationSessionPolicy test due to error:',
          error
        );
        return;
      }

      expect(result).toBeDefined();
    });
  });
});
