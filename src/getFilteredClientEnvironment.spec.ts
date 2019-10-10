import { getFilteredClientEnvironment } from '.';

describe('getFilteredClientEnvironment', () => {
  describe('when given no filter function', () => {
    it('filters', () => {
      const env = {
        LOCALE: 'de_DE',
        REACT_APP_FOO_BAR: 'qux',
        npm_package_version: '1.2.3',
        npm_something: 'xyz',
      };
      const result = getFilteredClientEnvironment(env);
      expect(result).toEqual({ REACT_APP_FOO_BAR: 'qux', npm_package_version: '1.2.3' });
    });
  });

  describe('when given a custom filter function', () => {
    it('works when given a filter function', () => {
      const filterFunction = (k: string, v: string | undefined) =>
        k !== 'A_SECRET_KEY' && v !== 'a secret value';

      const env = {
        A_SECRET_KEY: 'foo',
        FOO: 'bar',
        SOMETHING: 'a secret value',
      };

      const result = getFilteredClientEnvironment(env, filterFunction);
      expect(result).toEqual({ FOO: 'bar' });
    });
  });
});
