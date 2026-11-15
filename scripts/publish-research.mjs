// Owner-authorised publication of complete high/medium research records. No source/date edits.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import pg from 'pg';
import { postgresUrl } from '../src/server/postgres-url.mjs';
import { regions } from '../src/shared/nationwide.ts';
import { servicesMn, applyMn, cautions, guideText, eligibilityMn, focusMn } from './research-mn.mjs';

const input = process.argv[2], apply = process.argv[3] === '--apply';
if (!input || process.argv.length !== (apply ? 4 : 3)) throw new Error('Usage: node --env-file=.env scripts/publish-research.mjs INPUT_JSON [--apply]');
const tableNames = ['organisations','guides','rights'];
const empty = () => ({ mn:'', en:'' });
const pair = (mn,en) => ({ mn,en });
const clean = text => typeof text === 'string' && !/\b(?:UNVERIFIED|unknown|not applicable|not confirmed|not established)\b/i.test(text) ? text.trim() : '';
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key,canonical(value[key])])) : value;
const equal = (a,b) => JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
const areas = { 'Sukhbaatar':'Сүхбаатар','Khan-Uul':'Хан-Уул','Bayangol':'Баянгол','Chingeltei':'Чингэлтэй','Bayanzurkh':'Баянзүрх','Baganuur':'Багануур','Bagakhangai':'Багахангай','Nalaikh':'Налайх','Songinokhairkhan':'Сонгинохайрхан','Erdenebulgan':'Эрдэнэбулган','Ulgii':'Өлгий','Bayankhongor':'Баянхонгор','Bulgan':'Булган','Yesunbulag':'Есөнбулаг','Darkhan':'Дархан','Sainshand':'Сайншанд','Dornod':'Дорнод','Kherlen':'Хэрлэн','Saintsagaan':'Сайнцагаан','Uliastai':'Улиастай','Arvaikheer':'Арвайхээр','Dalanzadgad':'Даланзадгад','Baruun-Urt':'Баруун-Урт','Zuunmod':'Зуунмод','Ulaangom':'Улаангом','Jargalant':'Жаргалант','Murun':'Мөрөн' };
const heldRows = { 14:'Dated/conflicting contact details require confirmation',20:'Assessment age boundaries and clinical/legal procedure need review',40:'Office region and application channel unknown',42:'Multiple regions need a supported representation',43:'Current service menu and direct contact incomplete',44:'Current service menu and direct contact incomplete',45:'Current service menu and direct contact incomplete',46:'Current service menu and direct contact incomplete',48:'Current service menu and direct contact incomplete',92:'Coverage unresolved and historical emergency-routing information' };
function organisation(raw,row,record) {
  const reasons=[];
  if (heldRows[row]) return { reason:heldRows[row] };
  if (!record.region && !record.nationwide) return { reason:'Region or nationwide service not established' };
  const branch=raw.category==='DPO_branch';
  let body;
  if(branch) body=pair('Монголын Хараагүйчүүдийн Үндэсний Холбооны орон нутгийн салбарын төлөөлөл. Одоогийн үйлчилгээний дэлгэрэнгүй жагсаалт баталгаажаагүй; нийтэлсэн утсаар урьдчилан лавлана.','Local branch representation of the Mongolian National Federation of the Blind. The current detailed service menu is unconfirmed; ask the published branch contact before visiting.');
  else {
    const english=raw.services.map(clean).filter(Boolean);
    if(!english.length || english.some(text=>!servicesMn[text])) return { reason:'Service description needs complete translation or verification' };
    body=pair(english.map(text=>servicesMn[text]).join('; ')+'.',english.join('; ')+'.');
  }
  const application=clean(raw.how_to_apply);
  let how=empty();
  if(application) {
    if(!applyMn[application]) return { reason:'Application instructions need translation' };
    how=pair(applyMn[application],application);
  } else if(row===87) how=pair('Цахим маягт, утас, цахим шуудан, биечлэн эсвэл аймгийн төлөөлөгчөөр хандана. Нэр, холбоо барих мэдээлэл, болсон явдал, нотлох баримтаа өгч, бүртгэлийн дугаар болон хяналтын кодоо хадгална.','Use the online form, phone, email, an in-person visit or an aimag representative. Provide name, contact details, what happened and evidence; retain the registration number and tracking code.');
  else if(row===88) how=pair('Хууль зүйн туслалцааны төвийн утас эсвэл салбарт хандаж зөвлөгөө, өмгөөллийн шалгуурыг лавлана.','Contact the Legal Aid Centre by phone or through a branch for advice and an assessment of representation eligibility.');
  const eligibility=clean(raw.eligibility);
  if(eligibility&&!eligibilityMn[eligibility]) reasons.push('Eligibility needs translation');
  const focus=clean(raw.disability_focus);
  if(focus&&!focusMn[focus]) reasons.push('Disability focus needs translation');
  if(reasons.length)return {reason:reasons.join('; ')};
  if(cautions[row]) { body.mn+='\n\n'+cautions[row][0]; body.en+='\n\n'+cautions[row][1]; }
  const area=clean(raw.district_or_soum);
  const localArea=area&&areas[area]?pair(areas[area],area):empty();
  if(area&&area!=='Nationwide'&&!areas[area]&&!record.nationwide)return {reason:'Local area needs translation'};
  // Do not infer missing house numbers or translate ambiguous mixed-language addresses.
  const address=clean(raw.address);
  const translatedAddress=address && /[А-Яа-яӨөҮү]/u.test(address) && !/[A-Za-z]/.test(address) ? pair(address,address) : empty();
  let hours=empty();
  if(row===41)hours=pair('Утасны мэдээлэл: ажлын өдрүүдэд 08:30–18:00.','Telephone information: working days 08:30–18:00.');
  if(row===87)hours=pair('Утас: ажлын өдрүүдэд 08:30–17:30.','Telephone: working days 08:30–17:30.');
  return { value:{body,local_area:localArea,disability_focus:focus?pair(focusMn[focus],focus):empty(),how_to_apply:how,eligibility:eligibility?pair(eligibilityMn[eligibility],eligibility):empty(),address:translatedAddress,hours} };
}

