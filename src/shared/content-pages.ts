import type {TranslationKey} from './translations';
export type ContentPage = {path:string;section:'understand'|'help'|'reach';title:TranslationKey;summary:TranslationKey;points:TranslationKey[];claimIds?:string[];links?:{path:string;label:TranslationKey}[]};
export const contentPages:ContentPage[]=[
 {path:'/understand/deaf-hard-of-hearing',section:'understand',title:'deaf_title',summary:'deaf_summary',points:['deaf_todo'],claimIds:['msl-mother-tongue','msl-draft-2026','msl-budget-2027','msl-tv-2023']},
 {path:'/understand',section:'understand',title:'understand',summary:'understand_summary',points:[]},
 {path:'/understand/needs',section:'understand',title:'needs_title',summary:'needs_summary',points:['needs_one','needs_two','needs_three'],claimIds:['commission-2023']},
 {path:'/understand/respectful-language',section:'understand',title:'language_title',summary:'language_summary',points:['language_one','language_two','language_three']},
 {path:'/understand/myths',section:'understand',title:'myths_title',summary:'myths_summary',points:['myths_one','myths_two','myths_three']},
 {path:'/understand/rights',section:'understand',title:'rights_title',summary:'rights_sources_summary',points:[],claimIds:['law-2016','revision-status','reported-draft-return','accessibility-draft','authority-established','expert-concerns-2023','assessment-process']},
 {path:'/understand/voices',section:'understand',title:'voices_title',summary:'voices_summary',points:['voices_one','voices_two']},
 {path:'/help',section:'help',title:'help',summary:'help_summary',points:[]},
 {path:'/help/families',section:'help',title:'families_title',summary:'families_summary',points:['families_one','families_two','families_three'],claimIds:['pension-online'],links:[{path:'/guides',label:'preparation_checklist'},{path:'/services',label:'find_support_nav'}]},
 {path:'/help/friends-volunteers',section:'help',title:'friends_title',summary:'friends_summary',points:['friends_one','friends_two','friends_three']},
 {path:'/help/employers-schools',section:'help',title:'employers_title',summary:'employers_summary',points:['employers_one','employers_two'],claimIds:['employment-quota','employment-protections','reported-quota-compliance']},
 {path:'/help/support-organisations',section:'help',title:'support_org_title',summary:'support_org_summary',points:['support_org_one','support_org_two','support_org_three'],links:[{path:'/services',label:'find_support_nav'}]},
 {path:'/reach',section:'reach',title:'reach',summary:'reach_summary',points:[],links:[{path:'/contact',label:'contact_page'},{path:'/for-organisations',label:'for_organisations'}]},
 {path:'/reach/communication',section:'reach',title:'communication_title',summary:'communication_summary',points:['communication_one','communication_two','communication_three'],claimIds:['sign-language-2023'],links:[{path:'/understand/deaf-hard-of-hearing',label:'deaf_title'},{path:'/contact',label:'contact_page'}]},
 {path:'/reach/accessible-formats',section:'reach',title:'formats_title',summary:'formats_summary',points:['formats_one','formats_two','formats_three']},
 {path:'/reach/offline',section:'reach',title:'offline_title',summary:'offline_summary',points:['offline_one','offline_two','offline_three'],links:[{path:'/guides',label:'preparation_checklist'},{path:'/for-organisations',label:'for_organisations'}]},
];
