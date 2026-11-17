/* eslint-disable @typescript-eslint/no-require-imports -- Shared browser runner. */
require('./check-guide-pages.cjs').checkGuide('rights', 11, 'RIGHTS_BASE_URL', 'RIGHTS_BROWSER_TOOLS').catch(error => { console.error(error); process.exitCode = 1; });
