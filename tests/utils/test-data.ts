import { CreateUserRequest, UpdateUserRequest } from '../../src/types/user';
import { TemplateType } from '../../src/pkg/grpc/scalekit/v1/auth/passwordless_pb';
import { DomainType } from '../../src/pkg/grpc/scalekit/v1/domains/domains_pb';
import { CreateRole, UpdateRole, CreateOrganizationRole } from '../../src/pkg/grpc/scalekit/v1/roles/roles_pb';
import { CreatePermission } from '../../src/pkg/grpc/scalekit/v1/roles/roles_pb';

/**
 * Test data generation utilities to reduce redundancy across test files
 */

export class TestDataGenerator {
  /**
   * Generate a unique timestamp-based identifier
   */
  static generateUniqueId(): string {
    // Alphanumeric only (no hyphens), to satisfy backend regex constraints
    const ts = Date.now().toString(36);
    const rnd = Math.random().toString(36).substr(2, 9);
    return `${ts}${rnd}`;
  }

  /**
   * Generate a unique email address for testing
   */
  static generateUniqueEmail(): string {
    return `test.user.${this.generateUniqueId()}@example.com`;
  }

  /**
   * Generate test organization data
   */
  static generateOrganizationData() {
    const uniqueId = this.generateUniqueId();
    return {
      name: `Test Org ${uniqueId}`,
      externalId: `ext_org_${uniqueId}`
    };
  }

  /**
   * Generate test user data
   */
  static generateUserData(overrides: Partial<CreateUserRequest> = {}): CreateUserRequest {
    const uniqueEmail = this.generateUniqueEmail();
    
    return {
      email: uniqueEmail,
      userProfile: {
        firstName: 'Test',
        lastName: 'User'
      },
      metadata: {
        source: 'test'
      },
      ...overrides
    };
  }

  /**
   * Generate test user update data
   */
  static generateUserUpdateData(overrides: Partial<UpdateUserRequest> = {}): UpdateUserRequest {
    return {
      userProfile: {
        firstName: 'Updated',
        lastName: 'Name'
      },
      ...overrides
    };
  }

  /**
   * Generate test passwordless email data
   */
  static generatePasswordlessEmailData(overrides: any = {}) {
    return {
      template: TemplateType.SIGNIN,
      state: 'test-state',
      expiresIn: 3600,
      magiclinkAuthUri: 'https://example.com/auth/callback',
      ...overrides
    };
  }

  /**
   * Generate test passwordless email with template variables
   */
  static generatePasswordlessEmailWithTemplateData(overrides: any = {}) {
    return {
      template: TemplateType.SIGNUP,
      templateVariables: {
        companyName: 'Test Company',
        appName: 'Test App'
      },
      magiclinkAuthUri: 'https://example.com/auth/callback',
      ...overrides
    };
  }

  /**
   * Generate test webhook data for verification
   */
  static generateWebhookData() {
    const secret = 'whsec_test-secret';
    const payload = '{"test": "data"}';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const webhookId = 'msg_test_webhook_id';
    
    // Generate valid signature for testing
    const crypto = require('crypto');
    const data = `${webhookId}.${timestamp}.${payload}`;
    const hmac = crypto.createHmac('sha256', Buffer.from('test-secret', 'base64'));
    hmac.update(data);
    const computedSignature = hmac.digest('base64');
    const signature = `v1,${computedSignature}`;
    
    return {
      secret,
      payload,
      timestamp,
      webhookId,
      signature,
      headers: {
        'webhook-id': webhookId,
        'webhook-timestamp': timestamp,
        'webhook-signature': signature
      }
    };
  }

  /**
   * Generate test authorization URL options
   */
  static generateAuthorizationUrlOptions(overrides: any = {}) {
    return {
      scopes: ['openid', 'profile'],
      state: 'test-state',
      nonce: 'test-nonce',
      prompt: 'login',
      ...overrides
    };
  }

  /**
   * Generate test PKCE parameters
   */
  static generatePKCEParams() {
    return {
      codeChallenge: 'test-challenge',
      codeChallengeMethod: 'S256'
    };
  }

