import { defaultFilterFunction, FilterFunction } from './defaultFilterFunction';

// tslint:disable-next-line: no-var-requires
const lodashPick = require('lodash.pick');

export interface IEnvironment {
  [variableName: string]: string | undefined;
}

/**
 * Defines a filtered set of environment variables provided to the client.
 *
 * This enables you to configure your app at runtime, without having to re-compile/deploy the code.
 * It avoids introducing subtle build-system related bugs when changing the configuration, e.g.
 * when debugging problems that arise from a configuration error alone.
 *
 * This is intentionally different from Webpack's and other build tools built-in mechanisms
 * that include hard-coded environment variable values in transpiled production code.
 *
 * https://12factor.net/config explains advantages of this concept.
 */

export function getFilteredClientEnvironment(
  env: IEnvironment,
  filterFunction: FilterFunction = defaultFilterFunction
): IEnvironment {
  return lodashPick(env, Object.keys(env).filter(k => filterFunction(k, env[k])));
}
