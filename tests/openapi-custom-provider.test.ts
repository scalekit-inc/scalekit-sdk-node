/**
 * Custom connectors created from an OpenAPI spec, and credential placement.
 *
 * Offline tests: the gRPC client is mocked, so no environment is needed. They
 * pin what the SDK sends for `openapiSpecUrl` and `proxyUrl` (the backend decides
 * what is valid), what it returns, and that a connector read from
 * `listProviders` can be sent back to `updateCustomProvider` unchanged.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import { create, fromJson, toJson } from '@bufbuild/protobuf';
import { ListValueSchema } from '@bufbuild/protobuf/wkt';
import ProvidersClient, { type AuthPattern } from '../src/providers';
import CoreClient from '../src/core';
import {
  ScalekitBadRequestException,
  ScalekitConflictException,
} from '../src/errors';
import { ErrorInfoSchema } from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import {
  ProviderSchema,
  ProviderType,
} from '../src/pkg/grpc/scalekit/v1/providers/providers_pb';

const SPEC_URL = 'https://api.example.com/openapi.json';

const core = () =>
  new CoreClient('https://test.scalekit.dev', 'client_id', 'client_secret');

const bearer: AuthPattern = {
  type: 'BEARER',
  display_name: 'Bearer Token',
  fields: [{ field_name: 'token', label: 'Token', input_type: 'password' }],
};

/** A provider as the server returns one for a connector created from a spec. */
function openApiProvider(overrides: Record<string, unknown> = {}) {
  return create(ProviderSchema, {
    id: 'prvd_1',
    identifier: 'ACMEAPI:1234',
    displayName: 'Acme API',
    proxyUrl: '',
    proxyEnabled: true,
    isCustom: true,
    isCustomMcp: false,
    openapiSpecUrl: SPEC_URL,
    authPatterns: fromJson(ListValueSchema, [
      { ...bearer, is_open_api: true },
    ] as any),
    ...overrides,
  });
}

function setup() {
  const rpc = {
    createCustomProvider: jest.fn(async (_r: any) => ({
      provider: openApiProvider(),
    })),
    updateCustomProvider: jest.fn(async (_r: any) => ({
      provider: openApiProvider(),
    })),
    listProviders: jest.fn(async (_r: any) => ({
      providers: [openApiProvider({ proxyUrl: 'https://api.example.com/v1' })],
      nextPageToken: '',
      prevPageToken: '',
      totalSize: 1,
    })),
  };
  const client = new ProvidersClient(
    { createClient: () => rpc } as any,
    core()
  );
  return { rpc, client };
}

const lastRequest = (fn: jest.Mock) =>
  fn.mock.calls[fn.mock.calls.length - 1][0] as any;

