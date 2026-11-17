import type { Text } from './data';
import { rightsBenefits, rightsContacts, rightsCopy, rightsHistory, rightsSources, rightsTopics, type RightsSourceId } from './rights';
import { mayPublish, rightsPublication } from './rights-publication';

const text = (mn: string, en: string): Text => ({ mn, en });
export const visitorStatus = {
  verified: text('Албан эх сурвалжаар шалгасан', 'Checked against an official source'),
  unconfirmed: text('Баталгаажаагүй, албан байгууллагаас лавлаарай', "Unconfirmed - please ask the official organisation"),
  note: text('Хамрагдах нөхцөл, одоогийн журам болон үйлчилгээний боломжийг холбогдох байгууллагаас лавлаарай.', 'Ask the relevant organisation about eligibility, current rules and service availability.'),
};

// Deliberate visitor copy. Internal evidence/research wording stays in rights.ts.
const overrides: Record<string, Partial<(typeof rightsTopics)[number]>> = {
  equality: { entitlement: [text('Хөгжлийн бэрхшээлээр ялгаварлахыг хориглоно. Тохирох хэрэглэгдэхүүн нь тоног төхөөрөмж, программ, орчин, үйлчилгээний тохируулгыг хамарна.', 'Disability discrimination is prohibited. Accommodation includes equipment, software, environments and service adjustments.')] },
  access: { entitlement: [text('Конвенцийн 9, 21 дүгээр зүйл нь орчин, үйлчилгээний хүртээмж болон мэдээлэл авах эрхийг хамгаална.', 'Convention articles 9 and 21 protect accessibility of environments and services and access to information.')] },
  education: { conditions: [text('Дэмжлэгийг суралцагчийн хэрэгцээнд тохируулна. Ганцаарчилсан сургалтын одоогийн журам, хүсэлтийн нөхцөлийг сургуулиас лавлаарай.', "Support should match the learner's needs. Ask the school about current individual-education procedures and application conditions.")] },
  benefits: {
    entitlement: [text('Халамжийн тэтгэвэр нь даатгалын тэтгэврээс өөр шалгууртай. Доорх сарын хэмжээ, хамрах бүлгийг уншаад өөрийн эрх үүссэн эсэхийг халамжийн байгууллагаар тогтоолгоно.', 'Welfare and insurance pensions have different eligibility rules. Read the monthly rates and recipient groups below, then ask the welfare authority to confirm your entitlement.'), text('Даатгалын тэтгэвэр нь хөдөлмөрийн чадвар алдалт, шимтгэлийн хугацаанаас хамаарна. Үйлдвэрлэлийн ослын нөхцөл тусдаа.', 'Insurance pensions depend on assessed loss of capacity and contribution history. Occupational accidents have separate rules.')],
    conditions: [text('Онош дангаараа бүх төлбөр авах эрх үүсгэхгүй. Нас, магадлал, даатгалын эрх болон давхар авах боломжийг байгууллагаар тодруул.', 'A diagnosis alone does not establish entitlement to every payment. Confirm age, assessment, insurance rights and concurrent eligibility with the authority.')],
  },
  'aids-transport': { entitlement: [text('Туслах хэрэгслийн дэмжлэгт батлагдсан жагсаалт, үнэ, нас, давтамж, даатгалын нөхцөл үйлчилнэ. Нийтийн тээврийн хөнгөлөлт, картын одоогийн нөхцөлийг орон нутгийн байгууллагаас лавлаарай.', 'Device support is subject to approved lists, prices, age, replacement intervals and insurance rules. Ask the local authority about current public transport concessions and cards.')] },
  complaints: {
    entitlement: [text('ХЭҮК хүний эрхийн гомдол хүлээн авдаг. Албан тайлбарт гомдлыг 30 хоногт, шаардлагатай бол нэг удаа 30 хүртэл хоногоор сунгаж шийдвэрлэхийг дурдсан.', 'The NHRC receives human-rights complaints. Its official guidance states 30 days for complaints, with one extension of up to 30 days when needed.'), text('Хууль зүйн зөвлөгөө болон хэрэгт өмгөөлөгчөөр оролцуулах үйлчилгээ өөр. Үнэгүй туслалцааны шалгуурыг албан байгууллагаас лавлаарай.', 'Legal advice and representation are different services. Ask the official organisation about eligibility for free assistance.')],
    conditions: [text('Өөрийн хэрэгт үйлчлэх харьяалал, гомдлын хугацааг эрт тодруул. Шүүх болон мөрдөн шалгах шатны хэрэгт тусгай хязгаар үйлчилж болно.', 'Check jurisdiction and complaint deadlines for your case early. Special limits may apply to matters before courts or investigators.')],
    where: text('ХЭҮК-ын гомдлын албан суваг болон доорх зөвлөгөөний байгууллагын вэбсайтад хандана.', "Use the NHRC's official complaint channel or the advice organisations' websites below."),
  },
};

