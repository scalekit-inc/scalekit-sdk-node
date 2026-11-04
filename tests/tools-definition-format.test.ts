/**
 * SK-3047: list RPCs ask for each tool definition as JSON text, because a
 * deeply nested definition sent as a google.protobuf.Struct exceeds the
 * protobuf decoder's 100-level recursion limit and fails the whole page.
 * The SDK restores `definition` from that text, so callers see the same
 * `Tool` shape as before.
 */
import { describe, it, expect, jest } from '@jest/globals';
import {
  create,
  fromBinary,
  toBinary,
  type JsonObject,
} from '@bufbuild/protobuf';
import CoreClient from '../src/core';
import ToolsClient from '../src/tools';
import ActionsClient from '../src/actions';
import {
  DefinitionFormat,
  ListToolsResponseSchema,
  ToolSchema,
  type Tool,
} from '../src/pkg/grpc/scalekit/v1/tools/tools_pb';

const definition: JsonObject = {
  name: 'gmail_send',
  input_schema: { type: 'object', properties: { to: { type: 'string' } } },
};

function deepDefinition(depth: number): JsonObject {
  let value: JsonObject = { leaf: 'x' };
  for (let i = 0; i < depth - 2; i++) {
    value = { k: value };
  }
  return { name: 'deep_tool', input_schema: value };
}

function jsonTool(id: string, def: JsonObject): Tool {
  return create(ToolSchema, {
    id,
    provider: 'GMAIL',
    definitionJson: JSON.stringify(def),
  });
}

function structTool(id: string, def: JsonObject): Tool {
  return create(ToolSchema, { id, provider: 'GMAIL', definition: def });
}

function makeClient(responses: {
  listTools?: unknown;
  listScopedTools?: unknown;
  listAvailableTools?: unknown;
}) {
  const fakeClient = {
    listTools: jest.fn(
      async (_req: any, _opts?: unknown) => responses.listTools
    ),
    listScopedTools: jest.fn(
      async (_req: any, _opts?: unknown) => responses.listScopedTools
    ),
    listAvailableTools: jest.fn(
      async (_req: any, _opts?: unknown) => responses.listAvailableTools
    ),
  };
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const grpcConnect = { createClient: () => fakeClient } as any;
  return { tools: new ToolsClient(grpcConnect, coreClient), fakeClient };
}

describe('ToolsClient list methods and definition_format (SK-3047)', () => {
  it('listTools requests JSON_STRING and restores definition', async () => {
    const { tools, fakeClient } = makeClient({
      listTools: create(ListToolsResponseSchema, {
        tools: [jsonTool('tol_1', definition)],
        totalSize: 1,
      }),
    });

    const response = await tools.listTools({ pageSize: 5 });

    const request = fakeClient.listTools.mock.calls[0][0];
    expect(request.definitionFormat).toBe(DefinitionFormat.JSON_STRING);
    expect(request.pageSize).toBe(5);
    expect(response.tools[0].definition).toEqual(definition);
    expect(response.tools[0].definitionJson).toBeUndefined();
    expect(response.totalSize).toBe(1);
  });

  it('leaves a Struct definition from a server that ignores definition_format untouched', async () => {
    const { tools } = makeClient({
      listTools: create(ListToolsResponseSchema, {
        tools: [structTool('tol_1', definition)],
      }),
    });

    const response = await tools.listTools();

    expect(response.tools[0].definition).toEqual(definition);
    expect(response.tools[0].definitionJson).toBeUndefined();
  });

  it('returns the same Tool as a Struct response would', async () => {
    const fromJson = await makeClient({
      listTools: create(ListToolsResponseSchema, {
        tools: [jsonTool('tol_1', definition)],
      }),
    }).tools.listTools();
    const fromStruct = await makeClient({
      listTools: create(ListToolsResponseSchema, {
        tools: [structTool('tol_1', definition)],
      }),
    }).tools.listTools();

    expect(fromJson).toEqual(fromStruct);
  });

  it('listScopedTools requests JSON_STRING and restores each scoped tool', async () => {
    const { tools, fakeClient } = makeClient({
      listScopedTools: {
        tools: [
          {
            tool: jsonTool('tol_1', definition),
            identifier: 'user_1',
            connectedAccountId: 'ca_1',
          },
          { identifier: 'user_2', connectedAccountId: 'ca_2' },
        ],
      },
    });

    const response = await tools.listScopedTools('user_1', {
      filter: { providers: ['GMAIL'] },
    });

    expect(fakeClient.listScopedTools.mock.calls[0][0].definitionFormat).toBe(
      DefinitionFormat.JSON_STRING
    );
    expect(response.tools[0].tool?.definition).toEqual(definition);
    expect(response.tools[0].tool?.definitionJson).toBeUndefined();
    expect(response.tools[1].tool).toBeUndefined();
  });

  it('listAvailableTools requests JSON_STRING and restores definition', async () => {
    const { tools, fakeClient } = makeClient({
      listAvailableTools: { tools: [jsonTool('tol_1', definition)] },
    });

    const response = await tools.listAvailableTools('user_1');

    expect(
      fakeClient.listAvailableTools.mock.calls[0][0].definitionFormat
    ).toBe(DefinitionFormat.JSON_STRING);
    expect(response.tools[0].definition).toEqual(definition);
  });

  it('decodes a page whose definition is too deep to decode as a Struct', async () => {
    // As a Struct, a depth-60 definition fails with "maximum recursion depth of
    // 100 reached" on @bufbuild/protobuf 2.13.0 and later, which is what
    // `^2.12.0` resolves to in customer installs. This repo's lockfile pins
    // 2.12.0, which has no limit, so that failure is not asserted here; the
    // JSON-text page must decode and restore on any version.
    const deep = deepDefinition(60);
    const asString = toBinary(
      ListToolsResponseSchema,
      create(ListToolsResponseSchema, { tools: [jsonTool('tol_1', deep)] })
    );
    const { tools } = makeClient({
      listTools: fromBinary(ListToolsResponseSchema, asString),
    });

    const response = await tools.listTools();

    expect(response.tools[0].definition).toEqual(deep);
  });

  it('reports an invalid definition with the tool id', async () => {
    const bad = create(ToolSchema, {
      id: 'tol_bad',
      definitionJson: '{not json',
    });
    const { tools } = makeClient({
      listTools: create(ListToolsResponseSchema, { tools: [bad] }),
    });

    await expect(tools.listTools()).rejects.toThrow(/tol_bad/);
  });

  it('actions.listTools still returns the same tool shape', async () => {
    const { tools } = makeClient({
      listTools: create(ListToolsResponseSchema, {
        tools: [jsonTool('tol_1', definition)],
        totalSize: 1,
      }),
    });
    const actions = new ActionsClient(
      tools,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );

    const response = await actions.listTools();

    expect(response.tools[0].definition).toEqual(definition);
    expect(Object.keys(response.tools[0]).sort()).toEqual(
      [
        'definition',
        'id',
        'isDefault',
        'metadata',
        'provider',
        'tags',
        'updatedAt',
      ].sort()
    );
  });
});
