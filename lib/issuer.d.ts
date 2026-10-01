/**
 * Normalizes the `issuer` validation option to the value expected by jose.
 *
 * - `undefined`, `''` or `[]` -> `undefined` (issuer check is skipped)
 * - `'x'` -> `'x'`
 * - `['x', 'y']` -> `['x', 'y']` (token is valid if `iss` equals any entry)
 * - A non-empty array is always enforced, even if its entries are blank
 *   (`['']` matches no token), so config built from unset values fails closed
 *   instead of silently skipping validation.
 *
 * Matching is exact string equality; no trailing-slash normalization.
 */
export declare function normalizeIssuer(issuer?: string | string[]): string | string[] | undefined;
