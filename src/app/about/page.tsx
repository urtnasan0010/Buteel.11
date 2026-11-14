import Link from "next/link";
import { t } from "@/shared/translations";
import Feedback from "@/client/components/feedback";
import { services } from "@/shared/data";
export default async function About({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; service?: string }>;
}) {
  const p = await searchParams;
  const lang = p.lang === "en" ? "en" : "mn";
  return (
    <main id="main" className="content page reading">
      <Link className="breadcrumb" href={`/?lang=${lang}`}>
        {t(lang, "home")}
      </Link>
      <h1>
        {t(lang, "information_should_be_within_everyone_s_reach")}
      </h1>
      <p className="intro">
        {t(lang, "hurteemj_is_a_prototype_directory_to_help_people_with_disabilitie")}
      </p>
      <section>
        <h2>{t(lang, "current_scope")}</h2>
        <p>
          {t(lang, "count_real_organisations_using_their_published_information_distri", [services.length])}
        </p>
      </section>
      <section>
        <h2>
          {t(lang, "sources_and_verification")}
        </h2>
        <p>
          {t(lang, "information_comes_from_each_organisation_s_own_website_with_sourc")}
        </p>
        <p>
          {t(lang, "missing_information_is_shown_as_unknown_it_is_not_a_conclusion_th")}
        </p>
        <ul>
          {services.map((s) => (
            <li key={s.id}>
              <a href={s.sourceUrl!}>{s.name[lang]}</a>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>
          {t(lang, "your_information_your_choice")}
        </h2>
        <p>
          {t(lang, "browse_without_an_account_we_do_not_request_diagnoses_or_medical_")}
        </p>
      </section>
      <Feedback lang={lang} service={p.service || ""} />
    </main>
  );
}
