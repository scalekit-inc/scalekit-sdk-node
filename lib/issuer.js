"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeIssuer = normalizeIssuer;
/**
 * Normalizes the `issuer` validation option to the value expected by jose.
 *
 * - `undefined`, `''` or `[]` -> `undefined` (issuer check is skipped)
 * - `'x'` -> `'x'`
 * - `['x', 'y']` -> `['x', 'y']` (token is valid if `iss` equals any entry)
 *
 * Matching is exact string equality; no trailing-slash normalization.
 */
function normalizeIssuer(issuer) {
    if (Array.isArray(issuer)) {
        const issuers = issuer.filter((i) => !!i);
        return issuers.length > 0 ? issuers : undefined;
    }
    return issuer || undefined;
}
//# sourceMappingURL=issuer.js.map