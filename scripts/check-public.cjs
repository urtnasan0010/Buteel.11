/* eslint-disable @typescript-eslint/no-require-imports -- Standalone browser regressions. */
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const browserRequire = process.env.PUBLIC_BROWSER_TOOLS ? createRequire(path.join(process.env.PUBLIC_BROWSER_TOOLS, 'package.json')) : require;
const { chromium } = browserRequire('playwright');
const { default: AxeBuilder } = browserRequire('@axe-core/playwright');
const base = process.env.PUBLIC_BASE_URL || 'http://127.0.0.1:3216';
(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  const results = [];
  fs.mkdirSync('artifacts/public', { recursive: true });
  try {
    for (const width of [360, 1280]) for (const lang of ['mn']) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      for (const route of ['/', '/help', '/rights', '/understand']) {
        const response = await page.goto(`${base}${route}?lang=${lang}`);
        assert.equal(response.status(), 200);
        assert.equal(await page.locator('main h1').count(), 1);
        assert.equal(await page.locator('.site-header .brand').innerText(), '');
        if (route === '/') assert.equal(await page.locator('main h1').innerText(), 'Хүртээмж');
        const primary = page.locator('.site-navigation');
        assert.equal(await primary.locator('a').count(), 4);
        assert.equal(await primary.locator('a[aria-current="page"]').count(), 1);
        assert.equal(new URL(await primary.locator('a[aria-current="page"]').getAttribute('href'), base).pathname, route);
        await page.locator('.brand').focus();
        for (const link of await primary.locator('a').all()) {
          await page.keyboard.press('Tab');
          assert.ok(await link.evaluate(el => document.activeElement === el && el.matches(':focus-visible') && getComputedStyle(el).outlineWidth === '3px'));
          const box = await link.boundingBox(); assert.ok(box.height >= 44);
          assert.equal(await link.evaluate(el => getComputedStyle(el).textDecorationLine), 'none');
        }
        if (route !== '/') assert.ok((await page.locator('main').innerText()).length > 250);
        else {
          assert.equal(await page.locator('main .intro,main .section-links,main a[href*="rights-contacts"]').count(), 0);
          assert.equal(await page.getByText('Одоогоор нийтлэгдсэн мэдээ алга. Дээрх мэдээлэл, холбоосыг ашиглаарай.', {exact:true}).count(), 0);
        }
        assert.equal(await page.locator('.site-header a[href^="/admin"]').count(), 0);
        assert.equal(await page.locator('.site-header a[hreflang]').count(), 0);
        assert.equal(await page.getByText('Staff', { exact: true }).count(), 0);
        const html = await page.content();
        for (const value of ['7700-1982', 'info@lac.gov.mn', 'Хавсаргасан судалгааны холбоос', 'Нээхийг оролдсон огноо', 'DOCX']) assert.ok(!html.includes(value), `${route}: ${value}`);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (route === '/' || route === '/help') {
          const scan = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
          assert.deepEqual(scan.violations.map(item => item.id), []);
        }
        if (route === '/help') {
          assert.equal(await page.locator('.section-links').count(), 0, 'Removed Help navigation stays absent');
        }
        if (await page.locator('.section-links > a').count()) {
          const scan = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
          assert.deepEqual(scan.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })), []);
          assert.ok(await page.locator('.section-links a').count() >= 3);
          const cards = page.locator('.section-links > a');
          for (const card of await cards.all()) {
            assert.equal(await card.evaluate(el => getComputedStyle(el).textDecorationLine), 'none');
            assert.equal(await card.locator('a').count(), 0, 'No nested card links');
            await card.hover();
            await page.waitForTimeout(250);
            assert.ok(await card.evaluate(el => {
              const style = getComputedStyle(el);
              const accent = document.createElement('span'); accent.style.color = 'var(--accent)'; el.append(accent);
              const green = getComputedStyle(accent).color; accent.remove();
              return style.textDecorationLine === 'none' && style.borderColor === green && style.boxShadow !== 'none'
                && new DOMMatrixReadOnly(style.transform).m42 === -2
                && getComputedStyle(el, '::after').position === 'absolute';
            }), 'Card hover has green border, shadow, lift and full-card hit area');
            for (const child of await card.locator('h2,p').all()) assert.equal(await child.evaluate(el => getComputedStyle(el).textDecorationLine), 'none');
          }
          await page.mouse.move(0, 0);
          await page.locator('.skip').focus();
          let reached = 0;
          for (let tab = 0; tab < 25 && reached < await cards.count(); tab++) {
            await page.keyboard.press('Tab');
            const focused = await page.evaluate(() => {
              const el = document.activeElement;
              if (!el.matches('.section-links > a')) return false;
              const style = getComputedStyle(el);
              return el.matches(':focus-visible') && style.outlineWidth === '3px' && style.outlineOffset === '4px'
                && style.outlineStyle === 'solid' && style.textDecorationLine === 'none';
            });
            if (focused) reached++;
          }
          assert.equal(reached, await cards.count(), 'Every card has a keyboard focus ring');
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await cards.first().hover();
          assert.ok(await cards.first().evaluate(el => getComputedStyle(el).transform === 'none' && getComputedStyle(el).transitionDuration === '0s'));
          await page.emulateMedia({ reducedMotion: 'no-preference' });
        }
        const guideCards = page.locator('.understand-card');
        if (await guideCards.count()) {
          const first = guideCards.first();
          await first.hover();
          await page.waitForTimeout(250);
          assert.ok(await first.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42 === -2));
          // The closed card's title activates its existing native summary.
          const titleBox = await first.locator('h3').boundingBox();
          await page.mouse.click(titleBox.x + titleBox.width / 2, titleBox.y + titleBox.height / 2);
          assert.ok(await first.locator(':scope > details').evaluate(el => el.open));
          const source = first.locator('.understand-detail-content a').first();
          if (await source.count()) {
            await source.scrollIntoViewIfNeeded();
            assert.ok(await source.evaluate(el => { const rect = el.getBoundingClientRect(); return document.elementFromPoint(rect.left + 2, rect.top + 2)?.closest('a') === el; }));
          }
          await page.keyboard.press('Tab');
          for (const card of await guideCards.all()) {
            await card.locator(':scope > details > summary').focus();
            assert.ok(await card.evaluate(el => {
              const style = getComputedStyle(el);
              const summary = el.querySelector(':scope > details > summary');
              return style.outlineWidth === '3px' && style.outlineStyle === 'solid'
                && getComputedStyle(summary).textDecorationLine === 'none';
            }), 'Every educational card has visible keyboard focus without underlines');
          }
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await first.hover();
          assert.ok(await first.evaluate(el => getComputedStyle(el).transform === 'none' && getComputedStyle(el).transitionDuration === '0s'));
          await page.emulateMedia({ reducedMotion: 'no-preference' });
          await page.goto(`${base}${route}?lang=${lang}`);
        }
        results.push({ route, width, lang, result: 'pass' });
        await page.screenshot({ path: `artifacts/public/${lang}-${width}-${route === '/' ? 'home' : route.slice(1)}.png` });
        await page.goto(`${base}${route}?lang=en`);
        assert.equal(await page.locator('html').getAttribute('lang'), 'mn', 'Legacy English URLs serve Mongolian');
        assert.equal(await page.locator('.site-header a[hreflang]').count(), 0);
        assert.equal(await page.locator('.site-header a[href^="/admin"]').count(), 0);
      }
      await context.close();
    }
    for (const route of ['/admin', '/admin/verification', '/admin/login', '/admin/reset', '/api/admin/posts', '/api/auth/get-session']) {
      const response = await fetch(base + route, { redirect: 'manual' });
      assert.equal(response.status, 404, 'Removed route ' + route);
    }
    fs.mkdirSync('artifacts/public', { recursive: true });
    fs.writeFileSync('artifacts/public/checks.json', JSON.stringify(results, null, 2));
    console.log(`Public checks passed: ${results.length} route/language/viewport combinations. Public header, contacts, and retired routes checked.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
