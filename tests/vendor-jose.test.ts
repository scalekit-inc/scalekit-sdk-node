import { describe, it, expect } from '@jest/globals';
import * as installedJose from 'jose';
import { jose, selectJose } from '../src/vendor/jose';

const BUNDLE = { bundled: true };
const INSTALLED = { installed: true };

const failingWith = (error: unknown) => (id: string) => {
  if (id === 'jose') throw error;
  return BUNDLE;
};
const coded = (code: string) =>
  Object.assign(new Error(`require failed (${code})`), { code });

describe('selectJose', () => {
  it('uses the installed jose when require() can load it', () => {
    const loaded: string[] = [];
    const result = selectJose((id) => {
      loaded.push(id);
      return INSTALLED;
    });
    expect(result).toBe(INSTALLED);
    expect(loaded).toEqual(['jose']);
  });

  it.each(['ERR_REQUIRE_ESM', 'ERR_REQUIRE_ASYNC_MODULE'])(
    'falls back to the bundled copy on %s',
    (code) => {
      expect(selectJose(failingWith(coded(code)))).toBe(BUNDLE);
    }
  );

  it.each([
    [
      'MODULE_NOT_FOUND (jose is a declared dependency)',
      coded('MODULE_NOT_FOUND'),
    ],
    ['another error code', coded('ERR_INVALID_PACKAGE_CONFIG')],
    ['an error without a code', new SyntaxError('Unexpected token')],
    ['a thrown non-error', 'boom'],
  ])('rethrows %s instead of falling back', (_, error) => {
    expect(() => selectJose(failingWith(error))).toThrow();
    let thrown: unknown;
    try {
      selectJose(failingWith(error));
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBe(error);
  });

  it('shares the installed jose module with the caller when it loads', () => {
    // Under this test setup require('jose') succeeds, so the SDK must use the
    // same module instance (and error classes) as the caller's import.
    expect(jose).toBe(installedJose);
    expect(jose.errors.JWKSInvalid).toBe(installedJose.errors.JWKSInvalid);
  });
});
