/**
 * The `jose` exports the SDK uses. `src/vendor/jose.ts` exposes exactly these,
 * and `scripts/bundle-jose.js` bundles exactly these into the fallback copy.
 *
 * @internal
 */
export const JOSE_EXPORTS = [
  'createLocalJWKSet',
  'createRemoteJWKSet',
  'decodeJwt',
  'errors',
  'jwtVerify',
] as const;
