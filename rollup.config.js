import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';

import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';


export default {
	entry: 'src/index.js',
	dest: 'dist/bundle.js',
	format: 'iife',
	sourceMap: 'inline',
	plugins: [
		postcss({
			plugins: [
				simplevars(),
				nested(),
				cssnext({ warnForDuplicated: false }),
			],
			extensions: ['.css'],
		}),
		eslint({
			exclude: [
				'src/styles/**'
			]
		}),
		babel({
			exclude: 'node_modules/**',
		}),
		replace({
			exclude: 'node_modules/**',
			ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
		}),
	],
};