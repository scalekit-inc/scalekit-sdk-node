/**
 * `source` (`ConnectorSource`) on createCustomProvider and updateCustomProvider.
 *
 * `is_mcp` on an AuthPattern is deprecated but still works and is still sent, so
 * existing calls build the same request they always did. A request-level
 * `source: ConnectorSource.MCP_SERVER` marks the pattern as MCP without changing
 * the caller's object, and a value that contradicts the pattern's throws before
 * any request is made.
 *
 * Offline: the gRPC client is a mock, so no test here needs the network.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { toJson } from '@bufbuild/protobuf';
import { ListValueSchema } from '@bufbuild/protobuf/wkt';
import CoreClient from '../src/core';
import ProvidersClient from '../src/providers';
import { ConnectorSource } from '../src';
import type { AuthFieldOption, AuthPattern } from '../src';

function makeClient() {
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const createCustomProvider = jest.fn(
    async (_req: any, _options?: unknown) => ({})
  );
  const updateCustomProvider = jest.fn(
    async (_req: any, _options?: unknown) => ({})
  );
  const grpcConnect = {
    createClient: () => ({ createCustomProvider, updateCustomProvider }),
  } as any;
  return {
    providers: new ProvidersClient(grpcConnect, coreClient),
    createCustomProvider,
    updateCustomProvider,
  };
}

const BASE = { displayName: 'Acme MCP', proxyUrl: 'https://mcp.acme.com/mcp' };
const UPDATE_BASE = { identifier: 'ACME:1', ...BASE };

const pattern = (extra: Partial<AuthPattern> = {}): AuthPattern => ({
  type: 'OAUTH',
  display_name: 'Acme OAuth',
  oauth_config: {},
  ...extra,
});

/** The auth_patterns the SDK put on the wire, as plain objects. */
function sentPatterns(mock: { mock: { calls: any[][] } }): AuthPattern[] {
  const req = mock.mock.calls[0][0];
  return toJson(ListValueSchema, req.provider.authPatterns) as AuthPattern[];
}

describe('is_mcp on the pattern still works', () => {
  it('is sent as before on create', async () => {
    const { providers, createCustomProvider } = makeClient();
    await providers.createCustomProvider({
      ...BASE,
      authPatterns: [pattern({ is_mcp: true })],
    });
    expect(sentPatterns(createCustomProvider)[0].is_mcp).toBe(true);
  });

  it('is sent as before on update', async () => {
    const { providers, updateCustomProvider } = makeClient();
    await providers.updateCustomProvider({
      ...UPDATE_BASE,
      authPatterns: [pattern({ is_mcp: true })],
    });
    expect(sentPatterns(updateCustomProvider)[0].is_mcp).toBe(true);
  });

  it('sends no is_mcp key when nothing sets it', async () => {
    const { providers, createCustomProvider } = makeClient();
    await providers.createCustomProvider({
      ...BASE,
      authPatterns: [pattern()],
    });
    expect(sentPatterns(createCustomProvider)[0]).not.toHaveProperty('is_mcp');
  });
});

describe('request-level source', () => {
  it('marks the pattern as MCP on create', async () => {
    const { providers, createCustomProvider } = makeClient();
    await providers.createCustomProvider({
      ...BASE,
      source: ConnectorSource.MCP_SERVER,
      authPatterns: [pattern()],
    });
    expect(sentPatterns(createCustomProvider)[0].is_mcp).toBe(true);
  });

  it('marks the pattern as MCP on update', async () => {
    const { providers, updateCustomProvider } = makeClient();
    await providers.updateCustomProvider({
      ...UPDATE_BASE,
      source: ConnectorSource.MCP_SERVER,
      authPatterns: [pattern()],
    });
    expect(sentPatterns(updateCustomProvider)[0].is_mcp).toBe(true);
  });

  it("does not change the caller's pattern object", async () => {
    const { providers } = makeClient();
    const mine = pattern();
    await providers.createCustomProvider({
      ...BASE,
      source: ConnectorSource.MCP_SERVER,
      authPatterns: [mine],
    });
    expect(mine).not.toHaveProperty('is_mcp');
  });

  it('sends no is_mcp key when source is left out', async () => {
    const { providers, createCustomProvider } = makeClient();
    await providers.createCustomProvider({
      ...BASE,
      authPatterns: [pattern()],
    });
    expect(sentPatterns(createCustomProvider)[0]).not.toHaveProperty('is_mcp');
  });

  it('accepts the same value on the request and the pattern', async () => {
    const { providers, createCustomProvider } = makeClient();
    await providers.createCustomProvider({
      ...BASE,
      source: ConnectorSource.MCP_SERVER,
      authPatterns: [pattern({ is_mcp: true })],
    });
    expect(sentPatterns(createCustomProvider)[0].is_mcp).toBe(true);
  });

  it('has only MCP_SERVER for now', () => {
    expect(Object.keys(ConnectorSource)).toEqual(['MCP_SERVER']);
  });

  it('rejects a value that is not a ConnectorSource', async () => {
    const { providers, createCustomProvider } = makeClient();
    await expect(
      providers.createCustomProvider({
        ...BASE,
        source: 'OPENAPI_SPEC' as unknown as ConnectorSource,
        authPatterns: [pattern()],
      })
    ).rejects.toThrow('source must be one of: MCP_SERVER');
    expect(createCustomProvider).not.toHaveBeenCalled();
  });
});

describe('conflicting values', () => {
  it('throws for MCP_SERVER with is_mcp: false on the pattern', async () => {
    const { providers, createCustomProvider } = makeClient();
    await expect(
      providers.createCustomProvider({
        ...BASE,
        source: ConnectorSource.MCP_SERVER,
        authPatterns: [pattern({ is_mcp: false })],
      })
    ).rejects.toThrow(
      'source: ConnectorSource.MCP_SERVER conflicts with is_mcp: false on authPatterns[0]'
    );
    expect(createCustomProvider).not.toHaveBeenCalled();
  });

  it('throws the same way on update and sends nothing', async () => {
    const { providers, updateCustomProvider } = makeClient();
    await expect(
      providers.updateCustomProvider({
        ...UPDATE_BASE,
        source: ConnectorSource.MCP_SERVER,
        authPatterns: [pattern({ is_mcp: false })],
      })
    ).rejects.toThrow('conflicts with is_mcp: false on authPatterns[0]');
    expect(updateCustomProvider).not.toHaveBeenCalled();
  });

  it('says how to fix it', async () => {
    const { providers } = makeClient();
    await expect(
      providers.createCustomProvider({
        ...BASE,
        source: ConnectorSource.MCP_SERVER,
        authPatterns: [pattern({ is_mcp: false })],
      })
    ).rejects.toThrow(/deprecated: remove it from the pattern/);
  });
});

describe('AuthField keys', () => {
  it('sends header_name, is_path_param, options and textarea unchanged', async () => {
    const options: AuthFieldOption[] = [
      { value: 'eu', display_name: 'Europe', default: true },
    ];
    const { providers, createCustomProvider } = makeClient();
    await providers.createCustomProvider({
      ...BASE,
      authPatterns: [
        {
          type: 'API_KEY',
          display_name: 'Acme Key',
          fields: [
            {
              field_name: 'api_key',
              input_type: 'textarea',
              header_name: 'X-Api-Key',
              is_path_param: true,
              options,
            },
          ],
        },
      ],
    });
    expect(sentPatterns(createCustomProvider)[0].fields?.[0]).toEqual({
      field_name: 'api_key',
      input_type: 'textarea',
      header_name: 'X-Api-Key',
      is_path_param: true,
      options,
    });
  });
});
