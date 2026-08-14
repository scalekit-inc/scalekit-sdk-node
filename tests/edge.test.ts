import { describe, it, expect } from '@jest/globals';
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
