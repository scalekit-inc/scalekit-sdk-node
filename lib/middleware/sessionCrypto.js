"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSessionError = void 0;
exports.encryptSession = encryptSession;
exports.decryptSession = decryptSession;
const crypto_1 = require("crypto");
// Bumped whenever the wire format changes. Older versions must fail gracefully
// (InvalidSessionError, forcing re-login) rather than crash -- see decryptSession.
const SESSION_FORMAT_VERSION = 1;
const NONCE_SIZE = 12; // bytes, standard for AES-GCM
const AUTH_TAG_SIZE = 16; // bytes, standard for AES-GCM
// Fixed, non-secret HKDF salt/info: cookieEncryptionSecret itself is expected to be a
// high-entropy, developer-generated secret (not a low-entropy password), so a fast KDF
// derivation is appropriate here -- this is not password storage.
const HKDF_SALT = Buffer.from('scalekit-session-v1', 'utf8');
const HKDF_INFO = Buffer.from('scalekit-encrypted-session', 'utf8');
const SECRET_HELP = 'cookieEncryptionSecret is required. Generate a strong random secret, e.g.:\n' +
    "  node -e \"console.log(require('crypto').randomBytes(32).toString('base64url'))\"\n" +
    'and keep it identical across every server instance -- there is intentionally no ' +
    'default, since a shared default secret would let any deployment decrypt or forge ' +
    "any other deployment's sessions.";
/**
 * Raised when an encrypted session cannot be decrypted -- missing, malformed,
 * tampered with, or produced by an unsupported format version. Always thrown
 * instead of returning a partially-decrypted or unauthenticated payload.
 */
class InvalidSessionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidSessionError';
    }
}
exports.InvalidSessionError = InvalidSessionError;
function deriveKey(secret) {
    if (!secret) {
        throw new Error(SECRET_HELP);
    }
    const derived = (0, crypto_1.hkdfSync)('sha256', Buffer.from(secret, 'utf8'), HKDF_SALT, HKDF_INFO, 32);
    return Buffer.from(derived);
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
function encryptSession(payload, secret) {
    const key = deriveKey(secret);
    const nonce = (0, crypto_1.randomBytes)(NONCE_SIZE);
    const plaintext = Buffer.from(JSON.stringify(payload), 'utf8');
    const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', key, nonce);
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const raw = Buffer.concat([
        Buffer.from([SESSION_FORMAT_VERSION]),
        nonce,
        ciphertext,
        authTag,
    ]);
    return raw.toString('base64url');
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
function decryptSession(token, secret) {
    if (!token) {
        throw new InvalidSessionError('no session cookie provided');
    }
    const key = deriveKey(secret);
    let raw;
    try {
        raw = Buffer.from(token, 'base64url');
    }
    catch (_a) {
        throw new InvalidSessionError('session cookie is invalid or has been tampered with');
    }
    if (raw.length < 1 + NONCE_SIZE + AUTH_TAG_SIZE) {
        throw new InvalidSessionError('session cookie is truncated');
    }
    const version = raw[0];
    if (version !== SESSION_FORMAT_VERSION) {
        throw new InvalidSessionError(`unsupported session format version: ${version}`);
    }
    const nonce = raw.subarray(1, 1 + NONCE_SIZE);
    const authTag = raw.subarray(raw.length - AUTH_TAG_SIZE);
    const ciphertext = raw.subarray(1 + NONCE_SIZE, raw.length - AUTH_TAG_SIZE);
    let payload;
    try {
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', key, nonce);
        decipher.setAuthTag(authTag);
        const plaintext = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final(),
        ]);
        payload = JSON.parse(plaintext.toString('utf8'));
    }
    catch (err) {
        if (err instanceof InvalidSessionError)
            throw err;
        throw new InvalidSessionError('session cookie is invalid or has been tampered with');
    }
    if (typeof payload !== 'object' ||
        payload === null ||
        Array.isArray(payload)) {
        throw new InvalidSessionError('decrypted session payload is not an object');
    }
    return payload;
}
//# sourceMappingURL=sessionCrypto.js.map