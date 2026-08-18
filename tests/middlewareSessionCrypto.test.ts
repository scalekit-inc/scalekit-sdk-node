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

  it('round-trips a payload', async () => {
    const token = await encryptSession(payload, secret);
    expect(await decryptSession(token, secret)).toEqual(payload);
  });

  it('fails to decrypt tampered ciphertext', async () => {
    const token = await encryptSession(payload, secret);
    const raw = Buffer.from(token, 'base64url');
    raw[raw.length - 1] ^= 0xff; // flip a bit well inside the auth tag
    const tampered = raw.toString('base64url');

    await expect(decryptSession(tampered, secret)).rejects.toThrow(
      InvalidSessionError
    );
  });

  it('fails to decrypt with the wrong secret', async () => {
    const token = await encryptSession(payload, secret);
    await expect(
      decryptSession(token, 'a-completely-different-secret')
    ).rejects.toThrow(InvalidSessionError);
  });

  it('throws on encrypt with a missing secret', async () => {
    await expect(encryptSession(payload, '')).rejects.toThrow();
  });

  it('throws on decrypt with a missing secret', async () => {
    const token = await encryptSession(payload, secret);
    await expect(decryptSession(token, '')).rejects.toThrow();
  });

  it('throws InvalidSessionError for a missing token', async () => {
    await expect(decryptSession('', secret)).rejects.toThrow(
      InvalidSessionError
    );
  });

  it('throws InvalidSessionError, not a crash, for a malformed token', async () => {
    await expect(
      decryptSession('not-a-valid-base64url-token!!!', secret)
    ).rejects.toThrow(InvalidSessionError);
  });

  it('throws InvalidSessionError for an unsupported version byte', async () => {
    const token = await encryptSession(payload, secret);
    const raw = Buffer.from(token, 'base64url');
    raw[0] = 99; // bogus version
    const bogusVersionToken = raw.toString('base64url');

    await expect(decryptSession(bogusVersionToken, secret)).rejects.toThrow(
      InvalidSessionError
    );
  });

  it('fails cleanly across mismatched secrets (simulated multi-instance misconfig)', async () => {
    const tokenA = await encryptSession(payload, 'secret-a');
    await expect(decryptSession(tokenA, 'secret-b')).rejects.toThrow(
      InvalidSessionError
    );
  });

  it('throws instead of silently producing a cookie the browser will drop', async () => {
    const oversizedPayload = { ...payload, user: { claim: 'x'.repeat(4000) } };
    await expect(encryptSession(oversizedPayload, secret)).rejects.toThrow();
  });
});
