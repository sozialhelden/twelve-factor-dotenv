import React from 'react';
// tslint:disable-next-line: no-implicit-dependencies
import renderer from 'react-test-renderer';
import { EnvironmentScriptTag } from '.';

describe('EnvironmentScriptTag', () => {
  it('renders when providing your own env', () => {
    const component = renderer.create(<EnvironmentScriptTag env={{ foo: 'bar' }} />);
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
    // tslint:disable-next-line: variable-name
    expect(() => {
      EnvironmentScriptTag({} as any);
    }).toThrowError(/environment/);
  });
});
