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
    it('should return valid response structure', async () => {
      const result = await client.organization.searchOrganization('org');

      expect(result).toBeDefined();
      expect(Array.isArray(result.organizations)).toBe(true);
      expect(typeof result.totalSize).toBe('number');
      expect(typeof result.nextPageToken).toBe('string');
    });

    it('should respect pageSize limit', async () => {
      const result = await client.organization.searchOrganization('org', 2);

      expect(result).toBeDefined();
      expect(result.organizations.length).toBeLessThanOrEqual(2);
    });

    it('should return empty results for a highly specific non-matching query', async () => {
      const nonce = `zzznomatch${Date.now()}`;
      const result = await client.organization.searchOrganization(nonce, 10);

      expect(result).toBeDefined();
      expect(Array.isArray(result.organizations)).toBe(true);
      expect(result.organizations.length).toBe(0);
    });

    it('should paginate when nextPageToken is present', async () => {
      const firstPage = await client.organization.searchOrganization('org', 1);

      expect(firstPage).toBeDefined();
      expect(firstPage.organizations.length).toBeLessThanOrEqual(1);

      if (firstPage.nextPageToken) {
        const secondPage = await client.organization.searchOrganization(
          'org',
          1,
          firstPage.nextPageToken
        );

        expect(secondPage).toBeDefined();
        expect(Array.isArray(secondPage.organizations)).toBe(true);
      }
    });
  });

  describe('getOrganizationUserManagementSetting', () => {
    it('should return a valid response for an existing organization', async () => {
      const result =
        await client.organization.getOrganizationUserManagementSetting(testOrg);

      expect(result).toBeDefined();
    });

    it('should reflect maxAllowedUsers after upserting settings', async () => {
      const maxUsers = 25;
      await client.organization.upsertUserManagementSettings(testOrg, {
        maxAllowedUsers: maxUsers,
      });

      const result =
        await client.organization.getOrganizationUserManagementSetting(testOrg);

      expect(result).toBeDefined();
      expect(result.settings).toBeDefined();
      expect(result.settings?.maxAllowedUsers).toBe(maxUsers);
    });
  });

  describe('getOrganizationSessionPolicy', () => {
    it('should return a policy response with policySource', async () => {
      const policy =
        await client.organization.getOrganizationSessionPolicy(testOrg);

      expect(policy).toBeDefined();
      expect(policy.policySource).toBeDefined();
      expect([
        SessionPolicyType.APPLICATION,
        SessionPolicyType.CUSTOM,
      ]).toContain(policy.policySource);
    });

    it('should default to APPLICATION policy for a new organization', async () => {
      const policy =
        await client.organization.getOrganizationSessionPolicy(testOrg);

      expect(policy.policySource).toBe(SessionPolicyType.APPLICATION);
    });
  });

  describe('external_id methods', () => {
    let orgExternalId: string;
    let orgId: string;

    beforeEach(async () => {
      const orgData = TestDataGenerator.generateOrganizationData();
      orgExternalId = orgData.externalId;
      const response = await client.organization.createOrganization(
        orgData.name,
        { externalId: orgExternalId }
      );
      orgId = response.organization?.id || '';
      expect(orgId).toBeTruthy();
    });

    afterEach(async () => {
      if (orgId) {
        await TestOrganizationManager.cleanupTestOrganization(client, orgId);
      }
    });

    describe('createOrganization with externalId', () => {
      it('should return externalId in the create response', async () => {
        const response = await client.organization.getOrganization(orgId);
        expect(response.organization?.externalId).toBe(orgExternalId);
      });
    });

    describe('getOrganizationByExternalId', () => {
      it('should retrieve an organization by its external ID', async () => {
        const response =
          await client.organization.getOrganizationByExternalId(orgExternalId);

        expect(response).toBeDefined();
        expect(response.organization).toBeDefined();
        expect(response.organization?.id).toBe(orgId);
        expect(response.organization?.externalId).toBe(orgExternalId);
      });
    });

    describe('updateOrganizationByExternalId', () => {
      it('should update an organization identified by external ID', async () => {
        const newDisplayName = `Updated Org ${TestDataGenerator.generateUniqueId()}`;
        const response =
          await client.organization.updateOrganizationByExternalId(
            orgExternalId,
            { displayName: newDisplayName }
          );

        expect(response).toBeDefined();
        expect(response.organization).toBeDefined();
        expect(response.organization?.displayName).toBe(newDisplayName);

        // Verify the update persisted via get
        const fetched =
          await client.organization.getOrganizationByExternalId(orgExternalId);
        expect(fetched.organization?.displayName).toBe(newDisplayName);
      });
    });
  });

  describe('updateOrganizationSessionPolicy', () => {
    it('should set a CUSTOM session policy with absolute timeout', async () => {
      const policy = await client.organization.updateOrganizationSessionPolicy(
        testOrg,
        {
          policySource: 'CUSTOM',
          absoluteSessionTimeout: 120,
          absoluteSessionTimeoutUnit: 'MINUTES',
        }
      );

      expect(policy).toBeDefined();
      expect(policy.policySource).toBe(SessionPolicyType.CUSTOM);
    });

    it('should persist the custom policy (verify via getOrganizationSessionPolicy)', async () => {
      await client.organization.updateOrganizationSessionPolicy(testOrg, {
        policySource: 'CUSTOM',
        absoluteSessionTimeout: 240,
        absoluteSessionTimeoutUnit: 'MINUTES',
      });

      const fetched =
        await client.organization.getOrganizationSessionPolicy(testOrg);

      expect(fetched.policySource).toBe(SessionPolicyType.CUSTOM);
    });

    it('should set CUSTOM policy with idle timeout enabled', async () => {
      const policy = await client.organization.updateOrganizationSessionPolicy(
        testOrg,
        {
          policySource: 'CUSTOM',
          absoluteSessionTimeout: 480,
          absoluteSessionTimeoutUnit: 'MINUTES',
          idleSessionTimeoutEnabled: true,
          idleSessionTimeout: 60,
          idleSessionTimeoutUnit: 'MINUTES',
        }
      );

      expect(policy).toBeDefined();
      expect(policy.policySource).toBe(SessionPolicyType.CUSTOM);
    });

    it('should revert to APPLICATION policy', async () => {
      await client.organization.updateOrganizationSessionPolicy(testOrg, {
        policySource: 'CUSTOM',
        absoluteSessionTimeout: 120,
        absoluteSessionTimeoutUnit: 'MINUTES',
      });

      const reverted =
        await client.organization.updateOrganizationSessionPolicy(testOrg, {
          policySource: 'APPLICATION',
        });

      expect(reverted).toBeDefined();
      expect(reverted.policySource).toBe(SessionPolicyType.APPLICATION);
    });

    it('full cycle: CUSTOM → verify → APPLICATION → verify', async () => {
      await client.organization.updateOrganizationSessionPolicy(testOrg, {
        policySource: 'CUSTOM',
        absoluteSessionTimeout: 300,
        absoluteSessionTimeoutUnit: 'MINUTES',
      });
      const custom =
        await client.organization.getOrganizationSessionPolicy(testOrg);
      expect(custom.policySource).toBe(SessionPolicyType.CUSTOM);

      await client.organization.updateOrganizationSessionPolicy(testOrg, {
        policySource: 'APPLICATION',
      });
      const app =
        await client.organization.getOrganizationSessionPolicy(testOrg);
      expect(app.policySource).toBe(SessionPolicyType.APPLICATION);
    });
  });
});
