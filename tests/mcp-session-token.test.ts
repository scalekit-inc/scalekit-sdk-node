/**
 * McpClient.createSessionToken must send `accessLevel` only when the caller
 * sets it. An omitted access level leaves the field empty on the wire, which
 * the server treats as full access, so existing callers keep their tools.
 */
import { describe, it, expect, jest } from '@jest/globals';
import CoreClient from '../src/core';
import McpClient from '../src/mcp';

function makeMcpClient() {
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const createMcpSessionToken = jest.fn(
    async (_req: any, _options?: unknown) => ({ token: 'tok' })
  );
  const grpcConnect = {
    createClient: () => ({ createMcpSessionToken }),
  } as any;
  return { mcp: new McpClient(grpcConnect, coreClient), createMcpSessionToken };
}

describe('McpClient.createSessionToken accessLevel', () => {
  it('leaves accessLevel empty when omitted', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createSessionToken({ mcpConfigId: 'cfg_1', identifier: 'u1' });
    const req = createMcpSessionToken.mock.calls[0][0];
    expect(req.accessLevel).toBe('');
    expect(req.mcpConfigId).toBe('cfg_1');
    expect(req.identifier).toBe('u1');
  });

  it.each(['READ_ONLY', 'FULL'] as const)('sends %s', async (level) => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createSessionToken({
      mcpConfigId: 'cfg_1',
      identifier: 'u1',
      accessLevel: level,
    });
    expect(createMcpSessionToken.mock.calls[0][0].accessLevel).toBe(level);
  });

  it('sends accessLevel alongside expiry', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createSessionToken({
      mcpConfigId: 'cfg_1',
      identifier: 'u1',
      expirySeconds: 900,
      accessLevel: 'READ_ONLY',
    });
    const req = createMcpSessionToken.mock.calls[0][0];
    expect(req.accessLevel).toBe('READ_ONLY');
    expect(req.expiry?.seconds).toBe(BigInt(900));
  });
});
