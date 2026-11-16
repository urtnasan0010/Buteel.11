import type { DisabilityCategory } from './disability-categories';
const reviewDate='2026-11-16';
const p=(mn:string,en:string)=>({mn,en});
const source=(id:string,en:string,url:string,locator:string,access:'read'|'indexed'|'unavailable'='read')=>({id,title:p('',en),url,reviewDate,locator:p('',locator),access});
const sources={
  crpd:source('crpd','United Nations — Convention on the Rights of Persons with Disabilities','https://treaties.un.org/doc/Publication/CTC/Ch_IV_15.pdf','Articles 1, 2, 3, 9 and 21'),
  icf:source('icf','WHO — International Classification of Functioning, Disability and Health','https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health','Framework and environmental factors'),
  law:source('law','Mongolian Law on the Rights of Persons with Disabilities','https://legalinfo.mn/mn/detail?lawId=11711','Definitions and general principles; direct access returned 403','indexed'),
  assessment:source('assessment','Health Assessment Council rules — candidate official text','https://legalinfo.mn/mn/detail/17089481109671','Current consolidated rules and amendments require human verification','unavailable'),
  education:source('education','Official methodology for comprehensive support to children with disabilities','https://legalinfo.mn/mn/detail?lawId=16390054033101','Communication and accessible learning materials; direct access returned 403','indexed'),
  un:source('un','UN — Disability-Inclusive Communications Guidelines, easy-read version','https://www.un.org/sites/un2.un.org/files/2021/10/un_disability_inclusion_strategy_communication_guidelines_etr.pdf','Talking to people with disabilities, page 18; indexed text only','indexed'),
  oas:source('oas','Organization of American States — Guide to Inclusive Communication','https://www.oas.org/en/cim/docs/GuiaComunicacionInclusivaOEA-EN.pdf','Communication etiquette, page 22'),
  language:source('language','UK Cabinet Office — Inclusive language guidance','https://www.gov.uk/government/publications/inclusive-communication/inclusive-language-words-to-use-and-avoid-when-writing-about-disability','Self-identification, neutral wording and terminology'),
  visual:source('visual','WHO — Blindness and vision impairment','https://www.who.int/news-room/fact-sheets/detail/blindness-and-visual-impairment','Overview'),
  hearing:source('hearing','WHO — Deafness and hearing loss','https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss','Hearing loss and deafness'),
  autism:source('autism','WHO — Autism','https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders','Key facts and overview'),
  mental:source('mental','WHO — Mental disorders','https://www.who.int/news-room/fact-sheets/detail/mental-disorders','Overview; not a definition of all psychosocial disability'),
  disability:source('disability','WHO — Disability','https://www.who.int/news-room/fact-sheets/detail/disability-and-health','Interaction between health conditions and personal/environmental factors'),
  deafblind:source('deafblind','UN Statistics — Guidelines to Make Surveys More Accessible','https://unstats.un.org/iswghs/documents/Accessibility-Guidelines.pdf','Guide interpreters and individual communication methods, page 25; indexed text only','indexed'),
  terms:source('terms','Ministry of Education — Inclusive education information','https://moe.gov.mn/post/120623','Published Mongolian terminology; not adult diagnostic definitions','indexed'),
  mnAutism:source('mn-autism','Ministry of Family, Labour and Social Protection — Autism and education','https://mlsp.gov.mn/content/detail/4021','Published Mongolian autism terminology','indexed'),
};
type Seed={title:{mn:string;en:string};category:DisabilityCategory};
const fact=(section:DisabilityCategory['facts'][number]['section'],mn:string,en:string,ids:string[])=>({section,text:p(mn,en),sources:ids});
const commonNotes=[
  p('Албан ёсны монгол тодорхойлолт баталгаажаагүй хэсгийг хоосон үлдээсэн. Эмнэлгийн нэр томьёог шинээр орчуулаагүй.','Unverified official Mongolian definitions remain empty. Medical terminology was not newly translated.'),
  p('Монгол Улсын үнэлгээний одоогийн дүрэм, нэмэлт өөрчлөлтийг албан эхээр дахин нягтална. Эдгээр сэдвийг хуульд заасан ангилал гэж үзэхгүй.','Verify the current Mongolian assessment rules and amendments. These topics are not asserted to be statutory categories.'),
];
function make(slug:DisabilityCategory['slug'],mn:string,en:string,summary:string,facts:DisabilityCategory['facts'],notes=commonNotes):Seed {
  const used=new Set(facts.flatMap(f=>f.sources));
  const selected=Object.values(sources).filter(source=>used.has(source.id));
  return {title:p(mn,en),category:{type:'disability-category',version:1,slug,summary:p('',summary),facts,sources:selected,nativeReviewNeeded:true,livedExperienceReviewed:false,reviewNotes:notes}};
}
export const disabilityDrafts:Seed[]=[
  make('physical-mobility','Хөдөлгөөний бэрхшээл','Physical and mobility disabilities','Respect personal space, mobility choices and requested assistance.',[
    fact('meaning','','CRPD Article 1 includes long-term physical impairments interacting with barriers.',['crpd']),
    fact('barriers','Нэвтрэх боломжгүй орчин оролцоонд саад болдог.','Inaccessible environments can obstruct participation.',['icf']),
    fact('do','Тусламж хэрэгтэй эсэхийг эхлээд асуу.','Ask before helping.',['un']),
    fact('avoid','Хүний чадварыг гаднаас нь хараад бүү таамагла.','Do not infer ability from appearance.',['oas']),
    fact('language','','Use “wheelchair user”; avoid “wheelchair-bound”. Ask about individual preferences.',['language']),
  ]),
  make('visual','Харааны бэрхшээл','Visual disability: blind and low-vision people','Offer information in the person’s preferred accessible format.',[
    fact('meaning','','WHO describes vision impairment as an eye condition affecting clear sight.',['visual']),
    fact('barriers','Унших боломжгүй хэвлэмэл мэдээлэл саад болж болно.','Inaccessible print can be a barrier.',['crpd']),
    fact('do','Өөрийгөө танилцуулж, орчныг тайлбарла.','Introduce yourself and describe the surroundings.',['oas']),
    fact('avoid','Туслагчтай нь бус, тухайн хүнтэй шууд харилц.','Do not address only a companion.',['un']),
    fact('language','','Use the person’s preferred wording: “blind person” or “person with sight loss”.',['language']),
  ]),
  make('hearing','Сонсголын бэрхшээл','Hearing: Deaf and hard-of-hearing people','Ask whether the person prefers signing, text, captions or speech.',[
    fact('meaning','','WHO distinguishes degrees of hearing loss; some Deaf people use sign language.',['hearing']),
    fact('barriers','Зөвхөн дуугаар өгсөн мэдээлэл хүртээмжгүй байж болно.','Audio-only information can be inaccessible.',['crpd']),
    fact('do','Нүүрээ харагдахаар харилцаж, хүний сонгосон аргыг асуу.','Keep your face visible and ask about communication preferences.',['oas']),
    fact('avoid','Хэлмэрчтэй нь бус, тухайн хүнтэй шууд харилц.','Do not speak only to the interpreter.',['un']),
    fact('language','','Deaf and hard of hearing are not interchangeable labels. Mongolian Sign Language wording and community preferences need Deaf-led review.',['hearing','education']),
  ]),
  make('speech-communication','Хэл ярианы бэрхшээл','Speech and communication disabilities','Ask how the person wants to communicate and allow their chosen method.',[
    fact('meaning','','CRPD Article 2 includes accessible formats and alternative communication. A category-specific Mongolian definition needs review.',['crpd']),
    fact('barriers','Зөвхөн яриагаар хариу өгөх шаардлага саад болдог.','Requiring spoken responses can create a barrier.',['crpd']),
    fact('do','Тухайн хүнтэй шууд харилцаж, хэрэгтэй дэмжлэгийг асуу.','Address the person and ask what support they need.',['un']),
    fact('avoid','Харилцах аргад нь тулгуурлан чадварыг нь бүү дүгнэ.','Do not judge ability from communication method.',['oas']),
    fact('language','','Use person-specific wording about communication requirements; Mongolian terms require DPO review.',['language','education']),
  ]),
  make('intellectual','Оюуны хөгжлийн бэрхшээл','Intellectual disabilities','Use accessible information and treat adults as adults.',[
    fact('meaning','','',['terms']),
    fact('barriers','Ойлгоход төвөгтэй мэдээлэл саад болдог.','Complex, inaccessible information can be a barrier.',['crpd']),
    fact('do','Насанд хүрсэн хүнтэй насанд нь тохируулан харилц.','Treat adults as adults.',['un']),
    fact('avoid','Тухайн хүний оронд бусдаар байнга бүү хариулуул.','Do not routinely direct questions only to a companion.',['oas']),
    fact('language','','Use respectful, person-specific terms. Official Mongolian definitions and community-preferred wording need review.',['language','terms']),
  ]),
  make('psychosocial','','Psychosocial disability and mental health','Respect choice, privacy and individual communication requirements.',[
    fact('meaning','','A mental health condition is not identical to psychosocial disability. WHO describes disability through interaction with personal and environmental factors.',['disability']),
    fact('barriers','Ялгаварлан гадуурхсан хандлага оролцоонд саад болдог.','Discriminatory attitudes can obstruct participation.',['mental']),
    fact('do','Шаардлагатай дэмжлэгийг тухайн хүнээс асуу.','Ask the person what support they need.',['un']),
    fact('avoid','Хүнийг аюултай гэж хэвшмэл ойлголтоор бүү дүрсэл.','Do not stereotype the person as dangerous.',['language']),
    fact('language','','Prefer the person’s own wording. The official Mongolian category term has not been verified.',['language']),
  ]),
  make('autism-neurodevelopmental','','Autism and other neurodevelopmental conditions','Ask about communication and sensory access without assuming identical needs.',[
    fact('meaning','','WHO describes autism as a diverse group of brain-development-related conditions. Abilities and needs differ. This does not define every neurodevelopmental condition.',['autism']),
    fact('barriers','','Social attitudes and insufficient support can restrict inclusion.',['autism']),
    fact('do','Шаардлагатай дэмжлэгийг тухайн хүнээс асуу.','Ask about the person’s access requirements.',['un']),
    fact('avoid','','Do not assume all autistic people have the same abilities or needs.',['autism']),
    fact('language','','“Autistic person” and “person with autism” preferences vary. The broader Mongolian category label remains empty pending native and DPO review.',['language','mn-autism']),
  ]),
  make('multiple-deafblind','','Multiple disabilities and deafblindness','Ask about the individual’s communication methods and access requirements.',[
    fact('meaning','','',['deafblind']),
    fact('barriers','','Information offered through only one inaccessible channel can exclude a person.',['deafblind']),
    fact('do','','Ask about individual communication methods; guide interpreters may support deafblind communication.',['deafblind']),
    fact('avoid','Харилцах аргад нь тулгуурлан чадварыг нь бүү дүгнэ.','Do not infer ability from communication method.',['oas']),
    fact('language','','Use the person’s chosen description. Do not treat deafblindness as a synonym for every form of multiple disability. Mongolian terminology needs review.',['language','deafblind']),
  ]),
  make('long-term-health','','Long-term health conditions','Ask about access requirements without requiring personal medical details.',[
    fact('meaning','','WHO’s ICF considers functioning in context, including environmental factors. A health-condition name alone is not a complete description of disability.',['icf']),
    fact('barriers','','Social and environmental barriers can restrict equal participation.',['disability']),
    fact('do','Тухайн хүнд ямар дэмжлэг хэрэгтэйг асуу.','Ask about access requirements.',['un']),
    fact('avoid','','Do not require disclosure of irrelevant personal health information.',['language']),
    fact('language','','Use the person’s preferred description rather than reducing them to a medical label. Official Mongolian terminology remains unverified.',['language']),
  ]),
];

// Candidate sources are review notes, not evidence asserted to have been read successfully.
export const disabilityReviewSources=[sources.law,sources.assessment,sources.education,sources.mnAutism];
