import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager } from './utils/test-data';
import { SessionPolicyType } from '../src/pkg/grpc/scalekit/v1/organizations/organizations_pb';

describe('Organization Session Policy', () => {
  let client: ScalekitClient;
  let testOrg: string;

  beforeEach(async () => {
    client = global.client;
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterEach(async () => {
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  describe('getOrganizationSessionPolicy', () => {
    it('should return APPLICATION policy for a new organization', async () => {
      const policy =
        await client.organization.getOrganizationSessionPolicy(testOrg);

      expect(policy).toBeDefined();
      expect(policy.policySource).toBe(SessionPolicyType.APPLICATION);
    });
  });

  describe('updateOrganizationSessionPolicy', () => {
    it('should set a custom session policy with absolute timeout', async () => {
      const policy = await client.organization.updateOrganizationSessionPolicy(
        testOrg,
        {
          policySource: 'CUSTOM',
          absoluteSessionTimeout: 360,
          absoluteSessionTimeoutUnit: 'MINUTES',
        }
      );

      expect(policy).toBeDefined();
      expect(policy.policySource).toBe(SessionPolicyType.CUSTOM);

      const fetched =
        await client.organization.getOrganizationSessionPolicy(testOrg);
      expect(fetched.policySource).toBe(SessionPolicyType.CUSTOM);
      expect(fetched.absoluteSessionTimeout).toBe(360);
    });

    it('should set custom policy with idle timeout enabled', async () => {
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

      const fetched =
        await client.organization.getOrganizationSessionPolicy(testOrg);
      expect(fetched.idleSessionTimeoutEnabled).toBe(true);
      expect(fetched.idleSessionTimeout).toBe(60);
    });

    it('should set custom policy with idle timeout disabled', async () => {
      const policy = await client.organization.updateOrganizationSessionPolicy(
        testOrg,
        {
          policySource: 'CUSTOM',
          absoluteSessionTimeout: 480,
          absoluteSessionTimeoutUnit: 'MINUTES',
          idleSessionTimeoutEnabled: false,
        }
      );

      expect(policy).toBeDefined();
      expect(policy.policySource).toBe(SessionPolicyType.CUSTOM);

      const fetched =
        await client.organization.getOrganizationSessionPolicy(testOrg);
      expect(fetched.idleSessionTimeoutEnabled).toBe(false);
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
  });
});
