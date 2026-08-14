import { describe, it, expect } from '@jest/globals';
import {
  generateState,
  verifyState,
  sanitizeReturnTo,
} from '../src/middleware/csrfState';

describe('generateState / verifyState', () => {
  it('verifies a matching state', () => {
    const state = generateState();
    expect(verifyState(state, state)).toBe(true);
  });

  it('rejects a mismatched state', () => {
    expect(verifyState(generateState(), generateState())).toBe(false);
  });

  it('rejects when either side is missing', () => {
    const state = generateState();
    expect(verifyState(undefined, state)).toBe(false);
    expect(verifyState(state, undefined)).toBe(false);
    expect(verifyState(undefined, undefined)).toBe(false);
  });
});

describe('sanitizeReturnTo', () => {
  it('accepts a same-origin relative path', () => {
    expect(sanitizeReturnTo('/account')).toBe('/account');
    expect(sanitizeReturnTo('/account?tab=billing')).toBe(
      '/account?tab=billing'
    );
  });

  it('rejects an absolute URL', () => {
    expect(sanitizeReturnTo('https://evil.com')).toBeUndefined();
  });

  it('rejects a protocol-relative URL', () => {
    expect(sanitizeReturnTo('//evil.com')).toBeUndefined();
  });

  it('rejects a backslash variant browsers may normalize to protocol-relative', () => {
    expect(sanitizeReturnTo('/\\evil.com')).toBeUndefined();
  });

  it('rejects a value not starting with a slash', () => {
    expect(sanitizeReturnTo('account')).toBeUndefined();
  });

  it('returns undefined for missing input', () => {
    expect(sanitizeReturnTo(undefined)).toBeUndefined();
    expect(sanitizeReturnTo(null)).toBeUndefined();
    expect(sanitizeReturnTo('')).toBeUndefined();
  });
});
