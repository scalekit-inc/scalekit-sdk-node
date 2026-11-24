/**
 * Containment check and connected-account headers for proxied requests
 * (`actions.request()` and `actions.uploadResumable()`).
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
 * Builds the headers of a proxied request: the caller's headers plus the
 * connected account, named under both `connection_name` / `identifier` and
 * `X-Scalekit-Connection-Name` / `X-Scalekit-Identifier`, with the same value
 * under each pair.
 *
 * A caller header whose name matches any of those four, in any casing, is
 * dropped, so the SDK's values always win and no second casing with a
 * different value is sent beside them. Every other caller header (including
 * `X-Identifier`) is kept unchanged. Values are used exactly as given.
 * `headers` is not modified.
 *
 * @param connectionName - The connection name to send.
 * @param identifier - The connected account's identifier to send.
 * @param headers - The caller's headers, if any.
 * @returns A new header object for the request.
 * @internal
 */
export declare function connectedAccountHeaders(connectionName: string, identifier: string, headers?: Readonly<Record<string, string>>): Record<string, string>;
/**
 * Throws when `url` (as built by `actions.request()`) would resolve outside
 * `<envUrl base path>/proxy/`, either as sent on the wire or as a server sees
 * it after percent-decoding, slash collapsing and dot-segment removal.
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
 * origin, the `Authorization`, `connection_name`, `identifier`,
 * `X-Scalekit-Connection-Name` and `X-Scalekit-Identifier` headers (any
 * casing) are removed before that hop is sent, as they are when the hop's request-target
 * would carry a fragment. follow-redirects reuses the same headers object for
 * later hops, so once removed they stay removed. axios runs its own proxy
 * hook before this one, so `path` is already the final request-target.
 *
 * @param envUrl - The client's environment URL (may carry a base path).
 * @returns A hook to pass as the axios `beforeRedirect` request option.
 * @internal
 */
export declare function proxyRedirectGuard(envUrl: string): (redirectOptions: Record<string, unknown>) => void;
