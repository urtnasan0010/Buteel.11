import {test,expect} from '@playwright/test';
for(const lang of ['mn','en']) {
 test(`${lang}: information pages are reachable and reporting stays honest`,async({page})=>{
  await page.goto(`/?lang=${lang}`);
  for(const path of ['/how-it-works','/privacy','/for-organisations','/contact']) {
   await page.locator(`footer a[href="${path}?lang=${lang}"]`).click();
   await expect(page).toHaveURL(new RegExp(`${path}\\?lang=${lang}`));
   await expect(page.locator('html')).toHaveAttribute('lang',lang);
   await expect(page.locator('h1')).toBeVisible();
   if(lang==='en' && path==='/how-it-works') {
    await page.setViewportSize({width:1440,height:1100});
    await page.screenshot({path:'test-results/how-it-works-desktop.png',fullPage:true});
   }
   if(lang==='mn' && path==='/contact') {
    await page.setViewportSize({width:320,height:900});
    await page.screenshot({path:'test-results/contact-mobile.png',fullPage:true});
   }
  }
  await page.locator('#message').fill(lang==='en'?'Please check the address.':'Хаягийг шалгана уу.');
  await page.locator('#feedback form button').click();
  await expect(page.locator('#report')).toHaveValue(/Not submitted or saved|Илгээгээгүй, хадгалаагүй/);
  await page.locator('.language').click();
  await expect(page).toHaveURL(new RegExp(`/contact\\?lang=${lang==='en'?'mn':'en'}`));
 });
}
