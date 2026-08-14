import { describe, it, expect, jest as jestGlobal } from '@jest/globals';
import { NextRequest } from 'next/server';

import { ScalekitAuthNext } from '../src/frameworks/nextjs';
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

function buildAuth(
  secret = 'nextjs-test-secret',
  extraOptions: Record<string, unknown> = {}
) {
  const client = fakeClient();
  const auth = new ScalekitAuthNext({
    client,
    redirectUri: 'https://app.example.com/callback',
    cookieEncryptionSecret: secret,
    ...extraOptions,
  });
  return { auth, client };
}

function requestWithCookie(url: string, cookieValue?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (cookieValue) {
    headers['cookie'] = `sk_session=${cookieValue}`;
  }
  return new NextRequest(url, { headers });
}

function requestWithCookies(
  url: string,
  cookies: Record<string, string>
): NextRequest {
  const cookieHeader = Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
  return new NextRequest(url, { headers: { cookie: cookieHeader } });
}

async function loginAndGetState(auth: ScalekitAuthNext): Promise<string> {
  const handler = auth.createLoginHandler();
  const response = await handler(
    new NextRequest('https://app.example.com/login')
  );
  const setCookie = response.headers.get('set-cookie') ?? '';
  return setCookie.split('sk_oauth_state=')[1]?.split(';')[0] ?? '';
}

