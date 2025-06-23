import { createFilter } from '@rollup/pluginutils';

const BEGIN = '/* ---- BEGIN REFUI HMR INJECT ---- */';
const END   = '/* ----  END REFUI HMR INJECT  ---- */';

export default function refuiHmrLoader(source) {
	const { importSource = 'refui/hmr', include, exclude } = this.getOptions?.() || {};
	const filter = createFilter(
		include ?? ['**/*.jsx', '**/*.tsx', '**/*.mdx'],
		exclude
	);

	let code = source.replace(
		/import\.meta\.\s*\/\*\s*@refui\s+webpack\s*\*\/\s*hot/g,
		'import.meta.webpackHot'
	);

	const isProdBuild = this.mode === 'production';
	if (!isProdBuild && filter(this.resourcePath) && !code.includes(BEGIN)) {
		const snippet = `${BEGIN}
if (import.meta.webpackHot) {
	import("${importSource}").then(m => m.setup({
		data: import.meta.webpackHot.data,
		current: import(${JSON.stringify(this.resourcePath)}),
		accept() { import.meta.webpackHot.accept() },
		dispose(cb) { import.meta.webpackHot.dispose(cb) },
		invalidate(reason) { import.meta.webpackHot.decline(reason) }
	}));
}
${END}
`;
		code += `\n\n${snippet}`;
	}

	return code;
}
