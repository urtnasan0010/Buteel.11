import type { Lang } from '@/shared/data';
import { n } from '@/shared/nationwide';
import { t } from '@/shared/translations';
const privacy = {
  title: { mn: 'Нууцлал', en: 'Privacy' },
  browsing: { mn: 'Зочин бүртгэл үүсгэхгүйгээр мэдээлэл үзнэ. Хайлтын үг, шүүлтүүр холбоос дотор хадгалагддаг тул эмзэг хувийн мэдээлэл бүү бичээрэй.', en: 'Visitors browse without an account. Search terms and filters appear in URLs; do not include sensitive personal information.' },
  reports: { mn: 'Асуудлын маягтаар илгээсэн мэдээлэл өгөгдлийн санд хадгалагдаж, зөвхөн админ үзнэ. Спамаас хамгаалахад нэг цагийн хугацаатай, зөвхөн серверт уншигдах cookie ашиглана. Онош, регистрийн дугаар бүү илгээгээрэй.', en: 'Submitted reports are stored in the database and visible only to admins. Spam prevention uses a one-hour HTTP-only cookie. Do not submit diagnoses or identity numbers.' },
  admin: { mn: 'Админы нэвтрэлтэд Neon Auth-ийн хамгаалалттай session cookie ашиглана. Зочдод нийтийн бүртгэл байхгүй.', en: 'Admin login uses Neon Auth session cookies. There is no public registration.' },
  checklists: { mn: 'Бэлтгэлийн жагсаалтын тэмдэглэгээ тухайн хуудас нээлттэй байх хугацаанд л хадгалагдана. Хэвлэж авч болно.', en: 'Checklist selections last while the page remains open. You can print them.' },
};

const how={title:{mn:'Хэрхэн ашиглах вэ?',en:'How it works'},body:{mn:'Аймаг эсвэл Улаанбаатарыг сонгож, дүүрэг эсвэл сумаар хайлтаа нарийсгана. Улс даяар эсвэл цахимаар үйлчилгээ авах сонголтыг мөн шалгаарай. Эх сурвалж, шалгасан огноо, баталгаажуулалтын төлөвийг уншина. Мэдээлэл тодорхойгүй бол баталгаатай гэж бүү үзээрэй.',en:'Choose an aimag or Ulaanbaatar, then narrow your search by district or soum. Check national and online options too. Read the source, review date and verification status. Do not treat unknown information as confirmed.'}};

export default function SiteInformation({ lang, open }: { lang: Lang; open: boolean }) {
  if (!open) return null;
  return <div className="content site-information"><details id="site-info" open={open}>
    <summary>{n(lang, 'siteInfo')}</summary>
    <section><h2>{how.title[lang]}</h2><p>{how.body[lang]}</p></section>
    <section id="privacy"><h2>{privacy.title[lang]}</h2>{[privacy.browsing,privacy.reports,privacy.admin,privacy.checklists].map((text,i) => <p key={i}>{text[lang]}</p>)}</section>
    <section id="disclaimer"><h2>{n(lang,'disclaimer')}</h2><p>{n(lang,'legal')}</p><p>{n(lang,'todo')}</p></section>
    <section id="accessibility"><h2>{t(lang,'accessibility_statement')}</h2><p>{t(lang,'we_aim_to_make_hurteemj_easy_for_everyone_to_use_working_towards_')}</p>
      <h3>{t(lang,'what_we_have_checked')}</h3>
      <ul className="reading-list">{(['headless_edge_checks_cover_both_languages_main_pages_semantic_str','main_pages_were_checked_at_320_375_768_and_1440_css_pixels_both_l','axe_detected_no_wcag_a_aa_violations_on_the_tested_pages_this_doe','the_mongolian_and_english_versions_declare_their_page_languages_a'] as const).map(key => <li key={key}>{t(lang,key)}</li>)}</ul>
      <h3>{t(lang,'what_still_needs_testing')}</h3>
      <p>{t(lang,'update_after_manual_testing_mongolian_wording_still_needs_native_')}</p>
      <p>{t(lang,'nvda_voiceover_and_physical_phones_have_not_been_tested_mongolian')}</p><p>{t(lang,'actual_browser_zoom_at_200_physical_print_output_and_an_offline_c')}</p>
      <h3>{t(lang,'about_the_organisations_accessibility')}</h3><p>{t(lang,'a_listing_marked_source_checked_has_not_been_confirmed_directly_w')}</p>
      <h3>{t(lang,'reporting_a_barrier')}</h3><p>{n(lang,'reportHint')}</p><p>{t(lang,'no_response_time_commitment_has_been_set')}</p>
    </section>
  </details></div>;
}
