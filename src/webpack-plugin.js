import { createFilter } from '@rollup/pluginutils';
import { createRequire } from 'node:module';
import path from 'node:path';

export class Refurbish {
	/**
	 * @param {object} [opts]
	 * @param {string|string[]} [opts.include]     globs to inject into
	 * @param {string|string[]} [opts.exclude]     globs to skip
	 * @param {string}          [opts.importSource='refui/hmr']
	 * @param {boolean}         [opts.enabled]     override production check; default `compiler.options.mode !== 'production'`
	 */
	constructor(opts = {}) {
		const {
			include,
			exclude,
			importSource = 'refui/hmr',
			enabled,
			...loaderOpts
		} = opts;

		this.importSource = importSource;
		this.include = include;
		this.exclude = exclude;
		this.loaderOpts = { importSource, ...loaderOpts };
		this.enabled = enabled;
	}

	apply(compiler) {
		const enabled = this.enabled ?? compiler.options.mode !== 'production';
		if (!enabled) return;

		const require = createRequire(path.join(compiler.context, 'index.js'));
		const importSourcePath = require.resolve(this.importSource)

		this.loaderOpts.importSourcePath = importSourcePath;

		const filter = createFilter(
			this.include || ['**/*.jsx', '**/*.tsx', '**/*.mdx'],
			this.exclude
		);

		const test = (filepath) => {
			if (filepath === importSourcePath) {
				return true;
			}
			return filter(filepath);
		};

		const rule = {
			test,
			use: [
				{
					loader: 'refurbish/hmr-loader',
					options: this.loaderOpts,
				},
			],
		};

		compiler.options.module ??= {};
		compiler.options.module.rules ??= [];
		compiler.options.module.rules.unshift(rule);
	}
}
