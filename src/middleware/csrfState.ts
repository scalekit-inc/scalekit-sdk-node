import { randomBytes, timingSafeEqual } from 'crypto';

/**
 * Short-lived cookie carrying the OAuth `state` value between the login and
 * callback handlers, so the callback can verify the provider's callback
 * wasn't forged (CSRF: an attacker's own authorization code smuggled into a
 * victim's browser session). Shared by every framework adapter -- not
 * framework-specific -- so a future fix here applies to all of them at once
 * instead of risking one adapter drifting out of sync with the others.
 */
export const STATE_COOKIE_NAME = 'sk_oauth_state';
export const STATE_COOKIE_MAX_AGE = 600; // 10 minutes -- generous for a slow login, still short-lived

/** A fresh, random OAuth state value for a login handler to issue. */
export function generateState(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * True only if both values are present and match, using a timing-safe
 * comparison. Missing/mismatched state means this callback did not
 * originate from a login this browser actually made.
 */
export function verifyState(
  storedState: string | undefined,
  returnedState: string | undefined
): boolean {
  if (!storedState || !returnedState) return false;
  const bufA = Buffer.from(storedState);
  const bufB = Buffer.from(returnedState);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
