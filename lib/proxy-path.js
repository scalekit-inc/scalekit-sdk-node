"use strict";
/**
 * Containment check for `actions.request()` proxy URLs.
 *
 * `actions.request()` sends to `<envUrl>/proxy<path>` with the client's
 * credentials. The WHATWG URL parser (used by axios and fetch) removes tab,
 * LF and CR and resolves `.`/`..` segments (including `%2e` forms and `\`),
 * and a server may percent-decode the path before routing it. Either step can
 * move a caller-supplied `path` out of the proxy prefix. This module rejects
 * such URLs; it never rewrites them.
 *
 * @internal Not exported from the package root.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertProxyPathContained = assertProxyPathContained;
const PROXY_PATH_ERROR = 'path must resolve under the proxy prefix';
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
function assertProxyPathContained(envUrl, url) {
    let sentPrefix;
    let sentPath;
    try {
        // The prefix is the path `request()` produces for `path: '/'`, parsed the
        // same way, so any base path in envUrl is normalized identically.
        sentPrefix = new URL(`${envUrl.replace(/\/$/, '')}/proxy/`).pathname;
        sentPath = new URL(url).pathname;
    }
    catch (_a) {
        // Unparseable URL: the HTTP client uses the same parser and cannot send
        // it either, so leave the existing failure path unchanged.
        return;
    }
    if (!sentPath.startsWith(sentPrefix) ||
        !serverView(sentPath).startsWith(serverView(sentPrefix))) {
        throw new Error(PROXY_PATH_ERROR);
    }
}
/**
 * Models how a server may interpret a request path: percent-decode once,
 * treat `\` as `/`, then remove dot segments (RFC 3986 §5.2.4).
 */
function serverView(path) {
    return removeDotSegments(percentDecodeBytes(path).replace(/\\/g, '/'));
}
/**
 * Decodes every `%XX` to the code unit `0xXX`. Never throws on malformed or
 * non-UTF-8 sequences; only the ASCII characters `.`, `/` and `\` matter to
 * the containment check, and UTF-8 multi-byte sequences never decode to them.
 */
function percentDecodeBytes(path) {
    return path.replace(/%([0-9A-Fa-f]{2})/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)));
}
/** RFC 3986 §5.2.4 remove_dot_segments. */
function removeDotSegments(input) {
    let rest = input;
    const output = [];
    while (rest.length > 0) {
        if (rest.startsWith('../')) {
            rest = rest.slice(3);
        }
        else if (rest.startsWith('./')) {
            rest = rest.slice(2);
        }
        else if (rest.startsWith('/./')) {
            rest = rest.slice(2);
        }
        else if (rest === '/.') {
            rest = '/';
        }
        else if (rest.startsWith('/../')) {
            rest = rest.slice(3);
            output.pop();
        }
        else if (rest === '/..') {
            rest = '/';
            output.pop();
        }
        else if (rest === '.' || rest === '..') {
            rest = '';
        }
        else {
            const next = rest.indexOf('/', rest.startsWith('/') ? 1 : 0);
            const segment = next === -1 ? rest : rest.slice(0, next);
            output.push(segment);
            rest = next === -1 ? '' : rest.slice(next);
        }
    }
    return output.join('');
}
//# sourceMappingURL=proxy-path.js.map