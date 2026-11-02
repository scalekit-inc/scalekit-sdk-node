/**
 * The only module in this package that imports `jose`.
 *
 * `jose` ships only an ES module build, while this package is compiled to
 * CommonJS. After `tsc`, the build bundles `jose` into the emitted
 * `lib/vendor/jose.js` (see `scripts/bundle-jose.js`), so `require()` of this
 * package never loads an ES module and works on every runtime, with or
 * without `require(esm)`. Import `jose` through this module only, and only
 * what the SDK uses, so the bundle stays small.
 *
 * Types from this module must not appear in public declarations: the emitted
 * `.d.ts` would import `jose`, which consumers do not install.
 *
 * @internal
 */
export {
  createLocalJWKSet,
  createRemoteJWKSet,
  decodeJwt,
  errors,
  jwtVerify,
} from 'jose';
