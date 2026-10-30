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

function mockJoseThrowing(error: Error) {
  jest.doMock('jose', () => {
    throw error;
  });
}

function loadLoader(): JoseLoader {
  return require(loaderPath) as JoseLoader;
}

afterEach(() => {
  jest.dontMock('jose');
  jest.dontMock(bundlePath);
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
    ['no code', codedError('jose failed to initialise')],
  ])(
    're-throws a require("jose") error with %s unchanged and does not load the bundle',
    (_label, error) => {
      jest.isolateModules(() => {
        const { factory } = mockBundle();
        mockJoseThrowing(error);

        let thrown: unknown;
        try {
          loadLoader();
        } catch (e) {
          thrown = e;
        }
        expect(thrown).toBe(error);
        expect(factory).not.toHaveBeenCalled();
      });
    }
  );

  it('re-throws a non-object value thrown while loading jose', () => {
    jest.isolateModules(() => {
      const { factory } = mockBundle();
      jest.doMock('jose', () => {
        throw 'ERR_REQUIRE_ESM';
      });

      expect(() => loadLoader()).toThrow('ERR_REQUIRE_ESM');
      expect(factory).not.toHaveBeenCalled();
    });
  });

  it('exposes jose functions that verify a token end to end', async () => {
    const jose = await import('jose');
    const { createLocalJWKSet, jwtVerify, decodeJwt } = loadLoader();
    const { publicKey, privateKey } = await jose.generateKeyPair('RS256', {
      extractable: true,
    });
    const jwk = {
      ...(await jose.exportJWK(publicKey)),
      kid: 'k1',
      alg: 'RS256',
    };
    const token = await new jose.SignJWT({ sub: 'usr_1' })
      .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(privateKey);

    const { payload } = await jwtVerify(
      token,
      createLocalJWKSet({ keys: [jwk] })
    );
    expect(payload.sub).toBe('usr_1');
    expect(decodeJwt(token).sub).toBe('usr_1');
  });
});
