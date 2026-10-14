/**
 * refreshConnectedAccountTokens needs either connectedAccountId or both
 * connectionName and identifier. When the ID is set, the name and identifier
 * are not sent. Client errors from the server pass through unchanged.
 */
import { describe, it, expect, jest } from '@jest/globals';
import CoreClient from '../src/core';
import ConnectedAccountsClient from '../src/connected-accounts';
import ActionClient from '../src/actions';

function makeClient() {
  const coreClient = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  const refreshConnectedAccountTokens = jest.fn(
    async (_req: any, _options?: unknown) => ({
      connectedAccount: { id: 'ca_1' },
    })
  );
  const grpcConnect = {
    createClient: () => ({ refreshConnectedAccountTokens }),
  } as any;
  return {
    accounts: new ConnectedAccountsClient(grpcConnect, coreClient),
    refreshConnectedAccountTokens,
  };
}

const REQUIRED_MSG =
  'either connectedAccountId or connectionName + identifier is required';

describe('ConnectedAccountsClient.refreshConnectedAccountTokens', () => {
  it.each([
    [
      'id only',
      { connectedAccountId: 'ca_1' },
      { connectedAccountId: 'ca_1', connectionName: '', identifier: '' },
    ],
    [
      'name + identifier',
      { connectionName: 'gmail', identifier: 'user_1' },
      { connectedAccountId: '', connectionName: 'gmail', identifier: 'user_1' },
    ],
    [
      'id wins when everything is sent',
      { connectedAccountId: 'ca_1', connectionName: 'gmail', identifier: 'u' },
      { connectedAccountId: 'ca_1', connectionName: '', identifier: '' },
    ],
    [
      'values are trimmed',
      { connectionName: ' gmail ', identifier: ' user_1 ' },
      { connectedAccountId: '', connectionName: 'gmail', identifier: 'user_1' },
    ],
    [
      'blank id falls back to name + identifier',
      { connectedAccountId: '  ', connectionName: 'gmail', identifier: 'u' },
      { connectedAccountId: '', connectionName: 'gmail', identifier: 'u' },
    ],
  ])('maps the request: %s', async (_name, params, expected) => {
    const { accounts, refreshConnectedAccountTokens } = makeClient();
    const res = await accounts.refreshConnectedAccountTokens(params);
    expect(res.connectedAccount?.id).toBe('ca_1');
    expect(refreshConnectedAccountTokens).toHaveBeenCalledTimes(1);
    expect(refreshConnectedAccountTokens.mock.calls[0][0]).toMatchObject(
      expected
    );
  });

  it.each([
    ['nothing given', {}],
    ['only connectionName', { connectionName: 'gmail' }],
    ['only identifier', { identifier: 'user_1' }],
    ['blank values', { connectionName: ' ', identifier: ' ' }],
  ])('rejects %s without calling the server', async (_name, params) => {
    const { accounts, refreshConnectedAccountTokens } = makeClient();
    await expect(
      accounts.refreshConnectedAccountTokens(params)
    ).rejects.toThrow(REQUIRED_MSG);
    expect(refreshConnectedAccountTokens).not.toHaveBeenCalled();
  });

  it('propagates a server error', async () => {
    const { accounts, refreshConnectedAccountTokens } = makeClient();
    const boom = new Error('REAUTHENTICATION_NEEDED');
    refreshConnectedAccountTokens.mockRejectedValueOnce(boom);
    await expect(
      accounts.refreshConnectedAccountTokens({ connectedAccountId: 'ca_1' })
    ).rejects.toThrow('REAUTHENTICATION_NEEDED');
  });

  it('is exposed on actions and forwards the params', async () => {
    const { accounts, refreshConnectedAccountTokens } = makeClient();
    const actions = new ActionClient(
      {} as any,
      accounts,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );
    await actions.refreshConnectedAccountTokens({
      connectionName: 'gmail',
      identifier: 'user_1',
    });
    expect(refreshConnectedAccountTokens.mock.calls[0][0]).toMatchObject({
      connectionName: 'gmail',
      identifier: 'user_1',
    });
    await expect(actions.refreshConnectedAccountTokens({})).rejects.toThrow(
      REQUIRED_MSG
    );
  });
});
