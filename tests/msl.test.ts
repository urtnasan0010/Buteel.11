import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ContactAvailability from '../src/shared/contact-availability';
import MslVideo from '../src/shared/msl-video';
import {translations,t} from '../src/shared/translations';
test('written contact absence stays unknown without inventing SMS or interpreting',()=>{
 for(const lang of ['mn','en'] as const){
  for(const email of [undefined,'','  ']){
   const html=renderToStaticMarkup(createElement(ContactAvailability,{lang,email}));
   assert.ok(html.includes(t(lang,'written_unknown')));
   assert.ok(html.includes(t(lang,'interpreting_unknown')));
   assert.ok(!html.includes('href='));
  }
  const html=renderToStaticMarkup(createElement(ContactAvailability,{lang,email:'test@example.org'}));
  assert.ok(!html.includes(t(lang,'written_unknown')));
  assert.ok(html.includes(t(lang,'interpreting_unknown')));
 }
});
test('empty MSL component preserves text without a player and new Mongolian copy is Cyrillic',()=>{
 for(const lang of ['mn','en'] as const){
  const html=renderToStaticMarkup(createElement(MslVideo,{lang,title:'Example'},'Complete instructions'));
  assert.ok(html.includes(t(lang,'msl_soon')));assert.ok(html.includes('Complete instructions'));
  assert.ok(!/<video|<iframe|<audio|<button/.test(html));
 }
 for(const key of ['msl_title','msl_soon','msl_native','deaf_title','deaf_summary','deaf_todo','written_unknown','interpreting_unknown','msl_find'] as const){
  assert.match(translations[key].mn,/[А-Яа-яӨөҮү]/);
  assert.ok(!translations[key].mn.includes('???'));
 }
});