const sourceNames: Partial<Record<RightsSourceId, Text>> = {
  disabilityEnglish: text("Яамны 2019 оны эмхэтгэл - хуулийн англи хуулбар", "Ministry's 2019 collection - English copy of the law"),
  disabilityAmendment: text("УИХ - Хөгжлийн бэрхшээлтэй хүний эрхийн тухай хуулийн өөрчлөлт", "Parliament - disability rights law amendment"),
  educationAmendment: text('Боловсролын хуулийн өөрчлөлт', 'Education law amendment'),
  welfareFuture: text('Нийгмийн халамжийн хуулийн өөрчлөлт', 'Social welfare law amendment'),
  insuranceFuture: text('Даатгалын тэтгэврийн хуулийн өөрчлөлт', 'Insurance pension law amendment'),
};

export function publicSource(id: RightsSourceId) {
  const source = rightsSources[id];
  return { title: sourceNames[id] || source.title, url: source.url, verification: source.verification,
    checkedOn: source.checkedOn, publishedOn: source.publishedOn, updatedOn: source.updatedOn };
}

export const publicRightsCopy = {
  ...rightsCopy,
  sources: text('Албан эх сурвалж', 'Official sources'),
  unverified: visitorStatus.unconfirmed,
  verified: visitorStatus.verified,
  partialReview: visitorStatus.unconfirmed,
  history: text('Удахгүй мөрдөх өөрчлөлт', 'Upcoming changes'),
  historyNote: text('Доорх 2027-01-01-нээс мөрдөх өөрчлөлтийн одоогийн эх, хамрах хүрээг албан байгууллагаас лавлаарай. Эдгээрийг өнөөдрийн нөхцөлд хэрэглээгүй.', "Ask the official organisation to confirm the current text and scope of the changes listed for 2027-01-01. These are not applied as today's rules."),
  future: text('Мөрдөж эхлэхээр дурдсан огноо', 'Listed commencement date'),
  reviewFooter: text('Хамрагдах нөхцөл, журам өөрчлөгдөж болно. Энэ хуудас ерөнхий мэдээлэл бөгөөд таны хэрэгт өгөх хууль зүйн зөвлөгөөг орлохгүй.', 'Eligibility and procedures can change. This general guide does not replace legal advice for your case.'),
};

export const publicRightsTopics = rightsTopics.map(topic => {
  const visitor = { ...topic, ...overrides[topic.id] };
  return {
    ...visitor, unverified: topic.unverified.length ? [visitorStatus.note] : [],
    laws: topic.laws.filter((law, index) => mayPublish(law.sources.some(id => rightsSources[id].verification === 'VERIFIED') ? 'VERIFIED' : 'UNVERIFIED', rightsPublication[`law:${topic.id}:${index}`])),
  };
});

export const publicRightsBenefits = rightsBenefits.map(benefit => benefit.id === 'welfare-pension' ? {
  ...benefit, eligibility: text('16 нас хүрсэн, хөдөлмөрийн чадвар алдалт 50%-иас доошгүй хүн. Даатгалын тэтгэврийн эрх болон бусад шалгуурыг халамжийн байгууллагаар тодруулна.', 'Age 16+ with at least 50% assessed loss of capacity. Confirm insurance pension rights and other conditions with the welfare authority.'),
} : benefit);

export const publicRightsContacts = rightsContacts.map(contact => ({
  ...contact,
  phone: mayPublish(rightsSources[contact.source].verification, rightsPublication[`contact:${contact.id}`]) ? contact.phone : null,
  email: mayPublish(rightsSources[contact.source].verification, rightsPublication[`contact:${contact.id}`]) ? contact.email : null,
  purpose: contact.id === 'legal-aid' ? text('Зөвлөгөө, өмгөөллийн нөхцөлийг албан вэбсайтаас лавлаарай.', 'Ask the official website about advice and representation eligibility.') : contact.purpose,
}));

export const publicRightsHistory = rightsHistory.filter(item => item.kind === 'FUTURE_CHANGE').map(item => ({
  ...item, title: publicSource(item.source).title,
  note: visitorStatus.note,
}));
