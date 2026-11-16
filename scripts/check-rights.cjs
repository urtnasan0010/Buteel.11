/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS verification runner. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');
const browserRequire = process.env.RIGHTS_BROWSER_TOOLS
  ? createRequire(path.join(process.env.RIGHTS_BROWSER_TOOLS, 'package.json')) : require;
const { chromium } = browserRequire('playwright');
const { default: AxeBuilder } = browserRequire('@axe-core/playwright');
const exportsObject = {};
new Function('exports', ts.transpileModule(fs.readFileSync('src/shared/rights.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText)(exportsObject);
const { rightsTopics, rightsSources, rightsBenefits, rightsContacts, rightsHistory, rightsCopy, filterRightsTopics } = exportsObject;

assert.equal(rightsTopics.length, 11);
assert.equal(new Set(rightsTopics.map(topic => topic.id)).size, 11);
for (const topic of rightsTopics) {
  for (const value of [topic.title, topic.summary, topic.where, ...topic.entitlement,
    ...topic.conditions, ...topic.steps, ...topic.unverified, ...topic.laws.flatMap(law => [law.name, law.provisions])]) {
    for (const lang of ['mn', 'en']) assert.ok(value[lang] && !/\uFFFD|\?{3}/.test(value[lang]));
  }
  assert.ok(topic.sources.length && topic.laws.length && topic.steps.length);
  for (const id of [...topic.sources, ...topic.laws.flatMap(law => law.sources)]) assert.ok(rightsSources[id]);
}
for (const source of Object.values(rightsSources)) {
  assert.equal(new URL(source.url).protocol, 'https:');
  if (source.verification === 'UNVERIFIED') assert.equal(source.checkedOn, null);
  else assert.equal(source.checkedOn, '2026-11-16');
  assert.notEqual(source.updatedOn, source.publishedOn || 'not-a-date');
}
assert.deepEqual(rightsBenefits.map(item => item.amount), [600000, 600000, 370000, 524000]);
for (const item of rightsBenefits) {
  assert.equal(item.effectiveFrom, '2026-11-01');
  assert.ok(item.eligibility.mn && item.eligibility.en);
  assert.equal(rightsSources[item.source].verification, 'VERIFIED');
}
assert.equal(rightsContacts.find(item => item.id === 'legal-aid').verification, 'UNVERIFIED');
assert.equal(rightsHistory.filter(item => item.kind === 'FUTURE_CHANGE').length, 2);
assert.deepEqual(filterRightsTopics('600000', '', false).map(item => item.id), ['benefits']);
assert.deepEqual(filterRightsTopics('600,000', '', false).map(item => item.id), ['benefits']);
assert.deepEqual(filterRightsTopics('600 000', '', false).map(item => item.id), ['benefits']);
assert.equal(filterRightsTopics('checkedOn', '', false).length, 0);
assert.ok(filterRightsTopics('АЖИЛ', '', false).some(item => item.id === 'employment'));
assert.ok(filterRightsTopics('accommodation', '', false).some(item => item.id === 'employment'));
assert.equal(filterRightsTopics('600000', 'education', false).length, 0);
assert.equal(filterRightsTopics('no-such-topic-xyz', '', false).length, 0);

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const base = process.env.RIGHTS_BASE_URL || 'http://127.0.0.1:3216';
  const output = path.resolve('artifacts/rights');
  fs.mkdirSync(output, { recursive: true });
  const results = [];
  try {
    for (const width of [375, 768, 1440]) for (const lang of ['mn', 'en']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      assert.equal((await page.goto(`${base}/rights?lang=${lang}`)).status(), 200);
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      assert.equal(await page.locator('main').count(), 1);
      assert.equal(await page.locator('.rights-card').count(), 11);
      for (const number of ['102', '103', '108']) assert.equal(await page.locator(`.rights-emergency a[href="tel:${number}"]`).count(), 1);
      assert.equal(await page.locator('[data-contact="legal-aid"] a[href^="tel:"]').count(), 0);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.className), 'skip');
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => location.hash), '#main');
      const visited = new Set();
      for (let step = 0; step < 200 && visited.size < 11; step++) {
        await page.keyboard.press('Tab');
        const active = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el.matches('.rights-card summary')) return null;
          const css = getComputedStyle(el);
          return { id: el.closest('article').id, style: css.outlineStyle, width: parseFloat(css.outlineWidth) };
        });
        if (!active) continue;
        visited.add(active.id);
        assert.ok(active.style !== 'none' && active.width >= 3);
        await page.keyboard.press('Enter');
        assert.notEqual(await page.locator(`#${active.id} details`).getAttribute('open'), null);
        await page.keyboard.press('Space');
        assert.equal(await page.locator(`#${active.id} details`).getAttribute('open'), null);
      }
      assert.equal(visited.size, 11);
      for (const expanded of [false, true]) {
        if (expanded) await page.locator('.rights-card summary').evaluateAll(items => items.forEach(item => item.click()));
        const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        assert.deepEqual(scan.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
      assert.equal(await page.locator('[data-benefit]').count(), 4);
      for (const item of rightsBenefits) assert.ok((await page.locator(`[data-benefit="${item.id}"]`).innerText()).includes('2026-11-01'));
      assert.equal(await page.locator('[data-legal-status="FUTURE_CHANGE"]').count(), 2);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `${lang}-${width}.png`) });
      await page.locator('#right-benefits').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${lang}-${width}-benefits.png`) });
      const other = lang === 'mn' ? 'en' : 'mn';
      await page.locator(`.site-header a[hreflang="${other}"]`).click();
      await page.waitForURL(`**/rights?lang=${other}`);
      assert.equal(await page.locator('html').getAttribute('lang'), other);
      await page.goto(`${base}/rights?lang=${lang}`);
      await page.locator('#rights-query').fill('600000');
      await page.locator('#rights-query').press('Enter');
      await page.waitForURL('**/rights?**q=600000**');
      assert.equal(await page.locator('.rights-card').count(), 1);
      assert.equal(await page.locator('#right-benefits').count(), 1);
      await page.locator('#rights-topic').selectOption('education');
      await page.getByRole('button', { name: rightsCopy.submit[lang], exact: true }).click();
      await page.waitForURL('**topic=education**');
      assert.equal(await page.locator('.rights-card').count(), 0);
      assert.ok(await page.getByText(rightsCopy.noResults[lang], { exact: true }).isVisible());
      await page.getByRole('link', { name: rightsCopy.reset[lang], exact: true }).click();
      await page.waitForURL('**/rights?lang=**');
      assert.equal(await page.locator('.rights-card').count(), 11);
      await page.locator('#rights-topic').selectOption('employment');
      await page.getByRole('button', { name: rightsCopy.submit[lang], exact: true }).click();
      await page.waitForURL('**topic=employment**');
      assert.equal(await page.locator('#right-employment').count(), 1);
      assert.equal(await page.locator('.rights-card').count(), 1);
      assert.deepEqual(errors, []);
      results.push({ width, lang, keyboard: 'pass', axeCollapsedAndExpanded: 'pass', searchAndCombinedFilters: 'pass', languageSwitch: 'pass' });
      await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 320, height: 800 }, javaScriptEnabled: false });
    const page = await context.newPage();
    for (const lang of ['mn', 'en']) {
      await page.goto(`${base}/rights?lang=${lang}`);
      await page.locator('#rights-query').fill('600000');
      await page.locator('#rights-query').press('Enter');
      await page.waitForURL('**q=600000**');
      assert.equal(await page.locator('.rights-card').count(), 1);
      await page.locator('.rights-card summary').click();
      assert.ok(await page.locator('[data-benefit="child-support"]').isVisible());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await context.close();
    fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ results, noJavaScriptAnd320Reflow: 'pass' }, null, 2));
    console.log(JSON.stringify({ results, noJavaScriptAnd320Reflow: 'pass', screenshots: output }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
