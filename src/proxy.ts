import { selectLanguage } from '@/shared/language';
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-language', selectLanguage(request.nextUrl.searchParams.get('lang')));
  headers.set('x-page', request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
