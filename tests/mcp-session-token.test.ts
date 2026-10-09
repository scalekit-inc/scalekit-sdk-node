/**
 * McpClient.createSessionToken must send `accessLevel` only when the caller
 * sets it. An omitted access level leaves the field empty on the wire, which
 * the server treats as full access, so existing callers keep their tools.
 *
 * McpClient.createConnectionSessionToken must target the connection's MCP
 * server through `keyId` and never set `mcpConfigId`: the server requires
 * exactly one of the two.
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

describe('McpClient.createConnectionSessionToken', () => {
  it('targets the connection by keyId and leaves mcpConfigId empty', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    const res = await mcp.createConnectionSessionToken({
      connectionName: 'gmail',
      identifier: 'u1',
    });
    expect(res.token).toBe('tok');
    expect(createMcpSessionToken).toHaveBeenCalledTimes(1);
    const req = createMcpSessionToken.mock.calls[0][0];
    expect(req.keyId).toBe('gmail');
    expect(req.mcpConfigId).toBe('');
    expect(req.identifier).toBe('u1');
    expect(req.expiry).toBeUndefined();
    expect(req.accessLevel).toBe('');
  });

  it('forwards expiry and accessLevel', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createConnectionSessionToken({
      connectionName: 'gmail',
      identifier: 'u1',
      expirySeconds: 900,
      accessLevel: 'READ_ONLY',
    });
    const req = createMcpSessionToken.mock.calls[0][0];
    expect(req.keyId).toBe('gmail');
    expect(req.mcpConfigId).toBe('');
    expect(req.expiry?.seconds).toBe(BigInt(900));
    expect(req.accessLevel).toBe('READ_ONLY');
  });

  it('sends FULL when set explicitly', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createConnectionSessionToken({
      connectionName: 'gmail',
      identifier: 'u1',
      accessLevel: 'FULL',
    });
    expect(createMcpSessionToken.mock.calls[0][0].accessLevel).toBe('FULL');
  });

  it('rejects an empty connectionName before any request', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await expect(
      mcp.createConnectionSessionToken({ connectionName: '', identifier: 'u1' })
    ).rejects.toThrow('connectionName is required');
    expect(createMcpSessionToken).not.toHaveBeenCalled();
  });

  it.each([0, -1, 900.5, NaN, Infinity])(
    'rejects expirySeconds=%p before any request',
    async (expirySeconds) => {
      const { mcp, createMcpSessionToken } = makeMcpClient();
      await expect(
        mcp.createConnectionSessionToken({
          connectionName: 'gmail',
          identifier: 'u1',
          expirySeconds,
        })
      ).rejects.toThrow('expirySeconds must be a positive integer');
      expect(createMcpSessionToken).not.toHaveBeenCalled();
    }
  );
});

describe('McpClient.createSessionToken expiry validation', () => {
  it.each([0, -1, 900.5, NaN])(
    'still rejects expirySeconds=%p before any request',
    async (expirySeconds) => {
      const { mcp, createMcpSessionToken } = makeMcpClient();
      await expect(
        mcp.createSessionToken({
          mcpConfigId: 'cfg_1',
          identifier: 'u1',
          expirySeconds,
        })
      ).rejects.toThrow('expirySeconds must be a positive integer');
      expect(createMcpSessionToken).not.toHaveBeenCalled();
    }
  );

  it('never sets keyId', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createSessionToken({ mcpConfigId: 'cfg_1', identifier: 'u1' });
    expect(createMcpSessionToken.mock.calls[0][0].keyId).toBe('');
  });
});
