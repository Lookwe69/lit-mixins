import { sharePlugins, shareRegexesOfPackages } from './share-config/rollup.js';

export default {
	external: shareRegexesOfPackages(),

	input: ['src/index.ts'],
	output: [
		{
			dir: './',
			format: 'es',
			sourcemap: false,
			preserveModules: true,
		},
	],

	plugins: [
		...sharePlugins({
			typescriptConfig: {
				exclude: ['**/*.test.ts', '**/testing/**/*'],
				compilerOptions: {
					outDir: './',
					sourceMap: false,
					declarationMap: false,
				},
			},
		}),
	],
};
