import ScalekitClient from '../src/scalekit';
import { CreateUserRequest, UpdateUserRequest } from '../src/types/user';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  TestDataGenerator,
  TestOrganizationManager,
  TestUserManager,
} from './utils/test-data';

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
    const createResponse = await client.user.createUserAndMembership(
      testOrg,
      sharedUserData
    );
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
      const usersList = await client.user.listOrganizationUsers(
        testOrg,
        TestDataGenerator.generatePaginationParams()
      );

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
      const firstPage = await client.user.listOrganizationUsers(
        testOrg,
        TestDataGenerator.generatePaginationParams(5)
      );

      expect(firstPage).toBeDefined();
      expect(firstPage.users.length).toBeLessThanOrEqual(5);

      if (firstPage.nextPageToken) {
        const secondPage = await client.user.listOrganizationUsers(testOrg, {
          pageSize: 5,
          pageToken: firstPage.nextPageToken,
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
        const response = await client.user.createUserAndMembership(
          testOrg,
          userData
        );

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
      const userData = TestDataGenerator.generateUserData({
        email: 'test@example.com',
      });

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
      // resendInvite requires the user to have a pending invite (created with sendInvitationEmail).
      // If the environment has no login URL configured, the invite will not exist — skip gracefully.
      let resendResponse;
      try {
        resendResponse = await client.user.resendInvite(testOrg, userId!);
      } catch (error: any) {
        if (error?.message?.includes('invite not found')) {
          console.warn(
            'Skipping resendInvite: no pending invite exists (login URL not configured in this environment)'
          );
          return;
        }
        throw error;
      }

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
      await expect(client.user.resendInvite('', userId!)).rejects.toThrow(
        'organizationId is required'
      );
    });

    it('should throw error when userId is missing', async () => {
      await expect(client.user.resendInvite(testOrg, '')).rejects.toThrow(
        'userId is required'
      );
    });
  });

  describe('searchUsers', () => {
    it('should return valid response structure', async () => {
      const result = await client.user.searchUsers('test');

      expect(result).toBeDefined();
      expect(Array.isArray(result.users)).toBe(true);
      expect(typeof result.totalSize).toBe('number');
      expect(typeof result.nextPageToken).toBe('string');
    });

    it('should respect pageSize limit', async () => {
      const result = await client.user.searchUsers('test', 2);

      expect(result).toBeDefined();
      expect(result.users.length).toBeLessThanOrEqual(2);
    });

    it('should return empty results for a highly specific non-matching query', async () => {
      const nonce = `zzznomatch_${Date.now()}@example.invalid`;
      const result = await client.user.searchUsers(nonce, 10);

      expect(result).toBeDefined();
      expect(Array.isArray(result.users)).toBe(true);
      expect(result.users.length).toBe(0);
    });

    it('should paginate when nextPageToken is present', async () => {
      const firstPage = await client.user.searchUsers('test', 1);

      expect(firstPage).toBeDefined();
      expect(firstPage.users.length).toBeLessThanOrEqual(1);

      if (firstPage.nextPageToken) {
        const secondPage = await client.user.searchUsers(
          'test',
          1,
          firstPage.nextPageToken
        );

        expect(secondPage).toBeDefined();
        expect(Array.isArray(secondPage.users)).toBe(true);
      }
    });
  });

  describe('searchOrganizationUsers', () => {
    it('should return valid response structure for an organization', async () => {
      const emailPrefix = sharedUserData.email.split('@')[0];
      const result = await client.user.searchOrganizationUsers(
        testOrg,
        emailPrefix
      );

      expect(result).toBeDefined();
      expect(Array.isArray(result.users)).toBe(true);
      expect(typeof result.totalSize).toBe('number');
      expect(typeof result.nextPageToken).toBe('string');
    });

    it('should find the test user by their email prefix', async () => {
      const emailPrefix = sharedUserData.email.split('@')[0];
      const result = await client.user.searchOrganizationUsers(
        testOrg,
        emailPrefix
      );

      expect(result).toBeDefined();
      expect(Array.isArray(result.users)).toBe(true);
      const found = result.users.find((u) => u.id === userId);
      expect(found).toBeDefined();
    });

    it('should respect pageSize limit within an organization', async () => {
      const emailPrefix = sharedUserData.email.split('@')[0];
      const result = await client.user.searchOrganizationUsers(
        testOrg,
        emailPrefix,
        1
      );

      expect(result).toBeDefined();
      expect(result.users.length).toBeLessThanOrEqual(1);
    });

    it('should return empty results for a non-matching query', async () => {
      const nonce = `zzznomatch_${Date.now()}@example.invalid`;
      const result = await client.user.searchOrganizationUsers(testOrg, nonce);

      expect(result).toBeDefined();
      expect(result.users.length).toBe(0);
    });
  });

  describe('assignUserRoles', () => {
    it('should assign a role and return it in the response', async () => {
      const result = await client.user.assignUserRoles(testOrg, userId!, [
        'member',
      ]);

      expect(result).toBeDefined();
      expect(Array.isArray(result.roles)).toBe(true);
      const roleNames = result.roles.map((r) => r.name);
      expect(roleNames).toContain('member');
    });

    it('assigned role should appear in listUserRoles', async () => {
      await client.user.assignUserRoles(testOrg, userId!, ['member']);

      const rolesResponse = await client.user.listUserRoles(testOrg, userId!);
      const roleNames = rolesResponse.roles.map((r) => r.name);
      expect(roleNames).toContain('member');
    });
  });

  describe('removeUserRole', () => {
    it('should remove an assigned role and it should not appear in listUserRoles', async () => {
      await client.user.assignUserRoles(testOrg, userId!, ['member']);

      const afterAssign = await client.user.listUserRoles(testOrg, userId!);
      const namesAfterAssign = afterAssign.roles.map((r) => r.name);
      expect(namesAfterAssign).toContain('member');

      await client.user.removeUserRole(testOrg, userId!, 'member');

      const afterRemove = await client.user.listUserRoles(testOrg, userId!);
      const namesAfterRemove = afterRemove.roles.map((r) => r.name);
      expect(namesAfterRemove).not.toContain('member');
    });

    it('full lifecycle: assign → verify → remove → verify', async () => {
      await client.user.assignUserRoles(testOrg, userId!, ['member']);
      let roles = (await client.user.listUserRoles(testOrg, userId!)).roles.map(
        (r) => r.name
      );
      expect(roles).toContain('member');

      await client.user.removeUserRole(testOrg, userId!, 'member');
      roles = (await client.user.listUserRoles(testOrg, userId!)).roles.map(
        (r) => r.name
      );
      expect(roles).not.toContain('member');
    });
  });

  describe('external_id methods', () => {
    let externalUserId: string | null = null;
    let userExternalId: string;

    beforeEach(async () => {
      // Create a user with a unique externalId for external_id tests
      userExternalId = `ext_${TestDataGenerator.generateUniqueId()}`;
      const userData = TestDataGenerator.generateUserData({
        externalId: userExternalId,
      });
      const response = await client.user.createUserAndMembership(
        testOrg,
        userData
      );
      externalUserId = response.user?.id || null;
      expect(externalUserId).toBeDefined();
    });

    afterEach(async () => {
      if (externalUserId) {
        await TestUserManager.cleanupTestUser(client, testOrg, externalUserId);
        externalUserId = null;
      }
    });

    describe('getUserByExternalId', () => {
      it('should retrieve a user by external ID', async () => {
        const response = await client.user.getUserByExternalId(userExternalId);

        expect(response).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.user?.id).toBe(externalUserId);
      });
    });

    describe('updateUserByExternalId', () => {
      it('should update a user identified by external ID', async () => {
        const updateData = TestDataGenerator.generateUserUpdateData();
        const response = await client.user.updateUserByExternalId(
          userExternalId,
          updateData
        );

        expect(response).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.user?.id).toBe(externalUserId);
        expect(response.user?.userProfile?.firstName).toBe('Updated');
        expect(response.user?.userProfile?.lastName).toBe('Name');
      });
    });

    describe('deleteUserByExternalId', () => {
      it('should delete a user identified by external ID', async () => {
        await expect(
          client.user.deleteUserByExternalId(userExternalId)
        ).resolves.toBeDefined();

        // Prevent double-delete in afterEach
        externalUserId = null;
      });
    });

    describe('createMembershipByExternalId', () => {
      let secondOrg: string;

      beforeEach(async () => {
        secondOrg =
          await TestOrganizationManager.createTestOrganization(client);
      });

      afterEach(async () => {
        await TestOrganizationManager.cleanupTestOrganization(
          client,
          secondOrg
        );
      });

      it('should create a membership using external ID', async () => {
        const response = await client.user.createMembershipByExternalId(
          secondOrg,
          userExternalId,
          { sendInvitationEmail: false }
        );

        expect(response).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.user?.id).toBe(externalUserId);

        await client.user.deleteMembership(secondOrg, externalUserId!);
      });
    });

    describe('deleteMembershipByExternalId', () => {
      let secondOrg: string;

      beforeEach(async () => {
        secondOrg =
          await TestOrganizationManager.createTestOrganization(client);
        await client.user.createMembership(secondOrg, externalUserId!, {
          sendInvitationEmail: false,
        });
      });

      afterEach(async () => {
        await TestOrganizationManager.cleanupTestOrganization(
          client,
          secondOrg
        );
      });

      it('should delete a membership using external ID', async () => {
        await client.user.deleteMembershipByExternalId(
          secondOrg,
          userExternalId
        );
      });
    });

    describe('updateMembershipByExternalId', () => {
      it('should update membership roles using external ID', async () => {
        const response = await client.user.updateMembershipByExternalId(
          testOrg,
          userExternalId,
          { roles: ['member'] }
        );

        expect(response).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.user?.id).toBe(externalUserId);
      });
    });
  });
});
