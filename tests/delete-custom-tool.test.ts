/**
 * `tools.deleteCustomTool` and `actions.deleteCustomTool`: delete one tool of a
 * connector created from an OpenAPI spec, by its name.
 *
 * Offline tests, so no environment is needed. Most of them hand the real `ToolsClient` a mocked
 * RPC method; the last block drives it over an in-memory Connect transport instead, so the
 * generated service, the real client and the error details are on the path.
 */
import {
  afterEach,
  beforeEach,
  describe,
  it,
  expect,
  jest,
} from '@jest/globals';
import {
  Code,
  ConnectError,
  createClient,
  createRouterTransport,
} from '@connectrpc/connect';
import { create } from '@bufbuild/protobuf';
import { EmptySchema } from '@bufbuild/protobuf/wkt';
import ActionsClient from '../src/actions';
import GrpcConnect from '../src/connect';
import ToolsClient from '../src/tools';
import CoreClient from '../src/core';
import {
  ScalekitBadRequestException,
  ScalekitConflictException,
  ScalekitException,
  ScalekitNotFoundException,
  ScalekitServiceUnavailableException,
  ScalekitValidationError,
} from '../src/errors';
import { ErrorInfoSchema } from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import {
  DeleteCustomToolRequestSchema,
  ToolService,
} from '../src/pkg/grpc/scalekit/v1/tools/tools_pb';

const core = () =>
  new CoreClient('https://test.scalekit.dev', 'client_id', 'client_secret');

let sleep: jest.SpiedFunction<any>;
let authenticate: jest.SpiedFunction<any>;

beforeEach(() => {
  // `connectExec` backs off for about a second before it replays a call: do not wait for it.
  sleep = jest
    .spyOn(CoreClient.prototype as any, 'sleep')
    .mockResolvedValue(undefined as never);
  authenticate = jest
    .spyOn(CoreClient.prototype as any, 'authenticateClient')
    .mockResolvedValue(undefined as never);
});

afterEach(() => {
  jest.restoreAllMocks();
});

