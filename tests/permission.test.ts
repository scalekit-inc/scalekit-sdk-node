import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Permissions', () => {
  let client: ScalekitClient;

  beforeEach(async () => {
    // Use global client
    client = global.client;
  });

  describe('PermissionClient', () => {
    it('should have permission client available', () => {
      expect(client.permission).toBeDefined();
      expect(typeof client.permission.createPermission).toBe('function');
      expect(typeof client.permission.getPermission).toBe('function');
      expect(typeof client.permission.listPermissions).toBe('function');
      expect(typeof client.permission.updatePermission).toBe('function');
      expect(typeof client.permission.deletePermission).toBe('function');
    });

    it('should have role-permission management methods available', () => {
      expect(typeof client.permission.listRolePermissions).toBe('function');
      expect(typeof client.permission.addPermissionsToRole).toBe('function');
      expect(typeof client.permission.removePermissionFromRole).toBe('function');
      expect(typeof client.permission.listEffectiveRolePermissions).toBe('function');
    });
  });
});
