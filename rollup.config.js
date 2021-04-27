import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

import pkg from "./package.json";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	input: "src/index.tsx",
	output: [
		{
			file: pkg.main,
			format: "cjs",
			exports: "named",
			sourcemap: true,
			strict: false
		}
	],
	plugins: [
		typescript({ tsconfig: "./tsconfig.json" }),
		copy({
			targets: [
				{ src: "src/example.css", dest: "dist/" }
			]
		})
	],
	external: ["react", "react-dom", "fuse.js"]
};
