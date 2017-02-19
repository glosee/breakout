import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';

export default {
	entry: 'src/index.js',
	dest: 'dist/bundle.js',
	format: 'iife',
	sourceMap: 'inline',
	plugins: [
		babel({
			exclude: 'node_modules/**',
		}),
		eslint({
			exclude: [
				'src/styles/**'
			]
		})
	],
}