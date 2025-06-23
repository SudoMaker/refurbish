import { fileURLToPath } from 'node:url';

const JS_LIKE_RE = /\.(c?m?[jt]sx?|mdx)$/i; // *.js, *.cjs, *.mjs, *.ts, *.tsx, *.jsx, *.mdx

export default class Refurbish {
	/**
	 * @param {object} [opts]
	 * @param {string|string[]} [opts.include]   globs to inject into (default jsx/tsx/mdx)
	 * @param {string|string[]} [opts.exclude]   globs to skip
	 * @param {string}          [opts.importSource='refui/hmr']
	 */
	constructor(opts = {}) {
		this.opts = {
			include: ['**/*.jsx', '**/*.tsx', '**/*.mdx'],
			importSource: 'refui/hmr',
			...opts
		}
	}

	apply(compiler) {
		const pluginName = 'Refurbish';

		// Resolved path to the loader file (works in ESM)
		const loaderPath = fileURLToPath(
			new URL('./webpack-loader.js', import.meta.url)
		);

		const rule = {
			test: JS_LIKE_RE,
			use: [
				{
					loader: loaderPath,
					options: this.opts,
				},
			],
		};

		compiler.options.module ??= {};
		compiler.options.module.rules ??= [];
		compiler.options.module.rules.unshift(rule);
	}
}
