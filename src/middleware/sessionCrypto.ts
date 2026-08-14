import { webcrypto } from 'crypto';

// Bumped whenever the wire format changes. Older versions must fail gracefully
// (InvalidSessionError, forcing re-login) rather than crash -- see decryptSession.
const SESSION_FORMAT_VERSION = 1;
const NONCE_SIZE = 12; // bytes, standard for AES-GCM
const AUTH_TAG_SIZE = 16; // bytes, standard for AES-GCM
const AUTH_TAG_BITS = AUTH_TAG_SIZE * 8;

// Browsers silently drop cookies larger than ~4096 bytes (name + attributes
// included), which would look like a random, unexplained logout. Fail loudly
// instead so an oversized `user` claims payload is caught at encrypt time.
const MAX_COOKIE_VALUE_BYTES = 3800;

// Fixed, non-secret HKDF salt/info: cookieEncryptionSecret itself is expected to be a
// high-entropy, developer-generated secret (not a low-entropy password), so a fast KDF
// derivation is appropriate here -- this is not password storage.
const HKDF_SALT = new TextEncoder().encode('scalekit-session-v1');
const HKDF_INFO = new TextEncoder().encode('scalekit-encrypted-session');

const SECRET_HELP =
  'cookieEncryptionSecret is required. Generate a strong random secret, e.g.:\n' +
  "  node -e \"console.log(require('crypto').randomBytes(32).toString('base64url'))\"\n" +
  'and keep it identical across every server instance -- there is intentionally no ' +
  'default, since a shared default secret would let any deployment decrypt or forge ' +
  "any other deployment's sessions.";

/**
 * Raised when an encrypted session cannot be decrypted -- missing, malformed,
 * tampered with, or produced by an unsupported format version. Always thrown
 * instead of returning a partially-decrypted or unauthenticated payload.
 */
export class InvalidSessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSessionError';
  }
}

// webcrypto.subtle (not node:crypto's createCipheriv/hkdfSync) so this module
// runs unchanged in both plain Node and Next.js's Edge middleware runtime --
// one crypto implementation for both, not two to keep in sync. Promise-based,
// so encryptSession/decryptSession are async -- see sessionManager.ts callers.
async function deriveKey(secret: string): Promise<CryptoKey> {
  if (!secret) {
    throw new Error(SECRET_HELP);
  }
  const secretKey = await webcrypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    'HKDF',
    false,
    ['deriveBits']
  );
  const bits = await webcrypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: HKDF_SALT, info: HKDF_INFO },
    secretKey,
    256
  );
  return webcrypto.subtle.importKey('raw', bits, 'AES-GCM', false, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * Encrypt a session payload (accessToken, refreshToken, idToken, user claims,
 * expiresAt, ...) into a single opaque, tamper-proof string suitable for
 * storing in a cookie.
 *
 * @param payload JSON-serializable session data.
 * @param secret cookieEncryptionSecret -- required, no default (see module docs).
 * @returns base64url-encoded, versioned ciphertext string.
 */
export async function encryptSession(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const key = await deriveKey(secret);
  const nonce = webcrypto.getRandomValues(new Uint8Array(NONCE_SIZE));
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));

  // Web Crypto's AES-GCM encrypt() appends the auth tag to the ciphertext
  // itself (unlike node:crypto's separate cipher.getAuthTag()) -- the wire
  // format (version byte + nonce + ciphertext+tag) is unchanged either way.
  const ciphertextWithTag = new Uint8Array(
    await webcrypto.subtle.encrypt(
      { name: 'AES-GCM', iv: nonce, tagLength: AUTH_TAG_BITS },
      key,
      plaintext
    )
  );

  const raw = Buffer.concat([
    Buffer.from([SESSION_FORMAT_VERSION]),
    Buffer.from(nonce),
    Buffer.from(ciphertextWithTag),
  ]);
  const encoded = raw.toString('base64url');
  if (encoded.length > MAX_COOKIE_VALUE_BYTES) {
    throw new Error(
      `encrypted session is ${encoded.length} bytes, which exceeds the browser ` +
        'cookie size limit; reduce the claims stored in the session (e.g. fewer ' +
        'custom access-token claims).'
    );
  }
  return encoded;
}

/**
 * Decrypt a session cookie value produced by encryptSession().
 *
 * This only performs cryptographic verification -- it does NOT check
 * `expiresAt`. Callers (SessionRefreshManager) decide what to do with an
 * expired-but-cryptographically-valid session (e.g. attempt a refresh using
 * the refreshToken still present in the payload).
 *
 * @throws {InvalidSessionError} if token is missing, malformed, tampered
 *   with, or uses an unsupported format version. Never throws any other
 *   error type for these cases.
 */
export async function decryptSession(
  token: string,
  secret: string
): Promise<Record<string, unknown>> {
  if (!token) {
    throw new InvalidSessionError('no session cookie provided');
  }

  const key = await deriveKey(secret);

  let raw: Buffer;
  try {
    raw = Buffer.from(token, 'base64url');
  } catch {
    throw new InvalidSessionError(
      'session cookie is invalid or has been tampered with'
    );
  }

  if (raw.length < 1 + NONCE_SIZE + AUTH_TAG_SIZE) {
    throw new InvalidSessionError('session cookie is truncated');
  }

  const version = raw[0];
  if (version !== SESSION_FORMAT_VERSION) {
    throw new InvalidSessionError(
      `unsupported session format version: ${version}`
    );
  }

  const nonce = raw.subarray(1, 1 + NONCE_SIZE);
  const ciphertextWithTag = raw.subarray(1 + NONCE_SIZE);

  let payload: unknown;
  try {
    const plaintext = await webcrypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(nonce), tagLength: AUTH_TAG_BITS },
      key,
      new Uint8Array(ciphertextWithTag)
    );
    payload = JSON.parse(Buffer.from(plaintext).toString('utf8'));
  } catch (err) {
    if (err instanceof InvalidSessionError) throw err;
    throw new InvalidSessionError(
      'session cookie is invalid or has been tampered with'
    );
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    Array.isArray(payload)
  ) {
    throw new InvalidSessionError('decrypted session payload is not an object');
  }

  return payload as Record<string, unknown>;
}
