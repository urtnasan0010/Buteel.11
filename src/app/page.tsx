import { t } from "@/shared/translations";
import Link from "next/link";
import { SourceNotice, Icon, SearchForm } from "@/shared/ui";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const lang = (await searchParams).lang === "en" ? "en" : "mn";
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-copy">
          <h1>
            {t(lang, "find_the_support")}
            <br />
            <em>{t(lang, "you_need")}</em>
          </h1>
          <p>
            {t(lang, "find_support_organisations_in_ulaanbaatar_by_need_and_office_loca")}
          </p>
          <p className="privacy">
            {t(lang, "no_registration_no_diagnosis_or_personal_details_required")}
          </p>
        </div>
        <SearchForm lang={lang} />
      </section>
      <div className="content">
        <SourceNotice lang={lang} />
        <section className="categories">
          <div className="section-title">
            <div>
              <h2>
                {t(lang, "related_pages")}
              </h2>
            </div>
            <Link className="text-link" href={`/services?lang=${lang}`}>
              {t(lang, "all_services")}
              <Icon />
            </Link>
          </div>
          <div className="category-grid">
            {(['understand','help','reach'] as const).map(section => (
                <Link
                  className="category"
                key={section}
                href={`/${section}?lang=${lang}`}
                >
                <span><strong>{t(lang,section)}</strong><span className="entry-summary">{t(lang,`${section}_summary`)}</span></span>
                  <Icon />
                </Link>
              ))}
          </div>
        </section>
        <section className="audience-links"><h2>{t(lang,'audience_heading')}</h2><ul className="reading-list">
          <li><Link href={`/services?lang=${lang}`}>{t(lang,'audience_disabled')}</Link></li>
          <li><Link href={`/help/families?lang=${lang}`}>{t(lang,'audience_family')}</Link></li>
          <li><Link href={`/help/employers-schools?lang=${lang}`}>{t(lang,'audience_organisation')}</Link></li>
        </ul></section>
        <Link className="text-link guide-link" href={`/guides?lang=${lang}`}>
          {t(lang, "what_should_i_prepare")}
          <Icon />
        </Link>
      </div>
    </main>
  );
}
