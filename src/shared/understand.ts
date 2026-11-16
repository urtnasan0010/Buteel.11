import type { Text } from './data';

type HumanReview = { reviewed_by: string | null; reviewed_at: string | null };
// checkedOn retains the historical automated source check. It is not a human
// review date. Only a named person's explicit review may fill the review fields.
const source = (url: string, mn: string, en: string, review: HumanReview = { reviewed_by: null, reviewed_at: null }) => ({
  url, title: { mn, en }, checkedOn: '2026-11-16', added_at: '2026-11-16', ...review,
});
export function sourceDisplayDate(item: HumanReview & { added_at: string }) {
  return item.reviewed_by?.trim() && item.reviewed_at && /^\d{4}-\d{2}-\d{2}$/.test(item.reviewed_at)
    && Number.isFinite(Date.parse(item.reviewed_at))
    ? { kind: 'reviewed' as const, date: item.reviewed_at, reviewer: item.reviewed_by }
    : { kind: 'added' as const, date: item.added_at, reviewer: null };
}
export const understandSources = {
  who: source('https://www.who.int/news-room/fact-sheets/detail/disability-and-health', 'ДЭМБ — Хөгжлийн бэрхшээл', 'WHO — Disability'),
  spinal: source('https://unitedspinal.org/top-10-disability-etiquette/', 'United Spinal — Хүндэтгэлтэй харилцах', 'United Spinal — Disability etiquette'),
  mobility: source('https://www.msd.govt.nz/about-msd-and-our-work/work-programmes/accessibility/quick-reference-guides/disability-etiquette.html', 'Шинэ Зеландын Нийгмийн хөгжлийн яам — Харилцааны зөвлөмж', 'New Zealand Ministry of Social Development — Disability etiquette'),
  vision: source('https://www.rnib.org.uk/living-with-sight-loss/supporting-others/guiding-a-blind-or-partially-sighted-person/', 'RNIB — Харааны бэрхшээлтэй хүнийг хөтлөх', 'RNIB — Guiding a blind or partially sighted person'),
  hearing: source('https://rnid.org.uk/information-and-support/deaf-awareness/how-to-communicate-with-deaf-people-hearing-loss/', 'RNID — Сонсголын бэрхшээлтэй хүнтэй харилцах', 'RNID — Communicating with deaf people and people with hearing loss'),
  deafblind: source('https://deafblind.org.uk/how-to-communicate-with-a-person-who-is-deafblind/', 'Deafblind UK — Хараа, сонсголын хавсарсан бэрхшээлтэй хүнтэй харилцах', 'Deafblind UK — How to communicate with a person who is deafblind'),
  deafblindMethods: source('https://deafblind.org.uk/get_support/communication/', 'Deafblind UK — Харилцааны аргууд', 'Deafblind UK — Communication methods'),
  speech: source('https://www.asha.org/about/press-room/articles/tips-for-communicating-with-adults-who-have-a-speech-or-language-disorder/', 'ASHA — Хэл, ярианы бэрхшээлтэй хүнтэй харилцах', 'ASHA — Communicating with adults with speech or language disorders'),
  intellectual: source('https://www.aaidd.org/intellectual-disability/definition', 'AAIDD — Оюуны хөгжлийн бэрхшээлийн тодорхойлолт', 'AAIDD — Defining intellectual disability'),
  respect: source('https://www.listenincluderespect.com/respectful-communication', 'Listen Include Respect — Хүндэтгэлтэй харилцаа', 'Listen Include Respect — Respectful communication'),
  autism: source('https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders', 'ДЭМБ — Аутизм', 'WHO — Autism'),
  autismCommunication: source('https://www.autism.org.uk/advice-and-guidance/about-autism/autism-and-communication', 'National Autistic Society — Аутизм ба харилцаа', 'National Autistic Society — Autism and communication'),
  adhd: source('https://www.nhs.uk/conditions/adhd-adults/', 'NHS — Насанд хүрэгчдийн ADHD', 'NHS — ADHD in adults'),
  dyslexia: source('https://www.nhs.uk/conditions/dyslexia-in-children/', 'NHS — Хүүхдийн дислекси', 'NHS — Dyslexia in children'),
  dyslexiaSupport: source('https://www.bdadyslexia.org.uk/advice/employers/how-can-i-support-my-dyslexic-employees/reasonable-adjustments-in-the-workplace', 'British Dyslexia Association — Ажлын байрны тохируулга', 'British Dyslexia Association — Workplace adjustments'),
  psychosocial: source('https://www.health.nsw.gov.au/mentalhealth/psychosocial/foundations/Pages/psychosocial-whatis.aspx', 'NSW Health — Сэтгэц-нийгмийн бэрхшээл', 'NSW Health — Psychosocial disability'),
  mentalSupport: source('https://www.nhs.uk/every-mind-matters/supporting-others/helping-others/', 'NHS — Сэтгэцийн эрүүл мэндийн хүндрэлтэй хүнийг дэмжих', 'NHS — Helping others with mental health problems'),
  epilepsy: source('https://www.who.int/en/news-room/fact-sheets/detail/epilepsy', 'ДЭМБ — Эпилепси', 'WHO — Epilepsy'),
  seizure: source('https://www.cdc.gov/epilepsy/first-aid-for-seizures/', 'CDC — Таталтын үеийн анхны тусламж', 'CDC — First aid for seizures'),
  seizureNhs: source('https://www.nhs.uk/symptoms/what-to-do-if-someone-has-a-seizure-fit/', 'NHS — Хүн татах үед яах вэ?', 'NHS — What to do if someone has a seizure'),
  ambulance: source('https://www.103.ub.gov.mn/a/30', 'Нийслэлийн Түргэн тусламжийн төв — 103', 'Ulaanbaatar Emergency Medical Centre — 103'),
  fatigue: source('https://www.cdc.gov/me-cfs/signs-symptoms/', 'CDC — ME/CFS-ийн шинж тэмдэг', 'CDC — Symptoms of ME/CFS'),
  physicalWeb: source('https://www.w3.org/WAI/people-use-web/abilities-barriers/physical/', 'W3C — Хөдөлгөөн ба цахим саад', 'W3C — Physical abilities and web barriers'),
  visualWeb: source('https://www.w3.org/WAI/people-use-web/abilities-barriers/visual/', 'W3C — Хараа ба цахим саад', 'W3C — Visual abilities and web barriers'),
  auditoryWeb: source('https://www.w3.org/WAI/people-use-web/abilities-barriers/auditory/', 'W3C — Сонсгол ба цахим саад', 'W3C — Auditory abilities and web barriers'),
  captions: source('https://www.w3.org/WAI/media/av/captions/', 'W3C — Хадмал ба автомат хадмалын шалгалт', 'W3C — Captions and checking automatic captions'),
  speechWeb: source('https://www.w3.org/WAI/people-use-web/abilities-barriers/speech/', 'W3C — Яриа ба цахим саад', 'W3C — Speech abilities and web barriers'),
  cerebralPalsy: source('https://www.scope.org.uk/advice-and-support/cerebral-palsy-for-young-people', 'Scope — Тархины саажилттай залуусын туршлага', 'Scope — Cerebral palsy for young people'),
  meetings: source('https://rnid.org.uk/employers-and-professionals/accessible-meetings/', 'RNID — Хүртээмжтэй уулзалт', 'RNID — Deaf-aware meetings'),
  aac: source('https://helpingyoucommunicate.org/article/augmentative-and-alternative-communication-aac', 'ASHA/CHSA — Нэмэлт болон орлуулах харилцаа', 'ASHA/CHSA — Augmentative and alternative communication'),
  communicationPartners: source('https://www.speechpathologyaustralia.org.au/Communication_Hub/Supporting-communication/Tips_for_communication_partners.aspx', 'Speech Pathology Australia — Харилцааны хамтрагчийн зөвлөмж', 'Speech Pathology Australia — Communication partner tips'),
  aphasia: source('https://www.nhs.uk/conditions/aphasia/', 'NHS — Афази', 'NHS — Aphasia'),
  decisions: source('https://www.listenincluderespect.com/decision-making', 'Listen Include Respect — Шийдвэр гаргалт', 'Listen Include Respect — Decision making'),
  information: source('https://www.listenincluderespect.com/information', 'Listen Include Respect — Мэдээллийн хүртээмж', 'Listen Include Respect — Accessible information'),
  overload: source('https://www.leicspart.nhs.uk/autism-space/health-and-lifestyle/meltdowns-and-shutdowns/', 'NHS Trust — Хэт ачааллын хариу үйлдэл', 'NHS Trust — Autistic meltdowns and shutdowns'),
  masking: source('https://www.autism.org.uk/advice-and-guidance/behaviour/masking', 'National Autistic Society — Онцлогоо далдлах', 'National Autistic Society — Masking'),
  executive: source('https://add.org/executive-function-disorder/', 'ADDA — Гүйцэтгэх үйл ажиллагаа', 'ADDA — Executive functioning'),
  mentalConditions: source('https://www.who.int/news-room/fact-sheets/detail/mental-disorders', 'ДЭМБ — Сэтгэцийн эрүүл мэндийн эмгэгүүд', 'WHO — Mental disorders'),
  depressionSupport: source('https://www.mind.org.uk/information-support/types-of-mental-health-problems/depression/for-friends-and-family/', 'Mind — Сэтгэл гутралтай хүнийг дэмжих', 'Mind — Supporting someone with depression'),
  anxietySupport: source('https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-problems/how-to-help-someone-who-has-anxiety/', 'Mind — Түгшүүртэй хүнийг дэмжих', 'Mind — Supporting someone with anxiety'),
  psychosisSupport: source('https://www.mind.org.uk/information-support/types-of-mental-health-problems/psychosis/helping-someone-whos-experiencing-psychosis/', 'Mind — Психозын үед дэмжих', 'Mind — Supporting someone with psychosis'),
  mentalWork: source('https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work', 'ДЭМБ — Ажлын байрны сэтгэцийн эрүүл мэнд', 'WHO — Mental health at work'),
  photosensitivity: source('https://www.epilepsy.com/what-is-epilepsy/seizure-triggers/photosensitivity', 'Epilepsy Foundation — Гэрэлд мэдрэг байдал', 'Epilepsy Foundation — Photosensitivity'),
  seizureEmergency: source('https://www.epilepsy.com/recognition/emergency-help', 'Epilepsy Foundation — Яаралтай тусламж', 'Epilepsy Foundation — Emergency help'),
  pain: source('https://www.iasp-pain.org/publications/iasp-news/iasp-announces-revised-definition-of-pain/', 'IASP — Өвдөлтийн тодорхойлолт', 'IASP — Definition of pain'),
  longCovid: source('https://www.who.int/teams/health-care-readiness/post-covid-19-condition', 'ДЭМБ — Long COVID-ийн сэргээн засалт', 'WHO — Post COVID-19 rehabilitation'),
  energy: source('https://www.nhs.uk/conditions/chronic-fatigue-syndrome-cfs/treatment/', 'NHS — ME/CFS ба энергийн зохицуулалт', 'NHS — ME/CFS and energy management'),
  steps: source('https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/', 'W3C — Алхамчилсан заавар', 'W3C — Step-by-step instructions'),
  time: source('https://www.w3.org/WAI/WCAG22/Understanding/enough-time.html', 'W3C — Хангалттай хугацаа', 'W3C — Enough time'),
  flashes: source('https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html', 'W3C — Анивчилтын аюулгүй байдал', 'W3C — Flashing content safety'),
  mongolianReading: source('https://moe.gov.mn/post/132618', 'Боловсролын яам — JICA START 2', 'Ministry of Education — JICA START 2 (Mongolian)'),
};
export type UnderstandSourceId = keyof typeof understandSources;
export type DisabilityTopic = {
  id: string;
  title: Text;
  explanation: Text;
  experiences: Text;
  misunderstanding: Text;
  tips: Text[];
  sources: UnderstandSourceId[];
};
const text = (mn: string, en: string): Text => ({ mn, en });

