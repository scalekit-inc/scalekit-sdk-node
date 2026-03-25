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
    if (!global.client) {
      throw new Error('global.client is not initialized');
    }

    client = global.client;
  });

  describe('updateDefaultRoles', () => {
    let creatorRoleName: string;
    let memberRoleName: string;

    beforeAll(async () => {
      // The server always requires defaultCreatorRole — discover current
      // defaults via listRoles so tests can round-trip without mutating state.
      const rolesResponse = await client.role.listRoles();
      const creatorRole = rolesResponse.roles?.find((r) => r.defaultCreator);
      const memberRole = rolesResponse.roles?.find((r) => r.defaultMember);
      if (!creatorRole?.name) {
        throw new Error('No default creator role found in environment');
      }
      creatorRoleName = creatorRole.name;
      memberRoleName = memberRole?.name ?? creatorRole.name;
    });

    it('should accept defaultCreatorRole param and return a response', async () => {
      const response = await client.role.updateDefaultRoles({
        defaultCreatorRole: creatorRoleName,
        defaultMemberRole: memberRoleName,
      });

      expect(response).toBeDefined();
      expect(response.defaultCreator?.name).toBe(creatorRoleName);
    });

    it('should accept defaultMemberRole param', async () => {
      const response = await client.role.updateDefaultRoles({
        defaultCreatorRole: creatorRoleName,
        defaultMemberRole: memberRoleName,
      });

      expect(response).toBeDefined();
      expect(response.defaultMember?.name).toBe(memberRoleName);
    });

    it('should throw when role names are invalid', async () => {
      await expect(
        client.role.updateDefaultRoles({
          defaultCreatorRole: '__invalid_role_name__',
          defaultMemberRole: '__invalid_role_name__',
        })
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
