import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ScalekitServerException } from '../src/errors';
import { TestOrganizationManager } from './utils/test-data';

describe('Tools', () => {
  let client: ScalekitClient;
  let testOrg: string;

  beforeEach(async () => {
    client = global.client;
    testOrg = await TestOrganizationManager.createTestOrganization(client);
  });

  afterEach(async () => {
    await TestOrganizationManager.cleanupTestOrganization(client, testOrg);
  });

  describe('listTools', () => {
    it('should list tools', async () => {
      const response = await client.tools.listTools();

      expect(response).toBeDefined();
      expect(response.tools).toBeDefined();
      expect(Array.isArray(response.tools)).toBe(true);
      expect(response.totalSize).toBeDefined();
      expect(typeof response.totalSize).toBe('number');
    });

    it('should list tools with filter', async () => {
      const response = await client.tools.listTools({
        filter: {
          provider: 'GOOGLE',
        },
      });

      expect(response).toBeDefined();
      expect(response.tools).toBeDefined();
      expect(Array.isArray(response.tools)).toBe(true);
    });

    it('should list tools with pagination', async () => {
      const firstPage = await client.tools.listTools({
        pageSize: 10,
      });

      expect(firstPage).toBeDefined();
      expect(firstPage.tools).toBeDefined();
      expect(firstPage.tools.length).toBeLessThanOrEqual(10);

      if (firstPage.nextPageToken) {
        const secondPage = await client.tools.listTools({
          pageSize: 10,
          pageToken: firstPage.nextPageToken,
        });

        expect(secondPage).toBeDefined();
        expect(secondPage.tools).toBeDefined();
      }
    });

    it('should list tools with summary filter', async () => {
      const response = await client.tools.listTools({
        filter: {
          summary: true,
        },
      });

      expect(response).toBeDefined();
      expect(response.toolNames).toBeDefined();
      expect(Array.isArray(response.toolNames)).toBe(true);
    });

    it('should list tools with tool name filter', async () => {
      const response = await client.tools.listTools({
        filter: {
          toolName: ['gmail_send_email'],
        },
      });

      expect(response).toBeDefined();
      expect(response.tools).toBeDefined();
      expect(Array.isArray(response.tools)).toBe(true);
    });

    it('should list tools with identifier and connector filter', async () => {
      try {
        const response = await client.tools.listTools({
          filter: {
            identifier: 'akshay.parihar',
            connector: 'apifymcp',
            summary: true,
          },
          pageSize: 100,
        });

        expect(response).toBeDefined();
        expect(response.toolNames).toBeDefined();
        expect(Array.isArray(response.toolNames)).toBe(true);
        expect(response.toolNames).toContain('c-apifymcp_fetch-apify-docs');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should list tools with connected account id filter', async () => {
      try {
        const response = await client.tools.listTools({
          filter: {
            connectedAccountId: 'ca_121984260964876802',
            summary: true,
          },
          pageSize: 100,
        });

        expect(response).toBeDefined();
        expect(response.toolNames).toBeDefined();
        expect(Array.isArray(response.toolNames)).toBe(true);
        expect(response.toolNames).toContain('c-apifymcp_fetch-apify-docs');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });

  describe('listScopedTools', () => {
    it('should list scoped tools with identifier', async () => {
      const identifier = 'test_identifier';

      try {
        const response = await client.tools.listScopedTools(identifier, {
          filter: {
            providers: ['GOOGLE'],
          },
        });

        expect(response).toBeDefined();
        expect(response.tools).toBeDefined();
        expect(Array.isArray(response.tools)).toBe(true);
        expect(response.totalSize).toBeDefined();
        expect(typeof response.totalSize).toBe('number');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should list scoped tools with filter', async () => {
      const identifier = 'test_identifier';

      try {
        const response = await client.tools.listScopedTools(identifier, {
          filter: {
            providers: ['GOOGLE'],
            toolNames: ['gmail_send_email'],
          },
        });

        expect(response).toBeDefined();
        expect(response.tools).toBeDefined();
        expect(Array.isArray(response.tools)).toBe(true);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should list scoped tools with connection names filter', async () => {
      try {
        const response = await client.tools.listScopedTools('akshay.parihar', {
          filter: {
            connectionNames: ['apifymcp'],
          },
          pageSize: 100,
        });

        expect(response).toBeDefined();
        expect(response.tools).toBeDefined();
        expect(Array.isArray(response.tools)).toBe(true);
        const toolNames = response.tools.map(
          (st) => (st.tool?.definition as { name?: string } | undefined)?.name
        );
        expect(toolNames).toContain('c-apifymcp_fetch-apify-docs');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should list scoped tools with pagination', async () => {
      const identifier = 'test_identifier';

      try {
        const firstPage = await client.tools.listScopedTools(identifier, {
          filter: {
            providers: ['GOOGLE'],
          },
          pageSize: 10,
        });

        expect(firstPage).toBeDefined();
        expect(firstPage.tools).toBeDefined();
        expect(firstPage.tools.length).toBeLessThanOrEqual(10);

        if (firstPage.nextPageToken) {
          const secondPage = await client.tools.listScopedTools(identifier, {
            filter: {
              providers: ['GOOGLE'],
            },
            pageSize: 10,
            pageToken: firstPage.nextPageToken,
          });

          expect(secondPage).toBeDefined();
          expect(secondPage.tools).toBeDefined();
        }
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });

  describe('executeTool', () => {
    it('should handle execute tool request with minimal params', async () => {
      try {
        await client.tools.executeTool({
          toolName: 'test_tool',
          params: { test: 'value' },
        });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should handle execute tool with connected account ID', async () => {
      try {
        await client.tools.executeTool({
          toolName: 'test_tool',
          connectedAccountId: 'ca_test123',
          params: { test: 'value' },
        });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should handle execute tool with identifier and connector', async () => {
      try {
        await client.tools.executeTool({
          toolName: 'test_tool',
          identifier: 'test@example.com',
          connector: 'google_workspace',
          organizationId: testOrg,
          params: { test: 'value' },
        });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should handle execute tool with complex params', async () => {
      try {
        await client.tools.executeTool({
          toolName: 'gmail_send_email',
          identifier: 'test@example.com',
          connector: 'google_workspace',
          params: {
            to: 'recipient@example.com',
            subject: 'Test Subject',
            body: 'Test Body',
            attachments: [],
          },
        });
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });

  describe('listAvailableTools', () => {
    it('should list available tools with identifier', async () => {
      const identifier = 'test_identifier';

      try {
        const response = await client.tools.listAvailableTools(identifier);

        expect(response).toBeDefined();
        expect(response.tools).toBeDefined();
        expect(Array.isArray(response.tools)).toBe(true);
        expect(response.totalSize).toBeDefined();
        expect(typeof response.totalSize).toBe('number');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });

    it('should list available tools with pagination', async () => {
      const identifier = 'test_identifier';

      try {
        const firstPage = await client.tools.listAvailableTools(identifier, {
          pageSize: 10,
        });

        expect(firstPage).toBeDefined();
        expect(firstPage.tools).toBeDefined();
        expect(firstPage.tools.length).toBeLessThanOrEqual(10);

        if (firstPage.nextPageToken) {
          const secondPage = await client.tools.listAvailableTools(identifier, {
            pageSize: 10,
            pageToken: firstPage.nextPageToken,
          });

          expect(secondPage).toBeDefined();
          expect(secondPage.tools).toBeDefined();
        }
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ScalekitServerException);
      }
    });
  });
});