describe('ScalekitAuthNext', () => {
  it('login handler redirects to the authorization url', async () => {
    const { auth, client } = buildAuth();
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );

    const handler = auth.createLoginHandler();
    const response = await handler(
      new NextRequest('https://app.example.com/login')
    );

    expect(response.status).toBe(307); // NextResponse.redirect default
    expect(response.headers.get('location')).toBe(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );
  });

  it('login handler with idp_initiated_login uses claims for the authorization url', async () => {
    // /login doubles as the dashboard-registered "Initiate Login URL" --
    // Scalekit can land users here with an idp_initiated_login JWT (e.g. an
    // IdP portal tile click with an active session) instead of a plain hit.
    const { auth, client } = buildAuth();
    client.getIdpInitiatedLoginClaims.mockResolvedValue({
      connection_id: 'conn_123',
      organization_id: 'org_456',
      login_hint: 'user@example.com',
    });
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );

    const handler = auth.createLoginHandler();
    const response = await handler(
      new NextRequest(
        'https://app.example.com/login?idp_initiated_login=some.jwt.token'
      )
    );

    expect(response.status).toBe(307);
    expect(client.getIdpInitiatedLoginClaims).toHaveBeenCalledWith(
      'some.jwt.token'
    );
    const callOptions = client.getAuthorizationUrl.mock.calls[0][1];
    expect(callOptions.connectionId).toBe('conn_123');
    expect(callOptions.organizationId).toBe('org_456');
    expect(callOptions.loginHint).toBe('user@example.com');
  });

  it('login handler with an invalid idp_initiated_login falls back to normal login', async () => {
    const { auth, client } = buildAuth();
    client.getIdpInitiatedLoginClaims.mockRejectedValue(
      new Error('invalid token')
    );
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );

    const handler = auth.createLoginHandler();
    const response = await handler(
      new NextRequest(
        'https://app.example.com/login?idp_initiated_login=garbage'
      )
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://auth.example.com/oauth/authorize?client_id=x'
    );
    const callOptions = client.getAuthorizationUrl.mock.calls[0][1];
    expect(callOptions.connectionId).toBeUndefined();
  });

  it('callback handler sets an encrypted cookie and redirects', async () => {
    const { auth, client } = buildAuth('callback-secret');
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

    const state = await loginAndGetState(auth);
    const handler = auth.createCallbackHandler();
    const response = await handler(
      requestWithCookies(
        `https://app.example.com/callback?code=abc123&state=${state}`,
        { sk_oauth_state: state }
      )
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://app.example.com/');
    const setCookie = response.headers.get('set-cookie') ?? '';
    expect(setCookie).toContain('sk_session=');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('Secure');
  });

  it('callback handler with a provider error redirects to login, not a 500', async () => {
    const { auth, client } = buildAuth();
    const handler = auth.createCallbackHandler();

    const response = await handler(
      new NextRequest('https://app.example.com/callback?error=access_denied')
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/login'
    );
    expect(client.authenticateWithCode).not.toHaveBeenCalled();
  });

  it('callback handler with a missing code redirects to login', async () => {
    const { auth, client } = buildAuth();
    const handler = auth.createCallbackHandler();

    const response = await handler(
      new NextRequest('https://app.example.com/callback')
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/login'
    );
    expect(client.authenticateWithCode).not.toHaveBeenCalled();
  });

  it('callback handler with a missing state redirects to login', async () => {
    // No login call at all -- no state cookie exists, simulating a forged
    // callback URL sent directly to a victim.
    const { auth, client } = buildAuth();
    const handler = auth.createCallbackHandler();

    const response = await handler(
      new NextRequest(
        'https://app.example.com/callback?code=abc123&state=whatever'
      )
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/login'
    );
    expect(client.authenticateWithCode).not.toHaveBeenCalled();
  });

  it('callback handler with a mismatched state redirects to login', async () => {
    const { auth, client } = buildAuth();
    client.getAuthorizationUrl.mockReturnValue(
      'https://auth.example.com/oauth/authorize'
    );

    const state = await loginAndGetState(auth);
    const handler = auth.createCallbackHandler();
    const response = await handler(
      requestWithCookies(
        'https://app.example.com/callback?code=abc123&state=attacker-supplied',
        { sk_oauth_state: state }
      )
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/login'
    );
    expect(client.authenticateWithCode).not.toHaveBeenCalled();
  });

  it('withAuth without a cookie redirects to login, not a JSON 401', async () => {
    // Same property tested for Flask/Express/Django: "no valid session" must
    // be a real redirect a browser follows, not a JSON 401 a background
    // fetch/XHR would silently swallow.
    const { auth } = buildAuth();
    const handler = auth.withAuth(async () => {
      throw new Error('handler should not be called');
    });

    const response = await handler(
      requestWithCookie('https://app.example.com/account')
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/login?returnTo=%2Faccount'
    );
    expect(response.headers.get('content-type') ?? '').not.toMatch(/json/);
  });

  it('withAuth without a cookie redirects to login with returnTo set', async () => {
    const { auth } = buildAuth();
    const handler = auth.withAuth(async () => {
      throw new Error('handler should not be called');
    });

    const response = await handler(
      requestWithCookie('https://app.example.com/account?tab=billing')
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/login?returnTo=%2Faccount%3Ftab%3Dbilling'
    );
  });

  it('completing login lands back on the preserved returnTo path', async () => {
    const { auth, client } = buildAuth('returnto-secret');
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

    const loginHandler = auth.createLoginHandler();
    const loginResponse = await loginHandler(
      new NextRequest('https://app.example.com/login?returnTo=%2Faccount')
    );
    const setCookie = loginResponse.headers.get('set-cookie') ?? '';
    const state = setCookie.split('sk_oauth_state=')[1]?.split(';')[0] ?? '';
    const returnToCookie =
      setCookie.split('sk_return_to=')[1]?.split(';')[0] ?? '';
    expect(returnToCookie).toBeTruthy();

    const callbackHandler = auth.createCallbackHandler();
    const response = await callbackHandler(
      requestWithCookies(
        `https://app.example.com/callback?code=abc123&state=${state}`,
        { sk_oauth_state: state, sk_return_to: returnToCookie }
      )
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/account'
    );
  });

  it('withAuth with a valid session calls the handler with user', async () => {
    const { auth, client } = buildAuth('valid-session-secret');
    const cookieValue = await auth.manager.createSessionCookie({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_1',
      refreshToken: 'rt_1',
      expiresAt: Date.now() / 1000 + 3600,
    });

    const handler = auth.withAuth(async (_req, { user }) => {
      return Response.json({
        email: (user as { email?: string })?.email,
      }) as never;
    });

    const response = await handler(
      requestWithCookie('https://app.example.com/account', cookieValue)
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { email?: string };
    expect(body.email).toBe('test.user@example.com');
    expect(client.refreshAccessToken).not.toHaveBeenCalled();
  });

  it('withAuth with an expired session refreshes transparently', async () => {
    const { auth, client } = buildAuth('expired-session-secret');
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

    const handler = auth.withAuth(
      async () => Response.json({ ok: true }) as never
    );
    const response = await handler(
      requestWithCookie('https://app.example.com/account', cookieValue)
    );

    expect(response.status).toBe(200);
    expect(client.refreshAccessToken).toHaveBeenCalledWith('rt_old');

    const setCookie = response.headers.get('set-cookie') ?? '';
    expect(setCookie).toContain('sk_session=');
    const newCookieValue = setCookie.split('sk_session=')[1].split(';')[0];
    const newPayload = await decryptSession(
      newCookieValue,
      'expired-session-secret'
    );
    expect(newPayload.accessToken).toBe('at_new');
  });

  it('withAuth rebuilds the response when the handler returns one with immutable headers', async () => {
    // A wrapped handler proxying an upstream fetch() result is an ordinary
    // App Router pattern -- that Response's headers are immutable, so
    // appending the refreshed cookie must not just throw and drop it.
    const { auth, client } = buildAuth('immutable-headers-secret');
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

    // Simulates the immutable-headers guard a real fetch()-derived Response
    // carries (verified separately: Node's fetch() results throw on
    // `.headers.append()` the same way) without making a real network call.
    const immutableResponse = new Response('upstream body', { status: 200 });
    jestGlobal
      .spyOn(immutableResponse.headers, 'append')
      .mockImplementation(() => {
        throw new TypeError('immutable');
      });

    const handler = auth.withAuth(async () => immutableResponse as never);
    const response = await handler(
      requestWithCookie('https://app.example.com/account', cookieValue)
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('upstream body');
    const setCookie = response.headers.get('set-cookie') ?? '';
    expect(setCookie).toContain('sk_session=');
  });

  it('withAuth with a failed refresh redirects to login', async () => {
    const { auth, client } = buildAuth('failed-refresh-secret');
    client.refreshAccessToken.mockRejectedValue(new Error('invalid_grant'));
    const cookieValue = await auth.manager.createSessionCookie({
      user: { email: 'user@example.com' },
      accessToken: 'at_old',
      refreshToken: 'rt_old',
      expiresAt: Date.now() / 1000 - 10,
    });

    const handler = auth.withAuth(async () => {
      throw new Error('handler should not be called');
    });
    const response = await handler(
      requestWithCookie('https://app.example.com/account', cookieValue)
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/login?returnTo=%2Faccount'
    );
  });

  it('logout with an invalid cookie falls back to local redirect', async () => {
    const { auth, client } = buildAuth();
    const handler = auth.createLogoutHandler();

    const response = await handler(
      requestWithCookie('https://app.example.com/logout', 'some-garbage-value')
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://app.example.com/');
    expect(client.getLogoutUrl).not.toHaveBeenCalled();
  });

  it('logout without any cookie falls back to local redirect', async () => {
    const { auth, client } = buildAuth();
    const handler = auth.createLogoutHandler();

    const response = await handler(
      new NextRequest('https://app.example.com/logout')
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://app.example.com/');
    expect(client.getLogoutUrl).not.toHaveBeenCalled();
  });

  it('logout with a valid session does full logout via idTokenHint', async () => {
    const { auth, client } = buildAuth('full-logout-secret');
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

    const handler = auth.createLogoutHandler();
    const response = await handler(
      requestWithCookie('https://app.example.com/logout', cookieValue)
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://auth.example.com/oidc/logout?id_token_hint=abc'
    );

    const callOptions = client.getLogoutUrl.mock.calls[0][0];
    expect(callOptions.idTokenHint).toBe('idt_1');
    expect(callOptions.postLogoutRedirectUri).toMatch(/^https:\/\//);
  });

  it('full logout disabled does local-only logout', async () => {
    const { auth, client } = buildAuth('local-only-secret', {
      fullLogout: false,
    });
    const cookieValue = await auth.manager.createSessionCookie({
      user: { email: 'test.user@example.com' },
      accessToken: 'at_1',
      refreshToken: 'rt_1',
      idToken: 'idt_1',
      expiresAt: Date.now() / 1000 + 3600,
    });

    const handler = auth.createLogoutHandler();
    const response = await handler(
      requestWithCookie('https://app.example.com/logout', cookieValue)
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://app.example.com/');
    expect(client.getLogoutUrl).not.toHaveBeenCalled();
  });
});

describe('ScalekitAuthNext construction', () => {
  it('throws immediately when cookieEncryptionSecret is missing', () => {
    expect(
      () =>
        new ScalekitAuthNext({
          client: fakeClient(),
          redirectUri: 'https://app.example.com/callback',
          cookieEncryptionSecret: '',
        })
    ).toThrow();
  });
});

describe('ScalekitAuthNext.createMiddleware', () => {
  it('redirects an unauthenticated request on a protected route, with returnTo', async () => {
    const { auth } = buildAuth();
    const middleware = auth.createMiddleware();

    const response = await middleware(
      requestWithCookie('https://app.example.com/account?tab=billing')
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/login?returnTo=%2Faccount%3Ftab%3Dbilling'
    );
  });

  it('passes through a publicRoutes entry with no session check at all', async () => {
    const { auth, client } = buildAuth();
    const middleware = auth.createMiddleware({ publicRoutes: ['/pricing'] });

    const response = await middleware(
      new NextRequest('https://app.example.com/pricing')
    );

    expect(response.status).toBe(200); // NextResponse.next() default
    expect(client.validateToken).not.toHaveBeenCalled();
    expect(client.refreshAccessToken).not.toHaveBeenCalled();
  });

  it('always excludes loginPath/callbackPath/logoutPath from gating', async () => {
    const { auth } = buildAuth();
    const middleware = auth.createMiddleware();

    for (const path of ['/login', '/callback', '/logout']) {
      const response = await middleware(
        new NextRequest(`https://app.example.com${path}`)
      );
      expect(response.status).toBe(200);
    }
  });

  it('passes through an authenticated request and attaches a refreshed cookie', async () => {
    const { auth, client } = buildAuth('middleware-refresh-secret');
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
    const middleware = auth.createMiddleware();

    const response = await middleware(
      requestWithCookie('https://app.example.com/account', cookieValue)
    );

    expect(response.status).toBe(200);
    const setCookie = response.headers.get('set-cookie') ?? '';
    expect(setCookie).toContain('sk_session=');
  });
});
