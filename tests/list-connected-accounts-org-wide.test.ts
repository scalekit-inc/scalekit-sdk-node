/**
 * `listConnectedAccounts` sends `isOrgWideCredential` to the API, including
 * `false` (per-user accounts only), and leaves it unset when not given.
 *
 * Credential-free: a fake gRPC client records the request.
 */
import { describe, expect, it, jest } from '@jest/globals';
import ConnectedAccountsClient from '../src/connected-accounts';
import ActionsClient from '../src/actions';
import CoreClient from '../src/core';
import ToolsClient from '../src/tools';
import ConnectionClient from '../src/connection';
import McpClient from '../src/mcp';
import ProvidersClient from '../src/providers';

function setup() {
  const sent: Array<Record<string, unknown>> = [];
  const listConnectedAccounts = jest.fn(async (request: any) => {
    sent.push(request);
    return { connectedAccounts: [], totalSize: 0 };
  });
  const grpcConnect = {
    createClient: () => ({ listConnectedAccounts }),
  } as any;
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'id',
    'secret'
  );
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
  return { sent, connectedAccounts, actions };
}

describe('listConnectedAccounts isOrgWideCredential', () => {
  it.each([true, false])(
    'sends %p through connectedAccounts and actions',
    async (value) => {
      const { sent, connectedAccounts, actions } = setup();

      await connectedAccounts.listConnectedAccounts({
        isOrgWideCredential: value,
      });
      await actions.listConnectedAccounts({ isOrgWideCredential: value });

      expect(sent).toHaveLength(2);
      for (const request of sent) {
        expect(request.isOrgWideCredential).toBe(value);
      }
    }
  );

  it('leaves the filter unset when it is not given', async () => {
    const { sent, connectedAccounts, actions } = setup();

    await connectedAccounts.listConnectedAccounts({ identifier: 'a@b.com' });
    await actions.listConnectedAccounts({ identifier: 'a@b.com' });

    for (const request of sent) {
      expect(request.isOrgWideCredential).toBeUndefined();
    }
  });

  it('still sends the existing filters alongside it', async () => {
    const { sent, actions } = setup();

    await actions.listConnectedAccounts({
      connectionName: 'slack',
      provider: 'SLACK',
      query: 'x',
      pageSize: 5,
      isOrgWideCredential: true,
    });

    expect(sent[0]).toMatchObject({
      connector: 'slack',
      provider: 'SLACK',
      query: 'x',
      pageSize: 5,
      isOrgWideCredential: true,
    });
  });
});
