import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contentPages} from '../src/shared/content-pages';
import {translations} from '../src/shared/translations';
test('content registry has unique routes, equal languages and valid internal links',()=>{
 assert.equal(new Set(contentPages.map(p=>p.path)).size,contentPages.length);
 const targets=new Set([...contentPages.map(p=>p.path),'/guides','/services','/contact','/for-organisations']);
 for(const page of contentPages){
  assert.ok(page.path.startsWith('/'+page.section));
  for(const key of [page.title,page.summary,...page.points])for(const lang of ['mn','en'] as const)assert.ok(translations[key][lang].trim());
  for(const link of page.links||[])assert.ok(targets.has(link.path));
 }
});
test('rights and voices remain explicit placeholders in both languages',()=>{
 for(const lang of ['mn','en'] as const){
  assert.match(translations.rights_one[lang],/TODO \[source needed\]/);
  assert.match(translations.rights_two[lang],/TODO \[source needed\]/);
  assert.match(translations.employers_three[lang],/TODO \[source needed\]/);
  assert.match(translations.voices_one[lang],/TODO \[consent needed\]/);
 }
});
