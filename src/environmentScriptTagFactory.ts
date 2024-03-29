import * as React from 'react';
import { IEnvironment } from './getFilteredClientEnvironment';

export default function environmentScriptTagFactory(react: typeof React) {
  return function EnvironmentScriptTag({ env }: { env: IEnvironment }) {
    if (typeof env !== 'object' || env === null) {
      throw new Error(
        'Given environment must be an object that maps environment variable names to string values.',
      );
    }
    const javascriptCode = `window.env = ${JSON.stringify(env)};`;
    return react.createElement('script', {
      dangerouslySetInnerHTML: { __html: javascriptCode },
      type: 'javascript',
    });
  };
}
