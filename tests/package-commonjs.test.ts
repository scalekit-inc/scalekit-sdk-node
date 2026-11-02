// The package is compiled to CommonJS. It loads the installed `jose` (ES
// modules only) where require() can load ES modules, and otherwise a bundled
// copy (lib/vendor/jose-bundle.js); see src/vendor/jose.ts. These tests check
// the built lib/ (run `npm run build` first) in child Node.js processes, with
// require(esm) on and off.
import { describe, it, expect } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { builtinModules } from 'node:module';
import path from 'node:path';
import { JOSE_EXPORTS } from '../src/vendor/jose-exports';

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

function runNode(
  script: string,
  { requireEsm }: { requireEsm: boolean }
): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const env = { ...process.env };
  delete env.NODE_OPTIONS;
  const args = [
    ...(!requireEsm && DISABLE_REQUIRE_ESM ? [DISABLE_REQUIRE_ESM] : []),
    '-e',
  ];
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
// both clients: ScalekitClient with local keys, ScalekitEdgeClient against
// local JWKS endpoints over real HTTP (one valid, one malformed). Reports
// which jose the SDK loaded and whether a rethrown jose error is an instance
// of the caller's jose error class. Tokens are signed with node:crypto
// because jose itself cannot be require()d when require(esm) is off.
const SCENARIO = `
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
const sdkJose = require('./lib/vendor/jose.js').jose;
let callerJose = null;
try { callerJose = require('jose'); } catch (e) { if (e.code !== 'ERR_REQUIRE_ESM') throw e; }
const bundle = require('./lib/vendor/jose-bundle.js');
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };
const b64 = (s) => Buffer.from(s).toString('base64url');
const token = b64(JSON.stringify({ alg: 'RS256', kid: 'k1' })) + '.' +
  b64(JSON.stringify({ sub: 'user_1', exp: Math.floor(Date.now() / 1000) + 300 }));
const jwt = token + '.' + crypto.sign('sha256', Buffer.from(token), privateKey).toString('base64url');
const outcome = (p) => p.then(
  (v) => 'accepted:' + v.sub,
  (e) => 'rejected:' + e.constructor.name + (e.statusCode ? ':' + e.statusCode : ''),
);
const serve = async (body) => {
  const server = http.createServer((req, res) => res.end(body));
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return server;
};
(async () => {
  const client = new sdk.ScalekitClient('https://example.invalid', 'id', 'secret');
  client.coreClient.keys = [jwk];
  const good = await serve(JSON.stringify({ keys: [jwk] }));
  const bad = await serve(JSON.stringify({ not: 'a jwks' }));
  const edge = new ScalekitEdgeClient('http://127.0.0.1:' + good.address().port, 'id', 'secret');
  const edgeBad = new ScalekitEdgeClient('http://127.0.0.1:' + bad.address().port, 'id', 'secret');
  const jwksError = await edgeBad.validateToken(jwt).then(() => null, (e) => e);
  const result = {
    requireModule: process.features.require_module ?? null,
    jose: sdkJose === bundle ? 'bundled' : callerJose && sdkJose === callerJose ? 'installed' : 'other',
    client: await outcome(client.validateToken(jwt)),
    clientTampered: await outcome(client.validateToken(jwt + '=')),
    edge: await outcome(edge.validateToken(jwt)),
    edgeTampered: await outcome(edge.validateToken(jwt + '=')),
    jwksErrorCode: jwksError && jwksError.code,
    jwksErrorIsCallerClass: !!callerJose && jwksError instanceof callerJose.errors.JWKSInvalid,
    jwksErrorIsBundleClass: jwksError instanceof bundle.errors.JWKSInvalid,
  };
  good.close();
  bad.close();
  process.stdout.write(JSON.stringify(result));
})().catch((err) => { console.error(err); process.exit(1); });
`;

const VALIDATION = {
  client: 'accepted:user_1',
  clientTampered: 'rejected:ScalekitValidateTokenFailureException',
  edge: 'accepted:user_1',
  edgeTampered: 'rejected:ScalekitEdgeError:401',
  jwksErrorCode: 'ERR_JWKS_INVALID',
};

