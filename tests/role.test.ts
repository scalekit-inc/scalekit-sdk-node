import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager, TestRoleManager } from './utils/test-data';

describe('Roles', () => {
  let client: ScalekitClient;
  let testOrg: string;
  let testRoleName: string | null = null;
  let testOrgRoleName: string | null = null;

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
    
    if (testOrgRoleName) {
      await TestRoleManager.cleanupTestOrganizationRole(client, testOrg, testOrgRoleName);
      testOrgRoleName = null;
    }
    
    // Clean up test organization
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
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

  describe('Role API Integration Tests', () => {
    describe('createRole', () => {
      it('should create a new role', async () => {
        const roleData = TestDataGenerator.generateRoleData();
        
        const response = await client.role.createRole(roleData);
        
        expect(response).toBeDefined();
        expect(response.role).toBeDefined();
        expect(response.role?.name).toBe(roleData.name);
        expect(response.role?.displayName).toBe(roleData.displayName);
        expect(response.role?.description).toBe(roleData.description);
        
        testRoleName = response.role?.name || null;
      });

      it('should throw error when role name is missing', async () => {
        const roleData = TestDataGenerator.generateRoleData({ name: '' });
        
        await expect(
          client.role.createRole(roleData)
        ).rejects.toThrow();
      });
    });

    describe('listRoles', () => {
      it('should list all roles', async () => {
        const response = await client.role.listRoles();
        
        expect(response).toBeDefined();
        expect(response.roles).toBeDefined();
        expect(Array.isArray(response.roles)).toBe(true);
      });
    });

    describe('getRole', () => {
      it('should get role by name', async () => {
        // Create a test role first
        const roleData = TestDataGenerator.generateRoleData();
        const createResponse = await client.role.createRole(roleData);
        testRoleName = createResponse.role?.name || null;
        
        const response = await client.role.getRole(testRoleName!);
        
        expect(response).toBeDefined();
        expect(response.role).toBeDefined();
        expect(response.role?.name).toBe(testRoleName);
        expect(response.role?.displayName).toBe(roleData.displayName);
        expect(response.role?.description).toBe(roleData.description);
      });

      it('should throw error when role does not exist', async () => {
        await expect(
          client.role.getRole('non-existent-role')
        ).rejects.toThrow();
      });
    });

    describe('updateRole', () => {
      it('should update an existing role', async () => {
        // Create a test role first
        const roleData = TestDataGenerator.generateRoleData();
        const createResponse = await client.role.createRole(roleData);
        testRoleName = createResponse.role?.name || null;
        
        const updateData = TestDataGenerator.generateRoleUpdateData();
        const response = await client.role.updateRole(testRoleName!, updateData);
        
        expect(response).toBeDefined();
        expect(response.role).toBeDefined();
        expect(response.role?.name).toBe(testRoleName);
        expect(response.role?.displayName).toBe(updateData.displayName);
        expect(response.role?.description).toBe(updateData.description);
      });

      it('should throw error when updating non-existent role', async () => {
        const updateData = TestDataGenerator.generateRoleUpdateData();
        
        await expect(
          client.role.updateRole('non-existent-role', updateData)
        ).rejects.toThrow();
      });
    });

    describe('deleteRole', () => {
      it('should delete an existing role', async () => {
        // Create a test role first
        const roleData = TestDataGenerator.generateRoleData();
        const createResponse = await client.role.createRole(roleData);
        const roleName = createResponse.role?.name || null;
        
        const response = await client.role.deleteRole(roleName!);
        
        expect(response).toBeDefined();
        
        // Verify role is deleted
        await expect(
          client.role.getRole(roleName!)
        ).rejects.toThrow();
      });
    });

    describe('getRoleUsersCount', () => {
      it('should get user count for a role', async () => {
        // Create a test role first
        const roleData = TestDataGenerator.generateRoleData();
        const createResponse = await client.role.createRole(roleData);
        testRoleName = createResponse.role?.name || null;
        
        const response = await client.role.getRoleUsersCount(testRoleName!);
        
        expect(response).toBeDefined();
        expect(Number(response.count)).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Organization Role API Integration Tests', () => {
    describe('createOrganizationRole', () => {
      it('should create a new organization role', async () => {
        const roleData = TestDataGenerator.generateOrganizationRoleData();
        
        const response = await client.role.createOrganizationRole(testOrg, roleData);
        
        expect(response).toBeDefined();
        expect(response.role).toBeDefined();
        expect(response.role?.name).toBe(roleData.name);
        expect(response.role?.displayName).toBe(roleData.displayName);
        expect(response.role?.description).toBe(roleData.description);
        expect(response.role?.isOrgRole).toBe(true);
        
        testOrgRoleName = response.role?.name || null;
      });

      it('should throw error when organizationId is missing', async () => {
        const roleData = TestDataGenerator.generateOrganizationRoleData();
        
        await expect(
          client.role.createOrganizationRole('', roleData)
        ).rejects.toThrow();
      });
    });

    describe('listOrganizationRoles', () => {
      it('should list all organization roles', async () => {
        // Create a test organization role first
        const roleData = TestDataGenerator.generateOrganizationRoleData();
        const createResponse = await client.role.createOrganizationRole(testOrg, roleData);
        testOrgRoleName = createResponse.role?.name || null;
        
        const response = await client.role.listOrganizationRoles(testOrg);
        
        expect(response).toBeDefined();
        expect(response.roles).toBeDefined();
        expect(Array.isArray(response.roles)).toBe(true);
        expect(response.roles.length).toBeGreaterThan(0);
        
        // Verify our test role is in the list
        const testRole = response.roles.find(role => role.name === testOrgRoleName);
        expect(testRole).toBeDefined();
        expect(testRole?.isOrgRole).toBe(true);
      });
    });

    describe('getOrganizationRole', () => {
      it('should get organization role by name', async () => {
        // Create a test organization role first
        const roleData = TestDataGenerator.generateOrganizationRoleData();
        const createResponse = await client.role.createOrganizationRole(testOrg, roleData);
        testOrgRoleName = createResponse.role?.name || null;
        
        const response = await client.role.getOrganizationRole(testOrg, testOrgRoleName!);
        
        expect(response).toBeDefined();
        expect(response.role).toBeDefined();
        expect(response.role?.name).toBe(testOrgRoleName);
        expect(response.role?.displayName).toBe(roleData.displayName);
        expect(response.role?.isOrgRole).toBe(true);
      });
    });

    describe('updateOrganizationRole', () => {
      it('should update an existing organization role', async () => {
        // Create a test organization role first
        const roleData = TestDataGenerator.generateOrganizationRoleData();
        const createResponse = await client.role.createOrganizationRole(testOrg, roleData);
        testOrgRoleName = createResponse.role?.name || null;
        
        const updateData = TestDataGenerator.generateRoleUpdateData();
        const response = await client.role.updateOrganizationRole(testOrg, testOrgRoleName!, updateData);
        
        expect(response).toBeDefined();
        expect(response.role).toBeDefined();
        expect(response.role?.name).toBe(testOrgRoleName);
        expect(response.role?.displayName).toBe(updateData.displayName);
        expect(response.role?.description).toBe(updateData.description);
        expect(response.role?.isOrgRole).toBe(true);
      });
    });

    describe('deleteOrganizationRole', () => {
      it('should delete an existing organization role', async () => {
        // Create a test organization role first
        const roleData = TestDataGenerator.generateOrganizationRoleData();
        const createResponse = await client.role.createOrganizationRole(testOrg, roleData);
        const roleName = createResponse.role?.name || null;
        
        const response = await client.role.deleteOrganizationRole(testOrg, roleName!);
        
        expect(response).toBeDefined();
        
        // Verify role is deleted
        await expect(
          client.role.getOrganizationRole(testOrg, roleName!)
        ).rejects.toThrow();
      });
    });

    describe('getOrganizationRoleUsersCount', () => {
      it('should get user count for an organization role', async () => {
        // Create a test organization role first
        const roleData = TestDataGenerator.generateOrganizationRoleData();
        const createResponse = await client.role.createOrganizationRole(testOrg, roleData);
        testOrgRoleName = createResponse.role?.name || null;
        
        const response = await client.role.getOrganizationRoleUsersCount(testOrg, testOrgRoleName!);
        
        expect(response).toBeDefined();
        expect(Number(response.count)).toBeGreaterThanOrEqual(0);
      });
    });

    describe('updateDefaultOrganizationRoles', () => {
      it('should update default organization roles', async () => {
        // Create a test organization role first
        const roleData = TestDataGenerator.generateOrganizationRoleData();
        const createResponse = await client.role.createOrganizationRole(testOrg, roleData);
        testOrgRoleName = createResponse.role?.name || null;
        
        const response = await client.role.updateDefaultOrganizationRoles(testOrg, testOrgRoleName!);
        
        expect(response).toBeDefined();
        expect(response.defaultMember).toBeDefined();
        expect(response.defaultMember?.name).toBe(testOrgRoleName);
      });
    });

    describe('deleteOrganizationRoleBase', () => {
      it('should delete organization role base relationship', async () => {
        // Create base org role
        const baseRoleData = TestDataGenerator.generateOrganizationRoleData();
        const baseResp = await client.role.createOrganizationRole(testOrg, baseRoleData);
        const baseRoleName = baseResp.role?.name!;
        
        // Create extended org role which extends base
        const extendedRoleData = TestDataGenerator.generateOrganizationRoleData({ extends: baseRoleName });
        const extResp = await client.role.createOrganizationRole(testOrg, extendedRoleData);
        testOrgRoleName = extResp.role?.name || null;
        
        const response = await client.role.deleteOrganizationRoleBase(testOrg, testOrgRoleName!);
        
        expect(response).toBeDefined();
      });
    });
  });
});