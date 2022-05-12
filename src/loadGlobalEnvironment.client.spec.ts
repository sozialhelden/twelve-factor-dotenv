/**
 * @jest-environment jsdom
 */

import { loadGlobalEnvironment } from '.';
import { resetInitializationCount } from './loadGlobalEnvironment';

describe('loadGlobalEnvironment client-side behavior', () => {
  beforeEach(() => {
    resetInitializationCount();
  });

  it('throws if window.env is not defined', () => {
    expect(() => loadGlobalEnvironment()).toThrowError(/Expected a `window.env` object/);
  });

  it('returns a copy of `window.env`', () => {
    const testEnv = { foo: 'bar' };
    (window as any).env = testEnv;
    const env = loadGlobalEnvironment();
    expect(env).toEqual(testEnv);
    // The object must be a copy, not a reference
    expect(env).not.toBe(testEnv);
  });
});
