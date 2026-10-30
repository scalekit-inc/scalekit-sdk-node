// Injected into lib/vendor/jose.bundle.js in place of the `crypto` global, which
// Node.js 18 only defines with --experimental-global-webcrypto. It is the same
// object as globalThis.crypto wherever that global exists.
export { webcrypto as crypto } from 'node:crypto';