export const understandCopy = {
  title: text('Хөгжлийн бэрхшээлийг ойлгох', 'Understanding disability'),
  intro: text('Хүн бүрийн туршлага өөр. Хэрхэн харилцах, орчны саадыг багасгах, тохирох дэмжлэгийг хамтдаа сонгох талаар суралцаарай.', 'Everyone has a different experience. Learn how to communicate, reduce barriers and agree on support together.'),
  overlap: text('Эдгээр 12 сэдэв давхцаж болно. Нэг хүн хэд хэдэн бэрхшээлтэй байж болно. Онош дангаараа хүний чадвар, хүсэл сонирхол, дэмжлэгийн хэрэгцээг тодорхойлохгүй. Орчны саад, хүртээмж ч оролцоонд нөлөөлнө.', 'These 12 topics can overlap. A person may experience several disabilities. A diagnosis alone does not describe their abilities, preferences or support needs. Barriers and accessibility also affect participation.'),
  distinct: text('Оюуны хөгжлийн бэрхшээл, аутизм, ADHD, дислекси, сэтгэц-нийгмийн бэрхшээл нь өөр өөр ойлголт. Аль нэг нь байгаа нь бусад нь заавал байна гэсэн үг биш.', 'Intellectual disability, autism, ADHD, dyslexia and psychosocial disability are distinct. Having one does not mean someone necessarily has another.'),
  respect: text('Насанд хүрэгчид болон хүүхэдтэй өөртэй нь шууд, насанд нь тохирсон хүндэтгэлтэй хэлээр харилц. Ямар нэршил, харилцааны арга, тусламжийг хүсэж байгааг асууж, сонголтыг нь хүндэтгэ.', 'Speak directly to adults and children with respect and age-appropriate language. Ask which terms, communication methods and help they prefer, and respect their choices.'),
  topics: text('12 сэдэвтэй танилцах', 'Explore the 12 topics'),
  details: text('Дэмжлэг ба эх сурвалж', 'Support and sources'),
  experiences: text('Туршлага, хэрэгцээний ялгаа', 'Different experiences and needs'),
  misunderstanding: text('Түгээмэл ташаа ойлголт', 'Common misunderstandings'),
  tips: text('Харилцаа, дэмжлэгийн зөвлөмж', 'Communication and support tips'),
  dailyLife: text('Өдөр тутмын туршлага', 'Everyday experiences'),
  educationWork: text('Сургууль, ажлын орчны дэмжлэг', 'Support at school and work'),
  digitalAccess: text('Цахим хүртээмж', 'Digital access'),
  furtherDetails: text('Илүү дэлгэрүүлж ойлгох нь', 'Understanding more'),
  sharedSupport: text('Олон хэрэгцээнд нийцэх дэмжлэг', 'Support across different needs'),
  reading: text('Монгол хэлээр нэмэлт унших', 'Further reading in Mongolian'),
  readingNote: text('Боловсролын яамны JICA START 2 танилцуулга нь 2021–2022 оны бичил төслүүдийн хараа, сонсгол болон бусад бэрхшээлтэй хүүхдийн боловсролын хэрэглэгдэхүүний холбоосуудтай. Энэ түүхэн материал нь өнөөгийн үйлчилгээний хүртээмжийг батлахгүй.', 'The Ministry of Education’s JICA START 2 overview links to educational materials from 2021–2022 projects for children with sight, hearing and other disabilities. This historical resource does not establish current service availability.'),
  sources: text('Эх сурвалж', 'Sources'),
  checked: text('Шалгасан огноо', 'Checked on'),
  added: text('Эх сурвалж нэмсэн огноо', 'Source added on'),
  reviewed: text('Хүн хянасан огноо', 'Reviewed by a person on'),
  topicIndex: text('Сэдвээ сонгох', 'Choose a topic'),
  glossary: text('Нэр томьёоны товч тайлбар', 'Terms in brief'),
  medicalReview: text('Таталтын анхны тусламжийн монгол орчуулгыг эмнэлгийн мэргэжилтэн хараахан хянаагүй.', 'A medical professional has not yet reviewed the Mongolian seizure first-aid translation.'),
  sourceLanguage: text('Эх сурвалжууд ихэвчлэн англи хэлээр байна.', 'Most sources are in English.'),
  firstAid: text('Таталтын үед туслах', 'Helping during a seizure'),
  emergency: text('Хэзээ түргэн тусламж дуудах вэ?', 'When to call an ambulance'),
  emergencyText: text('Таталт 5 минут хүрэх буюу түүнээс удах; тухайн хүний ердийнхөөс удаан үргэлжлэх; ухаан бүрэн сэргэхгүйгээр дахин татах; амьсгалахад хүндрэлтэй болох эсвэл дараа нь сэргэхгүй байх; гэмтэх; усанд татах; анх удаа татах; жирэмсэн байх; эсвэл чихрийн шижинтэй хүн ухаан алдах үед түргэн тусламж дууд. Бусад аюулын шинж байвал 5 минут хүлээхгүй. Монголд 103, бусад улсад орон нутгийн яаралтай тусламжийн дугаар руу залга.', 'Call an ambulance at 5 minutes or longer, if a seizure lasts longer than usual, seizures repeat without full recovery, breathing becomes difficult or the person does not wake afterwards, injury occurs, it happens in water, it is a first seizure, the person is pregnant, or has diabetes and loses consciousness. Do not wait 5 minutes when other danger signs are present. In Mongolia call 103; elsewhere use the local emergency number.'),
  firstAidNote: text('Энэ бол анхны тусламжийн товч мэдээлэл. Сургалт болон тухайн хүний эмчтэйгээ тохирсон төлөвлөгөөг орлохгүй. Яаралтай үед дуудлага хүлээн авагчийн зааврыг дага.', 'This is a brief first-aid guide. It does not replace training or the person’s agreed medical plan. In an emergency follow the dispatcher’s instructions.'),
  review: text('Хянуулах зүйл', 'Content review'),
  reviewText: text('Монгол хэлний нэр томьёо, орчуулгыг монгол хэлтэй редактор болон тухайн туршлагатай хүмүүс, тэдний төлөөллийн байгууллагаар хянуулах шаардлагатай. Таталтын анхны тусламжийн монгол орчуулгыг эмнэлгийн мэргэжилтэн хараахан хянаагүй. Энэ хуудас нь ерөнхий боловсролын мэдээлэл бөгөөд оношлох заавар биш.', 'Mongolian terminology and translation still need review by a native-language editor, people with lived experience and their representative organisations. A clinician has not yet reviewed the Mongolian seizure first-aid translation. This is general educational information, not a diagnostic guide.'),
  posts: text('Холбогдох нийтлэлүүд', 'Related posts'),
} satisfies Record<string, Text>;

