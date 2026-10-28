import { defineConfig } from 'tsdown';

// Builds lib/ as CommonJS (.cjs) and ES modules (.mjs) with matching type
// declarations; package.json "exports" points `require` and `import` at each.
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    edge: 'src/edge.ts',
    'frameworks/express': 'src/frameworks/express.ts',
    'frameworks/nextjs': 'src/frameworks/nextjs.ts',
  },
  format: ['cjs', 'esm'],
  platform: 'node',
  target: 'node20',
  outDir: 'lib',
  clean: true,
  dts: true,
  sourcemap: true,
  // lib/ is committed and CI checks it is up to date, so file names must not
  // change from build to build.
  hash: false,
  deps: {
    // jose is ESM-only: bundle it so the CommonJS build never require()s an ES module.
    alwaysBundle: ['jose'],
    // Optional peer dependencies, resolved from the application.
    neverBundle: ['express', /^next(\/.*)?$/],
  },
  // CommonJS output keeps the shape the tsc build had: `__esModule`, named
  // exports and `exports.default`.
  outputOptions: { esModule: true, exports: 'named' },
});
