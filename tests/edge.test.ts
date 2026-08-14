import { describe, it, expect, afterEach, beforeAll, beforeEach, jest as jestGlobal } from '@jest/globals';
import * as jose from 'jose';
import { ScalekitEdgeClient, ScalekitEdgeError } from '../src/edge';

describe('ScalekitEdgeClient construction', () => {
  it('constructs with envUrl/clientId/clientSecret', () => {
    const client = new ScalekitEdgeClient(
      'https://acme.scalekit.cloud',
      'skc_123',
      'secret'
    );
    expect(client).toBeInstanceOf(ScalekitEdgeClient);
  });
});

describe('ScalekitEdgeClient.getAuthorizationUrl', () => {
  const client = new ScalekitEdgeClient(
    'https://acme.scalekit.cloud',
    'skc_123',
    'secret'
  );

  it('builds a URL with the default scopes', () => {
    const url = client.getAuthorizationUrl('https://app.example.com/callback');
    const parsed = new URL(url);

    expect(parsed.origin + parsed.pathname).toBe(
      'https://acme.scalekit.cloud/oauth/authorize'
    );
    expect(parsed.searchParams.get('response_type')).toBe('code');
    expect(parsed.searchParams.get('client_id')).toBe('skc_123');
    expect(parsed.searchParams.get('redirect_uri')).toBe(
      'https://app.example.com/callback'
    );
    expect(parsed.searchParams.get('scope')).toBe('openid profile email');
  });

  it('includes optional parameters when provided', () => {
    const url = client.getAuthorizationUrl('https://app.example.com/callback', {
      connectionId: 'conn_123',
      organizationId: 'org_456',
      loginHint: 'user@example.com',
      state: 'xyz',
    });
    const parsed = new URL(url);

    expect(parsed.searchParams.get('connection_id')).toBe('conn_123');
    expect(parsed.searchParams.get('organization_id')).toBe('org_456');
    expect(parsed.searchParams.get('login_hint')).toBe('user@example.com');
    expect(parsed.searchParams.get('state')).toBe('xyz');
  });

  it('handles an envUrl with a trailing slash', () => {
    const clientWithSlash = new ScalekitEdgeClient(
      'https://acme.scalekit.cloud/',
      'skc_123',
      'secret'
    );
    const url = clientWithSlash.getAuthorizationUrl(
      'https://app.example.com/callback'
    );
    expect(url.startsWith('https://acme.scalekit.cloud/oauth/authorize?')).toBe(
      true
    );
  });

  it('sets both domain_hint and domain when domainHint is provided', () => {
    const url = client.getAuthorizationUrl('https://app.example.com/callback', {
      domainHint: 'example.com',
    });
    const parsed = new URL(url);

    expect(parsed.searchParams.get('domain_hint')).toBe('example.com');
    expect(parsed.searchParams.get('domain')).toBe('example.com');
  });
});

describe('ScalekitEdgeClient.getLogoutUrl', () => {
  const client = new ScalekitEdgeClient(
    'https://acme.scalekit.cloud',
    'skc_123',
    'secret'
  );

  it('builds a bare logout URL with no options', () => {
    const url = client.getLogoutUrl();
    expect(url).toBe('https://acme.scalekit.cloud/oidc/logout');
  });

  it('includes idTokenHint and postLogoutRedirectUri when provided', () => {
    const url = client.getLogoutUrl({
      idTokenHint: 'idt_abc',
      postLogoutRedirectUri: 'https://app.example.com/',
    });
    const parsed = new URL(url);

    expect(parsed.origin + parsed.pathname).toBe(
      'https://acme.scalekit.cloud/oidc/logout'
    );
    expect(parsed.searchParams.get('id_token_hint')).toBe('idt_abc');
    expect(parsed.searchParams.get('post_logout_redirect_uri')).toBe(
      'https://app.example.com/'
    );
  });
});

describe('ScalekitEdgeError', () => {
  it('carries statusCode, message, and optional errorCode', () => {
    const err = new ScalekitEdgeError(400, 'invalid_grant', 'invalid_grant');
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('invalid_grant');
    expect(err.errorCode).toBe('invalid_grant');
    expect(err.name).toBe('ScalekitEdgeError');
  });

  it('errorCode is optional', () => {
    const err = new ScalekitEdgeError(500, 'server error');
    expect(err.errorCode).toBeUndefined();
  });
});