const topicSummaries: DisabilityTopic[] = [
  {
    id: 'mobility', title: text('Хөдөлгөөний болон тулгуур эрхтний бэрхшээл', 'Physical and mobility disabilities'),
    explanation: text('Алхах, тэнцвэрээ хадгалах, юм барих зэрэг хөдөлгөөнд хүндрэлтэй байж болно.', 'Moving around, balancing or using hands to hold things may be difficult.'),
    experiences: text('Зарим хүн тэргэнцэр, таяг хэрэглэдэг; зарим нь хэрэгсэлгүй ч амрах, хүртээмжтэй зам хэрэгтэй байдаг.', 'Some people use wheelchairs or walking aids; others need rest or accessible routes without using an aid.'),
    misunderstanding: text('Хэрэглэж буй туслах хэрэгслээр нь хүний бүх чадварыг дүгнэж болохгүй.', 'A mobility aid does not tell you everything someone can do.'),
    tips: [text('Туслахын өмнө хэрэгтэй эсэх, яаж туслахыг асуу. Хэрэгслийг нь зөвшөөрөлгүй хөдөлгөхгүй.', 'Ask whether and how to help. Do not move someone’s equipment without permission.'), text('Гарц, налуу замыг чөлөөтэй байлга. Хоёуланд тухтай байрлалаас ярилц.', 'Keep entrances and ramps clear. Find a comfortable position for both of you to talk.')],
    sources: ['mobility', 'spinal'],
  },
  {
    id: 'vision', title: text('Хараагүйдэл болон сул хараа', 'Blindness and low vision'),
    explanation: text('Харааны бэрхшээл нь харах, унших, орчноо баримжаалахад нөлөөлж болно.', 'Sight loss can affect seeing, reading and finding your way around.'),
    experiences: text('Харааны хэмжээ, тохирох мэдээллийн хэлбэр хүн бүрд өөр. Хөтлүүлэх хэрэгцээг өөрөөс нь асуу.', 'The amount someone sees and their preferred information format vary. Ask whether they want guiding.'),
    misunderstanding: text('Харааны бэрхшээлтэй хүн бүр огт харахгүй эсвэл байнга хөтлүүлэх шаардлагатай биш.', 'Not everyone with sight loss sees nothing or always needs a guide.'),
    tips: [text('Өөрийгөө танилцуул; холдохдоо хэл. Чиглэл, саадыг тодорхой тайлбарла.', 'Introduce yourself and say when you leave. Describe directions and obstacles clearly.'), text('Хөтлөхөөс өмнө яаж хөтлүүлэхийг хүсэж байгааг асуу; гэнэт гараас нь татахгүй.', 'Ask how they prefer to be guided; do not suddenly pull their arm.')],
    sources: ['vision', 'mobility'],
  },
  {
    id: 'hearing', title: text('Сонсголгүйдэл болон сонсгол бууралт', 'Deafness and hearing loss'),
    explanation: text('Сонсголын ялгаа нь яриа, дуу авианы мэдээлэл авахад нөлөөлдөг.', 'Differences in hearing affect access to speech and sound-based information.'),
    experiences: text('Яриа, уруул унших, дохионы хэл, бичвэр зэрэг өөр өөр арга тохирно. Тухайн хүний хэрэглэдэг дохионы хэлийг асуу.', 'Speech, lipreading, sign language or text may suit different people. Ask which sign language the person uses.'),
    misunderstanding: text('Бүх хүн ижил аргаар харилцахгүй. Чанга хашхирах нь ойлголцоход туслахгүй.', 'There is no single communication method for everyone. Shouting does not help understanding.'),
    tips: [text('Анхаарлыг нь татаж, нүүрээ харуулан тод, хэвийн хэмнэлээр ярь.', 'Get their attention, face them and speak clearly at a natural pace.'), text('Чимээг багасга. Бичвэр, хадмал, хэлмэрч хэрэгтэй эсэхийг асуу; ойлгохгүй бол өөрөөр тайлбарла.', 'Reduce noise. Ask about text, captions or an interpreter; rephrase if needed.')],
    sources: ['hearing'],
  },
  {
    id: 'deafblind', title: text('Хараа, сонсголын хавсарсан бэрхшээл', 'Deafblindness'),
    explanation: text('Хараа болон сонсголын бэрхшээл хавсарснаар мэдээлэл авах, харилцахад нэмэлт саад үүснэ.', 'Combined sight and hearing loss creates additional barriers to information and communication.'),
    experiences: text('Зарим хүн хараа, сонсголоо тодорхой хэмжээнд ашигладаг. Мэдээлэл хүлээн авах, хариулахдаа өөр өөр арга хэрэглэж болно.', 'Some people have useful sight or hearing. They may receive information and express themselves in different ways.'),
    misunderstanding: text('Хараа, сонсголоо бүрэн алдсан байх албагүй; нэг л арга хүн бүрд тохирохгүй.', 'Deafblindness does not require total loss of both senses; one method will not suit everyone.'),
    tips: [text('Өөрийгөө танилцуулж, тохирох аргыг асуу. Хүрэхийн өмнө зөвшөөрөл ав.', 'Introduce yourself and ask about preferred methods. Get permission before touching.'), text('Гэрэл, чимээг тохируулж, хариулах хугацаа өг. Хэрэглэдэг хүрэлцэхүйн дохио, бичвэр эсвэл яриаг нь дэмж.', 'Adjust light and noise, allow time, and support their preferred tactile signing, text or speech.')],
    sources: ['deafblind', 'deafblindMethods'],
  },
  {
    id: 'communication', title: text('Хэл, яриа, харилцааны бэрхшээл', 'Speech, language and communication disabilities'),
    explanation: text('Ярих, үгээ илэрхийлэх эсвэл бусдын хэлснийг ойлгоход хүндрэлтэй байж болно.', 'Speaking, expressing a message or understanding language may be difficult.'),
    experiences: text('Зарим хүнд ойлгоход, заримд нь илэрхийлэхэд, эсвэл хоёуланд нь дэмжлэг хэрэгтэй. Бичвэр, зураг, дохио тохирч болно.', 'Some people need help understanding, expressing themselves, or both. Writing, pictures or gestures may help.'),
    misunderstanding: text('Ярианы байдлаар нь хүний ойлгох чадвар, бүх боломжийг дүгнэж болохгүй.', 'How someone speaks does not tell you everything they understand or can do.'),
    tips: [text('Хариулах хугацаа өг. Өгүүлбэрийг нь дуусгах гэж бүү яар.', 'Allow time to respond. Do not rush to finish their sentences.'), text('Ойлгосон дүр үзүүлэхгүй. Ойлгосон хэсгээ давтаж, зөв эсэхийг лавла; өөр аргаар илэрхийлэх боломж өг.', 'Do not pretend to understand. Repeat what you understood, check it and offer other ways to communicate.')],
    sources: ['speech', 'spinal'],
  },
  {
    id: 'intellectual', title: text('Оюуны хөгжлийн бэрхшээл', 'Intellectual disabilities'),
    explanation: text('Хөгжлийн үеэс эхэлж, суралцах, учир шалтгааныг ойлгох болон өдөр тутмын чадварт нөлөөлдөг.', 'This begins during development and affects learning, reasoning and everyday practical skills.'),
    experiences: text('Хүн бүр давуу талтай бөгөөд дэмжлэгийн хэмжээ өөр. Тохирсон, тогтвортой дэмжлэг оролцоог нэмэгдүүлнэ.', 'Everyone has strengths and different support needs. Suitable ongoing support can improve participation.'),
    misunderstanding: text('Суралцаж, сонголт хийж чадахгүй гэж үзэх нь буруу. Насанд хүрсэн хүнийг хүүхэд мэт харьцаж болохгүй.', 'It is wrong to assume someone cannot learn or make choices. Do not treat adults as children.'),
    tips: [text('Өөртэй нь шууд ярь. Нэг удаад нэг санааг насанд нь тохирсон энгийн үгээр тайлбарла.', 'Speak directly to the person. Explain one idea at a time with simple, age-appropriate words.'), text('Зураг, жишээ ашиглаж, хариулах хугацаа өг. Өөрийнх нь сонголтыг сонс.', 'Use pictures or examples, allow response time and listen to their choices.')],
    sources: ['intellectual', 'respect', 'speech'],
  },
  {
    id: 'autism', title: text('Аутизм', 'Autism'),
    explanation: text('Аутизм нь тархины хөгжилтэй холбоотой бөгөөд харилцаа, өөрчлөлт болон мэдрэхүйн туршлагад нөлөөлж болно.', 'Autism relates to brain development and can affect communication, responses to change and sensory experiences.'),
    experiences: text('Чадвар, дэмжлэгийн хэрэгцээ хүн бүрд өөр, цаг хугацаанд өөрчлөгдөж болно. Зарим хүн ярианаас өөр арга хэрэглэдэг.', 'Abilities and support needs vary and can change over time. Some people use communication other than speech.'),
    misunderstanding: text('Нүд рүү харахгүй байгаа нь сонсохгүй байна гэсэн үг биш. Аутизм дангаараа оюуны чадварыг тодорхойлохгүй.', 'Avoiding eye contact does not mean someone is not listening. Autism alone does not define intellectual ability.'),
    tips: [text('Тодорхой хэллэг хэрэглэж, боловсруулах хугацаа өг. Нүд рүү харахыг шаардахгүй.', 'Use clear language, allow processing time and do not demand eye contact.'), text('Өөрчлөлтийг урьдчилан тайлбарла. Чимээ, гэрлийн тохируулгыг өөртэй нь ярилц.', 'Explain changes in advance. Discuss adjustments to noise and lighting.')],
    sources: ['autism', 'autismCommunication'],
  },
  {
    id: 'adhd', title: text('ADHD — Анхаарал дутмагших, хэт хөдөлгөөнтөх эмгэг', 'ADHD'),
    explanation: text('ADHD нь анхаарлаа зохицуулах, цагаа төлөвлөх, импульсээ хянахад нөлөөлж болно.', 'ADHD can affect attention, time management and impulse control.'),
    experiences: text('Зарим хүнд анхаарлын хүндрэл, заримд нь тайван суухад хүндрэл илүү; эсвэл хоёулаа илэрнэ.', 'Inattention, restlessness or both may be more noticeable in different people.'),
    misunderstanding: text('ADHD-тай хүн бүр хэт хөдөлгөөнтэй байдаггүй. Энэ нь зөвхөн хүүхдэд тохиолддоггүй.', 'Not everyone with ADHD is hyperactive. ADHD also affects adults.'),
    tips: [text('Аман зааврыг бичгээр давхар өг. Ажлыг жижиг алхмаар төлөвлөхөд туслахыг санал болго.', 'Give written as well as spoken instructions. Offer help planning tasks in smaller steps.'), text('Чимээ багатай орчин, өөрт нь тохирох сануулгыг хамт сонго.', 'Agree on a quieter environment and reminders that suit the person.')],
    sources: ['adhd'],
  },
  {
    id: 'learning', title: text('Дислекси болон суралцахуйн өвөрмөц хүндрэл', 'Dyslexia and specific learning difficulties'),
    explanation: text('Суралцахуйн өвөрмөц хүндрэл нь тодорхой чадварт нөлөөлнө. Жишээ нь дислекси унших, зөв бичихэд хүндрэл үүсгэдэг.', 'Specific learning difficulties affect particular skills. Dyslexia, for example, affects reading and spelling.'),
    experiences: text('Унших, бичих, мэдээлэл боловсруулахад хэрэгтэй хугацаа, тохирох хэрэгсэл өөр өөр.', 'The time and tools needed for reading, writing and processing information differ.'),
    misunderstanding: text('Дислекси нь оюуны хөгжлийн бэрхшээл биш; унших хурд, зөв бичих чадвар нь оюуны чадварыг хэмжихгүй.', 'Dyslexia is distinct from intellectual disability; reading speed and spelling do not measure intelligence.'),
    tips: [text('Уншиж, бичих хугацаа өг. Гол санааг тодруулсан энгийн заавар хэрэглэ.', 'Allow time for reading and writing. Give clear instructions with key points highlighted.'), text('Дуугаар унших хэрэгсэл зэрэг өөр хэлбэр тохирох эсэхийг асуу; нэг тохируулгыг бүгдэд тулгахгүй.', 'Ask whether alternatives such as text-to-speech help; do not impose the same adjustment on everyone.')],
    sources: ['dyslexia', 'dyslexiaSupport'],
  },
  {
    id: 'psychosocial', title: text('Сэтгэц-нийгмийн бэрхшээл', 'Psychosocial disabilities'),
    explanation: text('Сэтгэцийн эрүүл мэндийн хүндрэл болон орчин, нийгмийн саад харилцан нөлөөлж, оролцоог хязгаарлаж болно.', 'Mental health difficulties interacting with social and environmental barriers can restrict participation.'),
    experiences: text('Анхаарал, эрч хүч, бусадтай харилцахад хэрэгтэй дэмжлэг өөр өөр. Өөрийн туршлагыг хэрхэн нэрлэхийг нь хүндэтгэ.', 'Support for concentration, stamina and interaction differs. Respect how people describe their experience.'),
    misunderstanding: text('Зөвхөн оношоор нь хэрэгцээг тогтоохгүй. Сэтгэц-нийгмийн бэрхшээл нь оюуны хөгжлийн бэрхшээлтэй ижил биш.', 'A diagnosis alone does not establish support needs. Psychosocial disability is distinct from intellectual disability.'),
    tips: [text('Шүүмжлэлгүй сонс. Ярихыг хүсэхгүй бол бүү шах.', 'Listen without judgement. Do not pressure someone to talk.'), text('Ямар тусламж хүсэж байгааг асуу; хамт байх, өдөр тутмын ажилд туслахыг санал болго.', 'Ask what would help; offer company or help with everyday tasks.')],
    sources: ['psychosocial', 'mentalSupport', 'intellectual'],
  },
  {
    id: 'epilepsy', title: text('Эпилепси', 'Epilepsy'),
    explanation: text('Эпилепси нь давтан таталт үүсгэдэг тархины архаг эмгэг. Бүх насанд тохиолдож болно.', 'Epilepsy is a chronic brain condition involving recurrent seizures. It can affect people of any age.'),
    experiences: text('Таталт нь гөлөрч харах, орчноо мэдрэхгүй болох эсвэл бие чичрэх зэрэг өөр хэлбэртэй. Дэмжлэгийн төлөвлөгөө хүн бүрд өөр.', 'Seizures may involve staring, altered awareness or shaking. Support plans differ between people.'),
    misunderstanding: text('Таталт бүр унаж, бүх бие чичрэх байдлаар илрэхгүй. Эпилепси халдварладаггүй.', 'Not every seizure involves falling and shaking. Epilepsy is not contagious.'),
    tips: [text('Тухайн хүн хүсвэл эмчтэйгээ тохирсон таталтын үеийн төлөвлөгөөг урьдчилан ярилц.', 'If the person wishes, discuss their agreed seizure care plan in advance.'), text('Таталтын дараа сэргэтэл нь хамт байж, юу болсныг тайван тайлбарла.', 'Stay with the person until they recover and calmly explain what happened afterwards.')],
    sources: ['epilepsy', 'seizure', 'seizureNhs', 'ambulance'],
  },
  {
    id: 'chronic', title: text('Архаг өвчин, өвдөлт, ядралттай холбоотой бэрхшээл', 'Disabilities associated with chronic illness, pain and fatigue'),
    explanation: text('Удаан үргэлжилдэг өвчин, өвдөлт, ядралт нь өдөр тутмын үйл ажиллагаанд саад учруулж болно.', 'Long-term illness, pain and fatigue can create barriers to everyday activities.'),
    experiences: text('Зарим хэрэгцээ гаднаас харагдахгүй, өдөр бүр өөрчлөгдөнө. ME/CFS-ийн үед бага ачааллын дараа ч шинж сэдэрч болно; энэ нь бүх архаг өвчний тайлбар биш.', 'Needs may be invisible and change daily. In ME/CFS, even minor activity can worsen symptoms; this does not describe every chronic illness.'),
    misunderstanding: text('Өнөөдөр хийсэн зүйлээ маргааш заавал хийж чадна гэж үзэж болохгүй. ME/CFS-ийн ядралт нь энгийн нойр дутуугийн ядралттай ижил биш.', 'What someone can do today may differ tomorrow. ME/CFS fatigue is not simply tiredness from too little sleep.'),
    tips: [text('Өөрийнх нь тайлбарыг сонс. Амрах, уян хатан цаг эсвэл зайнаас оролцох хэрэгцээг асуу.', 'Listen to the person. Ask about rest, flexible timing or remote participation.'), text('Ачааллыг нэмэхийг бүү шах; өөрт нь тохирох хязгаарыг хүндэтгэ.', 'Do not pressure someone to increase activity; respect their limits.')],
    sources: ['fatigue', 'mobility', 'spinal'],
  },
];

