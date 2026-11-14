import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  const h = new Headers(request.headers);
  h.set(
    "x-language",
    request.nextUrl.searchParams.get("lang") === "en" ? "en" : "mn",
  );
  h.set("x-page", request.nextUrl.pathname);
  h.set("x-query", request.nextUrl.searchParams.toString());
  return NextResponse.next({ request: { headers: h } });
}
export const config = { matcher: ["/((?!_next|favicon.ico).*)"] };
