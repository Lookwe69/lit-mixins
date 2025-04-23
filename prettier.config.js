/**
 * @type {import('prettier').Options}
 */
const prettierConfig = {
	/* https://github.com/prettier/prettier/issues/12807 */
	plugins: ['@homer0/prettier-plugin-jsdoc', '@ianvs/prettier-plugin-sort-imports'],
	semi: true,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	tabWidth: 4,
	printWidth: 120,
	quoteProps: 'preserve',

	/* prettier-plugin-sort-imports */
	importOrder: ['^lit', '', '<THIRD_PARTY_MODULES>', '', '^[./]'],
	importOrderParserPlugins: ['typescript', 'decorators', 'decoratorAutoAccessors', 'importAttributes'],
	importOrderTypeScriptVersion: '5.8.3',

	/* prettier-plugin-jsdoc */
	jsdocExperimentalFormatCommentsWithoutTags: true,
	jsdocIndentFormattedExamples: false,
};

export default prettierConfig;
