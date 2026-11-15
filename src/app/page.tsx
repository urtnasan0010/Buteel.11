import Link from 'next/link';
import { selectLanguage } from '@/shared/language';
import { n, regions } from '@/shared/nationwide';
import SiteInformation from '@/server/components/site-information';
export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string | string[]; info?: string }> }) {
  const p = await searchParams;
  const lang = selectLanguage(p.lang);
  return <main id="main" className="home-page">
    <section className="nation-hero content">
      <h1>{n(lang, 'homeTitle')}</h1><p className="intro">{n(lang, 'homeShort')}</p>
      <form action="/help#organisations" className="home-directory-search">
        <input type="hidden" name="lang" value={lang} />
        <label>{n(lang,'query')}<input name="q" maxLength={300} /></label>
        <label>{n(lang,'region')}<select name="region"><option value="">{n(lang,'allRegions')}</option>{regions.map(region => <option key={region.id} value={region.id}>{region.name[lang]}</option>)}</select></label>
        <label>{n(lang,'area')}<input name="area" maxLength={150} /></label>
        <button type="submit">{n(lang,'directory')}</button>
      </form>
    </section>
    <div className="content section-links">{(['understand','help','rights'] as const).map(section => <Link key={section} href={`/${section}?lang=${lang}`}><h2>{n(lang,section)}</h2><p>{n(lang,`${section}Card`)}</p></Link>)}</div>
    <SiteInformation lang={lang} open={Boolean(p.info)} />
  </main>;
}
