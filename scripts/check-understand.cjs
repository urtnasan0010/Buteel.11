/* eslint-disable @typescript-eslint/no-require-imports -- Shared browser runner. */
require('./check-guide-pages.cjs').checkGuide('understand', 12, 'UNDERSTAND_BASE_URL', 'UNDERSTAND_BROWSER_TOOLS').catch(error => { console.error(error); process.exitCode = 1; });
