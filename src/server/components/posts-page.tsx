import Link from 'next/link';
import { selectLanguage } from '@/shared/language';
import { listPosts } from '@/server/posts';
import { pc } from '@/shared/posts';
import PostArticle from '@/client/components/post-article';

export async function PostsPage({ searchParams, path = '/', embedded = false, embeddedHeading, heroClassName = '' }: { heroClassName?: string; embeddedHeading?: string; embedded?: boolean; path?: string; searchParams: Promise<{ lang?: string | string[]; page?: string }> }) {
  // Category values never choose a destination; publishing is confined to Home.
  if (path !== '/') return null;
  const params = await searchParams; const lang = selectLanguage(params.lang);
  const heroLang = (Array.isArray(params.lang) ? params.lang[0] : params.lang) === 'en' ? 'en' : 'mn';
  const page = Math.max(1,Math.min(10000,Number.parseInt(params.page || '1',10) || 1));
  let data; let unavailable = false;
  try { data = await listPosts({ page }); } catch { unavailable = true; console.error('Public post feed unavailable.'); }
  const href = (nextPage = 1) => `${path}?lang=${lang}${nextPage > 1 ? `&page=${nextPage}` : ''}#posts`;
  const Container = embedded ? 'div' : 'main';
  if (embedded && (!data?.posts.length || unavailable)) return null;
  return <Container id={embedded ? undefined : 'main'} className={embedded ? 'understand-posts' : 'content page posts-page'}>
    {embeddedHeading && <h2>{embeddedHeading}</h2>}
    {!embedded && <header className={`home-hero ${heroClassName}`}>
      <h1 className="home-title">Хүртээмж</h1>
      <p className="home-subtitle" lang={heroLang}>{heroLang === 'en'
        ? 'A nationwide directory of disability support, organisations and rights.'
        : 'Монгол даяарх хөгжлийн бэрхшээлийн дэмжлэг, байгууллага, эрхийн мэдээллийн сан.'}</p>
    </header>}
    {(unavailable || Boolean(data?.posts.length)) && <section id="posts" className="post-feed" aria-label={pc(lang,'heading')}>
      {unavailable ? <div className="post-empty"><p role="status">{pc(lang,'unavailable')}</p><a className="button secondary" href={href()}>{pc(lang,'retry')}</a></div>
        : data?.posts.map(post => <PostArticle key={post.id} post={post} lang={lang}/>)}
    </section>}
    {!unavailable && (page > 1 || data?.hasMore) && <nav className="post-pagination" aria-label={lang === 'mn' ? 'Нийтлэлийн хуудас' : 'Post pages'}>{page > 1 && <Link className="button secondary" href={href(page - 1)}>{pc(lang,'previous')}</Link>}{data?.hasMore && <Link className="button secondary" href={href(page + 1)}>{pc(lang,'next')}</Link>}</nav>}
  </Container>;
}

