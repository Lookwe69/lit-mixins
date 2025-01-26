import rollupReplace from '@rollup/plugin-replace';
import { fromRollup } from '@web/dev-server-rollup';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
	throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

const replace = fromRollup(rollupReplace);

export function sharePlugins() {
	return [
		replace({
			preventAssignment: true,
			// setting "include" is important for performance
			include: ['node_modules/**/*'],
			'process.env.NODE_ENV': mode === 'dev' ? '"development"' : '"production"',
		}),
	];
}
