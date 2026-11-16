// Add nine drafts only. Existing guides and publication states are never updated.
import pg from 'pg';
import { postgresUrl } from '../src/server/postgres-url.mjs';
import { disabilityDrafts,disabilityReviewSources } from '../src/shared/disability-category-drafts.ts';
import { disabilityCategorySchema,categoryPublicationIssues } from '../src/shared/disability-categories.ts';
const apply=process.argv[2]==='--apply';
if(process.argv.length!==(apply?3:2))throw Error('Usage: node --env-file=.env scripts/seed-disability-categories.mjs [--apply]');
const client=new pg.Client({connectionString:postgresUrl(process.env.DATABASE_URL_UNPOOLED),connectionTimeoutMillis:15000});
let open=false,commitAttempted=false;
try{
  await client.connect();await client.query(apply?'BEGIN':'BEGIN READ ONLY');open=true;
  if(apply)await client.query("SELECT pg_advisory_xact_lock(hashtext('hurteemj-disability-categories-seed'))");
  let inserted=0;const report=[];
  for(const draft of disabilityDrafts){
    const category=disabilityCategorySchema.parse(draft.category);
    const id='disability-category-'+category.slug;
    const found=await client.query('SELECT id FROM guides WHERE id=$1',[id]);
    if(found.rowCount){report.push({slug:category.slug,action:'existing row preserved'});continue;}
    const primary=category.sources.find(source=>source.access==='read')??category.sources[0];
    const metadata={...category,reviewNotes:[...category.reviewNotes,...disabilityReviewSources.filter(source=>!category.sources.some(item=>item.id===source.id)).map(source=>({mn:'',en:`Candidate source, not verified for current legal guidance: ${source.title.en}: ${source.url}`}))]};
    if(apply){
      const body={mn:category.facts.map(fact=>fact.text.mn).filter(Boolean).join('\n\n'),en:category.facts.map(fact=>fact.text.en).filter(Boolean).join('\n\n')};
      const result=await client.query(`INSERT INTO guides(id,title,body,source,review_date,status,publish_state,raw_record)
        VALUES ($1,$2,$3,$4,$5,'unknown','draft',$6) ON CONFLICT(id) DO NOTHING`,[id,JSON.stringify(draft.title),JSON.stringify(body),primary.url,primary.reviewDate,JSON.stringify(metadata)]);
      inserted+=result.rowCount;
    }
    report.push({slug:category.slug,action:apply?'draft inserted':'would insert draft',missingMongolianTitle:!draft.title.mn,reviewNeeded:categoryPublicationIssues(category)});
  }
  if(apply){commitAttempted=true;await client.query('COMMIT');}else await client.query('ROLLBACK');open=false;
  console.log(JSON.stringify({mode:apply?'COMMITTED DRAFTS ONLY':'DRY RUN',inserted,report},null,2));
}catch{if(open)await client.query('ROLLBACK').catch(()=>{});console.error(commitAttempted?'Seed commit outcome uncertain; inspect before retrying.':'Seed failed; no drafts committed.');process.exitCode=1;}
finally{await client.end();}
