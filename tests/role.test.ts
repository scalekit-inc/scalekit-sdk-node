import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Roles', () => {
  let client: ScalekitClient;

  beforeEach(async () => {
    // Use global client
    client = global.client;
  });

  describe('RoleClient', () => {
    it('should have role client available', () => {
      expect(client.role).toBeDefined();
      expect(typeof client.role.createRole).toBe('function');
      expect(typeof client.role.getRole).toBe('function');
      expect(typeof client.role.listRoles).toBe('function');
      expect(typeof client.role.updateRole).toBe('function');
      expect(typeof client.role.deleteRole).toBe('function');
      expect(typeof client.role.getRoleUsersCount).toBe('function');
    });

    it('should have organization role methods available', () => {
      expect(typeof client.role.createOrganizationRole).toBe('function');
      expect(typeof client.role.getOrganizationRole).toBe('function');
      expect(typeof client.role.listOrganizationRoles).toBe('function');
      expect(typeof client.role.updateOrganizationRole).toBe('function');
      expect(typeof client.role.deleteOrganizationRole).toBe('function');
      expect(typeof client.role.getOrganizationRoleUsersCount).toBe('function');
      expect(typeof client.role.updateDefaultOrganizationRoles).toBe('function');
      expect(typeof client.role.deleteOrganizationRoleBase).toBe('function');
    });
  });
});
