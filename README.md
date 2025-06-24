# Refurbish

A Hot Module Replacement (HMR) plugin for [rEFui](https://github.com/SudoMaker/refui) components in Rollup, Vite, Webpack, and Rspack projects.

## Features

- 🔥 Hot Module Replacement for rEFui components
- 🚀 Works with Rollup, Vite, Webpack, and Rspack
- 📦 Zero configuration for most use cases
- 🎯 Supports JSX, TSX, and MDX files by default
- ⚡ Development-only injection (automatically skipped in production builds)

## Installation

```bash
npm install refurbish
# or
pnpm i refurbish
# or
yarn add refurbish
```

**Note:** This plugin requires `refui` as a peer dependency.

```bash
npm install refui
```

## Usage

### Vite

```js
// vite.config.js
import { defineConfig } from 'vite';
import { refurbish } from 'refurbish/vite';

export default defineConfig({
  plugins: [
    refurbish(),
    // ... other plugins
  ],
});
```

### Rollup

```js
// rollup.config.js
import { refurbish } from 'refurbish/rollup';

export default {
  plugins: [
    refurbish(),
    // ... other plugins
  ],
};
```

### Webpack

```js
// webpack.config.js
import Refurbish from 'refurbish/webpack';

export default {
  // ...
  plugins: [
    new Refurbish(),
    // ... other plugins
  ],
};
```

### Rspack

As Rspack is designed to be a drop-in replacement for Webpack, you can use `refurbish/webpack` directly in your Rspack configuration.

```js
// rspack.config.js
import Refurbish from 'refurbish/webpack';

export default {
  // ...
  plugins: [
    new Refurbish(),
    // ... other plugins
  ],
};
```

## Options

The plugin accepts an options object. The options are the same for Vite, Rollup, Webpack, and Rspack.

**Vite / Rollup:**

```js
refurbish({
  // File patterns to include (default: ['**/*.jsx', '**/*.tsx', '**/*.mdx'])
  include: ['**/*.jsx', '**/*.tsx'],

  // File patterns to exclude
  exclude: ['**/node_modules/**'],

  // Import source for HMR setup function (default: 'refui/hmr')
  importSource: 'refui/hmr',

  // Explicitly enable/disable the plugin.
  // Default: enabled in development, disabled in production.
  enabled: true
})
```

**Webpack / Rspack:**

```js
new Refurbish({
  // File patterns to include (default: ['**/*.jsx', '**/*.tsx', '**/*.mdx'])
  include: ['**/*.jsx', '**/*.tsx'],

  // File patterns to exclude
  exclude: ['**/node_modules/**'],

  // Import source for HMR setup function (default: 'refui/hmr')
  importSource: 'refui/hmr',

  // Explicitly enable/disable the plugin.
  // Default: enabled in development, disabled in production.
  enabled: true
})
```

### Options Details

- **`include`** (`string | string[]`): Glob patterns for files to process. Defaults to JSX, TSX, and MDX files.
- **`exclude`** (`string | string[]`): Glob patterns for files to exclude from processing.
- **`importSource`** (`string`): The module path to import the HMR setup function from. Defaults to `'refui/hmr'`.
- **`enabled`** (`boolean`): Explicitly enable or disable the plugin. If not set, the plugin is active only in development environments and is disabled for production builds.

## License

MIT