describe('ScalekitEdgeClient.authenticateWithCode', () => {
  const client = new ScalekitEdgeClient(
    'https://acme.scalekit.cloud',
    'skc_123',
    'secret'
  );

  afterEach(() => {
    jestGlobal.restoreAllMocks();
  });

  it('exchanges a code for tokens and derives user from the id_token', async () => {
    // A minimal unsigned-looking JWT is fine here -- authenticateWithCode only
    // decodes claims (jose.decodeJwt), it does not verify the signature.
    const idTokenPayload = {
      sub: 'user_123',
      name: 'Test User',
      given_name: 'Test',
      email: 'test.user@example.com',
      email_verified: true,
    };
    const idToken = `${Buffer.from(JSON.stringify({ alg: 'none' })).toString(
      'base64url'
    )}.${Buffer.from(JSON.stringify(idTokenPayload)).toString(
      'base64url'
    )}.`;

    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id_token: idToken,
        access_token: 'at_123',
        expires_in: 300,
        refresh_token: 'rt_123',
      }),
    } as unknown as Response);

    const result = await client.authenticateWithCode(
      'auth_code',
      'https://app.example.com/callback'
    );

    expect(result.accessToken).toBe('at_123');
    expect(result.refreshToken).toBe('rt_123');
    expect(result.expiresIn).toBe(300);
    expect(result.idToken).toBe(idToken);
    expect(result.user.email).toBe('test.user@example.com');

    const [url, init] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('https://acme.scalekit.cloud/oauth/token');
    expect(init.method).toBe('POST');
    const body = new URLSearchParams(init.body as string);
    expect(body.get('grant_type')).toBe('authorization_code');
    expect(body.get('code')).toBe('auth_code');
    expect(body.get('redirect_uri')).toBe('https://app.example.com/callback');
    expect(body.get('client_id')).toBe('skc_123');
    expect(body.get('client_secret')).toBe('secret');
  });

  it('throws ScalekitEdgeError on a non-2xx response', async () => {
    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'invalid_grant',
        error_description: 'code has expired',
      }),
    } as unknown as Response);

    await expect(
      client.authenticateWithCode('bad_code', 'https://app.example.com/callback')
    ).rejects.toThrow(ScalekitEdgeError);
  });
});

describe('ScalekitEdgeClient.refreshAccessToken', () => {
  const client = new ScalekitEdgeClient(
    'https://acme.scalekit.cloud',
    'skc_123',
    'secret'
  );

  afterEach(() => {
    jestGlobal.restoreAllMocks();
  });

  it('refreshes tokens', async () => {
    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: 'at_new',
        refresh_token: 'rt_new',
      }),
    } as unknown as Response);

    const result = await client.refreshAccessToken('rt_old');

    expect(result.accessToken).toBe('at_new');
    expect(result.refreshToken).toBe('rt_new');

    const [, init] = (global.fetch as any).mock.calls[0];
    const body = new URLSearchParams(init.body as string);
    expect(body.get('grant_type')).toBe('refresh_token');
    expect(body.get('refresh_token')).toBe('rt_old');
  });

  it('throws ScalekitEdgeError on a non-2xx response', async () => {
    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'invalid_grant' }),
    } as unknown as Response);

    await expect(client.refreshAccessToken('dead_token')).rejects.toThrow(
      ScalekitEdgeError
    );
  });

  it('throws immediately if refreshToken is falsy, without calling fetch', async () => {
    const fetchSpy = jestGlobal.spyOn(global, 'fetch');

    await expect(client.refreshAccessToken('')).rejects.toThrow(
      'Refresh token is required'
    );

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('throws if response has no access_token, even on 200', async () => {
    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        refresh_token: 'rt_new',
      }),
    } as unknown as Response);

    await expect(client.refreshAccessToken('rt_old')).rejects.toThrow(
      'Missing access_token in authentication response'
    );
  });

  it('throws if response has no refresh_token, even on 200', async () => {
    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: 'at_new',
      }),
    } as unknown as Response);

    await expect(client.refreshAccessToken('rt_old')).rejects.toThrow(
      'Missing refresh_token in authentication response'
    );
  });
});

describe('ScalekitEdgeClient.validateToken', () => {
  let publicJwk: jose.JWK;
  let privateKey: Awaited<ReturnType<typeof jose.generateKeyPair>>['privateKey'];
  let client: ScalekitEdgeClient;

  beforeAll(async () => {
    const { publicKey, privateKey: priv } = await jose.generateKeyPair('RS256');
    privateKey = priv;
    publicJwk = await jose.exportJWK(publicKey);
    publicJwk.kid = 'test-key-1';
    publicJwk.alg = 'RS256';
    publicJwk.use = 'sig';
  });

  beforeEach(() => {
    client = new ScalekitEdgeClient(
      'https://acme.scalekit.cloud',
      'skc_123',
      'secret'
    );
  });

  afterEach(() => {
    jestGlobal.restoreAllMocks();
  });

  async function signTestToken(payload: Record<string, unknown>) {
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key-1' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(privateKey);
  }

  it('verifies a real RS256 token against a mocked JWKS endpoint', async () => {
    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ keys: [publicJwk] }),
    } as Response);

    const token = await signTestToken({ email: 'user@example.com' });
    const payload = await client.validateToken<{ email: string }>(token);

    expect(payload.email).toBe('user@example.com');
  });

  it('rejects a token signed by an unrelated key', async () => {
    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ keys: [publicJwk] }),
    } as Response);

    const { privateKey: otherKey } = await jose.generateKeyPair('RS256');
    const forgedToken = await new jose.SignJWT({ email: 'attacker@evil.com' })
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key-1' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(otherKey);

    await expect(client.validateToken(forgedToken)).rejects.toThrow();
  });
});

describe('ScalekitEdgeClient.getIdpInitiatedLoginClaims', () => {
  it('delegates to validateToken', async () => {
    const client = new ScalekitEdgeClient(
      'https://acme.scalekit.cloud',
      'skc_123',
      'secret'
    );
    const spy = jestGlobal
      .spyOn(client, 'validateToken')
      .mockResolvedValue({
        connection_id: 'conn_1',
        organization_id: 'org_1',
        login_hint: 'user@example.com',
      });

    const claims = await client.getIdpInitiatedLoginClaims('some.jwt.token');

    expect(spy).toHaveBeenCalledWith('some.jwt.token', undefined);
    expect(claims.connection_id).toBe('conn_1');
  });
});
