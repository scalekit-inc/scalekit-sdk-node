// Loads every package entry point through package.json "exports", once with
// require() and once with import, each in a fresh Node process. Run after
// `npm run build`. Fails if an entry point does not load, is missing an export, or
// pulls jose from node_modules at runtime (jose is ESM-only and must be bundled, or
// the CommonJS build breaks wherever require() cannot load ES modules).
//
// The require() checks run with require(esm) turned off when this Node version
// supports that, so they behave like Node versions without require(esm).
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const entryPoints = {
  '@scalekit-sdk/node': [
    'ScalekitClient',
    'Scalekit',
    'ConnectionType',
    'ScalekitServerException',
    'ScalekitNotFoundException',
  ],
  '@scalekit-sdk/node/express': ['ScalekitAuth'],
  '@scalekit-sdk/node/next': ['ScalekitAuthNext'],
  '@scalekit-sdk/node/edge': ['ScalekitEdgeClient', 'ScalekitEdgeError'],
};

const noRequireEsmFlag = (() => {
  const probe = spawnSync(
    process.execPath,
    ['--no-experimental-require-module', '-e', ''],
    { encoding: 'utf8' }
  );
  return probe.status === 0 ? ['--no-experimental-require-module'] : [];
})();

// Runs in the child process and prints a JSON report. `joseFromNodeModules` is only
// meaningful for require(), where require.cache lists every file that was loaded.
const probeSource = (format, specifier) => `
  ${format === 'cjs' ? `const m = require(${JSON.stringify(specifier)});` : `const m = await import(${JSON.stringify(specifier)});`}
  const def = m.default;
  const josePath = ['', 'node_modules', 'jose', ''].join(require('node:path').sep);
  console.log(JSON.stringify({
    exports: Object.keys(m),
    joseFromNodeModules: ${format === 'cjs'} && Object.keys(require.cache).some((f) => f.includes(josePath)),
    defaultShape: def === undefined ? null : {
      type: typeof def,
      dotDefault: typeof def.default,
      ScalekitClient: typeof def.ScalekitClient,
    },
  }));
`;

const failures = [];
const check = (label, condition, detail) => {
  console.log(
    `${condition ? 'ok  ' : 'FAIL'} ${label}${condition ? '' : `: ${detail}`}`
  );
  if (!condition) failures.push(label);
};

for (const [specifier, expected] of Object.entries(entryPoints)) {
  for (const format of ['cjs', 'esm']) {
    const args =
      format === 'cjs'
        ? [...noRequireEsmFlag, '-e', probeSource(format, specifier)]
        : [
            '--input-type=module',
            '-e',
            `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url); ${probeSource(format, specifier)}`,
          ];
    const result = spawnSync(process.execPath, args, {
      cwd: root,
      encoding: 'utf8',
    });
    const label = `${format.toUpperCase()} ${specifier}`;
    if (result.status !== 0) {
      check(
        label,
        false,
        (result.stderr || '').trim().split('\n').slice(0, 3).join(' | ')
      );
      continue;
    }
    const report = JSON.parse(result.stdout.trim().split('\n').pop());
    const missing = expected.filter((name) => !report.exports.includes(name));
    check(
      `${label} exports ${expected.join(', ')}`,
      missing.length === 0,
      `missing ${missing.join(', ')}`
    );
    if (format === 'cjs') {
      check(
        `${label} does not load jose from node_modules`,
        !report.joseFromNodeModules,
        'jose was required at runtime'
      );
    }
    if (specifier === '@scalekit-sdk/node') {
      const shape = report.defaultShape;
      check(
        `${label} default export is the client class, with .default and named exports on it`,
        shape &&
          shape.type === 'function' &&
          shape.dotDefault === 'function' &&
          shape.ScalekitClient === 'function',
        JSON.stringify(shape)
      );
    }
  }
}

console.log(
  `\nNode ${process.version}${noRequireEsmFlag.length ? ', require(esm) off for CJS' : ''}`
);
if (failures.length > 0) {
  console.error(`${failures.length} check(s) failed`);
  process.exit(1);
}
