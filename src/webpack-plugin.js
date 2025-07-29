/* Copyright Yukino Song
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
