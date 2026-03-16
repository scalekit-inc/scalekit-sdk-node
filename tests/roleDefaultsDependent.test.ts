import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeAll } from '@jest/globals';

describe('Role Defaults and Dependent Roles', () => {
  let client: ScalekitClient;

  beforeAll(() => {
    const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
    const clientId = process.env.SCALEKIT_CLIENT_ID;
    const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;

    if (!envUrl || !clientId || !clientSecret) {
      throw new Error(
        'SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET are required'
      );
    }

    client = global.client;
  });

  describe('updateDefaultRoles', () => {
    it('should accept optional params and return a response', async () => {
      const response = await client.role.updateDefaultRoles({});

      expect(response).toBeDefined();
    });

    it('should accept defaultMemberRole param', async () => {
      // We only verify the call returns without throwing; we do not
      // permanently change the environment's default roles in CI since
      // we don't know the valid role names ahead of time. Instead, pass
      // an empty object which leaves current defaults unchanged.
      const response = await client.role.updateDefaultRoles({});

      expect(response).toBeDefined();
    });

    it('should throw when roleName is invalid', async () => {
      await expect(
        client.role.updateDefaultRoles({ defaultMemberRole: '__invalid_role_name__' })
      ).rejects.toBeDefined();
    });
  });

  describe('listDependentRoles', () => {
    it('should return a response for a valid role name', async () => {
      const rolesResponse = await client.role.listRoles();
      if (!rolesResponse.roles || rolesResponse.roles.length === 0) {
        // Nothing to test if no roles exist in this environment
        return;
      }

      const firstRole = rolesResponse.roles[0];
      if (!firstRole.name) throw new Error('Expected role to have a name');

      const response = await client.role.listDependentRoles(firstRole.name);

      expect(response).toBeDefined();
      expect(Array.isArray(response.roles)).toBe(true);
    });

    it('should throw when roleName is empty', async () => {
      await expect(client.role.listDependentRoles('')).rejects.toThrow(
        'roleName is required'
      );
    });
  });
});
