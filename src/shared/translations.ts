// Shared interface copy. Organisation facts stay in listings.ts with their sources.
import type { Lang, Text, Feature } from './data';
export const translations = {
  msl_title: {mn:"Монгол дохионы хэлний видео",en:"Mongolian Sign Language video"},
  msl_soon: {mn:"Монгол дохионы хэлний видео: удахгүй",en:"Mongolian Sign Language video: coming soon"},
  msl_native: {mn:"Монгол бичвэрийн ноорог - төрөлх хэлтэй хүн хянана.",en:"Mongolian text is a draft awaiting native review."},
  msl_text: {mn:"Бүрэн бичвэр",en:"Full text / transcript"},
  deaf_title: {"mn": "Сонсголгүй болон сонсголын бэрхшээлтэй хүмүүст", "en": "For deaf and hard-of-hearing people"},
  deaf_summary: {"mn": "Огноо, эх сурвалжтай мэдээлэл. Бусад мэдээллийг нягтлах шаардлагатай.", "en": "Dated, attributed information. Other information remains to be verified."},
  deaf_todo: {"mn": "Одоогийн үйлчилгээ, хэлмэрчийн хүртээмж: TODO [source needed]", "en": "Current services and interpreting availability: TODO [source needed]"},
  written_unknown: {"mn": "Бичвэр / мессежийн боломж: тодорхойгүй", "en": "Text/messaging option: unknown"},
  interpreting_unknown: {"mn": "Дохионы хэлний хэлмэрч: тодорхойгүй. TODO [source needed]", "en": "Sign language interpreting: unknown. TODO [source needed]"},

  sourced_context: {mn:"Эх сурвалжтай мэдээлэл",en:"Sourced information"},
  pending_information: {mn:"Нягтлах шаардлагатай",en:"Still to verify"},
  other_pending_information: {mn:"Бусад нягтлах мэдээлэл",en:"Other information still to verify"},
  general_guidance_source: {mn:"Ерөнхий зөвлөмжийн эх сурвалж (дээрх мэдээлэл тусдаа эшлэлтэй)",en:"General guidance source (claims above have their own citations)"},
  legal_caution: {mn:"Ерөнхий мэдээлэл, хууль зүйн зөвлөгөө биш. Хуулиудыг шинэчилж байгаа тул албан эх болон хариуцсан байгууллагаас шалгаарай.",en:"General information, not legal advice. Laws are being revised; check the official text and the responsible agencies."},
  rights_sources_summary: {mn:"Доорх нь огноотой, эх сурвалжид хамааруулсан мэдээлэл. Төсөл, мэдээлэгдсэн тоо нь одоогийн хууль эсвэл үйлчилгээний баталгаа биш.",en:"The information below is dated and attributed. Drafts and reported figures do not establish current law or service availability."},
  pending_helplines: {mn:"Яаралтай тусламж, тусламжийн утас: TODO [official source needed]",en:"Emergency and helpline numbers: TODO [official source needed]"},
  pending_benefits: {mn:"Тэтгэвэр, тэтгэмжийн хэмжээ, хамрагдах нөхцөл, хүсэлтийн журам: TODO [official source needed]",en:"Benefit amounts, eligibility and application rules: TODO [official source needed]"},
  pending_population: {mn:"Хөгжлийн бэрхшээлтэй хүний тоо: TODO [choose one official figure with year]",en:"Number of people with disabilities: TODO [choose one official figure with year]"},
  pending_ratification: {mn:"НҮБ-ын конвенцыг соёрхон баталсан огноо: TODO [verify]",en:"UN Convention ratification date: TODO [verify]"},
  pending_terminology: {mn:"Хуулийн нэрийн \"хөгжлийн бэрхшээлтэй хүн\" гэсэн нэр томьёоноос бусад хүндэтгэлтэй хэллэг: TODO [consult disabled people's organisations and a native speaker]",en:"Respectful Mongolian terminology beyond the law's own term: TODO [consult disabled people's organisations and a native speaker]"},
  claims_review_note: {mn:"Огноо нь редакцын хяналтыг заана; одоогийн хууль, үйлчилгээ эсвэл орчуулгыг мэргэжлийн хүн баталгаажуулсан гэсэн үг биш.",en:"The date records editorial review, not professional confirmation of current law, services or translation."},
  source_unavailable: {mn:"Энэ холбоосыг одоогоор нээж шалгаж чадаагүй.",en:"This link could not be reopened during this review."},
  understand: {mn:"Ойлгох",en:"Understand"},
  help: {mn:"Дэмжих",en:"Help"},
  reach: {mn:"Харилцах",en:"Reach"},
  find_support_nav: {mn:"Тусламж хайх",en:"Find support"},
  understand_summary: {mn:"Хүмүүсийн хэрэгцээ, сонголтыг ойлгож, хүндэтгэлтэй харилцаарай.",en:"Understand people's needs and choices, and communicate respectfully."},
  help_summary: {mn:"Хүнээс өөрөөс нь асууж, хүссэн дэмжлэгийг нь үзүүлээрэй.",en:"Ask the person and offer the support they choose."},
  reach_summary: {mn:"Мэдээлэл, харилцааг олон хэлбэрээр хүргэхийг төлөвлөөрэй.",en:"Plan different ways to share information and communicate."},
  key_points: {mn:"Гол санаа",en:"Key points"},
  related_pages: {mn:"Дараа нь үзэх",en:"Related pages"},
  source_line: {mn:"Эх сурвалж",en:"Source"},
  content_review_date: {mn:"Сүүлд хянасан",en:"Last reviewed"},
  editorial_note: {mn:"Ерөнхий зөвлөмжийн ноорог. Мэргэжлийн, эмнэлгийн эсвэл хууль зүйн зөвлөгөө биш.",en:"Draft general guidance. Not professional, medical, or legal advice."},
  print_page: {mn:"Энэ хуудсыг хэвлэх",en:"Print this page"},
  needs_title: {mn:"Хэрэгцээ ба сонголт",en:"Different needs and preferences"},
  needs_summary: {mn:"Хүнд юу тохирохыг онош, гаднах байдлаар нь бүү таамаглаарай.",en:"Do not assume what works for someone from a diagnosis or appearance."},
  needs_one: {mn:"Харах, сонсох, хөдлөх, унших, ойлгох, харилцахад ямар хэлбэр тохирохыг асуугаарай.",en:"Ask what works for seeing, hearing, moving, reading, understanding, or communicating."},
  needs_two: {mn:"Бичвэр, аудио, тайван орчин эсвэл нэмэлт хугацаа хэрэгтэй эсэхийг асуугаарай.",en:"Ask whether text, audio, a quieter space, or more time would help."},
  needs_three: {mn:"Хариултыг нь дагаарай. Хэрэгцээ нь тухайн өдөр, орчноос хамаарч өөр байж болно.",en:"Follow their answer. Preferences may differ with the day and setting."},
  language_title: {mn:"Хүндэтгэлтэй үг, харилцаа",en:"Respectful language"},
  language_summary: {mn:"Хүнтэй өөртэй нь ярьж, хэрэглэхийг хүссэн үгийг нь хүндэтгээрэй.",en:"Speak to the person and respect the words they prefer."},
  language_one: {mn:"Нэр, өөрийгөө тодорхойлох хэлбэрийг нь асуугаарай.",en:"Ask what name and description they prefer."},
  language_two: {mn:"Өрөвдсөн эсвэл буруутгасан үг бүү хэрэглээрэй.",en:"Avoid pity or blame."},
  language_three: {mn:"Хувийн мэдээллийг бусдад хэлэхээс өмнө зөвшөөрөл аваарай.",en:"Ask permission before sharing personal information."},
  myths_title: {mn:"Таамаг ба бодит хэрэгцээ",en:"Myths and facts"},
  myths_summary: {mn:"Хүнийг бүлгийн тухай таамгаар бус, өөрийнх нь хэлсэн зүйлээр ойлгоорой.",en:"Understand the person through what they tell you, not assumptions about a group."},
  myths_one: {mn:"\"Бүгдэд ижил тусламж хэрэгтэй\" гэж бүү таамагла. Тухайн хүнд юу тохирохыг асуу.",en:"Instead of assuming everyone needs the same help, ask what works for this person."},
  myths_two: {mn:"\"Дуугүй байвал зөвшөөрсөн\" гэж бүү үз. Зөвшөөрлийг нь асууж, хариулах хугацаа өг.",en:"Do not treat silence as consent. Ask and allow time for an answer."},
  myths_three: {mn:"\"Туслахаар ирсэн тул шууд хийж болно\" гэж бүү үз. Эхлээд асуу.",en:"An offer to help is not permission to act. Ask first."},
  rights_title: {mn:"Эрх ба хууль",en:"Rights and laws"},
  voices_title: {mn:"Хөгжлийн бэрхшээлтэй хүмүүсийн дуу хоолой",en:"Voices of disabled people"},
  voices_summary: {mn:"Хүмүүсийн өөрсдөө хуваалцахыг сонгосон туршлагад зориулсан орон зай.",en:"A space for experiences people choose to share in their own words."},
  voices_one: {mn:"TODO [consent needed] - оролцогчийн зөвшөөрөлтэй агуулга шаардлагатай. Одоогоор түүх, эшлэл нийтлээгүй.",en:"TODO [consent needed] - content requires the contributor's consent. No stories or quotes are published yet."},
  voices_two: {mn:"Нэрээ нийтлэх эсэх, агуулгын хэлбэр, засвар болон зөвшөөрлөө буцаах үйл явцыг оролцогчтой тохирно.",en:"Agree attribution, format, edits, and a withdrawal process with each contributor."},
  families_title: {mn:"Гэр бүл, асран хамгаалагчдад",en:"For families and carers"},
  families_summary: {mn:"Хамт төлөвлөхдөө тухайн хүний сонголтыг эхэнд тавиарай.",en:"Plan together with the person's choices at the centre."},
  families_one: {mn:"Юуг өөрөө хийх, юунд дэмжлэг авахыг хүсэж байгааг нь асуу.",en:"Ask what they want to do themselves and where they want support."},
  families_two: {mn:"Байгууллагатай холбогдохын өмнө асуултаа хамт бэлд. Мэдээлэл хуваалцах зөвшөөрөл ав.",en:"Prepare questions together before contacting a provider. Ask permission to share information."},
  families_three: {mn:"Одоо байгаа бэлтгэлийн хөтөч, жагсаалтыг ашиглаж болно.",en:"Use the existing preparation guide and checklist if helpful."},
  friends_title: {mn:"Найз, хөрш, сайн дурынханд",en:"For friends, neighbours and volunteers"},
  friends_summary: {mn:"Туслахаасаа өмнө асуу. Тухайн хүний хэлснийг дага.",en:"Ask before helping. Follow what the person says."},
  friends_one: {mn:"\"Туслах уу? Яаж туслах вэ?\" гэж асуу. Татгалзвал хүндэтгэ.",en:"Ask \"Would you like help? How?\" Respect a refusal."},
  friends_two: {mn:"Биед нь болон туслах хэрэгсэлд нь хүрэхээс өмнө зөвшөөрөл ав.",en:"Get permission before touching the person or their equipment."},
  friends_three: {mn:"Хурдыг нь дага. Тодорхойгүй бол дахин асуу.",en:"Follow their pace. Ask again if unsure."},
  employers_title: {mn:"Ажил олгогч, сургууль, бизнест",en:"For employers, schools and businesses"},
  employers_summary: {mn:"Хүртээмжийг тухайн хүнтэй хамт төлөвлөж, тохирсон хувилбараа шалгаарай.",en:"Plan access with the person and check whether the arrangement works."},
  employers_one: {mn:"Уулзалт, хичээл, ажилд оролцоход юу хэрэгтэйг асуу. Онош шаардах асуултаас зайлсхий.",en:"Ask what would support participation in a meeting, lesson, or task. Avoid unnecessary questions about diagnoses."},
  employers_two: {mn:"Зааврыг ойлгомжтой өгч, бичгээр болон өөр хэлбэрээр авах сонголт санал болго.",en:"Give clear instructions and offer written or alternative formats."},
  support_org_title: {mn:"Байгууллагыг дэмжих",en:"Supporting organisations"},
  support_org_summary: {mn:"Юу хэрэгтэйг нь байгууллагаас өөрөөс нь асуугаарай.",en:"Ask the organisation what support it wants."},
  support_org_one: {mn:"Одоогийн хэрэгцээ, сайн дурын ажил болон оролцох нөхцөлийг лавла.",en:"Ask about current needs, volunteering, and participation arrangements."},
  support_org_two: {mn:"Мэдээллийг хуваалцахдаа эх сурвалжийг нь холбо. Өөрийн таамгаар засаж бүү түгээ.",en:"Link to the source when sharing information. Do not replace it with assumptions."},
  support_org_three: {mn:"Энэ лавлах төлбөр, хандив хүлээн авахгүй. Мөнгө илгээхээс өмнө хүлээн авагчийг өөрөө нягтал.",en:"This directory does not accept payments or donations. Check the recipient independently before sending money."},
  communication_title: {mn:"Хүртээмжтэй харилцах",en:"Communicating accessibly"},
  communication_summary: {mn:"Ярих, бичих, залгах, уулзахдаа тохирох хэлбэрийг нь асуугаарай.",en:"Ask what works when talking, writing, calling, or meeting."},
  communication_one: {mn:"Хүнтэй өөртэй нь ярь. Хариулах хугацаа өг. Ойлгосноо тулгаж бүү таамагла.",en:"Address the person directly. Allow time to respond. Do not assume understanding."},
  communication_two: {mn:"Уулзалтаас өмнө сэдэв, байршил, харилцааны хувилбараа өгч, шаардлагатай дэмжлэгийг асуу.",en:"Share the agenda, location, and communication options before a meeting; ask about support needs."},
  communication_three: {mn:"Чухал шийдвэрийг тохирсон хэлбэрээр нь товч давтаж баталгаажуул.",en:"Confirm important decisions in a brief, agreed format."},
  formats_title: {mn:"Мэдээллийн хүртээмжтэй хэлбэр",en:"Accessible formats for organisations"},
  formats_summary: {mn:"Нэг мэдээллийг хэд хэдэн хэлбэрээр авах боломж санал болгоорой.",en:"Offer more than one way to receive the same information."},
  formats_one: {mn:"Энгийн үг, богино өгүүлбэр хэрэглэ. Том бичвэр, хэвлэх хувилбар хэрэгтэй эсэхийг асуу.",en:"Use familiar words and short sentences. Ask about large print and printable copies."},
  formats_two: {mn:"Видеонд хадмал, аудиод бичгэн хувилбар төлөвлө. Ойлгоход хялбар хувилбарыг хэрэглэгчидтэй хамт шалга.",en:"Plan captions for video and text for audio. Test easy-read material with the people using it."},
  formats_three: {mn:"Нэг хуудсанд зорилго, хийх алхам, эх сурвалж, хянасан огноог оруул.",en:"A one-page handout can include its purpose, steps, source, and review date."},
  offline_title: {mn:"Офлайнаар мэдээлэл хүргэх",en:"Reaching people offline"},
  offline_summary: {mn:"Интернетгүй үед ашиглах хэвлэмэл мэдээллийг хамт төлөвлөөрэй.",en:"Plan printed information for people who cannot use the internet."},
  offline_one: {mn:"Юу, хэнд зориулсныг тодорхой бич. Том, уншихад хялбар үсэг хэрэглэ.",en:"State what the information is for and who can use it. Use readable type."},
  offline_two: {mn:"Зөвхөн QR код бүү ашигла. Баталгаатай холбоо барих мэдээлэл, эх сурвалж, огноог текстээр оруул.",en:"Do not rely only on a QR code. Include confirmed contacts, a source, and a date in text."},
  offline_three: {mn:"Энэ хуудсыг хэвлэх эсвэл браузераар PDF болгон хадгалж болно. Сайт бүхэлдээ офлайн ажилладаггүй. Бодитоор хэвлэж шалгах шаардлагатай.",en:"Print this page or save it as a PDF through your browser. The whole site does not work offline. Physical printing still needs testing."},
  how_it_works: {mn:"Энэ сайт хэрхэн ажилладаг вэ?",en:"How this site works"},
  privacy: {mn:"Хувийн мэдээлэл",en:"Privacy"},
  contact_page: {mn:"Холбоо барих / алдаа мэдэгдэх",en:"Contact / report a problem"},
  for_organisations: {mn:"Байгууллагуудад",en:"For organisations"},
  listing_request: {mn:"Бүртгэл нэмэх, засах хүсэлт",en:"Request a listing or correction"},
  listing_request_text: {mn:"Байгууллагын нэр, нийтэд нээлттэй эх сурвалжийн холбоос, үзүүлдэг үйлчилгээ, нийтэлж болох холбоо барих мэдээллээ бэлдээрэй. Зардал, шаардлага, хүртээмжийн мэдээллийг тус тусад нь нотлох эх сурвалжтай өгнө үү. Хувь хүний онош, баримт бүү явуулаарай.",en:"Prepare the organisation's name, public source link, services, and contacts approved for publication. Provide separate evidence for costs, requirements, and accessibility. Do not include anyone's diagnosis or personal records."},
  listing_review: {mn:"Хүсэлтийг хэрхэн хянах вэ?",en:"How requests will be reviewed"},
  listing_review_text: {mn:"???????? ?????? ????? ???????? ?????? ?????. ?????????? ???? ?? ???????, ?????? ??????, ??????????? ???????? ??????????? ?????? ???????. ???????? ????? ?? ???????, ??????? ????? ??? ???????? ??????????? ????? ?? ???.",en:"Submit requests through the contact page. Before adding information, sources and dates must be checked and unsupported fields left unknown. A listing does not imply partnership, endorsement, or confirmation of every detail."},
  main_navigation: {mn:"Үндсэн цэс",en:"Main navigation"},
  language_name: {mn:"Монгол",en:"English"},
  brand: {mn:"Хүртээмж",en:"Хүртээмж"},
  loading: {mn:"Уншиж байна...",en:"Loading..."},
  load_error: {mn:"Хуудсыг ачаалж чадсангүй",en:"Unable to load page"},
  please_retry: {mn:"Дахин оролдоно уу.",en:"Please try again."},
  retry: {mn:"Дахин оролдох",en:"Try again"},
  "home": {
    "mn": "Нүүр",
    "en": "Home"
  },
  "accessibility_statement": {
    "mn": "Хүртээмжийн мэдэгдэл",
    "en": "Accessibility statement"
  },
  "we_aim_to_make_hurteemj_easy_for_everyone_to_use_working_towards_": {
    "mn": "Хүртээмжийг хүн бүр ашиглахад хялбар байлгахыг зорьж байна. WCAG 2.2 AA түвшинд хүрэх зорилготой боловч бүрэн нийцсэн гэж батлаагүй.",
    "en": "We aim to make Hurteemj easy for everyone to use, working towards WCAG 2.2 AA. We do not claim full conformance."
  },
  "updated": {
    "mn": "Шинэчилсэн:",
    "en": "Updated:"
  },
  "what_we_have_checked": {
    "mn": "Юуг шалгасан бэ?",
    "en": "What we have checked"
  },
  "headless_edge_checks_cover_both_languages_main_pages_semantic_str": {
    "mn": "Headless Edge хөтөч дээр хоёр хэлний гол хуудсуудын семантик бүтэц, гарын товчлуурын урсгал, маягтын алдаа болон хэвлэх загварыг автоматаар шалгасан.",
    "en": "Headless Edge checks cover both languages' main pages, semantic structure, keyboard flows, form errors, and print styles."
  },
  "main_pages_were_checked_at_320_375_768_and_1440_css_pixels_both_l": {
    "mn": "Гол хуудсуудыг 320, 375, 768, 1440 пикселийн өргөнд шалгасан. Хоёр хэлний гол хуудсуудыг 320 пикселийн өргөнд бичвэрийн хэмжээг 200% болгож шалгасан.",
    "en": "Main pages were checked at 320, 375, 768, and 1440 CSS pixels. Both languages' main pages were also checked at 320px with text enlarged to 200%."
  },
  "axe_detected_no_wcag_a_aa_violations_on_the_tested_pages_this_doe": {
    "mn": "Шалгасан хуудсуудад axe автомат хэрэгслээр WCAG A/AA зөрчил илрээгүй. Энэ нь бүх саадыг илрүүлсэн гэсэн баталгаа биш.",
    "en": "Axe detected no WCAG A/AA violations on the tested pages. This does not establish that every accessibility barrier has been found."
  },
  "the_mongolian_and_english_versions_declare_their_page_languages_a": {
    "mn": "Монгол, англи хувилбарын хуудасны хэлийг mn, en гэж тохируулсан.",
    "en": "The Mongolian and English versions declare their page languages as mn and en."
  },
  "what_still_needs_testing": {
    "mn": "Юуг хараахан шалгаагүй вэ?",
    "en": "What still needs testing"
  },
  "update_after_manual_testing_mongolian_wording_still_needs_native_": {
    "mn": "Гар шалгалтын дараа шинэчилнэ. Монгол найруулгыг эх хэлтэй хүнээр хянуулах шаардлагатай.",
    "en": "Update after manual testing. Mongolian wording still needs native-speaker review."
  },
  "nvda_voiceover_and_physical_phones_have_not_been_tested_mongolian": {
    "mn": "NVDA, VoiceOver болон бодит утсаар туршаагүй. Монгол кирилл бичвэрийн дуудлага, хуудас бүхэлдээ зөв уншигдах эсэхийг дэлгэц уншигчаар үнэлээгүй. Бодит хэрэглэгчдийн туршилт болон бүх урсгалыг зөвхөн гараар ашиглах шалгалт хийгдээгүй.",
    "en": "NVDA, VoiceOver, and physical phones have not been tested. Mongolian pronunciation and the full reading experience have not been evaluated with screen readers. Real-user sessions and a complete keyboard-only walkthrough are still pending."
  },
  "actual_browser_zoom_at_200_physical_print_output_and_an_offline_c": {
    "mn": "Браузерын бодит 200% томруулалт, бодит хэвлэмэл хуудас болон офлайн жагсаалтыг цаашид шалгана. Автомат шалгалт нь бичвэрийн хэмжээг өсгөж, хэвлэх загварыг дуурайлган шалгасан. Энэ нь бодит төхөөрөмжийн туршилтыг орлохгүй.",
    "en": "Actual browser zoom at 200%, physical print output, and an offline checklist still need checking. Automated checks enlarge text and emulate print styles; they do not replace real-device testing."
  },
  "about_the_organisations_accessibility": {
    "mn": "Байгууллагын хүртээмжийн тухай",
    "en": "About the organisations' accessibility"
  },
  "a_listing_marked_source_checked_has_not_been_confirmed_directly_w": {
    "mn": "Лавлахын \"Цахим эх сурвалж шалгасан\" төлөв нь байгууллагаас шууд баталгаажуулсан гэсэн үг биш. Орц, лифт, ариун цэврийн өрөө болон харилцааны дэмжлэг тодорхойгүй байж болно. Очихын өмнө байгууллагаас лавлаарай.",
    "en": "A listing marked \"Source checked\" has not been confirmed directly with the organisation. Entrances, lifts, toilets, and communication support may be unknown. Contact the organisation before visiting."
  },
  "reporting_a_barrier": {
    "mn": "Саад, алдааг мэдэгдэх",
    "en": "Reporting a barrier"
  },
  "response_target": {
    "mn": "Хариулах зорилтот хугацаа:",
    "en": "Response target:"
  },
  "no_response_time_commitment_has_been_set": {
    "mn": "Одоогоор хугацаа амлаагүй.",
    "en": "No response-time commitment has been set."
  },
  "skip_to_main_content": {
    "mn": "Үндсэн агуулга руу алгасах",
    "en": "Skip to main content"
  },
  "feedback": {
    "mn": "Санал хүсэлт",
    "en": "Feedback"
  },
  "page_not_found": {
    "mn": "Хуудас олдсонгүй",
    "en": "Page not found"
  },
  "service_directory": {
    "mn": "Үйлчилгээний лавлах",
    "en": "Service directory"
  },
  "office_district": {
    "mn": "Байршил (дүүрэг)",
    "en": "Office district"
  },
  "cost": {
    "mn": "Зардал",
    "en": "Cost"
  },
  "free": {
    "mn": "Үнэгүй",
    "en": "Free"
  },
  "paid": {
    "mn": "Төлбөртэй",
    "en": "Paid"
  },
  "unknown": {
    "mn": "Тодорхойгүй",
    "en": "Unknown"
  },
  "accessibility": {
    "mn": "Хүртээмж",
    "en": "Accessibility"
  },
  "search": {
    "mn": "Хайх",
    "en": "Search"
  },
  "ulaanbaatar": {
    "mn": "Улаанбаатар",
    "en": "Ulaanbaatar"
  },
  "address": {
    "mn": "Хаяг",
    "en": "Address"
  },
  "check_the_source_and_contact_details": {
    "mn": "Үйлчилгээний эх сурвалж, холбоо барих мэдээллийг шалгах",
    "en": "Check the source and contact details"
  },
  "ask_about_eligibility_cost_and_opening_hours": {
    "mn": "Үйлчлэх хүрээ, зардал, цагийг асуух",
    "en": "Ask about eligibility, cost, and opening hours"
  },
  "confirm_required_documents": {
    "mn": "Ямар баримт хэрэгтэйг лавлах",
    "en": "Confirm required documents"
  },
  "ask_about_step_free_access_toilets_and_communication_support": {
    "mn": "Шатгүй орц, ариун цэврийн өрөө, харилцааны дэмжлэгийг лавлах",
    "en": "Ask about step-free access, toilets, and communication support"
  },
  "plan_a_suitable_time_and_route": {
    "mn": "Өөрт тохирох цаг, очих замаа төлөвлөх",
    "en": "Plan a suitable time and route"
  },
  "my_preparation_checklist": {
    "mn": "Миний бэлтгэлийн жагсаалт",
    "en": "My preparation checklist"
  },
  "count_of_count_steps_ready": {
    "mn": "{0}-аас {1} алхам бэлэн",
    "en": "{1} of {0} steps ready"
  },
  "print_checklist": {
    "mn": "Жагсаалт хэвлэх",
    "en": "Print checklist"
  },
  "checkmarks_last_while_this_page_remains_open": {
    "mn": "Тэмдэглэгээ зөвхөн энэ хуудсыг нээлттэй байх үед хадгалагдана.",
    "en": "Checkmarks last while this page remains open."
  },
  "corrections_and_feedback": {
    "mn": "Мэдээлэл засах, санал өгөх",
    "en": "Corrections and feedback"
  },
  "no_submission_backend_is_configured_this_form_prepares_a_report_n": {
    "mn": "Илгээх сервер тохируулаагүй. Доорх маягт тайлан бэлдэнэ; мэдээлэл илгээгдэхгүй, хадгалагдахгүй. Тайлангаа хуулж өөртөө хадгалаарай.",
    "en": "No submission backend is configured. This form prepares a report; nothing is sent or saved. Copy the report to keep it yourself."
  },
  "do_not_include_diagnoses_medical_records_identity_numbers_or_othe": {
    "mn": "Онош, эмнэлгийн баримт, регистрийн дугаар болон бусдын хувийн мэдээлэл бүү оруулаарай.",
    "en": "Do not include diagnoses, medical records, identity numbers, or other people's personal information."
  },
  "please_describe_your_correction_or_suggestion": {
    "mn": "Засах мэдээлэл эсвэл саналаа бичнэ үү.",
    "en": "Please describe your correction or suggestion."
  },
  "hurteemj_feedback_report": {
    "mn": "Хүртээмж - санал хүсэлтийн тайлан",
    "en": "Hurteemj - feedback report"
  },
  "service": {
    "mn": "Үйлчилгээ",
    "en": "Service"
  },
  "not_submitted_or_saved": {
    "mn": "Илгээгээгүй, хадгалаагүй.",
    "en": "Not submitted or saved."
  },
  "service_name_or_link_optional": {
    "mn": "Үйлчилгээний нэр эсвэл холбоос (заавал биш)",
    "en": "Service name or link (optional)"
  },
  "correction_or_suggestion_required": {
    "mn": "Засах мэдээлэл / санал (заавал)",
    "en": "Correction or suggestion (required)"
  },
  "prepare_copyable_report": {
    "mn": "Хуулах тайлан бэлдэх",
    "en": "Prepare copyable report"
  },
  "unsubmitted_report": {
    "mn": "Илгээгээгүй тайлан",
    "en": "Unsubmitted report"
  },
  "report_copied_it_has_not_been_submitted": {
    "mn": "Тайлан хуулагдлаа. Илгээгдээгүй.",
    "en": "Report copied. It has not been submitted."
  },
  "could_not_copy_select_the_report_text_and_copy_it_manually": {
    "mn": "Хуулж чадсангүй. Тайлангийн текстийг сонгож гараар хуулна уу.",
    "en": "Could not copy. Select the report text and copy it manually."
  },
  "copy_report": {
    "mn": "Тайлан хуулах",
    "en": "Copy report"
  },
  "report_ready_not_submitted_or_saved": {
    "mn": "Тайлан бэлэн. Илгээгдээгүй, хадгалагдаагүй.",
    "en": "Report ready. Not submitted or saved."
  },
  "call": {
    "mn": "Залгах",
    "en": "Call"
  },
  "email": {
    "mn": "Цахим шуудан бичих",
    "en": "Email"
  },
  "preparation_checklist": {
    "mn": "Бэлтгэлийн жагсаалт",
    "en": "Preparation checklist"
  },
  "available": {
    "mn": "Байгаа",
    "en": "Available"
  },
  "unavailable": {
    "mn": "Байхгүй",
    "en": "Unavailable"
  },
  "provider_confirmed": {
    "mn": "Байгууллага баталгаажуулсан",
    "en": "Provider confirmed"
  },
  "source_checked": {
    "mn": "Цахим эх сурвалж шалгасан",
    "en": "Source checked"
  },
  "not_checked": {
    "mn": "Шалгаагүй",
    "en": "Not checked"
  },
  "about_this_information": {
    "mn": "Эх сурвалжийн мэдээлэл",
    "en": "About this information"
  },
  "check_before_visiting": {
    "mn": "Очихын өмнө лавлаарай",
    "en": "Check before visiting"
  },
  "based_on_the_organisations_websites_not_confirmed_directly_ask_ab": {
    "mn": "Байгууллагын цахим мэдээлэлд тулгуурлав. Утасдаж баталгаажуулаагүй; зардал, хүртээмжийг лавлаарай.",
    "en": "Based on the organisations' websites. Not confirmed directly; ask about costs and accessibility."
  },
  "all_districts": {
    "mn": "Бүх дүүрэг",
    "en": "All districts"
  },
  "cost_unknown": {
    "mn": "Зардал тодорхойгүй",
    "en": "Cost unknown"
  },
  "what_support_are_you_looking_for": {
    "mn": "Ямар тусламж хайж байна вэ?",
    "en": "What support are you looking for?"
  },
  "service_need_or_keyword": {
    "mn": "Үйлчилгээ, хэрэгцээ, түлхүүр үг",
    "en": "Service, need, or keyword"
  },
  "find_support": {
    "mn": "Үйлчилгээ хайх",
    "en": "Find support"
  }
} as const;
export type TranslationKey = keyof typeof translations;
export function t(lang: Lang, key: TranslationKey, values: readonly (string | number)[] = []): string {
 if(/TODO\s*\[/i.test(translations[key][lang]))return lang==='mn'?'Мэдээлэл хараахан алга.':'Information is not available yet.';
 return translations[key][lang].replace(/\{(\d+)\}/g, (match,index: string) => values[Number(index)] === undefined ? match : String(values[Number(index)]));
}

export const categories: Text[] = [
  { mn: "Санхүүгийн дэмжлэг", en: "Financial support" },
  { mn: "Эрүүл мэнд", en: "Healthcare" },
  { mn: "Туслах хэрэгсэл, засвар", en: "Equipment & repairs" },
  { mn: "Боловсрол", en: "Education" },
  { mn: "Хөдөлмөр эрхлэлт", en: "Employment" },
  { mn: "Тээвэр", en: "Transport" },
  { mn: "Хувийн туслалцаа", en: "Personal assistance" },
  { mn: "Мэдээлэл, зөвлөгөө", en: "Information & advice" },
];
export const districts = [
  "Баянзүрх",
  "Баянгол",
  "Сүхбаатар",
  "Чингэлтэй",
  "Хан-Уул",
  "Сонгинохайрхан",
  "Налайх",
  "Багануур",
  "Багахангай",
];
export const districtEnglish = [
  "Bayanzurkh",
  "Bayangol",
  "Sukhbaatar",
  "Chingeltei",
  "Khan-Uul",
  "Songinokhairkhan",
  "Nalaikh",
  "Baganuur",
  "Bagakhangai",
];
export const featureLabels: Record<Feature, Text> = {
  stepFree: { mn: "Шатгүй орц", en: "Step-free entrance" },
  lift: { mn: "Лифт", en: "Lift" },
  toilet: { mn: "Хүртээмжтэй ариун цэврийн өрөө", en: "Accessible toilet" },
  text: { mn: "Бичгээр харилцах дэмжлэг", en: "Text communication support" },
  sign: { mn: "Дохионы хэлний дэмжлэг", en: "Sign-language support" },
};
