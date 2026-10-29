/**
 * scalekit.actions.triggers management methods, without a server: request
 * mapping, response mapping (enums, timestamps, intervals, int64, page
 * tokens), input checks made before any request, the retry policy per
 * method, error promotion, and that a generated signing secret is not
 * printed by default.
 */
import util from 'util';
import { describe, it, expect, jest } from '@jest/globals';
import { create, type MessageInitShape } from '@bufbuild/protobuf';
import { EmptySchema, timestampFromDate } from '@bufbuild/protobuf/wkt';
import { Code, ConnectError, type CallOptions } from '@connectrpc/connect';
import CoreClient from '../src/core';
import ActionsClient from '../src/actions';
import ToolsClient from '../src/tools';
import ConnectedAccountsClient from '../src/connected-accounts';
import ConnectionClient from '../src/connection';
import McpClient from '../src/mcp';
import ProvidersClient from '../src/providers';
import ScalekitClient from '../src/scalekit';
import { TriggersClient } from '../src/triggers';
import {
  ScalekitAbortError,
  ScalekitBadRequestException,
  ScalekitConflictException,
  ScalekitException,
  ScalekitGatewayTimeoutException,
  ScalekitInternalServerException,
  ScalekitNotFoundException,
  ScalekitServerException,
  ScalekitServiceUnavailableException,
  ScalekitTooManyRequestsException,
  ScalekitValidationError,
} from '../src/errors';
import {
  TriggerDeliveryStatus,
  TriggerSubscriptionStatus,
  TriggerSubscribeOutcome,
  type RequestOptions,
} from '../src';
import { ErrorInfoSchema } from '../src/pkg/grpc/scalekit/v1/errdetails/errdetails_pb';
import * as pb from '../src/pkg/grpc/scalekit/v1/triggers/triggers_pb';

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

type RpcName =
  | 'listAvailableTriggers'
  | 'listEligibleAccounts'
  | 'listTriggerSubscriptions'
  | 'createTriggerSubscription'
  | 'batchCreateTriggerSubscriptions'
  | 'deleteTriggerSubscription'
  | 'batchDeleteTriggerSubscriptions'
  | 'getTriggerActivity'
  | 'getTriggerUsage'
  | 'getTriggerIngressEndpoint'
  | 'createTriggerIngressEndpoint'
  | 'setTriggerSigningSecret'
  | 'confirmTriggerSigningSecretRotation'
  | 'generateTriggerSigningSecret'
  | 'listTriggerDeliveryAttemptsByEndpoint'
  | 'listTriggerDeliveriesByEndpoint'
  | 'listTriggerDeliveryAttemptsByMessage'
  | 'lookupTriggerDelivery'
  | 'batchLookupTriggerDeliveries'
  | 'batchResendTriggerDeliveries'
  | 'recoverTriggerDeliveries';

const EMPTY_RESPONSES: Record<RpcName, () => unknown> = {
  listAvailableTriggers: () => create(pb.ListAvailableTriggersResponseSchema),
  listEligibleAccounts: () => create(pb.ListEligibleAccountsResponseSchema),
  listTriggerSubscriptions: () =>
    create(pb.ListTriggerSubscriptionsResponseSchema),
  createTriggerSubscription: () => create(pb.TriggerSubscriptionSchema),
  batchCreateTriggerSubscriptions: () =>
    create(pb.BatchCreateTriggerSubscriptionsResponseSchema),
  deleteTriggerSubscription: () => create(EmptySchema),
  batchDeleteTriggerSubscriptions: () =>
    create(pb.BatchDeleteTriggerSubscriptionsResponseSchema),
  getTriggerActivity: () => create(pb.GetTriggerActivityResponseSchema),
  getTriggerUsage: () => create(pb.GetTriggerUsageResponseSchema),
  getTriggerIngressEndpoint: () => create(pb.TriggerIngressEndpointSchema),
  createTriggerIngressEndpoint: () => create(pb.TriggerIngressEndpointSchema),
  setTriggerSigningSecret: () => create(pb.TriggerIngressEndpointSchema),
  confirmTriggerSigningSecretRotation: () =>
    create(pb.TriggerIngressEndpointSchema),
  generateTriggerSigningSecret: () =>
    create(pb.GenerateTriggerSigningSecretResponseSchema),
  listTriggerDeliveryAttemptsByEndpoint: () =>
    create(pb.ListTriggerDeliveryAttemptsByEndpointResponseSchema),
  listTriggerDeliveriesByEndpoint: () =>
    create(pb.ListTriggerDeliveriesByEndpointResponseSchema),
  listTriggerDeliveryAttemptsByMessage: () =>
    create(pb.ListTriggerDeliveryAttemptsByMessageResponseSchema),
  lookupTriggerDelivery: () => create(pb.LookupTriggerDeliveryResponseSchema),
  batchLookupTriggerDeliveries: () =>
    create(pb.BatchLookupTriggerDeliveriesResponseSchema),
  batchResendTriggerDeliveries: () =>
    create(pb.BatchResendTriggerDeliveriesResponseSchema),
  recoverTriggerDeliveries: () =>
    create(pb.RecoverTriggerDeliveriesResponseSchema),
};

type Rpc = jest.Mock<(req: any, opts?: CallOptions) => Promise<unknown>>;

function setup(responses: Partial<Record<RpcName, unknown>> = {}) {
  const core = new CoreClient('https://test.scalekit.dev', 'id', 'secret');
  const rpc = {} as Record<RpcName, Rpc>;
  for (const name of Object.keys(EMPTY_RESPONSES) as RpcName[]) {
    rpc[name] = jest.fn(async () =>
      name in responses ? responses[name] : EMPTY_RESPONSES[name]()
    );
  }
  const grpcConnect = { createClient: () => rpc } as any;
  return { triggers: new TriggersClient(grpcConnect, core), core, rpc };
}

function serverError(code: Code, errorCode?: string): ConnectError {
  return new ConnectError(
    'server said no',
    code,
    undefined,
    errorCode === undefined
      ? undefined
      : [{ desc: ErrorInfoSchema, value: { errorCode } }]
  );
}

interface MethodCase {
  method: string;
  rpc: RpcName;
  call: (t: TriggersClient, options?: RequestOptions) => Promise<unknown>;
  retrySafe: boolean;
}

// Every networked method, called with valid arguments.
const METHODS: MethodCase[] = [
  {
    method: 'listAvailable',
    rpc: 'listAvailableTriggers',
    call: (t, o) => t.listAvailable('conn_1', o),
    retrySafe: true,
  },
  {
    method: 'listEligibleAccounts',
    rpc: 'listEligibleAccounts',
    call: (t, o) => t.listEligibleAccounts('conn_1', 'item.created', {}, o),
    retrySafe: true,
  },
  {
    method: 'listSubscriptions',
    rpc: 'listTriggerSubscriptions',
    call: (t, o) => t.listSubscriptions('conn_1', {}, o),
    retrySafe: true,
  },
  {
    method: 'createSubscription',
    rpc: 'createTriggerSubscription',
    call: (t, o) => t.createSubscription('conn_1', 'item.created', {}, o),
    retrySafe: false,
  },
  {
    method: 'batchCreateSubscriptions',
    rpc: 'batchCreateTriggerSubscriptions',
    call: (t, o) => t.batchCreateSubscriptions('conn_1', 'item.created', {}, o),
    retrySafe: true,
  },
  {
    method: 'deleteSubscription',
    rpc: 'deleteTriggerSubscription',
    call: (t, o) => t.deleteSubscription('conn_1', 'trgs_1', o),
    retrySafe: true,
  },
  {
    method: 'batchDeleteSubscriptions',
    rpc: 'batchDeleteTriggerSubscriptions',
    call: (t, o) =>
      t.batchDeleteSubscriptions('conn_1', { subscriptionIds: ['trgs_1'] }, o),
    retrySafe: true,
  },
  {
    method: 'getActivity',
    rpc: 'getTriggerActivity',
    call: (t, o) => t.getActivity(o),
    retrySafe: true,
  },
  {
    method: 'getUsage',
    rpc: 'getTriggerUsage',
    call: (t, o) => t.getUsage({ period: '24h' }, o),
    retrySafe: true,
  },
  {
    method: 'getIngressEndpoint',
    rpc: 'getTriggerIngressEndpoint',
    call: (t, o) => t.getIngressEndpoint('conn_1', o),
    retrySafe: true,
  },
  {
    method: 'createIngressEndpoint',
    rpc: 'createTriggerIngressEndpoint',
    call: (t, o) => t.createIngressEndpoint('conn_1', o),
    retrySafe: true,
  },
  {
    method: 'setSigningSecret',
    rpc: 'setTriggerSigningSecret',
    call: (t, o) =>
      t.setSigningSecret('conn_1', { signingSecret: 'provider-secret' }, o),
    retrySafe: false,
  },
  {
    method: 'confirmSigningSecretRotation',
    rpc: 'confirmTriggerSigningSecretRotation',
    call: (t, o) => t.confirmSigningSecretRotation('conn_1', {}, o),
    retrySafe: true,
  },
  {
    method: 'generateSigningSecret',
    rpc: 'generateTriggerSigningSecret',
    call: (t, o) => t.generateSigningSecret('conn_1', o),
    retrySafe: false,
  },
  {
    method: 'listDeliveryAttemptsByEndpoint',
    rpc: 'listTriggerDeliveryAttemptsByEndpoint',
    call: (t, o) => t.listDeliveryAttemptsByEndpoint('ep_1', {}, o),
    retrySafe: true,
  },
  {
    method: 'listDeliveries',
    rpc: 'listTriggerDeliveriesByEndpoint',
    call: (t, o) => t.listDeliveries('ep_1', {}, o),
    retrySafe: true,
  },
  {
    method: 'listDeliveryAttemptsByMessage',
    rpc: 'listTriggerDeliveryAttemptsByMessage',
    call: (t, o) => t.listDeliveryAttemptsByMessage('ep_1', 'msg_1', o),
    retrySafe: true,
  },
  {
    method: 'lookupDelivery',
    rpc: 'lookupTriggerDelivery',
    call: (t, o) => t.lookupDelivery('msg_1', o),
    retrySafe: true,
  },
  {
    method: 'batchLookupDeliveries',
    rpc: 'batchLookupTriggerDeliveries',
    call: (t, o) => t.batchLookupDeliveries({ deliveryIds: ['msg_1'] }, o),
    retrySafe: true,
  },
  {
    method: 'batchResendDeliveries',
    rpc: 'batchResendTriggerDeliveries',
    call: (t, o) =>
      t.batchResendDeliveries(
        { targets: [{ msgId: 'msg_1', endpointId: 'ep_1' }] },
        o
      ),
    retrySafe: false,
  },
  {
    method: 'recoverDeliveries',
    rpc: 'recoverTriggerDeliveries',
    call: (t, o) =>
      t.recoverDeliveries('ep_1', { since: '2026-10-27T00:00:00Z' }, o),
    retrySafe: false,
  },
];

