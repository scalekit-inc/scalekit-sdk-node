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
import { proxyRedirectGuard } from '../src/proxy-path';

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
      ['dot segments', '/x/../../outside'],
      ['leading dot segment', '/../outside'],
      ['bare parent segment', '/..'],
      ['tab-split dot segments', '/x/.\t./.\t./outside'],
      ['LF-split dot segments', '/x/.\n./.\n./outside'],
      ['CR-split dot segments', '/x/.\r./.\r./outside'],
      ['percent-encoded dots', '/x/%2e%2e/%2e%2e/outside'],
      ['mixed-case percent-encoded dots', '/x/%2E%2e/.%2E/outside'],
      ['encoded slashes joining dot segments', '/x%2f..%2f..%2foutside'],
      ['upper-case encoded slashes', '/x%2F..%2F..%2Foutside'],
      ['backslash separators', '/x\\..\\..\\outside'],
      ['encoded backslash separators', '/x%5c..%5c..%5coutside'],
      // A router that collapses `//` before resolving `..` reads these as
      // leaving the prefix, even though an RFC 3986 resolver would not.
      ['an empty segment then an encoded parent', '//..%2foutside'],
      ['an encoded slash then an encoded parent', '/%2f..%2foutside'],
      ['several empty segments', '///..%2f..%2foutside'],
      // Out and back in to a sibling of the prefix: only the exact bare
      // prefix is accepted, never a longer name that starts with it.
      ['a sibling sharing the prefix name', '/..%2fproxyx'],
      ['a sibling with a suffix', '/..%2fproxy-other'],
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
        call(client, '/x/../../outside', {
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
        '/x/../../outside/secret-looking-segment'
      ).catch((e: unknown) => e);
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).not.toContain('secret-looking-segment');
    });

    describe('with a base path in the environment URL', () => {
      it.each([
        ['parent of the proxy prefix', '/../x'],
        ['out of the base path', '/../../outside'],
        ['to another /proxy outside the base', '/../../proxy/x'],
        ['through encoded dots', '/%2e%2e/x'],
        ['through an empty segment', '//..%2f..%2fx'],
      ])('%s', async (_name, path) => {
        const client = makeClient(`${origin}/base`);
        await expect(call(client, path)).rejects.toThrow(
          'path must resolve under the proxy prefix'
        );
        expect(seen).toEqual([]);
      });

      it.each([
        ['a sibling sharing the prefix name', '/..%2fproxyx'],
        ['a sibling with a suffix', '/..%2fproxy-other'],
      ])('%s (base path with a trailing slash)', async (_name, path) => {
        const client = makeClient(`${origin}/base/`);
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
      ['an in-prefix LF-split dot segment', '/x/.\n./y', '/proxy/y'],
      ['in-prefix encoded dots', '/x/%2e%2e/y', '/proxy/y'],
      ['the bare proxy root', '/', '/proxy/'],
      // Cleans to exactly the bare prefix; sent as before.
      [
        'out and back in to the bare prefix',
        '/..%2fproxy',
        '/proxy/..%2fproxy',
      ],
      ['an empty segment', '//drive/v3/files', '/proxy//drive/v3/files'],
      [
        'an empty segment and an in-prefix parent',
        '//a/..%2fb',
        '/proxy//a/..%2fb',
      ],
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
        queryParams: { fields: 'user', q: '../../outside' },
      });
      expect(seen.map((s) => s.url)).toEqual([
        '/proxy/drive/v3/about?fields=user&q=..%2F..%2Foutside',
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

/**
 * A proxied API may answer with a redirect. Redirects are still followed, but a
 * hop that leaves `<envUrl>/proxy/` (another origin, or a same-origin path
 * outside the prefix) must not carry the client's Authorization or the
 * connection headers. Hops that stay under the prefix behave as before.
 */
describe('actions.request redirects', () => {
  type Hop = {
    server: 'env' | 'other';
    method?: string;
    url?: string;
    host?: string;
    authorization?: string;
    connectionName?: string;
    identifier?: string;
  };

  let envServer: http.Server;
  let otherServer: http.Server;
  let envPort: number;
  let otherPort: number;
  let envOrigin: string;
  const hops: Hop[] = [];

  // Any request carrying `?to=<location>` is answered with that redirect;
  // everything else returns 200 with the path it was served on.
  const handler =
    (server: Hop['server']) =>
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      hops.push({
        server,
        method: req.method,
        url: req.url,
        host: req.headers.host,
        authorization: req.headers.authorization,
        connectionName: req.headers['connection_name'] as string | undefined,
        identifier: req.headers['identifier'] as string | undefined,
      });
      const to = new URL(req.url ?? '/', 'http://placeholder').searchParams.get(
        'to'
      );
      const status = Number(
        new URL(req.url ?? '/', 'http://placeholder').searchParams.get(
          'status'
        ) ?? 302
      );
      req.resume();
      req.on('end', () => {
        if (to !== null) {
          res.writeHead(status, { location: to });
          res.end();
          return;
        }
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ servedPath: req.url }));
      });
    };

  // Listen on all interfaces so both 127.0.0.1 and localhost reach the
  // servers (used for the different-host case).
  const listen = (s: http.Server) =>
    new Promise<number>((resolve) =>
      s.listen(0, () => resolve((s.address() as AddressInfo).port))
    );

  beforeAll(async () => {
    envServer = http.createServer(handler('env'));
    otherServer = http.createServer(handler('other'));
    envPort = await listen(envServer);
    otherPort = await listen(otherServer);
    envOrigin = `http://127.0.0.1:${envPort}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => envServer.close(() => resolve()));
    await new Promise<void>((resolve) => otherServer.close(() => resolve()));
  });

  beforeEach(() => {
    hops.length = 0;
  });

  const redirectVia = (
    client: ScalekitClient,
    location: string,
    extra: { method?: string; body?: unknown; status?: number } = {}
  ) =>
    client.actions.request({
      connectionName: 'googledrive',
      identifier: 'user_123',
      path: '/redirect',
      queryParams: {
        to: location,
        ...(extra.status ? { status: extra.status } : {}),
      },
      ...(extra.method ? { method: extra.method } : {}),
      ...(extra.body !== undefined ? { body: extra.body } : {}),
    });

  const withCredentials = {
    authorization: 'Bearer test-access-token',
    connectionName: 'googledrive',
    identifier: 'user_123',
  };
  const withoutCredentials = {
    authorization: undefined,
    connectionName: undefined,
    identifier: undefined,
  };

  it('follows a same-host redirect outside the prefix without credentials', async () => {
    const res = await redirectVia(makeClient(envOrigin), '/outside');
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ servedPath: '/outside' });
    expect(hops).toEqual([
      {
        server: 'env',
        method: 'GET',
        url: '/proxy/redirect?to=%2Foutside',
        host: `127.0.0.1:${envPort}`,
        ...withCredentials,
      },
      {
        server: 'env',
        method: 'GET',
        url: '/outside',
        host: `127.0.0.1:${envPort}`,
        ...withoutCredentials,
      },
    ]);
  });

  it('keeps credentials on a redirect to another path under the prefix', async () => {
    const res = await redirectVia(
      makeClient(envOrigin),
      '/proxy/drive/v3/files'
    );
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ servedPath: '/proxy/drive/v3/files' });
    expect(hops.map((h) => ({ url: h.url, ...withoutUrl(h) }))).toEqual([
      {
        url: '/proxy/redirect?to=%2Fproxy%2Fdrive%2Fv3%2Ffiles',
        ...withCredentials,
      },
      { url: '/proxy/drive/v3/files', ...withCredentials },
    ]);
  });

  it('keeps credentials on an absolute same-origin redirect under the prefix', async () => {
    await redirectVia(makeClient(envOrigin), `${envOrigin}/proxy/a?b=1`);
    expect(hops[1]).toMatchObject({ url: '/proxy/a?b=1', ...withCredentials });
  });

  it.each([
    ['dot segments', '/proxy/x/../../outside', '/outside'],
    [
      'encoded slashes (decoded view)',
      '/proxy/x%2f..%2f..%2foutside',
      '/proxy/x%2f..%2f..%2foutside',
    ],
    ['the bare /proxy path', '/proxy', '/proxy'],
    ['an empty segment', '/proxy//..%2fx', '/proxy//..%2fx'],
  ])(
    'strips credentials on a same-origin redirect escaping via %s',
    async (_name, location, received) => {
      await redirectVia(makeClient(envOrigin), location);
      expect(hops).toHaveLength(2);
      expect(hops[1]).toEqual({
        server: 'env',
        method: 'GET',
        url: received,
        host: `127.0.0.1:${envPort}`,
        ...withoutCredentials,
      });
    }
  );

  it('strips credentials on a redirect to a different port', async () => {
    await redirectVia(
      makeClient(envOrigin),
      `http://127.0.0.1:${otherPort}/proxy/x`
    );
    expect(hops[1]).toEqual({
      server: 'other',
      method: 'GET',
      url: '/proxy/x',
      host: `127.0.0.1:${otherPort}`,
      ...withoutCredentials,
    });
  });

  it('strips credentials on a redirect to a different host on the same port', async () => {
    await redirectVia(
      makeClient(envOrigin),
      `http://localhost:${envPort}/proxy/x`
    );
    expect(hops[1]).toEqual({
      server: 'env',
      method: 'GET',
      url: '/proxy/x',
      host: `localhost:${envPort}`,
      ...withoutCredentials,
    });
  });

  it('keeps credentials off later hops once a hop left the prefix', async () => {
    await redirectVia(
      makeClient(envOrigin),
      `/outside/hop?to=${encodeURIComponent('/proxy/final')}`
    );
    expect(hops.map((h) => ({ url: h.url, ...withoutUrl(h) }))).toEqual([
      {
        url: '/proxy/redirect?to=%2Foutside%2Fhop%3Fto%3D%252Fproxy%252Ffinal',
        ...withCredentials,
      },
      { url: '/outside/hop?to=%2Fproxy%2Ffinal', ...withoutCredentials },
      { url: '/proxy/final', ...withoutCredentials },
    ]);
  });

  it('strips credentials on a 307 that re-sends the body outside the prefix', async () => {
    await redirectVia(makeClient(envOrigin), '/outside', {
      method: 'POST',
      body: { a: 1 },
      status: 307,
    });
    expect(hops[1]).toMatchObject({
      method: 'POST',
      url: '/outside',
      ...withoutCredentials,
    });
  });

  describe('with a base path in the environment URL', () => {
    it('strips credentials on a redirect to /proxy outside the base path', async () => {
      await redirectVia(makeClient(`${envOrigin}/base`), '/proxy/x');
      expect(hops.map((h) => ({ url: h.url, ...withoutUrl(h) }))).toEqual([
        { url: '/base/proxy/redirect?to=%2Fproxy%2Fx', ...withCredentials },
        { url: '/proxy/x', ...withoutCredentials },
      ]);
    });

    it('keeps credentials on a redirect under <base>/proxy/', async () => {
      await redirectVia(makeClient(`${envOrigin}/base/`), '/base/proxy/y');
      expect(hops[1]).toMatchObject({
        url: '/base/proxy/y',
        ...withCredentials,
      });
    });
  });

  function withoutUrl(h: Hop) {
    return {
      authorization: h.authorization,
      connectionName: h.connectionName,
      identifier: h.identifier,
    };
  }
});

