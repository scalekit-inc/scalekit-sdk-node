/**
 * Token endpoint client authentication on AgentKit connections
 * (`actions.updateConnection` with `oauth.tokenEndpointAuthMethod`), and the
 * `providerDomain` that gives the host name for `{{domain}}` in the `proxyUrl` of a templated
 * MCP connector when a connection is created (`actions.createConnection`).
 *
 * Offline tests: the gRPC client is mocked, so no environment is needed.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { fromBinary, toBinary } from '@bufbuild/protobuf';
import ActionsClient from '../src/actions';
import ConnectionClient from '../src/connection';
import CoreClient from '../src/core';
import { ScalekitValidationError } from '../src/errors';
import {
  AppOAuthConfig_TokenEndpointAuthMethod,
  CreateAppConnectionRequestSchema,
  UpdateAppConnectionRequestSchema,
} from '../src/pkg/grpc/scalekit/v1/connections/connections_pb';

const core = () =>
  new CoreClient('https://test.scalekit.dev', 'client_id', 'client_secret');

function setup() {
  const rpc = {
    createAppConnection: jest.fn(async (_r: any) => ({
      connection: { id: 'conn_1', connectionName: 'acme-mcp-eu' },
    })),
    updateAppConnection: jest.fn(async (_r: any) => ({
      connection: { id: 'conn_1', connectionName: 'acme-mcp' },
    })),
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

const lastRequest = (fn: jest.Mock) =>
  fn.mock.calls[fn.mock.calls.length - 1][0] as any;

/** The update as it goes over the wire, so a field's presence is what the server sees. */
const updateOnTheWire = (request: any) =>
  fromBinary(
    UpdateAppConnectionRequestSchema,
    toBinary(UpdateAppConnectionRequestSchema, request)
  );

/** The create request as it goes over the wire. */
const createOnTheWire = (request: any) =>
  fromBinary(
    CreateAppConnectionRequestSchema,
    toBinary(CreateAppConnectionRequestSchema, request)
  );

describe('updateConnection with tokenEndpointAuthMethod', () => {
  it.each([
    ['BASIC_AUTH', AppOAuthConfig_TokenEndpointAuthMethod.BASIC_AUTH],
    ['REQUEST_BODY', AppOAuthConfig_TokenEndpointAuthMethod.REQUEST_BODY],
    ['NONE', AppOAuthConfig_TokenEndpointAuthMethod.NONE],
    ['DEFAULT', AppOAuthConfig_TokenEndpointAuthMethod.DEFAULT],
  ] as const)('sends %s', async (name, value) => {
    const { rpc, actions } = setup();

    await actions.updateConnection({
      connectionId: 'conn_1',
      oauth: { tokenEndpointAuthMethod: name },
    });

    const request = updateOnTheWire(lastRequest(rpc.updateAppConnection));
    expect(request.connectionId).toBe('conn_1');
    expect(request.connection?.oauthConfig?.tokenEndpointAuthMethod).toBe(
      value
    );
  });

  it('sends only the setting that is given, so everything else keeps its stored value', async () => {
    const { rpc, actions } = setup();

    await actions.updateConnection({
      connectionId: 'conn_1',
      oauth: { tokenEndpointAuthMethod: 'BASIC_AUTH' },
    });

    const oauthConfig = updateOnTheWire(lastRequest(rpc.updateAppConnection))
      .connection?.oauthConfig;
    expect(oauthConfig?.tokenEndpointAuthMethod).toBe(
      AppOAuthConfig_TokenEndpointAuthMethod.BASIC_AUTH
    );
    expect(oauthConfig?.clientId).toBeUndefined();
    expect(oauthConfig?.clientSecret).toBeUndefined();
    expect(oauthConfig?.useScalekitCreds).toBeUndefined();
    expect(oauthConfig?.scopes).toEqual([]);
  });

  it('leaves the field unset when it is left out, so the stored value is kept', async () => {
    const { rpc, actions } = setup();

    await actions.updateConnection({
      connectionId: 'conn_1',
      oauth: { scopes: ['openid'] },
    });

    const oauthConfig = updateOnTheWire(lastRequest(rpc.updateAppConnection))
      .connection?.oauthConfig;
    expect(oauthConfig?.scopes).toEqual(['openid']);
    expect(oauthConfig?.tokenEndpointAuthMethod).toBeUndefined();
  });

  it.each(['URL_PARAMS', 'client_secret_basic', 'client_secret_post', 'none'])(
    'refuses %s, which is not an AgentKit name, and sends nothing',
    async (name) => {
      const { rpc, actions } = setup();

      const error = await actions
        .updateConnection({
          connectionId: 'conn_1',
          oauth: { tokenEndpointAuthMethod: name as any },
        })
        .catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitValidationError);
      expect(error.message).toContain(
        'NONE, BASIC_AUTH, REQUEST_BODY or DEFAULT'
      );
      expect(rpc.updateAppConnection).not.toHaveBeenCalled();
    }
  );
});

describe('createConnection with providerDomain', () => {
  it('sends the provider and the host name for {{domain}}, and returns the connection', async () => {
    const { rpc, actions } = setup();

    const connection = await actions.createConnection({
      provider: 'ACMEMCP:1234',
      connectionName: 'acme-mcp-eu',
      providerDomain: 'mcp-eu.example.com',
    });

    const sent = createOnTheWire(
      lastRequest(rpc.createAppConnection)
    ).connection;
    expect(sent?.provider).toBe('ACMEMCP:1234');
    expect(sent?.connectionName).toBe('acme-mcp-eu');
    expect(sent?.providerConfigurations?.providerDomain).toBe(
      'mcp-eu.example.com'
    );
    expect(connection.connectionName).toBe('acme-mcp-eu');
  });

  it('sends no provider configurations when no providerDomain is given', async () => {
    const { rpc, actions } = setup();

    await actions.createConnection({ provider: 'ACMEAPI:1234' });

    const sent = createOnTheWire(
      lastRequest(rpc.createAppConnection)
    ).connection;
    expect(sent?.provider).toBe('ACMEAPI:1234');
    expect(sent?.providerConfigurations).toBeUndefined();
  });

  it('takes no OAuth settings: they are set with updateConnection', async () => {
    const { rpc, actions } = setup();

    await actions.createConnection({
      provider: 'ACMEMCP:1234',
      providerDomain: 'mcp-eu.example.com',
      oauth: { tokenEndpointAuthMethod: 'BASIC_AUTH' },
    } as any);

    expect(
      lastRequest(rpc.createAppConnection).connection.oauthConfig
    ).toBeUndefined();
  });
});
