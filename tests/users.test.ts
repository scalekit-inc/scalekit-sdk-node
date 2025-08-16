import ScalekitClient from '../src/scalekit';
import { CreateUserRequest, UpdateUserRequest } from '../src/types/user';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager, TestUserManager } from './utils/test-data';

describe('Users', () => {
  let client: ScalekitClient;
  let testOrg: string;
  let userId: string | null = null;
  let sharedUserData: CreateUserRequest;

  beforeEach(async () => {
    // Use global client
    client = global.client;
    
    // Create test organization for each test
    testOrg = await TestOrganizationManager.createTestOrganization(client);
    
    // Create a shared user for testing
    sharedUserData = TestDataGenerator.generateUserData();
    const createResponse = await client.user.createUserAndMembership(testOrg, sharedUserData);
    userId = createResponse.user?.id || null;
    expect(userId).toBeDefined();
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
      // Retrieve the user by ID
      const user = await client.user.getUser(userId!);
      
      expect(user).toBeDefined();
      expect(user.user).toBeDefined();
      expect(user.user?.id).toBe(userId);
      expect(user.user?.email).toBe(sharedUserData.email);
    });
  });

  describe('createUserAndMembership', () => {
    it('should create user and membership', async () => {
      // Create a new user for this specific test
      const userData = TestDataGenerator.generateUserData();
      let newUserId: string | null = null;

      try {
        const response = await client.user.createUserAndMembership(testOrg, userData);
        
        expect(response).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.user?.id).toBeDefined();
        expect(response.user?.email).toBe(userData.email);
        expect(response.user?.metadata?.source).toBe('test');
        
        newUserId = response.user?.id || null;
      } finally {
        // Clean up the new user created in this test
        if (newUserId) {
          await TestUserManager.cleanupTestUser(client, testOrg, newUserId);
        }
      }
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
      // Modify the shared user
      const updateData = TestDataGenerator.generateUserUpdateData();

      const updatedUser = await client.user.updateUser(userId!, updateData);
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser.user).toBeDefined();
      expect(updatedUser.user?.id).toBe(userId);
      expect(updatedUser.user?.userProfile?.firstName).toBe('Updated');
      expect(updatedUser.user?.userProfile?.lastName).toBe('Name');
    });
  });

  describe('resendInvite', () => {
    it('should resend invite to user', async () => {
      // Resend invite to the shared user
      const resendResponse = await client.user.resendInvite(testOrg, userId!);
      
      // Verify the response structure
      expect(resendResponse).toBeDefined();
      expect(resendResponse.invite).toBeDefined();
      expect(resendResponse.invite?.userId).toBe(userId);
      expect(resendResponse.invite?.organizationId).toBe(testOrg);
      expect(resendResponse.invite?.status).toBe('PENDING_INVITE');
      expect(resendResponse.invite?.createdAt).toBeDefined();
      expect(resendResponse.invite?.expiresAt).toBeDefined();
      expect(resendResponse.invite?.resentCount).toBe(1);
    });

    it('should throw error when organizationId is missing', async () => {
      await expect(
        client.user.resendInvite('', userId!)
      ).rejects.toThrow('organizationId is required');
    });

    it('should throw error when userId is missing', async () => {
      await expect(
        client.user.resendInvite(testOrg, '')
      ).rejects.toThrow('userId is required');
    });
  });
}); 