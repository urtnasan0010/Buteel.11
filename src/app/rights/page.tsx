import type { Lang, Text } from '@/shared/data';
import { selectLanguage } from '@/shared/language';
import {
  filterRightsTopics, rightsAsOf, rightsBenefits, rightsContacts, rightsCopy as copy,
  rightsEmergency, rightsHistory, rightsSources, rightsTopics, type RightsSourceId,
} from '@/shared/rights';

function ReviewLabel({ lang }: { lang: Lang }) {
  return <strong className="rights-review-label">{copy.unverified[lang]} <span lang="en">(UNVERIFIED)</span></strong>;
}

function Sources({ ids, lang }: { ids: RightsSourceId[]; lang: Lang }) {
  return <ul className="source-links understand-sources rights-sources">{[...new Set(ids)].map(id => {
    const source = rightsSources[id];
    return <li key={id} data-verification={source.verification}>
      <a href={source.url}>{source.title[lang]}</a>
      {source.verification === 'UNVERIFIED' ? <ReviewLabel lang={lang} /> : <small>{copy.verified[lang]}</small>}
      <p>{source.scope[lang]}</p>
      <small>{copy.checked[lang]}: {source.checkedOn ? <time dateTime={source.checkedOn}>{source.checkedOn}</time> : copy.unchecked[lang]}</small>
      {!source.checkedOn && <small>{copy.attempted[lang]}: <time dateTime={source.attemptedOn}>{source.attemptedOn}</time></small>}
      {source.publishedOn && <small>{copy.published[lang]}: <time dateTime={source.publishedOn}>{source.publishedOn}</time></small>}
      <small>{copy.updated[lang]}: {source.updatedOn ? <time dateTime={source.updatedOn}>{source.updatedOn}</time> : copy.unknown[lang]}</small>
    </li>;
  })}</ul>;
}

function Paragraphs({ items, lang }: { items: Text[]; lang: Lang }) {
  return <>{items.map((item, i) => <p key={i}>{item[lang]}</p>)}</>;
}

type Params = { lang?: string | string[]; q?: string | string[]; topic?: string | string[] };
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) || '';

