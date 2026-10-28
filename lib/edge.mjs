import { a as createLocalJWKSet, c as JOSEError, d as JWSInvalid, f as JWSSignatureVerificationFailed, h as JWTInvalid, i as decodeJwt, l as JWKSNoMatchingKey, m as JWTExpired, n as IdTokenClaimToUserMap, o as jwtVerify, p as JWTClaimValidationFailed, s as isJwkSet, t as normalizeIssuer, u as JWKSTimeout } from "./issuer.mjs";
import QueryString from "qs";
//#region node_modules/jose/dist/webapi/jwks/remote.js
function isCloudflareWorkers() {
	return typeof WebSocketPair < "u" || typeof navigator < "u" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime < "u" && EdgeRuntime === "vercel";
}
let USER_AGENT;
(typeof navigator > "u" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (USER_AGENT = "jose/v6.2.13");
const customFetch = /* @__PURE__ */ Symbol();
async function fetchJwks(url, headers, signal, fetchImpl = fetch) {
	const response = await fetchImpl(url, {
		method: "GET",
		signal,
		redirect: "manual",
		headers
	}).catch((err) => {
		throw err.name === "TimeoutError" ? new JWKSTimeout(void 0, { cause: err }) : err;
	});
	if (response.status !== 200) throw new JOSEError("Expected 200 OK from the JSON Web Key Set HTTP response");
	try {
		return await response.json();
	} catch (cause) {
		throw new JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON", { cause });
	}
}
const jwksCache = /* @__PURE__ */ Symbol();
function isFreshFor(timestamp, duration) {
	return Number.isFinite(timestamp) && Date.now() < timestamp + duration;
}
function validateDuration(value, fallback, option) {
	if (Number.isNaN(value)) throw new TypeError(`"${option}" option must not be NaN`);
	return typeof value == "number" ? value : fallback;
}
function createRemoteJWKSet(url, options) {
	if (!(url instanceof URL)) throw new TypeError("url must be an instance of URL");
	const href = new URL(url.href).href, opts = options ?? {}, timeoutOption = opts.timeoutDuration;
	if (typeof timeoutOption == "number" && (!Number.isInteger(timeoutOption) || timeoutOption < 0)) throw new TypeError("\"timeoutDuration\" option must be a non-negative integer");
	const timeoutDuration = typeof timeoutOption == "number" ? timeoutOption : 5e3, cooldownDuration = validateDuration(opts.cooldownDuration, 3e4, "cooldownDuration"), cacheMaxAge = validateDuration(opts.cacheMaxAge, 6e5, "cacheMaxAge"), headers = new Headers(opts.headers);
	USER_AGENT && !headers.has("User-Agent") && headers.set("User-Agent", USER_AGENT), headers.has("accept") || headers.set("accept", "application/json, application/jwk-set+json");
	const fetchImpl = opts[customFetch], cache = opts[jwksCache];
	let jwksTimestamp, pendingFetch, reloadSequence = 0, appliedSequence = 0, local;
	if (cache && typeof cache == "object") {
		const { uat, jwks } = cache;
		isFreshFor(uat, cacheMaxAge) && isJwkSet(jwks) && (jwksTimestamp = uat, local = createLocalJWKSet(jwks));
	}
	const reload = async () => {
		if (pendingFetch && isCloudflareWorkers() && (pendingFetch = void 0), !pendingFetch) {
			const sequence = ++reloadSequence, current = pendingFetch = fetchJwks(href, headers, AbortSignal.timeout(timeoutDuration), fetchImpl).then((json) => {
				const next = createLocalJWKSet(json);
				if (sequence <= appliedSequence) return;
				local = next;
				const updatedAt = Date.now();
				cache && (cache.uat = updatedAt, cache.jwks = json), jwksTimestamp = updatedAt, appliedSequence = sequence;
			}).finally(() => {
				pendingFetch === current && (pendingFetch = void 0);
			});
		}
		await pendingFetch;
	};
	return Object.defineProperties(async (protectedHeader, token) => {
		(!local || !isFreshFor(jwksTimestamp, cacheMaxAge)) && await reload();
		try {
			return await local(protectedHeader, token);
		} catch (err) {
			if (err instanceof JWKSNoMatchingKey && !isFreshFor(jwksTimestamp, cooldownDuration)) return await reload(), local(protectedHeader, token);
			throw err;
		}
	}, {
		coolingDown: {
			get: () => isFreshFor(jwksTimestamp, cooldownDuration),
			enumerable: !0
		},
		fresh: {
			get: () => isFreshFor(jwksTimestamp, cacheMaxAge),
			enumerable: !0
		},
		reload: {
			value: reload,
			enumerable: !0
		},
		reloading: {
			get: () => !!pendingFetch,
			enumerable: !0
		},
		jwks: {
			value: () => local?.jwks(),
			enumerable: !0
		}
	});
}
//#endregion
//#region src/edge.ts
/**
* Raised on any non-2xx response from Scalekit's REST endpoints. Simple,
* REST-native shape (statusCode/message/errorCode) rather than the gRPC-
* oriented src/errors/ hierarchy, which models Connect-RPC status codes that
* don't map cleanly onto OAuth token-endpoint error responses
* (invalid_grant, invalid_client, ...).
*/
var ScalekitEdgeError = class extends Error {
	constructor(statusCode, message, errorCode) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.name = "ScalekitEdgeError";
	}
};
const AUTHORIZE_PATH = "oauth/authorize";
const LOGOUT_PATH = "oidc/logout";
const TOKEN_PATH = "oauth/token";
const JWKS_PATH = "keys";
/**
* Fetch + jose based auth client covering only the methods
* ScalekitAuth/ScalekitAuthNext need -- an opt-in alternative to
* ScalekitClient for Next.js Edge Runtime, where ScalekitClient's gRPC
* transport and os/process-based User-Agent construction do not work. Not a
* replacement: no organization/connection/directory/etc. methods, and
* ScalekitClient remains the default for everything else.
*/
var ScalekitEdgeClient = class {
	constructor(envUrl, clientId, clientSecret) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.baseUrl = envUrl.replace(/\/+$/, "");
	}
	getJwks() {
		if (!this.jwks) this.jwks = createRemoteJWKSet(new URL(`${this.baseUrl}/${JWKS_PATH}`));
		return this.jwks;
	}
	buildUrl(path, params) {
		const url = new URL(`${this.baseUrl}/${path}`);
		for (const [key, value] of Object.entries(params)) if (value !== void 0) url.searchParams.set(key, value);
		return url.toString();
	}
	getAuthorizationUrl(redirectUri, options) {
		const scopes = options?.scopes ?? [
			"openid",
			"profile",
			"email"
		];
		return this.buildUrl(AUTHORIZE_PATH, {
			response_type: "code",
			client_id: this.clientId,
			redirect_uri: redirectUri,
			scope: scopes.join(" "),
			connection_id: options?.connectionId,
			organization_id: options?.organizationId,
			state: options?.state,
			nonce: options?.nonce,
			domain_hint: options?.domainHint,
			domain: options?.domainHint,
			login_hint: options?.loginHint,
			code_challenge: options?.codeChallenge,
			code_challenge_method: options?.codeChallengeMethod,
			provider: options?.provider,
			prompt: options?.prompt
		});
	}
	getLogoutUrl(options) {
		return this.buildUrl(LOGOUT_PATH, {
			id_token_hint: options?.idTokenHint,
			post_logout_redirect_uri: options?.postLogoutRedirectUri,
			state: options?.state
		});
	}
	async postToken(body) {
		const response = await fetch(`${this.baseUrl}/${TOKEN_PATH}`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: QueryString.stringify(body)
		});
		const text = await response.text();
		let data;
		try {
			data = JSON.parse(text);
		} catch {
			throw new ScalekitEdgeError(response.status, text || response.statusText);
		}
		if (!response.ok) throw new ScalekitEdgeError(response.status, data.error_description ?? data.error ?? "token request failed", data.error);
		return data;
	}
	async authenticateWithCode(code, redirectUri, options) {
		const data = await this.postToken({
			code,
			redirect_uri: redirectUri,
			grant_type: "authorization_code",
			client_id: this.clientId,
			client_secret: this.clientSecret,
			...options?.codeVerifier && { code_verifier: options.codeVerifier }
		});
		if (!data.id_token) throw new Error("Missing id_token in authentication response");
		if (!data.access_token) throw new Error("Missing access_token in authentication response");
		if (!data.refresh_token) throw new Error("Missing refresh_token in authentication response");
		if (data.expires_in === void 0) throw new Error("Missing expires_in in authentication response");
		const claims = decodeJwt(data.id_token);
		const user = {};
		for (const [k, v] of Object.entries(claims)) if (IdTokenClaimToUserMap[k]) user[IdTokenClaimToUserMap[k]] = v;
		return {
			user,
			idToken: data.id_token,
			accessToken: data.access_token,
			expiresIn: data.expires_in,
			refreshToken: data.refresh_token
		};
	}
	async refreshAccessToken(refreshToken) {
		if (!refreshToken) throw new Error("Refresh token is required");
		const data = await this.postToken({
			grant_type: "refresh_token",
			client_id: this.clientId,
			client_secret: this.clientSecret,
			refresh_token: refreshToken
		});
		if (!data.access_token) throw new Error("Missing access_token in authentication response");
		if (!data.refresh_token) throw new Error("Missing refresh_token in authentication response");
		return {
			accessToken: data.access_token,
			refreshToken: data.refresh_token
		};
	}
	async validateToken(token, options) {
		try {
			const issuer = normalizeIssuer(options?.issuer);
			const { payload } = await jwtVerify(token, this.getJwks(), {
				...issuer && { issuer },
				...options?.audience && { audience: options.audience }
			});
			if (options?.requiredScopes && options.requiredScopes.length > 0) {
				const claims = decodeJwt(token);
				const scopes = Array.isArray(claims.scopes) ? claims.scopes.filter((scope) => !!scope?.trim?.()) : [];
				const missing = options.requiredScopes.filter((s) => !scopes.includes(s));
				if (missing.length > 0) throw new Error(`Token missing required scopes: ${missing.join(", ")}`);
			}
			return payload;
		} catch (err) {
			if ([
				JWTClaimValidationFailed,
				JWTExpired,
				JWSSignatureVerificationFailed,
				JWTInvalid,
				JWSInvalid,
				JWKSNoMatchingKey
			].some((cls) => err instanceof cls) || err instanceof Error && err.message.includes("Token missing required scopes")) throw new ScalekitEdgeError(401, `token validation failed: ${err instanceof Error ? err.message : String(err)}`);
			throw err;
		}
	}
	async getIdpInitiatedLoginClaims(idpInitiatedLoginToken, options) {
		return this.validateToken(idpInitiatedLoginToken, options);
	}
};
//#endregion
export { ScalekitEdgeClient, ScalekitEdgeError };

//# sourceMappingURL=edge.mjs.map