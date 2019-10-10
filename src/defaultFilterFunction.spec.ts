import { defaultFilterFunction } from '.';

describe('defaultFilterFunction', () => {
  it('allows npm_package_version', () => {
    const result = defaultFilterFunction('npm_package_version', '1.2.3');
    expect(result).toBe(true);
  });

  // This is a default behavior of create-react-app.
  it('allows REACT_APP_FOO_BAR', () => {
    const result = defaultFilterFunction('REACT_APP_FOO_BAR', 'qux');
    expect(result).toBe(true);
  });

  it('disallows npm_something', () => {
    const result = defaultFilterFunction('npm_something', '1.2.3');
    expect(result).toBe(false);
  });

  it('disallows LOCALE', () => {
    const result = defaultFilterFunction('LOCALE', 'de_DE');
    expect(result).toBe(false);
  });
});
