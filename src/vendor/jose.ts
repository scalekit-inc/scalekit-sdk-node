/**
 * Loads `jose` for the CommonJS build.
 *
 * `jose` ships only as an ES module. Where Node.js can `require()` an ES
 * module, the installed `jose` is used, so callers share one `jose` instance
 * with the SDK. Where it cannot (Node.js 18, 20 before 20.19, 22 before 22.12,
 * and runtimes that start Node.js with `--no-experimental-require-module`,
 * such as AWS Lambda), `require('jose')` throws `ERR_REQUIRE_ESM` and the SDK
 * falls back to the CommonJS copy of `jose` generated when the SDK is built
 * (`jose.bundle.js`, next to this file). Test runners that load ES modules as
 * CommonJS, such as Jest 29, report a `SyntaxError` instead; the SDK falls
 * back on that too, but only for the messages an ES module produces there.
 */
import type * as Jose from 'jose';

const ES_MODULE_AS_COMMONJS =
  /Cannot use import statement outside a module|Unexpected token 'export'/;

function cannotRequireEsModule(error: unknown): boolean {
  const e = error as { code?: unknown; name?: unknown; message?: unknown };
  if (typeof e !== 'object' || e === null) return false;
  if (e.code === 'ERR_REQUIRE_ESM') return true;
  return (
    e.name === 'SyntaxError' && ES_MODULE_AS_COMMONJS.test(String(e.message))
  );
}

let jose: Pick<typeof Jose, 'createLocalJWKSet' | 'jwtVerify' | 'decodeJwt'>;
try {
  jose = require('jose');
} catch (error) {
  if (!cannotRequireEsModule(error)) {
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
