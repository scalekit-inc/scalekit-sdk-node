/**
 * OauthToken.expiresAt (proto v0.1.162.1) on the actions connected-account
 * methods. `authorizationDetails` is passed through to `create()`, so an
 * `oauthToken.expiresAt` Timestamp reaches the request unchanged, and leaving
 * it out sends the same request as before.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { create, toBinary } from '@bufbuild/protobuf';
import { timestampFromDate } from '@bufbuild/protobuf/wkt';
import CoreClient from '../src/core';
import ConnectedAccountsClient from '../src/connected-accounts';
import ActionsClient from '../src/actions';
import { ScalekitNotFoundException } from '../src/errors/specific-exceptions';
import {
  AuthorizationDetailsSchema,
  CreateConnectedAccountRequestSchema,
  CreateConnectedAccountResponseSchema,
  GetConnectedAccountByIdentifierResponseSchema,
  OauthTokenSchema,
  UpdateConnectedAccountRequestSchema,
  UpdateConnectedAccountResponseSchema,
} from '../src/pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

const EXPIRES = new Date('2026-12-01T10:00:00Z');
const EPOCH = BigInt(Math.floor(EXPIRES.getTime() / 1000)); // 1796119200

function makeActions(opts: { existing?: boolean } = {}) {
  const fakeClient = {
    createConnectedAccount: jest.fn(async (_req: any, _o?: unknown) =>
      create(CreateConnectedAccountResponseSchema, {})
    ),
    updateConnectedAccount: jest.fn(async (_req: any, _o?: unknown) =>
      create(UpdateConnectedAccountResponseSchema, {})
    ),
    getConnectedAccountAuth: jest.fn(async (_req: any, _o?: unknown) => {
      if (opts.existing) {
        return create(GetConnectedAccountByIdentifierResponseSchema, {});
      }
      throw Object.create(ScalekitNotFoundException.prototype);
    }),
  };
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const grpcConnect = { createClient: () => fakeClient } as any;
  const connectedAccounts = new ConnectedAccountsClient(
    grpcConnect,
    coreClient
  );
  const actions = new ActionsClient(
    {} as any,
    connectedAccounts,
    coreClient,
    {} as any,
    {} as any,
    {} as any
  );
  return { actions, fakeClient };
}

const oauthToken = (extra: Record<string, unknown> = {}) => ({
  details: {
    case: 'oauthToken' as const,
    value: {
      accessToken: 'at',
      refreshToken: 'rt',
      scopes: ['a', 'b'],
      ...extra,
    },
  },
});

function sentToken(req: any) {
  const details = req.connectedAccount.authorizationDetails.details;
  expect(details.case).toBe('oauthToken');
  return details.value;
}

describe('actions connected-account methods carry oauthToken.expiresAt', () => {
  it('createConnectedAccount sends expiresAt', async () => {
    const { actions, fakeClient } = makeActions();
    await actions.createConnectedAccount({
      connectionName: 'gmail',
      identifier: 'user_1',
      authorizationDetails: oauthToken({
        expiresAt: timestampFromDate(EXPIRES),
      }),
    });

    const token = sentToken(fakeClient.createConnectedAccount.mock.calls[0][0]);
    expect(token.expiresAt.seconds).toBe(EPOCH);
    expect(token.expiresAt.nanos).toBe(0);
    expect([token.accessToken, token.refreshToken, token.scopes]).toEqual([
      'at',
      'rt',
      ['a', 'b'],
    ]);
  });

  it('updateConnectedAccount sends expiresAt', async () => {
    const { actions, fakeClient } = makeActions();
    await actions.updateConnectedAccount({
      connectionName: 'gmail',
      identifier: 'user_1',
      authorizationDetails: oauthToken({
        expiresAt: timestampFromDate(EXPIRES),
      }),
    });

    const token = sentToken(fakeClient.updateConnectedAccount.mock.calls[0][0]);
    expect(token.expiresAt.seconds).toBe(EPOCH);
  });

  it('updateConnectedAccount still accepts a message built with create()', async () => {
    const { actions, fakeClient } = makeActions();
    await actions.updateConnectedAccount({
      connectionName: 'gmail',
      identifier: 'user_1',
      authorizationDetails: create(AuthorizationDetailsSchema, {
        details: {
          case: 'oauthToken',
          value: create(OauthTokenSchema, {
            accessToken: 'at',
            expiresAt: timestampFromDate(EXPIRES),
          }),
        },
      }),
    });

    expect(
      sentToken(fakeClient.updateConnectedAccount.mock.calls[0][0]).expiresAt
        .seconds
    ).toBe(EPOCH);
  });

  it('getOrCreateConnectedAccount sends expiresAt on both the create and the update path', async () => {
    for (const existing of [false, true]) {
      const { actions, fakeClient } = makeActions({ existing });
      await actions.getOrCreateConnectedAccount({
        connectionName: 'gmail',
        identifier: 'user_1',
        authorizationDetails: oauthToken({
          expiresAt: timestampFromDate(EXPIRES),
        }),
      });
      const call = existing
        ? fakeClient.updateConnectedAccount
        : fakeClient.createConnectedAccount;
      expect(sentToken(call.mock.calls[0][0]).expiresAt.seconds).toBe(EPOCH);
    }
  });

  it('omitting expiresAt leaves the create and update requests unchanged', async () => {
    const { actions, fakeClient } = makeActions();
    await actions.createConnectedAccount({
      connectionName: 'gmail',
      identifier: 'user_1',
      authorizationDetails: oauthToken(),
    });
    await actions.updateConnectedAccount({
      connectionName: 'gmail',
      identifier: 'user_1',
      authorizationDetails: oauthToken(),
    });

    const createReq = fakeClient.createConnectedAccount.mock.calls[0][0];
    const updateReq = fakeClient.updateConnectedAccount.mock.calls[0][0];
    expect(sentToken(createReq).expiresAt).toBeUndefined();
    expect(sentToken(updateReq).expiresAt).toBeUndefined();

    // Wire bytes are identical to a request built without the field at all.
    const expectedCreate = create(CreateConnectedAccountRequestSchema, {
      connector: 'gmail',
      identifier: 'user_1',
      connectedAccount: { authorizationDetails: oauthToken() },
    });
    expect(toBinary(CreateConnectedAccountRequestSchema, createReq)).toEqual(
      toBinary(CreateConnectedAccountRequestSchema, expectedCreate)
    );
    const expectedUpdate = create(UpdateConnectedAccountRequestSchema, {
      connector: 'gmail',
      identifier: 'user_1',
      connectedAccount: { authorizationDetails: oauthToken() },
    });
    expect(toBinary(UpdateConnectedAccountRequestSchema, updateReq)).toEqual(
      toBinary(UpdateConnectedAccountRequestSchema, expectedUpdate)
    );
  });
});
