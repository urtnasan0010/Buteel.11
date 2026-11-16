/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS browser check with optional external tools. */
// Run against a local production server. Browser tools may be installed separately:
// UNDERSTAND_BROWSER_TOOLS=<directory containing node_modules> node scripts/check-understand.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');
const browserRequire = process.env.UNDERSTAND_BROWSER_TOOLS
  ? createRequire(path.join(process.env.UNDERSTAND_BROWSER_TOOLS, 'package.json')) : require;
const { chromium } = browserRequire('playwright');
const { default: AxeBuilder } = browserRequire('@axe-core/playwright');
const compiled = ts.transpileModule(fs.readFileSync('src/shared/understand.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText;
const dataModule = { exports: {} };
new Function('exports', compiled)(dataModule.exports);
const { disabilityTopics, seizureFirstAid, sharedSupportTips, sourceDisplayDate, understandCopy, understandSources } = dataModule.exports;
assert.equal(disabilityTopics.length, 12);
assert.equal(new Set(disabilityTopics.map(topic => topic.id)).size, 12);
for (const topic of disabilityTopics) {
  for (const value of [topic.title, topic.explanation, topic.experiences, topic.misunderstanding,
    topic.dailyLife, topic.educationWork, topic.digitalAccess, ...topic.furtherDetails, ...topic.tips]) {
    for (const lang of ['mn']) assert.ok(value[lang] && !/TODO|\uFFFD|\?{3}/.test(value[lang]));
  }
  assert.ok(topic.sources.length);
  assert.ok(topic.tips.length >= 2);
  for (const id of topic.sources) {
    const source = understandSources[id];
    assert.ok(source && new URL(source.url).protocol === 'https:');
    assert.equal(source.checkedOn, '2026-11-16');
  }
}
for (const item of Object.values(understandSources)) {
  assert.equal(item.reviewed_by, null);
  assert.equal(item.reviewed_at, null);
  assert.equal(sourceDisplayDate(item).kind, 'added');
}
assert.equal(sourceDisplayDate({ added_at: '2026-11-16', reviewed_by: null, reviewed_at: '2026-11-17' }).kind, 'added');
assert.equal(sourceDisplayDate({ added_at: '2026-11-16', reviewed_by: 'Test reviewer', reviewed_at: '2026-11-17' }).kind, 'reviewed');
for (const value of [...seizureFirstAid, ...sharedSupportTips, ...Object.values(understandCopy)]) {
  for (const lang of ['mn']) assert.ok(value[lang] && !/TODO|\uFFFD|\?{3}/.test(value[lang]));
}
assert.match(understandCopy.emergencyText.en, /at 5 minutes or longer/);
assert.match(understandCopy.emergencyText.en, /Do not wait 5 minutes/);
assert.match(seizureFirstAid[3].en, /After convulsions stop/);
assert.match(seizureFirstAid[4].en, /wheelchair/);

(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  const base = process.env.UNDERSTAND_BASE_URL || 'http://127.0.0.1:3216';
  const output = path.resolve('artifacts/understand');
  fs.mkdirSync(output, { recursive: true });
  const results = [];
  try {
    for (const width of [360, 375, 768, 1440]) for (const lang of ['mn']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${base}/understand${lang === 'en' ? '?lang=en' : ''}`);
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      assert.equal(await page.locator('main').count(), 1);
      assert.equal(await page.locator('.understand-card').count(), 12);
      assert.equal(await page.locator('.understand-card details[open]').count(), 0);
      assert.equal(await page.locator('.topic-index a').count(), 12);
      for (const topic of disabilityTopics) assert.equal(await page.locator(`.topic-index a[href="#${topic.id}"]`).count(), 1);
      assert.ok(await page.locator('#seizure-first-aid .medical-review-note').isVisible());
      assert.ok(!(await page.locator('main').innerText()).includes(understandCopy.reviewed[lang]));
      const feed = page.locator('#posts');
      if (await feed.count()) assert.ok(await feed.locator('.home-post').count(), 'Related posts appear only with content');
      assert.ok(await page.locator('a[href="tel:103"]').count());
      assert.ok(!(await page.locator('main').innerText()).includes(lang === 'en' ? 'Хөгжлийн бэрхшээлийг ойлгох' : 'Understanding disability'));
      // Tab through the real page, including the skip link and each disclosure.
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.className), 'skip');
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => location.hash), '#main');
      const visited = new Set();
      for (let step = 0; step < 200 && visited.size < 12; step++) {
        await page.keyboard.press('Tab');
        const active = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el.matches('.understand-card summary')) return null;
          const css = getComputedStyle(el);
          return { id: el.closest('article').id, outline: css.outlineStyle, width: css.outlineWidth };
        });
        if (!active) continue;
        assert.notEqual(active.outline, 'none');
        assert.ok(parseFloat(active.width) >= 3);
        visited.add(active.id);
        await page.keyboard.press('Enter');
        assert.ok(await page.locator(`#${active.id} details`).getAttribute('open') !== null);
        await page.keyboard.press('Space');
        assert.equal(await page.locator(`#${active.id} details`).getAttribute('open'), null);
      }
      assert.equal(visited.size, 12, 'Every topic reachable and operable by keyboard');
      for (const expanded of [false, true]) {
        if (expanded) await page.locator('.understand-card summary').evaluateAll(items => items.forEach(item => item.click()));
        if (expanded) {
          for (const topic of disabilityTopics) {
            const card = page.locator(`#${topic.id}`);
            for (const key of ['dailyLife', 'educationWork', 'digitalAccess', 'furtherDetails']) {
              assert.ok(await card.getByRole('heading', { name: understandCopy[key][lang], exact: true }).isVisible());
            }
          }
        }
        const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        assert.deepEqual(scan.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
      }
      const columns = await page.locator('.understand-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
      assert.equal(columns, width <= 375 ? 1 : 2);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `${lang}-${width}.png`) });
      await page.locator('.topic-index').evaluate(el => el.scrollIntoView({ block: 'start' }));
      await page.screenshot({ path: path.join(output, `${lang}-${width}-index.png`) });
      await page.locator('.understand-grid').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${lang}-${width}-cards.png`) });
      await page.locator('#epilepsy').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${lang}-${width}-details.png`) });
      await page.locator('#seizure-first-aid').evaluate(el => el.scrollIntoView({ block: 'start' }));
      await page.screenshot({ path: path.join(output, `${lang}-${width}-first-aid.png`) });
      await page.locator('.topic-index a[href="#epilepsy"]').click();
      assert.equal(await page.evaluate(() => location.hash), '#epilepsy');
      await page.keyboard.press('Tab');
      assert.ok(await page.locator('#epilepsy summary').evaluate(el => el === document.activeElement));
      await page.goto(`${base}/understand?lang=en`);
      assert.equal(await page.locator('html').getAttribute('lang'), 'mn');
      assert.equal(await page.locator('.understand-card').count(), 12);
      assert.deepEqual(errors, []);
      results.push({ width, lang, topics: 12, keyboard: 'pass', collapsedAndExpandedAxe: 'pass', mongolianOnly: 'pass' });
      await context.close();
    }
    // Reflow at 320 CSS pixels approximates a desktop viewport at 400% zoom.
    const page = await browser.newPage({ viewport: { width: 320, height: 800 } });
    for (const lang of ['mn']) {
      await page.goto(`${base}/understand?lang=${lang}`);
      await page.locator('.understand-card summary').evaluateAll(items => items.forEach(item => item.click()));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await page.close();
    fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ checks: results, reflow320: 'pass', screenshots: output }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
