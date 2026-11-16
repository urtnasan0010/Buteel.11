/* eslint-disable @next/next/no-img-element -- Images are served by an authenticated same-origin route. */
import type { Lang } from '@/shared/data';
import { pc, postDate, type Post } from '@/shared/posts';

export default function PostArticle({ post, lang, expanded = false }: { post: Post; lang: Lang; expanded?: boolean }) {
  const title = post.title.mn;
  const body = post.body.mn;
  const bodyLang = 'mn';
  return <article className="home-post" id={`post-${post.id}`}>
    <div className="post-meta"><span className={`post-type post-type-${post.type}`}>{pc(lang,post.type)}</span><time dateTime={post.postedDate}>{postDate(post.postedDate,lang)}</time></div>
    <h2 lang="mn">{title || pc(lang,'draft')}</h2>
    {body.length > 300 && !expanded ? <><p className="post-excerpt" lang={bodyLang}>{body.slice(0,300)}…</p><details className="post-details"><summary>{pc(lang,'read')}</summary><p className="post-body" lang={bodyLang}>{body}</p></details></> : <p className="post-body" lang={bodyLang}>{body}</p>}
    {post.images.length > 0 && <div className="post-gallery" role="region" aria-label={pc(lang,'images')} tabIndex={post.images.length > 1 ? 0 : undefined}>{post.images.map((image,index) => <figure key={image.id}>
      <img src={image.url} alt={image.alt.mn} loading={index ? 'lazy' : 'eager'} decoding="async" />
      {post.images.length > 1 && <figcaption>{index + 1} / {post.images.length}</figcaption>}
    </figure>)}</div>}
  </article>;
}