const JOSE_REQUIRE = /require\(["']jose["']\)/;

describe('CommonJS consumers', () => {
  it('every runtime dependency but jose resolves to a CommonJS file under require()', () => {
    const { status, stdout, stderr } = runNode(RESOLVE_DEPENDENCIES, {
      requireEsm: false,
    });
    expect({ status, stderr }).toEqual({ status: 0, stderr: '' });

    const resolved: Array<{ name: string; file: string; format: string }> =
      JSON.parse(stdout);
    expect(resolved.map((d) => d.name)).toContain('jose');
    // jose ships only ES modules; lib/vendor/jose.js falls back to the
    // bundled copy where require() cannot load it.
    expect(
      resolved.filter((d) => d.name !== 'jose' && d.format !== 'commonjs')
    ).toEqual([]);
  });

  it('lib/ requires only declared dependencies and built-ins, and jose only from lib/vendor/jose.js', () => {
    const allowed = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ]);
    const undeclared = new Set<string>();
    const joseRequirers: string[] = [];
    for (const file of filesUnder(LIB, '.js')) {
      const source = fs.readFileSync(file, 'utf8');
      if (JOSE_REQUIRE.test(source))
        joseRequirers.push(path.relative(LIB, file));
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
    expect(joseRequirers).toEqual([path.join('vendor', 'jose.js')]);
  });

  it('the bundled jose is the installed jose version, with exactly the exports the SDK uses', () => {
    const file = path.join(LIB, 'vendor', 'jose-bundle.js');
    const source = fs.readFileSync(file, 'utf8');
    const bundled = /Bundled copy of jose@([^\s(]+)/.exec(source)?.[1];
    const installed = JSON.parse(
      fs.readFileSync(require.resolve('jose/package.json'), 'utf8')
    ).version;
    expect(bundled).toBe(installed);
    expect(source).toContain('The MIT License (MIT)');
    expect(JOSE_REQUIRE.test(source)).toBe(false);
    expect(Object.keys(require(file)).sort()).toEqual([...JOSE_EXPORTS].sort());
  });

  it('no published declaration file references jose or the jose loader', () => {
    const offenders = filesUnder(LIB, '.d.ts').filter((file) =>
      /(from\s+|import\(\s*|require\(\s*|import\s+)["'](jose|[./]+(vendor\/)?jose)["']/.test(
        fs.readFileSync(file, 'utf8')
      )
    );
    expect(offenders.map((f) => path.relative(ROOT, f))).toEqual([]);
    expect(fs.existsSync(path.join(LIB, 'vendor', 'jose.d.ts'))).toBe(false);
  });

  // Asked of a child process: Jest's sandboxed `process` does not expose
  // `process.features.require_module`.
  const requireEsmByDefault =
    spawnSync(
      process.execPath,
      ['-p', 'process.features.require_module === true'],
      { encoding: 'utf8' }
    ).stdout.trim() === 'true';

  (requireEsmByDefault ? it : it.skip)(
    'with require(esm): uses the installed jose, so callers share its error classes',
    () => {
      const { status, stdout, stderr } = runNode(SCENARIO, {
        requireEsm: true,
      });
      expect({ status, stderr }).toEqual({ status: 0, stderr: '' });
      expect(JSON.parse(stdout)).toEqual({
        ...VALIDATION,
        requireModule: true,
        jose: 'installed',
        jwksErrorIsCallerClass: true,
        jwksErrorIsBundleClass: false,
      });
    }
  );

  const requireEsmAlwaysOn = requireEsmByDefault && !DISABLE_REQUIRE_ESM;

  (requireEsmAlwaysOn ? it.skip : it)(
    DISABLE_REQUIRE_ESM
      ? `without require(esm) (${DISABLE_REQUIRE_ESM}): loads every entry point on the bundled jose and validates tokens`
      : 'without require(esm): loads every entry point on the bundled jose and validates tokens',
    () => {
      const { status, stdout, stderr } = runNode(SCENARIO, {
        requireEsm: false,
      });
      expect({ status, stderr }).toEqual({ status: 0, stderr: '' });
      const result = JSON.parse(stdout);
      expect(result).toEqual({
        ...VALIDATION,
        requireModule: result.requireModule === null ? null : false,
        jose: 'bundled',
        jwksErrorIsCallerClass: false,
        jwksErrorIsBundleClass: true,
      });
    }
  );
});
