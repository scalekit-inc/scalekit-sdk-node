import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeAll } from '@jest/globals';

describe('User Roles and Permissions', () => {
  let client: ScalekitClient;
  let organizationId: string;
  let userId: string;

  beforeAll(() => {
    const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
    const clientId = process.env.SCALEKIT_CLIENT_ID;
    const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;
    const testOrgId = process.env.TEST_ORGANIZATION_ID;
    const testUserId = process.env.TEST_USER_ID;

    if (!envUrl || !clientId || !clientSecret) {
      throw new Error(
        'SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET are required'
      );
    }
    if (!testOrgId) {
      throw new Error('TEST_ORGANIZATION_ID is required');
    }
    if (!testUserId) {
      throw new Error('TEST_USER_ID is required');
    }

    client = global.client;
    organizationId = testOrgId;
    userId = testUserId;
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
      await expect(
        client.user.listUserPermissions('', userId)
      ).rejects.toThrow('organizationId is required');
    });

    it('should throw when userId is empty', async () => {
      await expect(
        client.user.listUserPermissions(organizationId, '')
      ).rejects.toThrow('userId is required');
    });
  });
});
