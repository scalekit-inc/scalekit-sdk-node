/**
 * Multi-header API_KEY connectors (SK-3016).
 *
 * A custom connector's API_KEY pattern goes into multiple-headers mode when its
 * credential fields carry `header_name`. The wire format is free-form JSON, so
 * these tests pin that the SDK sends and returns `header_name` untouched, and
 * how a connected account supplies one credential per header.
 */
import { describe, it, expect } from '@jest/globals';
import { create, toJson } from '@bufbuild/protobuf';
import { ListValueSchema } from '@bufbuild/protobuf/wkt';
import ProvidersClient, { AuthPattern } from '../src/providers';
import {
  AuthorizationDetailsSchema,
  UpdateConnectedAccountSchema,
} from '../src/pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

const multiHeaderPattern: AuthPattern = {
  type: 'API_KEY',
  display_name: 'API Key',
  description: 'Two credentials, each sent as its own header',
  fields: [
    {
      field_name: 'x_api_a',
      header_name: 'x_api_a',
      label: 'a',
      input_type: 'text',
    },
    {
      field_name: 'x_api_b',
      header_name: 'X-Api-B',
      label: 'b',
      input_type: 'password',
      required: true,
    },
  ],
};

function makeClient() {
  const requests: any[] = [];
  const grpcConnect: any = {
    createClient: () => ({ createCustomProvider: () => undefined }),
  };
  const coreClient: any = {
    // Echo the provider back, the way the server returns what it stored.
    connectExec: async (_method: unknown, request: any) => {
      requests.push(request);
      return { provider: request.provider };
    },
  };
  return { client: new ProvidersClient(grpcConnect, coreClient), requests };
}

describe('multi-header API_KEY custom provider', () => {
  it('sends header_name on every field of the pattern', async () => {
    const { client, requests } = makeClient();

    await client.createCustomProvider({
      displayName: 'Multi Header',
      proxyUrl: 'https://api.example.com',
      authPatterns: [multiHeaderPattern],
    });

    const sent = toJson(
      ListValueSchema,
      requests[0].provider.authPatterns
    ) as AuthPattern[];
    expect(sent).toHaveLength(1);
    expect(sent[0].fields?.map((f) => f.header_name)).toEqual([
      'x_api_a',
      'X-Api-B',
    ]);
  });

  it('returns header_name on the decoded provider, case preserved', async () => {
    const { client } = makeClient();

    const { provider } = await client.createCustomProvider({
      displayName: 'Multi Header',
      proxyUrl: 'https://api.example.com',
      authPatterns: [multiHeaderPattern],
    });

    const fields = provider?.authPatterns[0].fields ?? [];
    expect(fields.map((f) => [f.field_name, f.header_name])).toEqual([
      ['x_api_a', 'x_api_a'],
      ['x_api_b', 'X-Api-B'],
    ]);
  });

  it('leaves header_name out of a single-key pattern', async () => {
    const { client, requests } = makeClient();

    await client.createCustomProvider({
      displayName: 'Single Key',
      proxyUrl: 'https://api.example.com',
      authPatterns: [
        {
          type: 'API_KEY',
          display_name: 'API Key',
          fields: [{ field_name: 'api_key', input_type: 'password' }],
          auth_header_key_override: 'X-API-Key',
        },
      ],
    });

    const sent = toJson(
      ListValueSchema,
      requests[0].provider.authPatterns
    ) as AuthPattern[];
    expect(sent[0].fields?.[0]).not.toHaveProperty('header_name');
    expect(sent[0].auth_header_key_override).toBe('X-API-Key');
  });
});

describe('multi-header connected account credentials', () => {
  const staticAuth = (details: Record<string, unknown>) => ({
    details: { case: 'staticAuth' as const, value: { details } },
  });

  it('keeps one credential per header under staticAuth.details', () => {
    const message = create(UpdateConnectedAccountSchema, {
      authorizationDetails: staticAuth({
        x_api_a: 'Header1',
        x_api_b: 'header 2',
      }),
    } as any);

    const json = toJson(
      AuthorizationDetailsSchema,
      message.authorizationDetails!
    );
    expect(json).toEqual({
      staticAuth: { details: { x_api_a: 'Header1', x_api_b: 'header 2' } },
    });
  });

  it('drops the snake_case { static_auth } shape instead of sending it', () => {
    // Pitfall: create() ignores unknown keys, so this sends no credentials and
    // raises no error. Pass { details: { case: 'staticAuth', value: ... } }.
    const message = create(UpdateConnectedAccountSchema, {
      authorizationDetails: { static_auth: { x_api_a: 'ignored' } },
    } as any);

    const json = toJson(
      AuthorizationDetailsSchema,
      message.authorizationDetails!
    );
    expect(json).toEqual({});
  });
});
