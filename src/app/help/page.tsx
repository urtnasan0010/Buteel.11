import { selectLanguage } from '@/shared/language';
import { dementiaGuide, helpDates, helpGuides, helpNeeds, helpResearchSources, matchesHelp } from '@/shared/help-guides';
import { seizureFirstAid, understandCopy, understandSources } from '@/shared/understand';
import researchLinks from '@/shared/help-research-links.json';

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string | string[]; page?: string; q?: string; need?: string }> }) {
  const params = await searchParams;
  const lang = selectLanguage(params.lang);
  const s = (mn: string, en: string) => lang === 'mn' ? mn : en;
  const q = typeof params.q === 'string' ? params.q.trim().slice(0, 200) : '';
  const need = typeof params.need === 'string' && Object.hasOwn(helpNeeds, params.need) ? params.need : '';
  const guides = [...helpGuides, dementiaGuide].filter(guide => matchesHelp(guide, q, need));
  return <main id="main" className="content page understand-page help-page">
    <header className="understand-intro"><h1>{s('Хэрхэн туслах вэ?', 'How can I help?')}</h1>
      <p className="intro">{s('“Танд тусламж хэрэгтэй юу? Би яаж туслах вэ?” гэж эхлээд асуу. Зөвшөөрөл, сонголт, бие даасан байдлыг хүндэтгэж, татгалзсан хариуг хүлээн зөвшөөр.', 'Start by asking: “Would you like help? How can I help?” Respect consent, choice and independence, including a decision to decline help.')}</p>
      <p>{s('Хэрэгцээ давхцаж болно. Онош дангаараа хүний чадвар, хэрэгцээг тодорхойлохгүй. Хүүхэдтэй шууд харилцаж, насанд нь тохирсон сонголт өг; насанд хүрсэн хүнийг хүүхэд мэт бүү харьц.', 'Needs can overlap. Diagnosis alone does not describe abilities or needs. Address children directly and offer age-appropriate choices; treat adults as adults.')}</p>
      <p className="note">{s('Монгол орчуулга, орон нутгийн хэрэгжилтэд мэргэжлийн болон хөгжлийн бэрхшээлтэй хүмүүсийн хяналт шаардлагатай. Гадаадын хууль, үйлчилгээ Монголд үйлчилнэ гэсэн үг биш.', 'Mongolian wording and local application require professional and lived-experience review. Foreign laws and services do not automatically apply in Mongolia.')}</p>
      <p className="meta">{s('Судалгаанд тэмдэглэсэн огноо', 'Research-reported date')}: {helpDates.researchReported}. {s('Хэрэгжүүлсэн', 'Implemented')}: {helpDates.implemented}. {s('Хүний хяналт: хүлээгдэж байна.', 'Human review: pending.')}</p>
    </header>
    <nav className="section-links" aria-label={s('Холбогдох мэдээлэл', 'Related information')}><a href={`/understand?lang=${lang}`}>{s('Ойлгох', 'Understand')}</a><a href={`/rights?lang=${lang}`}>{s('Эрх', 'Rights')}</a><a href={`/rights?lang=${lang}#rights-contacts`}>{s('Зөвлөгөө, гомдол', 'Advice and complaints')}</a></nav>
    <form action="/help#help-results" method="get" className="help-filters" role="search">
      <input type="hidden" name="lang" value={lang} /><label htmlFor="help-search">{s('Сэдэв, хэрэгцээгээр хайх', 'Search topics and needs')}</label><input id="help-search" name="q" type="search" maxLength={200} defaultValue={q} />
      <label htmlFor="help-need">{s('Ямар дэмжлэг хэрэгтэй вэ?', 'What support is needed?')}</label><select id="help-need" name="need" defaultValue={need}><option value="">{s('Бүх хэрэгцээ', 'All needs')}</option>{Object.entries(helpNeeds).map(([id, label]) => <option value={id} key={id}>{label[lang]}</option>)}</select>
      <button type="submit">{s('Хайх', 'Search')}</button><a href={`/help?lang=${lang}#help-results`}>{s('Шүүлт арилгах', 'Reset filters')}</a>
    </form>
    <section id="help-results" aria-labelledby="help-heading"><h2 id="help-heading">{s('Практик зөвлөмж', 'Practical support')} ({guides.length})</h2>
      {!guides.length && <p>{s('Тохирох сэдэв олдсонгүй. Хайлтаа богиносгох эсвэл шүүлтээ арилгаарай.', 'No matching topics. Try fewer words or reset the filters.')}</p>}
      <nav className="topic-index" aria-label={s('Сэдэв рүү очих', 'Jump to topic')}>{guides.map(guide => <a key={guide.id} href={`#help-${guide.id}`}>{guide.title[lang]}</a>)}</nav>
      <div className="understand-grid">{guides.map(guide => <article className="understand-card" id={`help-${guide.id}`} key={guide.id} aria-labelledby={`help-title-${guide.id}`}>
        <h3 id={`help-title-${guide.id}`}>{guide.title[lang]}</h3><p>{guide.explanation[lang]}</p><p className="meta">{guide.needs.map(id => helpNeeds[id][lang]).join(' · ')}</p>
        <details><summary>{s('Дэлгэрүүлж унших', 'Read practical guidance')}<span className="visually-hidden">: {guide.title[lang]}</span></summary><div className="understand-detail-content">
          <h4>{s('Эхлээд юу асуух вэ?', 'What to ask first')}</h4><p>{guide.ask[lang]}</p>
          <h4>{s('Өдөр тутам хэрхэн туслах вэ?', 'Everyday support')}</h4><ul>{guide.tips.map((tip, i) => <li key={i}>{tip[lang]}</li>)}</ul>
          {'additional' in guide && guide.additional.map((item, i) => <p key={i}>{item[lang]}</p>)}
          <h4>{s('Юунаас зайлсхийх вэ?', 'What to avoid')}</h4><p>{'avoid' in guide ? guide.avoid[lang] : guide.misunderstanding[lang]}</p>
          <h4>{s('Хамт ярилцах жишээ', 'Illustrative ideas to discuss')}</h4><ul>{guide.examples.map((item, i) => <li key={i}>{item[lang]}</li>)}</ul>
          <h4>{s('Мэргэжлийн үнэлгээ, сургалт', 'Professional assessment and training')}</h4><p>{guide.professional[lang]}</p>
          <h4>{s('Монголд тохируулах нь', 'Adapting in Mongolia')}</h4><p>{s('Хүссэн тохируулгаа гэр бүл, багш, ажил олгогчтой өөрийн зөвшөөрлөөр ярилц. Очих газрын орц, мэдээллийн хэлбэр, дэмжлэгийн бэлэн байдлыг урьдчилж лавла. Эдгээр жишээ нь зөвлөмж бөгөөд үйлчилгээ бэлэн гэсэн баталгаа биш.', 'With your consent, discuss preferred adjustments with family, teachers or employers. Ask ahead about entrance access, information formats and available support. These are suggestions, not guarantees of service availability.')}</p>
          <a href={`/rights?lang=${lang}#right-${guide.rights}`}>{s('Холбогдох эрхийн мэдээлэл', 'Related rights information')}</a>
          {guide.id === 'epilepsy' && <><h4>{understandCopy.firstAid[lang]}</h4><p className="note">{understandCopy.medicalReview[lang]}</p><ol>{seizureFirstAid.map((step, i) => <li key={i}>{step[lang]}</li>)}</ol><p>{understandCopy.emergencyText[lang]}</p><a href="tel:103">{s('Түргэн тусламж: 103 (Монгол)', 'Ambulance: 103 (Mongolia)')}</a><p><a href="https://www.cdc.gov/epilepsy/first-aid-for-seizures/">CDC</a> · <a href="https://www.nhs.uk/symptoms/what-to-do-if-someone-has-a-seizure-fit/">NHS</a> · <a href="https://www.103.ub.gov.mn/a/30">{s('103-ын албан эх', 'Official 103 source')}</a> — {s('Дахин нээж шалгасан', 'Rechecked')}: 2026-11-16</p></>}
          <h4>{s('Эх сурвалж, хяналт', 'Sources and review')}</h4>
          <ul className="source-links understand-sources">{helpResearchSources[guide.id].map(source => <li key={source.url}><a href={source.url}>{source.url}</a><small>{source.rechecked ? `${s('Дахин нээж шалгасан', 'Reopened and checked')}: ${source.rechecked}` : s('Баталгаажуулах шаардлагатай — энэ хэрэгжүүлэлтээр дахин шалгаагүй.', 'Needs verification — not rechecked in this implementation.')} {s('Хүний хяналт хүлээгдэж байна.', 'Human review pending.')}</small></li>)}</ul>
          {'sources' in guide ? <ul className="source-links understand-sources">{Array.from(new Set(guide.sources)).map(id => <li key={id}><a href={understandSources[id].url}>{understandSources[id].title[lang]}</a><small>{s('Эхийг бүртгэсэн', 'Source recorded')}: {understandSources[id].added_at}. {s('Хүний хяналт хүлээгдэж байна.', 'Human review pending.')}</small></li>)}</ul> : <p><a href={guide.source.url}>{guide.source.title}</a> — {s('Дахин нээсэн', 'Reopened')}: {guide.source.rechecked}; {s('хүний хяналт хүлээгдэж байна.', 'human review pending.')}</p>}
        </div></details>
      </article>)}</div>
    </section>
    <section aria-labelledby="help-research"><h2 id="help-research">{s('Судалгааны нэмэлт унших материал', 'Further reading supplied with the research')}</h2><p>{s('Нэмэлт унших эх сурвалжуудыг хадгалсан. Бүгдийг шинээр шалгасан гэж үзэхгүй; Монгол дахь үйлчилгээ, хууль, холбоо барих мэдээллийг баталгаажуулах шаардлагатай.', 'The research links are retained. They have not all been newly verified; local services, legal applicability and contacts require confirmation.')}</p><details><summary>{s('Судалгааны холбоосууд', 'Research links')}</summary><ul className="source-links">{researchLinks.map(url => <li key={url}><a href={url}>{url}</a></li>)}</ul></details></section>
  </main>;
}
