import type { Service, Text } from "./data";

// Reading a published page is not a phone call, site visit, or confirmation
// that a programme is accepting applications. See README.md#sources.
const checkedAt = "2026-11-14";
const generalSteps: Text[] = [
  {
    mn: "Утас эсвэл цахим шуудангаар хэрэгтэй дэмжлэгээ асуугаарай.",
    en: "Call or email to ask about the support you need.",
  },
  {
    mn: "Одоогийн үйлчилгээ, зардал, баримт болон хүртээмжийг лавлаарай.",
    en: "Confirm current services, costs, documents, and accessibility.",
  },
  {
    mn: "Очих шаардлагатай бол хаяг, цагийг урьдчилан тохироорой.",
    en: "If you need to visit, confirm the location and arrange a time.",
  },
];
const common = {
  cost: "unknown" as const,
  access: { stepFree: null, lift: null, toilet: null, text: null, sign: null },
  verificationStatus: "source-checked" as const,
  lastChecked: checkedAt,
  providerConfirmedAt: null,
  documents: [],
  steps: generalSteps,
};

export const services: Service[] = [
  {
    ...common,
    id: "employment-support-centre",
    name: {
      mn: "Хөгжлийн бэрхшээлтэй иргэдийн хөдөлмөр эрхлэлтийг дэмжих төв",
      en: "Employment Support Centre for People with Disabilities",
    },
    description: {
      mn: "Хөдөлмөр эрхлэлтийг дэмжих төвийн бүтээгдэхүүн, үйлчилгээний талаар утас, цахим шуудангаар мэдээлэл авч болно.",
      en: "Contact the centre by phone or email for information about its products and services.",
    },
    category: 4,
    district: "Сүхбаатар",
    address: {
      mn: "Улаанбаатар, Сүхбаатар дүүрэг, 7-р хороо, Хөгжлийн бэрхшээлтэй иргэдийн хөдөлмөр эрхлэлтийг дэмжих төв.",
      en: "Employment Support Centre for People with Disabilities, 7th khoroo, Sukhbaatar district, Ulaanbaatar.",
    },
    hours: {
      mn: "Даваа-Баасан 08:30-17:30; Бямба, Ням амарна. Очихын өмнө лавлаарай.",
      en: "Monday-Friday 08:30-17:30; closed Saturday and Sunday. Confirm before visiting.",
    },
    phone: "77550099",
    email: "info@jobs-pwd.gov.mn",
    audience: {
      mn: "Хөдөлмөр эрхлэлтийн дэмжлэг сонирхож буй хөгжлийн бэрхшээлтэй хүмүүс. Хамрагдах нөхцөлийг төвөөс лавлана уу.",
      en: "People with disabilities exploring employment support. Ask the centre about eligibility.",
    },
    sourceUrl: "https://dmart.mn/contact-us/",
    sources: [
      {
        url: "https://dmart.mn/contact-us/",
        title: { mn: "Төвийн холбоо барих хуудас", en: "Centre contact page" },
        fields: [
          "name",
          "description",
          "audience",
          "district",
          "address",
          "hours",
          "phone",
          "email",
        ],
        checkedAt,
      },
    ],
  },
  {
    ...common,
    id: "mongolian-national-federation-of-the-blind",
    name: {
      mn: "Монголын Хараагүйчүүдийн Үндэсний Холбоо",
      en: "Mongolian National Federation of the Blind",
    },
    description: {
      mn: "Харааны бэрхшээлтэй хүмүүсийн боловсрол, хөдөлмөр эрхлэлт, эрхийн чиглэлээр ажилладаг холбоо. Сургалт, брайль болон ярьдаг номын үйлчилгээний талаар лавлаж болно.",
      en: "The federation supports education, employment, and rights for blind people. Ask about vocational education and braille or talking-book services.",
    },
    category: 3,
    district: "Хан-Уул",
    address: {
      mn: "Улаанбаатар, Хан-Уул дүүрэг, 3-р хороо, Дунд голын гудамж, МХҮХ-ны байр.",
      en: "Federation building, Dund Gol Street, 3rd khoroo, Khan-Uul district, Ulaanbaatar.",
    },
    hours: null,
    phone: "75056600",
    email: "info@mnfb.mn",
    audience: {
      mn: "Хараагүй, сул хараатай хүмүүс. Тухайн хөтөлбөрт хамрагдах нөхцөлийг холбооноос асуугаарай.",
      en: "Blind and partially sighted people. Ask the federation about each programme's eligibility.",
    },
    sourceUrl: "https://mnfb.mn/mn/about",
    sources: [
      {
        url: "https://mnfb.mn/mn/about",
        title: {
          mn: "Холбооны танилцуулга, холбоо барих мэдээлэл",
          en: "Federation overview and contacts",
        },
        fields: [
          "name",
          "description",
          "audience",
          "district",
          "address",
          "phone",
          "email",
        ],
        checkedAt,
      },
      {
        url: "https://mnfb.mn/mn/programs",
        title: { mn: "Хөтөлбөр, үйлчилгээ", en: "Programmes and services" },
        fields: ["description", "audience"],
        checkedAt,
      },
    ],
  },
  {
    ...common,
    id: "association-of-parents-with-disabled-children",
    name: {
      mn: "Хөгжлийн бэрхшээлтэй хүүхэдтэй эцэг эхчүүдийн холбоо",
      en: "Association of Parents with Differently-abled Children",
    },
    description: {
      mn: "Хүүхдийн эрхийг хамгаалах, эцэг эхийг мэдээллээр хангах, харилцан дэмжих чиглэлээр ажилладаг холбоо. Зөвлөх эцэг эхийн хөтөлбөрийн талаар лавлаарай.",
      en: "The association works on children's rights, parent information, and peer support. Ask about its parent-to-parent support programme.",
    },
    category: 7,
    district: "Баянгол",
    address: {
      mn: "Улаанбаатар, Баянгол дүүрэг, 20-р хороо, Хөгжлийн бэрхшээлтэй хүүхдийн сэргээн засах хөгжлийн төв, 2 давхар, 213 тоот.",
      en: "Room 213, second floor, Rehabilitation and Development Centre for Children with Disabilities, 20th khoroo, Bayangol district, Ulaanbaatar.",
    },
    hours: null,
    phone: "70123336",
    email: "info.apdcmongolia@gmail.com",
    audience: {
      mn: "Хөгжлийн бэрхшээлтэй хүүхдийн эцэг эх, асран хамгаалагчид. Одоогийн хөтөлбөрийг холбооноос лавлана уу.",
      en: "Parents and caregivers of children with disabilities. Contact the association about current programmes.",
    },
    sourceUrl: "https://apdc.mn/байгууллагын-товч-мэдээлэл-4/",
    sources: [
      {
        url: "https://apdc.mn/байгууллагын-товч-мэдээлэл-4/",
        title: {
          mn: "Байгууллагын товч мэдээлэл",
          en: "Organisation overview",
        },
        fields: [
          "name",
          "description",
          "audience",
          "district",
          "address",
          "phone",
          "email",
        ],
        checkedAt,
      },
    ],
  },
];

export function mapsSearchUrl(service: Service): string | null {
  if (!service.address) return null;
  const query = `${service.name.mn}, ${service.address.mn}`;
  return `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query })}`;
}
