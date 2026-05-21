import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestOrganizationManager } from './utils/test-data';

const TEST_LOGO_URL = 'https://logo.debounce.com/microsoft.com';

describe('Organization Slug and Logo', () => {
  let client: ScalekitClient;
  let testOrg: string;

  beforeEach(async () => {
    client = global.client;
    testOrg = '';
  });

  afterEach(async () => {
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  it('should create organization with logoUrl', async () => {
    const result = await client.organization.createOrganization(
      'Acme Corporation',
      { logoUrl: TEST_LOGO_URL }
    );

    testOrg = result.organization?.id || '';
    expect(result.organization).toBeDefined();
    expect(result.organization?.logoUrl).toBe(TEST_LOGO_URL);
  });

  it('should create organization with slug', async () => {
    const slug = 'app.acmecorp.com';
    const result = await client.organization.createOrganization(
      'Acme Corporation Slug Test',
      { slug }
    );

    testOrg = result.organization?.id || '';
    expect(result.organization).toBeDefined();
    expect(result.organization?.slug).toBe(slug);
  });

  describe('update operations', () => {
    beforeEach(async () => {
      testOrg = await TestOrganizationManager.createTestOrganization(client);
    });

    it('should update organization logoUrl', async () => {
      const result = await client.organization.updateOrganization(testOrg, {
        logoUrl: TEST_LOGO_URL,
      });

      expect(result.organization).toBeDefined();
      expect(result.organization?.logoUrl).toBe(TEST_LOGO_URL);
    });

    it('should update organization slug and metadata', async () => {
      const slug = 'app.acmecorp.com';
      const metadata = { custom_domain: 'app.acmecorp.com' };
      const result = await client.organization.updateOrganization(testOrg, {
        slug,
        metadata,
      });

      expect(result.organization).toBeDefined();
      expect(result.organization?.slug).toBe(slug);
      expect(result.organization?.metadata).toMatchObject(metadata);
    });
  });
});
