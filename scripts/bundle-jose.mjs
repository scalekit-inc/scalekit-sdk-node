// Writes lib/vendor/jose.bundle.js: a CommonJS build of the parts of the
// installed `jose` that the SDK uses. `jose` is published only as an ES module;
// lib/vendor/jose.js loads this file where Node.js cannot require() ES modules.
//
// The bundle holds the `jose` version installed at build time, so a `jose`
// version change also changes lib/: run `npm run build` and commit lib/vendor/.
// package.json pins `jose` to an exact version for the same reason: the
// installed copy then always matches this bundle, so `npm audit` in a
// consumer's app reports the `jose` the SDK really runs on every runtime.
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));
const joseDir = dirname(require.resolve('jose/package.json'));
const { version, homepage } = JSON.parse(
  readFileSync(join(joseDir, 'package.json'), 'utf8')
);
const license = readFileSync(join(joseDir, 'LICENSE.md'), 'utf8')
  .trim()
  .split(/\r?\n/)
  .map((line) => ` *${line ? ` ${line}` : ''}`)
  .join('\n');

// The license is shipped with the bundled copy, as its MIT terms require.
// Node.js 18 scripts have no global `crypto`, so the bundle defines its own.
const banner = [
  `/*!\n * jose ${version} (${homepage})\n *\n${license}\n */`,
  // Strict mode, as jose runs when loaded as an ES module.
  '"use strict";',
  "const crypto = require('node:crypto').webcrypto;",
].join('\n');

await build({
  stdin: {
    contents: "export { createLocalJWKSet, jwtVerify, decodeJwt } from 'jose';",
    resolveDir: root,
    sourcefile: 'jose.bundle.cjs',
    loader: 'js',
  },
  outfile: join(root, 'lib', 'vendor', 'jose.bundle.js'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  minify: true,
  // jose sets error.name from the class name (e.g. JWTInvalid).
  keepNames: true,
  banner: { js: banner },
});
