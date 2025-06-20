# Refurbish

A Hot Module Replacement (HMR) plugin for [rEFui](https://github.com/SudoMaker/refui) components in Rollup and Vite projects.

## Features

- 🔥 Hot Module Replacement for rEFui components
- 🚀 Works with both Rollup and Vite
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
import { refurbish } from 'refurbish';

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
import { refurbish } from 'refurbish';

export default {
  plugins: [
    refurbish(),
    // ... other plugins
  ],
};
```

## Options

The plugin accepts an options object with the following properties:

```js
refurbish({
  // File patterns to include (default: ['**/*.jsx', '**/*.tsx', '**/*.mdx'])
  include: ['**/*.jsx', '**/*.tsx'],
  
  // File patterns to exclude
  exclude: ['**/node_modules/**'],
  
  // Import source for HMR setup function (default: 'refui/hmr')
  importSource: 'refui/hmr'
})
```

### Options Details

- **`include`** (`string | string[]`): Glob patterns for files to process. Defaults to JSX, TSX, and MDX files.
- **`exclude`** (`string | string[]`): Glob patterns for files to exclude from processing.
- **`importSource`** (`string`): The module path to import the HMR setup function from. Defaults to `'refui/hmr'`.

## License

MIT
