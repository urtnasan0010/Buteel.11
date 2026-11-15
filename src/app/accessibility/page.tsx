import { selectLanguage } from '@/shared/language';
import Link from "next/link";
import {n} from '@/shared/nationwide';
import { t } from "@/shared/translations";

export default async function Accessibility({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const lang = selectLanguage((await searchParams).lang);
  return (
    <main id="main" className="content page reading">
      <Link className="breadcrumb" href={`/?lang=${lang}`}>
        {t(lang, "home")}
      </Link>
      <h1>{t(lang, "accessibility_statement")}</h1>
      <p className="intro">
        {t(lang, "we_aim_to_make_hurteemj_easy_for_everyone_to_use_working_towards_")}
      </p>
      <section>
        <h2>{t(lang, "what_we_have_checked")}</h2>
        <ul className="reading-list">
          <li>
            {t(lang, "headless_edge_checks_cover_both_languages_main_pages_semantic_str")}
          </li>
          <li>
            {t(lang, "main_pages_were_checked_at_320_375_768_and_1440_css_pixels_both_l")}
          </li>
          <li>
            {t(lang, "axe_detected_no_wcag_a_aa_violations_on_the_tested_pages_this_doe")}
          </li>
          <li>
            {t(lang, "the_mongolian_and_english_versions_declare_their_page_languages_a")}
          </li>
        </ul>
      </section>
      <section>
        <h2>
          {t(lang, "what_still_needs_testing")}
        </h2>
        <p className="note">{t(lang, "update_after_manual_testing_mongolian_wording_still_needs_native_")}</p>
        <p>
          {t(lang, "nvda_voiceover_and_physical_phones_have_not_been_tested_mongolian")}
        </p>
        <p>
          {t(lang, "actual_browser_zoom_at_200_physical_print_output_and_an_offline_c")}
        </p>
      </section>
      <section>
        <h2>
          {t(lang, "about_the_organisations_accessibility")}
        </h2>
        <p>
          {t(lang, "a_listing_marked_source_checked_has_not_been_confirmed_directly_w")}
        </p>
      </section>
      <section>
        <h2>{t(lang, "reporting_a_barrier")}</h2>
        <p>
          {n(lang, 'reportHint')}
        </p>
        <p>{t(lang, "no_response_time_commitment_has_been_set")}</p>
        <Link className="text-link" href={`/contact?lang=${lang}#report-problem`}>
          {n(lang, 'report')}
        </Link>
      </section>
    </main>
  );
}
