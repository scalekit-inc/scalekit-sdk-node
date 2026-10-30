import { describe, it, expect, afterEach, jest } from '@jest/globals';
import path from 'path';

// src/vendor/jose.ts loads `jose` with require() and, only when that fails
// with ERR_REQUIRE_ESM, falls back to the CommonJS bundle written next to the
// compiled loader at build time (lib/vendor/jose.bundle.js).
const loaderPath = '../src/vendor/jose';
const bundlePath = path.resolve(__dirname, '../src/vendor/jose.bundle');

type JoseLoader = typeof import('../src/vendor/jose');

function codedError(message: string, code?: string): Error {
  const error = new Error(message) as NodeJS.ErrnoException;
  if (code !== undefined) error.code = code;
  return error;
}

/** A stand-in for the bundle; the factory counts how often it is loaded. */
function mockBundle() {
  const bundle = {
    createLocalJWKSet: jest.fn(),
    jwtVerify: jest.fn(),
    decodeJwt: jest.fn(),
  };
  const factory = jest.fn(() => bundle);
  jest.doMock(bundlePath, factory, { virtual: true });
  return { bundle, factory };
}

function mockJoseThrowing(thrown: unknown) {
  jest.doMock('jose', () => {
    throw thrown;
  });
}

function loadLoader(): JoseLoader {
  return require(loaderPath) as JoseLoader;
}

function thrownBy(fn: () => unknown): unknown {
  try {
    fn();
  } catch (e) {
    return e;
  }
  throw new Error('expected a throw');
}

afterEach(() => {
  jest.dontMock('jose');
});

describe('vendor/jose loader', () => {
  it('uses the installed jose when require() succeeds and never loads the bundle', () => {
    jest.isolateModules(() => {
      const { factory } = mockBundle();
      const jose = require('jose') as typeof import('jose');
      const loaded = loadLoader();

      expect(loaded.createLocalJWKSet).toBe(jose.createLocalJWKSet);
      expect(loaded.jwtVerify).toBe(jose.jwtVerify);
      expect(loaded.decodeJwt).toBe(jose.decodeJwt);
      expect(factory).not.toHaveBeenCalled();
    });
  });

  it('falls back to the bundle when require("jose") throws ERR_REQUIRE_ESM', () => {
    jest.isolateModules(() => {
      const { bundle, factory } = mockBundle();
      mockJoseThrowing(
        codedError('require() of ES Module not supported', 'ERR_REQUIRE_ESM')
      );
      const loaded = loadLoader();

      expect(factory).toHaveBeenCalledTimes(1);
      expect(loaded.createLocalJWKSet).toBe(bundle.createLocalJWKSet);
      expect(loaded.jwtVerify).toBe(bundle.jwtVerify);
      expect(loaded.decodeJwt).toBe(bundle.decodeJwt);
    });
  });

  it.each([
    [
      'MODULE_NOT_FOUND',
      codedError("Cannot find module 'jose'", 'MODULE_NOT_FOUND'),
    ],
    [
      'ERR_REQUIRE_ASYNC_MODULE',
      codedError('top-level await', 'ERR_REQUIRE_ASYNC_MODULE'),
    ],
    ['a non-object value', 'ERR_REQUIRE_ESM'],
  ])(
    're-throws %s from require("jose") unchanged and does not load the bundle',
    (_label, thrown) => {
      jest.isolateModules(() => {
        const { factory } = mockBundle();
        mockJoseThrowing(thrown);

        expect(thrownBy(loadLoader)).toBe(thrown);
        expect(factory).not.toHaveBeenCalled();
      });
    }
  );

  it('reports ERR_REQUIRE_ESM, with the bundle error as its cause, when the bundle is missing', () => {
    jest.isolateModules(() => {
      const requireEsm = codedError(
        'require() of ES Module not supported',
        'ERR_REQUIRE_ESM'
      );
      const missing = codedError(
        "Cannot find module './jose.bundle'",
        'MODULE_NOT_FOUND'
      );
      mockJoseThrowing(requireEsm);
      jest.doMock(
        bundlePath,
        () => {
          throw missing;
        },
        { virtual: true }
      );

      const thrown = thrownBy(loadLoader) as Error & { cause?: unknown };
      expect(thrown).toBe(requireEsm);
      expect(thrown.cause).toBe(missing);
    });
  });
});
