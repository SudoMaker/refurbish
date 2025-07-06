const BEGIN = '/* ---- BEGIN REFUI HMR INJECT ---- */';
const END   = '/* ----  END REFUI HMR INJECT  ---- */';

export default function refuiHmrLoader(source) {
	if (source.includes(BEGIN)) return source;

	const { importSource = 'refui/hmr', importSourcePath } =
		this.getOptions?.() || {};

	let code = source.replace(
		/\s*\/\*\s*@refui\s+webpack\s*\*\/\s*import\.meta\.hot/g,
		'import.meta.webpackHot'
	);

	if (this.resourcePath === importSourcePath) {
		return code;
	}

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

	return code;
}
