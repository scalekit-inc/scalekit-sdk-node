/**
 * Raised when an encrypted session cannot be decrypted -- missing, malformed,
 * tampered with, or produced by an unsupported format version. Always thrown
 * instead of returning a partially-decrypted or unauthenticated payload.
 */
export declare class InvalidSessionError extends Error {
    constructor(message: string);
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
export declare function encryptSession(payload: Record<string, unknown>, secret: string): Promise<string>;
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
export declare function decryptSession(token: string, secret: string): Promise<Record<string, unknown>>;
