import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { environmentScriptTagFactory } from '.';

const EnvironmentScriptTag = environmentScriptTagFactory(React);

describe('EnvironmentScriptTag', () => {
  it('renders when providing your own env', () => {
    const component = renderer.create(
      React.createElement(EnvironmentScriptTag, { env: { foo: 'bar' } })
    );
    const tree = component.toJSON();
    expect(tree).toEqual({
      children: null,
      props: {
        dangerouslySetInnerHTML: { __html: 'window.env = {"foo":"bar"};' },
        type: 'javascript',
      },
      type: 'script',
    });
  });

  it('throws when providing no env', () => {
    expect(() => {
      EnvironmentScriptTag({} as any);
    }).toThrowError(/environment/);
  });
});