type TopicExpansion = {
  dailyLife: Text;
  educationWork: Text;
  digitalAccess: Text;
  furtherDetails: Text[];
  sources: UnderstandSourceId[];
};

// Deeper material stays in the same bilingual record as the plain-language summary.
const topicExpansions: Record<string, TopicExpansion> = {
  mobility: {
    dailyLife: text('Удаан зогсох, бичих, жижиг зүйл барих нь алхахаас өөр хэрэгцээ үүсгэж болно. Тархины саажилтын үед хөдөлгөөн, ярианд нөлөөлөх байдал хүн бүрд ялгаатай.', 'Standing, handwriting and handling small objects can involve different needs from walking. Cerebral palsy can affect movement and speech differently between people.'),
    educationWork: text('Уулзалтын өмнө орох гарц, доторх зам, суудал, ариун цэврийн өрөөг хамт шалга. Гар бичмэлээс өөр хариулах арга, нэмэлт хугацааг санал болго.', 'Check entrances, routes, seating and toilets together before a meeting. Offer alternatives to handwriting and extra time.'),
    digitalAccess: text('Зөвхөн хулгана шаарддаг үйлдлээс зайлсхий. Гарын товчлуураар ажиллах, том удирдлага дарах, алдаагаа засах, хугацаа авах боломж олго.', 'Avoid mouse-only tasks. Support keyboards, larger controls, error correction and enough time.'),
    furtherDetails: [text('Зарим хүн хол явахдаа тэргэнцэр хэрэглэдэг. Хэрэгсэл ашиглах нь бие даасан байдлыг нэмэгдүүлж болно; хэрэглэж байгаа нь бүх чадварыг нь тайлбарлахгүй.', 'Some people use a wheelchair for longer distances. Equipment can support independence; using it does not describe every ability.'), text('Энгийн танилцах ярианд эмнэлгийн түүхийг нь асуух шаардлагагүй. Тусламжийг зөвшөөрсний дараа яаж туслахыг өөрөөр нь заалга.', 'You do not need someone’s medical history to get to know them. If they accept help, let them explain how to assist.')],
    sources: ['cerebralPalsy', 'physicalWeb'],
  },
  vision: {
    dailyLife: text('Нэг зүйл харж чадсан нь жижиг бичиг, бүх өнгө, эсвэл орчны бүх саадыг ялгаж харна гэсэн үг биш. Гэрэл, тодролын хэрэгцээ ч өөр.', 'Seeing one thing does not mean someone can read small text, distinguish every colour or see every obstacle. Lighting and contrast needs also vary.'),
    educationWork: text('Хэрэгтэй материалыг тохирох хэлбэрээр урьдчилан өг. Танилцуулгын чухал харагдах мэдээллийг үгээр тайлбарлаж, хөтлүүлэх хэрэгцээг асуу.', 'Provide materials in a suitable format beforehand. Describe important visual information and ask about guiding needs.'),
    digitalAccess: text('Томруулдаг жинхэнэ бичвэр, утгатай гарчиг, нэртэй товчлуур, зургийн тайлбар хэрэглэ. Томруулсан бичиг, дэлгэц уншигч, брайлын аль нь тохирохыг асуу.', 'Use resizable text, meaningful headings, labelled controls and image descriptions. Ask about large print, screen readers or braille.'),
    furtherDetails: [text('Зөвхөн үсгийг томруулах нь бүх хэрэгцээг хангахгүй. Хүний хэрэглэдэг төхөөрөмж, мэдээллийн хэлбэрийг өөртэй нь тохиролц.', 'Larger letters alone do not meet every need. Agree on the information format and technology with the person.')],
    sources: ['visualWeb'],
  },
  hearing: {
    dailyLife: text('Дохионы хэл, яриа, уруул унших, бичвэрийг өөр өөрөөр хослуулж болно. Дахин асуусныг сонирхолгүй байна гэж бүү ойлго.', 'People may combine signing, speech, lipreading and text differently. Asking for repetition does not mean a lack of interest.'),
    educationWork: text('Хэлэлцэх асуудлыг урьдчилан явуул. Хүссэн хэлмэрч, бичвэрийн дэмжлэг, завсарлага болон нэг нэгээрээ ярих дарааллыг төлөвлө.', 'Send an agenda ahead. Arrange preferred interpreting or text support, breaks and one speaker at a time.'),
    digitalAccess: text('Яриа болон чухал дуу авианд хадмал, бичвэр өг. Автомат хадмалын алдааг шалга. Бүгд дохионы хэл мэддэг эсвэл бичвэр ижил хялбар гэж бүү таамагла.', 'Provide captions and transcripts for speech and important sounds. Check automated captions. Do not assume everyone signs or finds written text equally easy.'),
    furtherDetails: [text('Монголд дохионы хэлний дэмжлэг хэрэгтэй бол Монгол дохионы хэл хэрэглэдэг эсэх, ямар харилцааны сонголт хүсэж байгааг тодруул. Энэ хуудас хэлмэрчийн одоогийн олдоцыг батлахгүй.', 'In Mongolia, ask whether the person uses Mongolian Sign Language and what communication support they prefer. This page does not confirm current interpreter availability.')],
    sources: ['auditoryWeb', 'meetings', 'captions'],
  },
  deafblind: {
    dailyLife: text('Орчны чимээ, гэрэл, зай өөрчлөгдөхөд ашиглаж болох хараа, сонсгол болон харилцах арга өөр байж болно.', 'Noise, lighting and distance can change how someone uses their remaining sight, hearing and communication methods.'),
    educationWork: text('Хөтлөх болон харилцааны дэмжлэгийг хамт төлөвлө. Хүмүүс ирж, явах болон орчны өөрчлөлтийг өөрт нь тохирох аргаар дамжуул.', 'Plan guiding and communication support together. Share arrivals, departures and environmental changes in a suitable way.'),
    digitalAccess: text('Зөвхөн аудио эсвэл зөвхөн хадмал бүх хүнд хангалтгүй. Томруулах бичвэр, дэлгэц уншигч эсвэл брайлын хэрэгцээг асуу.', 'Audio alone or captions alone will not suit everyone. Ask about resizable text, screen readers or braille.'),
    furtherDetails: [text('Тод яриа, ойрын зайны дохио, хүрэлцэхүйн дохио зэрэг аргыг тухайн хүний сонголтоор ашигла. Мэдээлэл авах арга нь хариулах аргаас өөр байж болно.', 'Use clear speech, signing within the person’s visual field or tactile signing according to their preference. Receiving information may differ from responding.')],
    sources: ['visualWeb', 'auditoryWeb'],
  },
  communication: {
    dailyLife: text('Ярихад хүндрэлтэй хүн бүр бичгээр хялбар харилцана гэсэн үг биш. Хэл ойлгох болон санаагаа илэрхийлэх хэрэгцээг тусад нь асуу.', 'Difficulty speaking does not mean writing is easy. Ask separately about understanding language and expressing a message.'),
    educationWork: text('Асуултын дараа хүлээ. AAC төхөөрөмжөөр хариулах үед нь яаралгүй хугацаа өгч, зураг, бичвэр болон бусад сонголтыг хүлээн зөвшөөр.', 'Wait after asking a question. Allow time for an AAC response and accept pictures, writing or other methods.'),
    digitalAccess: text('Утас эсвэл дуу хоолойг цорын ганц арга болгохгүй. Үйлчилгээ төлөвлөхдөө и-мэйл, бичгэн маягт зэрэг бодит өөр сонголт олго.', 'Do not make phone calls or voice input the only route. When planning a service, provide working alternatives such as email or written forms.'),
    furtherDetails: [text('Ээрэхэд авиа, үг давтагдах эсвэл яриа түгжигдэх; дизартрид ярианы булчингийн хяналтаас үг тод бус болох; афазид ярих, ойлгох, унших, бичихэд хүндрэл үүсэж болно. Эдгээр нь өөр өөр ойлголт.', 'Stuttering can involve repetitions or blocks; dysarthria affects speech through muscle control; aphasia can affect speaking, understanding, reading and writing. These are different conditions.'), text('Нэмэлт болон орлуулах харилцаа (AAC) нь дохио, зураг, бичвэр, дуу гаргадаг төхөөрөмжийг багтаана. Байнгын, зарим нөхцөлд эсвэл түр хугацааны хэрэглээтэй байж болно.', 'Augmentative and alternative communication (AAC) includes gestures, pictures, writing and speech-generating devices. It may be used continuously, occasionally or temporarily.')],
    sources: ['speechWeb', 'aac', 'aphasia', 'communicationPartners'],
  },
  intellectual: {
    dailyLife: text('Цаг, мөнгө, аялал, шинэ мэдээлэл эсвэл шийдвэрийн зарим хэсэгт дэмжлэг хэрэгтэй байж болно. Үүний зэрэгцээ хүн өөрийн сонирхол, туршлага, давуу талтай.', 'Time, money, travel, new information or parts of a decision may need support. The person also has their own interests, experiences and strengths.'),
    educationWork: text('Бодит жишээ, богино алхам ашигла. Дэмжигч оролцсон ч өөртэй нь шууд ярьж, сонголт болон үр дагаврыг тайлбарлах хугацаа өг.', 'Use practical examples and short steps. Speak directly to the person even with a supporter present, and allow time to explain options and outcomes.'),
    digitalAccess: text('Мэдээллийг богино хэсэг, утгатай зураг болон тохирох бусад хэлбэрээр өг. Оюуны хөгжлийн бэрхшээлтэй хүмүүсийг материал боловсруулах, шалгахад оролцуул.', 'Use short sections, meaningful images and other suitable formats. Involve people with intellectual disabilities in creating and checking materials.'),
    furtherDetails: [text('Шийдвэр гаргахад дэмжих нь өмнөөс нь сонгох биш. Үйлчилгээний үнэ, нөхцөл, өөр хувилбарыг ойлгомжтой тайлбарлаж, хүссэн итгэлтэй хүнтэйгээ зөвлөлдөх боломж өгөөд өөрийнх нь саналыг асуу.', 'Supporting a decision means helping someone choose. Explain a service’s price, conditions and alternatives accessibly, allow consultation with trusted people if wanted, and ask for the person’s own preference.')],
    sources: ['decisions', 'information'],
  },
  autism: {
    dailyLife: text('Дуу, гэрэл, үнэр, хүрэлцэхүй их ачаалал өгч болно. Гаднаа тайван харагдах нь тухтай байгааг батлахгүй.', 'Sound, light, smell or touch may be overwhelming. Looking calm does not necessarily mean feeling comfortable.'),
    educationWork: text('Өөрчлөлтийг урьдчилан тайлбарлаж, тайван орчин, хариулах хугацаа, өөр харилцааны аргыг тохиролц. Хэт ачааллын үед асуулт, шаардлагыг багасга.', 'Explain changes ahead and agree on quiet space, processing time and communication alternatives. Reduce questions and demands during overload.'),
    digitalAccess: text('Зааврыг тодорхой, богино алхмаар өг. Урьдчилан таамаглахад хялбар дараалал хэрэглэж, шаардлагагүй анхаарал сарниулах зүйлсийг багасга.', 'Give clear instructions in short steps. Keep the sequence predictable and reduce unnecessary distractions.'),
    furtherDetails: [text('Хэт ачааллын үед зарим хүн уйлах, орилох зэрэг гадагш илэрхий хариу (meltdown), зарим нь ярих, хариулах нь багасах (shutdown) байдлаар хариу үйлдэл үзүүлж болно. Тайвшрах хугацаа, аюулгүй орчин өгч, тохирох дэмжлэгийг тайван үед нь хамт төлөвлө.', 'Overload may lead to outward distress such as crying or shouting (meltdown), or reduced speech and responses (shutdown). Allow recovery time and a safe space; agree support when the person is calm.'), text('Онцлогоо далдлах (masking) нь бусдын хүлээлтэд нийцүүлэхийн тулд өөрийн харилцаа, хөдөлгөөн, хариу үйлдлийг дарахыг хэлнэ. Энэ нь их хүч шаардаж, сайн сайхан байдалд нөлөөлж болно.', 'Masking involves suppressing communication, movements or responses to meet others’ expectations. It can take considerable effort and affect wellbeing.'), text('Бүх аутизмтай хүнийг онцгой авьяастай эсвэл бие даах боломжгүй гэсэн нэг хэвшмэл дүрээр тайлбарлаж болохгүй.', 'Do not reduce all autistic people to stereotypes of exceptional talent or inability to live independently.')],
    sources: ['overload', 'masking', 'steps'],
  },
  adhd: {
    dailyLife: text('Гүйцэтгэх үйл ажиллагаа гэдэг нь ажлаа эхлэх, эрэмбэлэх, төлөвлөх, мэдээлэл түр санах, ажлаа солих, цаг зохицуулах чадварууд. Юу хийхээ мэдсэн ч эхлэх, дуусгахад хүндрэлтэй байж болно.', 'Executive functioning includes starting, prioritising, planning, holding information in mind, switching tasks and managing time. Knowing what to do does not always make starting or finishing easy.'),
    educationWork: text('Эхний зорилтыг тохиролцож, том ажлыг жижиг алхамд хуваа. Сануулгын хэлбэрийг асуу. Жишээ нь маягтыг тохиролцсон хугацаатай гурван алхмаар тайлбарлаж болно.', 'Agree the first priority, break tasks into steps and ask about reminders. For example, explain a form in three steps with an agreed deadline.'),
    digitalAccess: text('Тодорхой гарчиг, богино заавар, алхам бүрийн жишээ ашигла. Унших, бөглөхөд хангалттай хугацаа өг.', 'Use clear headings, short instructions and examples for each step. Allow enough time to read and complete tasks.'),
    furtherDetails: [text('Гүйцэтгэх үйл ажиллагааны хүндрэл нь дангаараа ADHD-ийн онош биш. Тусламжийг тухайн хүний бодит хэрэгцээгээр тохируул.', 'Executive-function difficulties alone do not establish an ADHD diagnosis. Match support to the person’s actual needs.')],
    sources: ['executive', 'steps', 'time'],
  },
  learning: {
    dailyLife: text('Унших, зөв бичихээс гадна мэдээлэл санах, ажлаа зохион байгуулахад хүндрэлтэй байж болно. Давуу тал, тохирох арга хүн бүрд өөр.', 'Remembering information and organising tasks may be difficult alongside reading and spelling. Strengths and helpful approaches differ.'),
    educationWork: text('Аудио, диаграмм, дуугаар унших хэрэгсэл болон өөрөөр хариулах боломжийг ярилц. Нэг өнгө, фонт эсвэл аргыг бүгдэд тохирно гэж үзэхгүй.', 'Discuss audio, diagrams, text-to-speech or alternative ways to respond. Do not assume one colour, font or method suits everyone.'),
    digitalAccess: text('Зөвхөн сканнердсан зураг бус, сонгож хуулж болох бичвэр өг. Гол санааг тодруулж, зааврыг богино хэсэгт хуваа.', 'Provide selectable text rather than scanned images alone. Highlight key points and divide instructions into short sections.'),
    furtherDetails: [text('Англи эх сурвалжийн нэр томьёог нөхцөлтэй нь унш. Энэ хуудсанд дислекси зэрэг суралцахуйн өвөрмөц хүндрэл болон оюуны хөгжлийн бэрхшээлийг тусад нь тайлбарласан.', 'Read English terminology in context. This page treats specific learning difficulties such as dyslexia separately from intellectual disability.')],
    sources: ['visualWeb', 'steps'],
  },
  psychosocial: {
    dailyLife: text('Сэтгэл гутралын үед эрч хүч, сонирхол буурах; түгшүүрт айдас, санаа зовнил нөлөөлөх; хоёр туйлт эмгэгт сэтгэл гутрал болон манийн шинжтэй үе тохиолдож болно.', 'Depression may reduce energy and interest; anxiety can involve fear and worry; bipolar disorder can involve depressive episodes and periods of manic symptoms.'),
    educationWork: text('Уян хатан цаг, нэмэлт хугацаа, тохируулсан даалгавар, эмчийн уулзалтын чөлөө, тогтмол дэмжих уулзалтыг өөртэй нь ярилц.', 'Discuss flexible hours, extra time, adjusted tasks, time for health appointments and regular supportive check-ins.'),
    digitalAccess: text('Зааврыг богино алхмаар өгч, хугацааны дарамтыг багасга. Харилцах хэлбэр, хэмнэлийг өөртэй нь тохиролц.', 'Use short, step-by-step instructions and reduce time pressure. Agree on the method and pace of communication.'),
    furtherDetails: [text('Сэтгэл гутралтай үед дарамтгүй холбоотой байж, тодорхой тусламж санал болго; хариулахыг бүү шах. Түгшүүртэй үед бэлэн бус зүйлд нь хүчлэхгүй, тохирох хэмнэлийг асуу.', 'For depression, keep in touch without pressure and offer specific help. For anxiety, ask about a comfortable pace and do not force situations the person is not ready for.'), text('Психозын үед бусдын мэдрэхгүй зүйл сонсох, харах, бусадтай хуваалцдаггүй итгэл үнэмшилтэй болох зэрэг туршлага байж болно. Тайван, товч ярь; айдас, зовнилыг нь хүлээн зөвшөөр. Итгэл үнэмшлийг нь батлах эсвэл маргалдахын оронд юу тус болохыг асуу.', 'Psychosis can involve hearing or seeing things others do not, or beliefs others do not share. Use calm, short sentences and acknowledge distress. Ask what helps rather than confirming or arguing about the belief.')],
    sources: ['mentalConditions', 'depressionSupport', 'anxietySupport', 'psychosisSupport', 'mentalWork', 'steps', 'time'],
  },
  epilepsy: {
    dailyLife: text('Гэрэлд мэдрэг таталт зарим хүнд тохиолддог; бүх хүний таталт анивчсан гэрлээс үүддэггүй.', 'Some people have photosensitive seizures; flashing lights are not a trigger for everyone with epilepsy.'),
    educationWork: text('Зөвшөөрөлтэйгөөр тусламжийн төлөвлөгөө, хэн юу хийхийг ярилц. Тусгай эмийг зөвхөн зохих сургалттай хүн тухайн төлөвлөгөөний дагуу хэрэглэнэ.', 'With consent, agree on the care plan and who does what. Only someone appropriately trained should give rescue medicine according to that plan.'),
    digitalAccess: text('Анивчдаг контентоос зайлсхий. Анхааруулга дангаараа аюултай анивчилтыг аюулгүй болгохгүй.', 'Avoid flashing content. A warning alone does not make unsafe flashing safe.'),
    furtherDetails: [text('Таталт бүрд түргэн тусламж шаардлагатай биш ч доорх аюулын шинжийг анхаар. Амьсгал хүндрэх зэрэг шинж байвал таван минут хүрэхийг бүү хүлээ.', 'Not every seizure needs an ambulance, but watch for the danger signs below. Do not wait for five minutes if breathing is difficult or another danger sign appears.')],
    sources: ['photosensitivity', 'seizureEmergency', 'flashes'],
  },
  chronic: {
    dailyLife: text('Өвдөлт бол хувь хүний туршлага. Үгээр тайлбарлаж чадахгүй байгаагаар нь өвдөхгүй гэж дүгнэж болохгүй. ME/CFS-ийн ачааллын дараах сэдрэлтээс сэргэхэд олон хоног эсвэл түүнээс удаан шаардагдаж болно.', 'Pain is personal; inability to describe it does not mean absence of pain. Recovery from post-exertional worsening in ME/CFS can take days or longer.'),
    educationWork: text('Амралт, зайнаас оролцох, уян хатан цаг, төлөвлөгөөг өөрчлөх боломжийг тохиролц. Өдөр бүр ижил бүтээмж шаардахын өмнө тухайн өдрийн боломжийг ярилц.', 'Agree on rest, remote participation, flexible timing and changes of plan. Discuss current capacity before expecting the same output every day.'),
    digitalAccess: text('Унших, бөглөхөд хугацаа өг. Богино алхам, тодорхой заавар, өөрийн хэмнэлээр ашиглах материалыг сонго.', 'Allow time to read and complete forms. Use short steps, clear instructions and materials people can use at their own pace.'),
    furtherDetails: [text('Long COVID-ийн зарим тохиолдолд ачааллын дараа шинж сэдэрдэг. Энерги хуваарилах болон ажилдаа уян хатан эргэн орох дэмжлэгийг хувь хүнд тохируулна.', 'Some people with Long COVID experience post-exertional symptom worsening. Energy management and flexible return-to-work support need individual tailoring.'), text('ME/CFS-тэй хүнд ачааллаа тогтмол нэмэх ерөнхий зөвлөгөө бүү өг. Энергийн зохицуулалтыг хувь хүнд тохируулдаг; шатлан нэмэгдүүлэх дасгалын эмчилгээ (GET)-г NHS зөвлөдөггүй.', 'Do not give blanket advice to keep increasing activity in ME/CFS. Energy management is individual; NHS guidance does not recommend graded exercise therapy (GET).')],
    sources: ['pain', 'longCovid', 'energy', 'steps', 'time'],
  },
};

