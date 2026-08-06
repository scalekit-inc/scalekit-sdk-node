import { describe, it, expect } from '@jest/globals';
import {
  InvalidSessionError,
  encryptSession,
  decryptSession,
} from '../src/middleware/sessionCrypto';

describe('sessionCrypto', () => {
  const secret = 'correct-horse-battery-staple-secret';
  const payload = {
    user: { email: 'test.user@example.com' },
    accessToken: 'at_123',
    refreshToken: 'rt_456',
    expiresAt: 9999999999,
  };

  it('round-trips a payload', () => {
    const token = encryptSession(payload, secret);
    expect(decryptSession(token, secret)).toEqual(payload);
  });

  it('fails to decrypt tampered ciphertext', () => {
    const token = encryptSession(payload, secret);
    const raw = Buffer.from(token, 'base64url');
    raw[raw.length - 1] ^= 0xff; // flip a bit well inside the auth tag
    const tampered = raw.toString('base64url');

    expect(() => decryptSession(tampered, secret)).toThrow(InvalidSessionError);
  });

  it('fails to decrypt with the wrong secret', () => {
    const token = encryptSession(payload, secret);
    expect(() =>
      decryptSession(token, 'a-completely-different-secret')
    ).toThrow(InvalidSessionError);
  });

  it('throws on encrypt with a missing secret', () => {
    expect(() => encryptSession(payload, '')).toThrow();
  });

  it('throws on decrypt with a missing secret', () => {
    const token = encryptSession(payload, secret);
    expect(() => decryptSession(token, '')).toThrow();
  });

  it('throws InvalidSessionError for a missing token', () => {
    expect(() => decryptSession('', secret)).toThrow(InvalidSessionError);
  });

  it('throws InvalidSessionError, not a crash, for a malformed token', () => {
    expect(() =>
      decryptSession('not-a-valid-base64url-token!!!', secret)
    ).toThrow(InvalidSessionError);
  });

  it('throws InvalidSessionError for an unsupported version byte', () => {
    const token = encryptSession(payload, secret);
    const raw = Buffer.from(token, 'base64url');
    raw[0] = 99; // bogus version
    const bogusVersionToken = raw.toString('base64url');

    expect(() => decryptSession(bogusVersionToken, secret)).toThrow(
      InvalidSessionError
    );
  });

  it('fails cleanly across mismatched secrets (simulated multi-instance misconfig)', () => {
    const tokenA = encryptSession(payload, 'secret-a');
    expect(() => decryptSession(tokenA, 'secret-b')).toThrow(
      InvalidSessionError
    );
  });

  it('throws instead of silently producing a cookie the browser will drop', () => {
    // Browsers silently drop cookies over ~4096 bytes -- a customer with many
    // custom access-token claims could hit this. Must fail loudly at encrypt
    // time instead of producing a cookie that just vanishes client-side.
    const oversizedPayload = { ...payload, user: { claim: 'x'.repeat(4000) } };

    expect(() => encryptSession(oversizedPayload, secret)).toThrow();
  });
});
