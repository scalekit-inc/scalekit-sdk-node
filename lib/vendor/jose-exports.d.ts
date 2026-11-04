/**
 * The `jose` exports the SDK uses. `src/vendor/jose.ts` exposes exactly these,
 * and `scripts/bundle-jose.js` bundles exactly these into the fallback copy.
 *
 * @internal
 */
export declare const JOSE_EXPORTS: readonly ["createLocalJWKSet", "createRemoteJWKSet", "decodeJwt", "errors", "jwtVerify"];
