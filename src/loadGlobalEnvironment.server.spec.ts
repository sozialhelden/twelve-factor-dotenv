/**
 * @jest-environment node
 */

import { loadGlobalEnvironment } from '.';

describe('loadGlobalEnvironment server-side behavior', () => {
  it('logs and complains if called more than once', () => {
    const logMessages: any[] = [];
    const log = (msg: string) => logMessages.push(msg);
    loadGlobalEnvironment({ log });
    expect(logMessages).toEqual([
      'Using environment variables from .env file, overridden by system-provided environment variables.',
    ]);
    loadGlobalEnvironment({ log });
    expect(logMessages).toEqual([
      'Using environment variables from .env file, overridden by system-provided environment variables.',
      'Warning: `loadGlobalEnvironment()` was called more than once (2 times). This could be an error - it should be called once on app start, and its return value should be cached and reused.',
      'Using environment variables from .env file, overridden by system-provided environment variables.',
    ]);
  });

  it('returns `process.env`', () => {
    expect(process.env).toMatchObject({});
    const env = loadGlobalEnvironment();
    expect(env).toEqual(process.env);
    // The object must be a copy, not a reference
    expect(env).not.toBe(process.env);
  });

  it('loads `.env` file content', () => {
    expect(process.env).toMatchObject({});
    const env = loadGlobalEnvironment();
    expect(env).toMatchObject({
      REACT_APP_TEST_VARIABLE: 'some value',
      TWELVE_FACTOR_DOTENV_FOO: 'bar',
    });
  });
});
