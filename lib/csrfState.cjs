require("./issuer.cjs");
let crypto = require("crypto");
//#region src/middleware/sessionCrypto.ts
const webcrypto = globalThis.crypto;
const SESSION_FORMAT_VERSION = 1;
const NONCE_SIZE = 12;
const AUTH_TAG_SIZE = 16;
const AUTH_TAG_BITS = AUTH_TAG_SIZE * 8;
const MAX_COOKIE_VALUE_BYTES = 3800;
const HKDF_SALT = new TextEncoder().encode("scalekit-session-v1");
const HKDF_INFO = new TextEncoder().encode("scalekit-encrypted-session");
const SECRET_HELP = "cookieEncryptionSecret is required. Generate a strong random secret, e.g.:\n  node -e \"console.log(require('crypto').randomBytes(32).toString('base64url'))\"\nand keep it identical across every server instance -- there is intentionally no default, since a shared default secret would let any deployment decrypt or forge any other deployment's sessions.";
/**
* Raised when an encrypted session cannot be decrypted -- missing, malformed,
* tampered with, or produced by an unsupported format version. Always thrown
* instead of returning a partially-decrypted or unauthenticated payload.
*/
var InvalidSessionError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "InvalidSessionError";
	}
};
async function deriveKey(secret) {
	if (!secret) throw new Error(SECRET_HELP);
	const secretKey = await webcrypto.subtle.importKey("raw", new TextEncoder().encode(secret), "HKDF", false, ["deriveBits"]);
	const bits = await webcrypto.subtle.deriveBits({
		name: "HKDF",
		hash: "SHA-256",
		salt: HKDF_SALT,
		info: HKDF_INFO
	}, secretKey, 256);
	return webcrypto.subtle.importKey("raw", bits, "AES-GCM", false, ["encrypt", "decrypt"]);
}
/**
* Encrypt a session payload (accessToken, refreshToken, idToken, user claims,
* expiresAt, ...) into a single opaque, tamper-proof string suitable for
* storing in a cookie.
*
* @param payload JSON-serializable session data.
* @param secret cookieEncryptionSecret -- required, no default (see module docs).
* @returns base64url-encoded, versioned ciphertext string.
*/
async function encryptSession(payload, secret) {
	const key = await deriveKey(secret);
	const nonce = webcrypto.getRandomValues(new Uint8Array(NONCE_SIZE));
	const plaintext = new TextEncoder().encode(JSON.stringify(payload));
	const ciphertextWithTag = new Uint8Array(await webcrypto.subtle.encrypt({
		name: "AES-GCM",
		iv: nonce,
		tagLength: AUTH_TAG_BITS
	}, key, plaintext));
	const encoded = Buffer.concat([
		Buffer.from([SESSION_FORMAT_VERSION]),
		Buffer.from(nonce),
		Buffer.from(ciphertextWithTag)
	]).toString("base64url");
	if (encoded.length > MAX_COOKIE_VALUE_BYTES) throw new Error(`encrypted session is ${encoded.length} bytes, which exceeds the browser cookie size limit; reduce the claims stored in the session (e.g. fewer custom access-token claims).`);
	return encoded;
}
/**
* Decrypt a session cookie value produced by encryptSession().
*
* This only performs cryptographic verification -- it does NOT check
* `expiresAt`. Callers (SessionRefreshManager) decide what to do with an
* expired-but-cryptographically-valid session (e.g. attempt a refresh using
* the refreshToken still present in the payload).
*
* @throws {InvalidSessionError} if token is missing, malformed, tampered
*   with, or uses an unsupported format version. Never throws any other
*   error type for these cases.
*/
async function decryptSession(token, secret) {
	if (!token) throw new InvalidSessionError("no session cookie provided");
	const key = await deriveKey(secret);
	let raw;
	try {
		raw = Buffer.from(token, "base64url");
	} catch {
		throw new InvalidSessionError("session cookie is invalid or has been tampered with");
	}
	if (raw.length < 1 + NONCE_SIZE + AUTH_TAG_SIZE) throw new InvalidSessionError("session cookie is truncated");
	const version = raw[0];
	if (version !== SESSION_FORMAT_VERSION) throw new InvalidSessionError(`unsupported session format version: ${version}`);
	const nonce = raw.subarray(1, 1 + NONCE_SIZE);
	const ciphertextWithTag = raw.subarray(1 + NONCE_SIZE);
	let payload;
	try {
		const plaintext = await webcrypto.subtle.decrypt({
			name: "AES-GCM",
			iv: new Uint8Array(nonce),
			tagLength: AUTH_TAG_BITS
		}, key, new Uint8Array(ciphertextWithTag));
		payload = JSON.parse(Buffer.from(plaintext).toString("utf8"));
	} catch (err) {
		if (err instanceof InvalidSessionError) throw err;
		throw new InvalidSessionError("session cookie is invalid or has been tampered with");
	}
	if (typeof payload !== "object" || payload === null || Array.isArray(payload)) throw new InvalidSessionError("decrypted session payload is not an object");
	return payload;
}
//#endregion
//#region src/middleware/sessionManager.ts
const DEFAULT_COOKIE_NAME = "sk_session";
const EXPIRY_LEEWAY_SECONDS = 10;
const REFRESH_CACHE_TTL_MS = 6e4;
/**
* Framework-agnostic session state machine: decrypts the session cookie,
* checks expiry, transparently refreshes via the Scalekit client when
* needed, and reports what the framework adapter should do next (proceed /
* set a new cookie / clear the cookie and redirect to login).
*
* Concurrent requests for the *same* session within one process are
* coalesced so only one actual refresh call is made -- see check(). Node is
* single-threaded per process, so this is promise-sharing (singleflight),
* not a lock: concurrent callers awaiting the same in-flight refresh receive
* the same resolved promise instead of each independently calling
* refreshAccessToken().
*/
var SessionRefreshManager = class {
	constructor(client, cookieEncryptionSecret, cookieName = DEFAULT_COOKIE_NAME) {
		this.refreshCache = /* @__PURE__ */ new Map();
		this.inFlight = /* @__PURE__ */ new Map();
		if (!cookieEncryptionSecret) throw new Error("cookieEncryptionSecret is required. Generate a strong random secret, e.g.:\n  node -e \"console.log(require('crypto').randomBytes(32).toString('base64url'))\"\nand keep it identical across every server instance -- there is intentionally no default, since a shared default secret would let any deployment decrypt or forge any other deployment's sessions.");
		this.client = client;
		this.secret = cookieEncryptionSecret;
		this.cookieName = cookieName;
	}
	/** Decide what to do with the incoming request's session cookie. */
	async check(request) {
		const cookieValue = request.getCookie(this.cookieName);
		if (!cookieValue) return {
			authenticated: false,
			reason: "no_session"
		};
		let payload;
		try {
			payload = await decryptSession(cookieValue, this.secret);
		} catch (err) {
			if (err instanceof InvalidSessionError) return {
				authenticated: false,
				shouldClearCookie: true,
				reason: "invalid_session"
			};
			throw err;
		}
		if ((typeof payload.expiresAt === "number" ? payload.expiresAt : 0) - EXPIRY_LEEWAY_SECONDS > Date.now() / 1e3) return {
			authenticated: true,
			user: payload.user
		};
		const refreshToken = payload.refreshToken;
		if (!refreshToken) return {
			authenticated: false,
			shouldClearCookie: true,
			reason: "invalid_session"
		};
		return this.refresh(refreshToken, payload);
	}
	sweepExpired() {
		const now = Date.now();
		for (const [key, outcome] of this.refreshCache) if (now - outcome.createdAt > REFRESH_CACHE_TTL_MS) this.refreshCache.delete(key);
	}
	refresh(refreshToken, oldPayload) {
		this.sweepExpired();
		const cached = this.refreshCache.get(refreshToken);
		if (cached) return Promise.resolve(cached.result);
		const existingInFlight = this.inFlight.get(refreshToken);
		if (existingInFlight) return existingInFlight;
		const promise = this.doRefresh(refreshToken, oldPayload).finally(() => {
			this.inFlight.delete(refreshToken);
		});
		this.inFlight.set(refreshToken, promise);
		return promise;
	}
	async doRefresh(refreshToken, oldPayload) {
		let result;
		try {
			const refreshResult = await this.client.refreshAccessToken(refreshToken);
			const claims = await this.client.validateToken(refreshResult.accessToken);
			result = {
				authenticated: true,
				user: claims,
				newCookieValue: await encryptSession({
					...oldPayload,
					accessToken: refreshResult.accessToken,
					refreshToken: refreshResult.refreshToken,
					user: claims,
					expiresAt: typeof claims.exp === "number" ? claims.exp : Date.now() / 1e3 + 300
				}, this.secret)
			};
			this.refreshCache.set(refreshToken, {
				result,
				createdAt: Date.now()
			});
			return result;
		} catch {
			return {
				authenticated: false,
				shouldClearCookie: true,
				reason: "refresh_failed"
			};
		}
	}
	/** Encrypt a fresh session payload (e.g. right after authenticateWithCode). */
	async createSessionCookie(payload) {
		return encryptSession(payload, this.secret);
	}
	/**
	* Decrypt a raw cookie value (e.g. for extracting idToken during logout,
	* before the cookie is cleared). Throws InvalidSessionError if the cookie
	* can't be decrypted -- callers that just want "is there a usable idToken"
	* should catch that and fall back gracefully, same as check() does.
	*/
	async decryptCookieValue(value) {
		return decryptSession(value, this.secret);
	}
	/** Apply a SessionResult's cookie side effects to an outgoing response. */
	apply(result, response) {
		if (result.newCookieValue) response.setCookie(this.cookieName, result.newCookieValue);
		else if (result.shouldClearCookie) response.deleteCookie(this.cookieName);
	}
};
//#endregion
//#region src/middleware/csrfState.ts
/**
* Short-lived cookie carrying the OAuth `state` value between the login and
* callback handlers, so the callback can verify the provider's callback
* wasn't forged (CSRF: an attacker's own authorization code smuggled into a
* victim's browser session). Shared by every framework adapter -- not
* framework-specific -- so a future fix here applies to all of them at once
* instead of risking one adapter drifting out of sync with the others.
*/
const STATE_COOKIE_NAME = "sk_oauth_state";
/**
* Short-lived cookie carrying a validated post-login redirect target between
* the login and callback handlers, so requiresAuth/createMiddleware can send
* a user back to the page they originally requested instead of a fixed
* postLoginRedirect. Shared by every framework adapter, same as the OAuth
* state cookie above.
*/
const RETURN_TO_COOKIE_NAME = "sk_return_to";
/** A fresh, random OAuth state value for a login handler to issue. */
function generateState() {
	return (0, crypto.randomBytes)(32).toString("base64url");
}
/**
* True only if both values are present and match, using a timing-safe
* comparison. Missing/mismatched state means this callback did not
* originate from a login this browser actually made.
*/
function verifyState(storedState, returnedState) {
	if (!storedState || !returnedState) return false;
	const bufA = Buffer.from(storedState);
	const bufB = Buffer.from(returnedState);
	if (bufA.length !== bufB.length) return false;
	return (0, crypto.timingSafeEqual)(bufA, bufB);
}
/**
* Validates a candidate post-login redirect target, accepting only
* same-origin relative paths. The value is attacker-influenceable (read from
* a query string on the login redirect), so this is a real open-redirect
* guard, not a cosmetic check: rejects absolute URLs (`https://evil.com`),
* protocol-relative URLs (`//evil.com`), backslash variants some
* browsers normalize into a protocol-relative URL (`/\evil.com`), and
* tab/CR/LF characters that the WHATWG URL spec strips during parsing.
*/
function sanitizeReturnTo(value) {
	if (!value) return void 0;
	if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\t\r\n]/.test(value)) return;
	return value;
}
//#endregion
Object.defineProperty(exports, "DEFAULT_COOKIE_NAME", {
	enumerable: true,
	get: function() {
		return DEFAULT_COOKIE_NAME;
	}
});
Object.defineProperty(exports, "RETURN_TO_COOKIE_NAME", {
	enumerable: true,
	get: function() {
		return RETURN_TO_COOKIE_NAME;
	}
});
Object.defineProperty(exports, "STATE_COOKIE_NAME", {
	enumerable: true,
	get: function() {
		return STATE_COOKIE_NAME;
	}
});
Object.defineProperty(exports, "SessionRefreshManager", {
	enumerable: true,
	get: function() {
		return SessionRefreshManager;
	}
});
Object.defineProperty(exports, "generateState", {
	enumerable: true,
	get: function() {
		return generateState;
	}
});
Object.defineProperty(exports, "sanitizeReturnTo", {
	enumerable: true,
	get: function() {
		return sanitizeReturnTo;
	}
});
Object.defineProperty(exports, "verifyState", {
	enumerable: true,
	get: function() {
		return verifyState;
	}
});

//# sourceMappingURL=csrfState.cjs.map