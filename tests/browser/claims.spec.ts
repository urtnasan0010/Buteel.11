import {test,expect} from '@playwright/test';
import {claims} from '../../src/shared/claims';
import {contentPages} from '../../src/shared/content-pages';
for(const lang of ['mn','en'] as const){
 test(`${lang}: claims retain individual citations, dates, language and pending boundaries`,async({page})=>{
  for(const entry of contentPages.filter(p=>p.claimIds?.length)){
   await page.goto(`${entry.path}?lang=${lang}`);
   for(const id of entry.claimIds!){
    const claim=claims.find(c=>c.id===id)!;
    if(claim.status==='TODO'){
     await expect(page.locator(`[data-pending-claim-id="${id}"]`)).toHaveText(claim.note![lang]);
     await expect(page.locator(`[data-claim-id="${id}"]`)).toHaveCount(0);
     await expect(page.getByText(claim.text[lang],{exact:true})).toHaveCount(0);
    }else{
     const article=page.locator(`[data-claim-id="${id}"]`);
     await expect(article.locator('.claim-text')).toHaveText(claim.text[lang]);
     await expect(article.locator('time')).toHaveAttribute('datetime','2026-11-14');
     await expect(article.locator('time')).toHaveText('2026-11-14');
     for(const source of claim.sources){const link=article.getByRole('link',{name:source.title,exact:true});await expect(link).toHaveAttribute('href',source.url);await expect(link).toHaveAttribute('lang',source.titleLang);await expect(link).toHaveAttribute('hreflang',source.titleLang);}
     await page.emulateMedia({media:'print'});await expect(article).toBeVisible();await expect(article.locator('time')).toBeVisible();await page.emulateMedia({media:'screen'});
    }
   }
   if(entry.path==='/understand/rights'){
    for(const marker of ['TODO [official source needed]','TODO [choose one official figure with year]','TODO [verify]'])await expect(page.getByText(marker,{exact:false}).first()).toBeVisible();
    await page.setViewportSize({width:lang==='mn'?320:1440,height:1000});await page.screenshot({path:`test-results/rights-claims-${lang}.png`,fullPage:true});
   }
  }
 });
}
