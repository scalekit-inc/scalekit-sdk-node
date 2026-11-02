// The package is compiled to CommonJS, so every runtime dependency it
// require()s must also be loadable by require() on Node.js versions and in
// bundler setups where require() cannot load ES modules. These tests load the
// compiled lib/ (run `npm run build` first) in a child Node.js process.
import { describe, it, expect } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');

// The switch that turns off require(esm) differs by Node.js version:
// `--no-require-module` on newer lines, `--no-experimental-require-module` on
// 20.17+/22.x. Older versions have neither and cannot require() ESM at all.
const DISABLE_REQUIRE_ESM = [
  '--no-require-module',
  '--no-experimental-require-module',
].find((flag) => process.allowedNodeEnvironmentFlags.has(flag));

function runNode(script: string): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const env = { ...process.env };
  delete env.NODE_OPTIONS;
  const args = [...(DISABLE_REQUIRE_ESM ? [DISABLE_REQUIRE_ESM] : []), '-e'];
  const result = spawnSync(process.execPath, [...args, script], {
    cwd: ROOT,
    env,
    encoding: 'utf8',
    timeout: 60_000,
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

// Resolves each runtime dependency the way require() does and reports whether
// the file it gets is CommonJS (by extension, else by the nearest
// package.json "type"). Node.js applies no require(esm)-only conditions here
// because the script runs with require(esm) disabled where possible.
const RESOLVE_DEPENDENCIES = `
const fs = require('node:fs');
const path = require('node:path');
const deps = Object.keys(require('./package.json').dependencies);
const formatOf = (file) => {
  if (file.endsWith('.cjs')) return 'commonjs';
  if (file.endsWith('.mjs')) return 'module';
  for (let dir = path.dirname(file); ; dir = path.dirname(dir)) {
    const pj = path.join(dir, 'package.json');
    if (fs.existsSync(pj)) {
      return JSON.parse(fs.readFileSync(pj, 'utf8')).type === 'module'
        ? 'module'
        : 'commonjs';
    }
    if (path.dirname(dir) === dir) return 'commonjs';
  }
};
process.stdout.write(JSON.stringify(deps.map((name) => {
  const file = require.resolve(name);
  return { name, file: path.relative(process.cwd(), file), format: formatOf(file) };
})));
`;

// Loads every public entry point with require(), then validates a token so
// jose is exercised, not just loaded.
const LOAD_ENTRY_POINTS = `
const sdk = require('@scalekit-sdk/node');
const { ScalekitEdgeClient } = require('@scalekit-sdk/node/edge');
const { ScalekitAuth } = require('@scalekit-sdk/node/express');
const { ScalekitAuthNext } = require('@scalekit-sdk/node/next');
for (const [name, value] of Object.entries({
  ScalekitClient: sdk.ScalekitClient, default: sdk.default,
  ScalekitEdgeClient, ScalekitAuth, ScalekitAuthNext,
})) {
  if (typeof value !== 'function') throw new Error(name + ' is not exported');
}
const jose = require('jose');
(async () => {
  const { publicKey, privateKey } = await jose.generateKeyPair('RS256');
  const jwk = { ...(await jose.exportJWK(publicKey)), kid: 'k1', alg: 'RS256' };
  const client = new sdk.ScalekitClient('https://example.invalid', 'id', 'secret');
  client.coreClient.keys = [jwk];
  const token = await new jose.SignJWT({ sub: 'user_1' })
    .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
    .setIssuer('https://example.invalid')
    .setExpirationTime('5m')
    .sign(privateKey);
  const claims = await client.validateToken(token, { issuer: 'https://example.invalid' });
  process.stdout.write(JSON.stringify({
    requireModule: process.features.require_module ?? null,
    sub: claims.sub,
  }));
})().catch((err) => { console.error(err); process.exit(1); });
`;

describe('CommonJS consumers', () => {
  it('every runtime dependency resolves to a CommonJS file under require()', () => {
    const { status, stdout, stderr } = runNode(RESOLVE_DEPENDENCIES);
    expect({ status, stderr }).toEqual({ status: 0, stderr: '' });

    const resolved: Array<{ name: string; file: string; format: string }> =
      JSON.parse(stdout);
    expect(resolved.map((d) => d.name)).toContain('jose');
    expect(resolved.filter((d) => d.format !== 'commonjs')).toEqual([]);
  });

  const requireEsmAlwaysOn =
    !DISABLE_REQUIRE_ESM &&
    (process.features as { require_module?: boolean }).require_module === true;

  it(
    DISABLE_REQUIRE_ESM
      ? `loads every entry point with require() when require(esm) is disabled (${DISABLE_REQUIRE_ESM})`
      : requireEsmAlwaysOn
        ? 'loads every entry point with require() (require(esm) cannot be disabled on this Node.js; the resolution check above guards CommonJS consumers)'
        : 'loads every entry point with require() on a Node.js without require(esm)',
    () => {
      const { status, stdout, stderr } = runNode(LOAD_ENTRY_POINTS);
      expect({ status, stderr }).toEqual({ status: 0, stderr: '' });

      const result: { requireModule: boolean | null; sub: string } =
        JSON.parse(stdout);
      expect(result.sub).toBe('user_1');
      if (DISABLE_REQUIRE_ESM) {
        // The child really ran without require(esm); otherwise this test
        // would pass even if a dependency were ESM-only.
        expect(result.requireModule).toBe(false);
      }
    }
  );
});
