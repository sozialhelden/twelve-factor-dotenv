# [12-factor](https://12factor.net) dotenv support for SSR web apps

[![Greenkeeper badge](https://badges.greenkeeper.io/sozialhelden/twelve-factor-dotenv.svg)](https://greenkeeper.io/)

- Use environment variables to configure server and client-side code in one central place
- Supports [an `.env` file](https://www.npmjs.com/package/dotenv) if existing
- Isometric access to environment variables in browser and server-side code
- Customize which variables the server shares with the client to hide secret tokens
- Don't recompile when environment configuration changes to make your app conform to the [
  twelve-factor model](https://12factor.net/config) which requires that configuration and build are
  separated
- Debug different configurations without potentially introducing new bugs in the build process
- Supports TypeScript
- Optional support for Express.js and React SSR

## Installation

```bash
npm install --save @sozialhelden/twelve-factor-dotenv
#or
yarn add @sozialhelden/twelve-factor-dotenv
```

## Usage

### 1. Add a `env.ts` file to your application

```typescript
const { loadGlobalEnvironment } = require('@sozialhelden/twelve-factor-dotenv');
const env = loadGlobalEnvironment();
module.exports = env;
```

### 2. Import the file before any other code on the server

```typescript
const env = require('./env');

// more application code here
```

### 3. Setup client access to a filtered subset of the environment variables

Now you have a working environment configuration on the server—code (e.g. with `env.CONFIG_VALUE`).

What's missing is that browser-executed code needs access to the variables too. Here are two ways to
achieve this:

#### Method 1: Static HTML with a JavaScript served from an extra endpoint

You can request a JavaScript file from your server (e.g. via Express.js) that adds the configuration
as global variable to `window`.

Advantages:

- You can change the configuration without clients having to reload the whole app code
- Environment variable values never appear in rendered or cached HTML or JS app code, they 'live'
  externally

Disadvantages:

- If you cache the configuration, it can get out of sync with the app code. If you don't cache it,
  it can cause a slower page load.
- The browser must load the script synchronously before any other code runs.

Server side (using [Express.js](https://expressjs.com)):

```typescript
const env = require('../lib/env');
const { createBrowserEnvironmentJSResponseHandler } = require('@sozialhelden/twelve-factor-dotenv');

const server = express();

// Provides access to a filtered set of environment variables on the client.
// Read https://github.com/sozialhelden/twelve-factor-dotenv for more infos.
server.get('/clientEnv.js', createBrowserEnvironmentJSResponseHandler(env));
```

If you don't use Express.js, you can provide your own response handler:

```typescript
const { getFilteredClientEnvironment } = require('@sozialhelden/twelve-factor-dotenv');

// Provides access to a filtered set of environment variables on the client.
// Read https://github.com/sozialhelden/twelve-factor-dotenv for more infos.
app.route('/clientEnv.js', (req, res) => {
  const filteredEnvObject = JSON.stringify(getFilteredClientEnvironment(env, filterFunction));
  res.setHeader('Cache-Control', 'max-age=300');
  res.send(`window.env = ${filteredEnvObject};`);
});
```

Client side:

```html
<!-- Add code to your index.html's <head> -->
<head>
  <!-- ...more code... -->
  <script src="/clientEnv.js"></script>
</head>
```

#### Method 2: Server-side rendering your environment variables into your HTML with React.js

To load the environment in the browser, you can also render the `<script>` tag including its content
with SSR, for example like this:

```jsx
import * as React from 'react';
import env from './env';
import { environmentScriptTagFactory } from '@sozialhelden/twelve-factor-dotenv';
const EnvironmentScriptTag = environmentScriptTagFactory(React);

function Head() {
  return (
    <head>
      <title>A website!</title>
      <EnvironmentScriptTag env={env} />
    </head>
  );
}
```

Now, code running in your browser will have access to some of the environment variables.

The following variables will be accessible to clients:

- all server process environment variables prefixed with `REACT_APP_` (mimicking the default
  behavior of [create-react-app](https://github.com/facebook/create-react-app))
- `npm_package_version` (Tip: version your app with the `version` field in `package.json` and show
  this in your UI!)

For security reasons, the library exposes no other process environment variables, as they might
contain secret tokens or expose server-side vulnerabilities.

## Contributors

- [@opyh](https://github.com/opyh)

Supported by

[<img alt="Sozialhelden e.V." src='./doc/sozialhelden-logo.svg' width="200" style="vertical-align: middle;">](https://sozialhelden.de)