// ---------------------------------------------------------------------------
// Surface and wiring
// ---------------------------------------------------------------------------

describe('scalekit.actions.triggers surface', () => {
  const scalekit = new ScalekitClient(
    'https://test.scalekit.dev',
    'skc_test',
    'test_secret'
  );

  it.each(METHODS.map((m) => m.method))('%s is a function', (method) => {
    expect(
      typeof (scalekit.actions.triggers as unknown as Record<string, unknown>)[
        method
      ]
    ).toBe('function');
  });

  it('keeps verifyEvent', () => {
    expect(typeof scalekit.actions.triggers.verifyEvent).toBe('function');
  });

  it('is wired to the transport (an aborted call reaches connectExec)', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      scalekit.actions.triggers.listAvailable('conn_1', {
        signal: controller.signal,
      })
    ).rejects.toBeInstanceOf(ScalekitAbortError);
  });
});

describe('a TriggersClient without a transport', () => {
  it.each(METHODS)('$method rejects with ScalekitException', async (m) => {
    const error = await m.call(new TriggersClient()).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ScalekitException);
    expect(error).not.toBeInstanceOf(ScalekitServerException);
    expect((error as Error).message).toContain('scalekit.actions.triggers');
  });

  it('is what a six-argument ActionsClient gets, and verifyEvent still works', async () => {
    const core = new CoreClient('https://test.scalekit.dev', 'id', 'secret');
    const grpcConnect = { createClient: () => ({}) } as any;
    const actions = new ActionsClient(
      new ToolsClient(grpcConnect, core),
      new ConnectedAccountsClient(grpcConnect, core),
      core,
      new ConnectionClient(grpcConnect, core),
      new McpClient(grpcConnect, core),
      new ProvidersClient(grpcConnect, core)
    );
    expect(typeof actions.triggers.verifyEvent).toBe('function');
    await expect(actions.triggers.getActivity()).rejects.toThrow(
      'scalekit.actions.triggers'
    );
  });

  it('uses the TriggersClient passed as the seventh ActionsClient argument', () => {
    const core = new CoreClient('https://test.scalekit.dev', 'id', 'secret');
    const grpcConnect = { createClient: () => ({}) } as any;
    const triggers = new TriggersClient(grpcConnect, core);
    const actions = new ActionsClient(
      new ToolsClient(grpcConnect, core),
      new ConnectedAccountsClient(grpcConnect, core),
      core,
      new ConnectionClient(grpcConnect, core),
      new McpClient(grpcConnect, core),
      new ProvidersClient(grpcConnect, core),
      triggers
    );
    expect(actions.triggers).toBe(triggers);
  });
});

// ---------------------------------------------------------------------------
// Request mapping
// ---------------------------------------------------------------------------

