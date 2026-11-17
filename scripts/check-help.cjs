/* eslint-disable @typescript-eslint/no-require-imports -- Shared browser runner. */
require('./check-guide-pages.cjs').checkGuide('help', 12, 'PUBLIC_BASE_URL', 'PUBLIC_BROWSER_TOOLS').catch(error => { console.error(error); process.exitCode = 1; });
