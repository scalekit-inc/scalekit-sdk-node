import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Virtual MCP Servers', () => {
  let client: ScalekitClient;

  beforeEach(() => {
    client = global.client;
  });

  describe('createSessionToken', () => {
    it('should be available on the mcp client', () => {
      expect(client.actions.mcp).toBeDefined();
      expect(typeof client.actions.mcp.createSessionToken).toBe('function');
    });

    // Client-side XOR validation: the proto accepts exactly one target, so the
    // wrapper rejects locally rather than letting a malformed request be sent.
    // Needs no server data, so it always runs.
    it('should throw when neither mcpConfigId nor keyId is provided', async () => {
      await expect(
        client.actions.mcp.createSessionToken({ identifier: 'user_123' })
      ).rejects.toThrow('exactly one of mcpConfigId or keyId is required');
    });

    it('should throw when both mcpConfigId and keyId are provided', async () => {
      await expect(
        client.actions.mcp.createSessionToken({
          mcpConfigId: 'mcpcfg_abc',
          keyId: 'github-connect',
          identifier: 'user_123',
        })
      ).rejects.toThrow('exactly one of mcpConfigId or keyId is required');
    });

    it('should treat blank values as not provided', async () => {
      await expect(
        client.actions.mcp.createSessionToken({
          mcpConfigId: '   ',
          identifier: 'user_123',
        })
      ).rejects.toThrow('exactly one of mcpConfigId or keyId is required');
    });

    // Long-lived fixture in the SDK test environment; the "no-delete" suffix marks
    // it as one that must not be cleaned up by test teardown.
    const keyId = 'apifymcp-sdk-test-no-delete';

    it('should mint a session token for an AgentKit connection keyId', async () => {
      const response = await client.actions.mcp.createSessionToken({
        keyId,
        identifier: `sdk-node-mcp-test-${Date.now()}`,
        expirySeconds: 900,
      });

      expect(response).toBeDefined();
      expect(typeof response.token).toBe('string');
      expect(response.token.length).toBeGreaterThan(0);
      expect(response.expiresAt).toBeDefined();
    });
  });
});
