import ScalekitClient from '../src/scalekit';
import { DomainType } from '../src/pkg/grpc/scalekit/v1/domains/domains_pb';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestDataGenerator, TestOrganizationManager, TestDomainManager } from './utils/test-data';

describe('Domains', () => {
  let client: ScalekitClient;
  let testOrg: string;

  beforeEach(async () => {
    // Use global client
    client = global.client;
    
    // Create test organization for each test
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterEach(async () => {
    // Clean up test organization
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  describe('createDomain', () => {
    it('should create domain without domainType (backward compatibility)', async () => {
      const domainName = TestDataGenerator.generateUniqueDomainName('backward-compat');
      
      const response = await client.domain.createDomain(testOrg, domainName);
      
      expect(response).toBeDefined();
      expect(response.domain).toBeDefined();
      expect(response.domain?.domain).toBe(domainName);
      expect(response.domain?.id).toBeDefined();
      expect(response.domain?.organizationId).toBe(testOrg);
    });

    it('should create domain with ALLOWED_EMAIL_DOMAIN type', async () => {
      const domainName = TestDataGenerator.generateUniqueDomainName('allowed-email');
      
      const response = await client.domain.createDomain(testOrg, domainName, {
        domainType: DomainType.ALLOWED_EMAIL_DOMAIN
      });
      
      expect(response).toBeDefined();
      expect(response.domain).toBeDefined();
      expect(response.domain?.domain).toBe(domainName);
      expect(response.domain?.domainType).toBe(DomainType.ALLOWED_EMAIL_DOMAIN);
      expect(response.domain?.id).toBeDefined();
      expect(response.domain?.organizationId).toBe(testOrg);
    });

    it('should create domain with ORGANIZATION_DOMAIN type', async () => {
      const domainName = TestDataGenerator.generateUniqueDomainName('org-domain');
      
      const response = await client.domain.createDomain(testOrg, domainName, {
        domainType: DomainType.ORGANIZATION_DOMAIN
      });
      
      expect(response).toBeDefined();
      expect(response.domain).toBeDefined();
      expect(response.domain?.domain).toBe(domainName);
      expect(response.domain?.domainType).toBe(DomainType.ORGANIZATION_DOMAIN);
      expect(response.domain?.id).toBeDefined();
      expect(response.domain?.organizationId).toBe(testOrg);
    });

    it('should create multiple domains of different types', async () => {
      const allowedDomainName = TestDataGenerator.generateUniqueDomainName('allowed');
      const orgDomainName = TestDataGenerator.generateUniqueDomainName('org');
      
      // Create allowed email domain
      const allowedResponse = await client.domain.createDomain(testOrg, allowedDomainName, {
        domainType: DomainType.ALLOWED_EMAIL_DOMAIN
      });
      
      // Create organization domain
      const orgResponse = await client.domain.createDomain(testOrg, orgDomainName, {
        domainType: DomainType.ORGANIZATION_DOMAIN
      });
      
      expect(allowedResponse.domain?.domainType).toBe(DomainType.ALLOWED_EMAIL_DOMAIN);
      expect(orgResponse.domain?.domainType).toBe(DomainType.ORGANIZATION_DOMAIN);
      expect(allowedResponse.domain?.domain).toBe(allowedDomainName);
      expect(orgResponse.domain?.domain).toBe(orgDomainName);
    });

    it('should create domain using TestDomainManager utility', async () => {
      const { domainId, domainName, domainType, response } = await TestDomainManager.createTestDomain(
        client, 
        testOrg, 
        'allowed'
      );
      
      expect(domainId).toBeDefined();
      expect(domainName).toBeDefined();
      expect(domainType).toBe(DomainType.ALLOWED_EMAIL_DOMAIN);
      expect(response.domain?.domain).toBe(domainName);
    });
  });

  describe('listDomains', () => {
    it('should list domains for organization', async () => {
      // Create a test domain first
      const { domainName } = await TestDomainManager.createTestDomain(client, testOrg, 'allowed');
      
      const response = await client.domain.listDomains(testOrg);
      
      expect(response).toBeDefined();
      expect(response.domains).toBeDefined();
      expect(Array.isArray(response.domains)).toBe(true);
      expect(response.domains.length).toBeGreaterThan(0);
      
      // Verify basic domain attributes
      const firstDomain = response.domains[0];
      expect(firstDomain.id).toBeDefined();
      expect(firstDomain.domain).toBeDefined();
      expect(firstDomain.organizationId).toBe(testOrg);
    });

    it('should return empty list when no domains exist', async () => {
      // Use a fresh organization without any domains
      const freshOrg = await TestOrganizationManager.createTestOrganization(client);
      
      try {
        const response = await client.domain.listDomains(freshOrg);
        
        expect(response).toBeDefined();
        expect(response.domains).toBeDefined();
        expect(Array.isArray(response.domains)).toBe(true);
        expect(response.domains.length).toBe(0);
      } finally {
        await TestOrganizationManager.cleanupTestOrganization(client, freshOrg);
      }
    });

    it('should list domains with different types', async () => {
      // Create domains of different types
      const { domainName: allowedDomainName } = await TestDomainManager.createTestDomain(client, testOrg, 'allowed');
      const { domainName: orgDomainName } = await TestDomainManager.createTestDomain(client, testOrg, 'organization');
      
      const response = await client.domain.listDomains(testOrg);
      
      expect(response.domains.length).toBeGreaterThanOrEqual(2);
      
      const domainNames = response.domains.map(d => d.domain);
      const domainTypes = response.domains.map(d => d.domainType);
      
      expect(domainNames).toContain(allowedDomainName);
      expect(domainNames).toContain(orgDomainName);
      expect(domainTypes).toContain(DomainType.ALLOWED_EMAIL_DOMAIN);
      expect(domainTypes).toContain(DomainType.ORGANIZATION_DOMAIN);
    });
  });

  describe('error handling', () => {
    it('should handle invalid organization ID', async () => {
      const invalidOrgId = 'invalid-org-id';
      const domainName = TestDataGenerator.generateUniqueDomainName('error-test');
      
      await expect(
        client.domain.createDomain(invalidOrgId, domainName)
      ).rejects.toThrow();
      
      await expect(
        client.domain.listDomains(invalidOrgId)
      ).rejects.toThrow();
    });

    it('should handle invalid domain name format', async () => {
      const invalidDomainName = 'invalid-domain-name';
      
      await expect(
        client.domain.createDomain(testOrg, invalidDomainName)
      ).rejects.toThrow();
    });
  });
}); 