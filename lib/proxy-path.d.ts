/**
 * Containment check for `actions.request()` proxy URLs.
 *
 * `actions.request()` sends to `<envUrl>/proxy<path>` with the client's
 * credentials. The WHATWG URL parser (used by axios and fetch) removes tab,
 * LF and CR and resolves `.`/`..` segments (including `%2e` forms and `\`),
 * and a server may percent-decode the path before routing it. Either step can
 * move a caller-supplied `path` out of the proxy prefix. A proxied response
 * can also redirect the client out of it. This module rejects such request
 * URLs and keeps credentials off such redirects; it never rewrites a URL.
 *
 * @internal Not exported from the package root.
 */
/**
 * Throws when `url` (as built by `actions.request()`) would resolve outside
 * `<envUrl base path>/proxy/`, either as sent on the wire or as a server sees
 * it after percent-decoding and dot-segment removal.
 *
 * @param envUrl - The client's environment URL (may carry a base path).
 * @param url - The full request URL, `<envUrl>/proxy<path>`.
 * @throws {Error} If the path resolves outside the proxy prefix.
 * @internal
 */
export declare function assertProxyPathContained(envUrl: string, url: string): void;
/**
 * Builds an axios `beforeRedirect` hook (Node http adapter, follow-redirects)
 * for proxied requests. Each redirect is still followed as before; when a hop
 * targets anything other than `<envUrl base path>/proxy/` on the environment's
 * origin, the `Authorization`, `connection_name` and `identifier` headers are
 * removed before that hop is sent. follow-redirects reuses the same headers
 * object for later hops, so once removed they stay removed.
 *
 * @param envUrl - The client's environment URL (may carry a base path).
 * @returns A hook to pass as the axios `beforeRedirect` request option.
 * @internal
 */
export declare function proxyRedirectGuard(envUrl: string): (redirectOptions: Record<string, unknown>) => void;
