// ScalekitEdgeClient token validation on Node.js, where `jose` resolves to its
// Node build and fetches the JWKS over node:http(s). The JWKS is served from a
// local HTTP server, so no request leaves the machine. tests/edge.test.ts
// covers the fetch-based build that edge bundlers use.
import { describe, it, expect, beforeAll, afterEach } from '@jest/globals';
import * as jose from 'jose';
import { ScalekitEdgeClient, ScalekitEdgeError } from '../src/edge';
import {
  startJwksServer,
  unusedLocalUrl,
  type JwksServer,
} from './utils/jwks-server';

describe('ScalekitEdgeClient.validateToken on Node.js (local JWKS server)', () => {
  let privateKey: Awaited<
    ReturnType<typeof jose.generateKeyPair>
  >['privateKey'];
  let publicJwk: jose.JWK;
  let server: JwksServer | undefined;

  beforeAll(async () => {
    const pair = await jose.generateKeyPair('RS256');
    privateKey = pair.privateKey;
    publicJwk = {
      ...(await jose.exportJWK(pair.publicKey)),
      kid: 'test-key-1',
      alg: 'RS256',
      use: 'sig',
    };
  });

  afterEach(async () => {
    await server?.close();
    server = undefined;
  });

  const serveKeys = async () => {
    server = await startJwksServer(() => ({
      body: JSON.stringify({ keys: [publicJwk] }),
    }));
    return new ScalekitEdgeClient(server.url, 'skc_123', 'secret');
  };

  const sign = (
    claims: jose.JWTPayload,
    { kid = 'test-key-1', exp = '1h' }: { kid?: string; exp?: string } = {}
  ) =>
    new jose.SignJWT(claims)
      .setProtectedHeader({ alg: 'RS256', kid })
      .setIssuedAt()
      .setExpirationTime(exp)
      .sign(privateKey);

  const rejection = async (p: Promise<unknown>): Promise<unknown> => {
    try {
      await p;
    } catch (err) {
      return err;
    }
    throw new Error('expected the promise to reject');
  };

  it('accepts a valid token using keys fetched from the JWKS endpoint', async () => {
    const client = await serveKeys();
    const token = await sign({
      sub: 'user_1',
      iss: 'https://issuer.example.com',
      aud: 'app',
    });

    await expect(
      client.validateToken(token, {
        issuer: 'https://issuer.example.com',
        audience: ['app'],
      })
    ).resolves.toMatchObject({ sub: 'user_1' });
    expect(server?.requestCount()).toBe(1);
  });

  it.each([
    ['an expired token', () => sign({ sub: 'u' }, { exp: '-1h' }), {}],
    [
      'a token whose kid is not in the JWKS',
      () => sign({ sub: 'u' }, { kid: 'unknown-kid' }),
      {},
    ],
    [
      'a token with a different issuer',
      () => sign({ sub: 'u', iss: 'https://other.example.com' }),
      { issuer: 'https://issuer.example.com' },
    ],
    [
      'a token with a different audience',
      () => sign({ sub: 'u', aud: 'other' }),
      { audience: ['app'] },
    ],
    ['a malformed token', async () => 'not-a-jwt', {}],
  ])('rejects %s with ScalekitEdgeError(401)', async (_, makeToken, opts) => {
    const client = await serveKeys();
    const err = await rejection(client.validateToken(await makeToken(), opts));
    expect(err).toBeInstanceOf(ScalekitEdgeError);
    expect((err as ScalekitEdgeError).statusCode).toBe(401);
  });

  it('propagates a malformed JWKS as JWKSInvalid, not as a 401', async () => {
    server = await startJwksServer(() => ({
      body: JSON.stringify({ not: 'a jwks' }),
    }));
    const client = new ScalekitEdgeClient(server.url, 'skc_123', 'secret');
    const err = await rejection(client.validateToken(await sign({ sub: 'u' })));
    expect(err).not.toBeInstanceOf(ScalekitEdgeError);
    expect(err).toBeInstanceOf(jose.errors.JWKSInvalid);
  });

  it('propagates a non-200 JWKS response, not as a 401', async () => {
    server = await startJwksServer(() => ({ status: 500, body: '{}' }));
    const client = new ScalekitEdgeClient(server.url, 'skc_123', 'secret');
    const err = await rejection(client.validateToken(await sign({ sub: 'u' })));
    expect(err).not.toBeInstanceOf(ScalekitEdgeError);
    expect(err).toBeInstanceOf(jose.errors.JOSEError);
    expect((err as Error).message).toBe(
      'Expected 200 OK from the JSON Web Key Set HTTP response'
    );
  });

  it('propagates an unreachable JWKS endpoint, not as a 401', async () => {
    const client = new ScalekitEdgeClient(
      await unusedLocalUrl(),
      'skc_123',
      'secret'
    );
    const err = await rejection(client.validateToken(await sign({ sub: 'u' })));
    expect(err).not.toBeInstanceOf(ScalekitEdgeError);
    // node:http rejects with the system error; fetch wraps it as `cause`.
    const e = err as { code?: string; cause?: { code?: string } };
    expect(e.code ?? e.cause?.code).toBe('ECONNREFUSED');
  });
});
