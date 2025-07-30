import ScalekitClient from '../src/scalekit';
import { CreateUserRequest, UpdateUserRequest } from '../src/types/user';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager, TestUserManager } from './utils/test-data';

describe('Users', () => {
  let client: ScalekitClient;
  let testOrg: string;
  let userId: string | null = null;

  beforeEach(async () => {
    // Use global client
    client = global.client;
    
    // Create test organization for each test
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterEach(async () => {
    // Clean up test resources
    if (userId) {
      await TestUserManager.cleanupTestUser(client, testOrg, userId);
      userId = null;
    }
    
    // Clean up test organization
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  describe('listOrganizationUsers', () => {
    it('should list users by organization', async () => {
      // Create a user to ensure the organization has at least one user
      const userData = TestDataGenerator.generateUserData();

      const createResponse = await client.user.createUserAndMembership(testOrg, userData);
      const createdUserId = createResponse.user?.id;
      expect(createdUserId).toBeDefined();
      
      // Track user ID for cleanup
      userId = createdUserId || null;

      // List users in the organization
      const usersList = await client.user.listOrganizationUsers(testOrg, TestDataGenerator.generatePaginationParams());

      expect(usersList).toBeDefined();
      expect(usersList.users).toBeDefined();
      expect(Array.isArray(usersList.users)).toBe(true);
      expect(usersList.users.length).toBeGreaterThan(0);

      // Verify basic user attributes
      const firstUser = usersList.users[0];
      expect(firstUser.id).toBeDefined();
      expect(firstUser.email).toBeDefined();
      expect(firstUser.environmentId).toBeDefined();
    });

    it('should handle pagination', async () => {
      const firstPage = await client.user.listOrganizationUsers(testOrg, TestDataGenerator.generatePaginationParams(5));

      expect(firstPage).toBeDefined();
      expect(firstPage.users.length).toBeLessThanOrEqual(5);

      if (firstPage.nextPageToken) {
        const secondPage = await client.user.listOrganizationUsers(testOrg, {
          pageSize: 5,
          pageToken: firstPage.nextPageToken
        });

        expect(secondPage).toBeDefined();
        expect(secondPage.users).toBeDefined();
      }
    });
  });

  describe('getUser', () => {
    it('should get user by ID', async () => {
      // Create a user for testing
      const userData = TestDataGenerator.generateUserData();

      const createResponse = await client.user.createUserAndMembership(testOrg, userData);
      const createdUserId = createResponse.user?.id;
      expect(createdUserId).toBeDefined();
      
      // Track user ID for cleanup
      userId = createdUserId || null;

      // Retrieve the user by ID
      const user = await client.user.getUser(createdUserId!);
      
      expect(user).toBeDefined();
      expect(user.user).toBeDefined();
      expect(user.user?.id).toBe(createdUserId);
      expect(user.user?.email).toBe(userData.email);
    });
  });

  describe('createUserAndMembership', () => {
    it('should create user and membership', async () => {
      const userData = TestDataGenerator.generateUserData();

      const response = await client.user.createUserAndMembership(testOrg, userData);
      
      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user?.id).toBeDefined();
      expect(response.user?.email).toBe(userData.email);
      expect(response.user?.metadata?.source).toBe('test');
      
      // Track user ID for cleanup
      userId = response.user?.id || null;
    });

    it('should throw error when email is missing', async () => {
      const userData = TestDataGenerator.generateUserData({ email: '' }); // Empty email

      await expect(
        client.user.createUserAndMembership(testOrg, userData)
      ).rejects.toThrow('email is required');
    });

    it('should throw error when organizationId is missing', async () => {
      const userData = TestDataGenerator.generateUserData({ email: 'test@example.com' });

      await expect(
        client.user.createUserAndMembership('', userData)
      ).rejects.toThrow('organizationId is required');
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      // Create a user for testing
      const userData = TestDataGenerator.generateUserData();

      const createResponse = await client.user.createUserAndMembership(testOrg, userData);
      const createdUserId = createResponse.user?.id;
      expect(createdUserId).toBeDefined();
      
      // Track user ID for cleanup
      userId = createdUserId || null;

      // Modify the user
      const updateData = TestDataGenerator.generateUserUpdateData();

      const updatedUser = await client.user.updateUser(createdUserId!, updateData);
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser.user).toBeDefined();
      expect(updatedUser.user?.id).toBe(createdUserId);
      expect(updatedUser.user?.userProfile?.firstName).toBe('Updated');
      expect(updatedUser.user?.userProfile?.lastName).toBe('Name');
    });
  });
}); 