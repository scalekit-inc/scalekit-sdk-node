/**
 * Credential-free tests for searching connected accounts and fetching a
 * connected account's details (metadata without credentials), on both
 * `connectedAccounts` and the `actions` facade.
 *
 * A fake ConnectedAccountService client stands in for the network, so these
 * tests prove the request each method builds, which RPC it calls, that the
 * response is passed through, that server errors are promoted to typed
 * exceptions, and that input validation fails before any call is made.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { create } from '@bufbuild/protobuf';
import { Code, ConnectError } from '@connectrpc/connect';
import CoreClient from '../src/core';
import ToolsClient from '../src/tools';
import ActionsClient from '../src/actions';
import ConnectedAccountsClient from '../src/connected-accounts';
import ConnectionClient from '../src/connection';
import McpClient from '../src/mcp';
import ProvidersClient from '../src/providers';
import {
  ScalekitBadRequestException,
  ScalekitNotFoundException,
} from '../src/errors';
import {
  ConnectedAccountForListSchema,
  ConnectedAccountSchema,
  ConnectorStatus,
  GetConnectedAccountByIdentifierRequest,
  GetConnectedAccountByIdentifierResponseSchema,
  SearchConnectedAccountsRequest,
  SearchConnectedAccountsResponseSchema,
} from '../src/pkg/grpc/scalekit/v1/connected_accounts/connected_accounts_pb';

const searchResponse = create(SearchConnectedAccountsResponseSchema, {
  connectedAccounts: [
    create(ConnectedAccountForListSchema, {
      id: 'ca_123',
      identifier: 'john@example.com',
      provider: 'GMAIL',
      connector: 'gmail',
      connectionId: 'conn_123',
      status: ConnectorStatus.ACTIVE,
    }),
  ],
  totalSize: 1,
  nextPageToken: 'next_1',
  prevPageToken: '',
});

const detailsResponse = create(GetConnectedAccountByIdentifierResponseSchema, {
  connectedAccount: create(ConnectedAccountSchema, {
    id: 'ca_123',
    identifier: 'john@example.com',
    connector: 'gmail',
    status: ConnectorStatus.ACTIVE,
  }),
});

function makeFakeConnectedAccountService() {
  return {
    searchConnectedAccounts: jest.fn(
      async (_req: SearchConnectedAccountsRequest, _options?: unknown) =>
        searchResponse
    ),
    getConnectedAccountDetails: jest.fn(
      async (
        _req: GetConnectedAccountByIdentifierRequest,
        _options?: unknown
      ) => detailsResponse
    ),
    getConnectedAccountAuth: jest.fn(
      async (
        _req: GetConnectedAccountByIdentifierRequest,
        _options?: unknown
      ) => detailsResponse
    ),
  };
}

function makeClients() {
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const fake = makeFakeConnectedAccountService();
  const grpcConnect = { createClient: () => fake } as any;
  const connectedAccounts = new ConnectedAccountsClient(
    grpcConnect,
    coreClient
  );
  const actions = new ActionsClient(
    new ToolsClient(grpcConnect, coreClient),
    connectedAccounts,
    coreClient,
    new ConnectionClient(grpcConnect, coreClient),
    new McpClient(grpcConnect, coreClient),
    new ProvidersClient(grpcConnect, coreClient)
  );
  return { connectedAccounts, actions, fake };
}

function sentRequest<T>(fn: { mock: { calls: unknown[][] } }): T {
  expect(fn.mock.calls).toHaveLength(1);
  return fn.mock.calls[0][0] as T;
}

describe('connectedAccounts.searchConnectedAccounts', () => {
  it('calls SearchConnectedAccounts with only the trimmed query by default', async () => {
    const { connectedAccounts, fake } = makeClients();

    const res = await connectedAccounts.searchConnectedAccounts({
      query: '  gmail  ',
    });

    expect(res).toBe(searchResponse);
    const req = sentRequest<SearchConnectedAccountsRequest>(
      fake.searchConnectedAccounts
    );
    expect(req.query).toBe('gmail');
    expect(req.pageSize).toBe(0);
    expect(req.pageToken).toBe('');
    expect(req.connectionId).toBe('');
    // Control-plane call: no per-call options, so the 20s transport default
    // applies rather than the longer tool timeout.
    expect(fake.searchConnectedAccounts.mock.calls[0][1]).toBeUndefined();
    expect(fake.getConnectedAccountAuth).not.toHaveBeenCalled();
  });

  it('forwards pageSize, pageToken and a trimmed connectionId', async () => {
    const { connectedAccounts, fake } = makeClients();

    await connectedAccounts.searchConnectedAccounts({
      query: 'john',
      pageSize: 30,
      pageToken: 'next_1',
      connectionId: ' conn_123 ',
    });

    const req = sentRequest<SearchConnectedAccountsRequest>(
      fake.searchConnectedAccounts
    );
    expect(req.query).toBe('john');
    expect(req.pageSize).toBe(30);
    expect(req.pageToken).toBe('next_1');
    expect(req.connectionId).toBe('conn_123');
  });

  it.each([
    ['empty', ''],
    ['whitespace-only', '   '],
    ['missing', undefined],
  ])('rejects a %s query before any request is sent', async (_label, query) => {
    const { connectedAccounts, fake } = makeClients();

    await expect(
      connectedAccounts.searchConnectedAccounts({ query } as any)
    ).rejects.toThrow('query is required');
    expect(fake.searchConnectedAccounts).not.toHaveBeenCalled();
  });

  it('promotes a server InvalidArgument (e.g. query too short) to ScalekitBadRequestException', async () => {
    const { connectedAccounts, fake } = makeClients();
    fake.searchConnectedAccounts.mockRejectedValueOnce(
      new ConnectError(
        'query must be at least 3 characters',
        Code.InvalidArgument
      )
    );

    await expect(
      connectedAccounts.searchConnectedAccounts({ query: 'ab' })
    ).rejects.toBeInstanceOf(ScalekitBadRequestException);
    expect(fake.searchConnectedAccounts).toHaveBeenCalledTimes(1);
  });
});

describe('connectedAccounts.getConnectedAccountDetails', () => {
  it('calls GetConnectedAccountDetails (not GetConnectedAccountAuth) by connector + identifier', async () => {
    const { connectedAccounts, fake } = makeClients();

    const res = await connectedAccounts.getConnectedAccountDetails({
      connector: ' gmail ',
      identifier: ' john@example.com ',
    });

    expect(res).toBe(detailsResponse);
    expect(fake.getConnectedAccountAuth).not.toHaveBeenCalled();
    const req = sentRequest<GetConnectedAccountByIdentifierRequest>(
      fake.getConnectedAccountDetails
    );
    expect(req.connector).toBe('gmail');
    expect(req.identifier).toBe('john@example.com');
    expect(req.id).toBeUndefined();
    expect(req.organizationId).toBeUndefined();
    expect(req.userId).toBeUndefined();
  });

  it('sends a trimmed connectedAccountId as id, with organizationId and userId', async () => {
    const { connectedAccounts, fake } = makeClients();

    await connectedAccounts.getConnectedAccountDetails({
      connectedAccountId: ' ca_123 ',
      organizationId: 'org_123',
      userId: 'usr_123',
    });

    const req = sentRequest<GetConnectedAccountByIdentifierRequest>(
      fake.getConnectedAccountDetails
    );
    expect(req.id).toBe('ca_123');
    expect(req.connector).toBeUndefined();
    expect(req.identifier).toBeUndefined();
    expect(req.organizationId).toBe('org_123');
    expect(req.userId).toBe('usr_123');
  });

  it('looks up by connector + organizationId + userId when identifier is omitted', async () => {
    const { connectedAccounts, fake } = makeClients();

    await connectedAccounts.getConnectedAccountDetails({
      connector: 'gmail',
      organizationId: ' org_123 ',
      userId: ' usr_123 ',
    });

    const req = sentRequest<GetConnectedAccountByIdentifierRequest>(
      fake.getConnectedAccountDetails
    );
    expect(req.connector).toBe('gmail');
    expect(req.organizationId).toBe('org_123');
    expect(req.userId).toBe('usr_123');
    expect(req.identifier).toBeUndefined();
    expect(req.id).toBeUndefined();
  });

  it('looks up by connector + organizationId alone', async () => {
    const { connectedAccounts, fake } = makeClients();

    await connectedAccounts.getConnectedAccountDetails({
      connector: 'gmail',
      organizationId: 'org_123',
    });

    const req = sentRequest<GetConnectedAccountByIdentifierRequest>(
      fake.getConnectedAccountDetails
    );
    expect(req.connector).toBe('gmail');
    expect(req.organizationId).toBe('org_123');
    expect(req.userId).toBeUndefined();
  });

  it.each([
    ['nothing', {}],
    ['connector only', { connector: 'gmail' }],
    ['identifier only', { identifier: 'john@example.com' }],
    ['organizationId only', { organizationId: 'org_123' }],
    [
      'organizationId + userId without connector',
      { organizationId: 'org_123', userId: 'usr_123' },
    ],
    ['connector + userId only', { connector: 'gmail', userId: 'usr_123' }],
    [
      'connector + whitespace organizationId',
      { connector: 'gmail', organizationId: '  ' },
    ],
    ['whitespace connectedAccountId', { connectedAccountId: '   ' }],
    ['whitespace connector + identifier', { connector: ' ', identifier: ' ' }],
  ])('rejects %s before any request is sent', async (_label, options) => {
    const { connectedAccounts, fake } = makeClients();

    await expect(
      connectedAccounts.getConnectedAccountDetails(options)
    ).rejects.toThrow(
      'either connectedAccountId, or connector + identifier (or organizationId) is required'
    );
    expect(fake.getConnectedAccountDetails).not.toHaveBeenCalled();
  });

  it('promotes a server NotFound to ScalekitNotFoundException', async () => {
    const { connectedAccounts, fake } = makeClients();
    fake.getConnectedAccountDetails.mockRejectedValueOnce(
      new ConnectError('connected account not found', Code.NotFound)
    );

    await expect(
      connectedAccounts.getConnectedAccountDetails({
        connectedAccountId: 'ca_missing',
      })
    ).rejects.toBeInstanceOf(ScalekitNotFoundException);
  });
});

describe('actions.searchConnectedAccounts', () => {
  it('delegates to SearchConnectedAccounts with every field mapped', async () => {
    const { actions, fake } = makeClients();

    const res = await actions.searchConnectedAccounts({
      query: ' john@example.com ',
      pageSize: 10,
      pageToken: 'next_1',
      connectionId: 'conn_123',
    });

    expect(res).toBe(searchResponse);
    const req = sentRequest<SearchConnectedAccountsRequest>(
      fake.searchConnectedAccounts
    );
    expect(req.query).toBe('john@example.com');
    expect(req.pageSize).toBe(10);
    expect(req.pageToken).toBe('next_1');
    expect(req.connectionId).toBe('conn_123');
  });

  it('leaves unset optional fields at their defaults', async () => {
    const { actions, fake } = makeClients();

    await actions.searchConnectedAccounts({ query: 'gmail' });

    const req = sentRequest<SearchConnectedAccountsRequest>(
      fake.searchConnectedAccounts
    );
    expect(req.pageSize).toBe(0);
    expect(req.pageToken).toBe('');
    expect(req.connectionId).toBe('');
  });

  it.each([
    ['empty', ''],
    ['whitespace-only', '  '],
    ['missing', undefined],
  ])('rejects a %s query before any request is sent', async (_label, query) => {
    const { actions, fake } = makeClients();

    await expect(
      actions.searchConnectedAccounts({ query } as any)
    ).rejects.toThrow('query is required');
    expect(fake.searchConnectedAccounts).not.toHaveBeenCalled();
  });
});

describe('actions.getConnectedAccountDetails', () => {
  it('maps connectionName to connector and calls GetConnectedAccountDetails', async () => {
    const { actions, fake } = makeClients();

    const res = await actions.getConnectedAccountDetails({
      connectionName: ' gmail ',
      identifier: ' john@example.com ',
      organizationId: 'org_123',
      userId: 'usr_123',
    });

    expect(res).toBe(detailsResponse);
    expect(fake.getConnectedAccountAuth).not.toHaveBeenCalled();
    const req = sentRequest<GetConnectedAccountByIdentifierRequest>(
      fake.getConnectedAccountDetails
    );
    expect(req.connector).toBe('gmail');
    expect(req.identifier).toBe('john@example.com');
    expect(req.organizationId).toBe('org_123');
    expect(req.userId).toBe('usr_123');
    expect(req.id).toBeUndefined();
  });

  it('maps connectedAccountId to id', async () => {
    const { actions, fake } = makeClients();

    await actions.getConnectedAccountDetails({ connectedAccountId: 'ca_123' });

    const req = sentRequest<GetConnectedAccountByIdentifierRequest>(
      fake.getConnectedAccountDetails
    );
    expect(req.id).toBe('ca_123');
    expect(req.connector).toBeUndefined();
    expect(req.identifier).toBeUndefined();
  });

  it('looks up by connectionName + organizationId + userId when identifier is omitted', async () => {
    const { actions, fake } = makeClients();

    await actions.getConnectedAccountDetails({
      connectionName: ' gmail ',
      organizationId: ' org_123 ',
      userId: ' usr_123 ',
    });

    const req = sentRequest<GetConnectedAccountByIdentifierRequest>(
      fake.getConnectedAccountDetails
    );
    expect(req.connector).toBe('gmail');
    expect(req.organizationId).toBe('org_123');
    expect(req.userId).toBe('usr_123');
    expect(req.identifier).toBeUndefined();
    expect(req.id).toBeUndefined();
    expect(fake.getConnectedAccountAuth).not.toHaveBeenCalled();
  });

  it.each([
    ['nothing', {}],
    ['connectionName only', { connectionName: 'gmail' }],
    ['identifier only', { identifier: 'john@example.com' }],
    ['organizationId only', { organizationId: 'org_123' }],
    [
      'organizationId + userId without connectionName',
      { organizationId: 'org_123', userId: 'usr_123' },
    ],
    [
      'connectionName + userId only',
      { connectionName: 'gmail', userId: 'usr_123' },
    ],
    ['whitespace connectedAccountId', { connectedAccountId: ' ' }],
  ])('rejects %s before any request is sent', async (_label, params) => {
    const { actions, fake } = makeClients();

    await expect(actions.getConnectedAccountDetails(params)).rejects.toThrow(
      'either connectedAccountId, or connectionName + identifier (or organizationId) is required'
    );
    expect(fake.getConnectedAccountDetails).not.toHaveBeenCalled();
    expect(fake.getConnectedAccountAuth).not.toHaveBeenCalled();
  });

  it('leaves actions.getConnectedAccount on GetConnectedAccountAuth', async () => {
    const { actions, fake } = makeClients();

    await actions.getConnectedAccount({ connectedAccountId: 'ca_123' });

    expect(fake.getConnectedAccountAuth).toHaveBeenCalledTimes(1);
    expect(fake.getConnectedAccountDetails).not.toHaveBeenCalled();
  });
});