export default async function Page({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const lang = selectLanguage(params.lang);
  const query = first(params.q).slice(0, 200).trim();
  const requestedTopic = first(params.topic);
  const topicId = rightsTopics.some(topic => topic.id === requestedTopic) ? requestedTopic : '';
  const topics = filterRightsTopics(query, topicId, false);

  return <main id="main" className="content page understand-page rights-page">
    <header className="understand-intro">
      <h1>{copy.title[lang]}</h1>
      <p className="intro">{copy.intro[lang]}</p>
      <p>{copy.scope[lang]}</p><p>{copy.advice[lang]}</p>
      <p className="meta">{copy.currency[lang]}: <time dateTime={rightsAsOf}>{rightsAsOf}</time></p>
      <a className="text-link" href="#rights-contacts">{copy.contacts[lang]}</a>
    </header>

    <section className="rights-emergency note" aria-labelledby="emergency-heading">
      <h2 id="emergency-heading">{copy.emergency[lang]}</h2><p>{copy.emergencyIntro[lang]}</p>
      <ul>{rightsEmergency.map(item => <li key={item.number}><a href={`tel:${item.number}`} className="text-link">{item.number} — {item.title[lang]}</a></li>)}</ul>
      <Sources ids={['nhrc']} lang={lang} />
    </section>

    <section aria-labelledby="rights-topics-heading">
      <h2 id="rights-topics-heading">{copy.topics[lang]}</h2>
      <form action="/rights#rights-results" method="get" className="rights-filters" role="search" aria-label={copy.topics[lang]}>
        <input type="hidden" name="lang" value={lang} />
        <div><label htmlFor="rights-query">{copy.search[lang]}</label>
          <input type="search" id="rights-query" name="q" maxLength={200} defaultValue={query} aria-describedby="rights-query-hint" />
          <p id="rights-query-hint" className="meta">{copy.searchHint[lang]}</p>
        </div>
        <div><label htmlFor="rights-topic">{copy.filter[lang]}</label>
          <select name="topic" id="rights-topic" defaultValue={topicId}>
            <option value="">{copy.all[lang]}</option>
            {rightsTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.title[lang]}</option>)}
          </select>
        </div>
        <button type="submit">{copy.submit[lang]}</button>
        {(query || topicId) && <a className="text-link" href={`/rights?lang=${lang}#rights-topics-heading`}>{copy.reset[lang]}</a>}
      </form>
      <p id="rights-results" role="status" className="rights-result-count">{copy.results[lang]}: {topics.length} / {rightsTopics.length}</p>
      {!topics.length && <p className="note">{copy.noResults[lang]}</p>}
      <div className="understand-grid">{topics.map(topic => <article className="understand-card rights-card" key={topic.id} id={`right-${topic.id}`} aria-labelledby={`right-${topic.id}-heading`}>
        <h3 id={`right-${topic.id}-heading`}>{topic.title[lang]}</h3><p>{topic.summary[lang]}</p>
        {topic.unverified.length > 0 && <p className="meta">{copy.partialReview[lang]}</p>}
        <details><summary>{copy.details[lang]}<span className="visually-hidden">: {topic.title[lang]}</span></summary>
          <div className="understand-detail-content">
            <h4>{copy.entitlement[lang]}</h4><Paragraphs items={topic.entitlement} lang={lang} />
            <h4>{copy.conditions[lang]}</h4><Paragraphs items={topic.conditions} lang={lang} />
            <h4>{copy.steps[lang]}</h4><ol className="rights-steps">{topic.steps.map((step, i) => <li key={i}>{step[lang]}</li>)}</ol>
            <h4>{copy.where[lang]}</h4><p>{topic.where[lang]}</p><a className="text-link" href="#rights-contacts">{copy.contacts[lang]}</a>
            {topic.id === 'benefits' && <>
              <h4>{copy.rates[lang]}</h4><p>{copy.benefitCaution[lang]}</p>
              <dl className="rights-benefits">{rightsBenefits.map(benefit => <div key={benefit.id} data-benefit={benefit.id}>
                <dt>{benefit.title[lang]}</dt><dd>
                  <p className="rights-amount">{new Intl.NumberFormat(lang === 'mn' ? 'mn-MN' : 'en-GB').format(benefit.amount)} ₮ / {copy.perMonth[lang]}</p>
                  <p><strong>{copy.eligibility[lang]}:</strong> {benefit.eligibility[lang]}</p>
                  <p>{copy.effective[lang]}: <time dateTime={benefit.effectiveFrom}>{benefit.effectiveFrom}</time></p>
                  <a href={rightsSources[benefit.source].url}>{rightsSources[benefit.source].title[lang]}</a>
                  <small>{copy.checked[lang]}: <time dateTime={rightsSources[benefit.source].checkedOn!}>{rightsSources[benefit.source].checkedOn}</time></small>
                </dd>
              </div>)}</dl>
            </>}
            <h4>{copy.law[lang]}</h4><dl className="rights-laws">{topic.laws.map((law, i) => <div key={i}><dt>{law.name[lang]}</dt><dd>{law.provisions[lang]}</dd></div>)}</dl>
            {topic.unverified.length > 0 && <div className="rights-review"><h4>{copy.review[lang]}</h4><ReviewLabel lang={lang} /><ul>{topic.unverified.map((item, i) => <li key={i}>{item[lang]}</li>)}</ul></div>}
            <h4>{copy.sources[lang]}</h4><Sources ids={topic.sources} lang={lang} />
          </div>
        </details>
      </article>)}</div>
    </section>

    <section id="rights-contacts" aria-labelledby="contacts-heading" className="help-reading">
      <h2 id="contacts-heading">{copy.contacts[lang]}</h2><p>{copy.contactCaution[lang]}</p>
      <dl className="rights-contacts">{rightsContacts.map(contact => <div key={contact.id} data-contact={contact.id}>
        <dt>{contact.title[lang]}</dt><dd><p>{contact.purpose[lang]}</p>
          {contact.verification === 'UNVERIFIED' && <p><ReviewLabel lang={lang} /></p>}
          <p>{copy.phone[lang]}: {contact.verification === 'VERIFIED' ? <a href={`tel:${contact.phone.replaceAll('-', '')}`}>{contact.phone}</a> : contact.phone}</p>
          {contact.email && <p>{copy.email[lang]}: {contact.verification === 'VERIFIED' ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : contact.email}</p>}
          <a className="text-link" href={contact.id === 'nhrc' && lang === 'en' ? 'https://2026.nhrcm.gov.mn/complaint?lang=en' : contact.url}>{copy.website[lang]}</a>
          <Sources ids={contact.id === 'nhrc' ? ['nhrc', 'nhrcEnglish'] : [contact.source]} lang={lang} />
        </dd>
      </div>)}</dl>
    </section>

    <section aria-labelledby="history-heading" className="help-reading">
      <h2 id="history-heading">{copy.history[lang]}</h2><p>{copy.historyNote[lang]}</p>
      <dl className="rights-history">{rightsHistory.map((item, i) => <div key={i} data-legal-status={item.kind}>
        <dt>{item.title[lang]}</dt><dd>
          <p>{item.kind === 'ENACTED' ? copy.enacted[lang] : item.kind === 'FUTURE_CHANGE' ? copy.future[lang] : copy.foundAmendment[lang]}</p>
          <p>{item.kind === 'ENACTED' ? copy.adopted[lang] : item.kind === 'FUTURE_CHANGE' ? copy.effective[lang] : copy.foundAmendment[lang]}: <time dateTime={item.date}>{item.date}</time></p>
          <p>{item.note[lang]}</p>{item.unverified && <ReviewLabel lang={lang} />}
          <Sources ids={item.kind === 'ENACTED' ? [item.source, 'disabilityAmendment'] : [item.source]} lang={lang} />
        </dd>
      </div>)}</dl>
    </section>
    <aside className="note understand-review"><h2>{copy.review[lang]}</h2><p>{copy.reviewFooter[lang]}</p></aside>
  </main>;
}
