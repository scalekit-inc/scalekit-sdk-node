"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RETURN_TO_COOKIE_NAME = exports.STATE_COOKIE_MAX_AGE = exports.STATE_COOKIE_NAME = void 0;
exports.generateState = generateState;
exports.verifyState = verifyState;
exports.sanitizeReturnTo = sanitizeReturnTo;
const crypto_1 = require("crypto");
/**
 * Short-lived cookie carrying the OAuth `state` value between the login and
 * callback handlers, so the callback can verify the provider's callback
 * wasn't forged (CSRF: an attacker's own authorization code smuggled into a
 * victim's browser session). Shared by every framework adapter -- not
 * framework-specific -- so a future fix here applies to all of them at once
 * instead of risking one adapter drifting out of sync with the others.
 */
exports.STATE_COOKIE_NAME = 'sk_oauth_state';
exports.STATE_COOKIE_MAX_AGE = 600; // 10 minutes -- generous for a slow login, still short-lived
/**
 * Short-lived cookie carrying a validated post-login redirect target between
 * the login and callback handlers, so requiresAuth/createMiddleware can send
 * a user back to the page they originally requested instead of a fixed
 * postLoginRedirect. Shared by every framework adapter, same as the OAuth
 * state cookie above.
 */
exports.RETURN_TO_COOKIE_NAME = 'sk_return_to';
/** A fresh, random OAuth state value for a login handler to issue. */
function generateState() {
    return (0, crypto_1.randomBytes)(32).toString('base64url');
}
/**
 * True only if both values are present and match, using a timing-safe
 * comparison. Missing/mismatched state means this callback did not
 * originate from a login this browser actually made.
 */
function verifyState(storedState, returnedState) {
    if (!storedState || !returnedState)
        return false;
    const bufA = Buffer.from(storedState);
    const bufB = Buffer.from(returnedState);
    if (bufA.length !== bufB.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(bufA, bufB);
}
/**
 * Validates a candidate post-login redirect target, accepting only
 * same-origin relative paths. The value is attacker-influenceable (read from
 * a query string on the login redirect), so this is a real open-redirect
 * guard, not a cosmetic check: rejects absolute URLs (`https://evil.com`),
 * protocol-relative URLs (`//evil.com`), backslash variants some
 * browsers normalize into a protocol-relative URL (`/\evil.com`), and
 * tab/CR/LF characters that the WHATWG URL spec strips during parsing.
 */
function sanitizeReturnTo(value) {
    if (!value)
        return undefined;
    if (!value.startsWith('/') ||
        value.startsWith('//') ||
        value.includes('\\') ||
        /[\t\r\n]/.test(value)) {
        return undefined;
    }
    return value;
}
//# sourceMappingURL=csrfState.js.map