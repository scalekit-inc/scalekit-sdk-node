import { describe, it, expect, jest as jestGlobal } from '@jest/globals';
import express, { Express } from 'express';
import request from 'supertest';

import { ScalekitAuth } from '../src/frameworks/express';
import { decryptSession } from '../src/middleware/sessionCrypto';

function fakeClient() {
  return {
    getAuthorizationUrl: jestGlobal.fn(),
    authenticateWithCode: jestGlobal.fn(),
    refreshAccessToken: jestGlobal.fn(),
    validateToken: jestGlobal.fn(),
    getLogoutUrl: jestGlobal.fn(),
    getIdpInitiatedLoginClaims: jestGlobal.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function buildApp(
  secret = 'express-test-secret',
  extraOptions: Record<string, unknown> = {}
) {
  const app: Express = express();
  const client = fakeClient();
  const auth = new ScalekitAuth({
    client,
    redirectUri: 'https://app.example.com/callback',
    cookieEncryptionSecret: secret,
    ...extraOptions,
  });
  app.use(auth.router);
  app.get('/account', auth.requiresAuth, (req, res) => {
    res.send(
      `hello ${(req.scalekitUser as { email?: string } | undefined)?.email}`
    );
  });
  return { app, auth, client };
}

async function loginAndGetState(app: Express): Promise<string> {
  // Supertest makes a real loopback HTTP connection (not an in-process
  // transport), so its cookie jar correctly refuses to resend a Secure
  // cookie over that plain-http connection -- same as a real browser would
  // over plain http. Chain the cookie value manually instead, exactly as
  // the sk_session tests below already do.
  const res = await request(app).get('/login').redirects(0);
  const setCookie = res.headers['set-cookie']?.[0] ?? '';
  return setCookie.split('sk_oauth_state=')[1]?.split(';')[0] ?? '';
}

describe('ScalekitAuth (Express)', () => {
  it('login redirects to the authorization url', async () => {
    const { app, client } = buildApp();
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );

    const res = await request(app).get('/login').redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );
  });

  it('login with idp_initiated_login uses claims for the authorization url', async () => {
    // /login doubles as the dashboard-registered "Initiate Login URL" --
    // Scalekit can land users here with an idp_initiated_login JWT (e.g. an
    // IdP portal tile click with an active session) instead of a plain hit.
    const { app, client } = buildApp();
    client.getIdpInitiatedLoginClaims.mockResolvedValue({
      connection_id: 'conn_123',
      organization_id: 'org_456',
      login_hint: 'user@example.com',
    });
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );

    const res = await request(app)
      .get('/login?idp_initiated_login=some.jwt.token')
      .redirects(0);

    expect(res.status).toBe(302);
    expect(client.getIdpInitiatedLoginClaims).toHaveBeenCalledWith(
      'some.jwt.token'
    );
    const callOptions = client.getAuthorizationUrl.mock.calls[0][1];
    expect(callOptions.connectionId).toBe('conn_123');
    expect(callOptions.organizationId).toBe('org_456');
    expect(callOptions.loginHint).toBe('user@example.com');
  });

  it('login with an invalid idp_initiated_login falls back to normal login', async () => {
    const { app, client } = buildApp();
    client.getIdpInitiatedLoginClaims.mockRejectedValue(
      new Error('invalid token')
    );
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );

    const res = await request(app)
      .get('/login?idp_initiated_login=garbage')
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );
    const callOptions = client.getAuthorizationUrl.mock.calls[0][1];
    expect(callOptions.connectionId).toBeUndefined();
  });

  it('callback sets an encrypted cookie and redirects', async () => {
    const { app, client } = buildApp('callback-secret');
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize'
    );
    client.authenticateWithCode.mockResolvedValue({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_1',
      refreshToken: 'rt_1',
      idToken: 'idt_1',
      expiresIn: 300,
    });
    client.validateToken.mockResolvedValue({
      email: 'test.user@example.com',
      exp: Date.now() / 1000 + 300,
    });

    const state = await loginAndGetState(app);
    const res = await request(app)
      .get(`/callback?code=abc123&state=${state}`)
      .set('Cookie', [`sk_oauth_state=${state}`])
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
    const setCookie = res.headers['set-cookie']?.[0] ?? '';
    expect(setCookie).toContain('sk_session=');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('Secure');
  });

  it('callback with a provider error redirects to login, not a 500', async () => {
    const { app, client } = buildApp();

    const res = await request(app)
      .get('/callback?error=access_denied')
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
    expect(client.authenticateWithCode).not.toHaveBeenCalled();
  });

  it('callback with a missing code redirects to login', async () => {
    const { app, client } = buildApp();

    const res = await request(app).get('/callback').redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
    expect(client.authenticateWithCode).not.toHaveBeenCalled();
  });

  it('callback with a missing state redirects to login', async () => {
    // No /login call at all -- no state cookie exists, simulating a forged
    // callback URL sent directly to a victim.
    const { app, client } = buildApp();

    const res = await request(app)
      .get('/callback?code=abc123&state=whatever')
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
    expect(client.authenticateWithCode).not.toHaveBeenCalled();
  });

  it('callback with a mismatched state redirects to login', async () => {
    const { app, client } = buildApp();
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize'
    );

    const state = await loginAndGetState(app);
    const res = await request(app)
      .get('/callback?code=abc123&state=attacker-supplied')
      .set('Cookie', [`sk_oauth_state=${state}`])
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
    expect(client.authenticateWithCode).not.toHaveBeenCalled();
  });

  it('protected route without a cookie redirects to login, not a JSON 401', async () => {
    // Same property tested for Python's Flask/FastAPI/Django adapters: "no
    // valid session" must be a real redirect a browser follows, not a JSON
    // 401 a background fetch/XHR would silently swallow.
    const { app } = buildApp();

    const res = await request(app).get('/account').redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login?returnTo=%2Faccount');
    expect(res.headers['content-type']).not.toMatch(/json/);
  });

  it('protected route without a session redirects to login with returnTo set', async () => {
    const { app } = buildApp();

    const res = await request(app).get('/account?tab=billing').redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(
      '/login?returnTo=%2Faccount%3Ftab%3Dbilling'
    );
  });

  it('completing login lands back on the preserved returnTo path', async () => {
    const { app, client } = buildApp('returnto-secret');
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize'
    );
    client.authenticateWithCode.mockResolvedValue({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_1',
      refreshToken: 'rt_1',
      idToken: 'idt_1',
      expiresIn: 300,
    });
    client.validateToken.mockResolvedValue({
      email: 'test.user@example.com',
      exp: Date.now() / 1000 + 300,
    });

    const loginRes = await request(app)
      .get('/login?returnTo=%2Faccount')
      .redirects(0);
    const setCookies = (loginRes.headers['set-cookie'] ??
      []) as unknown as string[];
    const state = setCookies
      .find((c) => c.startsWith('sk_oauth_state='))
      ?.split('sk_oauth_state=')[1]
      ?.split(';')[0];
    const returnToCookie = setCookies
      .find((c) => c.startsWith('sk_return_to='))
      ?.split('sk_return_to=')[1]
      ?.split(';')[0];
    expect(returnToCookie).toBeDefined();

    const res = await request(app)
      .get(`/callback?code=abc123&state=${state}`)
      .set('Cookie', [
        `sk_oauth_state=${state}`,
        `sk_return_to=${returnToCookie}`,
      ])
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/account');
  });

  it('rejects an open-redirect returnTo and falls back to postLoginRedirect', async () => {
    const { app, client } = buildApp('returnto-open-redirect-secret');
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize'
    );
    client.authenticateWithCode.mockResolvedValue({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_1',
      refreshToken: 'rt_1',
      idToken: 'idt_1',
      expiresIn: 300,
    });
    client.validateToken.mockResolvedValue({
      email: 'test.user@example.com',
      exp: Date.now() / 1000 + 300,
    });

    const loginRes = await request(app)
      .get('/login?returnTo=https://evil.com')
      .redirects(0);
    const setCookies = (loginRes.headers['set-cookie'] ??
      []) as unknown as string[];
    expect(setCookies.some((c) => c.startsWith('sk_return_to='))).toBe(false);
    const state = setCookies
      .find((c) => c.startsWith('sk_oauth_state='))
      ?.split('sk_oauth_state=')[1]
      ?.split(';')[0];

    const res = await request(app)
      .get(`/callback?code=abc123&state=${state}`)
      .set('Cookie', [`sk_oauth_state=${state}`])
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
  });

  it('protected route with a valid session succeeds', async () => {
    const { app, auth, client } = buildApp('valid-session-secret');
    const cookieValue = await auth.manager.createSessionCookie({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_1',
      refreshToken: 'rt_1',
      expiresAt: Date.now() / 1000 + 3600,
    });

    const res = await request(app)
      .get('/account')
      .set('Cookie', [`sk_session=${cookieValue}`]);

    expect(res.status).toBe(200);
    expect(res.text).toContain('test.user@example.com');
    expect(client.refreshAccessToken).not.toHaveBeenCalled();
  });

  it('protected route with an expired session refreshes transparently', async () => {
    const { app, auth, client } = buildApp('expired-session-secret');
    client.refreshAccessToken.mockResolvedValue({
      accessToken: 'at_new',
      refreshToken: 'rt_new',
    });
    client.validateToken.mockResolvedValue({
      email: 'test.user@example.com',
      exp: Date.now() / 1000 + 300,
    });
    const cookieValue = await auth.manager.createSessionCookie({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_old',
      refreshToken: 'rt_old',
      expiresAt: Date.now() / 1000 - 10,
    });

    const res = await request(app)
      .get('/account')
      .set('Cookie', [`sk_session=${cookieValue}`]);

    expect(res.status).toBe(200);
    expect(client.refreshAccessToken).toHaveBeenCalledWith('rt_old');

    const setCookie = res.headers['set-cookie']?.[0] ?? '';
    expect(setCookie).toContain('sk_session=');
    const newCookieValue = setCookie.split('sk_session=')[1].split(';')[0];
    const newPayload = await decryptSession(
      newCookieValue,
      'expired-session-secret'
    );
    expect(newPayload.accessToken).toBe('at_new');
  });

  it('protected route with a failed refresh clears the cookie and redirects', async () => {
    const { app, auth, client } = buildApp('failed-refresh-secret');
    client.refreshAccessToken.mockRejectedValue(new Error('invalid_grant'));
    const cookieValue = await auth.manager.createSessionCookie({
      user: { email: 'user@example.com' },
      accessToken: 'at_old',
      refreshToken: 'rt_old',
      expiresAt: Date.now() / 1000 - 10,
    });

    const res = await request(app)
      .get('/account')
      .set('Cookie', [`sk_session=${cookieValue}`])
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login?returnTo=%2Faccount');
  });

  it('logout with an invalid cookie falls back to local redirect', async () => {
    const { app, client } = buildApp();

    const res = await request(app)
      .get('/logout')
      .set('Cookie', ['sk_session=some-garbage-value'])
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
    expect(client.getLogoutUrl).not.toHaveBeenCalled();
  });

  it('logout without any cookie falls back to local redirect', async () => {
    const { app, client } = buildApp();

    const res = await request(app).get('/logout').redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
    expect(client.getLogoutUrl).not.toHaveBeenCalled();
  });

  it('logout with a valid session does full logout via idTokenHint', async () => {
    const { app, auth, client } = buildApp('full-logout-secret');
    client.getLogoutUrl.mockReturnValue(
      'https://auth.example.com/oidc/logout?id_token_hint=abc'
    );
    const cookieValue = await auth.manager.createSessionCookie({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_1',
      refreshToken: 'rt_1',
      idToken: 'idt_1',
      expiresAt: Date.now() / 1000 + 3600,
    });

    const res = await request(app)
      .get('/logout')
      .set('Cookie', [`sk_session=${cookieValue}`])
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(
      'https://auth.example.com/oidc/logout?id_token_hint=abc'
    );

    const callOptions = client.getLogoutUrl.mock.calls[0][0];
    expect(callOptions.idTokenHint).toBe('idt_1');
    // No `trust proxy` configured and no X-Forwarded-Proto -- req.protocol
    // is genuinely "http" here (port varies per test run since supertest
    // binds an ephemeral port), matching what a real un-proxied dev server
    // would produce. This pins the scheme exactly, unlike a loose
    // /^http:\/\// match that would also pass for "https://".
    expect(callOptions.postLogoutRedirectUri).toMatch(
      /^http:\/\/127\.0\.0\.1:\d+\/$/
    );
  });

  it('logout builds an https:// redirect URI when trust proxy is configured', async () => {
    const client = fakeClient();
    client.getLogoutUrl.mockReturnValue(
      'https://auth.example.com/oidc/logout?id_token_hint=abc'
    );
    const app: Express = express();
    app.set('trust proxy', true);
    const auth = new ScalekitAuth({
      client,
      redirectUri: 'https://app.example.com/callback',
      cookieEncryptionSecret: 'trust-proxy-secret',
    });
    app.use(auth.router);
    const cookieValue = await auth.manager.createSessionCookie({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_1',
      refreshToken: 'rt_1',
      idToken: 'idt_1',
      expiresAt: Date.now() / 1000 + 3600,
    });

    await request(app)
      .get('/logout')
      .set('Cookie', [`sk_session=${cookieValue}`])
      .set('X-Forwarded-Proto', 'https')
      .redirects(0);

    const callOptions = client.getLogoutUrl.mock.calls[0][0];
    expect(callOptions.postLogoutRedirectUri).toMatch(
      /^https:\/\/127\.0\.0\.1:\d+\/$/
    );
  });

  it('full logout disabled does local-only logout', async () => {
    const { app, auth, client } = buildApp('local-only-secret', {
      fullLogout: false,
    });
    const cookieValue = await auth.manager.createSessionCookie({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_1',
      refreshToken: 'rt_1',
      idToken: 'idt_1',
      expiresAt: Date.now() / 1000 + 3600,
    });

    const res = await request(app)
      .get('/logout')
      .set('Cookie', [`sk_session=${cookieValue}`])
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
    expect(client.getLogoutUrl).not.toHaveBeenCalled();
  });
});

describe('ScalekitAuth construction', () => {
  it('throws immediately when cookieEncryptionSecret is missing', () => {
    expect(
      () =>
        new ScalekitAuth({
          client: fakeClient(),
          redirectUri: 'https://app.example.com/callback',
          cookieEncryptionSecret: '',
        })
    ).toThrow();
  });
});
