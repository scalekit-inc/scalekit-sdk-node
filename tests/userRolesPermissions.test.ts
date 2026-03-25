import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import {
  TestOrganizationManager,
  TestUserManager,
} from './utils/test-data';

describe('User Roles and Permissions', () => {
  let client: ScalekitClient;
  let organizationId: string;
  let userId: string;

  beforeAll(async () => {
    if (!global.client) throw new Error('global.client is not configured');
    client = global.client;
    organizationId = await TestOrganizationManager.createTestOrganization(client);
    const testUser = await TestUserManager.createTestUser(client, organizationId, {
      sendInvitationEmail: false,
    });
    userId = testUser.userId;
  });

  afterAll(async () => {
    await TestUserManager.cleanupTestUser(client, organizationId, userId);
    await TestOrganizationManager.cleanupTestOrganization(client, organizationId);
  });

  describe('listUserRoles', () => {
    it('should return roles for a user in an organization', async () => {
      const response = await client.user.listUserRoles(organizationId, userId);

      expect(response).toBeDefined();
      expect(Array.isArray(response.roles)).toBe(true);
    });

    it('should throw when organizationId is empty', async () => {
      await expect(client.user.listUserRoles('', userId)).rejects.toThrow(
        'organizationId is required'
      );
    });

    it('should throw when userId is empty', async () => {
      await expect(
        client.user.listUserRoles(organizationId, '')
      ).rejects.toThrow('userId is required');
    });
  });

  describe('listUserPermissions', () => {
    it('should return permissions for a user in an organization', async () => {
      const response = await client.user.listUserPermissions(
        organizationId,
        userId
      );

      expect(response).toBeDefined();
      expect(Array.isArray(response.permissions)).toBe(true);
    });

    it('should throw when organizationId is empty', async () => {
      await expect(client.user.listUserPermissions('', userId)).rejects.toThrow(
        'organizationId is required'
      );
    });

    it('should throw when userId is empty', async () => {
      await expect(
        client.user.listUserPermissions(organizationId, '')
      ).rejects.toThrow('userId is required');
    });
  });
});
