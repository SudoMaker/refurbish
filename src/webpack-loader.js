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
