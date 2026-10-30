/**
 * Loads `jose` for the CommonJS build.
 *
 * `jose` ships only as an ES module. Node.js can `require()` an ES module
 * from 20.19 and 22.12 onwards; older releases throw `ERR_REQUIRE_ESM`. The
 * installed `jose` is used whenever it can be required, so callers share one
 * `jose` instance with the SDK. Only when `require()` of ES modules is
 * unavailable does the SDK fall back to the CommonJS copy of `jose` generated
 * when the SDK is built (`jose.bundle.js`, next to this file).
 */
import type * as Jose from 'jose';

export type { JWK, JWTPayload, JWTVerifyResult } from 'jose';

function isRequireEsmError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === 'ERR_REQUIRE_ESM'
  );
}

function loadJose(): typeof Jose {
  try {
    return require('jose');
  } catch (error) {
    if (isRequireEsmError(error)) {
      return require('./jose.bundle');
    }
    throw error;
  }
}

const jose = loadJose();

export const createLocalJWKSet: typeof Jose.createLocalJWKSet =
  jose.createLocalJWKSet;
export const jwtVerify: typeof Jose.jwtVerify = jose.jwtVerify;
export const decodeJwt: typeof Jose.decodeJwt = jose.decodeJwt;
