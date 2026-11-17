import { Noto_Serif } from 'next/font/google';
import { dementiaGuide, helpGuides, helpNeeds } from '@/shared/help-guides';
import { seizureFirstAid, understandCopy } from '@/shared/understand';

const serif = Noto_Serif({ weight: '700', subsets: ['cyrillic', 'latin'], display: 'swap', variable: '--hero-serif' });

export default function Page() {
  const guides = [...helpGuides, dementiaGuide];
  return <main id="main" className="content page understand-page help-page">
    <header className={`home-hero guide-hero ${serif.variable}`}><h1 className="home-title">Хэрхэн туслах вэ?</h1></header>
    <p className="guide-intro">&quot;Танд тусламж хэрэгтэй юу? Би яаж туслах вэ?&quot; гэж эхлээд асуу. Татгалзсан хариуг хүлээн зөвшөөр. Хэрэгцээ давхцаж болох бөгөөд онош дангаараа хүний чадварыг тодорхойлохгүй.</p>

    <section id="help-results" aria-labelledby="help-heading"><h2 id="help-heading">Практик зөвлөмж</h2>

      <nav className="topic-index" aria-label="Сэдэв рүү очих">{guides.map(guide => <a key={guide.id} href={`#help-${guide.id}`}>{guide.title.mn}</a>)}</nav>
      <div className="understand-grid">{guides.map(guide => <article className="understand-card" id={`help-${guide.id}`} key={guide.id} aria-labelledby={`help-title-${guide.id}`}>
        <h3 id={`help-title-${guide.id}`}>{guide.title.mn}</h3><p>{guide.explanation.mn}</p><p className="meta">{guide.needs.map(id => helpNeeds[id].mn).join("  ")}</p>
        <details><summary>Дэлгэрүүлж унших<span className="visually-hidden">: {guide.title.mn}</span></summary><div className="understand-detail-content">
          <h4>Эхлээд юу асуух вэ?</h4><p>{guide.ask.mn}</p>
          <h4>Өдөр тутам хэрхэн туслах вэ?</h4><ul>{guide.tips.map((tip, i) => <li key={i}>{tip.mn}</li>)}</ul>
          {'additional' in guide && guide.additional.map((item, i) => <p key={i}>{item.mn}</p>)}
          <h4>Юунаас зайлсхийх вэ?</h4><p>{'avoid' in guide ? guide.avoid.mn : guide.misunderstanding.mn}</p>
          <h4>Хамт ярилцах жишээ</h4><ul>{guide.examples.map((item, i) => <li key={i}>{item.mn}</li>)}</ul>
          <h4>Мэргэжлийн үнэлгээ, сургалт</h4><p>{guide.professional.mn}</p>
          <h4>Монголд тохируулах нь</h4><p>Хүссэн тохируулгаа гэр бүл, багш, ажил олгогчтой өөрийн зөвшөөрлөөр ярилц. Очих газрын орц, мэдээллийн хэлбэр, дэмжлэгийн бэлэн байдлыг урьдчилж лавла. Эдгээр жишээ нь зөвлөмж бөгөөд үйлчилгээ бэлэн гэсэн баталгаа биш.</p>
          <a href={`/rights#right-${guide.rights}`}>Холбогдох эрхийн мэдээлэл</a>
          {guide.id === 'epilepsy' && <><h4>{understandCopy.firstAid.mn}</h4><ol>{seizureFirstAid.map((step, i) => <li key={i}>{step.mn}</li>)}</ol><p>{understandCopy.emergencyText.mn}</p><a className="button" href="tel:103">Түргэн тусламж: 103 (Монгол)</a></>}
        </div></details>
      </article>)}</div>
    </section>

  </main>;
}
