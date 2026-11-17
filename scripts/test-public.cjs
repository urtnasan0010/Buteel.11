/* eslint-disable @typescript-eslint/no-require-imports -- Dependency-free render regressions. */
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createLoader } = require('./test-loader.cjs');
const Link = ({ children, ...props }) => React.createElement('a', props, children);
(async () => {
  const language = createLoader()('src/shared/language.ts');
  for (const value of [undefined, 'mn', 'en', ['en']]) assert.equal(language.selectLanguage(value), 'mn');
  console.log('Mongolian-only selection passed.');
  for (const failure of [false, true]) for (const route of ['/']) for (const lang of ['mn']) {
    const load = createLoader({
      'next/link': { default: Link, __esModule: true },
      '@/server/posts': { listPosts: async () => { if (failure) throw Error('isolated failure'); return { posts: [], hasMore: false }; } },
    });
    const { PostsPage } = load('src/server/components/posts-page.tsx');
    const html = renderToStaticMarkup(await PostsPage({ searchParams: Promise.resolve({ lang }), path: route }));
    assert.match(html, /<main[^>]*id="main"/);
    assert.match(html, /<h1 class="home-title">Хүртээмж<\/h1>/);
    assert.ok(!html.includes('class="intro"'));
    assert.ok(!html.includes('section-links'));
    assert.ok(!html.includes('href="/rights'));
    assert.ok(!html.includes('href="/understand'));
    const removed = load('src/shared/landing-content.ts').landingContent;
    for (const text of [removed.home.title.mn, removed.home.intro.mn, removed.empty.mn, removed.contact.mn, ...removed.links.flatMap(link => [link.title.mn, link.body.mn])]) assert.ok(!html.includes(text));
    assert.ok(!html.includes('<section id="posts" class="post-feed" aria-label="Мэдээ, мэдээлэл"></section>'));
    if (failure) assert.match(html, /role="status"/);
    assert.equal(await PostsPage({ searchParams: Promise.resolve({ lang }), embedded: true, embeddedHeading: 'Related posts' }), null);
  }
  console.log('Public render regressions passed: empty and unavailable Home feed, Mongolian.');
  const existingPost = { id: 'existing', title: { mn: 'Хадгалагдсан нийтлэл', en: 'Existing post' }, body: { mn: 'Хадгалсан мэдээлэл хэвээр байна.', en: 'Stored information remains.' }, type: 'event', postedDate: '2026-11-16', images: [] };
  const populated = createLoader({ 'next/link': { default: Link, __esModule: true },
    '@/server/posts': { listPosts: async options => {
      assert.equal(options.type, undefined, 'Home includes every existing post category');
      return { posts: [existingPost], hasMore: false };
    } } });
  assert.equal(await populated('src/server/components/posts-page.tsx').PostsPage({ searchParams: Promise.resolve({}), path: '/help' }), null);
  assert.equal(await populated('src/server/components/posts-page.tsx').PostsPage({ searchParams: Promise.resolve({}), path: '/understand' }), null);
  const populatedHtml = renderToStaticMarkup(await populated('src/server/components/posts-page.tsx').PostsPage({ searchParams: Promise.resolve({ lang: 'mn' }), embedded: true, embeddedHeading: 'Холбогдох нийтлэлүүд' }));
  assert.match(populatedHtml, /Хадгалагдсан нийтлэл/);
  assert.match(populatedHtml, /Холбогдох нийтлэлүүд/);
  assert.match(populatedHtml, /Хадгалсан мэдээлэл хэвээр байна/);
  const { postgresUrl } = await import('../src/server/postgres-url.mjs');
  assert.equal(new URL(postgresUrl('postgresql://example.invalid/db?sslmode=disable')).searchParams.get('sslmode'), 'verify-full');
  assert.equal(new URL(postgresUrl('postgresql://127.0.0.1/db?sslmode=disable')).searchParams.get('sslmode'), 'disable');
  const load = createLoader();
  const Rights = load('src/app/rights/page.tsx').default;
  {
    const html = renderToStaticMarkup(await Rights());
    for (const phrase of ['судалгаанд олдсон', 'Хавсаргасан судалгааны холбоос', 'Энэ удаа дахин', 'Нээхийг оролдсон огноо', 'DOCX', 'research-reported', 'Research-reported', '23 дугаар зүйл, ХЭҮК']) assert.ok(!html.includes(phrase), phrase);
    assert.ok(!html.includes("source-links"));
    const { rightsContacts, rightsSources } = load('src/shared/rights.ts');
    for (const contact of rightsContacts.filter(item => rightsSources[item.source].verification === 'UNVERIFIED')) {
      assert.ok(!html.includes(contact.phone), `Unverified phone ${contact.id}`);
      if (contact.email) assert.ok(!html.includes(contact.email), `Unverified email ${contact.id}`);
    }
    assert.ok(html.includes('2027-01-01') && html.includes('2026-11-01'));
  }
  const { mayPublish } = load('src/shared/rights-publication.ts');
  assert.equal(mayPublish('UNVERIFIED'), false);
  assert.equal(mayPublish('UNVERIFIED', { publishUnverified: true, approvedBy: '', approvedAt: null, reason: '' }), false);
  assert.equal(mayPublish('UNVERIFIED', { publishUnverified: true, approvedBy: 'test-admin', approvedAt: '2026-11-16', reason: 'explicit test approval' }), true);
  console.log('Visitor Rights copy excludes internal verification language in Mongolian.');
  for (const path of ['/admin', '/admin/verification', '/admin/future-private-page']) {
    const privateLoader = createLoader({
      'next/headers': { headers: async () => new Headers({ 'x-page': path, 'x-language': 'mn' }) },
      'next/navigation': { redirect: () => { throw Error('AUTH_REDIRECT'); } },
      '@/server/auth': { currentAdmin: async () => null },
    });
    await assert.rejects(privateLoader('src/app/admin/(protected)/layout.tsx').default({ children: 'PRIVATE' }), /AUTH_REDIRECT/);
  }
  const adminLoader = createLoader({
    'next/headers': { headers: async () => new Headers({ 'x-page': '/admin/verification' }) },
    'next/navigation': { redirect: () => { throw Error('AUTH_REDIRECT'); } },
    '@/server/auth': { currentAdmin: async () => 'test-admin' },
  });
  assert.equal(await adminLoader('src/app/admin/(protected)/layout.tsx').default({ children: 'PRIVATE' }), 'PRIVATE');
  const verificationHtml = renderToStaticMarkup(await adminLoader('src/app/admin/(protected)/verification/page.tsx').default());
  assert.ok(verificationHtml.includes('DOCX') && verificationHtml.includes('publishUnverified'));
  console.log('Admin layout rejects anonymous access; authenticated verification retains internal evidence.');
  const { understandSources, sourceDisplayDate, disabilityTopics } = load('src/shared/understand.ts');
  assert.equal(disabilityTopics.length, 12);
  assert.ok(disabilityTopics.every(topic => topic.tips.length >= 2));
  for (const source of Object.values(understandSources)) assert.equal(sourceDisplayDate(source).kind, 'added');
  assert.equal(sourceDisplayDate({ reviewed_by: '', reviewed_at: '2026-11-16', added_at: '2026-11-16' }).kind, 'added');
  assert.equal(sourceDisplayDate({ reviewed_by: 'Test reviewer', reviewed_at: '2026-11-16', added_at: '2026-11-16' }).kind, 'reviewed');
  console.log('Published posts, remote TLS enforcement and human-only source review dates passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