export const disabilityTopics = topicSummaries.map(topic => ({
  ...topic,
  ...topicExpansions[topic.id],
  sources: [...new Set([...topic.sources, ...topicExpansions[topic.id].sources])],
}));

export const sharedSupportTips: Text[] = [
  text('Мэдээллийг богино хэсэг, тодорхой алхам, жишээтэй өг. Аль арга тохирохыг өөрөөс нь асуу.', 'Use short sections, clear steps and examples. Ask which approach works for the person.'),
  text('Унших, хөдөлгөөн хийх, туслах хэрэгсэл ашиглах хугацаа өг; шаардлагагүй хугацааны хязгаараас зайлсхий.', 'Allow time to read, move and use assistive tools; avoid unnecessary time limits.'),
  text('Зөвхөн утас шаардахгүй. Бодитоор ажилладаг бичгэн холбоо барих сонголтыг тодорхой мэдээл.', 'Avoid phone-only contact. Clearly explain which working written contact options are available.'),
  text('Зургийн тайлбар, утгатай гарчиг, томруулдаг бичвэр, шалгасан хадмал, бичвэрэн хувилбар бэлтгэ.', 'Provide image descriptions, meaningful headings, resizable text, checked captions and transcripts.'),
  text('Анивчилтаас зайлсхий. Хадмал эсвэл аудио ганцаараа хүн бүрийн хэрэгцээг хангахгүйг сана.', 'Avoid flashing content. Remember that captions alone or audio alone will not meet every need.'),
  text('Эдгээрийг тухайн хүний сонголтоор тохируул. W3C-ийн алхамчилсан зааврын хуудас нь нэмэлт зөвлөмж бөгөөд тусдаа заавал биелүүлэх шалгуур биш.', 'Adapt these ideas to the person’s preferences. W3C’s step-by-step pattern is supplemental guidance, not a separate mandatory criterion.'),
];
export const sharedSupportSources: UnderstandSourceId[] = ['steps', 'time', 'speechWeb', 'visualWeb', 'auditoryWeb', 'captions', 'flashes'];

