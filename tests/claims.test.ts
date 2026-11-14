import {test} from 'node:test';
import assert from 'node:assert/strict';
import {claims} from '../src/shared/claims';
import {contentPages} from '../src/shared/content-pages';
test('published claims require sourced bilingual text, confidence and a review date',()=>{
 assert.equal(claims.length,17);
 assert.equal(new Set(claims.map(c=>c.id)).size,17);
 for(const c of claims){
  assert.ok(c.text.mn.trim());assert.ok(c.text.en.trim());
  assert.ok(['high','medium','low'].includes(c.confidence));
  assert.equal(c.lastReviewed,'2026-11-14');
  if(c.status==='published'){
   assert.ok(c.sources.length,`${c.id}: source missing`);
   assert.ok(c.sources.some(s=>s.access!=='unavailable'),`${c.id}: no readable/indexed source`);
   for(const source of c.sources){assert.ok(source.title.trim());assert.equal(new URL(source.url).protocol,'https:');assert.ok(['mn','en'].includes(source.titleLang));assert.ok(['official','UN','news','other'].includes(source.type));}
   if(c.confidence==='low'||c.sources.every(s=>s.type==='news'))assert.match(c.text.en,/reported/i);
  }else{assert.match(c.note!.en,/TODO/);assert.match(c.note!.mn,/TODO/);}
 }
});
test('every claim is referenced once and unsupported claims cannot become assertions',()=>{
 const ids=contentPages.flatMap(p=>p.claimIds||[]);
 assert.equal(ids.length,17);assert.equal(new Set(ids).size,17);
 for(const id of ids)assert.ok(claims.some(c=>c.id===id));
 for(const number of [1,2,13])assert.equal(claims.find(c=>c.number===number)!.status,'TODO');
 assert.match(claims.find(c=>c.number===2)!.note!.en,/footer/);
 assert.match(claims.find(c=>c.number===5)!.note!.en,/TODO \[official source needed\]/);
 assert.match(claims.find(c=>c.number===8)!.note!.en,/TODO \[verify steps\]/);
});
