import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { services } from "../../src/shared/data";
import {contentPages} from '../../src/shared/content-pages';

const languages = ["mn", "en"] as const;
const paths = ["/", "/services", ...services.map(s => `/services/${s.id}`), "/guides", "/about", "/accessibility", "/how-it-works", "/privacy", "/contact", "/for-organisations",...contentPages.map(p=>p.path), "/not-a-page"];
const tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

async function axe(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(result.violations, JSON.stringify(result.violations, null, 2)).toEqual([]);
}

for (const lang of languages) {
  for (const path of paths) {
    test(`${lang} ${path}: semantics, axe, 320px and doubled text`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 900 });
      await page.goto(`${path}?lang=${lang}`);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("navigation")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
      if (path === "/accessibility") {
        for (const marker of ["TODO [contact]", "TODO [response time]", "TODO [known limits]", "TODO [date]"]) {
          await expect(page.getByText(marker, {exact:true})).toBeVisible();
        }
      }
      const headings = await page.locator("h1,h2,h3,h4,h5,h6").evaluateAll(nodes => nodes.map(n => Number(n.tagName.slice(1))));
      headings.forEach((level, i) => { if (i) expect(level - headings[i - 1]).toBeLessThanOrEqual(1); });
      const switcher = page.locator(".language");
      const other = lang === "mn" ? "en" : "mn";
      await expect(switcher).toHaveAttribute("lang", other);
      await expect(switcher).toHaveAttribute("hreflang", other);
      await expect(switcher).toHaveAttribute("href", new RegExp(`lang=${other}`));
      await page.keyboard.press("Tab");
      await expect(page.locator(".skip")).toBeFocused();
      await expect(page.locator(".skip")).toBeInViewport();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest("main,footer"))).toBe(true);
      await axe(page);
      for (const size of ["100%", "200%"]) {
        await page.evaluate(value => { document.documentElement.style.fontSize = value; }, size);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${lang} ${path} at ${size}`).toBe(true);
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
      expect(await page.locator('html').evaluate(el => { const s=getComputedStyle(el);return s.scrollBehavior; })).toBe('auto');
      await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
      if (path === "/services") {
        await page.locator("summary").focus();
        await page.keyboard.press("Enter");
        await axe(page);
      }
    });
  }

  test(`${lang}: search filters work entirely by keyboard`, async ({ page }) => {
    await page.goto(`/services?lang=${lang}`);
    await page.locator('#search').focus();
    await page.keyboard.type(lang==='mn'?'Хөдөлмөр':'Employment');
    await page.keyboard.press('Tab');
    await expect(page.locator('#category')).toBeFocused();
    await page.keyboard.press('Home');
    for(let i=0;i<5;i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    await expect(page.locator('#district')).toBeFocused();
    await page.keyboard.press('Home');
    for(let i=0;i<3;i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    await expect(page.locator('summary')).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(page.locator('#cost')).toBeFocused();
    await page.keyboard.press('End');
    await page.keyboard.press('Tab');
    const checks=page.locator('.filters input[type=checkbox]');
    for(let i=0;i<await checks.count();i++) {
      await expect(checks.nth(i)).toBeFocused();
      await page.keyboard.press('Space');
      await expect(checks.nth(i)).toBeChecked();
      await page.keyboard.press('Space');
      await page.keyboard.press('Tab');
    }
    await expect(page.locator('.filters button')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.results-heading h2')).toHaveText(lang==='mn'?'1 байгууллага':'1 organisations');
    await expect(page.locator('#category')).toHaveValue('4');
    await expect(page.locator('#district')).toHaveValue('Сүхбаатар');
    await expect(page.locator('#cost')).toHaveValue('unknown');
    await page.locator('.reset').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.results-heading h2')).toHaveText(lang==='mn'?'3 байгууллага':'3 organisations');
    await expect(page.locator('#search')).toHaveValue('');
  });

  test(`${lang}: contextual contact names and unknowns in the accessibility tree`, async ({ page }) => {
    for (const s of services) {
      await page.goto(`/services/${s.id}?lang=${lang}`);
      for (const selector of ['a[href^="tel:"]', 'a[href^="mailto:"]', 'a[href^="https://www.google.com/maps/"]']) {
        await expect(page.locator(selector)).toHaveAccessibleName(new RegExp(s.name[lang]));
      }
      const tree = await page.locator(".access-list").ariaSnapshot();
      expect(tree.match(new RegExp(lang === "mn" ? "Тодорхойгүй" : "Unknown", "g"))).toHaveLength(5);
    }
  });

  test(`${lang}: feedback errors, report, copy failure and print styles`, async ({ page }) => {
    await page.goto(`/contact?lang=${lang}#feedback`);
    await page.locator("#message").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page.locator("#message")).toBeFocused();
    await expect(page.locator("#message")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#message")).toHaveAccessibleDescription(lang === "mn" ? "Засах мэдээлэл эсвэл саналаа бичнэ үү." : "Please describe your correction or suggestion.");
    await axe(page);
    await page.keyboard.type(lang === "mn" ? "Хаягийг шалгана уу." : "Please check the address.");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page.locator("#report")).toBeFocused();
    await expect(page.locator("#report")).toHaveValue(/Илгээгээгүй|Not submitted/);
    await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Test denied"); } } }); });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toContainText(lang === "mn" ? "Хуулж чадсангүй" : "Could not copy");
    await axe(page);
    await page.goto(`/guides?lang=${lang}`);
    const checks = page.getByRole("checkbox");
    await checks.first().focus();
    for (let i = 0; i < await checks.count(); i++) {
      await page.keyboard.press("Space");
      await expect(checks.nth(i)).toBeChecked();
      await page.keyboard.press("Tab");
    }
    await expect(page.getByRole("button", { name: lang === "mn" ? "Жагсаалт хэвлэх" : "Print checklist" })).toBeFocused();
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("header")).toBeHidden();
    await expect(page.locator("footer")).toBeHidden();
    await expect(page.locator(".print-button")).toBeHidden();
    await expect(checks).toHaveCount(5);
    await expect(checks.first()).toBeVisible();
    await expect(checks.first()).toBeChecked();
    await page.screenshot({ path: `test-results/checklist-print-${lang}.png`, fullPage: true });
    await page.pdf({ path: `test-results/checklist-${lang}.pdf`, format: "A4", printBackground: true });
  });
}

