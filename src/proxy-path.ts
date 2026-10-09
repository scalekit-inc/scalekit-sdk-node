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

const PROXY_PATH_ERROR = 'path must resolve under the proxy prefix';

/** Headers that carry the client's credentials or select the connected account. */
const PROXY_CREDENTIAL_HEADERS = new Set([
  'authorization',
  'connection_name',
  'identifier',
]);

type Containment = 'inside' | 'outside' | 'unparseable';

/**
 * Classifies `url` against `<envUrl base path>/proxy/` on the environment's
 * origin. `inside` requires the same origin, the path as sent on the wire to
 * start with `<base>/proxy/` (a bare `<base>/proxy` is outside), and that path
 * as a server may read it (see {@link serverView}) to start with
 * `<base>/proxy/` or to be exactly `<base>/proxy`.
 *
 * The exact `<base>/proxy` case keeps paths that step out and back in to the
 * bare prefix (for example `/proxy/..%2fproxy`) behaving as before: they are
 * sent unchanged and can only reach the prefix itself, and any redirect from
 * there is covered by {@link proxyRedirectGuard}. Anything else, including
 * `<base>/proxyx` or `<base>/proxy-other`, is outside.
 */
function proxyContainment(envUrl: string, url: string): Containment {
  let prefix: URL;
  let target: URL;
  try {
    // The prefix is the URL `request()` builds for `path: '/'`, parsed the
    // same way, so any base path in envUrl is normalized identically.
    prefix = new URL(`${envUrl.replace(/\/$/, '')}/proxy/`);
    target = new URL(url);
  } catch {
    return 'unparseable';
  }
  if (target.origin !== prefix.origin) {
    return 'outside';
  }
  const sentPrefix = prefix.pathname;
  const sentPath = target.pathname;
  if (!sentPath.startsWith(sentPrefix)) {
    return 'outside';
  }
  const cleanedPrefix = serverView(sentPrefix);
  const cleanedPath = serverView(sentPath);
  return cleanedPath.startsWith(cleanedPrefix) ||
    cleanedPath === cleanedPrefix.replace(/\/$/, '')
    ? 'inside'
    : 'outside';
}

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
export function assertProxyPathContained(envUrl: string, url: string): void {
  // An unparseable URL cannot be sent either (the HTTP client uses the same
  // parser), so it is left to the existing failure path.
  if (proxyContainment(envUrl, url) === 'outside') {
    throw new Error(PROXY_PATH_ERROR);
  }
}

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
export function proxyRedirectGuard(
  envUrl: string
): (redirectOptions: Record<string, unknown>) => void {
  return (redirectOptions) => {
    const href = redirectOptions.href;
    if (
      typeof href === 'string' &&
      proxyContainment(envUrl, href) === 'inside'
    ) {
      return;
    }
    const headers = redirectOptions.headers;
    if (headers === null || typeof headers !== 'object') {
      return;
    }
    const mutable = headers as Record<string, unknown>;
    for (const name of Object.keys(mutable)) {
      if (PROXY_CREDENTIAL_HEADERS.has(name.toLowerCase())) {
        delete mutable[name];
      }
    }
  };
}

/**
 * Models how a server may interpret a request path: percent-decode once,
 * treat `\` as `/`, collapse runs of `/` into one, then remove dot segments
 * (RFC 3986 §5.2.4). Collapsing first matches routers that clean paths the
 * way Go's `path.Clean` does, where `/proxy//..` resolves to `/`, not to
 * `/proxy/`.
 */
function serverView(path: string): string {
  return removeDotSegments(
    percentDecodeBytes(path)
      .replace(/\\/g, '/')
      .replace(/\/{2,}/g, '/')
  );
}

/**
 * Decodes every `%XX` to the code unit `0xXX`. Never throws on malformed or
 * non-UTF-8 sequences; only the ASCII characters `.`, `/` and `\` matter to
 * the containment check, and UTF-8 multi-byte sequences never decode to them.
 */
function percentDecodeBytes(path: string): string {
  return path.replace(/%([0-9A-Fa-f]{2})/g, (_m, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

/** RFC 3986 §5.2.4 remove_dot_segments. */
function removeDotSegments(input: string): string {
  let rest = input;
  const output: string[] = [];
  while (rest.length > 0) {
    if (rest.startsWith('../')) {
      rest = rest.slice(3);
    } else if (rest.startsWith('./')) {
      rest = rest.slice(2);
    } else if (rest.startsWith('/./')) {
      rest = rest.slice(2);
    } else if (rest === '/.') {
      rest = '/';
    } else if (rest.startsWith('/../')) {
      rest = rest.slice(3);
      output.pop();
    } else if (rest === '/..') {
      rest = '/';
      output.pop();
    } else if (rest === '.' || rest === '..') {
      rest = '';
    } else {
      const next = rest.indexOf('/', rest.startsWith('/') ? 1 : 0);
      const segment = next === -1 ? rest : rest.slice(0, next);
      output.push(segment);
      rest = next === -1 ? '' : rest.slice(next);
    }
  }
  return output.join('');
}
