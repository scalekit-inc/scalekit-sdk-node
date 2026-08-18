/**
 * Short-lived cookie carrying the OAuth `state` value between the login and
 * callback handlers, so the callback can verify the provider's callback
 * wasn't forged (CSRF: an attacker's own authorization code smuggled into a
 * victim's browser session). Shared by every framework adapter -- not
 * framework-specific -- so a future fix here applies to all of them at once
 * instead of risking one adapter drifting out of sync with the others.
 */
export declare const STATE_COOKIE_NAME = "sk_oauth_state";
export declare const STATE_COOKIE_MAX_AGE = 600;
/**
 * Short-lived cookie carrying a validated post-login redirect target between
 * the login and callback handlers, so requiresAuth/createMiddleware can send
 * a user back to the page they originally requested instead of a fixed
 * postLoginRedirect. Shared by every framework adapter, same as the OAuth
 * state cookie above.
 */
export declare const RETURN_TO_COOKIE_NAME = "sk_return_to";
/** A fresh, random OAuth state value for a login handler to issue. */
export declare function generateState(): string;
/**
 * True only if both values are present and match, using a timing-safe
 * comparison. Missing/mismatched state means this callback did not
 * originate from a login this browser actually made.
 */
export declare function verifyState(storedState: string | undefined, returnedState: string | undefined): boolean;
/**
 * Validates a candidate post-login redirect target, accepting only
 * same-origin relative paths. The value is attacker-influenceable (read from
 * a query string on the login redirect), so this is a real open-redirect
 * guard, not a cosmetic check: rejects absolute URLs (`https://evil.com`),
 * protocol-relative URLs (`//evil.com`), backslash variants some
 * browsers normalize into a protocol-relative URL (`/\evil.com`), and
 * tab/CR/LF characters that the WHATWG URL spec strips during parsing.
 */
export declare function sanitizeReturnTo(value: string | null | undefined): string | undefined;