describe('request mapping', () => {
  it('listAvailable sends the connection', async () => {
    const { triggers, rpc } = setup();
    await triggers.listAvailable('conn_1');
    expect(rpc.listAvailableTriggers.mock.calls[0][0].connectionId).toBe(
      'conn_1'
    );
  });

  it('listEligibleAccounts sends every parameter, and defaults when omitted', async () => {
    const { triggers, rpc } = setup();
    await triggers.listEligibleAccounts('conn_1', 'item.created', {
      query: 'acme',
      pageSize: 500, // above the server cap: sent as is, the server caps it
      pageToken: 'tok',
    });
    await triggers.listEligibleAccounts('conn_1', 'item.created');
    const [full, bare] = rpc.listEligibleAccounts.mock.calls.map((c) => c[0]);
    expect(full).toMatchObject({
      connectionId: 'conn_1',
      triggerName: 'item.created',
      query: 'acme',
      pageSize: 500,
      pageToken: 'tok',
    });
    expect(bare).toMatchObject({ query: '', pageSize: 0, pageToken: '' });
  });

  it('listSubscriptions maps status names, raw numbers and defaults', async () => {
    const { triggers, rpc } = setup();
    await triggers.listSubscriptions('conn_1', {
      triggerName: 'item.created',
      statuses: [TriggerSubscriptionStatus.ACTIVE, 'PAUSED_CREDENTIAL', '9'],
      pageSize: 25,
      pageToken: 'tok',
    });
    await triggers.listSubscriptions('conn_1');
    const [full, bare] = rpc.listTriggerSubscriptions.mock.calls.map(
      (c) => c[0]
    );
    expect(full.statuses).toEqual([
      pb.TriggerSubscriptionStatus.ACTIVE,
      pb.TriggerSubscriptionStatus.PAUSED_CREDENTIAL,
      9,
    ]);
    expect(full).toMatchObject({
      triggerName: 'item.created',
      pageSize: 25,
      pageToken: 'tok',
    });
    expect(bare).toMatchObject({
      triggerName: '',
      statuses: [],
      pageSize: 0,
      pageToken: '',
    });
  });

  it('createSubscription sends the trigger, account, interval and config', async () => {
    const { triggers, rpc } = setup();
    await triggers.createSubscription('conn_1', 'item.created', {
      connectedAccountId: 'ca_1',
      intervalSeconds: 300,
      config: { channel: 'C1' },
    });
    await triggers.createSubscription('conn_1', 'item.created');
    const [full, bare] = rpc.createTriggerSubscription.mock.calls.map(
      (c) => c[0]
    );
    expect(full).toMatchObject({
      connectionId: 'conn_1',
      triggerName: 'item.created',
      connectedAccountId: 'ca_1',
      intervalSeconds: 300,
      config: { channel: 'C1' },
    });
    // A connection-scoped subscription: no account, default interval, no config.
    expect(bare).toMatchObject({
      connectedAccountId: '',
      intervalSeconds: 0,
      config: {},
    });
  });

  it('batchCreateSubscriptions sends the accounts, and allows an empty list', async () => {
    const { triggers, rpc } = setup();
    await triggers.batchCreateSubscriptions('conn_1', 'item.created', {
      connectedAccountIds: ['ca_1', 'ca_2'],
      intervalSeconds: 60,
      config: { k: 'v' },
    });
    await triggers.batchCreateSubscriptions('conn_1', 'item.created', {
      connectedAccountIds: [],
    });
    const [full, empty] = rpc.batchCreateTriggerSubscriptions.mock.calls.map(
      (c) => c[0]
    );
    expect(full).toMatchObject({
      connectedAccountIds: ['ca_1', 'ca_2'],
      intervalSeconds: 60,
      config: { k: 'v' },
    });
    expect(empty.connectedAccountIds).toEqual([]);
  });

  it('deleteSubscription sends both IDs and resolves to undefined', async () => {
    const { triggers, rpc } = setup();
    await expect(
      triggers.deleteSubscription('conn_1', 'trgs_1')
    ).resolves.toBeUndefined();
    expect(rpc.deleteTriggerSubscription.mock.calls[0][0]).toMatchObject({
      connectionId: 'conn_1',
      subscriptionId: 'trgs_1',
    });
  });

  it('batchDeleteSubscriptions sends whichever selector is given and leaves the server to judge it', async () => {
    const { triggers, rpc } = setup();
    await triggers.batchDeleteSubscriptions('conn_1', {
      subscriptionIds: ['trgs_1'],
    });
    await triggers.batchDeleteSubscriptions('conn_1', {
      triggerName: 'item.created',
      connectedAccountIds: ['ca_1'],
    });
    // Both selectors at once is the server's to refuse, not the SDK's.
    await triggers.batchDeleteSubscriptions('conn_1', {
      subscriptionIds: ['trgs_1'],
      triggerName: 'item.created',
    });
    const [ids, accounts, both] =
      rpc.batchDeleteTriggerSubscriptions.mock.calls.map((c) => c[0]);
    expect(ids).toMatchObject({
      subscriptionIds: ['trgs_1'],
      triggerName: '',
      connectedAccountIds: [],
    });
    expect(accounts).toMatchObject({
      subscriptionIds: [],
      triggerName: 'item.created',
      connectedAccountIds: ['ca_1'],
    });
    expect(both).toMatchObject({
      subscriptionIds: ['trgs_1'],
      triggerName: 'item.created',
    });
  });

  it('getUsage sends a period, or a date range, exactly as given', async () => {
    const { triggers, rpc } = setup();
    await triggers.getUsage({ period: '7d' });
    await triggers.getUsage({ from: '2026-10-01', to: '2026-10-28' });
    const [period, range] = rpc.getTriggerUsage.mock.calls.map((c) => c[0]);
    expect(period).toMatchObject({ period: '7d', from: '', to: '' });
    expect(range).toMatchObject({
      period: '',
      from: '2026-10-01',
      to: '2026-10-28',
    });
  });

  it('setSigningSecret sends the secret untrimmed (trimming is the server’s)', async () => {
    const { triggers, rpc } = setup();
    await triggers.setSigningSecret('conn_1', { signingSecret: '  s3cret  ' });
    expect(rpc.setTriggerSigningSecret.mock.calls[0][0].signingSecret).toBe(
      '  s3cret  '
    );
  });

  it('confirmSigningSecretRotation sends the rotation ID as int64, or leaves it unset', async () => {
    const { triggers, rpc } = setup();
    await triggers.confirmSigningSecretRotation('conn_1', {
      signingSecretRotationId: 3,
    });
    await triggers.confirmSigningSecretRotation('conn_1');
    const [withId, without] =
      rpc.confirmTriggerSigningSecretRotation.mock.calls.map((c) => c[0]);
    expect(withId.signingSecretRotationId).toBe(BigInt(3));
    expect(without.signingSecretRotationId).toBe(BigInt(0));
  });

  it('listDeliveryAttemptsByEndpoint sends the endpoint and page size', async () => {
    const { triggers, rpc } = setup();
    await triggers.listDeliveryAttemptsByEndpoint('ep_1', { pageSize: 5 });
    // Not every endpoint ID starts with ep_; the SDK checks no prefix.
    await triggers.listDeliveryAttemptsByEndpoint('custom-endpoint.1');
    const [first, second] =
      rpc.listTriggerDeliveryAttemptsByEndpoint.mock.calls.map((c) => c[0]);
    expect(first).toMatchObject({ endpointId: 'ep_1', pageSize: 5 });
    expect(second).toMatchObject({
      endpointId: 'custom-endpoint.1',
      pageSize: 0,
    });
  });

  it('listDeliveries maps the status, channel and both date forms', async () => {
    const { triggers, rpc } = setup();
    const after = new Date('2026-10-01T00:00:00.000Z');
    await triggers.listDeliveries('ep_1', {
      pageSize: 10,
      pageToken: 'tok',
      status: TriggerDeliveryStatus.FAILED,
      channel: 'trgs_1',
      after,
      before: '2026-10-02T12:30:00Z',
    });
    await triggers.listDeliveries('ep_1');
    const [full, bare] = rpc.listTriggerDeliveriesByEndpoint.mock.calls.map(
      (c) => c[0]
    );
    expect(full).toMatchObject({
      endpointId: 'ep_1',
      pageSize: 10,
      pageToken: 'tok',
      status: pb.TriggerDeliveryStatus.FAILED,
      channel: 'trgs_1',
    });
    expect(full.after).toEqual(timestampFromDate(after));
    expect(full.before).toEqual(
      timestampFromDate(new Date('2026-10-02T12:30:00Z'))
    );
    expect(bare).toMatchObject({
      pageSize: 0,
      pageToken: '',
      status: pb.TriggerDeliveryStatus.UNSPECIFIED,
      channel: '',
    });
    expect(bare.after).toBeUndefined();
    expect(bare.before).toBeUndefined();
  });

  it('listDeliveryAttemptsByMessage sends both IDs', async () => {
    const { triggers, rpc } = setup();
    await triggers.listDeliveryAttemptsByMessage('ep_1', 'msg_1');
    expect(
      rpc.listTriggerDeliveryAttemptsByMessage.mock.calls[0][0]
    ).toMatchObject({ endpointId: 'ep_1', msgId: 'msg_1' });
  });

  it('lookupDelivery sends the ID as id', async () => {
    const { triggers, rpc } = setup();
    await triggers.lookupDelivery('evt_dedupe_key');
    expect(rpc.lookupTriggerDelivery.mock.calls[0][0].id).toBe(
      'evt_dedupe_key'
    );
  });

  it('batchLookupDeliveries sends deliveryIds as ids', async () => {
    const { triggers, rpc } = setup();
    await triggers.batchLookupDeliveries({ deliveryIds: ['msg_1', 'evt_2'] });
    expect(rpc.batchLookupTriggerDeliveries.mock.calls[0][0].ids).toEqual([
      'msg_1',
      'evt_2',
    ]);
  });

  it('batchResendDeliveries sends each target', async () => {
    const { triggers, rpc } = setup();
    await triggers.batchResendDeliveries({
      targets: [
        { msgId: 'msg_1', endpointId: 'ep_1' },
        { msgId: 'msg_2', endpointId: 'ep_2' },
      ],
    });
    const sent = rpc.batchResendTriggerDeliveries.mock.calls[0][0].targets;
    expect(sent.map((t: any) => [t.msgId, t.endpointId])).toEqual([
      ['msg_1', 'ep_1'],
      ['msg_2', 'ep_2'],
    ]);
  });

  it('recoverDeliveries sends since, and until only when given', async () => {
    const { triggers, rpc } = setup();
    const since = new Date('2026-10-27T00:00:00Z');
    await triggers.recoverDeliveries('ep_1', {
      since,
      until: '2026-10-28T00:00:00Z',
    });
    await triggers.recoverDeliveries('ep_1', { since });
    const [full, bare] = rpc.recoverTriggerDeliveries.mock.calls.map(
      (c) => c[0]
    );
    expect(full.since).toEqual(timestampFromDate(since));
    expect(full.until).toEqual(
      timestampFromDate(new Date('2026-10-28T00:00:00Z'))
    );
    expect(bare.until).toBeUndefined();
  });

  it('forwards signal and timeoutMs to the call', async () => {
    const { triggers, rpc } = setup();
    const controller = new AbortController();
    await triggers.listAvailable('conn_1', {
      signal: controller.signal,
      timeoutMs: 1500,
    });
    const opts = rpc.listAvailableTriggers.mock.calls[0][1];
    expect(opts?.signal).toBe(controller.signal);
    expect(opts?.timeoutMs).toBe(1500);
    expect(opts).not.toHaveProperty('retryOnUnavailable');
  });

  it('does not check ID prefixes or trim whitespace', async () => {
    const { triggers, rpc } = setup();
    await triggers.listAvailable(' ');
    await triggers.deleteSubscription('connection-x', 'subscription-y');
    expect(rpc.listAvailableTriggers.mock.calls[0][0].connectionId).toBe(' ');
    expect(rpc.deleteTriggerSubscription.mock.calls[0][0]).toMatchObject({
      connectionId: 'connection-x',
      subscriptionId: 'subscription-y',
    });
  });
});

// ---------------------------------------------------------------------------
// Input checks: rejected before any request
// ---------------------------------------------------------------------------

