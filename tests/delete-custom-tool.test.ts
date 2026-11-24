/**
 * `actions.deleteCustomTool`: delete one tool of a connector created from an
 * OpenAPI spec, by its name or its ID.
 *
 * Offline tests, so no environment is needed: the real `ActionsClient` reaches a mocked RPC method
 * through the real `ToolsClient` it is built on.
 */
import { afterEach, describe, it, expect, jest } from '@jest/globals';
import { Code, ConnectError } from '@connectrpc/connect';
import { create } from '@bufbuild/protobuf';
import { EmptySchema } from '@bufbuild/protobuf/wkt';
import ActionsClient from '../src/actions';
import ToolsClient from '../src/tools';
import CoreClient from '../src/core';
import {
  ScalekitConflictException,
  ScalekitNotFoundException,
  ScalekitValidationError,
} from '../src/errors';
import { ErrorInfoSchema } from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';

afterEach(() => {
  jest.restoreAllMocks();
});

function setup() {
  const rpc = {
    deleteCustomTool: jest.fn(async (_r: any, _o?: any) => create(EmptySchema)),
  };
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const tools = new ToolsClient({ createClient: () => rpc } as any, coreClient);
  const actions = new ActionsClient(
    tools,
    {} as any,
    coreClient,
    {} as any,
    {} as any,
    {} as any
  );
  return { rpc, actions };
}

const connectError = (code: Code, message: string, errorCode: string) =>
  new ConnectError(message, code, undefined, [
    { desc: ErrorInfoSchema, value: { errorCode } },
  ]);

describe('actions.deleteCustomTool', () => {
  it('sends the name or the ID trimmed and returns nothing', async () => {
    const { rpc, actions } = setup();

    // The name has capitals on purpose: the server folds the case of a name, so the SDK
    // trims it and sends it as given.
    await expect(
      actions.deleteCustomTool({ toolIdentifier: '  A-Acme_Get_User\n' })
    ).resolves.toBeUndefined();
    await actions.deleteCustomTool({ toolIdentifier: ' tol_1234 ' });

    expect(rpc.deleteCustomTool.mock.calls.map(([request]) => request)).toEqual(
      [
        expect.objectContaining({ toolIdentifier: 'A-Acme_Get_User' }),
        expect.objectContaining({ toolIdentifier: 'tol_1234' }),
      ]
    );
  });

  it('calls the service method with the request and no per-call options', async () => {
    const { rpc, actions } = setup();

    await actions.deleteCustomTool({ toolIdentifier: 'a-acme_get_user' });

    expect(rpc.deleteCustomTool).toHaveBeenCalledTimes(1);
    expect(rpc.deleteCustomTool.mock.calls[0][1]).toBeUndefined();
  });

  it.each([[''], ['   '], ['\n\t'], [null], [1234], [undefined]])(
    'refuses toolIdentifier %p and sends nothing',
    async (toolIdentifier) => {
      const { rpc, actions } = setup();

      await expect(
        actions.deleteCustomTool({ toolIdentifier } as any)
      ).rejects.toThrow(ScalekitValidationError);
      expect(rpc.deleteCustomTool).not.toHaveBeenCalled();
    }
  );

  it('raises ScalekitNotFoundException for a tool that cannot be deleted', async () => {
    const { rpc, actions } = setup();
    rpc.deleteCustomTool.mockRejectedValueOnce(
      connectError(Code.NotFound, 'custom tool not found', 'NOT_FOUND')
    );

    await expect(
      actions.deleteCustomTool({ toolIdentifier: 'gmail_send_email' })
    ).rejects.toBeInstanceOf(ScalekitNotFoundException);
  });

  it.each(['RESOURCE_ALREADY_EXISTS', 'TOOL_NAME_AMBIGUOUS'])(
    'raises ScalekitConflictException with the error code %s',
    async (errorCode) => {
      const { rpc, actions } = setup();
      rpc.deleteCustomTool.mockRejectedValueOnce(
        connectError(Code.AlreadyExists, 'nothing was deleted', errorCode)
      );

      const error = await actions
        .deleteCustomTool({ toolIdentifier: 'a-acme_get_user' })
        .catch((e) => e);

      expect(error).toBeInstanceOf(ScalekitConflictException);
      expect(error.errorCode).toBe(errorCode);
    }
  );
});