/**
 * Direct checks of the redirect hook for targets a local server cannot stand
 * in for (subdomains, scheme changes, malformed locations).
 */
describe('proxyRedirectGuard', () => {
  const env = 'https://env.example.com';
  const credentialHeaders = () => ({
    Authorization: 'Bearer t',
    connection_name: 'googledrive',
    identifier: 'user_123',
    'X-Custom': 'kept',
  });
  const run = (href: unknown, envUrl = env) => {
    const options: Record<string, unknown> = {
      href,
      headers: credentialHeaders(),
    };
    proxyRedirectGuard(envUrl)(options);
    return options.headers;
  };

  it.each([
    [
      'a subdomain of the environment host',
      'https://sub.env.example.com/proxy/x',
    ],
    ['a scheme downgrade on the same host', 'http://env.example.com/proxy/x'],
    ['an explicit non-default port', 'https://env.example.com:8443/proxy/x'],
    [
      'a same-origin path outside the prefix',
      'https://env.example.com/outside',
    ],
    ['a missing href', undefined],
    ['an unparseable href', 'http://[bad'],
  ])('removes credential headers for %s', (_name, href) => {
    expect(run(href)).toEqual({ 'X-Custom': 'kept' });
  });

  it('removes credential headers when the hop request-target carries a fragment', () => {
    // Behind an HTTP forward proxy the hop is sent as its full href.
    const href = 'https://env.example.com/proxy/x#/../../outside';
    const options: Record<string, unknown> = {
      href,
      path: href,
      headers: credentialHeaders(),
    };
    proxyRedirectGuard(env)(options);
    expect(options.headers).toEqual({ 'X-Custom': 'kept' });
  });

  it('keeps credential headers when a fragment is not part of the request-target', () => {
    // Direct connection: only pathname + search is sent.
    const options: Record<string, unknown> = {
      href: 'https://env.example.com/proxy/x#/../../outside',
      path: '/proxy/x',
      headers: credentialHeaders(),
    };
    proxyRedirectGuard(env)(options);
    expect(options.headers).toEqual(credentialHeaders());
  });

  it('matches header names case-insensitively', () => {
    const options: Record<string, unknown> = {
      href: 'https://env.example.com/outside',
      headers: { authorization: 'a', CONNECTION_NAME: 'c', Identifier: 'i' },
    };
    proxyRedirectGuard(env)(options);
    expect(options.headers).toEqual({});
  });

  it.each([
    ['a path under the prefix', 'https://env.example.com/proxy/drive/v3/files'],
    ['the default port spelled out', 'https://env.example.com:443/proxy/x'],
    ['a query string', 'https://env.example.com/proxy/x?next=/outside'],
  ])('leaves headers untouched for %s', (_name, href) => {
    expect(run(href)).toEqual(credentialHeaders());
  });
});

