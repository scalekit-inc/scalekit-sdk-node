'use strict';
// Runs after `tsc` (see the "build" script). Replaces the tsc output for
// src/vendor/jose.ts, which would `require("jose")`, with a CommonJS bundle of
// the parts of jose the SDK uses. jose ships only an ES module build, so
// without this step `require()` of the SDK fails wherever require(esm) is
// unavailable. The output is deterministic: rebuilding with the same jose and
// esbuild versions produces the same bytes, so CI's built-files check catches
// a jose update that was not rebuilt.
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const joseDir = path.dirname(
  require.resolve('jose/package.json', { paths: [root] })
);
const jose = JSON.parse(
  fs.readFileSync(path.join(joseDir, 'package.json'), 'utf8')
);
const license = fs
  .readFileSync(path.join(joseDir, 'LICENSE.md'), 'utf8')
  .trim()
  .split(/\r?\n/);
const outfile = path.join(root, 'lib', 'vendor', 'jose.js');

const banner = [
  '/*!',
  ` * Bundled copy of jose@${jose.version} (${jose.homepage}).`,
  ' * Generated from src/vendor/jose.ts by scripts/bundle-jose.js. Do not edit.',
  ' *',
  ...license.map((line) => (line ? ` * ${line}` : ' *')),
  ' */',
].join('\n');

esbuild.buildSync({
  absWorkingDir: root,
  entryPoints: ['src/vendor/jose.ts'],
  outfile,
  allowOverwrite: true,
  bundle: true,
  format: 'cjs',
  // jose's default export condition is its Web API build, which runs on
  // Node.js and on edge runtimes alike; neutral keeps esbuild from assuming
  // either.
  platform: 'neutral',
  target: 'es2022',
  minify: false,
  treeShaking: true,
  legalComments: 'inline',
  charset: 'ascii',
  banner: { js: banner },
  logLevel: 'warning',
});

// tsc's source map describes the file this step replaced. Its declaration
// file re-exports from 'jose', which consumers do not install; nothing public
// references it, so drop it rather than ship a dangling import.
fs.rmSync(`${outfile}.map`, { force: true });
fs.rmSync(outfile.replace(/\.js$/, '.d.ts'), { force: true });
