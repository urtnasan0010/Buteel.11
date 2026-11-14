import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import MslVideo from '../../src/shared/msl-video';
import {t} from '../../src/shared/translations';

// A static coloured canvas, not signed content, a person or an avatar.
// Created and served by tests only; never placed in public/ or imported by the app.
test.beforeAll(async({browser})=>{
 const page=await browser.newPage();
 const bytes=await page.evaluate(async()=>{
  const canvas=document.createElement('canvas');canvas.width=160;canvas.height=90;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle='#224466';ctx.fillRect(0,0,160,90);
  const stream=canvas.captureStream(10);const chunks:BlobPart[]=[];
  const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8'});
  return await new Promise<number[]>(resolve=>{
   recorder.ondataavailable=e=>chunks.push(e.data);
   recorder.onstop=async()=>{stream.getTracks().forEach(track=>track.stop());resolve(Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer())));};
   recorder.start();
   const frames=setInterval(()=>ctx.fillRect(0,0,160,90),100);
   setTimeout(()=>{clearInterval(frames);recorder.stop();},1500);
  });
 });
 await mkdir('tests/fixtures',{recursive:true});
 await writeFile('tests/fixtures/plain-colour.webm',Buffer.from(bytes));
 await page.close();
});

for(const lang of ['mn','en'] as const){
 test(`${lang}: empty MSL slots retain full text, print and no player`,async({page})=>{
  for(const path of ['/how-it-works','/services','/guides','/contact']){
   await page.goto(`${path}?lang=${lang}`);
   const slot=page.locator('.msl-video');
   await expect(slot).toHaveCount(1);
   await expect(slot.locator('.msl-empty')).toHaveText(t(lang,'msl_soon'));
   await expect(slot.locator('video,iframe,audio')).toHaveCount(0);
   await expect(slot.locator('.msl-transcript')).toBeVisible();
   expect((await slot.locator('.msl-transcript').innerText()).length).toBeGreaterThan(100);
   if(lang==='mn')await expect(slot).toContainText(t(lang,'msl_native'));
   await page.emulateMedia({media:'print'});
   await expect(slot.locator('.msl-transcript')).toBeVisible();
   await page.emulateMedia({media:'screen'});
  }
 });
 test(`${lang}: actual video component loads fixture captions and supports keyboard, reflow and print`,async({page})=>{
  await page.route('**/__fixtures/*',async route=>{
   const captions=route.request().url().endsWith('.vtt');
   await route.fulfill({contentType:captions?'text/vtt':'video/webm',body:await readFile(`tests/fixtures/${captions?'plain-colour.vtt':'plain-colour.webm'}`)});
  });
  await page.goto(`/guides?lang=${lang}`);
  const html=renderToStaticMarkup(createElement(MslVideo,{lang,title:'Test clip',asset:{src:'/__fixtures/plain-colour.webm',captions:'/__fixtures/plain-colour.vtt',captionLang:'en',captionLabel:'English test captions'}},createElement('p',{lang:'en'},'A plain blue rectangle. Test fixture only; no sign language content.')));
  await page.locator('.msl-video').evaluate((el,markup)=>{el.outerHTML=markup;},html);
  const video=page.locator('video');
  await expect(video).toHaveAttribute('controls','');
  await expect(video).toHaveAttribute('preload','none');
  expect(await video.evaluate((el:HTMLVideoElement)=>el.paused&&!el.autoplay)).toBe(true);
  await expect(video).toHaveAccessibleName(/Test clip/);
  // Load after asserting preload=none; wait for native media controls to initialise.
  await video.evaluate((el:HTMLVideoElement)=>el.load());
  await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.readyState)).toBeGreaterThanOrEqual(2);
  await video.focus();await expect(video).toBeFocused();
  await page.keyboard.press('Space');
  await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.currentTime)).toBeGreaterThan(0);
  await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.textTracks[0]?.cues?.length)).toBe(1);
  expect(await video.evaluate((el:HTMLVideoElement)=>el.textTracks[0].mode)).toBe('showing');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:320,height:900});
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.emulateMedia({media:'print'});
  await expect(video).toBeHidden();await expect(page.locator('.msl-transcript')).toBeVisible();
 });
}
