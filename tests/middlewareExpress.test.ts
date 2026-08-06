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

  it('callback sets an encrypted cookie and redirects', async () => {
    const { app, client } = buildApp('callback-secret');
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

    const res = await request(app).get('/callback?code=abc123').redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
    const setCookie = res.headers['set-cookie']?.[0] ?? '';
    expect(setCookie).toContain('sk_session=');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('Secure');
  });

  it('protected route without a cookie redirects to login, not a JSON 401', async () => {
    // Same property tested for Python's Flask/FastAPI/Django adapters: "no
    // valid session" must be a real redirect a browser follows, not a JSON
    // 401 a background fetch/XHR would silently swallow.
    const { app } = buildApp();

    const res = await request(app).get('/account').redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
    expect(res.headers['content-type']).not.toMatch(/json/);
  });

  it('protected route with a valid session succeeds', async () => {
    const { app, auth, client } = buildApp('valid-session-secret');
    const cookieValue = auth.manager.createSessionCookie({
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
    const cookieValue = auth.manager.createSessionCookie({
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
    const newPayload = decryptSession(newCookieValue, 'expired-session-secret');
    expect(newPayload.accessToken).toBe('at_new');
  });

  it('protected route with a failed refresh clears the cookie and redirects', async () => {
    const { app, auth, client } = buildApp('failed-refresh-secret');
    client.refreshAccessToken.mockRejectedValue(new Error('invalid_grant'));
    const cookieValue = auth.manager.createSessionCookie({
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
    expect(res.headers.location).toBe('/login');
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
    const cookieValue = auth.manager.createSessionCookie({
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
    expect(callOptions.postLogoutRedirectUri).toMatch(/^http:\/\//);
  });

  it('full logout disabled does local-only logout', async () => {
    const { app, auth, client } = buildApp('local-only-secret', {
      fullLogout: false,
    });
    const cookieValue = auth.manager.createSessionCookie({
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
