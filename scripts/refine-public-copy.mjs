// Narrow, idempotent wording correction. Sources, dates, status and original research stay unchanged.
import pg from 'pg';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { postgresUrl } from '../src/server/postgres-url.mjs';
import { publicCopyEdits } from './research-mn.mjs';
const apply=process.argv[2]==='--apply';
if(process.argv.length!==(apply?3:2))throw Error('Usage: node --env-file=.env scripts/refine-public-copy.mjs [--apply]');
const client=new pg.Client({connectionString:postgresUrl(process.env.DATABASE_URL_UNPOOLED),connectionTimeoutMillis:15000});
let open=false,commitAttempted=false;
try {
  await client.connect();await client.query(apply?'BEGIN':'BEGIN READ ONLY');open=true;
  const {rows}=await client.query(`SELECT id,body,source,review_date::text,raw_record,legacy_record FROM guides WHERE publish_state='published' AND raw_record->>'name_en'=ANY($1::text[]) ${apply?'FOR UPDATE':''}`, [['Prosthetic, orthopaedic and assistive-device reimbursement','Disability employment quota']]);
  if(rows.length!==2)throw Error('Expected two published guides');
  const changes=[];
  for(const row of rows){const body={...row.body};for(const lang of ['mn','en'])for(const [before,after]of publicCopyEdits)body[lang]=body[lang].replace(before,after);if(JSON.stringify(body)!==JSON.stringify(row.body))changes.push({id:row.id,body});}
  if(apply){
    const backup=join(tmpdir(),`buteel-copy-before-${Date.now()}.json`);await writeFile(backup,JSON.stringify(rows,null,2));console.log('Backup: '+backup);
    for(const change of changes)await client.query('UPDATE guides SET body=$1,updated_at=now() WHERE id=$2',[JSON.stringify(change.body),change.id]);
    commitAttempted=true;await client.query('COMMIT');open=false;
  }else{await client.query('ROLLBACK');open=false;}
  console.log(`${apply?'Updated':'Would update'} ${changes.length} guide bodies; sources, dates and raw records untouched.`);
}catch{if(open)await client.query('ROLLBACK').catch(()=>{});console.error(commitAttempted?'Copy update outcome uncertain; inspect before retrying.':'Copy update failed; nothing committed.');process.exitCode=1;}
finally{await client.end();}
