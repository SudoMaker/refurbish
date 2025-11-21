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

const hmrInject = (source, path) => {
	return `${source}

${BEGIN}
if (import.meta.hot) {
	import("refui/hmr").then(m => m.setup({
		data: import.meta.hot.data,
		current: import(${JSON.stringify(path)}),
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
}

const plugin = {
	name: "refurbish",
	setup({ onLoad }) {
		onLoad({ filter: /\.(js|ts)x$/ }, async args => {
			const raw = await Bun.file(args.path).text();

			return {
				contents: hmrInject(raw, args.path)
			};
		});
	},
}

export default plugin
