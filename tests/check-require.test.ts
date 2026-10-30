import { describe, it, expect } from '@jest/globals';
import { spawnSync } from 'child_process';
import path from 'path';

// Runs scripts/check-require.cjs against the built lib/ in a separate Node.js
// process: once as is, and once with require() of ES modules turned off, which
// makes the SDK load its bundled CommonJS copy of jose (the path that Node.js
// 18, 20 before 20.19, 22 before 22.12 and AWS Lambda take).
const root = path.resolve(__dirname, '..');
const script = path.join(root, 'scripts', 'check-require.cjs');

function run(flags: string[]) {
  return spawnSync(process.execPath, ['--no-warnings', ...flags, script], {
    cwd: root,
    encoding: 'utf8',
    timeout: 60_000,
  });
}

const canDisableRequireEsm = process.allowedNodeEnvironmentFlags.has(
  '--no-experimental-require-module'
);

describe('built lib/ loads with require()', () => {
  it('loads every entry point and validates a token', () => {
    const result = run([]);
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  });

  (canDisableRequireEsm ? it : it.skip)(
    'falls back to the bundled jose when require() of ES modules is disabled',
    () => {
      const result = run(['--no-experimental-require-module']);
      expect(result.stderr).toBe('');
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('uses the bundled jose');
    }
  );
});
