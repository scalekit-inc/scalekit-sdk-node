/**
 * Loads `jose` for the CommonJS build.
 *
 * `jose` ships only as an ES module. Node.js can `require()` an ES module
 * from 20.19 and 22.12 onwards; older releases throw `ERR_REQUIRE_ESM`. The
 * installed `jose` is used whenever it can be required, so callers share one
 * `jose` instance with the SDK. Only when `require()` of ES modules is
 * unavailable does the SDK fall back to the CommonJS copy of `jose` generated
 * when the SDK is built (`jose.bundle.js`, next to this file).
 */
import type * as Jose from 'jose';
export type { JWK, JWTPayload, JWTVerifyResult } from 'jose';
export declare const createLocalJWKSet: typeof Jose.createLocalJWKSet;
export declare const jwtVerify: typeof Jose.jwtVerify;
export declare const decodeJwt: typeof Jose.decodeJwt;
