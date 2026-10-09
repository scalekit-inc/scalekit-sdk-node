/**
 * McpClient.createSessionToken targets either an MCP configuration
 * (`mcpConfigId`) or a connection's own MCP server (`connectionName`, sent as
 * `keyId`). The server requires exactly one of the two; the SDK never sets
 * the other field. Only the connectionName form is checked before sending:
 * mcpConfigId calls build the same request they always did, unchecked.
 *
 * `accessLevel` is sent only when the caller sets it. An omitted access level
 * leaves the field empty on the wire, which the server treats as full access,
 * so existing callers keep their tools.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { create } from '@bufbuild/protobuf';
import { Code, ConnectError } from '@connectrpc/connect';
import CoreClient from '../src/core';
import McpClient from '../src/mcp';
import type { CreateMcpSessionTokenParams } from '../src';
import { ScalekitBadRequestException, ScalekitException } from '../src/errors';
import { CreateMcpSessionTokenRequestSchema } from '../src/pkg/grpc/scalekit/v1/mcp/mcp_pb';

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

describe('McpClient.createSessionToken with mcpConfigId', () => {
  it('sends mcpConfigId and never sets keyId', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    const res = await mcp.createSessionToken({
      mcpConfigId: 'cfg_1',
      identifier: 'u1',
    });
    expect(res.token).toBe('tok');
    expect(createMcpSessionToken).toHaveBeenCalledTimes(1);
    const req = createMcpSessionToken.mock.calls[0][0];
    expect(req.mcpConfigId).toBe('cfg_1');
    expect(req.keyId).toBe('');
    expect(req.identifier).toBe('u1');
    expect(req.expiry).toBeUndefined();
    expect(req.accessLevel).toBe('');
  });

  it('accepts a params object typed the way existing callers wrote it', async () => {
    // Existing callers may hold the params in a variable of this shape; it
    // must stay assignable to the new union type.
    const legacy: {
      mcpConfigId: string;
      identifier: string;
      expirySeconds?: number;
      accessLevel?: 'FULL' | 'READ_ONLY';
    } = { mcpConfigId: 'cfg_1', identifier: 'u1', expirySeconds: 60 };
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createSessionToken(legacy);
    const req = createMcpSessionToken.mock.calls[0][0];
    expect(req.mcpConfigId).toBe('cfg_1');
    expect(req.expiry?.seconds).toBe(BigInt(60));
  });

  it.each(['READ_ONLY', 'FULL'] as const)(
    'sends accessLevel %s',
    async (level) => {
      const { mcp, createMcpSessionToken } = makeMcpClient();
      await mcp.createSessionToken({
        mcpConfigId: 'cfg_1',
        identifier: 'u1',
        accessLevel: level,
      });
      expect(createMcpSessionToken.mock.calls[0][0].accessLevel).toBe(level);
    }
  );

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

describe('McpClient.createSessionToken with connectionName', () => {
  it('targets the connection by keyId and never sets mcpConfigId', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    const res = await mcp.createSessionToken({
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

  it('sends the name unchanged (the server matches it)', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createSessionToken({
      connectionName: 'Gmail-Work',
      identifier: 'u1',
    });
    expect(createMcpSessionToken.mock.calls[0][0].keyId).toBe('Gmail-Work');
  });

  it('forwards expiry and accessLevel', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createSessionToken({
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
    await mcp.createSessionToken({
      connectionName: 'gmail',
      identifier: 'u1',
      accessLevel: 'FULL',
    });
    expect(createMcpSessionToken.mock.calls[0][0].accessLevel).toBe('FULL');
  });
});

describe('McpClient.createSessionToken connectionName validation', () => {
  // Plain JavaScript callers bypass the union type, so these go through `any`.
  const invalid: Array<[string, Record<string, unknown>, string]> = [
    [
      'both targets',
      { mcpConfigId: 'cfg_1', connectionName: 'gmail' },
      'Set exactly one of mcpConfigId or connectionName, not both',
    ],
    [
      'an empty mcpConfigId alongside connectionName',
      { mcpConfigId: '', connectionName: 'gmail' },
      'Set exactly one of mcpConfigId or connectionName, not both',
    ],
    [
      'a non-string connectionName',
      { connectionName: 42 },
      'connectionName must be a non-empty string',
    ],
  ];

  it.each(invalid)(
    'rejects %s before any request',
    async (_label, target, message) => {
      const { mcp, createMcpSessionToken } = makeMcpClient();
      await expect(
        mcp.createSessionToken({ ...target, identifier: 'u1' } as any)
      ).rejects.toThrow(message);
      expect(createMcpSessionToken).not.toHaveBeenCalled();
    }
  );

  it('treats a null mcpConfigId as absent', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createSessionToken({
      mcpConfigId: null,
      connectionName: 'gmail',
      identifier: 'u1',
    } as any);
    const req = createMcpSessionToken.mock.calls[0][0];
    expect(req.keyId).toBe('gmail');
    expect(req.mcpConfigId).toBe('');
  });
});

describe('McpClient.createSessionToken mcpConfigId calls are unchecked', () => {
  // Without a non-empty connectionName the SDK adds no checks beyond
  // expirySeconds: the request is built exactly as it always was, from the
  // values given, and the server decides. These pin that behaviour.
  function configRequest(mcpConfigId: unknown) {
    return create(CreateMcpSessionTokenRequestSchema, {
      mcpConfigId: mcpConfigId as string,
      identifier: 'u1',
    });
  }

  it.each([
    ['no target', {}, undefined],
    [
      'both targets undefined',
      { mcpConfigId: undefined, connectionName: undefined },
      undefined,
    ],
    ['an empty mcpConfigId', { mcpConfigId: '' }, ''],
    ['a null mcpConfigId', { mcpConfigId: null }, null],
    [
      'a stray empty connectionName',
      { mcpConfigId: 'cfg_1', connectionName: '' },
      'cfg_1',
    ],
    [
      'a null connectionName',
      { mcpConfigId: 'cfg_1', connectionName: null },
      'cfg_1',
    ],
    ['only an empty connectionName', { connectionName: '' }, undefined],
  ])('sends the request for %s', async (_label, target, mcpConfigId) => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await mcp.createSessionToken({ ...target, identifier: 'u1' } as any);
    expect(createMcpSessionToken).toHaveBeenCalledTimes(1);
    const req = createMcpSessionToken.mock.calls[0][0];
    expect(req).toEqual(configRequest(mcpConfigId));
    expect(req.keyId).toBe('');
  });

  it('surfaces the server rejection as a ScalekitException subclass', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    createMcpSessionToken.mockImplementation(async () => {
      throw new ConnectError('mcp_config_id is required', Code.InvalidArgument);
    });
    const call = mcp.createSessionToken({ identifier: 'u1' } as any);
    await expect(call).rejects.toBeInstanceOf(ScalekitBadRequestException);
    await expect(call).rejects.toBeInstanceOf(ScalekitException);
    expect(createMcpSessionToken).toHaveBeenCalledTimes(1);
  });

  it('checks expirySeconds before the target', async () => {
    const { mcp, createMcpSessionToken } = makeMcpClient();
    await expect(
      mcp.createSessionToken({
        mcpConfigId: 'cfg_1',
        connectionName: 'gmail',
        identifier: 'u1',
        expirySeconds: 0,
      } as any)
    ).rejects.toThrow('expirySeconds must be a positive integer, got 0');
    expect(createMcpSessionToken).not.toHaveBeenCalled();
  });
});

describe('McpClient.createSessionToken expiry validation', () => {
  it.each([0, -1, 900.5, NaN, Infinity])(
    'rejects expirySeconds=%p for a configuration before any request',
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

  it.each([0, -1, 900.5, NaN, Infinity])(
    'rejects expirySeconds=%p for a connection before any request',
    async (expirySeconds) => {
      const { mcp, createMcpSessionToken } = makeMcpClient();
      await expect(
        mcp.createSessionToken({
          connectionName: 'gmail',
          identifier: 'u1',
          expirySeconds,
        })
      ).rejects.toThrow('expirySeconds must be a positive integer');
      expect(createMcpSessionToken).not.toHaveBeenCalled();
    }
  );
});

describe('CreateMcpSessionTokenParams type', () => {
  // Compile-time checks: ts-jest type-checks this file, so if the union ever
  // accepts an invalid shape below, the unused expect-error directive fails
  // the suite.
  it('accepts exactly one target', () => {
    const byConfig: CreateMcpSessionTokenParams = {
      mcpConfigId: 'cfg_1',
      identifier: 'u1',
    };
    const byConnection: CreateMcpSessionTokenParams = {
      connectionName: 'gmail',
      identifier: 'u1',
      accessLevel: 'READ_ONLY',
    };
    // @ts-expect-error both targets set
    const both: CreateMcpSessionTokenParams = {
      mcpConfigId: 'cfg_1',
      connectionName: 'gmail',
      identifier: 'u1',
    };
    // @ts-expect-error neither target set
    const neither: CreateMcpSessionTokenParams = { identifier: 'u1' };
    // @ts-expect-error identifier is required
    const noIdentifier: CreateMcpSessionTokenParams = { connectionName: 'g' };
    expect([byConfig, byConnection, both, neither, noIdentifier]).toHaveLength(
      5
    );
  });
});
