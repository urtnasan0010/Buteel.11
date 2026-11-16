import { z } from 'zod';

export const disabilitySlugs = ['physical-mobility','visual','hearing','speech-communication','intellectual','psychosocial','autism-neurodevelopmental','multiple-deafblind','long-term-health'] as const;
export const categorySections = ['meaning','barriers','do','avoid','language'] as const;
const text = z.object({mn:z.string().max(12000),en:z.string().max(12000)}).strict();
const https = z.url().refine(value => {
  const url=new URL(value);
  return url.protocol==='https:'&&!url.username&&!url.password;
});
const date=z.string().refine(value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value);
export const disabilityCategorySchema=z.object({
  type:z.literal('disability-category'),version:z.literal(1),slug:z.enum(disabilitySlugs),summary:text,
  facts:z.array(z.object({section:z.enum(categorySections),text,sources:z.array(z.string().min(1).max(80)).min(1)}).strict()).min(1),
  sources:z.array(z.object({id:z.string().min(1).max(80),title:text,url:https,reviewDate:date,locator:text,access:z.enum(['read','indexed','unavailable'])}).strict()).min(1),
  nativeReviewNeeded:z.boolean(),livedExperienceReviewed:z.boolean(),reviewNotes:z.array(text),
}).strict().superRefine((value,ctx)=>{
  const ids=value.sources.map(source=>source.id);
  if(new Set(ids).size!==ids.length)ctx.addIssue({code:'custom',message:'Duplicate source IDs'});
  for(const fact of value.facts)if(fact.sources.some(id=>!ids.includes(id)))ctx.addIssue({code:'custom',message:'Every fact must reference a listed source'});
});
export type DisabilityCategory=z.infer<typeof disabilityCategorySchema>;
export function categoryPublicationIssues(value:DisabilityCategory):string[] {
  const issues:string[]=[];
  const complete=(pair:{mn:string;en:string})=>pair.mn.trim()&&pair.en.trim()&&!/TODO|\[[^\]]*source needed[^\]]*\]/i.test(pair.mn+pair.en);
  if(!complete(value.summary))issues.push('Category summary needs both languages');
  for(const section of categorySections)if(!value.facts.some(fact=>fact.section===section))issues.push(`Missing section: ${section}`);
  for(const fact of value.facts){
    if(!complete(fact.text))issues.push(`Missing translation: ${fact.section}`);
    if(fact.sources.some(id=>value.sources.find(source=>source.id===id)?.access!=='read'))issues.push(`Source needs direct review: ${fact.section}`);
  }
  return issues;
}

// Match only recorded organisational focus; do not infer diagnoses or invent providers.
export const disabilityFocusTerms:Record<typeof disabilitySlugs[number],string[]>={
  'physical-mobility':['mobility','wheelchair'],visual:['blind','visual','sighted'],hearing:['deaf','hearing','sign-language'],
  'speech-communication':['speech','communication'],intellectual:['intellectual'],psychosocial:['mental-health','psychosocial'],
  'autism-neurodevelopmental':['autism','autistic','developmental'], 'multiple-deafblind':['deafblind','multiple disabilities'], 'long-term-health':[],
};
