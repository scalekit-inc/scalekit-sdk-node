/**
 * Loads `jose` for the CommonJS build.
 *
 * `jose` ships only as an ES module. Where Node.js can `require()` an ES
 * module, the installed `jose` is used, so callers share one `jose` instance
 * with the SDK. Where it cannot (Node.js 18, 20 before 20.19, 22 before 22.12,
 * and runtimes that start Node.js with `--no-experimental-require-module`,
 * such as AWS Lambda), `require('jose')` throws `ERR_REQUIRE_ESM` and the SDK
 * falls back to the CommonJS copy of `jose` generated when the SDK is built
 * (`jose.bundle.js`, next to this file).
 */
import type * as Jose from 'jose';

let jose: Pick<typeof Jose, 'createLocalJWKSet' | 'jwtVerify' | 'decodeJwt'>;
try {
  jose = require('jose');
} catch (error) {
  if ((error as { code?: unknown } | null)?.code !== 'ERR_REQUIRE_ESM') {
    throw error;
  }
  try {
    jose = require('./jose.bundle');
  } catch (bundleError) {
    // Report the original failure; a missing bundle is secondary to it.
    (error as { cause?: unknown }).cause = bundleError;
    throw error;
  }
}

export const { createLocalJWKSet, jwtVerify, decodeJwt } = jose;
