/**
 * `tools.refreshTools` and `actions.refreshTools`: resync the tool list of a
 * custom MCP connector's connected account from its upstream MCP server.
 *
 * Offline tests: the gRPC client is mocked, so no environment is needed.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import { create } from '@bufbuild/protobuf';
import ActionsClient from '../src/actions';
import ToolsClient from '../src/tools';
import CoreClient from '../src/core';
import {
  ScalekitBadRequestException,
  ScalekitException,
  ScalekitNotFoundException,
  ScalekitTooManyRequestsException,
  ScalekitValidationError,
} from '../src/errors';
import { ErrorInfoSchema } from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import { RefreshToolsResponseSchema } from '../src/pkg/grpc/scalekit/v1/tools/tools_pb';

const core = () =>
  new CoreClient('https://test.scalekit.dev', 'client_id', 'client_secret');

function setup() {
  const rpc = {
    refreshTools: jest.fn(async (_r: any, _o?: any) =>
      create(RefreshToolsResponseSchema, {
        tools: [
          { id: 'tol_1', provider: 'ACMEMCP:1234' },
          { id: 'tol_2', provider: 'ACMEMCP:1234' },
        ],
        totalSize: 2,
      })
    ),
  };
  const coreClient = core();
  const tools = new ToolsClient({ createClient: () => rpc } as any, coreClient);
  const actions = new ActionsClient(
    tools,
    {} as any,
    coreClient,
    {} as any,
    {} as any,
    {} as any
  );
  return { rpc, tools, actions, coreClient };
}

const lastCall = (fn: jest.Mock): any[] =>
  fn.mock.calls[fn.mock.calls.length - 1] as any[];

const connectError = (code: Code, message: string, errorCode: string) =>
  new ConnectError(message, code, undefined, [
    { desc: ErrorInfoSchema, value: { errorCode } },
  ]);

describe('tools.refreshTools', () => {
  it('identifies the account by its ID', async () => {
    const { rpc, tools } = setup();

    const res = await tools.refreshTools({ connectedAccountId: 'ca_123' });

    const [request] = lastCall(rpc.refreshTools);
    expect(request.connectedAccountId).toBe('ca_123');
    expect(request.connector).toBeUndefined();
    expect(request.identifier).toBeUndefined();
    expect(res.tools.map((t) => t.id)).toEqual(['tol_1', 'tol_2']);
    expect(res.totalSize).toBe(2);
  });

  it('identifies the account by connector and identifier, with its scope', async () => {
    const { rpc, tools } = setup();

    await tools.refreshTools({
      connector: 'acme-mcp',
      identifier: 'user_123',
      organizationId: 'org_1',
      userId: 'usr_1',
    });

    const [request] = lastCall(rpc.refreshTools);
    expect(request.connector).toBe('acme-mcp');
    expect(request.identifier).toBe('user_123');
    expect(request.organizationId).toBe('org_1');
    expect(request.userId).toBe('usr_1');
    expect(request.connectedAccountId).toBeUndefined();
  });

  it('leaves out empty values instead of sending them', async () => {
    const { rpc, tools } = setup();

    await tools.refreshTools({
      connectedAccountId: 'ca_123',
      connector: '',
      identifier: '',
    });

    const [request] = lastCall(rpc.refreshTools);
    expect(request.connector).toBeUndefined();
    expect(request.identifier).toBeUndefined();
  });

  it('uses the tool timeout, as the other tool calls do', async () => {
    const { rpc, tools, coreClient } = setup();

    await tools.refreshTools({ connectedAccountId: 'ca_123' });

    const [, options] = lastCall(rpc.refreshTools);
    expect(options).toEqual({ timeoutMs: coreClient.toolTimeoutMs });
  });

  it('surfaces a connector that is not a custom MCP connector as a bad request', async () => {
    const { rpc, tools } = setup();
    rpc.refreshTools.mockRejectedValueOnce(
      connectError(
        Code.InvalidArgument,
        'connected account is not a custom MCP connector',
        'INVALID_ARGUMENT'
      )
    );

    const error = await tools
      .refreshTools({ connectedAccountId: 'ca_123' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitBadRequestException);
    expect(error.message).toContain('not a custom MCP connector');
  });

  it('surfaces an unknown account as not found', async () => {
    const { rpc, tools } = setup();
    rpc.refreshTools.mockRejectedValueOnce(
      connectError(Code.NotFound, 'connected account not found', 'NOT_FOUND')
    );

    const error = await tools
      .refreshTools({ connectedAccountId: 'ca_nope' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitNotFoundException);
  });

  it('surfaces a refresh already running as too many requests, without retrying', async () => {
    const { rpc, tools } = setup();
    rpc.refreshTools.mockRejectedValue(
      connectError(
        Code.ResourceExhausted,
        'a tool refresh is already in progress for this connected account; please retry in a few seconds',
        'DISCOVERY_IN_PROGRESS'
      )
    );

    const error = await tools
      .refreshTools({ connectedAccountId: 'ca_123' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitTooManyRequestsException);
    expect(error.errorCode).toBe('DISCOVERY_IN_PROGRESS');
    expect(rpc.refreshTools).toHaveBeenCalledTimes(1);
  });
});

describe('actions.refreshTools', () => {
  it('maps connectionName to connector and trims the values', async () => {
    const { rpc, actions } = setup();

    await actions.refreshTools({
      connectionName: ' acme-mcp ',
      identifier: ' user_123 ',
      organizationId: 'org_1',
      userId: 'usr_1',
    });

    const [request] = lastCall(rpc.refreshTools);
    expect(request.connector).toBe('acme-mcp');
    expect(request.identifier).toBe('user_123');
    expect(request.organizationId).toBe('org_1');
    expect(request.userId).toBe('usr_1');
  });

  it('accepts a connected account ID alone', async () => {
    const { rpc, actions } = setup();

    const res = await actions.refreshTools({ connectedAccountId: 'ca_123' });

    expect(lastCall(rpc.refreshTools)[0].connectedAccountId).toBe('ca_123');
    expect(res.totalSize).toBe(2);
  });

  it('needs a connected account ID, or a connection name with an identifier', async () => {
    const { rpc, actions } = setup();

    await expect(actions.refreshTools({})).rejects.toThrow(
      'either connectedAccountId or connectionName + identifier is required'
    );
    await expect(
      actions.refreshTools({ connectionName: 'acme-mcp' })
    ).rejects.toThrow('either connectedAccountId or connectionName');
    await expect(
      actions.refreshTools({ identifier: 'user_123' })
    ).rejects.toThrow('either connectedAccountId or connectionName');
    await expect(
      actions.refreshTools({ connectedAccountId: '  ' })
    ).rejects.toThrow('either connectedAccountId or connectionName');
    expect(rpc.refreshTools).not.toHaveBeenCalled();
  });

  it('rejects a missing account with the documented SDK exception, not a plain Error', async () => {
    const { rpc, actions } = setup();

    for (const params of [
      {},
      { connectionName: 'acme-mcp' },
      { identifier: 'user_123' },
      { connectedAccountId: '  ' },
    ]) {
      const error = await actions.refreshTools(params).catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitValidationError);
      expect(error).toBeInstanceOf(ScalekitException);
      expect(error.retryable).toBe(false);
      expect(error.message).toContain(
        'either connectedAccountId or connectionName + identifier is required'
      );
    }
    expect(rpc.refreshTools).not.toHaveBeenCalled();
  });
});