  /**
   * Generate test pagination parameters
   */
  static generatePaginationParams(pageSize: number = 10) {
    return {
      pageSize,
      pageToken: ''
    };
  }

  /**
   * Generate test credential data for passwordless verification
   */
  static generateCredentialData(type: 'code' | 'linkToken' = 'code') {
    if (type === 'code') {
      return { code: 'mock-code' };
    } else {
      return { linkToken: 'mock-link-token' };
    }
  }

  /**
   * Generate test domain data
   */
  static generateDomainData(domainType?: 'allowed' | 'organization') {
    const uniqueId = this.generateUniqueId();
    const baseDomain = `test-domain-${uniqueId}.com`;
    
    return {
      domain: baseDomain,
      domainType: domainType === 'allowed' ? 'ALLOWED_EMAIL_DOMAIN' : 
                  domainType === 'organization' ? 'ORGANIZATION_DOMAIN' : undefined
    };
  }

  /**
   * Generate unique domain name for testing
   */
  static generateUniqueDomainName(prefix: string = 'test'): string {
    const uniqueId = this.generateUniqueId();
    return `${prefix}-${uniqueId}.com`;
  }

  /**
   * Generate test role data
   */
  static generateRoleData(overrides: Partial<CreateRole> = {}): CreateRole {
    const uniqueId = this.generateUniqueId();
    
    return new CreateRole({
      name: `test_role_${uniqueId}`,
      displayName: `Test Role ${uniqueId}`,
      description: `Test role description ${uniqueId}`,
      permissions: [], // Initialize empty permissions array
      ...overrides
    });
  }

  /**
   * Generate test role update data
   */
  static generateRoleUpdateData(overrides: Partial<UpdateRole> = {}): UpdateRole {
    const uniqueId = this.generateUniqueId();
    
    return new UpdateRole({
      displayName: `Updated Role ${uniqueId}`,
      description: `Updated role description ${uniqueId}`,
      ...overrides
    });
  }

  /**
   * Generate test organization role data
   */
  static generateOrganizationRoleData(overrides: Partial<CreateOrganizationRole> = {}): CreateOrganizationRole {
    const uniqueId = this.generateUniqueId();
    
    return new CreateOrganizationRole({
      name: `test_org_role_${uniqueId}`,
      displayName: `Test Organization Role ${uniqueId}`,
      description: `Test organization role description ${uniqueId}`,
      permissions: [], // Initialize empty permissions array
      ...overrides
    });
  }

  /**
   * Generate test permission data
   */
  static generatePermissionData(overrides: Partial<CreatePermission> = {}): CreatePermission {
    const uniqueId = this.generateUniqueId();
    
    return new CreatePermission({
      name: `test_permission_${uniqueId}`,
      description: `Test permission description ${uniqueId}`,
      ...overrides
    });
  }
}

/**
 * Test organization management utilities
 */
export class TestOrganizationManager {
  /**
   * Create a test organization and return its ID
   */
  static async createTestOrganization(client: any): Promise<string> {
    const orgData = TestDataGenerator.generateOrganizationData();
    const orgResponse = await client.organization.createOrganization(
      orgData.name, 
      { externalId: orgData.externalId }
    );
    
    const testOrg = orgResponse.organization?.id || '';
    if (!testOrg) {
      throw new Error('Failed to create test organization');
    }
    
    return testOrg;
  }

  /**
   * Clean up a test organization
   */
  static async cleanupTestOrganization(client: any, testOrg: string): Promise<void> {
    if (testOrg) {
      try {
        await client.organization.deleteOrganization(testOrg);
      } catch (error) {
        // Organization may already be deleted
      }
    }
  }
}

/**
 * Test user management utilities
 */
export class TestUserManager {
  /**
   * Create a test user and return user data
   */
  static async createTestUser(client: any, testOrg: string, overrides: Partial<CreateUserRequest> = {}) {
    const userData = TestDataGenerator.generateUserData(overrides);
    const createResponse = await client.user.createUserAndMembership(testOrg, userData);
    const createdUserId = createResponse.user?.id;
    
    if (!createdUserId) {
      throw new Error('Failed to create test user');
    }
    
    return {
      userId: createdUserId,
      userData,
      response: createResponse
    };
  }

