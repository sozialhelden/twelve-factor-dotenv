/**
 * For this to work, your HTML must contain JavaScript code that sets `window.env` using the
 * server's configured environment before this function is called.
 */
function getDefaultBrowserEnvironment() {
  if (typeof window === 'undefined') {
    throw new Error('This code should only be called in a browser environment.');
  }

  const result = (window as any).env;

  if (!result) {
    throw new Error(
      'Expected a `window.env` object, but none was set. Please inject a `window.env` object with environment variables for configuration before the app code is entered.'
    );
  }

  return result;
}

/**
 * Adds each line of a local `.env` file to `process.env` if it doesn't exist there already.
 *
 * @returns Process environment as object
 * @seealso https://www.npmjs.com/package/dotenv
 */
// tslint:disable-next-line: no-console
function getDefaultServerEnvironment(log = console.log) {
  if (typeof window !== 'undefined') {
    throw new Error('This code should only be called in a server-side environment.');
  }

  try {
    // tslint:disable-next-line: no-var-requires
    require('dotenv').config();
    log(
      'Using environment variables from .env file, overridden by system-provided environment variables.'
    );
  } catch (e) {
    log('Could not read .env file. Using only system-provided environment variables.');
  }

  return process.env;
}

const defaultOptions = {
  getBrowserEnvironment: getDefaultBrowserEnvironment,
  // tslint:disable-next-line: no-console
  log: console.log,
};

let globalInitializationCount = 0;
function logAndWarnAboutInitializationCount(
  log: (message?: any, ...optionalParams: any[]) => void
) {
  globalInitializationCount += 1;
  if (globalInitializationCount > 1) {
    log(
      `Warning: \`loadGlobalEnvironment()\` was called more than once (${globalInitializationCount} times). This could be an error - it should be called once on app start, and its return value should be cached and reused.`
    );
  }
}

/** Can be called by tests to check if the library warns about multiple initializations. */
export function resetInitializationCount() {
  globalInitializationCount = 0;
}

/*
 * Provides an isometric way to get environment variables in browser and server-side environment.
 *
 * Allows you to configure the app at runtime, without having to rebuild/deploy.
 *
 * To change the app's configuration, we only need to change the container's environment.
 *
 * This divides compilation and configuration, so we can run the same compiled code against
 * different configurations without accidentally introducing new bugs in the build process.
 * Besides saving time, this simplifies bug reproduction for bugs that are caused by a configuration
 * errors.
 *
 * https://12factor.net/config explains advantages of this concept.
 *
 * You should save this function's result and re-use it as it reads an existing .env file
 * on each call otherwise, which might be slow.
 */

export function loadGlobalEnvironment(
  options: {
    log?: (message?: any, ...optionalParams: any[]) => void;
    getBrowserEnvironment?: () => { [variableName: string]: string };
  } = {}
) {
  const opts = { ...defaultOptions, ...options };
  let env;

  const isServer = typeof window === 'undefined';
  if (isServer) {
    logAndWarnAboutInitializationCount(opts.log);
    env = getDefaultServerEnvironment(opts.log);
  } else {
    // We are in a browser
    env = opts.getBrowserEnvironment();
    if (!env) {
      throw new Error(
        'Please provide a `getBrowserEnvironment()` function that returns a valid object.'
      );
    }
  }
  return { ...env };
}