export const autismGlossary = [
  { term: 'meltdown', meaning: text('Хэт ачааллаас үүдэн зовнил гадагш илрэх', 'Outward distress caused by overload') },
  { term: 'shutdown', meaning: text('Хэт ачааллын үед ярих, хариулах нь багасах', 'Reduced speech or responses during overload') },
  { term: 'masking', meaning: text('Бусдын хүлээлтэд нийцүүлэхийн тулд онцлогоо далдлах', 'Hiding traits to meet others’ expectations') },
];

// Kept separately so the safety-critical sequence can be reviewed as a whole.
export const seizureFirstAid: Text[] = [
  text('Тайван байж, хажууд нь үлд. Хугацааг хэмжиж, аюултай зүйлсийг холдуул.', 'Stay calm, stay with them, time the seizure and clear nearby hazards.'),
  text('Газарт байгаа бол толгойн доор зөөлөн зүйл тавьж хамгаал. Аюултай газарт байхаас бусад үед хөдөлгөхгүй; хүзүүний бариу хувцсыг сулла.', 'If on the ground, cushion the head. Move them only if they are in danger; loosen tight clothing around the neck.'),
  text('Хүчээр барихгүй, аманд нь юу ч хийхгүй. Татаж байх үед амнаас аманд амьсгал өгөхгүй. Бүрэн сэргэтэл хоол, ус өгөхгүй.', 'Do not restrain, put anything in their mouth, give mouth-to-mouth during a seizure, or offer food or water before full alertness.'),
  text('Биеийн таталт зогссоны дараа хажуугаар нь хэвтүүл. Сэргэтэл нь хамт байж, юу болсныг тайван тайлбарла.', 'After convulsions stop, turn them onto their side. Stay until recovery and calmly explain what happened.'),
  text('Тэргэнцэр дээр байвал тоормосыг түгжиж, бүс, бэхэлгээг нь хэвээр үлдээ. Зөөлөн түшиж, толгойг нь хамгаал; өөр газар шилжүүлэх гэж бүү оролд.', 'If in a wheelchair, apply the brakes and leave the seatbelt or harness on. Gently support them and cushion their head; do not try to transfer them.'),
];