  /**
   * Clean up a test user
   */
  static async cleanupTestUser(client: any, testOrg: string, userId: string): Promise<void> {
    if (userId) {
      try {
        // Remove membership if it exists
        await client.user.deleteMembership(testOrg, userId);
      } catch (error) {
        // Membership may not exist
      }
      
      try {
        await client.user.deleteUser(userId);
      } catch (error) {
        // User may already be deleted
      }
    }
  }
}

/**
 * Test domain management utilities
 */
export class TestDomainManager {
  /**
   * Create a test domain and return domain data
   */
  static async createTestDomain(client: any, testOrg: string, domainType?: 'allowed' | 'organization') {
    const domainName = TestDataGenerator.generateUniqueDomainName();
    const options = domainType ? { 
      domainType: domainType === 'allowed' ? DomainType.ALLOWED_EMAIL_DOMAIN : DomainType.ORGANIZATION_DOMAIN
    } : undefined;
    
    const response = await client.domain.createDomain(testOrg, domainName, options);
    const createdDomainId = response.domain?.id;
    
    if (!createdDomainId) {
      throw new Error('Failed to create test domain');
    }
    
    return {
      domainId: createdDomainId,
      domainName,
      domainType: response.domain?.domainType,
      response
    };
  }

  /**
   * Clean up a test domain (if domain deletion is supported)
   */
  static async cleanupTestDomain(client: any, testOrg: string, domainId: string): Promise<void> {
    if (domainId) {
      try {
        // Note: Domain deletion may not be implemented yet
        // await client.domain.deleteDomain(testOrg, domainId);
      } catch (error) {
        // Domain may already be deleted or deletion not supported
      }
    }
  }
}

/**
 * Test role management utilities
 */
export class TestRoleManager {
  /**
   * Create a test role and return role data
   */
  static async createTestRole(client: any, overrides: Partial<CreateRole> = {}) {
    const roleData = TestDataGenerator.generateRoleData(overrides);
    const response = await client.role.createRole(roleData);
    const createdRoleName = response.role?.name;
    
    if (!createdRoleName) {
      throw new Error('Failed to create test role');
    }
    
    return {
      roleName: createdRoleName,
      roleData,
      response
    };
  }

  /**
   * Clean up a test role
   */
  static async cleanupTestRole(client: any, roleName: string): Promise<void> {
    if (roleName) {
      try {
        await client.role.deleteRole(roleName);
      } catch (error) {
        // Role may already be deleted
      }
    }
  }

  /**
   * Create a test organization role and return role data
   */
  static async createTestOrganizationRole(client: any, testOrg: string, overrides: Partial<CreateOrganizationRole> = {}) {
    const roleData = TestDataGenerator.generateOrganizationRoleData(overrides);
    const response = await client.role.createOrganizationRole(testOrg, roleData);
    const createdRoleName = response.role?.name;
    
    if (!createdRoleName) {
      throw new Error('Failed to create test organization role');
    }
    
    return {
      roleName: createdRoleName,
      roleData,
      response
    };
  }

  /**
   * Clean up a test organization role
   */
  static async cleanupTestOrganizationRole(client: any, testOrg: string, roleName: string): Promise<void> {
    if (roleName) {
      try {
        await client.role.deleteOrganizationRole(testOrg, roleName);
      } catch (error) {
        // Role may already be deleted
      }
    }
  }
}

/**
 * Test permission management utilities
 */
export class TestPermissionManager {
  /**
   * Create a test permission and return permission data
   */
  static async createTestPermission(client: any, overrides: Partial<CreatePermission> = {}) {
    const permissionData = TestDataGenerator.generatePermissionData(overrides);
    const response = await client.permission.createPermission(permissionData);
    const createdPermissionName = response.permission?.name;
    
    if (!createdPermissionName) {
      throw new Error('Failed to create test permission');
    }
    
    return {
      permissionName: createdPermissionName,
      permissionData,
      response
    };
  }

  /**
   * Clean up a test permission
   */
  static async cleanupTestPermission(client: any, permissionName: string): Promise<void> {
    if (permissionName) {
      try {
        await client.permission.deletePermission(permissionName);
      } catch (error) {
        // Permission may already be deleted
      }
    }
  }
} 