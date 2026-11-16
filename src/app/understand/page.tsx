import { selectLanguage } from '@/shared/language';
import type { Lang } from '@/shared/data';
import { autismGlossary, disabilityTopics, seizureFirstAid, sharedSupportSources, sharedSupportTips, sourceDisplayDate, understandCopy as copy, understandSources, type UnderstandSourceId } from '@/shared/understand';

function Sources({ ids, lang }: { ids: UnderstandSourceId[]; lang: Lang }) {
  return <ul className="source-links understand-sources">{ids.map(id => {
    const item = understandSources[id];
    const displayed = sourceDisplayDate(item);
    return <li key={id}><a href={item.url}>{item.title[lang]}</a>
      <small>{copy[displayed.kind][lang]}: <time dateTime={displayed.date}>{displayed.date}</time>{displayed.reviewer && <> — {displayed.reviewer}</>}</small>
    </li>;
  })}</ul>;
}

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string | string[]; page?: string }> }) {
  const lang = selectLanguage((await searchParams).lang);
  return <main id="main" className="content page understand-page">
    <header className="understand-intro">
      <h1>{copy.title[lang]}</h1>
      <p className="intro">{copy.intro[lang]}</p>
      <p>{copy.overlap[lang]}</p>
      <p>{copy.distinct[lang]}</p>
      <p>{copy.respect[lang]}</p>
      <Sources ids={['who', 'spinal']} lang={lang} />
    </header>
    <nav className="topic-index" aria-label={copy.topicIndex[lang]}>
      {disabilityTopics.map(topic => <a key={topic.id} href={`#${topic.id}`}>{topic.title[lang]}</a>)}
    </nav>
    <section aria-labelledby="topics-heading">
      <h2 id="topics-heading">{copy.topics[lang]}</h2>
      <p className="meta">{copy.sourceLanguage[lang]}</p>
      <div className="understand-grid">{disabilityTopics.map(topic => <article className="understand-card" id={topic.id} key={topic.id} aria-labelledby={`${topic.id}-heading`}>
        <h3 id={`${topic.id}-heading`}>{topic.title[lang]}</h3>
        <p>{topic.explanation[lang]}</p>
        <details>
          <summary>{copy.details[lang]}<span className="visually-hidden">: {topic.title[lang]}</span></summary>
          <div className="understand-detail-content">
            <h4>{copy.experiences[lang]}</h4><p>{topic.experiences[lang]}</p>
            <h4>{copy.misunderstanding[lang]}</h4><p>{topic.misunderstanding[lang]}</p>
            <h4>{copy.tips[lang]}</h4><ul>{topic.tips.map((tip, i) => <li key={i}>{tip[lang]}</li>)}</ul>
            <h4>{copy.dailyLife[lang]}</h4><p>{topic.dailyLife[lang]}</p>
            <h4>{copy.educationWork[lang]}</h4><p>{topic.educationWork[lang]}</p>
            <h4>{copy.digitalAccess[lang]}</h4><p>{topic.digitalAccess[lang]}</p>
            <h4>{copy.furtherDetails[lang]}</h4>{topic.furtherDetails.map((detail, i) => <p key={i}>{detail[lang]}</p>)}
            {topic.id === 'autism' && <><h4>{copy.glossary[lang]}</h4><ul>{autismGlossary.map(item => <li key={item.term}>{item.meaning[lang]} (<span lang="en">{item.term}</span>)</li>)}</ul></>}
            {topic.id === 'epilepsy' && <a className="text-link" href="#seizure-first-aid">{copy.firstAid[lang]}</a>}
            <h4>{copy.sources[lang]}</h4><Sources ids={topic.sources} lang={lang} />
          </div>
        </details>
      </article>)}</div>
    </section>
    <section className="understand-first-aid" id="seizure-first-aid" aria-labelledby="first-aid-heading">
      <h2 id="first-aid-heading">{copy.firstAid[lang]}</h2>
      <p className="note medical-review-note">{copy.medicalReview[lang]}</p>
      <ol>{seizureFirstAid.map((step, i) => <li key={i}>{step[lang]}</li>)}</ol>
      <h3>{copy.emergency[lang]}</h3><p>{copy.emergencyText[lang]}</p>
      <a className="text-link" href="tel:103">{lang === 'mn' ? 'Түргэн тусламж: 103 (Монгол)' : 'Ambulance: 103 (Mongolia)'}</a>
      <p>{copy.firstAidNote[lang]}</p>
      <Sources ids={['seizure', 'seizureNhs', 'seizureEmergency', 'ambulance']} lang={lang} />
    </section>
    <section className="help-reading" aria-labelledby="shared-support-heading">
      <h2 id="shared-support-heading">{copy.sharedSupport[lang]}</h2>
      <ul className="reading-list">{sharedSupportTips.map((tip, i) => <li key={i}>{tip[lang]}</li>)}</ul>
      <Sources ids={sharedSupportSources} lang={lang} />
    </section>
    <section className="help-reading" aria-labelledby="mongolian-reading-heading">
      <h2 id="mongolian-reading-heading">{copy.reading[lang]}</h2>
      <p>{copy.readingNote[lang]}</p><Sources ids={['mongolianReading']} lang={lang} />
    </section>
    <aside className="note understand-review" aria-labelledby="review-heading">
      <h2 id="review-heading">{copy.review[lang]}</h2><p>{copy.reviewText[lang]}</p>
    </aside>
  </main>;
}
