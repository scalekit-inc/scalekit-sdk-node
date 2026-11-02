// The package is compiled to CommonJS and bundles `jose` (ES modules only)
// into lib/vendor/jose.js. These tests check the built lib/ (run
// `npm run build` first): it must load with require() where require() cannot
// load ES modules, require only declared dependencies, ship the jose version
// that is installed, and keep `jose` out of the published declarations.
import { describe, it, expect } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { builtinModules } from 'node:module';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const LIB = path.join(ROOT, 'lib');
const pkg = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
);

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

function filesUnder(dir: string, suffix: string): string[] {
  return fs
    .readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((f) => f.endsWith(suffix))
    .map((f) => path.join(dir, f));
}

// Resolves each runtime dependency the way require() does and reports whether
// the file it gets is CommonJS (by extension, else by the nearest
// package.json "type").
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

// Loads every public entry point with require(), then validates tokens with
// both clients so the bundled jose is exercised: ScalekitClient with local
// keys, ScalekitEdgeClient against a local JWKS endpoint over real HTTP.
// Tokens are signed with node:crypto because jose itself cannot be
// require()d here.
const LOAD_ENTRY_POINTS = `
const crypto = require('node:crypto');
const http = require('node:http');
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
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };
const b64 = (s) => Buffer.from(s).toString('base64url');
const token = b64(JSON.stringify({ alg: 'RS256', kid: 'k1' })) + '.' +
  b64(JSON.stringify({ sub: 'user_1', exp: Math.floor(Date.now() / 1000) + 300 }));
const jwt = token + '.' + crypto.sign('sha256', Buffer.from(token), privateKey).toString('base64url');
const tampered = jwt + '=';
const outcome = (p) => p.then(
  (v) => 'accepted:' + v.sub,
  (e) => 'rejected:' + e.constructor.name + (e.statusCode ? ':' + e.statusCode : ''),
);
(async () => {
  const client = new sdk.ScalekitClient('https://example.invalid', 'id', 'secret');
  client.coreClient.keys = [jwk];
  const server = http.createServer((req, res) => res.end(JSON.stringify({ keys: [jwk] })));
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const edge = new ScalekitEdgeClient('http://127.0.0.1:' + server.address().port, 'id', 'secret');
  const result = {
    requireModule: process.features.require_module ?? null,
    client: await outcome(client.validateToken(jwt)),
    clientTampered: await outcome(client.validateToken(tampered)),
    edge: await outcome(edge.validateToken(jwt)),
    edgeTampered: await outcome(edge.validateToken(tampered)),
  };
  server.close();
  process.stdout.write(JSON.stringify(result));
})().catch((err) => { console.error(err); process.exit(1); });
`;

describe('CommonJS consumers', () => {
  it('every runtime dependency resolves to a CommonJS file under require()', () => {
    const { status, stdout, stderr } = runNode(RESOLVE_DEPENDENCIES);
    expect({ status, stderr }).toEqual({ status: 0, stderr: '' });

    const resolved: Array<{ name: string; file: string; format: string }> =
      JSON.parse(stdout);
    expect(resolved.length).toBeGreaterThan(0);
    expect(resolved.filter((d) => d.format !== 'commonjs')).toEqual([]);
  });

  it('lib/ requires only declared dependencies, Node.js built-ins, and never jose', () => {
    const allowed = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ]);
    const undeclared = new Set<string>();
    for (const file of filesUnder(LIB, '.js')) {
      const source = fs.readFileSync(file, 'utf8');
      for (const [, spec] of source.matchAll(
        /require\(["']([^"'.][^"']*)["']\)/g
      )) {
        const name = spec.startsWith('@')
          ? spec.split('/').slice(0, 2).join('/')
          : spec.split('/')[0];
        const builtin =
          spec.startsWith('node:') || builtinModules.includes(name);
        if (!builtin && !allowed.has(name)) {
          undeclared.add(`${path.relative(ROOT, file)}: ${spec}`);
        }
      }
    }
    expect([...undeclared]).toEqual([]);
    expect(allowed.has('jose')).toBe(false);
  });

  it('the bundled jose is the jose version installed for the build', () => {
    const bundle = fs.readFileSync(path.join(LIB, 'vendor', 'jose.js'), 'utf8');
    const bundled = /Bundled copy of jose@([^\s(]+)/.exec(bundle)?.[1];
    const installed = JSON.parse(
      fs.readFileSync(require.resolve('jose/package.json'), 'utf8')
    ).version;
    expect(bundled).toBe(installed);
    expect(bundle).toContain('The MIT License (MIT)');
  });

  it('no published declaration file imports jose', () => {
    const offenders = filesUnder(LIB, '.d.ts').filter((file) =>
      /(from\s+|import\(\s*|require\(\s*)["']jose["']/.test(
        fs.readFileSync(file, 'utf8')
      )
    );
    expect(offenders.map((f) => path.relative(ROOT, f))).toEqual([]);
  });

  const requireEsmAlwaysOn =
    !DISABLE_REQUIRE_ESM &&
    (process.features as { require_module?: boolean }).require_module === true;

  it(
    DISABLE_REQUIRE_ESM
      ? `loads every entry point and validates tokens with require(esm) disabled (${DISABLE_REQUIRE_ESM})`
      : requireEsmAlwaysOn
        ? 'loads every entry point and validates tokens (require(esm) cannot be disabled on this Node.js; the checks above guard CommonJS consumers)'
        : 'loads every entry point and validates tokens on a Node.js without require(esm)',
    () => {
      const { status, stdout, stderr } = runNode(LOAD_ENTRY_POINTS);
      expect({ status, stderr }).toEqual({ status: 0, stderr: '' });

      const result = JSON.parse(stdout);
      expect(result).toMatchObject({
        client: 'accepted:user_1',
        clientTampered: 'rejected:ScalekitValidateTokenFailureException',
        edge: 'accepted:user_1',
        edgeTampered: 'rejected:ScalekitEdgeError:401',
      });
      if (DISABLE_REQUIRE_ESM) {
        // The child really ran without require(esm); otherwise this test
        // would pass even if an ES module were still require()d.
        expect(result.requireModule).toBe(false);
      }
    }
  );
});
