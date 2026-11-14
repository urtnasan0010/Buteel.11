import {test} from 'node:test';
import assert from 'node:assert/strict';
import {translations,t,categories,featureLabels} from '../src/shared/translations';

test('every interface message has both languages and matching placeholders',()=>{
  for(const [key,value] of Object.entries(translations)){
    assert.ok(value.mn.trim(),`${key}: Mongolian missing`);
    assert.ok(value.en.trim(),`${key}: English missing`);
    const slots=(text:string)=>[...text.matchAll(/\{(\d+)\}/g)].map(m=>m[1]).sort();
    assert.deepEqual(slots(value.mn),slots(value.en),`${key}: placeholder mismatch`);
  }
  for(const value of [...categories,...Object.values(featureLabels)]){assert.ok(value.mn);assert.ok(value.en);}
});
test('interpolation preserves language-specific word order and Cyrillic',()=>{
  assert.equal(t('mn','count_of_count_steps_ready',[5,2]),'5-аас 2 алхам бэлэн');
  assert.equal(t('en','count_of_count_steps_ready',[5,2]),'2 of 5 steps ready');
  assert.equal(t('mn','home'),'Нүүр');
  assert.equal(t('en','home'),'Home');
});