function setup() {
  const rpc = {
    deleteCustomTool: jest.fn(async (_r: any, _o?: any) => create(EmptySchema)),
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

const unavailable = () =>
  new ConnectError('upstream connect error', Code.Unavailable);

/** An rpc mock that answers with each outcome in turn: an Error is thrown, anything else is returned. */
const outcomes = (...list: unknown[]) =>
  jest.fn(async (_request: any, _options?: any) => {
    const next = list.length > 1 ? list.shift() : list[0];
    if (next instanceof Error) throw next;
    return next;
  });

function setupWith(rpcMock: jest.Mock) {
  const coreClient = core();
  const tools = new ToolsClient(
    { createClient: () => ({ deleteCustomTool: rpcMock }) } as any,
    coreClient
  );
  return { tools };
}

describe('the generated stub', () => {
  it('has the DeleteCustomTool RPC, with the field numbers the backend uses', () => {
    const method = ToolService.method.deleteCustomTool;

    // Names, not descriptors: when `toBe` fails on a descriptor, jest pretty-prints the whole
    // descriptor graph and can hang for minutes.
    expect(method.name).toBe('DeleteCustomTool');
    expect(method.methodKind).toBe('unary');
    expect(method.input.typeName).toBe(
      'scalekit.v1.tools.DeleteCustomToolRequest'
    );
    expect(DeleteCustomToolRequestSchema.typeName).toBe(
      'scalekit.v1.tools.DeleteCustomToolRequest'
    );
    expect(method.output.typeName).toBe('google.protobuf.Empty');
    expect(DeleteCustomToolRequestSchema.field.toolName.number).toBe(1);
    expect(DeleteCustomToolRequestSchema.field.providerIdentifier.number).toBe(
      2
    );
  });

  it('is on the client that GrpcConnect builds for ToolService', () => {
    const client = new GrpcConnect(core()).createClient(ToolService);

    expect(typeof client.deleteCustomTool).toBe('function');
  });
});

describe('tools.deleteCustomTool', () => {
  it('sends the tool name, and resolves with nothing', async () => {
    const { rpc, tools } = setup();

    const res = await tools.deleteCustomTool({ toolName: 'a-acme_get_user' });

    expect(res).toBeUndefined();
    expect(rpc.deleteCustomTool).toHaveBeenCalledTimes(1);
    const [request] = lastCall(rpc.deleteCustomTool);
    expect(request.toolName).toBe('a-acme_get_user');
    expect(request.providerIdentifier).toBe('');
  });

  it('sends the connector identifier when it is given', async () => {
    const { rpc, tools } = setup();

    await tools.deleteCustomTool({
      toolName: 'a-acme_get_user',
      providerIdentifier: 'ACME:1234',
    });

    const [request] = lastCall(rpc.deleteCustomTool);
    expect(request.toolName).toBe('a-acme_get_user');
    expect(request.providerIdentifier).toBe('ACME:1234');
  });

  it('sends the name as it is: only the server folds capitals, and only ASCII ones', async () => {
    const { rpc, tools } = setup();

    await tools.deleteCustomTool({ toolName: 'A-Acme_Get_User' });
    expect(lastCall(rpc.deleteCustomTool)[0].toolName).toBe('A-Acme_Get_User');

    // `toLowerCase()` would turn the Kelvin sign (U+212A) into an ASCII `k`, which the server
    // deliberately does not do: a name must not reach a tool it does not spell.
    await tools.deleteCustomTool({ toolName: 'a-\u212Aunde_get_user' });
    expect(lastCall(rpc.deleteCustomTool)[0].toolName).toBe(
      'a-\u212Aunde_get_user'
    );
  });

  it('trims the values it sends', async () => {
    const { rpc, tools } = setup();

    await tools.deleteCustomTool({
      toolName: '  a-acme_get_user\n',
      providerIdentifier: ' ACME:1234 ',
    });

    const [request] = lastCall(rpc.deleteCustomTool);
    expect(request.toolName).toBe('a-acme_get_user');
    expect(request.providerIdentifier).toBe('ACME:1234');
  });

  it('leaves the connector identifier out when it is not given', async () => {
    const { rpc, tools } = setup();

    for (const providerIdentifier of [undefined, null]) {
      await tools.deleteCustomTool({
        toolName: 'a-acme_get_user',
        providerIdentifier,
      } as any);

      expect(lastCall(rpc.deleteCustomTool)[0].providerIdentifier).toBe('');
    }
    expect(rpc.deleteCustomTool).toHaveBeenCalledTimes(2);
  });

  it('refuses a connector identifier that is given and blank, and sends nothing', async () => {
    const { rpc, tools } = setup();

    // The server answers 404 for a blank identifier. Dropping it would turn that into a delete
    // by the name alone, so it is an error here.
    for (const providerIdentifier of ['', '   ', '\n\t']) {
      const error = await tools
        .deleteCustomTool({ toolName: 'a-acme_get_user', providerIdentifier })
        .catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitValidationError);
      expect(error).toBeInstanceOf(ScalekitException);
      expect(error.retryable).toBe(false);
      expect(error.message).toContain('providerIdentifier must not be blank');
    }
    expect(rpc.deleteCustomTool).not.toHaveBeenCalled();
  });

  it('refuses a connector identifier that is not a string, and sends nothing', async () => {
    const { rpc, tools } = setup();

    for (const providerIdentifier of [5, 0, true, {}, ['ACME:1234']]) {
      const error = await tools
        .deleteCustomTool({
          toolName: 'a-acme_get_user',
          providerIdentifier,
        } as any)
        .catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitValidationError);
      expect(error).toBeInstanceOf(ScalekitException);
      expect(error.message).toContain('providerIdentifier must be a string');
    }
    expect(rpc.deleteCustomTool).not.toHaveBeenCalled();
  });

  it('uses the tool timeout, as the other tool calls do', async () => {
    const { rpc, tools, coreClient } = setup();

    await tools.deleteCustomTool({ toolName: 'a-acme_get_user' });

    const [, options] = lastCall(rpc.deleteCustomTool);
    expect(options).toEqual({ timeoutMs: coreClient.toolTimeoutMs });
  });

  it('needs a tool name, and sends nothing without one', async () => {
    const { rpc, tools } = setup();

    for (const params of [
      { toolName: '' },
      { toolName: '   ' },
      { toolName: '\n\t' },
      { providerIdentifier: 'ACME:1234' },
      { toolName: 123 },
      { toolName: null },
      {},
    ]) {
      const error = await tools.deleteCustomTool(params as any).catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitValidationError);
      expect(error).toBeInstanceOf(ScalekitException);
      expect(error.retryable).toBe(false);
      expect(error.message).toContain('toolName is required');
    }
    await expect(tools.deleteCustomTool(undefined as any)).rejects.toThrow(
      ScalekitValidationError
    );
    expect(rpc.deleteCustomTool).not.toHaveBeenCalled();
  });
});

