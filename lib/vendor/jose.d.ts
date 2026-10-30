/**
 * Loads `jose` for the CommonJS build.
 *
 * `jose` ships only as an ES module. Where Node.js can `require()` an ES
 * module, the installed `jose` is used, so callers share one `jose` instance
 * with the SDK. Where it cannot (Node.js 18, 20 before 20.19, 22 before 22.12,
 * and runtimes that start Node.js with `--no-experimental-require-module`,
 * such as AWS Lambda), `require('jose')` throws `ERR_REQUIRE_ESM` and the SDK
 * falls back to the CommonJS copy of `jose` generated when the SDK is built
 * (`jose.bundle.js`, next to this file).
 */
import type * as Jose from 'jose';
export declare const createLocalJWKSet: typeof Jose.createLocalJWKSet, jwtVerify: typeof Jose.jwtVerify, decodeJwt: typeof Jose.decodeJwt;
