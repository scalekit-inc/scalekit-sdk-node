import { RequestAdapter, ResponseAdapter } from './protocol';
import {
  decryptSession,
  encryptSession,
  InvalidSessionError,
} from './sessionCrypto';

export const DEFAULT_COOKIE_NAME = 'sk_session';

// Refresh a little before the stored expiry so a request doesn't race the exact
// expiry instant against network latency to the token endpoint.
const EXPIRY_LEEWAY_SECONDS = 10;

// How long a completed refresh outcome stays cached for singleflight coalescing
// before it's swept. Comfortably longer than Scalekit's server-side refresh-token
// rotation grace window (~30s) so same-process concurrent callers racing within
// that window all land on the cached result rather than each hitting the network.
const REFRESH_CACHE_TTL_MS = 60_000;

export interface SessionResult {
  authenticated: boolean;
  user?: Record<string, unknown>;
  newCookieValue?: string;
  shouldClearCookie?: boolean;
  reason?: 'no_session' | 'invalid_session' | 'refresh_failed';
}

interface RefreshOutcome {
  result: SessionResult;
  createdAt: number;
}

/**
 * Minimal shape of the ScalekitClient methods this manager depends on --
 * avoids a hard import dependency on the concrete client class, so this
 * module can be unit-tested against a plain mock.
 */
export interface ScalekitClientLike {
  refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
  validateToken<T = Record<string, unknown>>(token: string): Promise<T>;
}

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
export class SessionRefreshManager {
  readonly cookieName: string;
  private readonly client: ScalekitClientLike;
  private readonly secret: string;
  private readonly refreshCache = new Map<string, RefreshOutcome>();
  private readonly inFlight = new Map<string, Promise<SessionResult>>();

  constructor(
    client: ScalekitClientLike,
    cookieEncryptionSecret: string,
    cookieName: string = DEFAULT_COOKIE_NAME
  ) {
    if (!cookieEncryptionSecret) {
      throw new Error(
        'cookieEncryptionSecret is required. Generate a strong random secret, e.g.:\n' +
          "  node -e \"console.log(require('crypto').randomBytes(32).toString('base64url'))\"\n" +
          'and keep it identical across every server instance -- there is intentionally no ' +
          'default, since a shared default secret would let any deployment decrypt or forge ' +
          "any other deployment's sessions."
      );
    }
    this.client = client;
    this.secret = cookieEncryptionSecret;
    this.cookieName = cookieName;
  }

  /** Decide what to do with the incoming request's session cookie. */
  async check(request: RequestAdapter): Promise<SessionResult> {
    const cookieValue = request.getCookie(this.cookieName);
    if (!cookieValue) {
      return { authenticated: false, reason: 'no_session' };
    }

    let payload: Record<string, unknown>;
    try {
      payload = decryptSession(cookieValue, this.secret);
    } catch (err) {
      if (err instanceof InvalidSessionError) {
        return {
          authenticated: false,
          shouldClearCookie: true,
          reason: 'invalid_session',
        };
      }
      throw err;
    }

    const expiresAt =
      typeof payload.expiresAt === 'number' ? payload.expiresAt : 0;
    if (expiresAt - EXPIRY_LEEWAY_SECONDS > Date.now() / 1000) {
      return {
        authenticated: true,
        user: payload.user as Record<string, unknown> | undefined,
      };
    }

    const refreshToken = payload.refreshToken as string | undefined;
    if (!refreshToken) {
      return {
        authenticated: false,
        shouldClearCookie: true,
        reason: 'invalid_session',
      };
    }

    return this.refresh(refreshToken, payload);
  }

  private sweepExpired(): void {
    const now = Date.now();
    for (const [key, outcome] of this.refreshCache) {
      if (now - outcome.createdAt > REFRESH_CACHE_TTL_MS) {
        this.refreshCache.delete(key);
      }
    }
  }

  private refresh(
    refreshToken: string,
    oldPayload: Record<string, unknown>
  ): Promise<SessionResult> {
    this.sweepExpired();

    const cached = this.refreshCache.get(refreshToken);
    if (cached) {
      return Promise.resolve(cached.result);
    }

    const existingInFlight = this.inFlight.get(refreshToken);
    if (existingInFlight) {
      return existingInFlight;
    }

    const promise = this.doRefresh(refreshToken, oldPayload).finally(() => {
      this.inFlight.delete(refreshToken);
    });
    this.inFlight.set(refreshToken, promise);
    return promise;
  }

  private async doRefresh(
    refreshToken: string,
    oldPayload: Record<string, unknown>
  ): Promise<SessionResult> {
    let result: SessionResult;
    try {
      const refreshResult = await this.client.refreshAccessToken(refreshToken);
      // Re-derive user/claims from the freshly-issued access token rather than
      // carrying the old cached values forward -- access-token claims (not
      // id_token claims) are the source of truth: customers can configure
      // custom access-token claims in the Scalekit dashboard, and unlike the
      // id_token, the access token IS reissued on every refresh, so this keeps
      // `user` genuinely current instead of stale-until-next-login.
      const claims = await this.client.validateToken<Record<string, unknown>>(
        refreshResult.accessToken
      );
      const newPayload = {
        ...oldPayload,
        accessToken: refreshResult.accessToken,
        refreshToken: refreshResult.refreshToken,
        user: claims,
        expiresAt:
          typeof claims.exp === 'number' ? claims.exp : Date.now() / 1000 + 300,
      };
      const newCookieValue = encryptSession(newPayload, this.secret);
      result = { authenticated: true, user: claims, newCookieValue };
    } catch {
      // Deliberately caught broadly -- any failure here means "treat as
      // logged out," never an unhandled rejection. Framework adapters should
      // log this via their own error-handling middleware if desired.
      result = {
        authenticated: false,
        shouldClearCookie: true,
        reason: 'refresh_failed',
      };
    }

    this.refreshCache.set(refreshToken, { result, createdAt: Date.now() });
    return result;
  }

  /** Encrypt a fresh session payload (e.g. right after authenticateWithCode). */
  createSessionCookie(payload: Record<string, unknown>): string {
    return encryptSession(payload, this.secret);
  }

  /**
   * Decrypt a raw cookie value (e.g. for extracting idToken during logout,
   * before the cookie is cleared). Throws InvalidSessionError if the cookie
   * can't be decrypted -- callers that just want "is there a usable idToken"
   * should catch that and fall back gracefully, same as check() does.
   */
  decryptCookieValue(value: string): Record<string, unknown> {
    return decryptSession(value, this.secret);
  }

  /** Apply a SessionResult's cookie side effects to an outgoing response. */
  apply(result: SessionResult, response: ResponseAdapter): void {
    if (result.newCookieValue) {
      response.setCookie(this.cookieName, result.newCookieValue);
    } else if (result.shouldClearCookie) {
      response.deleteCookie(this.cookieName);
    }
  }
}
