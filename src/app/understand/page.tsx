import { GuideHeader } from '@/server/components/guide-header';
import { autismGlossary, disabilityTopics, seizureFirstAid, understandCopy as copy } from '@/shared/understand';

export default function Page() {
  return <main id="main" className="content page understand-page">
    <GuideHeader title={copy.title.mn} subtitle="Хүн бүрийн туршлага, хэрэгцээг ойлгож, тохирсон дэмжлэг үзүүлье." />
    <nav className="topic-index" aria-label={copy.topicIndex.mn}>
      {disabilityTopics.map(topic => <a key={topic.id} href={`#${topic.id}`}>{topic.title.mn}</a>)}
    </nav>
    <section aria-labelledby="topics-heading">
      <h2 id="topics-heading">{copy.topics.mn}</h2>

      <div className="understand-grid">{disabilityTopics.map(topic => <article className="understand-card" id={topic.id} key={topic.id} aria-labelledby={`${topic.id}-heading`}>
        <h3 id={`${topic.id}-heading`}>{topic.title.mn}</h3>
        <p>{topic.explanation.mn}</p>
        <details>
          <summary>Дэлгэрүүлж унших<span className="visually-hidden">: {topic.title.mn}</span></summary>
          <div className="understand-detail-content">
            <h4>{copy.experiences.mn}</h4><p>{topic.experiences.mn}</p>
            <h4>{copy.misunderstanding.mn}</h4><p>{topic.misunderstanding.mn}</p>
            <h4>{copy.tips.mn}</h4><ul>{topic.tips.map((tip, i) => <li key={i}>{tip.mn}</li>)}</ul>
            <h4>{copy.dailyLife.mn}</h4><p>{topic.dailyLife.mn}</p>
            <h4>{copy.educationWork.mn}</h4><p>{topic.educationWork.mn}</p>
            <h4>{copy.digitalAccess.mn}</h4><p>{topic.digitalAccess.mn}</p>
            <h4>{copy.furtherDetails.mn}</h4>{topic.furtherDetails.map((detail, i) => <p key={i}>{detail.mn}</p>)}
            {topic.id === 'autism' && <><h4>Нэр томьёоны тайлбар</h4><ul>{autismGlossary.map(item => <li key={item.term}>{item.meaning.mn}</li>)}</ul></>}
            {topic.id === 'epilepsy' && <a className="text-link" href="#seizure-first-aid">{copy.firstAid.mn}</a>}

          </div>
        </details>
      </article>)}</div>
    </section>
    <section className="understand-first-aid" id="seizure-first-aid" aria-labelledby="first-aid-heading">
      <h2 id="first-aid-heading">{copy.firstAid.mn}</h2>
      <ol>{seizureFirstAid.map((step, i) => <li key={i}>{step.mn}</li>)}</ol>
      <h3>{copy.emergency.mn}</h3><p>{copy.emergencyText.mn}</p>

    </section>
  </main>;
}
