import ContactAvailability from '@/shared/contact-availability';
import { t } from "@/shared/translations";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  districtEnglish,
  districts,
  features,
  featureLabels,
  services,
} from "@/shared/data";
import { mapsSearchUrl } from "@/shared/listings";
import { SourceNotice, } from "@/shared/ui";

export default async function Detail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const s = services.find((s) => s.id === id);
  if (!s) notFound();
  const lang = (await searchParams).lang === "en" ? "en" : "mn";
  const unknown = t(lang, "unknown_ask_the_organisation");
  const mapUrl = mapsSearchUrl(s);
  return (
    <main id="main" className="content page">
      <Link className="breadcrumb" href={`/services?lang=${lang}`}>
        {t(lang, "back_to_directory_2")}
      </Link>
      <p className="meta">{categories[s.category][lang]}</p>
      <h1>{s.name[lang]}</h1>
      <SourceNotice lang={lang} />
      <p className="intro">{s.description[lang]}</p>
      <div
        className="contact-actions"
        role="group"
        aria-label={t(lang, "contact_options")}
      >
        {s.phone && (
          <a className="button" href={`tel:+976${s.phone}`} aria-label={`${t(lang, "call")} · ${s.phone} — ${s.name[lang]}`}>
            {t(lang, "call")} · {s.phone}
          </a>
        )}
        {s.email && (
          <a className="button secondary" href={`mailto:${s.email}`} aria-label={`${t(lang, "email")} — ${s.name[lang]}`}>
            {t(lang, "email")}
          </a>
        )}
        {mapUrl && (
          <a className="button secondary" href={mapUrl} aria-label={`${t(lang, "search_google_maps")} — ${s.name[lang]}`}>
            {t(lang, "search_google_maps")}
          </a>
        )}
      </div>
      <ContactAvailability lang={lang} email={s.email}/>
      <div className="detail-layout">
        <div>
          <section>
            <h2>{t(lang, "who_is_it_for")}</h2>
            <p>{s.audience[lang]}</p>
          </section>
          <section>
            <h2>{t(lang, "what_should_i_prepare_2")}</h2>
            {s.documents.length ? (
              <ul>
                {s.documents.map((d, i) => (
                  <li key={i}>{d[lang]}</li>
                ))}
              </ul>
            ) : (
              <p>
                {t(lang, "no_confirmed_document_checklist_is_available_ask_when_you_contact")}
              </p>
            )}
          </section>
          <section>
            <h2>{t(lang, "how_to_get_started")}</h2>
            <p className="meta">
              {t(lang, "general_advice_not_official_application_requirements")}
            </p>
            <ol className="application-steps">
              {s.steps.map((d, i) => (
                <li key={i}>{d[lang]}</li>
              ))}
            </ol>
            <Link className="text-link" href={`/guides?lang=${lang}`}>
              {t(lang, "preparation_checklist")}
            </Link>
          </section>
          <section>
            <h2>{t(lang, "accessibility")}</h2>
            <p>
              {t(lang, "entrance_lift_and_communication_support_have_not_been_confirmed_d")}
            </p>
            <dl className="access-list">
              {features.map((f) => (
                <div key={f}>
                  <dt>{featureLabels[f][lang]}</dt>
                  <dd>
                    {s.access[f] === null
                      ? t(lang, "unknown")
                      : s.access[f]
                        ? t(lang, "available")
                        : t(lang, "unavailable")}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <aside className="contact-panel">
          <h2>{t(lang, "location_and_hours")}</h2>
          <dl>
            <dt>{t(lang, "office_district_2")}</dt>
            <dd>
              {lang === "mn"
                ? s.district
                : districtEnglish[districts.indexOf(s.district)]}
            </dd>
            <dt>{t(lang, "cost")}</dt>
            <dd>
              {s.cost === "unknown"
                ? unknown
                : s.cost === "free"
                  ? t(lang, "free")
                  : t(lang, "paid")}
            </dd>
            <dt>
              {t(lang, "published_opening_hours")}
            </dt>
            <dd>{s.hours?.[lang] || unknown}</dd>
            <dt>{t(lang, "published_address")}</dt>
            <dd>{s.address?.[lang] || unknown}</dd>
            {mapUrl && (
              <>
                <dt>{t(lang, "about_the_map_link")}</dt>
                <dd>
                  {t(lang, "searches_by_name_and_published_address_the_map_pin_and_an_accessi")}
                </dd>
              </>
            )}
            <dt>{t(lang, "published_email")}</dt>
            <dd>{s.email || unknown}</dd>
            <dt>{t(lang, "information_status")}</dt>
            <dd>
              {s.verificationStatus === "provider-confirmed"
                ? t(lang, "provider_confirmed")
                : s.verificationStatus === "source-checked"
                  ? t(lang, "source_checked")
                  : t(lang, "not_checked")}
            </dd>
            <dt>{t(lang, "source_reviewed")}</dt>
            <dd>
              {s.lastChecked ? (
                <time dateTime={s.lastChecked}>{s.lastChecked}</time>
              ) : (
                unknown
              )}
            </dd>
            <dt>
              {t(lang, "direct_provider_confirmation")}
            </dt>
            <dd>
              {s.providerConfirmedAt ||
                t(lang, "not_yet_confirmed")}
            </dd>
            <dt>
              {t(lang, "organisation_sources")}
            </dt>
            <dd>
              <ul className="source-links">
                {s.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url}>{source.title[lang]}</a>
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
          <Link
            className="button secondary"
            href={`/contact?lang=${lang}&service=${s.id}#feedback`}
          >
            {t(lang, "report_incorrect_information")}
          </Link>
        </aside>
      </div>
    </main>
  );
}
