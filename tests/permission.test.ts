import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager, TestRoleManager, TestPermissionManager } from './utils/test-data';

describe('Permissions', () => {
  let client: ScalekitClient;
  let testOrg: string;
  let testRoleName: string | null = null;
  let testPermissionName: string | null = null;
  let testPermissionName2: string | null = null;

  beforeEach(async () => {
    // Use global client
    client = global.client;
    
    // Create test organization for each test
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterEach(async () => {
    // Clean up test resources
    if (testRoleName) {
      await TestRoleManager.cleanupTestRole(client, testRoleName);
      testRoleName = null;
    }
    
    if (testPermissionName) {
      await TestPermissionManager.cleanupTestPermission(client, testPermissionName);
      testPermissionName = null;
    }
    
    if (testPermissionName2) {
      await TestPermissionManager.cleanupTestPermission(client, testPermissionName2);
      testPermissionName2 = null;
    }
    
    // Clean up test organization
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
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

  describe('Permission API Integration Tests', () => {
    describe('createPermission', () => {
      it('should create a new permission', async () => {
        const permissionData = TestDataGenerator.generatePermissionData();
        
        const response = await client.permission.createPermission(permissionData);
        
        expect(response).toBeDefined();
        expect(response.permission).toBeDefined();
        expect(response.permission?.name).toBe(permissionData.name);
        expect(response.permission?.description).toBe(permissionData.description);
        
        testPermissionName = response.permission?.name || null;
      });

      it('should throw error when permission name is missing', async () => {
        const permissionData = TestDataGenerator.generatePermissionData({ name: '' });
        
        await expect(
          client.permission.createPermission(permissionData)
        ).rejects.toThrow();
      });

      it('should allow empty permission description', async () => {
        const permissionData = TestDataGenerator.generatePermissionData({ description: '' });
        
        const response = await client.permission.createPermission(permissionData);
        
        expect(response).toBeDefined();
        expect(response.permission).toBeDefined();
        expect(response.permission?.name).toBe(permissionData.name);
        expect(response.permission?.description).toBe('');
      });
    });

    describe('getPermission', () => {
      it('should get permission by name', async () => {
        // Create a test permission first
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        testPermissionName = createResponse.permission?.name || null;
        
        const response = await client.permission.getPermission(testPermissionName!);
        
        expect(response).toBeDefined();
        expect(response.permission).toBeDefined();
        expect(response.permission?.name).toBe(testPermissionName);
        expect(response.permission?.description).toBe(permissionData.description);
      });

      it('should throw error when permission does not exist', async () => {
        await expect(
          client.permission.getPermission('non.existent.permission')
        ).rejects.toThrow();
      });
    });

    describe('listPermissions', () => {
      it('should list all permissions', async () => {
        // Create a test permission first
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        testPermissionName = createResponse.permission?.name || null;
        
        const response = await client.permission.listPermissions();
        
        expect(response).toBeDefined();
        expect(response.permissions).toBeDefined();
        expect(Array.isArray(response.permissions)).toBe(true);
        expect(response.permissions.length).toBeGreaterThan(0);
        
        // Verify our test permission is in the list
        const testPermission = response.permissions.find(permission => permission.name === testPermissionName);
        expect(testPermission).toBeDefined();
        expect(testPermission?.description).toBe(permissionData.description);
      });

      it('should handle pagination', async () => {
        // Create multiple test permissions
        const permissionData1 = TestDataGenerator.generatePermissionData();
        const createResponse1 = await client.permission.createPermission(permissionData1);
        testPermissionName = createResponse1.permission?.name || null;
        
        const permissionData2 = TestDataGenerator.generatePermissionData();
        const createResponse2 = await client.permission.createPermission(permissionData2);
        testPermissionName2 = createResponse2.permission?.name || null;
        
        // List permissions with pagination
        const firstPage = await client.permission.listPermissions(undefined, 1);
        
        expect(firstPage).toBeDefined();
        expect(firstPage.permissions.length).toBeLessThanOrEqual(1);
        
        if (firstPage.nextPageToken) {
          const secondPage = await client.permission.listPermissions(firstPage.nextPageToken, 1);
          
          expect(secondPage).toBeDefined();
          expect(secondPage.permissions).toBeDefined();
        }
      });
    });

    describe('updatePermission', () => {
      it('should update an existing permission', async () => {
        // Create a test permission first
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        testPermissionName = createResponse.permission?.name || null;
        
        const updateData = TestDataGenerator.generatePermissionData({
          name: testPermissionName!,
          description: 'Updated permission description'
        });
        const response = await client.permission.updatePermission(testPermissionName!, updateData);
        
        expect(response).toBeDefined();
        expect(response.permission).toBeDefined();
        expect(response.permission?.name).toBe(testPermissionName);
        expect(response.permission?.description).toBe(updateData.description);
      });

      it('should throw error when updating non-existent permission', async () => {
        const updateData = TestDataGenerator.generatePermissionData();
        
        await expect(
          client.permission.updatePermission('non.existent.permission', updateData)
        ).rejects.toThrow();
      });
    });

    describe('deletePermission', () => {
      it('should delete an existing permission', async () => {
        // Create a test permission first
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        const permissionName = createResponse.permission?.name || null;
        
        const response = await client.permission.deletePermission(permissionName!);
        
        expect(response).toBeDefined();
        
        // Verify permission is deleted
        await expect(
          client.permission.getPermission(permissionName!)
        ).rejects.toThrow();
      });
    });
  });

  describe('Role-Permission Management API Integration Tests', () => {
    beforeEach(async () => {
      // Create a test role for role-permission tests
      const roleData = TestDataGenerator.generateRoleData();
      const createResponse = await client.role.createRole(roleData);
      testRoleName = createResponse.role?.name || null;
    });

    describe('listRolePermissions', () => {
      it('should list permissions for a role', async () => {
        const response = await client.permission.listRolePermissions(testRoleName!);
        
        expect(response).toBeDefined();
        expect(response.permissions).toBeDefined();
        expect(Array.isArray(response.permissions)).toBe(true);
      });

      it('should throw error when role does not exist', async () => {
        await expect(
          client.permission.listRolePermissions('non-existent-role')
        ).rejects.toThrow();
      });
    });

    describe('addPermissionsToRole', () => {
      it('should add permissions to a role', async () => {
        // Create test permissions
        const permissionData1 = TestDataGenerator.generatePermissionData();
        const createResponse1 = await client.permission.createPermission(permissionData1);
        testPermissionName = createResponse1.permission?.name || null;
        
        const permissionData2 = TestDataGenerator.generatePermissionData();
        const createResponse2 = await client.permission.createPermission(permissionData2);
        testPermissionName2 = createResponse2.permission?.name || null;
        
        // Add permissions to role
        const response = await client.permission.addPermissionsToRole(testRoleName!, [
          testPermissionName!,
          testPermissionName2!
        ]);
        
        expect(response).toBeDefined();
        expect(response.permissions).toBeDefined();
        expect(Array.isArray(response.permissions)).toBe(true);
        expect(response.permissions.length).toBe(2);
        
        // Verify permissions were added
        const rolePermissions = await client.permission.listRolePermissions(testRoleName!);
        const addedPermissions = rolePermissions.permissions.filter(p => 
          p.name === testPermissionName || p.name === testPermissionName2
        );
        expect(addedPermissions.length).toBe(2);
      });

      it('should add single permission to a role', async () => {
        // Create test permission
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        testPermissionName = createResponse.permission?.name || null;
        
        // Add permission to role
        const response = await client.permission.addPermissionsToRole(testRoleName!, [testPermissionName!]);
        
        expect(response).toBeDefined();
        expect(response.permissions).toBeDefined();
        expect(Array.isArray(response.permissions)).toBe(true);
        expect(response.permissions.length).toBe(1);
      });

      it('should throw error when role does not exist', async () => {
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        testPermissionName = createResponse.permission?.name || null;
        
        await expect(
          client.permission.addPermissionsToRole('non-existent-role', [testPermissionName!])
        ).rejects.toThrow();
      });

      it('should throw error when permission does not exist', async () => {
        await expect(
          client.permission.addPermissionsToRole(testRoleName!, ['non.existent.permission'])
        ).rejects.toThrow();
      });
    });

    describe('removePermissionFromRole', () => {
      it('should remove permission from a role', async () => {
        // Create test permission
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        testPermissionName = createResponse.permission?.name || null;
        
        // Add permission to role first
        await client.permission.addPermissionsToRole(testRoleName!, [testPermissionName!]);
        
        // Remove permission from role
        const response = await client.permission.removePermissionFromRole(testRoleName!, testPermissionName!);
        
        expect(response).toBeDefined();
        
        // Verify permission was removed
        const rolePermissions = await client.permission.listRolePermissions(testRoleName!);
        const removedPermission = rolePermissions.permissions.find(p => p.name === testPermissionName);
        expect(removedPermission).toBeUndefined();
      });

      it('should throw error when role does not exist', async () => {
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        testPermissionName = createResponse.permission?.name || null;
        
        await expect(
          client.permission.removePermissionFromRole('non-existent-role', testPermissionName!)
        ).rejects.toThrow();
      });

      it('should throw error when permission does not exist', async () => {
        await expect(
          client.permission.removePermissionFromRole(testRoleName!, 'non.existent.permission')
        ).rejects.toThrow();
      });
    });

    describe('listEffectiveRolePermissions', () => {
      it('should list effective permissions for a role', async () => {
        // Create test permission
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        testPermissionName = createResponse.permission?.name || null;
        
        // Add permission to role
        await client.permission.addPermissionsToRole(testRoleName!, [testPermissionName!]);
        
        // Get effective permissions
        const response = await client.permission.listEffectiveRolePermissions(testRoleName!);
        
        expect(response).toBeDefined();
        expect(response.permissions).toBeDefined();
        expect(Array.isArray(response.permissions)).toBe(true);
        
        // Verify our permission is in the effective permissions
        const effectivePermission = response.permissions.find(p => p.name === testPermissionName);
        expect(effectivePermission).toBeDefined();
      });

      it('should list effective permissions for role with inheritance', async () => {
        // Create base role with permission
        const baseRoleData = TestDataGenerator.generateRoleData();
        const baseResponse = await client.role.createRole(baseRoleData);
        const baseRoleName = baseResponse.role?.name;
        
        const permissionData = TestDataGenerator.generatePermissionData();
        const createResponse = await client.permission.createPermission(permissionData);
        testPermissionName = createResponse.permission?.name || null;
        
        // Add permission to base role
        await client.permission.addPermissionsToRole(baseRoleName!, [testPermissionName!]);
        
        // Create extended role
        const extendedRoleData = TestDataGenerator.generateRoleData({
          extends: baseRoleName
        });
        const extendedResponse = await client.role.createRole(extendedRoleData);
        const extendedRoleName = extendedResponse.role?.name;
        
        // Get effective permissions for extended role (should include inherited permissions)
        const response = await client.permission.listEffectiveRolePermissions(extendedRoleName!);
        
        expect(response).toBeDefined();
        expect(response.permissions).toBeDefined();
        expect(Array.isArray(response.permissions)).toBe(true);
        
        // Clean up base role
        if (baseRoleName) {
          await TestRoleManager.cleanupTestRole(client, baseRoleName);
        }
        
        // Clean up extended role
        if (extendedRoleName) {
          await TestRoleManager.cleanupTestRole(client, extendedRoleName);
        }
      });

      it('should throw error when role does not exist', async () => {
        await expect(
          client.permission.listEffectiveRolePermissions('non-existent-role')
        ).rejects.toThrow();
      });
    });
  });
});