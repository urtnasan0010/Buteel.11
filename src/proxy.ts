import { selectLanguage } from '@/shared/language';
import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  // Legacy public URLs lead into the four main pages. Preserve searches and language.
  const oldPath = request.nextUrl.pathname.replace(/\/$/, '') || '/';
  const destinations: Record<string, { path: string; anchor: string; key?: string; value?: string }> = {
    '/services': { path: '/help', anchor: 'organisations' },
    '/guides': { path: '/help', anchor: 'guides' },
    '/contact': { path: '/help', anchor: 'report-problem', key: 'report', value: '1' },
    '/for-organisations': { path: '/help', anchor: 'for-organisations', key: 'topic', value: 'for-organisations' },
    '/about': { path: '/', anchor: 'site-info', key: 'info', value: 'site-info' },
    '/how-it-works': { path: '/', anchor: 'site-info', key: 'info', value: 'site-info' },
    '/privacy': { path: '/', anchor: 'privacy', key: 'info', value: 'privacy' },
    '/disclaimer': { path: '/', anchor: 'disclaimer', key: 'info', value: 'disclaimer' },
    '/accessibility': { path: '/', anchor: 'accessibility', key: 'info', value: 'accessibility' },
    '/reach': { path: '/understand', anchor: 'communication', key: 'topic', value: 'communication' },
    '/understand/rights': { path: '/rights', anchor: 'know' },
    '/rights/know': { path: '/rights', anchor: 'know' },
    '/rights/defend': { path: '/rights', anchor: 'defend' },
  };
  const destination = destinations[oldPath];
  if (destination) {
    const url = request.nextUrl.clone();
    url.pathname = destination.path;
    url.hash = destination.anchor;
    if (destination.key) url.searchParams.set(destination.key, destination.value!);
    return NextResponse.redirect(url, 307);
  }
  const h = new Headers(request.headers);
  h.set(
    "x-language",
    selectLanguage(request.nextUrl.searchParams.get("lang")),
  );
  h.set("x-page", request.nextUrl.pathname);
  h.set("x-query", request.nextUrl.searchParams.toString());
  return NextResponse.next({ request: { headers: h } });
}
export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
