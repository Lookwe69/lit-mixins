import { playwrightLauncher } from '@web/test-runner-playwright';

import { sharePlugins } from './share-config/web-dev.js';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
	throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

const browsers = {
	// Local browser testing via playwright
	// ===========
	chromium: playwrightLauncher({ product: 'chromium' }),
	// firefox: playwrightLauncher({ product: 'firefox' }),
	webkit: playwrightLauncher({ product: 'webkit' }),
};

const noBrowser = (b) => {
	throw new Error(`No browser configured named '${b}'; using defaults`);
};
let commandLineBrowsers;
try {
	commandLineBrowsers = process.env.BROWSERS?.split(',').map((b) => browsers[b] ?? noBrowser(b));
} catch (e) {
	console.warn(e);
}

const filteredLogs = ['Lit is in dev mode'];

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
	rootDir: '.',
	files: ['./dist/**/*.test.js'],
	coverageConfig: {
		include: ['./dist/**/*.js'],
		exclude: ['**/*.styles.scss.js', '**/testing/**/*'],
		reporters: ['lcov', 'cobertura'],
		// threshold: {
		// 	statements: 70,
		// 	branches: 70,
		// 	functions: 70,
		// 	lines: 70,
		// },
	},
	nodeResolve: { exportConditions: mode === 'dev' ? ['development'] : [] },

	filterBrowserLogs(log) {
		for (const arg of log.args) {
			if (typeof arg === 'string' && filteredLogs.some((l) => arg.includes(l))) {
				return false;
			}
		}
		return true;
	},

	preserveSymlinks: true,

	/**
	 * Amount of browsers to run concurrently.
	 */
	concurrentBrowsers: 2,

	/**
	 * Amount of test files per browser to test concurrently.
	 */
	concurrency: 2,

	browsers: commandLineBrowsers ?? Object.values(browsers),
	testFramework: {
		// https://mochajs.org/api/mocha
		config: {
			ui: 'bdd',
			timeout: 60000,
			retries: 2,
		},
	},
	testRunnerHtml: (testRunnerImport) => `
		<html lang="en-US">
			<head>
				<script type="module" src="${testRunnerImport}"></script>
			</head>
			<body></body>
		</html>
	`,
	plugins: [...sharePlugins()],
};
