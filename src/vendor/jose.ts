/**
 * The only module in this package that loads `jose`.
 *
 * `jose` ships only an ES module build, while this package is compiled to
 * CommonJS. It loads the `jose` the application installed whenever
 * `require()` can load it: Node.js with `require(esm)` (20.19+, 22.12+) and
 * bundlers. The SDK then shares that module instance with the application,
 * so its error classes are the ones callers match with `instanceof`.
 *
 * Where `require()` cannot load ES modules (older Node.js 20 and 22, Jest
 * without a transform for `jose`), it falls back to a CommonJS bundle of the
 * same exports, built from the installed `jose` by `scripts/bundle-jose.js`.
 *
 * Types from this module must not appear in public declarations: they would
 * import `jose` from CommonJS declaration files.
 *
 * @internal
 */
import type * as Jose from 'jose';
import { JOSE_EXPORTS } from './jose-exports';

export type JoseApi = Pick<typeof Jose, (typeof JOSE_EXPORTS)[number]>;

/**
 * Errors that mean `require()` cannot load `jose` synchronously on this
 * runtime, so the bundled copy is used instead:
 * - `ERR_REQUIRE_ESM`: `require()` of an ES module is unsupported or disabled
 *   (Node.js without `require(esm)`; Jest also uses this code).
 * - `ERR_REQUIRE_ASYNC_MODULE`: `require(esm)` reached top-level `await`.
 *
 * Anything else, including `MODULE_NOT_FOUND`, is rethrown: `jose` is a
 * declared dependency, so a missing or broken install must surface rather
 * than be masked by a different copy.
 */
const FALLBACK_CODES: ReadonlySet<string> = new Set([
  'ERR_REQUIRE_ESM',
  'ERR_REQUIRE_ASYNC_MODULE',
]);

/**
 * Returns the installed `jose` if `load('jose')` succeeds, else the bundled
 * copy when the failure is one of {@link FALLBACK_CODES}.
 *
 * @param load - `require`, or a stand-in in tests.
 * @internal
 */
export function selectJose(load: (id: string) => unknown): JoseApi {
  try {
    return load('jose') as JoseApi;
  } catch (error) {
    const code = (error as { code?: unknown } | null)?.code;
    if (typeof code === 'string' && FALLBACK_CODES.has(code)) {
      return load('./jose-bundle') as JoseApi;
    }
    throw error;
  }
}

/**
 * The SDK's `jose`. Use its members through this object
 * (`jose.jwtVerify(...)`) rather than destructuring, so tests can spy on
 * the installed module.
 */
export const jose: JoseApi = selectJose((id) =>
  // Both specifiers are string literals so bundlers can resolve them.
  id === 'jose' ? require('jose') : require('./jose-bundle')
);
