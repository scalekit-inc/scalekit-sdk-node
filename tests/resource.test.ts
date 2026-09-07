import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeAll } from '@jest/globals';

// A real MCP server resource in the test environment. It currently has no
// consents, which is fine — these tests assert the call shape and pagination
// envelope, never the consent contents.
const TEST_RESOURCE_ID = 'res_142145647087190278';

describe('Resource Client (UserConsents)', () => {
  let client: ScalekitClient;

  beforeAll(async () => {
    const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
    const clientId = process.env.SCALEKIT_CLIENT_ID;
    const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;
    if (!envUrl || !clientId || !clientSecret) {
      throw new Error(
        'SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET are required'
      );
    }
    client = global.client;
  });

  describe('listUserConsents', () => {
    it('should list consents for a resource', async () => {
      const response = await client.resources.listUserConsents(
        TEST_RESOURCE_ID
      );

      expect(response).toBeDefined();
      expect(Array.isArray(response.consents)).toBe(true);
      expect(typeof response.totalSize).toBe('number');
    });

    it('should accept a page size', async () => {
      const response = await client.resources.listUserConsents(
        TEST_RESOURCE_ID,
        { pageSize: 10 }
      );

      expect(response).toBeDefined();
      expect(Array.isArray(response.consents)).toBe(true);
      expect(response.consents.length).toBeLessThanOrEqual(10);
    });

    it('should accept a search term', async () => {
      const response = await client.resources.listUserConsents(
        TEST_RESOURCE_ID,
        { search: 'usr_' }
      );

      expect(response).toBeDefined();
      expect(Array.isArray(response.consents)).toBe(true);
    });

    it('should throw when resourceId is empty', async () => {
      await expect(client.resources.listUserConsents('')).rejects.toThrow(
        'resourceId is required'
      );
    });
  });

  describe('revokeUserConsent', () => {
    it('should throw when clientId is empty', async () => {
      await expect(
        client.resources.revokeUserConsent('', 'usrcnst_1234567890')
      ).rejects.toThrow('clientId is required');
    });

    it('should throw when consentId is empty', async () => {
      await expect(
        client.resources.revokeUserConsent('m2m_1234567890', '')
      ).rejects.toThrow('consentId is required');
    });
  });
});
