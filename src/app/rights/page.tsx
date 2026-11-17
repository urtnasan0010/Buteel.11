import type { Text } from '@/shared/data';
import { Noto_Serif } from 'next/font/google';
import { publicRightsBenefits as rightsBenefits, publicRightsCopy as copy, publicRightsHistory as rightsHistory, publicRightsTopics as rightsTopics } from '@/shared/rights-public';

const serif = Noto_Serif({ weight: '700', subsets: ['cyrillic', 'latin'], display: 'swap', variable: '--hero-serif' });

function Paragraphs({ items }: { items: Text[] }) {
  return <>{items.map((item, i) => <p key={i}>{item.mn}</p>)}</>;
}

export default function Page() {
  const topics = rightsTopics;
  return <main id="main" className="content page understand-page rights-page">
    <header className={`home-hero guide-hero ${serif.variable}`}><h1 className="home-title">Монгол улсын хөгжлийн бэрхшээлтэй иргэдийн эрх</h1></header>

    <section aria-labelledby="rights-topics-heading">
      <h2 id="rights-topics-heading">{copy.topics.mn}</h2>

      <div className="understand-grid">{topics.map(topic => <article className="understand-card rights-card" key={topic.id} id={`right-${topic.id}`} aria-labelledby={`right-${topic.id}-heading`}>
        <h3 id={`right-${topic.id}-heading`}>{topic.title.mn}</h3><p>{topic.summary.mn}</p>
        <details><summary>Дэлгэрүүлж унших<span className="visually-hidden">: {topic.title.mn}</span></summary>
          <div className="understand-detail-content">
            <h4>{copy.entitlement.mn}</h4><Paragraphs items={topic.entitlement} />
            <h4>{copy.conditions.mn}</h4><Paragraphs items={topic.conditions} />
            <h4>{copy.steps.mn}</h4><ol className="rights-steps">{topic.steps.map((step, i) => <li key={i}>{step.mn}</li>)}</ol>
            <h4>{copy.where.mn}</h4><p>{topic.where.mn}</p>
            {topic.id === 'benefits' && <>
              <h4>{copy.rates.mn}</h4><p>Эдгээр нь тусдаа төлбөр. Онош дангаараа бүгдийг авах эрх үүсгэхгүй; хүүхдийн дэмжлэг нь нийтлэг хүүхдийн мөнгөтэй ижил биш.</p>
              <dl className="rights-benefits">{rightsBenefits.map(benefit => <div key={benefit.id} data-benefit={benefit.id}>
                <dt>{benefit.title.mn}</dt><dd>
                  <p className="rights-amount">{new Intl.NumberFormat('mn-MN').format(benefit.amount)} ₮ / {copy.perMonth.mn}</p>
                  <p><strong>{copy.eligibility.mn}:</strong> {benefit.eligibility.mn}</p>
                  <p>{copy.effective.mn}: <time dateTime={benefit.effectiveFrom}>{benefit.effectiveFrom}</time></p>
                </dd>
              </div>)}</dl>
            </>}
            <h4>{copy.law.mn}</h4>{topic.laws.length ? <dl className="rights-laws">{topic.laws.map((law, i) => <div key={i}><dt>{law.name.mn}</dt><dd>{law.provisions.mn}</dd></div>)}</dl> : null}

          </div>
        </details>
      </article>)}</div>
    </section>

<section aria-labelledby="history-heading" className="help-reading">
      <h2 id="history-heading">{copy.history.mn}</h2><p>{copy.historyNote.mn}</p>
      <dl className="rights-history">{rightsHistory.map((item, i) => <div key={i} data-legal-status={item.kind}>
        <dt>{item.title.mn}</dt><dd>
          <p>{copy.future.mn}: <time dateTime={item.date}>{item.date}</time></p>
          <p>{item.note.mn}</p>

        </dd>
      </div>)}</dl>
    </section>
    <aside className="note understand-review"><p>Хамрагдах нөхцөл, журам өөрчлөгдөж болно. Хууль зүйн зөвлөгөөг орлохгүй.</p></aside>
  </main>;
}