describe('the errors of tools.deleteCustomTool', () => {
  it('surfaces a tool that cannot be deleted as not found', async () => {
    const { rpc, tools } = setup();
    rpc.deleteCustomTool.mockRejectedValueOnce(
      connectError(Code.NotFound, 'custom tool not found', 'NOT_FOUND')
    );

    const error = await tools
      .deleteCustomTool({ toolName: 'gmail_send_email' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitNotFoundException);
    expect(error.message).toContain('custom tool not found');
    expect(rpc.deleteCustomTool).toHaveBeenCalledTimes(1);
  });

  it('surfaces a sync in progress as a conflict, without retrying', async () => {
    const { rpc, tools } = setup();
    rpc.deleteCustomTool.mockRejectedValue(
      connectError(
        Code.AlreadyExists,
        'a sync of this connector is in progress; nothing was deleted, retry once it has finished',
        'RESOURCE_ALREADY_EXISTS'
      )
    );

    const error = await tools
      .deleteCustomTool({ toolName: 'a-acme_get_user' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitConflictException);
    expect(error.errorCode).toBe('RESOURCE_ALREADY_EXISTS');
    expect(error.message).toContain('nothing was deleted');
    expect(rpc.deleteCustomTool).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('surfaces a name shared by two connectors as a conflict with its own code', async () => {
    const { rpc, tools } = setup();
    rpc.deleteCustomTool.mockRejectedValueOnce(
      connectError(
        Code.AlreadyExists,
        'tools of more than one connector of this environment have this name (ACME:1234, ACME:5678); nothing was deleted',
        'TOOL_NAME_AMBIGUOUS'
      )
    );

    const error = await tools
      .deleteCustomTool({ toolName: 'a-acme_get_user' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitConflictException);
    expect(error.errorCode).toBe('TOOL_NAME_AMBIGUOUS');
    expect(error.message).toContain('ACME:1234');
    expect(error.message).toContain('ACME:5678');
  });

  it('surfaces an invalid request and a disabled feature as bad requests', async () => {
    const { rpc, tools } = setup();
    rpc.deleteCustomTool
      .mockRejectedValueOnce(
        connectError(
          Code.InvalidArgument,
          'invalid tool name',
          'INVALID_ARGUMENT'
        )
      )
      .mockRejectedValueOnce(
        connectError(
          Code.InvalidArgument,
          'OpenAPI-sourced connectors are not enabled for this environment',
          'FEATURE_NOT_ENABLED'
        )
      );

    const invalid = await tools
      .deleteCustomTool({ toolName: 'a-acme_get_user' })
      .catch((e) => e);
    const disabled = await tools
      .deleteCustomTool({ toolName: 'a-acme_get_user' })
      .catch((e) => e);

    expect(invalid).toBeInstanceOf(ScalekitBadRequestException);
    expect(invalid.message).toContain('invalid tool name');
    expect(disabled).toBeInstanceOf(ScalekitBadRequestException);
    expect(disabled.errorCode).toBe('FEATURE_NOT_ENABLED');
  });
});

describe('what tools.deleteCustomTool does after Unavailable or Unauthenticated', () => {
  it('sends the call again after Unavailable, like the other calls', async () => {
    const remove = outcomes(unavailable(), create(EmptySchema));
    const { tools } = setupWith(remove);

    await expect(
      tools.deleteCustomTool({ toolName: 'a-acme_get_user' })
    ).resolves.toBeUndefined();

    expect(remove).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(remove.mock.calls[1][0]).toEqual(remove.mock.calls[0][0]);
  });

  it('answers not found when the call it sent again finds the tool already gone', async () => {
    const remove = outcomes(
      unavailable(),
      connectError(Code.NotFound, 'custom tool not found', 'NOT_FOUND')
    );
    const { tools } = setupWith(remove);

    await expect(
      tools.deleteCustomTool({ toolName: 'a-acme_get_user' })
    ).rejects.toBeInstanceOf(ScalekitNotFoundException);

    expect(remove).toHaveBeenCalledTimes(2);
  });

  it('raises ScalekitServiceUnavailableException once the retries run out', async () => {
    const remove = outcomes(unavailable());
    const { tools } = setupWith(remove);

    const error = await tools
      .deleteCustomTool({ toolName: 'a-acme_get_user' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitServiceUnavailableException);
    expect(error.httpStatus).toBe(503);
    expect(remove).toHaveBeenCalledTimes(4);
    expect(sleep).toHaveBeenCalledTimes(3);
  });

  it('refreshes the token and sends the call again after Unauthenticated', async () => {
    const remove = outcomes(
      new ConnectError('token expired', Code.Unauthenticated),
      create(EmptySchema)
    );
    const { tools } = setupWith(remove);

    await tools.deleteCustomTool({ toolName: 'a-acme_get_user' });

    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(2);
  });
});

describe('actions.deleteCustomTool', () => {
  it('sends the tool name and the connector identifier, trimmed', async () => {
    const { rpc, actions } = setup();

    const res = await actions.deleteCustomTool({
      toolName: ' a-acme_get_user ',
      providerIdentifier: ' ACME:1234 ',
    });

    expect(res).toBeUndefined();
    const [request, options] = lastCall(rpc.deleteCustomTool);
    expect(request.toolName).toBe('a-acme_get_user');
    expect(request.providerIdentifier).toBe('ACME:1234');
    expect(options).toEqual({ timeoutMs: expect.any(Number) });
  });

  it('sends only the tool name when no connector is given', async () => {
    const { rpc, actions } = setup();

    await actions.deleteCustomTool({ toolName: 'a-acme_get_user' });

    const [request] = lastCall(rpc.deleteCustomTool);
    expect(request.toolName).toBe('a-acme_get_user');
    expect(request.providerIdentifier).toBe('');
  });

  it('rejects a missing tool name with the documented SDK exception, and sends nothing', async () => {
    const { rpc, actions } = setup();

    for (const params of [{ toolName: '' }, { toolName: '  ' }, {}]) {
      const error = await actions
        .deleteCustomTool(params as any)
        .catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitValidationError);
      expect(error).toBeInstanceOf(ScalekitException);
      expect(error.retryable).toBe(false);
      expect(error.message).toContain('toolName is required');
    }
    expect(rpc.deleteCustomTool).not.toHaveBeenCalled();
  });

  it('rejects a blank or non-string connector identifier with the documented SDK exception, and sends nothing', async () => {
    const { rpc, actions } = setup();

    for (const providerIdentifier of ['', '  ', 5, {}]) {
      const error = await actions
        .deleteCustomTool({
          toolName: 'a-acme_get_user',
          providerIdentifier,
        } as any)
        .catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitValidationError);
      expect(error.message).toContain('providerIdentifier must');
    }
    expect(rpc.deleteCustomTool).not.toHaveBeenCalled();
  });

  it('raises the same errors as tools.deleteCustomTool', async () => {
    const { rpc, actions } = setup();
    rpc.deleteCustomTool
      .mockRejectedValueOnce(
        connectError(Code.NotFound, 'custom tool not found', 'NOT_FOUND')
      )
      .mockRejectedValueOnce(
        connectError(
          Code.AlreadyExists,
          'a sync of this connector is in progress',
          'RESOURCE_ALREADY_EXISTS'
        )
      );

    await expect(
      actions.deleteCustomTool({ toolName: 'a-acme_get_user' })
    ).rejects.toBeInstanceOf(ScalekitNotFoundException);
    await expect(
      actions.deleteCustomTool({ toolName: 'a-acme_get_user' })
    ).rejects.toBeInstanceOf(ScalekitConflictException);
  });
});

describe('tools.deleteCustomTool over an in-memory transport', () => {
  /** The real ToolsClient and the real generated client, talking to a handler over Connect. */
  function overTransport(
    deleteCustomTool: (request: {
      toolName: string;
      providerIdentifier: string;
    }) => unknown
  ) {
    const transport = createRouterTransport(({ service }) => {
      service(ToolService, { deleteCustomTool: deleteCustomTool as any });
    });
    const tools = new ToolsClient(
      { createClient: (s: any) => createClient(s, transport) } as any,
      core()
    );
    return { tools };
  }

  it('delivers the trimmed name and connector to the handler, and resolves with nothing', async () => {
    const seen: { toolName: string; providerIdentifier: string }[] = [];
    const { tools } = overTransport((request) => {
      seen.push({
        toolName: request.toolName,
        providerIdentifier: request.providerIdentifier,
      });
      return {};
    });

    await expect(
      tools.deleteCustomTool({
        toolName: ' a-acme_get_user\n',
        providerIdentifier: ' ACME:1234 ',
      })
    ).resolves.toBeUndefined();
    await expect(
      tools.deleteCustomTool({ toolName: 'A-Acme_Get_User' })
    ).resolves.toBeUndefined();

    expect(seen).toEqual([
      { toolName: 'a-acme_get_user', providerIdentifier: 'ACME:1234' },
      { toolName: 'A-Acme_Get_User', providerIdentifier: '' },
    ]);
  });

  it('raises ScalekitConflictException with the error code of a sync in progress, without replaying the call', async () => {
    let calls = 0;
    const { tools } = overTransport(() => {
      calls += 1;
      throw connectError(
        Code.AlreadyExists,
        'a sync of this connector is in progress; nothing was deleted, retry once it has finished',
        'RESOURCE_ALREADY_EXISTS'
      );
    });

    const error = await tools
      .deleteCustomTool({ toolName: 'a-acme_get_user' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitConflictException);
    expect(error.errorCode).toBe('RESOURCE_ALREADY_EXISTS');
    expect(error.message).toContain('nothing was deleted');
    expect(calls).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('raises ScalekitConflictException with TOOL_NAME_AMBIGUOUS for a name shared by two connectors, without replaying the call', async () => {
    let calls = 0;
    const { tools } = overTransport(() => {
      calls += 1;
      throw connectError(
        Code.AlreadyExists,
        'tools of more than one connector of this environment have this name (ACME:1234, ACME:5678); nothing was deleted',
        'TOOL_NAME_AMBIGUOUS'
      );
    });

    const error = await tools
      .deleteCustomTool({ toolName: 'a-acme_get_user' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitConflictException);
    expect(error.errorCode).toBe('TOOL_NAME_AMBIGUOUS');
    expect(error.message).toContain('ACME:1234');
    expect(error.message).toContain('ACME:5678');
    expect(calls).toBe(1);
  });

  it('raises ScalekitNotFoundException for a tool that cannot be deleted, without replaying the call', async () => {
    let calls = 0;
    const { tools } = overTransport(() => {
      calls += 1;
      throw connectError(Code.NotFound, 'custom tool not found', 'NOT_FOUND');
    });

    const error = await tools
      .deleteCustomTool({ toolName: 'gmail_send_email' })
      .catch((e) => e);

    expect(error).toBeInstanceOf(ScalekitNotFoundException);
    expect(error.message).toContain('custom tool not found');
    expect(calls).toBe(1);
  });

  it('sends the call again after Unavailable and resolves when the second attempt succeeds', async () => {
    let calls = 0;
    const { tools } = overTransport(() => {
      calls += 1;
      if (calls === 1) {
        throw new ConnectError('upstream connect error', Code.Unavailable);
      }
      return {};
    });

    await expect(
      tools.deleteCustomTool({ toolName: 'a-acme_get_user' })
    ).resolves.toBeUndefined();

    expect(calls).toBe(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });
});
