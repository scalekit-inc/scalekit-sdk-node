/**
 * `actions.request()` sends to `<envUrl>/proxy<path>` with the client's bearer
 * token. A `path` whose effective location resolves outside the proxy prefix
 * must be rejected before any request is made; every other path must be sent
 * exactly as before.
 *
 * Credential-free: runs against a local HTTP server through the real axios
 * adapter, so the assertions are on the path the server actually receives.
 */
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import http from 'http';
import { AddressInfo } from 'net';
import ScalekitClient from '../src/scalekit';
import CoreClient from '../src/core';

type Seen = { method?: string; url?: string; authorization?: string };

let server: http.Server;
let origin: string;
const seen: Seen[] = [];

function makeClient(envUrl: string): ScalekitClient {
  const client = new ScalekitClient(envUrl, 'client_id', 'client_secret');
  // Pretend a token was already fetched so the request carries a bearer, the
  // way a warm client does.
  (client as unknown as { coreClient: CoreClient }).coreClient.accessToken =
    'test-access-token';
  return client;
}

beforeAll(async () => {
  server = http.createServer((req, res) => {
    seen.push({
      method: req.method,
      url: req.url,
      authorization: req.headers.authorization,
    });
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end('{}');
  });
  await new Promise<void>((resolve) =>
    server.listen(0, '127.0.0.1', () => resolve())
  );
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

beforeEach(() => {
  seen.length = 0;
});

const call = (
  client: ScalekitClient,
  path: string,
  extra: {
    method?: string;
    body?: unknown;
    queryParams?: Record<string, unknown>;
  } = {}
) =>
  client.actions.request({
    connectionName: 'googledrive',
    identifier: 'user_123',
    path,
    ...extra,
  });

describe('actions.request path containment', () => {
  describe('rejects paths that resolve outside the proxy prefix, before sending', () => {
    const escapes: Array<[string, string]> = [
      ['dot segments', '/x/../../api/v1/organizations'],
      ['leading dot segment', '/../api'],
      ['bare parent segment', '/..'],
      ['tab-split dot segments', '/x/.\t./.\t./api/v1/organizations'],
      ['LF-split dot segments', '/x/.\n./.\n./api/v1/organizations'],
      ['CR-split dot segments', '/x/.\r./.\r./api/v1/organizations'],
      ['percent-encoded dots', '/x/%2e%2e/%2e%2e/api'],
      ['mixed-case percent-encoded dots', '/x/%2E%2e/.%2E/api'],
      ['encoded slashes joining dot segments', '/x%2f..%2f..%2fapi'],
      ['upper-case encoded slashes', '/x%2F..%2F..%2Fapi'],
      ['backslash separators', '/x\\..\\..\\api'],
      ['encoded backslash separators', '/x%5c..%5c..%5capi'],
    ];

    it.each(escapes)('%s', async (_name, path) => {
      const client = makeClient(origin);
      await expect(call(client, path)).rejects.toThrow(
        'path must resolve under the proxy prefix'
      );
      expect(seen).toEqual([]);
    });

    it('rejects an escape on a non-GET call without sending the body', async () => {
      const client = makeClient(origin);
      await expect(
        call(client, '/x/../../api/v1/users', {
          method: 'POST',
          body: { email: 'a@example.com' },
        })
      ).rejects.toThrow('path must resolve under the proxy prefix');
      expect(seen).toEqual([]);
    });

    it('does not echo the path in the error message', async () => {
      const client = makeClient(origin);
      const err = await call(
        client,
        '/x/../../api/secret-looking-segment'
      ).catch((e: unknown) => e);
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).not.toContain('secret-looking-segment');
    });

    describe('with a base path in the environment URL', () => {
      it.each([
        ['parent of the proxy prefix', '/../x'],
        ['out of the base path', '/../../api/v1/organizations'],
        ['to another /proxy outside the base', '/../../proxy/x'],
        ['through encoded dots', '/%2e%2e/x'],
      ])('%s', async (_name, path) => {
        const client = makeClient(`${origin}/base`);
        await expect(call(client, path)).rejects.toThrow(
          'path must resolve under the proxy prefix'
        );
        expect(seen).toEqual([]);
      });
    });
  });

  describe('sends every other path exactly as before', () => {
    const unchanged: Array<[string, string, string]> = [
      [
        'a normal path',
        '/gmail/v1/users/me/profile',
        '/proxy/gmail/v1/users/me/profile',
      ],
      [
        'a path without a leading slash',
        'drive/v3/files',
        '/proxy/drive/v3/files',
      ],
      ['a path with a space', '/a b/c', '/proxy/a%20b/c'],
      [
        'an in-prefix dot segment',
        '/a/../drive/v3/files',
        '/proxy/drive/v3/files',
      ],
      ['a single-dot segment', '/./drive/v3/files', '/proxy/drive/v3/files'],
      [
        '%2F inside a segment',
        '/drive/v3/files/a%2Fb',
        '/proxy/drive/v3/files/a%2Fb',
      ],
      [
        'a trailing LF',
        '/gmail/v1/users/me/profile\n',
        '/proxy/gmail/v1/users/me/profile',
      ],
      [
        'an in-prefix LF-split dot segment',
        '/x/.\n./api/v1/users',
        '/proxy/api/v1/users',
      ],
      ['in-prefix encoded dots', '/x/%2e%2e/api', '/proxy/api'],
      ['the bare proxy root', '/', '/proxy/'],
    ];

    it.each(unchanged)('%s', async (_name, path, received) => {
      const client = makeClient(origin);
      const res = await call(client, path);
      expect(res.status).toBe(200);
      expect(seen).toEqual([
        {
          method: 'GET',
          url: received,
          authorization: 'Bearer test-access-token',
        },
      ]);
    });

    it('leaves queryParams unaffected, including values with dot segments', async () => {
      const client = makeClient(origin);
      await call(client, '/drive/v3/about', {
        queryParams: { fields: 'user', q: '../../api' },
      });
      expect(seen.map((s) => s.url)).toEqual([
        '/proxy/drive/v3/about?fields=user&q=..%2F..%2Fapi',
      ]);
    });

    it('sends in-prefix paths under an environment URL base path', async () => {
      const client = makeClient(`${origin}/base/`);
      await call(client, '/drive/v3/files');
      await call(client, '/a/../drive/v3/files');
      expect(seen.map((s) => s.url)).toEqual([
        '/base/proxy/drive/v3/files',
        '/base/proxy/drive/v3/files',
      ]);
    });
  });
});
