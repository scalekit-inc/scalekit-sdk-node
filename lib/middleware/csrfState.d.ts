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
/** A fresh, random OAuth state value for a login handler to issue. */
export declare function generateState(): string;
/**
 * True only if both values are present and match, using a timing-safe
 * comparison. Missing/mismatched state means this callback did not
 * originate from a login this browser actually made.
 */
export declare function verifyState(storedState: string | undefined, returnedState: string | undefined): boolean;