describe('input checks', () => {
  const EMPTY_ID_CASES: Array<
    [string, RpcName, (t: TriggersClient) => Promise<unknown>]
  > = [
    [
      'listAvailable connectionId',
      'listAvailableTriggers',
      (t) => t.listAvailable(''),
    ],
    [
      'listEligibleAccounts connectionId',
      'listEligibleAccounts',
      (t) => t.listEligibleAccounts('', 'x'),
    ],
    [
      'listEligibleAccounts triggerName',
      'listEligibleAccounts',
      (t) => t.listEligibleAccounts('conn_1', ''),
    ],
    [
      'listSubscriptions connectionId',
      'listTriggerSubscriptions',
      (t) => t.listSubscriptions(''),
    ],
    [
      'createSubscription connectionId',
      'createTriggerSubscription',
      (t) => t.createSubscription('', 'x'),
    ],
    [
      'createSubscription triggerName',
      'createTriggerSubscription',
      (t) => t.createSubscription('conn_1', ''),
    ],
    [
      'batchCreateSubscriptions connectionId',
      'batchCreateTriggerSubscriptions',
      (t) => t.batchCreateSubscriptions('', 'x'),
    ],
    [
      'batchCreateSubscriptions triggerName',
      'batchCreateTriggerSubscriptions',
      (t) => t.batchCreateSubscriptions('conn_1', ''),
    ],
    [
      'deleteSubscription connectionId',
      'deleteTriggerSubscription',
      (t) => t.deleteSubscription('', 'trgs_1'),
    ],
    [
      'deleteSubscription subscriptionId',
      'deleteTriggerSubscription',
      (t) => t.deleteSubscription('conn_1', ''),
    ],
    [
      'batchDeleteSubscriptions connectionId',
      'batchDeleteTriggerSubscriptions',
      (t) => t.batchDeleteSubscriptions('', {}),
    ],
    [
      'getIngressEndpoint connectionId',
      'getTriggerIngressEndpoint',
      (t) => t.getIngressEndpoint(''),
    ],
    [
      'createIngressEndpoint connectionId',
      'createTriggerIngressEndpoint',
      (t) => t.createIngressEndpoint(''),
    ],
    [
      'setSigningSecret connectionId',
      'setTriggerSigningSecret',
      (t) => t.setSigningSecret('', { signingSecret: 'x' }),
    ],
    [
      'confirmSigningSecretRotation connectionId',
      'confirmTriggerSigningSecretRotation',
      (t) => t.confirmSigningSecretRotation(''),
    ],
    [
      'generateSigningSecret connectionId',
      'generateTriggerSigningSecret',
      (t) => t.generateSigningSecret(''),
    ],
    [
      'listDeliveryAttemptsByEndpoint endpointId',
      'listTriggerDeliveryAttemptsByEndpoint',
      (t) => t.listDeliveryAttemptsByEndpoint(''),
    ],
    [
      'listDeliveries endpointId',
      'listTriggerDeliveriesByEndpoint',
      (t) => t.listDeliveries(''),
    ],
    [
      'listDeliveryAttemptsByMessage endpointId',
      'listTriggerDeliveryAttemptsByMessage',
      (t) => t.listDeliveryAttemptsByMessage('', 'msg_1'),
    ],
    [
      'listDeliveryAttemptsByMessage msgId',
      'listTriggerDeliveryAttemptsByMessage',
      (t) => t.listDeliveryAttemptsByMessage('ep_1', ''),
    ],
    [
      'lookupDelivery deliveryId',
      'lookupTriggerDelivery',
      (t) => t.lookupDelivery(''),
    ],
    [
      'recoverDeliveries endpointId',
      'recoverTriggerDeliveries',
      (t) => t.recoverDeliveries('', { since: new Date() }),
    ],
  ];

  it.each(EMPTY_ID_CASES)(
    'rejects an empty %s without a request',
    async (_label, rpcName, call) => {
      const { triggers, rpc } = setup();
      await expect(call(triggers)).rejects.toBeInstanceOf(
        ScalekitValidationError
      );
      expect(rpc[rpcName]).not.toHaveBeenCalled();
    }
  );

  it('rejects a non-string ID (JavaScript callers)', async () => {
    const { triggers } = setup();
    await expect(
      triggers.listAvailable(undefined as unknown as string)
    ).rejects.toThrow('connectionId is required');
  });

  it('rejects an unknown status name, which cannot be encoded', async () => {
    const { triggers, rpc } = setup();
    const error = await triggers
      .listSubscriptions('conn_1', { statuses: ['BOGUS'] })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ScalekitValidationError);
    expect((error as Error).message).toContain('ACTIVE');
    await expect(
      triggers.listDeliveries('ep_1', { status: 'delivered' })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    expect(rpc.listTriggerSubscriptions).not.toHaveBeenCalled();
    expect(rpc.listTriggerDeliveriesByEndpoint).not.toHaveBeenCalled();
  });

  it('rejects a non-integral interval', async () => {
    const { triggers, rpc } = setup();
    await expect(
      triggers.createSubscription('conn_1', 'x', { intervalSeconds: 1.5 })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    await expect(
      triggers.batchCreateSubscriptions('conn_1', 'x', {
        intervalSeconds: Number.NaN,
      })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    expect(rpc.createTriggerSubscription).not.toHaveBeenCalled();
    expect(rpc.batchCreateTriggerSubscriptions).not.toHaveBeenCalled();
  });

  it('leaves interval limits to the server', async () => {
    const { triggers, rpc } = setup();
    await triggers.createSubscription('conn_1', 'x', { intervalSeconds: 1 });
    expect(rpc.createTriggerSubscription.mock.calls[0][0].intervalSeconds).toBe(
      1
    );
  });

  it('rejects a rotation ID that is not a safe integer', async () => {
    const { triggers, rpc } = setup();
    await expect(
      triggers.confirmSigningSecretRotation('conn_1', {
        signingSecretRotationId: 2 ** 60,
      })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    await expect(
      triggers.confirmSigningSecretRotation('conn_1', {
        signingSecretRotationId: 1.5,
      })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    expect(rpc.confirmTriggerSigningSecretRotation).not.toHaveBeenCalled();
  });

  it('rejects invalid dates and a missing since', async () => {
    const { triggers, rpc } = setup();
    await expect(
      triggers.listDeliveries('ep_1', { after: 'not a date' })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    await expect(
      triggers.listDeliveries('ep_1', { before: new Date('nope') })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    await expect(
      triggers.recoverDeliveries(
        'ep_1',
        {} as unknown as { since: Date | string }
      )
    ).rejects.toThrow('since is required');
    await expect(
      triggers.recoverDeliveries('ep_1', { since: 'yesterday-ish' })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    expect(rpc.listTriggerDeliveriesByEndpoint).not.toHaveBeenCalled();
    expect(rpc.recoverTriggerDeliveries).not.toHaveBeenCalled();
  });

  it('rejects config values that are not strings', async () => {
    const { triggers, rpc } = setup();
    await expect(
      triggers.createSubscription('conn_1', 'x', {
        config: { limit: 5 } as unknown as Record<string, string>,
      })
    ).rejects.toThrow('config.limit must be a string');
    await expect(
      triggers.batchCreateSubscriptions('conn_1', 'x', {
        config: ['a'] as unknown as Record<string, string>,
      })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    expect(rpc.createTriggerSubscription).not.toHaveBeenCalled();
    expect(rpc.batchCreateTriggerSubscriptions).not.toHaveBeenCalled();
  });

  it('rejects resend targets whose fields are not strings', async () => {
    const { triggers, rpc } = setup();
    for (const target of [
      { msgId: 'msg_1' },
      { msgId: 1, endpointId: 'ep_1' },
      null,
    ]) {
      await expect(
        triggers.batchResendDeliveries({
          targets: [
            { msgId: 'msg_0', endpointId: 'ep_0' },
            target as unknown as { msgId: string; endpointId: string },
          ],
        })
      ).rejects.toThrow('targets[1] must have string msgId and endpointId');
    }
    expect(rpc.batchResendTriggerDeliveries).not.toHaveBeenCalled();
  });

  it('sends empty strings in config and targets as given (the server judges them)', async () => {
    const { triggers, rpc } = setup();
    await triggers.createSubscription('conn_1', 'x', { config: { k: '' } });
    await triggers.batchResendDeliveries({
      targets: [{ msgId: '', endpointId: '' }],
    });
    expect(rpc.createTriggerSubscription.mock.calls[0][0].config).toEqual({
      k: '',
    });
    expect(rpc.batchResendTriggerDeliveries).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['2026-10-28T10:00:00', 'no offset: local time'],
    ['2026-10-28', 'a date without a time'],
    ['2026-02-30T00:00:00Z', 'a day that does not exist'],
    ['2026-10-28 10:00:00Z', 'a space instead of T'],
    ['1730109600000', 'epoch milliseconds'],
  ])(
    'rejects the date-time string %p (%s) for after, before, since and until',
    async (value) => {
      const { triggers, rpc } = setup();
      for (const call of [
        () => triggers.listDeliveries('ep_1', { after: value }),
        () => triggers.listDeliveries('ep_1', { before: value }),
        () => triggers.recoverDeliveries('ep_1', { since: value }),
        () =>
          triggers.recoverDeliveries('ep_1', {
            since: new Date(0),
            until: value,
          }),
      ]) {
        await expect(call()).rejects.toThrow('with Z or an offset');
      }
      expect(rpc.listTriggerDeliveriesByEndpoint).not.toHaveBeenCalled();
      expect(rpc.recoverTriggerDeliveries).not.toHaveBeenCalled();
    }
  );

  it('accepts date-time strings with Z or an offset, and Date objects, as the same instant', async () => {
    const { triggers, rpc } = setup();
    const instant = new Date('2026-10-28T04:30:00.000Z');
    await triggers.listDeliveries('ep_1', {
      after: '2026-10-28T10:00:00+05:30',
      before: '2026-10-28t04:30Z',
    });
    await triggers.recoverDeliveries('ep_1', {
      since: instant,
      until: '2026-10-28T04:30:00.000-00:00',
    });
    const list = rpc.listTriggerDeliveriesByEndpoint.mock.calls[0][0];
    const recover = rpc.recoverTriggerDeliveries.mock.calls[0][0];
    for (const ts of [list.after, list.before, recover.since, recover.until]) {
      expect(ts).toEqual(timestampFromDate(instant));
    }
  });

  it.each([
    '2026-02-30',
    '2026-10-1',
    '20261029',
    '',
    '2026-10-28T00:00:00Z',
    '2026-13-01',
  ])('rejects the usage date %p before the request', async (value) => {
    const { triggers, rpc } = setup();
    await expect(
      triggers.getUsage({ from: value, to: '2026-10-28' })
    ).rejects.toThrow('from must be a calendar date as YYYY-MM-DD');
    await expect(
      triggers.getUsage({ from: '2026-10-01', to: value })
    ).rejects.toThrow('to must be a calendar date as YYYY-MM-DD');
    expect(rpc.getTriggerUsage).not.toHaveBeenCalled();
  });

  it('sends real usage dates, including a leap day, unchanged', async () => {
    const { triggers, rpc } = setup();
    await triggers.getUsage({ from: '2028-02-29', to: '2028-03-01' });
    expect(rpc.getTriggerUsage.mock.calls[0][0]).toMatchObject({
      from: '2028-02-29',
      to: '2028-03-01',
    });
  });

  it('rejects a page size that cannot be encoded', async () => {
    const { triggers } = setup();
    await expect(
      triggers.listDeliveries('ep_1', { pageSize: -1 })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
    await expect(
      triggers.listSubscriptions('conn_1', { pageSize: 2.5 })
    ).rejects.toBeInstanceOf(ScalekitValidationError);
  });

  it('rejects missing required params objects', async () => {
    const { triggers } = setup();
    for (const call of [
      () => triggers.getUsage(undefined as any),
      () => triggers.setSigningSecret('conn_1', undefined as any),
      () => triggers.batchDeleteSubscriptions('conn_1', undefined as any),
      () => triggers.batchLookupDeliveries(undefined as any),
      () => triggers.batchLookupDeliveries({ deliveryIds: 'msg_1' } as any),
      () => triggers.batchResendDeliveries({} as any),
    ]) {
      await expect(call()).rejects.toBeInstanceOf(ScalekitValidationError);
    }
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects options.timeoutMs %p',
    async (timeoutMs) => {
      const { triggers, rpc } = setup();
      await expect(
        triggers.listAvailable('conn_1', { timeoutMs })
      ).rejects.toBeInstanceOf(ScalekitValidationError);
      expect(rpc.listAvailableTriggers).not.toHaveBeenCalled();
    }
  );
});

// ---------------------------------------------------------------------------
// Response mapping
// ---------------------------------------------------------------------------

const CREATED = new Date('2026-10-20T10:00:00.000Z');

function subscriptionMessage(
  overrides: Omit<
    MessageInitShape<typeof pb.TriggerSubscriptionSchema>,
    '$typeName'
  > = {}
) {
  return create(pb.TriggerSubscriptionSchema, {
    id: 'trgs_1',
    connectedAccountId: 'ca_1',
    connectionId: 'conn_1',
    provider: 'EXAMPLE',
    triggerName: 'item.created',
    status: pb.TriggerSubscriptionStatus.ACTIVE,
    requestedIntervalSeconds: 300,
    effectiveIntervalSeconds: 600,
    config: { channel: 'C1' },
    deliveryScope: pb.TriggerDeliveryScope.ACCOUNT,
    connectedAccountIdentifier: 'user@example.com',
    createdAt: timestampFromDate(CREATED),
    ...overrides,
  });
}

describe('response mapping', () => {
  it('maps the trigger catalogue, with unset enums and zero intervals as undefined', async () => {
    const { triggers } = setup({
      listAvailableTriggers: create(pb.ListAvailableTriggersResponseSchema, {
        connectionUsesSharedApp: true,
        triggers: [
          {
            name: 'item.polled',
            mode: pb.TriggerMode.POLL,
            requiredScopes: [{ scope: 'read', grant: 'user' }],
            minIntervalSeconds: 60,
            defaultIntervalSeconds: 300,
            configFields: [
              {
                key: 'channel',
                displayName: 'Channel',
                helpText: 'h',
                placeholder: 'p',
                required: true,
              },
            ],
            available: true,
            deliveryScope: pb.TriggerDeliveryScope.CONNECTION,
            platformCredentials: pb.TriggerPlatformCredentials.SUPPORTED,
          },
          {
            name: 'item.pushed',
            mode: pb.TriggerMode.WEBHOOK,
            available: false,
            reason: 'needs your own app',
            remedy: 'switch apps',
            refusalCode: pb.TriggerRefusalCode.SHARED_APP,
            providesBearerSecret: true,
          },
          {
            name: 'future',
            mode: 7 as pb.TriggerMode,
            deliveryScope: 9 as pb.TriggerDeliveryScope,
          },
        ],
      }),
    });
    const catalog = await triggers.listAvailable('conn_1');
    expect(catalog.connectionUsesSharedApp).toBe(true);
    const [polled, pushed, future] = catalog.triggers;
    expect(polled).toMatchObject({
      name: 'item.polled',
      mode: 'poll',
      requiredScopes: [{ scope: 'read', grant: 'user' }],
      minIntervalSeconds: 60,
      defaultIntervalSeconds: 300,
      deliveryScope: 'connection',
      platformCredentials: 'SUPPORTED',
      refusalCode: undefined,
    });
    expect(polled.configFields[0]).toEqual({
      key: 'channel',
      displayName: 'Channel',
      helpText: 'h',
      placeholder: 'p',
      required: true,
    });
    expect(pushed).toMatchObject({
      mode: 'webhook',
      minIntervalSeconds: undefined,
      defaultIntervalSeconds: undefined,
      deliveryScope: undefined,
      platformCredentials: undefined,
      refusalCode: 'SHARED_APP',
      reason: 'needs your own app',
      providesBearerSecret: true,
    });
    // Values newer than this SDK pass through as decimal strings.
    expect(future.mode).toBe('7');
    expect(future.deliveryScope).toBe('9');
    expect(JSON.stringify(catalog)).not.toContain('$typeName');
  });

  it('maps eligible accounts, health and empty page tokens', async () => {
    const { triggers } = setup({
      listEligibleAccounts: create(pb.ListEligibleAccountsResponseSchema, {
        accounts: [
          {
            id: 'ca_1',
            identifier: 'a@example.com',
            eligible: false,
            reason: 'scope missing',
            remedy: 'reconnect',
            health: {
              state: pb.AccountHealthState.NEEDS_REAUTHENTICATION,
              action: pb.AccountHealthAction.RECONNECT,
              blocksToolCalls: true,
            },
          },
          { id: 'ca_2', eligible: true },
        ],
        nextPageToken: 'next',
        prevPageToken: '',
        totalSize: 2,
      }),
    });
    const page = await triggers.listEligibleAccounts('conn_1', 'x');
    expect(page.nextPageToken).toBe('next');
    expect(page.prevPageToken).toBeUndefined();
    expect(page.totalSize).toBe(2);
    expect(page.accounts[0].health).toEqual({
      state: 'NEEDS_REAUTHENTICATION',
      reason: '',
      remedy: '',
      action: 'RECONNECT',
      blocksToolCalls: true,
    });
    expect(page.accounts[1].health).toBeUndefined();
  });

  it('maps a subscription: enums, Date, intervals, poll state and account health', async () => {
    const lastRun = new Date('2026-10-28T09:00:00.000Z');
    const { triggers } = setup({
      createTriggerSubscription: subscriptionMessage({
        pollState: {
          lastRunAt: timestampFromDate(lastRun),
          lastError: 'rate limited',
          consecutiveFailures: 2,
          lastErrorCode: pb.TriggerPollErrorCode.RATE_LIMITED,
        },
        accountHealth: pb.AccountHealthState.READY,
      }),
    });
    const sub = await triggers.createSubscription('conn_1', 'item.created', {
      connectedAccountId: 'ca_1',
    });
    expect(sub).toMatchObject({
      id: 'trgs_1',
      status: 'ACTIVE',
      requestedIntervalSeconds: 300,
      effectiveIntervalSeconds: 600,
      config: { channel: 'C1' },
      deliveryScope: 'account',
      accountHealth: 'READY',
    });
    expect(sub.createdAt).toEqual(CREATED);
    expect(sub.pollState).toEqual({
      lastRunAt: lastRun,
      lastError: 'rate limited',
      consecutiveFailures: 2,
      backoffUntil: undefined,
      watermarkUpdatedAt: undefined,
      lastErrorCode: 'RATE_LIMITED',
    });
  });

  it('maps unset and unknown subscription values', async () => {
    const { triggers } = setup({
      createTriggerSubscription: subscriptionMessage({
        status: 42 as pb.TriggerSubscriptionStatus,
        requestedIntervalSeconds: 0,
        effectiveIntervalSeconds: 0,
        deliveryScope:
          pb.TriggerDeliveryScope.TRIGGER_DELIVERY_SCOPE_UNSPECIFIED,
        createdAt: undefined,
        accountHealth: pb.AccountHealthState.ACCOUNT_HEALTH_STATE_UNSPECIFIED,
      }),
    });
    const sub = await triggers.createSubscription('conn_1', 'item.created');
    expect(sub.status).toBe('42');
    expect(sub.requestedIntervalSeconds).toBeUndefined();
    expect(sub.effectiveIntervalSeconds).toBeUndefined();
    expect(sub.deliveryScope).toBeUndefined();
    expect(sub.createdAt).toBeUndefined();
    expect(sub.pollState).toBeUndefined();
    expect(sub.accountHealth).toBeUndefined();
  });

  it('maps a subscription page with status counts and tokens', async () => {
    const { triggers } = setup({
      listTriggerSubscriptions: create(
        pb.ListTriggerSubscriptionsResponseSchema,
        {
          subscriptions: [subscriptionMessage()],
          nextPageToken: '',
          prevPageToken: 'prev',
          totalSize: 7,
          statusCounts: { ACTIVE: 5, PAUSED_CREDENTIAL: 2 },
        }
      ),
    });
    const page = await triggers.listSubscriptions('conn_1');
    expect(page.subscriptions).toHaveLength(1);
    expect(page.nextPageToken).toBeUndefined();
    expect(page.prevPageToken).toBe('prev');
    expect(page.totalSize).toBe(7);
    expect(page.statusCounts).toEqual({ ACTIVE: 5, PAUSED_CREDENTIAL: 2 });
  });

  it('reports batch create outcomes per account and never throws for them', async () => {
    const { triggers } = setup({
      batchCreateTriggerSubscriptions: create(
        pb.BatchCreateTriggerSubscriptionsResponseSchema,
        {
          results: [
            {
              connectedAccountId: 'ca_1',
              outcome: pb.BatchSubscribeOutcome.CREATED,
              subscription: subscriptionMessage(),
            },
            {
              connectedAccountId: 'ca_2',
              outcome: pb.BatchSubscribeOutcome.REFUSED,
              reason: 'missing scope',
            },
            {
              connectedAccountId: 'ca_3',
              outcome: pb.BatchSubscribeOutcome.NOT_FOUND,
              reason: 'connected account not found',
            },
            {
              connectedAccountId: 'ca_4',
              outcome: 12 as pb.BatchSubscribeOutcome,
            },
          ],
          createdCount: 1,
        }
      ),
    });
    const result = await triggers.batchCreateSubscriptions('conn_1', 'x', {
      connectedAccountIds: ['ca_1', 'ca_2', 'ca_3', 'ca_4'],
    });
    expect(result.createdCount).toBe(1);
    expect(result.results.map((r) => r.outcome)).toEqual([
      TriggerSubscribeOutcome.CREATED,
      'REFUSED',
      'NOT_FOUND',
      '12',
    ]);
    expect(result.results[0].subscription?.id).toBe('trgs_1');
    expect(result.results[1].subscription).toBeUndefined();
    expect(result.results[1].reason).toBe('missing scope');
  });

  it('reports batch delete outcomes per subscription', async () => {
    const { triggers } = setup({
      batchDeleteTriggerSubscriptions: create(
        pb.BatchDeleteTriggerSubscriptionsResponseSchema,
        {
          results: [
            {
              subscriptionId: 'trgs_1',
              outcome: pb.BatchDeleteOutcome.DELETED,
            },
            {
              subscriptionId: 'trgs_2',
              outcome: pb.BatchDeleteOutcome.NOT_FOUND,
            },
            {
              subscriptionId: 'trgs_3',
              outcome: pb.BatchDeleteOutcome.NOT_ATTEMPTED,
            },
            { subscriptionId: 'trgs_4', outcome: 0 },
          ],
          deletedCount: 1,
        }
      ),
    });
    const result = await triggers.batchDeleteSubscriptions('conn_1', {
      subscriptionIds: ['trgs_1', 'trgs_2', 'trgs_3', 'trgs_4'],
    });
    expect(result.results.map((r) => r.outcome)).toEqual([
      'DELETED',
      'NOT_FOUND',
      'NOT_ATTEMPTED',
      undefined,
    ]);
    expect(result.deletedCount).toBe(1);
  });

  it('maps activity: int64 counts to numbers and hours to seconds', async () => {
    const { triggers } = setup({
      getTriggerActivity: create(pb.GetTriggerActivityResponseSchema, {
        counts: {
          received: BigInt(120),
          delivered: BigInt(88),
          filtered: BigInt(0),
        },
        windowHours: 24,
        signatureBanner: true,
        degraded: false,
        deliveryDetailsPath: '/trigger-delivery',
      }),
    });
    const activity = await triggers.getActivity();
    expect(activity).toEqual({
      counts: { received: 120, delivered: 88, filtered: 0 },
      windowSeconds: 86400,
      signatureBanner: true,
      degraded: false,
      explainsIndividualEvents: false,
      deliveryDetailsPath: '/trigger-delivery',
    });
    // No bigint anywhere: serialisable as is.
    expect(() => JSON.stringify(activity)).not.toThrow();
  });

  it('refuses an int64 count that a number cannot hold exactly', async () => {
    const { triggers } = setup({
      getTriggerActivity: create(pb.GetTriggerActivityResponseSchema, {
        counts: { received: BigInt('1152921504606846976') },
      }),
    });
    await expect(triggers.getActivity()).rejects.toBeInstanceOf(
      ScalekitException
    );
  });

  it('maps hourly usage: instants to Date, dates kept as strings', async () => {
    const { triggers } = setup({
      getTriggerUsage: create(pb.GetTriggerUsageResponseSchema, {
        from: '2026-10-27',
        to: '2026-10-28',
        today: '2026-10-28',
        period: '24h',
        bucket: pb.TriggerUsageBucket.HOUR,
        hours: [{ start: '2026-10-28T09:00:00Z', units: BigInt(38) }],
        currentHour: '2026-10-28T10:00:00Z',
      }),
    });
    const usage = await triggers.getUsage({ period: '24h' });
    expect(usage).toEqual({
      from: '2026-10-27',
      to: '2026-10-28',
      today: '2026-10-28',
      period: '24h',
      bucket: 'HOUR',
      days: [],
      hours: [{ start: new Date('2026-10-28T09:00:00Z'), units: 38 }],
      currentHour: new Date('2026-10-28T10:00:00Z'),
    });
  });

  it('maps daily usage for a date range: no period, no bucket, no current hour', async () => {
    const { triggers } = setup({
      getTriggerUsage: create(pb.GetTriggerUsageResponseSchema, {
        from: '2026-10-01',
        to: '2026-10-02',
        today: '2026-10-28',
        days: [{ date: '2026-10-02', units: BigInt(5) }],
      }),
    });
    const usage = await triggers.getUsage({
      from: '2026-10-01',
      to: '2026-10-02',
    });
    expect(usage.period).toBeUndefined();
    expect(usage.bucket).toBeUndefined();
    expect(usage.currentHour).toBeUndefined();
    expect(usage.days).toEqual([{ date: '2026-10-02', units: 5 }]);
  });

  it('maps empty or unreadable usage instants to undefined instead of failing the call', async () => {
    const { triggers } = setup({
      getTriggerUsage: create(pb.GetTriggerUsageResponseSchema, {
        period: '24h',
        bucket: pb.TriggerUsageBucket.HOUR,
        hours: [
          { start: '2026-10-28T08:00:00Z', units: BigInt(1) },
          { start: '', units: BigInt(2) },
          { start: 'not a time', units: BigInt(3) },
          // No offset: would be read in local time, so it is not trusted.
          { start: '2026-10-28T09:00:00', units: BigInt(4) },
        ],
        currentHour: '2026-13-01T00:00:00Z',
      }),
    });
    const usage = await triggers.getUsage({ period: '24h' });
    expect(usage.hours.map((h) => h.start)).toEqual([
      new Date('2026-10-28T08:00:00Z'),
      undefined,
      undefined,
      undefined,
    ]);
    expect(usage.hours.map((h) => h.units)).toEqual([1, 2, 3, 4]);
    expect(usage.currentHour).toBeUndefined();
  });

  it('maps empty usage dates to undefined and keeps non-empty ones unchanged', async () => {
    const { triggers } = setup({
      getTriggerUsage: create(pb.GetTriggerUsageResponseSchema, {
        from: '',
        to: '2026-10-28',
        today: '',
        days: [
          { date: '', units: BigInt(1) },
          { date: '2026-10-27', units: BigInt(2) },
        ],
      }),
    });
    const usage = await triggers.getUsage({
      from: '2026-10-01',
      to: '2026-10-28',
    });
    expect(usage.from).toBeUndefined();
    expect(usage.to).toBe('2026-10-28');
    expect(usage.today).toBeUndefined();
    expect(usage.days).toEqual([
      { date: undefined, units: 1 },
      { date: '2026-10-27', units: 2 },
    ]);
  });

  it('redacts the webhook URL when an endpoint is logged, but keeps it for reading and serialising', async () => {
    const URL = 'https://example.invalid/hook/tok_ENDPOINT-TOKEN-MARKER';
    const { triggers } = setup({
      getTriggerIngressEndpoint: create(pb.TriggerIngressEndpointSchema, {
        id: 'ing_1',
        url: URL,
        maskedSigningSecret: '****abcd',
      }),
    });
    const endpoint = await triggers.getIngressEndpoint('conn_1');
    expect(endpoint.url).toBe(URL);
    const printed = util.inspect(endpoint, { depth: 5 });
    expect(printed).not.toContain('ENDPOINT-TOKEN-MARKER');
    expect(printed).toContain('[redacted]');
    expect(printed).toContain('ing_1');
    expect(printed).toContain('****abcd');
    expect(util.inspect([endpoint], { depth: 5 })).not.toContain(
      'ENDPOINT-TOKEN-MARKER'
    );
    expect({ ...endpoint }.url).toBe(URL);
    expect(JSON.parse(JSON.stringify(endpoint)).url).toBe(URL);
    expect(Object.keys(endpoint)).toContain('url');
  });

  it('redacts the webhook URL of the endpoint nested in a generated secret', async () => {
    const URL = 'https://example.invalid/hook/tok_NESTED-TOKEN-MARKER';
    const { triggers } = setup({
      generateTriggerSigningSecret: create(
        pb.GenerateTriggerSigningSecretResponseSchema,
        {
          endpoint: { id: 'ing_1', url: URL },
          signingSecret: 'whsec_S',
          urlWithSecret: `${URL}/whsec_S`,
        }
      ),
    });
    const generated = await triggers.generateSigningSecret('conn_1');
    const printed = util.inspect(generated, { depth: 5 });
    expect(printed).not.toContain('NESTED-TOKEN-MARKER');
    expect(printed).toContain('ing_1');
    expect(generated.endpoint?.url).toBe(URL);
  });

  it('maps an ingress endpoint, with the rotation ID as a number', async () => {
    const expires = new Date('2026-10-29T00:00:00.000Z');
    const { triggers } = setup({
      getTriggerIngressEndpoint: create(pb.TriggerIngressEndpointSchema, {
        id: 'ing_1',
        connectionId: 'conn_1',
        url: 'https://example.invalid/hook',
        signingSecretConfigured: true,
        maskedSigningSecret: '****abcd',
        rotationInProgress: true,
        previousSigningSecretExpiresAt: timestampFromDate(expires),
        signingSecretRotationId: BigInt(3),
      }),
    });
    const endpoint = await triggers.getIngressEndpoint('conn_1');
    expect(endpoint).toEqual({
      id: 'ing_1',
      connectionId: 'conn_1',
      url: 'https://example.invalid/hook',
      signingSecretConfigured: true,
      maskedSigningSecret: '****abcd',
      rotationInProgress: true,
      previousSigningSecretExpiresAt: expires,
      signingSecretRotationId: 3,
    });
    const fresh = await setup().triggers.createIngressEndpoint('conn_1');
    expect(fresh.previousSigningSecretExpiresAt).toBeUndefined();
    expect(fresh.signingSecretRotationId).toBe(0);
  });

  it('redacts a generated signing secret when logged, but keeps it for reading and serialising', async () => {
    const SECRET = 'whsec_GENERATED-SECRET-MARKER';
    const URL_WITH_SECRET = `https://example.invalid/hook/${SECRET}`;
    const { triggers } = setup({
      generateTriggerSigningSecret: create(
        pb.GenerateTriggerSigningSecretResponseSchema,
        {
          endpoint: { id: 'ing_1', connectionId: 'conn_1' },
          signingSecret: SECRET,
          urlWithSecret: URL_WITH_SECRET,
        }
      ),
    });
    const generated = await triggers.generateSigningSecret('conn_1');
    expect(generated.signingSecret).toBe(SECRET);
    expect(generated.urlWithSecret).toBe(URL_WITH_SECRET);
    expect(generated.endpoint?.id).toBe('ing_1');

    // console.log / util.inspect: redacted, the endpoint still shown.
    const printed = util.inspect(generated, { depth: 5 });
    expect(printed).not.toContain(SECRET);
    expect(printed).toContain('[redacted]');
    expect(printed).toContain('ing_1');
    expect(util.format('%o', generated)).not.toContain(SECRET);
    expect(util.inspect({ wrapped: generated }, { depth: 5 })).not.toContain(
      SECRET
    );

    // Ordinary enumerable data otherwise: spreading and JSON keep the values.
    expect(Object.keys(generated)).toEqual([
      'endpoint',
      'signingSecret',
      'urlWithSecret',
    ]);
    expect({ ...generated }.signingSecret).toBe(SECRET);
    const json = JSON.parse(JSON.stringify(generated));
    expect(json.signingSecret).toBe(SECRET);
    expect(json.urlWithSecret).toBe(URL_WITH_SECRET);
  });

  it('maps deliveries and attempts', async () => {
    const at = new Date('2026-10-28T08:00:00.000Z');
    const attempt = {
      id: 'atmpt_1',
      endpointId: 'ep_1',
      msgId: 'msg_1',
      status: pb.TriggerDeliveryAttemptStatus.FAIL,
      responseStatusCode: 500,
      response: 'oops',
      timestamp: timestampFromDate(at),
      responseDurationMs: 0,
      triggerType: pb.TriggerDeliveryAttemptTriggerType.MANUAL,
      responseTruncated: true,
      endpointUrl: 'https://example.invalid/receiver',
    };
    const { triggers } = setup({
      listTriggerDeliveriesByEndpoint: create(
        pb.ListTriggerDeliveriesByEndpointResponseSchema,
        {
          deliveries: [
            {
              msgId: 'msg_1',
              eventId: 'evt_1',
              messageTimestamp: timestampFromDate(at),
              status: pb.TriggerDeliveryStatus.RETRYING,
              nextAttemptAt: timestampFromDate(at),
              triggerMode: pb.TriggerMode.WEBHOOK,
              endpointId: 'ep_1',
            },
          ],
          nextPageToken: '',
        }
      ),
      listTriggerDeliveryAttemptsByEndpoint: create(
        pb.ListTriggerDeliveryAttemptsByEndpointResponseSchema,
        { attempts: [attempt] }
      ),
      listTriggerDeliveryAttemptsByMessage: create(
        pb.ListTriggerDeliveryAttemptsByMessageResponseSchema,
        { attempts: [attempt], truncated: true }
      ),
    });
    const page = await triggers.listDeliveries('ep_1');
    expect(page.nextPageToken).toBeUndefined();
    expect(page.deliveries[0]).toMatchObject({
      msgId: 'msg_1',
      eventId: 'evt_1',
      messageTimestamp: at,
      status: 'RETRYING',
      nextAttemptAt: at,
      triggerMode: 'webhook',
    });
    const { attempts } = await triggers.listDeliveryAttemptsByEndpoint('ep_1');
    expect(attempts[0]).toEqual({
      id: 'atmpt_1',
      endpointId: 'ep_1',
      msgId: 'msg_1',
      status: 'FAIL',
      responseStatusCode: 500,
      response: 'oops',
      timestamp: at,
      responseDurationMs: 0, // a measured duration keeps 0
      triggerType: 'MANUAL',
      responseTruncated: true,
      endpointUrl: 'https://example.invalid/receiver',
    });
    const byMessage = await triggers.listDeliveryAttemptsByMessage(
      'ep_1',
      'msg_1'
    );
    expect(byMessage.truncated).toBe(true);
    expect(byMessage.attempts).toHaveLength(1);
  });

  it('maps a delivery lookup to exactly its eleven fields', async () => {
    const { triggers } = setup({
      lookupTriggerDelivery: create(pb.LookupTriggerDeliveryResponseSchema, {
        msgId: 'msg_1',
        eventId: 'evt_1',
        triggerMode: pb.TriggerMode.POLL,
        attempts: [{ id: 'atmpt_1' }],
        truncated: false,
      }),
    });
    const details = await triggers.lookupDelivery('msg_1');
    expect(Object.keys(details).sort()).toEqual(
      [
        'msgId',
        'eventId',
        'messageTimestamp',
        'subscriptionId',
        'triggerName',
        'triggerMode',
        'connectionId',
        'connectionProvider',
        'connectionKeyId',
        'attempts',
        'truncated',
      ].sort()
    );
    expect(details.triggerMode).toBe('poll');
    expect(details.messageTimestamp).toBeUndefined();
    expect(details.attempts[0].status).toBeUndefined();
  });

  it('reports batch lookup and resend outcomes per item', async () => {
    const { triggers } = setup({
      batchLookupTriggerDeliveries: create(
        pb.BatchLookupTriggerDeliveriesResponseSchema,
        {
          results: [
            {
              id: 'msg_1',
              outcome: pb.BatchLookupOutcome.FOUND,
              delivery: { msgId: 'msg_1' },
            },
            { id: 'msg_2', outcome: pb.BatchLookupOutcome.RATE_LIMITED },
            { id: 'msg_3', outcome: pb.BatchLookupOutcome.NOT_ATTEMPTED },
          ],
          foundCount: 1,
        }
      ),
      batchResendTriggerDeliveries: create(
        pb.BatchResendTriggerDeliveriesResponseSchema,
        {
          results: [
            {
              msgId: 'msg_1',
              endpointId: 'ep_1',
              outcome: pb.BatchResendOutcome.QUEUED,
            },
            {
              msgId: 'msg_2',
              endpointId: 'ep_1',
              outcome: pb.BatchResendOutcome.FAILED,
              reason: 'payload expired',
            },
          ],
          queuedCount: 1,
        }
      ),
    });
    const lookup = await triggers.batchLookupDeliveries({
      deliveryIds: ['msg_1', 'msg_2', 'msg_3'],
    });
    expect(lookup.foundCount).toBe(1);
    expect(lookup.results.map((r) => r.outcome)).toEqual([
      'FOUND',
      'RATE_LIMITED',
      'NOT_ATTEMPTED',
    ]);
    expect(lookup.results[0].delivery?.msgId).toBe('msg_1');
    expect(lookup.results[1].delivery).toBeUndefined();

    const resend = await triggers.batchResendDeliveries({
      targets: [
        { msgId: 'msg_1', endpointId: 'ep_1' },
        { msgId: 'msg_2', endpointId: 'ep_1' },
      ],
    });
    expect(resend.queuedCount).toBe(1);
    expect(resend.results[1]).toEqual({
      msgId: 'msg_2',
      endpointId: 'ep_1',
      outcome: 'FAILED',
      reason: 'payload expired',
    });
  });

  it('maps a recovery', async () => {
    const { triggers } = setup({
      recoverTriggerDeliveries: create(
        pb.RecoverTriggerDeliveriesResponseSchema,
        { taskId: 'qtask_1', status: 'running' }
      ),
    });
    await expect(
      triggers.recoverDeliveries('ep_1', { since: new Date(0) })
    ).resolves.toEqual({ taskId: 'qtask_1', status: 'running' });
  });
});

// ---------------------------------------------------------------------------
// Retry policy and error promotion
// ---------------------------------------------------------------------------

describe('retry policy', () => {
  it.each(METHODS.filter((m) => !m.retrySafe))(
    '$method is not retried on Unavailable',
    async (m) => {
      const { triggers, core, rpc } = setup();
      const sleep = jest
        .spyOn(core as any, 'sleep')
        .mockResolvedValue(undefined as never);
      rpc[m.rpc].mockRejectedValue(serverError(Code.Unavailable));
      await expect(m.call(triggers)).rejects.toBeInstanceOf(
        ScalekitServiceUnavailableException
      );
      expect(rpc[m.rpc]).toHaveBeenCalledTimes(1);
      expect(sleep).not.toHaveBeenCalled();
      expect(rpc[m.rpc].mock.calls[0][1]).not.toHaveProperty(
        'retryOnUnavailable'
      );
    }
  );

  it.each(METHODS.filter((m) => m.retrySafe))(
    '$method is retried on Unavailable',
    async (m) => {
      const { triggers, core, rpc } = setup();
      jest.spyOn(core as any, 'sleep').mockResolvedValue(undefined as never);
      const succeed = rpc[m.rpc].getMockImplementation()!;
      rpc[m.rpc]
        .mockRejectedValueOnce(serverError(Code.Unavailable))
        .mockImplementationOnce(succeed);
      await expect(m.call(triggers)).resolves.not.toBeInstanceOf(Error);
      expect(rpc[m.rpc]).toHaveBeenCalledTimes(2);
    }
  );

  it.each(METHODS.filter((m) => !m.retrySafe))(
    '$method still refreshes an expired token once',
    async (m) => {
      const { triggers, core, rpc } = setup();
      const auth = jest
        .spyOn(core as any, 'authenticateClient')
        .mockResolvedValue(undefined as never);
      const succeed = rpc[m.rpc].getMockImplementation()!;
      rpc[m.rpc]
        .mockRejectedValueOnce(serverError(Code.Unauthenticated))
        .mockImplementationOnce(succeed);
      await m.call(triggers);
      expect(auth).toHaveBeenCalledTimes(1);
      expect(rpc[m.rpc]).toHaveBeenCalledTimes(2);
    }
  );

  it('the retry-safe list matches the plan (five calls are never repeated)', () => {
    expect(METHODS.filter((m) => !m.retrySafe).map((m) => m.method)).toEqual([
      'createSubscription',
      'setSigningSecret',
      'generateSigningSecret',
      'batchResendDeliveries',
      'recoverDeliveries',
    ]);
  });
});

describe('error promotion', () => {
  const CASES: Array<
    [
      string,
      Code,
      string | undefined,
      new (...args: any[]) => Error,
      RpcName,
      (t: TriggersClient) => Promise<unknown>,
    ]
  > = [
    [
      '400 not applicable',
      Code.InvalidArgument,
      'TRIGGER_INGRESS_NOT_APPLICABLE',
      ScalekitBadRequestException,
      'createTriggerIngressEndpoint',
      (t) => t.createIngressEndpoint('conn_1'),
    ],
    [
      '400 definitions unavailable',
      Code.FailedPrecondition,
      'TRIGGER_INGRESS_DEFINITIONS_UNAVAILABLE',
      ScalekitBadRequestException,
      'createTriggerIngressEndpoint',
      (t) => t.createIngressEndpoint('conn_1'),
    ],
    [
      '400 generated only',
      Code.InvalidArgument,
      'TRIGGER_SIGNING_SECRET_GENERATED_ONLY',
      ScalekitBadRequestException,
      'setTriggerSigningSecret',
      (t) => t.setSigningSecret('conn_1', { signingSecret: 'x' }),
    ],
    [
      '400 unknown delivery endpoint',
      Code.InvalidArgument,
      'INVALID_ARGUMENT',
      ScalekitBadRequestException,
      'listTriggerDeliveriesByEndpoint',
      (t) => t.listDeliveries('ep_missing'),
    ],
    [
      '404 connection',
      Code.NotFound,
      'RESOURCE_NOT_FOUND',
      ScalekitNotFoundException,
      'listAvailableTriggers',
      (t) => t.listAvailable('conn_1'),
    ],
    [
      '404 no ingress endpoint',
      Code.NotFound,
      'TRIGGER_INGRESS_ENDPOINT_NOT_CREATED',
      ScalekitNotFoundException,
      'getTriggerIngressEndpoint',
      (t) => t.getIngressEndpoint('conn_1'),
    ],
    [
      '404 usage not metered',
      Code.NotFound,
      'TRIGGER_USAGE_NOT_METERED',
      ScalekitNotFoundException,
      'getTriggerUsage',
      (t) => t.getUsage({ period: '7d' }),
    ],
    [
      '404 lookup',
      Code.NotFound,
      'NOT_FOUND',
      ScalekitNotFoundException,
      'lookupTriggerDelivery',
      (t) => t.lookupDelivery('msg_1'),
    ],
    [
      '404 recover unknown endpoint',
      Code.NotFound,
      'RESOURCE_NOT_FOUND',
      ScalekitNotFoundException,
      'recoverTriggerDeliveries',
      (t) => t.recoverDeliveries('ep_missing', { since: new Date(0) }),
    ],
    [
      '409 duplicate subscription',
      Code.AlreadyExists,
      'RESOURCE_ALREADY_EXISTS',
      ScalekitConflictException,
      'createTriggerSubscription',
      (t) =>
        t.createSubscription('conn_1', 'x', { connectedAccountId: 'ca_1' }),
    ],
    [
      '409 rotation open',
      Code.AlreadyExists,
      'RESOURCE_ALREADY_EXISTS',
      ScalekitConflictException,
      'generateTriggerSigningSecret',
      (t) => t.generateSigningSecret('conn_1'),
    ],
    [
      '429 rate limited',
      Code.ResourceExhausted,
      'RATE_LIMITED',
      ScalekitTooManyRequestsException,
      'batchDeleteTriggerSubscriptions',
      (t) =>
        t.batchDeleteSubscriptions('conn_1', { subscriptionIds: ['trgs_1'] }),
    ],
    [
      '500 internal',
      Code.Internal,
      'INTERNAL_ERROR',
      ScalekitInternalServerException,
      'recoverTriggerDeliveries',
      (t) => t.recoverDeliveries('ep_1', { since: new Date(0) }),
    ],
    [
      'deadline',
      Code.DeadlineExceeded,
      undefined,
      ScalekitGatewayTimeoutException,
      'getTriggerActivity',
      (t) => t.getActivity(),
    ],
  ];

  it.each(CASES)(
    '%s → the matching class with errorCode',
    async (_label, code, errorCode, cls, rpcName, call) => {
      const { triggers, rpc } = setup();
      rpc[rpcName].mockRejectedValue(serverError(code, errorCode));
      const error = await call(triggers).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(cls);
      expect(error).toBeInstanceOf(ScalekitServerException);
      expect((error as ScalekitServerException).errorCode).toBe(
        errorCode ?? null
      );
    }
  );

  it('429 is not retried, even on a retry-safe call', async () => {
    const { triggers, core, rpc } = setup();
    const sleep = jest
      .spyOn(core as any, 'sleep')
      .mockResolvedValue(undefined as never);
    rpc.batchLookupTriggerDeliveries.mockRejectedValue(
      serverError(Code.ResourceExhausted, 'RATE_LIMITED')
    );
    await expect(
      triggers.batchLookupDeliveries({ deliveryIds: ['msg_1'] })
    ).rejects.toBeInstanceOf(ScalekitTooManyRequestsException);
    expect(rpc.batchLookupTriggerDeliveries).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('503 on a retry-safe call surfaces after the retries are used up', async () => {
    const { triggers, core, rpc } = setup();
    jest.spyOn(core as any, 'sleep').mockResolvedValue(undefined as never);
    rpc.getTriggerUsage.mockRejectedValue(serverError(Code.Unavailable));
    await expect(triggers.getUsage({ period: '30d' })).rejects.toBeInstanceOf(
      ScalekitServiceUnavailableException
    );
    expect(rpc.getTriggerUsage).toHaveBeenCalledTimes(4);
  });

  it('an aborted call rejects with ScalekitAbortError, not a server error', async () => {
    const { triggers, rpc } = setup();
    const controller = new AbortController();
    rpc.listTriggerSubscriptions.mockImplementation(
      (_req: unknown, opts?: CallOptions) =>
        new Promise((_resolve, reject) => {
          opts?.signal?.addEventListener('abort', () =>
            reject(new ConnectError('canceled', Code.Canceled))
          );
        })
    );
    const pending = triggers.listSubscriptions('conn_1', undefined, {
      signal: controller.signal,
    });
    controller.abort();
    await expect(pending).rejects.toBeInstanceOf(ScalekitAbortError);
  });
});
