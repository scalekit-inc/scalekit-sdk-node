// Writes lib/vendor/jose.bundle.js: a CommonJS build of the installed `jose`.
// `jose` is published only as an ES module; lib/vendor/jose.js loads this
// file on Node.js versions that cannot require() ES modules.
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
const banner = `/*!\n * jose ${version} (${homepage})\n *\n${license}\n */`;

try {
  await build({
    stdin: {
      contents: "module.exports = require('jose');",
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
    legalComments: 'inline',
    inject: [join(root, 'scripts', 'jose-webcrypto.mjs')],
    banner: { js: banner },
    logLevel: 'warning',
  });
} catch {
  // esbuild has already printed the build errors.
  process.exitCode = 1;
}
