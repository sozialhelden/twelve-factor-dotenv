import React from 'react';
import { IEnvironment } from './getFilteredClientEnvironment';

export function EnvironmentScriptTag({ env }: { env: IEnvironment }) {
  if (typeof env !== 'object' || env === null) {
    throw new Error(
      'Given environment must be an object that maps environment variable names to string values.'
    );
  }
  const javascriptCode = `window.env = ${JSON.stringify(env)};`;
  return <script type="javascript" dangerouslySetInnerHTML={{ __html: javascriptCode }} />;
}
