import { selectLanguage } from '@/shared/language';
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-language', selectLanguage(request.nextUrl.searchParams.get('lang')));
  headers.set('x-page', request.nextUrl.pathname);
  const response = NextResponse.next({ request: { headers } });
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'private, no-store');
  }
  return response;
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
