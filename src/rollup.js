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
