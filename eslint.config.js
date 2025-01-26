import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['node_modules/*', 'dist/*', '**/*.js', '**/*.cjs'],
	},
	eslint.configs.recommended,
	tseslint.configs.recommended,
	{
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},

		languageOptions: {
			globals: {
				...globals.browser,
			},

			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
			ecmaVersion: 2020,
			sourceType: 'module',
		},

		rules: {
			'no-prototype-builtins': 'off',
			'no-unused-private-class-members': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',

			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
				},
			],
		},
	},
	{
		files: [
			'**/rollup-bundled.config.js',
			'**/rollup-dist.config.js',
			'**/rollup-prepack.config.js',
			'**/web-test-runner.config.js',
			'**/web-dev-server.config.js',
		],

		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.test.ts'],

		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
);
