/* eslint-disable @typescript-eslint/no-require-imports -- Local browser regression runner. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const browserRequire = process.env.PUBLIC_BROWSER_TOOLS ? createRequire(path.join(process.env.PUBLIC_BROWSER_TOOLS, 'package.json')) : require;
const { chromium } = browserRequire('playwright');
const { default: AxeBuilder } = browserRequire('@axe-core/playwright');
const base = process.env.PUBLIC_BASE_URL || 'http://127.0.0.1:3216';
(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  fs.mkdirSync('artifacts/help', { recursive: true });
  try {
    for (const lang of ['mn']) for (const width of [320, 375, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(`${base}/help?lang=${lang}`);
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      assert.equal(await page.locator('main h1').count(), 1);
      assert.equal(await page.locator('.understand-card').count(), 12);
      await page.screenshot({ path: `artifacts/help/${lang}-${width}-index.png` });
      await page.locator('#help-search').focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'help-need');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.type), 'submit');
      const summaries = page.locator('.understand-card summary');
      for (let i = 0; i < 12; i++) {
        const summary = summaries.nth(i);
        await summary.focus();
        assert.notEqual(await summary.evaluate(el => getComputedStyle(el).outlineStyle), 'none');
        await page.keyboard.press(i % 2 ? 'Space' : 'Enter');
        assert.ok(await summary.evaluate(el => el.parentElement.open));
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(scan.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })), []);
      assert.equal(await page.locator('#help-epilepsy a[href="tel:103"]').count(), 1);
      const rightsLinks = await page.locator('.understand-card a[href^="/rights"]').evaluateAll(links => links.map(link => link.getAttribute('href')));
      await page.screenshot({ path: `artifacts/help/${lang}-${width}.png` });
      await page.goto(`${base}/rights?lang=${lang}`);
      for (const href of rightsLinks) assert.equal(await page.locator(`#${href.split('#')[1]}`).count(), 1, href);
      for (const need of ['communication', 'mobility', 'reading', 'sensory', 'rest', 'emergency']) {
        await page.goto(`${base}/help?lang=${lang}&need=${need}`);
        assert.ok(await page.locator('.understand-card').count() > 0);
        if (need === 'emergency') assert.equal(await page.locator('.understand-card').count(), 1);
      }
      await page.locator('#help-search').fill('ADHD');
      await page.locator('#help-need').selectOption('reading');
      await Promise.all([page.waitForURL(/q=ADHD/), page.locator('.help-filters button').click()]);
      assert.equal(await page.locator('.understand-card').count(), 1);
      assert.equal(await page.locator('#help-learning').count(), 1);
      await page.goto(`${base}/help?lang=${lang}&q=zzznomatch`);
      assert.equal(await page.locator('.understand-card').count(), 0);
      await page.locator('.help-filters a').click();
      assert.equal(await page.locator('.understand-card').count(), 12);
      if (width === 1440) {
        await page.emulateMedia({ media: 'print' });
        assert.ok(await page.locator('#help-dementia .understand-detail-content').isVisible());
        await page.pdf({ path: `artifacts/help/${lang}-print.pdf`, format: 'A4' });
        await page.emulateMedia({ media: 'screen' });
        await page.setViewportSize({ width: 640, height: 900 });
        await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '200% text reflow');
      }
      await context.close();
    }
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${base}/help?need=emergency`);
    await page.locator('#help-epilepsy summary').click();
    assert.ok(await page.locator('#help-epilepsy a[href="tel:103"]').isVisible());
    await context.close();
    console.log('Help passed: 12 guides, six need filters, search/reset, 320/375/1440px, Mongolian, keyboard disclosures, three axe scans, rights anchors, print and no-JavaScript.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
