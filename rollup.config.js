import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json";

export default {
	input: "src/index.tsx",
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
			strict: false
		}
	],
	plugins: [typescript()],
	external: ["react", "react-dom", "fuse.js", "react/jsx-runtime", "temp.css"]
};