/**
 * Through an HTTP forward proxy (an `http://` environment URL), axios sends
 * the absolute URL as the request line. It must be exactly the URL the
 * containment checks modelled, escapes must still be rejected before
 * sending, and redirect hops must follow the same credential rules.
 */
describe('actions.request through an HTTP forward proxy', () => {
  const PROXY_ENV_KEYS = [
    'HTTP_PROXY',
    'http_proxy',
    'HTTPS_PROXY',
    'https_proxy',
    'ALL_PROXY',
    'all_proxy',
    'NO_PROXY',
    'no_proxy',
  ];
  const savedEnv: Record<string, string | undefined> = {};
  const envUrl = 'http://env.test:8080'; // never resolved: all traffic goes to the proxy
  type Line = {
    requestTarget?: string;
    authorization?: string;
    connectionName?: string;
  };
  const lines: Line[] = [];
  let proxyServer: http.Server;
  let proxyPort: number;

  beforeAll(async () => {
    for (const k of PROXY_ENV_KEYS) savedEnv[k] = process.env[k];
    // Records the request line and answers itself; `?to=` asks for a redirect.
    proxyServer = http.createServer((req, res) => {
      lines.push({
        requestTarget: req.url,
        authorization: req.headers.authorization,
        connectionName: req.headers['connection_name'] as string | undefined,
      });
      let to: string | null = null;
      try {
        to = new URL(req.url ?? '').searchParams.get('to');
      } catch {
        to = null;
      }
      if (to !== null) {
        res.writeHead(302, { location: to });
        res.end();
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{}');
    });
    await new Promise<void>((resolve) =>
      proxyServer.listen(0, '127.0.0.1', () => resolve())
    );
    proxyPort = (proxyServer.address() as AddressInfo).port;
  });

  afterAll(async () => {
    for (const k of PROXY_ENV_KEYS) {
      if (savedEnv[k] === undefined) delete process.env[k];
      else process.env[k] = savedEnv[k];
    }
    await new Promise<void>((resolve) => proxyServer.close(() => resolve()));
  });

  beforeEach(() => {
    lines.length = 0;
    for (const k of PROXY_ENV_KEYS) delete process.env[k];
  });

  const viaProxyConfig = (): ScalekitClient => {
    const client = makeClient(envUrl);
    (
      client as unknown as { coreClient: CoreClient }
    ).coreClient.axios.defaults.proxy = {
      protocol: 'http',
      host: '127.0.0.1',
      port: proxyPort,
    };
    return client;
  };
  const viaProxyEnv = (): ScalekitClient => {
    process.env.HTTP_PROXY = `http://127.0.0.1:${proxyPort}`;
    return makeClient(envUrl);
  };
  const credentialed = {
    authorization: 'Bearer test-access-token',
    connectionName: 'googledrive',
  };
  const stripped = { authorization: undefined, connectionName: undefined };

  describe.each([
    ['the proxy config', viaProxyConfig],
    ['the HTTP_PROXY environment variable', viaProxyEnv],
  ])('via %s', (_name, makeProxiedClient) => {
    it.each([
      ['/drive/v3/files', `${envUrl}/proxy/drive/v3/files`],
      ['/a b/c', `${envUrl}/proxy/a%20b/c`],
      ['/a%2Fb/c', `${envUrl}/proxy/a%2Fb/c`],
      ['/a/../drive', `${envUrl}/proxy/drive`],
      ['//a/..%2fb', `${envUrl}/proxy//a/..%2fb`],
    ])(
      'sends %j as exactly the modelled absolute URL',
      async (path, requestTarget) => {
        await call(makeProxiedClient(), path);
        expect(lines).toEqual([{ requestTarget, ...credentialed }]);
      }
    );

    it.each([
      ['/a%2Fb/%2e%2e/%2e%2e/outside'],
      ['/a%2Fb/../../outside'],
      ['/x%2f..%2f..%2foutside'],
      ['//..%2foutside'],
    ])('rejects %j before anything reaches the proxy', async (path) => {
      await expect(call(makeProxiedClient(), path)).rejects.toThrow(
        'path must resolve under the proxy prefix'
      );
      expect(lines).toEqual([]);
    });

    it.each([
      ['an in-prefix path', '/proxy/in', `${envUrl}/proxy/in`, credentialed],
      ['a path outside the prefix', '/outside', `${envUrl}/outside`, stripped],
      [
        'encoded dots after an encoded slash',
        '/proxy/a%2Fb/%2e%2e/%2e%2e/outside',
        `${envUrl}/outside`,
        stripped,
      ],
      [
        'an empty segment',
        '/proxy//..%2foutside',
        `${envUrl}/proxy//..%2foutside`,
        stripped,
      ],
      [
        'a fragment carried into the request line',
        '/proxy/x#/../../outside',
        `${envUrl}/proxy/x#/../../outside`,
        stripped,
      ],
      [
        'another host',
        'http://other.test:8080/proxy/x',
        'http://other.test:8080/proxy/x',
        stripped,
      ],
    ])('redirect hop to %s', async (_hop, location, requestTarget, headers) => {
      await call(makeProxiedClient(), '/r', { queryParams: { to: location } });
      expect(lines).toHaveLength(2);
      expect(lines[0]).toMatchObject(credentialed);
      expect(lines[1]).toEqual({ requestTarget, ...headers });
    });
  });
});
