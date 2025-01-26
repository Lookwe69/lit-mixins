import multiInput from 'rollup-plugin-multi-input';

import { sharePlugins, shareRegexesOfPackages } from './share-config/rollup.js';

export default {
	external: shareRegexesOfPackages({ includeDevDep: true }),

	input: ['src/**/*.test.ts', 'src/index.ts'],
	output: [
		{
			dir: 'dist',
			format: 'es',
			sourcemap: true,
			preserveModules: true,
		},
	],

	plugins: [
		multiInput(),
		...sharePlugins({
			typescriptConfig: {
				compilerOptions: {
					outDir: 'dist',
				},
			},
		}),
	],
};
