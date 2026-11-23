/**
 * Offline tests for the AgentKit connection methods on `actions` and for
 * `toolExposure` on the MCP client. The gRPC client is mocked; no environment is needed.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import { create } from '@bufbuild/protobuf';
import { ErrorInfoSchema } from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import ActionsClient from '../src/actions';
import ConnectionClient from '../src/connection';
import CoreClient from '../src/core';
import McpClient from '../src/mcp';
import {
  ScalekitAgentKitConnectionError,
  ScalekitServerException,
  ScalekitValidationError,
} from '../src/errors';
import { toAgentKitConnectionError } from '../src/errors/agentkit-connection-exceptions';
import {
  AppOAuthConfig_TokenEndpointAuthMethod,
  ConnectionAuthMode,
} from '../src/pkg/grpc/scalekit/v1/connections/connections_pb';
import { ToolExposure } from '../src/pkg/grpc/scalekit/v1/mcp/mcp_pb';

const core = () =>
  new CoreClient('https://test.scalekit.dev', 'client_id', 'client_secret');

function setup() {
  const rpc = {
    createAppConnection: jest.fn(async (_r: any) => ({
      connection: { id: 'conn_1', connectionName: 'gmail' },
    })),
    getAppConnection: jest.fn(async (_r: any) => ({
      connection: { id: 'conn_42', connectionName: 'gmail-work' },
    })),
    listAppConnectionSummaries: jest.fn(async (_r: any) => ({
      connections: [],
      nextPageToken: '',
    })),
    updateAppConnection: jest.fn(async (_r: any) => ({
      connection: { id: 'conn_42' },
    })),
    deleteEnvironmentConnection: jest.fn(async (_r: any) => ({})),
  };
  const connection = new ConnectionClient(
    { createClient: () => rpc } as any,
    core()
  );
  const actions = new ActionsClient(
    {} as any,
    {} as any,
    core(),
    connection,
    {} as any,
    {} as any
  );
  return { rpc, actions };
}

const lastCall = (fn: jest.Mock) =>
  fn.mock.calls[fn.mock.calls.length - 1][0] as any;

describe('createConnection', () => {
  it('sends provider, name, auth mode and provider domain', async () => {
    const { rpc, actions } = setup();
    await actions.createConnection({
      provider: '  MIXPANELMCP ',
      connectionName: 'mixpanel-eu',
      authMode: 'ORG_WIDE',
      providerDomain: 'mcp-eu.mixpanel.com',
    });
    const conn = lastCall(rpc.createAppConnection).connection;
    expect(conn.provider).toBe('MIXPANELMCP');
    expect(conn.connectionName).toBe('mixpanel-eu');
    expect(conn.authMode).toBe(ConnectionAuthMode.ORG_WIDE);
    expect(conn.providerConfigurations.providerDomain).toBe(
      'mcp-eu.mixpanel.com'
    );
  });

  it('sends only the provider when nothing else is given', async () => {
    const { rpc, actions } = setup();
    await actions.createConnection({ provider: 'GMAIL' });
    const conn = lastCall(rpc.createAppConnection).connection;
    expect(conn.connectionName).toBeUndefined();
    expect(conn.authMode).toBeUndefined();
    expect(conn.providerConfigurations).toBeUndefined();
  });

  it('rejects a blank provider or bad auth mode before sending', async () => {
    const { rpc, actions } = setup();
    await expect(
      actions.createConnection({ provider: ' ' })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    await expect(
      actions.createConnection({ provider: 'GMAIL', authMode: 'ALL' as any })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    expect(rpc.createAppConnection).not.toHaveBeenCalled();
  });
});

describe('getConnection and listAppConnections', () => {
  it('gets by name or id through one identifier', async () => {
    const { rpc, actions } = setup();
    await actions.getConnection('Gmail-Work');
    expect(lastCall(rpc.getAppConnection).connectionIdentifier).toBe(
      'Gmail-Work'
    );
    await actions.getConnection({ connectionId: 'conn_42' });
    expect(lastCall(rpc.getAppConnection).connectionIdentifier).toBe('conn_42');
    await expect(actions.getConnection({})).rejects.toBeInstanceOf(
      ScalekitValidationError
    );
  });

  it('lists with filters and checks the query length', async () => {
    const { rpc, actions } = setup();
    await actions.listAppConnections({
      provider: 'GMAIL',
      query: 'work',
      pageSize: 50,
      pageToken: 'next',
    });
    expect(lastCall(rpc.listAppConnectionSummaries)).toMatchObject({
      provider: 'GMAIL',
      query: 'work',
      pageSize: 50,
      pageToken: 'next',
    });
    await expect(
      actions.listAppConnections({ query: 'ab' })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
  });
});

describe('updateConnection', () => {
  it('sends a partial merge with no update mask', async () => {
    const { rpc, actions } = setup();
    await actions.updateConnection({
      connectionId: 'conn_42',
      oauth: { clientId: 'id', scopes: ['a', 'b'], prompt: 'consent' },
    });
    const req = lastCall(rpc.updateAppConnection);
    expect(req.connectionId).toBe('conn_42');
    expect(req.connection.googleDwdConfig).toBeUndefined();
    expect(req.connection.oauthConfig).toMatchObject({
      clientId: 'id',
      scopes: ['a', 'b'],
      prompt: 'consent',
    });
    expect(req.updateMask).toBeUndefined();
    expect(rpc.getAppConnection).not.toHaveBeenCalled();
  });

  it('names every list or map passed empty in the update mask', async () => {
    const { rpc, actions } = setup();
    await actions.updateConnection({
      connectionId: 'conn_42',
      oauth: {
        scopes: [],
        requiredScopes: [],
        requiredOptionalScopes: [],
        optionalScopes: { scopes: [] },
        extraAuthorizeParams: {},
      },
    });
    expect(lastCall(rpc.updateAppConnection).updateMask.paths.sort()).toEqual([
      'oauth_config.extra_authorize_params',
      'oauth_config.optional_scopes.scopes',
      'oauth_config.required_optional_scopes',
      'oauth_config.required_scopes',
      'oauth_config.scopes',
    ]);
  });

  it('does not put non-empty lists in the mask, and clears Google DWD scopes', async () => {
    const { rpc, actions } = setup();
    await actions.updateConnection({
      connectionId: 'conn_42',
      googleDwd: { scopes: [], requiredScopes: ['x'] },
    });
    expect(lastCall(rpc.updateAppConnection).updateMask.paths).toEqual([
      'google_dwd_config.scopes',
    ]);
  });

  it('maps tokenEndpointAuthMethod and provider configurations', async () => {
    const { rpc, actions } = setup();
    await actions.updateConnection({
      connectionId: 'conn_42',
      oauth: { tokenEndpointAuthMethod: 'DEFAULT' },
      providerConfigurations: { slackConnectionType: 'BOT' },
      newConnectionName: 'renamed',
    });
    const req = lastCall(rpc.updateAppConnection);
    expect(req.connection.oauthConfig.tokenEndpointAuthMethod).toBe(
      AppOAuthConfig_TokenEndpointAuthMethod.DEFAULT
    );
    expect(req.connection.providerConfigurations.slackConnectionType).toBe(
      'BOT'
    );
    expect(req.connection.connectionName).toBe('renamed');
    await expect(
      actions.updateConnection({
        connectionId: 'conn_42',
        oauth: { tokenEndpointAuthMethod: 'private_key_jwt' as any },
      })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
  });

  it('resolves a name to its id with one read first', async () => {
    const { rpc, actions } = setup();
    await actions.updateConnection({
      connectionName: 'gmail-work',
      oauth: { clientId: 'x' },
    });
    expect(lastCall(rpc.getAppConnection).connectionIdentifier).toBe(
      'gmail-work'
    );
    expect(lastCall(rpc.updateAppConnection).connectionId).toBe('conn_42');
  });

  it('rejects bad arguments before sending anything', async () => {
    const { rpc, actions } = setup();
    const bad: any[] = [
      { connectionId: 'conn_42' },
      { connectionId: 'conn_42', oauth: {}, googleDwd: {} },
      { connectionId: 'not-an-id', oauth: { clientId: 'x' } },
      { oauth: { clientId: 'x' } },
      { connectionId: 'conn_42', connectionName: 'a', oauth: {} },
    ];
    for (const params of bad) {
      await expect(actions.updateConnection(params)).rejects.toBeInstanceOf(
        ScalekitValidationError
      );
    }
    expect(rpc.updateAppConnection).not.toHaveBeenCalled();
    expect(rpc.getAppConnection).not.toHaveBeenCalled();
  });
});

describe('updateConnection with null settings', () => {
  it('treats null like an omitted setting and sends nothing', async () => {
    const { rpc, actions } = setup();
    await expect(
      actions.updateConnection({ connectionId: 'conn_42', oauth: null as any })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    await expect(
      actions.updateConnection({
        connectionId: 'conn_42',
        oauth: null as any,
        googleDwd: null as any,
        providerConfigurations: null as any,
        newConnectionName: null as any,
      })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    expect(rpc.updateAppConnection).not.toHaveBeenCalled();
  });

  it('still sends the other settings when one group is null', async () => {
    const { rpc, actions } = setup();
    await actions.updateConnection({
      connectionId: 'conn_42',
      oauth: null as any,
      newConnectionName: 'renamed',
    });
    const request = lastCall(rpc.updateAppConnection);
    expect(request.connection.connectionName).toBe('renamed');
    expect(request.connection.oauthConfig).toBeUndefined();
  });
});

describe('deleteConnection', () => {
  it('takes a name or an id, and only a name costs a lookup', async () => {
    const { rpc, actions } = setup();

    await actions.deleteConnection('conn_7');
    expect(lastCall(rpc.deleteEnvironmentConnection).connectionId).toBe(
      'conn_7'
    );
    await actions.deleteConnection({ connectionId: 'conn_8' });
    expect(lastCall(rpc.deleteEnvironmentConnection).connectionId).toBe(
      'conn_8'
    );
    expect(rpc.getAppConnection).not.toHaveBeenCalled();

    await actions.deleteConnection('gmail-work');
    expect(lastCall(rpc.getAppConnection).connectionIdentifier).toBe(
      'gmail-work'
    );
    expect(lastCall(rpc.deleteEnvironmentConnection).connectionId).toBe(
      'conn_42'
    );
    await actions.deleteConnection({ connectionName: 'gmail-work' });
    expect(lastCall(rpc.deleteEnvironmentConnection).connectionId).toBe(
      'conn_42'
    );
  });

  it('rejects a malformed connectionId before sending', async () => {
    const { rpc, actions } = setup();
    await expect(
      actions.deleteConnection({ connectionId: 'gmail' })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    expect(rpc.deleteEnvironmentConnection).not.toHaveBeenCalled();
  });
});

describe('errors', () => {
  it('maps server errors to a code and keeps the original as cause', async () => {
    const { rpc, actions } = setup();
    rpc.getAppConnection.mockRejectedValueOnce(
      new ConnectError('connection not found', Code.NotFound)
    );
    const err: any = await actions.getConnection('nope').catch((e) => e);
    expect(err).toBeInstanceOf(ScalekitAgentKitConnectionError);
    expect(err.code).toBe('CONNECTION_NOT_FOUND');
    expect(err.cause).toBeInstanceOf(ScalekitServerException);
  });

  it.each([
    [
      Code.InvalidArgument,
      'connector "X" not found; use an identifier',
      'PROVIDER_NOT_FOUND',
    ],
    [
      Code.InvalidArgument,
      'connector "X" has several auth types configured.',
      'AMBIGUOUS_AUTH_TYPE',
    ],
    [
      Code.InvalidArgument,
      'connection_name "x" is reserved',
      'CONNECTION_NAME_CONFLICT',
    ],
    [Code.InvalidArgument, 'must not be empty', 'INVALID_CONFIGURATION'],
    [Code.PermissionDenied, 'denied', 'NOT_AUTHORIZED'],
    [
      Code.FailedPrecondition,
      'connection has connected accounts',
      'CONNECTION_IN_USE',
    ],
  ])('maps %s "%s" to %s', (code, message, expected) => {
    const server = ScalekitServerException.promote(
      new ConnectError(message, code)
    );
    const err: any = toAgentKitConnectionError(server, 'write');
    expect(err.code).toBe(expected);
  });

  it('reports an unanswered write as an unknown outcome', () => {
    const server = ScalekitServerException.promote(
      new ConnectError('down', Code.Unavailable)
    );
    const err: any = toAgentKitConnectionError(server, 'write');
    expect(err.code).toBe('OUTCOME_UNKNOWN');
    expect(err.retryable).toBe(true);
  });

  it.each(['toString', 'constructor', '__proto__'])(
    'rejects the inherited name %s as an authMode or token auth method before any request',
    async (name) => {
      const { rpc, actions } = setup();
      await expect(
        actions.createConnection({ provider: 'gmail', authMode: name as any })
      ).rejects.toThrow(ScalekitValidationError);
      await expect(
        actions.updateConnection({
          connectionId: 'conn_1',
          oauth: { tokenEndpointAuthMethod: name as any },
        })
      ).rejects.toThrow(ScalekitValidationError);
      expect(rpc.createAppConnection).not.toHaveBeenCalled();
      expect(rpc.updateAppConnection).not.toHaveBeenCalled();
    }
  );

  it('adds the field violations to a generic validation error', () => {
    const info = create(ErrorInfoSchema, {
      errorCode: 'INVALID_ARGUMENT',
      validationErrorInfo: {
        fieldViolations: [
          {
            field: 'connection.provider_configurations.slack_connection_type',
            description: 'must be in list [BOT, USER]',
            constraint: 'string.in',
          },
        ],
      },
    });
    const server = ScalekitServerException.promote(
      new ConnectError('Validation error', Code.InvalidArgument, undefined, [
        { desc: ErrorInfoSchema, value: info },
      ])
    );
    const err: any = toAgentKitConnectionError(server, 'write');
    expect(err.code).toBe('INVALID_CONFIGURATION');
    expect(err.message).toContain(
      'provider_configurations.slack_connection_type: must be in list [BOT, USER]'
    );
    expect(err.message).not.toContain('connection.provider_configurations');
  });

  it('leaves non-server errors unchanged', () => {
    const plain = new Error('boom');
    expect(toAgentKitConnectionError(plain, 'read')).toBe(plain);
  });
});

describe('McpClient toolExposure', () => {
  function makeMcp() {
    const rpc = {
      createMcpConfig: jest.fn(async (_r: any) => ({})),
      updateMcpConfig: jest.fn(async (_r: any) => ({})),
    };
    return {
      rpc,
      mcp: new McpClient({ createClient: () => rpc } as any, core()),
    };
  }

  it('sends META on create and leaves it unset otherwise', async () => {
    const { rpc, mcp } = makeMcp();
    await mcp.createConfig({ name: 'a', toolExposure: 'META' });
    expect(lastCall(rpc.createMcpConfig).config.toolExposure).toBe(
      ToolExposure.META
    );
    await mcp.createConfig({ name: 'b' });
    expect(lastCall(rpc.createMcpConfig).config.toolExposure).toBeUndefined();
  });

  it('sends the mode on update only when given', async () => {
    const { rpc, mcp } = makeMcp();
    await mcp.updateConfig({ configId: 'cfg_1', toolExposure: 'DIRECT' });
    expect(lastCall(rpc.updateMcpConfig).toolExposure).toBe(
      ToolExposure.DIRECT
    );
    await mcp.updateConfig({ configId: 'cfg_1', description: 'd' });
    expect(lastCall(rpc.updateMcpConfig).toolExposure).toBeUndefined();
  });

  it('rejects an unknown mode before sending', async () => {
    const { rpc, mcp } = makeMcp();
    await expect(
      mcp.createConfig({ name: 'a', toolExposure: 'ALL' as any })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    expect(rpc.createMcpConfig).not.toHaveBeenCalled();
  });
});
