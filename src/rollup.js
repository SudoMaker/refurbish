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

const BEGIN = '/* ---- BEGIN REFUI HMR INJECT ---- */';
const END   = '/* ----  END REFUI HMR INJECT  ---- */';

/**
 * @param {object} [options]
 * @param {string|string[]} [options.include]  - picomatch/glob(s) to include (default: jsx,tsx,mdx)
 * @param {string|string[]} [options.exclude]  - patterns to exclude
 * @param {string}          [options.importSource='refui/hmr'] - where to import {setup} from
 * @param {boolean}         [options.enabled]     override production check; default `compiler.options.mode !== 'production'`
 * @returns {import('rollup').Plugin}
 */
export function refurbish(options = {}) {
	const {
		include = ['**/*.jsx', '**/*.tsx', '**/*.mdx'],
		exclude,
		importSource = 'refui/hmr'
	} = options;

	const filter = createFilter(include, exclude);

	const enabled = options.enabled ?? process.env.NODE_ENV !== 'production';
	if (!enabled) return;

	// pre–serve only for Vite; for plain Rollup we check `command`
	const apply = 'serve';       // Vite hint
	let isBuild = false;         // Rollup flag

	const snippet =
`${BEGIN}
if (import.meta.hot) {
	import("${importSource}").then(({setup}) => setup({
		data: import.meta.hot.data,
		current: import(/* @vite-ignore */import.meta.url),
		accept() { import.meta.hot.accept() },
		dispose(cb) {	import.meta.hot.dispose(cb)	},
		invalidate(reason) {
			if (import.meta.hot.invalidate) {
				import.meta.hot.invalidate(reason)
			} else {
				location.reload()
			}
		}
	}))
}
${END}
`;

	return {
		name: 'refurbish',
		apply,

		// Rollup-only: record whether we are running a production build
		buildStart(_, inputOptions) {
			// inputOptions is undefined in Vite; OK
			if (inputOptions) {
				// rollup passes `{command: 'build'|'serve'}`
				// @ts-expect-error
				isBuild = (this.meta.watchMode === false); // equals "rollup -c" build
			}
		},

		transform(code, id) {
			if (!filter(id)) return null;          // wrong file type
			if (isBuild) return null;              // production build – skip
			if (code.includes(BEGIN)) return null; // already injected

			return {
				code: `${code}\n\n${snippet}`,
				map: null
			};
		}
	};
}
