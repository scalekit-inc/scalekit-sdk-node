/**
 * Normalizes the `issuer` validation option to the value expected by jose.
 *
 * - `undefined`, `''` or `[]` -> `undefined` (issuer check is skipped)
 * - `'x'` -> `'x'`
 * - `['x', 'y']` -> `['x', 'y']` (token is valid if `iss` equals any entry)
 *
 * Matching is exact string equality; no trailing-slash normalization.
 */
export function normalizeIssuer(
  issuer?: string | string[]
): string | string[] | undefined {
  if (Array.isArray(issuer)) {
    const issuers = issuer.filter((i) => !!i);
    return issuers.length > 0 ? issuers : undefined;
  }
  return issuer || undefined;
}