describe('createCustomProvider with openapiSpecUrl', () => {
  it('sends the spec URL and leaves proxyUrl empty', async () => {
    const { rpc, client } = setup();

    await client.createCustomProvider({
      displayName: 'Acme API',
      openapiSpecUrl: SPEC_URL,
      authPatterns: [bearer],
    });

    const sent = lastRequest(rpc.createCustomProvider).provider;
    expect(sent.openapiSpecUrl).toBe(SPEC_URL);
    expect(sent.proxyUrl).toBe('');
    expect(sent.displayName).toBe('Acme API');
    expect(sent.proxyEnabled).toBe(true);
  });

  it('still sends proxyUrl alone for an MCP connector', async () => {
    const { rpc, client } = setup();

    await client.createCustomProvider({
      displayName: 'Acme MCP',
      proxyUrl: 'https://mcp.example.com/mcp',
      authPatterns: [bearer],
    });

    const sent = lastRequest(rpc.createCustomProvider).provider;
    expect(sent.proxyUrl).toBe('https://mcp.example.com/mcp');
    expect(sent.openapiSpecUrl).toBe('');
  });

  it('sends both when a JavaScript caller sets both, so the server rejects it', async () => {
    const { rpc, client } = setup();

    await client.createCustomProvider({
      displayName: 'Acme API',
      proxyUrl: 'https://api.example.com',
      openapiSpecUrl: SPEC_URL,
    } as any);

    const sent = lastRequest(rpc.createCustomProvider).provider;
    expect(sent.proxyUrl).toBe('https://api.example.com');
    expect(sent.openapiSpecUrl).toBe(SPEC_URL);
  });

  it('sends neither when a JavaScript caller sets neither, so the server rejects it', async () => {
    const { rpc, client } = setup();

    await client.createCustomProvider({ displayName: 'Acme API' } as any);

    const sent = lastRequest(rpc.createCustomProvider).provider;
    expect(sent.proxyUrl).toBe('');
    expect(sent.openapiSpecUrl).toBe('');
  });

  it('returns openapiSpecUrl and the server-set is_open_api flag', async () => {
    const { client } = setup();

    const { provider } = await client.createCustomProvider({
      displayName: 'Acme API',
      openapiSpecUrl: SPEC_URL,
      authPatterns: [bearer],
    });

    expect(provider?.openapiSpecUrl).toBe(SPEC_URL);
    expect(provider?.proxyUrl).toBe('');
    expect(provider?.isCustom).toBe(true);
    expect(provider?.isCustomMcp).toBe(false);
    expect(provider?.authPatterns[0].is_open_api).toBe(true);
  });

  it('surfaces a validation failure as a bad request with its error code', async () => {
    const { rpc, client } = setup();
    rpc.createCustomProvider.mockRejectedValueOnce(
      new ConnectError(
        'openapi_spec_url failed validation: the URL could not be reached',
        Code.InvalidArgument,
        undefined,
        [{ desc: ErrorInfoSchema, value: { errorCode: 'INVALID_ARGUMENT' } }]
      )
    );

    const error = await client
      .createCustomProvider({
        displayName: 'Acme API',
        openapiSpecUrl: SPEC_URL,
      })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitBadRequestException);
    expect(error.errorCode).toBe('INVALID_ARGUMENT');
    expect(error.message).toContain('openapi_spec_url failed validation');
  });

  it('surfaces a feature that is not enabled as a bad request with its error code', async () => {
    const { rpc, client } = setup();
    rpc.createCustomProvider.mockRejectedValueOnce(
      new ConnectError(
        'OpenAPI-sourced connectors are not enabled for this environment',
        Code.InvalidArgument,
        undefined,
        [{ desc: ErrorInfoSchema, value: { errorCode: 'FEATURE_NOT_ENABLED' } }]
      )
    );

    const error = await client
      .createCustomProvider({
        displayName: 'Acme API',
        openapiSpecUrl: SPEC_URL,
      })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitBadRequestException);
    expect(error.errorCode).toBe('FEATURE_NOT_ENABLED');
  });

  it('surfaces a duplicate name as a conflict', async () => {
    const { rpc, client } = setup();
    rpc.createCustomProvider.mockRejectedValueOnce(
      new ConnectError(
        'an OpenAPI connector named "ACMEAPI" already exists in this environment',
        Code.AlreadyExists,
        undefined,
        [
          {
            desc: ErrorInfoSchema,
            value: { errorCode: 'RESOURCE_ALREADY_EXISTS' },
          },
        ]
      )
    );

    const error = await client
      .createCustomProvider({
        displayName: 'Acme API',
        openapiSpecUrl: SPEC_URL,
      })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitConflictException);
    expect(error.errorCode).toBe('RESOURCE_ALREADY_EXISTS');
  });
});

describe('updateCustomProvider for an OpenAPI-sourced connector', () => {
  it('can leave proxyUrl and openapiSpecUrl out', async () => {
    const { rpc, client } = setup();

    await client.updateCustomProvider({
      identifier: 'ACMEAPI:1234',
      displayName: 'Acme API v2',
      authPatterns: [{ ...bearer, is_open_api: true }],
    });

    const request = lastRequest(rpc.updateCustomProvider);
    expect(request.identifier).toBe('ACMEAPI:1234');
    expect(request.provider.displayName).toBe('Acme API v2');
    expect(request.provider.proxyUrl).toBe('');
    expect(request.provider.openapiSpecUrl).toBe('');
    // Always sent, as before: an unset proxy_enabled would switch proxying off.
    expect(request.provider.proxyEnabled).toBe(true);
  });

  it('sends a new base URL and a spec URL when given', async () => {
    const { rpc, client } = setup();

    await client.updateCustomProvider({
      identifier: 'ACMEAPI:1234',
      displayName: 'Acme API',
      proxyUrl: 'https://eu.api.example.com/v1',
      openapiSpecUrl: 'https://api.example.com/v2/openapi.json',
      authPatterns: [bearer],
    });

    const sent = lastRequest(rpc.updateCustomProvider).provider;
    expect(sent.proxyUrl).toBe('https://eu.api.example.com/v1');
    expect(sent.openapiSpecUrl).toBe('https://api.example.com/v2/openapi.json');
  });

  it('keeps proxyEnabled false when the stored value is passed back', async () => {
    const { rpc, client } = setup();

    await client.updateCustomProvider({
      identifier: 'ACMEAPI:1234',
      displayName: 'Acme API',
      authPatterns: [bearer],
      proxyEnabled: false,
    });

    expect(lastRequest(rpc.updateCustomProvider).provider.proxyEnabled).toBe(
      false
    );
  });

  it('sends back the patterns listProviders returned, is_open_api included', async () => {
    const { rpc, client } = setup();

    const { providers } = await client.listProviders({
      providerType: ProviderType.CUSTOM,
    });
    const current = providers[0];
    await client.updateCustomProvider({
      identifier: current.identifier,
      displayName: current.displayName,
      proxyUrl: current.proxyUrl,
      openapiSpecUrl: current.openapiSpecUrl,
      authPatterns: current.authPatterns,
      proxyEnabled: current.proxyEnabled,
    });

    const sent = lastRequest(rpc.updateCustomProvider).provider;
    expect(toJson(ListValueSchema, sent.authPatterns)).toEqual([
      { ...bearer, is_open_api: true },
    ]);
    expect(sent.openapiSpecUrl).toBe(SPEC_URL);
    expect(sent.proxyUrl).toBe('https://api.example.com/v1');
  });

  it('surfaces a run already in progress as a conflict', async () => {
    const { rpc, client } = setup();
    rpc.updateCustomProvider.mockRejectedValueOnce(
      new ConnectError(
        'base_url was saved, but an ingestion run is already in progress for this connector',
        Code.AlreadyExists,
        undefined,
        [
          {
            desc: ErrorInfoSchema,
            value: { errorCode: 'RESOURCE_ALREADY_EXISTS' },
          },
        ]
      )
    );

    const error = await client
      .updateCustomProvider({
        identifier: 'ACMEAPI:1234',
        displayName: 'Acme API',
        proxyUrl: 'https://eu.api.example.com/v1',
        authPatterns: [bearer],
      })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitConflictException);
    expect(error.message).toContain('was saved');
  });
});