test("control boundaries, text and keyboard focus have sufficient contrast", async ({ page }, testInfo) => {
  await page.goto("/services?lang=en");
  await page.locator("summary").click();
  await page.locator("#search").focus();
  const result = await page.evaluate(() => {
    const rgb = (value: string) => (value.match(/[\d.]+/g) || []).slice(0,3).map(Number);
    const luminance = (value: string) => rgb(value).map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum,n,i) => sum + n * [.2126,.7152,.0722][i], 0);
    const ratio = (a: string,b: string) => { const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
    const background = (el: Element): string => { const c=getComputedStyle(el).backgroundColor; return c === "rgba(0, 0, 0, 0)" && el.parentElement ? background(el.parentElement) : c; };
    return Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]),select,textarea,button,.button,.language')).map(el => {
      const style=getComputedStyle(el);
      const outside=background(el.parentElement!);
      return { element:el.id || el.textContent?.trim() || el.tagName, boundary:ratio(style.borderTopColor,outside), text:ratio(style.color,background(el)), focus:document.activeElement===el?ratio(style.outlineColor,outside):null, placeholder:el.matches('input[placeholder]')?ratio(getComputedStyle(el,'::placeholder').color,background(el)):null, colours:[style.borderTopColor,outside] };
    });
  });
  for(const control of result) {
    expect(control.boundary, JSON.stringify(control)).toBeGreaterThanOrEqual(3);
    expect(control.text, JSON.stringify(control)).toBeGreaterThanOrEqual(4.5);
    if(control.focus!==null)expect(control.focus).toBeGreaterThanOrEqual(3);
    if(control.placeholder!==null)expect(control.placeholder).toBeGreaterThanOrEqual(4.5);
  }
  await testInfo.attach('measured-control-contrast.json',{body:JSON.stringify(result,null,2),contentType:'application/json'});
  console.log(`Measured control contrast: boundary minimum ${Math.min(...result.map(r=>r.boundary)).toFixed(2)}:1; text minimum ${Math.min(...result.map(r=>r.text)).toFixed(2)}:1; focus ${result.find(r=>r.focus!==null)?.focus?.toFixed(2)}:1.`);
  await page.locator("#search").focus();
  const focus=await page.locator("#search").evaluate(el=>{const s=getComputedStyle(el);return {style:s.outlineStyle,width:parseFloat(s.outlineWidth),offset:parseFloat(s.outlineOffset)};});
  expect(focus.style).not.toBe("none");
  expect(focus.width).toBeGreaterThanOrEqual(2);
  expect(focus.offset).toBeGreaterThanOrEqual(0);
});

test("visible interaction targets meet 24px or have a 24px label target", async ({ page }) => {
  for(const path of ["/", "/services", `/services/${services[0].id}`, "/guides", "/about", "/accessibility"]) {
    await page.goto(`${path}?lang=en`);
    if(path === "/services") await page.locator("summary").click();
    const small=await page.locator('a,button,input:not([type="hidden"]),select,textarea,summary').evaluateAll(nodes=>nodes.flatMap(node=>{
      const el=node as HTMLInputElement;
      const box=el.getBoundingClientRect();
      if(!box.width || !box.height || getComputedStyle(el).visibility === "hidden" || (el.classList.contains("skip") && box.bottom<0))return [];
      const target=el.type === "checkbox" ? el.closest("label")?.getBoundingClientRect() || box : box;
      return target.width<24 || target.height<24 ? [{tag:el.tagName,text:el.textContent?.slice(0,80),width:target.width,height:target.height}] : [];
    }));
    expect(small,`${path}: ${JSON.stringify(small)}`).toEqual([]);
  }
});
