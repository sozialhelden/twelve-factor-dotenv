import { defaultFilterFunction, FilterFunction } from './defaultFilterFunction';
import { getFilteredClientEnvironment } from './getFilteredClientEnvironment';

// Necessary subset of ExpressJS response properties
interface IResponse {
  setHeader: (header: string, value: string) => any;
  send: (body: string) => any;
}

export function createEnvironmentJSResponseHandler(
  env: { [variableName: string]: string },
  filterFunction: FilterFunction = defaultFilterFunction,
  cacheControlHeaderValue: string | undefined = 'max-age=300'
) {
  return function respondWithBrowserEnvironmentJS(_: any, res: IResponse) {
    const filteredEnvObject = JSON.stringify(getFilteredClientEnvironment(env, filterFunction));
    if (cacheControlHeaderValue) {
      res.setHeader('Cache-Control', cacheControlHeaderValue);
    }
    res.send(`window.env = ${filteredEnvObject};`);
  };
}
