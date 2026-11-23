"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jose = void 0;
exports.selectJose = selectJose;
/**
 * Errors that mean `require()` cannot load `jose` synchronously on this
 * runtime, so the bundled copy is used instead:
 * - `ERR_REQUIRE_ESM`: `require()` of an ES module is unsupported or disabled
 *   (Node.js without `require(esm)`; Jest 30.5 and later also use this
 *   code).
 * - `ERR_REQUIRE_ASYNC_MODULE`: `require(esm)` reached top-level `await`.
 *
 * Anything else, including `MODULE_NOT_FOUND`, is rethrown: `jose` is a
 * declared dependency, so a missing or broken install must surface rather
 * than be masked by a different copy.
 */
const FALLBACK_CODES = new Set([
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
function selectJose(load) {
    try {
        return load('jose');
    }
    catch (error) {
        const code = error === null || error === void 0 ? void 0 : error.code;
        if (typeof code === 'string' && FALLBACK_CODES.has(code)) {
            return load('./jose-bundle');
        }
        throw error;
    }
}
/**
 * The SDK's `jose`. Use its members through this object
 * (`jose.jwtVerify(...)`) rather than destructuring, so tests can spy on
 * the installed module.
 */
exports.jose = selectJose((id) => 
// Both specifiers are string literals so bundlers can resolve them.
id === 'jose' ? require('jose') : require('./jose-bundle'));
//# sourceMappingURL=jose.js.map