import type { Text } from './data';

// Bundled baseline: deterministic on every build/start, independent of database seeds.
// Do not turn these navigation guides into published database posts.
export const landingContent = {
  home: {
    title: { mn: 'Хүртээмж — ойлголцож, эрхээ эдэлье', en: 'Hurteemj — understanding and equal participation' },
    intro: { mn: 'Хөгжлийн бэрхшээлийн талаар ойлгох, хэрэгтэй дэмжлэгээ тодруулах, Монгол Улсад эрхээ эдлэх мэдээллийг эндээс уншаарай.', en: 'Learn about disability, identify support needs and explore how to exercise your rights in Mongolia.' },
  },
  help: {
    title: { mn: 'Тусламж, дэмжлэг хайх', en: 'Finding help and support' },
    intro: { mn: 'Ямар дэмжлэг хэрэгтэйгээ тодорхойлоод, холбогдох байгууллагаас одоогийн нөхцөлийг лавлаарай. Үйлчилгээний бэлэн байдал орон нутаг бүрд өөр байж болно.', en: 'Identify the support you need and ask the relevant organisation about current arrangements. Local service availability may differ.' },
  },
  links: [
    { path: '/understand', title: { mn: 'Хөгжлийн бэрхшээлийг ойлгох', en: 'Understand disability' }, body: { mn: 'Хүн бүрийн туршлага, харилцааны арга, дэмжлэгийн хэрэгцээний талаар унших.', en: 'Explore different experiences, communication preferences and support needs.' } },
    { path: '/rights', title: { mn: 'Эрх, үйлчилгээний нөхцөл', en: 'Rights and service conditions' }, body: { mn: 'Боловсрол, ажил, эрүүл мэнд, тэтгэвэр, тэтгэмжийн нөхцөлийг сэдвээр нь унших.', en: 'Read about education, work, healthcare, pensions and allowances by topic.' } },
    { path: '/rights#rights-contacts', title: { mn: 'Гомдол, зөвлөгөөний холбоо', en: 'Complaints and advice contacts' }, body: { mn: 'Эрх зөрчигдсөн гэж үзвэл хаана хандахыг тодруулах.', en: 'Find where to turn if you believe your rights have been violated.' } },
  ],
  stepsTitle: { mn: 'Дэмжлэг хүсэхдээ', en: 'When requesting support' },
  steps: [
    { mn: 'Ямар үйлдэл, орчин, мэдээлэл саад болж байгааг тодорхой хэл.', en: 'Describe the task, environment or information that creates a barrier.' },
    { mn: 'Ямар харилцааны арга, тохируулга, тусламж хүсэж байгаагаа тайлбарла.', en: 'Explain the communication method, adjustment or assistance you prefer.' },
    { mn: 'Хамрагдах нөхцөл, материал, хугацааг албан байгууллагаас лавлаж, хариугаа хадгал.', en: 'Ask the official organisation about eligibility, documents and timing, and retain the reply.' },
  ],
  posts: { mn: 'Мэдээ, мэдээлэл', en: 'News and updates' },
  empty: { mn: 'Одоогоор нийтлэгдсэн мэдээ алга. Дээрх мэдээлэл, холбоосыг ашиглаарай.', en: 'There are no published updates yet. You can use the information and links above.' },
  unavailable: { mn: 'Мэдээг одоогоор ачаалж чадсангүй. Үндсэн мэдээлэл, холбоосыг ашиглах боломжтой.', en: 'Updates could not load right now. The guide information and links remain available.' },
  contact: { mn: 'Асуудлаа тайлбарлах, зөвлөгөө авах холбоо', en: 'Contacts for explaining a problem or seeking advice' },
} satisfies {
  home: { title: Text; intro: Text }; help: { title: Text; intro: Text };
  links: { path: string; title: Text; body: Text }[];
  stepsTitle: Text; steps: Text[]; posts: Text; empty: Text; unavailable: Text; contact: Text;
};