describe('credential placement', () => {
  const placedApiKey: AuthPattern = {
    type: 'API_KEY',
    display_name: 'API Key',
    fields: [
      {
        field_name: 'api_key',
        label: 'API Key',
        input_type: 'password',
        required: true,
        placement: { in: 'query', name: 'token' },
      },
    ],
  };

  it('sends placement on the credential field', async () => {
    const { rpc, client } = setup();

    await client.createCustomProvider({
      displayName: 'Acme Query Key',
      proxyUrl: 'https://api.example.com',
      authPatterns: [placedApiKey],
    });

    const sent = toJson(
      ListValueSchema,
      lastRequest(rpc.createCustomProvider).provider.authPatterns
    ) as AuthPattern[];
    expect(sent[0].fields?.[0].placement).toEqual({
      in: 'query',
      name: 'token',
    });
    expect(sent[0].fields?.[0]).not.toHaveProperty('header_name');
  });

  it('sends a path placement together with the placeholder in proxyUrl', async () => {
    const { rpc, client } = setup();

    await client.createCustomProvider({
      displayName: 'Acme Bot',
      proxyUrl: 'https://api.example.com/bot{{bot_token}}',
      authPatterns: [
        {
          type: 'BEARER',
          display_name: 'Bot token',
          fields: [
            {
              field_name: 'token',
              input_type: 'password',
              placement: { in: 'path', name: 'bot_token' },
            },
          ],
        },
      ],
    });

    const sent = lastRequest(rpc.createCustomProvider).provider;
    expect(sent.proxyUrl).toBe('https://api.example.com/bot{{bot_token}}');
    const patterns = toJson(
      ListValueSchema,
      sent.authPatterns
    ) as AuthPattern[];
    expect(patterns[0].fields?.[0].placement).toEqual({
      in: 'path',
      name: 'bot_token',
    });
  });

  it('sends the placement of both Basic credentials', async () => {
    const { rpc, client } = setup();

    await client.createCustomProvider({
      displayName: 'Acme Basic',
      proxyUrl: 'https://api.example.com',
      authPatterns: [
        {
          type: 'BASIC',
          display_name: 'Basic',
          fields: [
            {
              field_name: 'username',
              input_type: 'text',
              placement: { in: 'body', name: 'user' },
            },
            {
              field_name: 'password',
              input_type: 'password',
              placement: { in: 'body', name: 'pass' },
            },
          ],
        },
      ],
    });

    const patterns = toJson(
      ListValueSchema,
      lastRequest(rpc.createCustomProvider).provider.authPatterns
    ) as AuthPattern[];
    expect(patterns[0].fields?.map((f) => f.placement)).toEqual([
      { in: 'body', name: 'user' },
      { in: 'body', name: 'pass' },
    ]);
  });

  it('returns placement on the decoded provider', async () => {
    const { rpc, client } = setup();
    rpc.createCustomProvider.mockResolvedValueOnce({
      provider: openApiProvider({
        openapiSpecUrl: '',
        proxyUrl: 'https://api.example.com',
        authPatterns: fromJson(ListValueSchema, [placedApiKey as any]),
      }),
    });

    const { provider } = await client.createCustomProvider({
      displayName: 'Acme Query Key',
      proxyUrl: 'https://api.example.com',
      authPatterns: [placedApiKey],
    });

    expect(provider?.authPatterns[0].fields?.[0].placement).toEqual({
      in: 'query',
      name: 'token',
    });
  });

  it('surfaces a rejected placement as a bad request', async () => {
    const { rpc, client } = setup();
    rpc.createCustomProvider.mockRejectedValueOnce(
      new ConnectError(
        'invalid credential placement: field "api_key": a placed credential must use input_type "password"',
        Code.InvalidArgument,
        undefined,
        [{ desc: ErrorInfoSchema, value: { errorCode: 'INVALID_ARGUMENT' } }]
      )
    );

    const error = await client
      .createCustomProvider({
        displayName: 'Acme Query Key',
        proxyUrl: 'https://api.example.com',
        authPatterns: [placedApiKey],
      })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitBadRequestException);
    expect(error.message).toContain('invalid credential placement');
  });
});
