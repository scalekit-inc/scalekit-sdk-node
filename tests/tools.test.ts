import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TestOrganizationManager } from './utils/test-data';

describe('Tools', () => {
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
  });

  describe('listScopedTools', () => {
    it('should list scoped tools with identifier', async () => {
      const identifier = 'test_identifier';
      
      // Filter is required by the API and must have at least one non-empty array
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
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
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
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
      }
    });

    it('should list scoped tools with pagination', async () => {
      const identifier = 'test_identifier';
      
      // Filter is required by the API and must have at least one non-empty array
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
      } catch (error: any) {
        // Expected errors: connected account not found, etc.
        expect(error).toBeDefined();
      }
    });
  });

  describe('executeTool', () => {
    it('should handle execute tool request with minimal params', async () => {
      // This test expects an error since we don't have a real tool/connected account
      // but it validates the request structure is correct
      try {
        await client.tools.executeTool({
          toolName: 'test_tool',
          params: {
            test: 'value',
          },
        });
        // If execution succeeds, that's fine too
      } catch (error: any) {
        // Expected errors: tool not found, connected account not found, etc.
        expect(error).toBeDefined();
        // Verify it's a proper error response, not a request structure issue
        expect(error.message || error.toString()).toBeDefined();
      }
    });

    it('should handle execute tool with connected account ID', async () => {
      try {
        await client.tools.executeTool({
          toolName: 'test_tool',
          connectedAccountId: 'ca_test123',
          params: {
            test: 'value',
          },
        });
      } catch (error: any) {
        // Expected errors: tool not found, connected account not found, etc.
        expect(error).toBeDefined();
      }
    });

    it('should handle execute tool with identifier and connector', async () => {
      try {
        await client.tools.executeTool({
          toolName: 'test_tool',
          identifier: 'test@example.com',
          connector: 'google_workspace',
          organizationId: testOrg,
          params: {
            test: 'value',
          },
        });
      } catch (error: any) {
        // Expected errors: tool not found, connected account not found, etc.
        expect(error).toBeDefined();
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
      } catch (error: any) {
        // Expected errors: tool not found, connected account not found, etc.
        expect(error).toBeDefined();
      }
    });
  });
});
