/* eslint-disable @typescript-eslint/no-require-imports -- Shared educational-page browser checks. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
exports.checkGuide = async function checkGuide(route, count, portVariable, toolsVariable) {
  const root = process.env[toolsVariable] || process.env.PUBLIC_BROWSER_TOOLS;
  const browserRequire = root ? createRequire(path.join(root, 'package.json')) : require;
  const { chromium } = browserRequire('playwright');
  const { default: AxeBuilder } = browserRequire('@axe-core/playwright');
  const base = process.env[portVariable] || process.env.PUBLIC_BASE_URL || 'http://127.0.0.1:3216';
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  fs.mkdirSync(`artifacts/${route}`, { recursive: true });
  try {
    for (const width of [360, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${base}/${route}?lang=en&q=nomatch&topic=nomatch&need=nomatch`);
      assert.equal(await page.locator('html').getAttribute('lang'), 'mn');
      assert.equal(await page.locator('main h1').count(), 1);
      assert.equal(await page.locator('.understand-card').count(), count, 'Query parameters cannot filter topics');
      assert.equal(await page.locator('main input,main select,main form[role=search],main .source-links,main .rights-review-label').count(), 0);
      assert.equal(await page.locator('.site-navigation a[href*="?"]').count(), 0);
      assert.equal(await page.locator('main a[href^="/"][href*="lang="]').count(), 0);
      const text = await page.locator('main').innerText();
      for (const phrase of ['Судалгааны нэмэлт унших материал', 'Судалгаанд тэмдэглэсэн огноо', 'Мэдээллийн огноо', 'Хүний хяналт хүлээгдэж байна', 'Албан эх сурвалж', 'Хянуулах зүйл']) assert.ok(!text.includes(phrase), phrase);
      assert.equal(await page.locator('.guide-hero .home-title').evaluate(el => getComputedStyle(el).textAlign), 'center');
      await page.evaluate(() => document.fonts.ready);
      for (const summary of await page.locator('.understand-card > details > summary').all()) {
        await summary.focus();
        assert.ok(await summary.evaluate(el => getComputedStyle(el).outlineWidth === '3px'));
        await page.keyboard.press('Enter');
        assert.ok(await summary.evaluate(el => el.parentElement.open));
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.ok(await page.locator('.understand-detail-content').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 16));
      const scan = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      assert.deepEqual(scan.violations.map(item => ({id:item.id,targets:item.nodes.map(node=>node.target)})), []);
      if (route === 'understand' || route === 'help') {
        assert.equal(await page.locator('main a[href="tel:103"]').count(), route === 'help' ? 1 : 0);
        assert.ok(!(await page.locator('main').innerText()).includes('Таталтын анхны тусламжийн монгол орчуулгыг эмнэлгийн мэргэжилтэн'));
      }
      if (route === 'understand') {
        assert.equal(await page.locator('.topic-index a').count(), 12);
        assert.equal(await page.locator('.guide-intro,#shared-support-heading').count(), 0);
        assert.equal(await page.locator('main h1').innerText(), 'Хөгжлийн бэрхшээлийг ойлгох нь');
      }
      if (route === 'help') assert.equal(await page.locator('.section-links,.home-subtitle').count(), 0);
      if (route === 'rights') {
        for (const number of ['102','103','108']) assert.equal(await page.locator(`a[href="tel:${number}"]`).count(), 0);
        assert.equal(await page.locator('.rights-benefits [data-benefit]').count(), 4);
        assert.equal(await page.locator('.rights-benefits time').count(), 4);
        assert.ok((await page.locator('.rights-benefits').innerText()).includes('600,000'));
        assert.equal(await page.locator('#rights-contacts,.rights-emergency,.guide-intro,.home-subtitle,a[href="#rights-contacts"]').count(), 0);
        assert.equal(await page.locator('main h1').innerText(), 'Монгол улсын хөгжлийн бэрхшээлтэй иргэдийн эрх');
        assert.equal(await page.locator('#rights-topics-heading').innerText(), 'Хөгжлийн бэрхшээлтэй иргэдийн эрх');
        assert.equal(await page.locator('.understand-review p').innerText(), 'Хамрагдах нөхцөл, журам өөрчлөгдөж болно. Хууль зүйн зөвлөгөөг орлохгүй.');
      }
      await page.evaluate(()=>scrollTo(0,0));
      await page.screenshot({path:`artifacts/${route}/refined-${width}.png`});
      await page.emulateMedia({reducedMotion:'reduce'});
      assert.equal(await page.locator('.guide-hero').evaluate(el=>getComputedStyle(el).animationName),'none');
      await context.close();
    }
    const context = await browser.newContext({ javaScriptEnabled:false, viewport:{width:320,height:900} });
    const page = await context.newPage();
    await page.goto(`${base}/${route}`);
    await page.locator('.understand-card summary').first().click();
    assert.ok(await page.locator('.understand-card details').first().evaluate(el=>el.open));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.emulateMedia({media:'print'});
    assert.ok(await page.locator('.understand-detail-content').last().isVisible());
    await context.close();
    console.log(`${route}: Mongolian-only, ${count} topics, no filters/source UI, keyboard, axe, 360/1280px, 320px without JavaScript, print and reduced motion passed.`);
  } finally { await browser.close(); }
};
