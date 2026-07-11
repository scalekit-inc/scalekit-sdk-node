/**
 * Tool-execution RPCs (ToolsClient) proxy to third-party provider APIs
 * (Google Calendar, Slack, etc.) and can legitimately run longer than
 * typical control-plane calls. They must use their own `toolTimeoutMs`
 * deadline instead of the tighter control-plane `timeoutMs`, so a slow
 * (but healthy) provider call isn't killed early.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import CoreClient from '../src/core';
import ToolsClient from '../src/tools';
import ActionsClient from '../src/actions';
import ConnectedAccountsClient from '../src/connected-accounts';
import ScalekitClient from '../src/scalekit';

function makeFakeToolServiceClient() {
  return {
    listTools: jest.fn(async (_req: unknown, _options?: unknown) => ({
      tools: [],
      totalSize: 0,
    })),
    listScopedTools: jest.fn(async (_req: unknown, _options?: unknown) => ({
      tools: [],
      totalSize: 0,
    })),
    listAvailableTools: jest.fn(async (_req: unknown, _options?: unknown) => ({
      tools: [],
      totalSize: 0,
    })),
    executeTool: jest.fn(async (_req: unknown, _options?: unknown) => ({})),
  };
}

function makeToolsClient(toolTimeoutMs?: number) {
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret',
    toolTimeoutMs
  );
  const fakeClient = makeFakeToolServiceClient();
  const grpcConnect = { createClient: () => fakeClient } as any;
  return {
    tools: new ToolsClient(grpcConnect, coreClient),
    fakeClient,
    coreClient,
  };
}

describe('CoreClient.timeoutMs (control-plane, incl. token/JWKS HTTP path)', () => {
  it('defaults to 20000ms and is applied to the axios instance', () => {
    const coreClient = new CoreClient(
      'https://test.scalekit.dev',
      'client_id',
      'client_secret'
    );
    expect(coreClient.timeoutMs).toBe(20_000);
    expect((coreClient.axios as any).defaults.timeout).toBe(20_000);
  });

  it('honors a custom value passed through ScalekitOptions', () => {
    const client = new ScalekitClient(
      'https://test.scalekit.dev',
      'id',
      'secret',
      {
        timeoutMs: 7_000,
      }
    );
    const coreClient = (client as any).coreClient as CoreClient;
    expect(coreClient.timeoutMs).toBe(7_000);
    expect((coreClient.axios as any).defaults.timeout).toBe(7_000);
  });

  it('toolTimeoutMs does not affect the control-plane timeout', () => {
    const client = new ScalekitClient(
      'https://test.scalekit.dev',
      'id',
      'secret',
      {
        toolTimeoutMs: 45_000,
      }
    );
    expect(((client as any).coreClient as CoreClient).timeoutMs).toBe(20_000);
  });
});

describe('CoreClient.toolTimeoutMs', () => {
  it('defaults to 60000ms when not configured', () => {
    const coreClient = new CoreClient(
      'https://test.scalekit.dev',
      'client_id',
      'client_secret'
    );
    expect(coreClient.toolTimeoutMs).toBe(60_000);
  });

  it('honors a custom value passed through ScalekitOptions', () => {
    const client = new ScalekitClient(
      'https://test.scalekit.dev',
      'id',
      'secret',
      {
        toolTimeoutMs: 45_000,
      }
    );
    expect((client as any).coreClient.toolTimeoutMs).toBe(45_000);
  });

  it('control-plane timeoutMs does not affect toolTimeoutMs', () => {
    const client = new ScalekitClient(
      'https://test.scalekit.dev',
      'id',
      'secret',
      {
        timeoutMs: 5_000,
      }
    );
    expect((client as any).coreClient.toolTimeoutMs).toBe(60_000);
  });
});

describe('ToolsClient RPCs use toolTimeoutMs, not the control-plane default', () => {
  it('listTools', async () => {
    const { tools, fakeClient, coreClient } = makeToolsClient(45_000);
    await tools.listTools();
    expect(fakeClient.listTools).toHaveBeenCalledWith(expect.anything(), {
      timeoutMs: coreClient.toolTimeoutMs,
    });
  });

  it('listScopedTools', async () => {
    const { tools, fakeClient, coreClient } = makeToolsClient();
    await tools.listScopedTools('identifier', {
      filter: { providers: ['GOOGLE'] },
    });
    expect(fakeClient.listScopedTools).toHaveBeenCalledWith(expect.anything(), {
      timeoutMs: coreClient.toolTimeoutMs,
    });
  });

  it('listAvailableTools', async () => {
    const { tools, fakeClient, coreClient } = makeToolsClient();
    await tools.listAvailableTools('identifier');
    expect(fakeClient.listAvailableTools).toHaveBeenCalledWith(
      expect.anything(),
      { timeoutMs: coreClient.toolTimeoutMs }
    );
  });

  it('executeTool', async () => {
    const { tools, fakeClient, coreClient } = makeToolsClient();
    await tools.executeTool({ toolName: 'gmail_send_email', params: {} });
    expect(fakeClient.executeTool).toHaveBeenCalledWith(expect.anything(), {
      timeoutMs: coreClient.toolTimeoutMs,
    });
  });
});

describe('CoreClient.connectExec forwards CallOptions through retries', () => {
  it('preserves the caller-supplied timeoutMs across an Unauthenticated retry', async () => {
    const client = new CoreClient(
      'https://test.scalekit.dev',
      'client_id',
      'client_secret'
    );
    jest
      .spyOn(client as any, 'authenticateClient')
      .mockResolvedValue(undefined);

    let callCount = 0;
    const fn = jest.fn(async (_req: void, _options?: unknown) => {
      callCount++;
      if (callCount === 1) {
        throw new ConnectError('token expired', Code.Unauthenticated);
      }
      return 'ok';
    });

    const result = await client.connectExec(fn, undefined as any, {
      timeoutMs: 60_000,
    });

    expect(result).toBe('ok');
    expect(fn).toHaveBeenNthCalledWith(1, undefined, { timeoutMs: 60_000 });
    expect(fn).toHaveBeenNthCalledWith(2, undefined, { timeoutMs: 60_000 });
  });

  it('preserves the caller-supplied timeoutMs across an Unavailable backoff retry', async () => {
    const client = new CoreClient(
      'https://test.scalekit.dev',
      'client_id',
      'client_secret'
    );
    jest.spyOn(client as any, 'sleep').mockResolvedValue(undefined);

    let callCount = 0;
    const fn = jest.fn(async (_req: void, _options?: unknown) => {
      callCount++;
      if (callCount === 1) {
        throw new ConnectError('unavailable', Code.Unavailable);
      }
      return 'ok';
    });

    const result = await client.connectExec(fn, undefined as any, {
      timeoutMs: 60_000,
    });

    expect(result).toBe('ok');
    expect(fn).toHaveBeenNthCalledWith(1, undefined, { timeoutMs: 60_000 });
    expect(fn).toHaveBeenNthCalledWith(2, undefined, { timeoutMs: 60_000 });
  });

  it('omitting options leaves fn to fall back to the transport default deadline', async () => {
    const client = new CoreClient(
      'https://test.scalekit.dev',
      'client_id',
      'client_secret'
    );
    const fn = jest.fn(async (_req: void, _options?: unknown) => 'ok');

    const result = await client.connectExec(fn, undefined as any);

    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledWith(undefined, undefined);
  });
});

describe('ActionsClient.request proxy timeout', () => {
  function makeActionsClient(toolTimeoutMs?: number) {
    const coreClient = new CoreClient(
      'https://test.scalekit.dev',
      'client_id',
      'client_secret',
      toolTimeoutMs
    );
    const grpcConnect = {
      createClient: () => makeFakeToolServiceClient(),
    } as any;
    const tools = new ToolsClient(grpcConnect, coreClient);
    const connectedAccounts = new ConnectedAccountsClient(
      grpcConnect,
      coreClient
    );
    const actions = new ActionsClient(tools, connectedAccounts, coreClient);
    const requestSpy = jest
      .spyOn(coreClient.axios, 'request')
      .mockResolvedValue({ data: {}, status: 200 } as any);
    return { actions, coreClient, requestSpy };
  }

  it('defaults the proxy call timeout to toolTimeoutMs when not overridden', async () => {
    const { actions, coreClient, requestSpy } = makeActionsClient(45_000);

    await actions.request({
      connectionName: 'slack',
      identifier: 'user@example.com',
      path: '/chat.postMessage',
    });

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({ timeout: coreClient.toolTimeoutMs })
    );
    expect(coreClient.toolTimeoutMs).toBe(45_000);
  });

  it('honors a per-call timeoutMs override', async () => {
    const { actions, requestSpy } = makeActionsClient();

    await actions.request({
      connectionName: 'slack',
      identifier: 'user@example.com',
      path: '/chat.postMessage',
      timeoutMs: 5_000,
    });

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({ timeout: 5_000 })
    );
  });
});
