import {test,expect} from '@playwright/test';
import {contentPages} from '../../src/shared/content-pages';
import {t} from '../../src/shared/translations';
for(const lang of ['mn','en'] as const){
 test(`${lang}: home sections and audience links are plain, keyboard reachable navigation`,async({page})=>{
  await page.goto(`/?lang=${lang}`);
  await expect(page.locator('.home-search')).toBeVisible();
  for(const section of ['understand','help','reach'] as const){
   const link=page.locator(`main .category[href="/${section}?lang=${lang}"]`);
   await link.focus();await page.keyboard.press('Enter');
   await expect(page.locator('h1')).toHaveText(t(lang,section));
   await expect(page.locator('nav a[aria-current="page"]')).toHaveText(t(lang,section));
   await page.goto(`/?lang=${lang}`);
  }
  for(const target of ['/services','/help/families','/help/employers-schools'])await expect(page.locator(`.audience-links a[href="${target}?lang=${lang}"]`)).toHaveCount(1);
  expect(await page.evaluate(()=>Object.keys(localStorage))).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
  await page.setViewportSize({width:lang==='mn'?320:1440,height:1000});
  await page.screenshot({path:`test-results/sections-home-${lang}.png`,fullPage:true});
 });
 test(`${lang}: every content page prints its summary, points and provenance`,async({page})=>{
  for(const entry of contentPages){
   await page.goto(`${entry.path}?lang=${lang}`);
   await expect(page.locator('h1')).toHaveText(t(lang,entry.title));
   await expect(page.locator('.intro')).toHaveText(t(lang,entry.summary));
   await expect(page.locator('.content-provenance')).toContainText('TODO [source needed]');
   await expect(page.locator('.content-provenance')).toContainText('TODO [review date]');
   const nav=await page.locator('nav a').allTextContents();
   expect(nav).toEqual(['find_support_nav','understand','help','reach'].map(key=>t(lang,key as 'understand')));
   await page.evaluate(()=>{window.print=()=>{document.body.dataset.printed='yes';};});
   await page.getByRole('button',{name:t(lang,'print_page'),exact:true}).focus();await page.keyboard.press('Enter');
   await expect(page.locator('body')).toHaveAttribute('data-printed','yes');
   await page.emulateMedia({media:'print'});
   await expect(page.locator('header')).toBeHidden();await expect(page.locator('footer')).toBeHidden();await expect(page.locator('.print-button')).toBeHidden();
   await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.content-provenance')).toBeVisible();
   if(entry.path==='/help/friends-volunteers')await page.screenshot({path:`test-results/section-print-${lang}.png`,fullPage:true});
   await page.emulateMedia({media:'screen'});
  }
 });
}