let client,open=false,commitAttempted=false;
try {
  const bytes=await readFile(input);
  if(createHash('sha256').update(bytes).digest('hex')!=='ba30fc6b47bf4fc55f3ca44218b492e3bab491d8d3f032fcc9a118245fbeacd7')throw Error('Attachment differs');
  const research=JSON.parse(bytes.toString('utf8'));
  client=new pg.Client({connectionString:postgresUrl(process.env.DATABASE_URL_UNPOOLED),connectionTimeoutMillis:15000});
  await client.connect();await client.query(apply?'BEGIN':'BEGIN READ ONLY');open=true;
  if(apply){await client.query("SET LOCAL lock_timeout='10s'");await client.query("SELECT pg_advisory_xact_lock(hashtext('hurteemj-publish-research'))");await client.query('LOCK TABLE organisations,guides,rights IN SHARE ROW EXCLUSIVE MODE');}
  const before=[];
  for(const table of tableNames){const result=await client.query(`SELECT to_jsonb(entry) AS record FROM ${table} entry`);before.push(...result.rows.map(row=>({table,record:row.record})));}
  const plans=[],held=[];
  for(const {table,record}of before){
    if(!record.raw_record)continue; // Keep the original three organisation records untouched.
    const row=research.records.findIndex(raw=>raw.name_mn===record.raw_record.name_mn)+1;
    const raw=research.records[row-1];
    if(!raw||!equal(raw,record.raw_record))throw Error('Research mismatch');
    if(!['high','medium'].includes(raw.confidence)){held.push({row,table,reason:'Low confidence'});continue;}
    if(table==='rights'){held.push({row,table,reason:'Law-level record lacks verified article-level content'});continue;}
    let value;
    if(table==='guides'){
      if(!guideText[row]){held.push({row,table,reason:'Guide translation incomplete'});continue;}
      value={body:pair(...guideText[row])};
      if([21,22].includes(row)){
        value.body.mn+='\n\nЯамны 2026-10-29-ний мэдээгээр 2026-11-01-нээс сарын хэмжээ 600,000 төгрөг болсон. Өөрт хамаарах эрх, одоогийн хэмжээг халамжийн байгууллагаас лавлана.';
        value.body.en+='\n\nThe ministry’s 2026-10-29 notice sets the monthly amount at MNT 600,000 from 2026-11-01. Confirm personal entitlement and the current amount with welfare services.';
      }
      if(row===23){
        value.body.mn+='\n\nЯамны 2026-10-29-ний мэдээгээр 2026-11-01-нээс ердийн асаргааны тэтгэмж сард 370,000 төгрөг, байнгын асаргаа шаардлагатай хүнд хэлбэрийн хөгжлийн бэрхшээлтэй хүүхэд асарч буй хүнд сард 524,000 төгрөг болсон. Өөрт хамаарах ангиллыг лавлана.';
        value.body.en+='\n\nThe ministry’s 2026-10-29 notice sets monthly rates from 2026-11-01 at MNT 370,000 for the standard caregiver allowance and MNT 524,000 for carers of children with severe disabilities requiring permanent care. Confirm the applicable category.';
      }
    }else{
      const mapped=organisation(raw,row,record);
      if(mapped.reason){held.push({row,table,reason:mapped.reason});continue;}
      value=mapped.value;
    }
    if(!record.source||record.source!==raw.source_urls[0]||record.review_date!==raw.last_verified_date||!record.title.mn||!record.title.en||!value.body.mn||!value.body.en)throw Error('Publication evidence incomplete');
    if(!/^https?:\/\//.test(record.source)||/TODO|UNVERIFIED/i.test(value.body.mn+value.body.en))throw Error('Unsafe publication content');
    const importedBody={mn:'',en:raw.services.map(clean).filter(Boolean).join('\n')};
    if(!equal(record.body,importedBody)) { held.push({row,table,reason:'Draft body has been edited since import; left for owner review'});continue; }
    if(table==='organisations'&&!regions.some(region=>region.id===record.region)&&!record.nationwide)throw Error('Unknown region');
    // Do not replace content already edited by the owner.
    if(record.publish_state!=='draft') { held.push({row,table,reason:'Already published; left unchanged'});continue; }
    plans.push({row,table,id:record.id,value});
  }
  if(apply){
    const backup=join(tmpdir(),`buteel-before-publication-${Date.now()}.json`);
    await writeFile(backup,JSON.stringify(before,null,2));
    console.log('Pre-publication row backup: '+backup);
    for(const plan of plans){
      const fields=Object.keys(plan.value);
      await client.query(`UPDATE ${plan.table} SET ${fields.map((field,index)=>`${field}=$${index+1}`).join(',')},publish_state='published',updated_at=now() WHERE id=$${fields.length+1} AND publish_state='draft'`,[...fields.map(field=>JSON.stringify(plan.value[field])),plan.id]);
    }
    for(const table of tableNames){
      const {rows}=await client.query(`SELECT to_jsonb(entry) AS record FROM ${table} entry`);
      for(const {record}of rows){
        const previous=before.find(item=>item.table===table&&item.record.id===record.id).record;
        const plan=plans.find(item=>item.table===table&&item.id===record.id);
        if(!plan&&!equal(previous,record))throw Error('Unapproved row changed');
        for(const field of ['source','review_date','raw_record','legacy_record','title','status','phone','email','region','nationwide'])if(!equal(previous[field],record[field]))throw Error('Protected field changed');
        if(plan&&(record.publish_state!=='published'||Object.entries(plan.value).some(([key,value])=>!equal(value,record[key]))))throw Error('Publication verification failed');
      }
    }
    commitAttempted=true;await client.query('COMMIT');open=false;
  }else{await client.query('ROLLBACK');open=false;}
  console.log(JSON.stringify({mode:apply?'COMMITTED':'DRY RUN',published: Object.fromEntries(tableNames.map(table=>[table,plans.filter(plan=>plan.table===table).length])),held,totalPublished:plans.length},null,2));
}catch(error){if(open&&client)await client.query('ROLLBACK').catch(()=>{});console.error(`Publication failed (${typeof error.code==='string'?error.code.replace(/[^a-z0-9_]/gi,''):'VALIDATION'}). ${commitAttempted?'Check commit outcome before retrying.':'No publication committed.'}`);process.exitCode=1;}
finally{if(client)await client.end();}
