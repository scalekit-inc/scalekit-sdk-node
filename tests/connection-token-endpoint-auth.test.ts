/**
 * Token endpoint client authentication on environment connections
 * (`tokenEndpointAuthType`, and the deprecated text field it replaces), and the
 * `context` that resolves a templated `proxyUrl` when a connection is created.
 *
 * Offline tests: the gRPC client is mocked, so no environment is needed.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import ConnectionClient from '../src/connection';
import CoreClient from '../src/core';
import { ConnectionType, TokenAuthType } from '../src/index';
import {
  ConnectionSchema,
  type CreateConnectionResponse,
  UpdateEnvironmentConnectionRequestSchema,
} from '../src/pkg/grpc/scalekit/v1/connections/connections_pb';

const core = () =>
  new CoreClient('https://test.scalekit.dev', 'client_id', 'client_secret');

function setup() {
  const rpc = {
    updateEnvironmentConnection: jest.fn(async (_r: any) => ({
      connection: { id: 'conn_1' },
    })),
    createEnvironmentConnection: jest.fn(
      async (_r: any): Promise<Partial<CreateConnectionResponse>> => ({
        connection: create(ConnectionSchema, {
          id: 'conn_1',
          keyId: 'acme-mcp-eu',
          resolvedProxyUrl: 'https://mcp-eu.example.com/mcp',
        }),
      })
    ),
  };
  const client = new ConnectionClient(
    { createClient: () => rpc } as any,
    core()
  );
  return { rpc, client };
}

const lastRequest = (fn: jest.Mock) =>
  fn.mock.calls[fn.mock.calls.length - 1][0] as any;

/** The request as it goes over the wire, so a field's presence is what the server sees. */
const onTheWire = (request: any) =>
  fromBinary(
    UpdateEnvironmentConnectionRequestSchema,
    toBinary(UpdateEnvironmentConnectionRequestSchema, request)
  );

const oauth = (value: Record<string, unknown>) => ({
  type: ConnectionType.OAUTH,
  providerKey: 'ACMEAPI:1234',
  keyId: 'acme-api',
  settings: { case: 'oauthConfig' as const, value },
});

describe('TokenAuthType', () => {
  it('is exported with the values the API defines', () => {
    expect(TokenAuthType.TOKEN_AUTH_TYPE_UNSPECIFIED).toBe(0);
    expect(TokenAuthType.URL_PARAMS).toBe(1);
    expect(TokenAuthType.BASIC_AUTH).toBe(2);
    expect(TokenAuthType.NONE).toBe(3);
  });
});

describe('updateEnvironmentConnection with tokenEndpointAuthType', () => {
  it.each([
    ['BASIC_AUTH', TokenAuthType.BASIC_AUTH],
    ['URL_PARAMS', TokenAuthType.URL_PARAMS],
    ['NONE', TokenAuthType.NONE],
  ])('sends %s', async (_name, value) => {
    const { rpc, client } = setup();

    await client.updateEnvironmentConnection(
      'conn_1',
      oauth({ tokenEndpointAuthType: value })
    );

    const request = onTheWire(lastRequest(rpc.updateEnvironmentConnection));
    expect(request.connectionId).toBe('conn_1');
    const settings = request.connection?.settings;
    expect(settings?.case).toBe('oauthConfig');
    expect(
      settings?.case === 'oauthConfig' && settings.value.tokenEndpointAuthType
    ).toBe(value);
  });

  it('sends an explicit reset to the default as a set field', async () => {
    const { rpc, client } = setup();

    await client.updateEnvironmentConnection(
      'conn_1',
      oauth({
        tokenEndpointAuthType: TokenAuthType.TOKEN_AUTH_TYPE_UNSPECIFIED,
      })
    );

    const settings = onTheWire(lastRequest(rpc.updateEnvironmentConnection))
      .connection?.settings;
    expect(
      settings?.case === 'oauthConfig' && settings.value.tokenEndpointAuthType
    ).toBe(TokenAuthType.TOKEN_AUTH_TYPE_UNSPECIFIED);
  });

  it('leaves the field unset when it is left out, so the stored value is kept', async () => {
    const { rpc, client } = setup();

    await client.updateEnvironmentConnection(
      'conn_1',
      oauth({ scopes: ['openid'] })
    );

    const settings = onTheWire(lastRequest(rpc.updateEnvironmentConnection))
      .connection?.settings;
    expect(
      settings?.case === 'oauthConfig' && settings.value.tokenEndpointAuthType
    ).toBeUndefined();
    expect(
      settings?.case === 'oauthConfig' && settings.value.tokenEndpointAuthMethod
    ).toBeUndefined();
  });

  it('still sends the deprecated text form', async () => {
    const { rpc, client } = setup();

    await client.updateEnvironmentConnection(
      'conn_1',
      oauth({ tokenEndpointAuthMethod: 'client_secret_basic' })
    );

    const settings = onTheWire(lastRequest(rpc.updateEnvironmentConnection))
      .connection?.settings;
    expect(
      settings?.case === 'oauthConfig' && settings.value.tokenEndpointAuthMethod
    ).toBe('client_secret_basic');
  });
});

describe('createEnvironmentConnection with context', () => {
  it('sends domain and version, and returns the resolved proxy URL', async () => {
    const { rpc, client } = setup();

    const { connection } = await client.createEnvironmentConnection(
      {
        providerKey: 'ACMEMCP:1234',
        type: ConnectionType.OAUTH,
        keyId: 'acme-mcp-eu',
        context: { domain: 'mcp-eu.example.com', version: 'v2' },
      },
      { isApp: true }
    );

    const request = lastRequest(rpc.createEnvironmentConnection);
    expect(request.connection.context).toEqual({
      domain: 'mcp-eu.example.com',
      version: 'v2',
    });
    expect(request.flags.isApp).toBe(true);
    expect(connection?.resolvedProxyUrl).toBe('https://mcp-eu.example.com/mcp');
  });

  it('sends no context when none is given', async () => {
    const { rpc, client } = setup();

    await client.createEnvironmentConnection({
      providerKey: 'ACMEAPI:1234',
      type: ConnectionType.OAUTH,
    });

    expect(
      lastRequest(rpc.createEnvironmentConnection).connection.context
    ).toBeUndefined();
  });
});
